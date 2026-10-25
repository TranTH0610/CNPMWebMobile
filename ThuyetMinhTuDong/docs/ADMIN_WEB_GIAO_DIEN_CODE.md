# Toàn bộ code giao diện Admin web

Các đường dẫn dưới đây tính từ gốc monorepo. Code có chú thích tiếng Việt tại từng file và các khối giao diện.

## 1. TẠO MỚI — apps/web/src/components/admin/AdminIcon.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\admin\AdminIcon.tsx

Icon SVG riêng cho Admin, không thêm dependency.

```tsx
/**
 * FILE NÀY LÀM GÌ: Bộ icon SVG cho quản lý, dùng bởi layout và các trang Admin.
 * Không thêm thư viện; icon trang trí được ẩn với trình đọc màn hình.
 * Liên quan UC12–UC17; nhãn chức năng nằm ở nút/liên kết gọi icon.
 */
export type AdminIconName = 'dashboard' | 'places' | 'review' | 'users' | 'qr' | 'plus' | 'arrow' | 'search' | 'close' | 'edit' | 'content' | 'pin' | 'image' | 'save'
// CHỨC NĂNG: Vẽ icon bằng một hệ nét và kích thước thống nhất.
// XỬ LÝ: SVG dùng currentColor để tự đổi theo nút đang chọn hoặc nền xanh.
export function AdminIcon({name}: {name: AdminIconName}) {
 const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  places: <><path d="m3 9 9-6 9 6M4 21h16M6 10v7m6-7v7m6-7v7M3 18h18"/></>,
  review: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-17a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3"/></>,
  qr: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h3v3h3v3h-6m6-6v-3M3 12h9V3"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  arrow: <path d="m9 5 7 7-7 7M4 12h12"/>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  edit: <><path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4"/></>,
  content: <><path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 5-5 4 4 4-6 5 7"/></>,
  save: <><path d="M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-7h10v7"/></>,
 }
 return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
/* CÁCH KIỂM TRA: Icon trên menu/nút cùng hệ nét; tên chức năng vẫn đọc được khi ẩn SVG. */
```

## 2. SỬA — apps/web/src/layouts/AdminLayout.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\layouts\AdminLayout.tsx

Menu, tiêu đề theo route, danh tính và vùng trang con.

```tsx
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
```

## 3. SỬA — apps/web/src/pages/admin/DashboardPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\DashboardPage.tsx

Banner, bốn chỉ số và các liên kết quản lý nhanh.

```tsx
/**
 * FILE NÀY LÀM GÌ: Tổng quan Admin web, bốn chỉ số và lối vào nghiệp vụ nhanh.
 * AdminRoutes gọi tại /admin; phụ thuộc admin-core, presence RAM và UI Admin.
 * UC12, UC17. Giữ số phiên thực từ API; không tạo số liệu minh họa khi mất kết nối.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import { presenceClient } from '../../services/presence'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, useConfirmation } from '../../components/admin/AdminUI'
import { AdminIcon, type AdminIconName } from '../../components/admin/AdminIcon'
export function DashboardPage() {
 const state = useAdmin(), t = useAdminText(), confirmation = useConfirmation()
 const presence = usePresenceStatistics(presenceClient)
 // CHỨC NĂNG: Tính lại thống kê nội dung khi kho thay đổi, tách số phiên lấy từ RAM.
 // XỬ LÝ: Chưa có phản hồi presence thì hiển thị —; không đánh đồng lỗi với 0 phiên.
 const metrics = useMemo(() => state.data ? dashboard(state.data) : null, [state.data])
 const tiles: {key:'active'|'gateToday'|'places'|'pending'; icon:AdminIconName}[] = [
  {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'places'},{key:'pending',icon:'review'},
 ]
 return <>
  <section className="admin-hero"><div><span className="admin-eyebrow">HUEGUIDE</span><h1>{t('dashboard')}</h1><p>{t('overviewHint')}</p></div><Link className="button admin-hero-button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link><div className="admin-hero-decoration" aria-hidden="true"><AdminIcon name="places"/></div></section>
  <Feedback state={state}/>
  {metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article className={'admin-metric metric-'+index} key={key}><div className="admin-metric-top"><span>{t(key === 'pending' ? 'status_submitted' : key)}</span><span className="admin-metric-icon"><AdminIcon name={icon}/></span></div><strong>{key === 'active' ? presence.stats?.active ?? '—' : metrics[key]}</strong><div className="admin-metric-line"/></article>)}</div>}
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
  <section className="admin-card admin-reset"><div><h2>{t('reset')}</h2><p>{t('resetHint')}</p></div><button className="secondary" disabled={state.busy} onClick={() => { confirmation.ask(t('confirmReset'), () => { void state.run(() => state.service.reset()) }) }}>{t('reset')}</button></section>
  {confirmation.dialog}
 </>
}
/* CÁCH KIỂM TRA: Bốn chỉ số đúng; liên kết mở đúng màn; reset vẫn hỏi xác nhận; tắt RAM hiện lỗi. */
```

## 4. SỬA — apps/web/src/pages/admin/PlacesPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\PlacesPage.tsx

