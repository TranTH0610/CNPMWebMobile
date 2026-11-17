/**
 * FILE: services/catalog/XuLyTepTaiNguyen.cjs
 * FILE NÀY LÀM GÌ: Đọc và trả ảnh/audio từ kho tài nguyên, phân biệt bản nghe thử với bản đã công bố.
 * VAI TRÒ: Máy chủ/API; nhận yêu cầu từ Web và Mobile.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const store = require('../database/LuuVaDocTepSql.cjs')
function rangeOf(value, size) {
  if (!value) return { start: 0, end: size - 1, partial: false }
  const match = /^bytes=(\d*)-(\d*)$/.exec(value)
  if (!match || (!match[1] && !match[2])) return null
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]))
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    start > end ||
    start >= size
  )
    return null
  return { start, end, partial: true }
}
async function sendMedia(req, res, { id, scope = 'main', preview = false }) {
  if (!id || !(await store.allowed(id, scope, preview))) {
    res.statusCode = 404
    res.end()
    return
  }
  const file = await store.metadata(id, scope)
  if (!file) {
    res.statusCode = 404
    res.end()
    return
  }
  const range = rangeOf(req.headers.range, Number(file.ByteLength))
  const length = range ? range.end - range.start + 1 : 0
  // Đọc SQL trước khi ghi header: nếu SQL lỗi thì API còn trả JSON lỗi đúng định dạng.
  const content =
    range && req.method !== 'HEAD' ? await store.bytes(id, range.start, length, scope) : null
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Type', file.MimeType)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'private, max-age=300')
  res.setHeader('ETag', '"' + id + '"')
  if (!range) {
    res.statusCode = 416
    res.setHeader('Content-Range', 'bytes */' + file.ByteLength)
    res.end()
    return
  }
  res.statusCode = range.partial ? 206 : 200
  if (range.partial)
    res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.ByteLength}`)
  res.setHeader('Content-Length', length)
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  // SUBSTRING chỉ lấy phần byte cần thiết từ SQL, không đọc toàn MP3 khi khách tua.
  res.end(content)
}
module.exports = { sendMedia, rangeOf }
