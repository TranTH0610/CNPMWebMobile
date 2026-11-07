/**
 * CHỨC NĂNG: [KIEM-DUYET]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Danh sách hồ sơ kiểm duyệt dạng thẻ ảnh; mở một hồ sơ để xem và xử lý. AdminRoutes gọi; dùng API admin chung, không tự duyệt/công bố khi chỉ mở thẻ. TẠI SAO: Không tải trình nghe và toàn bộ bài của mọi di tích vào cùng một màn dài.
 *
 * VỊ TRÍ: apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - @travelguide/visitor-core
 * - @travelguide/admin-core
 * - @travelguide/admin-core/react
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../shared/components/BieuTuongQuanTri
 * - ../../../shared/components/AnhDiTich
 * - ../shared/components/ThanhPhanQuanTri
 * - ../content/components/NgheThuBanThu
 *
 * CÁC KHỐI CHÍNH:
 * 1. ReviewsPage
 * 2. ReviewDetailPage
 * 3. ReviewDetails
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LANGUAGES, categoryOf, type Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { AdminIcon } from '../shared/components/BieuTuongQuanTri'
import { PlaceImage } from '../../../shared/components/AnhDiTich'
import { Feedback, Status, Field, useConfirmation } from '../shared/components/ThanhPhanQuanTri'
import { AudioPreview } from '../content/components/NgheThuBanThu'

// ==================== [KIEM-DUYET] ReviewsPage ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewsPage.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function ReviewsPage() {
  const state = useAdmin(),
    t = useAdminText(),
    [filter, setFilter] = useState('all')
  const places =
    state.data?.places.filter(
      (p) =>
        ['submitted', 'approved', 'changes'].includes(p.workflow) &&
        (filter === 'all' || filter === p.workflow),
    ) ?? []
  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>{t('reviews')}</h1>
          <p>{t('reviewQueueHint')}</p>
        </div>
        <span className="admin-pill">{places.length}</span>
      </div>
      <Feedback state={state} />
      <div className="admin-review-filters" role="group" aria-label={t('reviews')}>
        {(['all', 'submitted', 'approved', 'changes'] as const).map((value) => (
          <button
            key={value}
            className={filter === value ? '' : 'secondary'}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === 'all' ? t('allReviews') : t(`status_${value}`)}
          </button>
        ))}
      </div>
      {!state.loading && !state.error && !places.length && (
        <div className="admin-card admin-empty">
          <AdminIcon name="review" />
          <h2>{t('empty')}</h2>
        </div>
      )}
      <div className="admin-review-cards">
        {places.map((place) => (
          <Link
            className="admin-review-tile"
            key={place.id}
            to={'/admin/reviews/' + encodeURIComponent(place.id)}
          >
            <div className="admin-review-tile-cover">
              <PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle} />
              <Status value={place.workflow} />
            </div>
            <div className="admin-review-tile-info">
              <h2>{place.record.canonicalTitle}</h2>
              <p>{place.record.content.vi?.summary}</p>
              <div className="admin-review-tile-footer">
                <span>
                  {t('revision')}: {place.revision}
                </span>
                <strong>
                  {t('viewReview')} <span aria-hidden="true">→</span>
                </strong>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

// CHỨC NĂNG: URL chi tiết giữ mã hồ sơ nên tải lại trang vẫn mở đúng di tích.
// ==================== [KIEM-DUYET] ReviewDetailPage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function ReviewDetailPage() {
  const state = useAdmin(),
    t = useAdminText(),
    { id } = useParams()
  const place = state.data?.places.find((p) => p.id === id)
  return (
    <>
      <Link className="button secondary admin-review-back" to="/admin/reviews">
        ← {t('backReviews')}
      </Link>
      {state.loading || !place ? (
        <>
          <Feedback state={state} />
          {!state.loading && !state.error && <p role="alert">{t('error_notFound')}</p>}
        </>
      ) : (
        <ReviewDetails key={place.id + place.revision + place.workflow} place={place} />
      )}
    </>
  )
}

// ==================== [KIEM-DUYET] ReviewDetails ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewDetails.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
function ReviewDetails({ place }: { place: ManagedPlace }) {
  const state = useAdmin(),
    t = useAdminText(),
    vt = useText(),
    confirmation = useConfirmation()
  const [language, setLanguage] = useState<Language>('vi'),
    [note, setNote] = useState(place.reviewNote)
  const text = place.record.content[language]
  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>{place.record.canonicalTitle}</h1>
          <p>
            {t('revision')}: {place.revision}
          </p>
        </div>
        <Status value={place.workflow} />
      </div>
      <Feedback state={state} />
      <div className="admin-review-detail-grid">
        <article className="admin-card admin-review-document">
          <PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle} />
          <div className="admin-review-document-content">
            <div className="admin-language-tabs" role="group" aria-label={t('editorHint')}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  disabled={state.busy}
                  className={language === l.code ? '' : 'secondary'}
                  aria-pressed={language === l.code}
                  onClick={() => setLanguage(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <h2>{text?.title ?? t('none')}</h2>
            {!!text?.summary && <p className="admin-review-summary">{text.summary}</p>}
            <h3>{t('body')}</h3>
            <p className="admin-review-full-body">{text?.body ?? t('none')}</p>
            {text?.audio && <AudioPreview key={language + text.audio.url} url={text.audio.url} />}
            {place.record.images.length > 1 && (
              <div className="admin-review-gallery">
                {place.record.images.slice(1).map((uri, index) => (
                  <PlaceImage key={uri + index} uri={uri} title={place.record.canonicalTitle} />
                ))}
              </div>
            )}
          </div>
        </article>
        <aside className="admin-review-sidebar">
          <section className="admin-card">
            <h2>{t('basicInfo')}</h2>
            <dl className="admin-review-facts">
              <dt>{t('category')}</dt>
              <dd>{vt(`category_${categoryOf(place.record)}`)}</dd>
              <dt>{t('period')}</dt>
              <dd>{place.period || t('none')}</dd>
              <dt>{t('address')}</dt>
              <dd>{text?.address || t('none')}</dd>
              <dt>{t('locationSection')}</dt>
              <dd>
                {place.record.position
                  ? `${place.record.position.lat}, ${place.record.position.lng}`
                  : t('none')}
              </dd>
            </dl>
          </section>
          <section className="admin-card">
            <h2>{t('reviews')}</h2>
            <Field label={t('note')}>
              <textarea
                rows={4}
                value={note}
                disabled={state.busy}
                onChange={(event) => setNote(event.target.value)}
              />
            </Field>
            <div className="admin-review-decision">
              {place.workflow === 'submitted' && (
                <>
                  <button
                    disabled={state.busy}
                    onClick={() => {
                      void state.run(() =>
                        state.service.review(place.id, place.revision, true, note),
                      )
                    }}
                  >
                    {t('approve')}
                  </button>
                  <button
                    className="secondary"
                    disabled={state.busy || !note.trim()}
                    onClick={() => {
                      void state.run(() =>
                        state.service.review(place.id, place.revision, false, note),
                      )
                    }}
                  >
                    {t('reject')}
                  </button>
                </>
              )}
              {place.workflow === 'approved' && (
                <button
                  disabled={state.busy}
                  onClick={() =>
                    confirmation.ask(t('confirmPublish'), () => {
                      void state.run(() => state.service.publish(place.id, place.revision))
                    })
                  }
                >
                  {t('publish')}
                </button>
              )}
              <Link className="button secondary" to={'/admin/places/' + place.id + '/content'}>
                {t('content')}
              </Link>
            </div>
          </section>
        </aside>
      </div>
      {confirmation.dialog}
    </>
  )
}
