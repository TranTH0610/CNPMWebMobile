/**
 * FILE NÀY LÀM GÌ: Chuyển AdminDocument của API sang các dòng SQL và ghép ngược lại.
 * repository.cjs/migrate.cjs gọi trong transaction; không lưu toàn bộ tài liệu thành JSON.
 * TẠI SAO: Web/mobile giữ hợp đồng cũ, trong SSMS vẫn xem và ràng buộc được từng trường.
 */
const {normaliseDocumentMedia}=require('./media-store.cjs')
const columns = {
  Places: 'PlaceId:nvarchar(100),SortOrder:int,Revision:int,Workflow:nvarchar(20),Period:nvarchar(500),ReviewNote:nvarchar(max),ApprovedRevision:int,UpdatedAt:nvarchar(40)',
  PlaceVersions: 'PlaceId:nvarchar(100),SnapshotKind:nvarchar(10),RecordScope:nvarchar(100),InLaunchCatalog:bit,RecordStatus:nvarchar(20),CanonicalTitle:nvarchar(500),Zone:nvarchar(30),CategoryCode:nvarchar(30),HasCategory:bit,Period:nvarchar(500),Featured:bit,Latitude:float,Longitude:float,PositionVerified:bit,PositionSource:nvarchar(max),PositionCheckedAt:nvarchar(40)',
  PlaceContents: 'PlaceId:nvarchar(100),SnapshotKind:nvarchar(10),LanguageCode:nvarchar(10),Version:int,Title:nvarchar(500),Summary:nvarchar(max),Body:nvarchar(max),Address:nvarchar(max),Status:nvarchar(20),ApprovedAt:nvarchar(40),PublishedAt:nvarchar(40),Adaptation:nvarchar(50),HasSources:bit',
  PlaceImages: 'MediaId:char(64),PlaceId:nvarchar(100),SnapshotKind:nvarchar(10),SortOrder:int,Url:nvarchar(max)',
  AudioTracks: 'MediaId:char(64),PlaceId:nvarchar(100),SnapshotKind:nvarchar(10),LanguageCode:nvarchar(10),ContentVersion:int,AudioId:nvarchar(200),Url:nvarchar(max),Version:int,Status:nvarchar(20),ApprovedAt:nvarchar(40),PublishedAt:nvarchar(40)',
  ContentSources: 'PlaceId:nvarchar(100),SnapshotKind:nvarchar(10),LanguageCode:nvarchar(10),ContentVersion:int,SortOrder:int,Title:nvarchar(max),Url:nvarchar(max),AccessedAt:nvarchar(40),License:nvarchar(200),LicenseUrl:nvarchar(max)',
  ReviewHistory: 'SortOrder:int,At:nvarchar(40),Action:nvarchar(50),PlaceId:nvarchar(100),RelatedPlaceId:nvarchar(100),Revision:int',
}
// Chỉ dùng tên bảng/cột cố định ở trên, không nhận tên bảng từ request người dùng.
async function query(executor, sql, scope, text, rows) {
  const request = executor.request().input('scope', sql.NVarChar(100), scope)
  if (rows !== undefined) request.input('rows', sql.NVarChar(sql.MAX), JSON.stringify(rows))
  return request.query(text)
}
const optional = (target, key, value) => { if (value !== null && value !== undefined) target[key] = value }
const key = (...parts) => JSON.stringify(parts)

