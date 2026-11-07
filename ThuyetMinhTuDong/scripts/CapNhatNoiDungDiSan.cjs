/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: CÔNG CỤ CHẠY DỰ ÁN
 *
 * FILE NÀY LÀM GÌ:
 * Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng
 *
 * VỊ TRÍ: scripts/CapNhatNoiDungDiSan.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:fs
 * - node:path
 * - node:module
 *
 * CÁC KHỐI CHÍNH:
 * 1. main
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại | Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại | Khai báo {createRequire}: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module')
// Khai báo root: Gọi path.resolve(__dirname,'..').
const root=path.resolve(__dirname,'..')
// Khai báo main(). Nhận đầu vào qua tham số.
// ==================== [KHOI-DONG] [CAU-HINH] main ====================
// CHỨC NĂNG: Thực hiện bước main trong nhiệm vụ: Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
async function main(){
 // Khai báo base: tính biểu thức process.env.CATALOG_TARGET||'http://127.0.0.1:8788'.
 const base=process.env.CATALOG_TARGET||'http://127.0.0.1:8788'
 // Khai báo directory: Gọi path.join(root,'.runtime','heritage-upgrade-'+Date.now()).
 const directory=path.join(root,'.runtime','heritage-upgrade-'+Date.now())
 // Thực hiện Gọi fs.mkdirSync(directory,{recursive:true}). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 fs.mkdirSync(directory,{recursive:true})
 // Khai báo documentResponse: await chờ fetch gửi HTTP request.
 const documentResponse=await fetch(base+'/document'),gateResponse=await fetch(base+'/gate/statistics')
 // Rẽ nhánh nếu !documentResponse.ok||!gateResponse.ok. | Ném Error('Không sao lưu được server hiện tại').
 if(!documentResponse.ok||!gateResponse.ok)throw Error('Không sao lưu được server hiện tại')
 // Khai báo original: await chờ Gọi documentResponse.json().
 const original=await documentResponse.json(),gate=await gateResponse.json()
 // Thực hiện Gọi fs.writeFileSync(path.join(directory,'original-document.json'),JSON.stringify(original,nul.
 fs.writeFileSync(path.join(directory,'original-document.json'),JSON.stringify(original,null,2))
 // Thực hiện Gọi fs.writeFileSync(path.join(directory,'gate-statistics.json'),JSON.stringify(gate,null,2)).
 fs.writeFileSync(path.join(directory,'gate-statistics.json'),JSON.stringify(gate,null,2))
 // Khai báo req: Gọi createRequire(path.join(root,'apps/web/package.json')).
 const req=createRequire(path.join(root,'apps/web/package.json'))
 // Khai báo outfile: Gọi path.join(directory,'admin-core.cjs').
 const outfile=path.join(directory,'admin-core.cjs')
 // Thực hiện Gọi req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/XuatCongKhai.ts')]. | Gán thuộc tính entryPoints: tạo mảng [path.join(root,'packages/admin-core/src/XuatCongKhai.ts')]. | Gán thuộc tính bundle: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính platform: chuỗi 'node'. | Gán thuộc tính format: chuỗi 'cjs'. | Đặt trường outfile bằng giá trị của biến cùng tên.
 req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/XuatCongKhai.ts')],bundle:true,platform:'node',format:'cjs',outfile})
 // Khai báo {createAdminService}: require nạp module outfile để dùng chức năng có sẵn thay vì chép lại.
 const {createAdminService}=require(outfile)
 // Khai báo seed: await chờ Gọi createAdminService({read:async()=>null,write:async()=>{}}).load(). | Gán thuộc tính read: khai báo callback async()=>null. | Gán thuộc tính write: khai báo callback async()=>{}.
 const seed=await createAdminService({read:async()=>null,write:async()=>{}}).load()
 // Khai báo updated: Gọi structuredClone(original).
 const updated=structuredClone(original),date=new Date().toISOString()
 // Duyệt lần lượt updated.places bằng const place.
 for(const place of updated.places){
  // Khai báo source: seed.places.find lấy phần tử đầu tiên phù hợp.
  const source=seed.places.find(item=>item.id===place.id)
  // Rẽ nhánh nếu !source. | Tiếp phần `continue` của ContinueStatement.
  if(!source)continue
  // Khai báo merge: khai báo callback record=>({...record,period:source.period,content:structuredClone(source.rec. | Gán thuộc tính period: đọc source.period từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính content: Gọi structuredClone(source.record.content).
  const merge=record=>({...record,period:source.period,content:structuredClone(source.record.content)})
  // TẠI SAO (merge): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng quy
  // trình.
  // CHỨC NĂNG: Chỉ thay tám bài nguồn; không khôi phục điểm đã xóa/lưu trữ.
  // XỬ LÝ: Bản đang sửa được giữ lại nếu đã có body khác bài mẫu; audio mẫu
  // không khớp bị bỏ. Bản công khai nhận bộ bài mới theo yêu cầu cập nhật.
  // Rẽ nhánh nếu place.published. | Thực hiện tính biểu thức place.published=merge(place.published).
  if(place.published)place.published=merge(place.published)
  // Rẽ nhánh nếu place.workflow==='published'.
  if(place.workflow==='published'){
   // Thực hiện tính biểu thức place.record=merge(place.record). | Thực hiện tính biểu thức place.period=source.period.
   place.record=merge(place.record);place.period=source.period
   
   place.revision++;place.approvedRevision=place.revision
  }else{
   // Duyệt lần lượt Object.entries(place.record.content) bằng const [language,text].
   for(const [language,text] of Object.entries(place.record.content)){
    // Rẽ nhánh nếu text.audio?.url.startsWith('demo:'). | Thực hiện sử dụng delete text.audio làm giá trị của bước hiện tại.
    if(text.audio?.url.startsWith('demo:'))delete text.audio
    
    if(/nội dung minh họa|sample text|仅用于测试|serve para testar|サンプル/.test(text.body))place.record.content[language]=structuredClone(source.record.content[language])
   }
   // Thực hiện sử dụng place.revision++ làm giá trị của bước hiện tại. | Thực hiện tính biểu thức place.approvedRevision=undefined.
   place.revision++;place.approvedRevision=undefined
   
   if(['submitted','approved'].includes(place.workflow))place.workflow='draft'
  }
  // Thực hiện tính biểu thức place.updatedAt=date.
  place.updatedAt=date
  
  updated.audit.unshift({at:date,action:'upgradeHeritageContent',placeId:place.id,revision:place.revision})
 }
 // Thực hiện tính biểu thức updated.audit=updated.audit.slice(0,100).
 updated.audit=updated.audit.slice(0,100)
 // Thực hiện Gọi fs.writeFileSync(path.join(directory,'updated-document.json'),JSON.stringify(updated,null,.
 fs.writeFileSync(path.join(directory,'updated-document.json'),JSON.stringify(updated,null,2))
 // Không tự dừng server; người vận hành có thể kiểm tra bản chuyển trước.
 
 console.log(directory)
}
// TẠI SAO (main): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.
// Thực hiện Gọi main().catch(error=>{console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode=1.
main().catch(error=>{console.error(error.message);process.exitCode=1})
/* CÁCH KIỂM TRA: So bản original/updated; extra ID và ảnh không đổi;
 * tám bài công khai đủ năm bản và nguồn; original vẫn phục hồi được. */
