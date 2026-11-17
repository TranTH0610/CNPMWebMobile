/**
 * FILE: apps/mobile/src/shared/services/XuLyAnhDiTich.ts
 * FILE NÀY LÀM GÌ: Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu.
 * VAI TRÒ: Lớp kết nối nền tảng; chuyển thao tác chung sang API/thiết bị cụ thể.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { ImageSourcePropType } from 'react-native'
import { mediaSource } from './NguonTepTaiNguyen'
export function resolvePlaceImage(uri?: string): ImageSourcePropType | undefined {
  if (!uri) return undefined
  // Giá trị nhập dở chưa hợp lệ không được làm màn hình admin bị crash.
  try {
    return { uri: mediaSource(uri) }
  } catch {
    return undefined
  }
}
