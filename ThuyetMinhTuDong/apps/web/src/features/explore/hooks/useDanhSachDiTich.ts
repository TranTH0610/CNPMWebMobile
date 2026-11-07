/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây.
 *
 * VỊ TRÍ: apps/web/src/features/explore/hooks/useDanhSachDiTich.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 * - apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx
 * - apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
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
// CHỨC NĂNG: Điểm import hooks danh sách/chi tiết/tìm kiếm của ứng dụng.
// XỬ LÝ: Dùng chung triển khai với nền tảng còn lại, không sao chép nghiệp vụ.

export {
  usePublishedCatalog,
  usePublishedPlace,
  useExplore,
  usePlaceFilters,
  useVisitorPosition,
  useDebounce,
} from '@travelguide/visitor-core/react'
