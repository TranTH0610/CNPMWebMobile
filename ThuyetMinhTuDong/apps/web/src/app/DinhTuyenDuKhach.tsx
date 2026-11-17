/**
 * FILE: apps/web/src/app/DinhTuyenDuKhach.tsx
 * FILE NÀY LÀM GÌ: Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình và trang không tìm thấy.
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
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider JourneyRoute.
// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] JourneyRoute — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider JourneyRoute.
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

// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] AppRoutes — Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết.
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
