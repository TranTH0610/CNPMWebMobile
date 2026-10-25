import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Báo phiên du khách web đang mở và ở foreground.
 * App.tsx gọi duy nhất một lần; bản main-admin không gọi. Phụ thuộc sessionStorage, Visibility API và service.
 */
import { useEffect } from 'react'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Giữ mã ẩn danh khi reload, không dùng tên/IP/tài khoản.
// XỬ LÝ: Nếu trình duyệt chặn storage, dùng mã trong RAM của trang; đây không phải token xác thực.
let sessionId: string | undefined
function getSessionId() {
  if (sessionId) return sessionId
  const fresh = 'web_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  try {
    const saved = sessionStorage.getItem('hue-presence-session')
    sessionId = saved && /^[a-zA-Z0-9_-]{20,100}$/.test(saved) ? saved : fresh
    sessionStorage.setItem('hue-presence-session', sessionId)
  } catch { sessionId = fresh }
  return sessionId
}
export function usePresenceHeartbeat() {
  useGateEntry()
  useEffect(() => {
    let stop: (() => void) | undefined
    const update = () => {
      stop?.(); stop = undefined
      if (document.visibilityState === 'visible') {
        stop = startPresenceHeartbeat(presenceClient, { sessionId: getSessionId(), platform: 'web' })
      }
    }
    // CHỨC NĂNG: Tab ẩn/ngủ không gửi heartbeat; quay lại gửi ngay.
    // XỬ LÝ: Rời trang mất tối đa 90 giây để hết hạn; không dựa vào unload vốn không đảm bảo trên điện thoại.
    update()
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pageshow', update)
    const hide = () => { stop?.(); stop = undefined }
    window.addEventListener('pagehide', hide)
    return () => {
      hide(); document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pageshow', update); window.removeEventListener('pagehide', hide)
    }
  }, [])
}
/* CÁCH KIỂM TRA: Reload không tăng phiên; ẩn tab quá 90 giây hết active; mở riêng admin không tăng. */
