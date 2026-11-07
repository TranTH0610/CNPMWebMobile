/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Dấu hiệu cổng cung đình bằng SVG, dùng tại Navbar và AdminLayout. TẠI SAO: Logo vector sắc nét ở mọi kích thước, không phụ thuộc emoji/font của thiết bị.
 *
 * VỊ TRÍ: apps/web/src/shared/components/BieuTrungDiSan.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx
 * - apps/web/src/shared/layouts/ThanhDieuHuong.tsx
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. HeritageMark
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// ==================== [DUNG-CHUNG] HeritageMark ====================
export function HeritageMark() {
  return (
    <svg className="heritage-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M5 19 24 9l19 10M9 17h30M8 23h32M12 23v17m24-17v17M7 40h34M18 40V29h12v11M24 4v5M6 19l-2-4m38 4 2-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 17 24 11l11 6M17 23v-4m14 4v-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
