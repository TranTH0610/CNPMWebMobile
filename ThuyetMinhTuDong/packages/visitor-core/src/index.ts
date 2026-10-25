/**
 * FILE NÀY LÀM GÌ:
 * Xuất các kiểu dữ liệu và hàm nghiệp vụ dùng chung.
 *
 * Được dùng bởi:
 * - Mobile và web thông qua @travelguide/visitor-core.
 *
 * Phụ thuộc:
 * - Các module nghiệp vụ trong cùng thư mục.
 *
 * Liên quan: UC01–UC05.
 */

// CHỨC NĂNG: Công khai phần logic không phụ thuộc giao diện.
// XỬ LÝ: Mobile và web import bằng tên package thay vì đường dẫn sâu.
export * from './domain/model'
export * from './catalog/catalog'
export * from './catalog/search'
export * from './links/qr'
export * from './links/site'
export * from './data/mock'
export * from './i18n/messages'
export * from './catalog/presentation'

// CHỨC NĂNG: Giữ phần React ở entry riêng.
// XỬ LÝ: Hooks tiếp tục được import từ @travelguide/visitor-core/react;
// không export chúng tại đây để test nghiệp vụ không phải nạp React.
export { PLACE_PHOTOS } from './data/photos'

// CHỨC NĂNG: Công khai nguồn lịch sử và tra MP3 dùng chung web/mobile/Admin.
export * from './data/heritage'

// CHỨC NĂNG: Bộ điều khiển nghe thử và quyền phát chung, dùng được trong test thuần.
export * from './audio/playback'
export * from './audio/preview'
