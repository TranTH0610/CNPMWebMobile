/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Cấu hình nhận liên kết mở ứng dụng mobile và phân tích đường dẫn theo quy tắc QR/liên kết chung.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/LienKetMoUngDung.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * PHỤ THUỘC:
 * - @react-navigation/native
 * - @travelguide/visitor-core
 * - ../shared/services/KetNoiNenTang
 * - ./KieuDieuHuongDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
