/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Giữ trang có thông báo thử lại nếu tải module bản đồ thất bại vì mạng. AppRoutes bọc trang tải theo nhu cầu; State cung cấp nhãn đã dịch và nút thử lại thật. TẠI SAO: Suspense chỉ xử lý đang tải; lỗi tải chunk cần boundary để không làm trắng toàn app.
 *
 * VỊ TRÍ: apps/web/src/shared/components/BaoVeLoiTrang.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - ./TrangThaiDuLieu
 *
 * CÁC KHỐI CHÍNH:
 * 1. RouteBoundary
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Component, type ReactNode } from 'react'
import { State } from './TrangThaiDuLieu'
// ==================== [DUNG-CHUNG] RouteBoundary ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider RouteBoundary.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
