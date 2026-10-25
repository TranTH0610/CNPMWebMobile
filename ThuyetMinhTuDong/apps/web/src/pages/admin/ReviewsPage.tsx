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
import { AudioPreview } from '../../components/admin/AudioPreview'
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
  <div className="admin-review-grid">{LANGUAGES.map(l => { const text = place.record.content[l.code]; return text ? <section key={l.code}><h3>{l.label} · {text.title}</h3><p className="admin-body">{text.body}</p>{text.audio && <AudioPreview url={text.audio.url} />}</section> : null })}</div>
  <Field label={t('note')}><textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></Field>
  {place.reviewNote && <p>{place.reviewNote}</p>}
  <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/content'}>{t('content')}</Link>
   {place.workflow === 'submitted' && <><button disabled={state.busy} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, true, note)) }}>{t('approve')}</button><button className="secondary" disabled={state.busy || !note.trim()} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, false, note)) }}>{t('reject')}</button></>}
   {place.workflow === 'approved' && <button disabled={state.busy} onClick={() => { confirmation.ask(t('confirmPublish'), () => { void state.run(() => state.service.publish(place.id, place.revision)) }) }}>{t('publish')}</button>}
  </div>
 {confirmation.dialog}</article>
}
/* CÁCH KIỂM TRA: Reject thiếu ghi chú bị khóa; approve không tự public; publish cần xác nhận. */
