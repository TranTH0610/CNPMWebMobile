/**
 * FILE: apps/web/src/shared/services/XuLyAnhDiTich.ts
 * FILE NÀY LÀM GÌ: Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts.
 * VAI TRÒ: Lớp kết nối nền tảng; chuyển thao tác chung sang API/thiết bị cụ thể.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { mediaSource } from './NguonTepTaiNguyen'
export function resolvePlaceImage(uri?: string): string | undefined {
  if (!uri) return undefined
  // Người dùng có thể đang sửa dở mã/URL trong form; hiện placeholder thay vì làm lỗi render.
  try {
    return mediaSource(uri)
  } catch {
    return undefined
  }
}
