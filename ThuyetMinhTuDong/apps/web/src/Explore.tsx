/**
 * FILE NÀY LÀM GÌ:
 * Trang chủ và danh sách web theo mockup UC02–UC03.
 * Router gọi qua pages.tsx.
 * Phụ thuộc service/hooks chung và UI web.
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import {
  CATEGORIES,
  categoryOf,
  distanceTo,
  HERO_IMAGE,
  paginate,
  publishedText,
  type Category,
} from '@travelguide/visitor-core'

import {
  useExplore,
  usePublishedCatalog,
  useText,
  useVisitor,
  useVisitorPosition,
} from '@travelguide/visitor-core/react'

import { CategoryChips, Icon, PlaceCard, State } from './ui'
import { getPosition } from './platform'

type Data = ReturnType<typeof usePublishedCatalog>

// CHỨC NĂNG: Trang chủ gồm hero, carousel và danh sách.
// XỬ LÝ: Tải service một lần tại trang; chia cùng dữ liệu cho các khối.
export function HomePage() {
  const data = usePublishedCatalog()
  const t = useText()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Category[]>([])
  const [failedImage, setFailedImage] = useState(false)

  const carousel = useRef<HTMLDivElement>(null)

  const categories = [
    ...new Set(data.places.map(categoryOf)),
  ]

  const featured = data.places.filter(
    (place) => place.featured,
  )

  // CHỨC NĂNG: Chuyển điều kiện tìm từ hero sang trang kết quả.
  // XỬ LÝ: URLSearchParams mã hóa từ khóa đúng, không tự ghép ký tự đặc biệt.
  const submit = () => {
    const params = new URLSearchParams()

    if (query.trim()) params.set('q', query.trim())
    if (selected[0]) params.set('category', selected[0])

    navigate('/places?' + params.toString())
  }

  return (
    <>
      <section className="hero">
        {!failedImage && (
          <img
            className="hero-image"
            src={HERO_IMAGE}
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
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t('search')}
              placeholder={t('search')}
            />

            <button type="submit">
              <Icon name="search" />
              {t('searchButton')}
            </button>
          </form>

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
        ) : (
          <div className="carousel-wrap">
            <div ref={carousel} className="featured-carousel">
              {featured.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            <div className="carousel-actions">
              <button
                className="icon-button"
                aria-label={t('previous')}
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
                onClick={() => carousel.current?.scrollBy({
                  left: 280,
                  behavior: 'smooth',
                })}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      <Catalogue data={data} />
    </>
  )
}

// CHỨC NĂNG: Đọc điều kiện ban đầu từ URL.
// XỬ LÝ: Chỉ nhận mã danh mục hợp lệ; URL đổi thì key đổi để reset state.
export function PlacesPage() {
  const data = usePublishedCatalog()
  const [params] = useSearchParams()

  const category = CATEGORIES.find(
    (item) => item === params.get('category'),
  )

  return (
    <Catalogue
      key={params.toString()}
      data={data}
      initial={{
        query: params.get('q') ?? '',
        category,
      }}
    />
  )
}

// CHỨC NĂNG: Sidebar lọc, kết quả, đổi bố cục và phân trang.
// XỬ LÝ: Hook chịu nghiệp vụ; component chỉ quản lý trạng thái hiển thị.
function Catalogue({
  data,
  initial,
}: {
  data: Data
  initial?: {
    query?: string
    category?: Category
  }
}) {
  const position = useVisitorPosition(getPosition)
  const filters = useExplore(data.places, position.origin, initial)
  const { language } = useVisitor()
  const t = useText()

  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const paged = paginate(filters.results, page, 6)

  // CHỨC NĂNG: Đổi điều kiện thì quay về trang 1.
  // XỬ LÝ: paginate vẫn giới hạn trang ngay trước khi effect chạy.
  useEffect(() => {
    setPage(1)
  }, [
    filters.query,
    filters.within,
    filters.categories,
    filters.zones,
    filters.order,
    language,
  ])

  const missing = data.places.some(
    (place) => !publishedText(place, language),
  )

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
              onClick={filters.reset}
            >
              {t('clearAll')}
            </button>
          </div>

          <label className="search-field">
            <Icon name="search" />
            <input
              type="search"
              aria-label={t('search')}
              placeholder={t('search')}
              value={filters.query}
              onChange={(event) => filters.setQuery(event.target.value)}
            />
          </label>

          <label className="search-field">
            <Icon name="search" />
            <input
              type="search"
              aria-label={t('searchWithin')}
              placeholder={t('searchWithin')}
              value={filters.within}
              onChange={(event) => filters.setWithin(event.target.value)}
            />
          </label>

          {filters.availableCategories.length >= 2 && (
            <fieldset>
              <legend>{t('category')}</legend>

              <label>
                <input
                  type="checkbox"
                  checked={!filters.categories.length}
                  onChange={() => filters.setCategories([])}
                />
                {t('all')} ({data.places.length})
              </label>

              {filters.availableCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(event) => filters.setCategories(
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
              <button onClick={filters.reset}>
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