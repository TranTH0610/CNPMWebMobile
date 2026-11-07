/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung.
 *
 * VỊ TRÍ: apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/shared/layouts/BoCucDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../hooks/useHanhTrinh
 * - ../../../shared/components/BieuTuong
 * - ../../../shared/components/AnhDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. clock
 * 2. JourneyPlayer
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useState } from 'react'

import { Link } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useJourney } from '../hooks/useHanhTrinh'
import { Icon } from '../../../shared/components/BieuTuong'
import { PlaceImage } from '../../../shared/components/AnhDiTich'

const clock = (value: number) =>
  Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')
// TẠI SAO (clock): Thời gian audio là số giây, nhưng người dùng cần cách đọc phút và giây; dữ
// liệu lỗi không được tạo nhãn NaN.

// CHỨC NĂNG: Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác
// được chuyển đến controller chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] JourneyPlayer ====================
export function JourneyPlayer() {
  const { engine, state, resumeSaved } = useJourney()

  const t = useText()
  const [expanded, setExpanded] = useState(false)

  const session = state.session
  // CHỨC NĂNG: Lỗi GPS hiển thị ở màn bản đồ, không tự mở lại player đã đóng.

  const playbackError =
    state.error === 'gpsFailed' || state.error === 'gpsWeak' ? undefined : state.error

  if (!session && !state.restore && !playbackError && state.status !== 'loading') return null

  const place = state.places.find((item) => item.id === session?.placeId)

  const busy = state.status === 'loading'

  const disabled = busy || state.status === 'error'

  const playing = state.status === 'playing'

  const ended = state.status === 'ended'

  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')

  // CHỨC NĂNG: Thao tác đều gọi audio thật, không tăng thời gian bằng timer UI.

  const toggle = () => {
    if (!session) return

    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }
  // TẠI SAO (toggle): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.

  return (
    <aside className={'audio-shell' + (!expanded ? ' is-compact' : '')} aria-label={t('jTitle')}>
      <section className="audio-player">
        {/* CHỨC NĂNG: Ảnh, tên và nút đóng nằm cùng hàng, không còn vùng trống phía trên.
            XỬ LÝ: Tên dài được xuống dòng; nút đóng có vùng bấm riêng không che nội dung. */}
        <header className="audio-header">
          {session && (
            <div className="audio-artwork">
              <PlaceImage uri={place?.images[0]} title={session.title} />
            </div>
          )}
          <div className="audio-content">
            <span className="audio-eyebrow">
              <Icon name="headphones" />
              {t('read')}
            </span>
            {session ? (
              <Link className="audio-title" to={'/places/' + session.placeId}>
                {session.title}
              </Link>
            ) : (
              <strong className="audio-title">
                {t(busy ? 'jPreparing' : state.restore ? 'jContinue' : 'jTitle')}
              </strong>
            )}
            {session && (
              <div className="audio-subtitle">
                <span className="audio-language">
                  {LANGUAGES.find((item) => item.code === session.language)?.label}
                </span>
                <span className={'audio-status ' + (playing ? 'is-playing' : '')}>
                  <span />
                  {t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}
                </span>
              </div>
            )}
          </div>
          {session && !expanded && (
            <button
              type="button"
              className="audio-mini-play"
              aria-label={primaryLabel}
              disabled={busy}
              onClick={toggle}
            >
              <Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} />
            </button>
          )}
          {session && (
            <button
              type="button"
              className="audio-expand"
              aria-label={t(expanded ? 'collapsePlayer' : 'expandPlayer')}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              <span aria-hidden="true">{expanded ? '⌄' : '⌃'}</span>
            </button>
          )}
          <button
            type="button"
            className="audio-close"
            aria-label={t('closePlayer')}
            title={t('closePlayer')}
            onClick={() => engine.close()}
          >
            {/* CHỨC NĂNG: Dùng icon hình học để dấu đóng nằm đúng tâm vùng bấm. */}
            <Icon name="close" />
          </button>
        </header>
        {state.restore && (
          <div className="audio-notice">
            {state.changed && <p>{t('jVersionChanged')}</p>}
            <div className="resume-actions">
              <button
                type="button"
                onClick={() => {
                  void resumeSaved()
                }}
              >
                <Icon name="play" />
                {t('jContinue')}
              </button>
              <button type="button" className="secondary" onClick={() => engine.dismissRestore()}>
                {t('jDiscard')}
              </button>
            </div>
          </div>
        )}
        {playbackError && (
          <div className="audio-error" role="alert">
            <span>{t(playbackError)}</span>
            {(state.status === 'error' || playbackError === 'loadError') && (
              <button type="button" className="secondary" onClick={() => engine.retry()}>
                {t('jRetry')}
              </button>
            )}
          </div>
        )}
        {busy && (
          <p className="audio-loading" role="status">
            <span className="loading-dot" />
            {t('jPreparing')}
          </p>
        )}
        {session && (
          <>
            <div className="audio-timeline">
              <input
                type="range"
                min={0}
                max={session.duration}
                step={0.1}
                value={session.position}
                aria-label={t('jSeek')}
                disabled={disabled}
                style={{
                  background: `linear-gradient(to right, var(--playerAccent) ${(session.position / session.duration) * 100}%, var(--playerControl) 0%)`,
                }}
                onChange={(event) => {
                  void engine.seek(Number(event.target.value))
                }}
              />
              <div className="audio-times">
                <span>{clock(session.position)}</span>
                <span>{clock(session.duration)}</span>
              </div>
            </div>
            {/* CHỨC NĂNG: Nhóm phát/tua luôn ở chính giữa; tốc độ là một hàng riêng cân đối. */}
            {expanded && (
              <>
                <div className="audio-transport">
                  <button
                    type="button"
                    className="audio-skip"
                    aria-label={t('jBack')}
                    title={t('jBack')}
                    disabled={disabled}
                    onClick={() => {
                      void engine.seek(session.position - 10)
                    }}
                  >
                    <Icon name="backward" />
                  </button>
                  <button
                    type="button"
                    className="audio-play"
                    aria-label={primaryLabel}
                    title={primaryLabel}
                    disabled={busy}
                    onClick={toggle}
                  >
                    <Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} />
                  </button>
                  <button
                    type="button"
                    className="audio-skip"
                    aria-label={t('jForward')}
                    title={t('jForward')}
                    disabled={disabled}
                    onClick={() => {
                      void engine.seek(session.position + 10)
                    }}
                  >
                    <Icon name="forward" />
                  </button>
                </div>
                <div className="audio-rates" role="group" aria-label={t('jSpeed')}>
                  <span>{t('jSpeed')}</span>
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      aria-label={t('jSpeed') + ' ' + rate + '×'}
                      aria-pressed={rate === session.rate}
                      disabled={disabled}
                      onClick={() => engine.rate(rate)}
                    >
                      {rate}×
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </aside>
  )
}
// TẠI SAO (JourneyPlayer): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
