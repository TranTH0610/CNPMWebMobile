/**
 * FILE NÀY LÀM GÌ
 * Điểm import các hook danh mục và tìm kiếm chung; màn hình dùng trạng thái tải, lỗi, dữ liệu và
 * tải lại từ đây.
 *
 * VỊ TRÍ: apps/mobile/src/hooks/usePlaces.ts
 * DÙNG BỞI: apps/mobile/src/screens/DetailScreen.tsx; apps/mobile/src/screens/HomeScreen.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core/react
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// CHỨC NĂNG: Điểm import hooks danh sách/chi tiết/tìm kiếm của ứng dụng.
// XỬ LÝ: Dùng chung triển khai với nền tảng còn lại, không sao chép nghiệp vụ.
// Xuất lại thành phần từ '@travelguide/visitor-core/react'.
export { usePublishedCatalog, usePublishedPlace, useExplore, usePlaceFilters, useVisitorPosition, useDebounce } from '@travelguide/visitor-core/react'
