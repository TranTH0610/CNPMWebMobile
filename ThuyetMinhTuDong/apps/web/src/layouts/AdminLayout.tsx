/**
 * FILE NÀY LÀM GÌ: Khung Admin web gồm menu, danh tính được cấp và vùng trang con.
 * AdminRoutes gọi; dùng AdminProvider, JourneyProvider và LanguagePicker hiện có.
 * Liên quan UC12–UC17. CSS responsive giữ cùng tông xanh–trắng với Admin mobile.
 */
import { useVisitor } from '@travelguide/visitor-core/react'
import { useEffect } from 'react'
import { useJourney } from '../hooks/useJourney'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { LanguagePicker } from '../components/LanguagePicker'
import { AdminIcon, type AdminIconName } from '../components/admin/AdminIcon'
import '../styles/admin.css'
export function AdminLayout() {
 const t = useAdminText(), state = useAdmin(), { engine } = useJourney(), { language } = useVisitor(), { pathname } = useLocation()
 // CHỨC NĂNG: Dừng tiếng du khách khi vào quản lý và cập nhật ngôn ngữ tài liệu.
 // XỬ LÝ: Chỉ dùng instance đang có; mã cn nội bộ được chuyển thành zh-CN cho HTML.
 useEffect(() => { engine.pause() }, [engine])
 useEffect(() => { document.title = 'HueGuide · ' + t('admin'); document.documentElement.lang = language === 'cn' ? 'zh-CN' : language }, [language,t])
 const current = pathname.includes('/reviews') ? 'reviews' : pathname.includes('/places') ? 'places' : 'dashboard'
 const menu: {key: 'dashboard' | 'places' | 'reviews'; icon: AdminIconName; to: string}[] = [
  {key:'dashboard',icon:'dashboard',to:'/admin'},
  {key:'places',icon:'places',to:'/admin/places'},
  {key:'reviews',icon:'review',to:'/admin/reviews'},
 ]
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
/* CÁCH KIỂM TRA: Menu đổi đúng route; đổi ngôn ngữ đổi tiêu đề; ở màn nhỏ không tràn ngang trang. */
