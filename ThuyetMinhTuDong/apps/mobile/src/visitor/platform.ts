/**
 * FILE NÀY LÀM GÌ:
 * Kết nối bộ nhớ, vị trí thiết bị và cấu hình QR cho mobile.
 * App, PlacesScreen và ScanScreen sử dụng.
 * Phụ thuộc AsyncStorage, expo-location và kiểu dữ liệu visitor-core.
 * Liên quan UC01, UC03 và UC05.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

import type {
  Point,
  QrPolicy,
  StoragePort,
} from '@travelguide/visitor-core'

// CHỨC NĂNG: Lưu và đọc lựa chọn ngôn ngữ.
// XỬ LÝ: Giữ khóa lang để tương thích lựa chọn cũ.
export const storage: StoragePort = {
  readLanguage: () => AsyncStorage.getItem('lang'),

  writeLanguage: async (language) => {
    await AsyncStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Xác định origin web được phép trong QR.
// XỬ LÝ: Giá trị mặc định là domain ví dụ, không phải website đang chạy.
// File .env phải chứa URL hợp lệ nếu bạn thay cấu hình.
export const webOrigin = new URL(
  process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN
  ?? 'https://hue-guide.example',
).origin

export const qrPolicy: QrPolicy = {
  allowedOrigins: [webOrigin],
  allowHttp: __DEV__,
}

// CHỨC NĂNG: Xin vị trí để sắp xếp gần nhất.
// XỬ LÝ:
// - Bị từ chối quyền thì báo lỗi cho hook xử lý.
// - Chờ tối đa 12 giây.
// - Promise.race ngừng chờ sau timeout; không hủy tác vụ GPS bên dưới.
// - Luôn dọn timer sau khi hoàn tất.
export async function getPosition(): Promise<Point> {
  const permission =
    await Location.requestForegroundPermissionsAsync()

  if (permission.status !== 'granted') {
    throw new Error('Location denied')
  }

  let timer: ReturnType<typeof setTimeout> | undefined

  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),

      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(
          () => reject(new Error('Location timeout')),
          12000,
        )
      }),
    ])

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
  } finally {
    if (timer) clearTimeout(timer)
  }
}