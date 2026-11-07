/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.
 *
 * VỊ TRÍ: apps/web/src/features/language/hooks/useDuKhach.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 * - apps/web/src/features/explore/components/TheDiTich.tsx
 * - apps/web/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 * - apps/web/src/features/language/components/ChonNgonNgu.tsx
 * - apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
 * - apps/web/src/shared/layouts/BoCucDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core/react
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// CHỨC NĂNG: Lấy ngôn ngữ và trạng thái du khách từ cùng provider.

export { useVisitor } from '@travelguide/visitor-core/react'
