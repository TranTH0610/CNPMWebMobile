/** FILE NÀY LÀM GÌ: Biên tập năm ngôn ngữ, bản thu URL, dịch/TTS demo và gửi duyệt.
 * /admin/places/:id/content; UC14/14.1/14.2. Không gửi API key hoặc gọi dịch thật.
 * Mỗi bản form giữ expectedRevision; service chặn kết quả dịch cũ ghi đè bản mới. */
import { AudioPreview } from '../../components/admin/AudioPreview'
import { AdminIcon } from '../../components/admin/AdminIcon'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Field, Status, useUnsaved } from '../../components/admin/AdminUI'
export function ContentEditorPage() {
 const state = useAdmin(), t = useAdminText(), { id } = useParams()
 const [language,setLanguage] = useState<Language>('vi'), [dirty,setDirty] = useState(false)
 const fresh = state.data?.places.find(p => p.id === id)
 const snapshot = useRef<ManagedPlace | undefined>(undefined)
 // CHỨC NĂNG: Poll từ máy khác không xóa nội dung chưa lưu.
 if (!dirty || snapshot.current?.id !== id) snapshot.current = fresh
 const place = dirty ? snapshot.current : fresh
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
 const [audioUrl,setAudioUrl] = useState(text?.audio?.url.startsWith('demo:') || text?.audio?.url.startsWith('narration:') ? '' : text?.audio?.url ?? '')
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
  {text?.audio && <div className="admin-audio"><span>{t('preview')}</span><AudioPreview url={text.audio.url} /></div>}
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
