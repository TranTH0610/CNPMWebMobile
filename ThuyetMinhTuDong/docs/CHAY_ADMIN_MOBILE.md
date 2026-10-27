# Chạy và kiểm tra FE Admin mobile

## Một lệnh khởi động

Tại `D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong`:

```powershell
npm run start:admin --workspace=mobile -- --lan
```

Điện thoại và máy tính kết nối cùng Wi-Fi. Mở Expo Go SDK tương thích và quét QR của terminal **admin**, mặc định cổng 8082. QR `.qr-output/shared-qr.png` vẫn dành cho web du khách.

Launcher kiểm tra/mở mock RAM hiện có, ưu tiên IP Wi-Fi/Ethernet thật, bỏ adapter WARP/VPN, xóa cache URL cũ và truyền cấu hình riêng cho tiến trình admin. Không cần sửa IP API trong `.env` mỗi lần đổi Wi-Fi: chạy lại lệnh và dùng QR mới.

## Nguyên nhân lỗi đã sửa

Trước đây `.env` admin trỏ `http://172.16.0.2:8788` của mạng ảo, trong khi điện thoại dùng Wi-Fi `192.168.2.28`. Catalog chỉ lắng nghe localhost. Vì thế tất cả màn admin phụ thuộc cùng API đều báo lỗi.

Luồng mới:

```text
Admin native → http://IP_WIFI:8082/__admin-api → dev proxy Metro → catalog RAM localhost:8788
                                                                           → presence localhost:8787
```

Proxy dùng ngay dev server của FE, tương tự `server.proxy` của Vite. Không thêm server nghiệp vụ, database, tài khoản hoặc kho dữ liệu riêng. Admin web/mobile vẫn đọc cùng instance RAM; bản Metro du khách không bật proxy quản lý. Đây không phải cơ chế xác thực production.

## File và thư mục

| Vị trí | Chức năng |
|---|---|
| scripts/start-mobile-admin.cjs | Kiểm tra mock API, lấy IP, truyền URL admin vào Expo, làm mới bundle cache |
| scripts/metro-admin-proxy.cjs | Dev proxy GET/POST/audio Range, whitelist route admin; báo 503 nếu nguồn lỗi |
| scripts/start-catalog.cjs | Chọn Wi-Fi/Ethernet thay adapter VPN; vẫn chạy localhost khi không có LAN |
| scripts/start-web.cjs | Cung cấp bước kiểm tra mock API chung cho web và launcher admin |
| apps/mobile/metro.config.js | Chỉ cài middleware proxy khi APP_TARGET=admin |
| apps/mobile/src/services/admin/services.ts | Admin catalog và nội dung nghe thử dùng cùng API admin, không lệ thuộc tunnel du khách |
| apps/mobile/src/services/presence.ts | Thống kê admin dùng đường dẫn riêng, không gọi nhầm API công khai du khách |
| apps/mobile/src/components/admin/AdminUI.tsx | Khung cuộn dưới header, vùng tránh bàn phím theo chiều cao header thực |
| apps/mobile/src/screens/admin/PlacesScreen.tsx | FlatList có inset và chiều cao giới hạn |
| apps/mobile/src/screens/admin/ReviewsScreen.tsx | Danh sách duyệt có inset và chiều cao giới hạn |
| apps/mobile/src/navigation/AdminNavigator.tsx | Header không trong suốt |
| packages/admin-core/src/i18n/messages.ts | Bỏ hướng dẫn reset dữ liệu đã loại khỏi giao diện, cập nhật đủ năm ngôn ngữ |
| scripts/mobile-admin-startup.test.cjs | Kiểm tra chọn Wi-Fi, config, proxy, truyền JSON/Range, lỗi API và tách visitor |
| package.json | Thêm test admin vào bộ test chung |

## Kiểm tra và giới hạn

- `npm run typecheck`, `npm run lint`, `npm test` đều đạt sau sửa (110 test).
- Qua URL LAN của Metro: danh tính quản lý, tám di tích, QR hôm nay, thống kê phiên và audio preview Range đã trả thành công; xác nhận cùng instance RAM với web.
- Manifest/bundle iOS trả HTTP 200, chứa URL admin mới và không còn IP admin 172.16.0.2:8788.
- Cần kiểm tra thao tác thật trên điện thoại: Dashboard → Di tích → Sửa → Nội dung → Nghe thử → Kiểm duyệt. Chỉ lưu/công bố dữ liệu bạn chủ động muốn đổi.
- Không cam kết hoạt động khi điện thoại khác mạng, chưa cấp quyền mạng nội bộ, cổng Expo bị firewall chặn hoặc máy tính/server đã tắt. Những điều kiện này không thể khắc phục chỉ bằng bố cục FE.
- RAM không bị reset trong lần sửa; restart mock API vẫn mất thay đổi RAM như thiết kế đã chốt.
- Các file cũ đã sao lưu trong `reviews/mobile-admin-fix-20261027/before` của workspace tài liệu. Chưa commit/push GitHub.
