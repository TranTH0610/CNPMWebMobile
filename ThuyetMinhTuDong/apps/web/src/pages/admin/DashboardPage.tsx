/**
 * FILE NÀY LÀM GÌ
 * Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng để hiển thị
 * bốn chỉ số.
 *
 * VỊ TRÍ: apps/web/src/pages/admin/DashboardPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx.
 * PHỤ THUỘC: react; react-router-dom; @travelguide/visitor-core/presence/react;
 * ../../services/presence; @travelguide/admin-core; @travelguide/admin-core/react;
 * ../../components/admin/AdminUI; ../../services/admin/services; ../../components/admin/AdminIcon
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react'.
import { useMemo } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { Link } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core/presence/react'.
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
// Nhập các thành phần từ '../../services/presence'.
import { presenceClient } from '../../services/presence'
// Nhập các thành phần từ '@travelguide/admin-core'.
import { dashboard } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Feedback } from '../../components/admin/AdminUI'
// Nhập các thành phần từ '../../services/admin/services'.
import { gateClient } from '../../services/admin/services'
// Nhập các thành phần từ '../../components/admin/AdminIcon'.
import { AdminIcon, type AdminIconName } from '../../components/admin/AdminIcon'
// CHỨC NĂNG: Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng
// để hiển thị bốn chỉ số.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo DashboardPage(). Component hàm nhận props và dựng phần giao diện DashboardPage.
export function DashboardPage() {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo gate: useGateStatistics đọc lượt mở liên kết QR theo hợp đồng riêng, không coi lượt này là số người.
 const state = useAdmin(), t = useAdminText(), gate = useGateStatistics(gateClient)
 // Khai báo presence: usePresenceStatistics đọc số liệu phiên qua client, đồng thời cung cấp trạng thái tải/lỗi và thử lại.
 const presence = usePresenceStatistics(presenceClient)
 // CHỨC NĂNG: Tính lại thống kê nội dung khi kho thay đổi, tách số phiên lấy từ RAM.
 // XỬ LÝ: Chưa có phản hồi presence thì hiển thị —; không đánh đồng lỗi với 0 phiên.
 // Khai báo metrics: useMemo lưu kết quả theo mảng phụ thuộc.
 const metrics = useMemo(() => state.data ? dashboard(state.data) : null, [state.data])
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `const tiles: {key:'active'|'gateToday'|'places'|'pending'; icon:AdminIconName}[] = [`: Khai báo tiles: tạo mảng [ {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'pl. | Khai báo key, kiểu 'active'|'gateToday'|'places'|'pending'. Khóa phân biệt các phần tử để React đối chiếu đúng khi cập nhật danh sách. | Khai báo icon, kiểu AdminIconName.
  * DÒNG `{key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'places'},`: Khai báo tiles: tạo mảng [ {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'pl. | Gán thuộc tính key: chuỗi 'active'. | Gán thuộc tính icon: chuỗi 'users'. | Gán thuộc tính key: chuỗi 'gateToday'. | Gán thuộc tính icon: chuỗi 'qr'. | Gán thuộc tính key: chuỗi 'places'. | Gán thuộc tính icon: chuỗi 'places'. | Gán thuộc tính key: chuỗi 'pending'. | Gán thuộc tính icon: chuỗi 'review'.
  * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
  */
 const tiles: {key:'active'|'gateToday'|'places'|'pending'; icon:AdminIconName}[] = [
  {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'places'},{key:'pending',icon:'review'},
 ]
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `<section className="admin-hero"><div><span className="admin-eyebrow">HUEGUIDE</span><`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Feedback state={state}/>`: Dựng Feedback. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article `: Đưa biểu thức JavaScript metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article className={'admin-metric m vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<p className="admin-demo">{t('gateHint')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `{gate.error&&<div className="admin-error" role="alert">{t('gateError')}<button classN`: Đưa biểu thức JavaScript gate.error&&<div className="admin-error" role="alert">{t('gateError')}<button className="secondary" onClick={g vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback.
  * DÒNG `<div className="admin-dashboard-grid">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<section className="admin-card"><div className="admin-section-heading"><span classNam`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'},`: Đưa biểu thức JavaScript ([ {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'}, {to:'/admin/reviews',title:'revi vào JSX. | Gán thuộc tính to: chuỗi '/admin/places'. | Gán thuộc tính title: chuỗi 'places'. | Gán thuộc tính hint: chuỗi 'managePlacesHint'. | Gán thuộc tính icon: chuỗi 'places'.
  * DÒNG `{to:'/admin/reviews',title:'reviews',hint:'reviewQueueHint',icon:'review'},`: Đưa biểu thức JavaScript ([ {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'}, {to:'/admin/reviews',title:'revi vào JSX. | Gán thuộc tính to: chuỗi '/admin/reviews'. | Gán thuộc tính title: chuỗi 'reviews'. | Gán thuộc tính hint: chuỗi 'reviewQueueHint'. | Gán thuộc tính icon: chuỗi 'review'.
  * DÒNG `] as const).map(item=><Link key={item.to} className="admin-quick-action" to={item.to}`: Đưa biểu thức JavaScript ([ {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'}, {to:'/admin/reviews',title:'revi vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<section className="admin-card admin-presence-card"><div className="admin-section-hea`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{presence.error ? <div className="admin-error" role="alert">{t('presenceError')}<butt`: Đưa biểu thức JavaScript presence.error ? <div className="admin-error" role="alert">{t('presenceError')}<button className="secondary" o vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback.
  * DÒNG `</section>`: Đóng phần giao diện section.
  * DÒNG `</div>`: Đóng phần giao diện div.
  * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <>
  <section className="admin-hero"><div><span className="admin-eyebrow">HUEGUIDE</span><h1>{t('dashboard')}</h1><p>{t('overviewHint')}</p></div><Link className="button admin-hero-button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link><div className="admin-hero-decoration" aria-hidden="true"><AdminIcon name="places"/></div></section>
  <Feedback state={state}/>
  {metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article className={'admin-metric metric-'+index} key={key}><div className="admin-metric-top"><span>{t(key === 'pending' ? 'status_submitted' : key)}</span><span className="admin-metric-icon"><AdminIcon name={icon}/></span></div><strong>{key === 'active' ? presence.stats?.active ?? '—' : key === 'gateToday' ? gate.stats?.today ?? '—' : metrics[key]}</strong><div className="admin-metric-line"/></article>)}</div>}
  <p className="admin-demo">{t('gateHint')}</p>
  {gate.error&&<div className="admin-error" role="alert">{t('gateError')}<button className="secondary" onClick={gate.retry}>{t('retry')}</button></div>}
  <div className="admin-dashboard-grid">
   <section className="admin-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="dashboard"/></span><h2>{t('quickActions')}</h2></div><div className="admin-quick-actions">{([
    {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'},
    {to:'/admin/reviews',title:'reviews',hint:'reviewQueueHint',icon:'review'},
   ] as const).map(item=><Link key={item.to} className="admin-quick-action" to={item.to}><span className="admin-icon-box"><AdminIcon name={item.icon}/></span><div><strong>{t(item.title)}</strong><p>{t(item.hint)}</p></div><AdminIcon name="arrow"/></Link>)}</div></section>
   <section className="admin-card admin-presence-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="users"/></span><h2>{t('active')}</h2></div><p>{t('analyticsHint')}</p>
    {/* CHỨC NĂNG: Lỗi polling có nút thử lại; không che bằng dữ liệu giả. */}
    {presence.error ? <div className="admin-error" role="alert">{t('presenceError')}<button className="secondary" onClick={presence.retry}>{t('retry')}</button></div> : !presence.stats ? <p role="status">{t('loading')}</p> : null}
   </section>
  </div>

 </>
}
// TẠI SAO (DashboardPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
/* CÁCH KIỂM TRA: Bốn chỉ số đúng; liên kết mở đúng màn; không còn nút reset; tắt RAM hiện lỗi. */
