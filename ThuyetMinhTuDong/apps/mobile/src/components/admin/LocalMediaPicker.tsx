/** FILE NÀY LÀM GÌ: Chọn ảnh/bản thu từ thiết bị, lưu cục bộ cho FE demo.
 * Form di tích/nội dung gọi; UC13–UC14.2. Expo document-picker đúng SDK57.
 * Không upload hoặc gửi file ra ngoài. BE sau này thay bước đọc bằng MediaService.
 */
import { useEffect,useRef,useState } from 'react'
import { Text,View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { useAdminText } from '@travelguide/admin-core/react'
import { Action } from '../Action'
import { styles } from './AdminUI'
export function LocalMediaPicker({kind,onPick}:{kind:'image'|'audio';onPick:(value:string)=>void}){
 const t=useAdminText(),[busy,setBusy]=useState(false),[error,setError]=useState(false),alive=useRef(true)
 useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[])
 const pick=async()=>{
  setBusy(true);setError(false)
  try{
   const result=await DocumentPicker.getDocumentAsync({type:kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/wav','audio/ogg'],multiple:false,copyToCacheDirectory:true})
   if(result.canceled)return
   const asset=result.assets[0],mime=asset.mimeType==='audio/x-wav'?'audio/wav':asset.mimeType
   const allowed=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp3','audio/wav','audio/ogg']
   const info=await FileSystem.getInfoAsync(asset.uri)
   const size=asset.size??(info.exists?info.size:Infinity)
   if(!mime||!allowed.includes(mime)||size>1048576)throw Error('invalid')
   const base64=await FileSystem.readAsStringAsync(asset.uri,{encoding:FileSystem.EncodingType.Base64})
   if(base64.length>1400000)throw Error('invalid')
   if(alive.current)onPick('data:'+mime+';base64,'+base64)
  }catch{if(alive.current)setError(true)}finally{if(alive.current)setBusy(false)}
 }
 return <View style={{gap:8}}><Action title={t(kind==='image'?'pickImage':'pickAudio')} disabled={busy} onPress={()=>{void pick()}}/><Text style={styles.muted}>{t('fileHint')}</Text>{error&&<Text style={styles.error}>{t('mediaError')}</Text>}</View>
}
/* CÁCH KIỂM TRA: Hủy không lỗi; tệp >1MB bị chặn; lưu bản nháp rồi mở lại vẫn có file. */
