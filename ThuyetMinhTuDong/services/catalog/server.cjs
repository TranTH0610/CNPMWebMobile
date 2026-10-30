/**
 * FILE NÀY LÀM GÌ
 * Mock HTTP API cổng 8788: chia sẻ nội dung admin, danh mục công bố, audio, phiên bản và lượt mở
 * QR trong SQL Server.
 *
 * VỊ TRÍ: services/catalog/server.cjs
 * DÙNG BỞI: services/catalog/catalog.test.cjs.
 * PHỤ THUỘC: node:http; node:path; node:fs; node:module; node:crypto; ./narration.cjs
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
 * lớp kết nối này.
 */
// Khai báo http: require nạp module 'node:http' để dùng chức năng có sẵn thay vì chép lại.
const http=require('node:http')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path=require('node:path')
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs=require('node:fs')
// Khai báo {createRequire}: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const {createRequire}=require('node:module')
// Khai báo {randomUUID}: require nạp module 'node:crypto' để dùng chức năng có sẵn thay vì chép lại.
const {randomUUID}=require('node:crypto')
// Khai báo {prepareNarration,sendAudio}: require nạp module './narration.cjs' để dùng chức năng có sẵn thay vì chép lại.
const {prepareNarration}=require('./narration.cjs')
const {sendMedia}=require('./media.cjs')
const mediaStore=require('../database/media-store.cjs')
// Kết nối kho SQL dùng chung; không tạo Map/Set lưu nghiệp vụ trong tiến trình API.
const {createSqlRepository}=require('../database/repository.cjs')
// Khai báo root: Gọi path.resolve(__dirname,'../..').
const root=path.resolve(__dirname,'../..')
// CHỨC NĂNG: Chạy đúng logic TypeScript đang dùng ở FE, tránh chép đôi workflow.
// Khai báo loadCore(). Nhận đầu vào qua tham số. | Khai báo runtime: Gọi path.join(root,'.runtime'). | Thực hiện Gọi fs.mkdirSync(runtime,{recursive:true}). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Khai báo req: Gọi createRequire(path.join(root,'apps/web/package.json')). | Thực hiện Gọi req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/index.ts')]. | Gán thuộc tính entryPoints: tạo mảng [path.join(root,'packages/admin-core/src/index.ts')]. | Gán thuộc tính bundle: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính platform: chuỗi 'node'. | Gán thuộc tính format: chuỗi 'cjs'. | Gán thuộc tính outfile: Gọi path.join(runtime,'admin-core.cjs'). | Trả kết quả: require nạp module path.join(runtime,'admin-core.cjs') để dùng chức năng có sẵn thay vì chép lại.
function loadCore(){const runtime=path.join(root,'.runtime');fs.mkdirSync(runtime,{recursive:true});const req=createRequire(path.join(root,'apps/web/package.json'));req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/index.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(runtime,'admin-core.cjs')});return require(path.join(runtime,'admin-core.cjs'))}
// TẠI SAO (loadCore): Dùng lại cùng nghiệp vụ admin-core tránh có hai quy trình quản trị lệch
// nhau giữa mock API và FE.
// CHỨC NĂNG: Tạo mock API nội dung dùng chung giữa web và mobile.
// XỬ LÝ: Giữ một service quản trị trong tiến trình; lệnh sửa phải qua kiểm tra đầu vào và
// revision.
// Khai báo createCatalogServer({now=Date.now,origins=['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:5174','http://localhost:5174'],core=loadCore(),prepareAudio=prepareNarration,initialDocument=null,initialGate=null}). Nhận đầu vào qua tham số.
function createCatalogServer({now=Date.now,origins=['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:5174','http://localhost:5174'],core=loadCore(),prepareAudio=prepareNarration,initialDocument=null,initialGate=null,scope='main',repository=createSqlRepository({now,scope})}={}){
 // CHỨC NĂNG: Mỗi request đọc SQL trong transaction; cache tạm chỉ sống trong request.
 // TẠI SAO: Dùng lại nghiệp vụ duyệt/công bố nhưng không giữ dữ liệu chính trong RAM.
 const instance=randomUUID()
 async function run(action){
   return repository.catalog(async storage=>{
     let service=core.createMockAdminService(storage,prepareAudio)
     if(await storage.read()===null){
       await storage.write(JSON.stringify(initialDocument??await service.load()))
       // Đọc lại bản đã chuẩn hóa media, không trả cache seed còn photo:/narration:.
       service=core.createMockAdminService(storage,prepareAudio)
     }
     return action(service)
   })
 }
 // Chỉ nhập số tổng từ phiên cũ một lần; SQL vẫn giữ lịch sử các ngày trước.
 let imported=false
 async function importGate(){if(!imported&&initialGate){await repository.importGate(initialGate);imported=true}}
 // Khai báo str: khai báo callback x=>typeof x==='string'.
 const str=x=>typeof x==='string',rev=x=>Number.isSafeInteger(x)&&x>=1
 // Khai báo langs: tạo mảng ['vi','en','cn','pt','ja'].
 const langs=['vi','en','cn','pt','ja'],categories=['palace','gate','temple','tomb','museum','monument']
 // CHỨC NĂNG: Kiểm tra tên lệnh và đối số quản trị gửi lên.
 // XỬ LÝ: Chỉ chuyển tiếp cấu trúc được cho phép trước khi gọi service nghiệp vụ.
 // Khai báo valid(action, a). Nhận đầu vào qua tham số.
 function valid(action,a){
  // Rẽ nhánh nếu !Array.isArray(a). | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
  if(!Array.isArray(a))return false
  // Rẽ nhánh nếu action==='savePlace'. | Khai báo x: đọc a[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Trả kết quả: tính biểu thức a.length===1&&x&&['title','period','lat','lng'].every(k=>str(x[k]))&&categories.includes(x.
  if(action==='savePlace'){const x=a[0];return a.length===1&&x&&['title','period','lat','lng'].every(k=>str(x[k]))&&categories.includes(x.category)&&typeof x.verified==='boolean'&&Array.isArray(x.images)&&x.images.length<=20&&x.images.every(str)&&(x.id===undefined||(str(x.id)&&rev(x.expectedRevision)))}
  // Rẽ nhánh nếu action==='saveContent'. | Khai báo x: đọc a[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Trả kết quả: tính biểu thức a.length===1&&x&&['id','title','summary','address','body'].every(k=>str(x[k]))&&langs.incl.
  if(action==='saveContent'){const x=a[0];return a.length===1&&x&&['id','title','summary','address','body'].every(k=>str(x[k]))&&langs.includes(x.language)&&rev(x.expectedRevision)&&(x.audioUrl===undefined||str(x.audioUrl))}
  // Rẽ nhánh nếu ['translate','generateAudio'].includes(action). | Trả kết quả: tính biểu thức a.length===3&&str(a[0])&&langs.includes(a[1])&&rev(a[2]).
  if(['translate','generateAudio'].includes(action))return a.length===3&&str(a[0])&&langs.includes(a[1])&&rev(a[2])
  // Rẽ nhánh nếu action==='review'. | Trả kết quả: tính biểu thức a.length===4&&str(a[0])&&rev(a[1])&&typeof a[2]==='boolean'&&str(a[3]).
  if(action==='review')return a.length===4&&str(a[0])&&rev(a[1])&&typeof a[2]==='boolean'&&str(a[3])
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return ['submit','publish','archive','deletePlace'].includes(action)&&a.length===2&&s`: Trả kết quả: tính biểu thức ['submit','publish','archive','deletePlace'].includes(action)&&a.length===2&&str(a[0])&&re.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return ['submit','publish','archive','deletePlace'].includes(action)&&a.length===2&&str(a[0])&&rev(a[1])
 }
 // TẠI SAO (valid): Tên lệnh hoặc đối số từ client không được tin ngay trước khi gọi phương thức
 // service.
 // CHỨC NĂNG: Đọc body JSON của lệnh quản trị.
 // XỬ LÝ: Kiểm tra Content-Type và kích thước để body sai/quá lớn không làm đầy bộ nhớ.
 // Khai báo json(req). Nhận đầu vào qua tham số. | Rẽ nhánh nếu !String(req.headers['content-type']||'').startsWith('application/json'). | Ném Error('invalid'). | Khai báo chunks: tạo mảng []. | Khai báo size: giá trị số 0. | Duyệt lần lượt req bằng const chunk. | Thực hiện tính biểu thức size+=chunk.length. | Rẽ nhánh nếu size>8*1024*1024. | Thực hiện Gọi chunks.push(chunk). | Trả kết quả: JSON.parse chuyển chuỗi sang dữ liệu.
 async function json(req){if(!String(req.headers['content-type']||'').startsWith('application/json'))throw Error('invalid');const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>8*1024*1024)throw Error('invalid');chunks.push(chunk)}return JSON.parse(Buffer.concat(chunks).toString('utf8'))}
 // TẠI SAO (json): Body quá lớn hoặc sai Content-Type cần bị chặn trước khi xử lý để tránh dùng
 // RAM vô hạn.
 // Khai báo server: Gọi http.createServer(async(req,res)=>{ res.setHeader('Content-Type','application/json.
 const server=http.createServer(async(req,res)=>{
  // Đặt header phản hồi: res.setHeader('Content-Type','application/json. | Đặt header phản hồi: res.setHeader('Cache-Control','no-store'). | Đặt header phản hồi: res.setHeader('X-Content-Type-Options','nosniff').
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')
  // Khai báo reply: khai báo callback (status,value)=>{res.statusCode=status. | Thực hiện tính biểu thức res.statusCode=status. | Thực hiện Gọi res.end(JSON.stringify(value)).
  const reply=(status,value)=>{res.statusCode=status;res.end(JSON.stringify(value))}
  // TẠI SAO (reply): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
  // lớp kết nối này.
  // Khai báo origin: đọc req.headers.origin từ đối tượng/mảng để dùng tại bước hiện tại.
  const origin=req.headers.origin
  // Rẽ nhánh nếu origin&&!origins.includes(origin). | Trả kết quả: Gọi reply(403,{error:'invalid'}). | Gán thuộc tính error: chuỗi 'invalid'.
  if(origin&&!origins.includes(origin))return reply(403,{error:'invalid'})
  // Rẽ nhánh nếu origin. | Đặt header phản hồi: res.setHeader('Access-Control-Allow-Origin',origin). | Đặt header phản hồi: res.setHeader('Vary','Origin').
  if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}
  // Rẽ nhánh nếu req.method==='OPTIONS'. | Đặt header phản hồi: res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS'). | Đặt header phản hồi: res.setHeader('Access-Control-Allow-Headers','Content-Type, Range'). | Thực hiện tính biểu thức res.statusCode=204. | Trả kết quả: Gọi res.end().
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Range');res.statusCode=204;return res.end()}
  // Khai báo pathname: đọc (req.url||'').split('?')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
  const pathname=(req.url||'').split('?')[0]
  // Bắt đầu vùng try.
  try{
   // Rẽ nhánh nếu req.method==='GET'.
   if(req.method==='GET'||req.method==='HEAD'){
    // Ảnh và âm thanh đều đọc byte từ SQL; preview/công bố được kiểm tra riêng.
    const media=/^\/media\/(published|preview)\/([a-f0-9]{64})$/.exec(pathname)
    const audio=/^\/audio\/(published|preview)\/([a-f0-9]{64})\.mp3$/.exec(pathname)
    const photo=/^\/images\/(published|preview)\/([a-z0-9-]+)\.jpg$/.exec(pathname)
    if(media||audio||photo){
      const match=media||audio||photo
      const id=media?media[2]:await mediaStore.alias((audio?'narration:':'photo:')+match[2])
      await sendMedia(req,res,{id,scope,preview:match[1]==='preview'});return
    }
    // CHỨC NĂNG: Admin mobile đọc cùng thống kê SQL 8787 qua cổng LAN 8788.
    // XỬ LÝ: Chỉ chuyển tiếp GET thống kê; không nhân đôi kho phiên đang hoạt động.
    // Rẽ nhánh nếu pathname==='/presence/statistics/active'.
    if(pathname==='/presence/statistics/active'){
      // Khai báo response: await chờ fetch gửi HTTP request. | Gán thuộc tính signal: Gọi AbortSignal.timeout(5000).
      const response=await fetch((process.env.PRESENCE_TARGET||'http://127.0.0.1:8787')+'/statistics/active',{signal:AbortSignal.timeout(5000)})
      // Rẽ nhánh nếu !response.ok. | Trả kết quả: Gọi reply(503,{error:'loadError'}). | Gán thuộc tính error: chuỗi 'loadError'.
      if(!response.ok)return reply(503,{error:'loadError'})
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return reply(200,await response.json())`: Trả kết quả: Gọi reply(200,await response.json()).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return reply(200,await response.json())
    }
    // Rẽ nhánh nếu pathname==='/version'. | Trả kết quả: Gọi reply(200,{version:instance+':'+version}). | Gán thuộc tính version: tính biểu thức instance+':'+version.
    if(pathname==='/version')return reply(200,{version:instance+':'+await repository.version(),storage:'sqlserver'})
    // Rẽ nhánh nếu pathname==='/document'. | Trả kết quả: Gọi reply(200,await run(service=>service.load())).
    if(pathname==='/document')return reply(200,await run(service=>service.load()))
    // Rẽ nhánh nếu pathname==='/identity'. | Trả kết quả: Gọi reply(200,await run(service=>service.identity())).
    if(pathname==='/identity')return reply(200,await run(service=>service.identity()))
    // Rẽ nhánh nếu pathname==='/published'. | Trả kết quả: Gọi reply(200,await run(service=>service.published())).
    if(pathname==='/published')return reply(200,await run(service=>service.published()))
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if(pathname==='/gate/statistics'){await importGate();return reply(200,await repository.gateStatistics())}`: Rẽ nhánh nếu pathname==='/gate/statistics'. | Trả kết quả: Gọi reply(200,gate()).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if(pathname==='/gate/statistics'){await importGate();return reply(200,await repository.gateStatistics())}
   }
   // Rẽ nhánh nếu req.method==='POST'&&pathname==='/commands'.
   if(req.method==='POST'&&pathname==='/commands'){
    // Khai báo body: await chờ Gọi json(req).
    const body=await json(req)
    // Rẽ nhánh nếu !body||!valid(body.action,body.args). | Trả kết quả: Gọi reply(400,{error:'invalid'}). | Gán thuộc tính error: chuỗi 'invalid'.
    if(!body||!valid(body.action,body.args))return reply(400,{error:'invalid'})
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `await run(service=>service[body.action](...body.args));return reply(200,{ok:true})`: Thực hiện await chờ Gọi service[body.action](...body.args). | Trả kết quả: Gọi reply(200,{ok:true}). | Gán thuộc tính ok: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    await run(service=>service[body.action](...body.args));return reply(200,{ok:true})
   }
   // Rẽ nhánh nếu req.method==='POST'&&pathname==='/gate/entry'.
   if(req.method==='POST'&&pathname==='/gate/entry'){
    // Khai báo body: await chờ Gọi json(req).
    const body=await json(req)
    // Rẽ nhánh nếu !body||!str(body.visitId)||!/^[-_a-zA-Z0-9]{20,100}$/.test(body.visitId)||!['web','mobile-app'].includes(body. | Trả kết quả: Gọi reply(400,{error:'invalid'}). | Gán thuộc tính error: chuỗi 'invalid'.
    if(!body||!str(body.visitId)||!/^[-_a-zA-Z0-9]{20,100}$/.test(body.visitId)||!['web','mobile-app'].includes(body.platform))return reply(400,{error:'invalid'})
    // Khóa ghép SQL (ngày, mã lượt) chặn đếm lại sau restart hoặc request đồng thời.
    await importGate();await repository.gateEntry(body.visitId,body.platform)
    return reply(200,{ok:true})
   }
   /* GIẢI THÍCH TỪNG DÒNG:
    * DÒNG `reply(404,{error:'notFound'})`: Thực hiện Gọi reply(404,{error:'notFound'}). | Gán thuộc tính error: chuỗi 'notFound'.
    * DÒNG `}catch(error){const code=error instanceof core.AdminError?error.code:'invalid';reply(`: Bắt đầu vùng try. | Khai báo code: chọn giữa hai giá trị theo điều kiện error instanceof core.AdminError. | Thực hiện Gọi reply(code==='conflict'?409:code==='notFound'?404:code==='saveError'?503:400,{error:code}). | Gán thuộc tính error: sử dụng code làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    */
   reply(404,{error:'notFound'})
  }catch(error){const code=error instanceof core.AdminError?error.code:error instanceof SyntaxError||error.message==='invalid'?'invalid':error.message==='capacity'?'saveError':'loadError';reply(code==='conflict'?409:code==='notFound'?404:['saveError','loadError'].includes(code)?503:400,{error:code})}
 })
 // Thực hiện tính biểu thức server.requestTimeout=15000. | Thực hiện tính biểu thức server.headersTimeout=15000.
 server.requestTimeout=15000;server.headersTimeout=15000
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return server`: Trả kết quả: sử dụng server làm giá trị của bước hiện tại.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return server
}
// TẠI SAO (createCatalogServer): Web và mobile phải sửa/đọc cùng tài liệu; tạo kho riêng cho mỗi
// giao diện sẽ mất đồng bộ.
// Rẽ nhánh nếu require.main===module. | Khai báo server: Gọi createCatalogServer({initialDocument:process.env.CATALOG_IMPORT_DOCUMENT?JSON.parse(fs.rea. | Gán thuộc tính initialDocument: chọn giữa hai giá trị theo điều kiện process.env.CATALOG_IMPORT_DOCUMENT. | Gán thuộc tính initialGate: chọn giữa hai giá trị theo điều kiện process.env.CATALOG_IMPORT_GATE. | Gán thuộc tính origins: Gọi (process.env.CATALOG_ORIGINS||'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0. | Khai báo host: tính biểu thức process.env.CATALOG_HOST||'127.0.0.1'. | Thực hiện Gọi server.listen(port,host,()=>console.log(`Catalog SQL Server: http://${host}:${port}`)). | Đăng ký xử lý sự kiện: server.on('error',error=>{console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode=1.
if(require.main===module){const server=createCatalogServer({initialDocument:process.env.CATALOG_IMPORT_DOCUMENT?JSON.parse(fs.readFileSync(process.env.CATALOG_IMPORT_DOCUMENT,'utf8')):null,initialGate:process.env.CATALOG_IMPORT_GATE?JSON.parse(fs.readFileSync(process.env.CATALOG_IMPORT_GATE,'utf8')):null,origins:(process.env.CATALOG_ORIGINS||'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',')});const host=process.env.CATALOG_HOST||'127.0.0.1',port=Number(process.env.CATALOG_PORT||8788);server.listen(port,host,()=>console.log(`Catalog SQL Server: http://${host}:${port}`));server.on('error',error=>{console.error(error.message);process.exitCode=1})}
// Thực hiện tính biểu thức module.exports={createCatalogServer}. | Đặt trường createCatalogServer bằng giá trị của biến cùng tên.
module.exports={createCatalogServer}
/* CÁCH KIỂM TRA: Hai HTTP client sửa cùng revision chỉ một thành công; public không lộ nháp; refresh QR không tăng lượt; restart vẫn giữ dữ liệu trong SQL Server. */
