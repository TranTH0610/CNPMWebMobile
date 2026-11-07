/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.
 *
 * VỊ TRÍ: apps/web/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/dashboard/TrangTongQuan.tsx
 * - apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts
 * - apps/web/src/main-admin.tsx
 * - apps/web/src/main.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/admin-core
 * - @travelguide/visitor-core
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'

const base = import.meta.env.VITE_ADMIN_API_URL || '/api/catalog'

const publicBase = import.meta.env.VITE_CATALOG_API_URL || '/api/catalog'

export const adminService = createHttpAdminService(base)

const publicService = createHttpAdminService(publicBase)

export const gateClient = createGateClient(base)

export const visitorGateClient = createGateClient(publicBase)

export const publicCatalog = createCatalog(() => publicService.published(), publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
