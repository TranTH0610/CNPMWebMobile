/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.
 *
 * VỊ TRÍ: apps/web/src/features/journey/hooks/useHanhTrinh.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx
 * - apps/web/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core/journey/react
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// CHỨC NĂNG: Dùng cùng phiên audio/GPS và tiến độ trên toàn ứng dụng.

export { useJourney } from '@travelguide/visitor-core/journey/react'