// CHỨC NĂNG: Đọc từng bảng và ghép đúng bản nháp/bản công bố của mỗi di tích.
async function readDocument(executor, sql, scope) {
  const result = await query(executor, sql, scope, `
    SELECT Revision FROM dbo.CatalogScopes WHERE Scope=@scope;
    SELECT * FROM dbo.Places WHERE Scope=@scope ORDER BY SortOrder;
    SELECT * FROM dbo.PlaceVersions WHERE Scope=@scope;
    SELECT * FROM dbo.PlaceContents WHERE Scope=@scope;
    SELECT * FROM dbo.PlaceImages WHERE Scope=@scope ORDER BY SortOrder;
    SELECT * FROM dbo.AudioTracks WHERE Scope=@scope;
    SELECT * FROM dbo.ContentSources WHERE Scope=@scope ORDER BY SortOrder;
    SELECT * FROM dbo.ReviewHistory WHERE Scope=@scope ORDER BY SortOrder;`)
  const [scopes, places, versions, contents, images, audios, sources, history] = result.recordsets
  if (!scopes.length) return null // Chưa khởi tạo; khác với một danh mục có 0 di tích.
  const records = new Map(), texts = new Map()
  for (const row of versions) {
    const record = { id: row.PlaceId, scope: row.RecordScope, inLaunchCatalog: Boolean(row.InLaunchCatalog), status: row.RecordStatus, canonicalTitle: row.CanonicalTitle, zone: row.Zone, images: [], content: {} }
    if (row.HasCategory) record.category = row.CategoryCode
    optional(record, 'period', row.Period)
    if (row.Featured !== null) record.featured = Boolean(row.Featured)
    if (row.Latitude !== null) {
      record.position = { lat: row.Latitude, lng: row.Longitude, verified: Boolean(row.PositionVerified) }
      optional(record.position, 'source', row.PositionSource)
      optional(record.position, 'checkedAt', row.PositionCheckedAt)
    }
    records.set(key(row.PlaceId, row.SnapshotKind), record)
  }
  for (const row of images) records.get(key(row.PlaceId, row.SnapshotKind)).images.push(row.Url)
  for (const row of contents) {
    const text = { title: row.Title, summary: row.Summary, body: row.Body, address: row.Address, version: row.Version, status: row.Status }
    optional(text, 'approvedAt', row.ApprovedAt); optional(text, 'publishedAt', row.PublishedAt); optional(text, 'adaptation', row.Adaptation)
    if (row.HasSources) text.sources = []
    records.get(key(row.PlaceId, row.SnapshotKind)).content[row.LanguageCode] = text
    texts.set(key(row.PlaceId, row.SnapshotKind, row.LanguageCode, row.Version), text)
  }
  for (const row of audios) {
    const audio = { id: row.AudioId, url: row.Url, version: row.Version, status: row.Status }
    optional(audio, 'approvedAt', row.ApprovedAt); optional(audio, 'publishedAt', row.PublishedAt)
    texts.get(key(row.PlaceId, row.SnapshotKind, row.LanguageCode, row.ContentVersion)).audio = audio
  }
  for (const row of sources) {
    const text = texts.get(key(row.PlaceId, row.SnapshotKind, row.LanguageCode, row.ContentVersion))
    if (!text.sources) throw Error('invalid_content_sources')
    text.sources.push({ title: row.Title, url: row.Url, accessedAt: row.AccessedAt, license: row.License, licenseUrl: row.LicenseUrl })
  }
  return {
    schema: 1,
    places: places.map(row => {
      const record = records.get(key(row.PlaceId, 'draft'))
      if (!record) throw Error('missing_draft_record')
      const place = { id: row.PlaceId, record, period: row.Period, revision: row.Revision, workflow: row.Workflow, reviewNote: row.ReviewNote, updatedAt: row.UpdatedAt }
      optional(place, 'approvedRevision', row.ApprovedRevision)
      optional(place, 'published', records.get(key(row.PlaceId, 'published')))
      return place
    }),
    sessions: [], // Phiên thật lấy từ ActiveSessions; API không còn mô phỏng phiên trong document.
    audit: history.map(row => ({ at: row.At, action: row.Action, placeId: row.PlaceId, revision: row.Revision })),
  }
}

