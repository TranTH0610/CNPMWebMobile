/** FILE NÀY LÀM GÌ: Test kho RAM, API và client HTTP; npm run presence:test gọi.
 * Phụ thuộc node:test, HTTP server local và esbuild đã có trong Vite.
 * Đồng hồ giả giúp kiểm tra hết hạn mà không đợi 90 giây thật. */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createMemoryStore } = require('./memory-store.cjs')
const { createPresenceServer } = require('./server.cjs')
const { createRequire } = require('node:module')
const path = require('node:path')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'apps/web/package.json'))
req('esbuild').buildSync({ entryPoints: [path.join(root, 'packages/visitor-core/src/presence/presence.ts')],
  bundle: true, platform: 'node', format: 'cjs', outfile: path.join(__dirname, '.test-build/client.cjs') })
const { createPresenceClient } = require('./.test-build/client.cjs')
const web = { sessionId: 'web_12345678901234567890', platform: 'web' }
const mobile = { sessionId: 'app_12345678901234567890', platform: 'mobile-app' }
// CHỨC NĂNG: Kiểm tra heartbeat lặp không đếm trùng và phân loại đúng thiết bị.
test('cùng phiên chỉ tính một; web và app cộng thành active', () => {
  const store = createMemoryStore()
  store.heartbeat(web); store.heartbeat(web); store.heartbeat(mobile)
  assert.equal(store.snapshot().active, 2)
  assert.equal(store.snapshot().web, 1); assert.equal(store.snapshot().mobile, 1)
  assert.throws(() => store.heartbeat({ ...web, platform: 'mobile-app' }), /conflict/)
})
test('heartbeat gia hạn; đúng 90 giây hết hạn và RAM được dọn', () => {
  let clock = 0
  const store = createMemoryStore({ now: () => clock })
  store.heartbeat(web); clock = 60000; store.heartbeat(web)
  clock = 149999; assert.equal(store.snapshot().active, 1)
  clock = 150000; assert.equal(store.snapshot().active, 0)
})
test('end idempotent; khởi tạo kho mới không giữ dữ liệu cũ', () => {
  const store = createMemoryStore(); store.heartbeat(web)
  assert.equal(createMemoryStore().snapshot().active, 0)
  store.end(web.sessionId); store.end(web.sessionId)
  assert.equal(store.snapshot().active, 0)
})
test('giới hạn RAM và cho nhận phiên mới sau khi phiên cũ hết hạn', () => {
  let clock = 0
  const store = createMemoryStore({ now: () => clock, maxSessions: 1 })
  store.heartbeat(web)
  assert.throws(() => store.heartbeat(mobile), /capacity/)
  clock = 90000; store.heartbeat(mobile)
  assert.equal(store.snapshot().mobile, 1)
})
async function setup(t) {
  const server = createPresenceServer()
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const base = 'http://127.0.0.1:' + server.address().port
  return { base, client: createPresenceClient(base) }
}
// CHỨC NĂNG: Kiểm tra cùng hợp đồng client mà FE dùng, không bỏ qua HTTP.
test('HTTP/client: gửi, đọc chung và kết thúc phiên', async t => {
  const { client } = await setup(t)
  await client.heartbeat(web); await client.heartbeat(mobile); await client.heartbeat(web)
  assert.equal((await client.statistics()).active, 2)
  await client.end(web.sessionId)
  assert.equal((await client.statistics()).active, 1)
})
test('API từ chối mã/platform sai, body quá lớn và origin lạ', async t => {
  const { base, client } = await setup(t)
  const post = body => fetch(base + '/sessions/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  assert.equal((await post({ ...web, sessionId: 'short' })).status, 400)
  assert.equal((await post({ ...web, platform: 'bot' })).status, 400)
  assert.equal((await post({ ...web, extra: 'x'.repeat(5000) })).status, 400)
  assert.equal((await fetch(base + '/statistics/active', { headers: { Origin: 'https://untrusted.example' } })).status, 403)
  assert.equal((await client.statistics()).active, 0)
})
test('client từ chối số liệu sai và truyền lỗi mạng cho hook', async t => {
  const mocked = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ active: 20, web: 1, mobile: 1, updatedAt: 1, ttlSeconds: 90 })))
  const client = createPresenceClient('http://local.test')
  await assert.rejects(client.statistics(), /presence_invalid/)
  mocked.mock.mockImplementation(async () => { throw new Error('offline') })
  await assert.rejects(client.statistics(), /offline/)
})
/* CÁCH KIỂM TRA: npm run presence:test; tất cả test không dùng Internet hoặc database. */
