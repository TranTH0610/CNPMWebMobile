# Giao diện du khách web và mobile

Giao diện dùng màu xanh HueGuide, nền nhạt và thẻ trắng. Giữ nguyên SQL, API, cách dịch, phát audio, GPS và kiểm duyệt. Không thêm QR chia sẻ hoặc yêu thích.

| File/thư mục | Vai trò |
|---|---|
| apps/web/src/features/explore/styles/GiaoDienDuKhach.css | Thiết kế riêng du khách: hero, danh sách, bộ lọc, trang chi tiết và responsive. |
| apps/web/src/main.tsx | Nạp CSS du khách, không nạp vào điểm vào admin. |
| apps/web/src/shared/layouts/BoCucDuKhach.tsx | Đưa trang mới về đầu khi chuyển route, giữ bộ phát hiện có. |
| apps/web/src/features/explore/components/TheDiTich.tsx | Ảnh, tên, mô tả ngắn, địa chỉ và đường dẫn chi tiết. |
| apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx | Bố cục ảnh/thông tin, nghe, bản đồ, chọn ngôn ngữ và bài đọc. |
| apps/mobile/src/features/explore/GiaoDienKhamPha.ts | Style khám phá/tìm kiếm dùng token chung. |
| apps/mobile/src/features/explore/components/TheDiTich.tsx | Toàn thẻ bấm được; có ảnh lỗi dự phòng qua Cover. |
| apps/mobile/src/features/explore/components/OTimKiem.tsx | Giữ nút quay lại, xóa và bộ lọc cùng hàng. |
| apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx | Mặc định xuống hàng; chế độ compact cuộn ngang cho chi tiết. |
| apps/mobile/src/features/explore/screens/ManKhamPha.tsx | Giữ FlatList/pull-to-refresh và thêm lối tắt danh sách/bản đồ. |
| apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx | Thanh ngôn ngữ gọn, ảnh/thông tin chính, nút nghe và bài đọc dễ nhìn. |

## Kiểm tra thủ công

- Web: trang chủ, tìm rỗng, tìm không dấu, danh mục tự lọc, đổi lưới/danh sách, phân trang.
- Bấm thẻ sau khi cuộn xuống: chi tiết phải mở ở đầu trang.
- Chi tiết: đổi đủ 5 ngôn ngữ, nghe/tạm dừng/tiếp tục/đóng, bản đồ mở đúng địa điểm.
- Web ở 390px, 768px và desktop: không tràn ngang, bộ lọc mở/đóng được.
- Mobile native: kéo làm mới; bấm toàn thẻ; ngôn ngữ cuộn ngang; cuộn được toàn bài đọc; đổi cỡ chữ hệ thống.
- Không có vị trí hoặc từ chối GPS: danh sách vẫn hiển thị, khoảng cách không giả lập.

## Giới hạn kiểm tra

Đã kiểm tra trình duyệt và biên dịch iOS/Android. Biên dịch bundle không thay thế kiểm tra trên điện thoại thật; cần kiểm tra thao tác chạm, bàn phím và vùng an toàn trên thiết bị demo.
