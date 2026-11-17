/**
 * FILE: apps/web/src/shared/components/BaoVeLoiTrang.tsx
 * FILE NÀY LÀM GÌ: Giữ trang có thông báo thử lại nếu tải module bản đồ thất bại vì mạng. AppRoutes bọc trang tải theo nhu cầu; State cung cấp nhãn đã dịch và nút thử lại thật. TẠI SAO: Suspense chỉ xử lý đang tải; lỗi tải chunk cần boundary để không làm trắng toàn app.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Component, type ReactNode } from 'react'
import { State } from './TrangThaiDuLieu'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider RouteBoundary.
// [HỖ TRỢ CHUNG] RouteBoundary — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider RouteBoundary.
export class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return <State message="loadError" retry={() => window.location.reload()} />
    return this.props.children
  }
}
