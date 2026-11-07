/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Test SQL thật trên database riêng, không sửa HueGuideDemo.
 *
 * VỊ TRÍ: services/database/KiemThuRangBuocDatabase.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ./KetNoiSqlServer.cjs
 * - ./HoTroKiemThuDatabase.cjs
 * - ./ChuyenSangMuoiMotBang.cjs
 * - node:crypto
 * - node:fs
 * - node:path
 *
 * CÁC KHỐI CHÍNH:
 * 1. fixture
 * 2. save
 * 3. load
 * 4. expected
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const { test, after } = require('node:test'),
  assert = require('node:assert/strict')
const { connect, close } = require('./KetNoiSqlServer.cjs')
const { testRepository } = require('./HoTroKiemThuDatabase.cjs')
const { comparable } = require('./ChuyenSangMuoiMotBang.cjs')
const crypto = require('node:crypto'),
  fs = require('node:fs'),
  path = require('node:path')
after(close)
const audio = Buffer.from('ID3-unit-audio-11-tables')
// ==================== [DATABASE] fixture ====================
// CHỨC NĂNG: Thực hiện bước fixture trong nhiệm vụ: Test SQL thật trên database riêng, không sửa HueGuideDemo.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
function fixture() {
  const t = {
    title: 'Ngọ Môn 中文 日本語 Português',
    summary: 'Giới thiệu',
    body: 'Bài thuyết minh có dấu. '.repeat(300),
    address: 'Huế',
    version: 2,
    status: 'draft',
    sources: [
      {
        title: 'Tư liệu',
        url: 'https://example.org/source',
        accessedAt: '2026-10-28',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://example.org/license',
      },
    ],
    audio: {
      id: 'audio-vi',
      url: 'data:audio/mpeg;base64,' + audio.toString('base64'),
      version: 1,
      status: 'draft',
    },
  }
  const r = {
    id: 'ngo-mon',
    scope: 'hue-citadel',
    inLaunchCatalog: true,
    status: 'draft',
    canonicalTitle: 'Ngọ Môn',
    zone: 'fortifications',
    category: 'gate',
    period: '1833',
    featured: false,
    images: ['photo:ngo-mon'],
    content: { vi: t },
  }
  const pub = structuredClone(r)
  pub.status = 'published'
  pub.content.vi.status = 'published'
  pub.content.vi.approvedAt = '2026-10-28T00:00:00Z'
  pub.content.vi.publishedAt = '2026-10-28T01:00:00Z'
  Object.assign(pub.content.vi.audio, {
    status: 'published',
    approvedAt: '2026-10-28T00:00:00Z',
    publishedAt: '2026-10-28T01:00:00Z',
  })
  return {
    schema: 1,
    places: [
      {
        id: 'ngo-mon',
        record: r,
        published: pub,
        period: '1833',
        revision: 2,
        workflow: 'draft',
        reviewNote: '',
        updatedAt: '2026-10-28T01:00:00Z',
      },
    ],
    sessions: [],
    audit: [],
  }
}
// ==================== [DATABASE] save ====================
// CHỨC NĂNG: Lưu dữ liệu đang nhập theo quy tắc và kiểm tra phiên bản hiện có.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
async function save(repository, doc) {
  return repository.catalog((s) => s.write(JSON.stringify(doc)))
}
// ==================== [DATABASE] load ====================
// CHỨC NĂNG: Thực hiện bước load trong nhiệm vụ: Test SQL thật trên database riêng, không sửa HueGuideDemo.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
async function load(repository) {
  return JSON.parse(await repository.catalog((s) => s.read()))
}
// ==================== [DATABASE] expected ====================
// CHỨC NĂNG: Thực hiện bước expected trong nhiệm vụ: Test SQL thật trên database riêng, không sửa HueGuideDemo.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
function expected(doc) {
  const d = structuredClone(doc)
  for (const p of d.places)
    for (const r of [p.record, p.published])
      if (r) {
        r.images = r.images.map(
          () =>
            'media:' +
            crypto
              .createHash('sha256')
              .update(
                fs.readFileSync(
                  path.resolve(__dirname, '../../apps/web/static/images/places/ngo-mon.jpg'),
                ),
              )
              .digest('hex'),
        )
        for (const t of Object.values(r.content))
          if (t.audio)
            t.audio.url = 'media:' + crypto.createHash('sha256').update(audio).digest('hex')
      }
  return comparable(d)
}

test('Đúng 11 bảng; Unicode/nội dung dài/nguồn/byte media giữ qua kết nối lại', async (t) => {
  const { scope, repository } = testRepository(t)
  await save(repository, fixture())
  await close(scope)
  assert.deepStrictEqual(comparable(await load(repository)), expected(fixture()))
  const { pool } = await connect(scope),
    result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM sys.tables WHERE schema_id=SCHEMA_ID(N'dbo')")
  assert.equal(result.recordset[0].total, 11)
})

