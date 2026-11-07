/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy.
 *
 * VỊ TRÍ: apps/web/src/app/DinhTuyenDuKhach.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/App.tsx
 *
 * PHỤ THUỘC:
 * - react-router-dom
 * - ../shared/layouts/BoCucDuKhach
 * - ../features/explore/pages/TrangChu
 * - ../features/explore/pages/TrangDanhSachDiTich
 * - ../features/place-detail/pages/TrangChiTietDiTich
 * - react
 * - ../shared/components/TrangThaiDuLieu
 * - ../shared/components/BaoVeLoiTrang
 * - ../shared/pages/TrangKhongTimThay
 * - ../features/journey/pages/TrangHanhTrinh
 *
 * CÁC KHỐI CHÍNH:
 * 1. JourneyRoute
 * 2. AppRoutes
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// CHỨC NĂNG: Bản du khách chỉ đăng ký các route công khai.
// XỬ LÝ: Không import hoặc tải cây màn hình Admin; /admin không tồn tại ở bản này.

import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../shared/layouts/BoCucDuKhach'
import { HomePage } from '../features/explore/pages/TrangChu'
import { PlacesPage } from '../features/explore/pages/TrangDanhSachDiTich'
import { DetailPage } from '../features/place-detail/pages/TrangChiTietDiTich'
import { lazy, Suspense } from 'react'
import { State } from '../shared/components/TrangThaiDuLieu'
import { RouteBoundary } from '../shared/components/BaoVeLoiTrang'
import { NotFoundPage } from '../shared/pages/TrangKhongTimThay'
// CHỨC NĂNG: Chỉ tải Leaflet và trang bản đồ khi mở /journey; trang QR đầu không phải chờ bản đồ.
// XỬ LÝ: Controller/Provider vẫn ở vị trí cũ nên không mất bài nghe hoặc trạng thái GPS khi đổi route.
const JourneyPage = lazy(() =>
  import('../features/journey/pages/TrangHanhTrinh').then((module) => ({
    default: module.JourneyPage,
  })),
)
// ==================== [DIEU-HUONG] JourneyRoute ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider JourneyRoute.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
function JourneyRoute() {
  return (
    <RouteBoundary>
      <Suspense fallback={<State message="loading" busy />}>
        <JourneyPage />
      </Suspense>
    </RouteBoundary>
  )
}

// CHỨC NĂNG: Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết.

// ==================== [DIEU-HUONG] AppRoutes ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<DetailPage />} />
        <Route path="/journey" element={<JourneyRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
// TẠI SAO (AppRoutes): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất quán
// trong cùng ứng dụng.
