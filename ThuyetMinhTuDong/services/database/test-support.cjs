/** FILE NÀY LÀM GÌ: Tách dữ liệu test khỏi scope main mà ứng dụng đang dùng.
 * Chỉ các file test gọi; cleanup chỉ xóa đúng scope ngẫu nhiên do test tạo. */
const { randomUUID } = require('node:crypto')
const { connect } = require('./connection.cjs')
const { createSqlRepository } = require('./repository.cjs')
async function cleanup(scope) {
  if (!scope.startsWith('test_')) throw Error('Không được cleanup dữ liệu ứng dụng.')
  const { sql, pool } = await connect()
  await pool.request().input('scope', sql.NVarChar(100), scope).query(`
    DELETE dbo.ActiveSessions WHERE Scope=@scope;
    DELETE dbo.GateEntries WHERE Scope=@scope;
    DELETE dbo.GateCarry WHERE Scope=@scope;
    DELETE dbo.ReviewHistory WHERE Scope=@scope;
    DELETE dbo.ContentSources WHERE Scope=@scope;
    DELETE dbo.AudioTracks WHERE Scope=@scope;
    DELETE dbo.PlaceImages WHERE Scope=@scope;
    DELETE dbo.PlaceContents WHERE Scope=@scope;
    DELETE dbo.PlaceVersions WHERE Scope=@scope;
    DELETE dbo.Places WHERE Scope=@scope;
    DELETE dbo.CatalogScopes WHERE Scope=@scope;
    DELETE a FROM dbo.MediaAliases a JOIN dbo.MediaFiles m ON m.Id=a.MediaId
      WHERE m.SourceScope=@scope AND NOT EXISTS(SELECT 1 FROM dbo.PlaceImages p WHERE p.MediaId=m.Id) AND NOT EXISTS(SELECT 1 FROM dbo.AudioTracks t WHERE t.MediaId=m.Id);
    DELETE m FROM dbo.MediaFiles m WHERE m.SourceScope=@scope
      AND NOT EXISTS(SELECT 1 FROM dbo.PlaceImages p WHERE p.MediaId=m.Id) AND NOT EXISTS(SELECT 1 FROM dbo.AudioTracks t WHERE t.MediaId=m.Id);`)
}
function testRepository(t, options = {}) {
  const scope = 'test_' + randomUUID()
  t.after(() => cleanup(scope))
  return { scope, repository: createSqlRepository({ scope, ...options }) }
}
module.exports = { cleanup, testRepository }
