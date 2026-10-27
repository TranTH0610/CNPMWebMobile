/** FILE NÀY LÀM GÌ: Kiểm tra mạng vật lý, cấu hình admin và proxy Metro bằng API giả cô lập.
 * Node test gọi; không sửa dữ liệu RAM thật hoặc khởi động Expo. */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { findLanAddress } = require('./start-catalog.cjs')
const { adminOptions } = require('./start-mobile-admin.cjs')
const { createAdminApiMiddleware } = require('./metro-admin-proxy.cjs')

test('Chọn Wi-Fi thay vì WARP/VPN kể cả adapter ảo đứng đầu', () => {
  const item = address => [{ family: 'IPv4', internal: false, address }]
  assert.equal(findLanAddress({ CloudflareWARP: item('172.16.0.2'), 'Radmin VPN': item('26.1.2.3'), 'Wi-Fi': item('192.168.2.28') }, ''), '192.168.2.28')
})
test('Admin dùng chung origin Metro, không phụ thuộc URL tunnel hoặc IP API cũ', () => {
  const env = adminOptions('192.168.2.28')
  assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, 'http://192.168.2.28:8082/__admin-api')
  assert.equal(env.EXPO_PUBLIC_CATALOG_API_URL, env.EXPO_PUBLIC_ADMIN_API_URL)
  assert.equal(env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL, env.EXPO_PUBLIC_ADMIN_API_URL + '/presence')
  assert.throws(() => adminOptions(null), /mạng LAN/)
})
async function listen(t, handler) {
  const server = http.createServer(handler)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  return 'http://127.0.0.1:' + server.address().port
}
async function proxy(t, enabled, upstream) {
  const middleware = createAdminApiMiddleware({ enabled, target: upstream })
  return listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404); res.end('Metro next') }))
}
test('Proxy bị tắt ở bản visitor, không lộ route quản lý qua Metro visitor', async t => {
  const api = await proxy(t, false, 'http://127.0.0.1:1')
  const response = await fetch(api + '/__admin-api/document')
  assert.equal(response.status, 404)
  assert.equal(await response.text(), 'Metro next')
})
test('Admin GET/POST/Range đi đúng nguồn và không chặn bundle của Expo', async t => {
  const upstream = await listen(t, async (req, res) => {
    if (req.url.startsWith('/audio/')) { res.writeHead(206, { 'Content-Type': 'audio/mpeg', 'Content-Range': 'bytes 0-3/10' }); res.end('MP3!'); return }
    let body = ''; for await (const chunk of req) body += chunk
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ path: req.url, body }))
  })
  const api = await proxy(t, true, upstream)
  assert.equal((await (await fetch(api + '/__admin-api/document')).json()).path, '/document')
  const payload = JSON.stringify({ action: 'savePlace', args: [] })
  assert.equal((await (await fetch(api + '/__admin-api/commands', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' } })).json()).body, payload)
  const audio = await fetch(api + '/__admin-api/audio/preview/' + 'a'.repeat(64) + '.mp3', { headers: { Range: 'bytes=0-3' } })
  assert.equal(audio.status, 206); assert.equal(await audio.text(), 'MP3!')
  assert.equal((await fetch(api + '/index.bundle')).status, 404)
  assert.equal((await fetch(api + '/__admin-api/unknown')).status, 404)
})
test('Nguồn mock API tắt trả lỗi 503, không trả số liệu hoặc dữ liệu giả', async t => {
  const api = await proxy(t, true, 'http://127.0.0.1:1')
  const response = await fetch(api + '/__admin-api/document')
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'loadError' })
})