// CHỨC NĂNG: Phân tách dữ liệu thành các bảng có khóa ngoại và phiên bản rõ ràng.
function splitDocument(document) {
  if (document.schema !== 1 || !Array.isArray(document.places) || !Array.isArray(document.audit) || !Array.isArray(document.sessions) || document.sessions.length) throw Error('invalid_catalog_document')
  const rows = Object.fromEntries(Object.keys(columns).map(name => [name, []]))
  const ids = new Set(document.places.map(place => place.id))
  document.places.forEach((place, order) => {
    rows.Places.push({ PlaceId: place.id, SortOrder: order, Revision: place.revision, Workflow: place.workflow, Period: place.period, ReviewNote: place.reviewNote, ApprovedRevision: place.approvedRevision, UpdatedAt: place.updatedAt })
    for (const [kind, record] of [['draft', place.record], ['published', place.published]]) {
      if (!record) { if (kind === 'draft') throw Error('missing_draft_record'); continue }
      if (record.id !== place.id || !Array.isArray(record.images) || !record.content) throw Error('invalid_record')
      const identity = { PlaceId: place.id, SnapshotKind: kind }
      rows.PlaceVersions.push({ ...identity, RecordScope: record.scope, InLaunchCatalog: record.inLaunchCatalog, RecordStatus: record.status, CanonicalTitle: record.canonicalTitle, Zone: record.zone, CategoryCode: record.category ?? (record.zone === 'fortifications' ? 'gate' : 'palace'), HasCategory: record.category !== undefined, Period: record.period, Featured: record.featured, Latitude: record.position?.lat, Longitude: record.position?.lng, PositionVerified: record.position?.verified, PositionSource: record.position?.source, PositionCheckedAt: record.position?.checkedAt })
      record.images.forEach((url, order) => rows.PlaceImages.push({ ...identity, SortOrder: order, Url: url, MediaId: url.slice(6) }))
      for (const [language, text] of Object.entries(record.content)) {
        if (!text) continue
        const contentIdentity = { ...identity, LanguageCode: language, ContentVersion: text.version }
        rows.PlaceContents.push({ ...identity, LanguageCode: language, Version: text.version, Title: text.title, Summary: text.summary, Body: text.body, Address: text.address, Status: text.status, ApprovedAt: text.approvedAt, PublishedAt: text.publishedAt, Adaptation: text.adaptation, HasSources: text.sources !== undefined })
        if (text.audio) rows.AudioTracks.push({ ...contentIdentity, AudioId: text.audio.id, Url: text.audio.url, MediaId: text.audio.url.slice(6), Version: text.audio.version, Status: text.audio.status, ApprovedAt: text.audio.approvedAt, PublishedAt: text.audio.publishedAt })
        text.sources?.forEach((source, order) => rows.ContentSources.push({ ...contentIdentity, SortOrder: order, Title: source.title, Url: source.url, AccessedAt: source.accessedAt, License: source.license, LicenseUrl: source.licenseUrl }))
      }
    }
  })
  document.audit.forEach((item, order) => rows.ReviewHistory.push({ SortOrder: order, At: item.at, Action: item.action, PlaceId: item.placeId, RelatedPlaceId: ids.has(item.placeId) ? item.placeId : null, Revision: item.revision }))
  return rows
}

// CHỨC NĂNG: Ghi nguyên tử một thay đổi nghiệp vụ bằng các dòng quan hệ.
// TẠI SAO: Nếu một hàng vi phạm FK/CHECK thì transaction ngoài rollback toàn bộ,
// không để bản nháp, ảnh và âm thanh bị lệch nhau. Dữ liệu QR/phiên không bị đụng đến.
async function writeDocument(executor, sql, scope, document, { revision } = {}) {
  const canonical=await normaliseDocumentMedia(executor,sql,scope,document)
  const rows = splitDocument(canonical)
  for (const table of ['ReviewHistory', 'ContentSources', 'AudioTracks', 'PlaceImages', 'PlaceContents', 'PlaceVersions', 'Places']) {
    await query(executor, sql, scope, `DELETE FROM dbo.${table} WHERE Scope=@scope`)
  }
  const request = executor.request().input('scope', sql.NVarChar(100), scope).input('revision', sql.BigInt, revision ?? null)
  await request.query(`UPDATE dbo.CatalogScopes SET Revision=COALESCE(@revision,Revision+1),UpdatedAt=SYSUTCDATETIME() WHERE Scope=@scope;
    IF @@ROWCOUNT=0 INSERT dbo.CatalogScopes(Scope,Revision) VALUES(@scope,COALESCE(@revision,1));`)
  for (const [table, fields] of Object.entries(columns)) {
    if (!rows[table].length) continue
    const definitions = fields.split(',').map(field => field.split(':'))
    const names = definitions.map(([name]) => `[${name}]`).join(',')
    const schema = definitions.map(([name, type]) => `[${name}] ${type} '$.${name}'`).join(',')
    // JSON chỉ là gói truyền tham số cho INSERT hàng loạt, không được lưu trong bảng.
    await query(executor, sql, scope, `INSERT dbo.${table}(Scope,${names}) SELECT @scope,${names} FROM OPENJSON(@rows) WITH(${schema})`, rows[table])
  }
}
module.exports = { readDocument, writeDocument, splitDocument }
