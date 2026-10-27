/** FILE NÀY LÀM GÌ: Bắt hồi quy mất LAN, khởi động trùng và cổng API sai.
 * Node test gọi; phụ thuộc start-catalog/start-web và HTTP cục bộ; không đụng kho RAM thật. */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { findLanAddress, updateMobileEnv } = require('./start-catalog.cjs')
const { ensureService } = require('./start-web.cjs')

test('Không có LAN không làm lỗi và không ghi đè cấu hình mobile', () => {
  assert.equal(findLanAddress({}, ''), null)
  const text = 'OTHER=keep\nEXPO_PUBLIC_CATALOG_API_URL=https://guide.test/api/catalog\n'
  assert.equal(updateMobileEnv(text, null), text)
  const next = updateMobileEnv(text, '192.168.1.10')
  assert.ok(next.includes('https://guide.test/api/catalog'))
  assert.ok(next.includes('OTHER=keep'))
  assert.ok(next.includes('EXPO_PUBLIC_ADMIN_PRESENCE_API_URL=http://192.168.1.10:8788/presence'))
})
test('IP LAN lấy mạng riêng, loại loopback và cấu hình sai', () => {
  assert.equal(findLanAddress({ wifi: [{ family: 'IPv4', address: '192.168.1.20', internal: false }] }, ''), '192.168.1.20')
  assert.throws(() => findLanAddress({}, '127.0.0.1'), /IPv4 LAN/)
})

async function serve(t, response) {
  const server = http.createServer((_req, res) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(response)) })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  return 'http://127.0.0.1:' + server.address().port
}
test('API đang chạy được dùng lại, không mở tiến trình và không reset RAM', async t => {
  const origin = await serve(t, { version: 'existing:4' })
  const result = await ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof value?.version === 'string' },
    { launch: () => assert.fail('Không được mở lại service đang chạy') })
  assert.equal(result, 'reused')
})
test('Cổng có ứng dụng khác bị từ chối, không mở thêm service', async t => {
  const origin = await serve(t, { unrelated: true })
  await assert.rejects(ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof value?.version === 'string' },
    { launch: () => assert.fail('Không được chiếm cổng') }), /cổng đang có/)
})
test('API tùy chỉnh không sẵn sàng không bị thay bằng RAM khác', async t => {
  const origin = await serve(t, {})
  await assert.rejects(ensureService({ name: 'catalog', custom: true, origin, healthPath: '/version', accept: () => false },
    { launch: () => assert.fail('Không được thay API cấu hình') }), /API đã cấu hình/)
})
