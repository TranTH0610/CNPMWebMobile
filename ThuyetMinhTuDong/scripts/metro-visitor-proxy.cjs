/**
 * FILE NÀY LÀM GÌ: Dev proxy chỉ cho catalog công bố, lượt vào cổng và heartbeat du khách.
 * Metro bản visitor dùng; không chuyển tiếp document, commands hoặc thống kê quản lý.
 * Không phụ thuộc tunnel HTTPS tạm thời khi chạy Expo cùng Wi-Fi.
 */
const { createDevApiProxy } = require('./metro-api-proxy.cjs')
const CATALOG_PREFIX = '/__visitor-api/catalog'
const PRESENCE_PREFIX = '/__visitor-api/presence'
function createVisitorApiMiddleware({ enabled = false, catalogTarget = 'http://127.0.0.1:8788', presenceTarget = 'http://127.0.0.1:8787' } = {}) {
  const catalog = createDevApiProxy({ enabled, prefix: CATALOG_PREFIX, target: catalogTarget,
    allowed: (method, pathname) => (method === 'GET' || method === 'HEAD')
      && /^\/(?:published|version|audio\/published\/[a-f0-9]{64}\.mp3)$/.test(pathname)
      || method === 'POST' && pathname === '/gate/entry' })
  const presence = createDevApiProxy({ enabled, prefix: PRESENCE_PREFIX, target: presenceTarget,
    allowed: (method, pathname) => method === 'POST' && /^\/sessions\/(heartbeat|end)$/.test(pathname) })
  return (req, res, next) => {
    // CHỨC NĂNG: Từ chối rõ route quản lý thay vì để Metro trả manifest HTTP 200.
    if (enabled && /^\/__admin-api(?:\/|$)/.test(req.url)) {
      res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFound"}'); return
    }
    return catalog(req, res, () => presence(req, res, next))
  }
}
module.exports = { CATALOG_PREFIX, PRESENCE_PREFIX, createVisitorApiMiddleware }
