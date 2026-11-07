/**
 * CHỨC NĂNG: [KIEU-DU-LIEU]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Kiểu dữ liệu du khách như ngôn ngữ, điểm, nội dung công bố, nguồn dữ liệu và cổng lưu trữ.
 *
 * VỊ TRÍ: packages/visitor-core/src/domain/KieuDuLieuDuKhach.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/catalog/DanhMucDiTich.ts
 * - packages/visitor-core/src/catalog/DuLieuHienThi.ts
 * - packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts
 * - packages/visitor-core/src/data/DanhMucAnh.ts
 * - packages/visitor-core/src/data/DiSanHue.ts
 * - packages/visitor-core/src/data/DuLieuKhoiTao.ts
 * - packages/visitor-core/src/i18n/BanDichDiSan.ts
 * - packages/visitor-core/src/i18n/BanDichGiaoDien.ts
 * - packages/visitor-core/src/i18n/BanDichHanhTrinh.ts
 * - packages/visitor-core/src/i18n/BanDichThanhPhan.ts
 * - packages/visitor-core/src/i18n/BanDichTraiNghiem.ts
 * - packages/visitor-core/src/i18n/BanDichTruyCapQR.ts
 * - packages/visitor-core/src/journey/DuLieuHanhTrinh.ts
 * - packages/visitor-core/src/journey/HanhTrinh.ts
 * - packages/visitor-core/src/react/TrangThaiReact.tsx
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. languageOf
 * 2. categoryOf
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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

// Đặt tên kiểu Language.
export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
// XỬ LÝ: zh-CN thành cn, pt_BR thành pt; không hỗ trợ trả null.

// ==================== [KIEU-DU-LIEU] languageOf ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
  
  status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string
}
// CHỨC NĂNG: Ghi nguồn để người đọc/Admin đối chiếu bài đã biên soạn.
// XỬ LÝ: Optional trong bản nội dung; không ép dữ liệu cũ phải có nguồn.
// Đặt tên kiểu ContentSource.
export type ContentSource = {
  
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
    
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép thiếu một số bản ngôn ngữ.
  // XỬ LÝ: Không tự dịch chưa duyệt để lấp bản thiếu.
  
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
// XỬ LÝ: Thiếu category thì suy ra từ zone để tương thích ngược.
// Khai báo categoryOf(place). Nhận đầu vào qua tham số.
// ==================== [KIEU-DU-LIEU] categoryOf ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
// Đặt tên kiểu StoragePort.
export type StoragePort = {
  // Khai báo readLanguage, kiểu () => Promise<string | null>.
  readLanguage: () => Promise<string | null>
  
  writeLanguage: (language: Language) => Promise<void>
}