/**
 * FILE NÀY LÀM GÌ: Root riêng của web quản lý, được main-admin.tsx gọi.
 * Phụ thuộc AdminRoutes và React Router; không đăng ký route hoặc navbar du khách.
 * Liên quan UC12–UC17. Việc xác thực/quyền thật phải được hosting hoặc BE thực hiện.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoutes } from './navigation/AdminRoutes'

export function AdminApp() {
  // CHỨC NĂNG: Trang gốc dẫn vào quản lý; các URL còn lại chỉ thuộc khu quản lý.
  // XỬ LÝ: replace tránh thêm một bước quay lại trang gốc trong lịch sử trình duyệt.
  return <Routes>
    <Route path="/" element={<Navigate to="/admin" replace />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
}
/* CÁCH KIỂM TRA: dev:admin mở dashboard; gõ /places không mở danh sách du khách. */
