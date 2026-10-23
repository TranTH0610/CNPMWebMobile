/**
 * FILE NÀY LÀM GÌ:
 * Kết nối logic chung với localStorage, GPS trình duyệt và cấu hình QR.
 *
 * Được dùng bởi:
 * - main.tsx.
 * - Các trang danh sách, chi tiết và QR.
 *
 * Phụ thuộc:
 * - API trình duyệt và visitor-core.
 *
 * Liên quan: UC01, UC03, UC05.
 */

import {
  siteOrigin,
  type Point,
  type StoragePort,
  type QrPolicy,
} from '@travelguide/visitor-core'

// CHỨC NĂNG: Lưu ngôn ngữ trên trình duyệt hiện tại.
// XỬ LÝ: Provider bắt lỗi nếu trình duyệt không cho dùng localStorage.
export const storage: StoragePort = {
  readLanguage: async () => {
    return localStorage.getItem('lang')
  },

  writeLanguage: async (language) => {
    localStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Lấy vị trí khi người dùng chủ động yêu cầu.
// XỬ LÝ: Thiếu API, từ chối quyền hoặc timeout sẽ được hook xử lý.
export function getPosition(): Promise<Point> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error('Geolocation unavailable'),
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },

      reject,

      {
        timeout: 12000,
        maximumAge: 60000,
        enableHighAccuracy: false,
      },
    )
  })
}

// CHỨC NĂNG: Chọn địa chỉ cho một QR chung.
// XỬ LÝ:
// - Ưu tiên VITE_PUBLIC_SITE_URL.
// - Chưa cấu hình thì dùng địa chỉ website đang mở.
// - localhost hoặc cấu hình sai trả null để UI hiện hướng dẫn.
export const publicSiteOrigin = (() => {
  try {
    return siteOrigin(
      import.meta.env.VITE_PUBLIC_SITE_URL
      || window.location.origin,

      import.meta.env.DEV,
    )
  } catch {
    return null
  }
})()

// CHỨC NĂNG: Giới hạn URL mà trang kiểm tra QR được phép mở.
// XỬ LÝ: Nhận origin hiện tại và origin công khai được cấu hình rõ.
export const qrPolicy: QrPolicy = {
  allowedOrigins: [
    ...new Set([
      window.location.origin,

      ...(publicSiteOrigin
        ? [publicSiteOrigin]
        : []),
    ]),
  ],

  allowHttp: import.meta.env.DEV,
}