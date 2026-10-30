/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra quy trình admin, revision, lỗi lưu, kiểm duyệt/công bố, dữ liệu mô phỏng và tạo âm
 * thanh.
 *
 * VỊ TRÍ: packages/admin-core/tests/admin.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ../.test-build/index.cjs
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo {test}: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const {test}=require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert=require('node:assert/strict')
// Khai báo {createMockAdminService,dashboard}: require nạp module '../.test-build/index.cjs' để dùng chức năng có sẵn thay vì chép lại.
const {createMockAdminService,dashboard}=require('../.test-build/index.cjs')
// Khai báo fixture(). Nhận đầu vào qua tham số. | Khai báo raw: sử dụng null làm giá trị của bước hiện tại | Khai báo fail: sử dụng false làm giá trị của bước hiện tại. | Khai báo service: Gọi createMockAdminService({read:async()=>raw,write:async value=>{if(fail)throw Error('disk fu. | Gán thuộc tính read: khai báo callback async()=>raw. | Gán thuộc tính write: khai báo callback async value=>{if(fail)throw Error('disk full'). | Rẽ nhánh nếu fail. | Ném Error('disk full'). | Thực hiện tính biểu thức raw=value. | Trả kết quả: tạo object gồm service, setFail, raw. | Đặt trường service bằng giá trị của biến cùng tên. | Gán thuộc tính setFail: khai báo callback value=>{fail=value}. | Thực hiện tính biểu thức fail=value. | Gán thuộc tính raw: khai báo callback ()=>raw.
function fixture(){let raw=null,fail=false;const service=createMockAdminService({read:async()=>raw,write:async value=>{if(fail)throw Error('disk full');raw=value}});return {service,setFail:value=>{fail=value},raw:()=>raw}}
// TẠI SAO (fixture): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không
// cần mạng, GPS hay loa thật.
// Khai báo input: khai báo callback (p,title=p.record.canonicalTitle)=>({id:p.id,expectedRevision:p.revision,ti. | Gán thuộc tính id: đọc p.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính expectedRevision: đọc p.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Đặt trường title bằng giá trị của biến cùng tên. | Gán thuộc tính category: chuỗi 'palace'. | Gán thuộc tính period: chuỗi '1802–1945'. | Gán thuộc tính lat: chuỗi ''. | Gán thuộc tính lng: chuỗi ''. | Gán thuộc tính verified: sử dụng false làm giá trị của bước hiện tại. Tách tọa độ tham khảo với tọa độ đã xác nhận. | Gán thuộc tính images: đọc p.record.images từ đối tượng/mảng để dùng tại bước hiện tại. Giữ danh sách nguồn ảnh để UI có thể xử lý từng nguồn và ảnh lỗi.
const input=(p,title=p.record.canonicalTitle)=>({id:p.id,expectedRevision:p.revision,title,category:'palace',period:'1802–1945',lat:'',lng:'',verified:false,images:p.record.images})
// TẠI SAO (input): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
// bộ giao diện.
// Khai báo draft(service). Nhận đầu vào qua tham số. | Khai báo p: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Thực hiện await chờ Gọi service.savePlace(input(p)). | Trả kết quả: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại.
async function draft(service){const p=(await service.load()).places[0];await service.savePlace(input(p));return (await service.load()).places[0]}
// TẠI SAO (draft): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
// mạng, GPS hay loa thật.
// Khẳng định kết quả thử nghiệm bằng test('UC12: danh tính cấp sẵn, không cần mật khẩu',async()=>{const {service}=fixture(). | Khai báo {service}: Gọi fixture(). | Khẳng định kết quả thử nghiệm bằng assert.equal((await service.identity()).mode,'demo').
test('UC12: danh tính cấp sẵn, không cần mật khẩu',async()=>{const {service}=fixture();assert.equal((await service.identity()).mode,'demo')})
// Khẳng định kết quả thử nghiệm bằng test('UC13: save draft không đổi published',async()=>{const {service}=fixture(). | Khai báo {service}: Gọi fixture(). | Khai báo p: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Thực hiện await chờ Gọi service.savePlace(input(p,'New title')). | Khai báo next: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Khẳng định kết quả thử nghiệm bằng assert.equal(next.record.canonicalTitle,'New title'). | Khẳng định kết quả thử nghiệm bằng assert.equal(next.published.canonicalTitle,p.published.canonicalTitle).
test('UC13: save draft không đổi published',async()=>{const {service}=fixture();const p=(await service.load()).places[0];await service.savePlace(input(p,'New title'));const next=(await service.load()).places[0];assert.equal(next.record.canonicalTitle,'New title');assert.equal(next.published.canonicalTitle,p.published.canonicalTitle)})
// Khẳng định kết quả thử nghiệm bằng test('UC13: tọa độ ngoài Huế và javascript URL bị chặn',async()=>{const {service}=fixture(),p=(await service.load()).pla. | Khai báo {service}: Gọi fixture(). | Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.savePlace({...input(p),lat:'21',lng:'105'}),e=>e.code==='invalid'). | Gán thuộc tính lat: chuỗi '21'. | Gán thuộc tính lng: chuỗi '105'. | Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.savePlace({...input(p),images:['javascript:alert(1)']}),e=>e.code==='invalid'). | Gán thuộc tính images: tạo mảng ['javascript:alert(1)'].
test('UC13: tọa độ ngoài Huế và javascript URL bị chặn',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await assert.rejects(service.savePlace({...input(p),lat:'21',lng:'105'}),e=>e.code==='invalid');await assert.rejects(service.savePlace({...input(p),images:['javascript:alert(1)']}),e=>e.code==='invalid')})
// Khẳng định kết quả thử nghiệm bằng test('UC13: ghi đồng thời cùng revision chỉ một lệnh thành công',async()=>{const {service}=fixture(),p=(await service.lo. | Khai báo {service}: Gọi fixture(). | Khai báo results: await chờ Gọi Promise.allSettled([service.savePlace(input(p,'A')),service.savePlace(input(p,'B'))]). | Khẳng định kết quả thử nghiệm bằng assert.equal(results.filter(r=>r.status==='fulfilled').length,1). | Khẳng định kết quả thử nghiệm bằng assert.equal(results.find(r=>r.status==='rejected').reason.code,'conflict').
test('UC13: ghi đồng thời cùng revision chỉ một lệnh thành công',async()=>{const {service}=fixture(),p=(await service.load()).places[0];const results=await Promise.allSettled([service.savePlace(input(p,'A')),service.savePlace(input(p,'B'))]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.code,'conflict')})
// Khẳng định kết quả thử nghiệm bằng test('UC14: sửa body bỏ audio cũ không còn khớp',async()=>{const {service}=fixture(),p=(await service.load()).places[0]. | Khai báo {service}: Gọi fixture(). | Thực hiện await chờ Gọi service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summar. | Gán thuộc tính id: đọc p.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính language: chuỗi 'vi'. | Gán thuộc tính expectedRevision: đọc p.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Gán thuộc tính title: chuỗi 'Test'. | Gán thuộc tính summary: chuỗi ''. | Gán thuộc tính address: chuỗi ''. | Gán thuộc tính body: chuỗi 'Changed narration'. | Khẳng định kết quả thử nghiệm bằng assert.equal((await service.load()).places[0].record.content.vi.audio,undefined).
test('UC14: sửa body bỏ audio cũ không còn khớp',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summary:'',address:'',body:'Changed narration'});assert.equal((await service.load()).places[0].record.content.vi.audio,undefined)})
// Khẳng định kết quả thử nghiệm bằng test('UC14.2: tác vụ về muộn không ghi đè bản mới',async()=>{const {service}=fixture(),p=await draft(service). | Khai báo {service}: Gọi fixture(). | Khai báo job: Gọi service.generateAudio(p.id,'vi',p.revision). | Thực hiện await chờ Gọi service.savePlace(input(p,'New revision')). | Khẳng định kết quả thử nghiệm bằng await assert.rejects(job,e=>e.code==='conflict'). | Khẳng định kết quả thử nghiệm bằng assert.equal((await service.load()).places[0].record.canonicalTitle,'New revision').
test('UC14.2: tác vụ về muộn không ghi đè bản mới',async()=>{const {service}=fixture(),p=await draft(service);const job=service.generateAudio(p.id,'vi',p.revision);await service.savePlace(input(p,'New revision'));await assert.rejects(job,e=>e.code==='conflict');assert.equal((await service.load()).places[0].record.canonicalTitle,'New revision')})
// Khẳng định kết quả thử nghiệm bằng test('UC15: yêu cầu sửa cần ghi chú',async()=>{const {service}=fixture(),p=await draft(service). | Khai báo {service}: Gọi fixture(). | Thực hiện await chờ Gọi service.submit(p.id,p.revision). | Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.review(p.id,p.revision,false,''),e=>e.code==='invalid'). | Thực hiện await chờ Gọi service.review(p.id,p.revision,false,'Check history'). | Khẳng định kết quả thử nghiệm bằng assert.equal((await service.load()).places[0].workflow,'changes').
test('UC15: yêu cầu sửa cần ghi chú',async()=>{const {service}=fixture(),p=await draft(service);await service.submit(p.id,p.revision);await assert.rejects(service.review(p.id,p.revision,false,''),e=>e.code==='invalid');await service.review(p.id,p.revision,false,'Check history');assert.equal((await service.load()).places[0].workflow,'changes')})
// Khẳng định kết quả thử nghiệm bằng test('UC16: approve chưa công bố. | Khai báo {service}: Gọi fixture(). | Thực hiện await chờ Gọi service.savePlace(input(p,'Published new')). | Khai báo d: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Thực hiện await chờ Gọi service.submit(d.id,d.revision). | Thực hiện await chờ Gọi service.review(d.id,d.revision,true,''). | Khẳng định kết quả thử nghiệm bằng assert.equal((await service.published())[0].canonicalTitle,p.record.canonicalTitle). | Thực hiện await chờ Gọi service.publish(d.id,d.revision). | Khẳng định kết quả thử nghiệm bằng assert.equal((await service.published())[0].canonicalTitle,'Published new').
test('UC16: approve chưa công bố; publish đổi đúng bản',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await service.savePlace(input(p,'Published new'));const d=(await service.load()).places[0];await service.submit(d.id,d.revision);await service.review(d.id,d.revision,true,'');assert.equal((await service.published())[0].canonicalTitle,p.record.canonicalTitle);await service.publish(d.id,d.revision);assert.equal((await service.published())[0].canonicalTitle,'Published new')})
// Khẳng định kết quả thử nghiệm bằng test('UC16: sửa sau duyệt vô hiệu approval',async()=>{const {service}=fixture(),p=await draft(service). | Khai báo {service}: Gọi fixture(). | Thực hiện await chờ Gọi service.submit(p.id,p.revision). | Thực hiện await chờ Gọi service.review(p.id,p.revision,true,''). | Thực hiện await chờ Gọi service.savePlace(input(p,'Changed after approval')). | Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.publish(p.id,p.revision+1),e=>e.code==='notApproved').
test('UC16: sửa sau duyệt vô hiệu approval',async()=>{const {service}=fixture(),p=await draft(service);await service.submit(p.id,p.revision);await service.review(p.id,p.revision,true,'');await service.savePlace(input(p,'Changed after approval'));await assert.rejects(service.publish(p.id,p.revision+1),e=>e.code==='notApproved')})
// Khẳng định kết quả thử nghiệm bằng test('UC16: lưu lỗi giữ nguyên cache và published',async()=>{const f=fixture(),p=await draft(f.service). | Khai báo f: Gọi fixture(). | Thực hiện await chờ Gọi f.service.submit(p.id,p.revision). | Thực hiện await chờ Gọi f.service.review(p.id,p.revision,true,''). | Khai báo before: JSON.stringify tuần tự hóa dữ liệu để lưu hoặc truyền qua HTTP. | Thực hiện Gọi f.setFail(true). | Khẳng định kết quả thử nghiệm bằng await assert.rejects(f.service.publish(p.id,p.revision),e=>e.code==='saveError'). | Khẳng định kết quả thử nghiệm bằng assert.equal(JSON.stringify(await f.service.load()),before).
test('UC16: lưu lỗi giữ nguyên cache và published',async()=>{const f=fixture(),p=await draft(f.service);await f.service.submit(p.id,p.revision);await f.service.review(p.id,p.revision,true,'');const before=JSON.stringify(await f.service.load());f.setFail(true);await assert.rejects(f.service.publish(p.id,p.revision),e=>e.code==='saveError');assert.equal(JSON.stringify(await f.service.load()),before)})
// Khẳng định kết quả thử nghiệm bằng test('UC17: web/app riêng. | Khai báo {service}: Gọi fixture(). | Thực hiện await chờ Gọi service.simulate('web'). | Thực hiện await chờ Gọi service.simulate('mobile-app'). | Khai báo d: await chờ Gọi service.load(). | Khẳng định kết quả thử nghiệm bằng assert.equal(dashboard(d,now).web,1). | Khẳng định kết quả thử nghiệm bằng assert.equal(dashboard(d,now).mobile,1). | Khẳng định kết quả thử nghiệm bằng assert.equal(dashboard(d,now+91000).active,0). | Thực hiện await chờ Gọi service.endSessions(). | Khẳng định kết quả thử nghiệm bằng assert.equal(dashboard(await service.load()).active,0).
test('UC17: web/app riêng; hết 90 giây không tính active',async()=>{const {service}=fixture();await service.simulate('web');await service.simulate('mobile-app');const d=await service.load(),now=Date.now();assert.equal(dashboard(d,now).web,1);assert.equal(dashboard(d,now).mobile,1);assert.equal(dashboard(d,now+91000).active,0);await service.endSessions();assert.equal(dashboard(await service.load()).active,0)})
// Khẳng định kết quả thử nghiệm bằng test('Reset/load: dữ liệu lỗi không bị âm thầm thay bằng seed',async()=>{const service=createMockAdminService({read:asyn. | Khai báo service: Gọi createMockAdminService({read:async()=>'{broken',write:async()=>{}}). | Gán thuộc tính read: khai báo callback async()=>'{broken'. | Gán thuộc tính write: khai báo callback async()=>{}. | Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.load(),e=>e.code==='loadError').
test('Reset/load: dữ liệu lỗi không bị âm thầm thay bằng seed',async()=>{const service=createMockAdminService({read:async()=>'{broken',write:async()=>{}});await assert.rejects(service.load(),e=>e.code==='loadError')})

