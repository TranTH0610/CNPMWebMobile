/**
 * CHỨC NĂNG: [QUAN-LY-DI-TICH] [LUU-NHAP]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Form quản trị web để thêm, sửa và biên tập di tích. AdminRoutes/ContentEditorPage gọi; usePlaceEditor giữ cùng nghiệp vụ với mobile. TẠI SAO: File này chỉ dựng HTML, chọn tệp và điều hướng; dữ liệu vẫn qua API chung.
 *
 * VỊ TRÍ: apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenQuanTri.tsx
 * - apps/web/src/features/admin/content/TrangBienTapNoiDung.tsx
 *
 * PHỤ THUỘC:
 * - react-router-dom
 * - @travelguide/visitor-core
 * - @travelguide/admin-core
 * - @travelguide/admin-core/react
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../shared/components/ThanhPhanQuanTri
 * - ../shared/components/BieuTuongQuanTri
 * - ./components/ChinhSuaAnhDiTich
 * - ../shared/components/ChonTepTuThietBi
 * - ../content/components/NgheThuBanThu
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceFormPage
 * 2. PlaceForm
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES, LANGUAGES, type Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import {
  useAdmin,
  useAdminText,
  usePlaceEditor,
  type PlaceEditorAction,
} from '@travelguide/admin-core/react'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import {
  Feedback,
  Field,
  Status,
  useConfirmation,
  useUnsaved,
} from '../shared/components/ThanhPhanQuanTri'
import { AdminIcon } from '../shared/components/BieuTuongQuanTri'
import { PlaceImagesEditor } from './components/ChinhSuaAnhDiTich'
import { LocalMediaPicker } from '../shared/components/ChonTepTuThietBi'
import { AudioPreview } from '../content/components/NgheThuBanThu'

// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] PlaceFormPage ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceFormPage.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceFormPage() {
  const state = useAdmin(),
    t = useAdminText(),
    { id } = useParams()
  const place = state.data?.places.find((item) => item.id === id)
  if (state.loading || (state.error && !state.data)) return <Feedback state={state} />
  if (id && !place) return <p role="alert">{t('error_notFound')}</p>
  return <PlaceForm key={id ?? 'new'} initial={place} />
}

// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] PlaceForm ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceForm.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
function PlaceForm({ initial }: { initial?: ManagedPlace }) {
  const state = useAdmin(),
    t = useAdminText(),
    visitorText = useText(),
    navigate = useNavigate()
  const confirmation = useConfirmation(),
    location = useLocation()
  const submittedNotice = (location.state as { submitted?: boolean } | null)?.submitted === true
  const editor = usePlaceEditor(state, initial, t)
  const {
    current,
    saved,
    language,
    setLanguage,
    title,
    category,
    setCategory,
    period,
    setPeriod,
    lat,
    setLat,
    lng,
    setLng,
    verified,
    setVerified,
    images,
    setImages,
    dirty,
    setDirty,
    autoTranslate,
    setAutoTranslate,
    progress,
    text,
    disabled,
    edit,
  } = editor
  useUnsaved(dirty)

  // CHỨC NĂNG: Sau khi tạo thành công, URL trỏ vào đúng bản nháp vừa lưu.
  // TẠI SAO: Tải lại trang sẽ mở tiếp bản này, không quay về form trống.
  async function perform(action: PlaceEditorAction) {
    const ok = await editor.perform(action)
    if (ok && action === 'submit') {
      navigate('/admin/places/new', { replace: true, state: { submitted: true } })
      return
    }
    if (ok && !initial && current.current)
      navigate('/admin/places/' + current.current.id + '/edit', { replace: true })
  }

  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>{saved ? saved.record.canonicalTitle : t('new')}</h1>
          <p>
            {t('editorHint')}
            {saved && (
              <>
                {' '}
                · {t('revision')}: {saved.revision}
              </>
            )}
          </p>
        </div>
        {saved && <Status value={saved.workflow} />}
      </div>
      {(submittedNotice || editor.submittedSuccess) && !dirty && !saved && (
        <p className="admin-success" role="status">
          {t('submittedSuccess')}
        </p>
      )}
      <Feedback
        state={{ ...state, success: state.success && !editor.submittedSuccess && !dirty }}
      />
      {state.error === 'conflict' && saved && (
        <button
          type="button"
          className="secondary"
          onClick={() => {
            if (!window.confirm(t('unsaved'))) return
            void state.run(editor.reloadDraft)
          }}
        >
          {t('retry')}
        </button>
      )}
      <div className="admin-language-tabs" role="group" aria-label={t('editorHint')}>
        {LANGUAGES.map((item) => (
          <button
            type="button"
            key={item.code}
            disabled={state.busy}
            className={language === item.code ? '' : 'secondary'}
            aria-pressed={language === item.code}
            onClick={() => setLanguage(item.code)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form
        className="admin-card admin-form admin-place-editor"
        onSubmit={(event) => {
          event.preventDefault()
          void perform('save')
        }}
      >
        <fieldset disabled={disabled} className="admin-editor-fields">
          <section className="admin-form-section editor-content">
            <h2>
              <AdminIcon name="content" />
              {t('basicInfo')}
            </h2>
            <Field label={t('title')}>
              <input
                value={language === 'vi' ? title : text.title}
                required={language === 'vi'}
                onChange={(event) => edit('title', event.target.value)}
              />
            </Field>
            <div className="admin-two">
              <Field label={t('category')}>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value as Category)
                    setDirty(true)
                  }}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {visitorText(`category_${item}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('period')}>
                <input
                  value={period}
                  onChange={(event) => {
                    setPeriod(event.target.value)
                    setDirty(true)
                  }}
                />
              </Field>
            </div>
            <Field label={t('summary')}>
              <textarea
                rows={3}
                value={text.summary}
                onChange={(event) => edit('summary', event.target.value)}
              />
            </Field>
            <Field label={t('address')}>
              <input
                value={text.address}
                onChange={(event) => edit('address', event.target.value)}
              />
            </Field>
            <Field label={t('body')}>
              <textarea
                rows={12}
                maxLength={20000}
                value={text.body}
                onChange={(event) => edit('body', event.target.value)}
              />
            </Field>
          </section>
          <section className="admin-form-section editor-location">
            <h2>
              <AdminIcon name="pin" />
              {t('locationSection')}
            </h2>
            <div className="admin-two">
              <Field label={t('lat')}>
                <input
                  inputMode="decimal"
                  value={lat}
                  onChange={(event) => {
                    setLat(event.target.value)
                    setDirty(true)
                  }}
                />
              </Field>
              <Field label={t('lng')}>
                <input
                  inputMode="decimal"
                  value={lng}
                  onChange={(event) => {
                    setLng(event.target.value)
                    setDirty(true)
                  }}
                />
              </Field>
            </div>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={verified}
                onChange={(event) => {
                  setVerified(event.target.checked)
                  setDirty(true)
                }}
              />
              {t('verified')}
            </label>
          </section>
          <section className="admin-form-section editor-media">
            <h2>
              <AdminIcon name="image" />
              {t('mediaSection')}
            </h2>
            <PlaceImagesEditor
              value={images}
              title={title}
              disabled={disabled}
              onChange={(value) => {
                setImages(value)
                setDirty(true)
              }}
            />
            <Field label={t('audio')}>
              <input
                placeholder="https://…/audio.mp3"
                value={text.audioUrl?.startsWith('data:') ? t('localFile') : (text.audioUrl ?? '')}
                readOnly={text.audioUrl?.startsWith('data:')}
                onChange={(event) => edit('audioUrl', event.target.value)}
              />
            </Field>
            <LocalMediaPicker kind="audio" onPick={(value) => edit('audioUrl', value)} />
            {text.audioUrl?.startsWith('data:') && (
              <button type="button" className="secondary" onClick={() => edit('audioUrl', '')}>
                {t('clearFile')}
              </button>
            )}
            {!dirty && saved?.record.content[language]?.audio && (
              <div className="admin-audio">
                <span>{t('preview')}</span>
                <AudioPreview url={saved.record.content[language]!.audio!.url} />
              </div>
            )}
          </section>
          <section className="admin-form-section editor-workflow">
            <h2>
              <AdminIcon name="save" />
              {t('workflowSection')}
            </h2>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(event) => setAutoTranslate(event.target.checked)}
              />
              {t('autoTranslate')}
            </label>
            <div className="admin-actions">
              <button type="submit" className="secondary">
                {t('save')}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  if (window.confirm(t('confirmTranslate'))) void perform('translate')
                }}
              >
                {t('translateAll')}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  void perform('audio')
                }}
              >
                {t('audioAll')}
              </button>
              <button
                type="button"
                disabled={Boolean(
                  saved && !dirty && !['draft', 'changes'].includes(saved.workflow),
                )}
                onClick={() => {
                  void perform('submit')
                }}
              >
                {t('submit')}
              </button>
            </div>
            {saved?.reviewNote && (
              <p className="admin-note">
                {t('note')}: {saved.reviewNote}
              </p>
            )}
          </section>
        </fieldset>
      </form>
      {progress && (
        <p role="status" aria-live="polite" className="admin-demo">
          {progress}
        </p>
      )}
      <div className="admin-actions admin-editor-footer">
        <Link className="button secondary" to="/admin/places">
          {t('places')}
        </Link>
        {saved && saved.workflow !== 'archived' && (
          <button
            className="secondary"
            disabled={state.busy}
            onClick={() => {
              if (window.confirm(t('confirmArchive')))
                void state
                  .run(() => state.service.archive(saved.id, saved.revision))
                  .then((ok) => {
                    if (ok) {
                      setDirty(false)
                      navigate('/admin/places')
                    }
                  })
            }}
          >
            {t('archive')}
          </button>
        )}
        {saved && (
          <button
            className="admin-delete"
            disabled={state.busy}
            onClick={() =>
              confirmation.ask(t('confirmDelete'), () => {
                void state
                  .run(() => state.service.deletePlace(saved.id, saved.revision))
                  .then((ok) => {
                    if (ok) {
                      setDirty(false)
                      navigate('/admin/places')
                    }
                  })
              })
            }
          >
            {t('delete')}
          </button>
        )}
      </div>
      {confirmation.dialog}
    </>
  )
}
