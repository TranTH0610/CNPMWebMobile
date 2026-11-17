/**
 * FILE: scripts/CapNhatNoiDungDiSan.cjs
 * FILE NÀY LÀM GÌ: Công cụ cập nhật cấu trúc/nội dung di tích theo nguồn đã chuẩn bị; không phải tác vụ người dùng
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module')
const root=path.resolve(__dirname,'..')
async function main(){
 const base=process.env.CATALOG_TARGET||'http://127.0.0.1:8788'
 const directory=path.join(root,'.runtime','heritage-upgrade-'+Date.now())
 fs.mkdirSync(directory,{recursive:true})
 const documentResponse=await fetch(base+'/document'),gateResponse=await fetch(base+'/gate/statistics')
 if(!documentResponse.ok||!gateResponse.ok)throw Error('Không sao lưu được server hiện tại')
 const original=await documentResponse.json(),gate=await gateResponse.json()
 fs.writeFileSync(path.join(directory,'original-document.json'),JSON.stringify(original,null,2))
 fs.writeFileSync(path.join(directory,'gate-statistics.json'),JSON.stringify(gate,null,2))
 const req=createRequire(path.join(root,'apps/web/package.json'))
 const outfile=path.join(directory,'admin-core.cjs')
 req('esbuild').buildSync({entryPoints:[path.join(root,'packages/admin-core/src/XuatCongKhai.ts')],bundle:true,platform:'node',format:'cjs',outfile})
 const {createAdminService}=require(outfile)
 const seed=await createAdminService({read:async()=>null,write:async()=>{}}).load()
 const updated=structuredClone(original),date=new Date().toISOString()
 // Duyệt lần lượt updated.places bằng const place.
 for(const place of updated.places){
  const source=seed.places.find(item=>item.id===place.id)
  if(!source)continue
  const merge=record=>({...record,period:source.period,content:structuredClone(source.record.content)})
  // TẠI SAO (merge): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng quy
  // trình.
  // CHỨC NĂNG: Chỉ thay tám bài nguồn; không khôi phục điểm đã xóa/lưu trữ.
  // XỬ LÝ: Bản đang sửa được giữ lại nếu đã có body khác bài mẫu; audio mẫu
  // không khớp bị bỏ. Bản công khai nhận bộ bài mới theo yêu cầu cập nhật.
  if(place.published)place.published=merge(place.published)
  if(place.workflow==='published'){
   place.record=merge(place.record);place.period=source.period
   
   place.revision++;place.approvedRevision=place.revision
  }else{
   // Duyệt lần lượt Object.entries(place.record.content) bằng const [language,text].
   for(const [language,text] of Object.entries(place.record.content)){
    if(text.audio?.url.startsWith('demo:'))delete text.audio
    
    if(/nội dung minh họa|sample text|仅用于测试|serve para testar|サンプル/.test(text.body))place.record.content[language]=structuredClone(source.record.content[language])
   }
   place.revision++;place.approvedRevision=undefined
   
   if(['submitted','approved'].includes(place.workflow))place.workflow='draft'
  }
  place.updatedAt=date
  
  updated.audit.unshift({at:date,action:'upgradeHeritageContent',placeId:place.id,revision:place.revision})
 }
 updated.audit=updated.audit.slice(0,100)
 fs.writeFileSync(path.join(directory,'updated-document.json'),JSON.stringify(updated,null,2))
 // Không tự dừng server; người vận hành có thể kiểm tra bản chuyển trước.
 
 console.log(directory)
}
// TẠI SAO (main): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.
main().catch(error=>{console.error(error.message);process.exitCode=1})
/* CÁCH KIỂM TRA: So bản original/updated; extra ID và ảnh không đổi;
 * tám bài công khai đủ năm bản và nguồn; original vẫn phục hồi được. */
