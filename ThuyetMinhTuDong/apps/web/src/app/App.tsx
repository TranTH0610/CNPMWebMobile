/**
 * FILE: apps/web/src/app/App.tsx
 * FILE NÀY LÀM GÌ: Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { usePresenceHeartbeat } from '../features/presence/hooks/useBaoPhienHoatDong'
import { AppRoutes } from './DinhTuyenDuKhach'
import { useJourneyNavigation } from '../features/journey/hooks/useDieuHuongHanhTrinh'

// CHỨC NĂNG: Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết
// định qua route.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] App — Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết
export default function App() {
  usePresenceHeartbeat()
  useJourneyNavigation()
  return <AppRoutes />
}
// TẠI SAO (App): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
// dễ bảo trì.
