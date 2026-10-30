/**
 * FILE NÀY LÀM GÌ
 * Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng
 * admin-core.
 *
 * VỊ TRÍ: apps/web/src/services/admin/services.ts
 * DÙNG BỞI: apps/web/src/hooks/useGateEntry.ts; apps/web/src/main-admin.tsx;
 * apps/web/src/main.tsx; và các nơi import khác.
 * PHỤ THUỘC: @travelguide/admin-core; @travelguide/visitor-core
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/admin-core'.
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { createCatalog } from '@travelguide/visitor-core'
// Khai báo base: tính biểu thức import.meta.env.VITE_ADMIN_API_URL || '/api/catalog'.
const base = import.meta.env.VITE_ADMIN_API_URL || '/api/catalog'
// Khai báo publicBase: tính biểu thức import.meta.env.VITE_CATALOG_API_URL || '/api/catalog'.
const publicBase = import.meta.env.VITE_CATALOG_API_URL || '/api/catalog'
// Khai báo adminService: Gọi createHttpAdminService(base).
export const adminService = createHttpAdminService(base)
// Khai báo publicService: Gọi createHttpAdminService(publicBase).
const publicService = createHttpAdminService(publicBase)
// Khai báo gateClient: Gọi createGateClient(base).
export const gateClient = createGateClient(base)
// Khai báo visitorGateClient: Gọi createGateClient(publicBase).
export const visitorGateClient = createGateClient(publicBase)
// Khai báo publicCatalog: Gọi createCatalog(()=>publicService.published(),publicService.subscribe).
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
