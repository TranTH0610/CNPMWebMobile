/**
 * FILE NÀY LÀM GÌ
 * Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét
 * AppState.
 *
 * VỊ TRÍ: apps/mobile/src/hooks/usePresenceHeartbeat.ts
 * DÙNG BỞI: apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: ./useGateEntry; react; react-native; @travelguide/visitor-core/presence;
 * ../services/presence
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ './useGateEntry'.
import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Gửi heartbeat cho phiên native đang ở foreground và không mở admin.
 * RootNavigator gọi; phụ thuộc AppState và service presence. Không gửi tọa độ hoặc dữ liệu cá nhân.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ 'react-native'.
import { AppState } from 'react-native'
// Nhập các thành phần từ '@travelguide/visitor-core/presence'.
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
// Nhập các thành phần từ '../services/presence'.
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Một mã cho một lần chạy app, không phải danh tính hoặc token bảo mật.
// Khai báo sessionId: tính biểu thức 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random.
const sessionId = 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
// CHỨC NĂNG: Nối vòng đời du khách với nhịp báo hoạt động.
// XỬ LÝ: Chỉ gửi theo trạng thái hiển thị/hoạt động của nền tảng và dừng lịch khi không còn dùng.
// Khai báo usePresenceHeartbeat(enabled). Nối vòng đời giao diện du khách với heartbeat.
export function usePresenceHeartbeat(enabled: boolean) {
  // Thực hiện Gọi useGateEntry(enabled).
  useGateEntry(enabled)
  // DÒNG NÀY LÀM GÌ: Chạy heartbeat khi AppState là active; khi trạng thái đổi thì dừng lịch cũ
  // trước.
  // CÁCH HOẠT ĐỘNG: Đăng ký sự kiện vòng đời phù hợp nền tảng, rồi cleanup gỡ listener và dừng
  // timer.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: enabled.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo client: sử dụng presenceClient làm giá trị của bước hiện tại.
    const client = presenceClient
    // Rẽ nhánh nếu !enabled || !client. | Thoát hàm hiện tại ngay.
    if (!enabled || !client) return
    // Khai báo stop: không có giá trị khởi tạo.
    let stop: (() => void) | undefined
    // Khai báo update: khai báo callback () => { stop?.().
    const update = () => {
      // Thực hiện Gọi stop?.(). | Thực hiện tính biểu thức stop = undefined.
      stop?.(); stop = undefined
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (AppState.currentState === 'active') stop = startPresenceHeartbeat(client, { sessi`: Rẽ nhánh nếu AppState.currentState === 'active'. | Thực hiện tính biểu thức stop = startPresenceHeartbeat(client, { sessionId, platform: 'mobile-app' }). | Đặt trường sessionId bằng giá trị của biến cùng tên. | Gán thuộc tính platform: chuỗi 'mobile-app'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (AppState.currentState === 'active') stop = startPresenceHeartbeat(client, { sessionId, platform: 'mobile-app' })
    }
    // TẠI SAO (update): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
    // dùng lại.
    // CHỨC NĂNG: Về nền dừng gửi; trở lại gửi ngay, không tạo thêm phiên.
    // XỬ LÝ: Cleanup gỡ listener và timer, request đang chạy có timeout 5 giây.
    // Khai báo subscription: Gọi AppState.addEventListener('change', update).
    const subscription = AppState.addEventListener('change', update)
    // Thực hiện Gọi update().
    update()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => { stop?.(); subscription.remove() }`: Trả kết quả: khai báo callback () => { stop?.(). | Thực hiện Gọi stop?.(). | Thực hiện Gọi subscription.remove().
     * DÒNG `}, [enabled])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return () => { stop?.(); subscription.remove() }
  }, [enabled])
  // TẠI SAO: Server dựa vào heartbeat để biết phiên còn sử dụng; không gia hạn mãi cho app nền
  // hoặc tab đã ẩn.
}
// TẠI SAO (usePresenceHeartbeat): Một app ở nền hoặc tab đã ẩn không nên tiếp tục được gia hạn
// như du khách đang tương tác.
/* CÁCH KIỂM TRA: Mở app tăng nhóm mobile; vào admin/ngủ quá 90 giây giảm; lỗi mạng không crash. */
