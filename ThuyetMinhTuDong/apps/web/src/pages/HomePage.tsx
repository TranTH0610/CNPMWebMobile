/**
 * FILE NÀY LÀM GÌ
 * Trang chủ web với hero, ô tìm kiếm, danh mục, carousel điểm nổi bật và danh mục bên dưới.
 *
 * VỊ TRÍ: apps/web/src/pages/HomePage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: ../services/placeImages; ../components/Catalogue; react; react-router-dom;
 * @travelguide/visitor-core; ../hooks/usePlaces; ../i18n/index; ../components/index
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../services/placeImages'.
import { resolvePlaceImage } from '../services/placeImages'
// Nhập các thành phần từ '../components/Catalogue'.
import { Catalogue } from '../components/Catalogue'
// Nhập các thành phần từ 'react'.
import { useEffect, useMemo, useRef, useState } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { Link, useNavigate } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryOf, HERO_IMAGE } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../hooks/usePlaces'.
import { usePublishedCatalog } from '../hooks/usePlaces'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../components/index'.
import { CategoryChips, Icon, PlaceCard, State } from '../components/index'

// CHỨC NĂNG: Trang chủ gồm hero, carousel và danh sách.
// XỬ LÝ: Tải service một lần tại trang; chia cùng dữ liệu cho các khối.
// Khai báo HomePage(). Component hàm nhận props và dựng phần giao diện HomePage.
export function HomePage() {
  // Khai báo data: usePublishedCatalog nạp danh mục công bố và trạng thái tải/lỗi dùng bởi giao diện du khách.
  const data = usePublishedCatalog()
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo navigate: useNavigate() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
  const navigate = useNavigate()

  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
  // Khai báo [query, setQuery]: useState('') giữ trạng thái qua các lần render.
  const [query, setQuery] = useState('')
  // CHỨC NĂNG: Đánh dấu ô tìm kiếm còn trống khi gửi để hiển thị gợi ý nhập.
  // Khai báo [searchRequired, setSearchRequired]: useState(false) giữ trạng thái qua các lần render.
  const [searchRequired, setSearchRequired] = useState(false)
  // CHỨC NĂNG: Tham chiếu ô tìm kiếm để đưa con trỏ về khi người dùng gửi từ khóa rỗng.
  // Khai báo searchInput: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const searchInput = useRef<HTMLInputElement>(null)
  // CHỨC NĂNG: Các danh mục đang được chọn để lọc danh sách.
  // Khai báo [selected, setSelected]: useState([]) giữ trạng thái qua các lần render.
  const [selected, setSelected] = useState<Category[]>([])
  // CHỨC NĂNG: Ghi nhận ảnh lỗi để chuyển sang giao diện thay thế.
  // Khai báo [failedImage, setFailedImage]: useState(false) giữ trạng thái qua các lần render.
  const [failedImage, setFailedImage] = useState(false)

  // CHỨC NĂNG: Tham chiếu vùng thẻ cuộn ngang để đo kích thước và điều khiển cuộn.
  // Khai báo carousel: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const carousel = useRef<HTMLDivElement>(null)
  // CHỨC NĂNG: Trạng thái tràn nội dung và vị trí hai đầu để bật/tắt nút cuộn phù hợp.
  // Khai báo [carouselState, setCarouselState]: useState({ overflow: false, atStart: true, atEnd: true) giữ trạng thái qua các lần render. | Gán thuộc tính overflow: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính atStart: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính atEnd: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const [carouselState, setCarouselState] = useState({ overflow: false, atStart: true, atEnd: true })

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const categories = [`: Khai báo categories: tạo mảng [ ...new Set(data.places.map(categoryOf)), ].
   * DÒNG `...new Set(data.places.map(categoryOf)),`: Khai báo categories: tạo mảng [ ...new Set(data.places.map(categoryOf)), ].
   * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
   */
  const categories = [
    ...new Set(data.places.map(categoryOf)),
  ]

  // CHỨC NĂNG: Chọn danh mục cập nhật ngay cả thẻ nổi bật và danh sách bên dưới.
  // XỬ LÝ: Không dùng từ khóa chưa gửi để tránh lọc ngoài ý muốn khi đang gõ.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const featured = useMemo(() => data.places.filter(`: Khai báo featured: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `(place) => place.featured && (!selected.length || selected.includes(categoryOf(place)`: Khai báo featured: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `), [data.places, selected])`: Khai báo featured: useMemo lưu kết quả theo mảng phụ thuộc.
   */
  const featured = useMemo(() => data.places.filter(
    (place) => place.featured && (!selected.length || selected.includes(categoryOf(place))),
  ), [data.places, selected])

  // CHỨC NĂNG: Chỉ hiện mũi tên khi có nội dung thật sự tràn chiều ngang.
  // XỬ LÝ: Đổi danh mục về đầu carousel; đo lại khi resize và khóa nút ở hai đầu.
  // DÒNG NÀY LÀM GÌ: Đo vùng thẻ nổi bật, xác định nội dung có tràn và carousel đang ở hai đầu hay
  // chưa.
  // CÁCH HOẠT ĐỘNG: Reset về đầu khi dữ liệu đổi; theo dõi scroll/resize và ResizeObserver;
  // cleanup gỡ cả ba.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: featured,
  // data.loading, data.error.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo node: đọc carousel.current từ đối tượng/mảng để dùng tại bước hiện tại.
    const node = carousel.current
    // Khai báo update: khai báo callback () => { const end = node ? Math.max(0, node.scrollWidth - node.clientWidth).
    const update = () => {
      // Khai báo end: chọn giữa hai giá trị theo điều kiện node.
      const end = node ? Math.max(0, node.scrollWidth - node.clientWidth) : 0
      // Khai báo next: tạo object gồm overflow, atStart, atEnd. | Gán thuộc tính overflow: tính biểu thức end > 1. | Gán thuộc tính atStart: tính biểu thức !node || node.scrollLeft <= 1.
      const next = { overflow: end > 1, atStart: !node || node.scrollLeft <= 1,
        // Gán thuộc tính atEnd: tính biểu thức !node || node.scrollLeft >= end - 1.
        atEnd: !node || node.scrollLeft >= end - 1 }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `setCarouselState(previous => previous.overflow === next.overflow && previous.atStart `: Cập nhật trạng thái qua setCarouselState(previous => previous.overflow === next.overflow && previous.atStart === next.atStart && previous.atEnd.
       * DÒNG `&& previous.atEnd === next.atEnd ? previous : next)`: Cập nhật trạng thái qua setCarouselState(previous => previous.overflow === next.overflow && previous.atStart === next.atStart && previous.atEnd.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      setCarouselState(previous => previous.overflow === next.overflow && previous.atStart === next.atStart
        && previous.atEnd === next.atEnd ? previous : next)
    }
    // TẠI SAO (update): Kích thước vùng cuộn thay đổi theo màn hình và số thẻ; đo DOM thật để biết
    // mũi tên nào còn có thể cuộn.
    // Rẽ nhánh nếu !node. | Thực hiện Gọi update(). | Thoát hàm hiện tại ngay.
    if (!node) { update(); return }
    // Thực hiện tính biểu thức node.scrollLeft = 0.
    node.scrollLeft = 0
    // Thực hiện Gọi update().
    update()
    // Đăng ký xử lý sự kiện: node.addEventListener('scroll', update, { passive: true }). | Gán thuộc tính passive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    node.addEventListener('scroll', update, { passive: true })
    // Đăng ký xử lý sự kiện: window.addEventListener('resize', update).
    window.addEventListener('resize', update)
    // Khai báo observer: chọn giữa hai giá trị theo điều kiện typeof ResizeObserver !== 'undefined'.
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined
    // Thực hiện Gọi observer?.observe(node).
    observer?.observe(node)
    // Trả kết quả: khai báo callback () => { node.removeEventListener('scroll', update) window.removeEventListen.
    return () => {
      // Dọn đăng ký/timer: node.removeEventListener('scroll', update).
      node.removeEventListener('scroll', update)
      // Dọn đăng ký/timer: window.removeEventListener('resize', update).
      window.removeEventListener('resize', update)
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `observer?.disconnect()`: Dọn đăng ký/timer: observer?.disconnect().
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [featured, data.loading, data.error])`: Đăng ký useEffect để thực hiện tác vụ sau render.
       */
      observer?.disconnect()
    }
  }, [featured, data.loading, data.error])
  // TẠI SAO: Chỉ hiện và bật mũi tên khi thật sự cuộn được; tránh nút cuộn vô hiệu hoặc listener
  // tăng sau mỗi lần đổi bộ lọc.

  // CHỨC NĂNG: Chuyển điều kiện tìm từ hero sang trang kết quả.
  // XỬ LÝ: URLSearchParams mã hóa từ khóa đúng, không tự ghép ký tự đặc biệt.
  // Khai báo submit: khai báo callback () => { // CHỨC NĂNG: Yêu cầu nhập từ khóa khi gửi tìm kiếm. // XỬ LÝ: trim.
  const submit = () => {
    // CHỨC NĂNG: Yêu cầu nhập từ khóa khi gửi tìm kiếm.
    // XỬ LÝ: trim loại khoảng trắng; giữ nguyên trang và đưa con trỏ về ô nhập.
    // Rẽ nhánh nếu !query.trim().
    if (!query.trim()) {
      // Cập nhật trạng thái qua setSearchRequired(true).
      setSearchRequired(true)
      // Thực hiện Gọi searchInput.current?.focus().
      searchInput.current?.focus()
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return`: Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return
    }
    // Cập nhật trạng thái qua setSearchRequired(false).
    setSearchRequired(false)
    // Khai báo params: URLSearchParams mã hóa/đọc tham số URL đúng với dấu cách và ký tự đặc biệt.
    const params = new URLSearchParams()

    // Rẽ nhánh nếu query.trim(). | Thực hiện Gọi params.set('q', query.trim()).
    if (query.trim()) params.set('q', query.trim())
    // Rẽ nhánh nếu selected[0]. | Thực hiện Gọi params.set('category', selected[0]).
    if (selected[0]) params.set('category', selected[0])

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `navigate('/places?' + params.toString())`: Thực hiện Gọi navigate('/places?' + params.toString()).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    navigate('/places?' + params.toString())
  }
  // TẠI SAO (submit): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng biết
  // cần nhập gì và giữ được điều kiện tìm hợp lệ.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<>`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<section className="hero">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{!failedImage && (`: Đưa biểu thức JavaScript !failedImage && ( <img className="hero-image" src={resolvePlaceImage(HERO_IMAGE)} alt="" fetchPriority="high"  vào JSX.
   * DÒNG `<img`: Dựng img.
   * DÒNG `className="hero-image"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `src={resolvePlaceImage(HERO_IMAGE)}`: Thuộc tính src: chỉ định nguồn tài nguyên cần tải.
   * DÒNG `alt=""`: Thuộc tính alt: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `fetchPriority="high"`: Thuộc tính fetchPriority: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onError={() => setFailedImage(true)}`: Thuộc tính onError: nhận lỗi tài nguyên để có thể hiển thị trạng thái thay thế.
   * DÒNG `/>`: Dựng img.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<div className="hero-shade" />`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div className="hero-content">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<p className="eyebrow">{t('explore')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<h1>{t('site')}</h1>`: Dựng h1.
   * DÒNG `<p>{t('heroSubtitle')}</p>`: Dựng p.
   * DÒNG `<form`: Dựng form.
   * DÒNG `className="hero-search"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `onSubmit={(event) => {`: Thuộc tính onSubmit: xử lý gửi form.
   * DÒNG `event.preventDefault()`: Chặn hành vi mặc định của sự kiện.
   * DÒNG `submit()`: Thực hiện Gọi submit().
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng form.
   * DÒNG `<Icon name="search" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<input`: Dựng input.
   * DÒNG `ref={searchInput}`: Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước.
   * DÒNG `type="search"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `aria-invalid={searchRequired}`: Thuộc tính aria-invalid: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `aria-describedby={searchRequired ? 'hero-search-error' : undefined}`: Thuộc tính aria-describedby: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `value={query}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `onChange={(event) => {`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `setQuery(event.target.value)`: Cập nhật trạng thái qua setQuery(event.target.value).
   * DÒNG `if (event.target.value.trim()) setSearchRequired(false)`: Rẽ nhánh nếu event.target.value.trim(). | Cập nhật trạng thái qua setSearchRequired(false).
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `aria-label={t('search')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `placeholder={t('search')}`: Thuộc tính placeholder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng input.
   * DÒNG `<button type="submit">`: Dựng button. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Icon name="search" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{t('searchButton')}`: Đưa biểu thức JavaScript t('searchButton') vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</form>`: Đóng phần giao diện form.
   * DÒNG `{searchRequired && (`: Đưa biểu thức JavaScript searchRequired && ( <p id="hero-search-error" className="hero-search-error" role="alert"> {t('searchRequired') vào JSX.
   * DÒNG `<p id="hero-search-error" className="hero-search-error" role="alert">`: Dựng p. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{t('searchRequired')}`: Đưa biểu thức JavaScript t('searchRequired') vào JSX.
   * DÒNG `</p>`: Đóng phần giao diện p.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<CategoryChips`: Dựng CategoryChips.
   * DÒNG `categories={categories}`: Thuộc tính categories: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `selected={selected}`: Thuộc tính selected: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSelect={setSelected}`: Thuộc tính onSelect: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng CategoryChips.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</section>`: Đóng phần giao diện section.
   * DÒNG `<section className="panel featured-panel">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div className="section-title">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div>`: Dựng div.
   * DÒNG `<h2>{t('featured')}</h2>`: Dựng h2.
   * DÒNG `<p>{t('featuredHint')}</p>`: Dựng p.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<Link to="/places">`: Dựng Link. | Đặt đường dẫn mở khi người dùng bấm liên kết.
   * DÒNG `{t('viewAll')} →`: Đưa biểu thức JavaScript t('viewAll') vào JSX.
   * DÒNG `</Link>`: Đóng phần giao diện Link.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `{data.loading ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<State message="loading" busy />`: Dựng State. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính busy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `) : data.error ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<State`: Dựng State.
   * DÒNG `message="loadError"`: Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `retry={() => {`: Thuộc tính retry: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `void data.reload()`: Thực hiện sử dụng void data.reload() làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng State.
   * DÒNG `) : !featured.length ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<div className="featured-empty" role="status">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Icon name="search" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<div><strong>{t('featuredEmpty')}</strong><p>{t('featuredEmptyHint')}</p></div>`: Dựng div.
   * DÒNG `{!!selected.length && <button className="secondary" onClick={() => setSelected([])}>{`: Đưa biểu thức JavaScript !!selected.length && <button className="secondary" onClick={() => setSelected([])}>{t('clearAll')}</button> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `) : (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<div className="carousel-wrap">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div ref={carousel} className="featured-carousel">`: Dựng div. | Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{featured.map((place) => (`: Đưa biểu thức JavaScript featured.map((place) => ( <PlaceCard key={place.id} place={place} /> )) vào JSX.
   * DÒNG `<PlaceCard key={place.id} place={place} />`: Dựng PlaceCard. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `{carouselState.overflow && <div className="carousel-actions">`: Đưa biểu thức JavaScript carouselState.overflow && <div className="carousel-actions"> <button className="icon-button" aria-label={t('pr vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="icon-button"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-label={t('previous')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `disabled={carouselState.atStart}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => carousel.current?.scrollBy({`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `left: -280,`: Gán thuộc tính left: sử dụng -280 làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `behavior: 'smooth',`: Gán thuộc tính behavior: chuỗi 'smooth'.
   * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng button.
   * DÒNG `‹`: Đưa biểu thức JavaScript carouselState.overflow && <div className="carousel-actions"> <button className="icon-button" aria-label={t('pr vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="icon-button"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-label={t('next')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `disabled={carouselState.atEnd}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => carousel.current?.scrollBy({`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `left: 280,`: Gán thuộc tính left: giá trị số 280.
   * DÒNG `behavior: 'smooth',`: Gán thuộc tính behavior: chuỗi 'smooth'.
   * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng button.
   * DÒNG `›`: Đưa biểu thức JavaScript carouselState.overflow && <div className="carousel-actions"> <button className="icon-button" aria-label={t('pr vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</div>}`: Đóng phần giao diện div.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</section>`: Đóng phần giao diện section.
   * DÒNG `<Catalogue data={data} categorySelection={selected} onCategorySelectionChange={setSel`: Dựng Catalogue. | Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách. | Thuộc tính categorySelection: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onCategorySelectionChange: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <>
      <section className="hero">
        {!failedImage && (
          <img
            className="hero-image"
            src={resolvePlaceImage(HERO_IMAGE)}
            alt=""
            fetchPriority="high"
            onError={() => setFailedImage(true)}
          />
        )}

        <div className="hero-shade" />

        <div className="hero-content">
          <p className="eyebrow">{t('explore')}</p>
          <h1>{t('site')}</h1>
          <p>{t('heroSubtitle')}</p>

          <form
            className="hero-search"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <Icon name="search" />

            <input
              ref={searchInput}
              type="search"
              aria-invalid={searchRequired}
              aria-describedby={searchRequired ? 'hero-search-error' : undefined}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                if (event.target.value.trim()) setSearchRequired(false)
              }}
              aria-label={t('search')}
              placeholder={t('search')}
            />

            <button type="submit">
              <Icon name="search" />
              {t('searchButton')}
            </button>
          </form>

          {searchRequired && (
            <p id="hero-search-error" className="hero-search-error" role="alert">
              {t('searchRequired')}
            </p>
          )}

          <CategoryChips
            categories={categories}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </section>

      <section className="panel featured-panel">
        <div className="section-title">
          <div>
            <h2>{t('featured')}</h2>
            <p>{t('featuredHint')}</p>
          </div>

          <Link to="/places">
            {t('viewAll')} →
          </Link>
        </div>

        {data.loading ? (
          <State message="loading" busy />
        ) : data.error ? (
          <State
            message="loadError"
            retry={() => {
              void data.reload()
            }}
          />
        ) : !featured.length ? (
          // CHỨC NĂNG: Không để khung trắng khi danh mục có địa điểm nhưng không có điểm nổi bật.
          // XỬ LÝ: Không tự gắn nhãn nổi bật cho điểm thường; danh sách bên dưới vẫn giữ lọc.
          <div className="featured-empty" role="status">
            <Icon name="search" />
            <div><strong>{t('featuredEmpty')}</strong><p>{t('featuredEmptyHint')}</p></div>
            {!!selected.length && <button className="secondary" onClick={() => setSelected([])}>{t('clearAll')}</button>}
          </div>
        ) : (
          <div className="carousel-wrap">
            <div ref={carousel} className="featured-carousel">
              {featured.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {carouselState.overflow && <div className="carousel-actions">
              <button
                className="icon-button"
                aria-label={t('previous')}
                disabled={carouselState.atStart}
                onClick={() => carousel.current?.scrollBy({
                  left: -280,
                  behavior: 'smooth',
                })}
              >
                ‹
              </button>

              <button
                className="icon-button"
                aria-label={t('next')}
                disabled={carouselState.atEnd}
                onClick={() => carousel.current?.scrollBy({
                  left: 280,
                  behavior: 'smooth',
                })}
              >
                ›
              </button>
            </div>}
          </div>
        )}
      </section>

      <Catalogue data={data} categorySelection={selected} onCategorySelectionChange={setSelected} />
    </>
  )
}
// TẠI SAO (HomePage): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng biết
// cần nhập gì và giữ được điều kiện tìm hợp lệ.
