# Thống kê phiên bằng RAM — hướng dẫn chạy và bảo vệ đồ án

Luồng: web/mobile foreground → POST heartbeat mỗi 30 giây → server RAM chung → GET thống kê mỗi 5 giây → admin.
Server tự loại phiên sau 90 giây, dọn RAM định kỳ 15 giây, tối đa 10.000 phiên đang lưu. Không có database hoặc ghi phiên ra tệp.
Không cần cài thêm package. Server dùng Node HTTP thuần; frontend TypeScript strict, client không phụ thuộc nền tảng.

## Chạy trên máy tính (ba terminal riêng từ thư mục monorepo)

```powershell
npm run presence:start
```

```powershell
npm run dev --workspace=web -- --port 5173 --strictPort
```

```powershell
npm run dev:admin --workspace=web
```

Mở du khách http://127.0.0.1:5173/ và admin http://127.0.0.1:5174/admin.
Mở thêm một thiết bị dùng website sẽ thêm phiên Web. Duyệt web trên điện thoại vẫn là Web; chỉ native mới là mobile-app.
Server dùng cổng 8787; Vite chuyển /api/presence sang server. Chỉ web quản lý có proxy đọc statistics, visitor chỉ có proxy gửi heartbeat/end.
Không đếm admin web vì entry admin không gọi hook heartbeat. Native quản lý chạy root riêng và không gửi heartbeat du khách; không còn route Admin trong bản du khách.
Chỉ tab/app ở foreground gửi nhịp. Mở admin làm tab visitor bị ẩn thì sau 90 giây visitor không còn active, đây là định nghĩa đang hoạt động của bản này.

## Điện thoại thật / native

1. Dừng server RAM bằng Ctrl+C, chạy lại để lắng nghe mạng LAN:

```powershell
$env:PRESENCE_HOST = '0.0.0.0'
npm run presence:start
```

2. Chạy ipconfig lấy IPv4 Wi-Fi máy tính. Thêm vào apps/mobile/.env (không ghi đè các biến đã có):

```dotenv
EXPO_PUBLIC_PRESENCE_API_URL=http://IP_MAY_TINH:8787
```

3. Hai thiết bị cùng Wi-Fi. Nếu Windows hỏi firewall, chỉ cho phép Node trên mạng riêng cần demo.
4. Restart Expo để nạp biến:

```powershell
npm run start --workspace=mobile -- --clear
```

Không dùng localhost/127.0.0.1 cho điện thoại thật vì đó là điện thoại, không phải máy tính chạy server.
Nếu bản app chặn HTTP cleartext hoặc thiết bị ở mạng khác, dùng endpoint HTTPS đã triển khai/tunnel được bảo vệ thích hợp.
Web điện thoại mở http://IP_MAY_TINH:5173/ sẽ gửi cùng-origin qua proxy; không cần công khai thêm cổng 8787 cho riêng web.
Không cần QR mới: QR website cũ vẫn mở trang, trang tự gửi heartbeat qua proxy khi dev server và RAM server còn chạy.

## Cách hoạt động và giới hạn

- Mã phiên ngẫu nhiên, không chứa tên, IP hay vị trí. Đây không phải mã xác thực.
- Heartbeat lặp cùng mã chỉ cập nhật lastSeen bằng giờ server, không tăng đếm.
- Web giữ mã trong sessionStorage khi reload; tab nhân bản có thể dùng chung mã. Native giữ mã cho một lần chạy app.
- Rời trang/app không phụ thuộc vào unload hoặc end: TTL bảo đảm tự hết hạn nếu tắt đột ngột.
- startPresenceHeartbeat chỉ lên lịch sau khi request trước kết thúc; mỗi request timeout 5 giây.
- React cleanup gỡ listener/timer và bỏ kết quả poll cũ. Request cuối có thể hoàn thành nhưng không tạo vòng lặp mới.
- Mất mạng không chặn trang du khách. Admin hiển thị — và thông báo, không giả số 0 hoặc dùng số mô phỏng.
- Restart server mất toàn bộ phiên RAM. Nhiều process server không chia sẻ RAM, bản demo chỉ chạy một process chung.
- Chỉ active đã chuyển sang thống kê server. Di tích/chờ duyệt vẫn lấy service nội dung cũ. Lượt QR hôm nay chưa tích hợp sự kiện quét thật, vẫn là dữ liệu cục bộ trước đây; heartbeat không được coi là một lượt quét.
- Đây là số phiên hoạt động, không khẳng định số người hoặc số vé. Chưa chống giả mạo heartbeat từ người chủ động gửi request.
- Khi công khai admin/statistics cần bảo vệ bằng hosting/proxy hoặc BE; CORS không phải xác thực. Mặc định server chỉ nghe 127.0.0.1.
- Production static build không tự có server: cần triển khai Node service và reverse proxy hoặc VITE_PRESENCE_API_URL/EXPO_PUBLIC_PRESENCE_API_URL. Không để trang HTTPS gọi API HTTP.
- Dữ liệu nội dung vẫn chưa đồng bộ giữa hai origin; bước này chỉ đồng bộ số phiên sử dụng.