// Khẳng định kết quả thử nghiệm bằng test('Reset phục hồi được JSON hỏng',async()=>{let raw='{broken'. | Khai báo raw: chuỗi '{broken'. | Khai báo s: Gọi createMockAdminService({read:async()=>raw,write:async value=>{raw=value}}). | Gán thuộc tính read: khai báo callback async()=>raw. | Gán thuộc tính write: khai báo callback async value=>{raw=value}. | Thực hiện tính biểu thức raw=value. | Khẳng định kết quả thử nghiệm bằng await assert.rejects(s.load()). | Thực hiện await chờ Gọi s.reset(). | Khẳng định kết quả thử nghiệm bằng assert.equal((await s.load()).places.length,8).
test('Reset phục hồi được JSON hỏng',async()=>{let raw='{broken';const s=createMockAdminService({read:async()=>raw,write:async value=>{raw=value}});await assert.rejects(s.load());await s.reset();assert.equal((await s.load()).places.length,8)})
// Khẳng định kết quả thử nghiệm bằng test('UC17: mô phỏng đang nghe có bộ đếm riêng',async()=>{const {service}=fixture(). | Khai báo {service}: Gọi fixture(). | Thực hiện await chờ Gọi service.simulate('web',true). | Khẳng định kết quả thử nghiệm bằng assert.equal(dashboard(await service.load()).listening,1).
test('UC17: mô phỏng đang nghe có bộ đếm riêng',async()=>{const {service}=fixture();await service.simulate('web',true);assert.equal(dashboard(await service.load()).listening,1)})

