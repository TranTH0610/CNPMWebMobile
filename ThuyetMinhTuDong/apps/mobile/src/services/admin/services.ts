/**
 * FILE NÀY LÀM GÌ: Ghép API RAM chung vào Admin và danh mục du khách của nền tảng.
 * Provider và Dashboard gọi; UC12–UC17. Không tự quay về kho cục bộ khi mất mạng.
 * Bản nháp chỉ đọc qua Admin; publicCatalog chỉ lấy /published.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
import { webOrigin } from '../platform'
const base = process.env.EXPO_PUBLIC_ADMIN_API_URL || ''
// URL public có thể đi qua web tunnel; địa chỉ quản lý LAN tách riêng.
// CHỨC NĂNG: Bản Admin dùng cùng kho nội dung để nghe thử, không lệ thuộc tunnel du khách đã hết hạn.
const publicBase = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
  ? base
  : process.env.EXPO_PUBLIC_CATALOG_API_URL || (webOrigin ? webOrigin+'/api/catalog' : base)
export const adminService = createHttpAdminService(base)
const publicService = createHttpAdminService(publicBase)
export const gateClient = createGateClient(base)
export const visitorGateClient = createGateClient(publicBase)
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
