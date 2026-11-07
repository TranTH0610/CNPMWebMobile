/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng.
 *
 * VỊ TRÍ: packages/visitor-core/src/data/DiSanHue.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/data/DuLieuKhoiTao.ts
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - ./NoiDungDiSan.json
 * - ./DanhMucBanThu.json
 * - ../domain/KieuDuLieuDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. bundledNarration
 * 2. narrationKey
 * 3. bundledNarrationKey
 * 4. heritageText
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập các thành phần từ './NoiDungDiSan.json'.
import raw from './NoiDungDiSan.json'
// Nhập các thành phần từ './DanhMucBanThu.json'.
import recordings from './DanhMucBanThu.json'
// Nhập kiểu dữ liệu từ '../domain/KieuDuLieuDuKhach'.
import type { ContentSource, Language, PublishedText } from '../domain/KieuDuLieuDuKhach'

// Đặt tên kiểu HeritageEntry.
type HeritageEntry = {
  // Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo period, kiểu string. | Khai báo sources, kiểu ContentSource[].
  id: string; period: string; sources: ContentSource[]
  
  content: Record<Language, { address: string; summary: string; body: string }>
}
// Khai báo HERITAGE_CONTENT: sử dụng raw làm giá trị của bước hiện tại.
export const HERITAGE_CONTENT: readonly HeritageEntry[] = raw
// Khai báo NARRATIONS: sử dụng recordings làm giá trị của bước hiện tại.
export const NARRATIONS = recordings

// CHỨC NĂNG: Lấy MP3 đóng gói chỉ khi body trùng đúng bài đã tạo âm thanh.
// XỬ LÝ: Văn bản biên tập khác dù cùng ID/ngôn ngữ sẽ không mượn MP3 cũ.
// Khai báo bundledNarration(id, language, body). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] bundledNarration ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function bundledNarration(id: string, language: Language, body: string) {
  // Khai báo entry: HERITAGE_CONTENT.find lấy phần tử đầu tiên phù hợp.
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  // Rẽ nhánh nếu entry?.content[language].body !== body. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
  if (entry?.content[language].body !== body) return undefined
  // Khai báo recording: NARRATIONS.find lấy phần tử đầu tiên phù hợp.
  const recording = NARRATIONS.find(audio => audio.placeId === id && audio.language === language)
  
  return recording ? 'narration:' + recording.key : undefined
}
// TẠI SAO (bundledNarration): Dùng đúng dấu vân tay tránh phát bản thu của bài hoặc nội dung cũ.

// CHỨC NĂNG: Chuyển khóa an toàn thành đường dẫn asset hoặc API.
// XỬ LÝ: Chỉ nhận SHA-256 đủ 64 ký tự; không ghép đường dẫn tùy ý từ QR/input.
// Khai báo narrationKey(url). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] narrationKey ====================
export function narrationKey(url: string): string | undefined {
  
  return /^narration:[a-f0-9]{64}$/.test(url) ? url.slice(10) : undefined
}
// TẠI SAO (narrationKey): Khóa audio đi vào đường dẫn tải tệp nên phải đúng định dạng, không
// nhận chuỗi tùy ý.
// CHỨC NĂNG: Tìm khóa bản thu đã đóng gói tương ứng.
// XỬ LÝ: Chỉ khớp trên dữ liệu manifest đã có, không tạo âm thanh mới ở đây.
// Khai báo bundledNarrationKey(key). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] bundledNarrationKey ====================
export function bundledNarrationKey(key: string): boolean {
  
  return NARRATIONS.some(audio => audio.key === key)
}
// TẠI SAO (bundledNarrationKey): Tra manifest giúp xác định audio đã đóng gói khớp bài, không
// giả vờ đã tạo một bản thu mới.
// CHỨC NĂNG: Lấy nội dung nguồn của di tích theo ngôn ngữ.
// XỬ LÝ: Giữ cách đọc dữ liệu JSON tại một nơi thay vì ghép thủ công ở mỗi UI.
// Khai báo heritageText(id, language, title). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] heritageText ====================
export function heritageText(id: string, language: Language, title: string): PublishedText {
  // Khai báo entry: HERITAGE_CONTENT.find lấy phần tử đầu tiên phù hợp.
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  // Rẽ nhánh nếu !entry. | Ném new Error('Missing heritage content: ' + id).
  if (!entry) throw new Error('Missing heritage content: ' + id)
  // Khai báo text: đọc entry.content[language] từ đối tượng/mảng để dùng tại bước hiện tại.
  const text = entry.content[language]
  // Khai báo url: Gọi bundledNarration(id, language, text.body).
  const url = bundledNarration(id, language, text.body)
  // Rẽ nhánh nếu !url. | Ném new Error('Missing narration: ' + id + '/' + language).
  if (!url) throw new Error('Missing narration: ' + id + '/' + language)
  // Khai báo date: chuỗi '2026-10-24T00:00:00Z'.
  const date = '2026-10-24T00:00:00Z'
  
  return {
    ...text, title, sources: entry.sources, adaptation: 'rewritten-and-translated',
    // Gán thuộc tính version: giá trị số 2. | Gán thuộc tính status: chuỗi 'published'. | Gán thuộc tính approvedAt: sử dụng date làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính publishedAt: sử dụng date làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    version: 2, status: 'published', approvedAt: date, publishedAt: date,
    
    audio: { id: url, url, version: 2, status: 'published', approvedAt: date, publishedAt: date },
  }
}
// TẠI SAO (heritageText): Nguồn văn bản cần có một cách đọc thống nhất để seed và thuyết minh
// không ghép nhầm nội dung.
/* CÁCH KIỂM TRA: Có 8 bài × 5 ngôn ngữ; body thay đổi trả undefined;
 * mỗi audio có khóa khác nhau và đường dẫn không chứa tên máy/IP. */
