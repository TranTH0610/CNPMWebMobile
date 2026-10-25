/**
 * FILE NÀY LÀM GÌ:
 * Khai báo kiểu dữ liệu dùng chung giữa mobile, web và package place-core.
 *
 * Được dùng bởi:
 * - packages/place-core/src/index.ts
 * - packages/place-core/src/data/mockPlaces.ts
 * - apps/mobile/src/services/places.ts
 * - Các service/hook của web ở giai đoạn 3.
 *
 * Phụ thuộc: không phụ thuộc thư viện giao diện nào.
 * Liên quan: UC03, FR-18, FR-37..39.
 */

// CHỨC NĂNG: giữ nguyên kiểu kết quả thuyết minh đã có.
// XỬ LÝ: không đổi trường cũ để các phần khác của dự án vẫn sử dụng được.
export interface TranscriptResult {
  text: string
  language: string
  confidence: number
}

// CHỨC NĂNG: giới hạn mã ngôn ngữ hợp lệ của dữ liệu địa điểm.
// XỬ LÝ: giữ cả cn và pt vì dự án hiện có hai ngôn ngữ này.
// Không import LangCode từ mobile vì web không được phụ thuộc vào mobile.
export type PlaceLanguage = 'vi' | 'en' | 'ja' | 'cn' | 'pt'

// CHỨC NĂNG: mô tả một nội dung có nhiều bản dịch.
// XỬ LÝ:
// - Tiếng Việt bắt buộc có để làm nội dung nguồn.
// - Các ngôn ngữ khác optional vì service có thể tự dịch khi thiếu.
// - Partial nghĩa là không bắt buộc có đủ mọi khóa ngôn ngữ.
export type LocalizedText = {
  vi: string
} & Partial<Record<PlaceLanguage, string>>

// CHỨC NĂNG: định nghĩa ID danh mục dùng để lọc.
// XỬ LÝ: ID không đổi khi chuyển ngôn ngữ.
// Ví dụ heritage có thể hiển thị là "Di tích" hoặc "Heritage".
export type CategoryId =
  | 'heritage'
  | 'landscape'
  | 'museum'
  | 'culture'
  | 'spiritual'
  | 'food'
  | 'craft'

// CHỨC NĂNG: mô tả tọa độ địa lý.
// XỬ LÝ: cùng cấu trúc với Point mà geo.ts hiện đang sử dụng.
export type Point = {
  lat: number
  lng: number
}

// CHỨC NĂNG: mô tả một địa điểm tham quan.
// XỬ LÝ:
// - Giữ nguyên id, name, description, location như kiểu Place cũ.
// - Mọi trường bổ sung đều optional.
// - Vì vậy dữ liệu cũ trong AsyncStorage không cần chuyển đổi ngay.
export type Place = {
  id: string
  name: LocalizedText
  description: LocalizedText
  location?: Point

  category?: CategoryId
  images?: string[]
  address?: LocalizedText

  // Dùng cho bộ lọc khu vực trên web.
  region?: LocalizedText

  // Dữ liệu đánh giá dùng cho demo.
  rating?: number
  reviewCount?: number
}