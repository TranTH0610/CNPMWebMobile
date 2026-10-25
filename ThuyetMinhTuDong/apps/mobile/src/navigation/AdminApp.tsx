/** FILE NÀY LÀM GÌ: Root điều hướng riêng cho bản mobile quản lý.
 * App.tsx chọn tại cấu hình chạy/build; phụ thuộc AdminNavigator và AppProviders đã ở ngoài.
 * Không nhận linking QR du khách, không gọi heartbeat du khách; không thêm màn đăng nhập.
 * Đây là tách bản ứng dụng, không thay thế xác thực/quyền tại API khi triển khai thật.
 */
import { NavigationContainer } from '@react-navigation/native'
import { AdminNavigator } from './AdminNavigator'
export function AdminApp() {
  // CHỨC NĂNG: Một NavigationContainer riêng cho bản quản lý, không ghép stack du khách.
  return <NavigationContainer><AdminNavigator /></NavigationContainer>
}
/* CÁCH KIỂM TRA: start:admin mở quản lý; start thường chỉ có tab du khách. */
