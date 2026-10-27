/**
 * FILE NÀY LÀM GÌ: Kiểm tra QR công khai không chứa link Expo và giữ biến .env khác.
 * npm test gọi; phụ thuộc Node test và create-public-qr.cjs. Liên quan UC05.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { sharedEntryUrl, setVariable } = require('./create-public-qr.cjs')

test('QR chung luôn là website HTTPS, không phải QR Expo', () => {
  assert.equal(sharedEntryUrl('https://guide.test'), 'https://guide.test/')
  for (const value of ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.20',
    'https://localhost', 'https://guide.test/places/ngo-mon', 'https://hue-guide.example']) {
    assert.throws(() => sharedEntryUrl(value))
  }
})

test('Cập nhật URL không xóa biến khác và có bản sao cấu hình', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'visitor-qr-'))
  const file = path.join(folder, '.env')
  const backup = path.join(folder, 'before.txt')
  try {
    const original = 'OTHER_SETTING=keep\nVITE_PUBLIC_SITE_URL=https://old.test\n'
    fs.writeFileSync(file, original)
    setVariable(file, 'VITE_PUBLIC_SITE_URL', 'https://new.test', backup)
    assert.equal(fs.readFileSync(backup, 'utf8'), original)
    const next = fs.readFileSync(file, 'utf8')
    assert.ok(next.includes('OTHER_SETTING=keep'))
    assert.equal(next.match(/VITE_PUBLIC_SITE_URL=/g).length, 1)
    assert.ok(next.includes('VITE_PUBLIC_SITE_URL=https://new.test'))
  } finally {
    for (const name of [file, backup]) fs.rmSync(name, { force: true })
    fs.rmdirSync(folder)
  }
})

// CHỨC NĂNG: Bắt lỗi đường dẫn probe cũ sau khi di chuyển file vào services.
test('QR probe trỏ tới service hiện có, không phải src/platform.ts đã bỏ', () => {
  const { GUIDE_MODULE_PATH } = require('./start-public-demo.cjs')
  assert.equal(GUIDE_MODULE_PATH, '/src/services/platform.ts')
  assert.ok(fs.existsSync(path.join(__dirname, '../apps/web', GUIDE_MODULE_PATH)))
})
// CHỨC NĂNG: Vite trả HTML fallback không được coi là JS module hợp lệ.
test('QR probe phân biệt đúng ứng dụng và HTML fallback', () => {
  const { isGuideModule, isGuidePage } = require('./start-public-demo.cjs')
  assert.equal(isGuideModule('export const publicSiteOrigin = siteOrigin(value)'), true)
  assert.equal(isGuideModule('<html>publicSiteOrigin siteOrigin</html>'), false)
  assert.equal(isGuidePage('<div id="root"></div><script src="/src/main.tsx"></script>'), true)
  assert.equal(isGuidePage('<html>Other application</html>'), false)
})

// CHỨC NĂNG: Không đưa bản dev hoặc HTML giả qua QR công khai.
test('QR công khai nhận production bundle và loại dev/HTML fallback', () => {
  const { isBuiltGuidePage, builtEntry } = require('./start-public-demo.cjs')
  const html = '<title>HueGuide</title><div id="root"></div><script type="module" src="/assets/index-abc123.js"></script>'
  assert.equal(isBuiltGuidePage(html), true)
  assert.equal(builtEntry(html), '/assets/index-abc123.js')
  assert.equal(isBuiltGuidePage('<title>HueGuide</title><div id="root"></div><script src="/src/main.tsx"></script>'), false)
  assert.equal(isBuiltGuidePage(html + '<script src="/@vite/client"></script>'), false)
  assert.equal(builtEntry('<html>fallback</html>'), null)
})

// CHỨC NĂNG: Website chết hoặc trả trang lỗi không được ghi thành QR mới.
test('QR chỉ xuất khi website sẵn sàng, từ chối lỗi HTTP và HTML không đúng app', async () => {
  const { verifyWebsite } = require('./create-public-qr.cjs')
  const page = '<title>HueGuide</title><div id="root"></div><script src="/assets/index-new.js"></script>'
  await verifyWebsite('https://guide.test/', async () => new Response(page))
  await assert.rejects(verifyWebsite('https://guide.test/', async () => new Response('Tunnel unavailable', { status: 503 })), /HTTP 503/)
  await assert.rejects(verifyWebsite('https://guide.test/', async () => new Response('<html>Error</html>')), /không trả về/)
  await assert.rejects(verifyWebsite('https://guide.test/', async () => { throw new Error('ENOTFOUND') }), /ENOTFOUND/)
})

// CHỨC NĂNG: QR dùng IPv4 và báo đúng lỗi kết nối edge, không xuất QR chưa kiểm tra.
test('Tunnel dùng IPv4 và giữ HTTP/2', () => {
  const { cloudflaredArgs } = require('./start-public-demo.cjs')
  const args = cloudflaredArgs('http://127.0.0.1:4173')
  assert.equal(args[args.indexOf('--edge-ip-version') + 1], '4')
  assert.equal(args[args.indexOf('--protocol') + 1], 'http2')
  assert.equal(args[args.indexOf('--url') + 1], 'http://127.0.0.1:4173')
})
test('URL được cấp chưa đủ: lỗi edge chỉ rõ TCP 7844', () => {
  const { tunnelFailure } = require('./start-public-demo.cjs')
  assert.match(tunnelFailure('Unable to establish connection: dial tcp 198.41.200.33:7844: i/o timeout'), /TCP 7844/)
  assert.doesNotMatch(tunnelFailure('Unable to establish connection\nRegistered tunnel connection'), /TCP 7844/)
})
test('Xác minh QR thử lại lỗi kết nối tạm thời nhưng vẫn kiểm tra HTML', async () => {
  const { verifyWebsite } = require('./create-public-qr.cjs')
  let calls = 0
  await verifyWebsite('https://guide.test/', async () => {
    if (++calls === 1) throw new Error('fetch failed')
    return new Response('<div id="root"></div><script src="/assets/index-test.js"></script>')
  })
  assert.equal(calls, 2)
})