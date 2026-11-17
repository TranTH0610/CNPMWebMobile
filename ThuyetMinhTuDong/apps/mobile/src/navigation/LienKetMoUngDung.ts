/**
 * FILE: apps/mobile/src/navigation/LienKetMoUngDung.ts
 * FILE NÀY LÀM GÌ: Cấu hình nhận liên kết mở ứng dụng mobile và phân tích đường dẫn theo quy tắc QR/liên kết chung.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { LinkingOptions } from '@react-navigation/native'
import { parseQrTarget } from '@travelguide/visitor-core'
import { qrPolicy, webOrigin } from '../shared/services/KetNoiNenTang'
import type { VisitorStack } from './KieuDieuHuongDuKhach'

// CHỨC NĂNG: Khai báo các tiền tố liên kết mà app xử lý.
// XỬ LÝ:
// - HTTPS dùng origin đã cấu hình.
// - hueguide:// dùng cho kiểm tra deep link của bản app cài riêng.

export const linking: LinkingOptions<VisitorStack> = {
  prefixes: [...(webOrigin ? [webOrigin] : []), 'hueguide://'],

  // CHỨC NĂNG: Chuyển đường dẫn thành màn hình và tham số.
  // XỬ LÝ:
  // - Parser chung từ chối đường dẫn sai.
  // - QR chung mở Places.
  // - Link chi tiết mở Detail và giữ Places trong lịch sử quay lại.

  // [UC05] getStateFromPath — Chuyển đường dẫn thành màn hình và tham số.
  getStateFromPath(path) {
    try {
      const origin = webOrigin ?? 'https://hue-guide.example'

      const target = parseQrTarget(new URL(path, origin).toString(), {
        ...qrPolicy,

        allowedOrigins: [origin],
      })

      if (target.kind === 'home') {
        return {
          routes: [
            {
              name: 'Places',
            },
          ],
        }
      }

      return {
        index: 1,

        routes: [
          {
            name: 'Places',
          },
          {
            name: 'Detail',

            params: {
              placeId: target.id,
            },
          },
        ],
      }
    } catch {
      return undefined
    }
  },
  // TẠI SAO (getStateFromPath): Không phải mọi URL nhận được đều hợp lệ; parser chung giữ cách
  // nhận liên kết nhất quán.
}
