/**
 * FILE: apps/web/src/features/journey/adapters/NguonAmThanh.ts
 * FILE NÀY LÀM GÌ: Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web. Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL.
 * VAI TRÒ: Lớp kết nối nền tảng; chuyển thao tác chung sang API/thiết bị cụ thể.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { mediaSource } from '../../../shared/services/NguonTepTaiNguyen'
export function narrationSource(url: string, preview = false): string {
  return mediaSource(url, preview)
}
