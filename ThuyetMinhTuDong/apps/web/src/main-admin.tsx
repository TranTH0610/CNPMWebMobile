/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách.
 *
 * VỊ TRÍ: apps/web/src/main-admin.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - @travelguide/admin-core/react
 * - ./features/admin/shared/services/KetNoiDichVuQuanTri
 * - ./features/language/i18n/CauHinhNgonNgu
 * - @travelguide/visitor-core/journey/react
 * - ./features/journey/adapters/KetNoiAudioVaDinhVi
 * - react
 * - react-dom/client
 * - react-router-dom
 * - @travelguide/visitor-core/react
 * - ../../../packages/ui-tokens/MauVaKichThuoc
 * - ./shared/services/KetNoiNenTang
 * - ./app/UngDungQuanTri
 * - ./shared/styles/GiaoDienNen.css
 * - ./features/journey/styles/GiaoDienTrinhNghe.css
 * - ./shared/styles/DiSanHue.css
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
