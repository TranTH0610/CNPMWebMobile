/**
 * FILE: apps/mobile/src/features/admin/shared/services/KetNoiDichVuQuanTri.ts
 * FILE NÀY LÀM GÌ: Tạo các client quản trị, danh mục công bố và lượt QR theo cấu hình nền tảng; dùng lại hợp đồng admin-core.
 * VAI TRÒ: Lớp kết nối nền tảng; chuyển thao tác chung sang API/thiết bị cụ thể.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
