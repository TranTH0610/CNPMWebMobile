/**
 * FILE: apps/web/src/shared/layouts/ThanhDieuHuong.tsx
 * FILE NÀY LÀM GÌ: Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { HeritageMark } from '../components/BieuTrungDiSan'

import { Link, NavLink } from 'react-router-dom'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
import { LanguagePicker } from '../../features/language/components/ChonNgonNgu'

// CHỨC NĂNG: Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [HỖ TRỢ CHUNG] Navbar — Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
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
