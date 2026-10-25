# Đồng bộ Admin web/mobile bằng mock API RAM

Đã triển khai một kho nội dung chung trong RAM máy tính, không dùng database. Đây là mock API phục vụ đồ án FE; giao diện tiếp tục gọi AdminService. Không còn nút đặt lại dữ liệu ở hai dashboard và API không có lệnh reset.

## Kiến trúc

```text
Admin web (5174) ─ proxy /api/catalog ─┐
Admin mobile ─ LAN máy tính:8788 ─────┤
                                    ▼
                         Catalog RAM (8788)
                         Một AdminService
                         Nháp / duyệt / công bố
                                    │
Du khách web/native ◄── /published ──┘

Thống kê đang hoạt động: RAM presence (8787)
Admin mobile đọc cùng số qua 8788/presence/statistics/active.
Lượt mở QR cổng: bộ đếm riêng trong Catalog RAM (8788).
```

- Hai giao diện kiểm tra /version mỗi 3 giây. Phiên bản không đổi thì không tải lại document lớn.
- Một lệnh ghi đi qua hàng đợi service chung. expectedRevision cũ bị trả HTTP409/conflict.
- Form đang nhập giữ snapshot; thông báo cập nhật không tự xóa chữ. Khi xung đột, ghi lại phần cần giữ rồi mở lại bản mới trước khi sửa tiếp.
- Chỉ bản công bố đi sang du khách; lưu nháp và duyệt chưa tự đổi public.
- Mất API báo lỗi, không âm thầm chuyển sang kho cục bộ riêng.
- Kho cũ localStorage/AsyncStorage vẫn còn trên thiết bị, nhưng không tự nhập/trộn vào RAM để tránh ghi đè bản khác. Kho chung ban đầu dùng tám di tích mẫu.

## Lượt QR được tính thế nào?

QR do nhân viên cung cấp chứa `https://TEN-MIEN/?entry=gate`.

1. Camera nhận diện mã nhưng chưa mở trang: không ghi nhận được.
2. Khi website hoặc app cài riêng nhận và xử lý liên kết: gửi gate entry với ID phiên ẩn danh.
3. Cùng ID trong cùng ngày Huế: tính một, kể cả refresh/React StrictMode/retry.
4. Phiên/tab mới, trình duyệt khác hoặc lần chạy app mới có thể được tính thêm. Không dùng chỉ số này làm số người hay vé.
5. Đổi ngày theo Asia/Ho_Chi_Minh: bộ đếm ngày mới bắt đầu từ 0. Restart server cũng mất lượt vì RAM.
6. Mở trang / bình thường, mở app từ icon/Expo hoặc mở Admin không tăng QR.
7. Các link QR cũ không có entry=gate vẫn mở trang chủ, nhưng không được tính vào lượt mới. Phải cấp ảnh QR vừa tạo lại.

Đã tạo lại `.qr-output/shared-qr.png` và `.qr-output/index.html`. Trong quá trình kiểm tra có lượt mở thử, nên con số đang thấy có thể đã bao gồm lượt kiểm thử.

## Chạy thử hiện tại

Server RAM đã được khởi động trong lượt làm việc này. Web Admin: http://127.0.0.1:5174/admin.

Cấu hình điện thoại hiện tại:

- Admin API: `http://192.168.2.28:8788`
- Admin presence: `http://192.168.2.28:8788/presence`
- Catalog du khách: URL HTTPS tunnel hiện tại với đường dẫn `/api/catalog`.

Điện thoại Admin cần cùng Wi-Fi với máy tính. IP đổi khi chuyển mạng thì chạy lại catalog:start và restart Expo. Nếu Wi-Fi có cách ly thiết bị hoặc Windows Firewall chặn, điện thoại sẽ không kết nối được; trước tiên thử mở http://192.168.2.28:8788/version trên điện thoại. Không dùng localhost điện thoại để gọi máy tính.

