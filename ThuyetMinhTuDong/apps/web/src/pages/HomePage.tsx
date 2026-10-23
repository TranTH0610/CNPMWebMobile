/**
 * FILE NÀY LÀM GÌ: Trang chủ web với hero, tìm kiếm, danh mục, carousel và Catalogue.
 * Vị trí: apps/web/src/pages/HomePage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { resolvePlaceImage } from '../services/placeImages'
import { Catalogue } from '../components/Catalogue'
import { useRef, useState } from 'react'
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
