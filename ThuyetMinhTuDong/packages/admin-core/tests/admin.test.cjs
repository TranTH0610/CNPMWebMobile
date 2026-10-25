/** FILE NÀY LÀM GÌ: Test nghiệp vụ thật Admin không cần trình duyệt/BE.
 * npm test gọi; UC12–UC17. Bộ nhớ giả chỉ thay IO, không thay luật duyệt/công bố. */
const {test}=require('node:test')
const assert=require('node:assert/strict')
const {createMockAdminService,dashboard}=require('../.test-build/index.cjs')
function fixture(){let raw=null,fail=false;const service=createMockAdminService({read:async()=>raw,write:async value=>{if(fail)throw Error('disk full');raw=value}});return {service,setFail:value=>{fail=value},raw:()=>raw}}
const input=(p,title=p.record.canonicalTitle)=>({id:p.id,expectedRevision:p.revision,title,category:'palace',period:'1802–1945',lat:'',lng:'',verified:false,images:p.record.images})
async function draft(service){const p=(await service.load()).places[0];await service.savePlace(input(p));return (await service.load()).places[0]}
test('UC12: danh tính cấp sẵn, không cần mật khẩu',async()=>{const {service}=fixture();assert.equal((await service.identity()).mode,'demo')})
test('UC13: save draft không đổi published',async()=>{const {service}=fixture();const p=(await service.load()).places[0];await service.savePlace(input(p,'New title'));const next=(await service.load()).places[0];assert.equal(next.record.canonicalTitle,'New title');assert.equal(next.published.canonicalTitle,p.published.canonicalTitle)})
test('UC13: tọa độ ngoài Huế và javascript URL bị chặn',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await assert.rejects(service.savePlace({...input(p),lat:'21',lng:'105'}),e=>e.code==='invalid');await assert.rejects(service.savePlace({...input(p),images:['javascript:alert(1)']}),e=>e.code==='invalid')})
test('UC13: ghi đồng thời cùng revision chỉ một lệnh thành công',async()=>{const {service}=fixture(),p=(await service.load()).places[0];const results=await Promise.allSettled([service.savePlace(input(p,'A')),service.savePlace(input(p,'B'))]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.code,'conflict')})
test('UC14: sửa body bỏ audio cũ không còn khớp',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summary:'',address:'',body:'Changed narration'});assert.equal((await service.load()).places[0].record.content.vi.audio,undefined)})
test('UC14.2: tác vụ về muộn không ghi đè bản mới',async()=>{const {service}=fixture(),p=await draft(service);const job=service.generateAudio(p.id,'vi',p.revision);await service.savePlace(input(p,'New revision'));await assert.rejects(job,e=>e.code==='conflict');assert.equal((await service.load()).places[0].record.canonicalTitle,'New revision')})
test('UC15: yêu cầu sửa cần ghi chú',async()=>{const {service}=fixture(),p=await draft(service);await service.submit(p.id,p.revision);await assert.rejects(service.review(p.id,p.revision,false,''),e=>e.code==='invalid');await service.review(p.id,p.revision,false,'Check history');assert.equal((await service.load()).places[0].workflow,'changes')})
test('UC16: approve chưa công bố; publish đổi đúng bản',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await service.savePlace(input(p,'Published new'));const d=(await service.load()).places[0];await service.submit(d.id,d.revision);await service.review(d.id,d.revision,true,'');assert.equal((await service.published())[0].canonicalTitle,p.record.canonicalTitle);await service.publish(d.id,d.revision);assert.equal((await service.published())[0].canonicalTitle,'Published new')})
test('UC16: sửa sau duyệt vô hiệu approval',async()=>{const {service}=fixture(),p=await draft(service);await service.submit(p.id,p.revision);await service.review(p.id,p.revision,true,'');await service.savePlace(input(p,'Changed after approval'));await assert.rejects(service.publish(p.id,p.revision+1),e=>e.code==='notApproved')})
test('UC16: lưu lỗi giữ nguyên cache và published',async()=>{const f=fixture(),p=await draft(f.service);await f.service.submit(p.id,p.revision);await f.service.review(p.id,p.revision,true,'');const before=JSON.stringify(await f.service.load());f.setFail(true);await assert.rejects(f.service.publish(p.id,p.revision),e=>e.code==='saveError');assert.equal(JSON.stringify(await f.service.load()),before)})
test('UC17: web/app riêng; hết 90 giây không tính active',async()=>{const {service}=fixture();await service.simulate('web');await service.simulate('mobile-app');const d=await service.load(),now=Date.now();assert.equal(dashboard(d,now).web,1);assert.equal(dashboard(d,now).mobile,1);assert.equal(dashboard(d,now+91000).active,0);await service.endSessions();assert.equal(dashboard(await service.load()).active,0)})
test('Reset/load: dữ liệu lỗi không bị âm thầm thay bằng seed',async()=>{const service=createMockAdminService({read:async()=>'{broken',write:async()=>{}});await assert.rejects(service.load(),e=>e.code==='loadError')})

