/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra các client đọc/ghi chung, revision, lượt QR, danh mục công bố và phục vụ MP3.
 *
 * VỊ TRÍ: services/catalog/KiemThuApiDiTich.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ./MayChuApi.cjs
 * - node:crypto
 * - ../database/HoTroKiemThuDatabase.cjs
 * - ../database/KetNoiSqlServer.cjs
 * - ../../.runtime/admin-core.cjs
 * - node:module
 * - node:path
 *
 * CÁC KHỐI CHÍNH:
 * 1. setup
 * 2. input
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const { test } = require('node:test'),
  assert = require('node:assert/strict')

const { createCatalogServer } = require('./MayChuApi.cjs')

// ==================== [KIEM-THU] setup ====================
// CHỨC NĂNG: Thực hiện bước setup trong nhiệm vụ: Kiểm tra các client đọc/ghi chung, revision, lượt QR, danh mục công bố và phục vụ MP3.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
async function setup(t, options) {
  const scope = options?.scope || 'test_' + require('node:crypto').randomUUID()
  t.after(() => require('../database/HoTroKiemThuDatabase.cjs').cleanup(scope))
  await require('../database/KetNoiSqlServer.cjs').connect(scope)
  const server = createCatalogServer({ ...options, scope })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve)
        server.closeAllConnections()
      }),
  )
  const seeded = await fetch('http://127.0.0.1:' + server.address().port + '/published', {
    signal: AbortSignal.timeout(30000),
  })
  assert.equal(seeded.status, 200)
  return {
    scope,
    url: 'http://127.0.0.1:' + server.address().port,
    core: require('../../.runtime/admin-core.cjs'),
  }
}
// TẠI SAO (setup): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
// mạng, GPS hay loa thật.

const input = (p) => ({
  id: p.id,
  expectedRevision: p.revision,
  title: p.record.canonicalTitle + ' cập nhật',
  category: 'monument',
  period: '1802',
  lat: '',
  lng: '',
  verified: false,
  images: p.record.images,
})
// TẠI SAO (input): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
// bộ giao diện.

test('Hai client đọc/ghi chung; phiên bản cũ bị 409 và không ghi đè', async (t) => {
  const { url, core } = await setup(t)
  const web = core.createHttpAdminService(url),
    mobile = core.createHttpAdminService(url)
  const original = (await web.load()).places[0]
  await web.savePlace(input(original))
  const changed = (await mobile.load()).places[0]
  assert.equal(changed.record.canonicalTitle, original.record.canonicalTitle + ' cập nhật')
  await assert.rejects(mobile.savePlace(input(original)), (error) => error.code === 'conflict')
  assert.equal((await mobile.load()).places[0].revision, 2)
  assert.equal((await web.published())[0].canonicalTitle, original.record.canonicalTitle)
})

test('Poll báo thay đổi giữa hai client và cleanup dừng thông báo', async (t) => {
  const { url, core } = await setup(t)
  const a = core.createHttpAdminService(url, 20),
    b = core.createHttpAdminService(url)
  let count = 0
  const stop = a.subscribe(() => count++)
  t.after(stop)
  await new Promise((r) => setTimeout(r, 80))
  const baseline = count
  await b.savePlace(input((await b.load()).places[1]))
  await new Promise((r) => setTimeout(r, 100))
  assert.ok(count > baseline)
  stop()
  const end = count
  await b.savePlace(input((await b.load()).places[1]))
  await new Promise((r) => setTimeout(r, 60))
  assert.equal(count, end)
})

