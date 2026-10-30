/**
 * FILE NÀY LÀM GÌ
 * Danh mục web gồm tìm kiếm, danh mục/khu vực, sắp xếp, chế độ lưới/danh sách và phân trang.
 *
 * VỊ TRÍ: apps/web/src/components/Catalogue.tsx
 * DÙNG BỞI: apps/web/src/pages/HomePage.tsx; apps/web/src/pages/PlacesPage.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; ./State; ./PlaceCard; react; ../hooks/usePlaces;
 * ../i18n/index; ../hooks/useVisitor; ./index; ../services/platform
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryOf, distanceTo, paginate, publishedText } from '@travelguide/visitor-core'
// Nhập các thành phần từ './State'.
import { State } from './State'
// Nhập các thành phần từ './PlaceCard'.
import { PlaceCard } from './PlaceCard'
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../hooks/usePlaces'.
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ './index'.
import { Icon } from './index'
// Nhập các thành phần từ '../services/platform'.
import { getPosition } from '../services/platform'

// Đặt tên kiểu Data.
type Data = ReturnType<typeof usePublishedCatalog>
// CHỨC NĂNG: Sidebar lọc, kết quả, đổi bố cục và phân trang.
// XỬ LÝ: Hook chịu nghiệp vụ; component chỉ quản lý trạng thái hiển thị.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function Catalogue({`: Khai báo Catalogue({ data, initial, categorySelection, onCategorySelectionChange, }). Component hàm nhận props và dựng phần giao diện Catalogue.
 * DÒNG `data,`: Nhận đầu vào { data, initial, categorySelection, onCategorySelectionChange, }: { data: Data categorySelectio từ nơi gọi hàm.
 * DÒNG `initial,`: Nhận đầu vào { data, initial, categorySelection, onCategorySelectionChange, }: { data: Data categorySelectio từ nơi gọi hàm.
 * DÒNG `categorySelection,`: Nhận đầu vào { data, initial, categorySelection, onCategorySelectionChange, }: { data: Data categorySelectio từ nơi gọi hàm.
 * DÒNG `onCategorySelectionChange,`: Nhận đầu vào { data, initial, categorySelection, onCategorySelectionChange, }: { data: Data categorySelectio từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { data, initial, categorySelection, onCategorySelectionChange, }: { data: Data categorySelectio từ nơi gọi hàm.
 */
