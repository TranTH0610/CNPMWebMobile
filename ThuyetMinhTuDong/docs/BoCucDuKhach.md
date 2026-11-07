# Tải QR và bố cục du khách — 06/11/2026

## Kết quả chẩn đoán

Người dùng xác nhận vấn đề là chờ lâu sau khi quét, không phải luôn mất kết nối.
Tại thời điểm kiểm tra, SQL/API cục bộ và đường HTTPS của QR đều trả HTTP 200, đủ 9 di tích.
Không tìm thấy bằng chứng SQL đang mất kết nối trong lượt kiểm tra này.

Phát hiện: Home và Journey cùng đọc published khi khởi tạo, nhưng client chỉ gộp request document,
chưa gộp published. Đồng thời, bundle đầu tải luôn Leaflet dù chưa mở bản đồ.

## Các thay đổi

| File | Vai trò và thay đổi |
|---|---|
| packages/admin-core/src/services/GoiApiQuanTri.ts | Gộp GET published đang chờ; bỏ promise khi thành công/lỗi và khi có lệnh ghi. Không cache kết quả, không fallback RAM/offline |
| packages/admin-core/tests/KiemThuQuanTri.test.cjs | Test request đồng thời chỉ gửi một lần, thử lại sau lỗi và không cache sau thành công |
| scripts/KiemTraWebsiteSanSang.cjs | Kiểm tra published JSON và HEAD một ảnh SQL qua cùng origin HTTPS; chỉ đọc, không tăng lượt QR |
| scripts/ChayDemoCongKhai.cjs | Không xác nhận QR sẵn sàng chỉ dựa vào HTML/version |
| scripts/TaoMaQRCongKhai.cjs | CLI tạo QR cũng kiểm tra dữ liệu/ảnh trước khi ghi QR mới |
| scripts/KiemThuQRCongKhai.test.cjs | Test chặn API 503, HTMLfallback và ảnh 404; danh sách rỗng hợp lệ |
| apps/web/src/app/DinhTuyenDuKhach.tsx | Tải JourneyPage/Leaflet theo nhu cầu, giữ mọi URL và provider |
| apps/web/src/shared/components/BaoVeLoiTrang.tsx | Có thông báo và nút tải lại nếu module bản đồ tải lỗi |
| apps/web/src/features/explore/pages/TrangChu.tsx | Tách hero thành ảnh, giới thiệu và công cụ tìm kiếm; giữ callback search/filter |
| apps/web/src/features/explore/styles/GiaoDienDuKhach.css | Grid desktop, ảnh trên/nội dung dưới trên điện thoại; một viền focus, nút tìm riêng; reset CSS cũ gây chồng vùng |
| apps/web/src/shared/components/AnhDiTich.tsx | Giải mã ảnh async, vẫn giữ placeholder và URI lỗi riêng |
| apps/mobile/src/features/explore/components/KhoiChaoMung.tsx | Hero native riêng, chiều cao theo nội dung, vùng ảnh/tìm kiếm tách nhau |
| apps/mobile/src/features/explore/screens/ManKhamPha.tsx | Ghép ExploreHero bằng callback cũ, giữ FlatList/refresh/filter/navigation |
| apps/mobile/src/shared/components/NutThaoTac.tsx | Thêm style tùy chọn để nút hero có thể co và xuống dòng |
| apps/mobile/src/features/explore/components/TheDiTich.tsx | Thẻ nổi bật có ảnh và nội dung riêng thay vì chữ đè lên ảnh |
| apps/mobile/src/features/explore/GiaoDienKhamPha.ts | Bỏ chiều cao cố định thẻ nổi bật, giữ chỗ cho chữ dài/cỡ chữ lớn |

## Số đo và kiểm chứng

- Bundle web đầu theo Vite: khoảng 492.34 kB → 337.07 kB, giảm khoảng 31.5%; gzip 167.31 kB → 121.92 kB.
- Leaflet/trang bản đồ chuyển sang chunk riêng khoảng 156.50 kB, chỉ tải khi mở /journey.
- Danh sách qua HTTPS trong lượt sau build: HTTP 200,9di tích, khoảng 643 ms.
- Root HTML, bundle chính và bundle bản đồ qua HTTPS đều HTTP 200, không phải module dev.
- Kiểm tra dữ liệu và HEAD ảnh qua HTTPS đạt; tổng thời gian phép kiểm tra khoảng 2.8 giây.
- Đây là số đo từ máy phát triển qua tunnel, không phải cam kết tốc độ trên điện thoại/4G.
- TypeScript/lint/format check đạt; build visitor/admin đạt; export iOS và Android đạt.
- Admin-core 29/29 test; public QR 10/10 test đạt.
- Không đổi SQL schema, nội dung di tích, contract API, thuật toán khoảng cách, bán kính hoặc điều kiện tự phát.

## Giới hạn kiểm tra giao diện

Công cụ CUA không khởi tạo được do lỗi đường dẫn tài nguyên runtime, kể cả sau reset.
Vì vậy đợt này chưa có screenshot QA mới và chưa xác minh trực quan trên máy thật.
Đã rà soát CSS kế thừa, bỏ display flex/z-index âm cũ của hero, kiểm tra kiểu dữ liệu và bundle.
Cần người dùng mở web ở màn hình nhỏ và Reload native để kiểm tra trực quan thực tế.

## Cách chạy thử

Web đang chạy ở cổng 5173; bản QR đang trỏ qua preview 4173 và tunnel hiện có.
Build mới đã được ghi vào dist để preview phục vụ. Có thể mở lại QR hiện tại và tải lại trang.
Nếu tunnel đã dừng hoặc máy tính khởi động lại, chạy npm run demo:public và dùng QR được xác minh mới.
Mobile: Reload trong Expo sau khi máy chủ Metro đang chạy. Không cần đổi database hay nhập lại di tích.

Mạng/tunnel/SQL vẫn cần hoạt động; sửa frontend không thể bảo đảm tốc độ khi máy chủ tắt hoặc mạng đứt.
