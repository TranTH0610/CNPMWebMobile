/**
 * FILE NÀY LÀM GÌ
 * Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển
 * đến controller chung.
 *
 * VỊ TRÍ: apps/web/src/components/JourneyPlayer.tsx
 * DÙNG BỞI: apps/web/src/layouts/AppLayout.tsx.
 * PHỤ THUỘC: react-router-dom; @travelguide/visitor-core; ../i18n; ../hooks/useJourney; ./Icon;
 * ./PlaceImage
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react-router-dom'.
import { Link } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ './Icon'.
import { Icon } from './Icon'
// Nhập các thành phần từ './PlaceImage'.
import { PlaceImage } from './PlaceImage'

// Khai báo clock: khai báo callback (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value %.
const clock = (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')
// TẠI SAO (clock): Thời gian audio là số giây, nhưng người dùng cần cách đọc phút và giây; dữ
// liệu lỗi không được tạo nhãn NaN.

// CHỨC NĂNG: Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác
// được chuyển đến controller chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo JourneyPlayer(). Component hàm nhận props và dựng phần giao diện JourneyPlayer.
export function JourneyPlayer() {
  // Khai báo { engine, state, resumeSaved }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { engine, state, resumeSaved } = useJourney()
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo session: đọc state.session từ đối tượng/mảng để dùng tại bước hiện tại.
  const session = state.session
  // CHỨC NĂNG: Lỗi GPS hiển thị ở màn bản đồ, không tự mở lại player đã đóng.
  // Khai báo playbackError: chọn giữa hai giá trị theo điều kiện state.error === 'gpsFailed' || state.error === 'gpsWeak'.
  const playbackError = state.error === 'gpsFailed' || state.error === 'gpsWeak' ? undefined : state.error
  // Rẽ nhánh nếu !session && !state.restore && !playbackError && state.status !== 'loading'. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
  if (!session && !state.restore && !playbackError && state.status !== 'loading') return null
  // Khai báo place: state.places.find lấy phần tử đầu tiên phù hợp.
  const place = state.places.find(item => item.id === session?.placeId)
  // Khai báo busy: tính biểu thức state.status === 'loading'.
  const busy = state.status === 'loading'
  // Khai báo disabled: tính biểu thức busy || state.status === 'error'.
  const disabled = busy || state.status === 'error'
  // Khai báo playing: tính biểu thức state.status === 'playing'.
  const playing = state.status === 'playing'
  // Khai báo ended: tính biểu thức state.status === 'ended'.
  const ended = state.status === 'ended'
  // Khai báo primaryLabel: Gọi t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume').
  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')

  // CHỨC NĂNG: Thao tác đều gọi audio thật, không tăng thời gian bằng timer UI.
  // Khai báo toggle: khai báo callback () => { if (!session) return if (playing) engine.pause() else if (ended ||.
  const toggle = () => {
    // Rẽ nhánh nếu !session. | Thoát hàm hiện tại ngay.
    if (!session) return
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (playing) engine.pause()`: Rẽ nhánh nếu playing. | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại.
     * DÒNG `else if (ended || state.status === 'error') void engine.play(session.placeId, session`: Rẽ nhánh nếu playing. | Rẽ nhánh nếu ended || state.status === 'error'. | Thực hiện sử dụng void engine.play(session.placeId, session.language) làm giá trị của bước hiện tại.
     * DÒNG `else void engine.resume()`: Rẽ nhánh nếu ended || state.status === 'error'. | Thực hiện sử dụng void engine.resume() làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }
  // TẠI SAO (toggle): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<aside className="audio-shell" aria-label={t('jTitle')}>`: Dựng aside. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `<section className="audio-player">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<header className="audio-header">`: Dựng header. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{session && <div className="audio-artwork"><PlaceImage uri={place?.images[0]} title={`: Đưa biểu thức JavaScript session && <div className="audio-artwork"><PlaceImage uri={place?.images[0]} title={session.title} /></div> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `<div className="audio-content">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<span className="audio-eyebrow"><Icon name="headphones" />{t('read')}</span>`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{session ? <Link className="audio-title" to={'/places/' + session.placeId}>{session.t`: Đưa biểu thức JavaScript session ? <Link className="audio-title" to={'/places/' + session.placeId}>{session.title}</Link> : <strong cla vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết.
   * DÒNG `: <strong className="audio-title">{t(busy ? 'jPreparing' : state.restore ? 'jContinue`: Đưa biểu thức JavaScript session ? <Link className="audio-title" to={'/places/' + session.placeId}>{session.title}</Link> : <strong cla vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{session && <div className="audio-subtitle">`: Đưa biểu thức JavaScript session && <div className="audio-subtitle"> <span className="audio-language">{LANGUAGES.find(item => item.code vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<span className="audio-language">{LANGUAGES.find(item => item.code === session.langua`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<span className={'audio-status ' + (playing ? 'is-playing' : '')}><span />{t(ended ? `: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `</div>}`: Đóng phần giao diện div.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<button type="button" className="audio-close" aria-label={t('closePlayer')}`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `title={t('closePlayer')} onClick={() => engine.close()}><span aria-hidden="true">×</s`: Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onClick: nối thao tác bấm với callback. | Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</header>`: Đóng phần giao diện header.
   * DÒNG `{state.restore && <div className="audio-notice">`: Đưa biểu thức JavaScript state.restore && <div className="audio-notice"> {state.changed && <p>{t('jVersionChanged')}</p>} <div classNam vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{state.changed && <p>{t('jVersionChanged')}</p>}`: Đưa biểu thức JavaScript state.changed && <p>{t('jVersionChanged')}</p> vào JSX.
   * DÒNG `<div className="resume-actions">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<button type="button" onClick={() => { void resumeSaved() }}><Icon name="play" />{t('`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void resumeSaved() làm giá trị của bước hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<button type="button" className="secondary" onClick={() => engine.dismissRestore()}>{`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</div>}`: Đóng phần giao diện div.
   * DÒNG `{playbackError && <div className="audio-error" role="alert"><span>{t(playbackError)}<`: Đưa biểu thức JavaScript playbackError && <div className="audio-error" role="alert"><span>{t(playbackError)}</span> {(state.status ===  vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{(state.status === 'error' || playbackError === 'loadError') && <button type="button"`: Đưa biểu thức JavaScript (state.status === 'error' || playbackError === 'loadError') && <button type="button" className="secondary" onC vào JSX. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `</div>}`: Đóng phần giao diện div.
   * DÒNG `{busy && <p className="audio-loading" role="status"><span className="loading-dot" />{`: Đưa biểu thức JavaScript busy && <p className="audio-loading" role="status"><span className="loading-dot" />{t('jPreparing')}</p> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{session && <>`: Đưa biểu thức JavaScript session && <> <div className="audio-timeline"> <input type="range" min={0} max={session.duration} step={0.1} v vào JSX.
   * DÒNG `<div className="audio-timeline">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<input type="range" min={0} max={session.duration} step={0.1} value={session.position`: Dựng input. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính min: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính max: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính step: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `aria-label={t('jSeek')} disabled={disabled}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `style={{ background: `linear-gradient(to right, var(--playerAccent) ${session.positio`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính background: sử dụng `linear-gradient(to right, var(--playerAccent) ${session.position / session.duration * 100 làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `onChange={event => { void engine.seek(Number(event.target.value)) }} />`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thực hiện sử dụng void engine.seek(Number(event.target.value)) làm giá trị của bước hiện tại.
   * DÒNG `<div className="audio-times"><span>{clock(session.position)}</span><span>{clock(sessi`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<div className="audio-transport">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<button type="button" className="audio-skip" aria-label={t('jBack')} title={t('jBack'`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => { void engine.seek(session.position - 10) }}><Icon name="backward" /><`: Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void engine.seek(session.position - 10) làm giá trị của bước hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<button type="button" className="audio-play" aria-label={primaryLabel} title={primary`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `<Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} /></button>`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<button type="button" className="audio-skip" aria-label={t('jForward')} title={t('jFo`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => { void engine.seek(session.position + 10) }}><Icon name="forward" /></`: Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void engine.seek(session.position + 10) làm giá trị của bước hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<div className="audio-rates" role="group" aria-label={t('jSpeed')}>`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `<span>{t('jSpeed')}</span>`: Dựng span.
   * DÒNG `{[0.75, 1, 1.25, 1.5, 2].map(rate => <button key={rate} type="button"`: Đưa biểu thức JavaScript [0.75, 1, 1.25, 1.5, 2].map(rate => <button key={rate} type="button" aria-label={t('jSpeed') + ' ' + rate + '× vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `aria-label={t('jSpeed') + ' ' + rate + '×'} aria-pressed={rate === session.rate}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `disabled={disabled} onClick={() => engine.rate(rate)}>{rate}×</button>)}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</>}`: Đưa biểu thức JavaScript session && <> <div className="audio-timeline"> <input type="range" min={0} max={session.duration} step={0.1} v vào JSX.
   * DÒNG `</section>`: Đóng phần giao diện section.
   * DÒNG `</aside>`: Đóng phần giao diện aside.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <aside className="audio-shell" aria-label={t('jTitle')}>
      <section className="audio-player">
        {/* CHỨC NĂNG: Ảnh, tên và nút đóng nằm cùng hàng, không còn vùng trống phía trên.
            XỬ LÝ: Tên dài được xuống dòng; nút đóng có vùng bấm riêng không che nội dung. */}
        <header className="audio-header">
          {session && <div className="audio-artwork"><PlaceImage uri={place?.images[0]} title={session.title} /></div>}
          <div className="audio-content">
            <span className="audio-eyebrow"><Icon name="headphones" />{t('read')}</span>
            {session ? <Link className="audio-title" to={'/places/' + session.placeId}>{session.title}</Link>
              : <strong className="audio-title">{t(busy ? 'jPreparing' : state.restore ? 'jContinue' : 'jTitle')}</strong>}
            {session && <div className="audio-subtitle">
              <span className="audio-language">{LANGUAGES.find(item => item.code === session.language)?.label}</span>
              <span className={'audio-status ' + (playing ? 'is-playing' : '')}><span />{t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}</span>
            </div>}
          </div>
          <button type="button" className="audio-close" aria-label={t('closePlayer')}
            title={t('closePlayer')} onClick={() => engine.close()}><span aria-hidden="true">×</span></button>
        </header>
        {state.restore && <div className="audio-notice">
          {state.changed && <p>{t('jVersionChanged')}</p>}
          <div className="resume-actions">
            <button type="button" onClick={() => { void resumeSaved() }}><Icon name="play" />{t('jContinue')}</button>
            <button type="button" className="secondary" onClick={() => engine.dismissRestore()}>{t('jDiscard')}</button>
          </div>
        </div>}
        {playbackError && <div className="audio-error" role="alert"><span>{t(playbackError)}</span>
          {(state.status === 'error' || playbackError === 'loadError') && <button type="button" className="secondary" onClick={() => engine.retry()}>{t('jRetry')}</button>}
        </div>}
        {busy && <p className="audio-loading" role="status"><span className="loading-dot" />{t('jPreparing')}</p>}
        {session && <>
          <div className="audio-timeline">
            <input type="range" min={0} max={session.duration} step={0.1} value={session.position}
              aria-label={t('jSeek')} disabled={disabled}
              style={{ background: `linear-gradient(to right, var(--playerAccent) ${session.position / session.duration * 100}%, var(--playerControl) 0%)` }}
              onChange={event => { void engine.seek(Number(event.target.value)) }} />
            <div className="audio-times"><span>{clock(session.position)}</span><span>{clock(session.duration)}</span></div>
          </div>
          {/* CHỨC NĂNG: Nhóm phát/tua luôn ở chính giữa; tốc độ là một hàng riêng cân đối. */}
          <div className="audio-transport">
            <button type="button" className="audio-skip" aria-label={t('jBack')} title={t('jBack')} disabled={disabled}
              onClick={() => { void engine.seek(session.position - 10) }}><Icon name="backward" /></button>
            <button type="button" className="audio-play" aria-label={primaryLabel} title={primaryLabel} disabled={busy} onClick={toggle}>
              <Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} /></button>
            <button type="button" className="audio-skip" aria-label={t('jForward')} title={t('jForward')} disabled={disabled}
              onClick={() => { void engine.seek(session.position + 10) }}><Icon name="forward" /></button>
          </div>
          <div className="audio-rates" role="group" aria-label={t('jSpeed')}>
            <span>{t('jSpeed')}</span>
            {[0.75, 1, 1.25, 1.5, 2].map(rate => <button key={rate} type="button"
              aria-label={t('jSpeed') + ' ' + rate + '×'} aria-pressed={rate === session.rate}
              disabled={disabled} onClick={() => engine.rate(rate)}>{rate}×</button>)}
          </div>
        </>}
      </section>
    </aside>
  )
}
// TẠI SAO (JourneyPlayer): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
