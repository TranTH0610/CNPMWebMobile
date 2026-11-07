/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Khai báo kiểu Place và các kiểu dữ liệu chia sẻ của phần danh mục; metadata mới giữ tương thích
 *
 * VỊ TRÍ: packages/shared-types/XuatCongKhai.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// CHỨC NĂNG: giữ nguyên kiểu kết quả thuyết minh đã có.
// XỬ LÝ: không đổi trường cũ để các phần khác của dự án vẫn sử dụng được.
// Khai báo hợp đồng TranscriptResult.
export interface TranscriptResult {
  // Khai báo text, kiểu string.
  text: string
  // Khai báo language, kiểu string. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác.
  language: string
  
  confidence: number
}

// CHỨC NĂNG: giới hạn mã ngôn ngữ hợp lệ của dữ liệu địa điểm.
// XỬ LÝ: giữ cả cn và pt vì dự án hiện có hai ngôn ngữ này.
// Không import LangCode từ mobile vì web không được phụ thuộc vào mobile.
// Đặt tên kiểu PlaceLanguage.
export type PlaceLanguage = 'vi' | 'en' | 'ja' | 'cn' | 'pt'

// CHỨC NĂNG: mô tả một nội dung có nhiều bản dịch.
// XỬ LÝ:
// - Tiếng Việt bắt buộc có để làm nội dung nguồn.
// - Các ngôn ngữ khác optional vì service có thể tự dịch khi thiếu.
// - Partial nghĩa là không bắt buộc có đủ mọi khóa ngôn ngữ.
// Đặt tên kiểu LocalizedText.
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
// Đặt tên kiểu Point.
export type Point = {
  // Khai báo lat, kiểu number.
  lat: number
  
  lng: number
}

// CHỨC NĂNG: mô tả một địa điểm tham quan.
// XỬ LÝ:
// - Giữ nguyên id, name, description, location như kiểu Place cũ.
// - Mọi trường bổ sung đều optional.
// - Vì vậy dữ liệu cũ trong AsyncStorage không cần chuyển đổi ngay.
// Đặt tên kiểu Place.
export type Place = {
  // Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
  id: string
  // Khai báo name, kiểu LocalizedText.
  name: LocalizedText
  // Khai báo description, kiểu LocalizedText.
  description: LocalizedText
  // Khai báo location không bắt buộc, kiểu Point.
  location?: Point

  // Khai báo category không bắt buộc, kiểu CategoryId.
  category?: CategoryId
  // Khai báo images không bắt buộc, kiểu string[]. Giữ danh sách nguồn ảnh để UI có thể xử lý từng nguồn và ảnh lỗi.
  images?: string[]
  // Khai báo address không bắt buộc, kiểu LocalizedText.
  address?: LocalizedText

  // Dùng cho bộ lọc khu vực trên web.
  // Khai báo region không bắt buộc, kiểu LocalizedText.
  region?: LocalizedText

  // Dữ liệu đánh giá dùng cho demo.
  // Khai báo rating không bắt buộc, kiểu number.
  rating?: number
  
  reviewCount?: number
}