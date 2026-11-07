/**
 * CHỨC NĂNG: [PHIEN-HOAT-DONG] [THONG-KE]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.
 *
 * VỊ TRÍ: apps/web/src/features/presence/services/PhienHoatDong.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/dashboard/TrangTongQuan.tsx
 * - apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core/presence
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'
// CHỨC NĂNG: Hai web dùng chung server dù chạy khác cổng.
// XỬ LÝ: Production đặt VITE_PRESENCE_API_URL hoặc cấu hình reverse proxy cùng đường dẫn.

export const presenceClient = createPresenceClient(
  import.meta.env.VITE_PRESENCE_API_URL || '/api/presence',
)
/* CÁCH KIỂM TRA: Heartbeat đi tới /api/presence/sessions/heartbeat; admin đọc statistics/active. */
