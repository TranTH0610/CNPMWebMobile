/**
 * FILE NÀY LÀM GÌ
 * Proxy giới hạn bản du khách vào nội dung/audio công bố, lượt vào và heartbeat; chặn đường quản
 * trị.
 *
 * VỊ TRÍ: scripts/metro-visitor-proxy.cjs
 * DÙNG BỞI: apps/mobile/metro.config.js; scripts/mobile-visitor-startup.test.cjs;
 * scripts/start-mobile-visitor.cjs.
 * PHỤ THUỘC: ./metro-api-proxy.cjs
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo { createDevApiProxy }: require nạp module './metro-api-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { createDevApiProxy } = require('./metro-api-proxy.cjs')
// Khai báo CATALOG_PREFIX: chuỗi '/__visitor-api/catalog'.
const CATALOG_PREFIX = '/__visitor-api/catalog'
// Khai báo PRESENCE_PREFIX: chuỗi '/__visitor-api/presence'.
const PRESENCE_PREFIX = '/__visitor-api/presence'
// CHỨC NĂNG: Tạo proxy giới hạn quyền truy cập của bản du khách.
// XỬ LÝ: Chỉ nhận nội dung công bố, QR và heartbeat; từ chối các đường quản trị.
// Khai báo createVisitorApiMiddleware({ enabled = false, catalogTarget = 'http://127.0.0.1:8788', presenceTarget = 'http://127.0.0.1:8787' }). Nhận đầu vào qua tham số.
function createVisitorApiMiddleware({ enabled = false, catalogTarget = 'http://127.0.0.1:8788', presenceTarget = 'http://127.0.0.1:8787' } = {}) {
  // Khai báo catalog: Gọi createDevApiProxy({ enabled, prefix: CATALOG_PREFIX, target: catalogTarget, allowed: (meth. | Đặt trường enabled bằng giá trị của biến cùng tên. | Gán thuộc tính prefix: sử dụng CATALOG_PREFIX làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính target: sử dụng catalogTarget làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const catalog = createDevApiProxy({ enabled, prefix: CATALOG_PREFIX, target: catalogTarget,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `allowed: (method, pathname) => (method === 'GET' || method === 'HEAD')`: Gán thuộc tính allowed: khai báo callback (method, pathname) => (method === 'GET' || method === 'HEAD') && /^\/(?:pub.
     * DÒNG `&& /^\/(?:published|version|audio\/published\/[a-f0-9]{64}\.mp3|media\/published\/[a-f0-9]{64}|images\/published\/[a-z0-9-]+\.jpg)$/.test(pathname)`: Gán thuộc tính allowed: khai báo callback (method, pathname) => (method === 'GET' || method === 'HEAD') && /^\/(?:pub.
     * DÒNG `|| method === 'POST' && pathname === '/gate/entry' })`: Gán thuộc tính allowed: khai báo callback (method, pathname) => (method === 'GET' || method === 'HEAD') && /^\/(?:pub.
     */
    allowed: (method, pathname) => (method === 'GET' || method === 'HEAD')
      && /^\/(?:published|version|audio\/published\/[a-f0-9]{64}\.mp3|media\/published\/[a-f0-9]{64}|images\/published\/[a-z0-9-]+\.jpg)$/.test(pathname)
      || method === 'POST' && pathname === '/gate/entry' })
  // Khai báo presence: Gọi createDevApiProxy({ enabled, prefix: PRESENCE_PREFIX, target: presenceTarget, allowed: (me. | Đặt trường enabled bằng giá trị của biến cùng tên. | Gán thuộc tính prefix: sử dụng PRESENCE_PREFIX làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính target: sử dụng presenceTarget làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const presence = createDevApiProxy({ enabled, prefix: PRESENCE_PREFIX, target: presenceTarget,
    // Gán thuộc tính allowed: khai báo callback (method, pathname) => method === 'POST' && /^\/sessions\/(heartbeat|end)$/.
    allowed: (method, pathname) => method === 'POST' && /^\/sessions\/(heartbeat|end)$/.test(pathname) })
  // Trả kết quả: khai báo callback (req, res, next) => { // CHỨC NĂNG: Từ chối rõ route quản lý thay vì để Met.
  return (req, res, next) => {
    // CHỨC NĂNG: Từ chối rõ route quản lý thay vì để Metro trả manifest HTTP 200.
    // Rẽ nhánh nếu enabled && /^\/__admin-api(?:\/|$)/.test(req.url).
    if (enabled && /^\/__admin-api(?:\/|$)/.test(req.url)) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFou`: Thực hiện Gọi res.writeHead(404, { 'Content-Type': 'application/json' }). | Gán thuộc tính 'Content-Type': chuỗi 'application/json'. | Thực hiện Gọi res.end('{"error":"notFound"}'). | Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFound"}'); return
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return catalog(req, res, () => presence(req, res, next))`: Trả kết quả: Gọi catalog(req, res, () => presence(req, res, next)).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return catalog(req, res, () => presence(req, res, next))
  }
}
// TẠI SAO (createVisitorApiMiddleware): Chỉ chuyển tiếp route du khách cần để không đưa API bản
// nháp/quản trị vào bản công khai.
// Thực hiện tính biểu thức module.exports = { CATALOG_PREFIX, PRESENCE_PREFIX, createVisitorApiMiddleware }. | Đặt trường CATALOG_PREFIX bằng giá trị của biến cùng tên. | Đặt trường PRESENCE_PREFIX bằng giá trị của biến cùng tên. | Đặt trường createVisitorApiMiddleware bằng giá trị của biến cùng tên.
module.exports = { CATALOG_PREFIX, PRESENCE_PREFIX, createVisitorApiMiddleware }
