# Cấu trúc thư mục và chức năng

```text
ThuyetMinhTuDong/
├── apps/  Các ứng dụng web và mobile
│   ├── mobile/  Ứng dụng Expo
│   │   ├── assets/  
│   │   ├── src/  Mã nguồn ứng dụng/package
│   │   │   ├── app/  Khởi tạo ứng dụng và ghép provider/router
│   │   │   │   └── TrangThaiUngDung.tsx  Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái.
│   │   │   ├── features/  Chia nhóm theo chức năng
│   │   │   │   ├── admin/  Quản trị
│   │   │   │   │   ├── content/  Biên tập nội dung
│   │   │   │   │   │   ├── components/  Các thành phần giao diện
│   │   │   │   │   │   │   └── NgheThuBanThu.tsx  Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt.
│   │   │   │   │   │   └── ManBienTapNoiDung.tsx  Mở cùng form đầy đủ từ nút Biên tập, không giữ một form riêng thiếu metadata. AdminNavigator gọi; PlaceEditor dùng chung logic lưu nháp/dịch/audio/gửi duyệt với web.
│   │   │   │   │   ├── dashboard/  Thống kê tổng quan
│   │   │   │   │   │   └── ManTongQuan.tsx  Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên kết đến thao tác quản lý.
│   │   │   │   │   ├── places/  Danh sách và thêm/sửa di tích
│   │   │   │   │   │   ├── components/  Các thành phần giao diện
│   │   │   │   │   │   │   ├── BieuMauDiTich.tsx  Hiển thị form thêm/sửa di tích; chuyển thao tác lưu, dịch, tạo audio và gửi duyệt cho hook.
│   │   │   │   │   │   │   └── ChinhSuaAnhDiTich.tsx  Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài.
│   │   │   │   │   │   ├── ManDanhSachDiTich.tsx  Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản lý được cung cấp.
│   │   │   │   │   │   └── ManThemSuaDiTich.tsx  Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp.
│   │   │   │   │   ├── reviews/  Kiểm duyệt
│   │   │   │   │   │   ├── ManChiTietKiemDuyet.tsx  Xem đầy đủ một hồ sơ rồi duyệt, yêu cầu sửa hoặc công bố. ReviewsScreen mở qua mã id; dùng cùng API/revision với web, không tự công bố khi xem.
│   │   │   │   │   │   └── ManDanhSachKiemDuyet.tsx  Hàng chờ kiểm duyệt native chỉ hiển thị ảnh/tên/trạng thái. AdminNavigator gọi; bấm thẻ mở ReviewDetailScreen để xem bài và thao tác duyệt. TẠI SAO: FlatList nhẹ hơn việc mở sẵn mọi bài và trình nghe cùng lúc.
│   │   │   │   │   └── shared/  Phần dùng trong nhiều chức năng
│   │   │   │   │       ├── components/  Các thành phần giao diện
│   │   │   │   │       │   ├── ChonTepTuThietBi.tsx  Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.
│   │   │   │   │       │   └── ThanhPhanQuanTri.tsx  Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động.
│   │   │   │   │       └── services/  Client/API hoặc lớp kết nối dữ liệu
│   │   │   │   │           └── KetNoiDichVuQuanTri.ts  Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.
│   │   │   │   ├── explore/  Tìm kiếm, lọc và khám phá
│   │   │   │   │   ├── components/  Các thành phần giao diện
│   │   │   │   │   │   ├── ChonSapXep.tsx  Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục.
│   │   │   │   │   │   ├── KhoiChaoMung.tsx  Phần chào mừng native có ảnh, nội dung và công cụ tìm tách riêng. HomeScreen gọi; Cover/SearchBar/Action và i18n cung cấp UI, callback cũ giữ toàn bộ nghiệp vụ. TẠI SAO: Không đặt nhiều khối lên ảnh, không khóa chiều cao khi chữ dài hoặc cỡ chữ hệ thống tăng.
│   │   │   │   │   │   ├── NutLocDanhMuc.tsx  Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
│   │   │   │   │   │   ├── OTimKiem.tsx  Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ liệu riêng.
│   │   │   │   │   │   └── TheDiTich.tsx  Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích.
│   │   │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│   │   │   │   │   │   └── useDanhSachDiTich.ts  Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây.
│   │   │   │   │   ├── screens/  Màn hình native
│   │   │   │   │   │   ├── ManKetQuaTimKiem.tsx  Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm.
│   │   │   │   │   │   └── ManKhamPha.tsx  Màn khám phá mobile: ảnh bìa, tìm kiếm, chip danh mục, điểm nổi bật và danh sách điểm tham quan.
│   │   │   │   │   └── GiaoDienKhamPha.ts  Style riêng cho màn khám phá, tìm kiếm và thẻ địa điểm mobile. HomeScreen, SearchBar, CategoryChips, PlaceCard dùng; phụ thuộc ui-tokens. TẠI SAO: Một nơi quản lý khoảng cách/màu, không thay style quản trị hoặc logic tìm kiếm.
│   │   │   │   ├── journey/  Bản đồ, GPS và nghe thuyết minh
│   │   │   │   │   ├── adapters/  Kết nối API thiết bị theo nền tảng
│   │   │   │   │   │   └── KetNoiAudioVaDinhVi.ts  Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage.
│   │   │   │   │   ├── components/  Các thành phần giao diện
│   │   │   │   │   │   ├── BanDoThamQuan.tsx  Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.
│   │   │   │   │   │   ├── NutNgheThuyetMinh.tsx  Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.
│   │   │   │   │   │   ├── TrangThaiDinhVi.tsx  Trạng thái GPS native có icon và chữ, không chỉ dựa vào màu. JourneyScreen dùng; không thay watch, bán kính, gợi ý hoặc auto-play của engine.
│   │   │   │   │   │   └── TrinhNgheThuyetMinh.tsx  Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung.
│   │   │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│   │   │   │   │   │   ├── useDieuHuongHanhTrinh.ts  Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.
│   │   │   │   │   │   └── useHanhTrinh.ts  Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.
│   │   │   │   │   └── screens/  Màn hình native
│   │   │   │   │       └── ManHanhTrinh.tsx  Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh.
│   │   │   │   ├── language/  Ngôn ngữ
│   │   │   │   │   ├── components/  Các thành phần giao diện
│   │   │   │   │   │   └── ThanhChonNgonNgu.tsx  Chọn ngôn ngữ du khách từ provider hiện có. SettingsScreen dùng kiểu mặc định; DetailScreen dùng compact để không che nội dung. TẠI SAO: Cùng một trạng thái ngôn ngữ cho tiêu đề, bài đọc và thuyết minh trên ứng dụng.
│   │   │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│   │   │   │   │   │   └── useDuKhach.ts  Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.
│   │   │   │   │   └── i18n/  Bản dịch giao diện
│   │   │   │   │       └── CauHinhNgonNgu.ts  Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.
│   │   │   │   ├── place-detail/  Chi tiết di tích
│   │   │   │   │   └── screens/  Màn hình native
│   │   │   │   │       └── ManChiTietDiTich.tsx  Chi tiết địa điểm mobile với ảnh lớn, thanh ngôn ngữ và bài thuyết minh dễ đọc. RootNavigator gọi; dùng service/hook du khách và bộ phát ListenButton đã có. TẠI SAO: Một ScrollView dọc, thanh ngôn ngữ ngang giúp tránh lỗi nội dung bị khuất dưới header.
│   │   │   │   ├── presence/  Phiên hoạt động
│   │   │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│   │   │   │   │   │   └── useBaoPhienHoatDong.ts  Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState.
│   │   │   │   │   └── services/  Client/API hoặc lớp kết nối dữ liệu
│   │   │   │   │       └── PhienHoatDong.ts  Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.
│   │   │   │   ├── qr/  Liên kết QR
│   │   │   │   │   └── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│   │   │   │   │       └── useGhiNhanVaoCong.ts  Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
│   │   │   │   └── settings/  Cài đặt
│   │   │   │       └── screens/  Màn hình native
│   │   │   │           └── ManCaiDat.tsx  Màn chọn ngôn ngữ trong nhận diện Heritage. MainTabs dùng; vẫn gọi LanguageBar/provider hiện có để lưu lựa chọn.
│   │   │   ├── navigation/  Điều hướng native và kiểu tham số
│   │   │   │   ├── DieuHuongGoc.tsx  Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết.
│   │   │   │   ├── DieuHuongQuanTri.tsx  Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt.
│   │   │   │   ├── KieuDieuHuongDuKhach.ts  Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình.
│   │   │   │   ├── KieuDieuHuongQuanTri.ts  Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route.
│   │   │   │   ├── LienKetMoUngDung.ts  Cấu hình nhận liên kết mở ứng dụng mobile và phân tích đường dẫn theo quy tắc QR/liên kết chung.
│   │   │   │   ├── ThanhDieuHuongDuKhach.tsx  Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại.
│   │   │   │   └── UngDungQuanTri.tsx  Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.
│   │   │   ├── shared/  Phần dùng trong nhiều chức năng
│   │   │   │   ├── components/  Các thành phần giao diện
│   │   │   │   │   ├── AnhBia.tsx  Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile.
│   │   │   │   │   ├── AnhDiTich.tsx  Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
│   │   │   │   │   ├── NutThaoTac.tsx  Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái khóa/được chọn.
│   │   │   │   │   └── TrangThaiDuLieu.tsx  Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
│   │   │   │   ├── services/  Client/API hoặc lớp kết nối dữ liệu
│   │   │   │   │   ├── KetNoiNenTang.ts  Tạo adapter/bộ nhớ và nguồn danh mục riêng nền tảng; nhận cấu hình API để UI không tự ghép URL dịch vụ.
│   │   │   │   │   ├── NguonTepTaiNguyen.ts  Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL.
│   │   │   │   │   └── XuLyAnhDiTich.ts  Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu.
│   │   │   │   └── GiaoDienChung.ts  Màu và style nền tảng của mobile, dùng lại token chung để các màn có hình thức thống nhất.
│   │   │   └── types/  Khai báo kiểu dữ liệu
│   │   │       └── KieuTaiNguyen.d.ts  Khai báo kiểu import tài nguyên cho TypeScript để ảnh/audio đóng gói được dùng mà không báo thiếu module.
│   │   ├── app.config.js  Ghép cấu hình Expo động với biến môi trường, App Links, định danh ứng dụng và cấu hình bản đồ
│   │   ├── app.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   ├── App.tsx  Entry React của mobile; chọn luồng admin hoặc du khách theo cấu hình bản chạy rồi ghép ứng dụng
│   │   ├── eas.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   ├── index.js  Đăng ký component App với Expo để runtime biết ứng dụng cần khởi động từ đâu.
│   │   ├── metro.config.js  Cấu hình Metro cho monorepo và proxy phát triển; chọn proxy phù hợp bản du khách hoặc admin.
│   │   ├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   └── tsconfig.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   └── web/  Website du khách và quản trị
│       ├── src/  Mã nguồn ứng dụng/package
│       │   ├── app/  Khởi tạo ứng dụng và ghép provider/router
│       │   │   ├── App.tsx  Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route.
│       │   │   ├── DinhTuyenDuKhach.tsx  Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy.
│       │   │   ├── DinhTuyenQuanTri.tsx  Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt.
│       │   │   └── UngDungQuanTri.tsx  Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.
│       │   ├── features/  Chia nhóm theo chức năng
│       │   │   ├── admin/  Quản trị
│       │   │   │   ├── content/  Biên tập nội dung
│       │   │   │   │   ├── components/  Các thành phần giao diện
│       │   │   │   │   │   └── NgheThuBanThu.tsx  Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt.
│       │   │   │   │   └── TrangBienTapNoiDung.tsx  Mở cùng form đầy đủ với màn thêm di tích. AdminRoutes gọi; PlaceFormPage đọc id trên URL và tải bản nháp từ SQL. TẠI SAO: Chỉ một form quản lý metadata, nội dung, dịch và audio để tránh hai màn bị lệch.
│       │   │   │   ├── dashboard/  Thống kê tổng quan
│       │   │   │   │   └── TrangTongQuan.tsx  Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng để hiển thị bốn chỉ số.
│       │   │   │   ├── places/  Danh sách và thêm/sửa di tích
│       │   │   │   │   ├── components/  Các thành phần giao diện
│       │   │   │   │   │   └── ChinhSuaAnhDiTich.tsx  Sửa ảnh đại diện, danh sách URL và tệp ảnh trong form quản trị web. PlaceFormPage gọi cho cả thêm/sửa/biên tập; phụ thuộc thao tác ảnh admin-core, picker và PlaceImage. TẠI SAO: Hiển thị từng ảnh với nút chọn/xóa để không giữ ảnh cũ ở đầu danh sách ngoài ý muốn.
│       │   │   │   │   ├── TrangDanhSachDiTich.tsx  Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.
│       │   │   │   │   └── TrangThemSuaDiTich.tsx  Form quản trị web để thêm, sửa và biên tập di tích. AdminRoutes/ContentEditorPage gọi; usePlaceEditor giữ cùng nghiệp vụ với mobile. TẠI SAO: File này chỉ dựng HTML, chọn tệp và điều hướng; dữ liệu vẫn qua API chung.
│       │   │   │   ├── reviews/  Kiểm duyệt
│       │   │   │   │   └── TrangKiemDuyet.tsx  Danh sách hồ sơ kiểm duyệt dạng thẻ ảnh; mở một hồ sơ để xem và xử lý. AdminRoutes gọi; dùng API admin chung, không tự duyệt/công bố khi chỉ mở thẻ. TẠI SAO: Không tải trình nghe và toàn bộ bài của mọi di tích vào cùng một màn dài.
│       │   │   │   ├── shared/  Phần dùng trong nhiều chức năng
│       │   │   │   │   ├── components/  Các thành phần giao diện
│       │   │   │   │   │   ├── BieuTuongQuanTri.tsx  Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất.
│       │   │   │   │   │   ├── ChonTepTuThietBi.tsx  Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.
│       │   │   │   │   │   └── ThanhPhanQuanTri.tsx  Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động.
│       │   │   │   │   ├── layouts/  Bố cục dùng chung
│       │   │   │   │   │   └── BoCucQuanTri.tsx  Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin.
│       │   │   │   │   └── services/  Client/API hoặc lớp kết nối dữ liệu
│       │   │   │   │       └── KetNoiDichVuQuanTri.ts  Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.
│       │   │   │   └── styles/  Bố cục và giao diện
│       │   │   │       └── GiaoDienQuanTri.css  CSS quản trị web: khung điều hướng, dashboard, danh sách, form và bố cục màn hình nhỏ.
│       │   │   ├── explore/  Tìm kiếm, lọc và khám phá
│       │   │   │   ├── components/  Các thành phần giao diện
│       │   │   │   │   ├── DanhSachVaBoLoc.tsx  Danh mục web gồm tìm kiếm, danh mục/khu vực, sắp xếp, chế độ lưới/danh sách và phân trang.
│       │   │   │   │   ├── NutLocDanhMuc.tsx  Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
│       │   │   │   │   └── TheDiTich.tsx  Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích.
│       │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│       │   │   │   │   └── useDanhSachDiTich.ts  Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây.
│       │   │   │   ├── pages/  Trang web
│       │   │   │   │   ├── TrangChu.tsx  Trang chủ web với hero, ô tìm kiếm, danh mục, carousel điểm nổi bật và danh mục bên dưới.
│       │   │   │   │   └── TrangDanhSachDiTich.tsx  Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.
│       │   │   │   └── styles/  Bố cục và giao diện
│       │   │   │       └── GiaoDienDuKhach.css  Bố cục du khách Hue Imperial Heritage.
│       │   │   ├── journey/  Bản đồ, GPS và nghe thuyết minh
│       │   │   │   ├── adapters/  Kết nối API thiết bị theo nền tảng
│       │   │   │   │   ├── KetNoiAudioVaDinhVi.ts  Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage.
│       │   │   │   │   └── NguonAmThanh.ts  Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web. Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL.
│       │   │   │   ├── components/  Các thành phần giao diện
│       │   │   │   │   ├── BanDoThamQuan.tsx  Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.
│       │   │   │   │   ├── NutNgheThuyetMinh.tsx  Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.
│       │   │   │   │   ├── TrangThaiDinhVi.tsx  Thẻ trạng thái định vị trong trang bản đồ, dựa trên dữ liệu thật. JourneyPage gọi; không xin quyền, không bật GPS hoặc phát âm thanh khi render.
│       │   │   │   │   └── TrinhNgheThuyetMinh.tsx  Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung.
│       │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│       │   │   │   │   ├── useDieuHuongHanhTrinh.ts  Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.
│       │   │   │   │   └── useHanhTrinh.ts  Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.
│       │   │   │   ├── pages/  Trang web
│       │   │   │   │   └── TrangHanhTrinh.tsx  Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo.
│       │   │   │   └── styles/  Bố cục và giao diện
│       │   │   │       ├── GiaoDienTrinhNghe.css  CSS trình nghe thuyết minh, thanh thời gian, trạng thái phát và các nút điều khiển.
│       │   │   │       └── HanhTrinh.css  CSS riêng cho bản đồ, hành trình, danh sách điểm và các khối tương tác liên quan.
│       │   │   ├── language/  Ngôn ngữ
│       │   │   │   ├── components/  Các thành phần giao diện
│       │   │   │   │   └── ChonNgonNgu.tsx  Bộ chọn ngôn ngữ trên web; cập nhật lựa chọn trong provider để giao diện dịch lại.
│       │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│       │   │   │   │   └── useDuKhach.ts  Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.
│       │   │   │   └── i18n/  Bản dịch giao diện
│       │   │   │       └── CauHinhNgonNgu.ts  Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.
│       │   │   ├── place-detail/  Chi tiết di tích
│       │   │   │   └── pages/  Trang web
│       │   │   │       └── TrangChiTietDiTich.tsx  Trang chi tiết du khách với ảnh, bài đọc và hai thao tác nghe/bản đồ. AppRoutes gọi; dùng usePublishedPlace, useVisitor và ListenButton hiện có. TẠI SAO: Phần trình bày tách khỏi service; đổi bố cục không đổi nội dung SQL hay bộ phát audio.
│       │   │   ├── presence/  Phiên hoạt động
│       │   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│       │   │   │   │   └── useBaoPhienHoatDong.ts  Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState.
│       │   │   │   └── services/  Client/API hoặc lớp kết nối dữ liệu
│       │   │   │       └── PhienHoatDong.ts  Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.
│       │   │   └── qr/  Liên kết QR
│       │   │       └── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│       │   │           └── useGhiNhanVaoCong.ts  Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
│       │   ├── shared/  Phần dùng trong nhiều chức năng
│       │   │   ├── components/  Các thành phần giao diện
│       │   │   │   ├── AnhDiTich.tsx  Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
│       │   │   │   ├── BaoVeLoiTrang.tsx  Giữ trang có thông báo thử lại nếu tải module bản đồ thất bại vì mạng. AppRoutes bọc trang tải theo nhu cầu; State cung cấp nhãn đã dịch và nút thử lại thật. TẠI SAO: Suspense chỉ xử lý đang tải; lỗi tải chunk cần boundary để không làm trắng toàn app.
│       │   │   │   ├── BieuTrungDiSan.tsx  Dấu hiệu cổng cung đình bằng SVG, dùng tại Navbar và AdminLayout. TẠI SAO: Logo vector sắc nét ở mọi kích thước, không phụ thuộc emoji/font của thiết bị.
│       │   │   │   ├── BieuTuong.tsx  Các biểu tượng SVG dùng lại trong website du khách.
│       │   │   │   └── TrangThaiDuLieu.tsx  Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
│       │   │   ├── layouts/  Bố cục dùng chung
│       │   │   │   ├── BoCucDuKhach.tsx  Khung website du khách ghép thanh điều hướng, nội dung route và các thành phần dùng chung của trang.
│       │   │   │   ├── ChanTrang.tsx  Chân trang du khách gọn, chỉ giữ tên ứng dụng. AppLayout dùng; phụ thuộc useText để tên hiển thị đúng ngôn ngữ. CHỨC NĂNG: Không đưa thông báo tài khoản, dữ liệu mẫu hoặc thông tin kỹ thuật vào chân trang.
│       │   │   │   └── ThanhDieuHuong.tsx  Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
│       │   │   ├── pages/  Trang web
│       │   │   │   └── TrangKhongTimThay.tsx  Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
│       │   │   ├── services/  Client/API hoặc lớp kết nối dữ liệu
│       │   │   │   ├── KetNoiNenTang.ts  Tạo adapter/bộ nhớ và nguồn danh mục riêng nền tảng; nhận cấu hình API để UI không tự ghép URL dịch vụ.
│       │   │   │   ├── NguonTepTaiNguyen.ts  Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static.
│       │   │   │   └── XuLyAnhDiTich.ts  Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts.
│       │   │   └── styles/  Bố cục và giao diện
│       │   │       ├── DiSanHue.css  Thành phần nền tảng Heritage cho web du khách và quản trị.
│       │   │       └── GiaoDienNen.css  CSS nền, trang chủ, danh mục và chi tiết du khách; bao gồm các quy tắc responsive của website.
│       │   ├── main-admin.tsx  Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách.
│       │   ├── main.tsx  Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML.
│       │   └── vite-env.d.ts  Nạp khai báo kiểu vite/client để TypeScript hiểu import tài nguyên, CSS và môi trường Vite.
│       ├── static/  
│       ├── index.html  Tài liệu hoặc cấu hình hỗ trợ
│       ├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
│       ├── tsconfig.json  Dữ liệu hoặc cấu hình được module khác đọc.
│       ├── vercel.admin.json  Dữ liệu hoặc cấu hình được module khác đọc.
│       ├── vercel.json  Dữ liệu hoặc cấu hình được module khác đọc.
│       └── vite.config.ts  Cấu hình Vite: chọn bản du khách/admin, tài nguyên tĩnh, build và proxy đến mock API trong môi
├── design-system/  
├── docs/  Hướng dẫn và bản đồ chức năng
│   ├── ADMIN_CODE_DAY_DU.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ADMIN_MOBILE_GIAO_DIEN_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ADMIN_MOBILE_GIAO_DIEN.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ADMIN_TACH_RIENG.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ADMIN_UC12_UC17.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ADMIN_WEB_GIAO_DIEN_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ADMIN_WEB_GIAO_DIEN.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── BanDoChucNang.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── BoCucDuKhach.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── CAU_TRUC_DU_AN.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── CayThuMucVaChucNang.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── CHAY_ADMIN_MOBILE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── CHAY_DU_AN.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── CHAY_MOBILE_DU_KHACH.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── CHAY_QR_DEMO.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── DONG_BO_ADMIN_RAM_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── DONG_BO_ADMIN_RAM.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── DONG_BO_WEB_MOBILE_QR.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── EXPO_SDK_58.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── GiaoDienDuKhach.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── HieuNangSqlServer.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── HuongDanCodeDeBaoTri.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── lenh.txt  Tài liệu hoặc cấu hình hỗ trợ
│   ├── LuongKiemDuyet.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── LuongLuuBanNhap.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── MaChucNang.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── NOI_DUNG_DI_TICH_WIKIPEDIA_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── NOI_DUNG_DI_TICH_WIKIPEDIA.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── PACKAGES_DI_CHUYEN.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   ├── PLAYER_QR_NHAN_VIEN_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── PLAYER_QR_NHAN_VIEN.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── QR_KHONG_CAN_EXPO_GO.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── README.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_ANH_VA_DONG_TRINH_NGHE_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_ANH_VA_DONG_TRINH_NGHE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_DANH_SACH_BAN_DO.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_LOI_UC01_UC05.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_NGHE_THU_VI_TRI_NODE_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_NGHE_THU_VI_TRI_NODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_NOI_BAT_RONG.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── SUA_QR_GIAO_DIEN_ANH.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── THANH_NGHE_THU_ADMIN_MOBILE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── ThietKeGiaoDienDiSan.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── THONG_KE_RAM_CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── THONG_KE_RAM.md  Tài liệu hoặc cấu hình hỗ trợ
│   ├── UC06-UC11-CODE.md  Tài liệu hoặc cấu hình hỗ trợ
│   └── XuLyAnhVaPhongChu.md  Tài liệu hoặc cấu hình hỗ trợ
├── packages/  Các package dùng chung
│   ├── admin-core/  
│   │   ├── src/  Mã nguồn ứng dụng/package
│   │   │   ├── domain/  
│   │   │   │   ├── HopDongDichVu.ts  Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình.
│   │   │   │   ├── KiemTraDuLieu.ts  Kiểm tra dữ liệu địa điểm, URL tài nguyên và điều kiện sẵn sàng cho quy trình kiểm duyệt.
│   │   │   │   ├── KieuDuLieuQuanTri.ts  Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung.
│   │   │   │   └── XuLyAnhDiTich.ts  Các thao tác ảnh đang nhập trong form, dùng chung cho web/mobile.
│   │   │   ├── i18n/  Bản dịch giao diện
│   │   │   │   └── BanDichGiaoDien.ts  Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và
│   │   │   ├── react/  
│   │   │   │   ├── TrangThaiReact.tsx  Provider/hook React quản trị; đọc service, phản hồi thao tác, cập nhật dữ liệu và hook thống kê
│   │   │   │   └── useBienTapDiTich.ts  Quản lý form và thao tác lưu nháp, tự dịch, tạo audio, gửi duyệt dùng chung web/mobile.
│   │   │   ├── services/  Client/API hoặc lớp kết nối dữ liệu
│   │   │   │   ├── GoiApiQuanTri.ts  Triển khai hợp đồng quản trị qua HTTP; gom xử lý request, phản hồi, lỗi và theo dõi cập nhật dữ
│   │   │   │   └── XuLyNghiepVuQuanTri.ts  Nghiệp vụ tạo/sửa, gửi duyệt, kiểm duyệt và công bố nội dung quản trị.
│   │   │   └── XuatCongKhai.ts  Điểm export công khai của package; nơi dùng import tên package thay vì truy cập sâu vào file nội
│   │   ├── tests/  
│   │   │   └── KiemThuQuanTri.test.cjs  Kiểm tra quy trình admin, revision, lỗi lưu, kiểm duyệt/công bố, dữ liệu mô phỏng và tạo âm
│   │   ├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   ├── tsconfig.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   └── tsconfig.test.json  Kiểm thử hành vi và trường hợp lỗi.
│   ├── api-client/  
│   │   ├── tsconfig.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   └── XuatCongKhai.ts  Client gọi API transcribe từ cấu hình URL. Đây là tiện ích có trong kho mã; không đồng nghĩa
│   ├── place-core/  
│   │   ├── src/  Mã nguồn ứng dụng/package
│   │   │   ├── data/  
│   │   │   │   └── DiTichMauKiemThu.ts  Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package
│   │   │   ├── hooks/  Hook lấy dữ liệu và xử lý vòng đời
│   │   │   │   └── useChoNgungNhap.ts  Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời
│   │   │   └── XuatCongKhai.ts  Logic danh mục giai đoạn đầu: chuẩn hóa bỏ dấu, tìm theo ngôn ngữ, lọc/thống kê danh mục, sắp
│   │   ├── tests/  
│   │   │   └── KiemThuNghiepVuChung.test.cjs  Kiểm tra bỏ dấu tiếng Việt, tìm theo ngôn ngữ, danh mục, sắp xếp và service danh mục.
│   │   ├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   └── tsconfig.test.json  Kiểm thử hành vi và trường hợp lỗi.
│   ├── shared-types/  
│   │   ├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   └── XuatCongKhai.ts  Khai báo kiểu Place và các kiểu dữ liệu chia sẻ của phần danh mục; metadata mới giữ tương thích
│   ├── ui-tokens/  
│   │   ├── HienThiDinhVi.ts  Chọn nhãn/kiểu trình bày GPS từ trạng thái engine đã có.
│   │   └── MauVaKichThuoc.ts  Token nhận diện Hue Imperial Heritage dùng chung web và mobile.
│   ├── visitor-core/  
│   │   ├── src/  Mã nguồn ứng dụng/package
│   │   │   ├── audio/  
│   │   │   │   ├── DieuKhienNgheThu.ts  Controller nghe thử giữ một track qua pause/resume, quản lý tua, tốc độ, âm lượng và đóng nguồn.
│   │   │   │   └── DieuPhoiPhatAmThanh.ts  Bộ điều phối quyền phát trong cùng ứng dụng; yêu cầu nguồn trước tạm dừng khi nguồn mới nhận
│   │   │   ├── catalog/  
│   │   │   │   ├── DanhMucDiTich.ts  Service danh mục công bố; loại bản nháp/ngoài phạm vi và lấy chi tiết đúng ID theo cùng điều
│   │   │   │   ├── DuLieuHienThi.ts  Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu.
│   │   │   │   └── TimKiemVaBoLoc.ts  Hàm thuần tìm kiếm, danh mục, sắp xếp và khoảng cách; dùng chung để web/mobile xử lý nhất quán.
│   │   │   ├── data/  
│   │   │   │   ├── DanhMucAnh.ts  Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero.
│   │   │   │   ├── DanhMucBanThu.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   │   │   ├── DiSanHue.ts  Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng.
│   │   │   │   ├── DuLieuKhoiTao.ts  Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo.
│   │   │   │   └── NoiDungDiSan.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   │   ├── domain/  
│   │   │   │   └── KieuDuLieuDuKhach.ts  Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ.
│   │   │   ├── i18n/  Bản dịch giao diện
│   │   │   │   ├── BanDichDiSan.ts  Tài nguyên chuỗi liên quan nội dung di tích theo ngôn ngữ; i18n tra khóa để các nền tảng hiển
│   │   │   │   ├── BanDichGiaoDien.ts  Tài nguyên chuỗi cơ bản du khách theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
│   │   │   │   ├── BanDichHanhTrinh.ts  Tài nguyên chuỗi bài nghe và hành trình theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị
│   │   │   │   ├── BanDichThanhPhan.ts  Tài nguyên chuỗi trang khám phá và danh mục theo ngôn ngữ; i18n tra khóa để các nền tảng hiển
│   │   │   │   ├── BanDichTraiNghiem.ts  Nhãn giao diện Heritage cho đủ năm ngôn ngữ.
│   │   │   │   └── BanDichTruyCapQR.ts  Tài nguyên chuỗi liên kết và QR theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
│   │   │   ├── journey/  Bản đồ, GPS và nghe thuyết minh
│   │   │   │   ├── DuLieuHanhTrinh.ts  Dữ liệu điểm bản đồ và tuyến tham khảo; cờ xác minh phân biệt dữ liệu bản đồ với khảo sát thực
│   │   │   │   ├── HanhTrinh.ts  Controller giữ trạng thái nghe, GPS, tuyến và tiến độ. Nhận adapter để không phụ thuộc React
│   │   │   │   └── TrangThaiHanhTrinhReact.tsx  Provider và hook đưa JourneyController vào React; các màn đọc cùng một phiên hành trình.
│   │   │   ├── links/  
│   │   │   │   ├── DiaChiWebsite.ts  Chuẩn hóa/cấu hình địa chỉ website dùng cho liên kết chung theo quy tắc của dự án.
│   │   │   │   └── PhanTichLienKetQR.ts  Kiểm tra và phân tích liên kết QR; nhận liên kết vào cổng chung và từ chối dữ liệu không hợp lệ.
│   │   │   ├── presence/  Phiên hoạt động
│   │   │   │   ├── PhienHoatDong.ts  Hợp đồng và HTTP client thống kê dùng chung; gửi heartbeat ngay rồi lặp sau 30 giây, xử lý
│   │   │   │   └── TheoDoiPhienReact.ts  Hook đọc thống kê định kỳ cho admin; quản lý tải, lỗi, thử lại và dừng lịch khi component rời
│   │   │   ├── react/  
│   │   │   │   └── TrangThaiReact.tsx  Provider/hook React du khách: i18n, lựa chọn ngôn ngữ, tải danh mục, tìm kiếm và trạng thái dùng
│   │   │   └── XuatCongKhai.ts  Điểm export công khai của package; nơi dùng import tên package thay vì truy cập sâu vào file nội
│   │   ├── tests/  
│   │   │   ├── KiemThuAmThanh.test.cjs  Kiểm tra nghe thử, pause/resume, tua, âm lượng, tốc độ, đóng nguồn và phối hợp quyền phát.
│   │   │   ├── KiemThuDiaChiWebsite.test.cjs  Kiểm tra cấu hình/địa chỉ website dùng cho liên kết chung.
│   │   │   ├── KiemThuHanhTrinh.test.cjs  Kiểm tra bài nghe, GPS, tuyến, tiến độ, đổi ngôn ngữ và phản hồi đến muộn của nguồn audio.
│   │   │   ├── KiemThuNghiepVuChung.test.cjs  Kiểm tra lọc công bố, ngôn ngữ, QR, tìm kiếm và dữ liệu du khách.
│   │   │   └── KiemThuNgonNgu.test.cjs  Kiểm tra ánh xạ tài nguyên ngôn ngữ để bản dịch không bị ghép nhầm.
│   │   ├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   ├── tsconfig.json  Dữ liệu hoặc cấu hình được module khác đọc.
│   │   └── tsconfig.test.json  Kiểm thử hành vi và trường hợp lỗi.
│   └── README.md  Tài liệu hoặc cấu hình hỗ trợ
├── scripts/  Lệnh chạy và kiểm thử
│   ├── CapNhatNoiDungDiSan.cjs  Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng
│   ├── ChayApiDiTich.cjs  Khởi động hoặc dùng lại API di tích đang chạy và xác định địa chỉ kết nối phù hợp.
│   ├── ChayDemoCongKhai.cjs  Chuẩn bị bản web demo, mở tunnel HTTPS, kiểm tra khả năng truy cập rồi phối hợp tạo QR công
│   ├── ChayMobileDuKhach.cjs  Khởi chạy Expo du khách và truyền địa chỉ proxy Metro theo mạng LAN hiện tại để app gọi mock
│   ├── ChayMobileQuanTri.cjs  Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi
│   ├── ChayWebsite.cjs  Kiểm tra/tự khởi chạy mock API còn thiếu rồi chạy Vite du khách hoặc admin; dùng lại RAM service
│   ├── ChuyenTiepApiDuKhachMetro.cjs  Proxy giới hạn bản du khách vào nội dung/audio công bố, lượt vào và heartbeat; chặn đường quản
│   ├── ChuyenTiepApiMetro.cjs  Middleware chuyển tiếp HTTP trong Metro; giữ mã trạng thái, JSON và Range, trả lỗi khi nguồn
│   ├── ChuyenTiepApiQuanTriMetro.cjs  Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai.
│   ├── DongGoiKiemThuQuanTri.cjs  Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI.
│   ├── KetNoiHttpsQR.cjs  Tiện ích request/xác minh kết nối HTTPS phục vụ tạo QR, gồm xử lý trường hợp DNS theo triển khai
│   ├── KiemThuCauHinhMoiTruong.test.cjs  Kiểm tra tách cấu hình BE/FE, ưu tiên môi trường và lỗi an toàn.
│   ├── KiemThuKhoiDongMobileDuKhach.test.cjs  Kiểm tra cấu hình Expo du khách và proxy chỉ cho phép các route của du khách.
│   ├── KiemThuKhoiDongMobileQuanTri.test.cjs  Kiểm tra cấu hình Expo admin, chọn IP và giới hạn/hành vi proxy quản trị.
│   ├── KiemThuKhoiDongWebsite.test.cjs  Kiểm tra khởi chạy mock API, chọn mạng, dùng lại service và xử lý cổng/API không sẵn sàng.
│   ├── KiemThuLienKetUngDung.test.cjs  Kiểm tra association Android/iOS và giữ cấu hình Expo khi bật App Links.
│   ├── KiemThuNoiDungBanThu.test.cjs  Kiểm tra nội dung tám di tích, năm ngôn ngữ và 40 bản thu khớp dữ liệu giữa web/mobile.
│   ├── KiemThuQRCongKhai.test.cjs  Kiểm tra điều kiện tạo QR, website/bundle hợp lệ và cấu hình tunnel/kết nối.
│   ├── KiemTraCauHinhMoiTruong.cjs  Kiểm tra cách đặt file .env trước khi commit/build.
│   ├── KiemTraWebsiteSanSang.cjs  Xác minh danh sách và ảnh SQL đi được qua cùng URL website của QR.
│   ├── TaoAmThanhMau.py  Tài liệu hoặc cấu hình hỗ trợ
│   ├── TaoCacBanThuyetMinh.py  Tài liệu hoặc cấu hình hỗ trợ
│   ├── TaoLienKetUngDung.cjs  Sinh các tệp association Android/iOS từ cấu hình định danh và chứng thư cho liên kết mở ứng
│   ├── TaoMaQRCongKhai.cjs  Tạo QR HTTPS dùng chung sau khi xác nhận website đúng ứng dụng và truy cập được.
│   └── ThuVienTaoGiongDoc.txt  Tài liệu hoặc cấu hình hỗ trợ
├── services/  Client/API hoặc lớp kết nối dữ liệu
│   ├── catalog/  
│   │   ├── KiemThuApiDiTich.test.cjs  Kiểm tra các client đọc/ghi chung, revision, lượt QR, danh mục công bố và phục vụ MP3.
│   │   ├── KiemThuLenhQuanTri.test.cjs  Kiểm tra giới hạn đầu vào và danh sách lệnh API sau tách validator.
│   │   ├── KiemThuTuDongDich.test.cjs  Test adapter dịch không tốn hạn mức thật; Node gọi trong catalog:test.
│   │   ├── KiemTraLenhQuanTri.cjs  Kiểm tra hình dạng lệnh quản trị trước khi API gọi service nghiệp vụ.
│   │   ├── MayChuApi.cjs  HTTP API cổng 8788: chia sẻ nội dung admin, danh mục công bố, audio, phiên bản và lượt mở
│   │   ├── TaoAmThanhThuyetMinh.cjs  Chuẩn bị MP3 từ nội dung/ngôn ngữ, dùng bộ nhớ đệm tệp cho lớp lưu media SQL.
│   │   ├── ThuatNguDich.cjs  Bảo vệ tên di tích, địa danh, vua và con số trước khi gửi dịch.
│   │   ├── TuDongDich.cjs  Dịch văn bản tiếng Việt bằng MyMemory, không cần API key cho demo.
│   │   └── XuLyTepTaiNguyen.cjs  Trả ảnh/âm thanh từ SQL, có HEAD và HTTP Range để tua trên iOS/web.
│   ├── config/  
│   │   └── DocCauHinhMoiTruong.cjs  Đọc cấu hình SQL riêng từ services/.env.local.
│   ├── database/  Kết nối, migration và truy vấn SQL Server
│   │   ├── catalog/  
│   │   │   ├── ChuanBiThayDoiDuLieu.cjs  Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.
│   │   │   ├── DocDiTichTuSql.cjs  Ghép các hàng SQL thành dữ liệu di tích mà API đang sử dụng.
│   │   │   ├── GhiDiTichVaoSql.cjs  Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có.
│   │   │   └── TruyVanVaCapMa.cjs  Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có.
│   │   ├── AnhXaMuoiMotBang.cjs  Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt.
│   │   ├── CanhBaoNangCapTepCu.cjs  Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng.
│   │   ├── CauHinhSqlServer.cjs  Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile.
│   │   ├── CauTrucMuoiMotBang.sql  Khai báo 11 bảng, khóa, CHECK, sequence và kiểm tra nghiệp vụ của cấu trúc đã chốt.
│   │   ├── CauTrucTepPhienBanCu.sql  Cấu trúc tệp của phiên bản cũ, giữ để tham khảo quy trình migration.
│   │   ├── ChayNangCapDatabase.cjs  Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file.
│   │   ├── ChuyenDoiMaDuLieu.cjs  Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại.
│   │   ├── ChuyenSangMuoiMotBang.cjs  Chuyển dữ liệu cấu trúc cũ sang 11 bảng và đối chiếu dữ liệu trong quy trình migration.
│   │   ├── DauMoiTuongThichDuLieu.cjs  Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng.
│   │   ├── DocDuLieuPhienBanCu.cjs  Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng.
│   │   ├── HoTroKiemThuDatabase.cjs  Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng.
│   │   ├── KetNoiSqlServer.cjs  Quản lý pool kết nối SQL Server và database kiểm thử riêng.
│   │   ├── KhoDuLieuSql.cjs  Điều phối đọc/ghi SQL trong transaction; cung cấp dữ liệu di tích, QR và phiên hoạt động cho API.
│   │   ├── KiemThuRangBuocDatabase.test.cjs  Test SQL thật trên database riêng, không sửa HueGuideDemo.
│   │   ├── KiemThuTepTaiNguyen.test.cjs  Test file SQL và luồng thêm ảnh/audio của admin qua HTTP thật.
│   │   ├── LuuVaDocTepSql.cjs  Lưu và đọc byte ảnh/audio trong SQL Server; dùng mã băm để nhận diện tệp.
│   │   ├── NhapDuLieuKhoiTao.cjs  Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file.
│   │   ├── README.md  Tài liệu hoặc cấu hình hỗ trợ
│   │   └── XemDuLieuVaThongKe.sql  Truy vấn xem bảng, ràng buộc, phiên hoạt động và lượt QR trong SSMS; không sửa dữ liệu.
│   └── presence/  Phiên hoạt động
│       ├── KiemThuPhienHoatDong.test.cjs  Test phiên bằng SQL Server thật và HTTP client dùng bởi FE.
│       ├── KieuKhoDuLieu.d.ts  Hợp đồng kho phiên với heartbeat, end, snapshot và prune; giúp đổi cách lưu sau này mà giữ nơi
│       └── MayChuApi.cjs  Mock HTTP API cổng 8787: nhận heartbeat/end, trả thống kê active và dọn phiên; số liệu lấy từ
├── HUONG_DAN_CAU_HINH.md  Tài liệu hoặc cấu hình hỗ trợ
├── LICENSE  Tài liệu hoặc cấu hình hỗ trợ
├── package.json  Dữ liệu hoặc cấu hình được module khác đọc.
└── tsconfig.json  Dữ liệu hoặc cấu hình được module khác đọc.
```

