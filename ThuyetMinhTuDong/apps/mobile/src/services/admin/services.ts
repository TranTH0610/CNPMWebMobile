/**
 * FILE NÀY LÀM GÌ
 * Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng
 * admin-core.
 *
 * VỊ TRÍ: apps/mobile/src/services/admin/services.ts
 * DÙNG BỞI: apps/mobile/src/hooks/useGateEntry.ts; apps/mobile/src/providers/AppProviders.tsx;
 * apps/mobile/src/screens/admin/DashboardScreen.tsx.
 * PHỤ THUỘC: @travelguide/admin-core; @travelguide/visitor-core; ../platform
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/admin-core'.
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { createCatalog } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../platform'.
import { webOrigin } from '../platform'
// Khai báo base: tính biểu thức process.env.EXPO_PUBLIC_ADMIN_API_URL || ''.
const base = process.env.EXPO_PUBLIC_ADMIN_API_URL || ''
// URL public có thể đi qua web tunnel; địa chỉ quản lý LAN tách riêng.
// CHỨC NĂNG: Bản Admin dùng cùng kho nội dung để nghe thử, không lệ thuộc tunnel du khách đã hết hạn.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const publicBase = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'`: Khai báo publicBase: chọn giữa hai giá trị theo điều kiện process.env.EXPO_PUBLIC_APP_TARGET === 'admin'.
 * DÒNG `? base`: Khai báo publicBase: chọn giữa hai giá trị theo điều kiện process.env.EXPO_PUBLIC_APP_TARGET === 'admin'.
 * DÒNG `: process.env.EXPO_PUBLIC_CATALOG_API_URL || (webOrigin ? webOrigin+'/api/catalog' : `: Khai báo publicBase: chọn giữa hai giá trị theo điều kiện process.env.EXPO_PUBLIC_APP_TARGET === 'admin'.
 */
const publicBase = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
  ? base
  : process.env.EXPO_PUBLIC_CATALOG_API_URL || (webOrigin ? webOrigin+'/api/catalog' : base)
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
