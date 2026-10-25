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
