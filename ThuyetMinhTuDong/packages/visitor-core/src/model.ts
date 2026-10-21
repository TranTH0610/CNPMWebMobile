/**
 * FILE NÀY LÀM GÌ:
 * Định nghĩa dữ liệu và mã ngôn ngữ cho UC01–UC05.
 * Service, hook và màn hình sử dụng; không phụ thuộc React Native.
 *
 * Type PlaceRecord được dùng riêng cho luồng visitor.
 * Không yêu cầu xóa hoặc thay type Place cũ trong services/places.ts.
 */

// CHỨC NĂNG: Khai báo năm ngôn ngữ hỗ trợ.
// XỬ LÝ: Giữ cn làm mã nội bộ để tương thích dữ liệu đã lưu trước đây.
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const

// CHỨC NĂNG: Tạo kiểu ngôn ngữ từ danh sách phía trên.
// XỬ LÝ: Chỉ cho phép vi, en, cn, pt hoặc ja; tránh gõ nhầm mã.
export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện mã từ thiết bị hoặc bộ nhớ.
// XỬ LÝ:
// - pt_BR và pt-PT được nhận thành pt.
// - zh-CN được nhận thành cn.
// - Không hỗ trợ thì trả null để nơi gọi chọn ngôn ngữ dự phòng.
// - Hàm này không dịch nội dung và không chọn giọng TTS.
export function languageOf(
  value: string | null | undefined,
): Language | null {
  const base = value
    ?.toLowerCase()
    .replace(/_/g, '-')
    .split('-')[0]

  if (base === 'zh') return 'cn'

  return LANGUAGES.find(
    (item) => item.code === base,
  )?.code ?? null
}

// CHỨC NĂNG: Định nghĩa nhóm dùng trong bộ lọc demo.
// XỬ LÝ: Lưu mã ổn định; tên hiển thị được lấy qua i18n.
export type Zone = 'fortifications' | 'ceremonial'

export type SortOrder = 'name' | 'nearest'

export type Point = {
  lat: number
  lng: number
}

// CHỨC NĂNG: Mô tả một bản nội dung theo ngôn ngữ.
// XỬ LÝ: Service vẫn phải kiểm tra status và thời điểm duyệt/công bố.
// Tên PublishedText không tự bảo đảm đối tượng đã được công bố.
export type PublishedText = {
  title: string
  summary: string
  body: string
  address: string
  version: number
  status: 'draft' | 'approved' | 'published'
  approvedAt?: string
  publishedAt?: string
}

// CHỨC NĂNG: Mô tả địa điểm thuộc danh mục triển khai.
// XỬ LÝ: Tách trạng thái địa điểm khỏi trạng thái từng bản ngôn ngữ.
export type PlaceRecord = {
  id: string
  scope: string
  inLaunchCatalog: boolean
  status: 'draft' | 'published' | 'withdrawn'
  canonicalTitle: string
  zone: Zone
  images: string[]

  // CHỨC NĂNG: Lưu tọa độ khi đã có dữ liệu.
  // XỬ LÝ: Chỉ tọa độ verified=true mới được dùng tính khoảng cách.
  position?: Point & {
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép mỗi địa điểm có số bản dịch khác nhau.
  // XỬ LÝ: Partial cho phép thiếu một hoặc nhiều ngôn ngữ.
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Định nghĩa hợp đồng nguồn dữ liệu.
// XỬ LÝ: Có thể thay mock bằng API mà giữ cách gọi từ UI.
export type CatalogSource = () => Promise<readonly PlaceRecord[]>

// CHỨC NĂNG: Định nghĩa hợp đồng lưu lựa chọn ngôn ngữ.
// XỬ LÝ: Core không import AsyncStorage; mobile cung cấp adapter.
export type StoragePort = {
  readLanguage: () => Promise<string | null>
  writeLanguage: (language: Language) => Promise<void>
}