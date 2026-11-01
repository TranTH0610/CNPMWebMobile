/**
 * FILE NÀY LÀM GÌ: Lưu nội dung, lượt QR và phiên hoạt động bằng 11 bảng tiếng Việt.
 * Catalog/presence gọi. Mọi lần sửa nằm trong transaction có khóa chống ghi đè.
 * TẠI SAO: Web/mobile đọc cùng SQL; không dùng RAM thay cho dữ liệu bị lỗi.
 */
const {connect}=require('./connection.cjs')
const {readDocument,writeDocument}=require('./catalog11.cjs')
function createSqlRepository({scope='main',now=Date.now,ttlMs=90000,maxSessions=10000}={}){
 const dayOf=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now()))
 async function query(executor,text,values={}){
  const {sql}=await connect(scope),request=executor.request()
  for(const [k,v]of Object.entries(values))request.input(k,typeof v==='number'?sql.BigInt:sql.NVarChar(sql.MAX),v)
  return request.query(text)
 }
 async function locked(resource,action){
  const {sql,pool}=await connect(scope),transaction=new sql.Transaction(pool)
  await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED)
  try{
   await query(transaction,`DECLARE @r int;EXEC @r=sys.sp_getapplock @Resource=@resource,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;IF @r<0 THROW 51000,'database_busy',1;`,{resource:'HueGuide11:'+resource})
   const result=await action(transaction);await transaction.commit();return result
  }catch(error){try{await transaction.rollback()}catch{}throw error}
 }
 return {
  catalog:action=>locked('catalog',async transaction=>{
   const {sql}=await connect(scope)
   return action({read:async()=>{
    // Sequence đánh dấu đã từng cấp mã: xóa hết di tích không tự nạp lại seed.
    const state=await query(transaction,"SELECT last_used_value AS current_value FROM sys.sequences WHERE name=N'SeqDiTich'")
    const document=await readDocument(transaction)
    return !document.places.length&&state.recordset[0]?.current_value===null?null:JSON.stringify(document)
   },write:async payload=>{if(Buffer.byteLength(payload)>32*1024*1024)throw Error('capacity');await writeDocument(transaction,sql,scope,JSON.parse(payload))}})
  }),
  version:async()=>{
   const {pool}=await connect(scope)
   const result=await query(pool,`SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',CONCAT(
    (SELECT * FROM dbo.DiTich ORDER BY MaDiTich FOR JSON PATH),
    (SELECT * FROM dbo.BanDiTich ORDER BY MaBanDiTich FOR JSON PATH),
    (SELECT * FROM dbo.NoiDungDiTich ORDER BY MaNoiDung FOR JSON PATH),
    (SELECT * FROM dbo.HinhAnhDiTich ORDER BY MaHinhAnh FOR JSON PATH),
    (SELECT * FROM dbo.BanThuThuyetMinh ORDER BY MaBanThu FOR JSON PATH),
    (SELECT * FROM dbo.NguonThamKhao ORDER BY MaNguon FOR JSON PATH))),2) AS version`)
   return result.recordset[0].version
  },
  gateStatistics:async()=>{const {pool}=await connect(scope),day=dayOf();const r=await query(pool,'SELECT COALESCE(SUM(CONVERT(bigint,SoLuot)),0) AS today FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day)',{day});return{today:Number(r.recordset[0].today),day}},
  gateEntry:(visitId,platform)=>locked('gate',async transaction=>{
   const day=dayOf(),r=await query(transaction,`SELECT COUNT(*) AS total FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day) AND LoaiGhiNhan='luot_moi';SELECT 1 AS found FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day) AND MaLuotTruyCap=@visitId;`,{day,visitId})
   if(r.recordsets[1].length)return
   if(r.recordsets[0][0].total>=50000)throw Error('capacity')
   await query(transaction,`INSERT dbo.LuotTruyCapQR(NgayTruyCap,MaLuotTruyCap,NenTang,ThoiDiemTruyCap,LoaiGhiNhan,SoLuot) VALUES(CONVERT(date,@day),@visitId,@platform,SYSUTCDATETIME(),'luot_moi',1)`,{day,visitId,platform})
  }),
  importGate:gate=>locked('gate',async transaction=>{
   if(!gate||!/^\d{4}-\d{2}-\d{2}$/.test(gate.day)||!Number.isSafeInteger(gate.today)||gate.today<0)throw Error('invalid_gate')
   await query(transaction,`IF NOT EXISTS(SELECT 1 FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day)) INSERT dbo.LuotTruyCapQR(NgayTruyCap,MaLuotTruyCap,NenTang,ThoiDiemTruyCap,LoaiGhiNhan,SoLuot) VALUES(CONVERT(date,@day),CONCAT('chuyen-cu-',@day),NULL,NULL,'tong_chuyen_cu',@total)`,{day:gate.day,total:gate.today})
  }),
  heartbeat:({sessionId,platform})=>locked('presence',async transaction=>{
   const time=now(),cutoff=new Date(time-ttlMs).toISOString()
   await query(transaction,'DELETE dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi<=CONVERT(datetime2,@cutoff,127)',{cutoff})
   const r=await query(transaction,'SELECT NenTang FROM dbo.PhienHoatDong WHERE MaPhien=@id;SELECT COUNT(*) AS total FROM dbo.PhienHoatDong',{id:sessionId})
   if(r.recordsets[0][0]&&r.recordsets[0][0].NenTang!==platform)throw Error('platform_conflict')
   if(!r.recordsets[0].length&&r.recordsets[1][0].total>=maxSessions)throw Error('capacity')
   await query(transaction,`UPDATE dbo.PhienHoatDong SET ThoiDiemHoatDongCuoi=CONVERT(datetime2,@time,127) WHERE MaPhien=@id;IF @@ROWCOUNT=0 INSERT dbo.PhienHoatDong VALUES(@id,@platform,CONVERT(datetime2,@time,127))`,{id:sessionId,platform,time:new Date(time).toISOString()})
  }),
  end:async id=>{const{pool}=await connect(scope);await query(pool,'DELETE dbo.PhienHoatDong WHERE MaPhien=@id',{id})},
  prune:async()=>{const{pool}=await connect(scope);await query(pool,'DELETE dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi<=CONVERT(datetime2,@cutoff,127)',{cutoff:new Date(now()-ttlMs).toISOString()})},
  snapshot:async()=>{const{pool}=await connect(scope),time=now();const r=await query(pool,`SELECT COUNT(*) AS active,COALESCE(SUM(CASE WHEN NenTang='web' THEN 1 ELSE 0 END),0) AS web,COALESCE(SUM(CASE WHEN NenTang='mobile-app' THEN 1 ELSE 0 END),0) AS mobile FROM dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi>CONVERT(datetime2,@cutoff,127)`,{cutoff:new Date(time-ttlMs).toISOString()});return{...r.recordset[0],updatedAt:time,ttlSeconds:ttlMs/1000}},
 }
}
module.exports={createSqlRepository}
