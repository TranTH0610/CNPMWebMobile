# Gửi phê duyệt và xem hồ sơ

## Luồng mới

1. Lưu nháp/dịch/tạo audio vẫn dùng usePlaceEditor cho cả web và native.
2. Gửi phê duyệt thành công: API chuyển hồ sơ sang submitted, UI hiện thông báo riêng, xóa vùng đang nhập và mở màn thêm mới không còn id cũ.
3. Nếu gửi lỗi: không xóa form, không hiện thông báo thành công.
4. Danh sách Kiểm duyệt hiển thị thẻ ảnh, tên, trạng thái và bản sửa. Bấm thẻ mới mở toàn bộ hồ sơ.
5. Trang chi tiết có các bản ngôn ngữ, bài đọc, audio, địa chỉ, tọa độ, ảnh và ghi chú. Duyệt và Công bố vẫn là hai bước riêng.

## Các file

| File | Vai trò |
|---|---|
| packages/admin-core/src/react/useBienTapDiTich.ts | Reset vùng đang nhập sau xác nhận submit thành công, giữ nguyên bản submitted trong SQL |
| apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx | Thông báo thành công và chuyển về /admin/places/new |
| apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx | Thông báo và callback chuyển màn thêm mới trên native |
| apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx | Danh sách thẻ và trang /admin/reviews/:id |
| apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx | Danh sách FlatList các thẻ hồ sơ |
| apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx | Xem và xử lý một hồ sơ |
| apps/web/src/features/admin/styles/GiaoDienQuanTri.css | Căn hàng input/select và bố cục thẻ/chi tiết responsive |
| services/catalog/TuDongDich.cjs | Chia theo câu, bỏ fuzzy match khác nguồn, kiểm tra token, giải mã thực thể HTML |
| services/catalog/ThuatNguDich.cjs | Bảo vệ tên vua/di tích/năm và thuật ngữ tuồng, nhã nhạc, quan lại |

## Kiểm tra thủ công

- Nhập VI, lưu/dịch, đổi tab: bản Việt không bị ghi đè, năm 1826 và tên Minh Mạng được giữ đúng.
- Nháp có bản dịch sai trước lần sửa: bấm Dịch 4 ngôn ngữ, đọc kiểm tra, tạo lại audio thiếu rồi gửi duyệt.
- Gửi thiếu ảnh/audio: báo lỗi, giữ dữ liệu đang nhập.
- Gửi đủ dữ liệu: hiện Đã gửi phê duyệt thành công, form trống và trở về VI; di tích vừa gửi xuất hiện trong hàng chờ.
- Điền hồ sơ thứ hai: không dùng mã DT của hồ sơ đã gửi.
- Bấm thẻ ở hàng chờ: xem đúng tên/ảnh/bài của mã id; chuyển ngôn ngữ dừng player trước.
- Yêu cầu sửa cần ghi chú. Duyệt chưa công bố; chỉ nút Công bố sau khi duyệt mới thay trang du khách.
- Kiểm tra tại desktop và màn nhỏ: hai ô tọa độ cùng hàng, không lệch do margin của label cuối.

Không đổi 11 bảng. Không tự ghi lại bản dịch trong SQL khi cập nhật code. Dịch tự động vẫn cần người duyệt đối chiếu, nhất là công trình/tên riêng mới chưa có trong từ điển. Không thể bảo đảm toàn bộ câu dịch của dịch vụ miễn phí đều đạt chất lượng biên tập.
