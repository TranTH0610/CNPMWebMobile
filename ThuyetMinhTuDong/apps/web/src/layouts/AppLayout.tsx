/**
 * FILE NÀY LÀM GÌ: Layout web dùng chung cho mọi trang; đổi trang không hủy trình phát.
 * Vị trí: apps/web/src/layouts/AppLayout.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { JourneyPlayer } from '../components/JourneyPlayer'

// CHỨC NĂNG: Giữ layout/player khi route con đổi; chỉ nội dung Outlet thay đổi.
export function AppLayout() {
  const t = useText()
  const { language } = useVisitor()

  useEffect(() => {
    document.documentElement.lang = language === 'cn' ? 'zh-CN' : language
    document.title = t('site') + ' · ' + t('explore')
  }, [language, t])

  return (
    <>
      <Navbar />
      <main className="container">
        <JourneyPlayer />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
