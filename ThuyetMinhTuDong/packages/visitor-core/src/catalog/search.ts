/**
 * FILE NÀY LÀM GÌ
 * Hàm thuần tìm kiếm, danh mục, sắp xếp và khoảng cách; dùng chung để web/mobile xử lý nhất quán.
 *
 * VỊ TRÍ: packages/visitor-core/src/catalog/search.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts; packages/visitor-core/src/journey/journey-data.ts;
 * packages/visitor-core/src/journey/journey.ts; và các nơi import khác.
 * PHỤ THUỘC: ./catalog; ../domain/model; ../i18n/uiMessages
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ './catalog'.
import { publishedText } from './catalog'
// Nhập các thành phần từ '../domain/model'.
import { categoryOf, type Category } from '../domain/model'
// Nhập các thành phần từ '../i18n/uiMessages'.
import { uiMessages } from '../i18n/uiMessages'

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `import type {`: Nhập kiểu dữ liệu từ '../domain/model'.
 * DÒNG `Language,`: Lấy Language từ module đang nhập.
 * DÒNG `PlaceRecord,`: Lấy PlaceRecord từ module đang nhập.
 * DÒNG `Point,`: Lấy Point từ module đang nhập.
 * DÒNG `SortOrder,`: Lấy SortOrder từ module đang nhập.
 * DÒNG `Zone,`: Lấy Zone từ module đang nhập.
 * DÒNG `} from '../domain/model'`: Nhập kiểu dữ liệu từ '../domain/model'.
 */
import type {
  Language,
  PlaceRecord,
  Point,
  SortOrder,
  Zone,
} from '../domain/model'

