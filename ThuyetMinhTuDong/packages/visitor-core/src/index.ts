/**
 * FILE NÀY LÀM GÌ:
 * Xuất logic thuần UC01–UC05 cho ứng dụng.
 * Service và màn hình import qua @travelguide/visitor-core.
 * Phụ thuộc các file model, catalog, search, qr, mock và messages.
 */

// CHỨC NĂNG: Công khai các kiểu và hàm nghiệp vụ.
// XỬ LÝ: Không export react.tsx tại đây;
// test logic thuần không phải nạp giao diện React.
export * from './model'
export * from './catalog'
export * from './search'
export * from './qr'
export * from './mock'
export * from './messages'