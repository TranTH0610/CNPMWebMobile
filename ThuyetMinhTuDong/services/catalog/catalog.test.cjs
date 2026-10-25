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

test('Parser chỉ nhận query entry=gate trên trang chủ',async t=>{await setup(t);const {createRequire}=require('node:module'),path=require('node:path');const req=createRequire(path.resolve('apps/web/package.json'));const out=req('esbuild').buildSync({entryPoints:[path.resolve('packages/visitor-core/src/links/qr.ts')],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text;const Module=require('node:module');const m=new Module('qr-test');m._compile(out,'qr-test.cjs');const policy={allowedOrigins:['https://guide.test'],allowHttp:false};assert.deepEqual(m.exports.parseQrTarget('https://guide.test/?entry=gate',policy),{kind:'home'});assert.throws(()=>m.exports.parseQrTarget('https://guide.test/?entry=other',policy));assert.throws(()=>m.exports.parseQrTarget('https://guide.test/places/ngo-mon?entry=gate',policy))})

// CHỨC NĂNG: iOS cần HTTP Range để tua; audio nháp không lộ qua endpoint công khai.
test('MP3 có Range; không tải được audio chưa publish hoặc path traversal',async t=>{
 const {url}=await setup(t)
 const published=await (await fetch(url+'/published')).json(),text=published[0].content.vi
 assert.match(text.audio.url,/^narration:[a-f0-9]{64}$/)
 const key=text.audio.url.slice(10)
 const response=await fetch(url+'/audio/published/'+key+'.mp3',{headers:{Range:'bytes=0-99'}})
 assert.equal(response.status,206);assert.match(response.headers.get('content-type'),/audio\/mpeg/)
 assert.equal((await response.arrayBuffer()).byteLength,100)
 assert.match(response.headers.get('content-range'),/^bytes 0-99\//)
 assert.equal((await fetch(url+'/audio/published/'+'a'.repeat(64)+'.mp3')).status,404)
 assert.equal((await fetch(url+'/audio/preview/../../server.cjs')).status,404)
})
