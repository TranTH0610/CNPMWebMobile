# Chạy QR chung

Từ thư mục ThuyetMinhTuDong chạy:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run demo:public
```

Script scripts/start-public-demo.cjs kiểm tra server hiện có, khởi động Vite nếu cần, tạo đường hầm HTTPS chạy nền, đồng bộ URL của mobile/web và tạo .qr-output/shared-qr.png. Chỉ báo sẵn sàng sau khi URL công khai và cấu hình URL đã được kiểm tra. Chạy lại sẽ dùng phiên còn hoạt động. Binary cloudflared đặt tại .tools/cloudflared.exe hoặc biến CLOUDFLARED_PATH. Không commit .tools hay .qr-output.

Mở http://localhost:5173/qr và nhấn Ctrl+F5 để bỏ trang QR cũ. Camera điện thoại quét QR mới để mở website, không cần Expo Go. QR không nằm trong từng địa điểm; GPS làm sau.

Máy tính phải bật và có Internet. URL tạm sẽ thay đổi khi đường hầm dừng; chạy lại lệnh và dùng ảnh QR mới. Muốn mã in cố định cần deploy lên hosting ổn định. Chưa xác nhận quét trên điện thoại thật hoặc tự mở native app đã cài.

Các file thay đổi: scripts/start-public-demo.cjs, package.json (script demo:public), .gitignore (.tools/), tài liệu này. Các file cá nhân .env và .env.local chỉ cập nhật biến URL; bản sao ở .qr-output.
