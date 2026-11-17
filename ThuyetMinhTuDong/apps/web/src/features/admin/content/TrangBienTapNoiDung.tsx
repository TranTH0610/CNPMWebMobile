/**
 * FILE: apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx
 * FILE NÀY LÀM GÌ: Mở cùng form đầy đủ với màn thêm di tích. AdminRoutes gọi; PlaceFormPage đọc id trên URL và tải bản nháp từ SQL. TẠI SAO: Chỉ một form quản lý metadata, nội dung, dịch và audio để tránh hai màn bị lệch.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
export { PlaceFormPage as ContentEditorPage } from '../places/TrangThemSuaDiTich'
