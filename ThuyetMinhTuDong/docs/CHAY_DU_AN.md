# Chạy web và mock API RAM

Tại thư mục ThuyetMinhTuDong:

```powershell
npm run dev
```

Mở http://127.0.0.1:5173/. Lệnh tự kiểm tra/mở catalog 8788 và presence 8787 trước khi chạy Vite. Lệnh cũ `npm run dev --workspace=web` cũng dùng cùng launcher.

Admin chạy terminal khác:

```powershell
npm run dev:admin
```

Mở http://127.0.0.1:5174/admin. Lệnh workspace `npm run dev:admin --workspace=web` vẫn dùng được.

- Chạy lại lệnh sẽ dùng lại API khỏe và web tương ứng đang chạy; không reset dữ liệu.
- API chạy nền và được giữ khi đóng Vite vì mobile/admin có thể đang dùng chung. Dừng/khởi động lại API vẫn mất thay đổi RAM; đây không phải database.
- Log khởi động API tại `.runtime/dev-services/catalog.log` và `presence.log`.
- Không có LAN vẫn chạy web localhost; URL mobile được giữ nguyên. Muốn điện thoại truy cập cần LAN/API công khai, không dùng localhost của điện thoại.
- Địa chỉ CATALOG_TARGET/PRESENCE_TARGET tùy chỉnh phải đang chạy. Cổng API sai/ứng dụng khác sẽ được báo rõ, launcher không tự tắt tiến trình đó.
- Cổng web bận: chọn `npm run dev -- --port 5175`; không cần tắt ứng dụng khác.
- Kiểm tra API: http://127.0.0.1:8788/published. Khi lỗi dịch vụ, launcher báo lỗi thay vì mở web thiếu dữ liệu.

## File liên quan

| File | Chức năng |
|---|---|
| scripts/start-web.cjs | Kiểm tra API, mở service RAM thiếu và chạy đúng bản Vite |
| scripts/start-catalog.cjs | Catalog chạy được không LAN; cập nhật URL mobile khi có LAN |
| scripts/startup.test.cjs | Kiểm tra thiếu LAN, tái sử dụng API và cổng sai |
| package.json | Lệnh dev/dev:admin chung và kiểm thử launcher |
| apps/web/package.json | Lệnh workspace dùng cùng launcher |
