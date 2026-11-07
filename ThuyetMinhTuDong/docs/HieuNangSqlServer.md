# Tối ưu truy cập SQL — không đổi 11 bảng

## Đã thay đổi

| File | Chức năng |
|---|---|
| services/database/AnhXaMuoiMotBang.cjs | So sánh từng hàng, chỉ INSERT/UPDATE/DELETE phần đổi; giữ mã BDT/ND/HA/BT/nguồn và không sửa bản công bố khi chỉ lưu nháp |
| services/database/LuuVaDocTepSql.cjs | Dùng một lượt đọc metadata để xác nhận các media: đã có, không SELECT từng file và không đọc lại byte file khi lưu nội dung |
| services/database/KhoDuLieuSql.cjs | catalogRead dùng Shared; catalog ghi dùng Exclusive; các read lặp trong cùng transaction dùng lại kết quả của request đó |
| services/catalog/MayChuApi.cjs | GET dùng nhánh chỉ đọc; metadata tài khoản cấp sẵn không tải danh mục; khởi tạo seed được chuyển riêng sang khóa ghi |
| packages/admin-core/src/services/GoiApiQuanTri.ts | Gộp GET /document đang chạy của cùng client web/mobile; xong request bỏ tham chiếu, sau ghi phải tải mới |

Không thêm bảng/cột/index, không tắt trigger, không đổi isolation của database, không dùng NOLOCK.
Đọc Shared được chạy song song với lượt đọc khác, nhưng vẫn chờ writer Exclusive để tránh thấy trạng thái tạm.
Writer danh mục vẫn được tuần tự hóa để đọc revision và cập nhật nhất quán. Dịch và TTS tiếp tục chạy ngoài transaction.

## Kiểm tra đúng dữ liệu

- Trigger trong database test phát hiện nếu lần lưu đụng di tích khác hoặc bản công bố không đổi.
- Lưu y nguyên không ghi lại các hàng danh mục.
- Đọc đồng thời được phép; không cho gọi write trong catalogRead.
- Sai revision bị conflict; lỗi giữa transaction rollback; xóa hết không tự seed lại.
- Công bố lại, lưu trữ, xóa và ghi lịch sử vẫn tuân thủ FK/CHECK/trigger.
- Kiểm thử chỉ tạo và dọn database test_UUID riêng, không tạo di tích thử trong HueGuideDemo.

## Kết quả đo

So sánh codec trước và sau trên cùng bộ 8 di tích, cùng database test riêng, cùng máy, ba lần cập nhật một di tích:

| Cách ghi | Ba lần đo (ms) | Trung bình |
|---|---|---|
| Ghi lại toàn bộ trước đây | 621, 587, 547 | 585 ms |
| Chỉ ghi thay đổi | 35, 39, 28 | 34 ms |

Đây là số đo thao tác ghi SQL trong môi trường test đã có dữ liệu, không bao gồm thời gian gọi dịch vụ dịch/TTS hoặc khởi động SQL.
Lỗi đăng nhập ODBC gián đoạn từng xuất hiện khi chẩn đoán là vấn đề riêng; không tăng timeout để che lỗi trong lần tối ưu này.
