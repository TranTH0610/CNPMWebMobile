/** FILE NÀY LÀM GÌ: Whitelist dev proxy của Metro admin; không bật ở bản du khách.
 * metro.config.js gọi, phụ thuộc metro-api-proxy.cjs; không thêm API hoặc database. */
const { createDevApiProxy } = require('./metro-api-proxy.cjs')
const PREFIX = '/__admin-api'
const reads = /^\/(?:version|identity|document|published|gate\/statistics|presence\/statistics\/active|audio\/(?:preview|published)\/[a-f0-9]{64}\.mp3)$/
function createAdminApiMiddleware({ enabled = false, target = 'http://127.0.0.1:8788', timeoutMs = 190000 } = {}) {
  return createDevApiProxy({ enabled, prefix: PREFIX, target, timeoutMs,
    allowed: (method, pathname) => (method === 'GET' || method === 'HEAD') && reads.test(pathname)
      || method === 'POST' && pathname === '/commands' })
}
module.exports = { PREFIX, createAdminApiMiddleware }
