# Tra cứu theo mã chức năng

Nhấn **Ctrl+Shift+F** trong VS Code và nhập nguyên mã có dấu ngoặc vuông.

| Mã | Tìm code thực hiện việc gì? |
|---|---|
| `[KHAM-PHA]` | Danh sách, tìm kiếm, lọc và sắp xếp di tích |
| `[CHI-TIET]` | Nội dung chi tiết di tích |
| `[DINH-VI]` | GPS, bản đồ và điều hướng theo địa điểm gợi ý |
| `[THUYET-MINH]` | Tạo, phát, tạm dừng và điều khiển audio |
| `[NGON-NGU]` | Bản dịch giao diện và chọn ngôn ngữ |
| `[TU-DONG-DICH]` | Dịch nội dung di tích |
| `[QUAN-LY-DI-TICH]` | Thêm/sửa và quản lý di tích |
| `[BIEN-TAP]` | Thao tác biên tập nội dung |
| `[LUU-NHAP]` | Lưu và nạp lại bản nháp |
| `[KIEM-DUYET]` | Gửi duyệt, xét duyệt và công bố |
| `[TRUY-CAP-QR]` | Phân tích liên kết và ghi lượt vào cổng |
| `[PHIEN-HOAT-DONG]` | Heartbeat, hết hạn và kết thúc phiên |
| `[THONG-KE]` | Tổng hợp số liệu quản trị |
| `[TAI-NGUYEN]` | Ảnh, MP3 và lựa chọn tệp |
| `[DATABASE]` | Pool, truy vấn và dữ liệu SQL Server |
| `[DIEU-HUONG]` | Route, tab, stack và liên kết mở ứng dụng |
| `[GIAO-DIEN]` | Màu, bố cục, component và trạng thái hiển thị |
| `[KIEM-THU]` | Bộ kiểm thử tự động |
| `[KHOI-DONG]` / `[CAU-HINH]` | Lệnh chạy và cấu hình môi trường |
| `[KIEU-DU-LIEU]` / `[DUNG-CHUNG]` | Kiểu, hợp đồng và tiện ích chung |

Đọc **VAI TRÒ** để phân biệt file giao diện, hook, service hoặc SQL. Đọc **CÁC KHỐI CHÍNH** rồi dùng Ctrl+Shift+O để đến đúng hàm.

Tên hàm và tên biến vẫn giữ nguyên để bảo toàn API và nghiệp vụ; chỉ tên file được Việt hóa. File cấu hình bắt buộc, entry, tài nguyên và tên đường dẫn công khai được giữ ổn định. Không chèn comment vào JSON vì JSON không hỗ trợ chú thích.

- [Bản đồ file và hàm](BanDoChucNang.md)
- [Cây thư mục và bảng đổi tên](CayThuMucVaChucNang.md)
- [Hướng dẫn database](../services/database/README.md)
