/**
 * FILE NÀY LÀM GÌ:
 * Tìm không dấu, lọc nhiều danh mục/khu vực và sắp xếp UC03.
 * Hooks dùng chung gọi; phụ thuộc model, catalog và nhãn danh mục.
 * Không phụ thuộc React hoặc API vị trí.
 */

import { publishedText } from './catalog'
import { categoryOf, type Category } from '../domain/model'
import { uiMessages } from '../i18n/uiMessages'

import type {
  Language,
  PlaceRecord,
  Point,
  SortOrder,
  Zone,
} from '../domain/model'

// CHỨC NĂNG: Chuẩn hóa từ khóa và nội dung.
// XỬ LÝ: NFD bỏ dấu kết hợp; xử lý riêng đ/Đ và khoảng trắng.
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
}

export function validPoint(point: Point): boolean {
  return Number.isFinite(point.lat)
    && Number.isFinite(point.lng)
    && Math.abs(point.lat) <= 90
    && Math.abs(point.lng) <= 180
}

// CHỨC NĂNG: Tính khoảng cách đường chim bay bằng haversine.
// XỬ LÝ: Trả mét; giới hạn sai số trước căn/arcsin.
export function distanceMeters(a: Point, b: Point): number {
  const rad = (value: number) => value * Math.PI / 180

  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2
    + Math.cos(rad(a.lat))
    * Math.cos(rad(b.lat))
    * Math.sin(rad(b.lng - a.lng) / 2) ** 2

  return 6371000
    * 2
    * Math.asin(Math.sqrt(Math.max(0, Math.min(1, h))))
}

// CHỨC NĂNG: Chỉ tính khoảng cách khi dữ liệu đủ tin cậy.
// XỬ LÝ: Không dùng tọa độ chưa xác nhận hoặc vị trí không hợp lệ.
export function distanceTo(
  place: PlaceRecord,
  origin?: Point,
): number | undefined {
  if (
    !origin
    || !validPoint(origin)
    || !place.position?.verified
    || !validPoint(place.position)
  ) {
    return undefined
  }

  return distanceMeters(origin, place.position)
}

// CHỨC NĂNG: Tìm, lọc và sắp xếp danh sách.
// XỬ LÝ:
// - Nhiều danh mục trong cùng nhóm là OR.
// - Danh mục, khu vực và từ khóa kết hợp AND.
// - Chỉ tìm trong bản công bố đúng ngôn ngữ.
// - Không sửa mảng dữ liệu nguồn.
export function selectPlaces(
  places: readonly PlaceRecord[],
  options: {
    language: Language
    query: string
    zone: Zone | null
    order: SortOrder
    origin?: Point
    categories?: readonly Category[]
    zones?: readonly Zone[]
  },
): PlaceRecord[] {
  const words = normalize(options.query)
    .split(' ')
    .filter(Boolean)

  const selected = places.filter((place) => {
    if (options.zone && place.zone !== options.zone) return false

    if (
      options.categories?.length
      && !options.categories.includes(categoryOf(place))
    ) {
      return false
    }

    if (
      options.zones?.length
      && !options.zones.includes(place.zone)
    ) {
      return false
    }

    // CHỨC NĂNG: Khi chưa tìm, vẫn cho thấy điểm thiếu bản ngôn ngữ.
    // XỬ LÝ: Card thông báo thiếu; không coi tên định danh là bản dịch.
    if (!words.length) return true

    const content = publishedText(place, options.language)
    if (!content) return false

    const categoryLabel =
      uiMessages[options.language][`category_${categoryOf(place)}`]

    const haystack = normalize([
      content.title,
      content.address,
      content.summary,
      content.body,
      categoryLabel,
    ].join(' '))

    return words.every((word) => haystack.includes(word))
  })

  const name = (place: PlaceRecord) =>
    publishedText(place, options.language)?.title
    ?? place.canonicalTitle

  const distances = new Map(
    selected.map((place) => [
      place.id,
      distanceTo(place, options.origin) ?? Infinity,
    ]),
  )

  const canSortDistance =
    options.order === 'nearest'
    && selected.some(
      (place) => distances.get(place.id) !== Infinity,
    )

  return [...selected].sort((a, b) => {
    const da = distances.get(a.id) ?? Infinity
    const db = distances.get(b.id) ?? Infinity

    const difference =
      canSortDistance && da !== db ? da - db : 0

    return difference
      || name(a).localeCompare(
        name(b),
        options.language === 'cn' ? 'zh' : options.language,
      )
      || a.id.localeCompare(b.id)
  })
}

// CHỨC NĂNG: Chia trang cho web.
// XỬ LÝ: Chặn NaN, pageSize <= 0 và trang vượt giới hạn sau khi lọc.
export function paginate<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize: number,
) {
  const size = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize))
    : 1

  const pages = Math.max(1, Math.ceil(items.length / size))

  const requested = Number.isFinite(requestedPage)
    ? Math.floor(requestedPage)
    : 1

  const page = Math.max(1, Math.min(requested, pages))

  return {
    page,
    pages,
    items: items.slice((page - 1) * size, page * size),
  }
}