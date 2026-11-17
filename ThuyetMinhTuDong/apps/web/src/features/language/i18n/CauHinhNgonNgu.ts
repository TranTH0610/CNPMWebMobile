/**
 * FILE: apps/web/src/features/language/i18n/CauHinhNgonNgu.ts
 * FILE NÀY LÀM GÌ: Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { createVisitorI18n } from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Khởi tạo ngôn ngữ đúng một lần ở tầng ứng dụng.
// XỬ LÝ: Resource VI/EN/CN/PT/JA dùng chung với nền tảng còn lại.

export const boot = createVisitorI18n()

export { useText } from '@travelguide/visitor-core/react'
