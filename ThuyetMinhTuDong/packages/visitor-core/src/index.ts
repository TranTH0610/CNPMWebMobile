/**
 * FILE NÀY LÀM GÌ:
 * Xuất logic thuần của visitor-core cho hai app.
 * Mobile/web import từ tên package.
 * Không export React tại đây để test nghiệp vụ không phải nạp giao diện.
 */

// CHỨC NĂNG: Công khai kiểu, service và logic.
// XỬ LÝ: Hooks được import riêng qua visitor-core/react.
export * from './model'
export * from './catalog'
export * from './search'
export * from './qr'
export * from './mock'
export * from './messages'
export * from './presentation'