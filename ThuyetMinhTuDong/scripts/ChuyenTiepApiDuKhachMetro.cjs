/**
 * FILE: scripts/ChuyenTiepApiDuKhachMetro.cjs
 * FILE NÀY LÀM GÌ: Proxy giới hạn bản du khách vào nội dung/audio công bố, lượt vào và heartbeat; chặn đường quản
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const { createDevApiProxy } = require('./ChuyenTiepApiMetro.cjs')
const CATALOG_PREFIX = '/__visitor-api/catalog'
const PRESENCE_PREFIX = '/__visitor-api/presence'
// CHỨC NĂNG: Tạo proxy giới hạn quyền truy cập của bản du khách.
// XỬ LÝ: Chỉ nhận nội dung công bố, QR và heartbeat; từ chối các đường quản trị.
// [HỖ TRỢ CHUNG] createVisitorApiMiddleware — Tạo proxy giới hạn quyền truy cập của bản du khách.
function createVisitorApiMiddleware({ enabled = false, catalogTarget = 'http://127.0.0.1:8788', presenceTarget = 'http://127.0.0.1:8787' } = {}) {
  const catalog = createDevApiProxy({ enabled, prefix: CATALOG_PREFIX, target: catalogTarget,
    
    allowed: (method, pathname) => (method === 'GET' || method === 'HEAD')
      && /^\/(?:published|version|audio\/published\/[a-f0-9]{64}\.mp3|media\/published\/[a-f0-9]{64}|images\/published\/[a-z0-9-]+\.jpg)$/.test(pathname)
      || method === 'POST' && pathname === '/gate/entry' })
  const presence = createDevApiProxy({ enabled, prefix: PRESENCE_PREFIX, target: presenceTarget,
    allowed: (method, pathname) => method === 'POST' && /^\/sessions\/(heartbeat|end)$/.test(pathname) })
  // Trả kết quả: khai báo callback (req, res, next) => { // CHỨC NĂNG: Từ chối rõ route quản lý thay vì để Met.
  return (req, res, next) => {
    // CHỨC NĂNG: Từ chối rõ route quản lý thay vì để Metro trả manifest HTTP 200.
    if (enabled && /^\/__admin-api(?:\/|$)/.test(req.url)) {
      
      res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFound"}'); return
    }
    
    return catalog(req, res, () => presence(req, res, next))
  }
}
// TẠI SAO (createVisitorApiMiddleware): Chỉ chuyển tiếp route du khách cần để không đưa API bản
// nháp/quản trị vào bản công khai.
module.exports = { CATALOG_PREFIX, PRESENCE_PREFIX, createVisitorApiMiddleware }
