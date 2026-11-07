/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web. Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL.
 *
 * VỊ TRÍ: apps/web/src/features/journey/adapters/NguonAmThanh.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/content/components/NgheThuBanThu.tsx
 * - apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts
 *
 * PHỤ THUỘC:
 * - ../../../shared/services/NguonTepTaiNguyen
 *
 * CÁC KHỐI CHÍNH:
 * 1. narrationSource
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { mediaSource } from '../../../shared/services/NguonTepTaiNguyen'
// ==================== [DINH-VI] [THUYET-MINH] narrationSource ====================
// CHỨC NĂNG: Thực hiện bước narrationSource trong nhiệm vụ: Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web. Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
export function narrationSource(url: string, preview = false): string {
  return mediaSource(url, preview)
}
