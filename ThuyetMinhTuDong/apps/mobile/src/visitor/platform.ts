/**
 * FILE NÀY LÀM GÌ:
 * Kết nối logic chung với bộ nhớ, GPS và cấu hình QR trên mobile.
 *
 * Được dùng bởi:
 * - App.tsx.
 * - PlacesScreen.tsx.
 * - ScanScreen.tsx.
 * - linking.ts.
 *
 * Phụ thuộc:
 * - AsyncStorage, expo-location và visitor-core.
 *
 * Liên quan: UC01, UC03, UC05.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

import {
  siteOrigin,
  type Point,
  type QrPolicy,
  type StoragePort,
} from '@travelguide/visitor-core'

// CHỨC NĂNG: Đọc và lưu ngôn ngữ trên thiết bị.
// XỬ LÝ: Giữ khóa lang để tương thích dữ liệu người dùng đã lưu trước đây.
export const storage: StoragePort = {
  readLanguage: () => AsyncStorage.getItem('lang'),

  writeLanguage: async (language) => {
    await AsyncStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Xác định website mà scanner được phép nhận.
// XỬ LÝ:
// - Đọc biến môi trường Expo.
// - Thiếu hoặc sai cấu hình trả null.
// - HTTP được cho phép khi chạy môi trường phát triển.
export const webOrigin = (() => {
  const value =
    process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN

  if (!value) {
    return null
  }

  try {
    return siteOrigin(value, __DEV__)
  } catch {
    return null
  }
})()

// CHỨC NĂNG: Giới hạn QR vào website của dự án.
// XỬ LÝ: Không tự nhận URL của một website bất kỳ.
export const qrPolicy: QrPolicy = {
  allowedOrigins: webOrigin ? [webOrigin] : [],
  allowHttp: __DEV__,
}

// CHỨC NĂNG: Xin vị trí để phục vụ sắp xếp gần nhất.
// XỬ LÝ:
// - Từ chối quyền sẽ ném lỗi để hook chuyển sang sắp xếp theo tên.
// - Chờ tối đa 12 giây để UI không chờ GPS vô hạn.
// - Dọn timer dù lấy vị trí thành công hay thất bại.
export async function getPosition(): Promise<Point> {
  const permission =
    await Location.requestForegroundPermissionsAsync()

  if (permission.status !== 'granted') {
    throw new Error('Location denied')
  }

  let timer:
    ReturnType<typeof setTimeout> | undefined

  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),

      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(
          () => reject(
            new Error('Location timeout'),
          ),
          12000,
        )
      }),
    ])

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
  } finally {
    if (timer) {
      clearTimeout(timer)
    }
  }
}