test('PK/FK/UNIQUE/CHECK và trigger chặn dữ liệu sai; không làm hỏng bản hợp lệ', async (t) => {
  const { scope, repository } = testRepository(t)
  await save(repository, fixture())
  const { pool } = await connect(scope)
  const before = await load(repository)
  const invalid = [
    'INSERT dbo.DiTich SELECT MaDiTich,ThuTuHienThi,PhienBanChinhSua,TrangThaiXuLy,GhiChuKiemDuyet,PhienBanDaDuyet,ThoiDiemTao,ThoiDiemCapNhat FROM dbo.DiTich',
    "INSERT dbo.HinhAnhDiTich(MaBanDiTich,MaTep,ThuTuHienThi) SELECT 'BDT999999',MaTep,0 FROM dbo.TepTaiNguyen WHERE LoaiTep='image'",
    "UPDATE dbo.BanDiTich SET ViDo=16 WHERE LoaiBan='draft'",
    "UPDATE dbo.BanDiTich SET MaDanhMuc='DM999' WHERE LoaiBan='draft'",
    "UPDATE dbo.NoiDungDiTich SET MaNgonNgu=N'xx'",
    'UPDATE dbo.NoiDungDiTich SET PhienBanNoiDung=-1',
    'UPDATE dbo.BanThuThuyetMinh SET PhienBanNoiDung=999',
    "UPDATE dbo.DiTich SET TrangThaiXuLy='published',PhienBanDaDuyet=NULL",
    "INSERT dbo.DiTich(MaDiTich,ThuTuHienThi,PhienBanChinhSua,TrangThaiXuLy,PhienBanDaDuyet) VALUES('DT999',9,1,'published',1)",
    "UPDATE dbo.NoiDungDiTich SET ThoiDiemDuyet=NULL WHERE TrangThaiNoiDung='published'",
    "UPDATE dbo.BanThuThuyetMinh SET MaTep=(SELECT TOP(1) MaTep FROM dbo.TepTaiNguyen WHERE LoaiTep='image')",
    "UPDATE dbo.HinhAnhDiTich SET MaTep=(SELECT TOP(1) MaTep FROM dbo.TepTaiNguyen WHERE LoaiTep='audio')",
    "UPDATE dbo.TepTaiNguyen SET DinhDangTep='audio/ogg' WHERE LoaiTep='image'",
    'UPDATE dbo.TepTaiNguyen SET DinhDangTep=DinhDangTep',
    'DELETE dbo.DiTich',
  ]
  const expectedErrors = [
    2627, 547, 547, 547, 547, 547, 547, 547, 51015, 547, 51012, 51011, 547, 51014, 547,
  ]
  for (let i = 0; i < invalid.length; i++)
    await t.test('Chặn trường hợp ' + (i + 1), async () => {
      await assert.rejects(
        pool.request().query(invalid[i]),
        (error) => error.number === expectedErrors[i],
      )
      assert.deepStrictEqual(await load(repository), before)
    })
})

test('Xóa hẳn: xóa hồ sơ và con, giữ nhật ký; tệp dùng chung không bị xóa; mã không cấp lại', async (t) => {
  const { scope, repository } = testRepository(t),
    doc = fixture()
  const second = structuredClone(doc.places[0])
  second.id = 'DT010'
  second.record.id = 'DT010'
  second.published.id = 'DT010'
  doc.places.push(second)
  await save(repository, doc)
  const next = await load(repository)
  next.places = next.places.filter((p) => p.id !== 'ngo-mon')
  next.audit.unshift({
    at: '2026-10-31T03:00:00Z',
    action: 'deletePlace',
    placeId: 'ngo-mon',
    revision: 2,
  })
  await save(repository, next)
  const { pool } = await connect(scope),
    r = await pool
      .request()
      .query(
        "SELECT COUNT(*) AS n FROM dbo.DiTich WHERE MaDiTich='DT002';SELECT * FROM dbo.LichSuKiemDuyet;SELECT COUNT(*) AS n FROM dbo.TepTaiNguyen;SELECT COUNT(*) AS n FROM dbo.BanDiTich WHERE MaDiTich='DT002'",
      )
  assert.equal(r.recordsets[0][0].n, 0)
  assert.equal(r.recordsets[3][0].n, 0)
  assert.equal(r.recordsets[1][0].MaDiTichGoc, 'DT002')
  assert.equal(r.recordsets[1][0].MaDiTichLienKet, null)
  assert.equal(r.recordsets[2][0].n, 2)
  const added = await load(repository),
    p = structuredClone(added.places[0])
  p.id = 'place-new'
  p.record.id = p.id
  p.published = undefined
  added.places.push(p)
  await save(repository, added)
  const ids = (await load(repository)).places.map((p) => p.id)
  assert.ok(ids.includes('DT011'))
  assert.ok(!ids.includes('ngo-mon'))
})

