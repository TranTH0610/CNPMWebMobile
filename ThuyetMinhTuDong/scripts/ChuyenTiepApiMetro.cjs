/**
 * FILE: scripts/ChuyenTiepApiMetro.cjs
 * FILE NÀY LÀM GÌ: Middleware chuyển tiếp HTTP trong Metro; giữ mã trạng thái, JSON và Range, trả lỗi khi nguồn
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const http = require('node:http')
const https = require('node:https')
// CHỨC NĂNG: Tạo lớp chuyển tiếp HTTP trong Metro.
// XỬ LÝ: Giữ phản hồi và Range audio, giới hạn route được phép và trả lỗi khi nguồn tắt.
// [HỖ TRỢ CHUNG] createDevApiProxy — Tạo lớp chuyển tiếp HTTP trong Metro.
function createDevApiProxy({ enabled = false, prefix, target, allowed = () => false, timeoutMs = 190000 }) {
  const base = new URL(target)
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('API target phải dùng HTTP(S).')
  if (!prefix || !prefix.startsWith('/')) throw new Error('Proxy prefix không hợp lệ.')
  // Trả kết quả: khai báo callback (req, res, next) => { if (!enabled || !(req.url === prefix || req.url.start.
  return (req, res, next) => {
    if (!enabled || !(req.url === prefix || req.url.startsWith(prefix + '/'))) return next()
    const route = new URL(req.url.slice(prefix.length) || '/', 'http://metro.invalid')
    if (!allowed(req.method, route.pathname)) {
      
      res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFound"}'); return
    }
    // CHỨC NĂNG: Giữ JSON, status và Range của nguồn, không tạo số liệu thay thế.
    const url = new URL(base)
    url.pathname = base.pathname.replace(/\/$/, '') + route.pathname
    url.search = route.search
    const headers = { ...req.headers, host: url.host }
    delete headers.origin
    const transport = url.protocol === 'https:' ? https : http
    const upstream = transport.request(url, { method: req.method, headers }, response => {
      res.writeHead(response.statusCode || 502, response.headers)
      // Đăng ký xử lý sự kiện: response.on('error', () => res.destroy()).
      response.on('error', () => res.destroy())
      
      response.pipe(res)
    })
    // CHỨC NĂNG: Dọn kết nối khi client bỏ request hoặc mock API dừng.
    upstream.setTimeout(timeoutMs, () => upstream.destroy(new Error('API timeout')))
    // Đăng ký xử lý sự kiện: upstream.on('error', () => { if (res.headersSent) { res.destroy().
    upstream.on('error', () => {
      if (res.headersSent) { res.destroy(); return }
      
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' }); res.end('{"error":"loadError"}')
    })
    // Đăng ký xử lý sự kiện: req.on('aborted', () => upstream.destroy()).
    req.on('aborted', () => upstream.destroy())
    // Đăng ký xử lý sự kiện: res.on('close', () => { if (!res.writableEnded) upstream.destroy() }). | Rẽ nhánh nếu !res.writableEnded. | Thực hiện Gọi upstream.destroy().
    res.on('close', () => { if (!res.writableEnded) upstream.destroy() })
    
    req.pipe(upstream)
  }
}
// TẠI SAO (createDevApiProxy): Điện thoại cần gọi được mock API trên máy tính qua origin Metro;
// proxy không tạo thêm kho dữ liệu.
module.exports = { createDevApiProxy }
