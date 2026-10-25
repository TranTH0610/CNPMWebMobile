# Toàn bộ code đồng bộ Admin RAM và lượt QR

Đường dẫn tính từ gốc monorepo. Các đoạn chú thích tiếng Việt nằm trong source. Không bao gồm .env thật hoặc dữ liệu RAM.

## 1. TẠO MỚI — services/catalog/server.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\services\catalog\server.cjs

API nội dung chung trong RAM, kiểm tra lệnh và revision; danh mục công bố; bộ đếm QR theo ngày Huế.

```javascript
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
const root=path.resolve(__dirname,'../..')
// CHỨC NĂNG: Chạy đúng logic TypeScript đang dùng ở FE, tránh chép đôi workflow.
function loadCore(){const runtime=path.join(root,'.runtime');fs.mkdirSync(runtime,{recursive:true});const req=createRequire(path.join(root,'apps/web/package.json'));req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/index.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(runtime,'admin-core.cjs')});return require(path.join(runtime,'admin-core.cjs'))}
function createCatalogServer({now=Date.now,origins=['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:5174','http://localhost:5174'],core=loadCore()}={}){
 let raw=null,version=0,day='',visits=new Set()
 const instance=randomUUID()
 // CHỨC NĂNG: Một instance service duy nhất; mutate của service xếp hàng ghi và kiểm tra revision.
 // XỬ LÝ: Giới hạn kho 32MB, body 8MB; không có endpoint reset hay ghi nguyên document từ client.
 const service=core.createMockAdminService({read:async()=>raw,write:async value=>{if(Buffer.byteLength(value)>32*1024*1024)throw Error('capacity');raw=value}})
 service.subscribe(()=>{version++})
 const dayOf=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now()))
 const gate=()=>{const current=dayOf();if(day!==current){day=current;visits=new Set()}return{today:visits.size,day}}
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
if(require.main===module){const server=createCatalogServer({origins:(process.env.CATALOG_ORIGINS||'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',')});const host=process.env.CATALOG_HOST||'127.0.0.1',port=Number(process.env.CATALOG_PORT||8788);server.listen(port,host,()=>console.log(`Catalog RAM: http://${host}:${port}`));server.on('error',error=>{console.error(error.message);process.exitCode=1})}
module.exports={createCatalogServer}
/* CÁCH KIỂM TRA: Hai HTTP client sửa cùng revision chỉ một thành công; public không lộ nháp; refresh QR không tăng lượt; restart mất RAM. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 2. TẠO MỚI — services/catalog/catalog.test.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\services\catalog\catalog.test.cjs

Kiểm thử hai client HTTP, xung đột, không lộ nháp, restart RAM, QR lặp và parser.

```javascript
/** FILE NÀY LÀM GÌ: Test HTTP thật của kho RAM, adapter FE và lượt QR.
 * npm run catalog:test gọi; Node test built-in, cổng ngẫu nhiên, dữ liệu chỉ nằm trong test.
 * UC13–UC17: kiểm tra xung đột, bản công bố, đồng bộ và chống đếm lặp. */