test('Rollback hoàn toàn nếu lỗi sau khi ghi', async (t) => {
  const { repository } = testRepository(t)
  await save(repository, fixture())
  const before = await load(repository)
  await assert.rejects(
    repository.catalog(async (storage) => {
      const next = structuredClone(before)
      next.places = []
      await storage.write(JSON.stringify(next))
      throw Error('rollback_test')
    }),
    /rollback_test/,
  )
  assert.deepStrictEqual(await load(repository), before)
})

test('QR chống trùng đồng thời, giữ tổng cũ và lịch sử ngày trước', async (t) => {
  let clock = Date.parse('2026-10-23T16:59:00Z')
  const { scope, repository } = testRepository(t, { now: () => clock })
  await repository.importGate({ day: '2026-10-23', today: 9 })
  const visitId = 'gate_test_123456789012345'
  await Promise.all(Array.from({ length: 5 }, () => repository.gateEntry(visitId, 'web')))
  assert.equal((await repository.gateStatistics()).today, 10)
  clock += 120000
  assert.equal((await repository.gateStatistics()).today, 0)
  await repository.gateEntry(visitId, 'web')
  const { pool } = await connect(scope)
  assert.equal(
    (await pool.request().query('SELECT SUM(SoLuot) AS n FROM dbo.LuotTruyCapQR')).recordset[0].n,
    11,
  )
})

test('Phiên SQL có TTL, chặn đổi nền tảng và lưu đúng datetime UTC', async (t) => {
  let clock = Date.parse('2026-10-31T03:00:00Z')
  const { repository } = testRepository(t, { now: () => clock })
  const sessionId = 'session_test_123456789012345'
  await repository.heartbeat({ sessionId, platform: 'web' })
  assert.equal((await repository.snapshot()).active, 1)
  await assert.rejects(
    repository.heartbeat({ sessionId, platform: 'mobile-app' }),
    /platform_conflict/,
  )
  clock += 90000
  assert.equal((await repository.snapshot()).active, 0)
})

test('Mã tự sinh đúng định dạng và LoaiTep không được nhập/sửa độc lập', async (t) => {
  const { scope, repository } = testRepository(t)
  await save(repository, fixture())
  const { pool } = await connect(scope)
  const r = await pool
    .request()
    .query('SELECT MaTep,LoaiTep,DinhDangTep,DungLuongByte FROM dbo.TepTaiNguyen')
  for (const f of r.recordset) {
    assert.match(f.MaTep, /^TEP\d{3,}$/)
    assert.equal(f.LoaiTep, f.DinhDangTep.split('/')[0])
    assert.ok(f.DungLuongByte > 0)
  }
  await assert.rejects(pool.request().query("UPDATE dbo.TepTaiNguyen SET LoaiTep='audio'"))
})

test('Xóa hết danh mục không tự nạp lại di tích mẫu', async (t) => {
  const { repository } = testRepository(t)
  await save(repository, fixture())
  const next = await load(repository)
  next.places = []
  next.audit = [
    { at: '2026-10-31T04:00:00Z', action: 'deletePlace', placeId: 'ngo-mon', revision: 2 },
  ]
  await save(repository, next)
  const read = await load(repository)
  assert.deepEqual(read.places, [])
  assert.equal(read.audit[0].action, 'deletePlace')
})

