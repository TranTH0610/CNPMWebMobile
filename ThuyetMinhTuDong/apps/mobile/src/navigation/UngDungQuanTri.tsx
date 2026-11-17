/**
 * FILE: apps/mobile/src/navigation/UngDungQuanTri.tsx
 * FILE NÀY LÀM GÌ: Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { NavigationContainer } from '@react-navigation/native'
import { AdminNavigator } from './DieuHuongQuanTri'
// CHỨC NĂNG: Ghép luồng admin của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminApp — Ghép luồng admin của nền tảng.
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
