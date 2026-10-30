/** FILE NÀY LÀM GÌ: Test SQL thật về dữ liệu quan hệ, FK/CHECK, draft/published và persistence.
 * npm run db:test gọi; mỗi test có scope riêng, không sửa scope main. */
const { test, after } = require('node:test')
const assert = require('node:assert/strict')
const { createSqlRepository } = require('./repository.cjs')
const { connect, close } = require('./connection.cjs')
const { testRepository } = require('./test-support.cjs')
after(close)

function fixture(title = 'Ngọ Môn 中文 日本語 Português') {
  const text = { title, summary: '', body: 'Bài thuyết minh có dấu. '.repeat(300), address: 'Huế', version: 1, status: 'draft', sources: [{ title: 'Tư liệu', url: 'https://example.org/source', accessedAt: '2026-10-28', license: 'CC BY-SA 4.0', licenseUrl: 'https://example.org/license' }], audio: { id: 'audio-vi', url: 'data:audio/mpeg;base64,'+Buffer.from('ID3-test-audio-content-123456789').toString('base64'), version: 1, status: 'draft' } }
  const record = { id: 'ngo-mon', scope: 'hue-citadel', inLaunchCatalog: true, status: 'draft', canonicalTitle: title, zone: 'ceremonial', category: 'gate', images: ['photo:ngo-mon', 'photo:ky-dai'], featured: false, position: { lat: 16.4694, lng: 107.5777, verified: false, source: 'OSM' }, content: { vi: text } }
  const published = structuredClone(record)
  published.canonicalTitle = 'Tên đã công bố'; published.status = 'published'
  published.content.vi.title = 'Tên đã công bố'; published.content.vi.status = 'published'; published.content.vi.audio.status = 'published'
  return { schema: 1, places: [{ id: 'ngo-mon', record, published, period: '', revision: 1, workflow: 'draft', reviewNote: '', updatedAt: '2026-10-28T00:00:00.000Z' }], sessions: [], audit: [] }
}
function expected(document){
 const copy=structuredClone(document),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path')
 function ref(uri){const bytes=uri.startsWith('data:')?Buffer.from(uri.split(',')[1],'base64'):fs.readFileSync(path.resolve(__dirname,'../../apps/web/static/images/places',uri.slice(6)+'.jpg'));return 'media:'+crypto.createHash('sha256').update(bytes).digest('hex')}
 for(const place of copy.places)for(const record of [place.record,place.published])if(record){record.images=record.images.map(ref);for(const text of Object.values(record.content))if(text.audio)text.audio.url=ref(text.audio.url)}
 return copy
}
const load = async repository => JSON.parse(await repository.catalog(storage => storage.read()))
const save = (repository, doc) => repository.catalog(storage => storage.write(JSON.stringify(doc)))

