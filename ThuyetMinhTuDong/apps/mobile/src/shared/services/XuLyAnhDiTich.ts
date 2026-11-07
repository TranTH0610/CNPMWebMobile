/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu.
 *
 * VỊ TRÍ: apps/mobile/src/shared/services/XuLyAnhDiTich.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/shared/components/AnhBia.tsx
 * - apps/mobile/src/shared/components/AnhDiTich.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - ./NguonTepTaiNguyen
 *
 * CÁC KHỐI CHÍNH:
 * 1. resolvePlaceImage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import type { ImageSourcePropType } from 'react-native'
import { mediaSource } from './NguonTepTaiNguyen'
// ==================== [TAI-NGUYEN] resolvePlaceImage ====================
// CHỨC NĂNG: Thực hiện bước resolvePlaceImage trong nhiệm vụ: Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile. Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
export function resolvePlaceImage(uri?: string): ImageSourcePropType | undefined {
  if (!uri) return undefined
  // Giá trị nhập dở chưa hợp lệ không được làm màn hình admin bị crash.
  try {
    return { uri: mediaSource(uri) }
  } catch {
    return undefined
  }
}
