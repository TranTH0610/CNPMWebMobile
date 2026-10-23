/**
 * FILE NÀY LÀM GÌ: Cung cấp hooks địa điểm đang được các màn hình gọi.
 * Vị trí: apps/web/src/hooks/usePlaces.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Điểm import hooks danh sách/chi tiết/tìm kiếm của ứng dụng.
// XỬ LÝ: Dùng chung triển khai với nền tảng còn lại, không sao chép nghiệp vụ.
export { usePublishedCatalog, usePublishedPlace, useExplore, usePlaceFilters, useVisitorPosition, useDebounce } from '@travelguide/visitor-core/react'
