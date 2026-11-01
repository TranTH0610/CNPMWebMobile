/**
 * FILE NÀY LÀM GÌ: Ghép 11 bảng tiếng Việt thành hợp đồng dữ liệu web/mobile và ghi ngược lại.
 * Repository/migration gọi trong transaction. Nguồn tham khảo là từng hàng, không lưu JSON.
 * TẠI SAO: Thay cấu trúc SQL nhưng giữ các màn đang hoạt động và URL đã phát hành.
 */
const {sqlPlaceId,apiPlaceId,code,CATEGORIES,ZONES,categoryCode,zoneCode}=require('./ids.cjs')
const stamp=value=>value==null?undefined:new Date(value).toISOString()
const optional=(o,k,v)=>{if(v!==null&&v!==undefined)o[k]=v}
async function rows(executor,text,values={}){
 const request=executor.request()
 for(const [key,value]of Object.entries(values))request.input(key,value??null)
 return request.query(text)
}
async function nextCode(executor,prefix,sequence){
 const result=await rows(executor,`SELECT NEXT VALUE FOR dbo.${sequence} AS n`)
 return code(prefix,result.recordset[0].n)
}
async function readDocument(executor){
 const r=await rows(executor,`SELECT * FROM dbo.DiTich ORDER BY ThuTuHienThi;
 SELECT * FROM dbo.BanDiTich;SELECT * FROM dbo.NoiDungDiTich;
 SELECT h.*,t.MaBamTep FROM dbo.HinhAnhDiTich h JOIN dbo.TepTaiNguyen t ON t.MaTep=h.MaTep ORDER BY h.ThuTuHienThi;
 SELECT a.*,t.MaBamTep FROM dbo.BanThuThuyetMinh a JOIN dbo.TepTaiNguyen t ON t.MaTep=a.MaTep;
 SELECT * FROM dbo.NguonThamKhao ORDER BY ThuTuHienThi;
 SELECT * FROM dbo.LichSuKiemDuyet ORDER BY ThoiDiemThaoTac DESC,TRY_CONVERT(bigint,SUBSTRING(MaLichSu,3,28)) DESC;`)
 const [places,versions,contents,images,audios,sources,history]=r.recordsets
 const records=new Map(),texts=new Map()
 for(const b of versions){
  const p=places.find(p=>p.MaDiTich===b.MaDiTich)
  const record={id:apiPlaceId(b.MaDiTich),scope:'hue-citadel',inLaunchCatalog:true,
   status:b.LoaiBan==='published'||p.TrangThaiXuLy==='published'?'published':'draft',
   canonicalTitle:b.TenChuan,zone:ZONES[Number(b.MaKhuVuc.slice(2))-1],category:CATEGORIES[Number(b.MaDanhMuc.slice(2))-1],
   images:[],content:{},featured:Boolean(b.LaDiemNoiBat)}
  optional(record,'period',b.NienDai)
  if(b.ViDo!==null){record.position={lat:Number(b.ViDo),lng:Number(b.KinhDo),verified:Boolean(b.DaXacNhanViTri)};optional(record.position,'source',b.NguonToaDo);if(b.ThoiDiemDoiChieuViTri)record.position.checkedAt=stamp(b.ThoiDiemDoiChieuViTri).slice(0,10)}
  records.set(b.MaBanDiTich,record)
 }
 for(const n of contents){
  const text={title:n.TenDiTich,summary:n.TomTat,body:n.BaiThuyetMinh,address:n.DiaChi,version:n.PhienBanNoiDung,status:n.TrangThaiNoiDung}
  optional(text,'approvedAt',stamp(n.ThoiDiemDuyet));optional(text,'publishedAt',stamp(n.ThoiDiemCongBo));optional(text,'adaptation',n.HinhThucBienSoan)
  // Danh sách rỗng là giá trị mặc định chuẩn hóa, không cần cờ HasSources riêng.
  text.sources=[];records.get(n.MaBanDiTich).content[n.MaNgonNgu]=text;texts.set(n.MaNoiDung,text)
 }
 for(const h of images)records.get(h.MaBanDiTich).images.push('media:'+h.MaBamTep)
 for(const a of audios){const audio={id:a.MaBanThu,url:'media:'+a.MaBamTep,version:a.PhienBanBanThu,status:a.TrangThaiBanThu};optional(audio,'approvedAt',stamp(a.ThoiDiemDuyet));optional(audio,'publishedAt',stamp(a.ThoiDiemCongBo));texts.get(a.MaNoiDung).audio=audio}
 for(const s of sources)texts.get(s.MaNoiDung).sources.push({title:s.TenTaiLieu,url:s.DuongDan,accessedAt:new Date(s.NgayTruyCap).toISOString().slice(0,10),license:s.GiayPhep??'',licenseUrl:s.DuongDanGiayPhep??''})
 return {schema:1,sessions:[],places:places.map(p=>{
  const draft=versions.find(b=>b.MaDiTich===p.MaDiTich&&b.LoaiBan==='draft'),pub=versions.find(b=>b.MaDiTich===p.MaDiTich&&b.LoaiBan==='published')
  if(!draft)throw Error('missing_draft_record')
  const place={id:apiPlaceId(p.MaDiTich),record:records.get(draft.MaBanDiTich),period:draft.NienDai??'',revision:p.PhienBanChinhSua,workflow:p.TrangThaiXuLy,reviewNote:p.GhiChuKiemDuyet,updatedAt:stamp(p.ThoiDiemCapNhat)}
  optional(place,'approvedRevision',p.PhienBanDaDuyet);if(pub)place.published=records.get(pub.MaBanDiTich);return place
 }),audit:history.map(h=>({at:stamp(h.ThoiDiemThaoTac),action:h.HanhDong,placeId:apiPlaceId(h.MaDiTichGoc),revision:h.PhienBanDiTich}))}
}

