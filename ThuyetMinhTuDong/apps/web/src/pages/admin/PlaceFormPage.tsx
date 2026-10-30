/**
 * FILE NÀY LÀM GÌ
 * Biểu mẫu thêm/sửa di tích trên web; thu thập dữ liệu và gửi qua hợp đồng service quản trị.
 *
 * VỊ TRÍ: apps/web/src/pages/admin/PlaceFormPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx.
 * PHỤ THUỘC: ../../components/admin/AdminIcon; ../../components/PlaceImage;
 * ../../components/admin/LocalMediaPicker; react; react-router-dom; @travelguide/visitor-core;
 * @travelguide/admin-core; @travelguide/admin-core/react; ../../i18n;
 * ../../components/admin/AdminUI
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../../components/admin/AdminIcon'.
import { AdminIcon } from '../../components/admin/AdminIcon'
// Nhập các thành phần từ '../../components/PlaceImage'.
import { PlaceImage } from '../../components/PlaceImage'
// Nhập các thành phần từ '../../components/admin/LocalMediaPicker'.
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
// Nhập các thành phần từ 'react'.
import { useState } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { useNavigate, useParams } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { CATEGORIES, categoryOf } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../i18n'.
import { useText } from '../../i18n'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Feedback, Field, useUnsaved, useConfirmation } from '../../components/admin/AdminUI'
// CHỨC NĂNG: Biểu mẫu thêm/sửa di tích trên web; thu thập dữ liệu và gửi qua hợp đồng service quản
// trị.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo PlaceFormPage(). Component hàm nhận props và dựng phần giao diện PlaceFormPage.
export function PlaceFormPage() {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { id }: Gọi useParams().
 const state = useAdmin(), { id } = useParams(), t = useAdminText()
 // Khai báo place: state.data?.places.find lấy phần tử đầu tiên phù hợp.
 const place = state.data?.places.find(p => p.id === id)
 // Rẽ nhánh nếu state.loading. | Trả cây giao diện của component để React hiển thị. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 if (state.loading) return <Feedback state={state} />
 // Rẽ nhánh nếu id && !place. | Trả cây giao diện của component để React hiển thị.
 if (id && !place) return <p>{t('error_notFound')}</p>
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <PlaceForm key={id ?? 'new'} initial={place} />`: Trả cây giao diện của component để React hiển thị. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính initial: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <PlaceForm key={id ?? 'new'} initial={place} />
}
// TẠI SAO (PlaceFormPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
// CHỨC NĂNG: Giữ dữ liệu đang nhập và lưu thông tin di tích.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo PlaceForm({ initial }). Component hàm nhận props và dựng phần giao diện PlaceForm. | Khai báo initial không bắt buộc, kiểu ManagedPlace.
function PlaceForm({ initial }: { initial?: ManagedPlace }) {
 // Khai báo [opened]: useState(initial) giữ trạng thái qua các lần render.
 const [opened] = useState(initial)
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo visitorText: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo navigate: useNavigate() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện | Khai báo confirmation: Gọi useConfirmation().
 const state = useAdmin(), t = useAdminText(), visitorText = useText(), navigate = useNavigate(), confirmation = useConfirmation()
 // CHỨC NĂNG: Tên/tiêu đề đang được nhập trong form.
 // Khai báo [title,setTitle]: useState(opened?.record.canonicalTitle ?? '') giữ trạng thái qua các lần render.
 const [title,setTitle] = useState(opened?.record.canonicalTitle ?? '')
 // Khai báo [category,setCategory]: useState(opened ? categoryOf(opened.record) : 'palace') giữ trạng thái qua các lần render.
 const [category,setCategory] = useState<Category>(opened ? categoryOf(opened.record) : 'palace')
 // Khai báo [period,setPeriod]: useState(opened?.period ?? '') giữ trạng thái qua các lần render.
 const [period,setPeriod] = useState(opened?.period ?? '')
 // Khai báo [lat,setLat]: useState(opened?.record.position?.lat.toString() ?? '') giữ trạng thái qua các lần render.
 const [lat,setLat] = useState(opened?.record.position?.lat.toString() ?? '')
 // Khai báo [lng,setLng]: useState(opened?.record.position?.lng.toString() ?? '') giữ trạng thái qua các lần render.
 const [lng,setLng] = useState(opened?.record.position?.lng.toString() ?? '')
 // Khai báo [verified,setVerified]: useState(opened?.record.position?.verified ?? false) giữ trạng thái qua các lần render.
 const [verified,setVerified] = useState(opened?.record.position?.verified ?? false)
 // Khai báo [images,setImages]: useState(opened?.record.images.join('\n') ?? '') giữ trạng thái qua các lần render.
 const [images,setImages] = useState(opened?.record.images.join('\n') ?? '')
 // CHỨC NĂNG: Form có thay đổi chưa lưu; dùng để cảnh báo trước khi rời hoặc đổi ngôn ngữ.
 // Khai báo [dirty,setDirty]: useState(false) giữ trạng thái qua các lần render. | Thực hiện Gọi useUnsaved(dirty).
 const [dirty,setDirty] = useState(false); useUnsaved(dirty)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <><div className="admin-page-title"><div><h1>{t(opened ? 'edit' : 'new')}</h1>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={eve`: Dựng form. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính onSubmit: xử lý gửi form.
  * DÒNG `event.preventDefault()`: Chặn hành vi mặc định của sự kiện.
  * DÒNG `void state.run(() => state.service.savePlace({ id: opened?.id, expectedRevision: open`: Thực hiện sử dụng void state.run(() => state.service.savePlace({ id: opened?.id, expectedRevision: opened?.r làm giá trị của bước hiện tại. | Gán thuộc tính id: đọc opened?.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính expectedRevision: đọc opened?.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Đặt trường title bằng giá trị của biến cùng tên. | Đặt trường category bằng giá trị của biến cùng tên. | Đặt trường period bằng giá trị của biến cùng tên. | Đặt trường lat bằng giá trị của biến cùng tên. | Đặt trường lng bằng giá trị của biến cùng tên. | Đặt trường verified bằng giá trị của biến cùng tên.
  * DÒNG `images: images.split('\n').map(s => s.trim()).filter(Boolean) })).then(ok => { if(ok)`: Gán thuộc tính images: images.split('\n').map(s => s.trim()).filter tạo mảng chỉ giữ phần tử đạt điều kiện. | Rẽ nhánh nếu ok. | Cập nhật trạng thái qua setDirty(false). | Thực hiện Gọi navigate('/admin/places').
  * DÒNG `}}>`: Đưa biểu thức JavaScript event => { event.preventDefault() void state.run(() => state.service.savePlace({ id: opened?.id, expectedRevis vào JSX.
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="places"/>{t('basicInfo')`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('title')}><input value={title} required onChange={e => setTitle(e.tar`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính required: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<Field label={t('category')}><select value={category} onChange={e => setCategory(e.ta`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
  * DÒNG `<Field label={t('period')}><input value={period} onChange={e => setPeriod(e.target.va`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `</section>`: Đóng phần giao diện section.
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="pin"/>{t('locationSectio`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<div className="admin-two"><Field label={t('lat')}><input inputMode="decimal" value={`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính inputMode: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<label className="admin-check"><input type="checkbox" checked={verified} onChange={e `: Dựng label. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính checked: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `</section>`: Đóng phần giao diện section.
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{images.split('\n').find(s=>s.trim())&&<div className="admin-image-preview"><PlaceIma`: Đưa biểu thức JavaScript images.split('\n').find(s=>s.trim())&&<div className="admin-image-preview"><PlaceImage uri={images.split('\n') vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
  * DÒNG `<Field label={t('images')}><textarea rows={4} value={images.split('\n').filter(s => !`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rows: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<LocalMediaPicker kind="image" onPick={value => { setImages(old => [old,value].filter`: Dựng LocalMediaPicker. | Thuộc tính kind: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPick: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Cập nhật trạng thái qua setImages(old => [old,value].filter(Boolean).join('\n')). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `{images.includes('data:') && <button type="button" className="secondary" onClick={() `: Đưa biểu thức JavaScript images.includes('data:') && <button type="button" className="secondary" onClick={() => {setImages(images.split vào JSX. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback. | Cập nhật trạng thái qua setImages(images.split('\n').filter(s => !s.startsWith('data:')).join('\n')). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `</section>`: Đóng phần giao diện section.
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSecti`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<div className="admin-actions"><button disabled={state.busy || opened?.workflow === '`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
  * DÒNG `<button type="button" className="secondary" onClick={() => { if (!dirty || window.con`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback. | Rẽ nhánh nếu !dirty || window.confirm(t('unsaved')). | Thực hiện Gọi navigate('/admin/places').
  * DÒNG `{opened && opened.workflow !== 'archived' && <button type="button" className="seconda`: Đưa biểu thức JavaScript opened && opened.workflow !== 'archived' && <button type="button" className="secondary" disabled={state.busy}  vào JSX. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback.
  * DÒNG `if (window.confirm(t('confirmArchive'))) void state.run(() => state.service.archive(o`: Rẽ nhánh nếu window.confirm(t('confirmArchive')). | Thực hiện sử dụng void state.run(() => state.service.archive(opened.id, opened.revision)).then(ok => { if(ok làm giá trị của bước hiện tại. | Rẽ nhánh nếu ok. | Cập nhật trạng thái qua setDirty(false). | Thực hiện Gọi navigate('/admin/places').
  * DÒNG `}}>{t('archive')}</button>}`: Đưa biểu thức JavaScript () => { if (window.confirm(t('confirmArchive'))) void state.run(() => state.service.archive(opened.id, opened. vào JSX.
  * DÒNG `{opened && <button type="button" className="admin-delete" disabled={state.busy} onCli`: Đưa biểu thức JavaScript opened && <button type="button" className="admin-delete" disabled={state.busy} onClick={() => { confirmation.a vào JSX. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback.
  * DÒNG `confirmation.ask(t('confirmDelete') + '\n' + opened.record.canonicalTitle, () => {`: Thực hiện Gọi confirmation.ask(t('confirmDelete') + '\n' + opened.record.canonicalTitle, () => { void st.
  * DÒNG `void state.run(() => state.service.deletePlace(opened.id, opened.revision)).then(ok =`: Thực hiện sử dụng void state.run(() => state.service.deletePlace(opened.id, opened.revision)).then(ok => { i làm giá trị của bước hiện tại.
  * DÒNG `if (ok) { setDirty(false); navigate('/admin/places') }`: Rẽ nhánh nếu ok. | Cập nhật trạng thái qua setDirty(false). | Thực hiện Gọi navigate('/admin/places').
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  * DÒNG `}}>{t('delete')}</button>}`: Đưa biểu thức JavaScript () => { confirmation.ask(t('confirmDelete') + '\n' + opened.record.canonicalTitle, () => { void state.run(() = vào JSX.
  * DÒNG `</div></section>`: Đóng phần giao diện div.
  * DÒNG `</form>`: Đóng phần giao diện form.
  * DÒNG `{confirmation.dialog}`: Đưa biểu thức JavaScript confirmation.dialog vào JSX.
  * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <><div className="admin-page-title"><div><h1>{t(opened ? 'edit' : 'new')}</h1><p>{t('catalogHint')}</p></div></div><Feedback state={state} />
  <form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
   event.preventDefault()
   void state.run(() => state.service.savePlace({ id: opened?.id, expectedRevision: opened?.revision, title, category, period, lat, lng, verified,
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
   <div className="admin-actions"><button disabled={state.busy || opened?.workflow === 'archived'}>{state.busy ? t('loading') : t('save')}</button>
    <button type="button" className="secondary" onClick={() => { if (!dirty || window.confirm(t('unsaved'))) navigate('/admin/places') }}>{t('cancel')}</button>
    {opened && opened.workflow !== 'archived' && <button type="button" className="secondary" disabled={state.busy} onClick={() => {
     if (window.confirm(t('confirmArchive'))) void state.run(() => state.service.archive(opened.id, opened.revision)).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
    }}>{t('archive')}</button>}
    {/* CHỨC NĂNG: Nút xóa riêng, không gửi form và không tự thực hiện khi mở màn.
        XỬ LÝ: Cần xác nhận đúng tên điểm; chỉ quay về danh sách sau khi ghi thành công. */}
    {opened && <button type="button" className="admin-delete" disabled={state.busy} onClick={() => {
      confirmation.ask(t('confirmDelete') + '\n' + opened.record.canonicalTitle, () => {
        void state.run(() => state.service.deletePlace(opened.id, opened.revision)).then(ok => {
          if (ok) { setDirty(false); navigate('/admin/places') }
        })
      })
    }}>{t('delete')}</button>}
   </div></section>
  </form>
  {confirmation.dialog}
 </>
}
// TẠI SAO (PlaceForm): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
// dùng chung.
/* CÁCH KIỂM TRA: Không lưu tọa độ ngoài Huế/URL nguy hiểm; sửa metadata không đổi bản public. */
