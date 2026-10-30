/**
 * FILE NÀY LÀM GÌ
 * Entry React của mobile; chọn luồng admin hoặc du khách theo cấu hình bản chạy rồi ghép ứng dụng
 * tương ứng.
 *
 * VỊ TRÍ: apps/mobile/App.tsx
 * DÙNG BỞI: apps/mobile/index.js.
 * PHỤ THUỘC: ./src/providers/AppProviders; ./src/navigation/AdminApp;
 * ./src/navigation/RootNavigator
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ './src/providers/AppProviders'.
import { AppProviders } from './src/providers/AppProviders'
// Nhập các thành phần từ './src/navigation/AdminApp'.
import { AdminApp } from './src/navigation/AdminApp'
// Nhập các thành phần từ './src/navigation/RootNavigator'.
import RootNavigator from './src/navigation/RootNavigator'

// CHỨC NĂNG: Entry mobile chỉ ghép provider với điều hướng.
// Khai báo App(). Component hàm nhận props và dựng phần giao diện App.
export default function App() {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<AppProviders>`: Dựng AppProviders.
   * DÒNG `{process.env.EXPO_PUBLIC_APP_TARGET === 'admin' ? <AdminApp /> : <RootNavigator />}`: Đưa biểu thức JavaScript process.env.EXPO_PUBLIC_APP_TARGET === 'admin' ? <AdminApp /> : <RootNavigator /> vào JSX.
   * DÒNG `</AppProviders>`: Đóng phần giao diện AppProviders.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <AppProviders>
      {/* CHỨC NĂNG: Chọn bản ứng dụng lúc chạy/build, không phải chuyển quyền trong UI.
          XỬ LÝ: Bản du khách không đăng ký route Admin hoặc nút mở quản lý. */}
      {process.env.EXPO_PUBLIC_APP_TARGET === 'admin' ? <AdminApp /> : <RootNavigator />}
    </AppProviders>
  )
}
// TẠI SAO (App): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
// dễ bảo trì.
