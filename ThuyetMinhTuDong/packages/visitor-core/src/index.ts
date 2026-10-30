/**
 * FILE NÀY LÀM GÌ
 * Điểm export công khai của package; nơi dùng import tên package thay vì truy cập sâu vào file nội
 * bộ.
 *
 * VỊ TRÍ: packages/visitor-core/src/index.ts
 * DÙNG BỞI: apps/mobile/src/components/admin/AdminUI.tsx;
 * apps/mobile/src/components/admin/AudioPreview.tsx; apps/mobile/src/components/CategoryChips.tsx;
 * và các nơi import khác.
 * PHỤ THUỘC: ./domain/model; ./catalog/catalog; ./catalog/search; ./links/qr; ./links/site;
 * ./data/mock; ./i18n/messages; ./catalog/presentation; ./data/photos; ./data/heritage;
 * ./audio/playback; ./audio/preview
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// CHỨC NĂNG: Công khai phần logic không phụ thuộc giao diện.
// XỬ LÝ: Mobile và web import bằng tên package thay vì đường dẫn sâu.
// Xuất lại thành phần từ './domain/model'.
export * from './domain/model'
// Xuất lại thành phần từ './catalog/catalog'.
export * from './catalog/catalog'
// Xuất lại thành phần từ './catalog/search'.
export * from './catalog/search'
// Xuất lại thành phần từ './links/qr'.
export * from './links/qr'
// Xuất lại thành phần từ './links/site'.
export * from './links/site'
// Xuất lại thành phần từ './data/mock'.
export * from './data/mock'
// Xuất lại thành phần từ './i18n/messages'.
export * from './i18n/messages'
// Xuất lại thành phần từ './catalog/presentation'.
export * from './catalog/presentation'

// CHỨC NĂNG: Giữ phần React ở entry riêng.
// XỬ LÝ: Hooks tiếp tục được import từ @travelguide/visitor-core/react;
// không export chúng tại đây để test nghiệp vụ không phải nạp React.
// Xuất lại thành phần từ './data/photos'.
export { PLACE_PHOTOS } from './data/photos'

// CHỨC NĂNG: Công khai nguồn lịch sử và tra MP3 dùng chung web/mobile/Admin.
// Xuất lại thành phần từ './data/heritage'.
export * from './data/heritage'

// CHỨC NĂNG: Bộ điều khiển nghe thử và quyền phát chung, dùng được trong test thuần.
// Xuất lại thành phần từ './audio/playback'.
export * from './audio/playback'
// Xuất lại thành phần từ './audio/preview'.
export * from './audio/preview'
