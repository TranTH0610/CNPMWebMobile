/**
 * FILE: apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts
 * FILE NÀY LÀM GÌ: Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét AppState.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useGateEntry } from '../../qr/hooks/useGhiNhanVaoCong'
/** FILE NÀY LÀM GÌ: Gửi heartbeat cho phiên native đang ở foreground và không mở admin.
 * RootNavigator gọi; phụ thuộc AppState và service presence. Không gửi tọa độ hoặc dữ liệu cá nhân.
 */

import { useEffect } from 'react'
import { AppState } from 'react-native'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/PhienHoatDong'
// CHỨC NĂNG: Một mã cho một lần chạy app, không phải danh tính hoặc token bảo mật.

const sessionId =
  'app_' +
  Date.now().toString(36) +
  '_' +
  Math.random().toString(36).slice(2) +
  Math.random().toString(36).slice(2)
// CHỨC NĂNG: Nối vòng đời du khách với nhịp báo hoạt động.
// XỬ LÝ: Chỉ gửi theo trạng thái hiển thị/hoạt động của nền tảng và dừng lịch khi không còn dùng.

// [UC14] usePresenceHeartbeat — Theo dõi vòng đời nền tảng để báo hoặc kết thúc phiên hoạt động.
export function usePresenceHeartbeat(enabled: boolean) {
  useGateEntry(enabled)
  // CHỨC NĂNG: Chạy heartbeat khi AppState là active; khi trạng thái đổi thì dừng lịch cũ
  // trước.
  // XỬ LÝ: Đăng ký sự kiện vòng đời phù hợp nền tảng, rồi cleanup gỡ listener và dừng
  // timer.
  useEffect(() => {
    const client = presenceClient

    if (!enabled || !client) return

    let stop: (() => void) | undefined

    const update = () => {
      stop?.()
      stop = undefined

      if (AppState.currentState === 'active')
        stop = startPresenceHeartbeat(client, { sessionId, platform: 'mobile-app' })
    }
    // TẠI SAO (update): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
    // dùng lại.
    // CHỨC NĂNG: Về nền dừng gửi; trở lại gửi ngay, không tạo thêm phiên.
    // XỬ LÝ: Cleanup gỡ listener và timer, request đang chạy có timeout 5 giây.

    const subscription = AppState.addEventListener('change', update)

    update()

    return () => {
      stop?.()
      subscription.remove()
    }
  }, [enabled])
  // TẠI SAO: Server dựa vào heartbeat để biết phiên còn sử dụng; không gia hạn mãi cho app nền
  // hoặc tab đã ẩn.
}
// TẠI SAO (usePresenceHeartbeat): Một app ở nền hoặc tab đã ẩn không nên tiếp tục được gia hạn
// như du khách đang tương tác.
/* CÁCH KIỂM TRA: Mở app tăng nhóm mobile; vào admin/ngủ quá 90 giây giảm; lỗi mạng không crash. */
