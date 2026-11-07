/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua route.
 *
 * VỊ TRÍ: apps/web/src/app/App.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/main.tsx
 *
 * PHỤ THUỘC:
 * - ../features/presence/hooks/useBaoPhienHoatDong
 * - ./DinhTuyenDuKhach
 * - ../features/journey/hooks/useDieuHuongHanhTrinh
 *
 * CÁC KHỐI CHÍNH:
 * 1. App
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { usePresenceHeartbeat } from '../features/presence/hooks/useBaoPhienHoatDong'
import { AppRoutes } from './DinhTuyenDuKhach'
import { useJourneyNavigation } from '../features/journey/hooks/useDieuHuongHanhTrinh'

// CHỨC NĂNG: Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết
// định qua route.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [KHOI-DONG] [CAU-HINH] App ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function App() {
  usePresenceHeartbeat()
  useJourneyNavigation()
  return <AppRoutes />
}
// TẠI SAO (App): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
// dễ bảo trì.
