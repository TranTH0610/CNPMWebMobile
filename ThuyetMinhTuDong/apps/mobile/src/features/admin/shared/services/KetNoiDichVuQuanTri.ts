/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/app/TrangThaiUngDung.tsx
 * - apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx
 * - apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts
 *
 * PHỤ THUỘC:
 * - @travelguide/admin-core
 * - @travelguide/visitor-core
 * - ../../../../shared/services/KetNoiNenTang
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
import { webOrigin } from '../../../../shared/services/KetNoiNenTang'

const base = process.env.EXPO_PUBLIC_ADMIN_API_URL || ''
// URL public có thể đi qua web tunnel; địa chỉ quản lý LAN tách riêng.
// CHỨC NĂNG: Bản Admin dùng cùng kho nội dung để nghe thử, không lệ thuộc tunnel du khách đã hết hạn.

const publicBase =
  process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
    ? base
    : process.env.EXPO_PUBLIC_CATALOG_API_URL || (webOrigin ? webOrigin + '/api/catalog' : base)

export const adminService = createHttpAdminService(base)

const publicService = createHttpAdminService(publicBase)

export const gateClient = createGateClient(base)

export const visitorGateClient = createGateClient(publicBase)

export const publicCatalog = createCatalog(() => publicService.published(), publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
