/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt.
 *
 * VỊ TRÍ: apps/web/src/app/DinhTuyenQuanTri.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/UngDungQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react-router-dom
 * - ../features/admin/shared/layouts/BoCucQuanTri
 * - ../features/admin/dashboard/TrangTongQuan
 * - ../features/admin/places/TrangDanhSachDiTich
 * - ../features/admin/places/TrangThemSuaDiTich
 * - ../features/admin/content/TrangBienTapNoiDung
 * - ../features/admin/reviews/TrangKiemDuyet
 * - ../shared/pages/TrangKhongTimThay
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminRoutes
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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

// ==================== [DIEU-HUONG] AdminRoutes ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
