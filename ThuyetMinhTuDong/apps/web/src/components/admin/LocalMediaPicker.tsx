/** FILE NÀY LÀM GÌ: Chọn tệp local cho bản FE, không giả gọi upload server.
 * PlaceForm/ContentEditor dùng; UC13–UC14.2. Giới hạn 1 MB để tránh đầy localStorage.
 * Khi có BE, thay bước đọc base64 bằng MediaService upload trả về URL. */
import { useState } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
export function LocalMediaPicker({ kind,onPick }: {kind:'image'|'audio';onPick:(value:string)=>void}) {
 const t=useAdminText(),[error,setError]=useState(false)
 return <div className="admin-local-file"><label className="button secondary">{t(kind==='image'?'pickImage':'pickAudio')}<input type="file" accept={kind==='image'?'image/jpeg,image/png,image/webp':'audio/mpeg,audio/wav,audio/ogg'} onChange={event=>{
  const file=event.target.files?.[0];event.target.value='';setError(false)
  if(!file)return
  const types=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp3','audio/wav','audio/ogg']
  if(file.size>1048576||!types.includes(file.type)){setError(true);return}
  const reader=new FileReader();reader.onerror=()=>setError(true)
  reader.onload=()=>{if(typeof reader.result==='string')onPick(reader.result)};reader.readAsDataURL(file)
 }}/></label><p>{t('fileHint')}</p>{error&&<p role="alert" className="admin-error">{t('mediaError')}</p>}</div>
}
/* CÁCH KIỂM TRA: Tệp >1MB bị từ chối; ảnh/audio chọn được giữ sau tải lại khi đã lưu. */
