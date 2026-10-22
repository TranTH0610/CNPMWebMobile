/**
 * FILE NÀY LÀM GÌ:
 * Layout navbar/footer và router web UC01–UC05.
 * main.tsx gọi; phụ thuộc React Router, core và các trang.
 * Du khách không cần tài khoản.
 */

import { useEffect } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'

import { PHOTO_CREDITS } from '@travelguide/visitor-core'
import { useText, useVisitor } from '@travelguide/visitor-core/react'

import { DetailPage, HomePage, PlacesPage, QrPage } from './pages'
import { Icon, LanguagePicker, State } from './ui'

// CHỨC NĂNG: Ghép layout chung và các trang.
// XỬ LÝ: Chức năng ngoài phạm vi chưa có luồng hoạt động giả.
export default function App() {
  const t = useText()
  const { language } = useVisitor()

  useEffect(() => {
    document.documentElement.lang =
      language === 'cn' ? 'zh-CN' : language

    document.title = t('site') + ' · ' + t('explore')
  }, [language, t])

  return (
    <>
      <header className="navbar">
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

            <button
              className="nav-disabled"
              disabled
              title={t('comingSoon')}
            >
              {t('map')}
            </button>

            <NavLink to="/about">{t('about')}</NavLink>
          </nav>

          <div className="nav-actions">
            <LanguagePicker />

            <Link
              className="icon-button"
              to="/qr"
              aria-label={t('qrAccess')}
            >
              <Icon name="qr" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:id" element={<DetailPage />} />
          <Route path="/qr" element={<QrPage />} />

          <Route
            path="/about"
            element={
              <section className="panel detail">
                <h1>{t('site')}</h1>
                <p>{t('intro')}</p>
                <p>{t('noAccount')}</p>
                <p>{t('demo')}</p>
              </section>
            }
          />

          <Route
            path="*"
            element={
              <section className="panel">
                <State message="notFound" />
                <Link to="/places">{t('back')}</Link>
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="container footer">
        <strong>{t('site')}</strong>
        <p>{t('noAccount')}</p>
        <p>{t('demo')}</p>

        <details>
          <summary>{t('photoCredits')}</summary>

          {PHOTO_CREDITS.map((credit) => (
            <p key={credit.url}>
              <a href={credit.url} target="_blank" rel="noreferrer">
                {credit.title}
              </a>
              {' · '}
              <a href={credit.licenseUrl}>
                {credit.license}
              </a>
            </p>
          ))}
        </details>
      </footer>
    </>
  )
}