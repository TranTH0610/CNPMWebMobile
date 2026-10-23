# Thẻ địa điểm và tuyến tham quan — 23/10/2026

| File | Thay đổi | Được dùng bởi |
|---|---|---|
| apps/web/src/pages/JourneyPage.tsx | Thẻ ảnh mở chi tiết, nút định vị riêng, nguồn tọa độ tách riêng; tuyến có thứ tự và liên kết chi tiết. | AppRoutes tại /journey |
| apps/web/src/styles/journey.css | Thẻ 2 cột desktop/1 cột mobile, vùng bấm lớn, nút cách nhau, trạng thái đang chọn. | JourneyPage |

Bấm ảnh/tên/Xem địa điểm → React Router mở /places/ID → DetailPage tải và hiển thị địa điểm. Bấm Bản đồ → query placeId đổi → VisitorMap phóng tới marker; bấm marker mở chi tiết. Nguồn tọa độ nằm trong mục mở rộng riêng và dẫn tới OpenStreetMap.

Xem thứ tự này chọn tuyến và hiện các điểm đánh số. Từng điểm là liên kết chi tiết. Tự khám phá xóa lựa chọn tuyến. Không tự phát audio, không giả lập tuyến đi bộ đã khảo sát.

Đã kiểm tra trực tiếp: mở Kỳ Đài từ danh sách, định vị và mở marker Điện Thái Hòa, chọn tuyến và mở Ngọ Môn từ tuyến. Đã đạt typecheck web, lint web và build:web. Bản trước sửa được sao lưu ở thư mục reviews/journey-cards-20261023 trong workspace CNPM 6.

Chạy thử từ gốc dự án: npm run dev --workspace=web. Nếu Vite đang chạy, chỉ cần tải lại trang /journey; không cần cài thư viện mới. Nếu cổng 5173 đang dùng, tận dụng cửa sổ Vite đang chạy.

Full code hai file đã đồng bộ trong UC06-UC11-CODE.md, có chú thích chức năng và cách kiểm tra cuối file.
