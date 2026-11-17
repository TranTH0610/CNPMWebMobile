/**
 * FILE: packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts
 * FILE NÀY LÀM GÌ: Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
// CHỨC NĂNG: Khai báo các ngôn ngữ được hỗ trợ.
// XỬ LÝ: Giữ cn làm mã nội bộ để tương thích lựa chọn đã lưu.

export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
// XỬ LÝ: zh-CN thành cn, pt_BR thành pt; không hỗ trợ trả null.

// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] languageOf — Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
export function languageOf(
  value: string | null | undefined,
): Language | null {
  
  const base = value
    ?.toLowerCase()
    .replace(/_/g, '-')
    .split('-')[0]

  
  return base === 'zh'
    ? 'cn'
    : LANGUAGES.find((item) => item.code === base)?.code ?? null
}
// TẠI SAO (languageOf): Thiết bị có thể trả mã vùng khác mã nội bộ; chuẩn hóa giúp chọn đúng tài
// nguyên dịch.

// CHỨC NĂNG: Khai báo mã danh mục ổn định.
// XỬ LÝ: UI lấy tên qua i18n; không dùng tên tiếng Việt làm mã.

export const CATEGORIES = [
  'palace',
  'gate',
  'temple',
  'tomb',
  'museum',
  'monument',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Zone = 'fortifications' | 'ceremonial'
export type SortOrder = 'name' | 'nearest'

export type Point = {
  lat: number
  
  lng: number
}

// CHỨC NĂNG: Mô tả một bản nội dung theo ngôn ngữ.
// XỬ LÝ: Service kiểm tra trạng thái duyệt/công bố trước khi trả cho khách.
// CHỨC NĂNG: Nguồn audio có phiên bản và trạng thái công bố riêng.
export type PublishedAudio = {
  id: string; url: string; version: number
  
  status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string
}
// CHỨC NĂNG: Ghi nguồn để người đọc/Admin đối chiếu bài đã biên soạn.
// XỬ LÝ: Optional trong bản nội dung; không ép dữ liệu cũ phải có nguồn.
export type ContentSource = {
  
  title: string; url: string; accessedAt: string; license: string; licenseUrl: string
}
export type PublishedText = {
  sources?: readonly ContentSource[]
  adaptation?: 'rewritten-and-translated'

  audio?: PublishedAudio
  title: string
  summary: string
  body: string
  address: string
  version: number
  status: 'draft' | 'approved' | 'published'
  approvedAt?: string
  
  publishedAt?: string
}

// CHỨC NĂNG: Mô tả một địa điểm trong danh mục triển khai.
// XỬ LÝ: Các trường mới optional để dữ liệu cũ vẫn dùng được.
export type PlaceRecord = {
  id: string
  scope: string
  inLaunchCatalog: boolean
  status: 'draft' | 'published' | 'withdrawn'
  canonicalTitle: string
  zone: Zone
  images: string[]
  period?: string
  category?: Category
  featured?: boolean

  // CHỨC NĂNG: Phân biệt tọa độ đã xác nhận.
  // XỬ LÝ: Chỉ dùng verified=true để tính khoảng cách.
  position?: Point & {
    source?: string
    checkedAt?: string
    
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép thiếu một số bản ngôn ngữ.
  // XỬ LÝ: Không tự dịch chưa duyệt để lấp bản thiếu.
  
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
// XỬ LÝ: Thiếu category thì suy ra từ zone để tương thích ngược.
// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] categoryOf — Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
export function categoryOf(place: PlaceRecord): Category {
  
  return place.category
    ?? (place.zone === 'fortifications' ? 'gate' : 'palace')
}
// TẠI SAO (categoryOf): Một giá trị dự phòng chung giúp chip, bộ lọc và thẻ không hiểu khác nhau
// khi metadata còn thiếu.


export type CatalogSource =
  () => Promise<readonly PlaceRecord[]>

// CHỨC NĂNG: Tách logic ngôn ngữ khỏi công nghệ lưu trữ.
// XỬ LÝ: Mobile cung cấp AsyncStorage, web cung cấp localStorage.
export type StoragePort = {
  readLanguage: () => Promise<string | null>
  
  writeLanguage: (language: Language) => Promise<void>
}