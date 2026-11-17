/**
 * FILE: apps/web/src/main.tsx
 * FILE NÀY LÀM GÌ: Entry web du khách: tạo root React, ghép provider và router rồi gắn ứng dụng vào HTML.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { publicCatalog } from './features/admin/shared/services/KetNoiDichVuQuanTri'
import { boot } from './features/language/i18n/CauHinhNgonNgu'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { journeyAdapters } from './features/journey/adapters/KetNoiAudioVaDinhVi'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { colors, spacing } from '../../../packages/ui-tokens/MauVaKichThuoc'
import { storage } from './shared/services/KetNoiNenTang'
import App from './app/App'
import './shared/styles/GiaoDienNen.css'

import './features/journey/styles/GiaoDienTrinhNghe.css'
// CHỨC NĂNG: Chỉ nạp thiết kế du khách tại điểm vào du khách, không ảnh hưởng admin.
import './features/explore/styles/GiaoDienDuKhach.css'

// CHỨC NĂNG: Nhận diện Heritage và chuẩn tương tác chung cho các trang.
import './shared/styles/DiSanHue.css'

// CHỨC NĂNG: Cho CSS dùng chung token với mobile.
// XỬ LÝ: Màu là chuỗi; spacing được đổi thành đơn vị px.

for (const [key, value] of Object.entries(colors)) {
  document.documentElement.style.setProperty('--' + key, value)
}

for (const [key, value] of Object.entries(spacing)) {
  document.documentElement.style.setProperty('--space-' + key, value + 'px')
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
      deviceLanguage={navigator.languages?.[0] ?? navigator.language}
      loading={<progress />}
    >
      <BrowserRouter>
        <JourneyProvider adapters={journeyAdapters}>
          <App />
        </JourneyProvider>
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)
