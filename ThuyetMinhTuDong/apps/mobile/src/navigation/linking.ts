/**
 * FILE NÀY LÀM GÌ: Nhận deep link bên ngoài và tạo lịch sử điều hướng mobile phù hợp.
 * Vị trí: apps/mobile/src/navigation/linking.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { LinkingOptions } from '@react-navigation/native'
import { parseQrTarget } from '@travelguide/visitor-core'
import { qrPolicy, webOrigin } from '../services/platform'
import type { VisitorStack } from './types'

// CHỨC NĂNG: Khai báo các tiền tố liên kết mà app xử lý.
// XỬ LÝ:
// - HTTPS dùng origin đã cấu hình.
// - hueguide:// dùng cho kiểm tra deep link của bản app cài riêng.
export const linking:
  LinkingOptions<VisitorStack> = {
    prefixes: [
      ...(webOrigin ? [webOrigin] : []),
      'hueguide://',
    ],

    // CHỨC NĂNG: Chuyển đường dẫn thành màn hình và tham số.
    // XỬ LÝ:
// - Parser chung từ chối đường dẫn sai.
// - QR chung mở Places.
// - Link chi tiết mở Detail và giữ Places trong lịch sử quay lại.
    getStateFromPath(path) {
      try {
        const origin =
          webOrigin
          ?? 'https://hue-guide.example'

        const target = parseQrTarget(
          new URL(path, origin).toString(),
          {
            ...qrPolicy,
            allowedOrigins: [origin],
          },
        )

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
  }
