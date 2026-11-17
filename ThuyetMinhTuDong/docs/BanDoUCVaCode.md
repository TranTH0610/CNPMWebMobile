# Bản đồ UC và vị trí code

Đối chiếu theo bộ UC01–UC14 đã gộp. Mã UC trong chú thích mới thay thế cách đánh số cũ.

Một UC có thể đi qua nhiều file: giao diện → hook/controller → client HTTP → API → SQL. File được ghi là hỗ trợ không có nghĩa tự nó thực hiện trọn vẹn UC.

Tìm nhanh trong VS Code: Ctrl+Shift+F nhập `[UC06` hoặc tên hàm; Ctrl+P mở file rồi Ctrl+G nhập số dòng. Số dòng dưới đây tính sau lần thêm chú thích ngày 17/11/2026.

UC09 hiện dùng danh tính quản lý cấp sẵn. UC08 có dữ liệu tuyến tham khảo; không coi đó là thuật toán tìm đường đi bộ đã hoàn chỉnh. Dữ liệu nghiệp vụ máy chủ dùng SQL; tùy chọn và tiến độ thiết bị lưu qua adapter của nền tảng.

## UC01 — Thiết lập và thay đổi ngôn ngữ

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/language/components/ChonNgonNgu.tsx` | Bộ chọn ngôn ngữ trên web; cập nhật lựa chọn trong provider để giao diện dịch lại. | [Mở file tại dòng 19](<../apps/web/src/features/language/components/ChonNgonNgu.tsx#L19>) |
| `apps/web/src/features/language/hooks/useDuKhach.ts` | Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan. | [Mở file](<../apps/web/src/features/language/hooks/useDuKhach.ts>) |
| `apps/web/src/features/language/i18n/CauHinhNgonNgu.ts` | Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app. | [Mở file](<../apps/web/src/features/language/i18n/CauHinhNgonNgu.ts>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx` | Chọn ngôn ngữ du khách từ provider hiện có. SettingsScreen dùng kiểu mặc định; DetailScreen dùng compact để không che nội dung. TẠI SAO: Cùng một trạng thái ngôn ngữ cho tiêu đề, bài đọc và thuyết minh trên ứng dụng. | [Mở file tại dòng 18](<../apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx#L18>) |
| `apps/mobile/src/features/language/hooks/useDuKhach.ts` | Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan. | [Mở file](<../apps/mobile/src/features/language/hooks/useDuKhach.ts>) |
| `apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts` | Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app. | [Mở file](<../apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts>) |
| `apps/mobile/src/features/settings/screens/ManCaiDat.tsx` | Màn chọn ngôn ngữ trong nhận diện Heritage. MainTabs dùng; vẫn gọi LanguageBar/provider hiện có để lưu lựa chọn. | [Mở file tại dòng 19](<../apps/mobile/src/features/settings/screens/ManCaiDat.tsx#L19>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/i18n/BanDichDiSan.ts` | Tài nguyên chuỗi liên quan nội dung di tích theo ngôn ngữ; i18n tra khóa để các nền tảng hiển | [Mở file](<../packages/visitor-core/src/i18n/BanDichDiSan.ts>) |
| `packages/visitor-core/src/i18n/BanDichGiaoDien.ts` | Tài nguyên chuỗi cơ bản du khách theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống | [Mở file](<../packages/visitor-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/visitor-core/src/i18n/BanDichHanhTrinh.ts` | Tài nguyên chuỗi bài nghe và hành trình theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị | [Mở file](<../packages/visitor-core/src/i18n/BanDichHanhTrinh.ts>) |
| `packages/visitor-core/src/i18n/BanDichThanhPhan.ts` | Tài nguyên chuỗi trang khám phá và danh mục theo ngôn ngữ; i18n tra khóa để các nền tảng hiển | [Mở file](<../packages/visitor-core/src/i18n/BanDichThanhPhan.ts>) |
| `packages/visitor-core/src/i18n/BanDichTraiNghiem.ts` | Nhãn giao diện Heritage cho đủ năm ngôn ngữ. | [Mở file](<../packages/visitor-core/src/i18n/BanDichTraiNghiem.ts>) |
| `packages/visitor-core/src/i18n/BanDichTruyCapQR.ts` | Tài nguyên chuỗi liên kết và QR theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống | [Mở file](<../packages/visitor-core/src/i18n/BanDichTruyCapQR.ts>) |
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 154](<../packages/visitor-core/src/journey/HanhTrinh.ts#L154>) |
| `packages/visitor-core/src/react/TrangThaiReact.tsx` | Khởi tạo ngôn ngữ, tải danh mục/chi tiết và cung cấp bộ lọc dùng chung cho Web và Mobile. | [Mở file tại dòng 56](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L56>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |

## UC02 — Xem danh sách di tích

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx` | Danh mục web gồm tìm kiếm, danh mục/khu vực, sắp xếp, chế độ lưới/danh sách và phân trang. | [Mở file tại dòng 27](<../apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx#L27>) |
| `apps/web/src/features/explore/components/NutLocDanhMuc.tsx` | Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc. | [Mở file tại dòng 19](<../apps/web/src/features/explore/components/NutLocDanhMuc.tsx#L19>) |
| `apps/web/src/features/explore/components/TheDiTich.tsx` | Hiển thị thẻ di tích có toàn bộ vùng bấm mở trang chi tiết và phần nghe thuyết minh. | [Mở file tại dòng 24](<../apps/web/src/features/explore/components/TheDiTich.tsx#L24>) |
| `apps/web/src/features/explore/hooks/useDanhSachDiTich.ts` | Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây. | [Mở file](<../apps/web/src/features/explore/hooks/useDanhSachDiTich.ts>) |
| `apps/web/src/features/explore/pages/TrangChu.tsx` | Trang chủ web với hero, ô tìm kiếm, danh mục, carousel điểm nổi bật và danh mục bên dưới. | [Mở file tại dòng 28](<../apps/web/src/features/explore/pages/TrangChu.tsx#L28>) |
| `apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx` | Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích. | [Mở file tại dòng 20](<../apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx#L20>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/web/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 21](<../apps/web/src/shared/components/AnhDiTich.tsx#L21>) |
| `apps/web/src/shared/services/NguonTepTaiNguyen.ts` | Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static. | [Mở file](<../apps/web/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/web/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts. | [Mở file](<../apps/web/src/shared/services/XuLyAnhDiTich.ts>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/explore/components/ChonSapXep.tsx` | Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/ChonSapXep.tsx#L22>) |
| `apps/mobile/src/features/explore/components/KhoiChaoMung.tsx` | Phần chào mừng native có ảnh, nội dung và công cụ tìm tách riêng. HomeScreen gọi; Cover/SearchBar/Action và i18n cung cấp UI, callback cũ giữ toàn bộ nghiệp vụ. TẠI SAO: Không đặt nhiều khối lên ảnh, không khóa chiều cao khi chữ dài hoặc cỡ chữ hệ thống tăng. | [Mở file tại dòng 20](<../apps/mobile/src/features/explore/components/KhoiChaoMung.tsx#L20>) |
| `apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx` | Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx#L22>) |
| `apps/mobile/src/features/explore/components/OTimKiem.tsx` | Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ liệu riêng. | [Mở file tại dòng 21](<../apps/mobile/src/features/explore/components/OTimKiem.tsx#L21>) |
| `apps/mobile/src/features/explore/components/TheDiTich.tsx` | Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/TheDiTich.tsx#L22>) |
| `apps/mobile/src/features/explore/GiaoDienKhamPha.ts` | Style riêng cho màn khám phá, tìm kiếm và thẻ địa điểm mobile. HomeScreen, SearchBar, CategoryChips, PlaceCard dùng; phụ thuộc ui-tokens. TẠI SAO: Một nơi quản lý khoảng cách/màu, không thay style quản trị hoặc logic tìm kiếm. | [Mở file](<../apps/mobile/src/features/explore/GiaoDienKhamPha.ts>) |
| `apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts` | Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây. | [Mở file](<../apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts>) |
| `apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx` | Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm. | [Mở file tại dòng 18](<../apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx#L18>) |
| `apps/mobile/src/features/explore/screens/ManKhamPha.tsx` | Màn khám phá mobile: ảnh bìa, tìm kiếm, chip danh mục, điểm nổi bật và danh sách điểm tham quan. | [Mở file tại dòng 36](<../apps/mobile/src/features/explore/screens/ManKhamPha.tsx#L36>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `apps/mobile/src/shared/components/AnhBia.tsx` | Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile. | [Mở file tại dòng 26](<../apps/mobile/src/shared/components/AnhBia.tsx#L26>) |
| `apps/mobile/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 23](<../apps/mobile/src/shared/components/AnhDiTich.tsx#L23>) |
| `apps/mobile/src/shared/services/NguonTepTaiNguyen.ts` | Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL. | [Mở file](<../apps/mobile/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/mobile/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu. | [Mở file](<../apps/mobile/src/shared/services/XuLyAnhDiTich.ts>) |
| `packages/visitor-core/src/catalog/DanhMucDiTich.ts` | Đọc danh mục và chọn văn bản/âm thanh đã công bố đúng ngôn ngữ. | [Mở file tại dòng 24](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L24>) |
| `packages/visitor-core/src/catalog/DuLieuHienThi.ts` | Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu. | [Mở file](<../packages/visitor-core/src/catalog/DuLieuHienThi.ts>) |
| `packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts` | Chuẩn hóa từ khóa, tính khoảng cách, tìm/lọc/sắp xếp và chia trang kết quả. | [Mở file tại dòng 28](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L28>) |
| `packages/visitor-core/src/data/DanhMucAnh.ts` | Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero. | [Mở file](<../packages/visitor-core/src/data/DanhMucAnh.ts>) |
| `packages/visitor-core/src/data/DiSanHue.ts` | Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng. | [Mở file tại dòng 28](<../packages/visitor-core/src/data/DiSanHue.ts#L28>) |
| `packages/visitor-core/src/data/DuLieuKhoiTao.ts` | Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo. | [Mở file tại dòng 23](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts#L23>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/react/TrangThaiReact.tsx` | Khởi tạo ngôn ngữ, tải danh mục/chi tiết và cung cấp bộ lọc dùng chung cho Web và Mobile. | [Mở file tại dòng 115](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L115>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 588](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L588>) |
| `packages/place-core/src/data/DiTichMauKiemThu.ts` | Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package | [Mở file tại dòng 390](<../packages/place-core/src/data/DiTichMauKiemThu.ts#L390>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/catalog/ChuanBiThayDoiDuLieu.cjs` | Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL. | [Mở file tại dòng 33](<../services/database/catalog/ChuanBiThayDoiDuLieu.cjs#L33>) |
| `services/database/catalog/DocDiTichTuSql.cjs` | Ghép các hàng SQL thành dữ liệu di tích mà API đang sử dụng. | [Mở file](<../services/database/catalog/DocDiTichTuSql.cjs>) |
| `services/database/catalog/GhiDiTichVaoSql.cjs` | Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có. | [Mở file](<../services/database/catalog/GhiDiTichVaoSql.cjs>) |
| `services/database/catalog/TruyVanVaCapMa.cjs` | Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có. | [Mở file tại dòng 17](<../services/database/catalog/TruyVanVaCapMa.cjs#L17>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |

## UC03 — Tìm kiếm, lọc và sắp xếp

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx` | Danh mục web gồm tìm kiếm, danh mục/khu vực, sắp xếp, chế độ lưới/danh sách và phân trang. | [Mở file tại dòng 27](<../apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx#L27>) |
| `apps/web/src/features/explore/components/NutLocDanhMuc.tsx` | Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc. | [Mở file tại dòng 19](<../apps/web/src/features/explore/components/NutLocDanhMuc.tsx#L19>) |
| `apps/web/src/features/explore/components/TheDiTich.tsx` | Hiển thị thẻ di tích có toàn bộ vùng bấm mở trang chi tiết và phần nghe thuyết minh. | [Mở file tại dòng 24](<../apps/web/src/features/explore/components/TheDiTich.tsx#L24>) |
| `apps/web/src/features/explore/hooks/useDanhSachDiTich.ts` | Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây. | [Mở file](<../apps/web/src/features/explore/hooks/useDanhSachDiTich.ts>) |
| `apps/web/src/features/explore/pages/TrangChu.tsx` | Trang chủ web với hero, ô tìm kiếm, danh mục, carousel điểm nổi bật và danh mục bên dưới. | [Mở file tại dòng 28](<../apps/web/src/features/explore/pages/TrangChu.tsx#L28>) |
| `apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx` | Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích. | [Mở file tại dòng 20](<../apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx#L20>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/explore/components/ChonSapXep.tsx` | Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/ChonSapXep.tsx#L22>) |
| `apps/mobile/src/features/explore/components/KhoiChaoMung.tsx` | Phần chào mừng native có ảnh, nội dung và công cụ tìm tách riêng. HomeScreen gọi; Cover/SearchBar/Action và i18n cung cấp UI, callback cũ giữ toàn bộ nghiệp vụ. TẠI SAO: Không đặt nhiều khối lên ảnh, không khóa chiều cao khi chữ dài hoặc cỡ chữ hệ thống tăng. | [Mở file tại dòng 20](<../apps/mobile/src/features/explore/components/KhoiChaoMung.tsx#L20>) |
| `apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx` | Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx#L22>) |
| `apps/mobile/src/features/explore/components/OTimKiem.tsx` | Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ liệu riêng. | [Mở file tại dòng 21](<../apps/mobile/src/features/explore/components/OTimKiem.tsx#L21>) |
| `apps/mobile/src/features/explore/components/TheDiTich.tsx` | Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/TheDiTich.tsx#L22>) |
| `apps/mobile/src/features/explore/GiaoDienKhamPha.ts` | Style riêng cho màn khám phá, tìm kiếm và thẻ địa điểm mobile. HomeScreen, SearchBar, CategoryChips, PlaceCard dùng; phụ thuộc ui-tokens. TẠI SAO: Một nơi quản lý khoảng cách/màu, không thay style quản trị hoặc logic tìm kiếm. | [Mở file](<../apps/mobile/src/features/explore/GiaoDienKhamPha.ts>) |
| `apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts` | Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây. | [Mở file](<../apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts>) |
| `apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx` | Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm. | [Mở file tại dòng 18](<../apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx#L18>) |
| `apps/mobile/src/features/explore/screens/ManKhamPha.tsx` | Màn khám phá mobile: ảnh bìa, tìm kiếm, chip danh mục, điểm nổi bật và danh sách điểm tham quan. | [Mở file tại dòng 36](<../apps/mobile/src/features/explore/screens/ManKhamPha.tsx#L36>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `packages/visitor-core/src/catalog/DanhMucDiTich.ts` | Đọc danh mục và chọn văn bản/âm thanh đã công bố đúng ngôn ngữ. | [Mở file tại dòng 24](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L24>) |
| `packages/visitor-core/src/catalog/DuLieuHienThi.ts` | Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu. | [Mở file](<../packages/visitor-core/src/catalog/DuLieuHienThi.ts>) |
| `packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts` | Chuẩn hóa từ khóa, tính khoảng cách, tìm/lọc/sắp xếp và chia trang kết quả. | [Mở file tại dòng 28](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L28>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/react/TrangThaiReact.tsx` | Khởi tạo ngôn ngữ, tải danh mục/chi tiết và cung cấp bộ lọc dùng chung cho Web và Mobile. | [Mở file tại dòng 115](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L115>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/catalog/ChuanBiThayDoiDuLieu.cjs` | Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL. | [Mở file tại dòng 33](<../services/database/catalog/ChuanBiThayDoiDuLieu.cjs#L33>) |
| `services/database/catalog/DocDiTichTuSql.cjs` | Ghép các hàng SQL thành dữ liệu di tích mà API đang sử dụng. | [Mở file](<../services/database/catalog/DocDiTichTuSql.cjs>) |
| `services/database/catalog/GhiDiTichVaoSql.cjs` | Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có. | [Mở file](<../services/database/catalog/GhiDiTichVaoSql.cjs>) |
| `services/database/catalog/TruyVanVaCapMa.cjs` | Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có. | [Mở file tại dòng 17](<../services/database/catalog/TruyVanVaCapMa.cjs#L17>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |

## UC04 — Xem chi tiết và đọc thuyết minh

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx` | Trang chi tiết du khách với ảnh, bài đọc và hai thao tác nghe/bản đồ. AppRoutes gọi; dùng usePublishedPlace, useVisitor và ListenButton hiện có. TẠI SAO: Phần trình bày tách khỏi service; đổi bố cục không đổi nội dung SQL hay bộ phát audio. | [Mở file tại dòng 28](<../apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx#L28>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/web/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 21](<../apps/web/src/shared/components/AnhDiTich.tsx#L21>) |
| `apps/web/src/shared/services/NguonTepTaiNguyen.ts` | Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static. | [Mở file](<../apps/web/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/web/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts. | [Mở file](<../apps/web/src/shared/services/XuLyAnhDiTich.ts>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx` | Chi tiết địa điểm mobile với ảnh lớn, thanh ngôn ngữ và bài thuyết minh dễ đọc. RootNavigator gọi; dùng service/hook du khách và bộ phát ListenButton đã có. TẠI SAO: Một ScrollView dọc, thanh ngôn ngữ ngang giúp tránh lỗi nội dung bị khuất dưới header. | [Mở file tại dòng 29](<../apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx#L29>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `apps/mobile/src/shared/components/AnhBia.tsx` | Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile. | [Mở file tại dòng 26](<../apps/mobile/src/shared/components/AnhBia.tsx#L26>) |
| `apps/mobile/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 23](<../apps/mobile/src/shared/components/AnhDiTich.tsx#L23>) |
| `apps/mobile/src/shared/services/NguonTepTaiNguyen.ts` | Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL. | [Mở file](<../apps/mobile/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/mobile/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu. | [Mở file](<../apps/mobile/src/shared/services/XuLyAnhDiTich.ts>) |
| `packages/visitor-core/src/catalog/DanhMucDiTich.ts` | Đọc danh mục và chọn văn bản/âm thanh đã công bố đúng ngôn ngữ. | [Mở file tại dòng 24](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L24>) |
| `packages/visitor-core/src/catalog/DuLieuHienThi.ts` | Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu. | [Mở file](<../packages/visitor-core/src/catalog/DuLieuHienThi.ts>) |
| `packages/visitor-core/src/data/DanhMucAnh.ts` | Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero. | [Mở file](<../packages/visitor-core/src/data/DanhMucAnh.ts>) |
| `packages/visitor-core/src/data/DiSanHue.ts` | Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng. | [Mở file tại dòng 28](<../packages/visitor-core/src/data/DiSanHue.ts#L28>) |
| `packages/visitor-core/src/data/DuLieuKhoiTao.ts` | Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo. | [Mở file tại dòng 23](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts#L23>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/react/TrangThaiReact.tsx` | Khởi tạo ngôn ngữ, tải danh mục/chi tiết và cung cấp bộ lọc dùng chung cho Web và Mobile. | [Mở file tại dòng 115](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L115>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 588](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L588>) |
| `packages/place-core/src/data/DiTichMauKiemThu.ts` | Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package | [Mở file tại dòng 390](<../packages/place-core/src/data/DiTichMauKiemThu.ts#L390>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/catalog/XuLyTepTaiNguyen.cjs` | Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố. | [Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/catalog/ChuanBiThayDoiDuLieu.cjs` | Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL. | [Mở file tại dòng 33](<../services/database/catalog/ChuanBiThayDoiDuLieu.cjs#L33>) |
| `services/database/catalog/DocDiTichTuSql.cjs` | Ghép các hàng SQL thành dữ liệu di tích mà API đang sử dụng. | [Mở file](<../services/database/catalog/DocDiTichTuSql.cjs>) |
| `services/database/catalog/GhiDiTichVaoSql.cjs` | Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có. | [Mở file](<../services/database/catalog/GhiDiTichVaoSql.cjs>) |
| `services/database/catalog/TruyVanVaCapMa.cjs` | Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có. | [Mở file tại dòng 17](<../services/database/catalog/TruyVanVaCapMa.cjs#L17>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/CapNhatNoiDungDiSan.cjs` | Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng | [Mở file](<../scripts/CapNhatNoiDungDiSan.cjs>) |

## UC05 — Bắt đầu tham quan bằng QR chung tại cổng

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts` | Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang. | [Mở file tại dòng 43](<../apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts#L43>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts` | Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang. | [Mở file tại dòng 26](<../apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts#L26>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/LienKetMoUngDung.ts` | Cấu hình nhận liên kết mở ứng dụng mobile và phân tích đường dẫn theo quy tắc QR/liên kết chung. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/LienKetMoUngDung.ts#L30>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/links/DiaChiWebsite.ts` | Chuẩn hóa/cấu hình địa chỉ website dùng cho liên kết chung theo quy tắc của dự án. | [Mở file tại dòng 18](<../packages/visitor-core/src/links/DiaChiWebsite.ts#L18>) |
| `packages/visitor-core/src/links/PhanTichLienKetQR.ts` | Kiểm tra và phân tích liên kết QR; nhận liên kết vào cổng chung và từ chối dữ liệu không hợp lệ. | [Mở file tại dòng 24](<../packages/visitor-core/src/links/PhanTichLienKetQR.ts#L24>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `scripts/KetNoiHttpsQR.cjs` | Tiện ích request/xác minh kết nối HTTPS phục vụ tạo QR, gồm xử lý trường hợp DNS theo triển khai | [Mở file tại dòng 46](<../scripts/KetNoiHttpsQR.cjs#L46>) |
| `scripts/KiemTraWebsiteSanSang.cjs` | Xác minh danh sách và ảnh SQL đi được qua cùng URL website của QR. | [Mở file](<../scripts/KiemTraWebsiteSanSang.cjs>) |
| `scripts/TaoLienKetUngDung.cjs` | Sinh các tệp association Android/iOS từ cấu hình định danh và chứng thư cho liên kết mở ứng | [Mở file tại dòng 16](<../scripts/TaoLienKetUngDung.cjs#L16>) |
| `scripts/TaoMaQRCongKhai.cjs` | Tạo QR HTTPS dùng chung sau khi xác nhận website đúng ứng dụng và truy cập được. | [Mở file tại dòng 19](<../scripts/TaoMaQRCongKhai.cjs#L19>) |

## UC06 — Nhận diện di tích gần nhất bằng GPS

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 30](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L30>) |
| `apps/web/src/features/journey/components/TrangThaiDinhVi.tsx` | Thẻ trạng thái định vị trong trang bản đồ, dựa trên dữ liệu thật. JourneyPage gọi; không xin quyền, không bật GPS hoặc phát âm thanh khi render. | [Mở file tại dòng 19](<../apps/web/src/features/journey/components/TrangThaiDinhVi.tsx#L19>) |
| `apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts` | Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác. | [Mở file tại dòng 19](<../apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts#L19>) |
| `apps/web/src/features/journey/hooks/useHanhTrinh.ts` | Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core. | [Mở file](<../apps/web/src/features/journey/hooks/useHanhTrinh.ts>) |
| `apps/web/src/features/journey/pages/TrangHanhTrinh.tsx` | Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo. | [Mở file tại dòng 32](<../apps/web/src/features/journey/pages/TrangHanhTrinh.tsx#L32>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 32](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L32>) |
| `apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx` | Trạng thái GPS native có icon và chữ, không chỉ dựa vào màu. JourneyScreen dùng; không thay watch, bán kính, gợi ý hoặc auto-play của engine. | [Mở file tại dòng 21](<../apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx#L21>) |
| `apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts` | Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác. | [Mở file tại dòng 17](<../apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts#L17>) |
| `apps/mobile/src/features/journey/hooks/useHanhTrinh.ts` | Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core. | [Mở file](<../apps/mobile/src/features/journey/hooks/useHanhTrinh.ts>) |
| `apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx` | Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh. | [Mở file tại dòng 36](<../apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx#L36>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 43](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L43>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts` | Chuẩn hóa từ khóa, tính khoảng cách, tìm/lọc/sắp xếp và chia trang kết quả. | [Mở file tại dòng 28](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L28>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/journey/DuLieuHanhTrinh.ts` | Cung cấp tọa độ và tuyến tham khảo; tuyến chưa được xác nhận không được coi là đường đi bộ đã kiểm chứng. | [Mở file tại dòng 47](<../packages/visitor-core/src/journey/DuLieuHanhTrinh.ts#L47>) |
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 94](<../packages/visitor-core/src/journey/HanhTrinh.ts#L94>) |
| `packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx` | Kết nối JourneyController với React để các màn cùng dùng một trạng thái GPS và phiên nghe. | [Mở file tại dòng 22](<../packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx#L22>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |

## UC06.1 — Xin quyền, lấy và theo dõi vị trí

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 30](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L30>) |
| `apps/web/src/features/journey/components/TrangThaiDinhVi.tsx` | Thẻ trạng thái định vị trong trang bản đồ, dựa trên dữ liệu thật. JourneyPage gọi; không xin quyền, không bật GPS hoặc phát âm thanh khi render. | [Mở file tại dòng 19](<../apps/web/src/features/journey/components/TrangThaiDinhVi.tsx#L19>) |
| `apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 32](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L32>) |
| `apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx` | Trạng thái GPS native có icon và chữ, không chỉ dựa vào màu. JourneyScreen dùng; không thay watch, bán kính, gợi ý hoặc auto-play của engine. | [Mở file tại dòng 21](<../apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx#L21>) |
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 376](<../packages/visitor-core/src/journey/HanhTrinh.ts#L376>) |

## UC07 — Nghe, điều khiển và tiếp tục phiên nghe

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 55](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L55>) |
| `apps/web/src/features/journey/adapters/NguonAmThanh.ts` | Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web. Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL. | [Mở file](<../apps/web/src/features/journey/adapters/NguonAmThanh.ts>) |
| `apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx` | Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung. | [Mở file tại dòng 20](<../apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx#L20>) |
| `apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx` | Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung. | [Mở file tại dòng 28](<../apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx#L28>) |
| `apps/web/src/features/journey/hooks/useHanhTrinh.ts` | Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core. | [Mở file](<../apps/web/src/features/journey/hooks/useHanhTrinh.ts>) |
| `apps/web/src/features/journey/pages/TrangHanhTrinh.tsx` | Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo. | [Mở file tại dòng 32](<../apps/web/src/features/journey/pages/TrangHanhTrinh.tsx#L32>) |
| `apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx` | Trang chi tiết du khách với ảnh, bài đọc và hai thao tác nghe/bản đồ. AppRoutes gọi; dùng usePublishedPlace, useVisitor và ListenButton hiện có. TẠI SAO: Phần trình bày tách khỏi service; đổi bố cục không đổi nội dung SQL hay bộ phát audio. | [Mở file tại dòng 28](<../apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx#L28>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 94](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L94>) |
| `apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx` | Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung. | [Mở file tại dòng 20](<../apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx#L20>) |
| `apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx` | Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung. | [Mở file tại dòng 30](<../apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx#L30>) |
| `apps/mobile/src/features/journey/hooks/useHanhTrinh.ts` | Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core. | [Mở file](<../apps/mobile/src/features/journey/hooks/useHanhTrinh.ts>) |
| `apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx` | Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh. | [Mở file tại dòng 36](<../apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx#L36>) |
| `apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx` | Chi tiết địa điểm mobile với ảnh lớn, thanh ngôn ngữ và bài thuyết minh dễ đọc. RootNavigator gọi; dùng service/hook du khách và bộ phát ListenButton đã có. TẠI SAO: Một ScrollView dọc, thanh ngôn ngữ ngang giúp tránh lỗi nội dung bị khuất dưới header. | [Mở file tại dòng 29](<../apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx#L29>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts` | Điều phối quyền phát để nguồn mới yêu cầu nguồn đang giữ quyền tạm dừng; dùng cả nghe thuyết minh và nghe thử. | [Mở file tại dòng 18](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts#L18>) |
| `packages/visitor-core/src/catalog/DanhMucDiTich.ts` | Đọc danh mục và chọn văn bản/âm thanh đã công bố đúng ngôn ngữ. | [Mở file tại dòng 24](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L24>) |
| `packages/visitor-core/src/data/DanhMucAnh.ts` | Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero. | [Mở file](<../packages/visitor-core/src/data/DanhMucAnh.ts>) |
| `packages/visitor-core/src/data/DiSanHue.ts` | Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng. | [Mở file tại dòng 28](<../packages/visitor-core/src/data/DiSanHue.ts#L28>) |
| `packages/visitor-core/src/data/DuLieuKhoiTao.ts` | Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo. | [Mở file tại dòng 23](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts#L23>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 60](<../packages/visitor-core/src/journey/HanhTrinh.ts#L60>) |
| `packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx` | Kết nối JourneyController với React để các màn cùng dùng một trạng thái GPS và phiên nghe. | [Mở file tại dòng 22](<../packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx#L22>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 588](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L588>) |
| `packages/place-core/src/data/DiTichMauKiemThu.ts` | Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package | [Mở file tại dòng 390](<../packages/place-core/src/data/DiTichMauKiemThu.ts#L390>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |
| `services/catalog/XuLyTepTaiNguyen.cjs` | Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố. | [Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/CapNhatNoiDungDiSan.cjs` | Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng | [Mở file](<../scripts/CapNhatNoiDungDiSan.cjs>) |

## UC07.1 — Tạm dừng và tiếp tục

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 299](<../packages/visitor-core/src/journey/HanhTrinh.ts#L299>) |

## UC07.2 — Tua và chọn thời điểm nghe

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 60](<../packages/visitor-core/src/journey/HanhTrinh.ts#L60>) |

## UC07.3 — Điều chỉnh tốc độ phát

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 331](<../packages/visitor-core/src/journey/HanhTrinh.ts#L331>) |

## UC08 — Xem bản đồ, tuyến tham quan và tìm đường

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/App.tsx` | Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route. | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) |
| `apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts>) |
| `apps/web/src/features/journey/components/BanDoThamQuan.tsx` | Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng. | [Mở file tại dòng 25](<../apps/web/src/features/journey/components/BanDoThamQuan.tsx#L25>) |
| `apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts` | Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác. | [Mở file](<../apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts>) |
| `apps/web/src/features/journey/hooks/useHanhTrinh.ts` | Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core. | [Mở file](<../apps/web/src/features/journey/hooks/useHanhTrinh.ts>) |
| `apps/web/src/features/journey/pages/TrangHanhTrinh.tsx` | Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo. | [Mở file tại dòng 32](<../apps/web/src/features/journey/pages/TrangHanhTrinh.tsx#L32>) |
| `apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx` | Trang chi tiết du khách với ảnh, bài đọc và hai thao tác nghe/bản đồ. AppRoutes gọi; dùng usePublishedPlace, useVisitor và ListenButton hiện có. TẠI SAO: Phần trình bày tách khỏi service; đổi bố cục không đổi nội dung SQL hay bộ phát audio. | [Mở file tại dòng 28](<../apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx#L28>) |
| `apps/web/src/main.tsx` | Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML. | [Mở file](<../apps/web/src/main.tsx>) |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) |
| `apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage. | [Mở file tại dòng 150](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L150>) |
| `apps/mobile/src/features/journey/components/BanDoThamQuan.tsx` | Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng. | [Mở file tại dòng 27](<../apps/mobile/src/features/journey/components/BanDoThamQuan.tsx#L27>) |
| `apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts` | Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác. | [Mở file](<../apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts>) |
| `apps/mobile/src/features/journey/hooks/useHanhTrinh.ts` | Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core. | [Mở file](<../apps/mobile/src/features/journey/hooks/useHanhTrinh.ts>) |
| `apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx` | Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh. | [Mở file tại dòng 36](<../apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx#L36>) |
| `apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx` | Chi tiết địa điểm mobile với ảnh lớn, thanh ngôn ngữ và bài thuyết minh dễ đọc. RootNavigator gọi; dùng service/hook du khách và bộ phát ListenButton đã có. TẠI SAO: Một ScrollView dọc, thanh ngôn ngữ ngang giúp tránh lỗi nội dung bị khuất dưới header. | [Mở file tại dòng 29](<../apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx#L29>) |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>) |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) |
| `packages/visitor-core/src/data/DanhMucAnh.ts` | Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero. | [Mở file](<../packages/visitor-core/src/data/DanhMucAnh.ts>) |
| `packages/visitor-core/src/data/DiSanHue.ts` | Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng. | [Mở file tại dòng 28](<../packages/visitor-core/src/data/DiSanHue.ts#L28>) |
| `packages/visitor-core/src/data/DuLieuKhoiTao.ts` | Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo. | [Mở file tại dòng 23](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts#L23>) |
| `packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts` | Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) |
| `packages/visitor-core/src/journey/DuLieuHanhTrinh.ts` | Cung cấp tọa độ và tuyến tham khảo; tuyến chưa được xác nhận không được coi là đường đi bộ đã kiểm chứng. | [Mở file tại dòng 47](<../packages/visitor-core/src/journey/DuLieuHanhTrinh.ts#L47>) |
| `packages/visitor-core/src/journey/HanhTrinh.ts` | Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan. | [Mở file tại dòng 120](<../packages/visitor-core/src/journey/HanhTrinh.ts#L120>) |
| `packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx` | Kết nối JourneyController với React để các màn cùng dùng một trạng thái GPS và phiên nghe. | [Mở file tại dòng 22](<../packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx#L22>) |
| `packages/visitor-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>) |
| `packages/place-core/src/data/DiTichMauKiemThu.ts` | Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package | [Mở file tại dòng 390](<../packages/place-core/src/data/DiTichMauKiemThu.ts#L390>) |
| `packages/place-core/src/hooks/useChoNgungNhap.ts` | Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) |
| `packages/place-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) |

## UC09 — Truy cập khu vực quản lý được cấp sẵn

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/DinhTuyenQuanTri.tsx` | Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt. | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) |
| `apps/web/src/app/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx` | Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) |
| `apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin. | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) |
| `apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/web/src/main-admin.tsx` | Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách. | [Mở file](<../apps/web/src/main-admin.tsx>) |
| `apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) |
| `apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/mobile/src/navigation/DieuHuongQuanTri.tsx` | Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt. | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) |
| `apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts` | Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>) |
| `apps/mobile/src/navigation/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) |
| `packages/admin-core/src/domain/HopDongDichVu.ts` | Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình. | [Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>) |
| `packages/admin-core/src/domain/KieuDuLieuQuanTri.ts` | Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung. | [Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>) |
| `packages/admin-core/src/i18n/BanDichGiaoDien.ts` | Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và | [Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/admin-core/src/react/TrangThaiReact.tsx` | Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) |
| `packages/admin-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/admin-core/src/XuatCongKhai.ts>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 41](<../services/database/KhoDuLieuSql.cjs#L41>) |
| `scripts/ChayMobileQuanTri.cjs` | Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) |
| `scripts/ChuyenTiepApiQuanTriMetro.cjs` | Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) |
| `scripts/DongGoiKiemThuQuanTri.cjs` | Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI. | [Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>) |

## UC10 — Quản lý di tích

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/DinhTuyenQuanTri.tsx` | Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt. | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) |
| `apps/web/src/app/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) |
| `apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx` | Sửa ảnh đại diện, danh sách URL và tệp ảnh trong form quản trị web. PlaceFormPage gọi cho cả thêm/sửa/biên tập; phụ thuộc thao tác ảnh admin-core, picker và PlaceImage. TẠI SAO: Hiển thị từng ảnh với nút chọn/xóa để không giữ ảnh cũ ở đầu danh sách ngoài ý muốn. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L24>) |
| `apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx` | Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx#L24>) |
| `apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx` | Form quản trị web để thêm, sửa và biên tập di tích. AdminRoutes/ContentEditorPage gọi; usePlaceEditor giữ cùng nghiệp vụ với mobile. TẠI SAO: File này chỉ dựng HTML, chọn tệp và điều hướng; dữ liệu vẫn qua API chung. | [Mở file tại dòng 36](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx#L36>) |
| `apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx` | Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) |
| `apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin. | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) |
| `apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/web/src/main-admin.tsx` | Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách. | [Mở file](<../apps/web/src/main-admin.tsx>) |
| `apps/web/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 21](<../apps/web/src/shared/components/AnhDiTich.tsx#L21>) |
| `apps/web/src/shared/services/NguonTepTaiNguyen.ts` | Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static. | [Mở file](<../apps/web/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/web/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts. | [Mở file](<../apps/web/src/shared/services/XuLyAnhDiTich.ts>) |
| `apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx` | Hiển thị form thêm/sửa di tích; chuyển thao tác lưu, dịch, tạo audio và gửi duyệt cho hook. | [Mở file tại dòng 51](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx#L51>) |
| `apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx` | Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L27>) |
| `apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx` | Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản lý được cung cấp. | [Mở file tại dòng 30](<../apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx#L30>) |
| `apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx` | Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp. | [Mở file tại dòng 17](<../apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx#L17>) |
| `apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) |
| `apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/mobile/src/navigation/DieuHuongQuanTri.tsx` | Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt. | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) |
| `apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts` | Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>) |
| `apps/mobile/src/navigation/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) |
| `apps/mobile/src/shared/components/AnhBia.tsx` | Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile. | [Mở file tại dòng 26](<../apps/mobile/src/shared/components/AnhBia.tsx#L26>) |
| `apps/mobile/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 23](<../apps/mobile/src/shared/components/AnhDiTich.tsx#L23>) |
| `apps/mobile/src/shared/services/NguonTepTaiNguyen.ts` | Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL. | [Mở file](<../apps/mobile/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/mobile/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu. | [Mở file](<../apps/mobile/src/shared/services/XuLyAnhDiTich.ts>) |
| `packages/admin-core/src/domain/HopDongDichVu.ts` | Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình. | [Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>) |
| `packages/admin-core/src/domain/KiemTraDuLieu.ts` | Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung. | [Mở file tại dòng 21](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L21>) |
| `packages/admin-core/src/domain/KieuDuLieuQuanTri.ts` | Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung. | [Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>) |
| `packages/admin-core/src/domain/XuLyAnhDiTich.ts` | Chuẩn hóa danh sách ảnh, chọn ảnh đại diện và xóa/thay liên kết ảnh trong biểu mẫu. | [Mở file](<../packages/admin-core/src/domain/XuLyAnhDiTich.ts>) |
| `packages/admin-core/src/i18n/BanDichGiaoDien.ts` | Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và | [Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/admin-core/src/react/TrangThaiReact.tsx` | Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) |
| `packages/admin-core/src/react/useBienTapDiTich.ts` | Giữ dữ liệu biểu mẫu; lưu nháp, dịch, tạo audio và gửi duyệt dùng chung cho Web/Mobile. | [Mở file tại dòng 48](<../packages/admin-core/src/react/useBienTapDiTich.ts#L48>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) |
| `packages/admin-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/admin-core/src/XuatCongKhai.ts>) |
| `services/catalog/KiemTraLenhQuanTri.cjs` | Kiểm tra tên lệnh và đối số trước khi API gọi nghiệp vụ quản trị. | [Mở file tại dòng 54](<../services/catalog/KiemTraLenhQuanTri.cjs#L54>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/catalog/XuLyTepTaiNguyen.cjs` | Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố. | [Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/ChayMobileQuanTri.cjs` | Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) |
| `scripts/ChuyenTiepApiQuanTriMetro.cjs` | Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) |
| `scripts/DongGoiKiemThuQuanTri.cjs` | Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI. | [Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>) |

## UC11 — Soạn nội dung thuyết minh đa ngôn ngữ

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/DinhTuyenQuanTri.tsx` | Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt. | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) |
| `apps/web/src/app/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) |
| `apps/web/src/features/admin/content/components/NgheThuBanThu.tsx` | Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt. | [Mở file tại dòng 18](<../apps/web/src/features/admin/content/components/NgheThuBanThu.tsx#L18>) |
| `apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx` | Mở cùng form đầy đủ với màn thêm di tích. AdminRoutes gọi; PlaceFormPage đọc id trên URL và tải bản nháp từ SQL. TẠI SAO: Chỉ một form quản lý metadata, nội dung, dịch và audio để tránh hai màn bị lệch. | [Mở file](<../apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx>) |
| `apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx` | Sửa ảnh đại diện, danh sách URL và tệp ảnh trong form quản trị web. PlaceFormPage gọi cho cả thêm/sửa/biên tập; phụ thuộc thao tác ảnh admin-core, picker và PlaceImage. TẠI SAO: Hiển thị từng ảnh với nút chọn/xóa để không giữ ảnh cũ ở đầu danh sách ngoài ý muốn. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L24>) |
| `apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx` | Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx#L24>) |
| `apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx` | Form quản trị web để thêm, sửa và biên tập di tích. AdminRoutes/ContentEditorPage gọi; usePlaceEditor giữ cùng nghiệp vụ với mobile. TẠI SAO: File này chỉ dựng HTML, chọn tệp và điều hướng; dữ liệu vẫn qua API chung. | [Mở file tại dòng 36](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx#L36>) |
| `apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx` | Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) |
| `apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin. | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) |
| `apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/web/src/main-admin.tsx` | Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách. | [Mở file](<../apps/web/src/main-admin.tsx>) |
| `apps/web/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 21](<../apps/web/src/shared/components/AnhDiTich.tsx#L21>) |
| `apps/web/src/shared/services/NguonTepTaiNguyen.ts` | Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static. | [Mở file](<../apps/web/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/web/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts. | [Mở file](<../apps/web/src/shared/services/XuLyAnhDiTich.ts>) |
| `apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx` | Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt. | [Mở file tại dòng 32](<../apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx#L32>) |
| `apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx` | Mở cùng form đầy đủ từ nút Biên tập, không giữ một form riêng thiếu metadata. AdminNavigator gọi; PlaceEditor dùng chung logic lưu nháp/dịch/audio/gửi duyệt với web. | [Mở file tại dòng 16](<../apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx#L16>) |
| `apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx` | Hiển thị form thêm/sửa di tích; chuyển thao tác lưu, dịch, tạo audio và gửi duyệt cho hook. | [Mở file tại dòng 51](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx#L51>) |
| `apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx` | Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L27>) |
| `apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx` | Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản lý được cung cấp. | [Mở file tại dòng 30](<../apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx#L30>) |
| `apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx` | Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp. | [Mở file tại dòng 17](<../apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx#L17>) |
| `apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) |
| `apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/mobile/src/navigation/DieuHuongQuanTri.tsx` | Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt. | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) |
| `apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts` | Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>) |
| `apps/mobile/src/navigation/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) |
| `apps/mobile/src/shared/components/AnhBia.tsx` | Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile. | [Mở file tại dòng 26](<../apps/mobile/src/shared/components/AnhBia.tsx#L26>) |
| `apps/mobile/src/shared/components/AnhDiTich.tsx` | Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được. | [Mở file tại dòng 23](<../apps/mobile/src/shared/components/AnhDiTich.tsx#L23>) |
| `apps/mobile/src/shared/services/NguonTepTaiNguyen.ts` | Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL. | [Mở file](<../apps/mobile/src/shared/services/NguonTepTaiNguyen.ts>) |
| `apps/mobile/src/shared/services/XuLyAnhDiTich.ts` | Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu. | [Mở file](<../apps/mobile/src/shared/services/XuLyAnhDiTich.ts>) |
| `packages/visitor-core/src/audio/DieuKhienNgheThu.ts` | Điều khiển nghe thử bản thu trong biên tập và kiểm duyệt, dùng chung bộ điều phối quyền phát. | [Mở file tại dòng 38](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L38>) |
| `packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts` | Điều phối quyền phát để nguồn mới yêu cầu nguồn đang giữ quyền tạm dừng; dùng cả nghe thuyết minh và nghe thử. | [Mở file tại dòng 18](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts#L18>) |
| `packages/admin-core/src/domain/HopDongDichVu.ts` | Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình. | [Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>) |
| `packages/admin-core/src/domain/KiemTraDuLieu.ts` | Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung. | [Mở file tại dòng 21](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L21>) |
| `packages/admin-core/src/domain/KieuDuLieuQuanTri.ts` | Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung. | [Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>) |
| `packages/admin-core/src/domain/XuLyAnhDiTich.ts` | Chuẩn hóa danh sách ảnh, chọn ảnh đại diện và xóa/thay liên kết ảnh trong biểu mẫu. | [Mở file](<../packages/admin-core/src/domain/XuLyAnhDiTich.ts>) |
| `packages/admin-core/src/i18n/BanDichGiaoDien.ts` | Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và | [Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/admin-core/src/react/TrangThaiReact.tsx` | Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) |
| `packages/admin-core/src/react/useBienTapDiTich.ts` | Giữ dữ liệu biểu mẫu; lưu nháp, dịch, tạo audio và gửi duyệt dùng chung cho Web/Mobile. | [Mở file tại dòng 32](<../packages/admin-core/src/react/useBienTapDiTich.ts#L32>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) |
| `packages/admin-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/admin-core/src/XuatCongKhai.ts>) |
| `services/catalog/KiemTraLenhQuanTri.cjs` | Kiểm tra tên lệnh và đối số trước khi API gọi nghiệp vụ quản trị. | [Mở file tại dòng 54](<../services/catalog/KiemTraLenhQuanTri.cjs#L54>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/catalog/TaoAmThanhThuyetMinh.cjs` | Tạo hoặc lấy bản MP3 từ nội dung và ngôn ngữ đã chọn để chuẩn bị bản thu thuyết minh. | [Mở file tại dòng 26](<../services/catalog/TaoAmThanhThuyetMinh.cjs#L26>) |
| `services/catalog/ThuatNguDich.cjs` | Cung cấp thuật ngữ để giữ tên di tích và thuật ngữ lịch sử nhất quán khi dịch nội dung. | [Mở file](<../services/catalog/ThuatNguDich.cjs>) |
| `services/catalog/TuDongDich.cjs` | Dịch văn bản sang ngôn ngữ đích qua dịch vụ ngoài; chia đoạn và chuẩn hóa kết quả dịch. | [Mở file tại dòng 17](<../services/catalog/TuDongDich.cjs#L17>) |
| `services/catalog/XuLyTepTaiNguyen.cjs` | Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố. | [Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/CapNhatNoiDungDiSan.cjs` | Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng | [Mở file](<../scripts/CapNhatNoiDungDiSan.cjs>) |
| `scripts/ChayMobileQuanTri.cjs` | Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) |
| `scripts/ChuyenTiepApiQuanTriMetro.cjs` | Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) |
| `scripts/DongGoiKiemThuQuanTri.cjs` | Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI. | [Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>) |

## UC12 — Kiểm duyệt nội dung và âm thanh

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/DinhTuyenQuanTri.tsx` | Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt. | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) |
| `apps/web/src/app/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) |
| `apps/web/src/features/admin/content/components/NgheThuBanThu.tsx` | Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt. | [Mở file tại dòng 18](<../apps/web/src/features/admin/content/components/NgheThuBanThu.tsx#L18>) |
| `apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx` | Mở cùng form đầy đủ với màn thêm di tích. AdminRoutes gọi; PlaceFormPage đọc id trên URL và tải bản nháp từ SQL. TẠI SAO: Chỉ một form quản lý metadata, nội dung, dịch và audio để tránh hai màn bị lệch. | [Mở file](<../apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx>) |
| `apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx` | Sửa ảnh đại diện, danh sách URL và tệp ảnh trong form quản trị web. PlaceFormPage gọi cho cả thêm/sửa/biên tập; phụ thuộc thao tác ảnh admin-core, picker và PlaceImage. TẠI SAO: Hiển thị từng ảnh với nút chọn/xóa để không giữ ảnh cũ ở đầu danh sách ngoài ý muốn. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L24>) |
| `apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx` | Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx#L24>) |
| `apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx` | Form quản trị web để thêm, sửa và biên tập di tích. AdminRoutes/ContentEditorPage gọi; usePlaceEditor giữ cùng nghiệp vụ với mobile. TẠI SAO: File này chỉ dựng HTML, chọn tệp và điều hướng; dữ liệu vẫn qua API chung. | [Mở file tại dòng 36](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx#L36>) |
| `apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx` | Danh sách hồ sơ kiểm duyệt dạng thẻ ảnh; mở một hồ sơ để xem và xử lý. AdminRoutes gọi; dùng API admin chung, không tự duyệt/công bố khi chỉ mở thẻ. TẠI SAO: Không tải trình nghe và toàn bộ bài của mọi di tích vào cùng một màn dài. | [Mở file tại dòng 24](<../apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx#L24>) |
| `apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx` | Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) |
| `apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin. | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) |
| `apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/web/src/main-admin.tsx` | Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách. | [Mở file](<../apps/web/src/main-admin.tsx>) |
| `apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx` | Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt. | [Mở file tại dòng 32](<../apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx#L32>) |
| `apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx` | Mở cùng form đầy đủ từ nút Biên tập, không giữ một form riêng thiếu metadata. AdminNavigator gọi; PlaceEditor dùng chung logic lưu nháp/dịch/audio/gửi duyệt với web. | [Mở file tại dòng 16](<../apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx#L16>) |
| `apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx` | Hiển thị form thêm/sửa di tích; chuyển thao tác lưu, dịch, tạo audio và gửi duyệt cho hook. | [Mở file tại dòng 51](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx#L51>) |
| `apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx` | Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L27>) |
| `apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx` | Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản lý được cung cấp. | [Mở file tại dòng 30](<../apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx#L30>) |
| `apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx` | Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp. | [Mở file tại dòng 17](<../apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx#L17>) |
| `apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx` | Xem đầy đủ một hồ sơ rồi duyệt, yêu cầu sửa hoặc công bố. ReviewsScreen mở qua mã id; dùng cùng API/revision với web, không tự công bố khi xem. | [Mở file tại dòng 35](<../apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx#L35>) |
| `apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx` | Hàng chờ kiểm duyệt native chỉ hiển thị ảnh/tên/trạng thái. AdminNavigator gọi; bấm thẻ mở ReviewDetailScreen để xem bài và thao tác duyệt. TẠI SAO: FlatList nhẹ hơn việc mở sẵn mọi bài và trình nghe cùng lúc. | [Mở file tại dòng 24](<../apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx#L24>) |
| `apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) |
| `apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/mobile/src/navigation/DieuHuongQuanTri.tsx` | Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt. | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) |
| `apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts` | Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>) |
| `apps/mobile/src/navigation/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) |
| `packages/visitor-core/src/audio/DieuKhienNgheThu.ts` | Điều khiển nghe thử bản thu trong biên tập và kiểm duyệt, dùng chung bộ điều phối quyền phát. | [Mở file tại dòng 38](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L38>) |
| `packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts` | Điều phối quyền phát để nguồn mới yêu cầu nguồn đang giữ quyền tạm dừng; dùng cả nghe thuyết minh và nghe thử. | [Mở file tại dòng 18](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts#L18>) |
| `packages/admin-core/src/domain/HopDongDichVu.ts` | Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình. | [Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>) |
| `packages/admin-core/src/domain/KiemTraDuLieu.ts` | Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung. | [Mở file tại dòng 78](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L78>) |
| `packages/admin-core/src/domain/KieuDuLieuQuanTri.ts` | Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung. | [Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>) |
| `packages/admin-core/src/i18n/BanDichGiaoDien.ts` | Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và | [Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/admin-core/src/react/TrangThaiReact.tsx` | Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) |
| `packages/admin-core/src/react/useBienTapDiTich.ts` | Giữ dữ liệu biểu mẫu; lưu nháp, dịch, tạo audio và gửi duyệt dùng chung cho Web/Mobile. | [Mở file tại dòng 48](<../packages/admin-core/src/react/useBienTapDiTich.ts#L48>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) |
| `packages/admin-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/admin-core/src/XuatCongKhai.ts>) |
| `services/catalog/KiemTraLenhQuanTri.cjs` | Kiểm tra tên lệnh và đối số trước khi API gọi nghiệp vụ quản trị. | [Mở file tại dòng 54](<../services/catalog/KiemTraLenhQuanTri.cjs#L54>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/catalog/XuLyTepTaiNguyen.cjs` | Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố. | [Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/ChayMobileQuanTri.cjs` | Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) |
| `scripts/ChuyenTiepApiQuanTriMetro.cjs` | Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) |
| `scripts/DongGoiKiemThuQuanTri.cjs` | Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI. | [Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>) |

## UC13 — Công bố phiên bản đã duyệt

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/DinhTuyenQuanTri.tsx` | Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt. | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) |
| `apps/web/src/app/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) |
| `apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx` | Danh sách hồ sơ kiểm duyệt dạng thẻ ảnh; mở một hồ sơ để xem và xử lý. AdminRoutes gọi; dùng API admin chung, không tự duyệt/công bố khi chỉ mở thẻ. TẠI SAO: Không tải trình nghe và toàn bộ bài của mọi di tích vào cùng một màn dài. | [Mở file tại dòng 24](<../apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx#L24>) |
| `apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx` | Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) |
| `apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin. | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) |
| `apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/web/src/main-admin.tsx` | Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách. | [Mở file](<../apps/web/src/main-admin.tsx>) |
| `apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx` | Xem đầy đủ một hồ sơ rồi duyệt, yêu cầu sửa hoặc công bố. ReviewsScreen mở qua mã id; dùng cùng API/revision với web, không tự công bố khi xem. | [Mở file tại dòng 35](<../apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx#L35>) |
| `apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx` | Hàng chờ kiểm duyệt native chỉ hiển thị ảnh/tên/trạng thái. AdminNavigator gọi; bấm thẻ mở ReviewDetailScreen để xem bài và thao tác duyệt. TẠI SAO: FlatList nhẹ hơn việc mở sẵn mọi bài và trình nghe cùng lúc. | [Mở file tại dòng 24](<../apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx#L24>) |
| `apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) |
| `apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/mobile/src/navigation/DieuHuongQuanTri.tsx` | Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt. | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) |
| `apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts` | Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>) |
| `apps/mobile/src/navigation/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) |
| `packages/admin-core/src/domain/HopDongDichVu.ts` | Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình. | [Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>) |
| `packages/admin-core/src/domain/KiemTraDuLieu.ts` | Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung. | [Mở file tại dòng 78](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L78>) |
| `packages/admin-core/src/domain/KieuDuLieuQuanTri.ts` | Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung. | [Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>) |
| `packages/admin-core/src/i18n/BanDichGiaoDien.ts` | Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và | [Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/admin-core/src/react/TrangThaiReact.tsx` | Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) |
| `packages/admin-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/admin-core/src/XuatCongKhai.ts>) |
| `services/catalog/KiemTraLenhQuanTri.cjs` | Kiểm tra tên lệnh và đối số trước khi API gọi nghiệp vụ quản trị. | [Mở file tại dòng 54](<../services/catalog/KiemTraLenhQuanTri.cjs#L54>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/catalog/XuLyTepTaiNguyen.cjs` | Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố. | [Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/ChayMobileQuanTri.cjs` | Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) |
| `scripts/ChuyenTiepApiQuanTriMetro.cjs` | Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) |
| `scripts/DongGoiKiemThuQuanTri.cjs` | Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI. | [Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>) |

## UC14 — Theo dõi hoạt động và lượt vào từ QR

| File | Vai trò trong UC | Vị trí |
|---|---|---|
| `apps/web/src/app/DinhTuyenQuanTri.tsx` | Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt. | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) |
| `apps/web/src/app/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) |
| `apps/web/src/features/admin/dashboard/TrangTongQuan.tsx` | Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng để hiển thị bốn chỉ số. | [Mở file tại dòng 24](<../apps/web/src/features/admin/dashboard/TrangTongQuan.tsx#L24>) |
| `apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx` | Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) |
| `apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) |
| `apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin. | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) |
| `apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts` | Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState. | [Mở file tại dòng 26](<../apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts#L26>) |
| `apps/web/src/features/presence/services/PhienHoatDong.ts` | Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin. | [Mở file](<../apps/web/src/features/presence/services/PhienHoatDong.ts>) |
| `apps/web/src/main-admin.tsx` | Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách. | [Mở file](<../apps/web/src/main-admin.tsx>) |
| `apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx` | Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên kết đến thao tác quản lý. | [Mở file tại dòng 35](<../apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx#L35>) |
| `apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx` | Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) |
| `apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts` | Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core. | [Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>) |
| `apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts` | Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState. | [Mở file tại dòng 31](<../apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts#L31>) |
| `apps/mobile/src/features/presence/services/PhienHoatDong.ts` | Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin. | [Mở file](<../apps/mobile/src/features/presence/services/PhienHoatDong.ts>) |
| `apps/mobile/src/navigation/DieuHuongQuanTri.tsx` | Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt. | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) |
| `apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts` | Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route. | [Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>) |
| `apps/mobile/src/navigation/UngDungQuanTri.tsx` | Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) |
| `packages/visitor-core/src/presence/PhienHoatDong.ts` | Hợp đồng và HTTP client thống kê dùng chung; gửi heartbeat ngay rồi lặp sau 30 giây, xử lý | [Mở file tại dòng 22](<../packages/visitor-core/src/presence/PhienHoatDong.ts#L22>) |
| `packages/visitor-core/src/presence/TheoDoiPhienReact.ts` | Hook đọc thống kê định kỳ cho admin; quản lý tải, lỗi, thử lại và dừng lịch khi component rời | [Mở file tại dòng 15](<../packages/visitor-core/src/presence/TheoDoiPhienReact.ts#L15>) |
| `packages/admin-core/src/domain/HopDongDichVu.ts` | Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình. | [Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>) |
| `packages/admin-core/src/domain/KiemTraDuLieu.ts` | Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung. | [Mở file tại dòng 97](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L97>) |
| `packages/admin-core/src/domain/KieuDuLieuQuanTri.ts` | Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung. | [Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>) |
| `packages/admin-core/src/i18n/BanDichGiaoDien.ts` | Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và | [Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>) |
| `packages/admin-core/src/react/TrangThaiReact.tsx` | Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) |
| `packages/admin-core/src/services/GoiApiQuanTri.ts` | Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) |
| `packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts` | Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) |
| `packages/admin-core/src/XuatCongKhai.ts` | Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập. | [Mở file](<../packages/admin-core/src/XuatCongKhai.ts>) |
| `services/catalog/MayChuApi.cjs` | Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) |
| `services/presence/.test-build/client.cjs` | Cung cấp thành phần hạ tầng hoặc dữ liệu hỗ trợ các chức năng của ứng dụng. | [Mở file tại dòng 33](<../services/presence/.test-build/client.cjs#L33>) |
| `services/presence/MayChuApi.cjs` | Nhận heartbeat/kết thúc phiên và trả số phiên còn hoạt động từ SQL Server. | [Mở file tại dòng 19](<../services/presence/MayChuApi.cjs#L19>) |
| `services/database/AnhXaMuoiMotBang.cjs` | Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt. | [Mở file](<../services/database/AnhXaMuoiMotBang.cjs>) |
| `services/database/CanhBaoNangCapTepCu.cjs` | Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng. | [Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>) |
| `services/database/CauHinhSqlServer.cjs` | Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile. | [Mở file](<../services/database/CauHinhSqlServer.cjs>) |
| `services/database/ChayNangCapDatabase.cjs` | Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file. | [Mở file](<../services/database/ChayNangCapDatabase.cjs>) |
| `services/database/ChuyenDoiMaDuLieu.cjs` | Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại. | [Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>) |
| `services/database/ChuyenSangMuoiMotBang.cjs` | Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration. | [Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>) |
| `services/database/DauMoiTuongThichDuLieu.cjs` | Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng. | [Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>) |
| `services/database/DocDuLieuPhienBanCu.cjs` | Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) |
| `services/database/HoTroKiemThuDatabase.cjs` | Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng. | [Mở file](<../services/database/HoTroKiemThuDatabase.cjs>) |
| `services/database/KetNoiSqlServer.cjs` | Quản lý pool kết nối SQL Server và database kiểm thử riêng. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) |
| `services/database/KhoDuLieuSql.cjs` | Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) |
| `services/database/LuuVaDocTepSql.cjs` | Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp. | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) |
| `services/database/NhapDuLieuKhoiTao.cjs` | Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file. | [Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>) |
| `scripts/ChayMobileQuanTri.cjs` | Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) |
| `scripts/ChuyenTiepApiQuanTriMetro.cjs` | Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) |
| `scripts/DongGoiKiemThuQuanTri.cjs` | Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI. | [Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>) |

## Các đoạn xử lý trong từng file

### apps/web/src/app/App.tsx

Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route.

[Mở file](<../apps/web/src/app/App.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `App` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] App — Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết | [Mở file tại dòng 26](<../apps/web/src/app/App.tsx#L26>) (26–30) |

### apps/web/src/app/DinhTuyenDuKhach.tsx

Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy.

[Mở file](<../apps/web/src/app/DinhTuyenDuKhach.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `JourneyRoute` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] JourneyRoute — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider JourneyRoute. | [Mở file tại dòng 38](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L38>) (38–46) |
| `AppRoutes` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] AppRoutes — Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết. | [Mở file tại dòng 51](<../apps/web/src/app/DinhTuyenDuKhach.tsx#L51>) (51–63) |

### apps/web/src/app/DinhTuyenQuanTri.tsx

Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt.

[Mở file](<../apps/web/src/app/DinhTuyenQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminRoutes` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminRoutes — Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm | [Mở file tại dòng 28](<../apps/web/src/app/DinhTuyenQuanTri.tsx#L28>) (28–43) |

### apps/web/src/app/UngDungQuanTri.tsx

Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.

[Mở file](<../apps/web/src/app/UngDungQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminApp` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminApp — Ghép luồng admin của nền tảng. | [Mở file tại dòng 22](<../apps/web/src/app/UngDungQuanTri.tsx#L22>) (22–33) |

### apps/web/src/features/admin/content/components/NgheThuBanThu.tsx

Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt.

[Mở file](<../apps/web/src/features/admin/content/components/NgheThuBanThu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AudioPreview` | [UC11 / UC12] AudioPreview — Hiển thị điều khiển nghe thử bản thu phục vụ biên tập hoặc kiểm duyệt. | [Mở file tại dòng 18](<../apps/web/src/features/admin/content/components/NgheThuBanThu.tsx#L18>) (18–48) |

### apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx

Mở cùng form đầy đủ với màn thêm di tích. AdminRoutes gọi; PlaceFormPage đọc id trên URL và tải bản nháp từ SQL. TẠI SAO: Chỉ một form quản lý metadata, nội dung, dịch và audio để tránh hai màn bị lệch.

[Mở file](<../apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/admin/dashboard/TrangTongQuan.tsx

Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng để hiển thị bốn chỉ số.

[Mở file](<../apps/web/src/features/admin/dashboard/TrangTongQuan.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `DashboardPage` | [UC14] DashboardPage — Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng | [Mở file tại dòng 24](<../apps/web/src/features/admin/dashboard/TrangTongQuan.tsx#L24>) (24–130) |

### apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx

Sửa ảnh đại diện, danh sách URL và tệp ảnh trong form quản trị web. PlaceFormPage gọi cho cả thêm/sửa/biên tập; phụ thuộc thao tác ảnh admin-core, picker và PlaceImage. TẠI SAO: Hiển thị từng ảnh với nút chọn/xóa để không giữ ảnh cũ ở đầu danh sách ngoài ý muốn.

[Mở file](<../apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceImagesEditor` | [UC10 / UC11 / UC12] PlaceImagesEditor — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L24>) (24–96) |

### apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx

Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.

[Mở file](<../apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminPlacesPage` | [UC10 / UC11 / UC12] AdminPlacesPage — Trang danh sách địa điểm. | [Mở file tại dòng 24](<../apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx#L24>) (24–138) |

### apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx

Form quản trị web để thêm, sửa và biên tập di tích. AdminRoutes/ContentEditorPage gọi; usePlaceEditor giữ cùng nghiệp vụ với mobile. TẠI SAO: File này chỉ dựng HTML, chọn tệp và điều hướng; dữ liệu vẫn qua API chung.

[Mở file](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceFormPage` | [UC10 / UC11 / UC12] PlaceFormPage — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceFormPage. | [Mở file tại dòng 36](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx#L36>) (36–44) |
| `PlaceForm` | [UC10 / UC11 / UC12] PlaceForm — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceForm. | [Mở file tại dòng 48](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx#L48>) (48–399) |
| `perform` | [UC10 / UC11 / UC12] perform — Sau khi tạo thành công, URL trỏ vào đúng bản nháp vừa lưu. | [Mở file tại dòng 89](<../apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx#L89>) (89–97) |

### apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx

Danh sách hồ sơ kiểm duyệt dạng thẻ ảnh; mở một hồ sơ để xem và xử lý. AdminRoutes gọi; dùng API admin chung, không tự duyệt/công bố khi chỉ mở thẻ. TẠI SAO: Không tải trình nghe và toàn bộ bài của mọi di tích vào cùng một màn dài.

[Mở file](<../apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ReviewsPage` | [UC12 / UC13] ReviewsPage — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewsPage. | [Mở file tại dòng 24](<../apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx#L24>) (24–90) |
| `ReviewDetailPage` | [UC12 / UC13] ReviewDetailPage — URL chi tiết giữ mã hồ sơ nên tải lại trang vẫn mở đúng di tích. | [Mở file tại dòng 94](<../apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx#L94>) (94–114) |
| `ReviewDetails` | [UC12 / UC13] ReviewDetails — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewDetails. | [Mở file tại dòng 118](<../apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx#L118>) (118–245) |

### apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx

Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất.

[Mở file](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminIcon` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminIcon — Vẽ icon bằng một hệ nét và kích thước thống nhất. | [Mở file tại dòng 34](<../apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx#L34>) (34–136) |

### apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx

Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.

[Mở file](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `LocalMediaPicker` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] LocalMediaPicker — Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp | [Mở file tại dòng 22](<../apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L22>) (22–76) |

### apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx

Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động.

[Mở file](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Status` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] Status — Hiển thị nhãn trạng thái nội dung. | [Mở file tại dòng 23](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L23>) (23–26) |
| `Feedback` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] Feedback — Hiển thị kết quả tải/lưu hoặc lỗi của thao tác quản trị. | [Mở file tại dòng 33](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L33>) (33–58) |
| `Field` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] Field — Ghép nhãn, ô nhập và giá trị của một trường form. | [Mở file tại dòng 65](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L65>) (65–72) |
| `useUnsaved` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] useUnsaved — Bảo vệ thay đổi khi đóng/tải lại tab và bấm liên kết rời form. | [Mở file tại dòng 79](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L79>) (79–124) |
| `useConfirmation` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] useConfirmation — Hộp xác nhận trong app, không dùng hộp modal chặn của trình duyệt. | [Mở file tại dòng 132](<../apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L132>) (132–170) |

### apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx

Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin.

[Mở file](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminLayout` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminLayout — Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung | [Mở file tại dòng 29](<../apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx#L29>) (29–116) |

### apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts

Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.

[Mở file](<../apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx

Danh mục web gồm tìm kiếm, danh mục/khu vực, sắp xếp, chế độ lưới/danh sách và phân trang.

[Mở file](<../apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Catalogue` | [UC02 / UC03] Catalogue — Sidebar lọc, kết quả, đổi bố cục và phân trang. | [Mở file tại dòng 27](<../apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx#L27>) (27–359) |
| `changeCategories` | [UC02 / UC03] changeCategories — Checkbox và chip hero luôn thể hiện cùng một lựa chọn. | [Mở file tại dòng 67](<../apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx#L67>) (67–71) |

### apps/web/src/features/explore/components/NutLocDanhMuc.tsx

Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.

[Mở file](<../apps/web/src/features/explore/components/NutLocDanhMuc.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `CategoryChips` | [UC02 / UC03] CategoryChips — Chip danh mục ở hero. | [Mở file tại dòng 19](<../apps/web/src/features/explore/components/NutLocDanhMuc.tsx#L19>) (19–53) |

### apps/web/src/features/explore/components/TheDiTich.tsx

Hiển thị thẻ di tích có toàn bộ vùng bấm mở trang chi tiết và phần nghe thuyết minh.

[Mở file](<../apps/web/src/features/explore/components/TheDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceCard` | [UC02 / UC03] PlaceCard — Card địa điểm trong carousel/lưới/danh sách. | [Mở file tại dòng 24](<../apps/web/src/features/explore/components/TheDiTich.tsx#L24>) (24–72) |

### apps/web/src/features/explore/hooks/useDanhSachDiTich.ts

Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây.

[Mở file](<../apps/web/src/features/explore/hooks/useDanhSachDiTich.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/explore/pages/TrangChu.tsx

Trang chủ web với hero, ô tìm kiếm, danh mục, carousel điểm nổi bật và danh mục bên dưới.

[Mở file](<../apps/web/src/features/explore/pages/TrangChu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `HomePage` | [UC02 / UC03] HomePage — Trang chủ gồm hero, carousel và danh sách. | [Mở file tại dòng 28](<../apps/web/src/features/explore/pages/TrangChu.tsx#L28>) (28–343) |
| `submit` | [UC02 / UC03] submit — Chuyển điều kiện tìm từ hero sang trang kết quả. | [Mở file tại dòng 139](<../apps/web/src/features/explore/pages/TrangChu.tsx#L139>) (139–161) |

### apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx

Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.

[Mở file](<../apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlacesPage` | [UC02 / UC03] PlacesPage — Đọc điều kiện ban đầu từ URL. | [Mở file tại dòng 20](<../apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx#L20>) (20–37) |

### apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts

Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage.

[Mở file](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `watch` | [UC06.1] watch — Xin/kiểm tra quyền vị trí, đăng ký nhận GPS và trả hàm dừng theo dõi cho controller. | [Mở file tại dòng 30](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L30>) (30–47) |
| `open` | [UC07] open — Mở nguồn audio của nền tảng và cung cấp play/pause/seek/rate/listen cho controller chung. | [Mở file tại dòng 55](<../apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L55>) (55–193) |

### apps/web/src/features/journey/adapters/NguonAmThanh.ts

Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web. Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL.

[Mở file](<../apps/web/src/features/journey/adapters/NguonAmThanh.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/journey/components/BanDoThamQuan.tsx

Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.

[Mở file](<../apps/web/src/features/journey/components/BanDoThamQuan.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `VisitorMap` | [UC08] VisitorMap — Hiển thị marker, vị trí và các thao tác chọn di tích/mở bản đồ ngoài. | [Mở file tại dòng 25](<../apps/web/src/features/journey/components/BanDoThamQuan.tsx#L25>) (25–146) |

### apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx

Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.

[Mở file](<../apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ListenButton` | [UC07] ListenButton — Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh | [Mở file tại dòng 20](<../apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx#L20>) (20–51) |
| `toggle` | [UC07] toggle — Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu. | [Mở file tại dòng 37](<../apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx#L37>) (37–41) |

### apps/web/src/features/journey/components/TrangThaiDinhVi.tsx

Thẻ trạng thái định vị trong trang bản đồ, dựa trên dữ liệu thật. JourneyPage gọi; không xin quyền, không bật GPS hoặc phát âm thanh khi render.

[Mở file](<../apps/web/src/features/journey/components/TrangThaiDinhVi.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `GpsStatus` | [UC06 / UC06.1] GpsStatus — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus. | [Mở file tại dòng 19](<../apps/web/src/features/journey/components/TrangThaiDinhVi.tsx#L19>) (19–47) |

### apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx

Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung.

[Mở file](<../apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `JourneyPlayer` | [UC07] JourneyPlayer — Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác | [Mở file tại dòng 28](<../apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx#L28>) (28–256) |
| `toggle` | [UC07] toggle — Thao tác đều gọi audio thật, không tăng thời gian bằng timer UI. | [Mở file tại dòng 57](<../apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx#L57>) (57–63) |

### apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts

Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.

[Mở file](<../apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `useJourneyNavigation` | [UC06] useJourneyNavigation — Theo dõi gợi ý để điều hướng tới chi tiết di tích phù hợp. | [Mở file tại dòng 19](<../apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts#L19>) (19–50) |

### apps/web/src/features/journey/hooks/useHanhTrinh.ts

Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.

[Mở file](<../apps/web/src/features/journey/hooks/useHanhTrinh.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/journey/pages/TrangHanhTrinh.tsx

Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo.

[Mở file](<../apps/web/src/features/journey/pages/TrangHanhTrinh.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `JourneyPage` | [UC06 / UC07 / UC08] JourneyPage — Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham | [Mở file tại dòng 32](<../apps/web/src/features/journey/pages/TrangHanhTrinh.tsx#L32>) (32–256) |
| `locate` | [UC06 / UC07 / UC08] locate — Định vị công trình ngay trên bản đồ trong trang. | [Mở file tại dòng 50](<../apps/web/src/features/journey/pages/TrangHanhTrinh.tsx#L50>) (50–66) |

### apps/web/src/features/language/components/ChonNgonNgu.tsx

Bộ chọn ngôn ngữ trên web; cập nhật lựa chọn trong provider để giao diện dịch lại.

[Mở file](<../apps/web/src/features/language/components/ChonNgonNgu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `LanguagePicker` | [UC01] LanguagePicker — Dropdown chọn ngôn ngữ. | [Mở file tại dòng 19](<../apps/web/src/features/language/components/ChonNgonNgu.tsx#L19>) (19–47) |

### apps/web/src/features/language/hooks/useDuKhach.ts

Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.

[Mở file](<../apps/web/src/features/language/hooks/useDuKhach.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/language/i18n/CauHinhNgonNgu.ts

Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.

[Mở file](<../apps/web/src/features/language/i18n/CauHinhNgonNgu.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx

Trang chi tiết du khách với ảnh, bài đọc và hai thao tác nghe/bản đồ. AppRoutes gọi; dùng usePublishedPlace, useVisitor và ListenButton hiện có. TẠI SAO: Phần trình bày tách khỏi service; đổi bố cục không đổi nội dung SQL hay bộ phát audio.

[Mở file](<../apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `DetailPage` | [UC04 / UC07 / UC08] DetailPage — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider DetailPage. | [Mở file tại dòng 28](<../apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx#L28>) (28–107) |

### apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts

Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState.

[Mở file](<../apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `getSessionId` | [UC14] getSessionId — Giữ một mã phiên ẩn danh ổn định khi tải lại trang. | [Mở file tại dòng 26](<../apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts#L26>) (26–47) |
| `usePresenceHeartbeat` | [UC14] usePresenceHeartbeat — Theo dõi vòng đời nền tảng để báo hoặc kết thúc phiên hoạt động. | [Mở file tại dòng 54](<../apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts#L54>) (54–106) |

### apps/web/src/features/presence/services/PhienHoatDong.ts

Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.

[Mở file](<../apps/web/src/features/presence/services/PhienHoatDong.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts

Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.

[Mở file](<../apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `useGateEntry` | [UC05] useGateEntry — Nhận liên kết vào cổng và gửi lượt QR nền; giữ visitId để hạn chế ghi trùng. | [Mở file tại dòng 43](<../apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts#L43>) (43–58) |

### apps/web/src/main-admin.tsx

Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách.

[Mở file](<../apps/web/src/main-admin.tsx>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/main.tsx

Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML.

[Mở file](<../apps/web/src/main.tsx>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/shared/components/AnhDiTich.tsx

Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.

[Mở file](<../apps/web/src/shared/components/AnhDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceImage` | [UC02 / UC04 / UC10 / UC11] PlaceImage — Ảnh có dự phòng. | [Mở file tại dòng 21](<../apps/web/src/shared/components/AnhDiTich.tsx#L21>) (21–50) |

### apps/web/src/shared/components/BaoVeLoiTrang.tsx

Giữ trang có thông báo thử lại nếu tải module bản đồ thất bại vì mạng. AppRoutes bọc trang tải theo nhu cầu; State cung cấp nhãn đã dịch và nút thử lại thật. TẠI SAO: Suspense chỉ xử lý đang tải; lỗi tải chunk cần boundary để không làm trắng toàn app.

[Mở file](<../apps/web/src/shared/components/BaoVeLoiTrang.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `RouteBoundary` | [HỖ TRỢ CHUNG] RouteBoundary — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider RouteBoundary. | [Mở file tại dòng 13](<../apps/web/src/shared/components/BaoVeLoiTrang.tsx#L13>) (13–23) |

### apps/web/src/shared/components/BieuTrungDiSan.tsx

Dấu hiệu cổng cung đình bằng SVG, dùng tại Navbar và AdminLayout. TẠI SAO: Logo vector sắc nét ở mọi kích thước, không phụ thuộc emoji/font của thiết bị.

[Mở file](<../apps/web/src/shared/components/BieuTrungDiSan.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `HeritageMark` | [HỖ TRỢ CHUNG] HeritageMark — Dấu hiệu cổng cung đình bằng SVG, dùng tại Navbar và AdminLayout. TẠI SAO: Logo vector sắc nét ở mọi kích thước, không phụ thuộc emoji/font của thiết bị. | [Mở file tại dòng 10](<../apps/web/src/shared/components/BieuTrungDiSan.tsx#L10>) (10–23) |

### apps/web/src/shared/components/BieuTuong.tsx

Các biểu tượng SVG dùng lại trong website du khách.

[Mở file](<../apps/web/src/shared/components/BieuTuong.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Icon` | [HỖ TRỢ CHUNG] Icon — Icon SVG nhỏ để không thêm framework UI. | [Mở file tại dòng 14](<../apps/web/src/shared/components/BieuTuong.tsx#L14>) (14–166) |

### apps/web/src/shared/components/TrangThaiDuLieu.tsx

Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.

[Mở file](<../apps/web/src/shared/components/TrangThaiDuLieu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `State` | [HỖ TRỢ CHUNG] State — Hiển thị tải/lỗi/thử lại. | [Mở file tại dòng 18](<../apps/web/src/shared/components/TrangThaiDuLieu.tsx#L18>) (18–50) |

### apps/web/src/shared/layouts/BoCucDuKhach.tsx

Khung website du khách ghép thanh điều hướng, nội dung route và các thành phần dùng chung của trang.

[Mở file](<../apps/web/src/shared/layouts/BoCucDuKhach.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AppLayout` | [HỖ TRỢ CHUNG] AppLayout — Giữ layout/player khi route con đổi; chỉ nội dung Outlet thay đổi. | [Mở file tại dòng 20](<../apps/web/src/shared/layouts/BoCucDuKhach.tsx#L20>) (20–53) |

### apps/web/src/shared/layouts/ChanTrang.tsx

Chân trang du khách gọn, chỉ giữ tên ứng dụng. AppLayout dùng; phụ thuộc useText để tên hiển thị đúng ngôn ngữ. CHỨC NĂNG: Không đưa thông báo tài khoản, dữ liệu mẫu hoặc thông tin kỹ thuật vào chân trang.

[Mở file](<../apps/web/src/shared/layouts/ChanTrang.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Footer` | [HỖ TRỢ CHUNG] Footer — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Footer. | [Mở file tại dòng 12](<../apps/web/src/shared/layouts/ChanTrang.tsx#L12>) (12–19) |

### apps/web/src/shared/layouts/ThanhDieuHuong.tsx

Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.

[Mở file](<../apps/web/src/shared/layouts/ThanhDieuHuong.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Navbar` | [HỖ TRỢ CHUNG] Navbar — Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ. | [Mở file tại dòng 19](<../apps/web/src/shared/layouts/ThanhDieuHuong.tsx#L19>) (19–49) |

### apps/web/src/shared/pages/TrangKhongTimThay.tsx

Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.

[Mở file](<../apps/web/src/shared/pages/TrangKhongTimThay.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `NotFoundPage` | [HỖ TRỢ CHUNG] NotFoundPage — Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ. | [Mở file tại dòng 17](<../apps/web/src/shared/pages/TrangKhongTimThay.tsx#L17>) (17–25) |

### apps/web/src/shared/services/KetNoiNenTang.ts

Tạo adapter/bộ nhớ và nguồn danh mục riêng nền tảng; nhận cấu hình API để UI không tự ghép URL dịch vụ.

[Mở file](<../apps/web/src/shared/services/KetNoiNenTang.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `getPosition` | [HỖ TRỢ CHUNG] getPosition — Lấy vị trí khi người dùng chủ động yêu cầu. | [Mở file tại dòng 29](<../apps/web/src/shared/services/KetNoiNenTang.ts#L29>) (29–57) |
| `loadPublicSiteOrigin` | [HỖ TRỢ CHUNG] loadPublicSiteOrigin — Đọc URL QR mới nhất mà không phụ thuộc cache .env của Vite. | [Mở file tại dòng 94](<../apps/web/src/shared/services/KetNoiNenTang.ts#L94>) (94–119) |

### apps/web/src/shared/services/NguonTepTaiNguyen.ts

Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static.

[Mở file](<../apps/web/src/shared/services/NguonTepTaiNguyen.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/web/src/shared/services/XuLyAnhDiTich.ts

Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts.

[Mở file](<../apps/web/src/shared/services/XuLyAnhDiTich.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/app/TrangThaiUngDung.tsx

Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái.

[Mở file](<../apps/mobile/src/app/TrangThaiUngDung.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AppProviders` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] AppProviders — Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái. | [Mở file tại dòng 34](<../apps/mobile/src/app/TrangThaiUngDung.tsx#L34>) (34–50) |

### apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx

Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt.

[Mở file](<../apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AudioPreview` | [UC11 / UC12] AudioPreview — Hiển thị điều khiển nghe thử bản thu phục vụ biên tập hoặc kiểm duyệt. | [Mở file tại dòng 32](<../apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx#L32>) (32–186) |

### apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx

Mở cùng form đầy đủ từ nút Biên tập, không giữ một form riêng thiếu metadata. AdminNavigator gọi; PlaceEditor dùng chung logic lưu nháp/dịch/audio/gửi duyệt với web.

[Mở file](<../apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ContentEditorScreen` | [UC11 / UC12] ContentEditorScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ContentEditorScreen. | [Mở file tại dòng 16](<../apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx#L16>) (16–28) |

### apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx

Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên kết đến thao tác quản lý.

[Mở file](<../apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `DashboardScreen` | [UC14] DashboardScreen — Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên | [Mở file tại dòng 35](<../apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx#L35>) (35–138) |

### apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx

Hiển thị form thêm/sửa di tích; chuyển thao tác lưu, dịch, tạo audio và gửi duyệt cho hook.

[Mở file](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceEditor` | [UC10 / UC11 / UC12] PlaceEditor — Đợi dữ liệu trước khi tạo vùng đang nhập của form. | [Mở file tại dòng 51](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx#L51>) (51–68) |
| `EditorForm` | [UC10 / UC11 / UC12] EditorForm — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider EditorForm. | [Mở file tại dòng 72](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx#L72>) (72–424) |
| `perform` | [UC10 / UC11 / UC12] perform — Chạy cùng tác vụ với web; nhận đúng mã SQL sau khi thêm mới. | [Mở file tại dòng 115](<../apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx#L115>) (115–126) |

### apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx

Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài.

[Mở file](<../apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceImagesEditor` | [UC10 / UC11 / UC12] PlaceImagesEditor — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor. | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx#L27>) (27–82) |

### apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx

Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản lý được cung cấp.

[Mở file](<../apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminPlacesScreen` | [UC10 / UC11 / UC12] AdminPlacesScreen — Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao | [Mở file tại dòng 30](<../apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx#L30>) (30–187) |

### apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx

Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp.

[Mở file](<../apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceFormScreen` | [UC10 / UC11 / UC12] PlaceFormScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceFormScreen. | [Mở file tại dòng 17](<../apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx#L17>) (17–30) |

### apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx

Xem đầy đủ một hồ sơ rồi duyệt, yêu cầu sửa hoặc công bố. ReviewsScreen mở qua mã id; dùng cùng API/revision với web, không tự công bố khi xem.

[Mở file](<../apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ReviewDetailScreen` | [UC12 / UC13] ReviewDetailScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewDetailScreen. | [Mở file tại dòng 35](<../apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx#L35>) (35–56) |
| `Details` | [UC12 / UC13] Details — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Details. | [Mở file tại dòng 60](<../apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx#L60>) (60–152) |

### apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx

Hàng chờ kiểm duyệt native chỉ hiển thị ảnh/tên/trạng thái. AdminNavigator gọi; bấm thẻ mở ReviewDetailScreen để xem bài và thao tác duyệt. TẠI SAO: FlatList nhẹ hơn việc mở sẵn mọi bài và trình nghe cùng lúc.

[Mở file](<../apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ReviewsScreen` | [UC12 / UC13] ReviewsScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewsScreen. | [Mở file tại dòng 24](<../apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx#L24>) (24–112) |

### apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx

Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.

[Mở file](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `LocalMediaPicker` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] LocalMediaPicker — Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp | [Mở file tại dòng 27](<../apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx#L27>) (27–115) |

### apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx

Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động.

[Mở file](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PageHeader` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] PageHeader — Tiêu đề từng màn và tiêu đề từng nhóm dùng cùng nhịp chữ/khoảng cách. | [Mở file tại dòng 212](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L212>) (212–219) |
| `SectionHeading` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] SectionHeading — Hiển thị tiêu đề của một nhóm nội dung. | [Mở file tại dòng 226](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L226>) (226–233) |
| `QuickAction` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] QuickAction — Hiển thị lối tắt đến một thao tác quản lý. | [Mở file tại dòng 240](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L240>) (240–268) |
| `StatusBadge` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] StatusBadge — Mỗi trạng thái có nhãn dịch và biểu tượng, không chỉ phân biệt bằng màu. | [Mở file tại dòng 274](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L274>) (274–309) |
| `LanguageTabs` | [UC11] LanguageTabs — Hiển thị các tab chọn bản ngôn ngữ đang biên tập; không đổi ngôn ngữ giao diện. | [Mở file tại dòng 316](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L316>) (316–362) |
| `Frame` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] Frame — Biểu mẫu tránh bàn phím che nội dung; thông báo dữ liệu nằm cuối trang. | [Mở file tại dòng 369](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L369>) (369–393) |
| `Feedback` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] Feedback — Hiển thị kết quả tải/lưu hoặc lỗi của thao tác quản trị. | [Mở file tại dòng 400](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L400>) (400–435) |
| `Field` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] Field — Trường nhập có nhãn và phản hồi focus, giữ nguyên giá trị/handler do form truyền. | [Mở file tại dòng 441](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L441>) (441–485) |
| `DangerAction` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] DangerAction — Thao tác xóa có màu cảnh báo riêng, vẫn do màn hình hỏi xác nhận. | [Mở file tại dòng 491](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L491>) (491–528) |
| `useUnsaved` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] useUnsaved — Hỏi trước khi back khỏi biểu mẫu chưa lưu, tránh mất nội dung. | [Mở file tại dòng 534](<../apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx#L534>) (534–567) |

### apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts

Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.

[Mở file](<../apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/explore/components/ChonSapXep.tsx

Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục.

[Mở file](<../apps/mobile/src/features/explore/components/ChonSapXep.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `SortDropdown` | [UC02 / UC03] SortDropdown — Chọn cách sắp xếp bằng hộp native. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/ChonSapXep.tsx#L22>) (22–58) |

### apps/mobile/src/features/explore/components/KhoiChaoMung.tsx

Phần chào mừng native có ảnh, nội dung và công cụ tìm tách riêng. HomeScreen gọi; Cover/SearchBar/Action và i18n cung cấp UI, callback cũ giữ toàn bộ nghiệp vụ. TẠI SAO: Không đặt nhiều khối lên ảnh, không khóa chiều cao khi chữ dài hoặc cỡ chữ hệ thống tăng.

[Mở file](<../apps/mobile/src/features/explore/components/KhoiChaoMung.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ExploreHero` | [UC02 / UC03] ExploreHero — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ExploreHero. | [Mở file tại dòng 20](<../apps/mobile/src/features/explore/components/KhoiChaoMung.tsx#L20>) (20–67) |

### apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx

Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.

[Mở file](<../apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `CategoryChips` | [UC02 / UC03] CategoryChips — Dãy chip cuộn ngang. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx#L22>) (22–76) |

### apps/mobile/src/features/explore/components/OTimKiem.tsx

Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ liệu riêng.

[Mở file](<../apps/mobile/src/features/explore/components/OTimKiem.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `SearchBar` | [UC02 / UC03] SearchBar — Ô tìm có quay lại, xóa và bộ lọc. | [Mở file tại dòng 21](<../apps/mobile/src/features/explore/components/OTimKiem.tsx#L21>) (21–100) |

### apps/mobile/src/features/explore/components/TheDiTich.tsx

Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích.

[Mở file](<../apps/mobile/src/features/explore/components/TheDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceCard` | [UC02 / UC03] PlaceCard — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceCard. | [Mở file tại dòng 22](<../apps/mobile/src/features/explore/components/TheDiTich.tsx#L22>) (22–83) |

### apps/mobile/src/features/explore/GiaoDienKhamPha.ts

Style riêng cho màn khám phá, tìm kiếm và thẻ địa điểm mobile. HomeScreen, SearchBar, CategoryChips, PlaceCard dùng; phụ thuộc ui-tokens. TẠI SAO: Một nơi quản lý khoảng cách/màu, không thay style quản trị hoặc logic tìm kiếm.

[Mở file](<../apps/mobile/src/features/explore/GiaoDienKhamPha.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts

Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây.

[Mở file](<../apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx

Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm.

[Mở file](<../apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `SearchResultScreen` | [UC02 / UC03] SearchResultScreen — Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện. | [Mở file tại dòng 18](<../apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx#L18>) (18–22) |

### apps/mobile/src/features/explore/screens/ManKhamPha.tsx

Màn khám phá mobile: ảnh bìa, tìm kiếm, chip danh mục, điểm nổi bật và danh sách điểm tham quan.

[Mở file](<../apps/mobile/src/features/explore/screens/ManKhamPha.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `HomeScreen` | [UC02 / UC03] HomeScreen — Ghép dữ liệu và điều kiện vào danh sách. | [Mở file tại dòng 36](<../apps/mobile/src/features/explore/screens/ManKhamPha.tsx#L36>) (36–411) |
| `onSort` | [UC02 / UC03] onSort — Đổi thứ tự và xin vị trí khi người dùng yêu cầu. | [Mở file tại dòng 106](<../apps/mobile/src/features/explore/screens/ManKhamPha.tsx#L106>) (106–112) |
| `openSearch` | [UC02 / UC03] openSearch — Đồng nhất web: gửi rỗng báo lỗi, gửi có chữ mở kết quả cùng danh mục. | [Mở file tại dòng 120](<../apps/mobile/src/features/explore/screens/ManKhamPha.tsx#L120>) (120–130) |

### apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts

Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage.

[Mở file](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `watch` | [UC06.1] watch — Xin/kiểm tra quyền vị trí, đăng ký nhận GPS và trả hàm dừng theo dõi cho controller. | [Mở file tại dòng 32](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L32>) (32–86) |
| `open` | [UC07] open — Mở nguồn audio của nền tảng và cung cấp play/pause/seek/rate/listen cho controller chung. | [Mở file tại dòng 94](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L94>) (94–200) |
| `play` | [UC07] play — Cả preview và bài du khách tranh quyền qua cùng coordinator. | [Mở file tại dòng 150](<../apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts#L150>) (150–162) |

### apps/mobile/src/features/journey/components/BanDoThamQuan.tsx

Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.

[Mở file](<../apps/mobile/src/features/journey/components/BanDoThamQuan.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `VisitorMap` | [UC08] VisitorMap — Hiển thị marker, vị trí và các thao tác chọn di tích/mở bản đồ ngoài. | [Mở file tại dòng 27](<../apps/mobile/src/features/journey/components/BanDoThamQuan.tsx#L27>) (27–79) |
| `openExternal` | [UC08] openExternal — Mở tọa độ di tích bằng ứng dụng/trình duyệt bản đồ ngoài và báo lỗi nếu không mở được. | [Mở file tại dòng 47](<../apps/mobile/src/features/journey/components/BanDoThamQuan.tsx#L47>) (47–55) |
| `NativeMap` | [UC08] NativeMap — Theo dõi thời hạn khởi tạo bản đồ; component được tạo lại khi đổi điểm hoặc thử lại. | [Mở file tại dòng 85](<../apps/mobile/src/features/journey/components/BanDoThamQuan.tsx#L85>) (85–151) |

### apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx

Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.

[Mở file](<../apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `ListenButton` | [UC07] ListenButton — Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh | [Mở file tại dòng 20](<../apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx#L20>) (20–54) |
| `toggle` | [UC07] toggle — Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu. | [Mở file tại dòng 37](<../apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx#L37>) (37–41) |

### apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx

Trạng thái GPS native có icon và chữ, không chỉ dựa vào màu. JourneyScreen dùng; không thay watch, bán kính, gợi ý hoặc auto-play của engine.

[Mở file](<../apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `GpsStatus` | [UC06 / UC06.1] GpsStatus — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus. | [Mở file tại dòng 21](<../apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx#L21>) (21–53) |

### apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx

Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung.

[Mở file](<../apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `JourneyPlayer` | [UC07] JourneyPlayer — Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác | [Mở file tại dòng 30](<../apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx#L30>) (30–290) |

### apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts

Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.

[Mở file](<../apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `useJourneyNavigation` | [UC06] useJourneyNavigation — Theo dõi gợi ý để điều hướng tới chi tiết di tích phù hợp. | [Mở file tại dòng 17](<../apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts#L17>) (17–41) |

### apps/mobile/src/features/journey/hooks/useHanhTrinh.ts

Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.

[Mở file](<../apps/mobile/src/features/journey/hooks/useHanhTrinh.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx

Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh.

[Mở file](<../apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `JourneyScreen` | [UC06 / UC07 / UC08] JourneyScreen — Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung | [Mở file tại dòng 36](<../apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx#L36>) (36–127) |

### apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx

Chọn ngôn ngữ du khách từ provider hiện có. SettingsScreen dùng kiểu mặc định; DetailScreen dùng compact để không che nội dung. TẠI SAO: Cùng một trạng thái ngôn ngữ cho tiêu đề, bài đọc và thuyết minh trên ứng dụng.

[Mở file](<../apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `LanguageBar` | [UC01] LanguageBar — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider LanguageBar. | [Mở file tại dòng 18](<../apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx#L18>) (18–59) |
| `button` | [UC01] button — Dịch tên ngôn ngữ cho cả thanh ngang và các nút trong Cài đặt. | [Mở file tại dòng 23](<../apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx#L23>) (23–33) |

### apps/mobile/src/features/language/hooks/useDuKhach.ts

Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.

[Mở file](<../apps/mobile/src/features/language/hooks/useDuKhach.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts

Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.

[Mở file](<../apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx

Chi tiết địa điểm mobile với ảnh lớn, thanh ngôn ngữ và bài thuyết minh dễ đọc. RootNavigator gọi; dùng service/hook du khách và bộ phát ListenButton đã có. TẠI SAO: Một ScrollView dọc, thanh ngôn ngữ ngang giúp tránh lỗi nội dung bị khuất dưới header.

[Mở file](<../apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `DetailScreen` | [UC04 / UC07 / UC08] DetailScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider DetailScreen. | [Mở file tại dòng 29](<../apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx#L29>) (29–96) |

### apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts

Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState.

[Mở file](<../apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `usePresenceHeartbeat` | [UC14] usePresenceHeartbeat — Theo dõi vòng đời nền tảng để báo hoặc kết thúc phiên hoạt động. | [Mở file tại dòng 31](<../apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts#L31>) (31–67) |

### apps/mobile/src/features/presence/services/PhienHoatDong.ts

Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.

[Mở file](<../apps/mobile/src/features/presence/services/PhienHoatDong.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts

Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.

[Mở file](<../apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `useGateEntry` | [UC05] useGateEntry — Nhận liên kết vào cổng và gửi lượt QR nền; giữ visitId để hạn chế ghi trùng. | [Mở file tại dòng 26](<../apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts#L26>) (26–68) |

### apps/mobile/src/features/settings/screens/ManCaiDat.tsx

Màn chọn ngôn ngữ trong nhận diện Heritage. MainTabs dùng; vẫn gọi LanguageBar/provider hiện có để lưu lựa chọn.

[Mở file](<../apps/mobile/src/features/settings/screens/ManCaiDat.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `SettingsScreen` | [UC01] SettingsScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider SettingsScreen. | [Mở file tại dòng 19](<../apps/mobile/src/features/settings/screens/ManCaiDat.tsx#L19>) (19–40) |

### apps/mobile/src/navigation/DieuHuongGoc.tsx

Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết.

[Mở file](<../apps/mobile/src/navigation/DieuHuongGoc.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `openSuggested` | [UC06] openSuggested — Mở chi tiết di tích được gợi ý; thao tác điều hướng này không tự phát âm thanh. | [Mở file tại dòng 43](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L43>) (43–45) |
| `RootNavigator` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] RootNavigator — Đăng ký các màn hình của ứng dụng. | [Mở file tại dòng 55](<../apps/mobile/src/navigation/DieuHuongGoc.tsx#L55>) (55–108) |

### apps/mobile/src/navigation/DieuHuongQuanTri.tsx

Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt.

[Mở file](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminNavigator` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminNavigator — Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, | [Mở file tại dòng 34](<../apps/mobile/src/navigation/DieuHuongQuanTri.tsx#L34>) (34–71) |

### apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts

Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình.

[Mở file](<../apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts

Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route.

[Mở file](<../apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/navigation/LienKetMoUngDung.ts

Cấu hình nhận liên kết mở ứng dụng mobile và phân tích đường dẫn theo quy tắc QR/liên kết chung.

[Mở file](<../apps/mobile/src/navigation/LienKetMoUngDung.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `getStateFromPath` | [UC05] getStateFromPath — Chuyển đường dẫn thành màn hình và tham số. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/LienKetMoUngDung.ts#L30>) (30–69) |

### apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx

Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại.

[Mở file](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `MainTabs` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] MainTabs — Đăng ký label được dịch cho các tab. | [Mở file tại dòng 30](<../apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx#L30>) (30–81) |

### apps/mobile/src/navigation/UngDungQuanTri.tsx

Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.

[Mở file](<../apps/mobile/src/navigation/UngDungQuanTri.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminApp` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminApp — Ghép luồng admin của nền tảng. | [Mở file tại dòng 21](<../apps/mobile/src/navigation/UngDungQuanTri.tsx#L21>) (21–29) |

### apps/mobile/src/shared/components/AnhBia.tsx

Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile.

[Mở file](<../apps/mobile/src/shared/components/AnhBia.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Cover` | [UC02 / UC04 / UC10 / UC11] Cover — Hiển thị ảnh co theo khung hoặc placeholder. | [Mở file tại dòng 26](<../apps/mobile/src/shared/components/AnhBia.tsx#L26>) (26–79) |

### apps/mobile/src/shared/components/AnhDiTich.tsx

Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.

[Mở file](<../apps/mobile/src/shared/components/AnhDiTich.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `PlaceImage` | [UC02 / UC04 / UC10 / UC11] PlaceImage — Hiển thị ảnh hoặc placeholder khi ảnh thiếu/hỏng. | [Mở file tại dòng 23](<../apps/mobile/src/shared/components/AnhDiTich.tsx#L23>) (23–71) |

### apps/mobile/src/shared/components/NutThaoTac.tsx

Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái khóa/được chọn.

[Mở file](<../apps/mobile/src/shared/components/NutThaoTac.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `Action` | [HỖ TRỢ CHUNG] Action — Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái | [Mở file tại dòng 19](<../apps/mobile/src/shared/components/NutThaoTac.tsx#L19>) (19–75) |

### apps/mobile/src/shared/components/TrangThaiDuLieu.tsx

Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.

[Mở file](<../apps/mobile/src/shared/components/TrangThaiDuLieu.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `State` | [HỖ TRỢ CHUNG] State — Hiển thị loading, thông báo và thao tác khôi phục. | [Mở file tại dòng 19](<../apps/mobile/src/shared/components/TrangThaiDuLieu.tsx#L19>) (19–69) |

### apps/mobile/src/shared/GiaoDienChung.ts

Màu và style nền tảng của mobile, dùng lại token chung để các màn có hình thức thống nhất.

[Mở file](<../apps/mobile/src/shared/GiaoDienChung.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/shared/services/KetNoiNenTang.ts

Tạo adapter/bộ nhớ và nguồn danh mục riêng nền tảng; nhận cấu hình API để UI không tự ghép URL dịch vụ.

[Mở file](<../apps/mobile/src/shared/services/KetNoiNenTang.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `getPosition` | [HỖ TRỢ CHUNG] getPosition — Xin vị trí để phục vụ sắp xếp gần nhất. | [Mở file tại dòng 61](<../apps/mobile/src/shared/services/KetNoiNenTang.ts#L61>) (61–91) |

### apps/mobile/src/shared/services/NguonTepTaiNguyen.ts

Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL.

[Mở file](<../apps/mobile/src/shared/services/NguonTepTaiNguyen.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### apps/mobile/src/shared/services/XuLyAnhDiTich.ts

Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu.

[Mở file](<../apps/mobile/src/shared/services/XuLyAnhDiTich.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/audio/DieuKhienNgheThu.ts

Điều khiển nghe thử bản thu trong biên tập và kiểm duyệt, dùng chung bộ điều phối quyền phát.

[Mở file](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `set` | [UC11 / UC12] set — Cập nhật trạng thái controller và báo cho UI. | [Mở file tại dòng 38](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L38>) (38–38) |
| `prepare` | [UC11 / UC12] prepare — Nạp thời lượng trước khi nghe, không tự phát khi mở màn Admin. | [Mở file tại dòng 43](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L43>) (43–55) |
| `attach` | [UC11 / UC12] attach — Gắn nguồn nghe thử với trạng thái controller. | [Mở file tại dòng 61](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L61>) (61–78) |
| `pause` | [UC11 / UC12] pause — Pause không dispose, không mở URL lại và không seek(0). | [Mở file tại dòng 122](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L122>) (122–122) |
| `seek` | [UC11 / UC12] seek — Tua đến thời điểm hợp lệ trong bản thu. | [Mở file tại dòng 131](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L131>) (131–145) |
| `setRate` | [UC11 / UC12] setRate — Thay đổi tốc độ của nguồn đang nghe thử. | [Mở file tại dòng 151](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L151>) (151–155) |
| `setVolume` | [UC11 / UC12] setVolume — Thay đổi âm lượng nghe thử. | [Mở file tại dòng 160](<../packages/visitor-core/src/audio/DieuKhienNgheThu.ts#L160>) (160–165) |

### packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts

Điều phối quyền phát để nguồn mới yêu cầu nguồn đang giữ quyền tạm dừng; dùng cả nghe thuyết minh và nghe thử.

[Mở file](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `claim` | [UC07 / UC11 / UC12] claim — Chuyển quyền phát cho nguồn mới và yêu cầu nguồn đang giữ quyền tạm dừng. | [Mở file tại dòng 18](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts#L18>) (18–23) |
| `owns` | [UC07 / UC11 / UC12] owns — Kiểm tra nguồn có còn giữ quyền phát không. | [Mở file tại dòng 29](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts#L29>) (29–29) |
| `release` | [UC07 / UC11 / UC12] release — Nhả quyền phát nếu nguồn yêu cầu vẫn là chủ sở hữu hiện tại. | [Mở file tại dòng 36](<../packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts#L36>) (36–36) |

### packages/visitor-core/src/catalog/DanhMucDiTich.ts

Đọc danh mục và chọn văn bản/âm thanh đã công bố đúng ngôn ngữ.

[Mở file](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `CatalogError` | [UC02 / UC03 / UC04 / UC07] CatalogError — Phân biệt điểm không tồn tại với lỗi tải dữ liệu. | [Mở file tại dòng 24](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L24>) (24–30) |
| `publishedText` | [UC02 / UC03 / UC04 / UC07] publishedText — Chọn văn bản đã công bố đúng ngôn ngữ; không lấy bản nháp thay thế. | [Mở file tại dòng 36](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L36>) (36–48) |
| `availableLanguages` | [UC02 / UC03 / UC04 / UC07] availableLanguages — Liệt kê các ngôn ngữ có nội dung phục vụ cho di tích. | [Mở file tại dòng 55](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L55>) (55–60) |
| `createCatalog` | [UC02 / UC03 / UC04 / UC07] createCatalog — Tạo đầu mối tải danh mục/chi tiết từ nguồn dữ liệu công bố. | [Mở file tại dòng 68](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L68>) (68–127) |
| `get` | [UC02 / UC03 / UC04 / UC07] get — Lấy một địa điểm theo ID cho chi tiết hoặc QR. | [Mở file tại dòng 116](<../packages/visitor-core/src/catalog/DanhMucDiTich.ts#L116>) (116–123) |

### packages/visitor-core/src/catalog/DuLieuHienThi.ts

Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu.

[Mở file](<../packages/visitor-core/src/catalog/DuLieuHienThi.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts

Chuẩn hóa từ khóa, tính khoảng cách, tìm/lọc/sắp xếp và chia trang kết quả.

[Mở file](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `normalize` | [UC02 / UC03 / UC06] normalize — Chuẩn hóa chữ hoa/thường và dấu để tìm từ khóa nhất quán. | [Mở file tại dòng 28](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L28>) (28–37) |
| `validPoint` | [UC02 / UC03 / UC06] validPoint — Kiểm tra tọa độ có nằm trong miền giá trị hợp lệ. | [Mở file tại dòng 44](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L44>) (44–50) |
| `distanceMeters` | [UC02 / UC03 / UC06] distanceMeters — Tính khoảng cách giữa hai tọa độ bằng công thức Haversine, trả đơn vị mét. | [Mở file tại dòng 57](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L57>) (57–73) |
| `distanceTo` | [UC02 / UC03 / UC06] distanceTo — Lấy tọa độ phù hợp của di tích để tính khoảng cách từ vị trí khách. | [Mở file tại dòng 81](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L81>) (81–98) |
| `selectPlaces` | [UC02 / UC03 / UC06] selectPlaces — Lọc và sắp xếp danh sách theo điều kiện người dùng chọn. | [Mở file tại dòng 110](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L110>) (110–214) |
| `paginate` | [UC02 / UC03 / UC06] paginate — Cắt danh sách thành trang theo số trang và kích thước trang. | [Mở file tại dòng 222](<../packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts#L222>) (222–248) |

### packages/visitor-core/src/data/DanhMucAnh.ts

Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero.

[Mở file](<../packages/visitor-core/src/data/DanhMucAnh.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/data/DiSanHue.ts

Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng.

[Mở file](<../packages/visitor-core/src/data/DiSanHue.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `bundledNarration` | [UC02 / UC04 / UC07 / UC08] bundledNarration — Lấy MP3 đóng gói chỉ khi body trùng đúng bài đã tạo âm thanh. | [Mở file tại dòng 28](<../packages/visitor-core/src/data/DiSanHue.ts#L28>) (28–34) |
| `narrationKey` | [UC02 / UC04 / UC07 / UC08] narrationKey — Chuyển khóa an toàn thành đường dẫn asset hoặc API. | [Mở file tại dòng 40](<../packages/visitor-core/src/data/DiSanHue.ts#L40>) (40–43) |
| `bundledNarrationKey` | [UC02 / UC04 / UC07 / UC08] bundledNarrationKey — Tìm khóa bản thu đã đóng gói tương ứng. | [Mở file tại dòng 49](<../packages/visitor-core/src/data/DiSanHue.ts#L49>) (49–52) |
| `heritageText` | [UC02 / UC04 / UC07 / UC08] heritageText — Lấy nội dung nguồn của di tích theo ngôn ngữ. | [Mở file tại dòng 58](<../packages/visitor-core/src/data/DiSanHue.ts#L58>) (58–72) |

### packages/visitor-core/src/data/DuLieuKhoiTao.ts

Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo.

[Mở file](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `make` | [UC02 / UC04 / UC07 / UC08] make — Tạo địa điểm từ những bản ngôn ngữ được khai báo. | [Mở file tại dòng 23](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts#L23>) (23–58) |
| `loadMockCatalog` | [UC02 / UC04 / UC07 / UC08] loadMockCatalog — Mô phỏng nguồn API bất đồng bộ. | [Mở file tại dòng 173](<../packages/visitor-core/src/data/DuLieuKhoiTao.ts#L173>) (173–176) |

### packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts

Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ.

[Mở file](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `languageOf` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] languageOf — Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị. | [Mở file tại dòng 34](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L34>) (34–47) |
| `categoryOf` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] categoryOf — Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ. | [Mở file tại dòng 136](<../packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts#L136>) (136–140) |

### packages/visitor-core/src/i18n/BanDichDiSan.ts

Tài nguyên chuỗi liên quan nội dung di tích theo ngôn ngữ; i18n tra khóa để các nền tảng hiển

[Mở file](<../packages/visitor-core/src/i18n/BanDichDiSan.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/i18n/BanDichGiaoDien.ts

Tài nguyên chuỗi cơ bản du khách theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống

[Mở file](<../packages/visitor-core/src/i18n/BanDichGiaoDien.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/i18n/BanDichHanhTrinh.ts

Tài nguyên chuỗi bài nghe và hành trình theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị

[Mở file](<../packages/visitor-core/src/i18n/BanDichHanhTrinh.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/i18n/BanDichThanhPhan.ts

Tài nguyên chuỗi trang khám phá và danh mục theo ngôn ngữ; i18n tra khóa để các nền tảng hiển

[Mở file](<../packages/visitor-core/src/i18n/BanDichThanhPhan.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/i18n/BanDichTraiNghiem.ts

Nhãn giao diện Heritage cho đủ năm ngôn ngữ.

[Mở file](<../packages/visitor-core/src/i18n/BanDichTraiNghiem.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/i18n/BanDichTruyCapQR.ts

Tài nguyên chuỗi liên kết và QR theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống

[Mở file](<../packages/visitor-core/src/i18n/BanDichTruyCapQR.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/visitor-core/src/journey/DuLieuHanhTrinh.ts

Cung cấp tọa độ và tuyến tham khảo; tuyến chưa được xác nhận không được coi là đường đi bộ đã kiểm chứng.

[Mở file](<../packages/visitor-core/src/journey/DuLieuHanhTrinh.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `mapPointFor` | [UC06 / UC08] mapPointFor — Map, GPS và chi tiết ưu tiên tọa độ đang công bố từ cùng record Admin. | [Mở file tại dòng 47](<../packages/visitor-core/src/journey/DuLieuHanhTrinh.ts#L47>) (47–55) |

### packages/visitor-core/src/journey/HanhTrinh.ts

Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan.

[Mở file](<../packages/visitor-core/src/journey/HanhTrinh.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `clampTime` | [UC07.2] clampTime — Giới hạn thời điểm tua trong khoảng từ 0 đến thời lượng thực của bài. | [Mở file tại dòng 60](<../packages/visitor-core/src/journey/HanhTrinh.ts#L60>) (60–61) |
| `parseSaved` | [UC07] parseSaved — Đọc và kiểm tra JSON phiên nghe đã lưu; loại bản ghi hỏng trước khi đề nghị khôi phục. | [Mở file tại dòng 68](<../packages/visitor-core/src/journey/HanhTrinh.ts#L68>) (68–87) |
| `nearest` | [UC06] nearest — Tính khoảng cách từ vị trí khách đến các di tích và chọn điểm phù hợp trong bán kính 100 m. | [Mở file tại dòng 94](<../packages/visitor-core/src/journey/HanhTrinh.ts#L94>) (94–113) |
| `routeAvailable` | [UC08] routeAvailable — Kiểm tra các điểm trong tuyến còn nằm trong danh mục di tích đang được phục vụ. | [Mở file tại dòng 120](<../packages/visitor-core/src/journey/HanhTrinh.ts#L120>) (120–123) |
| `set` | [UC01 / UC06 / UC07 / UC08] set — Cập nhật trạng thái controller và báo cho UI. | [Mở file tại dòng 154](<../packages/visitor-core/src/journey/HanhTrinh.ts#L154>) (154–154) |
| `start` | [UC07] start — Tải danh mục và tiến độ đã lưu; kiểm tra phiên bản rồi hiện đề nghị tiếp tục, chưa tự phát audio. | [Mở file tại dòng 161](<../packages/visitor-core/src/journey/HanhTrinh.ts#L161>) (161–183) |
| `refreshCatalog` | [UC06 / UC07 / UC08] refreshCatalog — Tải lại danh mục công bố mà vẫn giữ nguồn âm thanh đang nghe. | [Mở file tại dòng 189](<../packages/visitor-core/src/journey/HanhTrinh.ts#L189>) (189–199) |
| `persist` | [UC07] persist — Xếp hàng ghi/xóa tiến độ trong bộ nhớ thiết bị; lỗi lưu không làm dừng âm thanh. | [Mở file tại dòng 205](<../packages/visitor-core/src/journey/HanhTrinh.ts#L205>) (205–217) |
| `stopTrack` | [UC07] stopTrack — Gỡ listener, tạm dừng và giải phóng nguồn audio cũ trước khi đổi hoặc đóng bài. | [Mở file tại dòng 223](<../packages/visitor-core/src/journey/HanhTrinh.ts#L223>) (223–223) |
| `play` | [UC07] play — Chọn bản thu đã công bố theo di tích/ngôn ngữ, mở nguồn mới và cập nhật phiên nghe; bỏ kết quả tải cũ đến muộn. | [Mở file tại dòng 230](<../packages/visitor-core/src/journey/HanhTrinh.ts#L230>) (230–276) |
| `close` | [UC07] close — Đóng bài hiện tại và dọn trạng thái/bản lưu theo chế độ của thao tác đóng. | [Mở file tại dòng 285](<../packages/visitor-core/src/journey/HanhTrinh.ts#L285>) (285–292) |
| `pause` | [UC07.1] pause — Tạm dừng và lưu tiến độ; giữ nguồn audio để có thể tiếp tục đúng thời điểm. | [Mở file tại dòng 299](<../packages/visitor-core/src/journey/HanhTrinh.ts#L299>) (299–299) |
| `resume` | [UC07.1] resume — Tiếp tục nguồn hiện tại từ thời điểm đã dừng và cập nhật trạng thái phát. | [Mở file tại dòng 305](<../packages/visitor-core/src/journey/HanhTrinh.ts#L305>) (305–312) |
| `seek` | [UC07.2] seek — Tua đến thời điểm yêu cầu sau khi giới hạn theo thời lượng bài. | [Mở file tại dòng 318](<../packages/visitor-core/src/journey/HanhTrinh.ts#L318>) (318–325) |
| `rate` | [UC07.3] rate — Kiểm tra tốc độ được hỗ trợ rồi áp dụng cho nguồn audio và phiên nghe. | [Mở file tại dòng 331](<../packages/visitor-core/src/journey/HanhTrinh.ts#L331>) (331–336) |
| `changeLanguage` | [UC01 / UC07] changeLanguage — Đổi bản thu theo ngôn ngữ mới từ đầu bài; giữ ý định phát hoặc tạm dừng của khách. | [Mở file tại dòng 341](<../packages/visitor-core/src/journey/HanhTrinh.ts#L341>) (341–347) |
| `dismissRestore` | [UC07] dismissRestore — Bỏ đề nghị khôi phục và xóa bản lưu tương ứng khi khách chọn không tiếp tục. | [Mở file tại dòng 353](<../packages/visitor-core/src/journey/HanhTrinh.ts#L353>) (353–353) |
| `restorePlay` | [UC07] restorePlay — Phát lại phiên đã lưu; nếu phiên bản thay đổi thì bắt đầu từ đầu thay vì dùng mốc cũ. | [Mở file tại dòng 359](<../packages/visitor-core/src/journey/HanhTrinh.ts#L359>) (359–359) |
| `selectRoute` | [UC08] selectRoute — Chọn tuyến còn hợp lệ trong danh mục và cập nhật tuyến đang xem. | [Mở file tại dòng 365](<../packages/visitor-core/src/journey/HanhTrinh.ts#L365>) (365–369) |
| `acceptFix` | [UC06 / UC06.1] acceptFix — Loại GPS sai tọa độ, sai số trên 60 m hoặc cũ quá 30 giây; chỉ cập nhật gợi ý khi trạng thái nghe cho phép. | [Mở file tại dòng 376](<../packages/visitor-core/src/journey/HanhTrinh.ts#L376>) (376–388) |
| `gps` | [UC06.1] gps — Bật/tắt watcher vị trí, xóa gợi ý cũ và bỏ callback của lần theo dõi đã hủy. | [Mở file tại dòng 394](<../packages/visitor-core/src/journey/HanhTrinh.ts#L394>) (394–414) |
| `checkpoint` | [UC07] checkpoint — Chốt tiến độ gần nhất khi ứng dụng đổi vòng đời để lần sau có thể tiếp tục. | [Mở file tại dòng 419](<../packages/visitor-core/src/journey/HanhTrinh.ts#L419>) (419–419) |
| `dispose` | [UC06.1 / UC07] dispose — Dọn watcher GPS, listener và tài nguyên phiên nghe khi controller kết thúc. | [Mở file tại dòng 429](<../packages/visitor-core/src/journey/HanhTrinh.ts#L429>) (429–429) |

### packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx

Kết nối JourneyController với React để các màn cùng dùng một trạng thái GPS và phiên nghe.

[Mở file](<../packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `JourneyProvider` | [UC06 / UC07 / UC08] JourneyProvider — Giữ một JourneyController và nối trạng thái nghe/GPS với cây React. | [Mở file tại dòng 22](<../packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx#L22>) (22–46) |
| `useJourney` | [UC06 / UC07 / UC08] useJourney — Lấy controller và trạng thái hành trình dùng chung giữa các màn. | [Mở file tại dòng 53](<../packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx#L53>) (53–66) |

### packages/visitor-core/src/links/DiaChiWebsite.ts

Chuẩn hóa/cấu hình địa chỉ website dùng cho liên kết chung theo quy tắc của dự án.

[Mở file](<../packages/visitor-core/src/links/DiaChiWebsite.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `siteOrigin` | [UC05] siteOrigin — Chuẩn hóa và kiểm tra origin của website. | [Mở file tại dòng 18](<../packages/visitor-core/src/links/DiaChiWebsite.ts#L18>) (18–66) |

### packages/visitor-core/src/links/PhanTichLienKetQR.ts

Kiểm tra và phân tích liên kết QR; nhận liên kết vào cổng chung và từ chối dữ liệu không hợp lệ.

[Mở file](<../packages/visitor-core/src/links/PhanTichLienKetQR.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `validPlaceId` | [UC05] validPlaceId — Kiểm tra định dạng mã địa điểm trong liên kết. | [Mở file tại dòng 24](<../packages/visitor-core/src/links/PhanTichLienKetQR.ts#L24>) (24–28) |
| `parseQrTarget` | [UC05] parseQrTarget — Phân tích và kiểm tra liên kết QR để xác định đích truy cập hợp lệ. | [Mở file tại dòng 36](<../packages/visitor-core/src/links/PhanTichLienKetQR.ts#L36>) (36–129) |
| `parsePlaceQr` | [UC05] parsePlaceQr — Đọc mã di tích từ liên kết QR hợp lệ theo chính sách liên kết. | [Mở file tại dòng 137](<../packages/visitor-core/src/links/PhanTichLienKetQR.ts#L137>) (137–150) |
| `placeUrl` | [UC05] placeUrl — Tạo URL để mã hóa thành QR. | [Mở file tại dòng 157](<../packages/visitor-core/src/links/PhanTichLienKetQR.ts#L157>) (157–162) |

### packages/visitor-core/src/presence/PhienHoatDong.ts

Hợp đồng và HTTP client thống kê dùng chung; gửi heartbeat ngay rồi lặp sau 30 giây, xử lý

[Mở file](<../packages/visitor-core/src/presence/PhienHoatDong.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createPresenceClient` | [UC14] createPresenceClient — Tạo client gửi heartbeat/kết thúc phiên và đọc số phiên hoạt động. | [Mở file tại dòng 22](<../packages/visitor-core/src/presence/PhienHoatDong.ts#L22>) (22–69) |
| `heartbeat` | [UC14] heartbeat — Ghi nhận một phiên du khách vẫn đang sử dụng hệ thống. | [Mở file tại dòng 43](<../packages/visitor-core/src/presence/PhienHoatDong.ts#L43>) (43–43) |
| `end` | [UC14] end — Kết thúc một phiên theo mã. | [Mở file tại dòng 49](<../packages/visitor-core/src/presence/PhienHoatDong.ts#L49>) (49–49) |
| `startPresenceHeartbeat` | [UC14] startPresenceHeartbeat — Gửi heartbeat ngay rồi định kỳ để máy chủ biết phiên vẫn còn hoạt động. | [Mở file tại dòng 76](<../packages/visitor-core/src/presence/PhienHoatDong.ts#L76>) (76–90) |

### packages/visitor-core/src/presence/TheoDoiPhienReact.ts

Hook đọc thống kê định kỳ cho admin; quản lý tải, lỗi, thử lại và dừng lịch khi component rời

[Mở file](<../packages/visitor-core/src/presence/TheoDoiPhienReact.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `usePresenceStatistics` | [UC14] usePresenceStatistics — Lấy và cập nhật số liệu phiên hoạt động cho màn tổng quan. | [Mở file tại dòng 15](<../packages/visitor-core/src/presence/TheoDoiPhienReact.ts#L15>) (15–57) |
| `poll` | [UC14] poll — Tải số phiên hiện tại; lỗi hiển thị chưa có số liệu thay vì số 0 giả. | [Mở file tại dòng 37](<../packages/visitor-core/src/presence/TheoDoiPhienReact.ts#L37>) (37–46) |

### packages/visitor-core/src/react/TrangThaiReact.tsx

Khởi tạo ngôn ngữ, tải danh mục/chi tiết và cung cấp bộ lọc dùng chung cho Web và Mobile.

[Mở file](<../packages/visitor-core/src/react/TrangThaiReact.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createVisitorI18n` | [UC01] createVisitorI18n — Khởi tạo bộ dịch giao diện cho năm ngôn ngữ và tiếng Việt dự phòng. | [Mở file tại dòng 56](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L56>) (56–85) |
| `VisitorProvider` | [UC01 / UC02 / UC03 / UC04] VisitorProvider — Cấp chung i18n, ngôn ngữ và danh mục cho các màn du khách. | [Mở file tại dòng 115](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L115>) (115–123) |
| `StateProvider` | [UC01] StateProvider — Chọn ngôn ngữ theo thứ tự đã lưu → thiết bị → tiếng Việt và lưu khi khách đổi tiếng. | [Mở file tại dòng 132](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L132>) (132–280) |
| `useVisitor` | [UC01] useVisitor — Lấy ngôn ngữ và danh mục từ provider chung thay vì tạo trạng thái riêng từng màn. | [Mở file tại dòng 287](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L287>) (287–297) |
| `useText` | [UC01] useText — Trả chữ giao diện theo ngôn ngữ đang chọn. | [Mở file tại dòng 304](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L304>) (304–312) |
| `useDebounce` | [UC03] useDebounce — Chờ người dùng ngừng nhập trước khi cập nhật từ khóa tìm kiếm. | [Mở file tại dòng 322](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L322>) (322–343) |
| `usePublishedCatalog` | [UC02] usePublishedCatalog — Tải danh mục đã công bố, đồng thời cung cấp trạng thái đang tải/lỗi và chức năng tải lại. | [Mở file tại dòng 349](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L349>) (349–432) |
| `usePublishedPlace` | [UC04] usePublishedPlace — Tải đúng di tích theo mã để màn chi tiết hiển thị nội dung đã công bố. | [Mở file tại dòng 439](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L439>) (439–531) |
| `usePlaceFilters` | [UC03] usePlaceFilters — Áp dụng từ khóa, danh mục, khu vực và thứ tự sắp xếp lên danh sách. | [Mở file tại dòng 538](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L538>) (538–601) |
| `reset` | [UC01 / UC02 / UC03 / UC04] reset — Xóa từ khóa và nhóm đã chọn. | [Mở file tại dòng 594](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L594>) (594–599) |
| `useVisitorPosition` | [UC03] useVisitorPosition — Lấy vị trí phục vụ sắp xếp khoảng cách trong tra cứu; xử lý trường hợp thiếu quyền hoặc tọa độ. | [Mở file tại dòng 610](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L610>) (610–675) |
| `useExplore` | [UC02 / UC03] useExplore — Ghép dữ liệu danh mục, vị trí và bộ lọc thành kết quả để màn khám phá hiển thị. | [Mở file tại dòng 680](<../packages/visitor-core/src/react/TrangThaiReact.tsx#L680>) (680–787) |

### packages/visitor-core/src/XuatCongKhai.ts

Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập.

[Mở file](<../packages/visitor-core/src/XuatCongKhai.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/admin-core/src/domain/HopDongDichVu.ts

Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình.

[Mở file](<../packages/admin-core/src/domain/HopDongDichVu.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/admin-core/src/domain/KiemTraDuLieu.ts

Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung.

[Mở file](<../packages/admin-core/src/domain/KiemTraDuLieu.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `mediaUrl` | [UC10 / UC11] mediaUrl — Kiểm tra định dạng và giới hạn liên kết/tệp ảnh hoặc audio được nhập. | [Mở file tại dòng 21](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L21>) (21–40) |
| `validatePlace` | [UC10] validatePlace — Kiểm tra dữ liệu hồ sơ trước khi cho lưu di tích. | [Mở file tại dòng 47](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L47>) (47–71) |
| `readyForReview` | [UC12 / UC13] readyForReview — Kiểm tra các trường và bản ngôn ngữ/bản thu bắt buộc trước khi duyệt hoặc công bố. | [Mở file tại dòng 78](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L78>) (78–90) |
| `dashboard` | [UC14] dashboard — Tính số di tích và hồ sơ chờ duyệt từ document quản trị để hiển thị tổng quan. | [Mở file tại dòng 97](<../packages/admin-core/src/domain/KiemTraDuLieu.ts#L97>) (97–117) |

### packages/admin-core/src/domain/KieuDuLieuQuanTri.ts

Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung.

[Mở file](<../packages/admin-core/src/domain/KieuDuLieuQuanTri.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/admin-core/src/domain/XuLyAnhDiTich.ts

Chuẩn hóa danh sách ảnh, chọn ảnh đại diện và xóa/thay liên kết ảnh trong biểu mẫu.

[Mở file](<../packages/admin-core/src/domain/XuLyAnhDiTich.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/admin-core/src/i18n/BanDichGiaoDien.ts

Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và

[Mở file](<../packages/admin-core/src/i18n/BanDichGiaoDien.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/admin-core/src/react/TrangThaiReact.tsx

Cung cấp danh tính quản lý, dữ liệu quản trị, trạng thái thao tác và thống kê lượt QR cho giao diện.

[Mở file](<../packages/admin-core/src/react/TrangThaiReact.tsx>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `AdminProvider` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminProvider — Cấp service quản trị chung cho các màn bên trong. | [Mở file tại dòng 38](<../packages/admin-core/src/react/TrangThaiReact.tsx#L38>) (38–46) |
| `useAdminText` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] useAdminText — Lấy chữ giao diện quản trị theo ngôn ngữ hiện tại. | [Mở file tại dòng 53](<../packages/admin-core/src/react/TrangThaiReact.tsx#L53>) (53–57) |
| `useAdmin` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] useAdmin — Tải danh tính/dữ liệu quản trị và quản lý trạng thái bận/lỗi của thao tác. | [Mở file tại dòng 64](<../packages/admin-core/src/react/TrangThaiReact.tsx#L64>) (64–166) |
| `run` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] run — Một thao tác tại một thời điểm; lỗi giữ nguyên form/bản công khai. | [Mở file tại dòng 139](<../packages/admin-core/src/react/TrangThaiReact.tsx#L139>) (139–161) |
| `useGateStatistics` | [UC14] useGateStatistics — Đọc thống kê lượt QR và cấp trạng thái tải/lỗi cho màn tổng quan. | [Mở file tại dòng 175](<../packages/admin-core/src/react/TrangThaiReact.tsx#L175>) (175–223) |

### packages/admin-core/src/react/useBienTapDiTich.ts

Giữ dữ liệu biểu mẫu; lưu nháp, dịch, tạo audio và gửi duyệt dùng chung cho Web/Mobile.

[Mở file](<../packages/admin-core/src/react/useBienTapDiTich.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `textsOf` | [UC11] textsOf — Đưa các bản ngôn ngữ đã lưu vào ô nhập của biểu mẫu; tách metadata duyệt khỏi nội dung nhập tay. | [Mở file tại dòng 32](<../packages/admin-core/src/react/useBienTapDiTich.ts#L32>) (32–45) |
| `usePlaceEditor` | [UC10 / UC11 / UC12] usePlaceEditor — Giữ state của biểu mẫu và ghép các nút lưu nháp, dịch, tạo audio, gửi duyệt vào cùng luồng xử lý. | [Mở file tại dòng 48](<../packages/admin-core/src/react/useBienTapDiTich.ts#L48>) (48–268) |
| `edit` | [UC11] edit — Cập nhật trường nội dung của ngôn ngữ đang biên tập và đánh dấu biểu mẫu đã thay đổi. | [Mở file tại dòng 79](<../packages/admin-core/src/react/useBienTapDiTich.ts#L79>) (79–83) |
| `refresh` | [UC10 / UC11] refresh — Đọc lại bản nháp và revision mới nhất sau khi API hoàn tất thao tác. | [Mở file tại dòng 91](<../packages/admin-core/src/react/useBienTapDiTich.ts#L91>) (91–99) |
| `translateAll` | [UC11] translateAll — Dịch lần lượt các ngôn ngữ đích và đọc lại revision sau từng tác vụ. | [Mở file tại dòng 105](<../packages/admin-core/src/react/useBienTapDiTich.ts#L105>) (105–114) |
| `save` | [UC10 / UC11] save — Gom metadata và các bản ngôn ngữ trong biểu mẫu để lưu hồ sơ/bản nháp qua service. | [Mở file tại dòng 120](<../packages/admin-core/src/react/useBienTapDiTich.ts#L120>) (120–154) |
| `resetForNextPlace` | [UC10 / UC11] resetForNextPlace — Dọn biểu mẫu để bắt đầu di tích tiếp theo sau khi gửi duyệt thành công. | [Mở file tại dòng 162](<../packages/admin-core/src/react/useBienTapDiTich.ts#L162>) (162–177) |
| `perform` | [UC10 / UC11 / UC12] perform — Lưu trước khi dịch/tạo audio/gửi duyệt; cập nhật tiến trình và dọn trạng thái bận khi xong hoặc lỗi. | [Mở file tại dòng 183](<../packages/admin-core/src/react/useBienTapDiTich.ts#L183>) (183–218) |
| `reloadDraft` | [UC10 / UC11] reloadDraft — Nạp lại bản nháp mới nhất để xử lý xung đột và đồng bộ lại dữ liệu biểu mẫu. | [Mở file tại dòng 226](<../packages/admin-core/src/react/useBienTapDiTich.ts#L226>) (226–236) |

### packages/admin-core/src/services/GoiApiQuanTri.ts

Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL.

[Mở file](<../packages/admin-core/src/services/GoiApiQuanTri.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `transport` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] transport — Gửi HTTP và chuẩn hóa lỗi của quản trị. | [Mở file tại dòng 46](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L46>) (46–84) |
| `createHttpAdminService` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createHttpAdminService — Tạo service gọi các endpoint quản trị và thông báo khi dữ liệu thay đổi. | [Mở file tại dòng 91](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L91>) (91–245) |
| `command` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] command — Gửi một thao tác quản trị đến mock API. | [Mở file tại dòng 161](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L161>) (161–170) |
| `identity` | [UC09] identity — Gửi yêu cầu HTTP cho thao tác identity; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 176](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L176>) (176–176) |
| `savePlace` | [UC10] savePlace — Gửi yêu cầu HTTP cho thao tác savePlace; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 181](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L181>) (181–191) |
| `saveContent` | [UC11] saveContent — Gửi yêu cầu HTTP cho thao tác saveContent; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 193](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L193>) (193–193) |
| `translate` | [UC11] translate — Gửi yêu cầu HTTP cho thao tác translate; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 196](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L196>) (196–196) |
| `generateAudio` | [UC11] generateAudio — Gửi yêu cầu HTTP cho thao tác generateAudio; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 198](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L198>) (198–198) |
| `submit` | [UC12] submit — Gửi yêu cầu HTTP cho thao tác submit; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 201](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L201>) (201–201) |
| `review` | [UC12] review — Gửi yêu cầu HTTP cho thao tác review; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 203](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L203>) (203–203) |
| `publish` | [UC13] publish — Gửi yêu cầu HTTP cho thao tác publish; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 205](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L205>) (205–205) |
| `archive` | [UC10] archive — Gửi yêu cầu HTTP cho thao tác archive; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 208](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L208>) (208–208) |
| `deletePlace` | [UC10] deletePlace — Gửi yêu cầu HTTP cho thao tác deletePlace; quy tắc nghiệp vụ được kiểm tra tại máy chủ. | [Mở file tại dòng 210](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L210>) (210–210) |
| `reset` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] reset — Không cung cấp reset/số phiên giả qua API dùng chung. | [Mở file tại dòng 214](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L214>) (214–216) |
| `createGateClient` | [UC05 / UC14] createGateClient — Tạo client HTTP ghi lượt QR và đọc thống kê QR. | [Mở file tại dòng 253](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L253>) (253–271) |
| `sendGateEntry` | [UC05] sendGateEntry — Gửi lượt vào cổng, thử lại có giới hạn và dùng cùng visitId. | [Mở file tại dòng 278](<../packages/admin-core/src/services/GoiApiQuanTri.ts#L278>) (278–303) |

### packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts

Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision.

[Mở file](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `readDocument` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] readDocument — Kiểm tra dữ liệu quản trị đọc từ kho. | [Mở file tại dòng 53](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L53>) (53–92) |
| `createAdminService` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createAdminService — Tạo bộ quy tắc quản trị dùng tại API, bao gồm kiểm tra trạng thái và revision. | [Mở file tại dòng 99](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L99>) (99–595) |
| `mutate` | [UC10 / UC11 / UC12 / UC13] mutate — Xếp hàng thay đổi document, lưu thành công rồi mới thông báo trạng thái mới. | [Mở file tại dòng 147](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L147>) (147–165) |
| `item` | [UC10 / UC11 / UC12 / UC13] item — Tìm đúng hồ sơ và kiểm tra revision trước khi thao tác để tránh ghi đè bản mới hơn. | [Mở file tại dòng 172](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L172>) (172–182) |
| `touch` | [UC10 / UC11] touch — Tăng revision và đưa bản đang sửa về nháp, hủy dấu duyệt cũ sau thay đổi. | [Mở file tại dòng 189](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L189>) (189–196) |
| `replaceText` | [UC11] replaceText — Thay bản ngôn ngữ trong bản nháp, cập nhật phiên bản và trạng thái văn bản/audio. | [Mở file tại dòng 210](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L210>) (210–224) |
| `identity` | [UC09] identity — Trả danh tính và quyền quản lý được cấp sẵn; đây không phải xác thực tài khoản/mật khẩu. | [Mở file tại dòng 230](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L230>) (230–235) |
| `savePlace` | [UC10] savePlace — Kiểm tra và lưu hồ sơ di tích, tăng revision và đưa bản đang sửa về nháp; giữ bản công bố cũ. | [Mở file tại dòng 247](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L247>) (247–343) |
| `saveContent` | [UC11] saveContent — Lưu văn bản/bản thu của ngôn ngữ đang biên tập và cập nhật revision bản nháp. | [Mở file tại dòng 346](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L346>) (346–389) |
| `translate` | [UC11] translate — Dịch từ nội dung nguồn đã lưu sang ngôn ngữ đích, kiểm tra revision để tránh ghi đè tác vụ mới. | [Mở file tại dòng 394](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L394>) (394–412) |
| `generateAudio` | [UC11] generateAudio — Tạo bản thu theo văn bản và ngôn ngữ đã lưu, gắn kết quả vào đúng phiên bản nội dung. | [Mở file tại dòng 415](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L415>) (415–452) |
| `submit` | [UC12] submit — Kiểm tra điều kiện gửi duyệt và revision, rồi chuyển bản nháp sang trạng thái chờ duyệt. | [Mở file tại dòng 455](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L455>) (455–464) |
| `review` | [UC12] review — Ghi quyết định duyệt hoặc yêu cầu sửa; kiểm tra revision và yêu cầu ghi chú khi trả sửa. | [Mở file tại dòng 467](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L467>) (467–481) |
| `publish` | [UC13] publish — Chỉ công bố revision đã được duyệt; sao chép văn bản/audio thành ảnh chụp dữ liệu published. | [Mở file tại dòng 484](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L484>) (484–517) |
| `archive` | [UC10] archive — Lưu trữ di tích và ngừng cung cấp bản công bố cho du khách. | [Mở file tại dòng 520](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L520>) (520–526) |
| `deletePlace` | [UC10] deletePlace — Xóa hồ sơ di tích theo các điều kiện nghiệp vụ hiện có và ghi lại thay đổi. | [Mở file tại dòng 533](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L533>) (533–544) |
| `published` | [UC02 / UC04 / UC07] published — Chỉ trả bản công bố của các di tích chưa bị lưu trữ cho phía du khách. | [Mở file tại dòng 588](<../packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts#L588>) (588–591) |

### packages/admin-core/src/XuatCongKhai.ts

Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập.

[Mở file](<../packages/admin-core/src/XuatCongKhai.ts>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### packages/place-core/src/data/DiTichMauKiemThu.ts

Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package

[Mở file](<../packages/place-core/src/data/DiTichMauKiemThu.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `loadMockPlaces` | [UC02 / UC04 / UC07 / UC08] loadMockPlaces — mô phỏng một nguồn dữ liệu bất đồng bộ. | [Mở file tại dòng 390](<../packages/place-core/src/data/DiTichMauKiemThu.ts#L390>) (390–417) |

### packages/place-core/src/hooks/useChoNgungNhap.ts

Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời

[Mở file](<../packages/place-core/src/hooks/useChoNgungNhap.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `useDebounce` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] useDebounce — trì hoãn cập nhật một giá trị. | [Mở file tại dòng 26](<../packages/place-core/src/hooks/useChoNgungNhap.ts#L26>) (26–61) |

### packages/place-core/src/XuatCongKhai.ts

Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập.

[Mở file](<../packages/place-core/src/XuatCongKhai.ts>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `normalize` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] normalize — Chuẩn hóa chữ hoa/thường và dấu để tìm từ khóa nhất quán. | [Mở file tại dòng 105](<../packages/place-core/src/XuatCongKhai.ts#L105>) (105–114) |
| `searchPlaces` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] searchPlaces — tìm địa điểm trong ngôn ngữ đang chọn. | [Mở file tại dòng 127](<../packages/place-core/src/XuatCongKhai.ts#L127>) (127–171) |
| `filterCategories` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] filterCategories — lọc một hoặc nhiều danh mục. | [Mở file tại dòng 183](<../packages/place-core/src/XuatCongKhai.ts#L183>) (183–200) |
| `categoryCounts` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] categoryCounts — đếm số địa điểm thuộc từng danh mục. | [Mở file tại dòng 211](<../packages/place-core/src/XuatCongKhai.ts#L211>) (211–227) |
| `shouldShowCategories` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] shouldShowCategories — quyết định có cần hiển thị bộ lọc danh mục. | [Mở file tại dòng 237](<../packages/place-core/src/XuatCongKhai.ts#L237>) (237–242) |
| `sortPlaces` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] sortPlaces — sắp xếp theo khoảng cách, tên hoặc đánh giá. | [Mở file tại dòng 271](<../packages/place-core/src/XuatCongKhai.ts#L271>) (271–393) |
| `compareNames` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] compareNames — so sánh tên theo ngôn ngữ đang chọn. | [Mở file tại dòng 326](<../packages/place-core/src/XuatCongKhai.ts#L326>) (326–348) |
| `createPlaceService` | [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] createPlaceService — tạo service danh sách có thể thay nguồn dữ liệu. | [Mở file tại dòng 421](<../packages/place-core/src/XuatCongKhai.ts#L421>) (421–537) |

### services/catalog/KiemTraLenhQuanTri.cjs

Kiểm tra tên lệnh và đối số trước khi API gọi nghiệp vụ quản trị.

[Mở file](<../services/catalog/KiemTraLenhQuanTri.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `validateCommand` | [UC10 / UC11 / UC12 / UC13] validateCommand — Chỉ cho phép các lệnh trong hợp đồng, không gọi tùy ý phương thức từ JSON gửi lên. | [Mở file tại dòng 54](<../services/catalog/KiemTraLenhQuanTri.cjs#L54>) (54–76) |

### services/catalog/MayChuApi.cjs

Nhận yêu cầu HTTP cho danh mục, quản trị, media và lượt QR; gọi nghiệp vụ và repository SQL.

[Mở file](<../services/catalog/MayChuApi.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `loadCore` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] loadCore — Chạy đúng logic TypeScript đang dùng ở FE, tránh chép đôi workflow. | [Mở file tại dòng 40](<../services/catalog/MayChuApi.cjs#L40>) (40–52) |
| `createCatalogServer` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createCatalogServer — Tạo API nội dung dùng chung giữa web và mobile. | [Mở file tại dòng 60](<../services/catalog/MayChuApi.cjs#L60>) (60–348) |
| `run` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] run — Tách request chỉ đọc khỏi lệnh ghi, giữ khởi tạo seed trong khóa ghi. | [Mở file tại dòng 81](<../services/catalog/MayChuApi.cjs#L81>) (81–106) |
| `json` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] json — Đọc body JSON của lệnh quản trị. | [Mở file tại dòng 120](<../services/catalog/MayChuApi.cjs#L120>) (120–131) |

### services/catalog/TaoAmThanhThuyetMinh.cjs

Tạo hoặc lấy bản MP3 từ nội dung và ngôn ngữ đã chọn để chuẩn bị bản thu thuyết minh.

[Mở file](<../services/catalog/TaoAmThanhThuyetMinh.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `audioFile` | [UC11] audioFile — Xác định tệp MP3 của một khóa bản thu. | [Mở file tại dòng 26](<../services/catalog/TaoAmThanhThuyetMinh.cjs#L26>) (26–34) |
| `prepareNarration` | [UC11] prepareNarration — Chuẩn bị bản MP3 theo văn bản và ngôn ngữ, tái sử dụng kết quả phù hợp khi có. | [Mở file tại dòng 41](<../services/catalog/TaoAmThanhThuyetMinh.cjs#L41>) (41–110) |

### services/catalog/ThuatNguDich.cjs

Cung cấp thuật ngữ để giữ tên di tích và thuật ngữ lịch sử nhất quán khi dịch nội dung.

[Mở file](<../services/catalog/ThuatNguDich.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/catalog/TuDongDich.cjs

Dịch văn bản sang ngôn ngữ đích qua dịch vụ ngoài; chia đoạn và chuẩn hóa kết quả dịch.

[Mở file](<../services/catalog/TuDongDich.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `chunks` | [UC11] chunks — Chia văn bản theo giới hạn byte UTF-8 của một request dịch. | [Mở file tại dòng 17](<../services/catalog/TuDongDich.cjs#L17>) (17–40) |
| `plain` | [UC11] plain — Đổi các thực thể HTML thường gặp trong kết quả về văn bản thuần. | [Mở file tại dòng 45](<../services/catalog/TuDongDich.cjs#L45>) (45–57) |
| `translateText` | [UC11] translateText — Chia và gửi văn bản đến dịch vụ dịch, sau đó chuẩn hóa kết quả theo ngôn ngữ đích. | [Mở file tại dòng 60](<../services/catalog/TuDongDich.cjs#L60>) (60–115) |

### services/catalog/XuLyTepTaiNguyen.cjs

Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố.

[Mở file](<../services/catalog/XuLyTepTaiNguyen.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/presence/.test-build/client.cjs

Cung cấp thành phần hạ tầng hoặc dữ liệu hỗ trợ các chức năng của ứng dụng.

[Mở file](<../services/presence/.test-build/client.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createPresenceClient` | [UC14] createPresenceClient — Tạo client gửi heartbeat/kết thúc phiên và đọc số phiên hoạt động. | [Mở file tại dòng 33](<../services/presence/.test-build/client.cjs#L33>) (33–33) |
| `startPresenceHeartbeat` | [UC14] startPresenceHeartbeat — Gửi heartbeat ngay rồi định kỳ để máy chủ biết phiên vẫn còn hoạt động. | [Mở file tại dòng 35](<../services/presence/.test-build/client.cjs#L35>) (35–35) |
| `createPresenceClient` | [UC14] createPresenceClient — Tạo client gửi heartbeat/kết thúc phiên và đọc số phiên hoạt động. | [Mở file tại dòng 39](<../services/presence/.test-build/client.cjs#L39>) (39–92) |
| `heartbeat` | [UC14] heartbeat — Ghi nhận một phiên du khách vẫn đang sử dụng hệ thống. | [Mở file tại dòng 61](<../services/presence/.test-build/client.cjs#L61>) (61–63) |
| `end` | [UC14] end — Kết thúc một phiên theo mã. | [Mở file tại dòng 69](<../services/presence/.test-build/client.cjs#L69>) (69–71) |
| `startPresenceHeartbeat` | [UC14] startPresenceHeartbeat — Gửi heartbeat ngay rồi định kỳ để máy chủ biết phiên vẫn còn hoạt động. | [Mở file tại dòng 94](<../services/presence/.test-build/client.cjs#L94>) (94–111) |

### services/presence/MayChuApi.cjs

Nhận heartbeat/kết thúc phiên và trả số phiên còn hoạt động từ SQL Server.

[Mở file](<../services/presence/MayChuApi.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `readJson` | [UC14] readJson — Đọc JSON giới hạn 4 KB để request sai không làm đầy RAM. | [Mở file tại dòng 19](<../services/presence/MayChuApi.cjs#L19>) (19–32) |
| `createPresenceServer` | [UC14] createPresenceServer — Tạo HTTP API thống kê phiên. | [Mở file tại dòng 39](<../services/presence/MayChuApi.cjs#L39>) (39–96) |

### services/database/AnhXaMuoiMotBang.cjs

Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt.

[Mở file](<../services/database/AnhXaMuoiMotBang.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/CanhBaoNangCapTepCu.cjs

Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng.

[Mở file](<../services/database/CanhBaoNangCapTepCu.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/catalog/ChuanBiThayDoiDuLieu.cjs

Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.

[Mở file](<../services/database/catalog/ChuanBiThayDoiDuLieu.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `putRow` | [UC02 / UC03 / UC04] putRow — INSERT/UPDATE có tham số; UPDATE chỉ đặt các cột thật sự thay đổi. | [Mở file tại dòng 33](<../services/database/catalog/ChuanBiThayDoiDuLieu.cjs#L33>) (33–55) |

### services/database/catalog/DocDiTichTuSql.cjs

Ghép các hàng SQL thành dữ liệu di tích mà API đang sử dụng.

[Mở file](<../services/database/catalog/DocDiTichTuSql.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/catalog/GhiDiTichVaoSql.cjs

Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có.

[Mở file](<../services/database/catalog/GhiDiTichVaoSql.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/catalog/TruyVanVaCapMa.cjs

Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có.

[Mở file](<../services/database/catalog/TruyVanVaCapMa.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `rows` | [UC02 / UC03 / UC04] rows — Gửi truy vấn SQL kèm các giá trị tham số. | [Mở file tại dòng 17](<../services/database/catalog/TruyVanVaCapMa.cjs#L17>) (17–21) |
| `nextCode` | [UC02 / UC03 / UC04] nextCode — Xin số tiếp theo từ sequence và ghép tiền tố mã. | [Mở file tại dòng 26](<../services/database/catalog/TruyVanVaCapMa.cjs#L26>) (26–29) |

### services/database/CauHinhSqlServer.cjs

Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile.

[Mở file](<../services/database/CauHinhSqlServer.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/ChayNangCapDatabase.cjs

Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file.

[Mở file](<../services/database/ChayNangCapDatabase.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/ChuyenDoiMaDuLieu.cjs

Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại.

[Mở file](<../services/database/ChuyenDoiMaDuLieu.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/ChuyenSangMuoiMotBang.cjs

Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration.

[Mở file](<../services/database/ChuyenSangMuoiMotBang.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/DauMoiTuongThichDuLieu.cjs

Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng.

[Mở file](<../services/database/DauMoiTuongThichDuLieu.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/DocDuLieuPhienBanCu.cjs

Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng.

[Mở file](<../services/database/DocDuLieuPhienBanCu.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `readDocument` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] readDocument — Đọc từng bảng và ghép đúng bản nháp/bản công bố của mỗi di tích. | [Mở file tại dòng 32](<../services/database/DocDuLieuPhienBanCu.cjs#L32>) (32–137) |

### services/database/HoTroKiemThuDatabase.cjs

Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng.

[Mở file](<../services/database/HoTroKiemThuDatabase.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### services/database/KetNoiSqlServer.cjs

Quản lý pool kết nối SQL Server và database kiểm thử riêng.

[Mở file](<../services/database/KetNoiSqlServer.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `scopeDatabase` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] scopeDatabase — Chọn tên database ứng dụng hoặc database kiểm thử. | [Mở file tại dòng 28](<../services/database/KetNoiSqlServer.cjs#L28>) (28–32) |
| `installSchema` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] installSchema — Nạp định nghĩa SQL từ file cấu trúc 11 bảng. | [Mở file tại dòng 37](<../services/database/KetNoiSqlServer.cjs#L37>) (37–42) |
| `connect` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] connect — Lấy hoặc tạo pool kết nối theo database. | [Mở file tại dòng 47](<../services/database/KetNoiSqlServer.cjs#L47>) (47–79) |
| `close` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] close — Đóng và bỏ pool của phạm vi được yêu cầu. | [Mở file tại dòng 84](<../services/database/KetNoiSqlServer.cjs#L84>) (84–92) |

### services/database/KhoDuLieuSql.cjs

Cung cấp các thao tác SQL cho di tích, lượt QR và phiên hoạt động; điều phối transaction và khóa khi ghi.

[Mở file](<../services/database/KhoDuLieuSql.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createSqlRepository` | [UC02 / UC04 / UC05 / UC10 / UC11 / UC12 / UC13 / UC14] createSqlRepository — Tạo các thao tác đọc/ghi SQL cho API; giao diện không gọi trực tiếp repository này. | [Mở file tại dòng 24](<../services/database/KhoDuLieuSql.cjs#L24>) (24–242) |
| `query` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] query — Thực hiện truy vấn với kiểu tham số đang được repository sử dụng. | [Mở file tại dòng 41](<../services/database/KhoDuLieuSql.cjs#L41>) (41–47) |
| `locked` | [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] locked — Chạy một tác vụ dưới transaction và khóa tài nguyên SQL. | [Mở file tại dòng 52](<../services/database/KhoDuLieuSql.cjs#L52>) (52–73) |
| `catalog` | [UC02 / UC04 / UC10 / UC11 / UC12 / UC13] catalog — Đọc/ghi document di tích trong transaction; bản chỉ đọc không được ghi dữ liệu. | [Mở file tại dòng 77](<../services/database/KhoDuLieuSql.cjs#L77>) (77–111) |
| `catalog` | [UC02 / UC04 / UC10 / UC11 / UC12 / UC13] catalog — Đọc/ghi document di tích trong transaction; bản chỉ đọc không được ghi dữ liệu. | [Mở file tại dòng 114](<../services/database/KhoDuLieuSql.cjs#L114>) (114–114) |
| `gateStatistics` | [UC14] gateStatistics — Cộng số lượt QR của ngày hiện tại theo múi giờ Việt Nam. | [Mở file tại dòng 134](<../services/database/KhoDuLieuSql.cjs#L134>) (134–143) |
| `gateEntry` | [UC05] gateEntry — Kiểm tra ngày + visitId rồi ghi một lượt QR mới; request trùng không tăng số lượt. | [Mở file tại dòng 148](<../services/database/KhoDuLieuSql.cjs#L148>) (148–163) |
| `heartbeat` | [UC14] heartbeat — Thêm/cập nhật thời điểm hoạt động cuối của một phiên; nhiều heartbeat vẫn tính một phiên. | [Mở file tại dòng 183](<../services/database/KhoDuLieuSql.cjs#L183>) (183–206) |
| `end` | [UC14] end — Xóa phiên tương ứng khi khách kết thúc hoạt động. | [Mở file tại dòng 211](<../services/database/KhoDuLieuSql.cjs#L211>) (211–214) |
| `prune` | [UC14] prune — Dọn phiên đã quá hạn theo TTL. | [Mở file tại dòng 219](<../services/database/KhoDuLieuSql.cjs#L219>) (219–226) |
| `snapshot` | [UC14] snapshot — Đếm phiên còn hoạt động và chia theo Web/Mobile; loại phiên đã quá hạn. | [Mở file tại dòng 231](<../services/database/KhoDuLieuSql.cjs#L231>) (231–240) |

### services/database/LuuVaDocTepSql.cjs

Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp.

[Mở file](<../services/database/LuuVaDocTepSql.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `resolveMedia` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] resolveMedia — Đọc tệp theo mã băm API; trong SQL tệp có mã dễ đọc TEP001... | [Mở file tại dòng 129](<../services/database/LuuVaDocTepSql.cjs#L129>) (129–153) |
| `ref` | [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] ref — Mã media đã có chỉ kiểm tra trên metadata SQL của transaction này. | [Mở file tại dòng 161](<../services/database/LuuVaDocTepSql.cjs#L161>) (161–175) |

### services/database/NhapDuLieuKhoiTao.cjs

Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file.

[Mở file](<../services/database/NhapDuLieuKhoiTao.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### scripts/CapNhatNoiDungDiSan.cjs

Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng

[Mở file](<../scripts/CapNhatNoiDungDiSan.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### scripts/ChayApiDiTich.cjs

Khởi động hoặc dùng lại API di tích đang chạy và xác định địa chỉ kết nối phù hợp.

[Mở file](<../scripts/ChayApiDiTich.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `findLanAddress` | [HỖ TRỢ CHUNG] findLanAddress — Tìm IP để điện thoại cùng mạng gọi API. | [Mở file tại dòng 19](<../scripts/ChayApiDiTich.cjs#L19>) (19–40) |
| `updateMobileEnv` | [HỖ TRỢ CHUNG] updateMobileEnv — Chỉ đổi URL LAN cũ; giữ cấu hình triển khai và các biến khác. | [Mở file tại dòng 47](<../scripts/ChayApiDiTich.cjs#L47>) (47–60) |

### scripts/ChayDemoCongKhai.cjs

Chuẩn bị bản web demo, mở tunnel HTTPS, kiểm tra khả năng truy cập rồi phối hợp tạo QR công

[Mở file](<../scripts/ChayDemoCongKhai.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `isBuiltGuidePage` | [HỖ TRỢ CHUNG] isBuiltGuidePage — QR chỉ phục vụ bản đã build, không đưa hàng trăm module dev qua tunnel. | [Mở file tại dòng 24](<../scripts/ChayDemoCongKhai.cjs#L24>) (24–24) |
| `read` | [HỖ TRỢ CHUNG] read — Tên miền tunnel mới có thể bị cache DNS âm trên Windows. | [Mở file tại dòng 43](<../scripts/ChayDemoCongKhai.cjs#L43>) (43–50) |
| `probe` | [HỖ TRỢ CHUNG] probe — Kiểm tra HTML production và bundle JS thật, không nhận HTML fallback. | [Mở file tại dòng 55](<../scripts/ChayDemoCongKhai.cjs#L55>) (55–71) |
| `launch` | [HỖ TRỢ CHUNG] launch — Giữ server/tunnel chạy nền khi lệnh tạo QR hoàn tất. | [Mở file tại dòng 77](<../scripts/ChayDemoCongKhai.cjs#L77>) (77–86) |
| `cloudflaredArgs` | [HỖ TRỢ CHUNG] cloudflaredArgs — Tránh đường IPv6 đang timeout khi máy có VPN/WARP. | [Mở file tại dòng 116](<../scripts/ChayDemoCongKhai.cjs#L116>) (116–119) |
| `tunnelFailure` | [HỖ TRỢ CHUNG] tunnelFailure — Phân biệt URL đã cấp với tunnel thực sự kết nối. | [Mở file tại dòng 125](<../scripts/ChayDemoCongKhai.cjs#L125>) (125–130) |

### scripts/ChayMobileDuKhach.cjs

Khởi chạy Expo du khách và truyền địa chỉ proxy Metro theo mạng LAN hiện tại để app gọi mock

[Mở file](<../scripts/ChayMobileDuKhach.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `visitorOptions` | [HỖ TRỢ CHUNG] visitorOptions — Tạo cấu hình chạy Expo du khách. | [Mở file tại dòng 19](<../scripts/ChayMobileDuKhach.cjs#L19>) (19–28) |

### scripts/ChayMobileQuanTri.cjs

Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi

[Mở file](<../scripts/ChayMobileQuanTri.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `adminOptions` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] adminOptions — Tạo URL từ IP mạng vật lý và cổng Expo, không dùng IP API cũ trong .env. | [Mở file tại dòng 27](<../scripts/ChayMobileQuanTri.cjs#L27>) (27–36) |

### scripts/ChayWebsite.cjs

Kiểm tra/tự khởi chạy mock API còn thiếu rồi chạy Vite du khách hoặc admin; dùng lại RAM service

[Mở file](<../scripts/ChayWebsite.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `readJson` | [HỖ TRỢ CHUNG] readJson — Đọc API có giới hạn thời gian; không nhầm trang HTML với JSON. | [Mở file tại dòng 19](<../scripts/ChayWebsite.cjs#L19>) (19–26) |
| `healthy` | [HỖ TRỢ CHUNG] healthy — Kiểm tra mock service có đúng loại và sẵn sàng không. | [Mở file tại dòng 32](<../scripts/ChayWebsite.cjs#L32>) (32–35) |
| `portOpen` | [HỖ TRỢ CHUNG] portOpen — Kiểm tra một cổng đã được sử dụng. | [Mở file tại dòng 41](<../scripts/ChayWebsite.cjs#L41>) (41–56) |
| `launchDetached` | [HỖ TRỢ CHUNG] launchDetached — API chạy nền để đóng web không làm mất RAM mà admin/mobile đang dùng. | [Mở file tại dòng 63](<../scripts/ChayWebsite.cjs#L63>) (63–80) |
| `ensureService` | [HỖ TRỢ CHUNG] ensureService — Tái sử dụng service đúng, báo rõ khi sai cổng hoặc API tùy chỉnh chưa chạy. | [Mở file tại dòng 87](<../scripts/ChayWebsite.cjs#L87>) (87–101) |
| `ensureDevServices` | [HỖ TRỢ CHUNG] ensureDevServices — Dùng chung bước kiểm tra API cho web và Expo admin; không khởi động trùng RAM. | [Mở file tại dòng 107](<../scripts/ChayWebsite.cjs#L107>) (107–135) |

### scripts/ChuyenTiepApiDuKhachMetro.cjs

Proxy giới hạn bản du khách vào nội dung/audio công bố, lượt vào và heartbeat; chặn đường quản

[Mở file](<../scripts/ChuyenTiepApiDuKhachMetro.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createVisitorApiMiddleware` | [HỖ TRỢ CHUNG] createVisitorApiMiddleware — Tạo proxy giới hạn quyền truy cập của bản du khách. | [Mở file tại dòng 15](<../scripts/ChuyenTiepApiDuKhachMetro.cjs#L15>) (15–33) |

### scripts/ChuyenTiepApiMetro.cjs

Middleware chuyển tiếp HTTP trong Metro; giữ mã trạng thái, JSON và Range, trả lỗi khi nguồn

[Mở file](<../scripts/ChuyenTiepApiMetro.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createDevApiProxy` | [HỖ TRỢ CHUNG] createDevApiProxy — Tạo lớp chuyển tiếp HTTP trong Metro. | [Mở file tại dòng 14](<../scripts/ChuyenTiepApiMetro.cjs#L14>) (14–55) |

### scripts/ChuyenTiepApiQuanTriMetro.cjs

Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai.

[Mở file](<../scripts/ChuyenTiepApiQuanTriMetro.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `createAdminApiMiddleware` | [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createAdminApiMiddleware — Tạo proxy dành riêng cho bản quản trị. | [Mở file tại dòng 21](<../scripts/ChuyenTiepApiQuanTriMetro.cjs#L21>) (21–27) |

### scripts/DongGoiKiemThuQuanTri.cjs

Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI.

[Mở file](<../scripts/DongGoiKiemThuQuanTri.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### scripts/KetNoiHttpsQR.cjs

Tiện ích request/xác minh kết nối HTTPS phục vụ tạo QR, gồm xử lý trường hợp DNS theo triển khai

[Mở file](<../scripts/KetNoiHttpsQR.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `fetchQrPage` | [UC05] fetchQrPage — Kiểm tra bằng fetch thường trước; chỉ dùng DNS dự phòng cho tunnel khi ENOTFOUND. | [Mở file tại dòng 46](<../scripts/KetNoiHttpsQR.cjs#L46>) (46–56) |

### scripts/KiemTraCauHinhMoiTruong.cjs

Kiểm tra cách đặt file .env trước khi commit/build.

[Mở file](<../scripts/KiemTraCauHinhMoiTruong.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `validateEntries` | [HỖ TRỢ CHUNG] validateEntries — Kiểm tra namespace và tên biến mà không in giá trị. | [Mở file tại dòng 21](<../scripts/KiemTraCauHinhMoiTruong.cjs#L21>) (21–31) |

### scripts/KiemTraWebsiteSanSang.cjs

Xác minh danh sách và ảnh SQL đi được qua cùng URL website của QR.

[Mở file](<../scripts/KiemTraWebsiteSanSang.cjs>)

File khai báo, cấu hình hoặc xuất module; xem chú thích đầu file.

### scripts/TaoLienKetUngDung.cjs

Sinh các tệp association Android/iOS từ cấu hình định danh và chứng thư cho liên kết mở ứng

[Mở file](<../scripts/TaoLienKetUngDung.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `associationFiles` | [UC05] associationFiles — Tạo dữ liệu xác minh từ cấu hình. | [Mở file tại dòng 16](<../scripts/TaoLienKetUngDung.cjs#L16>) (16–165) |

### scripts/TaoMaQRCongKhai.cjs

Tạo QR HTTPS dùng chung sau khi xác nhận website đúng ứng dụng và truy cập được.

[Mở file](<../scripts/TaoMaQRCongKhai.cjs>)

| Hàm/khối | UC và chức năng | Dòng bắt đầu–kết thúc |
|---|---|---|
| `sharedEntryUrl` | [UC05] sharedEntryUrl — Tạo liên kết QR chung tại cổng với tham số entry=gate. | [Mở file tại dòng 19](<../scripts/TaoMaQRCongKhai.cjs#L19>) (19–31) |
| `setVariable` | [UC05] setVariable — Thay đúng biến URL, giữ nguyên cấu hình khác của người dùng. | [Mở file tại dòng 38](<../scripts/TaoMaQRCongKhai.cjs#L38>) (38–44) |
| `verifyWebsite` | [UC05] verifyWebsite — Không tạo ảnh QR trỏ vào website đã chết hoặc trang lỗi tunnel. | [Mở file tại dòng 50](<../scripts/TaoMaQRCongKhai.cjs#L50>) (50–71) |

