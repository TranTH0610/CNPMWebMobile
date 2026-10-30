/**
 * FILE NÀY LÀM GÌ
 * Entry riêng của web quản trị; ghép provider/route admin mà không dùng entry du khách.
 *
 * VỊ TRÍ: apps/web/src/main-admin.tsx
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: @travelguide/admin-core/react; ./services/admin/services; ./i18n;
 * @travelguide/visitor-core/journey/react; ./services/journeyAdapters; react; react-dom/client;
 * react-router-dom; @travelguide/visitor-core/react; ../../../packages/ui-tokens/colors;
 * ./services/platform; ./AdminApp; ./styles/index.css; ./styles/player.css
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { AdminProvider } from '@travelguide/admin-core/react'
// Nhập các thành phần từ './services/admin/services'.
import { adminService, publicCatalog } from './services/admin/services'
// Nhập các thành phần từ './i18n'.
import { boot } from './i18n'
// Nhập các thành phần từ '@travelguide/visitor-core/journey/react'.
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
// Nhập các thành phần từ './services/journeyAdapters'.
import { journeyAdapters } from './services/journeyAdapters'
// Nhập các thành phần từ 'react'.
import React from 'react'
// Nhập các thành phần từ 'react-dom/client'.
import ReactDOM from 'react-dom/client'
// Nhập các thành phần từ 'react-router-dom'.
import { BrowserRouter } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { VisitorProvider } from '@travelguide/visitor-core/react'
// Nhập các thành phần từ '../../../packages/ui-tokens/colors'.
import { colors, spacing } from '../../../packages/ui-tokens/colors'
// Nhập các thành phần từ './services/platform'.
import { storage } from './services/platform'
// Nhập các thành phần từ './AdminApp'.
import { AdminApp } from './AdminApp'
// Nhập các thành phần từ './styles/index.css'.
import './styles/index.css'
// Nhập các thành phần từ './styles/player.css'.
import './styles/player.css'

// CHỨC NĂNG: Cho CSS dùng chung token với mobile.
// XỬ LÝ: Màu là chuỗi; spacing được đổi thành đơn vị px.
// Duyệt lần lượt Object.entries(colors) bằng const [key, value].
for (const [key, value] of Object.entries(colors)) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `document.documentElement.style.setProperty('--' + key, value)`: Thực hiện Gọi document.documentElement.style.setProperty('--' + key, value).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  document.documentElement.style.setProperty('--' + key, value)
}

// Duyệt lần lượt Object.entries(spacing) bằng const [key, value].
for (const [key, value] of Object.entries(spacing)) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `document.documentElement.style.setProperty(`: Thực hiện Gọi document.documentElement.style.setProperty( '--space-' + key, value + 'px', ).
   * DÒNG `'--space-' + key,`: Thực hiện Gọi document.documentElement.style.setProperty( '--space-' + key, value + 'px', ).
   * DÒNG `value + 'px',`: Thực hiện Gọi document.documentElement.style.setProperty( '--space-' + key, value + 'px', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  document.documentElement.style.setProperty(
    '--space-' + key,
    value + 'px',
  )
}

// Khai báo root: Gọi document.getElementById('root').
const root = document.getElementById('root')

// Rẽ nhánh nếu !root. | Ném new Error('Missing root element').
if (!root) throw new Error('Missing root element')

// CHỨC NĂNG: Khởi tạo ngôn ngữ trước khi mở các trang.
// XỬ LÝ: BrowserRouter giữ route chi tiết khi truy cập bằng QR.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `ReactDOM.createRoot(root).render(`: Thực hiện Gọi ReactDOM.createRoot(root).render( <React.StrictMode> <VisitorProvider boot={boot} storage=.
 * DÒNG `<React.StrictMode>`: Dựng React.StrictMode.
 * DÒNG `<VisitorProvider`: Dựng VisitorProvider.
 * DÒNG `boot={boot}`: Thuộc tính boot: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `storage={storage}`: Thuộc tính storage: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `catalog={publicCatalog}`: Thuộc tính catalog: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `deviceLanguage={`: Thuộc tính deviceLanguage: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `navigator.languages?.[0] ?? navigator.language`: Đưa biểu thức JavaScript navigator.languages?.[0] ?? navigator.language vào JSX.
 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
 * DÒNG `loading={<progress />}`: Thuộc tính loading: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `>`: Dựng VisitorProvider.
 * DÒNG `<BrowserRouter>`: Dựng BrowserRouter.
 * DÒNG `<AdminProvider service={adminService}><JourneyProvider adapters={journeyAdapters}><Ad`: Dựng AdminProvider. | Thuộc tính service: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính adapters: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `</BrowserRouter>`: Đóng phần giao diện BrowserRouter.
 * DÒNG `</VisitorProvider>`: Đóng phần giao diện VisitorProvider.
 * DÒNG `</React.StrictMode>,`: Đóng phần giao diện React.StrictMode.
 * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
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