test('Reset phục hồi được JSON hỏng',async()=>{let raw='{broken';const s=createMockAdminService({read:async()=>raw,write:async value=>{raw=value}});await assert.rejects(s.load());await s.reset();assert.equal((await s.load()).places.length,8)})
test('UC17: mô phỏng đang nghe có bộ đếm riêng',async()=>{const {service}=fixture();await service.simulate('web',true);assert.equal(dashboard(await service.load()).listening,1)})

test('Media demo chặn SVG/script và tệp quá dung lượng',()=>{const {mediaUrl}=require('../.test-build/index.cjs');assert.equal(mediaUrl('data:image/png;base64,AAAA',true),true);assert.equal(mediaUrl('data:image/svg+xml;base64,AAAA',true),false);assert.equal(mediaUrl('data:audio/mpeg;base64,AAAA'),true);assert.equal(mediaUrl('data:audio/mpeg;base64,'+'A'.repeat(1500000)),false)})

test('UC13: xóa hẳn được điểm đã lưu trữ, giữ các điểm khác',async()=>{
 const f=fixture(),p=(await f.service.load()).places[0]
 await f.service.archive(p.id,p.revision)
 await f.service.deletePlace(p.id,p.revision)
 assert.equal((await f.service.load()).places.length,7)
 assert.equal((await f.service.load()).places.some(item=>item.id===p.id),false)
 assert.equal((await f.service.published()).some(item=>item.id===p.id),false)
 const reopened=createMockAdminService({read:async()=>f.raw(),write:async()=>{}})
 assert.equal((await reopened.load()).places.some(item=>item.id===p.id),false)
})
test('UC13: xóa sai revision hoặc ID không xóa nhầm dữ liệu',async()=>{
 const {service}=fixture(),p=(await service.load()).places[0]
 await assert.rejects(service.deletePlace(p.id,p.revision+1),e=>e.code==='conflict')
 await assert.rejects(service.deletePlace('missing',1),e=>e.code==='notFound')
 assert.equal((await service.load()).places.length,8)
})
test('UC13: lỗi lưu khi xóa giữ nguyên di tích và bản công khai',async()=>{
 const f=fixture(),p=(await f.service.load()).places[0]
 f.setFail(true)
 await assert.rejects(f.service.deletePlace(p.id,p.revision),e=>e.code==='saveError')
 assert.equal((await f.service.load()).places.length,8)
 assert.equal((await f.service.published()).some(item=>item.id===p.id),true)
})

// CHỨC NĂNG: Chứng minh bộ tạo giọng nhận chính body đã lưu và lỗi không gắn MP3 sai.
test('UC14.2: TTS đọc body thật, không đổi published trước bước duyệt',async()=>{
 let request
 const service=createMockAdminService({read:async()=>null,write:async()=>{}},async(body,lang)=>{request={body,lang};return 'narration:'+'a'.repeat(64)})
 const p=(await service.load()).places[0],body='Một bài thuyết minh mới do quản lý biên soạn.'
 await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Bài mới',summary:'',address:'Huế',body})
 const draft=(await service.load()).places[0]
 await service.generateAudio(p.id,'vi',draft.revision)
 const next=(await service.load()).places[0]
 assert.deepEqual(request,{body,lang:'vi'})
 assert.equal(next.record.content.vi.audio.url,'narration:'+'a'.repeat(64))
 assert.notEqual(next.published.content.vi.body,body)
})
test('UC14.2: lỗi tạo giọng giữ nguyên body và không dùng audio mẫu',async()=>{
 const service=createMockAdminService({read:async()=>null,write:async()=>{}},async()=>{throw Error('offline')})
 const p=(await service.load()).places[0]
 await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summary:'',address:'',body:'Văn bản mới cần tạo giọng.'})
 const before=await service.load()
 await assert.rejects(service.generateAudio(p.id,'vi',before.places[0].revision),e=>e.code==='saveError')
 assert.deepEqual(await service.load(),before)
})