// CHỨC NĂNG: Trigger chỉ nằm trong DB test, phát hiện bất kỳ hàng nào của di tích khác bị ghi lại.
test('Ghi khác biệt không đụng di tích/ngôn ngữ/bản công bố không thay đổi; lưu y nguyên không ghi lại', async (t) => {
  const { scope, repository } = testRepository(t)
  const initial = fixture(),
    other = structuredClone(initial.places[0])
  other.id = 'DT009'
  other.record.id = 'DT009'
  other.published.id = 'DT009'
  other.record.canonicalTitle = 'Di tích khác'
  other.published.canonicalTitle = 'Di tích khác'
  initial.places.push(other)
  await save(repository, initial)
  const { pool } = await connect(scope)
  for (const [table, condition] of [
    ['DiTich', "x.MaDiTich='DT009'"],
    ['BanDiTich', "x.MaDiTich='DT009'"],
    [
      'NoiDungDiTich',
      "EXISTS(SELECT 1 FROM dbo.BanDiTich b WHERE b.MaBanDiTich=x.MaBanDiTich AND (b.MaDiTich='DT009' OR b.LoaiBan='published'))",
    ],
    [
      'HinhAnhDiTich',
      "EXISTS(SELECT 1 FROM dbo.BanDiTich b WHERE b.MaBanDiTich=x.MaBanDiTich AND (b.MaDiTich='DT009' OR b.LoaiBan='published'))",
    ],
    [
      'BanThuThuyetMinh',
      "EXISTS(SELECT 1 FROM dbo.NoiDungDiTich n JOIN dbo.BanDiTich b ON b.MaBanDiTich=n.MaBanDiTich WHERE n.MaNoiDung=x.MaNoiDung AND (b.MaDiTich='DT009' OR b.LoaiBan='published'))",
    ],
    [
      'NguonThamKhao',
      "EXISTS(SELECT 1 FROM dbo.NoiDungDiTich n JOIN dbo.BanDiTich b ON b.MaBanDiTich=n.MaBanDiTich WHERE n.MaNoiDung=x.MaNoiDung AND (b.MaDiTich='DT009' OR b.LoaiBan='published'))",
    ],
  ])
    await pool
      .request()
      .query(
        `CREATE TRIGGER dbo.TR_Test_Unchanged_${table} ON dbo.${table} AFTER INSERT,UPDATE,DELETE AS BEGIN SET NOCOUNT ON;IF EXISTS(SELECT 1 FROM inserted x WHERE ${condition}) OR EXISTS(SELECT 1 FROM deleted x WHERE ${condition}) THROW 51040,'unchanged_record_was_written',1;END`,
      )
  const before = await load(repository),
    next = structuredClone(before),
    p = next.places.find((p) => p.id === 'ngo-mon')
  p.revision++
  p.record.content.vi.version++
  p.record.content.vi.body = 'Chỉ đổi bài nháp này'
  p.record.content.vi.audio = undefined
  await save(repository, next)
  const after = await load(repository)
  assert.deepEqual(
    after.places.find((p) => p.id === 'DT009'),
    before.places.find((p) => p.id === 'DT009'),
  )
  assert.deepEqual(
    after.places.find((p) => p.id === 'ngo-mon').published,
    before.places.find((p) => p.id === 'ngo-mon').published,
  )
  // Chặn toàn bộ DML có hàng thật trên các bảng danh mục: no-op phải vẫn thành công.
  for (const table of [
    'DiTich',
    'BanDiTich',
    'NoiDungDiTich',
    'HinhAnhDiTich',
    'BanThuThuyetMinh',
    'NguonThamKhao',
  ])
    await pool
      .request()
      .query(
        `CREATE TRIGGER dbo.TR_Test_NoOp_${table} ON dbo.${table} AFTER INSERT,UPDATE,DELETE AS BEGIN IF EXISTS(SELECT 1 FROM inserted) OR EXISTS(SELECT 1 FROM deleted) THROW 51041,'no_op_was_written',1;END`,
      )
  await save(repository, after)
})

test('Đọc Shared chạy đồng thời, không ghi trong lượt đọc và writer chờ reader kết thúc', async (t) => {
  const { repository } = testRepository(t)
  await save(repository, fixture())
  let release, entered
  const held = new Promise((r) => {
      release = r
    }),
    ready = new Promise((r) => {
      entered = r
    })
  const first = repository.catalogRead(async (storage) => {
    await storage.read()
    entered()
    await held
  })
  await ready
  try {
    const second = repository.catalogRead(async (storage) => {
      assert.ok(JSON.parse(await storage.read()).places.length)
      await assert.rejects(storage.write('{}'), /read_only_catalog/)
    })
    let timeout
    try {
      await Promise.race([
        second,
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(Error('readers_not_concurrent')), 3000)
        }),
      ])
    } finally {
      clearTimeout(timeout)
    }
    let writerEntered = false
    const writer = repository.catalog(async () => {
      writerEntered = true
    })
    await new Promise((r) => setTimeout(r, 80))
    assert.equal(writerEntered, false)
    release()
    await first
    await writer
    assert.equal(writerEntered, true)
  } finally {
    release()
    await first
  }
})

test('Đổi thứ tự danh mục không vi phạm UNIQUE; rollback vẫn khôi phục đúng các hàng đã sửa', async (t) => {
  const { repository } = testRepository(t),
    doc = fixture(),
    other = structuredClone(doc.places[0])
  other.id = 'DT009'
  other.record.id = 'DT009'
  other.published.id = 'DT009'
  doc.places.push(other)
  await save(repository, doc)
  const before = await load(repository),
    next = structuredClone(before)
  next.places.reverse()
  await save(repository, next)
  assert.deepEqual(
    (await load(repository)).places.map((p) => p.id),
    next.places.map((p) => p.id),
  )
  const stable = await load(repository)
  await assert.rejects(
    repository.catalog(async (storage) => {
      const d = JSON.parse(await storage.read())
      d.places[0].record.content.vi.body = 'Chưa commit'
      await storage.write(JSON.stringify(d))
      throw Error('diff_rollback')
    }),
    /diff_rollback/,
  )
  assert.deepEqual(await load(repository), stable)
})
