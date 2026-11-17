/**
 * FILE: packages/visitor-core/src/data/DiSanHue.ts
 * FILE NÀY LÀM GÌ: Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import raw from './NoiDungDiSan.json'
import recordings from './DanhMucBanThu.json'
import type { ContentSource, Language, PublishedText } from '../domain/KieuDuLieuDuKhach'

type HeritageEntry = {
  id: string; period: string; sources: ContentSource[]
  
  content: Record<Language, { address: string; summary: string; body: string }>
}
export const HERITAGE_CONTENT: readonly HeritageEntry[] = raw
export const NARRATIONS = recordings

// CHỨC NĂNG: Lấy MP3 đóng gói chỉ khi body trùng đúng bài đã tạo âm thanh.
// XỬ LÝ: Văn bản biên tập khác dù cùng ID/ngôn ngữ sẽ không mượn MP3 cũ.
// [UC02 / UC04 / UC07 / UC08] bundledNarration — Lấy MP3 đóng gói chỉ khi body trùng đúng bài đã tạo âm thanh.
export function bundledNarration(id: string, language: Language, body: string) {
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  if (entry?.content[language].body !== body) return undefined
  const recording = NARRATIONS.find(audio => audio.placeId === id && audio.language === language)
  
  return recording ? 'narration:' + recording.key : undefined
}
// TẠI SAO (bundledNarration): Dùng đúng dấu vân tay tránh phát bản thu của bài hoặc nội dung cũ.

// CHỨC NĂNG: Chuyển khóa an toàn thành đường dẫn asset hoặc API.
// XỬ LÝ: Chỉ nhận SHA-256 đủ 64 ký tự; không ghép đường dẫn tùy ý từ QR/input.
// [UC02 / UC04 / UC07 / UC08] narrationKey — Chuyển khóa an toàn thành đường dẫn asset hoặc API.
export function narrationKey(url: string): string | undefined {
  
  return /^narration:[a-f0-9]{64}$/.test(url) ? url.slice(10) : undefined
}
// TẠI SAO (narrationKey): Khóa audio đi vào đường dẫn tải tệp nên phải đúng định dạng, không
// nhận chuỗi tùy ý.
// CHỨC NĂNG: Tìm khóa bản thu đã đóng gói tương ứng.
// XỬ LÝ: Chỉ khớp trên dữ liệu manifest đã có, không tạo âm thanh mới ở đây.
// [UC02 / UC04 / UC07 / UC08] bundledNarrationKey — Tìm khóa bản thu đã đóng gói tương ứng.
export function bundledNarrationKey(key: string): boolean {
  
  return NARRATIONS.some(audio => audio.key === key)
}
// TẠI SAO (bundledNarrationKey): Tra manifest giúp xác định audio đã đóng gói khớp bài, không
// giả vờ đã tạo một bản thu mới.
// CHỨC NĂNG: Lấy nội dung nguồn của di tích theo ngôn ngữ.
// XỬ LÝ: Giữ cách đọc dữ liệu JSON tại một nơi thay vì ghép thủ công ở mỗi UI.
// [UC02 / UC04 / UC07 / UC08] heritageText — Lấy nội dung nguồn của di tích theo ngôn ngữ.
export function heritageText(id: string, language: Language, title: string): PublishedText {
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  if (!entry) throw new Error('Missing heritage content: ' + id)
  const text = entry.content[language]
  const url = bundledNarration(id, language, text.body)
  if (!url) throw new Error('Missing narration: ' + id + '/' + language)
  const date = '2026-10-24T00:00:00Z'
  
  return {
    ...text, title, sources: entry.sources, adaptation: 'rewritten-and-translated',
    version: 2, status: 'published', approvedAt: date, publishedAt: date,
    
    audio: { id: url, url, version: 2, status: 'published', approvedAt: date, publishedAt: date },
  }
}
// TẠI SAO (heritageText): Nguồn văn bản cần có một cách đọc thống nhất để seed và thuyết minh
// không ghép nhầm nội dung.
/* CÁCH KIỂM TRA: Có 8 bài × 5 ngôn ngữ; body thay đổi trả undefined;
 * mỗi audio có khóa khác nhau và đường dẫn không chứa tên máy/IP. */
