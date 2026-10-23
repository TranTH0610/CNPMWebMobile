/**
 * FILE NÀY LÀM GÌ: Bộ lọc danh mục/khu vực, tìm kiếm, sắp xếp, đổi lưới/danh sách và phân trang.
 * Vị trí: apps/web/src/components/Catalogue.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { categoryOf, distanceTo, paginate, publishedText } from '@travelguide/visitor-core'
import { State } from './State'
import { PlaceCard } from './PlaceCard'
import { useEffect, useState } from 'react'
import type { Category } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Icon } from './index'
import { getPosition } from '../services/platform'

type Data = ReturnType<typeof usePublishedCatalog>
// CHỨC NĂNG: Sidebar lọc, kết quả, đổi bố cục và phân trang.
// XỬ LÝ: Hook chịu nghiệp vụ; component chỉ quản lý trạng thái hiển thị.
export function Catalogue({
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