// Khẳng định kết quả thử nghiệm bằng test('Media demo chặn SVG/script và tệp quá dung lượng',()=>{const {mediaUrl}=require('../.test-build/index.cjs'). | Khai báo {mediaUrl}: require nạp module '../.test-build/index.cjs' để dùng chức năng có sẵn thay vì chép lại. | Khẳng định kết quả thử nghiệm bằng assert.equal(mediaUrl('data:image/png. | Khẳng định kết quả thử nghiệm bằng assert.equal(mediaUrl('data:image/svg+xml. | Khẳng định kết quả thử nghiệm bằng assert.equal(mediaUrl('data:audio/mpeg.
test('Media demo chặn SVG/script và tệp quá dung lượng',()=>{const {mediaUrl}=require('../.test-build/index.cjs');assert.equal(mediaUrl('data:image/png;base64,AAAA',true),true);assert.equal(mediaUrl('data:image/svg+xml;base64,AAAA',true),false);assert.equal(mediaUrl('data:audio/mpeg;base64,AAAA'),true);assert.equal(mediaUrl('data:audio/mpeg;base64,'+'A'.repeat(1500000)),false)})

// Khẳng định kết quả thử nghiệm bằng test('UC13: xóa hẳn được điểm đã lưu trữ, giữ các điểm khác',async()=>{ const f=fixture(),p=(await f.service.load()).pla.
test('UC13: xóa hẳn được điểm đã lưu trữ, giữ các điểm khác',async()=>{
 // Khai báo f: Gọi fixture().
 const f=fixture(),p=(await f.service.load()).places[0]
 // Thực hiện await chờ Gọi f.service.archive(p.id,p.revision).
 await f.service.archive(p.id,p.revision)
 // Thực hiện await chờ Gọi f.service.deletePlace(p.id,p.revision).
 await f.service.deletePlace(p.id,p.revision)
 // Khẳng định kết quả thử nghiệm bằng assert.equal((await f.service.load()).places.length,7).
 assert.equal((await f.service.load()).places.length,7)
 // Khẳng định kết quả thử nghiệm bằng assert.equal((await f.service.load()).places.some(item=>item.id===p.id),false).
 assert.equal((await f.service.load()).places.some(item=>item.id===p.id),false)
 // Khẳng định kết quả thử nghiệm bằng assert.equal((await f.service.published()).some(item=>item.id===p.id),false).
 assert.equal((await f.service.published()).some(item=>item.id===p.id),false)
 // Khai báo reopened: Gọi createMockAdminService({read:async()=>f.raw(),write:async()=>{}}). | Gán thuộc tính read: khai báo callback async()=>f.raw(). | Gán thuộc tính write: khai báo callback async()=>{}.
 const reopened=createMockAdminService({read:async()=>f.raw(),write:async()=>{}})
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal((await reopened.load()).places.some(item=>item.id===p.id),false)`: Khẳng định kết quả thử nghiệm bằng assert.equal((await reopened.load()).places.some(item=>item.id===p.id),false).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal((await reopened.load()).places.some(item=>item.id===p.id),false)
})
// Khẳng định kết quả thử nghiệm bằng test('UC13: xóa sai revision hoặc ID không xóa nhầm dữ liệu',async()=>{ const {service}=fixture(),p=(await service.load(.
test('UC13: xóa sai revision hoặc ID không xóa nhầm dữ liệu',async()=>{
 // Khai báo {service}: Gọi fixture().
 const {service}=fixture(),p=(await service.load()).places[0]
 // Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.deletePlace(p.id,p.revision+1),e=>e.code==='conflict').
 await assert.rejects(service.deletePlace(p.id,p.revision+1),e=>e.code==='conflict')
 // Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.deletePlace('missing',1),e=>e.code==='notFound').
 await assert.rejects(service.deletePlace('missing',1),e=>e.code==='notFound')
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal((await service.load()).places.length,8)`: Khẳng định kết quả thử nghiệm bằng assert.equal((await service.load()).places.length,8).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal((await service.load()).places.length,8)
})
// Khẳng định kết quả thử nghiệm bằng test('UC13: lỗi lưu khi xóa giữ nguyên di tích và bản công khai',async()=>{ const f=fixture(),p=(await f.service.load()).
test('UC13: lỗi lưu khi xóa giữ nguyên di tích và bản công khai',async()=>{
 // Khai báo f: Gọi fixture().
 const f=fixture(),p=(await f.service.load()).places[0]
 // Thực hiện Gọi f.setFail(true).
 f.setFail(true)
 // Khẳng định kết quả thử nghiệm bằng await assert.rejects(f.service.deletePlace(p.id,p.revision),e=>e.code==='saveError').
 await assert.rejects(f.service.deletePlace(p.id,p.revision),e=>e.code==='saveError')
 // Khẳng định kết quả thử nghiệm bằng assert.equal((await f.service.load()).places.length,8).
 assert.equal((await f.service.load()).places.length,8)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal((await f.service.published()).some(item=>item.id===p.id),true)`: Khẳng định kết quả thử nghiệm bằng assert.equal((await f.service.published()).some(item=>item.id===p.id),true).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal((await f.service.published()).some(item=>item.id===p.id),true)
})

// CHỨC NĂNG: Chứng minh bộ tạo giọng nhận chính body đã lưu và lỗi không gắn MP3 sai.
// Khẳng định kết quả thử nghiệm bằng test('UC14.2: TTS đọc body thật, không đổi published trước bước duyệt',async()=>{ let request const service=createMockAd.
test('UC14.2: TTS đọc body thật, không đổi published trước bước duyệt',async()=>{
 // Khai báo request: không có giá trị khởi tạo.
 let request
 // Khai báo service: Gọi createMockAdminService({read:async()=>null,write:async()=>{}},async(body,lang)=>{request={. | Gán thuộc tính read: khai báo callback async()=>null. | Gán thuộc tính write: khai báo callback async()=>{}. | Thực hiện tính biểu thức request={body,lang}. | Đặt trường body bằng giá trị của biến cùng tên. | Đặt trường lang bằng giá trị của biến cùng tên. | Trả kết quả: tính biểu thức 'narration:'+'a'.repeat(64).
 const service=createMockAdminService({read:async()=>null,write:async()=>{}},async(body,lang)=>{request={body,lang};return 'narration:'+'a'.repeat(64)})
 // Khai báo p: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo body: chuỗi 'Một bài thuyết minh mới do quản lý biên soạn.'.
 const p=(await service.load()).places[0],body='Một bài thuyết minh mới do quản lý biên soạn.'
 // Thực hiện await chờ Gọi service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Bài mới',sum. | Gán thuộc tính id: đọc p.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính language: chuỗi 'vi'. | Gán thuộc tính expectedRevision: đọc p.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Gán thuộc tính title: chuỗi 'Bài mới'. | Gán thuộc tính summary: chuỗi ''. | Gán thuộc tính address: chuỗi 'Huế'. | Đặt trường body bằng giá trị của biến cùng tên.
 await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Bài mới',summary:'',address:'Huế',body})
 // Khai báo draft: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại.
 const draft=(await service.load()).places[0]
 // Thực hiện await chờ Gọi service.generateAudio(p.id,'vi',draft.revision).
 await service.generateAudio(p.id,'vi',draft.revision)
 // Khai báo next: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại.
 const next=(await service.load()).places[0]
 // Khẳng định kết quả thử nghiệm bằng assert.deepEqual(request,{body,lang:'vi'}). | Đặt trường body bằng giá trị của biến cùng tên. | Gán thuộc tính lang: chuỗi 'vi'.
 assert.deepEqual(request,{body,lang:'vi'})
 // Khẳng định kết quả thử nghiệm bằng assert.equal(next.record.content.vi.audio.url,'narration:'+'a'.repeat(64)).
 assert.equal(next.record.content.vi.audio.url,'narration:'+'a'.repeat(64))
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.notEqual(next.published.content.vi.body,body)`: Khẳng định kết quả thử nghiệm bằng assert.notEqual(next.published.content.vi.body,body).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.notEqual(next.published.content.vi.body,body)
})
// Khẳng định kết quả thử nghiệm bằng test('UC14.2: lỗi tạo giọng giữ nguyên body và không dùng audio mẫu',async()=>{ const service=createMockAdminService({re.
test('UC14.2: lỗi tạo giọng giữ nguyên body và không dùng audio mẫu',async()=>{
 // Khai báo service: Gọi createMockAdminService({read:async()=>null,write:async()=>{}},async()=>{throw Error('offli. | Gán thuộc tính read: khai báo callback async()=>null. | Gán thuộc tính write: khai báo callback async()=>{}. | Ném Error('offline').
 const service=createMockAdminService({read:async()=>null,write:async()=>{}},async()=>{throw Error('offline')})
 // Khai báo p: đọc (await service.load()).places[0] từ đối tượng/mảng để dùng tại bước hiện tại.
 const p=(await service.load()).places[0]
 // Thực hiện await chờ Gọi service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summar. | Gán thuộc tính id: đọc p.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính language: chuỗi 'vi'. | Gán thuộc tính expectedRevision: đọc p.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Gán thuộc tính title: chuỗi 'Test'. | Gán thuộc tính summary: chuỗi ''. | Gán thuộc tính address: chuỗi ''. | Gán thuộc tính body: chuỗi 'Văn bản mới cần tạo giọng.'.
 await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summary:'',address:'',body:'Văn bản mới cần tạo giọng.'})
 // Khai báo before: await chờ Gọi service.load().
 const before=await service.load()
 // Khẳng định kết quả thử nghiệm bằng await assert.rejects(service.generateAudio(p.id,'vi',before.places[0].revision),e=>e.code==='saveError').
 await assert.rejects(service.generateAudio(p.id,'vi',before.places[0].revision),e=>e.code==='saveError')
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.deepEqual(await service.load(),before)`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual(await service.load(),before).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.deepEqual(await service.load(),before)
})
