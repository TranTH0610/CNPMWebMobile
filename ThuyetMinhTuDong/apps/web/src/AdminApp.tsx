/**
 * FILE NÀY LÀM GÌ
 * Ghép luồng admin của nền tảng. Mobile tạo provider/điều hướng admin; web là ứng dụng route quản
 * trị.
 *
 * VỊ TRÍ: apps/web/src/AdminApp.tsx
 * DÙNG BỞI: apps/web/src/main-admin.tsx.
 * PHỤ THUỘC: react-router-dom; ./navigation/AdminRoutes
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ 'react-router-dom'.
import { Navigate, Route, Routes } from 'react-router-dom'
// Nhập các thành phần từ './navigation/AdminRoutes'.
import { AdminRoutes } from './navigation/AdminRoutes'

// CHỨC NĂNG: Ghép luồng admin của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AdminApp(). Component hàm nhận props và dựng phần giao diện AdminApp.
export function AdminApp() {
  // CHỨC NĂNG: Trang gốc dẫn vào quản lý; các URL còn lại chỉ thuộc khu quản lý.
  // XỬ LÝ: replace tránh thêm một bước quay lại trang gốc trong lịch sử trình duyệt.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <Routes>`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Route path="/" element={<Navigate to="/admin" replace />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính replace: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="/admin/*" element={<AdminRoutes />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="*" element={<Navigate to="/admin" replace />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính replace: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Routes>`: Đóng phần giao diện Routes.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <Routes>
    <Route path="/" element={<Navigate to="/admin" replace />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
}
// TẠI SAO (AdminApp): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
// và dễ bảo trì.
/* CÁCH KIỂM TRA: dev:admin mở dashboard; gõ /places không mở danh sách du khách. */
