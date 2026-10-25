# Web quản lý và du khách chạy riêng

## Cách chạy từ thư mục gốc monorepo

Du khách: `npm run dev --workspace=web -- --port 5173 --strictPort`.
Mở http://127.0.0.1:5173/. URL /admin và /admin/places trả HTTP 404 trên dev/preview du khách.

Quản lý: `npm run dev:admin --workspace=web`.
Mở http://127.0.0.1:5174/admin. Mặc định chỉ nghe localhost; không đưa cổng này vào QR hoặc tunnel du khách.
Nếu server 5173 đang chạy, cấu hình Vite sẽ tự khởi động lại khi lưu; nếu chưa cập nhật hãy dừng bằng Ctrl+C rồi chạy lại.

## File và vai trò

| File | Vai trò |
|---|---|
| apps/web/src/main.tsx | Entry du khách, không AdminProvider |
| apps/web/src/navigation/AppRoutes.tsx | Chỉ route du khách, không import AdminRoutes |
| apps/web/src/components/Navbar.tsx | Không có liên kết quản lý |
| apps/web/src/main-admin.tsx | Entry quản lý với provider riêng |
| apps/web/src/AdminApp.tsx | Chỉ điều hướng vào các trang quản lý |
| apps/web/src/layouts/AdminLayout.tsx | Khung quản lý không liên kết sang du khách |
| apps/web/vite.config.ts | Chọn entry trước khi Vite phân tích HTML; chặn admin trên dev/preview visitor |
| apps/web/package.json | Lệnh dev:admin, build:admin, preview:admin |
| apps/web/vercel.json | Cấu hình visitor không rewrite route admin |
| apps/web/vercel.admin.json | Mẫu cấu hình deployment admin, project root là monorepo |

## Build và triển khai

`npm run build --workspace=web` sinh apps/web/dist, chỉ có UI du khách.
`npm run build:admin --workspace=web` sinh apps/web/dist-admin, chỉ có UI quản lý.
Hai thư mục phải triển khai thành hai website/domain riêng. Không phục vụ dist-admin trong domain du khách.
File vercel.admin.json là mẫu cho project admin riêng, không tự thay thế cấu hình deployment đang dùng.

## Giới hạn cần hiểu

Tách entry, route và bản build không phải xác thực tài khoản. Không dùng mật khẩu hoặc biến môi trường FE làm bảo mật.
Hiện bản quản lý chỉ dùng nội bộ localhost. Nếu công khai domain quản lý, cần lớp kiểm soát truy cập của hosting/proxy (ví dụ SSO), và BE kiểm tra quyền trên mỗi API khi tích hợp.
Không cần thêm màn đăng nhập vào FE nếu hosting đã thực hiện xác thực trước khi trả website.

localStorage tách theo origin (gồm cả cổng): dữ liệu cũ tại 127.0.0.1:5173 được giữ nguyên, không tự xuất hiện tại 5174.
Hai site không tự đồng bộ dữ liệu bằng localStorage; không chuyển dữ liệu quản lý nhạy cảm qua URL để khắc phục.
Giai đoạn BE: admin gọi API ghi có kiểm tra quyền; visitor chỉ gọi API đọc dữ liệu đã công bố. Cả hai dùng cùng hợp đồng service.
Mobile hiện chưa thay đổi trong bước tách web này.

## Kiểm tra

- Trang 5173 không có menu quản lý; nhập trực tiếp /admin, /admin/places phải bị chặn.
- Trang 5174/ và /admin mở quản lý; không mở trang du khách trong bản admin.
- Build visitor không phát hành giao diện Admin; build admin có trang dashboard/di tích/kiểm duyệt.
- Chạy typecheck, lint, build và build:admin trước khi triển khai.
