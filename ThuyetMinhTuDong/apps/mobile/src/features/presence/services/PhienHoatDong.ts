/**
 * FILE: apps/mobile/src/features/presence/services/PhienHoatDong.ts
 * FILE NÀY LÀM GÌ: Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'

const url = process.env.EXPO_PUBLIC_PRESENCE_API_URL
// CHỨC NĂNG: Không cấu hình thì tắt thống kê, không gây lỗi luồng du khách.
// XỬ LÝ: Điện thoại thật dùng http://IP_MAY_TINH:8787 hoặc HTTPS được triển khai.

export const presenceClient = url ? createPresenceClient(url) : null
// CHỨC NĂNG: Bản quản lý dùng địa chỉ thống kê nội bộ riêng nếu có.
// XỬ LÝ: Tunnel du khách chỉ nhận heartbeat, không công khai API đọc thống kê quản lý.

const adminBase = process.env.EXPO_PUBLIC_ADMIN_API_URL
// Không dùng tunnel visitor làm nguồn thống kê Admin: public proxy không cấp route đọc này.

const adminUrl =
  process.env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL ||
  (adminBase ? adminBase.replace(/\/$/, '') + '/presence' : undefined)

export const adminPresenceClient = adminUrl ? createPresenceClient(adminUrl) : null
/* CÁCH KIỂM TRA: Thêm URL vào .env rồi restart Expo; thiếu URL admin báo chưa kết nối. */
