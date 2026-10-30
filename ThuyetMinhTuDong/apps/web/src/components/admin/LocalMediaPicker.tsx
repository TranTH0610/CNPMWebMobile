/**
 * FILE NÀY LÀM GÌ
 * Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ
 * thật.
 *
 * VỊ TRÍ: apps/web/src/components/admin/LocalMediaPicker.tsx
 * DÙNG BỞI: apps/web/src/pages/admin/ContentEditorPage.tsx;
 * apps/web/src/pages/admin/PlaceFormPage.tsx.
 * PHỤ THUỘC: react; @travelguide/admin-core/react
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useState } from 'react'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdminText } from '@travelguide/admin-core/react'
// CHỨC NĂNG: Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp
// trên máy chủ thật.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo LocalMediaPicker({ kind,onPick }). Component hàm nhận props và dựng phần giao diện LocalMediaPicker. | Khai báo kind, kiểu 'image'|'audio'. | Khai báo onPick, kiểu (value:string)=>void.
export function LocalMediaPicker({ kind,onPick }: {kind:'image'|'audio';onPick:(value:string)=>void}) {
 // CHỨC NĂNG: Trạng thái lỗi để giao diện hiển thị thông báo và cho thử lại.
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [error,setError]: useState(false) giữ trạng thái qua các lần render.
 const t=useAdminText(),[error,setError]=useState(false)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <div className="admin-local-file"><label className="button secondary">{t(kind=`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accept: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `const file=event.target.files?.[0];event.target.value='';setError(false)`: Khai báo file: đọc event.target.files?.[0] từ đối tượng/mảng để dùng tại bước hiện tại. | Thực hiện tính biểu thức event.target.value=''. | Cập nhật trạng thái qua setError(false).
  * DÒNG `if(!file)return`: Rẽ nhánh nếu !file. | Thoát hàm hiện tại ngay.
  * DÒNG `const types=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','aud`: Khai báo types: chọn giữa hai giá trị theo điều kiện kind==='image'.
  * DÒNG `if(file.size>1048576||!types.includes(file.type)){setError(true);return}`: Rẽ nhánh nếu file.size>1048576||!types.includes(file.type). | Cập nhật trạng thái qua setError(true). | Thoát hàm hiện tại ngay.
  * DÒNG `const reader=new FileReader();reader.onerror=()=>setError(true)`: Khai báo reader: Tạo đối tượng bằng new FileReader(). | Thực hiện tính biểu thức reader.onerror=()=>setError(true).
  * DÒNG `reader.onload=()=>{if(typeof reader.result==='string')onPick(reader.result)};reader.r`: Thực hiện tính biểu thức reader.onload=()=>{if(typeof reader.result==='string')onPick(reader.result)}. | Rẽ nhánh nếu typeof reader.result==='string'. | Thực hiện Gọi onPick(reader.result). | Thực hiện Gọi reader.readAsDataURL(file).
  * DÒNG `}}/></label><p>{t('fileHint')}</p>{error&&<p role="alert" className="admin-error">{t(`: Đưa biểu thức JavaScript event=>{ const file=event.target.files?.[0]. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <div className="admin-local-file"><label className="button secondary">{t(kind==='image'?'pickImage':'pickAudio')}<input type="file" accept={kind==='image'?'image/jpeg,image/png,image/webp':'audio/mpeg,audio/wav,audio/ogg'} onChange={event=>{
  const file=event.target.files?.[0];event.target.value='';setError(false)
  if(!file)return
  const types=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp3','audio/wav','audio/ogg']
  if(file.size>1048576||!types.includes(file.type)){setError(true);return}
  const reader=new FileReader();reader.onerror=()=>setError(true)
  reader.onload=()=>{if(typeof reader.result==='string')onPick(reader.result)};reader.readAsDataURL(file)
 }}/></label><p>{t('fileHint')}</p>{error&&<p role="alert" className="admin-error">{t('mediaError')}</p>}</div>
}
// TẠI SAO (LocalMediaPicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa
// giao diện tại một nơi.
/* CÁCH KIỂM TRA: Tệp >1MB bị từ chối; ảnh/audio chọn được giữ sau tải lại khi đã lưu. */
