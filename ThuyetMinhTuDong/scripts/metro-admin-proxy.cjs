/**
 * FILE NÀY LÀM GÌ
 * Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai.
 *
 * VỊ TRÍ: scripts/metro-admin-proxy.cjs
 * DÙNG BỞI: apps/mobile/metro.config.js; scripts/mobile-admin-startup.test.cjs;
 * scripts/start-mobile-admin.cjs.
 * PHỤ THUỘC: ./metro-api-proxy.cjs
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo { createDevApiProxy }: require nạp module './metro-api-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { createDevApiProxy } = require('./metro-api-proxy.cjs')
// Khai báo PREFIX: chuỗi '/__admin-api'.
const PREFIX = '/__admin-api'
// Khai báo reads: sử dụng /^\/(?:version|identity|document|published|gate\/statistics|presence\/statistics\/active|a làm giá trị của bước hiện tại.
const reads = /^\/(?:version|identity|document|published|gate\/statistics|presence\/statistics\/active|audio\/(?:preview|published)\/[a-f0-9]{64}\.mp3|media\/(?:preview|published)\/[a-f0-9]{64}|images\/(?:preview|published)\/[a-z0-9-]+\.jpg)$/
// CHỨC NĂNG: Tạo proxy dành riêng cho bản quản trị.
// XỬ LÝ: Dùng lớp chuyển tiếp chung và chỉ bật ở cấu hình admin.
// Khai báo createAdminApiMiddleware({ enabled = false, target = 'http://127.0.0.1:8788', timeoutMs = 190000 }). Nhận đầu vào qua tham số.
function createAdminApiMiddleware({ enabled = false, target = 'http://127.0.0.1:8788', timeoutMs = 190000 } = {}) {
  // Trả kết quả: Gọi createDevApiProxy({ enabled, prefix: PREFIX, target, timeoutMs, allowed: (method, pathname. | Đặt trường enabled bằng giá trị của biến cùng tên. | Gán thuộc tính prefix: sử dụng PREFIX làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường target bằng giá trị của biến cùng tên. | Đặt trường timeoutMs bằng giá trị của biến cùng tên.
  return createDevApiProxy({ enabled, prefix: PREFIX, target, timeoutMs,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `allowed: (method, pathname) => (method === 'GET' || method === 'HEAD') && reads.test(`: Gán thuộc tính allowed: khai báo callback (method, pathname) => (method === 'GET' || method === 'HEAD') && reads.test.
     * DÒNG `|| method === 'POST' && pathname === '/commands' })`: Gán thuộc tính allowed: khai báo callback (method, pathname) => (method === 'GET' || method === 'HEAD') && reads.test.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    allowed: (method, pathname) => (method === 'GET' || method === 'HEAD') && reads.test(pathname)
      || method === 'POST' && pathname === '/commands' })
}
// TẠI SAO (createAdminApiMiddleware): Bản quản trị cần các route riêng, còn bản du khách không
// nên được mở chúng qua Metro.
// Thực hiện tính biểu thức module.exports = { PREFIX, createAdminApiMiddleware }. | Đặt trường PREFIX bằng giá trị của biến cùng tên. | Đặt trường createAdminApiMiddleware bằng giá trị của biến cùng tên.
module.exports = { PREFIX, createAdminApiMiddleware }
