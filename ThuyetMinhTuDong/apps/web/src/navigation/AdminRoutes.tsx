/**
 * FILE NÀY LÀM GÌ
 * Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm duyệt.
 *
 * VỊ TRÍ: apps/web/src/navigation/AdminRoutes.tsx
 * DÙNG BỞI: apps/web/src/AdminApp.tsx.
 * PHỤ THUỘC: react-router-dom; ../layouts/AdminLayout; ../pages/admin/DashboardPage;
 * ../pages/admin/PlacesPage; ../pages/admin/PlaceFormPage; ../pages/admin/ContentEditorPage;
 * ../pages/admin/ReviewsPage; ../pages/NotFoundPage
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ 'react-router-dom'.
import { Route, Routes } from 'react-router-dom'
// Nhập các thành phần từ '../layouts/AdminLayout'.
import { AdminLayout } from '../layouts/AdminLayout'
// Nhập các thành phần từ '../pages/admin/DashboardPage'.
import { DashboardPage } from '../pages/admin/DashboardPage'
// Nhập các thành phần từ '../pages/admin/PlacesPage'.
import { AdminPlacesPage } from '../pages/admin/PlacesPage'
// Nhập các thành phần từ '../pages/admin/PlaceFormPage'.
import { PlaceFormPage } from '../pages/admin/PlaceFormPage'
// Nhập các thành phần từ '../pages/admin/ContentEditorPage'.
import { ContentEditorPage } from '../pages/admin/ContentEditorPage'
// Nhập các thành phần từ '../pages/admin/ReviewsPage'.
import { ReviewsPage } from '../pages/admin/ReviewsPage'
// Nhập các thành phần từ '../pages/NotFoundPage'.
import { NotFoundPage } from '../pages/NotFoundPage'
// CHỨC NĂNG: Đăng ký route quản trị: tổng quan, danh sách, tạo/sửa địa điểm, biên tập và kiểm
// duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function AdminRoutes() { return <Routes><Route element={<AdminLayout />}>`: Khai báo AdminRoutes(). Component hàm nhận props và dựng phần giao diện AdminRoutes. | Trả cây giao diện của component để React hiển thị. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `<Route index element={<DashboardPage />} /><Route path="places" element={<AdminPlaces`: Dựng Route. | Thuộc tính index: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `<Route path="places/new" element={<PlaceFormPage />} /><Route path="places/:id/edit" `: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `<Route path="places/:id/content" element={<ContentEditorPage />} /><Route path="revie`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `<Route path="*" element={<NotFoundPage />} />`: Dựng Route. | Thuộc tính path: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính element: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `</Route></Routes> }`: Đóng phần giao diện Route.
 */
export function AdminRoutes() { return <Routes><Route element={<AdminLayout />}>
 <Route index element={<DashboardPage />} /><Route path="places" element={<AdminPlacesPage />} />
 <Route path="places/new" element={<PlaceFormPage />} /><Route path="places/:id/edit" element={<PlaceFormPage />} />
 <Route path="places/:id/content" element={<ContentEditorPage />} /><Route path="reviews" element={<ReviewsPage />} />
<Route path="*" element={<NotFoundPage />} />
</Route></Routes> }
// TẠI SAO (AdminRoutes): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất
// quán trong cùng ứng dụng.
/* CÁCH KIỂM TRA: /admin vào thẳng; refresh /admin/places/ID/content vẫn mở đúng màn. */
