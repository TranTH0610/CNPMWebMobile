/**
 * FILE NÀY LÀM GÌ
 * Cấu hình nhận liên kết mở ứng dụng mobile và phân tích đường dẫn theo quy tắc QR/liên kết chung.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/linking.ts
 * DÙNG BỞI: apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: @react-navigation/native; @travelguide/visitor-core; ../services/platform; ./types
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập kiểu dữ liệu từ '@react-navigation/native'.
import type { LinkingOptions } from '@react-navigation/native'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { parseQrTarget } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../services/platform'.
import { qrPolicy, webOrigin } from '../services/platform'
// Nhập kiểu dữ liệu từ './types'.
import type { VisitorStack } from './types'

// CHỨC NĂNG: Khai báo các tiền tố liên kết mà app xử lý.
// XỬ LÝ:
// - HTTPS dùng origin đã cấu hình.
// - hueguide:// dùng cho kiểm tra deep link của bản app cài riêng.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const linking:`: Khai báo linking: tạo object gồm prefixes, getStateFromPath.
 * DÒNG `LinkingOptions<VisitorStack> = {`: Thành phần kiểu `LinkingOptions<VisitorStack> = {` giới hạn hình dạng dữ liệu cho TypeScript.
 */
export const linking:
  LinkingOptions<VisitorStack> = {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `prefixes: [`: Gán thuộc tính prefixes: tạo mảng [ ...(webOrigin ? [webOrigin] : []), 'hueguide://', ].
     * DÒNG `...(webOrigin ? [webOrigin] : []),`: Gán thuộc tính prefixes: tạo mảng [ ...(webOrigin ? [webOrigin] : []), 'hueguide://', ].
     * DÒNG `'hueguide://',`: Gán thuộc tính prefixes: tạo mảng [ ...(webOrigin ? [webOrigin] : []), 'hueguide://', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    prefixes: [
      ...(webOrigin ? [webOrigin] : []),
      'hueguide://',
    ],

    // CHỨC NĂNG: Chuyển đường dẫn thành màn hình và tham số.
    // XỬ LÝ:
// - Parser chung từ chối đường dẫn sai.
// - QR chung mở Places.
// - Link chi tiết mở Detail và giữ Places trong lịch sử quay lại.
    // Khai báo getStateFromPath(path). Nhận đầu vào qua tham số.
    getStateFromPath(path) {
      // Bắt đầu vùng try.
      try {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `const origin =`: Gán origin bằng webOrigin; nếu null hoặc undefined thì dùng 'https://hue-guide.example'.
         * DÒNG `webOrigin`: Gán origin bằng webOrigin; nếu null hoặc undefined thì dùng 'https://hue-guide.example'.
         * DÒNG `?? 'https://hue-guide.example'`: Gán origin bằng webOrigin; nếu null hoặc undefined thì dùng 'https://hue-guide.example'.
         */
        const origin =
          webOrigin
          ?? 'https://hue-guide.example'

        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `const target = parseQrTarget(`: Khai báo target: Gọi parseQrTarget( new URL(path, origin).toString(), { ...qrPolicy, allowedOrigins: [origin],.
         * DÒNG `new URL(path, origin).toString(),`: Khai báo target: Gọi parseQrTarget( new URL(path, origin).toString(), { ...qrPolicy, allowedOrigins: [origin],.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         * DÒNG `...qrPolicy,`: Khai báo target: Gọi parseQrTarget( new URL(path, origin).toString(), { ...qrPolicy, allowedOrigins: [origin],.
         */
        const target = parseQrTarget(
          new URL(path, origin).toString(),
          {
            ...qrPolicy,
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `allowedOrigins: [origin],`: Gán thuộc tính allowedOrigins: tạo mảng [origin].
             * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
             */
            allowedOrigins: [origin],
          },
        )

        // Rẽ nhánh nếu target.kind === 'home'.
        if (target.kind === 'home') {
          // Trả kết quả: tạo object gồm routes.
          return {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `routes: [`: Gán thuộc tính routes: tạo mảng [ { name: 'Places', }, ].
             * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
             */
            routes: [
              {
                /* GIẢI THÍCH TỪNG DÒNG:
                 * DÒNG `name: 'Places',`: Gán thuộc tính name: chuỗi 'Places'.
                 * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
                 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 */
                name: 'Places',
              },
            ],
          }
        }

        // Trả kết quả: tạo object gồm index, routes.
        return {
          // Gán thuộc tính index: giá trị số 1.
          index: 1,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `routes: [`: Gán thuộc tính routes: tạo mảng [ { name: 'Places', }, { name: 'Detail', params: { placeId: target.id, }, }, ].
           * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
           */
          routes: [
            {
              /* GIẢI THÍCH TỪNG DÒNG:
               * DÒNG `name: 'Places',`: Gán thuộc tính name: chuỗi 'Places'.
               * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
               * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
               */
              name: 'Places',
            },
            {
              // Gán thuộc tính name: chuỗi 'Detail'.
              name: 'Detail',
              // Gán thuộc tính params: tạo object gồm placeId.
              params: {
                /* GIẢI THÍCH TỪNG DÒNG:
                 * DÒNG `placeId: target.id,`: Gán thuộc tính placeId: đọc target.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
                 * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
                 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `} catch {`: Bắt đầu vùng try.
                 */
                placeId: target.id,
              },
            },
          ],
        }
      } catch {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return undefined`: Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return undefined
      }
    },
    // TẠI SAO (getStateFromPath): Không phải mọi URL nhận được đều hợp lệ; parser chung giữ cách
    // nhận liên kết nhất quán.
  }
