/** FILE NÀY LÀM GÌ: Nhập ảnh/MP3 đang được các di tích tham chiếu vào SQL.
 * migrate.cjs gọi sau khi tạo bảng. Đối chiếu đầy đủ tài liệu với thay đổi URL dự kiến. */
const assert=require('node:assert/strict')
const {readDocument,writeDocument}=require('./catalog-relational.cjs')
const {normaliseDocumentMedia}=require('./media-store.cjs')
async function migrateMedia(pool,sql){
 const transaction=new sql.Transaction(pool)
 await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED)
 try{
  await transaction.request().query(`DECLARE @result int;
   EXEC @result=sys.sp_getapplock @Resource=N'HueGuide:schema:media',@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;
   IF @result<0 THROW 51000,'schema_lock_timeout',1;`)
  const scopes=(await transaction.request().query(`SELECT s.Scope,s.Revision FROM dbo.CatalogScopes s WHERE
   EXISTS(SELECT 1 FROM dbo.PlaceImages i WHERE i.Scope=s.Scope AND i.MediaId IS NULL)
   OR EXISTS(SELECT 1 FROM dbo.AudioTracks a WHERE a.Scope=s.Scope AND a.MediaId IS NULL)`)).recordset
  for(const row of scopes){
   const original=await readDocument(transaction,sql,row.Scope)
   const expected=await normaliseDocumentMedia(transaction,sql,row.Scope,original)
   await writeDocument(transaction,sql,row.Scope,expected,{revision:Number(row.Revision)+1})
   assert.deepStrictEqual(await readDocument(transaction,sql,row.Scope),expected,'Media migration lệch nội dung')
  }
  await transaction.request().query(`IF EXISTS(SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID(N'dbo.PlaceImages') AND name=N'MediaId' AND is_nullable=1)
    ALTER TABLE dbo.PlaceImages ALTER COLUMN MediaId char(64) COLLATE Latin1_General_100_BIN2 NOT NULL;
   IF EXISTS(SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID(N'dbo.AudioTracks') AND name=N'MediaId' AND is_nullable=1)
    ALTER TABLE dbo.AudioTracks ALTER COLUMN MediaId char(64) COLLATE Latin1_General_100_BIN2 NOT NULL;`)
  await transaction.commit()
  console.log(`Đã đối chiếu và nhập media của ${scopes.length} scope vào SQL.`)
 }catch(error){try{await transaction.rollback()}catch{}throw error}
}
module.exports={migrateMedia}
