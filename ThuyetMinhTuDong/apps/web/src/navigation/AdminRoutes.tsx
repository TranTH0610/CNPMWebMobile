/** FILE NÀY LÀM GÌ: Cây route Admin Web, không có route đăng nhập theo phạm vi FE.
 * AppRoutes gọi; layout nằm ngoài layout du khách. UC12–UC17.
 * Giữ service phiên/quyền để nối BE; route này không phải hàng rào bảo mật. */
import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { AdminPlacesPage } from '../pages/admin/PlacesPage'
import { PlaceFormPage } from '../pages/admin/PlaceFormPage'
import { ContentEditorPage } from '../pages/admin/ContentEditorPage'
import { ReviewsPage } from '../pages/admin/ReviewsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
export function AdminRoutes() { return <Routes><Route element={<AdminLayout />}>
 <Route index element={<DashboardPage />} /><Route path="places" element={<AdminPlacesPage />} />
 <Route path="places/new" element={<PlaceFormPage />} /><Route path="places/:id/edit" element={<PlaceFormPage />} />
 <Route path="places/:id/content" element={<ContentEditorPage />} /><Route path="reviews" element={<ReviewsPage />} />
<Route path="*" element={<NotFoundPage />} />
</Route></Routes> }
/* CÁCH KIỂM TRA: /admin vào thẳng; refresh /admin/places/ID/content vẫn mở đúng màn. */
