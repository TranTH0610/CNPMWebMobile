/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra điều kiện tạo QR, website/bundle hợp lệ và cấu hình tunnel/kết nối.
 *
 * VỊ TRÍ: scripts/public-qr.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; node:fs; node:os; node:path; ./create-public-qr.cjs;
 * ./start-public-demo.cjs
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo os: require nạp module 'node:os' để dùng chức năng có sẵn thay vì chép lại.
const os = require('node:os')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { sharedEntryUrl, setVariable }: require nạp module './create-public-qr.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { sharedEntryUrl, setVariable } = require('./create-public-qr.cjs')

// Khẳng định kết quả thử nghiệm bằng test('QR chung luôn là website HTTPS, không phải QR Expo', () => { assert.equal(sharedEntryUrl('https://guide.test'), 'h.
test('QR chung luôn là website HTTPS, không phải QR Expo', () => {
  // Khẳng định kết quả thử nghiệm bằng assert.equal(sharedEntryUrl('https://guide.test'), 'https://guide.test/').
  assert.equal(sharedEntryUrl('https://guide.test'), 'https://guide.test/')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `for (const value of ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.`: Duyệt lần lượt ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.20', 'https://l bằng const value.
   * DÒNG `'https://localhost', 'https://guide.test/places/ngo-mon', 'https://hue-guide.example'`: Duyệt lần lượt ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.20', 'https://l bằng const value.
   */
  for (const value of ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.20',
    'https://localhost', 'https://guide.test/places/ngo-mon', 'https://hue-guide.example']) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.throws(() => sharedEntryUrl(value))`: Khẳng định kết quả thử nghiệm bằng assert.throws(() => sharedEntryUrl(value)).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.throws(() => sharedEntryUrl(value))
  }
})

// Khẳng định kết quả thử nghiệm bằng test('Cập nhật URL không xóa biến khác và có bản sao cấu hình', () => { const folder = fs.mkdtempSync(path.join(os.tmpdi.
test('Cập nhật URL không xóa biến khác và có bản sao cấu hình', () => {
  // Khai báo folder: Gọi fs.mkdtempSync(path.join(os.tmpdir(), 'visitor-qr-')).
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'visitor-qr-'))
  // Khai báo file: Gọi path.join(folder, '.env').
  const file = path.join(folder, '.env')
  // Khai báo backup: Gọi path.join(folder, 'before.txt').
  const backup = path.join(folder, 'before.txt')
  // Bắt đầu vùng try.
  try {
    // Khai báo original: chuỗi 'OTHER_SETTING=keep\nVITE_PUBLIC_SITE_URL=https://old.test\n'.
    const original = 'OTHER_SETTING=keep\nVITE_PUBLIC_SITE_URL=https://old.test\n'
    // Thực hiện Gọi fs.writeFileSync(file, original).
    fs.writeFileSync(file, original)
    // Cập nhật trạng thái qua setVariable(file, 'VITE_PUBLIC_SITE_URL', 'https://new.test', backup).
    setVariable(file, 'VITE_PUBLIC_SITE_URL', 'https://new.test', backup)
    // Khẳng định kết quả thử nghiệm bằng assert.equal(fs.readFileSync(backup, 'utf8'), original).
    assert.equal(fs.readFileSync(backup, 'utf8'), original)
    // Khai báo next: Gọi fs.readFileSync(file, 'utf8').
    const next = fs.readFileSync(file, 'utf8')
    // Khẳng định kết quả thử nghiệm bằng assert.ok(next.includes('OTHER_SETTING=keep')).
    assert.ok(next.includes('OTHER_SETTING=keep'))
    // Khẳng định kết quả thử nghiệm bằng assert.equal(next.match(/VITE_PUBLIC_SITE_URL=/g).length, 1).
    assert.equal(next.match(/VITE_PUBLIC_SITE_URL=/g).length, 1)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.ok(next.includes('VITE_PUBLIC_SITE_URL=https://new.test'))`: Khẳng định kết quả thử nghiệm bằng assert.ok(next.includes('VITE_PUBLIC_SITE_URL=https://new.test')).
     * DÒNG `} finally {`: Bắt đầu vùng try.
     */
    assert.ok(next.includes('VITE_PUBLIC_SITE_URL=https://new.test'))
  } finally {
    // Duyệt lần lượt [file, backup] bằng const name. | Thực hiện Gọi fs.rmSync(name, { force: true }). | Gán thuộc tính force: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    for (const name of [file, backup]) fs.rmSync(name, { force: true })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `fs.rmdirSync(folder)`: Thực hiện Gọi fs.rmdirSync(folder).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    fs.rmdirSync(folder)
  }
})

