# Đồng bộ mobile/web và sửa QR

## Thay đổi

- Hai nền tảng dùng chung loại địa điểm, ngôn ngữ, tìm kiếm bỏ dấu/debounce và sắp xếp trong visitor-core.
- Bỏ chức năng yêu thích: nút tim, tab Favorites, placeholder, state/toggle trong provider và CSS/icon/nhãn không còn dùng.
- Mobile tìm kiếm giống web: bấm Tìm kiếm hoặc phím Search khi trống báo yêu cầu nhập; chạm ô nhập không tự chuyển màn; nhập có chữ rồi gửi mở kết quả.
- Kết quả tiếp tục lọc sau debounce 300 ms. Chip danh mục tác động ngay danh sách và phần nổi bật. Mobile thêm bộ lọc khu vực và xóa tất cả.
- Web: checkbox sidebar và chip hero đồng bộ hai chiều. Thẻ hai nền tảng hiển thị địa chỉ trong bản ngôn ngữ thay vì chỉ ghi Thành phố Huế.
- Màu/nút dùng token chung; bố cục đáp ứng đặc thù web và native, không giả định kích thước pixel giống nhau.
- Bản mobile du khách bỏ lối vào quản lý. Bản quản lý có root riêng và lệnh start:admin; đây là cấu hình bản FE, không thay thế xác thực API.
- QR cũ chứa domain tunnel đã ngừng phân giải. Đã tạo lại QR sau khi kiểm tra HTTPS thực và bundle đúng ứng dụng.
- Lệnh tạo QR từ chối website chết hoặc HTML lỗi. Kiểm tra DNS dự phòng chỉ dành cho trycloudflare, không tắt TLS, không đổi DNS hệ thống.
- demo:public tự mở server RAM nếu chưa có, phục vụ bản build production tại cổng 4173 và chỉ phát hành QR sau khi website đã sẵn sàng.

