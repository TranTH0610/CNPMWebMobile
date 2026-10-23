/**
 * FILE NÀY LÀM GÌ: Thẻ địa điểm, ảnh dự phòng, danh mục, khoảng cách nếu có và nút tim cục bộ.
 * Vị trí: apps/web/src/components/PlaceCard.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Icon } from './Icon'
import { PlaceImage } from './PlaceImage'
import { Link } from 'react-router-dom'
import { categoryOf, publishedText } from '@travelguide/visitor-core'
import type { PlaceRecord } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Card địa điểm trong carousel/lưới/danh sách.
// XỬ LÝ: Tim độc lập link chi tiết và lưu trong context của phiên.
export function PlaceCard({
  place,
  distance,
}: {
  place: PlaceRecord
  distance?: number
}) {
  const {
    language,
    favorites,
    toggleFavorite,
  } = useVisitor()

  const t = useText()
  const content = publishedText(place, language)
  const title = content?.title ?? place.canonicalTitle

  return (
    <article className="place-card">
      <Link
        className="card-photo"
        to={'/places/' + place.id}
        aria-label={title}
      >
        <PlaceImage uri={place.images[0]} title={title} />
      </Link>

      <button
        className="heart icon-button"
        aria-label={t(
          favorites.has(place.id) ? 'unfavorite' : 'favorite',
        )}
        aria-pressed={favorites.has(place.id)}
        onClick={() => toggleFavorite(place.id)}
      >
        <Icon name="heart" />
      </button>

      <div className="card-content">
        <h3>
          <Link to={'/places/' + place.id}>{title}</Link>
        </h3>

        <span className={'badge badge-' + categoryOf(place)}>
          {t(`category_${categoryOf(place)}`)}
        </span>

        <p className="card-location">
          <Icon name="pin" />
          {content ? t('city') : t('missing')}

          {distance !== undefined && (
            <span>{(distance / 1000).toFixed(2)} km</span>
          )}
        </p>
      </div>
    </article>
  )
}
