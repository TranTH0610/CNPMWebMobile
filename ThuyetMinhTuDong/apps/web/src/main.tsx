/**
 * FILE NÀY LÀM GÌ:
 * Mount React18, BrowserRouter và provider UC01–UC05.
 * index.html gọi; phụ thuộc App, adapter browser và token.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import {
  createVisitorI18n,
  VisitorProvider,
} from '@travelguide/visitor-core/react'

import {
  colors,
  spacing,
} from '../../../packages/ui-tokens/colors'

import { storage } from './platform'
import App from './App'
import './styles.css'

const boot = createVisitorI18n()

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
        <App />
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)