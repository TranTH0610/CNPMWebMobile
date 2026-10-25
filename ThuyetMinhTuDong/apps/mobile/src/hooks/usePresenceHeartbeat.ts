import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Gửi heartbeat cho phiên native đang ở foreground và không mở admin.
 * RootNavigator gọi; phụ thuộc AppState và service presence. Không gửi tọa độ hoặc dữ liệu cá nhân.
 */
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Một mã cho một lần chạy app, không phải danh tính hoặc token bảo mật.
const sessionId = 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
export function usePresenceHeartbeat(enabled: boolean) {
  useGateEntry(enabled)
  useEffect(() => {
    const client = presenceClient
    if (!enabled || !client) return
    let stop: (() => void) | undefined
    const update = () => {
      stop?.(); stop = undefined
      if (AppState.currentState === 'active') stop = startPresenceHeartbeat(client, { sessionId, platform: 'mobile-app' })
    }
    // CHỨC NĂNG: Về nền dừng gửi; trở lại gửi ngay, không tạo thêm phiên.
    // XỬ LÝ: Cleanup gỡ listener và timer, request đang chạy có timeout 5 giây.
    const subscription = AppState.addEventListener('change', update)
    update()
    return () => { stop?.(); subscription.remove() }
  }, [enabled])
}
/* CÁCH KIỂM TRA: Mở app tăng nhóm mobile; vào admin/ngủ quá 90 giây giảm; lỗi mạng không crash. */
