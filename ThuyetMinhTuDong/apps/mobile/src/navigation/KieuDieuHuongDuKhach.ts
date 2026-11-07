/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 * - apps/mobile/src/navigation/LienKetMoUngDung.ts
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import type { Category } from '@travelguide/visitor-core'

// CHỨC NĂNG: Kiểm tra tham số điều hướng.
// XỬ LÝ: Detail bắt buộc placeId; Search nhận điều kiện ban đầu.
// Đặt tên kiểu VisitorStack.
export type VisitorStack = {
  Places: undefined

  Search: {
    query?: string

    category?: Category
  }

  Detail: {
    placeId: string
  }

  Journey: { placeId?: string } | undefined
}
