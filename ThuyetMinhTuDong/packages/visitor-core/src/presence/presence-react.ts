/**
 * FILE NÀY LÀM GÌ
 * Hook đọc thống kê định kỳ cho admin; quản lý tải, lỗi, thử lại và dừng lịch khi component rời
 * màn.
 *
 * VỊ TRÍ: packages/visitor-core/src/presence/presence-react.ts
 * DÙNG BỞI: apps/mobile/src/screens/admin/DashboardScreen.tsx;
 * apps/web/src/pages/admin/DashboardPage.tsx.
 * PHỤ THUỘC: react; ./presence
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'
// Nhập kiểu dữ liệu từ './presence'.
import type { PresenceClient, PresenceStats } from './presence'
// CHỨC NĂNG: Lấy thống kê phiên cho màn tổng quan admin.
// XỬ LÝ: Tải lại mỗi 5 giây, bỏ kết quả cũ khi rời màn; lỗi giữ trạng thái chưa có dữ liệu.
// Khai báo usePresenceStatistics(client). Đăng ký tải lại thống kê định kỳ, cập nhật lỗi/tải và cleanup khi admin rời màn.
export function usePresenceStatistics(client: PresenceClient | null) {
  // CHỨC NĂNG: Kết quả thống kê đã tải; null nghĩa là chưa có số liệu hợp lệ.
  // Khai báo [stats, setStats]: useState(null) giữ trạng thái qua các lần render.
  const [stats, setStats] = useState<PresenceStats | null>(null)
  // CHỨC NĂNG: Trạng thái lỗi để giao diện hiển thị thông báo và cho thử lại.
  // Khai báo [error, setError]: useState(false) giữ trạng thái qua các lần render.
  const [error, setError] = useState(false)
  // CHỨC NĂNG: Bộ đếm thử lại; thay đổi giá trị này để effect tải dữ liệu chạy lại.
  // Khai báo [attempt, setAttempt]: useState(0) giữ trạng thái qua các lần render.
  const [attempt, setAttempt] = useState(0)
  // CHỨC NĂNG: Tải số phiên hiện tại và lên lịch cập nhật tiếp.
  // XỬ LÝ: Chờ request xong rồi đặt timer; cleanup hủy lịch và bỏ kết quả đã lỗi thời.
  // DÒNG NÀY LÀM GÌ: Gọi API thống kê, cập nhật kết quả hoặc lỗi, rồi lên lịch lần kế tiếp sau 5
  // giây.
  // CÁCH HOẠT ĐỘNG: Chỉ cập nhật khi vòng effect còn hoạt động; cleanup tắt cờ và hủy timer đang
  // chờ.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: client, attempt.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // CHỨC NĂNG: Cờ nguồn/đối tượng đã đóng; ngăn callback đến muộn tiếp tục thao tác.
    // Khai báo disposed: sử dụng false làm giá trị của bước hiện tại.
    let disposed = false
    // Khai báo timer: không có giá trị khởi tạo.
    let timer: ReturnType<typeof setTimeout> | undefined
    // Cập nhật trạng thái qua setStats(null). | Cập nhật trạng thái qua setError(false).
    setStats(null); setError(false)
    // CHỨC NĂNG: Tải số phiên hiện tại; lỗi hiển thị chưa có số liệu thay vì số 0 giả.
    // XỬ LÝ: Không chồng request; dọn timer và bỏ kết quả cũ khi rời màn hoặc thử lại.
    // Khai báo poll: khai báo callback async () => { try { if (!client) throw new Error('presence_not_configured').
    const poll = async () => {
      // Bắt đầu vùng try.
      try {
        // Rẽ nhánh nếu !client. | Ném new Error('presence_not_configured').
        if (!client) throw new Error('presence_not_configured')
        // Khai báo next: await chờ Gọi client.statistics().
        const next = await client.statistics()
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (!disposed) { setStats(next); setError(false) }`: Rẽ nhánh nếu !disposed. | Cập nhật trạng thái qua setStats(next). | Cập nhật trạng thái qua setError(false).
         * DÒNG `} catch { if (!disposed) { setStats(null); setError(true) } }`: Bắt đầu vùng try. | Rẽ nhánh nếu !disposed. | Cập nhật trạng thái qua setStats(null). | Cập nhật trạng thái qua setError(true).
         */
        if (!disposed) { setStats(next); setError(false) }
      } catch { if (!disposed) { setStats(null); setError(true) } }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (!disposed) timer = setTimeout(() => { void poll() }, 5000)`: Rẽ nhánh nếu !disposed. | Thực hiện tính biểu thức timer = setTimeout(() => { void poll() }, 5000). | Thực hiện sử dụng void poll() làm giá trị của bước hiện tại.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (!disposed) timer = setTimeout(() => { void poll() }, 5000)
    }
    // TẠI SAO (poll): Mỗi lần lấy thống kê phải kết thúc trước khi đặt lịch mới; cờ vòng đời chặn
    // kết quả của lần đã bị hủy.
    // Thực hiện sử dụng void poll() làm giá trị của bước hiện tại.
    void poll()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => { disposed = true; if (timer) clearTimeout(timer) }`: Trả kết quả: khai báo callback () => { disposed = true. | Thực hiện tính biểu thức disposed = true. | Rẽ nhánh nếu timer. | Dọn đăng ký/timer: clearTimeout(timer).
     * DÒNG `}, [client, attempt])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    return () => { disposed = true; if (timer) clearTimeout(timer) }
  }, [client, attempt])
  // TẠI SAO: Không gửi chồng request hoặc để kết quả cũ ghi đè lần thử lại; lỗi API không được
  // hiển thị thành số 0 giả.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return { stats, error, retry: () => setAttempt(value => value + 1) }`: Trả kết quả: tạo object gồm stats, error, retry. | Đặt trường stats bằng giá trị của biến cùng tên. | Đặt trường error bằng giá trị của biến cùng tên. | Gán thuộc tính retry: khai báo callback () => setAttempt(value => value + 1).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return { stats, error, retry: () => setAttempt(value => value + 1) }
}
// TẠI SAO (usePresenceStatistics): Admin cần số liệu cập nhật mà không tải lại trang; lỗi mạng
// không được biến thành con số 0 gây hiểu nhầm.
/* CÁCH KIỂM TRA: Hai admin dùng cùng URL có cùng số; server tắt hiện lỗi; bật lại tự phục hồi. */
