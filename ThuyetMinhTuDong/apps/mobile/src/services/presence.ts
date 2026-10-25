/** FILE NÀY LÀM GÌ: Ghép URL server RAM cho native; hooks và Dashboard dùng.
 * Phụ thuộc biến Expo và client dùng chung. Không dùng localhost máy tính trên điện thoại thật.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'
const url = process.env.EXPO_PUBLIC_PRESENCE_API_URL
// CHỨC NĂNG: Không cấu hình thì tắt thống kê, không gây lỗi luồng du khách.
// XỬ LÝ: Điện thoại thật dùng http://IP_MAY_TINH:8787 hoặc HTTPS được triển khai.
export const presenceClient = url ? createPresenceClient(url) : null
// CHỨC NĂNG: Bản quản lý dùng địa chỉ thống kê nội bộ riêng nếu có.
// XỬ LÝ: Tunnel du khách chỉ nhận heartbeat, không công khai API đọc thống kê quản lý.
const adminUrl = process.env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL || url
export const adminPresenceClient = adminUrl ? createPresenceClient(adminUrl) : null
/* CÁCH KIỂM TRA: Thêm URL vào .env rồi restart Expo; thiếu URL admin báo chưa kết nối. */
