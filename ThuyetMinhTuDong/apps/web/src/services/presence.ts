/** FILE NÀY LÀM GÌ: Chọn địa chỉ API thống kê cho web du khách/quản lý.
 * Hook heartbeat và Dashboard gọi; phụ thuộc client dùng chung. Vite proxy chuyển tiếp khi chạy local.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'
// CHỨC NĂNG: Hai web dùng chung server dù chạy khác cổng.
// XỬ LÝ: Production đặt VITE_PRESENCE_API_URL hoặc cấu hình reverse proxy cùng đường dẫn.
export const presenceClient = createPresenceClient(import.meta.env.VITE_PRESENCE_API_URL || '/api/presence')
/* CÁCH KIỂM TRA: Heartbeat đi tới /api/presence/sessions/heartbeat; admin đọc statistics/active. */
