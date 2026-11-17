/**
 * FILE: apps/mobile/src/features/language/hooks/useDuKhach.ts
 * FILE NÀY LÀM GÌ: Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
// CHỨC NĂNG: Lấy ngôn ngữ và trạng thái du khách từ cùng provider.

export { useVisitor } from '@travelguide/visitor-core/react'