Thẻ ảnh di tích, tìm kiếm không dấu và mở đúng biểu mẫu.

```tsx
/**
 * FILE NÀY LÀM GÌ: Danh sách di tích quản lý có tìm kiếm, ảnh và nhãn trạng thái.
 * AdminRoutes gọi tại /admin/places; dùng service qua useAdmin, PlaceImage và normalize.
 * UC13. Thẻ ảnh gọn trên desktop, tự về một cột trên điện thoại.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { PlaceImage } from '../../components/PlaceImage'
import { Feedback, Status } from '../../components/admin/AdminUI'
import { AdminIcon } from '../../components/admin/AdminIcon'
export function AdminPlacesPage() {
 const state = useAdmin(), t = useAdminText(), [query,setQuery] = useState('')
 // CHỨC NĂNG: Chờ gõ xong rồi tìm không dấu; chỉ lọc lại khi dữ liệu/từ khóa đổi.
 // XỬ LÝ: Không ẩn di tích đã lưu trữ để người quản lý còn xem và xử lý được.
 const search = useDebounce(query)
 const places = useMemo(() => state.data?.places.filter(p => normalize(p.record.canonicalTitle).includes(normalize(search))) ?? [], [state.data,search])
 return <><div className="admin-page-title"><div><h1>{t('places')}</h1><p>{t('catalogHint')}</p></div><Link className="button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link></div>
  <Feedback state={state}/>
  <div className="admin-list-toolbar"><div className="admin-search-wrap"><AdminIcon name="search"/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search')} aria-label={t('search')}/>{query&&<button type="button" className="secondary admin-clear-search" aria-label={t('clearSearch')} onClick={()=>setQuery('')}><AdminIcon name="close"/></button>}</div><span className="admin-result-count" role="status">{places.length} {t('places')}</span></div>
  <div className="admin-place-grid">{places.map(place => <article className="admin-place-card" key={place.id}>
   <div className="admin-place-cover"><PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle}/><Status value={place.workflow}/></div>
   <div className="admin-place-info"><span className="admin-revision">{t('revision')}: {place.revision}</span><h2>{place.record.canonicalTitle}</h2>{place.period&&<p>{place.period}</p>}
    <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/edit'}><AdminIcon name="edit"/>{t('edit')}</Link><Link className="button" to={'/admin/places/' + place.id + '/content'}><AdminIcon name="content"/>{t('content')}</Link></div>
   </div></article>)}</div>
  {!state.loading&&!state.error&&!places.length&&<div className="admin-card admin-empty"><AdminIcon name="search"/><h2>{t('empty')}</h2>{query&&<button className="secondary" onClick={()=>setQuery('')}>{t('clearSearch')}</button>}</div>}
 </>
}
/* CÁCH KIỂM TRA: Gõ ky dai; xóa từ khóa; tìm rỗng; các nút mở đúng id và trạng thái vẫn đủ nhãn. */
```

## 5. SỬA — apps/web/src/pages/admin/PlaceFormPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\PlaceFormPage.tsx

Nhóm thông tin, tọa độ, ảnh xem trước và thao tác lưu/xóa.