Khởi động lại Expo để nạp URL mới:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run start:admin --workspace=mobile -- --clear
```

Khi bắt đầu phiên demo mới, mỗi lệnh sau chạy trong terminal riêng tại gốc dự án:

```powershell
npm run catalog:start
npm run presence:start
npm run dev:admin --workspace=web
npm run start:admin --workspace=mobile -- --clear
```

Nếu các server đã chạy thì không mở thêm bản thứ hai; tải lại web/restart Expo là đủ. Lỗi EADDRINUSE thường là server đã tồn tại. Để mở du khách: `npm run dev --workspace=web -- --port 5173 --strictPort`. Để cấp QR công khai mới: `npm run demo:public` (tự build web, kiểm tra API và HTTPS trước khi ghi ảnh).

## Giới hạn và mở rộng

- Tắt/khởi động lại tiến trình Catalog làm mất thay đổi và lượt QR; khởi động lại presence làm mất thống kê active.
- Chưa có xác thực Admin, theo phạm vi FE đã chọn. API quản lý dùng mạng demo nội bộ; CORS không phải đăng nhập. Proxy/tunnel du khách không chuyển tiếp /document, /commands, /identity hoặc thống kê quản lý. Không công khai cổng API Admin khi chưa có bảo vệ phía server.
- Chưa có đồng bộ ngoại tuyến hoặc gộp dữ liệu cũ. Chưa kiểm tra thao tác trên điện thoại thật; đã kiểm tra HTTP LAN từ máy tính và đóng gói Android.
- Mỗi request tối đa 8 MB; kho nội dung tối đa 32 MB. Ảnh/audio cục bộ vẫn theo giới hạn 1 MB/tệp của UI. Đây là dữ liệu demo; dịch/TTS mock giữ giới hạn cũ.
- Khi có BE/database: giữ AdminService và UI; triển khai cùng API, giao dịch/revision và xác thực ở máy chủ. Thay StoragePort bằng repository database, không lưu nháp bằng lệnh ghi cả kho từ client.

## Kiểm tra đã thực hiện

TypeScript và lint cả hai app: đạt. Bộ test hiện có: đạt. Sáu test mới HTTP/QR: đạt. Build Admin web/du khách: đạt. Export Admin Android: đạt.

Trình duyệt: mở /?entry=gate, Admin tăng lượt; refresh không tăng. API qua localhost Admin, localhost du khách và URL HTTPS trả cùng version. API LAN thống kê đọc được cùng kho presence. Không nhập dữ liệu cá nhân hoặc sửa nội dung di tích thật khi kiểm thử.

## Checklist để bạn thử hai thiết bị

1. Web Admin sửa tên hoặc thời kỳ một di tích và lưu; mobile thấy bản mới sau khoảng 3 giây.
2. Hai máy cùng mở form rồi lần lượt lưu: máy lưu sau báo xung đột; chữ đang nhập không biến mất.
3. Lưu nháp: trang khách vẫn thấy bản công bố cũ. Duyệt và công bố: cả hai bản khách cập nhật.
4. Ngắt API: UI báo lỗi/thử lại; không xuất hiện bản khác từ localStorage.
5. Quét QR mới bằng camera và mở link: QR tăng; refresh vẫn giữ. Mở trang chủ thường không tăng.
6. Dashboard cả hai không còn nút đặt lại dữ liệu.

## Thư mục/file

| Thư mục | Vai trò |
| --- | --- |
| services/catalog | Mock server RAM và kiểm thử HTTP. |
| packages/admin-core/src | Hợp đồng, HTTP adapter, hooks và nghiệp vụ dùng chung. |
| apps/web/src/services, apps/mobile/src/services | Cấu hình adapter cho nền tảng. |
| apps/*/src/hooks | Nhận liên kết cổng và gửi lượt, không tự tạo UI QR. |
| apps/web/src/pages/admin, apps/mobile/src/screens/admin | Hiển thị chung dữ liệu; giữ form chưa lưu. |
| scripts | Chạy kho RAM và cấp QR cho nhân viên. |

| File | Vai trò |
| --- | --- |
| `services/catalog/server.cjs` | API nội dung chung trong RAM, kiểm tra lệnh và revision; danh mục công bố; bộ đếm QR theo ngày Huế. |
| `services/catalog/catalog.test.cjs` | Kiểm thử hai client HTTP, xung đột, không lộ nháp, restart RAM, QR lặp và parser. |
| `packages/admin-core/src/httpService.ts` | Adapter HTTP và polling phiên bản 3 giây; client thống kê QR và retry chống đếm lặp. |
| `packages/admin-core/src/react.tsx` | Hooks Admin và hook tải thống kê QR 5 giây; bỏ phản hồi tải cũ bằng sequence. |
| `packages/admin-core/src/index.ts` | Xuất adapter/hợp đồng dùng chung cho hai nền tảng. |
| `packages/admin-core/src/messages.ts` | Thông báo kho chung, lỗi và giải thích chỉ số QR đủ năm ngôn ngữ. |
| `packages/admin-core/src/mockService.ts` | Nghiệp vụ dùng StoragePort; server dùng lại một instance, không sao chép workflow. |
| `apps/web/src/services/admin/services.ts` | Gắn API vào Admin, danh mục công bố và bộ đếm QR của web. |
| `apps/mobile/src/services/admin/services.ts` | Gắn API LAN riêng cho Admin và API HTTPS cho du khách native. |
| `apps/web/vite.config.ts` | Proxy Admin đầy đủ; proxy du khách chỉ đọc published/version và gửi gate entry. |
| `apps/web/src/pages/admin/DashboardPage.tsx` | Bỏ reset, dùng lượt QR từ kho chung, có lỗi/thử lại. |
| `apps/mobile/src/screens/admin/DashboardScreen.tsx` | Dashboard mobile dùng cùng bộ đếm QR; bỏ reset. |
| `apps/web/src/pages/admin/ContentEditorPage.tsx` | Giữ bản đang gõ khi có cập nhật từ máy khác. |
| `apps/mobile/src/screens/admin/ContentEditorScreen.tsx` | Giữ nội dung chưa lưu trên mobile; revision cũ sẽ báo conflict. |
| `apps/web/src/pages/admin/PlaceFormPage.tsx` | Giữ metadata và expectedRevision cùng bản khi mở form. |
| `apps/mobile/src/screens/admin/PlaceFormScreen.tsx` | Giữ metadata và revision trên mobile để tránh ghi đè từ xa. |
| `apps/web/src/hooks/useGateEntry.ts` | Nhận nguồn QR cổng; giữ ID trong phiên trình duyệt. |
| `apps/mobile/src/hooks/useGateEntry.ts` | Nhận link HTTPS khi mở app hoặc app đang chạy, gửi cùng ID phiên app. |
| `apps/web/src/hooks/usePresenceHeartbeat.ts` | Gọi hook QR chỉ trong bản du khách; giữ heartbeat đang có. |
| `apps/mobile/src/hooks/usePresenceHeartbeat.ts` | Gọi hook QR trong luồng du khách được bật; giữ heartbeat native. |
| `packages/visitor-core/src/qr.ts` | Cho đúng query entry=gate tại trang chủ; query lạ vẫn bị từ chối. |
| `scripts/start-catalog.cjs` | Chạy RAM qua LAN và cập nhật URL API mobile theo IP máy tính. |
| `scripts/create-public-qr.cjs` | Tạo QR có dấu nguồn cổng và cấu hình catalog native qua tunnel. |
| `scripts/start-public-demo.cjs` | Khởi động API nếu thiếu; kiểm tra API công khai trước khi cấp QR. |
| `apps/mobile/.env.catalog.example` | Mẫu URL LAN cho Admin và catalog; không chứa khóa bí mật. |
| `package.json` | Lệnh catalog:start/catalog:test và ghép test vào bộ kiểm tra chung. |
| `.gitignore` | Không đưa bundle Node .runtime vào Git. |

Commit gợi ý: `feat(shared): sync admin catalog and gate entries through RAM API`.
