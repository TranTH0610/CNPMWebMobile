/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị chi tiết và xử lý QR web UC04–UC05.
 * Router sử dụng; phụ thuộc core, qrcode và UI.
 * Mở trang không tự phát âm thanh.
 */

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QRCode from 'qrcode'

import {
  availableLanguages,
  LANGUAGES,
  parseQrTarget,
  placeUrl,
  publishedText,
  type Language,
} from '@travelguide/visitor-core'

import {
  usePublishedPlace,
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

import { qrPolicy } from './platform'
import { PlaceImage, State } from './ui'

export { HomePage, PlacesPage } from './Explore'

// CHỨC NĂNG: Tạo ảnh QR trong trình duyệt.
// XỬ LÝ: Không gửi URL tới dịch vụ tạo QR bên ngoài;
// cleanup bỏ kết quả cũ khi ID thay đổi hoặc component rời màn.
function QrImage({ id = '' }: { id?: string }) {
  const [state, setState] = useState<{
    id: string
    src?: string
    error?: boolean
  }>({ id: '' })

  const t = useText()

  const href = id
    ? placeUrl(window.location.origin, id)
    : window.location.origin + '/'

  useEffect(() => {
    let cancelled = false

    QRCode.toDataURL(href, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
      .then((src) => {
        if (!cancelled) setState({ id, src })
      })
      .catch(() => {
        if (!cancelled) setState({ id, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [href, id])

  return (
    <section className="qr-panel">
      <h2>{t(id ? 'qrLink' : 'generalQr')}</h2>
      <p>{t('qrWebHint')}</p>

      {state.id === id && state.src ? (
        <img
          src={state.src}
          width={240}
          height={240}
          alt={t('qrLink')}
        />
      ) : state.error ? (
        <State message="loadError" />
      ) : (
        <State message="loading" busy />
      )}

      <p><a href={href}>{href}</a></p>
    </section>
  )
}

// CHỨC NĂNG: Đọc bài công bố của đúng ID.
// XỬ LÝ: Thiếu ngôn ngữ cho chọn bản đã có; không tự dịch.
export function DetailPage() {
  const { id = '' } = useParams()
  const data = usePublishedPlace(id)
  const { language } = useVisitor()
  const t = useText()

  const [choice, setChoice] = useState<{
    context: string
    language: Language
  }>()

  const context = id + '|' + language

  const selected = choice?.context === context
    ? choice.language
    : language

  if (data.loading) {
    return <State message="loading" busy />
  }

  if (data.error || !data.place) {
    return (
      <>
        <State
          message={data.error ?? 'notFound'}
          retry={data.retry}
        />
        <Link to="/places">{t('back')}</Link>
      </>
    )
  }

  const place = data.place
  const content = publishedText(place, selected)

  return (
    <article className="detail">
      <Link to="/places">{t('back')}</Link>
      <h1>{content?.title ?? place.canonicalTitle}</h1>

      <PlaceImage
        uri={place.images[0]}
        title={place.canonicalTitle}
      />

      <p>{t('available')}</p>

      <div className="language-options">
        {availableLanguages(place).map((code) => (
          <button
            key={code}
            aria-pressed={selected === code}
            onClick={() => setChoice({
              context,
              language: code,
            })}
          >
            {LANGUAGES.find(
              (item) => item.code === code,
            )?.label ?? code}
          </button>
        ))}
      </div>

      {content ? (
        <section>
          <p>{content.address}</p>
          <h2>{t('read')}</h2>
          <p className="narration">{content.body}</p>
          <p>{t('version')}: {content.version}</p>
        </section>
      ) : (
        <State message="missing" />
      )}

      <p>
        {place.position?.verified
          ? t('coordinates')
            + ': '
            + place.position.lat
            + ', '
            + place.position.lng
          : t('unverified')}
      </p>

      <QrImage id={place.id} />
    </article>
  )
}

// CHỨC NĂNG: Kiểm tra link QR trên web.
// XỬ LÝ: Không xin camera web; khách dùng camera điện thoại
// mở link hoặc dán link vào form này.
export function QrPage() {
  const [raw, setRaw] = useState('')
  const [failed, setFailed] = useState(false)

  const navigate = useNavigate()
  const t = useText()

  return (
    <section className="detail">
      <h1>{t('scan')}</h1>
      <p>{t('qrWebHint')}</p>

      <form
        onSubmit={(event) => {
          event.preventDefault()

          try {
            const target = parseQrTarget(raw, qrPolicy)
            setFailed(false)

            navigate(
              target.kind === 'home'
                ? '/'
                : '/places/' + target.id,
            )
          } catch {
            setFailed(true)
          }
        }}
      >
        <label htmlFor="qr-link">
          {t('enterQr')}
        </label>

        <input
          id="qr-link"
          type="text"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          autoComplete="off"
        />

        <button disabled={!raw.trim()} type="submit">
          {t('openQr')}
        </button>
      </form>

      {failed && <State message="invalidQr" />}

      <QrImage />

      <Link to="/places">{t('back')}</Link>
    </section>
  )
}