const {test}=require('node:test'),assert=require('node:assert/strict')
const {createCatalogServer}=require('./server.cjs')
async function setup(t,options){const server=createCatalogServer(options);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections()}));return{url:'http://127.0.0.1:'+server.address().port,core:require('../../.runtime/admin-core.cjs')}}
const input=p=>({id:p.id,expectedRevision:p.revision,title:p.record.canonicalTitle+' cập nhật',category:'monument',period:'1802',lat:'',lng:'',verified:false,images:p.record.images})
test('Hai client đọc/ghi chung; phiên bản cũ bị 409 và không ghi đè',async t=>{const {url,core}=await setup(t);const web=core.createHttpAdminService(url),mobile=core.createHttpAdminService(url);const original=(await web.load()).places[0];await web.savePlace(input(original));const changed=(await mobile.load()).places[0];assert.equal(changed.record.canonicalTitle,original.record.canonicalTitle+' cập nhật');await assert.rejects(mobile.savePlace(input(original)),error=>error.code==='conflict');assert.equal((await mobile.load()).places[0].revision,2);assert.equal((await web.published())[0].canonicalTitle,original.record.canonicalTitle)})
test('Poll báo thay đổi giữa hai client và cleanup dừng thông báo',async t=>{const {url,core}=await setup(t);const a=core.createHttpAdminService(url,20),b=core.createHttpAdminService(url);let count=0;const stop=a.subscribe(()=>count++);t.after(stop);await new Promise(r=>setTimeout(r,80));const baseline=count;await b.savePlace(input((await b.load()).places[1]));await new Promise(r=>setTimeout(r,100));assert.ok(count>baseline);stop();const end=count;await b.savePlace(input((await b.load()).places[1]));await new Promise(r=>setTimeout(r,60));assert.equal(count,end)})
test('Hai lệnh cùng revision chỉ một được ghi; API từ chối reset và payload sai',async t=>{const {url,core}=await setup(t);const a=core.createHttpAdminService(url),p=(await a.load()).places[0];const result=await Promise.allSettled([a.savePlace(input(p)),a.savePlace(input(p))]);assert.equal(result.filter(x=>x.status==='fulfilled').length,1);for(const body of [{action:'reset',args:[]},{action:'savePlace',args:[{title:123}]},{action:'constructor',args:[]}]){const response=await fetch(url+'/commands',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(response.status,400)}const denied=await fetch(url+'/document',{headers:{Origin:'https://stranger.example'}});assert.equal(denied.status,403)})
test('QR đếm mỗi phiên/ngày một; ngày Huế đổi thì bộ đếm mới',async t=>{let now=Date.parse('2026-10-23T16:59:00Z');const {url,core}=await setup(t,{now:()=>now});const gate=core.createGateClient(url),id='gate_web_123456789012345';await gate.entry(id,'web');await gate.entry(id,'web');assert.equal((await gate.statistics()).today,1);await gate.entry('gate_app_123456789012345','mobile-app');assert.equal((await gate.statistics()).today,2);now+=120000;assert.equal((await gate.statistics()).today,0);await gate.entry(id,'web');assert.equal((await gate.statistics()).today,1)})
test('Kho RAM độc lập sau restart; mất mạng báo lỗi không trả kho cục bộ',async t=>{const first=await setup(t),client=first.core.createHttpAdminService(first.url),p=(await client.load()).places[0];await client.deletePlace(p.id,p.revision);const second=await setup(t);assert.ok((await second.core.createHttpAdminService(second.url).load()).places.some(x=>x.id===p.id));await assert.rejects(first.core.createHttpAdminService('').load(),error=>error.code==='loadError')})

test('Parser chỉ nhận query entry=gate trên trang chủ',async t=>{await setup(t);const {createRequire}=require('node:module'),path=require('node:path');const req=createRequire(path.resolve('apps/web/package.json'));const out=req('esbuild').buildSync({entryPoints:[path.resolve('packages/visitor-core/src/qr.ts')],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text;const Module=require('node:module');const m=new Module('qr-test');m._compile(out,'qr-test.cjs');const policy={allowedOrigins:['https://guide.test'],allowHttp:false};assert.deepEqual(m.exports.parseQrTarget('https://guide.test/?entry=gate',policy),{kind:'home'});assert.throws(()=>m.exports.parseQrTarget('https://guide.test/?entry=other',policy));assert.throws(()=>m.exports.parseQrTarget('https://guide.test/places/ngo-mon?entry=gate',policy))})
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 3. TẠO MỚI — packages/admin-core/src/httpService.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\httpService.ts

Adapter HTTP và polling phiên bản 3 giây; client thống kê QR và retry chống đếm lặp.

```typescript
/**
 * FILE NÀY LÀM GÌ: Adapter HTTP dùng chung cho web và mobile; thay kho cục bộ bằng server RAM.
 * Service nền tảng gọi; giữ hợp đồng AdminService cho UC12–UC17.
 * Phụ thuộc fetch/AbortController và models; không phụ thuộc React hoặc thiết bị.
 */
import type { AdminService } from './contracts'
import { AdminError, type AdminErrorCode } from './models'
export interface GateStats { today: number; day: string }
export interface GateClient { entry(visitId: string, platform: 'web'|'mobile-app'): Promise<void>; statistics(): Promise<GateStats> }
const errors: readonly AdminErrorCode[] = ['loadError','saveError','invalid','conflict','notFound','notApproved','incomplete','staleJob']
function transport(base: string) {
 return async <T,>(path: string, body?: unknown): Promise<T> => {
  if (!base) throw new AdminError('loadError')
  const controller = new AbortController(), timer = setTimeout(()=>controller.abort(),8000)
  try {
   const response = await fetch(base.replace(/\/$/,'')+path,{method:body===undefined?'GET':'POST',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal})
   const value: unknown = await response.json()
   if (!response.ok) {
    const code = value && typeof value==='object' && 'error' in value ? value.error : null
    throw new AdminError(errors.includes(code as AdminErrorCode)?code as AdminErrorCode:body===undefined?'loadError':'saveError')
   }
   return value as T
  } catch(error) { throw error instanceof AdminError?error:new AdminError(body===undefined?'loadError':'saveError') }
  finally {clearTimeout(timer)}
 }
}
// CHỨC NĂNG: Poll một số phiên bản nhỏ, không tải toàn bộ ảnh base64 mỗi 3 giây.
// XỬ LÝ: Chỉ một timer cho mọi subscriber; hết người nghe thì hủy, không chồng request.
export function createHttpAdminService(base: string, pollMs=3000): AdminService {
 const request=transport(base),listeners=new Set<()=>void>()
 let stopped=true,timer:ReturnType<typeof setTimeout>|undefined,last='',failed=false,generation=0
 const notify=()=>listeners.forEach(listener=>listener())
 async function pulse(run:number) {
  try {const value=await request<{version:string}>('/version');if(run!==generation)return;if(value.version!==last||failed){last=value.version;failed=false;if(!stopped)notify()}}
  catch {if(run!==generation)return;failed=true;if(!stopped)notify()}
  if(!stopped&&run===generation)timer=setTimeout(()=>{void pulse(run)},pollMs)
 }
 async function command(action:string,args:unknown[]) {await request('/commands',{action,args});notify()}
 return {
  identity:()=>request('/identity'),load:()=>request('/document'),published:()=>request('/published'),
  savePlace:input=>command('savePlace',[input]),saveContent:input=>command('saveContent',[input]),
  translate:(...args)=>command('translate',args),generateAudio:(...args)=>command('generateAudio',args),
  submit:(...args)=>command('submit',args),review:(...args)=>command('review',args),publish:(...args)=>command('publish',args),
  archive:(...args)=>command('archive',args),deletePlace:(...args)=>command('deletePlace',args),
  // CHỨC NĂNG: Không cung cấp reset/số phiên giả qua API dùng chung.
  reset:async()=>{throw new AdminError('invalid')},simulate:async()=>{throw new AdminError('invalid')},endSessions:async()=>{throw new AdminError('invalid')},
  subscribe(listener){listeners.add(listener);if(stopped){stopped=false;const run=++generation;timer=setTimeout(()=>{void pulse(run)},pollMs)}return()=>{listeners.delete(listener);if(!listeners.size){stopped=true;generation++;if(timer)clearTimeout(timer)}}},
 }
}
export function createGateClient(base:string):GateClient {
 const request=transport(base)
 return {
  async entry(visitId,platform){await request('/gate/entry',{visitId,platform})},
  async statistics(){const value=await request<GateStats>('/gate/statistics');if(!Number.isSafeInteger(value.today)||value.today<0||typeof value.day!=='string')throw new AdminError('loadError');return value},
 }
}
// CHỨC NĂNG: Gửi lượt mở QR với cùng ID khi retry; server loại lượt lặp.
// XỬ LÝ: Không chặn giao diện du khách; dừng retry khi rời app hoặc sau ba lần lỗi.
export function sendGateEntry(client:GateClient,visitId:string,platform:'web'|'mobile-app') {
 let stopped=false,timer:ReturnType<typeof setTimeout>|undefined,attempt=0
 const send=async()=>{try{await client.entry(visitId,platform)}catch{if(!stopped&&++attempt<3)timer=setTimeout(()=>{void send()},2000)}}
 void send();return()=>{stopped=true;if(timer)clearTimeout(timer)}
}
/* CÁCH KIỂM TRA: Hai client đọc cùng bản; mất mạng không về dữ liệu cục bộ; HTTP409 hiện conflict; hủy subscriber dừng polling. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 4. SỬA — packages/admin-core/src/react.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\react.tsx

Hooks Admin và hook tải thống kê QR 5 giây; bỏ phản hồi tải cũ bằng sequence.

```tsx
/**
 * FILE NÀY LÀM GÌ: Context và hooks Admin dùng chung, UI không biết adapter lưu ở đâu.
 * Admin layout/web và AdminScreen/mobile dùng; UC12–UC17.
 * Phụ thuộc React, service và ngôn ngữ VisitorProvider hiện có.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useVisitor } from '@travelguide/visitor-core/react'
import type { AdminService } from './contracts'
import { AdminError, type AdminDocument, type AdminErrorCode, type AdminIdentity } from './models'
import { adminMessages, type AdminTextKey } from './messages'
const Context = createContext<AdminService | null>(null)
export function AdminProvider({ service, children }: { service: AdminService; children: ReactNode }) {
  return <Context.Provider value={service}>{children}</Context.Provider>
}
export function useAdminText() {
  const { language } = useVisitor()
  return useCallback((key: AdminTextKey): string => adminMessages[language][key], [language])
}
export function useAdmin() {
  const service = useContext(Context)
  if (!service) throw new Error('AdminProvider missing')
  const [data, setData] = useState<AdminDocument | null>(null)
  const [identity, setIdentity] = useState<AdminIdentity | null>(null)
  const [error, setError] = useState<AdminErrorCode | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const alive = useRef(true), sequence = useRef(0), locked = useRef(false)
  // CHỨC NĂNG: Hủy nhận dữ liệu cũ bằng sequence, gỡ subscription khi rời màn.
  const reload = useCallback(async () => {
    const request = ++sequence.current
    try {
      const [doc, manager] = await Promise.all([service.load(), service.identity()])
      if (alive.current && request === sequence.current) { setData(doc); setIdentity(manager); setError(null) }
    } catch (e) { if (alive.current && request === sequence.current) setError(e instanceof AdminError ? e.code : 'loadError') }
    finally { if (alive.current && request === sequence.current) setLoading(false) }
  }, [service])
  const invalidate = useCallback(() => { sequence.current++ }, [])
  useEffect(() => {
    alive.current = true; void reload()
    const stop = service.subscribe(() => { void reload() })
    return () => { alive.current = false; invalidate(); stop() }
  }, [service, reload, invalidate])
  // CHỨC NĂNG: Một thao tác tại một thời điểm; lỗi giữ nguyên form/bản công khai.
  const run = async (operation: () => Promise<void>): Promise<boolean> => {
    if (locked.current) return false
    locked.current = true; setBusy(true); setError(null); setSuccess(false)
    try { await operation(); if (alive.current) { await reload(); setSuccess(true) } return true }
    catch (e) { if (alive.current) setError(e instanceof AdminError ? e.code : 'saveError'); return false }
    finally { locked.current = false; if (alive.current) setBusy(false) }
  }
  return { service, data, identity, error, loading, busy, success, reload, run }
}
/* CÁCH KIỂM TRA: Rời màn trong lúc lưu không setState; lỗi lưu hiện thông báo, không báo thành công. */

// CHỨC NĂNG: Hai dashboard đọc cùng bộ đếm QR từ server RAM mỗi 5 giây.
// XỬ LÝ: Lỗi để —, không báo 0; cleanup bỏ timer và kết quả đến muộn.
export function useGateStatistics(client: import('./httpService').GateClient) {
 const [stats,setStats]=useState<import('./httpService').GateStats|null>(null),[error,setError]=useState(false),[retryKey,setRetryKey]=useState(0)
 useEffect(()=>{let alive=true;let timer:ReturnType<typeof setTimeout>|undefined
  const tick=async()=>{try{const value=await client.statistics();if(alive){setStats(value);setError(false)}}catch{if(alive){setStats(null);setError(true)}}if(alive)timer=setTimeout(()=>{void tick()},5000)}
  void tick();return()=>{alive=false;if(timer)clearTimeout(timer)}
 },[client,retryKey])
 return {stats,error,retry:()=>setRetryKey(value=>value+1)}
}
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 5. SỬA — packages/admin-core/src/index.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\index.ts

Xuất adapter/hợp đồng dùng chung cho hai nền tảng.

```typescript
/** FILE NÀY LÀM GÌ: Entry logic thuần Admin; app import bằng tên package.
 * Phụ thuộc các module bên dưới; React có entry riêng /react. UC12–UC17. */
export * from './models'
export * from './contracts'
export * from './validation'
export * from './mockService'
/* CÁCH KIỂM TRA: Import entry này trong test Node không được kéo React/DOM vào. */

export * from './httpService'
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 6. SỬA — packages/admin-core/src/messages.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\messages.ts

Thông báo kho chung, lỗi và giải thích chỉ số QR đủ năm ngôn ngữ.

```typescript
/** FILE NÀY LÀM GÌ: Chữ Admin đủ năm ngôn ngữ dùng chung mobile/web.
 * useAdminText gọi; UC12–UC17. Keys được suy ra từ bản Việt để chặn thiếu khóa. */
import type { Language } from '@travelguide/visitor-core'
const vi = {
  "gateHint": "Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần; không phải số vé hay số người.",
  "gateError": "Chưa tải được lượt QR.",
  "confirmDelete": "Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong kho RAM dùng chung? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.",
  "delete": "Xóa vĩnh viễn",
  "clearFile": "Bỏ tệp đã chọn",
  "localFile": "Đã chọn tệp cục bộ",
  "mediaError": "Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.",
  "fileHint": "Lưu tệp cục bộ tối đa 1 MB/tệp; API upload sẽ nối sau.",
  "pickAudio": "Chọn bản thu từ thiết bị",
  "pickImage": "Chọn ảnh từ thiết bị",
  "confirm": "Xác nhận",
  "previewError": "Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.",
  "simListening": "Mô phỏng khách đang nghe",
  "overviewHint": "Theo dõi hoạt động và quản lý nội dung di tích.",
  "quickActions": "Thao tác nhanh",
  "managePlacesHint": "Cập nhật thông tin, hình ảnh và bài thuyết minh.",
  "reviewQueueHint": "Kiểm tra và công bố nội dung đã duyệt.",
  "catalogHint": "Quản lý danh mục và nội dung thuyết minh.",
  "basicInfo": "Thông tin di tích",
  "locationSection": "Vị trí và tọa độ",
  "mediaSection": "Hình ảnh và tư liệu",
  "workflowSection": "Lưu và quản lý phiên bản",
  "resetHint": "Khôi phục dữ liệu mẫu khi cần bắt đầu lại.",
  "editorHint": "Biên tập nội dung theo từng ngôn ngữ.",
  "clearSearch": "Xóa từ khóa",
  "admin": "Quản lý",
  "dashboard": "Tổng quan",
  "places": "Di tích",
  "reviews": "Kiểm duyệt",
  "qr": "QR tại cổng",
  "visitor": "Về trang du khách",
  "demo": "Dữ liệu dùng chung trên server RAM; khởi động lại server sẽ mất thay đổi.",
  "mockMedia": "Dịch/TTS mô phỏng. MP3 mẫu không đọc văn bản vừa soạn; nội dung được tạo là dữ liệu mẫu.",
  "loading": "Đang tải…",
  "save": "Lưu bản nháp",
  "saved": "Thao tác thành công",
  "new": "Thêm di tích",
  "edit": "Thông tin",
  "content": "Biên tập",
  "search": "Tìm di tích…",
  "title": "Tên chính thức",
  "period": "Giai đoạn lịch sử",
  "category": "Danh mục",
  "lat": "Vĩ độ",
  "lng": "Kinh độ",
  "verified": "Tọa độ đã kiểm tra",
  "images": "Ảnh: mỗi dòng một URL hoặc mã photo:ID",
  "summary": "Mô tả ngắn",
  "address": "Địa chỉ",
  "body": "Bài thuyết minh",
  "audio": "URL bản thu MP3 đã lưu trên máy chủ",
  "preview": "Nghe thử",
  "prepare": "Tạo audio mẫu",
  "translate": "Dịch nháp mô phỏng từ tiếng Việt",
  "submit": "Gửi duyệt",
  "approve": "Duyệt phiên bản",
  "reject": "Yêu cầu sửa",
  "note": "Ghi chú kiểm duyệt",
  "publish": "Công bố phiên bản",
  "confirmPublish": "Công bố bản này cho giao diện du khách trên thiết bị hiện tại?",
  "archive": "Lưu trữ di tích",
  "confirmArchive": "Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?",
  "reset": "Đặt lại dữ liệu mẫu",
  "confirmReset": "Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?",
  "cancel": "Hủy",
  "unsaved": "Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?",
  "active": "Phiên đang hoạt động",
  "web": "Web",
  "mobile": "App Mobile",
  "listening": "Đang nghe",
  "gateToday": "Lượt QR hôm nay",
  "simWeb": "Mô phỏng khách Web",
  "simMobile": "Mô phỏng khách App",
  "endSessions": "Kết thúc phiên mô phỏng",
  "analyticsHint": "Phiên ẩn danh được cập nhật từ server RAM; hết hoạt động sau 90 giây không gửi tín hiệu. Khởi động lại server sẽ mất số liệu. Đây là số phiên, không phải số người/vé.",
  "presenceError": "Chưa lấy được thống kê. Kiểm tra server RAM và địa chỉ API.",
  "empty": "Chưa có dữ liệu phù hợp",
  "revision": "Bản sửa",
  "current": "Bản công khai hiện hành",
  "none": "Chưa có",
  "status_draft": "Bản nháp",
  "status_submitted": "Chờ duyệt",
  "status_changes": "Cần sửa",
  "status_approved": "Đã duyệt",
  "status_published": "Đã công bố",
  "status_archived": "Đã lưu trữ",
  "error_loadError": "Không đọc được dữ liệu. Thử lại hoặc đặt lại dữ liệu.",
  "error_saveError": "Không lưu được. Bản công khai cũ được giữ nguyên.",
  "error_invalid": "Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).",
  "error_conflict": "Bản đã thay đổi. Tải lại trước khi tiếp tục.",
  "error_notFound": "Không tìm thấy di tích",
  "error_notApproved": "Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.",
  "error_incomplete": "Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.",
  "error_staleJob": "Kết quả tác vụ thuộc bản cũ. Hãy thử lại.",
  "retry": "Thử lại",
  "stop": "Dừng nghe thử"
} as const
const en = {
  "gateHint": "Gate QR link opens, counted once per session/day; not tickets or people.",
  "gateError": "QR statistics are unavailable.",
  "confirmDelete": "Permanently delete this place from shared Admin and visitor data? Draft and published content will be removed. There is no undo button.",
  "delete": "Delete permanently",
  "clearFile": "Remove selected file",
  "localFile": "Local file selected",
  "mediaError": "Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.",
  "fileHint": "Stores local files up to 1 MB each; upload API comes later.",
  "pickAudio": "Choose local recording",
  "pickImage": "Choose local image",
  "confirm": "Confirm",
  "previewError": "Preview unavailable. Check the source and retry.",
  "simListening": "Simulate listening visitor",
  "overviewHint": "Monitor activity and manage heritage content.",
  "quickActions": "Quick actions",
  "managePlacesHint": "Update information, photos and narration.",
  "reviewQueueHint": "Review and publish approved content.",
  "catalogHint": "Manage places and narration content.",
  "basicInfo": "Place information",
  "locationSection": "Location and coordinates",
  "mediaSection": "Photos and media",
  "workflowSection": "Save and manage versions",
  "resetHint": "Restore sample data when you need a fresh start.",
  "editorHint": "Edit content in each language.",
  "clearSearch": "Clear search",
  "admin": "Management",
  "dashboard": "Dashboard",
  "places": "Places",
  "reviews": "Reviews",
  "qr": "Gate QR",
  "visitor": "Visitor view",
  "demo": "Shared server RAM data; restarting the server loses changes.",
  "mockMedia": "Simulated translation/TTS. Sample MP3 does not read your edited text; generated content is sample data.",
  "loading": "Loading…",
  "save": "Save draft",
  "saved": "Operation completed",
  "new": "Add place",
  "edit": "Information",
  "content": "Edit content",
  "search": "Search places…",
  "title": "Official title",
  "period": "Historical period",
  "category": "Category",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordinates verified",
  "images": "Images: one URL or photo:ID per line",
  "summary": "Summary",
  "address": "Address",
  "body": "Narration text",
  "audio": "Hosted recording MP3 URL",
  "preview": "Preview audio",
  "prepare": "Prepare sample audio",
  "translate": "Simulated translation from Vietnamese",
  "submit": "Submit for review",
  "approve": "Approve revision",
  "reject": "Request changes",
  "note": "Review note",
  "publish": "Publish revision",
  "confirmPublish": "Publish this revision to the visitor view on this device?",
  "archive": "Archive place",
  "confirmArchive": "Archive removes this place from the public catalogue. Continue?",
  "reset": "Reset sample data",
  "confirmReset": "Discard local changes and restore sample data?",
  "cancel": "Cancel",
  "unsaved": "Unsaved changes. Leave this form?",
  "active": "Active sessions",
  "web": "Web",
  "mobile": "Mobile app",
  "listening": "Listening",
  "gateToday": "Gate entries today",
  "simWeb": "Simulate web visitor",
  "simMobile": "Simulate app visitor",
  "endSessions": "End simulated sessions",
  "analyticsHint": "Anonymous sessions are read from the RAM server and expire after 90 seconds without a heartbeat. Restarting the server clears them. Sessions are not people or tickets.",
  "presenceError": "Statistics are unavailable. Check the RAM server and API address.",
  "empty": "No matching data",
  "revision": "Revision",
  "current": "Current published version",
  "none": "None",
  "status_draft": "Draft",
  "status_submitted": "In review",
  "status_changes": "Changes requested",
  "status_approved": "Approved",
  "status_published": "Published",
  "status_archived": "Archived",
  "error_loadError": "Could not load data. Retry or reset data.",
  "error_saveError": "Save failed. The published version is unchanged.",
  "error_invalid": "Check required fields, Hue coordinates and HTTP(S) URLs.",
  "error_conflict": "Revision changed. Reload before continuing.",
  "error_notFound": "Place not found",
  "error_notApproved": "Publish only the unchanged approved revision.",
  "error_incomplete": "Require an image, Vietnamese text and audio for entered languages.",
  "error_staleJob": "Task result is stale. Retry.",
  "retry": "Retry",
  "stop": "Stop preview"
} as const
const cn = {
  "gateHint": "入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。",
  "gateError": "无法加载二维码统计。",
  "confirmDelete": "从共享管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。",
  "delete": "永久删除",
  "clearFile": "移除文件",
  "localFile": "已选本地文件",
  "mediaError": "文件无效或超过1MB。选择图片或音频支持格式。",
  "fileHint": "示例本地保存，每个文件最大1MB，后续连接上传API。",
  "pickAudio": "选择本地录音",
  "pickImage": "选择本地图片",
  "confirm": "确认",
  "previewError": "无法试听，请检查来源后重试。",
  "simListening": "模拟收听游客",
  "overviewHint": "查看使用情况并管理景点内容。",
  "quickActions": "快捷操作",
  "managePlacesHint": "更新信息、图片和讲解。",
  "reviewQueueHint": "审核并发布已批准的内容。",
  "catalogHint": "管理景点目录和讲解内容。",
  "basicInfo": "景点信息",
  "locationSection": "位置与坐标",
  "mediaSection": "图片与资料",
  "workflowSection": "保存与版本管理",
  "resetHint": "需要重新开始时恢复示例数据。",
  "editorHint": "按语言编辑内容。",
  "clearSearch": "清除关键词",
  "admin": "管理",
  "dashboard": "概览",
  "places": "景点",
  "reviews": "审核",
  "qr": "入口二维码",
  "visitor": "游客页面",
  "demo": "数据共用服务器内存；重启服务器会丢失更改。",
  "mockMedia": "翻译和语音为模拟，示例MP3不朗读编辑内容，仅供示例发布。",
  "loading": "加载中…",
  "save": "保存草稿",
  "saved": "操作成功",
  "new": "添加景点",
  "edit": "信息",
  "content": "编辑内容",
  "search": "搜索景点…",
  "title": "正式名称",
  "period": "历史时期",
  "category": "类别",
  "lat": "纬度",
  "lng": "经度",
  "verified": "坐标已核实",
  "images": "图片：每行一个URL或photo:ID",
  "summary": "简介",
  "address": "地址",
  "body": "讲解文稿",
  "audio": "已托管MP3录音URL",
  "preview": "试听",
  "prepare": "生成示例音频",
  "translate": "从越南语模拟翻译",
  "submit": "提交审核",
  "approve": "批准版本",
  "reject": "要求修改",
  "note": "审核备注",
  "publish": "发布版本",
  "confirmPublish": "向当前设备游客视图发布此版本？",
  "archive": "归档景点",
  "confirmArchive": "归档会从示例公开目录移除景点。继续？",
  "reset": "重置示例数据",
  "confirmReset": "清除本地修改并恢复示例数据？",
  "cancel": "取消",
  "unsaved": "有未保存修改，离开？",
  "active": "活跃会话",
  "web": "网页",
  "mobile": "移动应用",
  "listening": "正在收听",
  "gateToday": "今日入口次数",
  "simWeb": "模拟网页游客",
  "simMobile": "模拟应用游客",
  "endSessions": "结束示例会话",
  "analyticsHint": "匿名会话来自内存服务器，90秒未发送心跳即过期。重启服务器会清空数据。会话数不等于人数或票数。",
  "presenceError": "无法读取统计，请检查内存服务器和API地址。",
  "empty": "暂无匹配数据",
  "revision": "修订",
  "current": "当前公开版本",
  "none": "暂无",
  "status_draft": "草稿",
  "status_submitted": "待审核",
  "status_changes": "需修改",
  "status_approved": "已批准",
  "status_published": "已发布",
  "status_archived": "已归档",
  "error_loadError": "读取失败，请重试或重置。",
  "error_saveError": "保存失败，公开版本未改变。",
  "error_invalid": "请检查必填项、顺化坐标和HTTP(S)链接。",
  "error_conflict": "版本已变，请刷新后继续。",
  "error_notFound": "未找到景点",
  "error_notApproved": "只能发布未再修改的已批准版本。",
  "error_incomplete": "需要图片、越南语内容及已输入语言的音频。",
  "error_staleJob": "任务结果已过期，请重试。",
  "retry": "重试",
  "stop": "停止试听"
} as const
const pt = {
  "gateHint": "Aberturas do link QR de entrada, uma por sessão/dia; não são bilhetes nem pessoas.",
  "gateError": "Estatísticas QR indisponíveis.",
  "confirmDelete": "Eliminar este local dos dados partilhados de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.",
  "delete": "Eliminar permanentemente",
  "clearFile": "Remover ficheiro",
  "localFile": "Ficheiro local escolhido",
  "mediaError": "Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.",
  "fileHint": "Guarda ficheiros locais até 1 MB; API de upload futura.",
  "pickAudio": "Escolher gravação local",
  "pickImage": "Escolher imagem local",
  "confirm": "Confirmar",
  "previewError": "Prévia indisponível. Verifique a origem e repita.",
  "simListening": "Simular visitante a ouvir",
  "overviewHint": "Acompanhe a atividade e gira conteúdos do património.",
  "quickActions": "Ações rápidas",
  "managePlacesHint": "Atualize informações, fotografias e narrações.",
  "reviewQueueHint": "Reveja e publique conteúdos aprovados.",
  "catalogHint": "Gira locais e conteúdos de narração.",
  "basicInfo": "Informação do local",
  "locationSection": "Localização e coordenadas",
  "mediaSection": "Fotografias e materiais",
  "workflowSection": "Guardar e gerir versões",
  "resetHint": "Reponha os dados de exemplo para recomeçar.",
  "editorHint": "Edite conteúdos em cada idioma.",
  "clearSearch": "Limpar pesquisa",
  "admin": "Gestão",
  "dashboard": "Visão geral",
  "places": "Locais",
  "reviews": "Revisão",
  "qr": "QR da entrada",
  "visitor": "Vista visitante",
  "demo": "Dados na RAM partilhada do servidor; reiniciar perde as alterações.",
  "mockMedia": "Tradução/TTS simulados. O MP3 não lê o texto editado; publicação com conteúdo de exemplo.",
  "loading": "A carregar…",
  "save": "Guardar rascunho",
  "saved": "Operação concluída",
  "new": "Adicionar local",
  "edit": "Informação",
  "content": "Editar conteúdo",
  "search": "Pesquisar locais…",
  "title": "Nome oficial",
  "period": "Período histórico",
  "category": "Categoria",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordenadas verificadas",
  "images": "Imagens: um URL ou photo:ID por linha",
  "summary": "Resumo",
  "address": "Morada",
  "body": "Texto da narração",
  "audio": "URL MP3 alojado",
  "preview": "Ouvir prévia",
  "prepare": "Preparar áudio de exemplo",
  "translate": "Tradução simulada do vietnamita",
  "submit": "Enviar para revisão",
  "approve": "Aprovar versão",
  "reject": "Pedir alterações",
  "note": "Nota de revisão",
  "publish": "Publicar versão",
  "confirmPublish": "Publicar esta versão para visitantes neste dispositivo?",
  "archive": "Arquivar local",
  "confirmArchive": "Arquivar remove o local do catálogo. Continuar?",
  "reset": "Repor exemplo",
  "confirmReset": "Eliminar alterações locais e repor dados de exemplo?",
  "cancel": "Cancelar",
  "unsaved": "Alterações por guardar. Sair?",
  "active": "Sessões ativas",
  "web": "Web",
  "mobile": "Aplicação móvel",
  "listening": "A ouvir",
  "gateToday": "Entradas QR hoje",
  "simWeb": "Simular visitante Web",
  "simMobile": "Simular visitante App",
  "endSessions": "Terminar sessões simuladas",
  "analyticsHint": "Sessões anónimas no servidor RAM expiram após 90 segundos sem sinal. Reiniciar o servidor apaga os dados. Sessões não são pessoas ou bilhetes.",
  "presenceError": "Estatísticas indisponíveis. Verifique o servidor RAM e o endereço da API.",
  "empty": "Sem dados correspondentes",
  "revision": "Revisão",
  "current": "Versão publicada atual",
  "none": "Nenhum",
  "status_draft": "Rascunho",
  "status_submitted": "Em revisão",
  "status_changes": "Alterações pedidas",
  "status_approved": "Aprovado",
  "status_published": "Publicado",
  "status_archived": "Arquivado",
  "error_loadError": "Falha ao carregar. Repetir ou repor dados.",
  "error_saveError": "Falha ao guardar. Versão pública mantida.",
  "error_invalid": "Verifique campos, coordenadas e URL HTTP(S).",
  "error_conflict": "Versão alterada. Recarregue antes de continuar.",
  "error_notFound": "Local não encontrado",
  "error_notApproved": "Publique apenas a revisão aprovada sem alterações.",
  "error_incomplete": "É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.",
  "error_staleJob": "Resultado desatualizado. Repita.",
  "retry": "Repetir",
  "stop": "Parar prévia"
} as const
const ja = {
  "gateHint": "入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。",
  "gateError": "QR統計を取得できません。",
  "confirmDelete": "この史跡を共有された管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。",
  "delete": "完全に削除",
  "clearFile": "選択ファイルを外す",
  "localFile": "ローカルファイル選択済み",
  "mediaError": "無効または1MB超過。対応する画像・音声を選んでください。",
  "fileHint": "サンプルは1ファイル1MBまでローカル保存。アップロードAPIは後日接続。",
  "pickAudio": "端末の録音を選択",
  "pickImage": "端末の画像を選択",
  "confirm": "確認",
  "previewError": "試聴できません。音源を確認して再試行してください。",
  "simListening": "再生中の利用者を追加",
  "overviewHint": "利用状況を確認し、史跡のコンテンツを管理します。",
  "quickActions": "クイック操作",
  "managePlacesHint": "情報、写真、音声ガイドを更新します。",
  "reviewQueueHint": "内容を確認して承認済みの版を公開します。",
  "catalogHint": "スポットと音声ガイドを管理します。",
  "basicInfo": "スポット情報",
  "locationSection": "場所と座標",
  "mediaSection": "写真と資料",
  "workflowSection": "保存とバージョン管理",
  "resetHint": "最初から始める場合にサンプルデータを復元します。",
  "editorHint": "言語ごとにコンテンツを編集します。",
  "clearSearch": "検索語を消去",
  "admin": "管理",
  "dashboard": "概要",
  "places": "史跡",
  "reviews": "審査",
  "qr": "入口QR",
  "visitor": "来訪者画面",
  "demo": "サーバーRAMの共有データです。再起動すると変更は失われます。",
  "mockMedia": "翻訳・TTSは模擬です。MP3は編集文を読みません。公開もサンプル用です。",
  "loading": "読込中…",
  "save": "下書き保存",
  "saved": "処理完了",
  "new": "史跡を追加",
  "edit": "情報",
  "content": "内容編集",
  "search": "史跡を検索…",
  "title": "正式名称",
  "period": "歴史的時代",
  "category": "分類",
  "lat": "緯度",
  "lng": "経度",
  "verified": "座標確認済み",
  "images": "画像：1行にURLまたはphoto:ID",
  "summary": "概要文",
  "address": "住所",
  "body": "解説文",
  "audio": "サーバー上のMP3 URL",
  "preview": "試聴",
  "prepare": "サンプル音声を用意",
  "translate": "ベトナム語から模擬翻訳",
  "submit": "審査に送信",
  "approve": "版を承認",
  "reject": "修正依頼",
  "note": "審査メモ",
  "publish": "版を公開",
  "confirmPublish": "この端末の来訪者画面に公開しますか？",
  "archive": "史跡をアーカイブ",
  "confirmArchive": "サンプル公開一覧から除きます。続けますか？",
  "reset": "サンプルデータをリセット",
  "confirmReset": "ローカル変更を破棄しサンプルに戻しますか？",
  "cancel": "取消",
  "unsaved": "未保存の変更があります。移動しますか？",
  "active": "アクティブセッション",
  "web": "Web",
  "mobile": "モバイルアプリ",
  "listening": "再生中",
  "gateToday": "本日のQR入場",
  "simWeb": "Web利用者を追加",
  "simMobile": "アプリ利用者を追加",
  "endSessions": "サンプルセッション終了",
  "analyticsHint": "匿名セッションをRAMサーバーから取得します。90秒間通知がないと期限切れになります。再起動で消去されます。人数・チケット数ではありません。",
  "presenceError": "統計を取得できません。RAMサーバーとAPIアドレスを確認してください。",
  "empty": "該当データなし",
  "revision": "改訂",
  "current": "現在の公開版",
  "none": "なし",
  "status_draft": "下書き",
  "status_submitted": "審査待ち",
  "status_changes": "要修正",
  "status_approved": "承認済み",
  "status_published": "公開済み",
  "status_archived": "アーカイブ済み",
  "error_loadError": "読込失敗。再試行またはリセットしてください。",
  "error_saveError": "保存失敗。公開版は変更されません。",
  "error_invalid": "必須項目・フエの座標・HTTP(S) URLを確認してください。",
  "error_conflict": "版が変更されました。再読込してください。",
  "error_notFound": "史跡が見つかりません",
  "error_notApproved": "承認後未変更の版だけ公開できます。",
  "error_incomplete": "画像・ベトナム語文・入力した言語の音声が必要です。",
  "error_staleJob": "古い処理結果です。再試行してください。",
  "retry": "再試行",
  "stop": "試聴停止"
} as const
export type AdminTextKey = keyof typeof vi
export const adminMessages: Record<Language, Record<AdminTextKey, string>> = { vi, en, cn, pt, ja }
/* CÁCH KIỂM TRA: Đổi đủ năm ngôn ngữ, mọi nhãn Admin đổi cùng lựa chọn du khách. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 7. SỬA — packages/admin-core/src/mockService.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\mockService.ts

Nghiệp vụ dùng StoragePort; server dùng lại một instance, không sao chép workflow.

```typescript
/**
 * FILE NÀY LÀM GÌ: Nghiệp vụ Admin mô phỏng qua StoragePort và kiểm tra phiên bản.
 * Mock API RAM tạo một instance chung; test truyền kho giả qua StoragePort.
 * UC12–UC17: dịch/TTS vẫn mô phỏng; đồng bộ do HTTP adapter và server thực hiện.
 */
import { MOCK_PLACES, LANGUAGES } from '@travelguide/visitor-core'
import type { Language, PlaceRecord, PublishedText } from '@travelguide/visitor-core'
import type { AdminService, StoragePort } from './contracts'
import type { AdminDocument, ManagedPlace, ContentInput } from './models'
import { AdminError } from './models'
import { mediaUrl, readyForReview, validatePlace } from './validation'
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const stamp = () => new Date().toISOString()
const seed = (): AdminDocument => ({ schema: 1, sessions: [], audit: [], places: MOCK_PLACES.map(record => ({
  id: record.id, record: clone(record), period: '', revision: 1, workflow: 'published', reviewNote: '',
  approvedRevision: 1, published: clone(record), updatedAt: stamp(),
})) })
function readDocument(raw: string): AdminDocument {
  // CHỨC NĂNG: Kiểm tra dữ liệu cục bộ trước khi coi là AdminDocument.
  // XỬ LÝ: JSON hỏng/khác schema không ghi đè bằng seed; người dùng có thể đặt lại demo.
  const x: unknown = JSON.parse(raw)
  if (!x || typeof x !== 'object' || !('schema' in x) || x.schema !== 1 || !('places' in x) || !Array.isArray(x.places)
    || !('sessions' in x) || !Array.isArray(x.sessions) || !('audit' in x) || !Array.isArray(x.audit)) throw new AdminError('loadError')
  for (const p of x.places) {
    if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.revision) || p.revision < 1
      || !['draft','submitted','changes','approved','published','archived'].includes(p.workflow)
      || !p.record || !Array.isArray(p.record.images) || !p.record.content || typeof p.period !== 'string') throw new AdminError('loadError')
  }
  return x as AdminDocument
}
export function createMockAdminService(storage: StoragePort): AdminService {
  let cached: AdminDocument | undefined
  let loading: Promise<AdminDocument> | undefined
  let queue: Promise<void> = Promise.resolve()
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach(listener => listener())
  async function load(): Promise<AdminDocument> {
    if (!cached) {
      loading ??= storage.read().then(raw => { cached = raw ? readDocument(raw) : seed(); return cached })
        .catch(() => { throw new AdminError('loadError') }).finally(() => { loading = undefined })
      await loading
    }
    return clone(cached!)
  }
  // CHỨC NĂNG: Ghi nối tiếp; chỉ thay cache và thông báo sau khi ghi thành công.
  // XỬ LÝ: Lỗi lưu giữ bản công khai cũ, không giả hiển thị đã lưu. BE sau này
  // phải làm giao dịch và kiểm tra revision tương tự trên máy chủ.
  function mutate(action: (doc: AdminDocument) => void): Promise<void> {
    const task = queue.then(async () => {
      const next = await load(); action(next)
      try { await storage.write(JSON.stringify(next)) } catch { throw new AdminError('saveError') }
      cached = next; notify()
    })
    queue = task.catch(() => {})
    return task
  }
  function item(doc: AdminDocument, id: string, revision: number) {
    const place = doc.places.find(p => p.id === id)
    if (!place) throw new AdminError('notFound')
    if (place.revision !== revision) throw new AdminError('conflict')
    if (place.workflow === 'archived') throw new AdminError('invalid')
    return place
  }
  function touch(place: ManagedPlace) {
    place.revision++; place.workflow = 'draft'; place.approvedRevision = undefined
    place.reviewNote = ''; place.updatedAt = stamp()
  }
  const log = (doc: AdminDocument, place: ManagedPlace, action: string) => {
    doc.audit.unshift({ at: stamp(), action, placeId: place.id, revision: place.revision }); doc.audit = doc.audit.slice(0, 100)
  }
  function replaceText(place: ManagedPlace, language: Language, text: PublishedText) {
    place.record.content[language] = { ...text, status: 'draft', approvedAt: undefined, publishedAt: undefined }
    touch(place)
  }
  const service: AdminService = {
    identity: async () => ({ id: 'provided-demo-manager', displayName: 'HueGuide', mode: 'demo', permissions: ['manage-content','review','publish'] }),
    load, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    savePlace: input => mutate(doc => {
      validatePlace(input)
      let place: ManagedPlace
      if (input.id) place = item(doc, input.id, input.expectedRevision ?? -1)
      else {
        const id = 'place-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7)
        place = { id, period: '', revision: 0, workflow: 'draft', reviewNote: '', updatedAt: stamp(),
          record: { id, canonicalTitle: input.title, scope: 'hue-citadel', inLaunchCatalog: true,
            status: 'draft', zone: 'ceremonial', images: [], content: {} } }
        doc.places.push(place)
      }
      place.period = input.period.trim(); place.record.period = place.period; place.record.canonicalTitle = input.title.trim()
      const source = place.record.content.vi
      place.record.content.vi = { title: input.title.trim(), summary: '', address: '', body: '', version: place.revision + 1,
        status: 'draft', ...source, ...(source ? { title: input.title.trim(), version: place.revision + 1 } : {}) }
      place.record.category = input.category; place.record.images = [...input.images]
      place.record.position = input.lat.trim() ? { lat: Number(input.lat), lng: Number(input.lng), verified: input.verified } : undefined
      touch(place); log(doc, place, 'savePlace')
    }),
    saveContent: (input: ContentInput) => mutate(doc => {
      const place = item(doc, input.id, input.expectedRevision)
      if (!input.title.trim() || !input.body.trim() || (input.audioUrl && !mediaUrl(input.audioUrl))) throw new AdminError('invalid')
      const old = place.record.content[input.language]
      // CHỨC NĂNG: Sửa văn bản làm audio cũ không còn khớp; phải chuẩn bị audio lại.
      const sameBody = old?.body === input.body.trim()
      const audio = input.audioUrl ? { id: 'recording-' + place.id + '-' + input.language + '-' + (place.revision + 1),
        url: input.audioUrl, version: place.revision + 1, status: 'draft' as const } : sameBody ? old?.audio : undefined
      replaceText(place, input.language, { title: input.title.trim(), summary: input.summary.trim(), address: input.address.trim(),
        body: input.body.trim(), version: place.revision + 1, status: 'draft', audio })
      log(doc, place, 'saveContent')
    }),
    translate: async (id, language, revision) => {
      // CHỨC NĂNG: Mô phỏng tác vụ bất đồng bộ; không giả là bản dịch thật.
      // XỬ LÝ: So revision lần nữa khi kết quả về, ngăn ghi đè nội dung mới.
      await new Promise(resolve => setTimeout(resolve, 400))
      return mutate(doc => {
        const place = item(doc, id, revision), source = place.record.content.vi
        if (!source?.body.trim() || language === 'vi') throw new AdminError('invalid')
        const name = LANGUAGES.find(l => l.code === language)?.label ?? language
        replaceText(place, language, { ...source, title: place.record.content[language]?.title ?? source.title,
          body: '[DEMO ' + name + '] ' + source.body, audio: undefined, version: revision + 1 })
        log(doc, place, 'translate')
      })
    },
    generateAudio: async (id, language, revision) => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return mutate(doc => {
        const place = item(doc, id, revision), text = place.record.content[language]
        if (!text?.body.trim()) throw new AdminError('incomplete')
        // CHỨC NĂNG: Gắn MP3 demo đã có để thử tua/nghe; không phải giọng của văn bản mới.
        replaceText(place, language, { ...text, audio: { id: 'demo-' + language + '-' + revision,
          url: 'demo:' + language, version: revision + 1, status: 'draft' } })
        log(doc, place, 'generateAudio')
      })
    },
    submit: (id, revision) => mutate(doc => {
      const place = item(doc, id, revision); readyForReview(place)
      if (!['draft','changes'].includes(place.workflow)) throw new AdminError('invalid')
      place.workflow = 'submitted'; log(doc, place, 'submit')
    }),
    review: (id, revision, approved, note) => mutate(doc => {
      const place = item(doc, id, revision)
      if (place.workflow !== 'submitted' || (!approved && !note.trim())) throw new AdminError('invalid')
      if (approved) readyForReview(place)
      place.workflow = approved ? 'approved' : 'changes'; place.reviewNote = note.trim()
      place.approvedRevision = approved ? revision : undefined; log(doc, place, approved ? 'approve' : 'requestChanges')
    }),
    publish: (id, revision) => mutate(doc => {
      const place = item(doc, id, revision)
      if (place.workflow !== 'approved' || place.approvedRevision !== revision) throw new AdminError('notApproved')
      readyForReview(place)
      const record = clone(place.record), now = stamp()
      record.status = 'published'
      for (const { code } of LANGUAGES) {
        const text = record.content[code]
        if (!text) continue
        text.status = 'published'; text.approvedAt = now; text.publishedAt = now
        if (text.audio) { text.audio.status = 'published'; text.audio.approvedAt = now; text.audio.publishedAt = now }
      }
      place.published = record; place.workflow = 'published'; log(doc, place, 'publish')
    }),
    archive: (id, revision) => mutate(doc => {
      const place = item(doc, id, revision); place.workflow = 'archived'; place.published = undefined; log(doc, place, 'archive')
    }),
    // CHỨC NĂNG: Xóa hẳn một di tích khỏi bản nháp và danh mục công khai cục bộ.
    // XỬ LÝ: Cho xóa cả điểm đã lưu trữ; kiểm tra ID/revision trước khi ghi.
    // Chỉ sửa document này, không xóa ảnh asset dùng chung hay các điểm khác.
    // mutate giữ nguyên dữ liệu nếu ghi storage thất bại; UI phải hỏi xác nhận.
    deletePlace: (id, revision) => mutate(doc => {
      const place = doc.places.find(p => p.id === id)
      if (!place) throw new AdminError('notFound')
      if (place.revision !== revision) throw new AdminError('conflict')
      log(doc, place, 'deletePlace')
      doc.places = doc.places.filter(p => p.id !== id)
    }),
    simulate: (platform, playing = false) => mutate(doc => {
      const now = Date.now(); doc.sessions.push({ id: 'demo-' + now + '-' + Math.random().toString(36).slice(2,6), platform,
        lastSeen: now, startedAt: now, playing })
    }),
    endSessions: () => mutate(doc => { doc.sessions.forEach(s => { s.lastSeen = 0; s.playing = false }) }),
    reset: () => {
      // CHỨC NĂNG: Khôi phục cả khi JSON hiện tại hỏng, không gọi load dữ liệu lỗi.
      const task = queue.then(async () => {
        const next = seed()
        try { await storage.write(JSON.stringify(next)) } catch { throw new AdminError('saveError') }
        cached = next; notify()
      })
      queue = task.catch(() => {}); return task
    },
    published: async (): Promise<PlaceRecord[]> => (await load()).places.flatMap(p => p.workflow !== 'archived' && p.published ? [p.published] : []),
  }
  return service
}
/* CÁCH KIỂM TRA: Lưu nháp không đổi published; sửa sau duyệt chặn publish;
 * hai lệnh cùng revision chỉ lệnh đầu thành công; storage.write lỗi không đổi cache. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 8. SỬA — apps/web/src/services/admin/services.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\services\admin\services.ts

Gắn API vào Admin, danh mục công bố và bộ đếm QR của web.

```typescript
/**
 * FILE NÀY LÀM GÌ: Ghép API RAM chung vào Admin và danh mục du khách của nền tảng.
 * Provider và Dashboard gọi; UC12–UC17. Không tự quay về kho cục bộ khi mất mạng.
 * Bản nháp chỉ đọc qua Admin; publicCatalog chỉ lấy /published.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
const base = import.meta.env.VITE_ADMIN_API_URL || '/api/catalog'
const publicBase = import.meta.env.VITE_CATALOG_API_URL || '/api/catalog'
export const adminService = createHttpAdminService(base)
const publicService = createHttpAdminService(publicBase)
export const gateClient = createGateClient(base)
export const visitorGateClient = createGateClient(publicBase)
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 9. SỬA — apps/mobile/src/services/admin/services.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\services\admin\services.ts

Gắn API LAN riêng cho Admin và API HTTPS cho du khách native.

```typescript
/**
 * FILE NÀY LÀM GÌ: Ghép API RAM chung vào Admin và danh mục du khách của nền tảng.
 * Provider và Dashboard gọi; UC12–UC17. Không tự quay về kho cục bộ khi mất mạng.
 * Bản nháp chỉ đọc qua Admin; publicCatalog chỉ lấy /published.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
import { webOrigin } from '../platform'
const base = process.env.EXPO_PUBLIC_ADMIN_API_URL || ''
// URL public có thể đi qua web tunnel; địa chỉ quản lý LAN tách riêng.
const publicBase = process.env.EXPO_PUBLIC_CATALOG_API_URL || (webOrigin ? webOrigin+'/api/catalog' : base)
export const adminService = createHttpAdminService(base)
const publicService = createHttpAdminService(publicBase)
export const gateClient = createGateClient(base)
export const visitorGateClient = createGateClient(publicBase)
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 10. SỬA — apps/web/vite.config.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\vite.config.ts

Proxy Admin đầy đủ; proxy du khách chỉ đọc published/version và gửi gate entry.

```typescript
﻿/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình build web và giữ đúng runtime React18.
 * Vite đọc; phụ thuộc plugin React và module resolution của Node.
 * Tránh lấy nhầm React19 của mobile từ package dùng chung.
 */