// CHỨC NĂNG: Chuẩn hóa từ khóa và nội dung.
// XỬ LÝ: NFD bỏ dấu kết hợp; xử lý riêng đ/Đ và khoảng trắng.
// Khai báo normalize(value). Chuẩn hóa chữ để so sánh/tìm kiếm.
export function normalize(value: string): string {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return value`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `.toLowerCase()`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `.normalize('NFD')`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `.replace(/[\u0300-\u036f]/g, '')`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `.replace(/đ/g, 'd')`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `.replace(/\s+/g, ' ')`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `.trim()`: Trả kết quả: value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
export function validPoint(point: Point): boolean {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return Number.isFinite(point.lat)`: Trả kết quả: tính biểu thức Number.isFinite(point.lat) && Number.isFinite(point.lng) && Math.abs(point.lat) <= 90 && M.
   * DÒNG `&& Number.isFinite(point.lng)`: Trả kết quả: tính biểu thức Number.isFinite(point.lat) && Number.isFinite(point.lng) && Math.abs(point.lat) <= 90 && M.
   * DÒNG `&& Math.abs(point.lat) <= 90`: Trả kết quả: tính biểu thức Number.isFinite(point.lat) && Number.isFinite(point.lng) && Math.abs(point.lat) <= 90 && M.
   * DÒNG `&& Math.abs(point.lng) <= 180`: Trả kết quả: tính biểu thức Number.isFinite(point.lat) && Number.isFinite(point.lng) && Math.abs(point.lat) <= 90 && M.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
export function distanceMeters(a: Point, b: Point): number {
  // Khai báo rad: khai báo callback (value: number) => value * Math.PI / 180.
  const rad = (value: number) => value * Math.PI / 180
  // TẠI SAO (rad): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const h =`: Khai báo h: tính biểu thức Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.
   * DÒNG `Math.sin(rad(b.lat - a.lat) / 2) ** 2`: Khai báo h: tính biểu thức Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.
   * DÒNG `+ Math.cos(rad(a.lat))`: Khai báo h: tính biểu thức Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.
   */
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2
    + Math.cos(rad(a.lat))
    * Math.cos(rad(b.lat))
    * Math.sin(rad(b.lng - a.lng) / 2) ** 2

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return 6371000`: Trả kết quả: tính biểu thức 6371000 * 2 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, h)))).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return 6371000
    * 2
    * Math.asin(Math.sqrt(Math.max(0, Math.min(1, h))))
}
// TẠI SAO (distanceMeters): Dùng một phép đo và đơn vị mét giúp sắp xếp, bán kính GPS và hiển
// thị không bị lệch giữa nền tảng.

// CHỨC NĂNG: Chỉ tính khoảng cách khi dữ liệu đủ tin cậy.
// XỬ LÝ: Không dùng tọa độ chưa xác nhận hoặc vị trí không hợp lệ.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function distanceTo(`: Khai báo distanceTo(place, origin). Nhận đầu vào qua tham số.
 * DÒNG `place: PlaceRecord,`: Nhận đầu vào place: PlaceRecord từ nơi gọi hàm.
 * DÒNG `origin?: Point,`: Nhận đầu vào origin?: Point từ nơi gọi hàm.
 * DÒNG `): number | undefined {`: Khai báo distanceTo(place, origin). Nhận đầu vào qua tham số.
 */
export function distanceTo(
  place: PlaceRecord,
  origin?: Point,
): number | undefined {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu !origin || !validPoint(origin) || !place.position?.verified || !validPoint(place.position).
   * DÒNG `!origin`: Rẽ nhánh nếu !origin || !validPoint(origin) || !place.position?.verified || !validPoint(place.position).
   * DÒNG `|| !validPoint(origin)`: Rẽ nhánh nếu !origin || !validPoint(origin) || !place.position?.verified || !validPoint(place.position).
   * DÒNG `|| !place.position?.verified`: Rẽ nhánh nếu !origin || !validPoint(origin) || !place.position?.verified || !validPoint(place.position).
   * DÒNG `|| !validPoint(place.position)`: Rẽ nhánh nếu !origin || !validPoint(origin) || !place.position?.verified || !validPoint(place.position).
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    !origin
    || !validPoint(origin)
    || !place.position?.verified
    || !validPoint(place.position)
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return undefined`: Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return undefined
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return distanceMeters(origin, place.position)`: Trả kết quả: distanceMeters tính khoảng cách từ tọa độ theo mét để lọc/sắp xếp nhất quán.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function selectPlaces(`: Khai báo selectPlaces(places, options). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly PlaceRecord[],`: Nhận đầu vào places: readonly PlaceRecord[] từ nơi gọi hàm.
 * DÒNG `options: {`: Nhận đầu vào options: { language: Language query: string zone: Zone | null order: SortOrder origin?: Point c từ nơi gọi hàm.
 */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `zones?: readonly Zone[]`: Khai báo zones không bắt buộc, kiểu readonly Zone[].
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `): PlaceRecord[] {`: Khai báo selectPlaces(places, options). Nhận đầu vào qua tham số.
     */
    zones?: readonly Zone[]
  },
): PlaceRecord[] {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const words = normalize(options.query)`: Khai báo words: normalize(options.query)
    .split(' ')
    .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
   * DÒNG `.split(' ')`: Khai báo words: normalize(options.query)
    .split(' ')
    .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
   * DÒNG `.filter(Boolean)`: Khai báo words: normalize(options.query)
    .split(' ')
    .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
   */
  const words = normalize(options.query)
    .split(' ')
    .filter(Boolean)

  // Khai báo selected: places.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const selected = places.filter((place) => {
    // Rẽ nhánh nếu options.zone && place.zone !== options.zone. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
    if (options.zone && place.zone !== options.zone) return false

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (`: Rẽ nhánh nếu options.categories?.length && !options.categories.includes(categoryOf(place)).
     * DÒNG `options.categories?.length`: Rẽ nhánh nếu options.categories?.length && !options.categories.includes(categoryOf(place)).
     * DÒNG `&& !options.categories.includes(categoryOf(place))`: Rẽ nhánh nếu options.categories?.length && !options.categories.includes(categoryOf(place)).
     * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    if (
      options.categories?.length
      && !options.categories.includes(categoryOf(place))
    ) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return false`: Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return false
    }

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (`: Rẽ nhánh nếu options.zones?.length && !options.zones.includes(place.zone).
     * DÒNG `options.zones?.length`: Rẽ nhánh nếu options.zones?.length && !options.zones.includes(place.zone).
     * DÒNG `&& !options.zones.includes(place.zone)`: Rẽ nhánh nếu options.zones?.length && !options.zones.includes(place.zone).
     * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    if (
      options.zones?.length
      && !options.zones.includes(place.zone)
    ) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return false`: Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
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

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const categoryLabel =`: Khai báo categoryLabel: đọc uiMessages[options.language][`category_${categoryOf(place)}`] từ đối tượng/mảng để dùng tại bước hiện tại.
     * DÒNG `uiMessages[options.language][`category_${categoryOf(place)}`]`: Khai báo categoryLabel: đọc uiMessages[options.language][`category_${categoryOf(place)}`] từ đối tượng/mảng để dùng tại bước hiện tại.
     */
    const categoryLabel =
      uiMessages[options.language][`category_${categoryOf(place)}`]

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const haystack = normalize([`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     * DÒNG `content.title,`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     * DÒNG `content.address,`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     * DÒNG `content.summary,`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     * DÒNG `content.body,`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     * DÒNG `categoryLabel,`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     * DÒNG `].join(' '))`: Khai báo haystack: Gọi normalize([ content.title, content.address, content.summary, content.body, categoryLabel,.
     */
    const haystack = normalize([
      content.title,
      content.address,
      content.summary,
      content.body,
      categoryLabel,
    ].join(' '))

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return words.every((word) => haystack.includes(word))`: Trả kết quả: words.every kiểm tra tất cả phần tử đạt điều kiện trước khi chấp nhận dữ liệu.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return words.every((word) => haystack.includes(word))
  })

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const name = (place: PlaceRecord) =>`: Khai báo name: khai báo callback (place: PlaceRecord) => publishedText(place, options.language)?.title ?? pl.
   * DÒNG `publishedText(place, options.language)?.title`: Khai báo name: khai báo callback (place: PlaceRecord) => publishedText(place, options.language)?.title ?? pl.
   * DÒNG `?? place.canonicalTitle`: Khai báo name: khai báo callback (place: PlaceRecord) => publishedText(place, options.language)?.title ?? pl.
   */
  const name = (place: PlaceRecord) =>
    publishedText(place, options.language)?.title
    ?? place.canonicalTitle
  // TẠI SAO (name): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const distances = new Map(`: Khai báo distances: Map giữ các cặp khóa–giá trị trong RAM.
   * DÒNG `selected.map((place) => [`: Khai báo distances: Map giữ các cặp khóa–giá trị trong RAM.
   * DÒNG `place.id,`: Khai báo distances: Map giữ các cặp khóa–giá trị trong RAM.
   * DÒNG `distanceTo(place, options.origin) ?? Infinity,`: Khai báo distances: Map giữ các cặp khóa–giá trị trong RAM.
   * DÒNG `]),`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const distances = new Map(
    selected.map((place) => [
      place.id,
      distanceTo(place, options.origin) ?? Infinity,
    ]),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const canSortDistance =`: Khai báo canSortDistance: tính biểu thức options.order === 'nearest' && selected.some( (place) => distances.get(place.id) !== Infin.
   * DÒNG `options.order === 'nearest'`: Khai báo canSortDistance: tính biểu thức options.order === 'nearest' && selected.some( (place) => distances.get(place.id) !== Infin.
   * DÒNG `&& selected.some(`: Khai báo canSortDistance: tính biểu thức options.order === 'nearest' && selected.some( (place) => distances.get(place.id) !== Infin.
   * DÒNG `(place) => distances.get(place.id) !== Infinity,`: Khai báo canSortDistance: tính biểu thức options.order === 'nearest' && selected.some( (place) => distances.get(place.id) !== Infin.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
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

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const difference =`: Khai báo difference: chọn giữa hai giá trị theo điều kiện canSortDistance && da !== db.
     * DÒNG `canSortDistance && da !== db ? da - db : 0`: Khai báo difference: chọn giữa hai giá trị theo điều kiện canSortDistance && da !== db.
     */
    const difference =
      canSortDistance && da !== db ? da - db : 0

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return difference`: Trả kết quả: tính biểu thức difference || name(a).localeCompare( name(b), options.language === 'cn' ? 'zh' : options.l.
     * DÒNG `|| name(a).localeCompare(`: Trả kết quả: tính biểu thức difference || name(a).localeCompare( name(b), options.language === 'cn' ? 'zh' : options.l.
     * DÒNG `name(b),`: Trả kết quả: tính biểu thức difference || name(a).localeCompare( name(b), options.language === 'cn' ? 'zh' : options.l.
     * DÒNG `options.language === 'cn' ? 'zh' : options.language,`: Trả kết quả: tính biểu thức difference || name(a).localeCompare( name(b), options.language === 'cn' ? 'zh' : options.l.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `|| a.id.localeCompare(b.id)`: Trả kết quả: tính biểu thức difference || name(a).localeCompare( name(b), options.language === 'cn' ? 'zh' : options.l.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
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
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function paginate<T>(`: Khai báo paginate(items, requestedPage, pageSize). Nhận đầu vào qua tham số.
 * DÒNG `items: readonly T[],`: Nhận đầu vào items: readonly T[] từ nơi gọi hàm.
 * DÒNG `requestedPage: number,`: Nhận đầu vào requestedPage: number từ nơi gọi hàm.
 * DÒNG `pageSize: number,`: Nhận đầu vào pageSize: number từ nơi gọi hàm.
 * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
export function paginate<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize: number,
) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const size = Number.isFinite(pageSize)`: Khai báo size: chọn giữa hai giá trị theo điều kiện Number.isFinite(pageSize).
   * DÒNG `? Math.max(1, Math.floor(pageSize))`: Khai báo size: chọn giữa hai giá trị theo điều kiện Number.isFinite(pageSize).
   * DÒNG `: 1`: Khai báo size: chọn giữa hai giá trị theo điều kiện Number.isFinite(pageSize).
   */
  const size = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize))
    : 1

  // Khai báo pages: Gọi Math.max(1, Math.ceil(items.length / size)).
  const pages = Math.max(1, Math.ceil(items.length / size))

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const requested = Number.isFinite(requestedPage)`: Khai báo requested: chọn giữa hai giá trị theo điều kiện Number.isFinite(requestedPage).
   * DÒNG `? Math.floor(requestedPage)`: Khai báo requested: chọn giữa hai giá trị theo điều kiện Number.isFinite(requestedPage).
   * DÒNG `: 1`: Khai báo requested: chọn giữa hai giá trị theo điều kiện Number.isFinite(requestedPage).
   */
  const requested = Number.isFinite(requestedPage)
    ? Math.floor(requestedPage)
    : 1

  // Khai báo page: Gọi Math.max(1, Math.min(requested, pages)).
  const page = Math.max(1, Math.min(requested, pages))

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm page, pages, items.
   * DÒNG `page,`: Đặt trường page bằng giá trị của biến cùng tên.
   * DÒNG `pages,`: Đặt trường pages bằng giá trị của biến cùng tên.
   */
  return {
    page,
    pages,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `items: items.slice((page - 1) * size, page * size),`: Gán thuộc tính items: Gọi items.slice((page - 1) * size, page * size).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    items: items.slice((page - 1) * size, page * size),
  }
}
// TẠI SAO (paginate): Sau khi lọc, số trang có thể giảm; giới hạn trang tránh trả một trang rỗng
// dù vẫn còn kết quả.