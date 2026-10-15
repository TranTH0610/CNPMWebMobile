/**
 * FILE NÀY LÀM GÌ:
 * Gọi dịch vụ dịch và Wikipedia, chuyển mã ngôn ngữ nội bộ
 * sang mã bên ngoài, kiểm tra lỗi trước khi lưu bản dịch.
 *
 * Được dùng bởi:
 * - hooks/usePlaceText.ts
 * - services/placeCatalog.ts
 * - screens/AddPlaceScreen.tsx
 *
 * Phụ thuộc: fetch và AbortController có sẵn trong môi trường app.
 * Liên quan: UC02, luồng tự dịch, cache và xử lý lỗi.
 */

// CHỨC NĂNG: đánh dấu phiên bản cơ chế dịch/cache.
// XỬ LÝ: dùng phiên bản mới để bỏ qua dữ liệu lỗi có thể đã được
// lưu bởi cơ chế cũ. Không xóa các địa điểm người dùng đã thêm.
export const TRANSLATION_CACHE_VERSION = 'v2'

// CHỨC NĂNG: giữ bản dịch trong bộ nhớ của phiên đang chạy.
// XỬ LÝ: chỉ lưu sau khi toàn bộ nội dung dịch thành công.
// Cache lưu lâu dài trong AsyncStorage được xử lý ở lớp bên ngoài.
const cache = new Map<string, string>()

// CHỨC NĂNG: chuyển mã ngôn ngữ nội bộ sang mã dịch.
// XỬ LÝ:
// - cn là mã nội bộ của dự án, gửi ra ngoài thành zh-CN.
// - pt gửi thành pt-PT để thống nhất với biến thể đang dùng.
// - Ngôn ngữ khác giữ nguyên.
export function translationLanguage(code: string): string {
  const aliases: Record<string, string> = {
    cn: 'zh-CN',
    zh: 'zh-CN',
    'zh-cn': 'zh-CN',
    pt: 'pt-PT',
    'pt-pt': 'pt-PT',
  }

  return aliases[code.toLowerCase()] ?? code
}

// CHỨC NĂNG: tính số byte UTF-8 của văn bản.
// XỬ LÝ:
// - Một ký tự không nhất thiết bằng một byte.
// - Chữ Việt, Trung và emoji có thể chiếm nhiều byte.
// - for...of duyệt nguyên ký tự Unicode, không cắt đôi emoji.
function byteLength(text: string): number {
  let bytes = 0

  for (const character of text) {
    const code = character.codePointAt(0) ?? 0

    if (code <= 0x7f) {
      bytes += 1
    } else if (code <= 0x7ff) {
      bytes += 2
    } else if (code <= 0xffff) {
      bytes += 3
    } else {
      bytes += 4
    }
  }

  return bytes
}

// CHỨC NĂNG: chia nội dung dài thành các đoạn nhỏ để gửi dịch.
// XỬ LÝ:
// - Giới hạn mỗi đoạn 450 byte.
// - Ưu tiên cắt ở khoảng trắng gần cuối để ít cắt giữa một từ.
// - Nếu không có khoảng trắng vẫn chia được.
// - Khắc phục code cũ: một câu dài có thể vượt giới hạn dù đã
//   gọi hàm "chia theo câu".
export function chunkText(text: string): string[] {
  const chunks: string[] = []

  let current = ''
  let bytes = 0

  for (const character of text.trim()) {
    const size = byteLength(character)

    if (bytes + size > 450) {
      const boundary = current.lastIndexOf(' ')

      // CHỨC NĂNG: ưu tiên một điểm cắt đủ gần cuối đoạn.
      // XỬ LÝ: tránh tạo đoạn quá ngắn nếu khoảng trắng duy nhất
      // nằm ở đầu đoạn.
      if (boundary > current.length / 2) {
        chunks.push(
          current.slice(0, boundary).trim(),
        )

        // Giữ phần chưa gửi cho đoạn tiếp theo.
        current = current.slice(boundary + 1)
      } else {
        chunks.push(current.trim())
        current = ''
      }

      bytes = byteLength(current)
    }

    current += character
    bytes += size
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks
}

// CHỨC NĂNG: kiểm tra dữ liệu nhận từ mạng có phải object.
// XỬ LÝ: JSON là unknown, chỉ đọc thuộc tính sau khi kiểm tra.
// Không dùng any vì không thể tin hoàn toàn cấu trúc API.
function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

// CHỨC NĂNG: lấy JSON với thời hạn chờ.
// XỬ LÝ:
// - Sau 12 giây thì hủy yêu cầu.
// - finally luôn hủy timer, kể cả khi mạng hoặc JSON bị lỗi.
// - Lỗi được truyền lên hook để hiện nút Thử lại.
async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController()

  const timer = setTimeout(() => {
    controller.abort()
  }, 12000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data: unknown = await response.json()

    return data
  } finally {
    clearTimeout(timer)
  }
}

