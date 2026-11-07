# Thêm và biên tập di tích

## Bản nháp lưu ở đâu?

Vẫn dùng đúng 11 bảng, không thêm bảng/cột:

| Bảng | Dữ liệu của bản nháp |
|---|---|
| DiTich | Mã DT, revision và TrangThaiXuLy = draft; sau Gửi phê duyệt là submitted |
| BanDiTich | Metadata, danh mục, vị trí của bản draft; bản published tách riêng |
| NoiDungDiTich | Tên, mô tả, địa chỉ, bài đọc theo từng ngôn ngữ, trạng thái draft |
| HinhAnhDiTich | Ảnh của bản draft |
| BanThuThuyetMinh | Bản thu gắn đúng nội dung/phiên bản |
| TepTaiNguyen | Byte ảnh/MP3, định dạng và mã băm |
| LichSuKiemDuyet | Các thao tác lưu, dịch, tạo giọng, gửi duyệt và kiểm duyệt |

Trong admin: Di tích → chọn Bản nháp hoặc Chờ duyệt trong bộ lọc → chọn Biên tập.
Nháp mới không có bản published nên API du khách không trả về. Sửa di tích đã công bố giữ nguyên bản công bố trước đó.
Gửi phê duyệt chỉ chuyển sang submitted. Phải duyệt, sau đó công bố riêng mới hiện bản mới cho du khách.

## Thứ tự thử

1. Vào http://127.0.0.1:5174/admin/places/new. Nhập tên, mô tả, địa chỉ, bài đọc tiếng Việt; chọn danh mục, niên đại, ảnh, tọa độ nếu đã có.
2. Lưu bản nháp: tên bắt buộc; cho phép bài đang viết dở. Có đủ bài Việt và bật Tự dịch thì dịch sang EN/CN/PT/JA sau khi lưu. Nội dung nháp và metadata lưu cùng một transaction trước bước gọi dịch vụ dịch.
3. Chuyển tab ngôn ngữ, kiểm tra/sửa bản dịch và lưu. Tự dịch lại chỉ chạy nếu bản Việt thay đổi; nút Dịch lại chủ động thay bốn bản dịch.
4. Tạo audio cho các bản chưa có: lưu bài, lần lượt tạo MP3 đúng body/ngôn ngữ; bản đã có audio hợp lệ được bỏ qua. Sửa body sẽ bỏ liên kết audio cũ để yêu cầu tạo lại.
5. Nghe thử, rồi Gửi phê duyệt. Thiếu ảnh, bài Việt, địa chỉ/bài đọc/audio của bản đang có thì không gửi được. Mục Kiểm duyệt nhận bản submitted; chưa công bố ở bước này.
6. Lỗi dịch/audio: nháp đã lưu vẫn còn. Không tạo lại di tích mới; tiếp tục trên mã DT đã nhận. Dịch một ngôn ngữ chỉ ghi khi cả bốn trường thành công. Những ngôn ngữ đã hoàn tất trước lỗi vẫn còn.
7. Mở hai thiết bị cùng sửa một revision: lần ghi sau bị conflict; dùng nút nạp lại sau khi xác nhận bỏ thay đổi đang nhập.

## Dịch và audio

- Dịch thật bằng MyMemory, không cần API key cho demo. Văn bản được gửi đến MyMemory qua HTTPS; chỉ dùng nội dung lịch sử công khai, không nhập dữ liệu bí mật vào bài cần dịch.
- Dịch tự động không bảo đảm tên riêng/thuật ngữ lịch sử đúng. Người kiểm duyệt phải đọc lại, nhất là tên di tích, tên vua và địa danh.
- Hạn mức miễn phí ẩn danh: 5.000 ký tự/ngày, theo chính sách nhà cung cấp. Dịch bốn ngôn ngữ tiêu thụ hạn mức cho từng ngôn ngữ. Hết hạn mức/mất mạng báo translationError; không chèn tiền tố DEMO và không công bố bản dịch dở.
- Tài liệu: https://mymemory.translated.net/doc/usagelimits.php
- MP3 vẫn dùng gTTS hiện có. Cần Internet và Python có gTTS. Chỉ cấu hình NARRATION_PYTHON ở services/.env.local, không đưa đường dẫn cá nhân/khóa SQL vào FE hoặc Git.
- Khi đổi nhà cung cấp dịch: thay services/catalog/TuDongDich.cjs hoặc truyền translator vào createCatalogServer; không phải sửa form hoặc cấu trúc bảng.
- Thời gian dịch/TTS ở ngoài transaction SQL; bản nháp được kiểm tra revision lần nữa trước khi ghi kết quả, tránh giữ khóa khi chờ mạng.

## File liên quan

| Vị trí | Vai trò |
|---|---|
| apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx | Form chung thêm/sửa/biên tập, chọn ngôn ngữ, ảnh/audio, lưu/dịch/tạo MP3/gửi duyệt |
| apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx | Dùng lại form trên thay vì giữ giao diện riêng |
| apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx | Danh sách di tích, tìm kiếm và lọc trạng thái |
| packages/admin-core/src/domain/KieuDuLieuQuanTri.ts, HopDongDichVu.ts | Kiểu nội dung nháp, hợp đồng trả mã sau khi lưu |
| packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts | Nghiệp vụ dùng chung, lưu nguyên tử, invalidation audio, workflow và revision |
| packages/admin-core/src/services/GoiApiQuanTri.ts | Web/mobile gọi cùng API và nhận mã DT |
| packages/admin-core/src/react/TrangThaiReact.tsx | Provider/run, thông báo lỗi và tải lại dữ liệu |
| packages/admin-core/src/i18n/BanDichGiaoDien.ts | Nhãn và thông báo đủ 5 ngôn ngữ |
| services/catalog/MayChuApi.cjs | Kiểm tra lệnh, điều phối dịch/audio và SQL |
| services/catalog/TuDongDich.cjs | Adapter dịch MyMemory; chia đoạn theo byte và kiểm tra lỗi hạn mức |
| services/config/DocCauHinhMoiTruong.cjs, services/.env.example | Khai báo cấu hình Python riêng cho server |

## Kiểm tra tự động

- npm run lint
- npm run typecheck
- npm run build:admin --workspace=web
- npm test

Các test SQL tạo database test riêng, không tạo di tích kiểm thử trong HueGuideDemo.

## Đồng bộ giao diện quản trị web và mobile

- Hook chung: packages/admin-core/src/react/useBienTapDiTich.ts. Cả hai UI gọi cùng save/translate/audio/submit; không có quy trình mobile riêng.
- Web: apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx dựng nội dung bên trái, vị trí/media bên phải trên desktop; tablet/điện thoại xếp dọc.
- Native: apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx xếp các thẻ theo cùng thứ tự, giữ toàn bộ nội dung khi chuyển tab ngôn ngữ.
- PlaceFormScreen và ContentEditorScreen chỉ nối route vào cùng PlaceEditor, không giữ các form cũ thiếu trường.
- Danh sách di tích web/mobile đều có bộ lọc nháp/chờ duyệt và các trạng thái còn lại.
- Bỏ banner giải thích SQL, dịch vụ dịch, TTL phiên hoạt động và footer chú giải ở các trang quản trị. Lỗi, tiến trình và kết quả lưu vẫn hiển thị.
- Không sửa cấu trúc database hoặc dữ liệu di tích trong lần đồng bộ UI này.
