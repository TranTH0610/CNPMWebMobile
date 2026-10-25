/**
 * FILE NÀY LÀM GÌ: Điểm ghép ứng dụng mobile; index.js đăng ký file này với Expo.
 * Vị trí: apps/mobile/App.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { AppProviders } from './src/providers/AppProviders'
import { AdminApp } from './src/navigation/AdminApp'
import RootNavigator from './src/navigation/RootNavigator'

// CHỨC NĂNG: Entry mobile chỉ ghép provider với điều hướng.
export default function App() {
  return (
    <AppProviders>
      {/* CHỨC NĂNG: Chọn bản ứng dụng lúc chạy/build, không phải chuyển quyền trong UI.
          XỬ LÝ: Bản du khách không đăng ký route Admin hoặc nút mở quản lý. */}
      {process.env.EXPO_PUBLIC_APP_TARGET === 'admin' ? <AdminApp /> : <RootNavigator />}
    </AppProviders>
  )
}
