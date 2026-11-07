/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Danh mục web gồm tìm kiếm, danh mục/khu vực, sắp xếp, chế độ lưới/danh sách và phân trang.
 *
 * VỊ TRÍ: apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 * - apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 * - ../../../shared/components/TrangThaiDuLieu
 * - ./TheDiTich
 * - react
 * - ../hooks/useDanhSachDiTich
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../../../shared/components/BieuTuong
 * - ../../../shared/services/KetNoiNenTang
 *
 * CÁC KHỐI CHÍNH:
 * 1. Catalogue
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { categoryOf, distanceTo, paginate, publishedText } from '@travelguide/visitor-core'
import { State } from '../../../shared/components/TrangThaiDuLieu'
import { PlaceCard } from './TheDiTich'
import { useEffect, useState } from 'react'
import type { Category } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/useDanhSachDiTich'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { Icon } from '../../../shared/components/BieuTuong'
import { getPosition } from '../../../shared/services/KetNoiNenTang'

// Đặt tên kiểu Data.
type Data = ReturnType<typeof usePublishedCatalog>
// CHỨC NĂNG: Sidebar lọc, kết quả, đổi bố cục và phân trang.
// XỬ LÝ: Hook chịu nghiệp vụ; component chỉ quản lý trạng thái hiển thị.

// ==================== [KHAM-PHA] Catalogue ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function Catalogue({
  data,
  initial,
  categorySelection,
  onCategorySelectionChange,
}: {
  data: Data

  categorySelection?: readonly Category[]

  onCategorySelectionChange?: (value: Category[]) => void

  initial?: {
    query?: string

    category?: Category
  }
}) {
  const position = useVisitorPosition(getPosition)

  const filters = useExplore(data.places, position.origin, initial)
  // CHỨC NĂNG: Nhận thay đổi danh mục từ các chip trên trang chủ ngay lập tức.
  // XỬ LÝ: Chỉ đồng bộ khi lựa chọn bên ngoài đổi; không remount nên giữ bố cục và vị trí.

  const { setCategories } = filters
  // CHỨC NĂNG: Nếu cha có truyền categorySelection, sao chép lựa chọn đó vào bộ lọc của
  // Catalogue.
  // XỬ LÝ: Không đồng bộ khi prop là undefined; mảng sao chép không dùng chung tham chiếu
  // để sửa trực tiếp prop.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi:
  // categorySelection, setCategories.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    if (categorySelection !== undefined) setCategories([...categorySelection])
  }, [categorySelection, setCategories])
  // TẠI SAO: Chip ở trang chủ và bộ lọc danh mục phải hiển thị cùng lựa chọn khi được điều khiển
  // từ bên ngoài.

  // CHỨC NĂNG: Checkbox và chip hero luôn thể hiện cùng một lựa chọn.
  // XỬ LÝ: Cập nhật cha qua callback chỉ khi người dùng thao tác, tránh vòng lặp effect.

  const changeCategories = (value: Category[]) => {
    filters.setCategories(value)

    onCategorySelectionChange?.(value)
  }
  // TẠI SAO (changeCategories): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa
  // giao diện tại một nơi.

  const clearFilters = () => {
    filters.reset()

    onCategorySelectionChange?.([])
  }
  // TẠI SAO (clearFilters): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
  // diện tại một nơi.

  const { language } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Trang kết quả hiện tại để chỉ hiển thị một phần danh sách.

  const [page, setPage] = useState(1)

  const [view, setView] = useState<'grid' | 'list'>('grid')

  const [filterOpen, setFilterOpen] = useState(false)

  const paged = paginate(filters.results, page, 6)

  // CHỨC NĂNG: Đổi điều kiện thì quay về trang 1.
  // XỬ LÝ: paginate vẫn giới hạn trang ngay trước khi effect chạy.
  // CHỨC NĂNG: Đưa phân trang về trang 1 khi điều kiện tìm/lọc/sắp xếp hoặc ngôn ngữ đổi.
  // XỬ LÝ: Không giữ trang cũ khi tập kết quả đã thay đổi.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: filters.query,
  // filters.categories, filters.zones, filters.order, language.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    setPage(1)
  }, [filters.query, filters.categories, filters.zones, filters.order, language])
  // TẠI SAO: Trang trước có thể lớn hơn số trang mới, khiến giao diện rỗng dù vẫn có kết quả phù
  // hợp.

  const missing = data.places.some((place) => !publishedText(place, language))

  return (
    <section className="panel catalogue" id="catalogue">
      <div className="section-title catalogue-heading">
        <div>
          <h2>{t('allPlaces')}</h2>
          <p>
            {t('results')}: {filters.results.length}
          </p>
        </div>

        <div className="sort-controls">
          <label>
            {t('sort')}

            <select
              aria-label={t('sort')}
              value={filters.order}
              onChange={(event) => {
                const order = event.target.value === 'nearest' ? 'nearest' : 'name'

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

            <button className="text-button" onClick={clearFilters}>
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
                    onChange={(event) =>
                      changeCategories(
                        event.target.checked
                          ? [...filters.categories, category]
                          : filters.categories.filter((item) => item !== category),
                      )
                    }
                  />
                  {t(`category_${category}`)} (
                  {data.places.filter((place) => categoryOf(place) === category).length})
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
                  onChange={(event) =>
                    filters.setZones(
                      event.target.checked
                        ? [...filters.zones, zone]
                        : filters.zones.filter((item) => item !== zone),
                    )
                  }
                />
                {t(zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial')} (
                {data.places.filter((place) => place.zone === zone).length})
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
            {t(position.loading ? 'locationBusy' : 'location')}
          </button>
        </aside>

        <div className="results">
          {filters.order === 'nearest' && filters.effectiveOrder === 'name' && (
            <p className="muted" role="status">
              {t('orderFallback')}
            </p>
          )}

          {position.failed && (
            <p role="status" className="muted">
              {t('locationDenied')}
            </p>
          )}

          {missing && <p className="muted">{t('missingList')}</p>}

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
            <div className={'place-grid ' + (view === 'list' ? 'list-view' : '')}>
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
              <button onClick={clearFilters}>{t('clearAll')}</button>
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

            {Array.from({ length: paged.pages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                aria-label={t('page') + ' ' + number}
                aria-current={paged.page === number ? 'page' : undefined}
                className={paged.page === number ? '' : 'secondary'}
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