## Quy tắc quản lý

- features/<chức năng>: tìm code theo nghiệp vụ trước, loại file sau.
- shared: chỉ dùng khi nhiều chức năng cùng cần.
- packages: logic/kiểu/token dùng chung; UI riêng nền tảng nằm trong apps.
- services và database: giữ vị trí thực tế để không phá lệnh migration, seed và API hiện có.
- Không tạo LanguageScreen/ReviewDetailPage hoặc thư mục database mới nếu source đang dùng cách tổ chức khác.
- assets/public/static chỉ thu gọn trong sơ đồ; không xóa tài nguyên.
- node_modules, build, cache, log, .env riêng và bản sao cục bộ không đưa vào sơ đồ.

## File đã di chuyển

| Vị trí cũ | Vị trí mới |
|---|---|
| apps/mobile/src/app/AppProviders.tsx | apps/mobile/src/app/TrangThaiUngDung.tsx |
| apps/mobile/src/features/admin/content/ContentEditorScreen.tsx | apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx |
| apps/mobile/src/features/admin/content/components/AudioPreview.tsx | apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx |
| apps/mobile/src/features/admin/dashboard/DashboardScreen.tsx | apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx |
| apps/mobile/src/features/admin/places/PlaceFormScreen.tsx | apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx |
| apps/mobile/src/features/admin/places/PlacesScreen.tsx | apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx |
| apps/mobile/src/features/admin/places/components/PlaceEditor.tsx | apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx |
| apps/mobile/src/features/admin/places/components/PlaceImagesEditor.tsx | apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx |
| apps/mobile/src/features/admin/reviews/ReviewDetailScreen.tsx | apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx |
| apps/mobile/src/features/admin/reviews/ReviewsScreen.tsx | apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx |
| apps/mobile/src/features/admin/shared/components/AdminUI.tsx | apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx |
| apps/mobile/src/features/admin/shared/components/LocalMediaPicker.tsx | apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx |
| apps/mobile/src/features/admin/shared/services/services.ts | apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts |
| apps/mobile/src/features/explore/styles.ts | apps/mobile/src/features/explore/GiaoDienKhamPha.ts |
| apps/mobile/src/features/explore/components/CategoryChips.tsx | apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx |
| apps/mobile/src/features/explore/components/ExploreHero.tsx | apps/mobile/src/features/explore/components/KhoiChaoMung.tsx |
| apps/mobile/src/features/explore/components/PlaceCard.tsx | apps/mobile/src/features/explore/components/TheDiTich.tsx |
| apps/mobile/src/features/explore/components/SearchBar.tsx | apps/mobile/src/features/explore/components/OTimKiem.tsx |
| apps/mobile/src/features/explore/components/SortDropdown.tsx | apps/mobile/src/features/explore/components/ChonSapXep.tsx |
| apps/mobile/src/features/explore/hooks/usePlaces.ts | apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts |
| apps/mobile/src/features/explore/screens/HomeScreen.tsx | apps/mobile/src/features/explore/screens/ManKhamPha.tsx |
| apps/mobile/src/features/explore/screens/SearchResultScreen.tsx | apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx |
| apps/mobile/src/features/journey/adapters/journeyAdapters.ts | apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts |
| apps/mobile/src/features/journey/components/GpsStatus.tsx | apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx |
| apps/mobile/src/features/journey/components/JourneyPlayer.tsx | apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx |
| apps/mobile/src/features/journey/components/ListenButton.tsx | apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx |
| apps/mobile/src/features/journey/components/VisitorMap.tsx | apps/mobile/src/features/journey/components/BanDoThamQuan.tsx |
| apps/mobile/src/features/journey/hooks/useJourney.ts | apps/mobile/src/features/journey/hooks/useHanhTrinh.ts |
| apps/mobile/src/features/journey/hooks/useJourneyNavigation.ts | apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts |
| apps/mobile/src/features/journey/screens/JourneyScreen.tsx | apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx |
| apps/mobile/src/features/language/components/LanguageBar.tsx | apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx |
| apps/mobile/src/features/language/hooks/useVisitor.ts | apps/mobile/src/features/language/hooks/useDuKhach.ts |
| apps/mobile/src/features/language/i18n/index.ts | apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts |
| apps/mobile/src/features/place-detail/screens/DetailScreen.tsx | apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx |
| apps/mobile/src/features/presence/hooks/usePresenceHeartbeat.ts | apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts |
| apps/mobile/src/features/presence/services/presence.ts | apps/mobile/src/features/presence/services/PhienHoatDong.ts |
| apps/mobile/src/features/qr/hooks/useGateEntry.ts | apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts |
| apps/mobile/src/features/settings/screens/SettingsScreen.tsx | apps/mobile/src/features/settings/screens/ManCaiDat.tsx |
| apps/mobile/src/navigation/AdminApp.tsx | apps/mobile/src/navigation/UngDungQuanTri.tsx |
| apps/mobile/src/navigation/AdminNavigator.tsx | apps/mobile/src/navigation/DieuHuongQuanTri.tsx |
| apps/mobile/src/navigation/adminTypes.ts | apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts |
| apps/mobile/src/navigation/linking.ts | apps/mobile/src/navigation/LienKetMoUngDung.ts |
| apps/mobile/src/navigation/MainTabs.tsx | apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx |
| apps/mobile/src/navigation/RootNavigator.tsx | apps/mobile/src/navigation/DieuHuongGoc.tsx |
| apps/mobile/src/navigation/types.ts | apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts |
| apps/mobile/src/shared/theme.ts | apps/mobile/src/shared/GiaoDienChung.ts |
| apps/mobile/src/shared/components/Action.tsx | apps/mobile/src/shared/components/NutThaoTac.tsx |
| apps/mobile/src/shared/components/Cover.tsx | apps/mobile/src/shared/components/AnhBia.tsx |
| apps/mobile/src/shared/components/PlaceImage.tsx | apps/mobile/src/shared/components/AnhDiTich.tsx |
| apps/mobile/src/shared/components/State.tsx | apps/mobile/src/shared/components/TrangThaiDuLieu.tsx |
| apps/mobile/src/shared/services/mediaSource.ts | apps/mobile/src/shared/services/NguonTepTaiNguyen.ts |
| apps/mobile/src/shared/services/placeImages.ts | apps/mobile/src/shared/services/XuLyAnhDiTich.ts |
| apps/mobile/src/shared/services/platform.ts | apps/mobile/src/shared/services/KetNoiNenTang.ts |
| apps/mobile/src/types/assets.d.ts | apps/mobile/src/types/KieuTaiNguyen.d.ts |
| apps/web/src/app/AdminApp.tsx | apps/web/src/app/UngDungQuanTri.tsx |
| apps/web/src/app/AdminRoutes.tsx | apps/web/src/app/DinhTuyenQuanTri.tsx |
| apps/web/src/app/AppRoutes.tsx | apps/web/src/app/DinhTuyenDuKhach.tsx |
| apps/web/src/features/admin/content/ContentEditorPage.tsx | apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx |
| apps/web/src/features/admin/content/components/AudioPreview.tsx | apps/web/src/features/admin/content/components/NgheThuBanThu.tsx |
| apps/web/src/features/admin/dashboard/DashboardPage.tsx | apps/web/src/features/admin/dashboard/TrangTongQuan.tsx |
| apps/web/src/features/admin/places/PlaceFormPage.tsx | apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx |
| apps/web/src/features/admin/places/PlacesPage.tsx | apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx |
| apps/web/src/features/admin/places/components/PlaceImagesEditor.tsx | apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx |
| apps/web/src/features/admin/reviews/ReviewsPage.tsx | apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx |
| apps/web/src/features/admin/shared/components/AdminIcon.tsx | apps/web/src/features/admin/shared/components/BieuTuongQuanTri.tsx |
| apps/web/src/features/admin/shared/components/AdminUI.tsx | apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx |
| apps/web/src/features/admin/shared/components/LocalMediaPicker.tsx | apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx |
| apps/web/src/features/admin/shared/layouts/AdminLayout.tsx | apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx |
| apps/web/src/features/admin/shared/services/services.ts | apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts |
| apps/web/src/features/admin/styles/admin.css | apps/web/src/features/admin/styles/GiaoDienQuanTri.css |
| apps/web/src/features/explore/components/Catalogue.tsx | apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx |
| apps/web/src/features/explore/components/CategoryChips.tsx | apps/web/src/features/explore/components/NutLocDanhMuc.tsx |
| apps/web/src/features/explore/components/PlaceCard.tsx | apps/web/src/features/explore/components/TheDiTich.tsx |
| apps/web/src/features/explore/hooks/usePlaces.ts | apps/web/src/features/explore/hooks/useDanhSachDiTich.ts |
| apps/web/src/features/explore/pages/HomePage.tsx | apps/web/src/features/explore/pages/TrangChu.tsx |
| apps/web/src/features/explore/pages/PlacesPage.tsx | apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx |
| apps/web/src/features/explore/styles/visitor.css | apps/web/src/features/explore/styles/GiaoDienDuKhach.css |
| apps/web/src/features/journey/adapters/journeyAdapters.ts | apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts |
| apps/web/src/features/journey/adapters/narrationSource.ts | apps/web/src/features/journey/adapters/NguonAmThanh.ts |
| apps/web/src/features/journey/components/GpsStatus.tsx | apps/web/src/features/journey/components/TrangThaiDinhVi.tsx |
| apps/web/src/features/journey/components/JourneyPlayer.tsx | apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx |
| apps/web/src/features/journey/components/ListenButton.tsx | apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx |
| apps/web/src/features/journey/components/VisitorMap.tsx | apps/web/src/features/journey/components/BanDoThamQuan.tsx |
| apps/web/src/features/journey/hooks/useJourney.ts | apps/web/src/features/journey/hooks/useHanhTrinh.ts |
| apps/web/src/features/journey/hooks/useJourneyNavigation.ts | apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts |
| apps/web/src/features/journey/pages/JourneyPage.tsx | apps/web/src/features/journey/pages/TrangHanhTrinh.tsx |
| apps/web/src/features/journey/styles/journey.css | apps/web/src/features/journey/styles/HanhTrinh.css |
| apps/web/src/features/journey/styles/player.css | apps/web/src/features/journey/styles/GiaoDienTrinhNghe.css |
| apps/web/src/features/language/components/LanguagePicker.tsx | apps/web/src/features/language/components/ChonNgonNgu.tsx |
| apps/web/src/features/language/hooks/useVisitor.ts | apps/web/src/features/language/hooks/useDuKhach.ts |
| apps/web/src/features/language/i18n/index.ts | apps/web/src/features/language/i18n/CauHinhNgonNgu.ts |
| apps/web/src/features/place-detail/pages/DetailPage.tsx | apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx |
| apps/web/src/features/presence/hooks/usePresenceHeartbeat.ts | apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts |
| apps/web/src/features/presence/services/presence.ts | apps/web/src/features/presence/services/PhienHoatDong.ts |
| apps/web/src/features/qr/hooks/useGateEntry.ts | apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts |
| apps/web/src/shared/components/HeritageMark.tsx | apps/web/src/shared/components/BieuTrungDiSan.tsx |
| apps/web/src/shared/components/Icon.tsx | apps/web/src/shared/components/BieuTuong.tsx |
| apps/web/src/shared/components/PlaceImage.tsx | apps/web/src/shared/components/AnhDiTich.tsx |
| apps/web/src/shared/components/RouteBoundary.tsx | apps/web/src/shared/components/BaoVeLoiTrang.tsx |
| apps/web/src/shared/components/State.tsx | apps/web/src/shared/components/TrangThaiDuLieu.tsx |
| apps/web/src/shared/layouts/AppLayout.tsx | apps/web/src/shared/layouts/BoCucDuKhach.tsx |
| apps/web/src/shared/layouts/Footer.tsx | apps/web/src/shared/layouts/ChanTrang.tsx |
| apps/web/src/shared/layouts/Navbar.tsx | apps/web/src/shared/layouts/ThanhDieuHuong.tsx |
| apps/web/src/shared/pages/NotFoundPage.tsx | apps/web/src/shared/pages/TrangKhongTimThay.tsx |
| apps/web/src/shared/services/mediaSource.ts | apps/web/src/shared/services/NguonTepTaiNguyen.ts |
| apps/web/src/shared/services/placeImages.ts | apps/web/src/shared/services/XuLyAnhDiTich.ts |
| apps/web/src/shared/services/platform.ts | apps/web/src/shared/services/KetNoiNenTang.ts |
| apps/web/src/shared/styles/heritage.css | apps/web/src/shared/styles/DiSanHue.css |
| apps/web/src/shared/styles/index.css | apps/web/src/shared/styles/GiaoDienNen.css |
| docs/admin-draft-workflow.md | docs/LuongLuuBanNhap.md |
| docs/admin-review-flow.md | docs/LuongKiemDuyet.md |
| docs/clean-code.md | docs/HuongDanCodeDeBaoTri.md |
| docs/FUNCTION_MAP.md | docs/BanDoChucNang.md |
| docs/heritage-redesign.md | docs/ThietKeGiaoDienDiSan.md |
| docs/image-font-fix.md | docs/XuLyAnhVaPhongChu.md |
| docs/PROJECT_STRUCTURE.md | docs/CayThuMucVaChucNang.md |
| docs/sql-performance.md | docs/HieuNangSqlServer.md |
| docs/visitor-interface.md | docs/GiaoDienDuKhach.md |
| docs/visitor-layout-20261106.md | docs/BoCucDuKhach.md |
| packages/admin-core/src/index.ts | packages/admin-core/src/XuatCongKhai.ts |
| packages/admin-core/src/domain/contracts.ts | packages/admin-core/src/domain/HopDongDichVu.ts |
| packages/admin-core/src/domain/models.ts | packages/admin-core/src/domain/KieuDuLieuQuanTri.ts |
| packages/admin-core/src/domain/placeImages.ts | packages/admin-core/src/domain/XuLyAnhDiTich.ts |
| packages/admin-core/src/domain/validation.ts | packages/admin-core/src/domain/KiemTraDuLieu.ts |
| packages/admin-core/src/i18n/messages.ts | packages/admin-core/src/i18n/BanDichGiaoDien.ts |
| packages/admin-core/src/react/react.tsx | packages/admin-core/src/react/TrangThaiReact.tsx |
| packages/admin-core/src/react/usePlaceEditor.ts | packages/admin-core/src/react/useBienTapDiTich.ts |
| packages/admin-core/src/services/adminService.ts | packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts |
| packages/admin-core/src/services/httpService.ts | packages/admin-core/src/services/GoiApiQuanTri.ts |
| packages/admin-core/tests/admin.test.cjs | packages/admin-core/tests/KiemThuQuanTri.test.cjs |
| packages/api-client/index.ts | packages/api-client/XuatCongKhai.ts |
| packages/place-core/src/index.ts | packages/place-core/src/XuatCongKhai.ts |
| packages/place-core/src/data/mockPlaces.ts | packages/place-core/src/data/DiTichMauKiemThu.ts |
| packages/place-core/src/hooks/useDebounce.ts | packages/place-core/src/hooks/useChoNgungNhap.ts |
| packages/place-core/tests/core.test.cjs | packages/place-core/tests/KiemThuNghiepVuChung.test.cjs |
| packages/shared-types/index.ts | packages/shared-types/XuatCongKhai.ts |
| packages/ui-tokens/colors.ts | packages/ui-tokens/MauVaKichThuoc.ts |
| packages/ui-tokens/gps.ts | packages/ui-tokens/HienThiDinhVi.ts |
| packages/visitor-core/src/index.ts | packages/visitor-core/src/XuatCongKhai.ts |
| packages/visitor-core/src/audio/playback.ts | packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts |
| packages/visitor-core/src/audio/preview.ts | packages/visitor-core/src/audio/DieuKhienNgheThu.ts |
| packages/visitor-core/src/catalog/catalog.ts | packages/visitor-core/src/catalog/DanhMucDiTich.ts |
| packages/visitor-core/src/catalog/presentation.ts | packages/visitor-core/src/catalog/DuLieuHienThi.ts |
| packages/visitor-core/src/catalog/search.ts | packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts |
| packages/visitor-core/src/data/heritage.ts | packages/visitor-core/src/data/DiSanHue.ts |
| packages/visitor-core/src/data/heritageContent.json | packages/visitor-core/src/data/NoiDungDiSan.json |
| packages/visitor-core/src/data/mock.ts | packages/visitor-core/src/data/DuLieuKhoiTao.ts |
| packages/visitor-core/src/data/narrations.json | packages/visitor-core/src/data/DanhMucBanThu.json |
| packages/visitor-core/src/data/photos.ts | packages/visitor-core/src/data/DanhMucAnh.ts |
| packages/visitor-core/src/domain/model.ts | packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts |
| packages/visitor-core/src/i18n/design-messages.ts | packages/visitor-core/src/i18n/BanDichTraiNghiem.ts |
| packages/visitor-core/src/i18n/heritage-messages.ts | packages/visitor-core/src/i18n/BanDichDiSan.ts |
| packages/visitor-core/src/i18n/journey-messages.ts | packages/visitor-core/src/i18n/BanDichHanhTrinh.ts |
| packages/visitor-core/src/i18n/messages.ts | packages/visitor-core/src/i18n/BanDichGiaoDien.ts |
| packages/visitor-core/src/i18n/qr-messages.ts | packages/visitor-core/src/i18n/BanDichTruyCapQR.ts |
| packages/visitor-core/src/i18n/uiMessages.ts | packages/visitor-core/src/i18n/BanDichThanhPhan.ts |
| packages/visitor-core/src/journey/journey-data.ts | packages/visitor-core/src/journey/DuLieuHanhTrinh.ts |
| packages/visitor-core/src/journey/journey-react.tsx | packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx |
| packages/visitor-core/src/journey/journey.ts | packages/visitor-core/src/journey/HanhTrinh.ts |
| packages/visitor-core/src/links/qr.ts | packages/visitor-core/src/links/PhanTichLienKetQR.ts |
| packages/visitor-core/src/links/site.ts | packages/visitor-core/src/links/DiaChiWebsite.ts |
| packages/visitor-core/src/presence/presence-react.ts | packages/visitor-core/src/presence/TheoDoiPhienReact.ts |
| packages/visitor-core/src/presence/presence.ts | packages/visitor-core/src/presence/PhienHoatDong.ts |
| packages/visitor-core/src/react/react.tsx | packages/visitor-core/src/react/TrangThaiReact.tsx |
| packages/visitor-core/tests/audio.test.cjs | packages/visitor-core/tests/KiemThuAmThanh.test.cjs |
| packages/visitor-core/tests/core.test.cjs | packages/visitor-core/tests/KiemThuNghiepVuChung.test.cjs |
| packages/visitor-core/tests/journey.test.cjs | packages/visitor-core/tests/KiemThuHanhTrinh.test.cjs |
| packages/visitor-core/tests/locale.test.cjs | packages/visitor-core/tests/KiemThuNgonNgu.test.cjs |
| packages/visitor-core/tests/site.test.cjs | packages/visitor-core/tests/KiemThuDiaChiWebsite.test.cjs |
| scripts/app-links.test.cjs | scripts/KiemThuLienKetUngDung.test.cjs |
| scripts/build-admin-tests.cjs | scripts/DongGoiKiemThuQuanTri.cjs |
| scripts/check-env.cjs | scripts/KiemTraCauHinhMoiTruong.cjs |
| scripts/create-demo-audio.py | scripts/TaoAmThanhMau.py |
| scripts/create-public-qr.cjs | scripts/TaoMaQRCongKhai.cjs |
| scripts/env-config.test.cjs | scripts/KiemThuCauHinhMoiTruong.test.cjs |
| scripts/generate-app-links.cjs | scripts/TaoLienKetUngDung.cjs |
| scripts/generate-narrations.py | scripts/TaoCacBanThuyetMinh.py |
| scripts/metro-admin-proxy.cjs | scripts/ChuyenTiepApiQuanTriMetro.cjs |
| scripts/metro-api-proxy.cjs | scripts/ChuyenTiepApiMetro.cjs |
| scripts/metro-visitor-proxy.cjs | scripts/ChuyenTiepApiDuKhachMetro.cjs |
| scripts/mobile-admin-startup.test.cjs | scripts/KiemThuKhoiDongMobileQuanTri.test.cjs |
| scripts/mobile-visitor-startup.test.cjs | scripts/KiemThuKhoiDongMobileDuKhach.test.cjs |
| scripts/narrations.test.cjs | scripts/KiemThuNoiDungBanThu.test.cjs |
| scripts/public-qr.test.cjs | scripts/KiemThuQRCongKhai.test.cjs |
| scripts/qr-http.cjs | scripts/KetNoiHttpsQR.cjs |
| scripts/requirements-narration.txt | scripts/ThuVienTaoGiongDoc.txt |
| scripts/start-catalog.cjs | scripts/ChayApiDiTich.cjs |
| scripts/start-mobile-admin.cjs | scripts/ChayMobileQuanTri.cjs |
| scripts/start-mobile-visitor.cjs | scripts/ChayMobileDuKhach.cjs |
| scripts/start-public-demo.cjs | scripts/ChayDemoCongKhai.cjs |
| scripts/start-web.cjs | scripts/ChayWebsite.cjs |
| scripts/startup.test.cjs | scripts/KiemThuKhoiDongWebsite.test.cjs |
| scripts/upgrade-heritage-content.cjs | scripts/CapNhatNoiDungDiSan.cjs |
| scripts/visitor-readiness.cjs | scripts/KiemTraWebsiteSanSang.cjs |
| services/catalog/catalog.test.cjs | services/catalog/KiemThuApiDiTich.test.cjs |
| services/catalog/command-validation.cjs | services/catalog/KiemTraLenhQuanTri.cjs |
| services/catalog/command-validation.test.cjs | services/catalog/KiemThuLenhQuanTri.test.cjs |
| services/catalog/media.cjs | services/catalog/XuLyTepTaiNguyen.cjs |
| services/catalog/narration.cjs | services/catalog/TaoAmThanhThuyetMinh.cjs |
| services/catalog/server.cjs | services/catalog/MayChuApi.cjs |
| services/catalog/translation-terms.cjs | services/catalog/ThuatNguDich.cjs |
| services/catalog/translation.cjs | services/catalog/TuDongDich.cjs |
| services/catalog/translation.test.cjs | services/catalog/KiemThuTuDongDich.test.cjs |
| services/config/env.cjs | services/config/DocCauHinhMoiTruong.cjs |
| services/database/catalog-relational.cjs | services/database/DauMoiTuongThichDuLieu.cjs |
| services/database/catalog11.cjs | services/database/AnhXaMuoiMotBang.cjs |
| services/database/config.cjs | services/database/CauHinhSqlServer.cjs |
| services/database/connection.cjs | services/database/KetNoiSqlServer.cjs |
| services/database/database.test.cjs | services/database/KiemThuRangBuocDatabase.test.cjs |
| services/database/ids.cjs | services/database/ChuyenDoiMaDuLieu.cjs |
| services/database/import-demo.cjs | services/database/NhapDuLieuKhoiTao.cjs |
| services/database/legacy-read.cjs | services/database/DocDuLieuPhienBanCu.cjs |
| services/database/media-schema.sql | services/database/CauTrucTepPhienBanCu.sql |
| services/database/media-store.cjs | services/database/LuuVaDocTepSql.cjs |
| services/database/media.test.cjs | services/database/KiemThuTepTaiNguyen.test.cjs |
| services/database/migrate-media.cjs | services/database/CanhBaoNangCapTepCu.cjs |
| services/database/migrate.cjs | services/database/ChayNangCapDatabase.cjs |
| services/database/migrate11.cjs | services/database/ChuyenSangMuoiMotBang.cjs |
| services/database/repository.cjs | services/database/KhoDuLieuSql.cjs |
| services/database/schema.sql | services/database/CauTrucMuoiMotBang.sql |
| services/database/show-data.sql | services/database/XemDuLieuVaThongKe.sql |
| services/database/test-support.cjs | services/database/HoTroKiemThuDatabase.cjs |
| services/database/catalog/changes.cjs | services/database/catalog/ChuanBiThayDoiDuLieu.cjs |
| services/database/catalog/query.cjs | services/database/catalog/TruyVanVaCapMa.cjs |
| services/database/catalog/read.cjs | services/database/catalog/DocDiTichTuSql.cjs |
| services/database/catalog/write.cjs | services/database/catalog/GhiDiTichVaoSql.cjs |
| services/presence/presence.test.cjs | services/presence/KiemThuPhienHoatDong.test.cjs |
| services/presence/repository.d.ts | services/presence/KieuKhoDuLieu.d.ts |
| services/presence/server.cjs | services/presence/MayChuApi.cjs |

