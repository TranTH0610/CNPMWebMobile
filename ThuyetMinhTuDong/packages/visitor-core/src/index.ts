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
export * from './model'
export * from './catalog'
export * from './search'
export * from './qr'
export * from './site'
export * from './mock'
export * from './messages'
export * from './presentation'

// CHỨC NĂNG: Giữ phần React ở entry riêng.
// XỬ LÝ: Hooks tiếp tục được import từ @travelguide/visitor-core/react;
// không export chúng tại đây để test nghiệp vụ không phải nạp React.
export { PLACE_PHOTOS } from './photos'
