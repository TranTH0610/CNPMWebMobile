# Sửa font và đổi ảnh quản trị — 05/11/2026

## Nguyên nhân và kết quả

Ảnh vừa chọn bị nối vào cuối `images`, trong khi preview/card đọc phần tử đầu.
Cả thêm và biên tập dùng chung form nên cùng bị lỗi. Đã dùng chung bộ thao tác ảnh:
ảnh mới lên đầu; không thêm trùng; có nút đặt đại diện và xóa từng ảnh.
URL nhập tay được ưu tiên trước tệp chờ lưu; không mất tệp và không chặn xuống dòng.
Sửa preview web để lỗi tải của URI cũ không làm hỏng URI mới.

Font: bỏ ép Georgia/serif ở tiêu đề web/native; sử dụng font hệ thống Unicode và bỏ tracking âm.
Không thay nội dung chữ, bản dịch lịch sử hoặc font bằng ảnh.

## Vị trí chức năng

| File | Vai trò |
|---|---|
| packages/admin-core/src/domain/XuLyAnhDiTich.ts | Tách ảnh, đưa ảnh lên đầu, xóa ảnh, sửa danh sách URL |
| packages/admin-core/src/XuatCongKhai.ts | Export hàm thuần để hai nền tảng dùng chung |
| packages/admin-core/src/i18n/BanDichGiaoDien.ts | Nhãn ảnh đại diện/chọn/xóa đủ năm ngôn ngữ |
| apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx | Preview, từng thumbnail và nút chọn/xóa trên web |
| apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx | Cùng chức năng, nút/vùng chạm native |
| apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx | Ghép bộ chọn ảnh vào form thêm/sửa/biên tập |
| apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx | Ghép bộ chọn ảnh native vào form dùng chung |
| apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx | Chặn picker trong lúc form bận |
| apps/web/src/shared/components/AnhDiTich.tsx | Gắn lỗi với URI cụ thể thay vì dùng cờ lỗi chung |
| apps/web/src/shared/styles/DiSanHue.css | Font stack Unicode, layout bộ ảnh và các nút |
| apps/web/src/features/explore/styles/GiaoDienDuKhach.css | Tiêu đề dùng cùng font, bỏ tracking âm |
| apps/mobile/src/features/explore/GiaoDienKhamPha.ts | Hero native dùng font hệ thống |
| apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx | Tiêu đề native dùng font hệ thống |
| packages/admin-core/tests/KiemThuQuanTri.test.cjs | Test thứ tự/không trùng/xóa ảnh/lưu nháp không tự công bố |

## Cách dùng

1. Mở Thêm di tích hoặc Biên tập → Hình ảnh và tư liệu.
2. Chọn ảnh từ thiết bị: ảnh vừa chọn xuất hiện ngay ở preview và có nhãn Ảnh đại diện.
3. Dùng Đặt làm ảnh đại diện ở ảnh khác để đổi, hoặc Xóa ảnh để bỏ ảnh khỏi bản đang nhập.
4. Lưu bản nháp để lưu qua API vào SQL. Gửi/duyệt/công bố vẫn theo luồng đang có.

Giữ giới hạn hiện tại: JPEG/PNG/WebP, tối đa 1 MB/ảnh. Không đổi schema/API/giới hạn backend.
Chọn/xóa trong form chưa lưu không xóa tệp thật hoặc bản đã công bố.

## Kiểm chứng

- Browser: chọn Điện Thái Hòa rồi Cung Diên Thọ; ảnh mới lên đại diện, chọn lại ảnh cũ được,
  xóa ảnh đại diện chuyển sang ảnh còn lại. Preview tải đủ 1280 px, khớp thumbnail đầu.
- Font heading thực tế: system-ui/Segoe UI/Noto Sans; dấu tiếng Việt trong form hiển thị rõ.
- Thử UI chỉ trên form chưa lưu; không tạo/công bố bản ghi thật.
- Typecheck, lint, format check, build visitor/admin và export iOS/Android đạt.
- Admin-core 28/28 ca kiểm thử đạt, gồm 2 ca hồi quy cho đổi ảnh và lưu nháp.
- Native đã kiểm tra biên dịch, chưa thao tác picker trên điện thoại thật.
- Log trong `.runtime/image-font-fix-20261105`; ảnh QA ở thư mục outputs/image-font-fix của workspace C:.
