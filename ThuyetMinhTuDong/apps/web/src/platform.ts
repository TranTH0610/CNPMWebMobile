/**
 * FILE NÀY LÀM GÌ:
 * Adapter lưu ngôn ngữ, vị trí và chính sách QR cho web.
 * main.tsx và các trang sử dụng; liên quan UC01/UC03/UC05.
 * Phụ thuộc API trình duyệt và kiểu dữ liệu chung.
 */

import type {
  Point,
  StoragePort,
  QrPolicy,
} from '@travelguide/visitor-core'

// CHỨC NĂNG: Lưu ngôn ngữ trong trình duyệt hiện tại.
// XỬ LÝ: Lỗi localStorage được provider bắt và thông báo.
export const storage: StoragePort = {
  readLanguage: async () => localStorage.getItem('lang'),

  writeLanguage: async (language) => {
    localStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Lấy vị trí khi khách chủ động yêu cầu.
// XỬ LÝ: Thiếu API/quyền hoặc timeout thì reject cho hook xử lý.
export function getPosition(): Promise<Point> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
      reject,
      {
        timeout: 12000,
        maximumAge: 60000,
        enableHighAccuracy: false,
      },
    )
  })
}

export const qrPolicy: QrPolicy = {
  allowedOrigins: [window.location.origin],
  allowHttp: import.meta.env.DEV,
}