```tsx
/** FILE NÀY LÀM GÌ: Tạo/sửa metadata di tích, ảnh và tọa độ xác nhận.
 * /admin/places/new hoặc /:id/edit; UC13. Validation/service ở admin-core.
 * Ảnh dùng URL/mã asset trong bản FE; API upload sẽ được nối qua media service. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { PlaceImage } from '../../components/PlaceImage'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES, categoryOf } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../i18n'
import { Feedback, Field, useUnsaved, useConfirmation } from '../../components/admin/AdminUI'
export function PlaceFormPage() {
 const state = useAdmin(), { id } = useParams(), t = useAdminText()
 const place = state.data?.places.find(p => p.id === id)
 if (state.loading) return <Feedback state={state} />
 if (id && !place) return <p>{t('error_notFound')}</p>
 return <PlaceForm key={id ?? 'new'} initial={place} />
}
function PlaceForm({ initial }: { initial?: ManagedPlace }) {
 const state = useAdmin(), t = useAdminText(), visitorText = useText(), navigate = useNavigate(), confirmation = useConfirmation()
 const [title,setTitle] = useState(initial?.record.canonicalTitle ?? '')
 const [category,setCategory] = useState<Category>(initial ? categoryOf(initial.record) : 'palace')
 const [period,setPeriod] = useState(initial?.period ?? '')
 const [lat,setLat] = useState(initial?.record.position?.lat.toString() ?? '')
 const [lng,setLng] = useState(initial?.record.position?.lng.toString() ?? '')
 const [verified,setVerified] = useState(initial?.record.position?.verified ?? false)
 const [images,setImages] = useState(initial?.record.images.join('\n') ?? '')
 const [dirty,setDirty] = useState(false); useUnsaved(dirty)
 return <><div className="admin-page-title"><div><h1>{t(initial ? 'edit' : 'new')}</h1><p>{t('catalogHint')}</p></div></div><Feedback state={state} />
  <form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
   event.preventDefault()
   void state.run(() => state.service.savePlace({ id: initial?.id, expectedRevision: initial?.revision, title, category, period, lat, lng, verified,
    images: images.split('\n').map(s => s.trim()).filter(Boolean) })).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
  }}>
   {/* CHỨC NĂNG: Nhóm tên, danh mục và thời kỳ để nhập theo từng bước. */}
   <section className="admin-form-section"><h2><AdminIcon name="places"/>{t('basicInfo')}</h2>
   <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
   <Field label={t('category')}><select value={category} onChange={e => setCategory(e.target.value as Category)}>{CATEGORIES.map(c => <option key={c} value={c}>{visitorText(`category_${c}`)}</option>)}</select></Field>
   <Field label={t('period')}><input value={period} onChange={e => setPeriod(e.target.value)} /></Field>
   </section>
   <section className="admin-form-section"><h2><AdminIcon name="pin"/>{t('locationSection')}</h2>
   <div className="admin-two"><Field label={t('lat')}><input inputMode="decimal" value={lat} onChange={e => setLat(e.target.value)} /></Field><Field label={t('lng')}><input inputMode="decimal" value={lng} onChange={e => setLng(e.target.value)} /></Field></div>
   <label className="admin-check"><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />{t('verified')}</label>
   </section>
   {/* CHỨC NĂNG: Xem trước ảnh đầu tiên; PlaceImage vẫn xử lý ảnh lỗi. */}
   <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
   {images.split('\n').find(s=>s.trim())&&<div className="admin-image-preview"><PlaceImage uri={images.split('\n').find(s=>s.trim())?.trim()} title={title}/></div>}
   <Field label={t('images')}><textarea rows={4} value={images.split('\n').filter(s => !s.startsWith('data:')).join('\n')} onChange={e => setImages([...images.split('\n').filter(s => s.startsWith('data:')), e.target.value].filter(Boolean).join('\n'))} /></Field>
   <LocalMediaPicker kind="image" onPick={value => { setImages(old => [old,value].filter(Boolean).join('\n')); setDirty(true) }} />
   {images.includes('data:') && <button type="button" className="secondary" onClick={() => {setImages(images.split('\n').filter(s => !s.startsWith('data:')).join('\n'));setDirty(true)}}>{t('clearFile')}</button>}
   </section>
   <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
   <div className="admin-actions"><button disabled={state.busy || initial?.workflow === 'archived'}>{state.busy ? t('loading') : t('save')}</button>
    <button type="button" className="secondary" onClick={() => { if (!dirty || window.confirm(t('unsaved'))) navigate('/admin/places') }}>{t('cancel')}</button>
    {initial && initial.workflow !== 'archived' && <button type="button" className="secondary" disabled={state.busy} onClick={() => {
     if (window.confirm(t('confirmArchive'))) void state.run(() => state.service.archive(initial.id, initial.revision)).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
    }}>{t('archive')}</button>}
    {/* CHỨC NĂNG: Nút xóa riêng, không gửi form và không tự thực hiện khi mở màn.
        XỬ LÝ: Cần xác nhận đúng tên điểm; chỉ quay về danh sách sau khi ghi thành công. */}
    {initial && <button type="button" className="admin-delete" disabled={state.busy} onClick={() => {
      confirmation.ask(t('confirmDelete') + '\n' + initial.record.canonicalTitle, () => {
        void state.run(() => state.service.deletePlace(initial.id, initial.revision)).then(ok => {
          if (ok) { setDirty(false); navigate('/admin/places') }
        })
      })
    }}>{t('delete')}</button>}
   </div></section>
  </form>
  {confirmation.dialog}
 </>
}
/* CÁCH KIỂM TRA: Không lưu tọa độ ngoài Huế/URL nguy hiểm; sửa metadata không đổi bản public. */
```

## 6. SỬA — apps/web/src/pages/admin/ContentEditorPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ContentEditorPage.tsx

Biên tập đa ngôn ngữ theo nhóm nội dung, audio và quy trình.

