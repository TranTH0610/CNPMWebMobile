/**
 * FILE NÀY LÀM GÌ
 * Trang kiểm duyệt web; xem nội dung và thực hiện duyệt/yêu cầu sửa theo revision hiện tại.
 *
 * VỊ TRÍ: apps/web/src/pages/admin/ReviewsPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx.
 * PHỤ THUỘC: ../../components/admin/AdminIcon; ../../components/PlaceImage; react-router-dom;
 * react; @travelguide/visitor-core; @travelguide/admin-core; @travelguide/admin-core/react;
 * ../../components/admin/AdminUI; ../../components/admin/AudioPreview
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../../components/admin/AdminIcon'.
import { AdminIcon } from '../../components/admin/AdminIcon'
// Nhập các thành phần từ '../../components/PlaceImage'.
import { PlaceImage } from '../../components/PlaceImage'
// Nhập các thành phần từ 'react-router-dom'.
import { Link } from 'react-router-dom'
// Nhập các thành phần từ 'react'.
import { useState } from 'react'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Feedback, Status, Field, useConfirmation } from '../../components/admin/AdminUI'
// Nhập các thành phần từ '../../components/admin/AudioPreview'.
import { AudioPreview } from '../../components/admin/AudioPreview'
// CHỨC NĂNG: Trang kiểm duyệt web; xem nội dung và thực hiện duyệt/yêu cầu sửa theo revision hiện
// tại.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ReviewsPage(). Component hàm nhận props và dựng phần giao diện ReviewsPage.
export function ReviewsPage() {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
 const state = useAdmin(), t = useAdminText()
 // Gán places bằng state.data?.places.filter(p => ['submitted','approved','changes']; nếu null hoặc undefined thì dùng [].
 const places = state.data?.places.filter(p => ['submitted','approved','changes'].includes(p.workflow)) ?? []
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <><div className="admin-page-title"><div><h1>{t('reviews')}</h1><p>{t('reviewQ`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{!state.loading && !places.length && <div className="admin-card admin-empty"><AdminIc`: Đưa biểu thức JavaScript !state.loading && !places.length && <div className="admin-card admin-empty"><AdminIcon name="review"/><h2>{t(' vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{places.map(place => <ReviewCard key={place.id + place.revision + place.workflow} pla`: Đưa biểu thức JavaScript places.map(place => <ReviewCard key={place.id + place.revision + place.workflow} place={place} />) vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <><div className="admin-page-title"><div><h1>{t('reviews')}</h1><p>{t('reviewQueueHint')}</p></div><span className="admin-pill">{places.length} {t('reviews')}</span></div><Feedback state={state} />
  {!state.loading && !places.length && <div className="admin-card admin-empty"><AdminIcon name="review"/><h2>{t('empty')}</h2></div>}
  {places.map(place => <ReviewCard key={place.id + place.revision + place.workflow} place={place} />)}
 </>
}
// TẠI SAO (ReviewsPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
// CHỨC NĂNG: Hiển thị thẻ nội dung chờ duyệt trên web.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ReviewCard({ place }). Component hàm nhận props và dựng phần giao diện ReviewCard. | Khai báo place, kiểu ManagedPlace.
function ReviewCard({ place }: { place: ManagedPlace }) {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [note,setNote]: useState('') giữ trạng thái qua các lần render.
 const state = useAdmin(), t = useAdminText(), [note,setNote] = useState(''), confirmation = useConfirmation()
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <article className="admin-card admin-review">{/* CHỨC NĂNG: Nhận diện đúng di `: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
  * DÒNG `<p className="admin-review-meta">{t('revision')}: {place.revision} · {t('current')}: `: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<div className="admin-review-grid">{LANGUAGES.map(l => { const text = place.record.co`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Khai báo text: đọc place.record.content[l.code] từ đối tượng/mảng để dùng tại bước hiện tại. | Trả kết quả: chọn giữa hai giá trị theo điều kiện text. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính url: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('note')}><textarea rows={2} value={note} onChange={e => setNote(e.tar`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rows: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `{place.reviewNote && <p>{place.reviewNote}</p>}`: Đưa biểu thức JavaScript place.reviewNote && <p>{place.reviewNote}</p> vào JSX.
  * DÒNG `<div className="admin-actions"><Link className="button secondary" to={'/admin/places/`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết.
  * DÒNG `{place.workflow === 'submitted' && <><button disabled={state.busy} onClick={() => { v`: Đưa biểu thức JavaScript place.workflow === 'submitted' && <><button disabled={state.busy} onClick={() => { void state.run(() => state. vào JSX. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void state.run(() => state.service.review(place.id, place.revision, true, note)) làm giá trị của bước hiện tại. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thực hiện sử dụng void state.run(() => state.service.review(place.id, place.revision, false, note)) làm giá trị của bước hiện tại.
  * DÒNG `{place.workflow === 'approved' && <button disabled={state.busy} onClick={() => { conf`: Đưa biểu thức JavaScript place.workflow === 'approved' && <button disabled={state.busy} onClick={() => { confirmation.ask(t('confirmPub vào JSX. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện Gọi confirmation.ask(t('confirmPublish'), () => { void state.run(() => state.service.publish(p. | Thực hiện sử dụng void state.run(() => state.service.publish(place.id, place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `</div>`: Đóng phần giao diện div.
  * DÒNG `{confirmation.dialog}</article>`: Đưa biểu thức JavaScript confirmation.dialog vào JSX.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
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
// TẠI SAO (ReviewCard): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
// dùng chung.
/* CÁCH KIỂM TRA: Reject thiếu ghi chú bị khóa; approve không tự public; publish cần xác nhận. */
