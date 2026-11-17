/**
 * FILE: apps/web/src/features/presence/services/PhienHoatDong.ts
 * FILE NÀY LÀM GÌ: Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'
// CHỨC NĂNG: Hai web dùng chung server dù chạy khác cổng.
// XỬ LÝ: Production đặt VITE_PRESENCE_API_URL hoặc cấu hình reverse proxy cùng đường dẫn.

export const presenceClient = createPresenceClient(
  import.meta.env.VITE_PRESENCE_API_URL || '/api/presence',
)
/* CÁCH KIỂM TRA: Heartbeat đi tới /api/presence/sessions/heartbeat; admin đọc statistics/active. */
