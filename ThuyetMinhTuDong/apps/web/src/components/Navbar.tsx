/**
 * FILE NÀY LÀM GÌ: Thanh điều hướng web, logo, chọn ngôn ngữ và liên kết QR chung.
 * Vị trí: apps/web/src/components/Navbar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Link, NavLink } from 'react-router-dom'
import { useText } from '../i18n/index'
import { LanguagePicker } from './index'

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