export function Catalogue({
  data,
  initial,
  categorySelection,
  onCategorySelectionChange,
}: {
  // Khai báo data, kiểu Data.
  data: Data
  // Khai báo categorySelection không bắt buộc, kiểu readonly Category[].
  categorySelection?: readonly Category[]
  // Khai báo onCategorySelectionChange không bắt buộc, kiểu (value: Category[]) => void.
  onCategorySelectionChange?: (value: Category[]) => void
  // Khai báo initial không bắt buộc, kiểu { query?: string category?: Category }.
  initial?: {
    // Khai báo query không bắt buộc, kiểu string.
    query?: string
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `category?: Category`: Khai báo category không bắt buộc, kiểu Category.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    category?: Category
  }
}) {
  // Khai báo position: Gọi useVisitorPosition(getPosition).
  const position = useVisitorPosition(getPosition)
  // Khai báo filters: Gọi useExplore(data.places, position.origin, initial).
  const filters = useExplore(data.places, position.origin, initial)
  // CHỨC NĂNG: Nhận thay đổi danh mục từ các chip trên trang chủ ngay lập tức.
  // XỬ LÝ: Chỉ đồng bộ khi lựa chọn bên ngoài đổi; không remount nên giữ bố cục và vị trí.
  // Khai báo { setCategories }: sử dụng filters làm giá trị của bước hiện tại.
  const { setCategories } = filters
  // DÒNG NÀY LÀM GÌ: Nếu cha có truyền categorySelection, sao chép lựa chọn đó vào bộ lọc của
  // Catalogue.
  // CÁCH HOẠT ĐỘNG: Không đồng bộ khi prop là undefined; mảng sao chép không dùng chung tham chiếu
  // để sửa trực tiếp prop.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi:
  // categorySelection, setCategories.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (categorySelection !== undefined) setCategories([...categorySelection])`: Rẽ nhánh nếu categorySelection !== undefined. | Cập nhật trạng thái qua setCategories([...categorySelection]).
     * DÒNG `}, [categorySelection, setCategories])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    if (categorySelection !== undefined) setCategories([...categorySelection])
  }, [categorySelection, setCategories])
  // TẠI SAO: Chip ở trang chủ và bộ lọc danh mục phải hiển thị cùng lựa chọn khi được điều khiển
  // từ bên ngoài.

  // CHỨC NĂNG: Checkbox và chip hero luôn thể hiện cùng một lựa chọn.
  // XỬ LÝ: Cập nhật cha qua callback chỉ khi người dùng thao tác, tránh vòng lặp effect.
  // Khai báo changeCategories: khai báo callback (value: Category[]) => { filters.setCategories(value) onCategorySelectionCh.
  const changeCategories = (value: Category[]) => {
    // Thực hiện Gọi filters.setCategories(value).
    filters.setCategories(value)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `onCategorySelectionChange?.(value)`: Thực hiện Gọi onCategorySelectionChange?.(value).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    onCategorySelectionChange?.(value)
  }
  // TẠI SAO (changeCategories): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa
  // giao diện tại một nơi.
  // Khai báo clearFilters: khai báo callback () => { filters.reset() onCategorySelectionChange?.([]) }.
  const clearFilters = () => {
    // Thực hiện Gọi filters.reset().
    filters.reset()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `onCategorySelectionChange?.([])`: Thực hiện Gọi onCategorySelectionChange?.([]).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    onCategorySelectionChange?.([])
  }
  // TẠI SAO (clearFilters): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
  // diện tại một nơi.

  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // CHỨC NĂNG: Trang kết quả hiện tại để chỉ hiển thị một phần danh sách.
  // Khai báo [page, setPage]: useState(1) giữ trạng thái qua các lần render.
  const [page, setPage] = useState(1)
  // Khai báo [view, setView]: useState('grid') giữ trạng thái qua các lần render.
  const [view, setView] = useState<'grid' | 'list'>('grid')
  // Khai báo [filterOpen, setFilterOpen]: useState(false) giữ trạng thái qua các lần render.
  const [filterOpen, setFilterOpen] = useState(false)

  // Khai báo paged: Gọi paginate(filters.results, page, 6).
  const paged = paginate(filters.results, page, 6)

  // CHỨC NĂNG: Đổi điều kiện thì quay về trang 1.
  // XỬ LÝ: paginate vẫn giới hạn trang ngay trước khi effect chạy.
  // DÒNG NÀY LÀM GÌ: Đưa phân trang về trang 1 khi điều kiện tìm/lọc/sắp xếp hoặc ngôn ngữ đổi.
  // CÁCH HOẠT ĐỘNG: Không giữ trang cũ khi tập kết quả đã thay đổi.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: filters.query,
  // filters.categories, filters.zones, filters.order, language.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `setPage(1)`: Cập nhật trạng thái qua setPage(1).
     * DÒNG `}, [`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `filters.query,`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `filters.categories,`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `filters.zones,`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `filters.order,`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `language,`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `])`: Kết thúc danh sách phần tử trong mảng.
     */
    setPage(1)
  }, [
    filters.query,
    filters.categories,
    filters.zones,
    filters.order,
    language,
  ])
  // TẠI SAO: Trang trước có thể lớn hơn số trang mới, khiến giao diện rỗng dù vẫn có kết quả phù
  // hợp.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const missing = data.places.some(`: Khai báo missing: data.places.some kiểm tra có ít nhất một phần tử đạt điều kiện.
   * DÒNG `(place) => !publishedText(place, language),`: Khai báo missing: data.places.some kiểm tra có ít nhất một phần tử đạt điều kiện.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const missing = data.places.some(
    (place) => !publishedText(place, language),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<section className="panel catalogue" id="catalogue">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<div className="section-title catalogue-heading">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div>`: Dựng div.
   * DÒNG `<h2>{t('allPlaces')}</h2>`: Dựng h2.
   * DÒNG `<p>{t('results')}: {filters.results.length}</p>`: Dựng p.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<div className="sort-controls">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<label>`: Dựng label.
   * DÒNG `{t('sort')}`: Đưa biểu thức JavaScript t('sort') vào JSX.
   * DÒNG `<select`: Dựng select.
   * DÒNG `aria-label={t('sort')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `value={filters.order}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `onChange={(event) => {`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `const order =`: Khai báo order: chọn giữa hai giá trị theo điều kiện event.target.value === 'nearest'.
   * DÒNG `event.target.value === 'nearest'`: Khai báo order: chọn giữa hai giá trị theo điều kiện event.target.value === 'nearest'.
   * DÒNG `? 'nearest'`: Khai báo order: chọn giữa hai giá trị theo điều kiện event.target.value === 'nearest'.
   * DÒNG `: 'name'`: Khai báo order: chọn giữa hai giá trị theo điều kiện event.target.value === 'nearest'.
   * DÒNG `filters.setOrder(order)`: Thực hiện Gọi filters.setOrder(order).
   * DÒNG `if (order === 'nearest' && !position.origin) {`: Rẽ nhánh nếu order === 'nearest' && !position.origin.
   * DÒNG `void position.request()`: Thực hiện sử dụng void position.request() làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng select.
   * DÒNG `<option value="nearest">{t('nearest')}</option>`: Dựng option. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `<option value="name">{t('name')}</option>`: Dựng option. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `</select>`: Đóng phần giao diện select.
   * DÒNG `</label>`: Đóng phần giao diện label.
   * DÒNG `<div className="view-switch">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="icon-button"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-label={t('grid')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `aria-pressed={view === 'grid'}`: Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onClick={() => setView('grid')}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `<Icon name="grid" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="icon-button"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-label={t('list')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `aria-pressed={view === 'list'}`: Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onClick={() => setView('list')}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `<Icon name="list" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="mobile-filters secondary"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-expanded={filterOpen}`: Thuộc tính aria-expanded: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `aria-controls="place-filters"`: Thuộc tính aria-controls: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onClick={() => setFilterOpen(!filterOpen)}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `{t('filters')}`: Đưa biểu thức JavaScript t('filters') vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `<div className="catalog-layout">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<aside`: Dựng aside.
   * DÒNG `id="place-filters"`: Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `className={'filters ' + (filterOpen ? 'filters-open' : '')}`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-label={t('filters')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `>`: Dựng aside.
   * DÒNG `<div className="section-title">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<strong>{t('filters')}</strong>`: Dựng strong.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="text-button"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `onClick={clearFilters}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `{t('clearAll')}`: Đưa biểu thức JavaScript t('clearAll') vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<div className="filter-search-group">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<label className="filter-search-label" htmlFor="catalogue-search">`: Dựng label. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính htmlFor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{t('searchButton')}`: Đưa biểu thức JavaScript t('searchButton') vào JSX.
   * DÒNG `</label>`: Đóng phần giao diện label.
   * DÒNG `<div className="search-field filter-search-field">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<Icon name="search" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<input`: Dựng input.
   * DÒNG `id="catalogue-search"`: Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `type="search"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `placeholder={t('searchKeyword')}`: Thuộc tính placeholder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `value={filters.query}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `onChange={(event) => filters.setQuery(event.target.value)}`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `/>`: Dựng input.
   * DÒNG `{filters.query && (`: Đưa biểu thức JavaScript filters.query && ( <button type="button" className="filter-search-clear" aria-label={t('clearSearch')} onClick vào JSX.
   * DÒNG `<button`: Dựng button.
   * DÒNG `type="button"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `className="filter-search-clear"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `aria-label={t('clearSearch')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `onClick={() => filters.setQuery('')}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `<span aria-hidden="true">×</span>`: Dựng span. | Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<p className="filter-search-hint">{t('searchFieldsHint')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `{filters.availableCategories.length >= 2 && (`: Đưa biểu thức JavaScript filters.availableCategories.length >= 2 && ( <fieldset> <legend>{t('category')}</legend> <label> <input type=" vào JSX.
   * DÒNG `<fieldset>`: Dựng fieldset.
   * DÒNG `<legend>{t('category')}</legend>`: Dựng legend.
   * DÒNG `<label>`: Dựng label.
   * DÒNG `<input`: Dựng input.
   * DÒNG `type="checkbox"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `checked={!filters.categories.length}`: Thuộc tính checked: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onChange={() => changeCategories([])}`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `/>`: Dựng input.
   * DÒNG `{t('all')} ({data.places.length})`: Đưa biểu thức JavaScript t('all') vào JSX.
   * DÒNG `</label>`: Đóng phần giao diện label.
   * DÒNG `{filters.availableCategories.map((category) => (`: Đưa biểu thức JavaScript filters.availableCategories.map((category) => ( <label key={category}> <input type="checkbox" checked={filters vào JSX.
   * DÒNG `<label key={category}>`: Dựng label. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `<input`: Dựng input.
   * DÒNG `type="checkbox"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `checked={filters.categories.includes(category)}`: Thuộc tính checked: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onChange={(event) => changeCategories(`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `event.target.checked`: Đưa biểu thức JavaScript (event) => changeCategories( event.target.checked ? [...filters.categories, category] : filters.categories.fil vào JSX.
   * DÒNG `? [...filters.categories, category]`: Đưa biểu thức JavaScript (event) => changeCategories( event.target.checked ? [...filters.categories, category] : filters.categories.fil vào JSX.
   * DÒNG `: filters.categories.filter(`: Đưa biểu thức JavaScript (event) => changeCategories( event.target.checked ? [...filters.categories, category] : filters.categories.fil vào JSX.
   * DÒNG `(item) => item !== category,`: Đưa biểu thức JavaScript (event) => changeCategories( event.target.checked ? [...filters.categories, category] : filters.categories.fil vào JSX.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `/>`: Dựng input.
   * DÒNG `{t(`category_${category}`)}`: Đưa biểu thức JavaScript t(`category_${category}`) vào JSX.
   * DÒNG `{' '}({`: Đưa biểu thức JavaScript ' ' vào JSX.
   * DÒNG `data.places.filter(`: Đưa biểu thức JavaScript data.places.filter( (place) => categoryOf(place) === category, ).length vào JSX.
   * DÒNG `(place) => categoryOf(place) === category,`: Đưa biểu thức JavaScript data.places.filter( (place) => categoryOf(place) === category, ).length vào JSX.
   * DÒNG `).length`: Đưa biểu thức JavaScript data.places.filter( (place) => categoryOf(place) === category, ).length vào JSX.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `</label>`: Đóng phần giao diện label.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</fieldset>`: Đóng phần giao diện fieldset.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<fieldset>`: Dựng fieldset.
   * DÒNG `<legend>{t('region')}</legend>`: Dựng legend.
   * DÒNG `{filters.availableZones.map((zone) => (`: Đưa biểu thức JavaScript filters.availableZones.map((zone) => ( <label key={zone}> <input type="checkbox" checked={filters.zones.includ vào JSX.
   * DÒNG `<label key={zone}>`: Dựng label. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `<input`: Dựng input.
   * DÒNG `type="checkbox"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `checked={filters.zones.includes(zone)}`: Thuộc tính checked: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onChange={(event) => filters.setZones(`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `event.target.checked`: Đưa biểu thức JavaScript (event) => filters.setZones( event.target.checked ? [...filters.zones, zone] : filters.zones.filter( (item) => vào JSX.
   * DÒNG `? [...filters.zones, zone]`: Đưa biểu thức JavaScript (event) => filters.setZones( event.target.checked ? [...filters.zones, zone] : filters.zones.filter( (item) => vào JSX.
   * DÒNG `: filters.zones.filter(`: Đưa biểu thức JavaScript (event) => filters.setZones( event.target.checked ? [...filters.zones, zone] : filters.zones.filter( (item) => vào JSX.
   * DÒNG `(item) => item !== zone,`: Đưa biểu thức JavaScript (event) => filters.setZones( event.target.checked ? [...filters.zones, zone] : filters.zones.filter( (item) => vào JSX.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `/>`: Dựng input.
   * DÒNG `{t(`: Đưa biểu thức JavaScript t( zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial', ) vào JSX.
   * DÒNG `zone === 'fortifications'`: Đưa biểu thức JavaScript t( zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial', ) vào JSX.
   * DÒNG `? 'zone_fortifications'`: Đưa biểu thức JavaScript t( zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial', ) vào JSX.
   * DÒNG `: 'zone_ceremonial',`: Đưa biểu thức JavaScript t( zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial', ) vào JSX.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `{' '}({`: Đưa biểu thức JavaScript ' ' vào JSX.
   * DÒNG `data.places.filter(`: Đưa biểu thức JavaScript data.places.filter( (place) => place.zone === zone, ).length vào JSX.
   * DÒNG `(place) => place.zone === zone,`: Đưa biểu thức JavaScript data.places.filter( (place) => place.zone === zone, ).length vào JSX.
   * DÒNG `).length`: Đưa biểu thức JavaScript data.places.filter( (place) => place.zone === zone, ).length vào JSX.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `</label>`: Đóng phần giao diện label.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</fieldset>`: Đóng phần giao diện fieldset.
   * DÒNG `<p className="muted">{t('filterHint')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="secondary"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `disabled={position.loading}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => {`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `void position.request()`: Thực hiện sử dụng void position.request() làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng button.
   * DÒNG `{t(`: Đưa biểu thức JavaScript t( position.loading ? 'locationBusy' : 'location', ) vào JSX.
   * DÒNG `position.loading ? 'locationBusy' : 'location',`: Đưa biểu thức JavaScript t( position.loading ? 'locationBusy' : 'location', ) vào JSX.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</aside>`: Đóng phần giao diện aside.
   * DÒNG `<div className="results">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{filters.order === 'nearest'`: Đưa biểu thức JavaScript filters.order === 'nearest' && filters.effectiveOrder === 'name' && ( <p className="muted" role="status"> {t(' vào JSX.
   * DÒNG `&& filters.effectiveOrder === 'name' && (`: Đưa biểu thức JavaScript filters.order === 'nearest' && filters.effectiveOrder === 'name' && ( <p className="muted" role="status"> {t(' vào JSX.
   * DÒNG `<p className="muted" role="status">`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{t('orderFallback')}`: Đưa biểu thức JavaScript t('orderFallback') vào JSX.
   * DÒNG `</p>`: Đóng phần giao diện p.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `{position.failed && (`: Đưa biểu thức JavaScript position.failed && ( <p role="status" className="muted"> {t('locationDenied')} </p> ) vào JSX.
   * DÒNG `<p role="status" className="muted">`: Dựng p. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{t('locationDenied')}`: Đưa biểu thức JavaScript t('locationDenied') vào JSX.
   * DÒNG `</p>`: Đóng phần giao diện p.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `{missing && (`: Đưa biểu thức JavaScript missing && ( <p className="muted">{t('missingList')}</p> ) vào JSX.
   * DÒNG `<p className="muted">{t('missingList')}</p>`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `{data.loading ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<State message="loading" busy />`: Dựng State. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính busy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `) : data.error ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<State`: Dựng State.
   * DÒNG `message="loadError"`: Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `retry={() => {`: Thuộc tính retry: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `void data.reload()`: Thực hiện sử dụng void data.reload() làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng State.
   * DÒNG `) : paged.items.length ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<div`: Dựng div.
   * DÒNG `className={`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `'place-grid '`: Đưa biểu thức JavaScript 'place-grid ' + (view === 'list' ? 'list-view' : '') vào JSX.
   * DÒNG `+ (view === 'list' ? 'list-view' : '')`: Đưa biểu thức JavaScript 'place-grid ' + (view === 'list' ? 'list-view' : '') vào JSX.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng div.
   * DÒNG `{paged.items.map((place) => (`: Đưa biểu thức JavaScript paged.items.map((place) => ( <PlaceCard key={place.id} place={place} distance={distanceTo(place, position.orig vào JSX.
   * DÒNG `<PlaceCard`: Dựng PlaceCard.
   * DÒNG `key={place.id}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `place={place}`: Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `distance={distanceTo(place, position.origin)}`: Thuộc tính distance: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng PlaceCard.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `) : (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<div className="state">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<h3>{t('empty')}</h3>`: Dựng h3.
   * DÒNG `<p>{t('emptyHint')}</p>`: Dựng p.
   * DÒNG `<button onClick={clearFilters}>`: Dựng button. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `{t('clearAll')}`: Đưa biểu thức JavaScript t('clearAll') vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<nav className="pagination" aria-label={t('page')}>`: Dựng nav. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="secondary"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `disabled={paged.page === 1}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => setPage(paged.page - 1)}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `{t('previous')}`: Đưa biểu thức JavaScript t('previous') vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `{Array.from(`: Đưa biểu thức JavaScript Array.from( { length: paged.pages }, (_, index) => index + 1, ).map((number) => ( <button key={number} aria-la vào JSX.
   * DÒNG `{ length: paged.pages },`: Đưa biểu thức JavaScript Array.from( { length: paged.pages }, (_, index) => index + 1, ).map((number) => ( <button key={number} aria-la vào JSX. | Gán thuộc tính length: đọc paged.pages từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `(_, index) => index + 1,`: Đưa biểu thức JavaScript Array.from( { length: paged.pages }, (_, index) => index + 1, ).map((number) => ( <button key={number} aria-la vào JSX.
   * DÒNG `).map((number) => (`: Đưa biểu thức JavaScript Array.from( { length: paged.pages }, (_, index) => index + 1, ).map((number) => ( <button key={number} aria-la vào JSX.
   * DÒNG `<button`: Dựng button.
   * DÒNG `key={number}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `aria-label={t('page') + ' ' + number}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `aria-current={`: Thuộc tính aria-current: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `paged.page === number ? 'page' : undefined`: Đưa biểu thức JavaScript paged.page === number ? 'page' : undefined vào JSX.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `className={`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `paged.page === number ? '' : 'secondary'`: Đưa biểu thức JavaScript paged.page === number ? '' : 'secondary' vào JSX.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `onClick={() => setPage(number)}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `{number}`: Đưa biểu thức JavaScript number vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<button`: Dựng button.
   * DÒNG `className="secondary"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `disabled={paged.page === paged.pages}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onClick={() => setPage(paged.page + 1)}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `{t('next')}`: Đưa biểu thức JavaScript t('next') vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `</nav>`: Đóng phần giao diện nav.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</section>`: Đóng phần giao diện section.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <section className="panel catalogue" id="catalogue">
      <div className="section-title catalogue-heading">
        <div>
          <h2>{t('allPlaces')}</h2>
          <p>{t('results')}: {filters.results.length}</p>
        </div>

        <div className="sort-controls">
          <label>
            {t('sort')}

            <select
              aria-label={t('sort')}
              value={filters.order}
              onChange={(event) => {
                const order =
                  event.target.value === 'nearest'
                    ? 'nearest'
                    : 'name'

                filters.setOrder(order)

                if (order === 'nearest' && !position.origin) {
                  void position.request()
                }
              }}
            >
              <option value="nearest">{t('nearest')}</option>
              <option value="name">{t('name')}</option>
            </select>
          </label>

          <div className="view-switch">
            <button
              className="icon-button"
              aria-label={t('grid')}
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <Icon name="grid" />
            </button>

            <button
              className="icon-button"
              aria-label={t('list')}
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <Icon name="list" />
            </button>
          </div>
        </div>
      </div>

      <button
        className="mobile-filters secondary"
        aria-expanded={filterOpen}
        aria-controls="place-filters"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        {t('filters')}
      </button>

      <div className="catalog-layout">
        <aside
          id="place-filters"
          className={'filters ' + (filterOpen ? 'filters-open' : '')}
          aria-label={t('filters')}
        >
          <div className="section-title">
            <strong>{t('filters')}</strong>

            <button
              className="text-button"
              onClick={clearFilters}
            >
              {t('clearAll')}
            </button>
          </div>

          {/* CHỨC NĂNG: Một ô tìm kiếm duy nhất, có nhãn và nút xóa từ khóa.
              XỬ LÝ: Cập nhật query của hook để lọc sau debounce; không dùng tìm trong kết quả. */}
          <div className="filter-search-group">
            <label className="filter-search-label" htmlFor="catalogue-search">
              {t('searchButton')}
            </label>
            <div className="search-field filter-search-field">
              <Icon name="search" />
              <input
                id="catalogue-search"
                type="search"
                placeholder={t('searchKeyword')}
                value={filters.query}
                onChange={(event) => filters.setQuery(event.target.value)}
              />
              {filters.query && (
                <button
                  type="button"
                  className="filter-search-clear"
                  aria-label={t('clearSearch')}
                  onClick={() => filters.setQuery('')}
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
            <p className="filter-search-hint">{t('searchFieldsHint')}</p>
          </div>

          {filters.availableCategories.length >= 2 && (
            <fieldset>
              <legend>{t('category')}</legend>

              <label>
                <input
                  type="checkbox"
                  checked={!filters.categories.length}
                  onChange={() => changeCategories([])}
                />
                {t('all')} ({data.places.length})
              </label>

              {filters.availableCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(event) => changeCategories(
                      event.target.checked
                        ? [...filters.categories, category]
                        : filters.categories.filter(
                          (item) => item !== category,
                        ),
                    )}
                  />

                  {t(`category_${category}`)}
                  {' '}({
                    data.places.filter(
                      (place) => categoryOf(place) === category,
                    ).length
                  })
                </label>
              ))}
            </fieldset>
          )}

          <fieldset>
            <legend>{t('region')}</legend>

            {filters.availableZones.map((zone) => (
              <label key={zone}>
                <input
                  type="checkbox"
                  checked={filters.zones.includes(zone)}
                  onChange={(event) => filters.setZones(
                    event.target.checked
                      ? [...filters.zones, zone]
                      : filters.zones.filter(
                        (item) => item !== zone,
                      ),
                  )}
                />

                {t(
                  zone === 'fortifications'
                    ? 'zone_fortifications'
                    : 'zone_ceremonial',
                )}

                {' '}({
                  data.places.filter(
                    (place) => place.zone === zone,
                  ).length
                })
              </label>
            ))}
          </fieldset>

          <p className="muted">{t('filterHint')}</p>

          <button
            className="secondary"
            disabled={position.loading}
            onClick={() => {
              void position.request()
            }}
          >
            {t(
              position.loading ? 'locationBusy' : 'location',
            )}
          </button>
        </aside>

        <div className="results">
          {filters.order === 'nearest'
            && filters.effectiveOrder === 'name' && (
            <p className="muted" role="status">
              {t('orderFallback')}
            </p>
          )}

          {position.failed && (
            <p role="status" className="muted">
              {t('locationDenied')}
            </p>
          )}

          {missing && (
            <p className="muted">{t('missingList')}</p>
          )}

          {data.loading ? (
            <State message="loading" busy />
          ) : data.error ? (
            <State
              message="loadError"
              retry={() => {
                void data.reload()
              }}
            />
          ) : paged.items.length ? (
            <div
              className={
                'place-grid '
                + (view === 'list' ? 'list-view' : '')
              }
            >
              {paged.items.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  distance={distanceTo(place, position.origin)}
                />
              ))}
            </div>
          ) : (
            <div className="state">
              <h3>{t('empty')}</h3>
              <p>{t('emptyHint')}</p>
              <button onClick={clearFilters}>
                {t('clearAll')}
              </button>
            </div>
          )}

          <nav className="pagination" aria-label={t('page')}>
            <button
              className="secondary"
              disabled={paged.page === 1}
              onClick={() => setPage(paged.page - 1)}
            >
              {t('previous')}
            </button>

            {Array.from(
              { length: paged.pages },
              (_, index) => index + 1,
            ).map((number) => (
              <button
                key={number}
                aria-label={t('page') + ' ' + number}
                aria-current={
                  paged.page === number ? 'page' : undefined
                }
                className={
                  paged.page === number ? '' : 'secondary'
                }
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="secondary"
              disabled={paged.page === paged.pages}
              onClick={() => setPage(paged.page + 1)}
            >
              {t('next')}
            </button>
          </nav>
        </div>
      </div>
    </section>
  )
}
// TẠI SAO (Catalogue): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
