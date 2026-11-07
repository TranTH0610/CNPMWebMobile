/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Chân trang du khách gọn, chỉ giữ tên ứng dụng. AppLayout dùng; phụ thuộc useText để tên hiển thị đúng ngôn ngữ. CHỨC NĂNG: Không đưa thông báo tài khoản, dữ liệu mẫu hoặc thông tin kỹ thuật vào chân trang.
 *
 * VỊ TRÍ: apps/web/src/shared/layouts/ChanTrang.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/shared/layouts/BoCucDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. Footer
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
// ==================== [DUNG-CHUNG] Footer ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Footer.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function Footer() {
  const t = useText()
  return (
    <footer className="container footer">
      <strong>{t('site')}</strong>
    </footer>
  )
}
