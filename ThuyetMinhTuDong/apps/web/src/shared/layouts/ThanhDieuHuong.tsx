/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
 *
 * VỊ TRÍ: apps/web/src/shared/layouts/ThanhDieuHuong.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/shared/layouts/BoCucDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../components/BieuTrungDiSan
 * - react-router-dom
 * - ../../features/language/i18n/CauHinhNgonNgu
 * - ../../features/language/components/ChonNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. Navbar
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { HeritageMark } from '../components/BieuTrungDiSan'

import { Link, NavLink } from 'react-router-dom'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
import { LanguagePicker } from '../../features/language/components/ChonNgonNgu'

// CHỨC NĂNG: Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DIEU-HUONG] Navbar ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function Navbar() {
  const t = useText()
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <HeritageMark />
          </span>
          <span>
            <strong>{t('site')}</strong>
            <small>{t('tagline')}</small>
          </span>
        </Link>

        <nav aria-label={t('explore')}>
          <NavLink end to="/">
            {t('home')}
          </NavLink>
          <NavLink to="/places">{t('explore')}</NavLink>

          <NavLink to="/journey">{t('jMap')}</NavLink>
        </nav>

        <div className="nav-actions">
          <LanguagePicker />
        </div>
      </div>
    </header>
  )
}
// TẠI SAO (Navbar): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