## Phạm vi thay đổi

Đổi tên file, giữ nguyên tất cả tên thư mục. Tên hàm, API contract, tên 11 bảng, thuộc tính và dữ liệu SQL giữ nguyên. Các file cấu hình bắt buộc và tài nguyên đang được dữ liệu tham chiếu giữ tên.

Các file JSON không chèn chú thích vì JSON không hỗ trợ comment; tra vai trò tại bảng chức năng.

## Kiểm tra sau đổi tên ngày 06/11/2026

- 229 file đổi tên; đối chiếu bảng đổi tên xác nhận tất cả giữ nguyên thư mục cha.
- 225 file nguồn/kiểm thử/SQL/CSS/Python được chú thích theo chức năng.
- TypeScript, lint và format: đạt.
- npm test: 180/180 kiểm thử đạt; SQL dùng database kiểm thử riêng.
- Build web du khách và quản trị: đạt.
- Expo export du khách và quản trị, mỗi bản iOS + Android: đạt.
- Đối chiếu AST 212 file và 3 file SQL: không thay nghiệp vụ/cấu trúc; chỉ thay tham chiếu tên file và chú thích.
- Chưa kiểm tra thao tác trên điện thoại thật trong lượt đổi tên này.

Bản sao trước đổi tên nằm trong `.runtime/vietnamese-files-20261106/before/`. Không chạy migration trên database ứng dụng trong công việc đổi tên này. Các lỗi mạng Cloudflare trước đó không thuộc phạm vi đổi tên file.
