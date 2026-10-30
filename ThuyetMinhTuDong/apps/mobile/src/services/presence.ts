/**
 * FILE NÀY LÀM GÌ
 * Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của
 * admin.
 *
 * VỊ TRÍ: apps/mobile/src/services/presence.ts
 * DÙNG BỞI: apps/mobile/src/hooks/usePresenceHeartbeat.ts;
 * apps/mobile/src/screens/admin/DashboardScreen.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core/presence
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/visitor-core/presence'.
import { createPresenceClient } from '@travelguide/visitor-core/presence'
// Khai báo url: đọc process.env.EXPO_PUBLIC_PRESENCE_API_URL từ đối tượng/mảng để dùng tại bước hiện tại.
const url = process.env.EXPO_PUBLIC_PRESENCE_API_URL
// CHỨC NĂNG: Không cấu hình thì tắt thống kê, không gây lỗi luồng du khách.
// XỬ LÝ: Điện thoại thật dùng http://IP_MAY_TINH:8787 hoặc HTTPS được triển khai.
// Khai báo presenceClient: chọn giữa hai giá trị theo điều kiện url.
export const presenceClient = url ? createPresenceClient(url) : null
// CHỨC NĂNG: Bản quản lý dùng địa chỉ thống kê nội bộ riêng nếu có.
// XỬ LÝ: Tunnel du khách chỉ nhận heartbeat, không công khai API đọc thống kê quản lý.
// Khai báo adminBase: đọc process.env.EXPO_PUBLIC_ADMIN_API_URL từ đối tượng/mảng để dùng tại bước hiện tại.
const adminBase = process.env.EXPO_PUBLIC_ADMIN_API_URL
// Không dùng tunnel visitor làm nguồn thống kê Admin: public proxy không cấp route đọc này.
// Khai báo adminUrl: tính biểu thức process.env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL || (adminBase ? adminBase.replace(/\/$/, ''.
const adminUrl = process.env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL || (adminBase ? adminBase.replace(/\/$/, '') + '/presence' : undefined)
// Khai báo adminPresenceClient: chọn giữa hai giá trị theo điều kiện adminUrl.
export const adminPresenceClient = adminUrl ? createPresenceClient(adminUrl) : null
/* CÁCH KIỂM TRA: Thêm URL vào .env rồi restart Expo; thiếu URL admin báo chưa kết nối. */
