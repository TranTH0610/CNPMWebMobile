/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Entry React của mobile; chọn luồng admin hoặc du khách theo cấu hình bản chạy rồi ghép ứng dụng
 *
 * VỊ TRÍ: apps/mobile/App.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/index.js
 *
 * PHỤ THUỘC:
 * - ./src/app/TrangThaiUngDung
 * - ./src/navigation/UngDungQuanTri
 * - ./src/navigation/DieuHuongGoc
 *
 * CÁC KHỐI CHÍNH:
 * 1. App
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// Nhập các thành phần từ './src/app/TrangThaiUngDung'.
import { AppProviders } from './src/app/TrangThaiUngDung'
// Nhập các thành phần từ './src/navigation/UngDungQuanTri'.
import { AdminApp } from './src/navigation/UngDungQuanTri'
// Nhập các thành phần từ './src/navigation/DieuHuongGoc'.
import RootNavigator from './src/navigation/DieuHuongGoc'

// CHỨC NĂNG: Entry mobile chỉ ghép provider với điều hướng.
// Khai báo App(). Component hàm nhận props và dựng phần giao diện App.
// ==================== [KHOI-DONG] [CAU-HINH] App ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function App() {
  
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
