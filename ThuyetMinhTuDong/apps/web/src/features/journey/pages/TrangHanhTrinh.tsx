/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo.
 *
 * VỊ TRÍ: apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../components/TrangThaiDinhVi
 * - react
 * - react-router-dom
 * - @travelguide/visitor-core
 * - @travelguide/visitor-core/journey/data
 * - @travelguide/visitor-core/journey
 * - ../components/BanDoThamQuan
 * - ../../../shared/components/AnhDiTich
 * - ../../../shared/components/BieuTuong
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../hooks/useHanhTrinh
 * - ../styles/HanhTrinh.css
 *
 * CÁC KHỐI CHÍNH:
 * 1. JourneyPage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { GpsStatus } from '../components/TrangThaiDinhVi'

import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categoryOf, publishedText } from '@travelguide/visitor-core'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import { routeAvailable } from '@travelguide/visitor-core/journey'
import { VisitorMap } from '../components/BanDoThamQuan'
import { PlaceImage } from '../../../shared/components/AnhDiTich'
import { Icon } from '../../../shared/components/BieuTuong'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useJourney } from '../hooks/useHanhTrinh'
import '../styles/HanhTrinh.css'

// CHỨC NĂNG: Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham
// khảo.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] JourneyPage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function JourneyPage() {
  const { engine, state } = useJourney()

  const { language } = useVisitor()

  const t = useText()

  const [params, setParams] = useSearchParams()

  const mapArea = useRef<HTMLDivElement>(null)

  const selected = params.get('placeId')

  // CHỨC NĂNG: Định vị công trình ngay trên bản đồ trong trang.
  // XỬ LÝ: Chỉ đổi placeId, giữ query khác và không cần GPS điện thoại.
  // VisitorMap theo dõi selected để phóng đúng marker; cuộn giúp thấy kết quả.

  function locate(id: string) {
    // Cập nhật trạng thái qua setParams(previous => { const next = new URLSearchParams(previous) next.set('placeId', id) return next }, { replace: tru.
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)

        next.set('placeId', id)

        return next
      },
      { replace: true },
    )

    mapArea.current?.scrollIntoView({ block: 'start', behavior: 'auto' })

    mapArea.current?.focus({ preventScroll: true })
  }
  // TẠI SAO (locate): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
  // dùng chung.

  return (
    <section className="panel journey-page">
      <header className="journey-heading">
        <div>
          <h1>{t('jTitle')}</h1>
          <p>{t('jReference')}</p>
        </div>
        <button
          type="button"
          className={state.gps ? 'button' : 'button secondary'}
          aria-pressed={state.gps}
          onClick={() => {
            void engine.gps(!state.gps)
          }}
        >
          <Icon name="pin" />
          {t(state.gps ? 'jGpsOff' : 'jGpsOn')}
        </button>
      </header>
      <GpsStatus />
      {state.error && !['gpsFailed', 'gpsWeak'].includes(state.error) && (
        <p className="journey-notice" role="alert">
          {t(state.error)}
        </p>
      )}
      {(state.status === 'error' || state.error === 'loadError') && (
        <button type="button" onClick={() => engine.retry()}>
          {t('jRetry')}
        </button>
      )}
      {state.gps && !state.suggestedId && <p className="journey-notice">{t('jNoNearby')}</p>}
      <div className="journey-map" ref={mapArea} tabIndex={-1} aria-label={t('jMap')}>
        <VisitorMap selected={selected} />
      </div>

      <section className="journey-section" aria-labelledby="journey-places-title">
        <div className="journey-section-heading">
          <h2 id="journey-places-title">{t('allPlaces')}</h2>
          <span className="journey-count">{state.places.length}</span>
        </div>
        {/* CHỨC NĂNG: Ảnh, tên và lời mời mở chi tiết là một liên kết lớn.
          XỬ LÝ: Nút định vị và nguồn tọa độ ở ngoài Link; không lồng nút/link.
          Đường dẫn dùng ID dữ liệu, không dùng tên đã dịch nên đổi ngôn ngữ không hỏng. */}
        <ul className="journey-places">
          {state.places.map((place) => {
            // Gán title bằng publishedText(place, language)?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
            const title = publishedText(place, language)?.title ?? place.canonicalTitle

            const point = mapPointFor(place)

            return (
              <li
                key={place.id}
                className={'journey-place' + (selected === place.id ? ' is-selected' : '')}
              >
                <Link
                  className="journey-place-open"
                  to={'/places/' + encodeURIComponent(place.id)}
                  aria-label={t('jOpenPlace') + ': ' + title}
                >
                  <PlaceImage uri={place.images[0]} title={title} />
                  <div className="journey-place-copy">
                    <span className="journey-category">{t(`category_${categoryOf(place)}`)}</span>
                    <h3>{title}</h3>
                    <span className="journey-open-label">
                      {t('jOpenPlace')}
                      <Icon name="arrow" />
                    </span>
                  </div>
                </Link>
                {point && (
                  <div className="journey-place-tools">
                    <button
                      type="button"
                      className="secondary"
                      aria-pressed={selected === place.id}
                      aria-label={t('jMap') + ': ' + title}
                      onClick={() => locate(place.id)}
                    >
                      <Icon name="pin" />
                      {t('jMap')}
                    </button>
                    {point.source && (
                      <details className="journey-source">
                        <summary>{t('jSource')}</summary>
                        <a
                          href={point.source}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={t('jSource') + ': ' + title}
                        >
                          OpenStreetMap ↗
                        </a>
                      </details>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="journey-section" aria-labelledby="journey-routes-title">
        <div className="journey-section-heading">
          <h2 id="journey-routes-title">{t('jRoutes')}</h2>
        </div>
        {engine.ports.routes.map((route) => {
          const available = routeAvailable(route, state.places)

          const active = state.routeId === route.id
          // CHỨC NĂNG: Lấy các điểm còn tồn tại; không dùng dấu ! để ép dữ liệu sai.
          // XỬ LÝ: Tuyến thiếu điểm bị khóa bởi routeAvailable trước khi chọn.

          const stops = route.stops.flatMap((id) => {
            const place = state.places.find((item) => item.id === id)

            return place ? [place] : []
          })

          return (
            <article className={'journey-route' + (active ? ' is-selected' : '')} key={route.id}>
              <div className="journey-route-intro">
                <span className="journey-route-icon">
                  <Icon name="pin" />
                </span>
                <div>
                  <h3>{route.title[language]}</h3>
                  {!route.verified && <p>{t('jPreview')}</p>}
                </div>
              </div>
              {!available ? (
                <p role="alert">{t('jRouteInvalid')}</p>
              ) : (
                <>
                  <div className="journey-route-actions">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => engine.selectRoute(route.id)}
                    >
                      <Icon name="list" />
                      {t('jUseRoute')}
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => engine.selectRoute()}
                    >
                      {t('jSkipRoute')}
                    </button>
                  </div>
                  {/* CHỨC NĂNG: Chọn tuyến hiện thứ tự cùng các liên kết chi tiết.
                XỬ LÝ: Không chỉ đổi state âm thầm; có phản hồi aria-pressed và thẻ điểm.
                Đây là thứ tự tham khảo, không tự phát audio hoặc vẽ đường đi giả. */}
                  {active && (
                    <ol className="journey-stops">
                      {stops.map((place, index) => {
                        // Gán title bằng publishedText(place, language)?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
                        const title = publishedText(place, language)?.title ?? place.canonicalTitle

                        return (
                          <li key={place.id}>
                            <span className="journey-step">{index + 1}</span>
                            <Link
                              to={'/places/' + encodeURIComponent(place.id)}
                              aria-label={t('jOpenPlace') + ': ' + title}
                            >
                              <PlaceImage uri={place.images[0]} title={title} />
                              <span>{title}</span>
                              <Icon name="arrow" />
                            </Link>
                          </li>
                        )
                      })}
                    </ol>
                  )}
                </>
              )}
            </article>
          )
        })}
        <p className="journey-footnote">{t('jWalkingPending')}</p>
      </section>
    </section>
  )
}
// TẠI SAO (JourneyPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Bấm ảnh/tên/Xem địa điểm: URL thành /places/ID và có tiêu đề tương ứng.
 * - Bấm Bản đồ trong thẻ: vẫn ở /journey?placeId=ID, bản đồ phóng đúng điểm.
 * - Xem thứ tự này hiện các điểm; bấm từng điểm mở đúng chi tiết; Tự khám phá bỏ chọn.
 * - Thử màn hình 390px, bàn phím Tab/Enter và đổi đủ năm ngôn ngữ.
 */
