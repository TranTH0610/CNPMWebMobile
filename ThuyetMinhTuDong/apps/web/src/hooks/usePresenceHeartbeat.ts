/**
 * FILE NÀY LÀM GÌ
 * Báo phiên du khách đang hoạt động theo vòng đời nền tảng; web xét tab hiển thị, native xét
 * AppState.
 *
 * VỊ TRÍ: apps/web/src/hooks/usePresenceHeartbeat.ts
 * DÙNG BỞI: apps/web/src/App.tsx.
 * PHỤ THUỘC: ./useGateEntry; react; @travelguide/visitor-core/presence; ../services/presence
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ './useGateEntry'.
import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Báo phiên du khách web đang mở và ở foreground.
 * App.tsx gọi duy nhất một lần; bản main-admin không gọi. Phụ thuộc sessionStorage, Visibility API và service.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ '@travelguide/visitor-core/presence'.
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
// Nhập các thành phần từ '../services/presence'.
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Giữ mã ẩn danh khi reload, không dùng tên/IP/tài khoản.
// XỬ LÝ: Nếu trình duyệt chặn storage, dùng mã trong RAM của trang; đây không phải token xác thực.
// Khai báo sessionId: không có giá trị khởi tạo.
let sessionId: string | undefined
// CHỨC NĂNG: Giữ một mã phiên ẩn danh ổn định khi tải lại trang.
// XỬ LÝ: Ưu tiên sessionStorage; nếu storage bị chặn thì giữ mã trong RAM của trang.
// Khai báo getSessionId(). Lấy/tạo mã phiên ẩn danh.
function getSessionId() {
  // Rẽ nhánh nếu sessionId. | Trả kết quả: sử dụng sessionId làm giá trị của bước hiện tại.
  if (sessionId) return sessionId
  // Khai báo fresh: tính biểu thức 'web_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random.
  const fresh = 'web_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  // Bắt đầu vùng try.
  try {
    // Khai báo saved: sessionStorage.getItem đọc giá trị đã lưu.
    const saved = sessionStorage.getItem('hue-presence-session')
    // Thực hiện tính biểu thức sessionId = saved && /^[a-zA-Z0-9_-]{20,100}$/.test(saved) ? saved : fresh.
    sessionId = saved && /^[a-zA-Z0-9_-]{20,100}$/.test(saved) ? saved : fresh
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `sessionStorage.setItem('hue-presence-session', sessionId)`: Thực hiện Gọi sessionStorage.setItem('hue-presence-session', sessionId).
     * DÒNG `} catch { sessionId = fresh }`: Bắt đầu vùng try. | Thực hiện tính biểu thức sessionId = fresh.
     */
    sessionStorage.setItem('hue-presence-session', sessionId)
  } catch { sessionId = fresh }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return sessionId`: Trả kết quả: sử dụng sessionId làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return sessionId
}
// TẠI SAO (getSessionId): Đổi mã theo mỗi render/reload sẽ làm một lượt dùng bị tính thành nhiều
// phiên.
// CHỨC NĂNG: Nối vòng đời du khách với nhịp báo hoạt động.
// XỬ LÝ: Chỉ gửi theo trạng thái hiển thị/hoạt động của nền tảng và dừng lịch khi không còn dùng.
// Khai báo usePresenceHeartbeat(). Nối vòng đời giao diện du khách với heartbeat.
export function usePresenceHeartbeat() {
  // Thực hiện Gọi useGateEntry().
  useGateEntry()
  // CHỨC NĂNG: Chỉ báo hoạt động khi tab du khách đang hiển thị.
  // XỬ LÝ: Theo dõi sự kiện trình duyệt và gỡ các listener khi component đóng.
  // DÒNG NÀY LÀM GÌ: Chạy heartbeat khi tab visible; ẩn/rời trang thì dừng lịch gửi.
  // CÁCH HOẠT ĐỘNG: Đăng ký sự kiện vòng đời phù hợp nền tảng, rồi cleanup gỡ listener và dừng
  // timer.
  // KHI NÀO CHẠY: Theo vòng mount của component; mảng [] không theo dõi props/state. Cleanup chạy
  // khi rời component.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo stop: không có giá trị khởi tạo.
    let stop: (() => void) | undefined
    // Khai báo update: khai báo callback () => { stop?.().
    const update = () => {
      // Thực hiện Gọi stop?.(). | Thực hiện tính biểu thức stop = undefined.
      stop?.(); stop = undefined
      // Rẽ nhánh nếu document.visibilityState === 'visible'.
      if (document.visibilityState === 'visible') {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `stop = startPresenceHeartbeat(presenceClient, { sessionId: getSessionId(), platform: `: Thực hiện tính biểu thức stop = startPresenceHeartbeat(presenceClient, { sessionId: getSessionId(), platform: 'web'. | Gán thuộc tính sessionId: Gọi getSessionId(). | Gán thuộc tính platform: chuỗi 'web'.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        stop = startPresenceHeartbeat(presenceClient, { sessionId: getSessionId(), platform: 'web' })
      }
    }
    // TẠI SAO (update): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
    // dùng lại.
    // CHỨC NĂNG: Tab ẩn/ngủ không gửi heartbeat; quay lại gửi ngay.
    // XỬ LÝ: Rời trang mất tối đa 90 giây để hết hạn; không dựa vào unload vốn không đảm bảo trên điện thoại.
    // Thực hiện Gọi update().
    update()
    // Đăng ký xử lý sự kiện: document.addEventListener('visibilitychange', update).
    document.addEventListener('visibilitychange', update)
    // Đăng ký xử lý sự kiện: window.addEventListener('pageshow', update).
    window.addEventListener('pageshow', update)
    // Khai báo hide: khai báo callback () => { stop?.(). | Thực hiện Gọi stop?.(). | Thực hiện tính biểu thức stop = undefined.
    const hide = () => { stop?.(); stop = undefined }
    // TẠI SAO (hide): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và dùng
    // lại.
    // Đăng ký xử lý sự kiện: window.addEventListener('pagehide', hide).
    window.addEventListener('pagehide', hide)
    // Trả kết quả: khai báo callback () => { hide().
    return () => {
      // Thực hiện Gọi hide(). | Dọn đăng ký/timer: document.removeEventListener('visibilitychange', update).
      hide(); document.removeEventListener('visibilitychange', update)
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `window.removeEventListener('pageshow', update); window.removeEventListener('pagehide'`: Dọn đăng ký/timer: window.removeEventListener('pageshow', update). | Dọn đăng ký/timer: window.removeEventListener('pagehide', hide).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [])`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      window.removeEventListener('pageshow', update); window.removeEventListener('pagehide', hide)
    }
  }, [])
  // TẠI SAO: Server dựa vào heartbeat để biết phiên còn sử dụng; không gia hạn mãi cho app nền
  // hoặc tab đã ẩn.
}
// TẠI SAO (usePresenceHeartbeat): Một app ở nền hoặc tab đã ẩn không nên tiếp tục được gia hạn
// như du khách đang tương tác.
/* CÁCH KIỂM TRA: Reload không tăng phiên; ẩn tab quá 90 giây hết active; mở riêng admin không tăng. */