```tsx
/** FILE NÀY LÀM GÌ: Biên tập năm ngôn ngữ, bản thu URL, dịch/TTS demo và gửi duyệt.
 * /admin/places/:id/content; UC14/14.1/14.2. Không gửi API key hoặc gọi dịch thật.
 * Mỗi bản form giữ expectedRevision; service chặn kết quả dịch cũ ghi đè bản mới. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Field, Status, useUnsaved } from '../../components/admin/AdminUI'
export const audioSource = (url: string) => url.startsWith('demo:') ? '/demo-audio/' + url.slice(5) + '.mp3' : url
export function ContentEditorPage() {
 const state = useAdmin(), t = useAdminText(), { id } = useParams()
 const [language,setLanguage] = useState<Language>('vi'), [dirty,setDirty] = useState(false)
 const place = state.data?.places.find(p => p.id === id)
 if (state.loading || !place) return <><Feedback state={state} />{!state.loading && <p>{t('error_notFound')}</p>}</>
 return <><div className="admin-page-title"><div><h1>{place.record.canonicalTitle}</h1><p>{t('editorHint')} · {t('revision')}: {place.revision}</p></div><Status value={place.workflow} /></div>
  <p className="admin-demo">{t('mockMedia')}</p>
  <div className="admin-language-tabs">{LANGUAGES.map(l => <button key={l.code} className={language === l.code ? '' : 'secondary'} aria-pressed={language === l.code} onClick={() => { if(!dirty || window.confirm(t('unsaved'))) { setDirty(false); setLanguage(l.code) } }}>{l.label}</button>)}</div>
  <ContentForm key={place.id + language + place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty} />
 </>
}
function ContentForm({ place, language, dirty, setDirty }: { place: ManagedPlace; language: Language; dirty: boolean; setDirty: (value: boolean) => void }) {
 const state = useAdmin(), t = useAdminText(), text = place.record.content[language]
 const [title,setTitle] = useState(text?.title ?? ''), [summary,setSummary] = useState(text?.summary ?? '')
 const [body,setBody] = useState(text?.body ?? ''), [address,setAddress] = useState(text?.address ?? '')
 const [audioUrl,setAudioUrl] = useState(text?.audio?.url.startsWith('demo:') ? '' : text?.audio?.url ?? '')
 useUnsaved(dirty)
 const disabled = state.busy || place.workflow === 'archived'
 return <><Feedback state={state} /><form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
  event.preventDefault(); void state.run(() => state.service.saveContent({ id: place.id, language, expectedRevision: place.revision, title, summary, body, address, audioUrl: audioUrl.trim() || undefined })).then(ok => { if(ok) setDirty(false) })
 }}>
  {/* CHỨC NĂNG: Tách nội dung và âm thanh để người biên tập không bỏ sót bước lưu. */}
  <section className="admin-form-section"><h2><AdminIcon name="content"/>{t('basicInfo')}</h2>
  <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
  <Field label={t('summary')}><textarea value={summary} rows={2} onChange={e => setSummary(e.target.value)} /></Field>
  <Field label={t('address')}><input value={address} onChange={e => setAddress(e.target.value)} /></Field>
  <Field label={t('body')}><textarea value={body} required rows={10} onChange={e => setBody(e.target.value)} /></Field>
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
  <Field label={t('audio')}><input value={audioUrl.startsWith('data:') ? t('localFile') : audioUrl} readOnly={audioUrl.startsWith('data:')} onChange={e => setAudioUrl(e.target.value)} placeholder="https://…/audio.mp3" /></Field>
  <LocalMediaPicker kind="audio" onPick={value => { setAudioUrl(value);setDirty(true) }} />
  {audioUrl.startsWith('data:') && <button type="button" className="secondary" onClick={()=>{setAudioUrl('');setDirty(true)}}>{t('clearFile')}</button>}
  {text?.audio && <div className="admin-audio"><span>{t('preview')}</span><audio controls preload="metadata" src={audioSource(text.audio.url)} /></div>}
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
  <div className="admin-actions"><button disabled={disabled}>{t('save')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || language === 'vi'} onClick={() => { void state.run(() => state.service.translate(place.id, language, place.revision)) }}>{t('translate')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !text?.body} onClick={() => { void state.run(() => state.service.generateAudio(place.id, language, place.revision)) }}>{t('prepare')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !['draft','changes'].includes(place.workflow)} onClick={() => { void state.run(() => state.service.submit(place.id, place.revision)) }}>{t('submit')}</button>
  </div>
  {place.reviewNote && <p className="admin-note">{t('note')}: {place.reviewNote}</p>}
 </section></form></>
}
/* CÁCH KIỂM TRA: Lưu trước khi dịch/tạo audio; đổi tab khi bẩn có hỏi; sửa body xóa audio cũ. */
```

## 7. SỬA — apps/web/src/pages/admin/ReviewsPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ReviewsPage.tsx

Nhận diện di tích, so sánh bản ngôn ngữ, duyệt và công bố.

