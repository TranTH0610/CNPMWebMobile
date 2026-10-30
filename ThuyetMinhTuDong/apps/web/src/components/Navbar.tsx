/**
 * FILE NÀY LÀM GÌ
 * Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
 *
 * VỊ TRÍ: apps/web/src/components/Navbar.tsx
 * DÙNG BỞI: apps/web/src/layouts/AppLayout.tsx.
 * PHỤ THUỘC: react-router-dom; ../i18n/index; ./index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react-router-dom'.
import { Link, NavLink } from 'react-router-dom'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ './index'.
import { LanguagePicker } from './index'

// CHỨC NĂNG: Thanh điều hướng website du khách; nối các mục menu với route và bộ chọn ngôn ngữ.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function Navbar() { const t = useText(); return (<header className="navbar">`: Khai báo Navbar(). Component hàm nhận props và dựng phần giao diện Navbar. | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
 * DÒNG `<div className="nav-inner">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
 * DÒNG `<Link className="brand" to="/">`: Dựng Link. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết.
 * DÒNG `<span className="brand-mark" aria-hidden="true">🏯</span>`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `<span>`: Dựng span.
 * DÒNG `<strong>{t('site')}</strong>`: Dựng strong.
 * DÒNG `<small>{t('tagline')}</small>`: Dựng small.
 * DÒNG `</span>`: Đóng phần giao diện span.
 * DÒNG `</Link>`: Đóng phần giao diện Link.
 * DÒNG `<nav aria-label={t('explore')}>`: Dựng nav. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
 * DÒNG `<NavLink end to="/">{t('home')}</NavLink>`: Dựng NavLink. | Thuộc tính end: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Đặt đường dẫn mở khi người dùng bấm liên kết.
 * DÒNG `<NavLink to="/places">{t('explore')}</NavLink>`: Dựng NavLink. | Đặt đường dẫn mở khi người dùng bấm liên kết.
 * DÒNG `<NavLink to="/journey">{t('jMap')}</NavLink>`: Dựng NavLink. | Đặt đường dẫn mở khi người dùng bấm liên kết.
 * DÒNG `<NavLink to="/about">{t('about')}</NavLink>`: Dựng NavLink. | Đặt đường dẫn mở khi người dùng bấm liên kết.
 * DÒNG `</nav>`: Đóng phần giao diện nav.
 * DÒNG `<div className="nav-actions">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
 * DÒNG `<LanguagePicker />`: Dựng LanguagePicker.
 * DÒNG `</div>`: Đóng phần giao diện div.
 * DÒNG `</div>`: Đóng phần giao diện div.
 * DÒNG `</header>) }`: Đóng phần giao diện header.
 */
export function Navbar() { const t = useText(); return (<header className="navbar">
        <div className="nav-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">🏯</span>
            <span>
              <strong>{t('site')}</strong>
              <small>{t('tagline')}</small>
            </span>
          </Link>

          <nav aria-label={t('explore')}>
            <NavLink end to="/">{t('home')}</NavLink>
            <NavLink to="/places">{t('explore')}</NavLink>

            <NavLink to="/journey">{t('jMap')}</NavLink>

            <NavLink to="/about">{t('about')}</NavLink>
          </nav>

          <div className="nav-actions">
            <LanguagePicker />


          </div>
        </div>
      </header>) }
// TẠI SAO (Navbar): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
