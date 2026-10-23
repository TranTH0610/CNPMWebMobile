/**
 * FILE NÀY LÀM GÌ: Mount React 18, BrowserRouter và các provider; giữ ngôn ngữ/tiến độ dùng chung.
 * Vị trí: apps/web/src/main.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { boot } from './i18n'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { journeyAdapters } from './services/journeyAdapters'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { colors, spacing } from '../../../packages/ui-tokens/colors'
import { storage } from './services/platform'
import App from './App'
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
      deviceLanguage={
        navigator.languages?.[0] ?? navigator.language
      }
      loading={<progress />}
    >
      <BrowserRouter>
        <JourneyProvider adapters={journeyAdapters}><App /></JourneyProvider>
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)
