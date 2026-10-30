/**
 * FILE NÀY LÀM GÌ
 * Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ.
 *
 * VỊ TRÍ: packages/visitor-core/src/domain/model.ts
 * DÙNG BỞI: packages/visitor-core/src/catalog/catalog.ts;
 * packages/visitor-core/src/catalog/presentation.ts; packages/visitor-core/src/catalog/search.ts;
 * và các nơi import khác.
 * TẠI SAO TÁCH FILE: Các nơi dùng cần cùng hợp đồng dữ liệu để TypeScript phát hiện truyền thiếu
 * hoặc sai kiểu.
 */
// CHỨC NĂNG: Khai báo các ngôn ngữ được hỗ trợ.
// XỬ LÝ: Giữ cn làm mã nội bộ để tương thích lựa chọn đã lưu.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const LANGUAGES = [`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:.
 * DÒNG `{ code: 'vi', label: 'Tiếng Việt' },`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:. | Gán thuộc tính code: chuỗi 'vi'. | Gán thuộc tính label: chuỗi 'Tiếng Việt'.
 * DÒNG `{ code: 'en', label: 'English' },`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:. | Gán thuộc tính code: chuỗi 'en'. | Gán thuộc tính label: chuỗi 'English'.
 * DÒNG `{ code: 'cn', label: '中文' },`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:. | Gán thuộc tính code: chuỗi 'cn'. | Gán thuộc tính label: chuỗi '中文'.
 * DÒNG `{ code: 'pt', label: 'Português' },`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:. | Gán thuộc tính code: chuỗi 'pt'. | Gán thuộc tính label: chuỗi 'Português'.
 * DÒNG `{ code: 'ja', label: '日本語' },`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:. | Gán thuộc tính code: chuỗi 'ja'. | Gán thuộc tính label: chuỗi '日本語'.
 * DÒNG `] as const`: Khai báo LANGUAGES: tạo mảng [ { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code:.
 */
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const

// Đặt tên kiểu Language.
export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
// XỬ LÝ: zh-CN thành cn, pt_BR thành pt; không hỗ trợ trả null.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function languageOf(`: Khai báo languageOf(value). Nhận đầu vào qua tham số.
 * DÒNG `value: string | null | undefined,`: Nhận đầu vào value: string | null | undefined từ nơi gọi hàm.
 * DÒNG `): Language | null {`: Khai báo languageOf(value). Nhận đầu vào qua tham số.
 */
export function languageOf(
  value: string | null | undefined,
): Language | null {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const base = value`: Khai báo base: đọc value ?.toLowerCase() .replace(/_/g, '-') .split('-')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `?.toLowerCase()`: Khai báo base: đọc value ?.toLowerCase() .replace(/_/g, '-') .split('-')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `.replace(/_/g, '-')`: Khai báo base: đọc value ?.toLowerCase() .replace(/_/g, '-') .split('-')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `.split('-')[0]`: Khai báo base: đọc value ?.toLowerCase() .replace(/_/g, '-') .split('-')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
   */
  const base = value
    ?.toLowerCase()
    .replace(/_/g, '-')
    .split('-')[0]

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return base === 'zh'`: Trả kết quả: chọn giữa hai giá trị theo điều kiện base === 'zh'.
   * DÒNG `? 'cn'`: Trả kết quả: chọn giữa hai giá trị theo điều kiện base === 'zh'.
   * DÒNG `: LANGUAGES.find((item) => item.code === base)?.code ?? null`: Trả kết quả: chọn giữa hai giá trị theo điều kiện base === 'zh'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return base === 'zh'
    ? 'cn'
    : LANGUAGES.find((item) => item.code === base)?.code ?? null
}
// TẠI SAO (languageOf): Thiết bị có thể trả mã vùng khác mã nội bộ; chuẩn hóa giúp chọn đúng tài
// nguyên dịch.

// CHỨC NĂNG: Khai báo mã danh mục ổn định.
// XỬ LÝ: UI lấy tên qua i18n; không dùng tên tiếng Việt làm mã.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const CATEGORIES = [`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `'palace',`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `'gate',`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `'temple',`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `'tomb',`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `'museum',`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `'monument',`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 * DÒNG `] as const`: Khai báo CATEGORIES: tạo mảng [ 'palace', 'gate', 'temple', 'tomb', 'museum', 'monument', ].
 */
export const CATEGORIES = [
  'palace',
  'gate',
  'temple',
  'tomb',
  'museum',
  'monument',
] as const

// Đặt tên kiểu Category.
export type Category = (typeof CATEGORIES)[number]

// Đặt tên kiểu Zone.
export type Zone = 'fortifications' | 'ceremonial'
// Đặt tên kiểu SortOrder.
export type SortOrder = 'name' | 'nearest'

// Đặt tên kiểu Point.
export type Point = {
  // Khai báo lat, kiểu number.
  lat: number
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `lng: number`: Khai báo lng, kiểu number.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  lng: number
}

// CHỨC NĂNG: Mô tả một bản nội dung theo ngôn ngữ.
// XỬ LÝ: Service kiểm tra trạng thái duyệt/công bố trước khi trả cho khách.
// CHỨC NĂNG: Nguồn audio có phiên bản và trạng thái công bố riêng.
// XỬ LÝ: Optional trong PublishedText để dữ liệu UC01–UC11 cũ vẫn dùng được.
// Đặt tên kiểu PublishedAudio.
export type PublishedAudio = {
  // Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo url, kiểu string. | Khai báo version, kiểu number.
  id: string; url: string; version: number
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string`: Khai báo status, kiểu 'draft' | 'published'. | Khai báo approvedAt không bắt buộc, kiểu string. | Khai báo publishedAt không bắt buộc, kiểu string.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string
}
// CHỨC NĂNG: Ghi nguồn để người đọc/Admin đối chiếu bài đã biên soạn.
// XỬ LÝ: Optional trong bản nội dung; không ép dữ liệu cũ phải có nguồn.
// Đặt tên kiểu ContentSource.
export type ContentSource = {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `title: string; url: string; accessedAt: string; license: string; licenseUrl: string`: Khai báo title, kiểu string. | Khai báo url, kiểu string. | Khai báo accessedAt, kiểu string. | Khai báo license, kiểu string. | Khai báo licenseUrl, kiểu string.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  title: string; url: string; accessedAt: string; license: string; licenseUrl: string
}
// Đặt tên kiểu PublishedText.
export type PublishedText = {
  // Khai báo sources không bắt buộc, kiểu readonly ContentSource[].
  sources?: readonly ContentSource[]
  // Khai báo adaptation không bắt buộc, kiểu 'rewritten-and-translated'.
  adaptation?: 'rewritten-and-translated'

  // Khai báo audio không bắt buộc, kiểu PublishedAudio.
  audio?: PublishedAudio
  // Khai báo title, kiểu string.
  title: string
  // Khai báo summary, kiểu string.
  summary: string
  // Khai báo body, kiểu string.
  body: string
  // Khai báo address, kiểu string.
  address: string
  // Khai báo version, kiểu number.
  version: number
  // Khai báo status, kiểu 'draft' | 'approved' | 'published'.
  status: 'draft' | 'approved' | 'published'
  // Khai báo approvedAt không bắt buộc, kiểu string.
  approvedAt?: string
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `publishedAt?: string`: Khai báo publishedAt không bắt buộc, kiểu string.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  publishedAt?: string
}

// CHỨC NĂNG: Mô tả một địa điểm trong danh mục triển khai.
// XỬ LÝ: Các trường mới optional để dữ liệu cũ vẫn dùng được.
// Đặt tên kiểu PlaceRecord.
export type PlaceRecord = {
  // Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
  id: string
  // Khai báo scope, kiểu string.
  scope: string
  // Khai báo inLaunchCatalog, kiểu boolean.
  inLaunchCatalog: boolean
  // Khai báo status, kiểu 'draft' | 'published' | 'withdrawn'.
  status: 'draft' | 'published' | 'withdrawn'
  // Khai báo canonicalTitle, kiểu string.
  canonicalTitle: string
  // Khai báo zone, kiểu Zone.
  zone: Zone
  // Khai báo images, kiểu string[]. Giữ danh sách nguồn ảnh để UI có thể xử lý từng nguồn và ảnh lỗi.
  images: string[]
  // Khai báo period không bắt buộc, kiểu string.
  period?: string
  // Khai báo category không bắt buộc, kiểu Category.
  category?: Category
  // Khai báo featured không bắt buộc, kiểu boolean.
  featured?: boolean

  // CHỨC NĂNG: Phân biệt tọa độ đã xác nhận.
  // XỬ LÝ: Chỉ dùng verified=true để tính khoảng cách.
  // Khai báo position không bắt buộc, kiểu Point & { source?: string checkedAt?: string verified: boolean }. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio; kiểu khai báo xác định đơn vị.
  position?: Point & {
    // Khai báo source không bắt buộc, kiểu string.
    source?: string
    // Khai báo checkedAt không bắt buộc, kiểu string.
    checkedAt?: string
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `verified: boolean`: Khai báo verified, kiểu boolean. Tách tọa độ tham khảo với tọa độ đã xác nhận; không biến dữ liệu mẫu thành kết quả khảo sát.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép thiếu một số bản ngôn ngữ.
  // XỬ LÝ: Không tự dịch chưa duyệt để lấp bản thiếu.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `content: Partial<Record<Language, PublishedText>>`: Khai báo content, kiểu Partial<Record<Language, PublishedText>>.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
// XỬ LÝ: Thiếu category thì suy ra từ zone để tương thích ngược.
// Khai báo categoryOf(place). Nhận đầu vào qua tham số.
export function categoryOf(place: PlaceRecord): Category {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return place.category`: Trả kết quả: tính biểu thức place.category ?? (place.zone === 'fortifications' ? 'gate' : 'palace').
   * DÒNG `?? (place.zone === 'fortifications' ? 'gate' : 'palace')`: Trả kết quả: tính biểu thức place.category ?? (place.zone === 'fortifications' ? 'gate' : 'palace').
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return place.category
    ?? (place.zone === 'fortifications' ? 'gate' : 'palace')
}
// TẠI SAO (categoryOf): Một giá trị dự phòng chung giúp chip, bộ lọc và thẻ không hiểu khác nhau
// khi metadata còn thiếu.

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export type CatalogSource =`: Đặt tên kiểu CatalogSource.
 * DÒNG `() => Promise<readonly PlaceRecord[]>`: Thành phần kiểu `() => Promise<readonly PlaceRecord[]>` giới hạn hình dạng dữ liệu cho TypeScript.
 */
export type CatalogSource =
  () => Promise<readonly PlaceRecord[]>

// CHỨC NĂNG: Tách logic ngôn ngữ khỏi công nghệ lưu trữ.
// XỬ LÝ: Mobile cung cấp AsyncStorage, web cung cấp localStorage.
// Đặt tên kiểu StoragePort.
export type StoragePort = {
  // Khai báo readLanguage, kiểu () => Promise<string | null>.
  readLanguage: () => Promise<string | null>
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `writeLanguage: (language: Language) => Promise<void>`: Khai báo writeLanguage, kiểu (language: Language) => Promise<void>.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  writeLanguage: (language: Language) => Promise<void>
}