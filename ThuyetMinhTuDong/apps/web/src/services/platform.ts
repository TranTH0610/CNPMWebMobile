/**
 * FILE NÀY LÀM GÌ
 * Tạo adapter/bộ nhớ và nguồn danh mục riêng nền tảng; nhận cấu hình API để UI không tự ghép URL
 * dịch vụ.
 *
 * VỊ TRÍ: apps/web/src/services/platform.ts
 * DÙNG BỞI: apps/web/src/components/Catalogue.tsx; apps/web/src/main-admin.tsx;
 * apps/web/src/main.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { siteOrigin } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Point, StoragePort, QrPolicy } from '@travelguide/visitor-core'

// CHỨC NĂNG: Lưu ngôn ngữ trên trình duyệt hiện tại.
// XỬ LÝ: Provider bắt lỗi nếu trình duyệt không cho dùng localStorage.
// Khai báo storage: tạo object gồm readLanguage, writeLanguage.
export const storage: StoragePort = {
  // Gán thuộc tính readLanguage: khai báo callback async () => { return localStorage.getItem('lang') }.
  readLanguage: async () => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return localStorage.getItem('lang')`: Trả kết quả: localStorage.getItem đọc giá trị đã lưu.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return localStorage.getItem('lang')
  },

  // Gán thuộc tính writeLanguage: khai báo callback async (language) => { localStorage.setItem('lang', language) }.
  writeLanguage: async (language) => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `localStorage.setItem('lang', language)`: Thực hiện Gọi localStorage.setItem('lang', language).
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    localStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Lấy vị trí khi người dùng chủ động yêu cầu.
// XỬ LÝ: Thiếu API, từ chối quyền hoặc timeout sẽ được hook xử lý.
// Khai báo getPosition(). Nhận đầu vào qua tham số.
export function getPosition(): Promise<Point> {
  // Trả kết quả: Tạo đối tượng bằng new Promise((resolve, reject) => { if (!navigator.geolocation) { reject( new Error('Geoloc.
  return new Promise((resolve, reject) => {
    // Rẽ nhánh nếu !navigator.geolocation.
    if (!navigator.geolocation) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `reject(`: Thực hiện Gọi reject( new Error('Geolocation unavailable'), ).
       * DÒNG `new Error('Geolocation unavailable'),`: Thực hiện Gọi reject( new Error('Geolocation unavailable'), ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      reject(
        new Error('Geolocation unavailable'),
      )
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return`: Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return
    }

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `navigator.geolocation.getCurrentPosition(`: Thực hiện Gọi navigator.geolocation.getCurrentPosition( (position) => { resolve({ lat: position.coords.l.
     * DÒNG `(position) => {`: Thực hiện Gọi navigator.geolocation.getCurrentPosition( (position) => { resolve({ lat: position.coords.l.
     */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Thực hiện Gọi resolve({ lat: position.coords.latitude, lng: position.coords.longitude, }).
        resolve({
          // Gán thuộc tính lat: đọc position.coords.latitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
          lat: position.coords.latitude,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `lng: position.coords.longitude,`: Gán thuộc tính lng: đọc position.coords.longitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `reject,`: Thực hiện Gọi navigator.geolocation.getCurrentPosition( (position) => { resolve({ lat: position.coords.l.
           * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
           */
          lng: position.coords.longitude,
        })
      },

      reject,

      {
        // Gán thuộc tính timeout: giá trị số 12000.
        timeout: 12000,
        // Gán thuộc tính maximumAge: giá trị số 60000.
        maximumAge: 60000,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `enableHighAccuracy: false,`: Gán thuộc tính enableHighAccuracy: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        enableHighAccuracy: false,
      },
    )
  })
}
// TẠI SAO (getPosition): Danh mục vẫn phải hoạt động khi khách từ chối vị trí; lỗi quyền cần
// được trả về để UI xử lý.

