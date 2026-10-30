/**
 * FILE NÀY LÀM GÌ
 * Tạo adapter/bộ nhớ và nguồn danh mục riêng nền tảng; nhận cấu hình API để UI không tự ghép URL
 * dịch vụ.
 *
 * VỊ TRÍ: apps/mobile/src/services/platform.ts
 * DÙNG BỞI: apps/mobile/src/hooks/useGateEntry.ts; apps/mobile/src/navigation/linking.ts;
 * apps/mobile/src/providers/AppProviders.tsx; và các nơi import khác.
 * PHỤ THUỘC: @react-native-async-storage/async-storage; expo-location; @travelguide/visitor-core
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@react-native-async-storage/async-storage'.
import AsyncStorage from '@react-native-async-storage/async-storage'
// Nhập các thành phần từ 'expo-location'.
import * as Location from 'expo-location'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { siteOrigin } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Point, QrPolicy, StoragePort } from '@travelguide/visitor-core'

// CHỨC NĂNG: Đọc và lưu ngôn ngữ trên thiết bị.
// XỬ LÝ: Giữ khóa lang để tương thích dữ liệu người dùng đã lưu trước đây.
// Khai báo storage: tạo object gồm readLanguage, writeLanguage.
export const storage: StoragePort = {
  // Gán thuộc tính readLanguage: khai báo callback () => AsyncStorage.getItem('lang').
  readLanguage: () => AsyncStorage.getItem('lang'),

  // Gán thuộc tính writeLanguage: khai báo callback async (language) => { await AsyncStorage.setItem('lang', language) }.
  writeLanguage: async (language) => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `await AsyncStorage.setItem('lang', language)`: Thực hiện await chờ Gọi AsyncStorage.setItem('lang', language).
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    await AsyncStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Xác định website mà scanner được phép nhận.
// XỬ LÝ:
// - Đọc biến môi trường Expo.
// - Thiếu hoặc sai cấu hình trả null.
// - HTTP được cho phép khi chạy môi trường phát triển.
// Khai báo webOrigin: Gọi (() => { const value = process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN if (!value) { return nul.
export const webOrigin = (() => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const value =`: Khai báo value: đọc process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN`: Khai báo value: đọc process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN từ đối tượng/mảng để dùng tại bước hiện tại.
   */
  const value =
    process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN

  // Rẽ nhánh nếu !value.
  if (!value) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return null`: Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return null
  }

  // Bắt đầu vùng try.
  try {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return siteOrigin(value, __DEV__)`: Trả kết quả: Gọi siteOrigin(value, __DEV__).
     * DÒNG `} catch {`: Bắt đầu vùng try.
     */
    return siteOrigin(value, __DEV__)
  } catch {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return null`: Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})()`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return null
  }
})()

// CHỨC NĂNG: Giới hạn QR vào website của dự án.
// XỬ LÝ: Không tự nhận URL của một website bất kỳ.
// Khai báo qrPolicy: tạo object gồm allowedOrigins, allowHttp.
export const qrPolicy: QrPolicy = {
  // Gán thuộc tính allowedOrigins: chọn giữa hai giá trị theo điều kiện webOrigin.
  allowedOrigins: webOrigin ? [webOrigin] : [],
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `allowHttp: __DEV__,`: Gán thuộc tính allowHttp: sử dụng __DEV__ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  allowHttp: __DEV__,
}

// CHỨC NĂNG: Xin vị trí để phục vụ sắp xếp gần nhất.
// XỬ LÝ:
// - Từ chối quyền sẽ ném lỗi để hook chuyển sang sắp xếp theo tên.
// - Chờ tối đa 12 giây để UI không chờ GPS vô hạn.
// - Dọn timer dù lấy vị trí thành công hay thất bại.
// Khai báo getPosition(). Nhận đầu vào qua tham số.
export async function getPosition(): Promise<Point> {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const permission =`: Khai báo permission: await chờ Gọi Location.requestForegroundPermissionsAsync().
   * DÒNG `await Location.requestForegroundPermissionsAsync()`: Khai báo permission: await chờ Gọi Location.requestForegroundPermissionsAsync().
   */
  const permission =
    await Location.requestForegroundPermissionsAsync()

  // Rẽ nhánh nếu permission.status !== 'granted'.
  if (permission.status !== 'granted') {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('Location denied')`: Ném new Error('Location denied').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('Location denied')
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `let timer:`: Khai báo timer: không có giá trị khởi tạo.
   * DÒNG `ReturnType<typeof setTimeout> | undefined`: Thành phần kiểu `ReturnType<typeof setTimeout> | undefined` giới hạn hình dạng dữ liệu cho TypeScript.
   */
  let timer:
    ReturnType<typeof setTimeout> | undefined

  // Bắt đầu vùng try.
  try {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const position = await Promise.race([`: Khai báo position: await chờ Gọi Promise.race([ Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, }).
     * DÒNG `Location.getCurrentPositionAsync({`: Khai báo position: await chờ Gọi Promise.race([ Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, }).
     */
    const position = await Promise.race([
      Location.getCurrentPositionAsync({
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `accuracy: Location.Accuracy.Balanced,`: Gán thuộc tính accuracy: đọc Location.Accuracy.Balanced từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
         * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `new Promise<never>((_resolve, reject) => {`: Khai báo position: await chờ Gọi Promise.race([ Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, }).
         */
        accuracy: Location.Accuracy.Balanced,
      }),

      new Promise<never>((_resolve, reject) => {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `timer = setTimeout(`: Thực hiện tính biểu thức timer = setTimeout( () => reject( new Error('Location timeout'), ), 12000, ).
         * DÒNG `() => reject(`: Thực hiện tính biểu thức timer = setTimeout( () => reject( new Error('Location timeout'), ), 12000, ).
         * DÒNG `new Error('Location timeout'),`: Thực hiện tính biểu thức timer = setTimeout( () => reject( new Error('Location timeout'), ), 12000, ).
         * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `12000,`: Thực hiện tính biểu thức timer = setTimeout( () => reject( new Error('Location timeout'), ), 12000, ).
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `])`: Kết thúc danh sách phần tử trong mảng.
         */
        timer = setTimeout(
          () => reject(
            new Error('Location timeout'),
          ),
          12000,
        )
      }),
    ])

    // Trả kết quả: tạo object gồm lat, lng.
    return {
      // Gán thuộc tính lat: đọc position.coords.latitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      lat: position.coords.latitude,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: position.coords.longitude,`: Gán thuộc tính lng: đọc position.coords.longitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `} finally {`: Bắt đầu vùng try.
       */
      lng: position.coords.longitude,
    }
  } finally {
    // Rẽ nhánh nếu timer.
    if (timer) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `clearTimeout(timer)`: Dọn đăng ký/timer: clearTimeout(timer).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      clearTimeout(timer)
    }
  }
}
// TẠI SAO (getPosition): Danh mục vẫn phải hoạt động khi khách từ chối vị trí; lỗi quyền cần
// được trả về để UI xử lý.
