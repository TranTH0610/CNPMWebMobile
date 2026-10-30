/**
 * FILE NÀY LÀM GÌ
 * Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các
 * bản dịch vào app.
 *
 * VỊ TRÍ: apps/web/src/i18n/index.ts
 * DÙNG BỞI: apps/web/src/components/Catalogue.tsx; apps/web/src/components/CategoryChips.tsx;
 * apps/web/src/components/ContentSources.tsx; và các nơi import khác.
 * PHỤ THUỘC: @travelguide/visitor-core/react
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { createVisitorI18n } from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Khởi tạo ngôn ngữ đúng một lần ở tầng ứng dụng.
// XỬ LÝ: Resource VI/EN/CN/PT/JA dùng chung với nền tảng còn lại.
// Khai báo boot: Gọi createVisitorI18n().
export const boot = createVisitorI18n()
// Xuất lại thành phần từ '@travelguide/visitor-core/react'.
export { useText } from '@travelguide/visitor-core/react'
