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
