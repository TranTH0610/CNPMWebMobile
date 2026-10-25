/**
 * FILE NÀY LÀM GÌ: Ghép API RAM chung vào Admin và danh mục du khách của nền tảng.
 * Provider và Dashboard gọi; UC12–UC17. Không tự quay về kho cục bộ khi mất mạng.
 * Bản nháp chỉ đọc qua Admin; publicCatalog chỉ lấy /published.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
const base = import.meta.env.VITE_ADMIN_API_URL || '/api/catalog'
const publicBase = import.meta.env.VITE_CATALOG_API_URL || '/api/catalog'
export const adminService = createHttpAdminService(base)
const publicService = createHttpAdminService(publicBase)
export const gateClient = createGateClient(base)
export const visitorGateClient = createGateClient(publicBase)
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