test('Hai lệnh cùng revision chỉ một được ghi; API từ chối reset và payload sai', async (t) => {
  const { url, core } = await setup(t)
  const a = core.createHttpAdminService(url),
    p = (await a.load()).places[0]
  const result = await Promise.allSettled([a.savePlace(input(p)), a.savePlace(input(p))])
  assert.equal(result.filter((x) => x.status === 'fulfilled').length, 1)
  for (const body of [
    { action: 'reset', args: [] },
    { action: 'savePlace', args: [{ title: 123 }] },
    { action: 'constructor', args: [] },
  ]) {
    const response = await fetch(url + '/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    assert.equal(response.status, 400)
  }
  const denied = await fetch(url + '/document', { headers: { Origin: 'https://stranger.example' } })
  assert.equal(denied.status, 403)
})

test('QR đếm mỗi phiên/ngày một; ngày Huế đổi thì bộ đếm mới', async (t) => {
  let now = Date.parse('2026-10-23T16:59:00Z')
  const { url, core } = await setup(t, { now: () => now })
  const gate = core.createGateClient(url),
    id = 'gate_web_123456789012345'
  await gate.entry(id, 'web')
  await gate.entry(id, 'web')
  assert.equal((await gate.statistics()).today, 1)
  await gate.entry('gate_app_123456789012345', 'mobile-app')
  assert.equal((await gate.statistics()).today, 2)
  now += 120000
  assert.equal((await gate.statistics()).today, 0)
  await gate.entry(id, 'web')
  assert.equal((await gate.statistics()).today, 1)
})
// CHỨC NĂNG: Cùng scope SQL vẫn giữ thay đổi sau khi tạo server mới; không dùng nguồn cục bộ khi mạng lỗi.
test('SQL giữ dữ liệu sau restart; mất mạng báo lỗi không trả kho cục bộ', async (t) => {
  const scope = 'test_' + require('node:crypto').randomUUID()
  const first = await setup(t, { scope }),
    client = first.core.createHttpAdminService(first.url),
    p = (await client.load()).places[0]
  await client.deletePlace(p.id, p.revision)
  const second = await setup(t, { scope })
  assert.ok(
    !(await second.core.createHttpAdminService(second.url).load()).places.some(
      (x) => x.id === p.id,
    ),
  )
  await assert.rejects(
    first.core.createHttpAdminService('').load(),
    (error) => error.code === 'loadError',
  )
})

test('Parser chỉ nhận query entry=gate trên trang chủ', async (t) => {
  await setup(t)
  const { createRequire } = require('node:module'),
    path = require('node:path')
  const req = createRequire(path.resolve('apps/web/package.json'))
  const out = req('esbuild').buildSync({
    entryPoints: [path.resolve('packages/visitor-core/src/links/PhanTichLienKetQR.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
  }).outputFiles[0].text
  const Module = require('node:module')
  const m = new Module('qr-test')
  m._compile(out, 'qr-test.cjs')
  const policy = { allowedOrigins: ['https://guide.test'], allowHttp: false }
  assert.deepEqual(m.exports.parseQrTarget('https://guide.test/?entry=gate', policy), {
    kind: 'home',
  })
  assert.throws(() => m.exports.parseQrTarget('https://guide.test/?entry=other', policy))
  assert.throws(() =>
    m.exports.parseQrTarget('https://guide.test/places/ngo-mon?entry=gate', policy),
  )
})

// CHỨC NĂNG: iOS cần HTTP Range để tua; audio nháp không lộ qua endpoint công khai.

test('MP3 có Range; không tải được audio chưa publish hoặc path traversal', async (t) => {
  const { url } = await setup(t)

  const published = await (await fetch(url + '/published')).json(),
    text = published[0].content.vi

  assert.match(text.audio.url, /^media:[a-f0-9]{64}$/)

  const key = text.audio.url.slice(6)

  const response = await fetch(url + '/media/published/' + key, {
    headers: { Range: 'bytes=0-99' },
  })

  assert.equal(response.status, 206)
  assert.match(response.headers.get('content-type'), /audio\/mpeg/)

  assert.equal((await response.arrayBuffer()).byteLength, 100)

  assert.match(response.headers.get('content-range'), /^bytes 0-99\//)

  assert.equal((await fetch(url + '/audio/published/' + 'a'.repeat(64) + '.mp3')).status, 404)

  assert.equal((await fetch(url + '/audio/preview/../../MayChuApi.cjs')).status, 404)
})

// Đóng pool SQL sau cả bộ test để tiến trình Node thoát gọn.
require('node:test').after(() => require('../database/KetNoiSqlServer.cjs').close())

// CHỨC NĂNG: Kiểm tra xóa bằng API thật, không chỉ xóa qua adapter SQL.
test('Xóa qua API: mất khỏi admin/visitor, giữ nhật ký và không cấp lại mã', async (t) => {
  const { url, core, scope } = await setup(t),
    client = core.createHttpAdminService(url)
  const first = (await client.load()).places[0]
  await client.deletePlace(first.id, first.revision)
  const after = await client.load()
  assert.equal(after.places.length, 7)
  assert.ok(!after.places.some((p) => p.id === first.id))
  assert.ok(after.audit.some((a) => a.action === 'deletePlace' && a.placeId === first.id))
  assert.ok(!(await client.published()).some((p) => p.id === first.id))
  await assert.rejects(client.deletePlace(first.id, first.revision), (e) => e.code === 'notFound')
  const { pool } = await require('../database/KetNoiSqlServer.cjs').connect(scope)
  const rows = (
    await pool
      .request()
      .query(
        "SELECT MaDiTichGoc,MaDiTichLienKet FROM dbo.LichSuKiemDuyet WHERE HanhDong='deletePlace'",
      )
  ).recordset
  assert.equal(rows[0].MaDiTichGoc, 'DT001')
  assert.equal(rows[0].MaDiTichLienKet, null)
  await client.savePlace({
    title: 'Di tích kiểm thử mới',
    category: 'monument',
    period: '',
    lat: '',
    lng: '',
    verified: false,
    images: [],
  })
  assert.ok((await client.load()).places.some((p) => p.id === 'DT009'))
})

// CHỨC NĂNG: Thử trên database test riêng; không thêm dữ liệu kiểm thử vào HueGuideDemo.
test('Form đầy đủ trả mã DT từ SQL, web/mobile đọc cùng nháp, gửi duyệt không công bố', async (t) => {
  const { url, core } = await setup(t, { translator: async (text, lang) => lang + ': ' + text })
  const web = core.createHttpAdminService(url),
    mobile = core.createHttpAdminService(url)
  const source = (await web.load()).places[0]
  const id = await web.savePlace({
    title: 'Nháp kiểm thử đầy đủ',
    category: 'palace',
    period: '1921',
    lat: '16.469',
    lng: '107.578',
    verified: false,
    images: source.record.images,
    content: {
      vi: {
        title: 'Nháp kiểm thử đầy đủ',
        summary: 'Tóm tắt',
        address: 'Huế',
        body: 'Bài đọc thử',
      },
    },
  })
  assert.equal(id, 'DT009')
  let draft = (await mobile.load()).places.find((p) => p.id === id)
  assert.equal(draft.record.content.vi.body, 'Bài đọc thử')
  assert.equal(draft.workflow, 'draft')
  assert.ok(!(await web.published()).some((p) => p.id === id))
  await web.translate(id, 'en', draft.revision)
  draft = (await mobile.load()).places.find((p) => p.id === id)
  assert.equal(draft.record.content.en.body, 'en: Bài đọc thử')
  await assert.rejects(web.submit(id, draft.revision), (e) => e.code === 'incomplete')
  // Đính bản thu test đã có bytes trong SQL; kiểm thử này chỉ thử workflow, không gọi TTS ngoài.
  const audio = source.record.content.vi.audio.url
  const content = {}
  for (const [code, text] of Object.entries(draft.record.content))
    content[code] = {
      title: text.title,
      summary: text.summary,
      address: text.address,
      body: text.body,
      audioUrl: audio,
    }
  await web.savePlace({
    id,
    expectedRevision: draft.revision,
    title: draft.record.canonicalTitle,
    category: 'palace',
    period: '1921',
    lat: '',
    lng: '',
    verified: false,
    images: source.record.images,
    content,
  })
  draft = (await mobile.load()).places.find((p) => p.id === id)
  await web.submit(id, draft.revision)
  draft = (await mobile.load()).places.find((p) => p.id === id)
  assert.equal(draft.workflow, 'submitted')
  assert.equal(draft.published, undefined)
  assert.ok(!(await web.published()).some((p) => p.id === id))
  await assert.rejects(web.publish(id, draft.revision), (e) => e.code === 'notApproved')
})

// CHỨC NĂNG: Dịch chậm không chặn client khác tải dữ liệu; sửa trong lúc dịch bị báo xung đột.
test('Chờ dịch không giữ khóa SQL và không ghi đè thay đổi từ mobile', async (t) => {
  let release, entered
  const ready = new Promise((r) => {
      entered = r
    }),
    wait = new Promise((r) => {
      release = r
    })
  t.after(() => release())
  const { url, core } = await setup(t, {
    translator: async (text) => {
      entered()
      await wait
      return text + ' translated'
    },
  })
  const web = core.createHttpAdminService(url),
    mobile = core.createHttpAdminService(url),
    p = (await web.load()).places[0]
  const job = web.translate(p.id, 'en', p.revision)
  await ready
  await mobile.savePlace(input(p))
  release()
  await assert.rejects(job, (e) => e.code === 'conflict')
  assert.equal(
    (await web.load()).places[0].record.canonicalTitle,
    p.record.canonicalTitle + ' cập nhật',
  )
})

// CHỨC NĂNG: Kiểm tra publish cập nhật bản công bố thay vì xóa/reinsert toàn danh mục.
test('Ghi khác biệt giữ bản công bố cũ cho tới duyệt; công bố lại và lưu trữ đúng FK/trigger', async (t) => {
  let media
  const { url, core } = await setup(t, { prepareAudio: async () => media }),
    client = core.createHttpAdminService(url)
  let p = (await client.load()).places[0]
  const oldBody = p.published.content.vi.body
  media = p.record.content.vi.audio.url
  await client.saveContent({
    id: p.id,
    language: 'vi',
    expectedRevision: p.revision,
    title: p.record.content.vi.title,
    summary: p.record.content.vi.summary,
    address: p.record.content.vi.address,
    body: 'Bài đọc đã chỉnh sửa để kiểm thử ghi khác biệt.',
  })
  p = (await client.load()).places[0]
  await client.generateAudio(p.id, 'vi', p.revision)
  p = (await client.load()).places[0]
  assert.equal((await client.published())[0].content.vi.body, oldBody)
  await client.submit(p.id, p.revision)
  await client.review(p.id, p.revision, true, 'Đã đối chiếu')
  assert.equal((await client.published())[0].content.vi.body, oldBody)
  await client.publish(p.id, p.revision)
  assert.equal(
    (await client.published())[0].content.vi.body,
    'Bài đọc đã chỉnh sửa để kiểm thử ghi khác biệt.',
  )
  await client.archive(p.id, p.revision)
  assert.ok(!(await client.published()).some((item) => item.id === p.id))
  assert.equal((await client.load()).places[0].workflow, 'archived')
})
