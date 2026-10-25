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
  const receive=(url:string|null|undefined)=>{
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
