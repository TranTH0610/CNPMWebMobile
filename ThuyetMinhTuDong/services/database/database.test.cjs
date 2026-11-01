/** FILE NÀY LÀM GÌ: Test SQL thật trên database riêng, không sửa HueGuideDemo.
 * Kiểm tra PK/FK/UNIQUE/CHECK, sai phiên bản, công bố sai, xóa hẳn và rollback.
 */
const {test,after}=require('node:test'),assert=require('node:assert/strict')
const {connect,close}=require('./connection.cjs')
const {testRepository}=require('./test-support.cjs')
const {comparable}=require('./migrate11.cjs')
const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path')
after(close)
const audio=Buffer.from('ID3-unit-audio-11-tables')
function fixture(){
 const t={title:'Ngọ Môn 中文 日本語 Português',summary:'Giới thiệu',body:'Bài thuyết minh có dấu. '.repeat(300),address:'Huế',version:2,status:'draft',sources:[{title:'Tư liệu',url:'https://example.org/source',accessedAt:'2026-10-28',license:'CC BY-SA 4.0',licenseUrl:'https://example.org/license'}],audio:{id:'audio-vi',url:'data:audio/mpeg;base64,'+audio.toString('base64'),version:1,status:'draft'}}
 const r={id:'ngo-mon',scope:'hue-citadel',inLaunchCatalog:true,status:'draft',canonicalTitle:'Ngọ Môn',zone:'fortifications',category:'gate',period:'1833',featured:false,images:['photo:ngo-mon'],content:{vi:t}}
 const pub=structuredClone(r);pub.status='published';pub.content.vi.status='published';pub.content.vi.approvedAt='2026-10-28T00:00:00Z';pub.content.vi.publishedAt='2026-10-28T01:00:00Z';Object.assign(pub.content.vi.audio,{status:'published',approvedAt:'2026-10-28T00:00:00Z',publishedAt:'2026-10-28T01:00:00Z'})
 return{schema:1,places:[{id:'ngo-mon',record:r,published:pub,period:'1833',revision:2,workflow:'draft',reviewNote:'',updatedAt:'2026-10-28T01:00:00Z'}],sessions:[],audit:[]}
}
async function save(repository,doc){return repository.catalog(s=>s.write(JSON.stringify(doc)))}
async function load(repository){return JSON.parse(await repository.catalog(s=>s.read()))}
function expected(doc){const d=structuredClone(doc);for(const p of d.places)for(const r of [p.record,p.published])if(r){r.images=r.images.map(()=> 'media:'+crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../../apps/web/static/images/places/ngo-mon.jpg'))).digest('hex'));for(const t of Object.values(r.content))if(t.audio)t.audio.url='media:'+crypto.createHash('sha256').update(audio).digest('hex')}return comparable(d)}

test('Đúng 11 bảng; Unicode/nội dung dài/nguồn/byte media giữ qua kết nối lại',async t=>{
 const{scope,repository}=testRepository(t);await save(repository,fixture());await close(scope)
 assert.deepStrictEqual(comparable(await load(repository)),expected(fixture()))
 const{pool}=await connect(scope),result=await pool.request().query("SELECT COUNT(*) AS total FROM sys.tables WHERE schema_id=SCHEMA_ID(N'dbo')")
 assert.equal(result.recordset[0].total,11)
})

test('PK/FK/UNIQUE/CHECK và trigger chặn dữ liệu sai; không làm hỏng bản hợp lệ',async t=>{
 const{scope,repository}=testRepository(t);await save(repository,fixture());const{pool}=await connect(scope)
 const before=await load(repository)
 const invalid=[
  "INSERT dbo.DiTich SELECT MaDiTich,ThuTuHienThi,PhienBanChinhSua,TrangThaiXuLy,GhiChuKiemDuyet,PhienBanDaDuyet,ThoiDiemTao,ThoiDiemCapNhat FROM dbo.DiTich",
  "INSERT dbo.HinhAnhDiTich(MaBanDiTich,MaTep,ThuTuHienThi) SELECT 'BDT999999',MaTep,0 FROM dbo.TepTaiNguyen WHERE LoaiTep='image'",
  "UPDATE dbo.BanDiTich SET ViDo=16 WHERE LoaiBan='draft'",
  "UPDATE dbo.BanDiTich SET MaDanhMuc='DM999' WHERE LoaiBan='draft'",
  "UPDATE dbo.NoiDungDiTich SET MaNgonNgu=N'xx'",
  "UPDATE dbo.NoiDungDiTich SET PhienBanNoiDung=-1",
  "UPDATE dbo.BanThuThuyetMinh SET PhienBanNoiDung=999",
  "UPDATE dbo.DiTich SET TrangThaiXuLy='published',PhienBanDaDuyet=NULL",
  "INSERT dbo.DiTich(MaDiTich,ThuTuHienThi,PhienBanChinhSua,TrangThaiXuLy,PhienBanDaDuyet) VALUES('DT999',9,1,'published',1)",
  "UPDATE dbo.NoiDungDiTich SET ThoiDiemDuyet=NULL WHERE TrangThaiNoiDung='published'",
  "UPDATE dbo.BanThuThuyetMinh SET MaTep=(SELECT TOP(1) MaTep FROM dbo.TepTaiNguyen WHERE LoaiTep='image')",
  "UPDATE dbo.HinhAnhDiTich SET MaTep=(SELECT TOP(1) MaTep FROM dbo.TepTaiNguyen WHERE LoaiTep='audio')",
  "UPDATE dbo.TepTaiNguyen SET DinhDangTep='audio/ogg' WHERE LoaiTep='image'",
  "UPDATE dbo.TepTaiNguyen SET DinhDangTep=DinhDangTep",
  "DELETE dbo.DiTich",
 ]
 const expectedErrors=[2627,547,547,547,547,547,547,547,51015,547,51012,51011,547,51014,547]
 for(let i=0;i<invalid.length;i++)await t.test('Chặn trường hợp '+(i+1),async()=>{await assert.rejects(pool.request().query(invalid[i]),error=>error.number===expectedErrors[i]);assert.deepStrictEqual(await load(repository),before)})
})

test('Xóa hẳn: xóa hồ sơ và con, giữ nhật ký; tệp dùng chung không bị xóa; mã không cấp lại',async t=>{
 const{scope,repository}=testRepository(t),doc=fixture()
 const second=structuredClone(doc.places[0]);second.id='DT010';second.record.id='DT010';second.published.id='DT010';doc.places.push(second)
 await save(repository,doc)
 const next=await load(repository);next.places=next.places.filter(p=>p.id!=='ngo-mon');next.audit.unshift({at:'2026-10-31T03:00:00Z',action:'deletePlace',placeId:'ngo-mon',revision:2});await save(repository,next)
 const{pool}=await connect(scope),r=await pool.request().query("SELECT COUNT(*) AS n FROM dbo.DiTich WHERE MaDiTich='DT002';SELECT * FROM dbo.LichSuKiemDuyet;SELECT COUNT(*) AS n FROM dbo.TepTaiNguyen;SELECT COUNT(*) AS n FROM dbo.BanDiTich WHERE MaDiTich='DT002'")
 assert.equal(r.recordsets[0][0].n,0);assert.equal(r.recordsets[3][0].n,0)
 assert.equal(r.recordsets[1][0].MaDiTichGoc,'DT002');assert.equal(r.recordsets[1][0].MaDiTichLienKet,null)
 assert.equal(r.recordsets[2][0].n,2)
 const added=await load(repository),p=structuredClone(added.places[0]);p.id='place-new';p.record.id=p.id;p.published=undefined;added.places.push(p);await save(repository,added)
 const ids=(await load(repository)).places.map(p=>p.id)
 assert.ok(ids.includes('DT011'));assert.ok(!ids.includes('ngo-mon'))
})

test('Rollback hoàn toàn nếu lỗi sau khi ghi',async t=>{
 const{repository}=testRepository(t);await save(repository,fixture());const before=await load(repository)
 await assert.rejects(repository.catalog(async storage=>{const next=structuredClone(before);next.places=[];await storage.write(JSON.stringify(next));throw Error('rollback_test')}),/rollback_test/)
 assert.deepStrictEqual(await load(repository),before)
})

test('QR chống trùng đồng thời, giữ tổng cũ và lịch sử ngày trước',async t=>{
 let clock=Date.parse('2026-10-23T16:59:00Z');const{scope,repository}=testRepository(t,{now:()=>clock})
 await repository.importGate({day:'2026-10-23',today:9})
 const visitId='gate_test_123456789012345'
 await Promise.all(Array.from({length:5},()=>repository.gateEntry(visitId,'web')))
 assert.equal((await repository.gateStatistics()).today,10)
 clock+=120000;assert.equal((await repository.gateStatistics()).today,0);await repository.gateEntry(visitId,'web')
 const{pool}=await connect(scope);assert.equal((await pool.request().query('SELECT SUM(SoLuot) AS n FROM dbo.LuotTruyCapQR')).recordset[0].n,11)
})

test('Phiên SQL có TTL, chặn đổi nền tảng và lưu đúng datetime UTC',async t=>{
 let clock=Date.parse('2026-10-31T03:00:00Z');const{repository}=testRepository(t,{now:()=>clock})
 const sessionId='session_test_123456789012345';await repository.heartbeat({sessionId,platform:'web'})
 assert.equal((await repository.snapshot()).active,1)
 await assert.rejects(repository.heartbeat({sessionId,platform:'mobile-app'}),/platform_conflict/)
 clock+=90000;assert.equal((await repository.snapshot()).active,0)
})

test('Mã tự sinh đúng định dạng và LoaiTep không được nhập/sửa độc lập',async t=>{
 const{scope,repository}=testRepository(t);await save(repository,fixture());const{pool}=await connect(scope)
 const r=await pool.request().query('SELECT MaTep,LoaiTep,DinhDangTep,DungLuongByte FROM dbo.TepTaiNguyen')
 for(const f of r.recordset){assert.match(f.MaTep,/^TEP\d{3,}$/);assert.equal(f.LoaiTep,f.DinhDangTep.split('/')[0]);assert.ok(f.DungLuongByte>0)}
 await assert.rejects(pool.request().query("UPDATE dbo.TepTaiNguyen SET LoaiTep='audio'"))
})

test('Xóa hết danh mục không tự nạp lại di tích mẫu',async t=>{
 const {repository}=testRepository(t);await save(repository,fixture())
 const next=await load(repository);next.places=[]
 next.audit=[{at:'2026-10-31T04:00:00Z',action:'deletePlace',placeId:'ngo-mon',revision:2}]
 await save(repository,next)
 const read=await load(repository);assert.deepEqual(read.places,[]);assert.equal(read.audit[0].action,'deletePlace')
})
