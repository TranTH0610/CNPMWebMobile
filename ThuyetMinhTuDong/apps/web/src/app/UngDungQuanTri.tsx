/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản trị.
 *
 * VỊ TRÍ: apps/web/src/app/UngDungQuanTri.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/main-admin.tsx
 *
 * PHỤ THUỘC:
 * - react-router-dom
 * - ./DinhTuyenQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminApp
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoutes } from './DinhTuyenQuanTri'

// CHỨC NĂNG: Ghép luồng admin của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DUNG-CHUNG] AdminApp ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AdminApp() {
  // CHỨC NĂNG: Trang gốc dẫn vào quản lý; các URL còn lại chỉ thuộc khu quản lý.
  // XỬ LÝ: replace tránh thêm một bước quay lại trang gốc trong lịch sử trình duyệt.

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
// TẠI SAO (AdminApp): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
// và dễ bảo trì.
/* CÁCH KIỂM TRA: dev:admin mở dashboard; gõ /places không mở danh sách du khách. */