// CHỨC NĂNG: dịch một đoạn văn bản.
// XỬ LÝ:
// - Mã nguồn/đích đã được chuẩn hóa trước khi gọi.
// - Mã hóa cả langpair để ký tự "|" được gửi đúng.
// - Kiểm tra HTTP ở fetchJson và trạng thái API ở đây.
// - Không nhận thông báo lỗi/quota làm bản dịch.
async function translateChunk(
  text: string,
  from: string,
  to: string,
): Promise<string> {
  const languagePair = `${from}|${to}`

  const url =
    'https://api.mymemory.translated.net/get' +
    `?q=${encodeURIComponent(text)}` +
    `&langpair=${encodeURIComponent(languagePair)}`

  const data = await fetchJson(url)

  // CHỨC NĂNG: nhận diện yêu cầu bị dịch vụ từ chối.
  // XỬ LÝ: HTTP có thể thành công nhưng responseStatus trong
  // JSON vẫn là lỗi. Những kết quả đó tuyệt đối không được cache.
  if (
    !isRecord(data) ||
    Number(data.responseStatus) !== 200 ||
    data.quotaFinished === true
  ) {
    throw new Error(
      'Translation service rejected the request',
    )
  }

  const responseData = data.responseData

  // CHỨC NĂNG: kiểm tra bản dịch thật sự tồn tại.
  // XỬ LÝ: từ chối trường thiếu, sai kiểu hoặc chuỗi rỗng.
  if (
    !isRecord(responseData) ||
    typeof responseData.translatedText !== 'string' ||
    !responseData.translatedText.trim()
  ) {
    throw new Error('No valid translation returned')
  }

  return responseData.translatedText.trim()
}

// CHỨC NĂNG: dịch toàn bộ nội dung.
// XỬ LÝ:
// - Giữ chữ ký hàm cũ để các caller không cần thay đổi.
// - Chuẩn hóa mã ngôn ngữ trước khi gửi.
// - Các đoạn được dịch tuần tự.
// - Chỉ lưu cache khi mọi đoạn đều thành công.
export async function translateLong(
  text: string,
  from: string,
  to: string,
): Promise<string> {
  if (!text.trim()) {
    return ''
  }

  const source = translationLanguage(from)
  const target = translationLanguage(to)

  if (source === target) {
    return text
  }

  const key =
    `${TRANSLATION_CACHE_VERSION}|` +
    `${source}|${target}|${text}`

  const saved = cache.get(key)

  if (saved) {
    return saved
  }

  const translated: string[] = []

  for (const chunk of chunkText(text)) {
    const result = await translateChunk(
      chunk,
      source,
      target,
    )

    translated.push(result)
  }

  const result = translated.join(' ')

  cache.set(key, result)

  return result
}

// CHỨC NĂNG: giữ chức năng lấy mô tả từ Wikipedia của AddPlace.
// XỬ LÝ:
// - Wikipedia tiếng Trung dùng mã zh.
// - Kiểm tra extract trước khi trả về.
// - Không đổi cách AddPlaceScreen gọi hàm.
export async function fetchWikiSummary(
  title: string,
  lang = 'vi',
): Promise<string> {
  const wikiLang =
    lang === 'cn' ||
    lang.toLowerCase().startsWith('zh')
      ? 'zh'
      : lang.split('-')[0]

  const url =
    `https://${wikiLang}.wikipedia.org` +
    '/api/rest_v1/page/summary/' +
    encodeURIComponent(title.trim())

  const data = await fetchJson(url)

  if (
    !isRecord(data) ||
    typeof data.extract !== 'string' ||
    !data.extract.trim()
  ) {
    throw new Error('No Wikipedia summary returned')
  }

  return data.extract
}