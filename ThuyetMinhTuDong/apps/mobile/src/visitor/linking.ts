/**
 * FILE NÀY LÀM GÌ:
 * Nhận liên kết mở ứng dụng từ camera hoặc trình duyệt.
 *
 * Được dùng bởi:
 * - NavigationContainer trong App.tsx.
 *
 * Phụ thuộc:
 * - React Navigation.
 * - Parser QR của visitor-core.
 * - platform.ts và types.ts.
 *
 * Liên quan: UC05.
 */

import type {
  LinkingOptions,
} from '@react-navigation/native'

import {
  parseQrTarget,
} from '@travelguide/visitor-core'

import {
  qrPolicy,
  webOrigin,
} from './platform'

import type {
  VisitorStack,
} from './types'

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