```tsx
/** FILE NÀY LÀM GÌ: So sánh văn bản/audio, yêu cầu sửa, duyệt và công bố đúng bản.
 * /admin/reviews; UC15–UC16. Backend tương lai phải kiểm tra lại mọi điều kiện.
 * Chỉ service đổi public; UI không tự gán status=published hoặc ngày duyệt. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { PlaceImage } from '../../components/PlaceImage'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Status, Field, useConfirmation } from '../../components/admin/AdminUI'
import { audioSource } from './ContentEditorPage'
export function ReviewsPage() {
 const state = useAdmin(), t = useAdminText()
 const places = state.data?.places.filter(p => ['submitted','approved','changes'].includes(p.workflow)) ?? []
 return <><div className="admin-page-title"><div><h1>{t('reviews')}</h1><p>{t('reviewQueueHint')}</p></div><span className="admin-pill">{places.length} {t('reviews')}</span></div><Feedback state={state} />
  {!state.loading && !places.length && <div className="admin-card admin-empty"><AdminIcon name="review"/><h2>{t('empty')}</h2></div>}
  {places.map(place => <ReviewCard key={place.id + place.revision + place.workflow} place={place} />)}
 </>
}
function ReviewCard({ place }: { place: ManagedPlace }) {
 const state = useAdmin(), t = useAdminText(), [note,setNote] = useState(''), confirmation = useConfirmation()
 return <article className="admin-card admin-review">{/* CHỨC NĂNG: Nhận diện đúng di tích trước khi đọc, duyệt hoặc công bố. */}<div className="admin-review-identity"><PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle}/><div><h2>{place.record.canonicalTitle}</h2><Status value={place.workflow}/></div></div>
  <p className="admin-review-meta">{t('revision')}: {place.revision} · {t('current')}: {place.published?.content.vi?.version ?? t('none')}</p>
  <div className="admin-review-grid">{LANGUAGES.map(l => { const text = place.record.content[l.code]; return text ? <section key={l.code}><h3>{l.label} · {text.title}</h3><p className="admin-body">{text.body}</p>{text.audio && <audio controls preload="none" src={audioSource(text.audio.url)} onPlay={event => {
   // CHỨC NĂNG: Chỉ nghe một bản review mỗi lúc để không chồng tiếng.
   document.querySelectorAll('audio').forEach(audio => { if(audio !== event.currentTarget) audio.pause() })
  }} />}</section> : null })}</div>
  <Field label={t('note')}><textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></Field>
  {place.reviewNote && <p>{place.reviewNote}</p>}
  <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/content'}>{t('content')}</Link>
   {place.workflow === 'submitted' && <><button disabled={state.busy} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, true, note)) }}>{t('approve')}</button><button className="secondary" disabled={state.busy || !note.trim()} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, false, note)) }}>{t('reject')}</button></>}
   {place.workflow === 'approved' && <button disabled={state.busy} onClick={() => { confirmation.ask(t('confirmPublish'), () => { void state.run(() => state.service.publish(place.id, place.revision)) }) }}>{t('publish')}</button>}
  </div>
 {confirmation.dialog}</article>
}
/* CÁCH KIỂM TRA: Reject thiếu ghi chú bị khóa; approve không tự public; publish cần xác nhận. */
```

## 8. SỬA — apps/web/src/styles/admin.css

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\styles\admin.css

Toàn bộ kiểu hiển thị Admin và breakpoint desktop/tablet/mobile.

