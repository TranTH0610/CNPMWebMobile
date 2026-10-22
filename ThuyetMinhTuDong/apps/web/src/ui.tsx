/**
 * FILE NÀY LÀM GÌ:
 * Component ngôn ngữ, icon, ảnh, chip và card của web.
 * App/Explore/pages sử dụng; liên quan UC01–UC04.
 * Phụ thuộc React, Router và visitor-core.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  categoryOf,
  categoryIcons,
  LANGUAGES,
  publishedText,
  type Category,
  type MessageKey,
  type PlaceRecord,
} from '@travelguide/visitor-core'

import {
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Icon SVG nhỏ để không thêm framework UI.
// XỬ LÝ: Icon trang trí ẩn với trình đọc màn hình;
// nút bên ngoài có aria-label đã dịch.
export function Icon({
  name,
}: {
  name: 'search' | 'pin' | 'heart' | 'arrow' | 'grid' | 'list' | 'qr'
}) {
  const paths = {
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    heart: (
      <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 8 15 8 15S25 10 20 5Z" />
    ),
    arrow: <path d="m9 5 7 7-7 7M4 12h12" />,
    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </>
    ),
    list: <path d="M3 5h2m4 0h12M3 12h2m4 0h12M3 19h2m4 0h12" />,
    qr: (
      <>
        <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

// CHỨC NĂNG: Dropdown chọn ngôn ngữ.
// XỬ LÝ: Chỉ đổi khi mã nằm trong danh sách hỗ trợ.
export function LanguagePicker() {
  const {
    language,
    saving,
    persistenceError,
    changeLanguage,
  } = useVisitor()

  const t = useText()

  return (
    <div className="language-picker">
      <select
        aria-label={t('language')}
        value={language}
        disabled={saving}
        onChange={(event) => {
          const code = LANGUAGES.find(
            (item) => item.code === event.target.value,
          )?.code

          if (code) void changeLanguage(code)
        }}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code === 'cn' ? '中文' : item.code.toUpperCase()}
            {' · '}{item.label}
          </option>
        ))}
      </select>

      {persistenceError && (
        <p role="alert">{t(persistenceError)}</p>
      )}
    </div>
  )
}

// CHỨC NĂNG: Hiển thị tải/lỗi/thử lại.
// XỬ LÝ: Không hiện chuỗi lỗi kỹ thuật từ API.
export function State({
  message,
  busy = false,
  retry,
}: {
  message: MessageKey
  busy?: boolean
  retry?: () => void
}) {
  const t = useText()

  return (
    <section className="state" role={busy ? 'status' : 'alert'}>
      {busy && <progress aria-label={t('loading')} />}
      <p>{t(message)}</p>
      {retry && <button onClick={retry}>{t('retry')}</button>}
    </section>
  )
}

// CHỨC NĂNG: Ảnh có dự phòng.
// XỬ LÝ: Card lazy-load; đổi URL thì thử lại thay vì giữ lỗi cũ.
export function PlaceImage({
  uri,
  title,
}: {
  uri?: string
  title: string
}) {
  const [failed, setFailed] = useState(false)
  const t = useText()

  useEffect(() => setFailed(false), [uri])

  return uri && !failed ? (
    <img
      className="place-image"
      src={uri}
      alt={title}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  ) : (
    <div
      className="place-image placeholder"
      role="img"
      aria-label={t('noImage')}
    >
      <span>▥</span>
      {t('noImage')}
    </div>
  )
}

// CHỨC NĂNG: Chip danh mục ở hero.
// XỬ LÝ: Chỉ hiện danh mục có dữ liệu và có ít nhất hai loại.
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: readonly Category[]
  selected: readonly Category[]
  onSelect: (value: Category[]) => void
}) {
  const t = useText()

  if (categories.length < 2) return null

  return (
    <div className="category-chips">
      <button
        aria-pressed={!selected.length}
        onClick={() => onSelect([])}
      >
        <span>▥</span>{t('all')}
      </button>

      {categories.map((category) => (
        <button
          key={category}
          aria-pressed={selected.includes(category)}
          onClick={() => onSelect([category])}
        >
          <span>{categoryIcons[category]}</span>
          {t(`category_${category}`)}
        </button>
      ))}
    </div>
  )
}

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