/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Hàm thuần tìm kiếm, danh mục, sắp xếp và khoảng cách; dùng chung để web/mobile xử lý nhất quán.
 *
 * VỊ TRÍ: packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/journey/DuLieuHanhTrinh.ts
 * - packages/visitor-core/src/journey/HanhTrinh.ts
 * - packages/visitor-core/src/react/TrangThaiReact.tsx
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - ./DanhMucDiTich
 * - ../domain/KieuDuLieuDuKhach
 * - ../i18n/BanDichThanhPhan
 *
 * CÁC KHỐI CHÍNH:
 * 1. normalize
 * 2. validPoint
 * 3. distanceMeters
 * 4. distanceTo
 * 5. selectPlaces
 * 6. paginate
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập các thành phần từ './DanhMucDiTich'.
import { publishedText } from './DanhMucDiTich'
// Nhập các thành phần từ '../domain/KieuDuLieuDuKhach'.
import { categoryOf, type Category } from '../domain/KieuDuLieuDuKhach'
// Nhập các thành phần từ '../i18n/BanDichThanhPhan'.
import { uiMessages } from '../i18n/BanDichThanhPhan'


import type {
  Language,
  PlaceRecord,
  Point,
  SortOrder,
  Zone,
} from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Chuẩn hóa từ khóa và nội dung.
// XỬ LÝ: NFD bỏ dấu kết hợp; xử lý riêng đ/Đ và khoảng trắng.
// Khai báo normalize(value). Chuẩn hóa chữ để so sánh/tìm kiếm.
// ==================== [KHAM-PHA] normalize ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function normalize(value: string): string {
  
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
}
// TẠI SAO (normalize): Người dùng có thể gõ không dấu, chữ hoa hoặc nhiều dấu cách; chuẩn hóa
// giúp tìm cùng một nội dung nhất quán.

// CHỨC NĂNG: Kiểm tra tọa độ trước khi tính khoảng cách.
// XỬ LÝ: Loại số không hữu hạn hoặc ngoài miền hợp lệ để GPS lỗi không làm hỏng kết quả.
// Khai báo validPoint(point). Nhận đầu vào qua tham số.
// ==================== [KHAM-PHA] validPoint ====================
export function validPoint(point: Point): boolean {
  
  return Number.isFinite(point.lat)
    && Number.isFinite(point.lng)
    && Math.abs(point.lat) <= 90
    && Math.abs(point.lng) <= 180
}
// TẠI SAO (validPoint): NaN hoặc tọa độ ngoài giới hạn có thể lan sang phép tính và làm khoảng
// cách/sắp xếp sai.

// CHỨC NĂNG: Tính khoảng cách đường chim bay bằng haversine.
// XỬ LÝ: Trả mét; giới hạn sai số trước căn/arcsin.
// Khai báo distanceMeters(a, b). Đổi hai tọa độ sang khoảng cách mét.
// ==================== [KHAM-PHA] distanceMeters ====================
export function distanceMeters(a: Point, b: Point): number {
  // Khai báo rad: khai báo callback (value: number) => value * Math.PI / 180.
  const rad = (value: number) => value * Math.PI / 180
  // TẠI SAO (rad): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2
    + Math.cos(rad(a.lat))
    * Math.cos(rad(b.lat))
    * Math.sin(rad(b.lng - a.lng) / 2) ** 2

  
  return 6371000
    * 2
    * Math.asin(Math.sqrt(Math.max(0, Math.min(1, h))))
}
// TẠI SAO (distanceMeters): Dùng một phép đo và đơn vị mét giúp sắp xếp, bán kính GPS và hiển
// thị không bị lệch giữa nền tảng.

// CHỨC NĂNG: Chỉ tính khoảng cách khi dữ liệu đủ tin cậy.
// XỬ LÝ: Không dùng tọa độ chưa xác nhận hoặc vị trí không hợp lệ.

// ==================== [KHAM-PHA] distanceTo ====================
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
// TẠI SAO (distanceTo): Không có GPS là thiếu dữ liệu khoảng cách, không phải khách đang đứng
// cách địa điểm 0 mét.

// CHỨC NĂNG: Tìm, lọc và sắp xếp danh sách.
// XỬ LÝ:
// - Nhiều danh mục trong cùng nhóm là OR.
// - Danh mục, khu vực và từ khóa kết hợp AND.
// - Chỉ tìm trong bản công bố đúng ngôn ngữ.
// - Không sửa mảng dữ liệu nguồn.

// ==================== [KHAM-PHA] selectPlaces ====================
export function selectPlaces(
  places: readonly PlaceRecord[],
  options: {
    // Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác.
    language: Language
    // Khai báo query, kiểu string.
    query: string
    // Khai báo zone, kiểu Zone | null.
    zone: Zone | null
    // Khai báo order, kiểu SortOrder.
    order: SortOrder
    // Khai báo origin không bắt buộc, kiểu Point.
    origin?: Point
    // Khai báo categories không bắt buộc, kiểu readonly Category[].
    categories?: readonly Category[]
    
    zones?: readonly Zone[]
  },
): PlaceRecord[] {
  
  const words = normalize(options.query)
    .split(' ')
    .filter(Boolean)

  // Khai báo selected: places.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const selected = places.filter((place) => {
    // Rẽ nhánh nếu options.zone && place.zone !== options.zone. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
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
    // Rẽ nhánh nếu !words.length. | Trả kết quả: sử dụng true làm giá trị của bước hiện tại.
    if (!words.length) return true

    // Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
    const content = publishedText(place, options.language)
    // Rẽ nhánh nếu !content. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
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
  // TẠI SAO (name): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  
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

  // Trả kết quả: [...selected].sort sắp xếp mảng theo hàm so sánh.
  return [...selected].sort((a, b) => {
    // Gán da bằng distances.get(a.id); nếu null hoặc undefined thì dùng Infinity.
    const da = distances.get(a.id) ?? Infinity
    // Gán db bằng distances.get(b.id); nếu null hoặc undefined thì dùng Infinity.
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
// TẠI SAO (selectPlaces): Từ khóa, danh mục, khu vực và sắp xếp phải phối hợp trong cùng một tập
// kết quả.

// CHỨC NĂNG: Chia trang cho web.
// XỬ LÝ: Chặn NaN, pageSize <= 0 và trang vượt giới hạn sau khi lọc.

// ==================== [KHAM-PHA] paginate ====================
export function paginate<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize: number,
) {
  
  const size = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize))
    : 1

  // Khai báo pages: Gọi Math.max(1, Math.ceil(items.length / size)).
  const pages = Math.max(1, Math.ceil(items.length / size))

  
  const requested = Number.isFinite(requestedPage)
    ? Math.floor(requestedPage)
    : 1

  // Khai báo page: Gọi Math.max(1, Math.min(requested, pages)).
  const page = Math.max(1, Math.min(requested, pages))

  
  return {
    page,
    pages,
    
    items: items.slice((page - 1) * size, page * size),
  }
}
// TẠI SAO (paginate): Sau khi lọc, số trang có thể giảm; giới hạn trang tránh trả một trang rỗng
// dù vẫn còn kết quả.