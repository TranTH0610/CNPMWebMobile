# Sửa ảnh mobile, đóng trình nghe và truy cập quản lý

## Kết quả

Ảnh native bị cắt vì RN Image tự thêm kích thước gốc của asset trước props.style.
StyleSheet.absoluteFill chỉ đặt position/top/right/bottom/left, không xóa width/height gốc.
Cover nay đặt width và height 100% theo khung thumbnail/hero/player để resizeMode cover có tác dụng đúng.
Nếu resolve không tìm thấy photo:ID hoặc ảnh tải lỗi, hiển thị placeholder. Lỗi lưu theo URI, tránh ảnh cũ báo lỗi làm hỏng ảnh mới.
Thẻ giữ khung ảnh cố định không co, giới hạn địa chỉ hai dòng để danh sách dễ đọc.

Nút × có nhãn Dừng và đóng trình nghe đủ 5 ngôn ngữ trên web và native.
Thao tác gọi chung JourneyController.close(): tăng generation hủy hiệu lực tải cũ, bỏ intent, gỡ listener, pause và dispose Track, xóa session/restore/error và checkpoint lưu.
Không đổi danh mục/tuyến/GPS. Lỗi GPS không tự mở lại trình nghe. Callback lỗi lưu của bài cũ không mở lại thanh nghe đã đóng.
Nhấn × khác tạm dừng: đóng sẽ bỏ đề nghị tiếp tục bài đó khi mở lại nếu thao tác xóa checkpoint thành công.

## Mở mobile du khách

Chạy từ thư mục monorepo, terminal riêng:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run start --workspace=mobile -- --clear
```

Mở dự án này trong Expo Go để kiểm tra bản cập nhật ảnh và nút ×. Điện thoại và máy tính cùng Wi-Fi.
Bản native đã cài riêng cần build/cập nhật ứng dụng; QR website không tự cập nhật binary native đã cài.

## Mở mobile quản lý

Dùng terminal khác:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run start:admin --workspace=mobile -- --clear
```

Script dùng Expo CLI trên cổng 8082 và EXPO_PUBLIC_APP_TARGET=admin cho riêng process, không sửa .env chung.
Mở QR dev của cửa sổ này trong Expo Go để vào thẳng bản quản lý. QR website du khách vẫn chỉ có một QR, không đổi thành QR quản lý.
Bản du khách không có nút hoặc route Admin. Khi triển khai native riêng, tạo bản build quản lý riêng với cấu hình target admin.
Tách root FE không phải xác thực API; quyền thật phải được hosting/BE kiểm tra khi triển khai.
Web quản lý: npm run dev:admin --workspace=web → http://127.0.0.1:5174/admin trên máy tính.

## Bảng file vừa sửa

| File | Vai trò |
|---|---|
| apps/mobile/src/components/Cover.tsx | Co ảnh asset đúng khung, placeholder cho nguồn thiếu/lỗi |
| apps/mobile/src/components/PlaceCard.tsx | Giữ kích thước thumbnail, giới hạn chữ địa chỉ |
| packages/visitor-core/src/journey.ts | close() chung, hủy nguồn chậm và giải phóng audio |
| apps/mobile/src/components/JourneyPlayer.tsx | Nút × 44px và bố cục native không đè chữ |
| apps/web/src/components/JourneyPlayer.tsx | Nút × gọi cùng controller |
| apps/web/src/styles/player.css | Nút đóng và khoảng trống trên thẻ responsive |
| packages/visitor-core/src/uiMessages.ts | Nhãn đóng trình nghe cho vi/en/cn/pt/ja |
| packages/visitor-core/tests/journey.test.cjs | Test đóng khi phát/tải chậm/lỗi lưu đến muộn |

File truy cập quản lý đã có: scripts/start-mobile-admin.cjs, apps/mobile/src/navigation/AdminApp.tsx và apps/mobile/App.tsx.

## Kiểm tra

TypeScript, lint toàn workspace, bộ test hiện tại và ba test mới: đạt.
Build visitor/admin web và Expo export Android: đạt.
Trình duyệt: mở thuyết minh, thấy nút × và nhấn đóng thì toàn bộ player biến mất; có ảnh kiểm chứng.
Chưa kiểm tra trực tiếp trên iPhone/Android thật sau sửa; cần reload Expo --clear và đối chiếu ảnh trên thiết bị.

Checklist: xem ảnh Kỳ Đài/Ngọ Môn/Thế Miếu ở danh sách, hero và player; không chỉ hiện góc trời/tường; bấm × lúc phát/tạm dừng/loading; không còn âm thanh; đổi ngôn ngữ không mở lại bài vừa đóng; bấm nghe lại từ chi tiết vẫn hoạt động.

Commit gợi ý: fix(player): size native artwork correctly and close narration on web and mobile