import { createRequire } from 'node:module'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Tìm React theo package.json của web.
// XỬ LÝ: Không tìm theo vị trí file trong packages/visitor-core.
const webRequire = createRequire(
  new URL('./package.json', import.meta.url),
)

// CHỨC NĂNG: Tách entry và thư mục build ngay từ cấu hình Vite, không dựa vào URL để cấp quyền.
// XỬ LÝ: Bản visitor không chứa cây route admin. HTTP /admin bị từ chối ở dev/preview visitor.
// Hosting production cũng phải chặn /admin và bảo vệ tên miền admin bằng xác thực riêng.
function audiencePlugin(admin: boolean): Plugin {
  const blockAdmin: import('vite').Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? '/').split('?')[0]
    if (/^\/qr(?:\/|$)/.test(path) || (!admin && /^\/admin(?:\/|$)/.test(path))) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    next()
  }
  return {
    name: 'separate-admin-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return admin ? html.replace('/src/main.tsx', '/src/main-admin.tsx') : html
      },
    },
    configureServer(server) { server.middlewares.use(blockAdmin) },
    configurePreviewServer(server) { server.middlewares.use(blockAdmin) },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), audiencePlugin(mode === 'admin')],
  // CHỨC NĂNG: Hai bản build riêng; admin dev chỉ nghe localhost theo mặc định.
  // XỬ LÝ: Không đưa cổng quản lý vào link QR/tunnel dành cho du khách.
  server: {
    host: mode === 'admin' ? '127.0.0.1' : '0.0.0.0',
    // CHỨC NĂNG: Hai site gọi chung server RAM, QR/tunnel visitor vẫn dùng cùng origin.
    // XỬ LÝ: Chỉ bản admin proxy API đọc thống kê; visitor chỉ gửi heartbeat/end.
    proxy: {
      [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry)$']: {
        target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/catalog/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
      [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$']: {
        target: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/presence/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
    },
  },
  build: { outDir: mode === 'admin' ? 'dist-admin' : 'dist' },

  // CHỨC NĂNG: Sao chép file xác minh App Links vào bản web triển khai.
  // XỬ LÝ: Dùng static riêng; tránh public/index.html cũ đè entry của Vite.
  publicDir: 'static',

  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: webRequire.resolve('react'),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: webRequire.resolve('react/jsx-runtime'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: webRequire.resolve('react/jsx-dev-runtime'),
      },
      {
        find: /^react-dom$/,
        replacement: webRequire.resolve('react-dom'),
      },
      {
        find: /^react-dom\/client$/,
        replacement: webRequire.resolve('react-dom/client'),
      },
    ],
  },
}))
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 11. SỬA — apps/web/src/pages/admin/DashboardPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\DashboardPage.tsx

