/** FILE NÀY LÀM GÌ: Test phiên bằng SQL Server thật và HTTP client dùng bởi FE.
 * Chạy npm run presence:test sau npm run db:init. Test không đụng scope main. */
const { test, after } = require('node:test')
const assert = require('node:assert/strict')
const { createPresenceServer } = require('./server.cjs')
const { createSqlRepository } = require('../database/repository.cjs')
const { testRepository } = require('../database/test-support.cjs')
const { close } = require('../database/connection.cjs')
const { createRequire } = require('node:module')
const path = require('node:path')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'apps/web/package.json'))
req('esbuild').buildSync({ entryPoints: [path.join(root, 'packages/visitor-core/src/presence/presence.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: path.join(__dirname, '.test-build/client.cjs') })
const { createPresenceClient } = require('./.test-build/client.cjs')
after(close)
const web = { sessionId: 'web_12345678901234567890', platform: 'web' }
const mobile = { sessionId: 'app_12345678901234567890', platform: 'mobile-app' }

test('SQL: heartbeat lặp chỉ tính một, web và mobile cùng một kho', async t => {
  const { repository: store } = testRepository(t)
  await Promise.all([store.heartbeat(web), store.heartbeat(web), store.heartbeat(mobile)])
  const stats = await store.snapshot()
  assert.equal(stats.active, 2); assert.equal(stats.web, 1); assert.equal(stats.mobile, 1)
  await assert.rejects(store.heartbeat({ ...web, platform: 'mobile-app' }), /platform_conflict/)
})
test('SQL: heartbeat gia hạn, đúng 90 giây thì hết hoạt động', async t => {
  let clock = 0
  const { repository: store } = testRepository(t, { now: () => clock })
  await store.heartbeat(web); clock = 60000; await store.heartbeat(web)
  clock = 149999; assert.equal((await store.snapshot()).active, 1)
  clock = 150000; assert.equal((await store.snapshot()).active, 0)
  await store.prune()
})
test('SQL: tạo repository mới vẫn đọc phiên đã lưu; end gọi lặp không lỗi', async t => {
  const { scope, repository: store } = testRepository(t)
  await store.heartbeat(web)
  assert.equal((await createSqlRepository({ scope }).snapshot()).active, 1)
  await store.end(web.sessionId); await store.end(web.sessionId)
  assert.equal((await store.snapshot()).active, 0)
})
test('SQL: giới hạn phiên và nhận phiên mới khi phiên cũ hết hạn', async t => {
  let clock = 0
  const { repository: store } = testRepository(t, { now: () => clock, maxSessions: 1 })
  await store.heartbeat(web)
  await assert.rejects(store.heartbeat(mobile), /capacity/)
  clock = 90000; await store.heartbeat(mobile)
  assert.equal((await store.snapshot()).mobile, 1)
})
async function setup(t, store) {
  const server = createPresenceServer({ store: store || testRepository(t).repository })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const base = 'http://127.0.0.1:' + server.address().port
  return { base, client: createPresenceClient(base) }
}
test('HTTP: hai client đọc chung SQL và kết thúc phiên', async t => {
  const { client, base } = await setup(t)
  await client.heartbeat(web); await createPresenceClient(base).heartbeat(mobile)
  assert.equal((await client.statistics()).active, 2)
  await client.end(web.sessionId)
  assert.equal((await client.statistics()).active, 1)
})
test('HTTP: từ chối ID/platform sai, body quá lớn và origin lạ', async t => {
  const { base, client } = await setup(t)
  const post = body => fetch(base + '/sessions/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  assert.equal((await post({ ...web, sessionId: 'short' })).status, 400)
  assert.equal((await post({ ...web, platform: 'bot' })).status, 400)
  assert.equal((await post({ ...web, extra: 'x'.repeat(5000) })).status, 400)
  assert.equal((await fetch(base + '/statistics/active', { headers: { Origin: 'https://untrusted.example' } })).status, 403)
  assert.equal((await client.statistics()).active, 0)
})
test('SQL lỗi trả 503, không tạo kho RAM và không giả số liệu bằng 0', async t => {
  const failed = async () => { throw Error('database_unavailable') }
  const { base } = await setup(t, { snapshot: failed, heartbeat: failed, end: failed, prune: failed })
  assert.equal((await fetch(base + '/statistics/active')).status, 503)
  assert.equal((await fetch(base + '/sessions/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(web) })).status, 503)
})
test('Client từ chối số liệu sai và truyền lỗi mạng cho hook', async t => {
  const mocked = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ active: 20, web: 1, mobile: 1, updatedAt: 1, ttlSeconds: 90 })))
  const client = createPresenceClient('http://local.test')
  await assert.rejects(client.statistics(), /presence_invalid/)
  mocked.mock.mockImplementation(async () => { throw Error('offline') })
  await assert.rejects(client.statistics(), /offline/)
})
