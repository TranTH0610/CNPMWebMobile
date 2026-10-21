/**
 * FILE NÀY LÀM GÌ:
 * Xử lý tìm không dấu, lọc nhóm, khoảng cách và sắp xếp UC03.
 * usePlaceFilters trong react.tsx sử dụng.
 * Phụ thuộc model.ts và catalog.ts; không phụ thuộc giao diện.
 */

import { publishedText } from './catalog'
import type {
  Language,
  PlaceRecord,
  Point,
  SortOrder,
  Zone,
} from './model'

// CHỨC NĂNG: Chuẩn hóa văn bản tìm kiếm.
// XỬ LÝ:
// - NFD tách chữ và dấu kết hợp.
// - Xóa dấu kết hợp.
// - Xử lý riêng đ vì NFD không tự chuyển đ thành d.
// - Gom khoảng trắng và bỏ khoảng trắng đầu/cuối.
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
}

// CHỨC NĂNG: Kiểm tra tọa độ trước khi sử dụng.
// XỬ LÝ: Loại NaN, Infinity và giá trị vượt giới hạn địa lý.
export function validPoint(point: Point): boolean {
  return Number.isFinite(point.lat)
    && Number.isFinite(point.lng)
    && Math.abs(point.lat) <= 90
    && Math.abs(point.lng) <= 180
}

// CHỨC NĂNG: Tính khoảng cách đường chim bay theo haversine.
// XỬ LÝ: Đơn vị mét; chặn sai số số học trước khi lấy căn và arcsin.
// Nơi gọi phải kiểm tra tọa độ bằng validPoint.
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

// CHỨC NĂNG: Tính khoảng cách tới một địa điểm nếu có đủ điều kiện.
// XỬ LÝ: Thiếu vị trí, tọa độ sai hoặc chưa xác nhận thì trả undefined.
// Đây chỉ là sắp xếp UC03, không phải tự mở theo vị trí UC06.
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
// - Có từ khóa thì chỉ tìm trong bản công bố đúng ngôn ngữ.
// - Không tìm nhầm tên Việt khi đang chọn Anh.
// - Không sửa mảng đầu vào.
// - Không có khoảng cách hợp lệ thì sắp theo tên.
export function selectPlaces(
  places: readonly PlaceRecord[],
  options: {
    language: Language
    query: string
    zone: Zone | null
    order: SortOrder
    origin?: Point
  },
): PlaceRecord[] {
  const words = normalize(options.query)
    .split(' ')
    .filter(Boolean)

  const selected = places.filter((place) => {
    if (options.zone && place.zone !== options.zone) return false

    // CHỨC NĂNG: Khi chưa tìm kiếm vẫn cho thấy điểm thiếu bản ngôn ngữ.
    // XỬ LÝ: Card sẽ ghi rõ chưa có nội dung, không giả thành đã dịch.
    if (!words.length) return true

    const content = publishedText(place, options.language)
    if (!content) return false

    const haystack = normalize([
      content.title,
      content.address,
      content.summary,
      content.body,
    ].join(' '))

    return words.every((word) => haystack.includes(word))
  })

  const name = (place: PlaceRecord) =>
    publishedText(place, options.language)?.title
    ?? place.canonicalTitle

  // CHỨC NĂNG: Tính khoảng cách một lần cho mỗi lần lọc.
  // XỬ LÝ: Dùng Infinity cho điểm chưa biết khoảng cách để xếp sau.
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

// CHỨC NĂNG: Chia trang để web có thể dùng lại sau này.
// XỬ LÝ: Giới hạn trang và kích thước; danh sách rỗng vẫn ở trang 1.
// Mobile sử dụng FlatList, không cần gọi hàm này.
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