Bỏ reset, dùng lượt QR từ kho chung, có lỗi/thử lại.

```tsx
/**
 * FILE NÀY LÀM GÌ: Tổng quan Admin web, bốn chỉ số và lối vào nghiệp vụ nhanh.
 * AdminRoutes gọi tại /admin; phụ thuộc admin-core, presence RAM và UI Admin.
 * UC12, UC17. Giữ số phiên thực từ API; không tạo số liệu minh họa khi mất kết nối.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import { presenceClient } from '../../services/presence'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { Feedback } from '../../components/admin/AdminUI'
import { gateClient } from '../../services/admin/services'
import { AdminIcon, type AdminIconName } from '../../components/admin/AdminIcon'
export function DashboardPage() {
 const state = useAdmin(), t = useAdminText(), gate = useGateStatistics(gateClient)
 const presence = usePresenceStatistics(presenceClient)
 // CHỨC NĂNG: Tính lại thống kê nội dung khi kho thay đổi, tách số phiên lấy từ RAM.
 // XỬ LÝ: Chưa có phản hồi presence thì hiển thị —; không đánh đồng lỗi với 0 phiên.
 const metrics = useMemo(() => state.data ? dashboard(state.data) : null, [state.data])
 const tiles: {key:'active'|'gateToday'|'places'|'pending'; icon:AdminIconName}[] = [
  {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'places'},{key:'pending',icon:'review'},
 ]
 return <>
  <section className="admin-hero"><div><span className="admin-eyebrow">HUEGUIDE</span><h1>{t('dashboard')}</h1><p>{t('overviewHint')}</p></div><Link className="button admin-hero-button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link><div className="admin-hero-decoration" aria-hidden="true"><AdminIcon name="places"/></div></section>
  <Feedback state={state}/>
  {metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article className={'admin-metric metric-'+index} key={key}><div className="admin-metric-top"><span>{t(key === 'pending' ? 'status_submitted' : key)}</span><span className="admin-metric-icon"><AdminIcon name={icon}/></span></div><strong>{key === 'active' ? presence.stats?.active ?? '—' : key === 'gateToday' ? gate.stats?.today ?? '—' : metrics[key]}</strong><div className="admin-metric-line"/></article>)}</div>}
  <p className="admin-demo">{t('gateHint')}</p>
  {gate.error&&<div className="admin-error" role="alert">{t('gateError')}<button className="secondary" onClick={gate.retry}>{t('retry')}</button></div>}
  <div className="admin-dashboard-grid">
   <section className="admin-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="dashboard"/></span><h2>{t('quickActions')}</h2></div><div className="admin-quick-actions">{([
    {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'},
    {to:'/admin/reviews',title:'reviews',hint:'reviewQueueHint',icon:'review'},
   ] as const).map(item=><Link key={item.to} className="admin-quick-action" to={item.to}><span className="admin-icon-box"><AdminIcon name={item.icon}/></span><div><strong>{t(item.title)}</strong><p>{t(item.hint)}</p></div><AdminIcon name="arrow"/></Link>)}</div></section>
   <section className="admin-card admin-presence-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="users"/></span><h2>{t('active')}</h2></div><p>{t('analyticsHint')}</p>
    {/* CHỨC NĂNG: Lỗi polling có nút thử lại; không che bằng dữ liệu giả. */}
    {presence.error ? <div className="admin-error" role="alert">{t('presenceError')}<button className="secondary" onClick={presence.retry}>{t('retry')}</button></div> : !presence.stats ? <p role="status">{t('loading')}</p> : null}
   </section>
  </div>

 </>
}
/* CÁCH KIỂM TRA: Bốn chỉ số đúng; liên kết mở đúng màn; không còn nút reset; tắt RAM hiện lỗi. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 12. SỬA — apps/mobile/src/screens/admin/DashboardScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\DashboardScreen.tsx

Dashboard mobile dùng cùng bộ đếm QR; bỏ reset.

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang tổng quan Admin mobile với bốn chỉ số và thao tác nhanh.
 * AdminNavigator gọi; phụ thuộc admin-core, presence RAM và bộ AdminUI. UC12–UC17.
 * Dữ liệu nội dung và lượt QR lấy từ API RAM chung; không có nút reset.
 */
import { useMemo, type ComponentProps } from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { gateClient } from '../../services/admin/services'
import { adminPresenceClient } from '../../services/presence'
import { Action } from '../../components/Action'
import { Frame, Feedback, QuickAction, SectionHeading, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'

export function DashboardScreen({navigation}:NativeStackScreenProps<AdminStack,'Dashboard'>) {
 const state=useAdmin(),t=useAdminText(),presence=usePresenceStatistics(adminPresenceClient),gate=useGateStatistics(gateClient)
 const metrics=useMemo(()=>state.data?dashboard(state.data):null,[state.data])
 const icons:Record<'active'|'gateToday'|'places'|'pending',ComponentProps<typeof Ionicons>['name']>={active:'people-outline',gateToday:'qr-code-outline',places:'business-outline',pending:'time-outline'}
 return <Frame>
  <View style={styles.hero}>
   <Text style={styles.brand}>HUEGUIDE</Text>
   <Text style={styles.heroTitle}>{t('dashboard')}</Text>
   <Text style={styles.heroText}>{t('overviewHint')}</Text>
  </View>
  <Feedback state={state}/>
  {/* CHỨC NĂNG: Active lấy API RAM, ba chỉ số khác lấy service cũ; không giả lập số. */}
  <View style={[styles.row,{alignItems:'stretch',gap:12}]}>
   {metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={key} style={[styles.metric,key==='active'&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
    <View style={[styles.metricIcon,key==='active'&&{backgroundColor:colors.playerControl}]}><Ionicons name={icons[key]} size={19} color={key==='active'?colors.white:colors.primary}/></View>
    <Text style={[styles.metricLabel,key==='active'&&{color:colors.white}]}>{t(key==='pending'?'status_submitted':key)}</Text>
    <Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?presence.stats?.active??'—':key==='gateToday'?gate.stats?.today??'—':metrics[key]}</Text>
   </View>)}
  </View>
  {presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceError')}</Text><Action title={t('retry')} icon="refresh-outline" onPress={presence.retry}/></View>:!presence.stats?<Text style={styles.muted}>{t('loading')}</Text>:null}
  <Text style={styles.muted}>{t('gateHint')}</Text>
  {gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</Text><Action title={t('retry')} onPress={gate.retry}/></View>}
  <SectionHeading title={t('quickActions')} icon="grid-outline"/>
  <QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-outline" onPress={()=>navigation.navigate('AdminPlaces')}/>
  <QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-checkmark-outline" onPress={()=>navigation.navigate('Reviews')}/>
  <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
  <View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('analyticsHint')}</Text></View>
 </Frame>
}
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 13. SỬA — apps/web/src/pages/admin/ContentEditorPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ContentEditorPage.tsx

Giữ bản đang gõ khi có cập nhật từ máy khác.

```tsx
/** FILE NÀY LÀM GÌ: Biên tập năm ngôn ngữ, bản thu URL, dịch/TTS demo và gửi duyệt.
 * /admin/places/:id/content; UC14/14.1/14.2. Không gửi API key hoặc gọi dịch thật.
 * Mỗi bản form giữ expectedRevision; service chặn kết quả dịch cũ ghi đè bản mới. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Field, Status, useUnsaved } from '../../components/admin/AdminUI'
export const audioSource = (url: string) => url.startsWith('demo:') ? '/demo-audio/' + url.slice(5) + '.mp3' : url
export function ContentEditorPage() {
 const state = useAdmin(), t = useAdminText(), { id } = useParams()
 const [language,setLanguage] = useState<Language>('vi'), [dirty,setDirty] = useState(false)
 const fresh = state.data?.places.find(p => p.id === id)
 const snapshot = useRef<ManagedPlace | undefined>(undefined)
 // CHỨC NĂNG: Poll từ máy khác không xóa nội dung chưa lưu.
 if (!dirty || snapshot.current?.id !== id) snapshot.current = fresh
 const place = dirty ? snapshot.current : fresh
 if (state.loading || !place) return <><Feedback state={state} />{!state.loading && <p>{t('error_notFound')}</p>}</>
 return <><div className="admin-page-title"><div><h1>{place.record.canonicalTitle}</h1><p>{t('editorHint')} · {t('revision')}: {place.revision}</p></div><Status value={place.workflow} /></div>
  <p className="admin-demo">{t('mockMedia')}</p>
  <div className="admin-language-tabs">{LANGUAGES.map(l => <button key={l.code} className={language === l.code ? '' : 'secondary'} aria-pressed={language === l.code} onClick={() => { if(!dirty || window.confirm(t('unsaved'))) { setDirty(false); setLanguage(l.code) } }}>{l.label}</button>)}</div>
  <ContentForm key={place.id + language + place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty} />
 </>
}
function ContentForm({ place, language, dirty, setDirty }: { place: ManagedPlace; language: Language; dirty: boolean; setDirty: (value: boolean) => void }) {
 const state = useAdmin(), t = useAdminText(), text = place.record.content[language]
 const [title,setTitle] = useState(text?.title ?? ''), [summary,setSummary] = useState(text?.summary ?? '')
 const [body,setBody] = useState(text?.body ?? ''), [address,setAddress] = useState(text?.address ?? '')
 const [audioUrl,setAudioUrl] = useState(text?.audio?.url.startsWith('demo:') ? '' : text?.audio?.url ?? '')
 useUnsaved(dirty)
 const disabled = state.busy || place.workflow === 'archived'
 return <><Feedback state={state} /><form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
  event.preventDefault(); void state.run(() => state.service.saveContent({ id: place.id, language, expectedRevision: place.revision, title, summary, body, address, audioUrl: audioUrl.trim() || undefined })).then(ok => { if(ok) setDirty(false) })
 }}>
  {/* CHỨC NĂNG: Tách nội dung và âm thanh để người biên tập không bỏ sót bước lưu. */}
  <section className="admin-form-section"><h2><AdminIcon name="content"/>{t('basicInfo')}</h2>
  <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
  <Field label={t('summary')}><textarea value={summary} rows={2} onChange={e => setSummary(e.target.value)} /></Field>
  <Field label={t('address')}><input value={address} onChange={e => setAddress(e.target.value)} /></Field>
  <Field label={t('body')}><textarea value={body} required rows={10} onChange={e => setBody(e.target.value)} /></Field>
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
  <Field label={t('audio')}><input value={audioUrl.startsWith('data:') ? t('localFile') : audioUrl} readOnly={audioUrl.startsWith('data:')} onChange={e => setAudioUrl(e.target.value)} placeholder="https://…/audio.mp3" /></Field>
  <LocalMediaPicker kind="audio" onPick={value => { setAudioUrl(value);setDirty(true) }} />
  {audioUrl.startsWith('data:') && <button type="button" className="secondary" onClick={()=>{setAudioUrl('');setDirty(true)}}>{t('clearFile')}</button>}
  {text?.audio && <div className="admin-audio"><span>{t('preview')}</span><audio controls preload="metadata" src={audioSource(text.audio.url)} /></div>}
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
  <div className="admin-actions"><button disabled={disabled}>{t('save')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || language === 'vi'} onClick={() => { void state.run(() => state.service.translate(place.id, language, place.revision)) }}>{t('translate')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !text?.body} onClick={() => { void state.run(() => state.service.generateAudio(place.id, language, place.revision)) }}>{t('prepare')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !['draft','changes'].includes(place.workflow)} onClick={() => { void state.run(() => state.service.submit(place.id, place.revision)) }}>{t('submit')}</button>
  </div>
  {place.reviewNote && <p className="admin-note">{t('note')}: {place.reviewNote}</p>}
 </section></form></>
}
/* CÁCH KIỂM TRA: Lưu trước khi dịch/tạo audio; đổi tab khi bẩn có hỏi; sửa body xóa audio cũ. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 14. SỬA — apps/mobile/src/screens/admin/ContentEditorScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\ContentEditorScreen.tsx

Giữ nội dung chưa lưu trên mobile; revision cũ sẽ báo conflict.

```tsx
/** FILE NÀY LÀM GÌ: Biên tập 5 ngôn ngữ native, audio URL và dịch/TTS demo.
 * AdminNavigator gọi; UC14/14.1/14.2. Dùng cùng service với web.
 * Form chưa lưu không được gửi duyệt/tạo tác vụ để tránh dùng văn bản cũ. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { Alert,Text,View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Frame,Field,Feedback,PageHeader,SectionHeading,StatusBadge,LanguageTabs,styles,useUnsaved,AudioPreview } from '../../components/admin/AdminUI'
export function ContentEditorScreen({route}:NativeStackScreenProps<AdminStack,'Content'>){
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[dirty,setDirty]=useState(false)
 const fresh=state.data?.places.find(p=>p.id===route.params.id)
 const snapshot=useRef<ManagedPlace|undefined>(undefined)
 // CHỨC NĂNG: Giữ bản đang gõ; server sẽ báo conflict nếu revision bị thay đổi.
 if(!dirty||snapshot.current?.id!==route.params.id)snapshot.current=fresh
 const place=dirty?snapshot.current:fresh
 if(!place)return <Frame><Feedback state={state}/>{!state.loading&&<Text>{t('error_notFound')}</Text>}</Frame>
 const select=(code:Language)=>{const apply=()=>{setDirty(false);setLanguage(code)};if(!dirty)apply();else Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:LANGUAGES.find(l=>l.code===code)?.label,onPress:apply}])}
 return <Frame><PageHeader title={place.record.canonicalTitle} description={t('editorHint')}/>
  <View style={styles.row}><StatusBadge workflow={place.workflow}/><Text style={styles.muted}>{t('revision')} {place.revision}</Text></View>
  <LanguageTabs value={language} onChange={select}/>
  <View style={styles.notice}><Text style={[styles.muted,{flex:1}]}>{t('mockMedia')}</Text></View>
  <ContentForm key={place.id+language+place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty}/>
 </Frame>
}
function ContentForm({place,language,dirty,setDirty}:{place:ManagedPlace;language:Language;dirty:boolean;setDirty:(v:boolean)=>void}){
 const state=useAdmin(),t=useAdminText(),text=place.record.content[language]
 const [title,setTitle]=useState(text?.title??''),[summary,setSummary]=useState(text?.summary??''),[body,setBody]=useState(text?.body??''),[address,setAddress]=useState(text?.address??'')
 const [audioUrl,setAudioUrl]=useState(text?.audio?.url.startsWith('demo:')?'':text?.audio?.url??'')
 useUnsaved(dirty)
 const change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)},disabled=state.busy||place.workflow==='archived'
 return <View style={{gap:16}}><Feedback state={state}/>
  <View style={styles.card}><SectionHeading title={t('basicInfo')} icon="document-text-outline"/>
  <Field label={t('title')} value={title} onChange={change(setTitle)}/><Field label={t('summary')} value={summary} onChange={change(setSummary)} multiline/>
  <Field label={t('address')} value={address} onChange={change(setAddress)}/><Field label={t('body')} value={body} onChange={change(setBody)} multiline/>
  </View>
  <View style={styles.card}><SectionHeading title={t('mediaSection')} icon="musical-notes-outline"/>
  <Field label={t('audio')} value={audioUrl.startsWith('data:')?t('localFile'):audioUrl} editable={!audioUrl.startsWith('data:')} onChange={change(setAudioUrl)}/>
  <LocalMediaPicker kind="audio" onPick={value=>{setAudioUrl(value);setDirty(true)}}/>
  {audioUrl.startsWith('data:')&&<Action title={t('clearFile')} onPress={()=>{setAudioUrl('');setDirty(true)}}/>}
  {text?.audio&&<AudioPreview url={text.audio.url} title={text.title}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={disabled} onPress={()=>{void state.run(()=>state.service.saveContent({id:place.id,language,expectedRevision:place.revision,title,summary,address,body,audioUrl:audioUrl.trim()||undefined})).then(ok=>{if(ok)setDirty(false)})}}/>
  <Action title={t('translate')} disabled={disabled||dirty||language==='vi'} onPress={()=>{void state.run(()=>state.service.translate(place.id,language,place.revision))}}/>
  <Action title={t('prepare')} disabled={disabled||dirty||!text?.body} onPress={()=>{void state.run(()=>state.service.generateAudio(place.id,language,place.revision))}}/>
  <Action title={t('submit')} icon="paper-plane-outline" disabled={disabled||dirty||!['draft','changes'].includes(place.workflow)} onPress={()=>{void state.run(()=>state.service.submit(place.id,place.revision))}}/>
  {!!place.reviewNote&&<Text style={styles.text}>{place.reviewNote}</Text>}
  </View>
 </View>
}
/* CÁCH KIỂM TRA: Lưu body mới bỏ audio cũ; tác vụ sai revision báo conflict, không ghi đè. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 15. SỬA — apps/web/src/pages/admin/PlaceFormPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\PlaceFormPage.tsx

Giữ metadata và expectedRevision cùng bản khi mở form.

```tsx
/** FILE NÀY LÀM GÌ: Tạo/sửa metadata di tích, ảnh và tọa độ xác nhận.
 * /admin/places/new hoặc /:id/edit; UC13. Validation/service ở admin-core.
 * Ảnh dùng URL/mã asset trong bản FE; API upload sẽ được nối qua media service. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { PlaceImage } from '../../components/PlaceImage'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES, categoryOf } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../i18n'
import { Feedback, Field, useUnsaved, useConfirmation } from '../../components/admin/AdminUI'
export function PlaceFormPage() {
 const state = useAdmin(), { id } = useParams(), t = useAdminText()
 const place = state.data?.places.find(p => p.id === id)
 if (state.loading) return <Feedback state={state} />
 if (id && !place) return <p>{t('error_notFound')}</p>
 return <PlaceForm key={id ?? 'new'} initial={place} />
}
function PlaceForm({ initial }: { initial?: ManagedPlace }) {
 const [opened] = useState(initial)
 const state = useAdmin(), t = useAdminText(), visitorText = useText(), navigate = useNavigate(), confirmation = useConfirmation()
 const [title,setTitle] = useState(opened?.record.canonicalTitle ?? '')
 const [category,setCategory] = useState<Category>(opened ? categoryOf(opened.record) : 'palace')
 const [period,setPeriod] = useState(opened?.period ?? '')
 const [lat,setLat] = useState(opened?.record.position?.lat.toString() ?? '')
 const [lng,setLng] = useState(opened?.record.position?.lng.toString() ?? '')
 const [verified,setVerified] = useState(opened?.record.position?.verified ?? false)
 const [images,setImages] = useState(opened?.record.images.join('\n') ?? '')
 const [dirty,setDirty] = useState(false); useUnsaved(dirty)
 return <><div className="admin-page-title"><div><h1>{t(opened ? 'edit' : 'new')}</h1><p>{t('catalogHint')}</p></div></div><Feedback state={state} />
  <form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
   event.preventDefault()
   void state.run(() => state.service.savePlace({ id: opened?.id, expectedRevision: opened?.revision, title, category, period, lat, lng, verified,
    images: images.split('\n').map(s => s.trim()).filter(Boolean) })).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
  }}>
   {/* CHỨC NĂNG: Nhóm tên, danh mục và thời kỳ để nhập theo từng bước. */}
   <section className="admin-form-section"><h2><AdminIcon name="places"/>{t('basicInfo')}</h2>
   <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
   <Field label={t('category')}><select value={category} onChange={e => setCategory(e.target.value as Category)}>{CATEGORIES.map(c => <option key={c} value={c}>{visitorText(`category_${c}`)}</option>)}</select></Field>
   <Field label={t('period')}><input value={period} onChange={e => setPeriod(e.target.value)} /></Field>
   </section>
   <section className="admin-form-section"><h2><AdminIcon name="pin"/>{t('locationSection')}</h2>
   <div className="admin-two"><Field label={t('lat')}><input inputMode="decimal" value={lat} onChange={e => setLat(e.target.value)} /></Field><Field label={t('lng')}><input inputMode="decimal" value={lng} onChange={e => setLng(e.target.value)} /></Field></div>
   <label className="admin-check"><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />{t('verified')}</label>
   </section>
   {/* CHỨC NĂNG: Xem trước ảnh đầu tiên; PlaceImage vẫn xử lý ảnh lỗi. */}
   <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
   {images.split('\n').find(s=>s.trim())&&<div className="admin-image-preview"><PlaceImage uri={images.split('\n').find(s=>s.trim())?.trim()} title={title}/></div>}
   <Field label={t('images')}><textarea rows={4} value={images.split('\n').filter(s => !s.startsWith('data:')).join('\n')} onChange={e => setImages([...images.split('\n').filter(s => s.startsWith('data:')), e.target.value].filter(Boolean).join('\n'))} /></Field>
   <LocalMediaPicker kind="image" onPick={value => { setImages(old => [old,value].filter(Boolean).join('\n')); setDirty(true) }} />
   {images.includes('data:') && <button type="button" className="secondary" onClick={() => {setImages(images.split('\n').filter(s => !s.startsWith('data:')).join('\n'));setDirty(true)}}>{t('clearFile')}</button>}
   </section>
   <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
   <div className="admin-actions"><button disabled={state.busy || opened?.workflow === 'archived'}>{state.busy ? t('loading') : t('save')}</button>
    <button type="button" className="secondary" onClick={() => { if (!dirty || window.confirm(t('unsaved'))) navigate('/admin/places') }}>{t('cancel')}</button>
    {opened && opened.workflow !== 'archived' && <button type="button" className="secondary" disabled={state.busy} onClick={() => {
     if (window.confirm(t('confirmArchive'))) void state.run(() => state.service.archive(opened.id, opened.revision)).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
    }}>{t('archive')}</button>}
    {/* CHỨC NĂNG: Nút xóa riêng, không gửi form và không tự thực hiện khi mở màn.
        XỬ LÝ: Cần xác nhận đúng tên điểm; chỉ quay về danh sách sau khi ghi thành công. */}
    {opened && <button type="button" className="admin-delete" disabled={state.busy} onClick={() => {
      confirmation.ask(t('confirmDelete') + '\n' + opened.record.canonicalTitle, () => {
        void state.run(() => state.service.deletePlace(opened.id, opened.revision)).then(ok => {
          if (ok) { setDirty(false); navigate('/admin/places') }
        })
      })
    }}>{t('delete')}</button>}
   </div></section>
  </form>
  {confirmation.dialog}
 </>
}
/* CÁCH KIỂM TRA: Không lưu tọa độ ngoài Huế/URL nguy hiểm; sửa metadata không đổi bản public. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 16. SỬA — apps/mobile/src/screens/admin/PlaceFormScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\PlaceFormScreen.tsx

Giữ metadata và revision trên mobile để tránh ghi đè từ xa.

```tsx
/** FILE NÀY LÀM GÌ: Metadata native tương đương biểu mẫu web.
 * AdminNavigator gọi; UC13. Dùng cùng validatePlace/revision qua service. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { Alert,Pressable,Switch,Text,View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CATEGORIES,categoryOf } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../i18n'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Cover } from '../../components/Cover'
import { colors } from '../../theme'
import { Frame,Field,Feedback,PageHeader,SectionHeading,DangerAction,styles,useUnsaved } from '../../components/admin/AdminUI'
type Props=NativeStackScreenProps<AdminStack,'PlaceForm'>
export function PlaceFormScreen(props:Props){const state=useAdmin(),t=useAdminText(),id=props.route.params?.id,place=state.data?.places.find(p=>p.id===id)
 if(state.loading)return <Frame><Feedback state={state}/></Frame>
 if(id&&!place)return <Frame><Text>{t('error_notFound')}</Text></Frame>
 return <Form key={id??'new'} initial={place} navigation={props.navigation}/>
}
function Form({initial,navigation}:{initial?:ManagedPlace;navigation:Props['navigation']}){
 const [opened] = useState(initial)
 const state=useAdmin(),t=useAdminText(),vt=useText()
 const [title,setTitle]=useState(opened?.record.canonicalTitle??''),[category,setCategory]=useState<Category>(opened?categoryOf(opened.record):'palace')
 const [period,setPeriod]=useState(opened?.period??''),[lat,setLat]=useState(opened?.record.position?.lat.toString()??''),[lng,setLng]=useState(opened?.record.position?.lng.toString()??'')
 const [verified,setVerified]=useState(opened?.record.position?.verified??false),[images,setImages]=useState(opened?.record.images.join('\n')??''),[dirty,setDirty]=useState(false)
 const allowLeave=useUnsaved(dirty),change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)}
 return <Frame><PageHeader title={t(opened?'edit':'new')} description={t('catalogHint')}/><Feedback state={state}/>
  {/* CHỨC NĂNG: Chia metadata thành nhóm rõ ràng, không đổi state và validate của service. */}
  <View style={styles.card}>
   <SectionHeading title={t('basicInfo')} icon="business-outline"/>
   <Field label={t('title')} value={title} onChange={change(setTitle)}/>
   <Text style={styles.label}>{t('category')}</Text>
   <View style={styles.row}>{CATEGORIES.map(c=><Pressable key={c} accessibilityRole="button" accessibilityLabel={vt(`category_${c}`)} accessibilityState={{selected:category===c}}
    onPress={()=>{setCategory(c);setDirty(true)}} style={[styles.languageChip,category===c&&{backgroundColor:colors.soft,borderColor:colors.primary}]}>
    <Text style={{color:category===c?colors.primary:colors.muted,fontSize:12,fontWeight:'600'}}>{vt(`category_${c}`)}</Text>
   </Pressable>)}</View>
   <Field label={t('period')} value={period} onChange={change(setPeriod)}/>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('locationSection')} icon="location-outline"/>
   <View style={{flexDirection:'row',gap:10}}>
    <View style={{flex:1,minWidth:0}}><Field label={t('lat')} value={lat} onChange={change(setLat)}/></View>
    <View style={{flex:1,minWidth:0}}><Field label={t('lng')} value={lng} onChange={change(setLng)}/></View>
   </View>
   <View style={[styles.row,{flexWrap:'nowrap',justifyContent:'space-between'}]}>
    <Text style={[styles.label,{flex:1}]}>{t('verified')}</Text>
    <Switch accessibilityLabel={t('verified')} trackColor={{false:colors.border,true:colors.primary}} thumbColor={colors.white} value={verified} onValueChange={value=>{setVerified(value);setDirty(true)}}/>
   </View>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('mediaSection')} icon="images-outline"/>
   {!!images.trim()&&<Cover uri={images.split('\n').map(value=>value.trim()).find(Boolean)} style={{height:160,borderRadius:14}}/>}
   <Field label={t('images')} multiline value={images.split('\n').filter(s=>!s.startsWith('data:')).join('\n')} onChange={value=>{setImages([...images.split('\n').filter(s=>s.startsWith('data:')),value].filter(Boolean).join('\n'));setDirty(true)}}/>
   <LocalMediaPicker kind="image" onPick={value=>{setImages(old=>[old,value].filter(Boolean).join('\n'));setDirty(true)}}/>
   {images.includes('data:')&&<Action title={t('clearFile')} onPress={()=>{setImages(images.split('\n').filter(s=>!s.startsWith('data:')).join('\n'));setDirty(true)}}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={state.busy||opened?.workflow==='archived'} onPress={()=>{void state.run(()=>state.service.savePlace({id:opened?.id,expectedRevision:opened?.revision,title,category,period,lat,lng,verified,images:images.split('\n').map(s=>s.trim()).filter(Boolean)})).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}/>
  {opened&&opened.workflow!=='archived'&&<Action title={t('archive')} disabled={state.busy} onPress={()=>Alert.alert(t('archive'),t('confirmArchive'),[{text:t('cancel'),style:'cancel'},{text:t('archive'),style:'destructive',onPress:()=>{void state.run(()=>state.service.archive(opened.id,opened.revision)).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}])}/>}
  {/* CHỨC NĂNG: Xóa hẳn cả điểm đã lưu trữ; không xóa khi chưa xác nhận. */}
  {opened && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [
    {text:t('cancel'),style:'cancel'},
    {text:t('delete'),style:'destructive',onPress:()=>{
      void state.run(()=>state.service.deletePlace(opened.id,opened.revision)).then(ok=>{
        if(ok){allowLeave();navigation.goBack()}
      })
    }},
  ])} />}
  </View>
 </Frame>
}
/* CÁCH KIỂM TRA: Back form bẩn có hỏi; lưu lỗi giữ giá trị; thêm mới không xuất hiện public trước duyệt. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 17. TẠO MỚI — apps/web/src/hooks/useGateEntry.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\hooks\useGateEntry.ts

Nhận nguồn QR cổng; giữ ID trong phiên trình duyệt.

```typescript
/** FILE NÀY LÀM GÌ: Ghi lượt mở từ QR cổng trên web, chỉ ở bản du khách.
 * usePresenceHeartbeat gọi; phụ thuộc URL router, sessionStorage và gate client.
 * UC05/UC17. Một ID trong phiên trình duyệt để refresh/React StrictMode không đếm lặp. */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sendGateEntry } from '@travelguide/admin-core'
