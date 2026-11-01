/**
 * FILE NÀY LÀM GÌ: Chuyển schema cũ sang đúng 11 bảng, đối chiếu rồi mới xóa bảng cũ.
 * migrate.cjs gọi trong thời gian bảo trì. Sao lưu .bak trước khi dùng trên main.
 * TẠI SAO: Không mất bài viết/ảnh/MP3, lịch sử QR hoặc metadata tệp khi đổi khóa.
 */
const assert=require('node:assert/strict'),crypto=require('node:crypto')
const {installSchema}=require('./connection.cjs')
const {readDocument:readOld}=require('./legacy-read.cjs')
const {readDocument,writeDocument}=require('./catalog11.cjs')
const {sqlPlaceId,apiPlaceId,code}=require('./ids.cjs')

// Những thay đổi biểu diễn đã chốt: mã bản thu BT..., nguồn rỗng [], ngày UTC.
// Không bỏ qua nội dung, tọa độ, thứ tự ảnh, trạng thái hoặc phiên bản khi đối chiếu.
function comparable(document){
 const d=structuredClone(document)
 for(const p of d.places){
  p.id=apiPlaceId(sqlPlaceId(p.id));p.updatedAt=new Date(p.updatedAt).toISOString()
  for(const r of [p.record,p.published])if(r){
   r.id=p.id;r.featured=r.featured??false;r.period=r.period??p.period
   for(const t of Object.values(r.content))if(t){t.sources=t.sources??[];
    for(const key of ['approvedAt','publishedAt'])if(t[key])t[key]=new Date(t[key]).toISOString()
    if(t.audio){delete t.audio.id;for(const key of ['approvedAt','publishedAt'])if(t.audio[key])t.audio[key]=new Date(t.audio[key]).toISOString()}
   }
  }
 }
 for(const a of d.audit)a.at=new Date(a.at).toISOString()
 return d
}
async function migrate11(pool,sql){
 const oldExists=(await pool.request().query("SELECT OBJECT_ID(N'dbo.Places',N'U') AS oldId,OBJECT_ID(N'dbo.DiTich',N'U') AS newId")).recordset[0]
 if(!oldExists.oldId){await installSchema(pool);return{alreadyCurrent:true}}
 if(oldExists.newId)throw Error('Cả schema cũ và mới tồn tại: cần kiểm tra trước khi chuyển.')
 const expectedColumns={
  Categories:'Code Name',Languages:'Code Name',CatalogScopes:'Scope Revision UpdatedAt',
  Places:'Scope PlaceId SortOrder Revision Workflow Period ReviewNote ApprovedRevision UpdatedAt',
  PlaceVersions:'Scope PlaceId SnapshotKind RecordScope InLaunchCatalog RecordStatus CanonicalTitle Zone CategoryCode HasCategory Period Featured Latitude Longitude PositionVerified PositionSource PositionCheckedAt',
  PlaceContents:'Scope PlaceId SnapshotKind LanguageCode Version Title Summary Body Address Status ApprovedAt PublishedAt Adaptation HasSources',
  PlaceImages:'Scope PlaceId SnapshotKind SortOrder Url MediaId',
  AudioTracks:'Scope PlaceId SnapshotKind LanguageCode ContentVersion AudioId Url Version Status ApprovedAt PublishedAt MediaId',
  ContentSources:'Scope PlaceId SnapshotKind LanguageCode ContentVersion SortOrder Title Url AccessedAt License LicenseUrl',
  ReviewHistory:'Scope SortOrder At Action PlaceId RelatedPlaceId Revision',
  GateEntries:'Scope VisitDay VisitId Platform OpenedAt',GateCarry:'Scope VisitDay Total',ActiveSessions:'Scope SessionId Platform LastSeen',
  MediaFiles:'Id Kind MimeType Data ByteLength SourceScope CreatedAt',MediaAliases:'SourceHash SourceUri MediaId',
 }
 const actualColumns=(await pool.request().query("SELECT OBJECT_NAME(object_id) AS tableName,name FROM sys.columns WHERE OBJECT_SCHEMA_NAME(object_id)=N'dbo'")).recordset
 for(const [table,fields]of Object.entries(expectedColumns)){
  const actual=actualColumns.filter(c=>c.tableName===table).map(c=>c.name).sort(),expected=fields.split(' ').sort()
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Cột của '+table+' khác schema đã kiểm tra; cần hỏi người dùng trước khi chuyển.')
 }
 const scopes=(await pool.request().query("SELECT Scope FROM dbo.CatalogScopes WHERE Scope<>N'main'")).recordset
 if(scopes.length)throw Error('Có phạm vi dữ liệu khác main: không tự bỏ dữ liệu. Cần xác nhận cách chuyển.')
 const original=await readOld(pool,sql,'main')
 if(!original)throw Error('Không đọc được dữ liệu cũ; dừng để tránh nạp đè.')
 const files=(await pool.request().query('SELECT * FROM dbo.MediaFiles ORDER BY Id')).recordset
 const gate=(await pool.request().query("SELECT * FROM dbo.GateEntries WHERE Scope=N'main';SELECT * FROM dbo.GateCarry WHERE Scope=N'main';SELECT * FROM dbo.ActiveSessions WHERE Scope=N'main'" )).recordsets
 const transaction=new sql.Transaction(pool)
 await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE)
 try{
  await installSchema(transaction)
  // Byte ảnh/MP3 và ngày tạo được giữ nguyên. SHA phải khớp byte thật trước INSERT.
  for(const f of files){assert.equal(crypto.createHash('sha256').update(f.Data).digest('hex'),f.Id)
   await transaction.request().input('hash',sql.Char(64),f.Id).input('mime',sql.VarChar(40),f.MimeType).input('data',sql.VarBinary(sql.MAX),f.Data).input('at',sql.DateTime2(3),f.CreatedAt)
    .query('INSERT dbo.TepTaiNguyen(MaBamTep,DinhDangTep,DuLieuTep,ThoiDiemTao) VALUES(@hash,@mime,@data,@at)')}
  await writeDocument(transaction,sql,'main',original)
  for(const row of gate[0])await transaction.request().input('day',sql.Date,row.VisitDay).input('id',sql.VarChar(100),row.VisitId).input('platform',sql.VarChar(20),row.Platform).input('at',sql.DateTime2(3),row.OpenedAt)
   .query("INSERT dbo.LuotTruyCapQR(NgayTruyCap,MaLuotTruyCap,NenTang,ThoiDiemTruyCap,LoaiGhiNhan,SoLuot) VALUES(@day,@id,@platform,@at,'luot_moi',1)")
  for(const row of gate[1])await transaction.request().input('day',sql.Date,row.VisitDay).input('total',sql.Int,row.Total)
   .query("INSERT dbo.LuotTruyCapQR(NgayTruyCap,MaLuotTruyCap,NenTang,ThoiDiemTruyCap,LoaiGhiNhan,SoLuot) VALUES(@day,CONCAT('chuyen-cu-',CONVERT(char(10),@day,23)),NULL,NULL,'tong_chuyen_cu',@total)")
  for(const row of gate[2])await transaction.request().input('id',sql.VarChar(100),row.SessionId).input('platform',sql.VarChar(20),row.Platform).input('at',sql.DateTime2(3),new Date(Number(row.LastSeen)))
   .query('INSERT dbo.PhienHoatDong VALUES(@id,@platform,@at)')
  const converted=await readDocument(transaction)
  assert.deepStrictEqual(comparable(converted),comparable(original),'Đối chiếu nội dung không đạt; rollback toàn bộ.')
  const verified=(await transaction.request().query(`SELECT COUNT(*) AS count,SUM(CONVERT(bigint,DungLuongByte)) AS bytes FROM dbo.TepTaiNguyen;
   SELECT COALESCE(SUM(CONVERT(bigint,SoLuot)),0) AS total FROM dbo.LuotTruyCapQR;
   SELECT COUNT(*) AS count FROM dbo.PhienHoatDong`)).recordsets
  assert.equal(verified[0][0].count,files.length)
  assert.equal(Number(verified[0][0].bytes),files.reduce((sum,f)=>sum+f.Data.length,0))
  assert.equal(Number(verified[1][0].total),gate[0].length+gate[1].reduce((sum,g)=>sum+g.Total,0))
  assert.equal(verified[2][0].count,gate[2].length)
  // Chỉ xóa bản cũ sau khi mọi phép đối chiếu đạt; bản .bak giữ nguyên trước migration.
  await transaction.request().query(`DROP VIEW IF EXISTS dbo.vw_Places;DROP VIEW IF EXISTS dbo.vw_PlaceContent;
   DROP TABLE dbo.ReviewHistory,dbo.ContentSources,dbo.AudioTracks,dbo.PlaceImages;
   DROP TABLE dbo.PlaceContents;DROP TABLE dbo.PlaceVersions;DROP TABLE dbo.Places;DROP TABLE dbo.CatalogScopes;
   DROP TABLE dbo.Categories,dbo.Languages,dbo.GateEntries,dbo.GateCarry,dbo.ActiveSessions;
   DROP TABLE dbo.MediaAliases;DROP TABLE dbo.MediaFiles;
   DROP TABLE IF EXISTS archive.CatalogDocuments;`)
  const count=(await transaction.request().query("SELECT COUNT(*) AS n FROM sys.tables WHERE schema_id=SCHEMA_ID(N'dbo') AND name<>N'sysdiagrams'")).recordset[0].n
  assert.equal(count,11)
  await transaction.commit()
  return{places:converted.places.length,files:files.length,bytes:Number(verified[0][0].bytes),qrTotal:Number(verified[1][0].total),tables:count}
 }catch(error){try{await transaction.rollback()}catch{}throw error}
}
module.exports={migrate11,comparable}
