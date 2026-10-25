> Cập nhật: cơ chế dữ liệu đã chuyển sang API RAM chung và bỏ reset. Xem DONG_BO_ADMIN_RAM.md để chạy đúng cấu hình mới.

# Giao diện Admin web

Admin web đã được thiết kế lại cùng tông xanh–trắng với Admin mobile. Không thêm thư viện và không thay đổi service, quy tắc revision, xác nhận xóa, lưu trữ hoặc công bố.

## Thư mục và file

| Thư mục | Vai trò |
| --- | --- |
| apps/web/src/components/admin | Icon và thành phần UI dùng lại cho Admin. |
| apps/web/src/layouts | Khung điều hướng và trang con. |
| apps/web/src/pages/admin | Các trang quản lý theo nghiệp vụ. |
| apps/web/src/styles | CSS responsive, giới hạn trong lớp admin-*. |

| File | Thao tác | Chức năng |
| --- | --- | --- |
| `apps/web/src/components/admin/AdminIcon.tsx` | TẠO MỚI | Icon SVG riêng cho Admin, không thêm dependency. |
| `apps/web/src/layouts/AdminLayout.tsx` | SỬA | Menu, tiêu đề theo route, danh tính và vùng trang con. |
| `apps/web/src/pages/admin/DashboardPage.tsx` | SỬA | Banner, bốn chỉ số và các liên kết quản lý nhanh. |
| `apps/web/src/pages/admin/PlacesPage.tsx` | SỬA | Thẻ ảnh di tích, tìm kiếm không dấu và mở đúng biểu mẫu. |
| `apps/web/src/pages/admin/PlaceFormPage.tsx` | SỬA | Nhóm thông tin, tọa độ, ảnh xem trước và thao tác lưu/xóa. |
| `apps/web/src/pages/admin/ContentEditorPage.tsx` | SỬA | Biên tập đa ngôn ngữ theo nhóm nội dung, audio và quy trình. |
| `apps/web/src/pages/admin/ReviewsPage.tsx` | SỬA | Nhận diện di tích, so sánh bản ngôn ngữ, duyệt và công bố. |
| `apps/web/src/styles/admin.css` | SỬA | Toàn bộ kiểu hiển thị Admin và breakpoint desktop/tablet/mobile. |

## Luồng dữ liệu

Menu đổi route và tiêu đề hiện tại. Người quản lý gõ tìm kiếm → useDebounce chờ 300 ms → normalize bỏ dấu → useMemo lọc kho hiện có → cập nhật thẻ di tích và số kết quả. Bấm Thông tin hoặc Biên tập mở đúng ID; biểu mẫu gọi service qua useAdmin khi lưu. Việc chia nhóm giao diện không thay đổi validation hoặc workflow. Bốn chỉ số giữ đúng active, QR hôm nay, di tích, chờ duyệt; active vẫn lấy từ API RAM.

## Chạy thử

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run dev:admin --workspace=web
```

Mở http://127.0.0.1:5174/admin. Nếu server đã chạy, chỉ cần tải lại trang. Nếu báo cổng 5174 đang dùng, mở URL trên trước; không tắt tiến trình lạ.

## Kiểm tra đã thực hiện

- TypeScript web: đạt.
- ESLint web: đạt.
- Build Admin web: đạt.
- Dashboard desktop 1440px: bốn chỉ số, menu và thẻ thao tác hiển thị đúng, không tràn ngang.
- 390px: dashboard, form và trang biên tập không tràn ngang; nhóm form chuyển thành một cột.
- Tìm `ky dai`: trả một Kỳ Đài; bấm Thông tin mở đúng /places/ky-dai/edit.
- Biên tập: chọn English đổi nội dung Kỳ Đài sang Flag Tower; không lưu thay đổi dữ liệu trong quá trình kiểm tra.
- Kiểm duyệt: trạng thái rỗng hiển thị đúng. Không tạo dữ liệu hoặc thử công bố/xóa qua UI trong lượt thay đổi giao diện này.

## Tự kiểm tra thêm

1. Tab qua menu, nút, ô nhập và textarea để kiểm tra viền focus.
2. Nhập dữ liệu, rời form chưa lưu phải có cảnh báo; xóa/công bố phải xác nhận.
3. Dùng dữ liệu có hàng chờ để kiểm tra ghi chú, yêu cầu sửa và công bố.
4. Đổi ngôn ngữ giao diện và tăng cỡ chữ trong trình duyệt.

Các số liệu vẫn giữ giới hạn của kho/API hiện tại; thay đổi UI không tự bổ sung đồng bộ nội dung giữa thiết bị.

Commit gợi ý: `feat(web): redesign admin dashboard and management pages`.
