/**
 * FILE: packages/visitor-core/src/presence/TheoDoiPhienReact.ts
 * FILE NÀY LÀM GÌ: Hook đọc thống kê định kỳ cho admin; quản lý tải, lỗi, thử lại và dừng lịch khi component rời
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect, useState } from 'react'
import type { PresenceClient, PresenceStats } from './PhienHoatDong'
// CHỨC NĂNG: Lấy thống kê phiên cho màn tổng quan admin.
// XỬ LÝ: Tải lại mỗi 5 giây, bỏ kết quả cũ khi rời màn; lỗi giữ trạng thái chưa có dữ liệu.
// [UC14] usePresenceStatistics — Lấy và cập nhật số liệu phiên hoạt động cho màn tổng quan.
export function usePresenceStatistics(client: PresenceClient | null) {
  // CHỨC NĂNG: Kết quả thống kê đã tải; null nghĩa là chưa có số liệu hợp lệ.
  const [stats, setStats] = useState<PresenceStats | null>(null)
  // CHỨC NĂNG: Trạng thái lỗi để giao diện hiển thị thông báo và cho thử lại.
  const [error, setError] = useState(false)
  // CHỨC NĂNG: Bộ đếm thử lại; thay đổi giá trị này để effect tải dữ liệu chạy lại.
  const [attempt, setAttempt] = useState(0)
  // CHỨC NĂNG: Tải số phiên hiện tại và lên lịch cập nhật tiếp.
  // XỬ LÝ: Chờ request xong rồi đặt timer; cleanup hủy lịch và bỏ kết quả đã lỗi thời.
  // CHỨC NĂNG: Gọi API thống kê, cập nhật kết quả hoặc lỗi, rồi lên lịch lần kế tiếp sau 5
  // giây.
  // XỬ LÝ: Chỉ cập nhật khi vòng effect còn hoạt động; cleanup tắt cờ và hủy timer đang
  // chờ.
  useEffect(() => {
    // CHỨC NĂNG: Cờ nguồn/đối tượng đã đóng; ngăn callback đến muộn tiếp tục thao tác.
    let disposed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    // Cập nhật trạng thái qua setStats(null). | Cập nhật trạng thái qua setError(false).
    setStats(null); setError(false)
    // CHỨC NĂNG: Tải số phiên hiện tại; lỗi hiển thị chưa có số liệu thay vì số 0 giả.
    // XỬ LÝ: Không chồng request; dọn timer và bỏ kết quả cũ khi rời màn hoặc thử lại.
    // [UC14] poll — Tải số phiên hiện tại; lỗi hiển thị chưa có số liệu thay vì số 0 giả.
    const poll = async () => {
      try {
        if (!client) throw new Error('presence_not_configured')
        const next = await client.statistics()
        
        if (!disposed) { setStats(next); setError(false) }
      } catch { if (!disposed) { setStats(null); setError(true) } }
      
      if (!disposed) timer = setTimeout(() => { void poll() }, 5000)
    }
    // TẠI SAO (poll): Mỗi lần lấy thống kê phải kết thúc trước khi đặt lịch mới; cờ vòng đời chặn
    // kết quả của lần đã bị hủy.
    void poll()
    
    return () => { disposed = true; if (timer) clearTimeout(timer) }
  }, [client, attempt])
  // TẠI SAO: Không gửi chồng request hoặc để kết quả cũ ghi đè lần thử lại; lỗi API không được
  // hiển thị thành số 0 giả.
  
  return { stats, error, retry: () => setAttempt(value => value + 1) }
}
// TẠI SAO (usePresenceStatistics): Admin cần số liệu cập nhật mà không tải lại trang; lỗi mạng
// không được biến thành con số 0 gây hiểu nhầm.
/* CÁCH KIỂM TRA: Hai admin dùng cùng URL có cùng số; server tắt hiện lỗi; bật lại tự phục hồi. */
