/**
 * FILE NÀY LÀM GÌ: Tạo bảng quan hệ và chuyển dữ liệu JSON v1 sang v2.
 * npm run db:init gọi. Chỉ lưu trữ bảng cũ sau khi đối chiếu dữ liệu thành công.
 * TẠI SAO: Migration lỗi phải rollback dữ liệu, không để mất bản công bố hoặc bản ngôn ngữ.
 */
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const { databaseName, driverConfig } = require('./config.cjs')
const { readDocument, writeDocument } = require('./catalog-relational.cjs')
const {normaliseDocumentMedia}=require('./media-store.cjs')
const {migrateMedia}=require('./migrate-media.cjs')

async function migrateLegacy(pool, sql) {
  const transaction = new sql.Transaction(pool)
  await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED)
  try {
    await transaction.request().query(`DECLARE @result int;
      EXEC @result=sys.sp_getapplock @Resource=N'HueGuide:schema:v2',@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;
      IF @result<0 THROW 51000,'schema_lock_timeout',1;`)
    const exists = await transaction.request().query("SELECT OBJECT_ID(N'dbo.CatalogDocuments',N'U') AS id")
    if (exists.recordset[0].id !== null) {
      const old = await transaction.request().query('SELECT Scope,Payload,Revision FROM dbo.CatalogDocuments WITH(UPDLOCK,HOLDLOCK)')
      for (const row of old.recordset) {
        const document = JSON.parse(row.Payload)
        const existing = await readDocument(transaction, sql, row.Scope)
        if (existing === null) await writeDocument(transaction, sql, row.Scope, document, { revision: Number(row.Revision) })
        // So sánh toàn bộ: nội dung dài, thứ tự ảnh, audio, nguồn và draft/published.
        assert.deepStrictEqual(await readDocument(transaction, sql, row.Scope), await normaliseDocumentMedia(transaction,sql,row.Scope,document), `Migration lệch dữ liệu scope ${row.Scope}`)
      }
      if ((await transaction.request().query("SELECT SCHEMA_ID(N'archive') AS id")).recordset[0].id === null) await transaction.request().query("EXEC(N'CREATE SCHEMA archive')")
      // Giữ bản gốc để tra cứu/khôi phục; runtime mới không đọc bảng lưu trữ này.
      await transaction.request().query('ALTER SCHEMA archive TRANSFER dbo.CatalogDocuments')
      console.log(`Đã đối chiếu và chuyển ${old.recordset.length} scope; bản JSON cũ ở archive.CatalogDocuments.`)
    }
    await transaction.commit()
  } catch (error) {
    try { await transaction.rollback() } catch { /* Có thể SQL đã rollback. */ }
    throw error
  }
}

async function migrate() {
  const name = databaseName(), { sql, config } = driverConfig('master')
  const master = await new sql.ConnectionPool(config).connect()
  try {
    const result = await master.request().input('name', sql.NVarChar(128), name).query('SELECT DB_ID(@name) AS id')
    if (result.recordset[0].id === null) await master.request().query(`CREATE DATABASE [${name}]`)
  } finally { await master.close() }
  const target = driverConfig(name), pool = await new target.sql.ConnectionPool(target.config).connect()
  try {
    const batches = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8').split(/^GO\s*$/mi)
    for (const batch of batches) if (batch.trim()) await pool.request().batch(batch)
    await pool.request().batch(fs.readFileSync(path.join(__dirname,'media-schema.sql'),'utf8'))
    await migrateLegacy(pool, target.sql)
    await migrateMedia(pool,target.sql)
    console.log(`SQL quan hệ sẵn sàng: ${target.config.server} / ${name}`)
  } finally { await pool.close() }
}
if (require.main === module) migrate().catch(error => { console.error('Migration chưa hoàn tất:', error.message); process.exitCode = 1 })
module.exports = { migrate, migrateLegacy }
