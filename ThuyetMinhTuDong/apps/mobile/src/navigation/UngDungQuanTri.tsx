/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/UngDungQuanTri.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/App.tsx
 *
 * PHỤ THUỘC:
 * - @react-navigation/native
 * - ./DieuHuongQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminApp
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { NavigationContainer } from '@react-navigation/native'
import { AdminNavigator } from './DieuHuongQuanTri'
// CHỨC NĂNG: Ghép luồng admin của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DIEU-HUONG] AdminApp ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AdminApp() {
  // CHỨC NĂNG: Một NavigationContainer riêng cho bản quản lý, không ghép stack du khách.

  return (
    <NavigationContainer>
      <AdminNavigator />
    </NavigationContainer>
  )
}
// TẠI SAO (AdminApp): Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều
// hướng không nhất quán.
/* CÁCH KIỂM TRA: start:admin mở quản lý; start thường chỉ có tab du khách. */