import { visitorGateClient } from '../services/admin/services'
let visitId: string | undefined
function id() {
 if(visitId)return visitId
 const fresh='gate_web_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
 try {const old=sessionStorage.getItem('hue-gate-visit');visitId=old&&/^[-_a-zA-Z0-9]{20,100}$/.test(old)?old:fresh;sessionStorage.setItem('hue-gate-visit',visitId)}catch{visitId=fresh}
 return visitId
}
export function useGateEntry(){const {pathname,search}=useLocation()
 useEffect(()=>{
  // CHỨC NĂNG: Chỉ QR do nhân viên cấp có entry=gate mới được ghi nhận.
  // XỬ LÝ: Mở web thường hoặc mở Admin không tăng; API lỗi retry không làm đếm lặp.
  if(pathname!=='/'||search!=='?entry=gate')return
  return sendGateEntry(visitorGateClient,id(),'web')
 },[pathname,search])
}
/* CÁCH KIỂM TRA: Mở / không tăng; /?entry=gate tăng một; refresh vẫn một; tab phiên mới có thể tăng. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 18. TẠO MỚI — apps/mobile/src/hooks/useGateEntry.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\hooks\useGateEntry.ts

Nhận link HTTPS khi mở app hoặc app đang chạy, gửi cùng ID phiên app.

```typescript
/** FILE NÀY LÀM GÌ: Nhận link QR cổng khi app mở hoặc đang chạy và báo lượt qua API chung.
 * usePresenceHeartbeat gọi; phụ thuộc React Native Linking và cấu hình webOrigin.
 * UC05/UC17. Chỉ chạy phía du khách; bản Admin không tự tăng lượt. */
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { sendGateEntry } from '@travelguide/admin-core'
import { visitorGateClient } from '../services/admin/services'
import { webOrigin } from '../services/platform'
const visitId='gate_app_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
export function useGateEntry(enabled:boolean){
 useEffect(()=>{if(!enabled)return
  let alive=true;let stop:(()=>void)|undefined
  const receive=(url:string|null)=>{
   if(!alive||!url)return
   try {const value=new URL(url);if(value.search!=='?entry=gate'||value.pathname!=='/'||value.origin!==webOrigin)return
    // CHỨC NĂNG: Giữ cùng ID suốt lần chạy app để sự kiện link lặp không tăng lượt.
    stop?.();stop=sendGateEntry(visitorGateClient,visitId,'mobile-app')
   }catch{/* Link sai không làm gián đoạn ứng dụng. */}
  }
  void Linking.getInitialURL().then(receive).catch(()=>{})
  const subscription=Linking.addEventListener('url',event=>receive(event.url))
  return()=>{alive=false;stop?.();subscription.remove()}
 },[enabled])
}
/* CÁCH KIỂM TRA: App cài riêng nhận link HTTPS vào cổng; mở từ icon/Expo không tăng lượt QR. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 19. SỬA — apps/web/src/hooks/usePresenceHeartbeat.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\hooks\usePresenceHeartbeat.ts

Gọi hook QR chỉ trong bản du khách; giữ heartbeat đang có.

```typescript
import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Báo phiên du khách web đang mở và ở foreground.
 * App.tsx gọi duy nhất một lần; bản main-admin không gọi. Phụ thuộc sessionStorage, Visibility API và service.
 */
