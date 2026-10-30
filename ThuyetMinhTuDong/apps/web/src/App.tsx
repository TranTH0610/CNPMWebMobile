/**
 * FILE NÀY LÀM GÌ
 * Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết định qua
 * route.
 *
 * VỊ TRÍ: apps/web/src/App.tsx
 * DÙNG BỞI: apps/web/src/main.tsx.
 * PHỤ THUỘC: ./hooks/usePresenceHeartbeat; ./navigation/AppRoutes; ./hooks/useJourneyNavigation
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ './hooks/usePresenceHeartbeat'.
import { usePresenceHeartbeat } from './hooks/usePresenceHeartbeat'
// Nhập các thành phần từ './navigation/AppRoutes'.
import { AppRoutes } from './navigation/AppRoutes'
// Nhập các thành phần từ './hooks/useJourneyNavigation'.
import { useJourneyNavigation } from './hooks/useJourneyNavigation'

// CHỨC NĂNG: Ghép ứng dụng du khách web và đăng ký báo phiên hoạt động; nội dung trang được quyết
// định qua route.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo App(). Component hàm nhận props và dựng phần giao diện App. | Thực hiện Gọi usePresenceHeartbeat(). | Thực hiện Gọi useJourneyNavigation(). | Trả cây giao diện của component để React hiển thị.
export default function App() { usePresenceHeartbeat(); useJourneyNavigation(); return <AppRoutes /> }
// TẠI SAO (App): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
// dễ bảo trì.