## Mở rộng database sau này

server.cjs nhận store qua createPresenceServer({ store }). Hợp đồng ở repository.d.ts gồm heartbeat, end, prune, snapshot; hỗ trợ Promise.
Hiện truyền createMemoryStore(). Sau này truyền adapter database; giữ nguyên URL API và JSON cho frontend.
Gợi ý bảng sessions: session_id (khóa duy nhất), platform, last_seen. Heartbeat dùng upsert, snapshot chỉ đếm last_seen còn trong 90 giây; dọn bản ghi cũ định kỳ.
Nếu chạy nhiều server thì tất cả phải dùng cùng database hoặc kho chia sẻ. Không lưu mật khẩu truy cập database trong biến EXPO_PUBLIC/VITE.

## Kiểm tra

```powershell
npm run presence:test
npm run typecheck
npm run lint
npm test
npm run build --workspace=web
npm run build:admin --workspace=web
```

Đã đạt 7 test riêng RAM/client/HTTP, kiểm tra TypeScript/lint toàn workspace và hai bản build.
Đã kiểm tra HTTP thực: gửi heartbeat qua cổng 5173, đọc cùng phiên qua cổng 5174 và xóa phiên QA.
Chưa kiểm tra trên điện thoại vật lý; cần cấu hình IP và chạy checklist native bên dưới.

Checklist thủ công: mở visitor → active tăng; reload không tăng thêm; hai thiết bị khác nhau cộng phiên; chỉ mở admin không tăng; ẩn visitor 90 giây → hết hạn; server tắt → hiện lỗi; bật lại → tự phục hồi; restart → mất số liệu cũ; native nền → dừng nhịp.
Lỗi EADDRINUSE: server cổng 8787 đã chạy, dùng cửa sổ cũ hoặc đổi PRESENCE_PORT và PRESENCE_TARGET cho cả hai Vite server; không tắt process lạ tùy tiện.
Lỗi Network request failed native: kiểm tra IP, Wi-Fi, PRESENCE_HOST, firewall và restart Expo --clear.

## Bảng thư mục và file

| Folder/file | Vai trò |
|---|---|
| services/presence/ | Server thống kê độc lập; không nằm trong UI |
| memory-store.cjs | Map lưu RAM, TTL và giới hạn số phiên |
| server.cjs | API HTTP, kiểm tra JSON, CORS, dọn định kỳ |
| repository.d.ts | Hợp đồng thay adapter RAM bằng database |
| presence.test.cjs | Test store/API/client không Internet |
| packages/visitor-core/src/presence.ts | Hợp đồng client và vòng lặp heartbeat dùng chung |
| packages/visitor-core/src/presence-react.ts | Poll thống kê chung, cleanup/lỗi/thử lại |
| apps/web/src/services/presence.ts | Chọn URL API web |
| apps/web/src/hooks/usePresenceHeartbeat.ts | Vòng đời visible/hidden và mã phiên web |
| apps/mobile/src/services/presence.ts | Chọn URL API native |
| apps/mobile/src/hooks/usePresenceHeartbeat.ts | AppState và bật/tắt khi vào admin |
| apps/web/src/App.tsx | Gắn heartbeat riêng bản du khách |
| apps/mobile/src/navigation/RootNavigator.tsx | Gắn heartbeat, dừng khi vào quản lý |
| DashboardPage.tsx / DashboardScreen.tsx | Hiển thị active từ server, bỏ nút tăng số giả |
| packages/admin-core/src/messages.ts | Nhãn RAM/lỗi đủ 5 ngôn ngữ |
| apps/web/vite.config.ts | Proxy vào RAM server chung |
| package.json / visitor-core/package.json | Lệnh server/test và export client/hook |
| .env.presence.example (mỗi app) | Ví dụ cấu hình, không tự ghi đè .env cá nhân |

Commit gợi ý: feat(analytics): track active visitor sessions with RAM presence server
