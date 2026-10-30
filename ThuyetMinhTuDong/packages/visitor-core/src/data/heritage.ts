/**
 * FILE NÀY LÀM GÌ
 * Nạp/ghép nội dung di tích từ dữ liệu nguồn vào cấu trúc mà danh mục du khách dùng.
 *
 * VỊ TRÍ: packages/visitor-core/src/data/heritage.ts
 * DÙNG BỞI: packages/visitor-core/src/data/mock.ts; packages/visitor-core/src/index.ts.
 * PHỤ THUỘC: ./heritageContent.json; ./narrations.json; ../domain/model
 * TẠI SAO TÁCH FILE: Dữ liệu nguồn cần một nơi đối chiếu để ảnh, văn bản và bản thu không bị
 * ghép lệch nhau.
 */
// Nhập các thành phần từ './heritageContent.json'.
import raw from './heritageContent.json'
// Nhập các thành phần từ './narrations.json'.
import recordings from './narrations.json'
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { ContentSource, Language, PublishedText } from '../domain/model'

// Đặt tên kiểu HeritageEntry.
type HeritageEntry = {
  // Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo period, kiểu string. | Khai báo sources, kiểu ContentSource[].
  id: string; period: string; sources: ContentSource[]
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `content: Record<Language, { address: string; summary: string; body: string }>`: Khai báo content, kiểu Record<Language, { address: string; summary: string; body: string }>. | Khai báo address, kiểu string. | Khai báo summary, kiểu string. | Khai báo body, kiểu string.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  content: Record<Language, { address: string; summary: string; body: string }>
}
// Khai báo HERITAGE_CONTENT: sử dụng raw làm giá trị của bước hiện tại.
export const HERITAGE_CONTENT: readonly HeritageEntry[] = raw
// Khai báo NARRATIONS: sử dụng recordings làm giá trị của bước hiện tại.
export const NARRATIONS = recordings

// CHỨC NĂNG: Lấy MP3 đóng gói chỉ khi body trùng đúng bài đã tạo âm thanh.
// XỬ LÝ: Văn bản biên tập khác dù cùng ID/ngôn ngữ sẽ không mượn MP3 cũ.
// Khai báo bundledNarration(id, language, body). Nhận đầu vào qua tham số.
export function bundledNarration(id: string, language: Language, body: string) {
  // Khai báo entry: HERITAGE_CONTENT.find lấy phần tử đầu tiên phù hợp.
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  // Rẽ nhánh nếu entry?.content[language].body !== body. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
  if (entry?.content[language].body !== body) return undefined
  // Khai báo recording: NARRATIONS.find lấy phần tử đầu tiên phù hợp.
  const recording = NARRATIONS.find(audio => audio.placeId === id && audio.language === language)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return recording ? 'narration:' + recording.key : undefined`: Trả kết quả: chọn giữa hai giá trị theo điều kiện recording.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return recording ? 'narration:' + recording.key : undefined
}
// TẠI SAO (bundledNarration): Dùng đúng dấu vân tay tránh phát bản thu của bài hoặc nội dung cũ.

// CHỨC NĂNG: Chuyển khóa an toàn thành đường dẫn asset hoặc API.
// XỬ LÝ: Chỉ nhận SHA-256 đủ 64 ký tự; không ghép đường dẫn tùy ý từ QR/input.
// Khai báo narrationKey(url). Nhận đầu vào qua tham số.
export function narrationKey(url: string): string | undefined {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return /^narration:[a-f0-9]{64}$/.test(url) ? url.slice(10) : undefined`: Trả kết quả: chọn giữa hai giá trị theo điều kiện /^narration:[a-f0-9]{64}$/.test(url).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return /^narration:[a-f0-9]{64}$/.test(url) ? url.slice(10) : undefined
}
// TẠI SAO (narrationKey): Khóa audio đi vào đường dẫn tải tệp nên phải đúng định dạng, không
// nhận chuỗi tùy ý.
// CHỨC NĂNG: Tìm khóa bản thu đã đóng gói tương ứng.
// XỬ LÝ: Chỉ khớp trên dữ liệu manifest đã có, không tạo âm thanh mới ở đây.
// Khai báo bundledNarrationKey(key). Nhận đầu vào qua tham số.
export function bundledNarrationKey(key: string): boolean {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return NARRATIONS.some(audio => audio.key === key)`: Trả kết quả: NARRATIONS.some kiểm tra có ít nhất một phần tử đạt điều kiện.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return NARRATIONS.some(audio => audio.key === key)
}
// TẠI SAO (bundledNarrationKey): Tra manifest giúp xác định audio đã đóng gói khớp bài, không
// giả vờ đã tạo một bản thu mới.
// CHỨC NĂNG: Lấy nội dung nguồn của di tích theo ngôn ngữ.
// XỬ LÝ: Giữ cách đọc dữ liệu JSON tại một nơi thay vì ghép thủ công ở mỗi UI.
// Khai báo heritageText(id, language, title). Nhận đầu vào qua tham số.
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm ...giá trị ghép, title, sources, adaptation, version, status, approvedAt, publishedAt, audio.
   * DÒNG `...text, title, sources: entry.sources, adaptation: 'rewritten-and-translated',`: Trả kết quả: tạo object gồm ...giá trị ghép, title, sources, adaptation, version, status, approvedAt, publishedAt, audio. | Đặt trường title bằng giá trị của biến cùng tên. | Gán thuộc tính sources: đọc entry.sources từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính adaptation: chuỗi 'rewritten-and-translated'.
   */
  return {
    ...text, title, sources: entry.sources, adaptation: 'rewritten-and-translated',
    // Gán thuộc tính version: giá trị số 2. | Gán thuộc tính status: chuỗi 'published'. | Gán thuộc tính approvedAt: sử dụng date làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính publishedAt: sử dụng date làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    version: 2, status: 'published', approvedAt: date, publishedAt: date,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `audio: { id: url, url, version: 2, status: 'published', approvedAt: date, publishedAt`: Gán thuộc tính audio: tạo object gồm id, url, version, status, approvedAt, publishedAt. | Gán thuộc tính id: sử dụng url làm giá trị của bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Đặt trường url bằng giá trị của biến cùng tên. | Gán thuộc tính version: giá trị số 2. | Gán thuộc tính status: chuỗi 'published'. | Gán thuộc tính approvedAt: sử dụng date làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính publishedAt: sử dụng date làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    audio: { id: url, url, version: 2, status: 'published', approvedAt: date, publishedAt: date },
  }
}
// TẠI SAO (heritageText): Nguồn văn bản cần có một cách đọc thống nhất để seed và thuyết minh
// không ghép nhầm nội dung.
/* CÁCH KIỂM TRA: Có 8 bài × 5 ngôn ngữ; body thay đổi trả undefined;
 * mỗi audio có khóa khác nhau và đường dẫn không chứa tên máy/IP. */
