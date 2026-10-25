/**
 * FILE NÀY LÀM GÌ: Mock API RAM dùng chung nội dung Admin và danh mục công bố.
 * npm run catalog:start gọi; dùng lại admin-core qua esbuild đã có trong monorepo.
 * UC12–UC17. Kho chỉ tồn tại trong tiến trình; thay StoragePort bằng DB ở giai đoạn sau.
 */
const http=require('node:http')
const path=require('node:path')
const fs=require('node:fs')
const {createRequire}=require('node:module')
const {randomUUID}=require('node:crypto')
const {prepareNarration,sendAudio}=require('./narration.cjs')
const root=path.resolve(__dirname,'../..')
// CHỨC NĂNG: Chạy đúng logic TypeScript đang dùng ở FE, tránh chép đôi workflow.
function loadCore(){const runtime=path.join(root,'.runtime');fs.mkdirSync(runtime,{recursive:true});const req=createRequire(path.join(root,'apps/web/package.json'));req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/index.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(runtime,'admin-core.cjs')});return require(path.join(runtime,'admin-core.cjs'))}
function createCatalogServer({now=Date.now,origins=['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:5174','http://localhost:5174'],core=loadCore(),prepareAudio=prepareNarration,initialDocument=null,initialGate=null}={}){
 let raw=initialDocument?JSON.stringify(initialDocument):null,version=0,day=initialGate?.day||'',visits=new Set(),carried=initialGate?.today||0
 const instance=randomUUID()
 // CHỨC NĂNG: Một instance service duy nhất; mutate của service xếp hàng ghi và kiểm tra revision.
 // XỬ LÝ: Giới hạn kho 32MB, body 8MB; không có endpoint reset hay ghi nguyên document từ client.
 const service=core.createMockAdminService({read:async()=>raw,write:async value=>{if(Buffer.byteLength(value)>32*1024*1024)throw Error('capacity');raw=value}},prepareAudio)
 service.subscribe(()=>{version++})
 const dayOf=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now()))
 const gate=()=>{const current=dayOf();if(day!==current){day=current;visits=new Set();carried=0}return{today:carried+visits.size,day}}
 const str=x=>typeof x==='string',rev=x=>Number.isSafeInteger(x)&&x>=1
 const langs=['vi','en','cn','pt','ja'],categories=['palace','gate','temple','tomb','museum','monument']
 function valid(action,a){
  if(!Array.isArray(a))return false
  if(action==='savePlace'){const x=a[0];return a.length===1&&x&&['title','period','lat','lng'].every(k=>str(x[k]))&&categories.includes(x.category)&&typeof x.verified==='boolean'&&Array.isArray(x.images)&&x.images.length<=20&&x.images.every(str)&&(x.id===undefined||(str(x.id)&&rev(x.expectedRevision)))}
  if(action==='saveContent'){const x=a[0];return a.length===1&&x&&['id','title','summary','address','body'].every(k=>str(x[k]))&&langs.includes(x.language)&&rev(x.expectedRevision)&&(x.audioUrl===undefined||str(x.audioUrl))}
  if(['translate','generateAudio'].includes(action))return a.length===3&&str(a[0])&&langs.includes(a[1])&&rev(a[2])
  if(action==='review')return a.length===4&&str(a[0])&&rev(a[1])&&typeof a[2]==='boolean'&&str(a[3])
  return ['submit','publish','archive','deletePlace'].includes(action)&&a.length===2&&str(a[0])&&rev(a[1])
 }
 async function json(req){if(!String(req.headers['content-type']||'').startsWith('application/json'))throw Error('invalid');const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>8*1024*1024)throw Error('invalid');chunks.push(chunk)}return JSON.parse(Buffer.concat(chunks).toString('utf8'))}
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')
  const reply=(status,value)=>{res.statusCode=status;res.end(JSON.stringify(value))}
  const origin=req.headers.origin
  if(origin&&!origins.includes(origin))return reply(403,{error:'invalid'})
  if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.statusCode=204;return res.end()}
  const pathname=(req.url||'').split('?')[0]
  try{
   if(req.method==='GET'){
    // CHỨC NĂNG: Audio công khai chỉ phục vụ bản đã publish; preview dành site Admin.
    const audio=/^\/audio\/(published|preview)\/([a-f0-9]{64})\.mp3$/.exec(pathname)
    if(audio){
      if(audio[1]==='published'){
        const places=await service.published()
        if(!places.some(p=>Object.values(p.content).some(text=>text?.audio?.url==='narration:'+audio[2])))return reply(404,{error:'notFound'})
      }
      return sendAudio(req,res,audio[2])
    }
    // CHỨC NĂNG: Admin mobile đọc cùng thống kê RAM 8787 qua cổng LAN 8788.
    // XỬ LÝ: Chỉ chuyển tiếp GET thống kê; không nhân đôi kho phiên đang hoạt động.
    if(pathname==='/presence/statistics/active'){
      const response=await fetch((process.env.PRESENCE_TARGET||'http://127.0.0.1:8787')+'/statistics/active',{signal:AbortSignal.timeout(5000)})
      if(!response.ok)return reply(503,{error:'loadError'})
      return reply(200,await response.json())
    }
    if(pathname==='/version')return reply(200,{version:instance+':'+version})
    if(pathname==='/document')return reply(200,await service.load())
    if(pathname==='/identity')return reply(200,await service.identity())
    if(pathname==='/published')return reply(200,await service.published())
    if(pathname==='/gate/statistics')return reply(200,gate())
   }
   if(req.method==='POST'&&pathname==='/commands'){
    const body=await json(req)
    if(!body||!valid(body.action,body.args))return reply(400,{error:'invalid'})
    await service[body.action](...body.args);return reply(200,{ok:true})
   }
   if(req.method==='POST'&&pathname==='/gate/entry'){
    const body=await json(req)
    if(!body||!str(body.visitId)||!/^[-_a-zA-Z0-9]{20,100}$/.test(body.visitId)||!['web','mobile-app'].includes(body.platform))return reply(400,{error:'invalid'})
    gate();if(!visits.has(body.visitId)&&visits.size>=50000)return reply(503,{error:'saveError'})
    visits.add(body.visitId);return reply(200,{ok:true})
   }
   reply(404,{error:'notFound'})
  }catch(error){const code=error instanceof core.AdminError?error.code:'invalid';reply(code==='conflict'?409:code==='notFound'?404:code==='saveError'?503:400,{error:code})}
 })
 server.requestTimeout=15000;server.headersTimeout=15000
 return server
}
if(require.main===module){const server=createCatalogServer({initialDocument:process.env.CATALOG_IMPORT_DOCUMENT?JSON.parse(fs.readFileSync(process.env.CATALOG_IMPORT_DOCUMENT,'utf8')):null,initialGate:process.env.CATALOG_IMPORT_GATE?JSON.parse(fs.readFileSync(process.env.CATALOG_IMPORT_GATE,'utf8')):null,origins:(process.env.CATALOG_ORIGINS||'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',')});const host=process.env.CATALOG_HOST||'127.0.0.1',port=Number(process.env.CATALOG_PORT||8788);server.listen(port,host,()=>console.log(`Catalog RAM: http://${host}:${port}`));server.on('error',error=>{console.error(error.message);process.exitCode=1})}
module.exports={createCatalogServer}
/* CÁCH KIỂM TRA: Hai HTTP client sửa cùng revision chỉ một thành công; public không lộ nháp; refresh QR không tăng lượt; restart mất RAM. */
