/**
 * FILE NÀY LÀM GÌ
 * Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản
 * trị.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/AdminApp.tsx
 * DÙNG BỞI: apps/mobile/App.tsx.
 * PHỤ THUỘC: @react-navigation/native; ./AdminNavigator
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ '@react-navigation/native'.
import { NavigationContainer } from '@react-navigation/native'
// Nhập các thành phần từ './AdminNavigator'.
import { AdminNavigator } from './AdminNavigator'
// CHỨC NĂNG: Ghép luồng admin của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AdminApp(). Component hàm nhận props và dựng phần giao diện AdminApp.
export function AdminApp() {
  // CHỨC NĂNG: Một NavigationContainer riêng cho bản quản lý, không ghép stack du khách.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <NavigationContainer><AdminNavigator /></NavigationContainer>`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <NavigationContainer><AdminNavigator /></NavigationContainer>
}
// TẠI SAO (AdminApp): Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều
// hướng không nhất quán.
/* CÁCH KIỂM TRA: start:admin mở quản lý; start thường chỉ có tab du khách. */
