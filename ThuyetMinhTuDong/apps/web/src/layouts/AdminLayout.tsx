/**
 * FILE NÀY LÀM GÌ
 * Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin.
 *
 * VỊ TRÍ: apps/web/src/layouts/AdminLayout.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core/react; react; ../hooks/useJourney; react-router-dom;
 * @travelguide/admin-core/react; ../components/LanguagePicker; ../components/admin/AdminIcon;
 * ../styles/admin.css
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { useVisitor } from '@travelguide/visitor-core/react'
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ 'react-router-dom'.
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../components/LanguagePicker'.
import { LanguagePicker } from '../components/LanguagePicker'
// Nhập các thành phần từ '../components/admin/AdminIcon'.
import { AdminIcon, type AdminIconName } from '../components/admin/AdminIcon'
// Nhập các thành phần từ '../styles/admin.css'.
import '../styles/admin.css'
// CHỨC NĂNG: Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung
// admin.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AdminLayout(). Component hàm nhận props và dựng phần giao diện AdminLayout.
export function AdminLayout() {
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { engine }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { pathname }: Gọi useLocation().
 const t = useAdminText(), state = useAdmin(), { engine } = useJourney(), { language } = useVisitor(), { pathname } = useLocation()
 // CHỨC NĂNG: Dừng tiếng du khách khi vào quản lý và cập nhật ngôn ngữ tài liệu.
 // XỬ LÝ: Chỉ dùng instance đang có; mã cn nội bộ được chuyển thành zh-CN cho HTML.
 // DÒNG NÀY LÀM GÌ: Gọi engine.pause() khi giao diện quản trị được gắn hoặc engine thay đổi.
 // CÁCH HOẠT ĐỘNG: Thao tác tạm dừng phiên bài nghe mà engine đang sở hữu.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine.
 // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại.
 useEffect(() => { engine.pause() }, [engine])
 // TẠI SAO: Chuyển sang quản trị không nên để bài du khách tiếp tục phát cùng phần nghe thử
 // admin.
 // DÒNG NÀY LÀM GÌ: Đồng bộ tiêu đề tab và thuộc tính ngôn ngữ HTML theo ngôn ngữ giao diện.
 // CÁCH HOẠT ĐỘNG: Mã nội bộ cn đổi sang zh-CN khi ghi thuộc tính lang của tài liệu.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: language, t.
 // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện tính biểu thức document.title = 'HueGuide · ' + t('admin'). | Thực hiện tính biểu thức document.documentElement.lang = language === 'cn' ? 'zh-CN' : language.
 useEffect(() => { document.title = 'HueGuide · ' + t('admin'); document.documentElement.lang = language === 'cn' ? 'zh-CN' : language }, [language,t])
 // TẠI SAO: Tiêu đề và trình đọc màn hình cần biết đúng ngôn ngữ sau khi người dùng đổi tiếng.
 // Khai báo current: chọn giữa hai giá trị theo điều kiện pathname.includes('/reviews').
 const current = pathname.includes('/reviews') ? 'reviews' : pathname.includes('/places') ? 'places' : 'dashboard'
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `const menu: {key: 'dashboard' | 'places' | 'reviews'; icon: AdminIconName; to: string`: Khai báo menu: tạo mảng [ {key:'dashboard',icon:'dashboard',to:'/admin'}, {key:'places',icon:'places',to. | Khai báo key, kiểu 'dashboard' | 'places' | 'reviews'. Khóa phân biệt các phần tử để React đối chiếu đúng khi cập nhật danh sách. | Khai báo icon, kiểu AdminIconName. | Khai báo to, kiểu string.
  * DÒNG `{key:'dashboard',icon:'dashboard',to:'/admin'},`: Khai báo menu: tạo mảng [ {key:'dashboard',icon:'dashboard',to:'/admin'}, {key:'places',icon:'places',to. | Gán thuộc tính key: chuỗi 'dashboard'. | Gán thuộc tính icon: chuỗi 'dashboard'. | Gán thuộc tính to: chuỗi '/admin'.
  * DÒNG `{key:'places',icon:'places',to:'/admin/places'},`: Khai báo menu: tạo mảng [ {key:'dashboard',icon:'dashboard',to:'/admin'}, {key:'places',icon:'places',to. | Gán thuộc tính key: chuỗi 'places'. | Gán thuộc tính icon: chuỗi 'places'. | Gán thuộc tính to: chuỗi '/admin/places'.
  * DÒNG `{key:'reviews',icon:'review',to:'/admin/reviews'},`: Khai báo menu: tạo mảng [ {key:'dashboard',icon:'dashboard',to:'/admin'}, {key:'places',icon:'places',to. | Gán thuộc tính key: chuỗi 'reviews'. | Gán thuộc tính icon: chuỗi 'review'. | Gán thuộc tính to: chuỗi '/admin/reviews'.
  * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
  */
 const menu: {key: 'dashboard' | 'places' | 'reviews'; icon: AdminIconName; to: string}[] = [
  {key:'dashboard',icon:'dashboard',to:'/admin'},
  {key:'places',icon:'places',to:'/admin/places'},
  {key:'reviews',icon:'review',to:'/admin/reviews'},
 ]
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <div className="admin-shell">`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<aside className="admin-sidebar">`: Dựng aside. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<Link className="admin-brand" to="/admin"><span className="admin-brand-icon"><AdminIc`: Dựng Link. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<nav aria-label={t('admin')}>{menu.map(item => <NavLink end={item.key === 'dashboard'`: Dựng nav. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Thuộc tính end: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<div className="admin-sidebar-note"><AdminIcon name="review"/><strong>{t('admin')}</s`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</aside>`: Đóng phần giao diện aside.
  * DÒNG `<main className="admin-main">`: Dựng main. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<header className="admin-topbar"><div><small>HUEGUIDE / {t('admin')}</small><strong>{`: Dựng header. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<div className="admin-workspace"><Outlet/><div className="admin-demo admin-footnote" `: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</main>`: Đóng phần giao diện main.
  * DÒNG `</div>`: Đóng phần giao diện div.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <div className="admin-shell">
  <aside className="admin-sidebar">
   <Link className="admin-brand" to="/admin"><span className="admin-brand-icon"><AdminIcon name="places"/></span><strong>HueGuide<small>{t('admin')}</small></strong></Link>
   {/* CHỨC NĂNG: Menu có icon và trạng thái đang chọn; màn nhỏ cuộn ngang. */}
   <nav aria-label={t('admin')}>{menu.map(item => <NavLink end={item.key === 'dashboard'} key={item.key} to={item.to}><AdminIcon name={item.icon}/><span>{t(item.key)}</span><span className="admin-nav-arrow"><AdminIcon name="arrow"/></span></NavLink>)}</nav>
   <div className="admin-sidebar-note"><AdminIcon name="review"/><strong>{t('admin')}</strong><p>{t('overviewHint')}</p></div>
  </aside>
  <main className="admin-main">
   <header className="admin-topbar"><div><small>HUEGUIDE / {t('admin')}</small><strong>{t(current)}</strong></div><div className="admin-topbar-tools"><LanguagePicker/><div className="admin-identity"><span aria-hidden="true">HG</span><div><strong>{state.identity?.displayName ?? 'HueGuide'}</strong><small>{t('admin')}</small></div></div></div></header>
   <div className="admin-workspace"><Outlet/><div className="admin-demo admin-footnote" role="note">{t('demo')}</div></div>
  </main>
 </div>
}
// TẠI SAO (AdminLayout): Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều
// hướng không nhất quán.
/* CÁCH KIỂM TRA: Menu đổi đúng route; đổi ngôn ngữ đổi tiêu đề; ở màn nhỏ không tràn ngang trang. */
