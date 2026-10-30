/**
 * FILE NÀY LÀM GÌ
 * Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.
 *
 * VỊ TRÍ: apps/web/src/hooks/useVisitor.ts
 * DÙNG BỞI: apps/web/src/components/Catalogue.tsx; apps/web/src/components/LanguagePicker.tsx;
 * apps/web/src/components/ListenButton.tsx; và các nơi import khác.
 * PHỤ THUỘC: @travelguide/visitor-core/react
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// CHỨC NĂNG: Lấy ngôn ngữ và trạng thái du khách từ cùng provider.
// Xuất lại thành phần từ '@travelguide/visitor-core/react'.
export { useVisitor } from '@travelguide/visitor-core/react'
