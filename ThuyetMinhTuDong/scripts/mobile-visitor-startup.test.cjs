/** FILE NÀY LÀM GÌ: Kiểm thử FE dev proxy du khách không lộ nháp/quản lý.
 * Node test gọi, dùng nguồn HTTP giả cô lập; không ghi lượt QR hoặc dữ liệu thật. */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { visitorOptions } = require('./start-mobile-visitor.cjs')
const { createVisitorApiMiddleware } = require('./metro-visitor-proxy.cjs')
async function listen(t, handler) {
  const server = http.createServer(handler)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  return 'http://127.0.0.1:' + server.address().port
}
test('Visitor dùng cùng host Expo, không nhận tunnel cũ hoặc target admin', () => {
  const env = visitorOptions('192.168.2.28')
  assert.equal(env.EXPO_PUBLIC_APP_TARGET, 'visitor')
  assert.equal(env.EXPO_PUBLIC_CATALOG_API_URL, 'http://192.168.2.28:8081/__visitor-api/catalog')
  assert.equal(env.EXPO_PUBLIC_PRESENCE_API_URL, 'http://192.168.2.28:8081/__visitor-api/presence')
  assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, undefined)
})
test('Visitor chỉ được đọc công bố và gửi heartbeat; không đọc nháp/ghi quản lý/thống kê', async t => {
  const calls = []
  const target = await listen(t, (req, res) => { calls.push(req.url); res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}') })
  const middleware = createVisitorApiMiddleware({ enabled: true, catalogTarget: target, presenceTarget: target })
  const origin = await listen(t, (req, res) => middleware(req, res, () => { res.writeHead(200); res.end('Expo manifest fallback') }))
  assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 200)
  assert.equal((await fetch(origin + '/__visitor-api/presence/sessions/heartbeat', { method: 'POST', body: '{}' })).status, 200)
  for (const route of ['document', 'identity', 'gate/statistics', 'audio/preview/' + 'a'.repeat(64) + '.mp3']) {
    assert.equal((await fetch(origin + '/__visitor-api/catalog/' + route)).status, 404)
  }
  assert.equal((await fetch(origin + '/__visitor-api/catalog/commands', { method: 'POST', body: '{}' })).status, 404)
  assert.equal((await fetch(origin + '/__visitor-api/presence/statistics/active')).status, 404)
  assert.equal((await fetch(origin + '/__admin-api/document')).status, 404)
  assert.deepEqual(calls, ['/published', '/sessions/heartbeat'])
})
test('Middleware visitor không hoạt động ở Metro admin khi disabled', async t => {
  const middleware = createVisitorApiMiddleware()
  const origin = await listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404); res.end() }))
  assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 404)
})
