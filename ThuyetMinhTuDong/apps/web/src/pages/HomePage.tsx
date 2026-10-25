/**
 * FILE NÀY LÀM GÌ: Trang chủ web với hero, tìm kiếm, danh mục, carousel và Catalogue.
 * Vị trí: apps/web/src/pages/HomePage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { resolvePlaceImage } from '../services/placeImages'
import { Catalogue } from '../components/Catalogue'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categoryOf, HERO_IMAGE } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { CategoryChips, Icon, PlaceCard, State } from '../components/index'

// CHỨC NĂNG: Trang chủ gồm hero, carousel và danh sách.
// XỬ LÝ: Tải service một lần tại trang; chia cùng dữ liệu cho các khối.
export function HomePage() {
  const data = usePublishedCatalog()
  const t = useText()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [searchRequired, setSearchRequired] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Category[]>([])
  const [failedImage, setFailedImage] = useState(false)

  const carousel = useRef<HTMLDivElement>(null)
  const [carouselState, setCarouselState] = useState({ overflow: false, atStart: true, atEnd: true })

  const categories = [
    ...new Set(data.places.map(categoryOf)),
  ]

  // CHỨC NĂNG: Chọn danh mục cập nhật ngay cả thẻ nổi bật và danh sách bên dưới.
  // XỬ LÝ: Không dùng từ khóa chưa gửi để tránh lọc ngoài ý muốn khi đang gõ.
  const featured = useMemo(() => data.places.filter(
    (place) => place.featured && (!selected.length || selected.includes(categoryOf(place))),
  ), [data.places, selected])

  // CHỨC NĂNG: Chỉ hiện mũi tên khi có nội dung thật sự tràn chiều ngang.
  // XỬ LÝ: Đổi danh mục về đầu carousel; đo lại khi resize và khóa nút ở hai đầu.
  useEffect(() => {
    const node = carousel.current
    const update = () => {
      const end = node ? Math.max(0, node.scrollWidth - node.clientWidth) : 0
      const next = { overflow: end > 1, atStart: !node || node.scrollLeft <= 1,
        atEnd: !node || node.scrollLeft >= end - 1 }
      setCarouselState(previous => previous.overflow === next.overflow && previous.atStart === next.atStart
        && previous.atEnd === next.atEnd ? previous : next)
    }
    if (!node) { update(); return }
    node.scrollLeft = 0
    update()
    node.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined
    observer?.observe(node)
    return () => {
      node.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [featured, data.loading, data.error])

  // CHỨC NĂNG: Chuyển điều kiện tìm từ hero sang trang kết quả.
  // XỬ LÝ: URLSearchParams mã hóa từ khóa đúng, không tự ghép ký tự đặc biệt.
  const submit = () => {
    // CHỨC NĂNG: Yêu cầu nhập từ khóa khi gửi tìm kiếm.
    // XỬ LÝ: trim loại khoảng trắng; giữ nguyên trang và đưa con trỏ về ô nhập.
    if (!query.trim()) {
      setSearchRequired(true)
      searchInput.current?.focus()
      return
    }
    setSearchRequired(false)
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
