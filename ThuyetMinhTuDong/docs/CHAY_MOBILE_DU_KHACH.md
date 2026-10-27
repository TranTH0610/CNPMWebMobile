# FE mobile du khách: khởi động ổn định khi demo cùng Wi-Fi

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run start --workspace=mobile -- --lan --port 8081
```

Máy tính và điện thoại cùng Wi-Fi; mở Expo Go và quét QR cổng 8081. Cổng 8082 thuộc admin. Đổi Wi-Fi thì dừng Expo, chạy lại lệnh và quét QR mới; không sửa IP trong .env.

Lệnh mới tự kiểm tra/mở mock catalog/presence, chọn IP vật lý và đưa URL proxy Metro vào bundle. URL Cloudflare tạm trong .env không còn là nguồn dữ liệu của bản Expo visitor. QR HTTPS trong .qr-output vẫn dùng cho web, không bị ghi đè bởi launcher này.

| File | Chức năng |
|---|---|
| scripts/start-mobile-visitor.cjs | Một lệnh mở Expo cùng các mock API cần thiết, cấu hình riêng cho tiến trình visitor |
| scripts/metro-api-proxy.cjs | Chuyển tiếp HTTP/JSON/audio, dùng chung cơ chế giữa hai bản FE |
| scripts/metro-visitor-proxy.cjs | Chỉ cho đọc bản công bố, gửi heartbeat/entry; chặn nháp/commands/thống kê quản lý |
| scripts/metro-admin-proxy.cjs | Giữ whitelist riêng cho bản quản lý |
| apps/mobile/metro.config.js | Ghép đúng proxy theo APP_TARGET, giữ route manifest/bundle của Expo |
| apps/mobile/package.json | start/android/ios dùng launcher visitor mới |
| packages/visitor-core/src/journey/journey.ts | Gỡ loadError sau khi catalog phục hồi; giữ lỗi audio thật và không tự phát |
| scripts/mobile-visitor-startup.test.cjs | Hồi quy cấu hình visitor và không lộ API quản lý |
| packages/visitor-core/tests/journey.test.cjs | Hồi quy lỗi tải cũ và bảo toàn lỗi audio |

Kiểm tra: typecheck/lint toàn dự án, bộ test chung, manifest/bundle iOS, URL LAN đọc tám điểm/audio, route quản lý bị từ chối. Chưa thay thế thử thao tác trên điện thoại thật.

Đây là dev proxy của FE và mock API RAM sẵn có, không thêm BE nghiệp vụ/database. Không có gói offline hoặc dữ liệu giả dự phòng khi mất API. Máy tính, Metro và mock API phải chạy; cùng Wi-Fi không bảo đảm kết nối nếu mạng có cách ly thiết bị.

Lỗi web/player còn đỏ dù API đã phục hồi cũng được sửa ở controller chung. Tải lại trang đang mở một lần để nhận code mới; các lần phục hồi sau sẽ tự gỡ lỗi tải cũ.
