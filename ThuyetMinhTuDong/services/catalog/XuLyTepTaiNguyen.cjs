/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * Trả ảnh/âm thanh từ SQL, có HEAD và HTTP Range để tua trên iOS/web.
 *
 * VỊ TRÍ: services/catalog/XuLyTepTaiNguyen.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/MayChuApi.cjs
 * - services/database/KiemThuTepTaiNguyen.test.cjs
 *
 * PHỤ THUỘC:
 * - ../database/LuuVaDocTepSql.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. rangeOf
 * 2. sendMedia
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
const store = require('../database/LuuVaDocTepSql.cjs')
// ==================== [TAI-NGUYEN] rangeOf ====================
// CHỨC NĂNG: Thực hiện bước rangeOf trong nhiệm vụ: Trả ảnh/âm thanh từ SQL, có HEAD và HTTP Range để tua trên iOS/web.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
// ==================== [TAI-NGUYEN] sendMedia ====================
// CHỨC NĂNG: Thực hiện bước sendMedia trong nhiệm vụ: Trả ảnh/âm thanh từ SQL, có HEAD và HTTP Range để tua trên iOS/web.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
