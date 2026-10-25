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
 const [opened] = useState(initial)
 const state = useAdmin(), t = useAdminText(), visitorText = useText(), navigate = useNavigate(), confirmation = useConfirmation()
 const [title,setTitle] = useState(opened?.record.canonicalTitle ?? '')
 const [category,setCategory] = useState<Category>(opened ? categoryOf(opened.record) : 'palace')
 const [period,setPeriod] = useState(opened?.period ?? '')
 const [lat,setLat] = useState(opened?.record.position?.lat.toString() ?? '')
 const [lng,setLng] = useState(opened?.record.position?.lng.toString() ?? '')
 const [verified,setVerified] = useState(opened?.record.position?.verified ?? false)
 const [images,setImages] = useState(opened?.record.images.join('\n') ?? '')
 const [dirty,setDirty] = useState(false); useUnsaved(dirty)
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
/* CÁCH KIỂM TRA: Không lưu tọa độ ngoài Huế/URL nguy hiểm; sửa metadata không đổi bản public. */