import { useEffect } from 'react'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Giữ mã ẩn danh khi reload, không dùng tên/IP/tài khoản.
// XỬ LÝ: Nếu trình duyệt chặn storage, dùng mã trong RAM của trang; đây không phải token xác thực.
let sessionId: string | undefined
function getSessionId() {
  if (sessionId) return sessionId
  const fresh = 'web_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  try {
    const saved = sessionStorage.getItem('hue-presence-session')
    sessionId = saved && /^[a-zA-Z0-9_-]{20,100}$/.test(saved) ? saved : fresh
    sessionStorage.setItem('hue-presence-session', sessionId)
  } catch { sessionId = fresh }
  return sessionId
}
export function usePresenceHeartbeat() {
  useGateEntry()
  useEffect(() => {
    let stop: (() => void) | undefined
    const update = () => {
      stop?.(); stop = undefined
      if (document.visibilityState === 'visible') {
        stop = startPresenceHeartbeat(presenceClient, { sessionId: getSessionId(), platform: 'web' })
      }
    }
    // CHỨC NĂNG: Tab ẩn/ngủ không gửi heartbeat; quay lại gửi ngay.
    // XỬ LÝ: Rời trang mất tối đa 90 giây để hết hạn; không dựa vào unload vốn không đảm bảo trên điện thoại.
    update()
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pageshow', update)
    const hide = () => { stop?.(); stop = undefined }
    window.addEventListener('pagehide', hide)
    return () => {
      hide(); document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pageshow', update); window.removeEventListener('pagehide', hide)
    }
  }, [])
}
/* CÁCH KIỂM TRA: Reload không tăng phiên; ẩn tab quá 90 giây hết active; mở riêng admin không tăng. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 20. SỬA — apps/mobile/src/hooks/usePresenceHeartbeat.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\hooks\usePresenceHeartbeat.ts

Gọi hook QR trong luồng du khách được bật; giữ heartbeat native.

```typescript
import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Gửi heartbeat cho phiên native đang ở foreground và không mở admin.
 * RootNavigator gọi; phụ thuộc AppState và service presence. Không gửi tọa độ hoặc dữ liệu cá nhân.
 */
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Một mã cho một lần chạy app, không phải danh tính hoặc token bảo mật.
const sessionId = 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
export function usePresenceHeartbeat(enabled: boolean) {
  useGateEntry(enabled)
  useEffect(() => {
    const client = presenceClient
    if (!enabled || !client) return
    let stop: (() => void) | undefined
    const update = () => {
      stop?.(); stop = undefined
      if (AppState.currentState === 'active') stop = startPresenceHeartbeat(client, { sessionId, platform: 'mobile-app' })
    }
    // CHỨC NĂNG: Về nền dừng gửi; trở lại gửi ngay, không tạo thêm phiên.
    // XỬ LÝ: Cleanup gỡ listener và timer, request đang chạy có timeout 5 giây.
    const subscription = AppState.addEventListener('change', update)
    update()
    return () => { stop?.(); subscription.remove() }
  }, [enabled])
}
/* CÁCH KIỂM TRA: Mở app tăng nhóm mobile; vào admin/ngủ quá 90 giây giảm; lỗi mạng không crash. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 21. SỬA — packages/visitor-core/src/qr.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\qr.ts

Cho đúng query entry=gate tại trang chủ; query lạ vẫn bị từ chối.

```typescript
/**
 * FILE NÀY LÀM GÌ:
 * Phân biệt QR vào chung và QR một địa điểm theo UC05 v1.3.
 * Scanner mobile và trang QR web sử dụng.
 * Không tự mở URL ngoài hệ thống.
 */