## Thứ tự chạy từ thư mục gốc

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run demo:public
```

Dùng đúng `.qr-output/shared-qr.png`, mở `.qr-output/index.html` hoặc đọc `.qr-output/shared-url.txt`.
URL được tạo trong lượt sửa: https://steel-theories-erp-cooperative.trycloudflare.com/ .
Đã mở website HTTPS này trong trình duyệt và kiểm tra trang /qr chứa cùng URL. Chưa kiểm tra bằng camera điện thoại vật lý.
Không cần đăng nhập hoặc cài Expo Go để quét QR này; camera mở web trên điện thoại. Không thể tự cài app native chỉ bằng QR.
Máy tính và tunnel phải còn chạy. Tunnel tắt/domain hết phiên: chạy lại lệnh và dùng QR mới. Muốn QR in cố định cần tên miền/hosting cố định.
Không dùng ảnh QR cũ hoặc QR Expo của dev server để truy cập web công khai.

Mobile du khách (terminal riêng):

```powershell
npm run start --workspace=mobile -- --clear
```

Mobile quản lý (dev server riêng 8082):

```powershell
npm run start:admin --workspace=mobile -- --clear
```

Không ghi EXPO_PUBLIC_APP_TARGET=admin vào .env chung của bản du khách. Khi build bản quản lý, đặt biến này cho riêng môi trường build quản lý.
QR config tự điền EXPO_PUBLIC_PRESENCE_API_URL qua tunnel cho mobile du khách nếu URL còn trống hoặc là tunnel cũ; không ghi đè API riêng đã cấu hình.
Mobile quản lý đọc thống kê bằng EXPO_PUBLIC_ADMIN_PRESENCE_API_URL (ví dụ http://IP_MAY_TINH:8787 khi server được mở LAN). Tunnel du khách không công khai API đọc thống kê.
Sửa .env cần restart Expo --clear. Nội dung di tích vẫn dùng service cục bộ trước đây; bước này không tạo đồng bộ dữ liệu biên tập giữa các thiết bị.

## File/folder và vai trò

| File/folder | Vai trò |
|---|---|
| packages/visitor-core/src/TrangThaiReact.tsx | Provider du khách; đã bỏ state và hàm yêu thích |
| packages/visitor-core/src/BanDichThanhPhan.ts | Bộ chữ 5 ngôn ngữ, bỏ key yêu thích không dùng |
| apps/web/src/features/explore/components/TheDiTich.tsx | Thẻ web không tim, hiển thị địa chỉ bản dịch |
| apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx | Bộ lọc đồng bộ checkbox và chip |
| apps/web/src/features/explore/pages/TrangChu.tsx | Truyền lựa chọn danh mục và nhận thay đổi từ sidebar |
| apps/web/src/shared/components/BieuTuong.tsx, styles/GiaoDienNen.css | Bỏ icon/style yêu thích |
| apps/mobile/src/features/explore/components/TheDiTich.tsx | Thẻ native không tim, mở chi tiết và địa chỉ |
| apps/mobile/src/features/explore/components/OTimKiem.tsx | Gửi bằng bàn phím, không tự mở màn lúc focus |
| apps/mobile/src/features/explore/screens/ManKhamPha.tsx | Kiểm tra ô trống, tìm kiếm, lọc danh mục/nổi bật/khu vực |
| apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx | Chỉ còn Khám phá, Bản đồ, Cài đặt |
| apps/mobile/src/features/explore/GiaoDienKhamPha.ts | Style native, bỏ style nút tim |
| apps/mobile/src/screens/PlaceholderScreen.tsx | ĐÃ XÓA vì chỉ phục vụ tab Yêu thích |
| apps/mobile/App.tsx, navigation/UngDungQuanTri.tsx | Chọn root du khách/quản lý theo cấu hình chạy/build |
| apps/mobile/src/navigation/DieuHuongGoc.tsx, KieuDieuHuongDuKhach.ts | Stack du khách không đăng ký Admin |
| apps/mobile/src/features/settings/screens/ManCaiDat.tsx | Không có nút vào Admin |
| apps/mobile/src/navigation/DieuHuongQuanTri.tsx | Stack riêng của bản quản lý |
| apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx | Không có nút quay sang bản du khách, đọc URL thống kê nội bộ |
| apps/mobile/src/features/presence/services/PhienHoatDong.ts | Tách URL heartbeat visitor và statistics admin |
| scripts/ChayMobileQuanTri.cjs, apps/mobile/package.json | Lệnh Expo quản lý riêng trên Windows và các hệ điều hành khác |
| scripts/TaoMaQRCongKhai.cjs | Xác minh website trước khi ghi QR và cập nhật URL hai app |
| scripts/ChayDemoCongKhai.cjs | Build, RAM server, preview và tunnel HTTPS |
| scripts/KetNoiHttpsQR.cjs | Kiểm tra HTTPS/DNS dùng chung, giữ xác minh TLS |
| scripts/KiemThuQRCongKhai.test.cjs | Test link hợp lệ, giữ .env và từ chối website lỗi |
| .qr-output/ | PNG, URL và trạng thái/log phiên tunnel; không commit vào Git |

## Kiểm tra đã chạy

- TypeScript strict và lint toàn bộ workspace: đạt.
- Bộ test hiện tại và test mới cho QR: đạt.
- Build visitor qua demo:public và build admin web: đạt.
- Expo Android export cho cả root visitor/admin: đạt; chưa kiểm thử tương tác trên điện thoại vật lý.
- Trình duyệt: gửi ô trống hiện thông báo; chọn Cung điện lọc ngay 8 xuống 4, checkbox đồng bộ, không có nút yêu thích.
- Website HTTPS mới và trang QR mở được; RAM server nhận heartbeat web.

Commit gợi ý: feat(visitor): align web and mobile filters and remove favorites
Commit gợi ý: fix(qr): validate live HTTPS and refresh shared tunnel QR
