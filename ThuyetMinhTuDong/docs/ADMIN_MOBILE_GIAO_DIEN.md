> Cập nhật: cơ chế dữ liệu đã chuyển sang API RAM chung và bỏ reset. Xem DONG_BO_ADMIN_RAM.md để chạy đúng cấu hình mới.

# Giao diện Admin mobile

Đã thiết kế lại theo màu xanh và nền trắng của ứng dụng du khách. Không thêm thư viện. Các quy tắc lưu, kiểm duyệt, phiên bản và công bố vẫn dùng service hiện có.

## Thư mục và file

| Thư mục | Vai trò |
| --- | --- |
| apps/mobile/src/components/admin | Thành phần giao diện dùng lại giữa các màn quản lý. |
| apps/mobile/src/screens/admin | Các màn nghiệp vụ Admin trên điện thoại. |
| apps/mobile/src/navigation | Đăng ký màn và điều hướng native. |
| packages/admin-core/src | Logic và bản dịch dùng chung cho Admin web/mobile. |

| File | Chức năng |
| --- | --- |
| `apps/mobile/src/components/admin/AdminUI.tsx` | Bộ giao diện dùng chung: thẻ, nút, ô nhập, trạng thái, ngôn ngữ và phản hồi. |
| `apps/mobile/src/screens/admin/DashboardScreen.tsx` | Tổng quan bốn chỉ số và các lối vào quản lý nhanh. |
| `apps/mobile/src/screens/admin/PlacesScreen.tsx` | Danh sách di tích bằng FlatList, tìm kiếm, mở thông tin và biên tập. |
| `apps/mobile/src/screens/admin/PlaceFormScreen.tsx` | Biểu mẫu chia nhóm thông tin, tọa độ, hình ảnh và thao tác lưu. |
| `apps/mobile/src/screens/admin/ContentEditorScreen.tsx` | Biên tập nội dung đa ngôn ngữ, nghe thử và gửi duyệt. |
| `apps/mobile/src/screens/admin/ReviewsScreen.tsx` | Hàng chờ duyệt, đọc nội dung, ghi chú và công bố. |
| `apps/mobile/src/navigation/AdminNavigator.tsx` | Điều hướng Admin và kiểu hiển thị tiêu đề. |
| `packages/admin-core/src/messages.ts` | Nhãn giao diện Admin bằng Việt, Anh, Trung, Bồ Đào Nha và Nhật. |

## Những thay đổi chính

- Dashboard có bốn ô: đang hoạt động, lượt QR hôm nay, di tích, chờ duyệt. Các mục quản lý nằm trong thẻ có biểu tượng và mô tả.
- Danh sách dùng ảnh nhỏ, nhãn trạng thái và hai nút thông tin/biên tập. Có trạng thái rỗng và xóa nhanh từ khóa.
- Biểu mẫu chia thành các nhóm rõ ràng, xem trước ảnh và ô nhập có trạng thái focus. Có hỗ trợ bàn phím iOS.
- Kiểm duyệt có ảnh nhận diện, thanh chọn ngôn ngữ và vùng đọc nội dung riêng.
- Giữ xác nhận khi xóa, khôi phục hoặc công bố; giữ cảnh báo rời trang khi chưa lưu.

## Chạy thử

Tại thư mục gốc monorepo:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run start:admin --workspace=mobile -- --clear
```

Mở bản Admin từ Metro vừa chạy trên điện thoại. Script Admin dùng cổng 8082 và cấu hình target riêng; không dùng QR của bản du khách để mở Admin.

Kiểm tra trực tiếp trên điện thoại:

1. Dashboard hiển thị đủ bốn ô trên màn nhỏ; chữ không bị cắt khi tăng cỡ chữ.
2. Mở danh sách, tìm từ có/không dấu, xóa từ khóa rồi mở đúng di tích.
3. Mở biểu mẫu, nhập nhiều dòng và bật bàn phím; kéo tới nút lưu, kiểm tra ảnh xem trước.
4. Đổi ngôn ngữ nội dung; rời màn khi chưa lưu phải có xác nhận.
5. Gửi duyệt, yêu cầu sửa có ghi chú, duyệt rồi xác nhận công bố.

## Đã kiểm tra

- `npm run typecheck`: đạt.
- `npm run lint`: đạt.
- `npm test`: đạt.
- Xuất bundle Admin Android bằng Expo: đạt.

Chưa kiểm tra trực quan trên thiết bị Android/iPhone thật. Số đang hoạt động cần dịch vụ presence đang chạy và điện thoại truy cập được API đã cấu hình. Dữ liệu nội dung vẫn là kho mô phỏng cục bộ; thay đổi giao diện không làm phát sinh đồng bộ giữa thiết bị.

Commit gợi ý: `feat(mobile): redesign admin dashboard and content management`.
