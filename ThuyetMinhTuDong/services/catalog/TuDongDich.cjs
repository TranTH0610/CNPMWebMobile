/**
 * CHỨC NĂNG: [TU-DONG-DICH]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * Dịch văn bản tiếng Việt bằng MyMemory, không cần API key cho demo.
 *
 * VỊ TRÍ: services/catalog/TuDongDich.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/KiemThuTuDongDich.test.cjs
 * - services/catalog/MayChuApi.cjs
 *
 * PHỤ THUỘC:
 * - ./ThuatNguDich.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. chunks
 * 2. plain
 * 3. translateText
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
const { protect } = require('./ThuatNguDich.cjs')
const codes = { en: 'en', cn: 'zh-CN', pt: 'pt-PT', ja: 'ja' }

// CHỨC NĂNG: Chia văn bản theo giới hạn byte UTF-8 của một request dịch.
// XỬ LÝ: Ưu tiên ngắt sau dấu câu/khoảng trắng; không cắt đôi ký tự Unicode.
// TẠI SAO: Tiếng Việt/Trung có ký tự nhiều byte; đếm length không đủ chính xác.
// ==================== [TU-DONG-DICH] chunks ====================
function chunks(text, limit = 450) {
  const result = []
  let rest = text
  while (Buffer.byteLength(rest, 'utf8') > limit) {
    let part = '',
      boundary = 0,
      sentence = 0
    for (const char of rest) {
      if (Buffer.byteLength(part + char, 'utf8') > limit) break
      part += char
      if (/[\s.!?。！？]/u.test(char)) boundary = part.length
      if (/[.!?。！？\n]/u.test(char)) sentence = part.length
    }
    let size = sentence || boundary || part.length
    const crossing = Array.from(rest.matchAll(/ZXQ\d+QXZ/g)).find(
      (match) => match.index < size && match.index + match[0].length > size,
    )
    if (crossing) size = crossing.index
    result.push(rest.slice(0, size))
    rest = rest.slice(size)
  }
  if (rest) result.push(rest)
  return result
}

// CHỨC NĂNG: Đổi các thực thể HTML thường gặp trong kết quả về văn bản thuần.
// XỬ LÝ: Không thực thi HTML và không dùng dangerouslySetInnerHTML trên giao diện.
// ==================== [TU-DONG-DICH] plain ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function plain(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  return text.replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[a-f0-9]+);/gi, (original, key) => {
    if (key.startsWith('#')) {
      const value =
        key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10)
      return value >= 0 && value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff)
        ? String.fromCodePoint(value)
        : original
    }
    return named[key.toLowerCase()]
  })
}

// ==================== [TU-DONG-DICH] translateText ====================
// CHỨC NĂNG: Thực hiện bước translateText trong nhiệm vụ: Dịch văn bản tiếng Việt bằng MyMemory, không cần API key cho demo.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
async function translateText(text, language, request = fetch, context = {}) {
  if (!codes[language] || typeof text !== 'string' || text.length > 20000)
    throw Error('Invalid translation')
  if (!text.trim()) return ''
  const protectedText = protect(text, language, context)
  // CHỨC NĂNG: Giữ tên riêng/năm khi cả trường chỉ gồm các giá trị đã bảo vệ.
  // TẠI SAO: Tên di tích đơn lẻ không cần gửi máy dịch rồi có nguy cơ làm hỏng token.
  if (!protectedText.text.replace(/ZXQ\d+QXZ|[\s\p{P}\p{S}]/gu, ''))
    return protectedText.restore(protectedText.text)
  const output = []
  const deadline = Date.now() + 90000
  // CHỨC NĂNG: Dịch lần lượt để hạn chế dồn request; một phần lỗi thì không lưu bản dịch dở.
  // TẠI SAO: admin-core chỉ ghi sau khi hoàn thành cả tên, mô tả, địa chỉ và bài thuyết minh.
  for (const part of chunks(protectedText.text)) {
    if (Date.now() >= deadline) throw Error('Translation timed out')
    if (!part.trim()) {
      output.push(part)
      continue
    }
    const url = new URL('https://api.mymemory.translated.net/get')
    url.searchParams.set('q', part.trim())
    url.searchParams.set('langpair', 'vi|' + codes[language])
    url.searchParams.set('mt', '1')
    const response = await request(url, { signal: AbortSignal.timeout(12000) })
    if (!response.ok) throw Error('Translation unavailable')
    const data = await response.json()
    let translated = data?.responseData?.translatedText
    if (
      Number(data.responseStatus) !== 200 ||
      data.quotaFinished ||
      typeof translated !== 'string' ||
      !translated.trim()
    )
      throw Error('Translation unavailable or quota exceeded')
    // CHỨC NĂNG: Tránh chọn bản nhớ dịch chỉ gần giống câu nguồn, có thể nói sai nội dung.
    // XỬ LÝ: Ưu tiên đoạn khớp chính xác hoặc kết quả máy dịch; không tự nhận bản fuzzy là đúng.
    if (Array.isArray(data.matches) && data.matches.length) {
      const exact = data.matches.find(
        (m) =>
          typeof m.segment === 'string' &&
          m.segment.normalize('NFC').trim() === part.trim() &&
          m.translation,
      )
      const machine = data.matches.find((m) => m['created-by'] === 'MT!' && m.translation)
      if (exact || machine) translated = (exact || machine).translation
      else if (Number(data.responseData?.match) < 1) throw Error('No reliable translation match')
    }
    // Giữ khoảng trắng đầu/cuối đoạn để ghép các đoạn không bị dính từ.
    output.push(
      (part.match(/^\s*/u)?.[0] || '') + plain(translated) + (part.match(/\s*$/u)?.[0] || ''),
    )
  }
  const result = protectedText.restore(output.join(''))
  if (result.length > 20000) throw Error('Translation too long')
  return result
}
module.exports = { translateText, chunks }