// CHỨC NĂNG: Bắt lỗi đường dẫn probe cũ sau khi di chuyển file vào services.
// Khẳng định kết quả thử nghiệm bằng test('QR probe trỏ tới service hiện có, không phải src/platform.ts đã bỏ', () => { const { GUIDE_MODULE_PATH } = require.
test('QR probe trỏ tới service hiện có, không phải src/platform.ts đã bỏ', () => {
  // Khai báo { GUIDE_MODULE_PATH }: require nạp module './start-public-demo.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { GUIDE_MODULE_PATH } = require('./start-public-demo.cjs')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(GUIDE_MODULE_PATH, '/src/services/platform.ts').
  assert.equal(GUIDE_MODULE_PATH, '/src/services/platform.ts')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(fs.existsSync(path.join(__dirname, '../apps/web', GUIDE_MODULE_PATH)))`: Khẳng định kết quả thử nghiệm bằng assert.ok(fs.existsSync(path.join(__dirname, '../apps/web', GUIDE_MODULE_PATH))).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.ok(fs.existsSync(path.join(__dirname, '../apps/web', GUIDE_MODULE_PATH)))
})
// CHỨC NĂNG: Vite trả HTML fallback không được coi là JS module hợp lệ.
// Khẳng định kết quả thử nghiệm bằng test('QR probe phân biệt đúng ứng dụng và HTML fallback', () => { const { isGuideModule, isGuidePage } = require('./star.
test('QR probe phân biệt đúng ứng dụng và HTML fallback', () => {
  // Khai báo { isGuideModule, isGuidePage }: require nạp module './start-public-demo.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { isGuideModule, isGuidePage } = require('./start-public-demo.cjs')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(isGuideModule('export const publicSiteOrigin = siteOrigin(value)'), true).
  assert.equal(isGuideModule('export const publicSiteOrigin = siteOrigin(value)'), true)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(isGuideModule('<html>publicSiteOrigin siteOrigin</html>'), false).
  assert.equal(isGuideModule('<html>publicSiteOrigin siteOrigin</html>'), false)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(isGuidePage('<div id="root"></div><script src="/src/main.tsx"></script>'), true).
  assert.equal(isGuidePage('<div id="root"></div><script src="/src/main.tsx"></script>'), true)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(isGuidePage('<html>Other application</html>'), false)`: Khẳng định kết quả thử nghiệm bằng assert.equal(isGuidePage('<html>Other application</html>'), false).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(isGuidePage('<html>Other application</html>'), false)
})

