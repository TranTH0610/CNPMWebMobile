/**
 * FILE NÀY LÀM GÌ
 * Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của
 * admin.
 *
 * VỊ TRÍ: apps/web/src/services/presence.ts
 * DÙNG BỞI: apps/web/src/hooks/usePresenceHeartbeat.ts;
 * apps/web/src/pages/admin/DashboardPage.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core/presence
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/visitor-core/presence'.
import { createPresenceClient } from '@travelguide/visitor-core/presence'
// CHỨC NĂNG: Hai web dùng chung server dù chạy khác cổng.
// XỬ LÝ: Production đặt VITE_PRESENCE_API_URL hoặc cấu hình reverse proxy cùng đường dẫn.
// Khai báo presenceClient: Gọi createPresenceClient(import.meta.env.VITE_PRESENCE_API_URL || '/api/presence').
export const presenceClient = createPresenceClient(import.meta.env.VITE_PRESENCE_API_URL || '/api/presence')
/* CÁCH KIỂM TRA: Heartbeat đi tới /api/presence/sessions/heartbeat; admin đọc statistics/active. */
