/**
 * FILE NÀY LÀM GÌ
 * Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham khảo.
 *
 * VỊ TRÍ: apps/web/src/pages/JourneyPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: react; react-router-dom; @travelguide/visitor-core;
 * @travelguide/visitor-core/journey/data; @travelguide/visitor-core/journey;
 * ../components/VisitorMap; ../components/PlaceImage; ../components/Icon; ../i18n;
 * ../hooks/useVisitor; ../hooks/useJourney; ../styles/journey.css
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react'.
import { useRef } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { Link, useSearchParams } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryOf, publishedText } from '@travelguide/visitor-core'
// Nhập các thành phần từ '@travelguide/visitor-core/journey/data'.
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
// Nhập các thành phần từ '@travelguide/visitor-core/journey'.
import { routeAvailable } from '@travelguide/visitor-core/journey'
// Nhập các thành phần từ '../components/VisitorMap'.
import { VisitorMap } from '../components/VisitorMap'
// Nhập các thành phần từ '../components/PlaceImage'.
import { PlaceImage } from '../components/PlaceImage'
// Nhập các thành phần từ '../components/Icon'.
import { Icon } from '../components/Icon'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ '../styles/journey.css'.
import '../styles/journey.css'

// CHỨC NĂNG: Trang hành trình/bản đồ web; chọn địa điểm, hiển thị các điểm tham quan và tuyến tham
// khảo.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo JourneyPage(). Component hàm nhận props và dựng phần giao diện JourneyPage.
export function JourneyPage() {
  // Khai báo { engine, state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { engine, state } = useJourney()
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo [params, setParams]: Gọi useSearchParams().
  const [params, setParams] = useSearchParams()
  // Khai báo mapArea: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const mapArea = useRef<HTMLDivElement>(null)
  // Khai báo selected: params.get đọc theo khóa.
  const selected = params.get('placeId')

  // CHỨC NĂNG: Định vị công trình ngay trên bản đồ trong trang.
  // XỬ LÝ: Chỉ đổi placeId, giữ query khác và không cần GPS điện thoại.
  // VisitorMap theo dõi selected để phóng đúng marker; cuộn giúp thấy kết quả.
  // Khai báo locate(id). Nhận đầu vào qua tham số.
  function locate(id: string) {
    // Cập nhật trạng thái qua setParams(previous => { const next = new URLSearchParams(previous) next.set('placeId', id) return next }, { replace: tru.
    setParams(previous => {
      // Khai báo next: URLSearchParams mã hóa/đọc tham số URL đúng với dấu cách và ký tự đặc biệt.
      const next = new URLSearchParams(previous)
      // Thực hiện Gọi next.set('placeId', id).
      next.set('placeId', id)
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return next`: Trả kết quả: sử dụng next làm giá trị của bước hiện tại.
       * DÒNG `}, { replace: true })`: Cập nhật trạng thái qua setParams(previous => { const next = new URLSearchParams(previous) next.set('placeId', id) return next }, { replace: tru. | Gán thuộc tính replace: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       */
      return next
    }, { replace: true })
    // Thực hiện Gọi mapArea.current?.scrollIntoView({ block: 'start', behavior: 'auto' }). | Gán thuộc tính block: chuỗi 'start'. | Gán thuộc tính behavior: chuỗi 'auto'.
    mapArea.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `mapArea.current?.focus({ preventScroll: true })`: Thực hiện Gọi mapArea.current?.focus({ preventScroll: true }). | Gán thuộc tính preventScroll: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    mapArea.current?.focus({ preventScroll: true })
  }
  // TẠI SAO (locate): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
  // dùng chung.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <section className="panel journey-page">`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<header className="journey-heading">`: Dựng header. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div><h1>{t('jTitle')}</h1><p>{t('jReference')}</p></div>`: Dựng div.
   * DÒNG `<button type="button" className={state.gps ? 'button' : 'button secondary'}`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-pressed={state.gps} onClick={() => { void engine.gps(!state.gps) }}>`: Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void engine.gps(!state.gps) làm giá trị của bước hiện tại.
   * DÒNG `<Icon name="pin" />{t(state.gps ? 'jGpsOff' : 'jGpsOn')}`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</header>`: Đóng phần giao diện header.
   * DÒNG `{state.error && <p className="journey-notice" role="alert">{t(state.error)}</p>}`: Đưa biểu thức JavaScript state.error && <p className="journey-notice" role="alert">{t(state.error)}</p> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{(state.status === 'error' || state.error === 'loadError') && <button type="button" o`: Đưa biểu thức JavaScript (state.status === 'error' || state.error === 'loadError') && <button type="button" onClick={() => engine.retry vào JSX. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `{state.gps && !state.suggestedId && <p className="journey-notice">{t('jNoNearby')}</p`: Đưa biểu thức JavaScript state.gps && !state.suggestedId && <p className="journey-notice">{t('jNoNearby')}</p> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div className="journey-map" ref={mapArea} tabIndex={-1} aria-label={t('jMap')}>`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước. | Thuộc tính tabIndex: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `<VisitorMap selected={selected} />`: Dựng VisitorMap. | Thuộc tính selected: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<section className="journey-section" aria-labelledby="journey-places-title">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-labelledby: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<div className="journey-section-heading">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<h2 id="journey-places-title">{t('allPlaces')}</h2>`: Dựng h2. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<span className="journey-count">{state.places.length}</span>`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<ul className="journey-places">`: Dựng ul. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{state.places.map(place => {`: Đưa biểu thức JavaScript state.places.map(place => { const title = publishedText(place, language)?.title ?? place.canonicalTitle const  vào JSX.
   */
  return <section className="panel journey-page">
    <header className="journey-heading">
      <div><h1>{t('jTitle')}</h1><p>{t('jReference')}</p></div>
      <button type="button" className={state.gps ? 'button' : 'button secondary'}
        aria-pressed={state.gps} onClick={() => { void engine.gps(!state.gps) }}>
        <Icon name="pin" />{t(state.gps ? 'jGpsOff' : 'jGpsOn')}
      </button>
    </header>
    {state.error && <p className="journey-notice" role="alert">{t(state.error)}</p>}
    {(state.status === 'error' || state.error === 'loadError') && <button type="button" onClick={() => engine.retry()}>{t('jRetry')}</button>}
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
        {state.places.map(place => {
          // Gán title bằng publishedText(place, language)?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
          const title = publishedText(place, language)?.title ?? place.canonicalTitle
          // Khai báo point: Gọi mapPointFor(place).
          const point = mapPointFor(place)
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `return <li key={place.id} className={'journey-place' + (selected === place.id ? ' is-`: Trả cây giao diện của component để React hiển thị. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
           * DÒNG `<Link className="journey-place-open" to={'/places/' + encodeURIComponent(place.id)} a`: Dựng Link. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
           * DÒNG `<PlaceImage uri={place.images[0]} title={title} />`: Dựng PlaceImage. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
           * DÒNG `<div className="journey-place-copy">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
           * DÒNG `<span className="journey-category">{t(`category_${categoryOf(place)}`)}</span>`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
           * DÒNG `<h3>{title}</h3>`: Dựng h3.
           * DÒNG `<span className="journey-open-label">{t('jOpenPlace')}<Icon name="arrow" /></span>`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `</div>`: Đóng phần giao diện div.
           * DÒNG `</Link>`: Đóng phần giao diện Link.
           * DÒNG `{point && <div className="journey-place-tools">`: Đưa biểu thức JavaScript point && <div className="journey-place-tools"> <button type="button" className="secondary" aria-pressed={selec vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
           * DÒNG `<button type="button" className="secondary" aria-pressed={selected === place.id}`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `aria-label={t('jMap') + ': ' + title} onClick={() => locate(place.id)}>`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Thuộc tính onClick: nối thao tác bấm với callback.
           * DÒNG `<Icon name="pin" />{t('jMap')}`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `</button>`: Đóng phần giao diện button.
           * DÒNG `{point.source && <details className="journey-source">`: Đưa biểu thức JavaScript point.source && <details className="journey-source"> <summary>{t('jSource')}</summary> <a href={point.source}  vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
           * DÒNG `<summary>{t('jSource')}</summary>`: Dựng summary.
           * DÒNG `<a href={point.source} target="_blank" rel="noreferrer" aria-label={t('jSource') + ':`: Dựng a. | Thuộc tính href: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính target: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rel: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
           * DÒNG `</details>}`: Đóng phần giao diện details.
           * DÒNG `</div>}`: Đóng phần giao diện div.
           * DÒNG `</li>`: Đóng phần giao diện li.
           * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `</ul>`: Đóng phần giao diện ul.
           * DÒNG `</section>`: Đóng phần giao diện section.
           * DÒNG `<section className="journey-section" aria-labelledby="journey-routes-title">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-labelledby: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `<div className="journey-section-heading"><h2 id="journey-routes-title">{t('jRoutes')}`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `{engine.ports.routes.map(route => {`: Đưa biểu thức JavaScript engine.ports.routes.map(route => { const available = routeAvailable(route, state.places) const active = state. vào JSX.
           */
          return <li key={place.id} className={'journey-place' + (selected === place.id ? ' is-selected' : '')}>
            <Link className="journey-place-open" to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ': ' + title}>
              <PlaceImage uri={place.images[0]} title={title} />
              <div className="journey-place-copy">
                <span className="journey-category">{t(`category_${categoryOf(place)}`)}</span>
                <h3>{title}</h3>
                <span className="journey-open-label">{t('jOpenPlace')}<Icon name="arrow" /></span>
              </div>
            </Link>
            {point && <div className="journey-place-tools">
              <button type="button" className="secondary" aria-pressed={selected === place.id}
                aria-label={t('jMap') + ': ' + title} onClick={() => locate(place.id)}>
                <Icon name="pin" />{t('jMap')}
              </button>
              {point.source && <details className="journey-source">
                <summary>{t('jSource')}</summary>
                <a href={point.source} target="_blank" rel="noreferrer" aria-label={t('jSource') + ': ' + title}>OpenStreetMap ↗</a>
              </details>}
            </div>}
          </li>
        })}
      </ul>
    </section>

    <section className="journey-section" aria-labelledby="journey-routes-title">
      <div className="journey-section-heading"><h2 id="journey-routes-title">{t('jRoutes')}</h2></div>
      {engine.ports.routes.map(route => {
        // Khai báo available: Gọi routeAvailable(route, state.places).
        const available = routeAvailable(route, state.places)
        // Khai báo active: tính biểu thức state.routeId === route.id.
        const active = state.routeId === route.id
        // CHỨC NĂNG: Lấy các điểm còn tồn tại; không dùng dấu ! để ép dữ liệu sai.
        // XỬ LÝ: Tuyến thiếu điểm bị khóa bởi routeAvailable trước khi chọn.
        // Khai báo stops: Gọi route.stops.flatMap(id => { const place = state.places.find(item => item.id === id) return.
        const stops = route.stops.flatMap(id => {
          // Khai báo place: state.places.find lấy phần tử đầu tiên phù hợp.
          const place = state.places.find(item => item.id === id)
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `return place ? [place] : []`: Trả kết quả: chọn giữa hai giá trị theo điều kiện place.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          return place ? [place] : []
        })
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return <article className={'journey-route' + (active ? ' is-selected' : '')} key={rou`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
         * DÒNG `<div className="journey-route-intro"><span className="journey-route-icon"><Icon name=`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
         * DÒNG `<div><h3>{route.title[language]}</h3>{!route.verified && <p>{t('jPreview')}</p>}</div`: Dựng div.
         * DÒNG `</div>`: Đóng phần giao diện div.
         * DÒNG `{!available ? <p role="alert">{t('jRouteInvalid')}</p> : <>`: Đưa biểu thức JavaScript !available ? <p role="alert">{t('jRouteInvalid')}</p> : <> <div className="journey-route-actions"> <button typ vào JSX. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
         * DÒNG `<div className="journey-route-actions">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
         * DÒNG `<button type="button" aria-pressed={active} onClick={() => engine.selectRoute(route.i`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback.
         * DÒNG `<Icon name="list" />{t('jUseRoute')}`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
         * DÒNG `</button>`: Đóng phần giao diện button.
         * DÒNG `<button type="button" className="secondary" onClick={() => engine.selectRoute()}>{t('`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback.
         * DÒNG `</div>`: Đóng phần giao diện div.
         * DÒNG `{active && <ol className="journey-stops">`: Đưa biểu thức JavaScript active && <ol className="journey-stops"> {stops.map((place, index) => { const title = publishedText(place, lan vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
         * DÒNG `{stops.map((place, index) => {`: Đưa biểu thức JavaScript stops.map((place, index) => { const title = publishedText(place, language)?.title ?? place.canonicalTitle retu vào JSX.
         */
        return <article className={'journey-route' + (active ? ' is-selected' : '')} key={route.id}>
          <div className="journey-route-intro"><span className="journey-route-icon"><Icon name="pin" /></span>
            <div><h3>{route.title[language]}</h3>{!route.verified && <p>{t('jPreview')}</p>}</div>
          </div>
          {!available ? <p role="alert">{t('jRouteInvalid')}</p> : <>
            <div className="journey-route-actions">
              <button type="button" aria-pressed={active} onClick={() => engine.selectRoute(route.id)}>
                <Icon name="list" />{t('jUseRoute')}
              </button>
              <button type="button" className="secondary" onClick={() => engine.selectRoute()}>{t('jSkipRoute')}</button>
            </div>
            {/* CHỨC NĂNG: Chọn tuyến hiện thứ tự cùng các liên kết chi tiết.
                XỬ LÝ: Không chỉ đổi state âm thầm; có phản hồi aria-pressed và thẻ điểm.
                Đây là thứ tự tham khảo, không tự phát audio hoặc vẽ đường đi giả. */}
            {active && <ol className="journey-stops">
              {stops.map((place, index) => {
                // Gán title bằng publishedText(place, language)?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
                const title = publishedText(place, language)?.title ?? place.canonicalTitle
                /* GIẢI THÍCH TỪNG DÒNG:
                 * DÒNG `return <li key={place.id}><span className="journey-step">{index + 1}</span>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
                 * DÒNG `<Link to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ':`: Dựng Link. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
                 * DÒNG `<PlaceImage uri={place.images[0]} title={title} /><span>{title}</span><Icon name="arr`: Dựng PlaceImage. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
                 * DÒNG `</Link>`: Đóng phần giao diện Link.
                 * DÒNG `</li>`: Đóng phần giao diện li.
                 * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `</ol>}`: Đóng phần giao diện ol.
                 * DÒNG `</>}`: Đưa biểu thức JavaScript !available ? <p role="alert">{t('jRouteInvalid')}</p> : <> <div className="journey-route-actions"> <button typ vào JSX.
                 * DÒNG `</article>`: Đóng phần giao diện article.
                 * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 * DÒNG `<p className="journey-footnote">{t('jWalkingPending')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
                 * DÒNG `</section>`: Đóng phần giao diện section.
                 * DÒNG `</section>`: Đóng phần giao diện section.
                 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 */
                return <li key={place.id}><span className="journey-step">{index + 1}</span>
                  <Link to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ': ' + title}>
                    <PlaceImage uri={place.images[0]} title={title} /><span>{title}</span><Icon name="arrow" />
                  </Link>
                </li>
              })}
            </ol>}
          </>}
        </article>
      })}
      <p className="journey-footnote">{t('jWalkingPending')}</p>
    </section>
  </section>
}
// TẠI SAO (JourneyPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Bấm ảnh/tên/Xem địa điểm: URL thành /places/ID và có tiêu đề tương ứng.
 * - Bấm Bản đồ trong thẻ: vẫn ở /journey?placeId=ID, bản đồ phóng đúng điểm.
 * - Xem thứ tự này hiện các điểm; bấm từng điểm mở đúng chi tiết; Tự khám phá bỏ chọn.
 * - Thử màn hình 390px, bàn phím Tab/Enter và đổi đủ năm ngôn ngữ.
 */
