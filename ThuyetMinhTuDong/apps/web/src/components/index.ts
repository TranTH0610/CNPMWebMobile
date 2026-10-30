/**
 * FILE NÀY LÀM GÌ
 * Xuất các component qua một điểm import để màn hình dùng gọn và dễ quản lý đường dẫn.
 *
 * VỊ TRÍ: apps/web/src/components/index.ts
 * DÙNG BỞI: apps/web/src/components/Catalogue.tsx; apps/web/src/components/Navbar.tsx;
 * apps/web/src/pages/DetailPage.tsx; và các nơi import khác.
 * PHỤ THUỘC: ./Icon; ./LanguagePicker; ./State; ./PlaceImage; ./CategoryChips; ./PlaceCard
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Xuất lại thành phần từ './Icon'.
export { Icon } from './Icon'
// Xuất lại thành phần từ './LanguagePicker'.
export { LanguagePicker } from './LanguagePicker'
// Xuất lại thành phần từ './State'.
export { State } from './State'
// Xuất lại thành phần từ './PlaceImage'.
export { PlaceImage } from './PlaceImage'
// Xuất lại thành phần từ './CategoryChips'.
export { CategoryChips } from './CategoryChips'
// Xuất lại thành phần từ './PlaceCard'.
export { PlaceCard } from './PlaceCard'
