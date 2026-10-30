/**
 * FILE NÀY LÀM GÌ
 * Đăng ký route du khách như trang chủ, danh mục, chi tiết, hành trình, giới thiệu và trang không
 * tìm thấy.
 *
 * VỊ TRÍ: apps/web/src/navigation/AppRoutes.tsx
 * DÙNG BỞI: apps/web/src/App.tsx.
 * PHỤ THUỘC: react-router-dom; ../layouts/AppLayout; ../pages/HomePage; ../pages/PlacesPage;
 * ../pages/DetailPage; ../pages/JourneyPage; ../pages/AboutPage; ../pages/NotFoundPage
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// CHỨC NĂNG: Bản du khách chỉ đăng ký các route công khai.
// XỬ LÝ: Không import hoặc tải cây màn hình Admin; /admin không tồn tại ở bản này.
// Nhập các thành phần từ 'react-router-dom'.
import { Route, Routes } from 'react-router-dom'
// Nhập các thành phần từ '../layouts/AppLayout'.
import { AppLayout } from '../layouts/AppLayout'
// Nhập các thành phần từ '../pages/HomePage'.
import { HomePage } from '../pages/HomePage'
// Nhập các thành phần từ '../pages/PlacesPage'.
import { PlacesPage } from '../pages/PlacesPage'
// Nhập các thành phần từ '../pages/DetailPage'.
import { DetailPage } from '../pages/DetailPage'
// Nhập các thành phần từ '../pages/JourneyPage'.
import { JourneyPage } from '../pages/JourneyPage'
// Nhập các thành phần từ '../pages/AboutPage'.
import { AboutPage } from '../pages/AboutPage'
// Nhập các thành phần từ '../pages/NotFoundPage'.
import { NotFoundPage } from '../pages/NotFoundPage'

// CHỨC NĂNG: Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết.
// Khai báo AppRoutes(). Component hàm nhận props và dựng phần giao diện AppRoutes.
export function AppRoutes() {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Routes>`: Dựng Routes.
   * DÒNG `<Route element={<AppLayout />}>`: Dựng Route. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="/" element={<HomePage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="/places" element={<PlacesPage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="/places/:id" element={<DetailPage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="/journey" element={<JourneyPage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="/about" element={<AboutPage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Route path="*" element={<NotFoundPage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Route>`: Đóng phần giao diện Route.
   * DÒNG `</Routes>`: Đóng phần giao diện Routes.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<DetailPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
// TẠI SAO (AppRoutes): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất quán
// trong cùng ứng dụng.
