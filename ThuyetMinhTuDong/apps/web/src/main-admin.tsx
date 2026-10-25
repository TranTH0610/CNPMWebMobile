/**
 * FILE NÀY LÀM GÌ: Entry riêng của web quản lý; chỉ bản chạy/build admin nạp file này.
 * Vị trí: apps/web/src/main-admin.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { AdminProvider } from '@travelguide/admin-core/react'
import { adminService, publicCatalog } from './services/admin/services'
import { boot } from './i18n'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { journeyAdapters } from './services/journeyAdapters'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { colors, spacing } from '../../../packages/ui-tokens/colors'
import { storage } from './services/platform'
import { AdminApp } from './AdminApp'
import './styles/index.css'
import './styles/player.css'

// CHỨC NĂNG: Cho CSS dùng chung token với mobile.
// XỬ LÝ: Màu là chuỗi; spacing được đổi thành đơn vị px.
for (const [key, value] of Object.entries(colors)) {
  document.documentElement.style.setProperty('--' + key, value)
}

for (const [key, value] of Object.entries(spacing)) {
  document.documentElement.style.setProperty(
    '--space-' + key,
    value + 'px',
  )
}

const root = document.getElementById('root')

if (!root) throw new Error('Missing root element')

// CHỨC NĂNG: Khởi tạo ngôn ngữ trước khi mở các trang.
// XỬ LÝ: BrowserRouter giữ route chi tiết khi truy cập bằng QR.
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <VisitorProvider
      boot={boot}
      storage={storage}
      catalog={publicCatalog}
      deviceLanguage={
        navigator.languages?.[0] ?? navigator.language
      }
      loading={<progress />}
    >
      <BrowserRouter>
        <AdminProvider service={adminService}><JourneyProvider adapters={journeyAdapters}><AdminApp /></JourneyProvider></AdminProvider>
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)
