/**
 * CHỨC NĂNG: [BIEN-TAP] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Mở cùng form đầy đủ với màn thêm di tích. AdminRoutes gọi; PlaceFormPage đọc id trên URL và tải bản nháp từ SQL. TẠI SAO: Chỉ một form quản lý metadata, nội dung, dịch và audio để tránh hai màn bị lệch.
 *
 * VỊ TRÍ: apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - ../places/TrangThemSuaDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
export { PlaceFormPage as ContentEditorPage } from '../places/TrangThemSuaDiTich'
