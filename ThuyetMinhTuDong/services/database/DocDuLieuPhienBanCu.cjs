/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Đọc dữ liệu cũ phục vụ migration, không phải nguồn dữ liệu thay thế cho ứng dụng.
 *
 * VỊ TRÍ: services/database/DocDuLieuPhienBanCu.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/ChuyenSangMuoiMotBang.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. query
 * 2. optional
 * 3. key
 * 4. readDocument
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
/** Chỉ đọc schema tiếng Anh để chuyển đổi; không còn được runtime sử dụng. */
// ==================== [DATABASE] query ====================
async function query(executor, sql, scope, text, rows) {
  const request = executor.request().input('scope', sql.NVarChar(100), scope)
  if (rows !== undefined) request.input('rows', sql.NVarChar(sql.MAX), JSON.stringify(rows))
  return request.query(text)
}
const optional = (target, key, value) => {
  if (value !== null && value !== undefined) target[key] = value
}
const key = (...parts) => JSON.stringify(parts)

// CHỨC NĂNG: Đọc từng bảng và ghép đúng bản nháp/bản công bố của mỗi di tích.
// ==================== [DATABASE] readDocument ====================
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
async function readDocument(executor, sql, scope) {
  const result = await query(
    executor,
    sql,
    scope,
    `
    SELECT Revision FROM dbo.CatalogScopes WHERE Scope=@scope;
    SELECT * FROM dbo.Places WHERE Scope=@scope ORDER BY SortOrder;
    SELECT * FROM dbo.PlaceVersions WHERE Scope=@scope;
    SELECT * FROM dbo.PlaceContents WHERE Scope=@scope;
    SELECT * FROM dbo.PlaceImages WHERE Scope=@scope ORDER BY SortOrder;
    SELECT * FROM dbo.AudioTracks WHERE Scope=@scope;
    SELECT * FROM dbo.ContentSources WHERE Scope=@scope ORDER BY SortOrder;
    SELECT * FROM dbo.ReviewHistory WHERE Scope=@scope ORDER BY SortOrder;`,
  )
  const [scopes, places, versions, contents, images, audios, sources, history] = result.recordsets
  if (!scopes.length) return null // Chưa khởi tạo; khác với một danh mục có 0 di tích.
  const records = new Map(),
    texts = new Map()
  for (const row of versions) {
    const record = {
      id: row.PlaceId,
      scope: row.RecordScope,
      inLaunchCatalog: Boolean(row.InLaunchCatalog),
      status: row.RecordStatus,
      canonicalTitle: row.CanonicalTitle,
      zone: row.Zone,
      images: [],
      content: {},
    }
    if (row.HasCategory) record.category = row.CategoryCode
    optional(record, 'period', row.Period)
    if (row.Featured !== null) record.featured = Boolean(row.Featured)
    if (row.Latitude !== null) {
      record.position = {
        lat: row.Latitude,
        lng: row.Longitude,
        verified: Boolean(row.PositionVerified),
      }
      optional(record.position, 'source', row.PositionSource)
      optional(record.position, 'checkedAt', row.PositionCheckedAt)
    }
    records.set(key(row.PlaceId, row.SnapshotKind), record)
  }
  for (const row of images) records.get(key(row.PlaceId, row.SnapshotKind)).images.push(row.Url)
  for (const row of contents) {
    const text = {
      title: row.Title,
      summary: row.Summary,
      body: row.Body,
      address: row.Address,
      version: row.Version,
      status: row.Status,
    }
    optional(text, 'approvedAt', row.ApprovedAt)
    optional(text, 'publishedAt', row.PublishedAt)
    optional(text, 'adaptation', row.Adaptation)
    if (row.HasSources) text.sources = []
    records.get(key(row.PlaceId, row.SnapshotKind)).content[row.LanguageCode] = text
    texts.set(key(row.PlaceId, row.SnapshotKind, row.LanguageCode, row.Version), text)
  }
  for (const row of audios) {
    const audio = { id: row.AudioId, url: row.Url, version: row.Version, status: row.Status }
    optional(audio, 'approvedAt', row.ApprovedAt)
    optional(audio, 'publishedAt', row.PublishedAt)
    texts.get(key(row.PlaceId, row.SnapshotKind, row.LanguageCode, row.ContentVersion)).audio =
      audio
  }
  for (const row of sources) {
    const text = texts.get(key(row.PlaceId, row.SnapshotKind, row.LanguageCode, row.ContentVersion))
    if (!text.sources) throw Error('invalid_content_sources')
    text.sources.push({
      title: row.Title,
      url: row.Url,
      accessedAt: row.AccessedAt,
      license: row.License,
      licenseUrl: row.LicenseUrl,
    })
  }
  return {
    schema: 1,
    places: places.map((row) => {
      const record = records.get(key(row.PlaceId, 'draft'))
      if (!record) throw Error('missing_draft_record')
      const place = {
        id: row.PlaceId,
        record,
        period: row.Period,
        revision: row.Revision,
        workflow: row.Workflow,
        reviewNote: row.ReviewNote,
        updatedAt: row.UpdatedAt,
      }
      optional(place, 'approvedRevision', row.ApprovedRevision)
      optional(place, 'published', records.get(key(row.PlaceId, 'published')))
      return place
    }),
    sessions: [], // Phiên thật lấy từ ActiveSessions; API không còn mô phỏng phiên trong document.
    audit: history.map((row) => ({
      at: row.At,
      action: row.Action,
      placeId: row.PlaceId,
      revision: row.Revision,
    })),
  }
}

module.exports = { readDocument }
