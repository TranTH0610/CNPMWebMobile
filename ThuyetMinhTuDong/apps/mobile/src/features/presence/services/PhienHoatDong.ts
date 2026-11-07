/**
 * CHỨC NĂNG: [PHIEN-HOAT-DONG] [THONG-KE]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Tạo HTTP client thống kê phiên cho nền tảng, gồm client du khách và đường đọc thống kê của admin.
 *
 * VỊ TRÍ: apps/mobile/src/features/presence/services/PhienHoatDong.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx
 * - apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts
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
