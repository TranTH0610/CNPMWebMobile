/**
 * FILE: apps/web/src/app/DinhTuyenQuanTri.tsx
 * FILE NÀY LÀM GÌ: Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt.
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
import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../features/admin/shared/layouts/BoCucQuanTri'
import { DashboardPage } from '../features/admin/dashboard/TrangTongQuan'
import { AdminPlacesPage } from '../features/admin/places/TrangDanhSachDiTich'
import { PlaceFormPage } from '../features/admin/places/TrangThemSuaDiTich'
import { ContentEditorPage } from '../features/admin/content/TrangBienTapNoiDung'
import { ReviewsPage, ReviewDetailPage } from '../features/admin/reviews/TrangKiemDuyet'
import { NotFoundPage } from '../shared/pages/TrangKhongTimThay'
// CHỨC NĂNG: Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm
// duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminRoutes — Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm
export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="places" element={<AdminPlacesPage />} />
        <Route path="places/new" element={<PlaceFormPage />} />
        <Route path="places/:id/edit" element={<PlaceFormPage />} />
        <Route path="places/:id/content" element={<ContentEditorPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="reviews/:id" element={<ReviewDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
// TẠI SAO (AdminRoutes): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất
// quán trong cùng ứng dụng.
/* CÁCH KIỂM TRA: /admin vào thẳng; refresh /admin/places/ID/content vẫn mở đúng màn. */
