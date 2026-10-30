/**
 * FILE NÀY LÀM GÌ
 * Trang biên tập nội dung đa ngôn ngữ web; lưu bài, tạo âm thanh, nghe thử và gửi duyệt.
 *
 * VỊ TRÍ: apps/web/src/pages/admin/ContentEditorPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx.
 * PHỤ THUỘC: ../../components/admin/AudioPreview; ../../components/admin/AdminIcon;
 * ../../components/admin/LocalMediaPicker; react; react-router-dom; @travelguide/visitor-core;
 * @travelguide/admin-core; @travelguide/admin-core/react; ../../components/admin/AdminUI
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../../components/admin/AudioPreview'.
import { AudioPreview } from '../../components/admin/AudioPreview'
// Nhập các thành phần từ '../../components/admin/AdminIcon'.
import { AdminIcon } from '../../components/admin/AdminIcon'
// Nhập các thành phần từ '../../components/admin/LocalMediaPicker'.
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
// Nhập các thành phần từ 'react'.
import { useState, useRef } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { useParams } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Language } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Feedback, Field, Status, useUnsaved } from '../../components/admin/AdminUI'
// CHỨC NĂNG: Trang biên tập nội dung đa ngôn ngữ web; lưu bài, tạo âm thanh, nghe thử và gửi
// duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ContentEditorPage(). Component hàm nhận props và dựng phần giao diện ContentEditorPage.
export function ContentEditorPage() {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo { id }: Gọi useParams().
 const state = useAdmin(), t = useAdminText(), { id } = useParams()
 // CHỨC NĂNG: Ngôn ngữ đang dùng cho nội dung hoặc form hiện tại. Form có thay đổi chưa lưu; dùng
 // để cảnh báo trước khi rời hoặc đổi ngôn ngữ.
 // Khai báo [language,setLanguage]: useState('vi') giữ trạng thái qua các lần render.
 const [language,setLanguage] = useState<Language>('vi'), [dirty,setDirty] = useState(false)
 // Khai báo fresh: state.data?.places.find lấy phần tử đầu tiên phù hợp.
 const fresh = state.data?.places.find(p => p.id === id)
 // Khai báo snapshot: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
 const snapshot = useRef<ManagedPlace | undefined>(undefined)
 // CHỨC NĂNG: Poll từ máy khác không xóa nội dung chưa lưu.
 // Rẽ nhánh nếu !dirty || snapshot.current?.id !== id. | Thực hiện tính biểu thức snapshot.current = fresh.
 if (!dirty || snapshot.current?.id !== id) snapshot.current = fresh
 // Khai báo place: chọn giữa hai giá trị theo điều kiện dirty.
 const place = dirty ? snapshot.current : fresh
 // Rẽ nhánh nếu state.loading || !place. | Trả cây giao diện của component để React hiển thị. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 if (state.loading || !place) return <><Feedback state={state} />{!state.loading && <p>{t('error_notFound')}</p>}</>
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <><div className="admin-page-title"><div><h1>{place.record.canonicalTitle}</h1`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
  * DÒNG `<p className="admin-demo">{t('mockMedia')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<div className="admin-language-tabs">{LANGUAGES.map(l => <button key={l.code} classNa`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback. | Rẽ nhánh nếu !dirty || window.confirm(t('unsaved')). | Cập nhật trạng thái qua setDirty(false). | Cập nhật trạng thái qua setLanguage(l.code).
  * DÒNG `<ContentForm key={place.id + language + place.revision} place={place} language={langu`: Dựng ContentForm. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính language: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính dirty: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính setDirty: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <><div className="admin-page-title"><div><h1>{place.record.canonicalTitle}</h1><p>{t('editorHint')} · {t('revision')}: {place.revision}</p></div><Status value={place.workflow} /></div>
  <p className="admin-demo">{t('mockMedia')}</p>
  <div className="admin-language-tabs">{LANGUAGES.map(l => <button key={l.code} className={language === l.code ? '' : 'secondary'} aria-pressed={language === l.code} onClick={() => { if(!dirty || window.confirm(t('unsaved'))) { setDirty(false); setLanguage(l.code) } }}>{l.label}</button>)}</div>
  <ContentForm key={place.id + language + place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty} />
 </>
}
// TẠI SAO (ContentEditorPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
// CHỨC NĂNG: Biên tập một bản ngôn ngữ của di tích hiện tại.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ContentForm({ place, language, dirty, setDirty }). Component hàm nhận props và dựng phần giao diện ContentForm. | Khai báo place, kiểu ManagedPlace. | Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác. | Khai báo dirty, kiểu boolean. | Khai báo setDirty, kiểu (value: boolean) => void.
function ContentForm({ place, language, dirty, setDirty }: { place: ManagedPlace; language: Language; dirty: boolean; setDirty: (value: boolean) => void }) {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo text: đọc place.record.content[language] từ đối tượng/mảng để dùng tại bước hiện tại.
 const state = useAdmin(), t = useAdminText(), text = place.record.content[language]
 // CHỨC NĂNG: Tên/tiêu đề đang được nhập trong form. Phần mô tả ngắn đang được nhập trong form.
 // Khai báo [title,setTitle]: useState(text?.title ?? '') giữ trạng thái qua các lần render.
 const [title,setTitle] = useState(text?.title ?? ''), [summary,setSummary] = useState(text?.summary ?? '')
 // CHỨC NĂNG: Bài thuyết minh đang được biên tập. Địa chỉ đang được nhập trong form.
 // Khai báo [body,setBody]: useState(text?.body ?? '') giữ trạng thái qua các lần render.
 const [body,setBody] = useState(text?.body ?? ''), [address,setAddress] = useState(text?.address ?? '')
 // CHỨC NĂNG: Nguồn audio đang chọn; khi lưu mới trở thành dữ liệu của bản ghi.
 // Khai báo [audioUrl,setAudioUrl]: useState(text?.audio?.url.startsWith('media:')||text?.audio?.url.startsWith('demo:') || text?) giữ trạng thái qua các lần render.
 const [audioUrl,setAudioUrl] = useState(text?.audio?.url.startsWith('media:')||text?.audio?.url.startsWith('demo:') || text?.audio?.url.startsWith('narration:') ? '' : text?.audio?.url ?? '')
 // Thực hiện Gọi useUnsaved(dirty).
 useUnsaved(dirty)
 // Khai báo disabled: tính biểu thức state.busy || place.workflow === 'archived'.
 const disabled = state.busy || place.workflow === 'archived'
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <><Feedback state={state} /><form className="admin-card admin-form" onChange={`: Trả cây giao diện của component để React hiển thị. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính onSubmit: xử lý gửi form.
  * DÒNG `event.preventDefault(); void state.run(() => state.service.saveContent({ id: place.id`: Chặn hành vi mặc định của sự kiện. | Thực hiện sử dụng void state.run(() => state.service.saveContent({ id: place.id, language, expectedRevision: làm giá trị của bước hiện tại. | Gán thuộc tính id: đọc place.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Đặt trường language bằng giá trị của biến cùng tên. | Gán thuộc tính expectedRevision: đọc place.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Đặt trường title bằng giá trị của biến cùng tên. | Đặt trường summary bằng giá trị của biến cùng tên. | Đặt trường body bằng giá trị của biến cùng tên. | Đặt trường address bằng giá trị của biến cùng tên. | Gán thuộc tính audioUrl: tính biểu thức audioUrl.trim() || undefined. | Rẽ nhánh nếu ok. | Cập nhật trạng thái qua setDirty(false).
  * DÒNG `}}>`: Đưa biểu thức JavaScript event => { event.preventDefault().
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="content"/>{t('basicInfo'`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('title')}><input value={title} required onChange={e => setTitle(e.tar`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính required: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<Field label={t('summary')}><textarea value={summary} rows={2} onChange={e => setSumm`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính rows: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<Field label={t('address')}><input value={address} onChange={e => setAddress(e.target`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<Field label={t('body')}><textarea value={body} required rows={10} onChange={e => set`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính required: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rows: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `</section>`: Đóng phần giao diện section.
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('audio')}><input value={audioUrl.startsWith('data:') ? t('localFile')`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính readOnly: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính placeholder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<LocalMediaPicker kind="audio" onPick={value => { setAudioUrl(value);setDirty(true) }`: Dựng LocalMediaPicker. | Thuộc tính kind: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPick: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Cập nhật trạng thái qua setAudioUrl(value). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `{audioUrl.startsWith('data:') && <button type="button" className="secondary" onClick=`: Đưa biểu thức JavaScript audioUrl.startsWith('data:') && <button type="button" className="secondary" onClick={()=>{setAudioUrl(''). | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback. | Cập nhật trạng thái qua setAudioUrl(''). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `{text?.audio && <div className="admin-audio"><span>{t('preview')}</span><AudioPreview`: Đưa biểu thức JavaScript text?.audio && <div className="admin-audio"><span>{t('preview')}</span><AudioPreview url={text.audio.url} /></ vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính url: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</section>`: Đóng phần giao diện section.
  * DÒNG `<section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSecti`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<div className="admin-actions"><button disabled={disabled}>{t('save')}</button>`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
  * DÒNG `<button type="button" className="secondary" disabled={disabled || dirty || language =`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void state.run(() => state.service.translate(place.id, language, place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `<button type="button" className="secondary" disabled={disabled || dirty || !text?.bod`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void state.run(() => state.service.generateAudio(place.id, language, place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `<button type="button" className="secondary" disabled={disabled || dirty || !['draft',`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void state.run(() => state.service.submit(place.id, place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `</div>`: Đóng phần giao diện div.
  * DÒNG `{place.reviewNote && <p className="admin-note">{t('note')}: {place.reviewNote}</p>}`: Đưa biểu thức JavaScript place.reviewNote && <p className="admin-note">{t('note')}: {place.reviewNote}</p> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `</section></form></>`: Đóng phần giao diện section.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
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
// TẠI SAO (ContentForm): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
/* CÁCH KIỂM TRA: Lưu trước khi dịch/tạo audio; đổi tab khi bẩn có hỏi; sửa body xóa audio cũ. */