export type QrPolicy = {
  allowedOrigins: readonly string[]
  allowHttp: boolean
}

export type QrTarget =
  | { kind: 'home' }
  | { kind: 'place'; id: string }

export function validPlaceId(id: string): boolean {
  return id.length <= 80
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
}

// CHỨC NĂNG: Kiểm tra payload trước khi điều hướng.
// XỬ LÝ: Kiểm tra raw trước URL() để không bỏ qua đường dẫn /../.
export function parseQrTarget(
  raw: string,
  policy: QrPolicy,
): QrTarget {
  const value = raw.trim()

  if (
    raw.length > 2048
    || value.includes('%')
    || value.includes('\\')
    || Array.from(value).some(
      (character) => character.charCodeAt(0) <= 32,
    )
    || /\/\.{1,2}(?:\/|$)/.test(value)
  ) {
    throw new Error('invalidQr')
  }

  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error('invalidQr')
  }

  // CHỨC NĂNG: QR cổng được phép mang đúng dấu nguồn entry=gate ở trang chủ.
  // XỬ LÝ: Query khác và query trên địa điểm vẫn bị từ chối.
  if (url.username || url.password || (url.search && !(url.pathname === '/' && url.search === '?entry=gate')) || url.hash) {
    throw new Error('invalidQr')
  }

  let path: string

  if (
    url.protocol === 'hueguide:'
    && url.hostname === 'places'
    && !url.port
  ) {
    path = '/places' + url.pathname
  } else {
    const allowedProtocol =
      url.protocol === 'https:'
      || (policy.allowHttp && url.protocol === 'http:')

    if (
      !allowedProtocol
      || !policy.allowedOrigins.includes(url.origin)
    ) {
      throw new Error('invalidQr')
    }

    path = url.pathname
  }

  // CHỨC NĂNG: Chấp nhận QR vào chung không có ID.
  // XỬ LÝ: Chỉ root hoặc /places là trang vào chung hợp lệ.
  if (
    path === '/'
    || path === '/places'
    || path === '/places/'
  ) {
    return { kind: 'home' }
  }

  const match =
    /^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path)

  if (!match || !validPlaceId(match[1])) {
    throw new Error('invalidQr')
  }

  return {
    kind: 'place',
    id: match[1],
  }
}

// CHỨC NĂNG: Giữ API cũ cho nơi chỉ nhận QR của một điểm.
// XỬ LÝ: Chỗ cần nhận QR chung phải dùng parseQrTarget.
export function parsePlaceQr(
  raw: string,
  policy: QrPolicy,
): string {
  const target = parseQrTarget(raw, policy)

  if (target.kind !== 'place') {
    throw new Error('invalidQr')
  }

  return target.id
}

// CHỨC NĂNG: Tạo URL để mã hóa thành QR.
// XỬ LÝ: ID phải đúng định dạng trước khi ghép URL.
export function placeUrl(origin: string, id: string): string {
  if (!validPlaceId(id)) throw new Error('invalidQr')

  return new URL('/places/' + id, origin).toString()
}
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 22. TẠO MỚI — scripts/start-catalog.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\scripts\start-catalog.cjs

Chạy RAM qua LAN và cập nhật URL API mobile theo IP máy tính.

```javascript
/** FILE NÀY LÀM GÌ: Chạy mock API RAM cho demo cùng Wi-Fi và cấu hình URL Admin mobile.
 * npm run catalog:start gọi; không cài DB hay thư viện mới.
 * Chỉ cập nhật hai khóa catalog; không động vào token, ngôn ngữ hoặc target app. */
const os=require('node:os'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process')
const root=path.resolve(__dirname,'..')
const interfaces=Object.values(os.networkInterfaces()).flat().filter(x=>x&&x.family==='IPv4'&&!x.internal&&!x.address.startsWith('169.254.'))
const address=process.env.CATALOG_LAN_IP||interfaces.find(x=>/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(x.address))?.address
if(!address){console.error('Chưa tìm được IP LAN. Kết nối Wi-Fi hoặc đặt CATALOG_LAN_IP.');process.exit(1)}
const file=path.join(root,'apps/mobile/.env');let text=fs.existsSync(file)?fs.readFileSync(file,'utf8'):''
// CHỨC NĂNG: Giữ URL triển khai riêng; chỉ tự cập nhật địa chỉ LAN cũ/mặc định.
for(const key of ['EXPO_PUBLIC_ADMIN_API_URL','EXPO_PUBLIC_CATALOG_API_URL','EXPO_PUBLIC_ADMIN_PRESENCE_API_URL']){
 const expression=new RegExp('^'+key+'=(.*)$','m'),old=text.match(expression)?.[1]?.trim()
 if(!old||/^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(old)){
  text=text.split(/\r?\n/).filter(line=>!line.startsWith(key+'=')).join('\n').trimEnd()+'\n'+key+'=http://'+address+':'+(process.env.CATALOG_PORT||8788)+(key==='EXPO_PUBLIC_ADMIN_PRESENCE_API_URL'?'/presence':'')+'\n'
 }
}
fs.writeFileSync(file,text)
console.log('URL Admin mobile: http://'+address+':'+(process.env.CATALOG_PORT||8788)+' — restart Expo sau khi đổi .env')
const child=spawn(process.execPath,[path.join(root,'services/catalog/server.cjs')],{cwd:root,env:{...process.env,CATALOG_HOST:process.env.CATALOG_HOST||'0.0.0.0'},stdio:'inherit',windowsHide:true})
child.on('error',error=>{console.error(error.message);process.exitCode=1});child.on('exit',code=>{process.exitCode=code||0})
/* CÁCH KIỂM TRA: Cùng mạng mở /version bằng IP trên điện thoại; Expo tải lại để dùng URL mới. */
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 23. SỬA — scripts/create-public-qr.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\scripts\create-public-qr.cjs

Tạo QR có dấu nguồn cổng và cấu hình catalog native qua tunnel.

```javascript
/**
 * FILE NÀY LÀM GÌ: Tạo QR website HTTPS dùng chung cho mọi thiết bị.
 * npm run qr:create gọi; dùng qrcode đã có trong apps/web, không thêm thư viện.
 * --configure cập nhật đúng một biến URL trong .env mobile và .env.local web.
 * Liên quan UC05; file ảnh và bản sao cấu hình chỉ nằm trong .qr-output đã ignore.
 */
const { fetchQrPage } = require('./qr-http.cjs')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')

// CHỨC NĂNG: Chỉ tạo QR HTTPs website, tuyệt đối không tạo QR Expo.
// XỬ LÝ: Từ chối localhost, tài khoản, query và đường dẫn riêng của địa điểm.
function sharedEntryUrl(raw) {
  const url = new URL(raw)
  if (url.protocol !== 'https:' || url.username || url.password || url.search
    || url.hash || url.pathname !== '/' || url.hostname === 'localhost'
    || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.example')
    || url.hostname.startsWith('127.') || url.hostname === '[::1]') {
    throw new Error('QR công khai phải chứa origin HTTPS thật, không dùng exp:// hoặc localhost')
  }
  return url.origin + '/'
}

// CHỨC NĂNG: Thay đúng biến URL, giữ nguyên cấu hình khác của người dùng.
// XỬ LÝ: Bỏ dòng trùng khóa và tạo bản sao trước khi ghi file .env đã có.
function setVariable(file, key, value, backup) {
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  const lines = (previous || '').split(/\r?\n/).filter((line) => !new RegExp('^\\s*' + key + '\\s*=').test(line))
  if (previous !== null) fs.writeFileSync(backup, previous)
  fs.writeFileSync(file, lines.join('\n').trimEnd() + '\n' + key + '=' + value + '\n')
}

