/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts.
 *
 * VỊ TRÍ: apps/web/src/shared/services/XuLyAnhDiTich.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 * - apps/web/src/shared/components/AnhDiTich.tsx
 *
 * PHỤ THUỘC:
 * - ./NguonTepTaiNguyen
 *
 * CÁC KHỐI CHÍNH:
 * 1. resolvePlaceImage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { mediaSource } from './NguonTepTaiNguyen'
// ==================== [TAI-NGUYEN] resolvePlaceImage ====================
// CHỨC NĂNG: Thực hiện bước resolvePlaceImage trong nhiệm vụ: Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web. Component PlaceImage/HomePage gọi; phụ thuộc NguonTepTaiNguyen.ts.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
export function resolvePlaceImage(uri?: string): string | undefined {
  if (!uri) return undefined
  // Người dùng có thể đang sửa dở mã/URL trong form; hiện placeholder thay vì làm lỗi render.
  try {
    return mediaSource(uri)
  } catch {
    return undefined
  }
}
