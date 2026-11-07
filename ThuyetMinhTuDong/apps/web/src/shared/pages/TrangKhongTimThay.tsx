/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
 *
 * VỊ TRÍ: apps/web/src/shared/pages/TrangKhongTimThay.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 * - apps/web/src/app/DinhTuyenQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react-router-dom
 * - ../../features/language/i18n/CauHinhNgonNgu
 * - ../components/TrangThaiDuLieu
 *
 * CÁC KHỐI CHÍNH:
 * 1. NotFoundPage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Link } from 'react-router-dom'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
import { State } from '../components/TrangThaiDuLieu'

// CHỨC NĂNG: Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DUNG-CHUNG] NotFoundPage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function NotFoundPage() {
  const t = useText()
  return (
    <section className="panel">
      <State message="notFound" />
      <Link to="/places">{t('back')}</Link>
    </section>
  )
}
// TẠI SAO (NotFoundPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