// CHỨC NĂNG: Không tạo ảnh QR trỏ vào website đã chết hoặc trang lỗi tunnel.
// XỬ LÝ: Timeout 10 giây, yêu cầu HTML đúng entry du khách; không bỏ kiểm tra TLS.
async function verifyWebsite(href, fetcher = fetchQrPage) {
  const response = await fetcher(href, { signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error('Website QR chưa sẵn sàng (HTTP ' + response.status + '). Chạy npm run demo:public để tạo lại link.')
  const html = await response.text()
  if (!/id=["']root["']/.test(html) || !/src=["']\/(?:assets\/[^"']+\.js|src\/main\.tsx)["']/.test(html)) {
    throw new Error('URL không trả về trang du khách hợp lệ; chưa ghi ảnh QR.')
  }
}

async function main(args) {
  const index = args.indexOf('--url')
  const href = sharedEntryUrl(index >= 0 ? args[index + 1] : '')
  await verifyWebsite(href)
  const root = path.resolve(__dirname, '..')
  const folder = path.join(root, '.qr-output')
  const webRequire = createRequire(path.join(root, 'apps/web/package.json'))
  const QRCode = webRequire('qrcode')
  fs.mkdirSync(folder, { recursive: true })

  if (args.includes('--configure')) {
    // CHỨC NĂNG: Web đọc URL QR ở runtime, không chờ Vite nạp lại .env.
    // XỬ LÝ: URL public không phải bí mật; điện thoại mở HTTPS dùng chính origin đang mở.
    fs.mkdirSync(path.join(root, 'apps/web/static'), { recursive: true })
    fs.writeFileSync(path.join(root, 'apps/web/static/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    // CHỨC NĂNG: Đồng bộ URL runtime cho preview đã build và localhost dev.
    // XỬ LÝ: Không rebuild thêm chỉ để thay origin; hai bản luôn tạo cùng QR.
    if (fs.existsSync(path.join(root, 'apps/web/dist'))) {
      fs.writeFileSync(path.join(root, 'apps/web/dist/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    }
    // CHỨC NĂNG: Danh mục du khách native đi qua cùng tunnel; API Admin vẫn giữ LAN riêng.
    const catalogEnv = path.join(root, 'apps/mobile/.env')
    const catalogUrl = fs.existsSync(catalogEnv) ? fs.readFileSync(catalogEnv, 'utf8').match(/^EXPO_PUBLIC_CATALOG_API_URL=(.*)$/m)?.[1]?.trim() : null
    if (!catalogUrl || /^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(catalogUrl) || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/catalog\/?$/.test(catalogUrl)) {
      setVariable(catalogEnv, 'EXPO_PUBLIC_CATALOG_API_URL', new URL(href).origin + '/api/catalog', path.join(folder, 'mobile-catalog-env-before-' + Date.now() + '.txt'))
    }
    const stamp = Date.now()
    setVariable(path.join(root, 'apps/web/.env.local'), 'VITE_PUBLIC_SITE_URL', new URL(href).origin,
      path.join(folder, 'web-env-before-' + stamp + '.txt'))
    setVariable(path.join(root, 'apps/mobile/.env'), 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', new URL(href).origin,
      path.join(folder, 'mobile-env-before-' + stamp + '.txt'))
    // CHỨC NĂNG: Native du khách báo phiên qua cùng tunnel, không cần mở cổng RAM công khai.
    // XỬ LÝ: Chỉ tự điền khi chưa có URL hoặc đang dùng tunnel cũ; giữ nguyên API riêng người dùng đã cấu hình.
    const mobileEnv = path.join(root, 'apps/mobile/.env')
    const presenceUrl = fs.readFileSync(mobileEnv, 'utf8').match(/^EXPO_PUBLIC_PRESENCE_API_URL=(.*)$/m)?.[1]?.trim()
    if (!presenceUrl || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/presence\/?$/.test(presenceUrl)) {
      setVariable(mobileEnv, 'EXPO_PUBLIC_PRESENCE_API_URL', new URL(href).origin + '/api/presence',
        path.join(folder, 'mobile-presence-env-before-' + stamp + '.txt'))
    }
  }

  // CHỨC NĂNG: Xuất ảnh QR chứa cùng URL đang cấu hình trên mobile/web.
  // XỬ LÝ: Người nhận quét PNG bằng camera thường; không phải đăng nhập Expo.
  // CHỨC NĂNG: Gắn nguồn cổng để không đếm lượt mở website thông thường.
  const gateHref = href + '?entry=gate'
  const png = path.join(folder, 'shared-qr.png')
  await QRCode.toFile(png, gateHref, { width: 640, margin: 4, errorCorrectionLevel: 'M' })
  fs.writeFileSync(path.join(folder, 'shared-url.txt'), gateHref + '\n')
  console.log('Website:', gateHref)
  console.log('QR:', png)
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
module.exports = { sharedEntryUrl, setVariable, verifyWebsite }
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 24. SỬA — scripts/start-public-demo.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\scripts\start-public-demo.cjs

Khởi động API nếu thiếu; kiểm tra API công khai trước khi cấp QR.

```javascript
/**
 * FILE NÀY LÀM GÌ: Mở Vite/tunnel HTTPS và chỉ công bố QR đã kiểm tra được.
 * npm run demo:public gọi; phụ thuộc cloudflared và create-public-qr.cjs.
 * UC05: QR chung mở website, không yêu cầu Expo Go/tài khoản du khách.
 */
const fs = require('node:fs')
const { readWithPublicDns } = require('./qr-http.cjs')
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn, spawnSync } = require('node:child_process')
const { setTimeout: delay } = require('node:timers/promises')

const root = path.resolve(__dirname, '..')
const folder = path.join(root, '.qr-output')
const stateFile = path.join(folder, 'demo-session.json')
const previewPort = process.env.PUBLIC_PREVIEW_PORT || '4173'
const local = 'http://127.0.0.1:' + previewPort
// CHỨC NĂNG: QR chỉ phục vụ bản đã build, không đưa hàng trăm module dev qua tunnel.
const isBuiltGuidePage = text => typeof text === 'string' && /<title>HueGuide<\/title>/.test(text) && /id=["']root["']/.test(text) && /src=["']\/assets\/[^"']+\.js["']/.test(text) && !text.includes('/@vite/client')
const builtEntry = text => isBuiltGuidePage(text) ? text.match(/src=["'](\/assets\/[^"']+\.js)["']/)?.[1] : null
// CHỨC NĂNG: Kiểm tra đúng file sau khi sắp xếp services; test bắt đường dẫn cũ.
const GUIDE_MODULE_PATH = '/src/services/platform.ts'
const isGuideModule = text => typeof text === 'string' && !/<html|<!doctype/i.test(text) && text.includes('publicSiteOrigin') && text.includes('siteOrigin')
const isGuidePage = text => typeof text === 'string' && /id=["']root["']/.test(text) && text.includes('/src/main.tsx')

// CHỨC NĂNG: Tên miền tunnel mới có thể bị cache DNS âm trên Windows.
// XỬ LÝ: Chỉ lần kiểm tra HTTPS thử DNS công khai khi ENOTFOUND;
// không đổi DNS của máy, không bỏ kiểm tra chứng chỉ TLS hoặc hostname.
async function read(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok && process.env.QR_DEBUG) console.log('HTTP', response.status, url)
    return response.ok ? await response.text() : null
  } catch (error) { if (error.cause?.code === 'ENOTFOUND' && new URL(url).hostname.endsWith('.trycloudflare.com')) return readWithPublicDns(url); if (process.env.QR_DEBUG) console.log('NETWORK', url, error.cause?.code || error.message); return null }
}
// CHỨC NĂNG: Kiểm tra HTML production và bundle JS thật, không nhận HTML fallback.
// XỬ LÝ: So tên asset với dist hiện tại để không tái dùng server đang giữ bản cũ.
async function probe(origin, configured = false) {
  const page = await read(origin + '/')
  const entry = builtEntry(page)
  const expected = fs.existsSync(path.join(root, 'apps/web/dist/index.html'))
    ? builtEntry(fs.readFileSync(path.join(root, 'apps/web/dist/index.html'), 'utf8')) : null
  if (!entry || entry !== expected) return false
  const bundle = await read(origin + entry)
  if (!bundle || /<html|<!doctype/i.test(bundle.slice(0, 100))) return false
  // CHỨC NĂNG: QR chỉ được cấp khi catalog RAM thực sự truy cập qua proxy.
  try { const version=JSON.parse(await read(origin+'/api/catalog/version')); if(typeof version?.version!=='string')return false } catch {return false}
  if (!configured) return true
  try { const config = JSON.parse(await read(origin + '/visitor-config.json')); return config?.publicSiteOrigin === origin }
  catch { return false }
}
// CHỨC NĂNG: Giữ server/tunnel chạy nền khi lệnh tạo QR hoàn tất.
// XỬ LÝ: Ẩn cửa sổ phụ; chỉ dọn tiến trình do lần gọi này tạo khi thất bại.
function launch(command, args, cwd, name) {
  const log = path.join(folder, name + '-' + Date.now() + '.log')
  const descriptor = fs.openSync(log, 'a')
  try {
    const child = spawn(command, args, { cwd, detached: true, windowsHide: true, stdio: ['ignore', descriptor, descriptor] })
    child.unref()
    return { child, log }
  } finally { fs.closeSync(descriptor) }
}
function configureQr(origin) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr.cjs'), '--url', origin, '--configure'],
    { cwd: root, encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) throw new Error(result.stderr || 'Không tạo được QR')
  process.stdout.write(result.stdout)
}
function publish(state) {
  fs.writeFileSync(stateFile, JSON.stringify({ ...state, verifiedAt: new Date().toISOString() }, null, 2))
  fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'),
    'QR chung: shared-qr.png\nURL: ' + state.origin + '/?entry=gate\n\nĐây là URL demo tạm thời. Máy tính và tunnel phải đang chạy, có Internet.\nNếu QR cũ không mở được: chạy npm run demo:public tại gốc dự án, rồi dùng ảnh QR mới.\nMuốn dùng một URL lâu dài cần triển khai web/tên miền cố định.\n')
  fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR vào Kinh thành Huế</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f1f5fb;color:#102950;margin:0;padding:32px 16px;text-align:center}main{max-width:520px;margin:auto;background:white;border-radius:24px;padding:28px;box-shadow:0 16px 60px #10295012}img{width:min(100%,360px)}a{color:#075ed4;overflow-wrap:anywhere}p{color:#576886}</style><main><h1>Khám phá Kinh thành Huế</h1><p>Quét bằng camera điện thoại. Không cần Expo Go.</p><img src="shared-qr.png" alt="QR chung vào website"><p><a href="${state.origin}/?entry=gate">${state.origin}/?entry=gate</a></p><p>Máy tính và tunnel cần đang chạy. QR hết phiên: chạy lại <code>npm run demo:public</code> và dùng ảnh mới.</p></main></html>`)
  console.log('SẴN SÀNG — đã kiểm tra HTTPS:', state.origin + '/')
  console.log('Ảnh QR:', path.join(folder, 'shared-qr.png'))
  console.log('Xem QR:', path.join(folder, 'index.html'))
}
async function main() {
  fs.mkdirSync(folder, { recursive: true })
  const web = path.join(root, 'apps/web')
  const webRequire = createRequire(path.join(web, 'package.json'))
  const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
  // CHỨC NĂNG: Build trước khi mở QR để trình duyệt tải bundle đã nén/gộp.
  // XỬ LÝ: Không tắt hay thay server dev 5173 của người dùng; preview riêng ở 4173.
  console.log('Đang đóng gói website cho điện thoại...')
  const build = spawnSync(process.execPath, [vite, 'build'], { cwd: web, encoding: 'utf8', windowsHide: true })
  if (build.status !== 0) throw new Error(build.stderr || build.stdout || 'Build web thất bại')
  let webProcess, tunnelProcess, presenceProcess
  // CHỨC NĂNG: Public catalog và lượt mở QR dùng cùng mock API RAM của Admin.
  const catalogOrigin=process.env.CATALOG_TARGET||'http://127.0.0.1:8788'
  if(!await read(catalogOrigin+'/version')){
    if(process.env.CATALOG_TARGET)throw new Error('CATALOG_TARGET chưa chạy')
    launch(process.execPath,[path.join(root,'services/catalog/server.cjs')],root,'catalog')
    let ready=false
    for(let i=0;i<20;i++){if(await read(catalogOrigin+'/version')){ready=true;break};await delay(300)}
    if(!ready)throw new Error('Không khởi động được Catalog RAM')
  }
  // CHỨC NĂNG: QR demo vẫn báo phiên đang hoạt động tới cùng RAM server của admin.
  // XỬ LÝ: Chỉ khởi động nếu chưa có service; không tắt server người dùng đã mở.
  const presenceOrigin = process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787'
  const readyPresence = async () => {
    try { const value = JSON.parse(await read(presenceOrigin + '/statistics/active')); return Number.isInteger(value?.active) && value?.ttlSeconds === 90 }
    catch { return false }
  }
  if (!await readyPresence()) {
    if (process.env.PRESENCE_TARGET) throw new Error('PRESENCE_TARGET chưa sẵn sàng; khởi động server RAM đã cấu hình trước.')
    presenceProcess = launch(process.execPath, [path.join(root, 'services/presence/server.cjs')], root, 'presence')
    let ready = false
    for (let i = 0; i < 20; i++) { if (await readyPresence()) { ready = true; break }; await delay(300) }
    if (!ready) { presenceProcess.child.kill(); throw new Error('Không khởi động được RAM server. Xem ' + presenceProcess.log) }
  }
  try {
    if (!await probe(local)) {
      if (await read(local + '/')) throw new Error('Cổng ' + previewPort + ' đang chạy ứng dụng khác; đặt PUBLIC_PREVIEW_PORT sang cổng khác.')
      webProcess = launch(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', previewPort, '--strictPort'], web, 'preview')
      let ready = false
      for (let i = 0; i < 20; i++) { if (await probe(local)) { ready = true; break }; await delay(500) }
      if (!ready) throw new Error('Không khởi động được preview. Xem ' + webProcess.log)
    }
    // CHỨC NĂNG: Tái dùng URL chỉ khi đúng phiên production vẫn hoạt động.
    if (fs.existsSync(stateFile)) {
      try {
        const previous = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
        if (previous.mode === 'production' && previous.origin && await probe(previous.origin)) {
          configureQr(previous.origin)
          if (await probe(previous.origin, true)) { publish(previous); return }
        }
      } catch { console.log('Phiên cũ không còn dùng được; đang tạo QR mới.') }
    }
    const cloudflared = process.env.CLOUDFLARED_PATH || path.join(root, '.tools/cloudflared.exe')
    if (!fs.existsSync(cloudflared)) throw new Error('Thiếu cloudflared; đặt CLOUDFLARED_PATH trước khi chạy.')
    tunnelProcess = launch(cloudflared, ['tunnel', '--url', local, '--http-host-header', 'localhost', '--protocol', 'http2'], root, 'cloudflared')
    console.log('Đang tạo địa chỉ HTTPS công khai...')
    let origin
    for (let i = 0; i < 60; i++) {
      origin = fs.readFileSync(tunnelProcess.log, 'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0]
      if (origin) break
      await delay(1000)
    }
    if (!origin) throw new Error('Chưa nhận được URL HTTPS. Xem ' + tunnelProcess.log)
    let reachable = false
    for (let i = 0; i < 30; i++) { if (await probe(origin)) { reachable = true; break }; await delay(1000) }
    if (!reachable) throw new Error('Website HTTPS chưa truy cập được; chưa tạo QR mới. Xem ' + tunnelProcess.log)
    // CHỨC NĂNG: Chỉ tạo ảnh QR sau khi chính website HTTPS đã vượt kiểm tra.
    configureQr(origin)
    let configured = false
    for (let i = 0; i < 20; i++) { if (await probe(origin, true)) { configured = true; break }; await delay(1000) }
    if (!configured) throw new Error('Website đã mở nhưng cấu hình URL chưa cập nhật. Chạy lại npm run demo:public.')
    publish({ origin, mode: 'production', localOrigin: local, webPid: webProcess?.child.pid, tunnelPid: tunnelProcess.child.pid,
      presencePid: presenceProcess?.child.pid, webLog: webProcess?.log, tunnelLog: tunnelProcess.log, startedAt: new Date().toISOString() })
  } catch (error) { tunnelProcess?.child.kill(); webProcess?.child.kill(); presenceProcess?.child.kill(); throw error }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { GUIDE_MODULE_PATH, isGuideModule, isGuidePage, isBuiltGuidePage, builtEntry }
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 25. TẠO MỚI — apps/mobile/.env.catalog.example

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\.env.catalog.example

Mẫu URL LAN cho Admin và catalog; không chứa khóa bí mật.

```text
# Cùng Wi-Fi: thay bằng IPv4 của máy tính chạy server.
EXPO_PUBLIC_ADMIN_API_URL=http://192.168.1.10:8788
# Catalog du khách: dùng tunnel /api/catalog nếu cần 4G; LAN để thử cùng Wi-Fi.
EXPO_PUBLIC_CATALOG_API_URL=http://192.168.1.10:8788
EXPO_PUBLIC_ADMIN_PRESENCE_API_URL=http://192.168.1.10:8788/presence
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 26. SỬA — package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\package.json

Lệnh catalog:start/catalog:test và ghép test vào bộ kiểm tra chung.

```json
{
  "name": "project-root",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "test:visitor": "npm run test --workspace=@travelguide/visitor-core",
    "typecheck:visitor": "npm run typecheck --workspace=@travelguide/visitor-core && npm run typecheck --workspace=mobile",
    "lint:visitor": "npm run lint --workspace=@travelguide/visitor-core && npm run lint --workspace=mobile",
    "lint": "npm run lint --workspace=@travelguide/admin-core && npm run lint --workspace=@travelguide/visitor-core && npm run lint --workspace=mobile && npm run lint --workspace=web",
    "typecheck": "npm run typecheck --workspace=@travelguide/admin-core && npm run typecheck --workspace=@travelguide/visitor-core && npm run typecheck --workspace=mobile && npm run typecheck --workspace=web",
    "test": "npm run test --workspace=@travelguide/admin-core && npm run test --workspace=@travelguide/visitor-core && npm run test --workspace=@travelguide/place-core && node --test scripts/app-links.test.cjs scripts/public-qr.test.cjs && npm run presence:test && npm run catalog:test",
    "build:web": "npm run build --workspace=web",
    "links:generate": "node scripts/generate-app-links.cjs",
    "qr:create": "node scripts/create-public-qr.cjs",
    "demo:public": "node scripts/start-public-demo.cjs",
    "presence:start": "node services/presence/server.cjs",
    "presence:test": "node --test services/presence/presence.test.cjs",
    "catalog:start": "node scripts/start-catalog.cjs",
    "catalog:test": "node --test services/catalog/catalog.test.cjs"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "8.46.2",
    "@typescript-eslint/parser": "8.46.2",
    "eslint": "8.57.1",
    "eslint-plugin-react-hooks": "5.2.0"
  }
}
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.

## 27. SỬA — .gitignore

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\.gitignore

Không đưa bundle Node .runtime vào Git.

```text
﻿# FILE NÀY LÀM GÌ:
# Bỏ dependency, kết quả test/build và cấu hình máy cá nhân khỏi Git.

# CHỨC NĂNG: Không commit thư viện cài từ npm.
node_modules/

# CHỨC NĂNG: Không commit file kiểm tra sinh tự động.
**/.test-build/
**/.verify-native/
**/dist/

# CHỨC NĂNG: Giữ cấu hình máy riêng ngoài Git.
.env
.env.local
# QR demo và bản sao .env chỉ dùng trên máy cá nhân.
.qr-output/

# Công cụ tunnel cục bộ, không commit binary.
.tools/

# Cache/log Expo tự sinh khi kiểm tra Android; không phải mã nguồn.
**/.expo/

# URL tunnel demo riêng của máy, script QR sinh lại khi chạy.
apps/web/static/visitor-config.json

# Output kiểm tra đóng gói Admin, không phải mã nguồn.
**/.verify-admin/

# Bản build quản lý độc lập với web du khách.
**/dist-admin/

# Bundle Node của mock API, sinh khi khởi động.
.runtime/
```

Cách kiểm tra:

- Đối chiếu vai trò file ở hướng dẫn DONG_BO_ADMIN_RAM.md.
- Chạy typecheck/lint/test tương ứng và các bước kiểm tra hai thiết bị ở checklist.