// CHỨC NĂNG: Ghi các hàng trong một transaction ngoài; lỗi bất kỳ rollback toàn bộ.
// XỬ LÝ: Nhớ mã đang có để không đổi BDT/ND/HA/BT khi admin chỉ sửa nội dung.
async function writeDocument(executor,sql,scope,document){
 if(document.schema!==1||!Array.isArray(document.places)||!Array.isArray(document.audit)||document.sessions?.length)throw Error('invalid_catalog_document')
 const {normaliseDocumentMedia}=require('./media-store.cjs')
 const doc=await normaliseDocumentMedia(executor,sql,scope,document)
 const old=(await rows(executor,`SELECT * FROM dbo.DiTich;SELECT * FROM dbo.BanDiTich;SELECT * FROM dbo.NoiDungDiTich;
 SELECT * FROM dbo.HinhAnhDiTich;SELECT * FROM dbo.BanThuThuyetMinh;SELECT * FROM dbo.TepTaiNguyen;
 SELECT * FROM dbo.LichSuKiemDuyet;SELECT * FROM dbo.NguonThamKhao;`)).recordsets
 const [oldPlaces,oldVersions,oldContents,oldImages,oldAudios,media,oldHistory,oldSources]=old
 const ids=new Map()
 for(const p of doc.places){let id=sqlPlaceId(p.id);if(!/^DT\d{3,}$/.test(id)){
  do{id=await nextCode(executor,'DT','SeqDiTich')}while(oldPlaces.some(x=>x.MaDiTich===id)||[...ids.values()].includes(id))
 }ids.set(p.id,id)}
 // Ghi/xóa đúng hồ sơ mất khỏi tài liệu; bỏ FK lịch sử trước để giữ nhật ký xóa.
 await rows(executor,`UPDATE dbo.DiTich SET TrangThaiXuLy='draft';UPDATE dbo.LichSuKiemDuyet SET MaDiTichLienKet=NULL;
 DELETE dbo.NguonThamKhao;DELETE dbo.BanThuThuyetMinh;DELETE dbo.HinhAnhDiTich;
 DELETE dbo.NoiDungDiTich;DELETE dbo.BanDiTich;DELETE dbo.DiTich;`)
 const insert=async(table,value)=>{
  const keys=Object.keys(value),request=executor.request()
  for(const k of keys){const v=value[k];if(typeof v==='string')request.input(k,sql.NVarChar(sql.MAX),v);else if(v instanceof Date)request.input(k,sql.DateTime2(3),v);else if(typeof v==='boolean')request.input(k,sql.Bit,v);else if(typeof v==='number')request.input(k,Number.isInteger(v)?sql.Int:sql.Float,v);else request.input(k,sql.NVarChar(sql.MAX),null)}
  await request.query(`INSERT dbo.${table}(${keys.map(k=>'['+k+']').join(',')}) VALUES(${keys.map(k=>'@'+k).join(',')})`)
 }
 const desired=[]
 for(let order=0;order<doc.places.length;order++){
  const p=doc.places[order],id=ids.get(p.id),previous=oldPlaces.find(x=>x.MaDiTich===id)
  await insert('DiTich',{MaDiTich:id,ThuTuHienThi:order,PhienBanChinhSua:p.revision,TrangThaiXuLy:'draft',GhiChuKiemDuyet:p.reviewNote,PhienBanDaDuyet:p.approvedRevision,
   ThoiDiemTao:previous?.ThoiDiemTao??new Date(),ThoiDiemCapNhat:new Date(p.updatedAt)})
  desired.push([id,p.workflow])
  for(const [kind,record]of [['draft',p.record],['published',p.published]]){
   if(!record)continue
   const oldB=oldVersions.find(b=>b.MaDiTich===id&&b.LoaiBan===kind),bid=oldB?.MaBanDiTich??await nextCode(executor,'BDT','SeqBanDiTich')
   await insert('BanDiTich',{MaBanDiTich:bid,MaDiTich:id,LoaiBan:kind,TenChuan:record.canonicalTitle,MaKhuVuc:zoneCode(record.zone),MaDanhMuc:categoryCode(record.category??(record.zone==='fortifications'?'gate':'palace')),NienDai:record.period??p.period,
    LaDiemNoiBat:record.featured??false,ViDo:record.position?.lat,KinhDo:record.position?.lng,DaXacNhanViTri:record.position?.verified??false,NguonToaDo:record.position?.source,ThoiDiemDoiChieuViTri:record.position?.checkedAt?new Date(record.position.checkedAt):null})
   for(let i=0;i<record.images.length;i++){
    const file=media.find(m=>m.MaBamTep===record.images[i].slice(6));if(!file)throw Error('missing_sql_media')
    const oldH=oldImages.find(h=>h.MaBanDiTich===bid&&h.ThuTuHienThi===i)
    await insert('HinhAnhDiTich',{MaHinhAnh:oldH?.MaHinhAnh??await nextCode(executor,'HA','SeqHinhAnh'),MaBanDiTich:bid,MaTep:file.MaTep,ThuTuHienThi:i,MoTaAnh:oldH?.MoTaAnh??null})
   }
   for(const [language,t]of Object.entries(record.content)){
    if(!t)continue
    const oldN=oldContents.find(n=>n.MaBanDiTich===bid&&n.MaNgonNgu===language),nid=oldN?.MaNoiDung??await nextCode(executor,'ND','SeqNoiDung')
    await insert('NoiDungDiTich',{MaNoiDung:nid,MaBanDiTich:bid,MaNgonNgu:language,PhienBanNoiDung:t.version,TenDiTich:t.title,TomTat:t.summary,BaiThuyetMinh:t.body,DiaChi:t.address,TrangThaiNoiDung:t.status,
     ThoiDiemDuyet:t.approvedAt?new Date(t.approvedAt):null,ThoiDiemCongBo:t.publishedAt?new Date(t.publishedAt):null,HinhThucBienSoan:t.adaptation})
    if(t.audio){const a=t.audio,file=media.find(m=>m.MaBamTep===a.url.slice(6));if(!file)throw Error('missing_sql_media');const oldA=oldAudios.find(a=>a.MaNoiDung===nid)
     await insert('BanThuThuyetMinh',{MaBanThu:oldA?.MaBanThu??await nextCode(executor,'BT','SeqBanThu'),MaNoiDung:nid,PhienBanNoiDung:t.version,PhienBanBanThu:a.version,TrangThaiBanThu:a.status,MaTep:file.MaTep,ThoiDiemDuyet:a.approvedAt?new Date(a.approvedAt):null,ThoiDiemCongBo:a.publishedAt?new Date(a.publishedAt):null})}
    for(let i=0;i<(t.sources?.length??0);i++){const s=t.sources[i],oldS=oldSources.find(s=>s.MaNoiDung===nid&&s.ThuTuHienThi===i)
     await insert('NguonThamKhao',{MaNguon:oldS?.MaNguon??await nextCode(executor,'NTK','SeqNguon'),MaNoiDung:nid,ThuTuHienThi:i,TenTaiLieu:s.title,DuongDan:s.url,NgayTruyCap:new Date(s.accessedAt),GiayPhep:s.license||null,DuongDanGiayPhep:s.licenseUrl||null})}
   }
  }
 }
 // Nhật ký là lịch sử bền vững: không xóa mục cũ khi service chỉ trả tối đa 100 mục.
 const signatures=new Set(oldHistory.map(h=>JSON.stringify([stamp(h.ThoiDiemThaoTac),h.HanhDong,h.MaDiTichGoc,h.PhienBanDiTich])))
 for(const a of doc.audit){const id=ids.get(a.placeId)??sqlPlaceId(a.placeId),sig=JSON.stringify([a.at,a.action,id,a.revision]);if(signatures.has(sig))continue
  await insert('LichSuKiemDuyet',{MaLichSu:await nextCode(executor,'LS','SeqLichSu'),MaDiTichGoc:id,MaDiTichLienKet:null,HanhDong:a.action,PhienBanDiTich:a.revision,GhiChu:['approve','requestChanges'].includes(a.action)?doc.places.find(p=>p.id===a.placeId)?.reviewNote??null:null,ThoiDiemThaoTac:new Date(a.at)});signatures.add(sig)}
 await rows(executor,'UPDATE h SET MaDiTichLienKet=h.MaDiTichGoc FROM dbo.LichSuKiemDuyet h JOIN dbo.DiTich p ON p.MaDiTich=h.MaDiTichGoc')
 for(const [id,state]of desired)await rows(executor,'UPDATE dbo.DiTich SET TrangThaiXuLy=@state WHERE MaDiTich=@id',{id,state})
 const maximum=Math.max(0,...[...ids.values()].map(id=>Number(id.slice(2))))
 const used=(await rows(executor,"SELECT last_used_value AS n FROM sys.sequences WHERE name=N'SeqDiTich'")).recordset[0]?.n
 if(maximum>Number(used??0))await rows(executor,`ALTER SEQUENCE dbo.SeqDiTich RESTART WITH ${maximum};SELECT NEXT VALUE FOR dbo.SeqDiTich AS n`)
}
module.exports={readDocument,writeDocument,nextCode,rows}