```css
/*
 * FILE NÀY LÀM GÌ: Giao diện Admin web xanh–trắng cùng Admin mobile.
 * AdminLayout nạp; các lớp admin-* chỉ tác động vùng quản lý, UC12–UC17.
 * CHỨC NĂNG: Khung điều hướng, dashboard, thẻ di tích, form và kiểm duyệt.
 * XỬ LÝ: Dùng token màu chung, minmax tránh tràn, breakpoint cho tablet/điện thoại.
 */
.admin-shell{min-height:100vh;display:grid;grid-template-columns:248px minmax(0,1fr);background:var(--page);color:var(--text)}
.admin-shell button,.admin-shell .button{min-height:44px}.admin-shell button:hover:not(:disabled),.admin-shell .button:hover{box-shadow:0 4px 12px #12335a12}.admin-shell button:disabled{cursor:not-allowed}
.admin-shell :is(a,button,input,select,textarea):focus-visible{outline:3px solid var(--primary);outline-offset:3px}
/* CHỨC NĂNG: Menu cố định trên desktop; icon và vạch xanh nhận diện trang hiện tại. */
.admin-sidebar{background:var(--background);border-right:1px solid var(--border);padding:30px 18px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:44px}
.admin-brand{display:flex;gap:12px;align-items:center;color:var(--text);padding:0 10px}.admin-brand-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;color:white;background:var(--primary);box-shadow:0 7px 16px #1768e52b}.admin-brand-icon svg{width:27px;height:27px}.admin-brand strong{font-size:23px;letter-spacing:-.6px}.admin-brand small{display:block;font-size:11px;letter-spacing:.3px;color:var(--muted);font-weight:500;margin-top:1px}
.admin-sidebar nav{display:grid;gap:9px}.admin-sidebar nav a{position:relative;display:flex;align-items:center;gap:13px;border-radius:13px;padding:14px 15px;color:var(--muted);font-weight:600;min-height:50px}.admin-sidebar nav a:hover{background:var(--page);color:var(--text)}.admin-sidebar nav a.active{color:var(--primary);background:var(--soft)}.admin-sidebar nav a.active:before{content:"";width:3px;position:absolute;left:0;top:15px;bottom:15px;background:var(--primary);border-radius:3px}.admin-nav-arrow{display:none;margin-left:auto}.admin-sidebar nav a.active .admin-nav-arrow{display:flex}.admin-nav-arrow svg{width:16px}.admin-sidebar-note{margin-top:auto;border:1px solid var(--border);border-radius:16px;background:var(--page);padding:18px;display:grid;gap:10px}.admin-sidebar-note>svg{color:var(--primary);width:27px;height:27px}.admin-sidebar-note strong{font-size:13px}.admin-sidebar-note p{font-size:12px;line-height:1.7;color:var(--muted)}
.admin-main{min-width:0}.admin-topbar{background:var(--background);display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 36px;border-bottom:1px solid var(--border)}.admin-topbar strong,.admin-topbar small{display:block}.admin-topbar>div>small{font-size:10px;letter-spacing:1px;color:var(--muted);margin-bottom:3px}.admin-topbar>div>strong{font-size:19px}.admin-topbar-tools{display:flex;gap:24px;align-items:center}.admin-identity{display:flex;gap:10px;align-items:center;border-left:1px solid var(--border);padding-left:22px}.admin-identity>span{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--primary);font-size:12px;font-weight:700}.admin-identity strong{font-size:13px}.admin-identity small{font-size:11px;color:var(--muted)}
.admin-workspace{padding:30px 36px 32px;max-width:1580px;margin:auto}.admin-demo{background:var(--soft);color:var(--muted);padding:14px 18px;border:1px solid var(--border);border-radius:12px;font-size:12px;line-height:1.7;margin-bottom:20px}.admin-footnote{margin:28px 0 0;background:transparent;border-style:dashed;font-size:11px}
/* CHỨC NĂNG: Banner và đúng bốn chỉ số; không thêm biểu đồ hoặc số liệu giả. */
.admin-hero{position:relative;overflow:hidden;border-radius:22px;padding:30px 32px;margin-bottom:24px;background:linear-gradient(120deg,#102950,#194174);color:white;display:flex;gap:24px;align-items:center;justify-content:space-between}.admin-hero>div:first-child,.admin-hero-button{position:relative;z-index:1}.admin-eyebrow{font-size:10px;letter-spacing:3px;color:#a8c7ed;font-weight:600}.admin-hero h1{font-size:30px;margin:8px 0;letter-spacing:-.6px;line-height:1.3}.admin-hero p{color:#cee0f7;font-size:13px}.admin-hero-button{background:white;color:var(--primary);border:0;flex-shrink:0}.admin-hero-decoration{position:absolute;right:10%;top:-28px;width:240px;height:240px;border:1px solid #ffffff12;border-radius:50%;display:grid;place-items:center;transform:rotate(-12deg);pointer-events:none}.admin-hero-decoration svg{height:150px;width:150px;opacity:.055}
.admin-page-title{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:24px}.admin-page-title h1{font-size:27px;line-height:1.4;margin:0;letter-spacing:-.5px}.admin-page-title h2{margin:0;font-size:21px}.admin-page-title p{color:var(--muted);margin:5px 0 0;font-size:13px}.admin-pill{padding:7px 12px;border-radius:30px;background:var(--background);border:1px solid var(--border);font-size:12px;color:var(--primary)}
.admin-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-bottom:24px}.admin-metric{background:var(--background);border:1px solid var(--border);border-radius:18px;padding:20px 22px;box-shadow:0 5px 18px #10295004}.admin-metric-top{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:13px}.admin-metric-icon{width:36px;height:36px;border-radius:11px;background:var(--soft);color:var(--primary);display:grid;place-items:center;flex-shrink:0}.admin-metric strong{display:block;font-size:36px;margin:10px 0 16px;line-height:1.2;letter-spacing:-1px}.admin-metric-line{height:4px;width:44px;border-radius:6px;background:var(--soft)}.admin-metric.metric-0{background:linear-gradient(130deg,var(--primary),#1351b4);color:white;border:0}.metric-0 .admin-metric-top{color:#e9f2ff}.metric-0 .admin-metric-icon{background:#ffffff24;color:white}.metric-0 .admin-metric-line{background:#ffffff66}
.admin-card{padding:24px;background:var(--background);border:1px solid var(--border);border-radius:18px;margin-bottom:20px;min-width:0}.admin-card h2{margin:0 0 12px;font-size:18px}.admin-card p{color:var(--muted);line-height:1.8}.admin-section-heading{display:flex;align-items:center;gap:12px;margin-bottom:20px}.admin-section-heading h2{margin:0;font-size:17px}.admin-icon-box{height:42px;width:42px;border-radius:12px;display:grid;place-items:center;color:var(--primary);background:var(--soft);flex-shrink:0}.admin-dashboard-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:22px}.admin-quick-actions{display:grid;gap:12px}.admin-quick-action{display:flex;gap:14px;align-items:center;border:1px solid var(--border);border-radius:14px;padding:16px;color:var(--text);transition:background .15s,border-color .15s}.admin-quick-action:hover{background:var(--page);border-color:var(--primary)}.admin-quick-action>div{flex:1;min-width:0}.admin-quick-action strong{font-size:14px}.admin-quick-action p{font-size:12px;margin-top:3px;line-height:1.6}.admin-quick-action>svg{color:var(--muted);flex-shrink:0;width:18px}.admin-presence-card>p{font-size:13px}.admin-reset{display:flex;align-items:center;justify-content:space-between;gap:20px;background:transparent;border-style:dashed}.admin-reset h2{font-size:14px;margin-bottom:3px}.admin-reset p{margin:0;font-size:12px}.admin-reset button{flex-shrink:0}
/* CHỨC NĂNG: Thanh tìm kiếm và thẻ di tích có nhãn trạng thái, không thay logic tìm kiếm. */
.admin-list-toolbar{display:flex;gap:20px;align-items:center;justify-content:space-between;margin-bottom:24px}.admin-search-wrap{display:flex;gap:12px;align-items:center;border:1px solid var(--border);background:var(--background);padding:4px 12px;border-radius:13px;width:min(100%,480px);color:var(--muted)}.admin-search-wrap:focus-within{border-color:var(--primary);box-shadow:0 0 0 3px #1768e510}.admin-search-wrap input{border:0;background:transparent;flex:1;width:0;min-width:0;padding:10px 0;outline:0;min-height:42px}.admin-search-wrap input:focus-visible{outline:0}.admin-search-wrap input::-webkit-search-cancel-button{display:none}.admin-clear-search{border:0!important;min-width:36px!important;min-height:36px!important;padding:6px!important;background:var(--page)!important}.admin-clear-search svg{width:17px;height:17px}.admin-result-count{font-size:12px;color:var(--muted);white-space:nowrap}
.admin-place-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.admin-place-card{border:1px solid var(--border);border-radius:18px;background:var(--background);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .15s,transform .15s}.admin-place-card:hover{box-shadow:0 12px 24px #1029500b;transform:translateY(-2px)}.admin-place-cover{position:relative;height:180px;overflow:hidden;background:var(--soft)}.admin-place-cover>.place-image{width:100%;height:100%;object-fit:cover}.admin-place-cover>.admin-badge{position:absolute;top:12px;left:12px;box-shadow:0 2px 10px #10295012;border:1px solid #ffffff99}.admin-place-info{padding:20px;display:flex;flex-direction:column;flex:1;min-width:0}.admin-place-card h2{font-size:18px;margin:5px 0 8px;line-height:1.4;overflow-wrap:anywhere}.admin-place-card p{font-size:12px;color:var(--muted)}.admin-revision{font-size:11px;color:var(--muted)}.admin-place-info .admin-actions{margin-top:auto;padding-top:18px;flex-wrap:nowrap}.admin-place-info .button{flex:1;font-size:12px;padding:9px 8px;min-width:0}.admin-place-info .button svg{width:17px;flex-shrink:0}
.admin-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;border-radius:20px;padding:6px 11px;background:#edf2f8;color:#52627c;max-width:100%;overflow-wrap:anywhere}.admin-badge:before{content:"";width:5px;height:5px;flex-shrink:0;border-radius:50%;background:currentColor}.admin-badge.state-published{background:#e6f7ed;color:#187044}.admin-badge.state-approved{background:#e8f1ff;color:#1658b0}.admin-badge.state-submitted{background:#fff4da;color:#865f00}.admin-badge.state-changes{background:#fff0ed;color:#a63e25}.admin-badge.state-archived{background:#edf0f5;color:#6d7180}.admin-empty{display:grid;justify-items:center;gap:14px;text-align:center;padding:48px 20px}.admin-empty>svg{width:38px;height:38px;color:var(--primary)}.admin-empty h2{margin:0}
/* CHỨC NĂNG: Chia form thành nhóm có tiêu đề, vùng nhập có focus và hàng hành động riêng. */
.admin-form{max-width:1040px}.admin-form.admin-card{padding:0;overflow:visible}.admin-form-section{padding:26px 28px;border-bottom:1px solid var(--border)}.admin-form-section:last-child{border-bottom:0}.admin-form-section>h2{font-size:16px;display:flex;gap:10px;align-items:center;margin-bottom:24px}.admin-form-section>h2 svg{color:var(--primary);width:20px}.admin-field{display:grid;gap:8px;min-width:0;margin-bottom:20px}.admin-field>span{font-size:12px;font-weight:600}.admin-field input,.admin-field textarea,.admin-field select{padding:12px 14px;width:100%;border:1px solid var(--border);border-radius:11px;background:var(--background);color:var(--text);font:inherit;min-height:46px;transition:border-color .15s,box-shadow .15s}.admin-field input:focus,.admin-field textarea:focus,.admin-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px #1768e50c}.admin-field textarea{resize:vertical;line-height:1.8}.admin-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px}.admin-check{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--page);border-radius:11px;font-size:13px;line-height:1.6}.admin-image-preview{height:220px;margin-bottom:20px;border-radius:13px;overflow:hidden;background:var(--soft)}.admin-image-preview>.place-image{width:100%;height:100%;object-fit:cover}.admin-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:16px}.admin-form-section>.admin-actions:first-child{margin-top:0}.admin-actions .admin-delete{margin-left:auto;background:transparent;border-color:#e9b9b5;color:var(--danger)}.admin-actions .admin-delete:hover{background:#fff1ef}
.admin-language-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:6px;background:var(--background);border:1px solid var(--border);border-radius:14px;margin-bottom:24px;width:fit-content;max-width:100%}.admin-language-tabs button{border:0;font-size:13px;padding:9px 18px;border-radius:9px}.admin-language-tabs .secondary{background:transparent;color:var(--muted)}.admin-language-tabs .secondary:hover{background:var(--page)}.admin-audio{display:grid;gap:12px;padding:18px;background:var(--page);border:1px solid var(--border);border-radius:13px;margin:18px 0}.admin-audio>span{font-size:12px;font-weight:600}.admin-audio audio,.admin-review audio{width:100%;max-width:100%}.admin-local-file{margin:14px 0}.admin-local-file input{max-width:100%;font-size:12px}.admin-local-file label{gap:12px;flex-wrap:wrap}.admin-local-file p{font-size:12px;color:var(--muted)}.admin-note{padding:14px;border-left:3px solid var(--primary);background:var(--soft);font-size:13px;margin-top:20px}
.admin-review{padding:26px}.admin-review-identity{display:flex;align-items:center;gap:16px}.admin-review-identity>.place-image{width:76px;height:76px;object-fit:cover;border-radius:13px;flex-shrink:0}.admin-review-identity h2{margin:0 0 8px}.admin-review-meta{font-size:12px;color:var(--muted);margin:16px 0}.admin-review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:20px 0 26px}.admin-review-grid section{padding:20px;border:1px solid var(--border);border-radius:14px;background:var(--page);min-width:0}.admin-review-grid h3{margin:0;font-size:14px;line-height:1.6}.admin-body{white-space:pre-wrap;overflow-wrap:anywhere;max-height:260px;overflow:auto;font-size:13px;margin:12px 0 16px;padding-right:6px}.admin-review .admin-actions{padding-top:18px;border-top:1px solid var(--border)}
.admin-error{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid #f0bdb5;background:#fff1ef;padding:14px 18px;border-radius:12px;color:var(--danger);margin-bottom:20px;font-size:13px}.admin-success{background:var(--soft);color:var(--primary);border:1px solid var(--border);padding:13px 18px;border-radius:12px;margin-bottom:20px;font-size:13px}.admin-modal-backdrop{position:fixed;inset:0;z-index:3000;background:#10295080;display:grid;place-items:center;padding:20px}.admin-confirm{width:min(100%,460px);background:var(--background);padding:28px;border-radius:20px;box-shadow:0 25px 80px #10295044}.admin-confirm h2{margin:0 0 12px}.admin-confirm p{line-height:1.7;white-space:pre-line}.admin-confirm .admin-actions{justify-content:flex-end}
/* CHỨC NĂNG: Tablet giảm cột; điện thoại thu menu và không làm co nhỏ vùng bấm. */
@media(max-width:1200px){.admin-shell{grid-template-columns:215px minmax(0,1fr)}.admin-workspace{padding:26px}.admin-topbar{padding:18px 26px}.admin-place-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-metric{padding:18px}.admin-metric-top{font-size:12px}}
@media(max-width:1000px){.admin-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-dashboard-grid{grid-template-columns:minmax(0,1fr);gap:0}.admin-identity{display:none}.admin-review-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:760px){.admin-shell{display:block}.admin-sidebar{position:static;width:100%;height:auto;padding:18px 16px 12px;gap:20px;border-right:0;border-bottom:1px solid var(--border)}.admin-brand{padding:0}.admin-brand strong{font-size:21px}.admin-brand-icon{width:38px;height:38px;border-radius:12px}.admin-sidebar nav{display:flex;overflow-x:auto;gap:6px;padding-bottom:3px}.admin-sidebar nav a{white-space:nowrap;padding:10px 13px;gap:8px;min-height:44px;font-size:13px}.admin-sidebar nav a.active:before,.admin-nav-arrow,.admin-sidebar nav a.active .admin-nav-arrow,.admin-sidebar-note{display:none}.admin-topbar{padding:16px;gap:12px}.admin-topbar>div>small{font-size:9px}.admin-topbar>div>strong{font-size:16px}.admin-topbar-tools{min-width:0}.admin-topbar .language-picker select{max-width:155px;font-size:12px}.admin-workspace{padding:20px 16px}.admin-hero{padding:24px;align-items:flex-start;flex-direction:column;gap:20px;border-radius:18px}.admin-hero h1{font-size:27px}.admin-hero p{line-height:1.7}.admin-hero-button{font-size:13px}.admin-metrics{gap:12px}.admin-metric{padding:16px}.admin-metric strong{font-size:30px}.admin-metric-top{align-items:flex-start;flex-direction:column-reverse;gap:12px}.admin-metric-icon{width:32px;height:32px}.admin-page-title h1{font-size:24px}.admin-page-title>.button{font-size:12px}.admin-list-toolbar{gap:12px;align-items:stretch;flex-direction:column}.admin-search-wrap{width:100%}.admin-place-grid{grid-template-columns:minmax(0,1fr)}.admin-place-cover{height:195px}.admin-card{padding:20px}.admin-form-section{padding:22px 20px}.admin-form.admin-card{padding:0}.admin-two{grid-template-columns:minmax(0,1fr);gap:0}.admin-reset{align-items:flex-start;flex-direction:column}.admin-quick-action{padding:14px;gap:12px}.admin-quick-action .admin-icon-box{width:36px;height:36px}.admin-review{padding:20px}.admin-review-identity{align-items:flex-start;gap:12px}.admin-review-identity h2{font-size:17px}.admin-review-identity>.place-image{width:60px;height:64px}.admin-language-tabs{gap:4px;padding:5px}.admin-language-tabs button{padding:8px 11px;font-size:12px}.admin-actions .admin-delete{margin-left:0}.admin-actions>button{flex-grow:1}}
@media(prefers-reduced-motion:reduce){.admin-shell *{transition:none!important;scroll-behavior:auto!important}.admin-place-card:hover{transform:none}}
/* CÁCH KIỂM TRA: Thu cửa sổ về 390px, Tab qua nút/textarea, tăng cỡ chữ; form và thẻ không tràn ngang. */
```
