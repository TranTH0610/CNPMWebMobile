/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Điểm import trạng thái du khách từ provider chung, gồm lựa chọn ngôn ngữ và cấu hình liên quan.
 *
 * VỊ TRÍ: apps/mobile/src/features/language/hooks/useDuKhach.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/components/TheDiTich.tsx
 * - apps/mobile/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 * - apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
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
