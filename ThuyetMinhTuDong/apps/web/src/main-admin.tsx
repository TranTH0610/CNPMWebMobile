/**
 * FILE: apps/web/src/main-admin.tsx
 * FILE NÀY LÀM GÌ: Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { AdminProvider } from '@travelguide/admin-core/react'
import { adminService, publicCatalog } from './features/admin/shared/services/KetNoiDichVuQuanTri'
import { boot } from './features/language/i18n/CauHinhNgonNgu'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { journeyAdapters } from './features/journey/adapters/KetNoiAudioVaDinhVi'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { colors, spacing } from '../../../packages/ui-tokens/MauVaKichThuoc'
import { storage } from './shared/services/KetNoiNenTang'
import { AdminApp } from './app/UngDungQuanTri'
import './shared/styles/GiaoDienNen.css'

import './features/journey/styles/GiaoDienTrinhNghe.css'

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
        <AdminProvider service={adminService}>
          <JourneyProvider adapters={journeyAdapters}>
            <AdminApp />
          </JourneyProvider>
        </AdminProvider>
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)