test('Unicode, nguồn, thứ tự ảnh và hai bản được giữ sau khi đóng pool rồi kết nối lại', async t => {
  const { scope, repository } = testRepository(t), document = fixture()
  await save(repository, document)
  const id = 'gate_test_123456789012345'
  await repository.gateEntry(id, 'web'); await close()
  const reopened = createSqlRepository({ scope })
  assert.deepStrictEqual(await load(reopened), expected(document))
  await reopened.gateEntry(id, 'web')
  assert.equal((await reopened.gateStatistics()).today, 1)
})
test('QR đồng thời chống trùng; ngày mới vẫn giữ lịch sử ngày trước', async t => {
  let clock = Date.parse('2026-10-23T16:59:00Z')
  const { scope, repository } = testRepository(t, { now: () => clock }), id = 'gate_test_223456789012345'
  await Promise.all(Array.from({ length: 5 }, () => repository.gateEntry(id, 'web')))
  assert.equal((await repository.gateStatistics()).today, 1)
  clock += 120000; assert.equal((await repository.gateStatistics()).today, 0)
  await repository.gateEntry(id, 'web')
  const { sql, pool } = await connect()
  const result = await pool.request().input('scope', sql.NVarChar(100), scope).query('SELECT COUNT(*) AS total FROM dbo.GateEntries WHERE Scope=@scope')
  assert.equal(result.recordset[0].total, 2)
})
test('Rollback giữ toàn bộ dữ liệu khi tác vụ lỗi sau khi ghi', async t => {
  const { repository } = testRepository(t), document = fixture()
  await save(repository, document)
  await assert.rejects(repository.catalog(async storage => { await storage.write(JSON.stringify(fixture('Tên chưa lưu'))); throw Error('failed') }), /failed/)
  assert.deepStrictEqual(await load(repository), expected(document))
})
test('FK và CHECK SQL chặn danh mục/ngôn ngữ lạ, tọa độ sai, workflow sai và phiên bản âm', async t => {
  const { scope, repository } = testRepository(t)
  await save(repository, fixture())
  const { sql, pool } = await connect()
  for (const statement of [
    "UPDATE dbo.PlaceVersions SET CategoryCode=N'unknown' WHERE Scope=@scope",
    "UPDATE dbo.PlaceContents SET LanguageCode=N'unknown' WHERE Scope=@scope",
    'UPDATE dbo.PlaceVersions SET Latitude=100 WHERE Scope=@scope',
    "UPDATE dbo.Places SET Workflow=N'unknown' WHERE Scope=@scope",
    'UPDATE dbo.PlaceContents SET Version=-1 WHERE Scope=@scope',
  ]) await assert.rejects(pool.request().input('scope', sql.NVarChar(100), scope).query(statement), error => error.number === 547)
  assert.deepStrictEqual(await load(repository), expected(fixture()))
})
test('SQL là nguồn chính; sửa đúng một hàng nội dung nháp không làm đổi bản công bố', async t => {
  const { scope, repository } = testRepository(t)
  await save(repository, fixture())
  const { sql, pool } = await connect(), body = 'Nội dung mới từ bảng SQL. '.repeat(300)
  await pool.request().input('scope', sql.NVarChar(100), scope).input('body', sql.NVarChar(sql.MAX), body).query("UPDATE dbo.PlaceContents SET Body=@body WHERE Scope=@scope AND SnapshotKind=N'draft' AND LanguageCode=N'vi'")
  const document = await load(repository)
  assert.equal(document.places[0].record.content.vi.body, body)
  assert.equal(document.places[0].published.content.vi.body, fixture().places[0].published.content.vi.body)
  const rows = await pool.request().input('scope', sql.NVarChar(100), scope).query('SELECT Body FROM dbo.vw_PlaceContent WHERE Scope=@scope AND SnapshotKind=N\'draft\'')
  assert.equal(rows.recordset[0].Body, body) // Không bị giới hạn 4.000 ký tự như JSON_VALUE cũ.
})
test('Danh mục rỗng vẫn là dữ liệu đã lưu; log xóa giữ mã di tích đã xóa', async t => {
  const { scope, repository } = testRepository(t), doc = fixture()
  await save(repository, doc)
  doc.places = []
  doc.audit = [{ at: '2026-10-28T01:00:00.000Z', action: 'deletePlace', placeId: 'ngo-mon', revision: 1 }]
  await save(repository, doc)
  assert.deepStrictEqual(await load(repository), expected(doc))
  const { sql, pool } = await connect()
  const result = await pool.request().input('scope', sql.NVarChar(100), scope).query('SELECT RelatedPlaceId FROM dbo.ReviewHistory WHERE Scope=@scope')
  assert.equal(result.recordset[0].RelatedPlaceId, null)
})
test('Lỗi khóa ngoại lúc ghi bản mới không xóa mất bản cũ', async t => {
  const { repository } = testRepository(t), doc = fixture(), invalid = fixture()
  await save(repository, doc)
  invalid.places[0].record.category = 'missing'
  await assert.rejects(save(repository, invalid), error => error.number === 547)
  assert.deepStrictEqual(await load(repository), expected(doc))
})
