/**
 * FILE: apps/web/src/features/explore/hooks/useDanhSachDiTich.ts
 * FILE NÀY LÀM GÌ: Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và tải lại từ đây.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