// CHỨC NĂNG: Chọn địa chỉ cho một QR chung.
// XỬ LÝ:
// - Ưu tiên VITE_PUBLIC_SITE_URL.
// - Chưa cấu hình thì dùng địa chỉ website đang mở.
// - localhost hoặc cấu hình sai trả null để UI hiện hướng dẫn.
// Khai báo publicSiteOrigin: Gọi (() => { try { return siteOrigin( import.meta.env.VITE_PUBLIC_SITE_URL || window.location.
export const publicSiteOrigin = (() => {
  // Bắt đầu vùng try.
  try {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return siteOrigin(`: Trả kết quả: Gọi siteOrigin( import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin, import.meta.en.
     * DÒNG `import.meta.env.VITE_PUBLIC_SITE_URL`: Trả kết quả: Gọi siteOrigin( import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin, import.meta.en.
     * DÒNG `|| window.location.origin,`: Trả kết quả: Gọi siteOrigin( import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin, import.meta.en.
     * DÒNG `import.meta.env.DEV,`: Trả kết quả: Gọi siteOrigin( import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin, import.meta.en.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `} catch {`: Bắt đầu vùng try.
     */
    return siteOrigin(
      import.meta.env.VITE_PUBLIC_SITE_URL
      || window.location.origin,

      import.meta.env.DEV,
    )
  } catch {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return null`: Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})()`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return null
  }
})()

// CHỨC NĂNG: Giới hạn URL mà trang kiểm tra QR được phép mở.
// XỬ LÝ: Nhận origin hiện tại và origin công khai được cấu hình rõ.
// Khai báo qrPolicy: tạo object gồm allowedOrigins, allowHttp.
export const qrPolicy: QrPolicy = {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `allowedOrigins: [`: Gán thuộc tính allowedOrigins: tạo mảng [ ...new Set([ window.location.origin, ...(publicSiteOrigin ? [publicSiteOrigin].
   * DÒNG `...new Set([`: Gán thuộc tính allowedOrigins: tạo mảng [ ...new Set([ window.location.origin, ...(publicSiteOrigin ? [publicSiteOrigin].
   * DÒNG `window.location.origin,`: Gán thuộc tính allowedOrigins: tạo mảng [ ...new Set([ window.location.origin, ...(publicSiteOrigin ? [publicSiteOrigin].
   * DÒNG `...(publicSiteOrigin`: Gán thuộc tính allowedOrigins: tạo mảng [ ...new Set([ window.location.origin, ...(publicSiteOrigin ? [publicSiteOrigin].
   * DÒNG `? [publicSiteOrigin]`: Gán thuộc tính allowedOrigins: tạo mảng [ ...new Set([ window.location.origin, ...(publicSiteOrigin ? [publicSiteOrigin].
   * DÒNG `: []),`: Gán thuộc tính allowedOrigins: tạo mảng [ ...new Set([ window.location.origin, ...(publicSiteOrigin ? [publicSiteOrigin].
   * DÒNG `]),`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
   */
  allowedOrigins: [
    ...new Set([
      window.location.origin,

      ...(publicSiteOrigin
        ? [publicSiteOrigin]
        : []),
    ]),
  ],

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `allowHttp: import.meta.env.DEV,`: Gán thuộc tính allowHttp: đọc import.meta.env.DEV từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  allowHttp: import.meta.env.DEV,
}

// CHỨC NĂNG: Đọc URL QR mới nhất mà không phụ thuộc cache .env của Vite.
// XỬ LÝ: HTTPS đang mở được ưu tiên; localhost mới đọc runtime config của script QR.
// Khai báo loadPublicSiteOrigin(). Nhận đầu vào qua tham số.
export async function loadPublicSiteOrigin(): Promise<string | null> {
  // Bắt đầu vùng try.
  try {
    // Rẽ nhánh nếu window.location.protocol === 'https:'. | Trả kết quả: Gọi siteOrigin(window.location.origin).
    if (window.location.protocol === 'https:') return siteOrigin(window.location.origin)
    // Khai báo response: await chờ fetch gửi HTTP request. | Gán thuộc tính cache: chuỗi 'no-store'. | Gán thuộc tính signal: Gọi AbortSignal.timeout(8000).
    const response = await fetch('/visitor-config.json', { cache: 'no-store', signal: AbortSignal.timeout(8000) })
    // Rẽ nhánh nếu !response.ok. | Trả kết quả: sử dụng publicSiteOrigin làm giá trị của bước hiện tại.
    if (!response.ok) return publicSiteOrigin
    // Khai báo value: await chờ Gọi response.json().
    const value: unknown = await response.json()
    // Rẽ nhánh nếu !value || typeof value !== 'object' || !('publicSiteOrigin' in value) || typeof value.publicSiteOrigin !== 'st. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
    if (!value || typeof value !== 'object' || !('publicSiteOrigin' in value) || typeof value.publicSiteOrigin !== 'string') return null
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return siteOrigin(value.publicSiteOrigin)`: Trả kết quả: Gọi siteOrigin(value.publicSiteOrigin).
     * DÒNG `} catch { return publicSiteOrigin }`: Bắt đầu vùng try. | Trả kết quả: sử dụng publicSiteOrigin làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return siteOrigin(value.publicSiteOrigin)
  } catch { return publicSiteOrigin }
}
// TẠI SAO (loadPublicSiteOrigin): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và
// cách xử lý lỗi.