// CHỨC NĂNG: Không đưa bản dev hoặc HTML giả qua QR công khai.
// Khẳng định kết quả thử nghiệm bằng test('QR công khai nhận production bundle và loại dev/HTML fallback', () => { const { isBuiltGuidePage, builtEntry } = r.
test('QR công khai nhận production bundle và loại dev/HTML fallback', () => {
  // Khai báo { isBuiltGuidePage, builtEntry }: require nạp module './start-public-demo.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { isBuiltGuidePage, builtEntry } = require('./start-public-demo.cjs')
  // Khai báo html: chuỗi '<title>HueGuide</title><div id="root"></div><script type="module" src="/assets/index-abc1.
  const html = '<title>HueGuide</title><div id="root"></div><script type="module" src="/assets/index-abc123.js"></script>'
  // Khẳng định kết quả thử nghiệm bằng assert.equal(isBuiltGuidePage(html), true).
  assert.equal(isBuiltGuidePage(html), true)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(builtEntry(html), '/assets/index-abc123.js').
  assert.equal(builtEntry(html), '/assets/index-abc123.js')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(isBuiltGuidePage('<title>HueGuide</title><div id="root"></div><script src="/src/main.tsx"></script>'), fals.
  assert.equal(isBuiltGuidePage('<title>HueGuide</title><div id="root"></div><script src="/src/main.tsx"></script>'), false)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(isBuiltGuidePage(html + '<script src="/@vite/client"></script>'), false).
  assert.equal(isBuiltGuidePage(html + '<script src="/@vite/client"></script>'), false)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(builtEntry('<html>fallback</html>'), null)`: Khẳng định kết quả thử nghiệm bằng assert.equal(builtEntry('<html>fallback</html>'), null).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(builtEntry('<html>fallback</html>'), null)
})

// CHỨC NĂNG: Website chết hoặc trả trang lỗi không được ghi thành QR mới.
// Khẳng định kết quả thử nghiệm bằng test('QR chỉ xuất khi website sẵn sàng, từ chối lỗi HTTP và HTML không đúng app', async () => { const { verifyWebsite }.
test('QR chỉ xuất khi website sẵn sàng, từ chối lỗi HTTP và HTML không đúng app', async () => {
  // Khai báo { verifyWebsite }: require nạp module './create-public-qr.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { verifyWebsite } = require('./create-public-qr.cjs')
  // Khai báo page: chuỗi '<title>HueGuide</title><div id="root"></div><script src="/assets/index-new.js"></script>'.
  const page = '<title>HueGuide</title><div id="root"></div><script src="/assets/index-new.js"></script>'
  // Thực hiện await chờ Gọi verifyWebsite('https://guide.test/', async () => new Response(page)).
  await verifyWebsite('https://guide.test/', async () => new Response(page))
  // Khẳng định kết quả thử nghiệm bằng await assert.rejects(verifyWebsite('https://guide.test/', async () => new Response('Tunnel unavailable', { status: 503 }. | Gán thuộc tính status: giá trị số 503.
  await assert.rejects(verifyWebsite('https://guide.test/', async () => new Response('Tunnel unavailable', { status: 503 })), /HTTP 503/)
  // Khẳng định kết quả thử nghiệm bằng await assert.rejects(verifyWebsite('https://guide.test/', async () => new Response('<html>Error</html>')), /không trả về.
  await assert.rejects(verifyWebsite('https://guide.test/', async () => new Response('<html>Error</html>')), /không trả về/)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(verifyWebsite('https://guide.test/', async () => { throw new Err`: Khẳng định kết quả thử nghiệm bằng await assert.rejects(verifyWebsite('https://guide.test/', async () => { throw new Error('ENOTFOUND') }), /ENOTFOUND/). | Ném new Error('ENOTFOUND').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  await assert.rejects(verifyWebsite('https://guide.test/', async () => { throw new Error('ENOTFOUND') }), /ENOTFOUND/)
})

// CHỨC NĂNG: QR dùng IPv4 và báo đúng lỗi kết nối edge, không xuất QR chưa kiểm tra.
// Khẳng định kết quả thử nghiệm bằng test('Tunnel dùng IPv4 và giữ HTTP/2', () => { const { cloudflaredArgs } = require('./start-public-demo.cjs') const args.
test('Tunnel dùng IPv4 và giữ HTTP/2', () => {
  // Khai báo { cloudflaredArgs }: require nạp module './start-public-demo.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { cloudflaredArgs } = require('./start-public-demo.cjs')
  // Khai báo args: Gọi cloudflaredArgs('http://127.0.0.1:4173').
  const args = cloudflaredArgs('http://127.0.0.1:4173')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(args[args.indexOf('--edge-ip-version') + 1], '4').
  assert.equal(args[args.indexOf('--edge-ip-version') + 1], '4')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(args[args.indexOf('--protocol') + 1], 'http2').
  assert.equal(args[args.indexOf('--protocol') + 1], 'http2')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(args[args.indexOf('--url') + 1], 'http://127.0.0.1:4173')`: Khẳng định kết quả thử nghiệm bằng assert.equal(args[args.indexOf('--url') + 1], 'http://127.0.0.1:4173').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(args[args.indexOf('--url') + 1], 'http://127.0.0.1:4173')
})
// Khẳng định kết quả thử nghiệm bằng test('URL được cấp chưa đủ: lỗi edge chỉ rõ TCP 7844', () => { const { tunnelFailure } = require('./start-public-demo.cj.
test('URL được cấp chưa đủ: lỗi edge chỉ rõ TCP 7844', () => {
  // Khai báo { tunnelFailure }: require nạp module './start-public-demo.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { tunnelFailure } = require('./start-public-demo.cjs')
  // Khẳng định kết quả thử nghiệm bằng assert.match(tunnelFailure('Unable to establish connection: dial tcp 198.41.200.33:7844: i/o timeout'), /TCP 7844/).
  assert.match(tunnelFailure('Unable to establish connection: dial tcp 198.41.200.33:7844: i/o timeout'), /TCP 7844/)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.doesNotMatch(tunnelFailure('Unable to establish connection\nRegistered tunnel `: Khẳng định kết quả thử nghiệm bằng assert.doesNotMatch(tunnelFailure('Unable to establish connection\nRegistered tunnel connection'), /TCP 7844/).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.doesNotMatch(tunnelFailure('Unable to establish connection\nRegistered tunnel connection'), /TCP 7844/)
})
// Khẳng định kết quả thử nghiệm bằng test('Xác minh QR thử lại lỗi kết nối tạm thời nhưng vẫn kiểm tra HTML', async () => { const { verifyWebsite } = require.
test('Xác minh QR thử lại lỗi kết nối tạm thời nhưng vẫn kiểm tra HTML', async () => {
  // Khai báo { verifyWebsite }: require nạp module './create-public-qr.cjs' để dùng chức năng có sẵn thay vì chép lại.
  const { verifyWebsite } = require('./create-public-qr.cjs')
  // Khai báo calls: giá trị số 0.
  let calls = 0
  // Thực hiện await chờ Gọi verifyWebsite('https://guide.test/', async () => { if (++calls === 1) throw new Error('fet.
  await verifyWebsite('https://guide.test/', async () => {
    // Rẽ nhánh nếu ++calls === 1. | Ném new Error('fetch failed').
    if (++calls === 1) throw new Error('fetch failed')
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return new Response('<div id="root"></div><script src="/assets/index-test.js"></scrip`: Trả kết quả: Tạo đối tượng bằng new Response('<div id="root"></div><script src="/assets/index-test.js"></script>').
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return new Response('<div id="root"></div><script src="/assets/index-test.js"></script>')
  })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(calls, 2)`: Khẳng định kết quả thử nghiệm bằng assert.equal(calls, 2).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(calls, 2)
})