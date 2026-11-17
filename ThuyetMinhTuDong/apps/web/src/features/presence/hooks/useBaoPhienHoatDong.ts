/**
 * FILE: apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts
 * FILE NÀY LÀM GÌ: Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useGateEntry } from '../../qr/hooks/useGhiNhanVaoCong'
/** FILE NÀY LÀM GÌ: Báo phiên du khách web đang mở và ở foreground.
 * App.tsx gọi duy nhất một lần; bản main-admin không gọi. Phụ thuộc sessionStorage, Visibility API và service.
 */

import { useEffect } from 'react'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/PhienHoatDong'
// CHỨC NĂNG: Giữ mã ẩn danh khi reload, không dùng tên/IP/tài khoản.
// XỬ LÝ: Nếu trình duyệt chặn storage, dùng mã trong RAM của trang; đây không phải token xác thực.

let sessionId: string | undefined
// CHỨC NĂNG: Giữ một mã phiên ẩn danh ổn định khi tải lại trang.
// XỬ LÝ: Ưu tiên sessionStorage; nếu storage bị chặn thì giữ mã trong RAM của trang.

// [UC14] getSessionId — Giữ một mã phiên ẩn danh ổn định khi tải lại trang.
function getSessionId() {
  if (sessionId) return sessionId

  const fresh =
    'web_' +
    Date.now().toString(36) +
    '_' +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)

  try {
    const saved = sessionStorage.getItem('hue-presence-session')

    sessionId = saved && /^[a-zA-Z0-9_-]{20,100}$/.test(saved) ? saved : fresh

    sessionStorage.setItem('hue-presence-session', sessionId)
  } catch {
    sessionId = fresh
  }

  return sessionId
}
// TẠI SAO (getSessionId): Đổi mã theo mỗi render/reload sẽ làm một lượt dùng bị tính thành nhiều
// phiên.
// CHỨC NĂNG: Nối vòng đời du khách với nhịp báo hoạt động.
// XỬ LÝ: Chỉ gửi theo trạng thái hiển thị/hoạt động của nền tảng và dừng lịch khi không còn dùng.

// [UC14] usePresenceHeartbeat — Theo dõi vòng đời nền tảng để báo hoặc kết thúc phiên hoạt động.
export function usePresenceHeartbeat() {
  useGateEntry()
  // CHỨC NĂNG: Chỉ báo hoạt động khi tab du khách đang hiển thị.
  // XỬ LÝ: Theo dõi sự kiện trình duyệt và gỡ các listener khi component đóng.
  // CHỨC NĂNG: Chạy heartbeat khi tab visible; ẩn/rời trang thì dừng lịch gửi.
  // XỬ LÝ: Đăng ký sự kiện vòng đời phù hợp nền tảng, rồi cleanup gỡ listener và dừng
  // timer.
  // khi rời component.
  useEffect(() => {
    let stop: (() => void) | undefined

    const update = () => {
      stop?.()
      stop = undefined

      if (document.visibilityState === 'visible') {
        stop = startPresenceHeartbeat(presenceClient, {
          sessionId: getSessionId(),
          platform: 'web',
        })
      }
    }
    // TẠI SAO (update): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
    // dùng lại.
    // CHỨC NĂNG: Tab ẩn/ngủ không gửi heartbeat; quay lại gửi ngay.
    // XỬ LÝ: Rời trang mất tối đa 90 giây để hết hạn; không dựa vào unload vốn không đảm bảo trên điện thoại.

    update()

    document.addEventListener('visibilitychange', update)

    window.addEventListener('pageshow', update)

    const hide = () => {
      stop?.()
      stop = undefined
    }
    // TẠI SAO (hide): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và dùng
    // lại.

    window.addEventListener('pagehide', hide)

    return () => {
      hide()
      document.removeEventListener('visibilitychange', update)

      window.removeEventListener('pageshow', update)
      window.removeEventListener('pagehide', hide)
    }
  }, [])
  // TẠI SAO: Server dựa vào heartbeat để biết phiên còn sử dụng; không gia hạn mãi cho app nền
  // hoặc tab đã ẩn.
}
// TẠI SAO (usePresenceHeartbeat): Một app ở nền hoặc tab đã ẩn không nên tiếp tục được gia hạn
// như du khách đang tương tác.
/* CÁCH KIỂM TRA: Reload không tăng phiên; ẩn tab quá 90 giây hết active; mở riêng admin không tăng. */
