/**
 * FILE NÀY LÀM GÌ
 * Middleware chuyển tiếp HTTP trong Metro; giữ mã trạng thái, JSON và Range, trả lỗi khi nguồn
 * không sẵn sàng.
 *
 * VỊ TRÍ: scripts/metro-api-proxy.cjs
 * DÙNG BỞI: scripts/metro-admin-proxy.cjs; scripts/metro-visitor-proxy.cjs.
 * PHỤ THUỘC: node:http; node:https
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo http: require nạp module 'node:http' để dùng chức năng có sẵn thay vì chép lại.
const http = require('node:http')
// Khai báo https: require nạp module 'node:https' để dùng chức năng có sẵn thay vì chép lại.
const https = require('node:https')
// CHỨC NĂNG: Tạo lớp chuyển tiếp HTTP trong Metro.
// XỬ LÝ: Giữ phản hồi và Range audio, giới hạn route được phép và trả lỗi khi nguồn tắt.
// Khai báo createDevApiProxy({ enabled = false, prefix, target, allowed = () => false, timeoutMs = 190000 }). Tạo middleware chuyển tiếp các route được cho phép.
function createDevApiProxy({ enabled = false, prefix, target, allowed = () => false, timeoutMs = 190000 }) {
  // Khai báo base: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
  const base = new URL(target)
  // Rẽ nhánh nếu !['http:', 'https:'].includes(base.protocol). | Ném new Error('API target phải dùng HTTP(S).').
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('API target phải dùng HTTP(S).')
  // Rẽ nhánh nếu !prefix || !prefix.startsWith('/'). | Ném new Error('Proxy prefix không hợp lệ.').
  if (!prefix || !prefix.startsWith('/')) throw new Error('Proxy prefix không hợp lệ.')
  // Trả kết quả: khai báo callback (req, res, next) => { if (!enabled || !(req.url === prefix || req.url.start.
  return (req, res, next) => {
    // Rẽ nhánh nếu !enabled || !(req.url === prefix || req.url.startsWith(prefix + '/')). | Trả kết quả: Gọi next().
    if (!enabled || !(req.url === prefix || req.url.startsWith(prefix + '/'))) return next()
    // Khai báo route: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
    const route = new URL(req.url.slice(prefix.length) || '/', 'http://metro.invalid')
    // Rẽ nhánh nếu !allowed(req.method, route.pathname).
    if (!allowed(req.method, route.pathname)) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFou`: Thực hiện Gọi res.writeHead(404, { 'Content-Type': 'application/json' }). | Gán thuộc tính 'Content-Type': chuỗi 'application/json'. | Thực hiện Gọi res.end('{"error":"notFound"}'). | Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFound"}'); return
    }
    // CHỨC NĂNG: Giữ JSON, status và Range của nguồn, không tạo số liệu thay thế.
    // Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
    const url = new URL(base)
    // Thực hiện tính biểu thức url.pathname = base.pathname.replace(/\/$/, '') + route.pathname.
    url.pathname = base.pathname.replace(/\/$/, '') + route.pathname
    // Thực hiện tính biểu thức url.search = route.search.
    url.search = route.search
    // Khai báo headers: tạo object gồm ...giá trị ghép, host. | Gán thuộc tính host: đọc url.host từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    const headers = { ...req.headers, host: url.host }
    // Thực hiện sử dụng delete headers.origin làm giá trị của bước hiện tại.
    delete headers.origin
    // Khai báo transport: chọn giữa hai giá trị theo điều kiện url.protocol === 'https:'.
    const transport = url.protocol === 'https:' ? https : http
    // Khai báo upstream: Gọi transport.request(url, { method: req.method, headers }, response => { res.writeHead(respon. | Gán thuộc tính method: đọc req.method từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường headers bằng giá trị của biến cùng tên.
    const upstream = transport.request(url, { method: req.method, headers }, response => {
      // Thực hiện Gọi res.writeHead(response.statusCode || 502, response.headers).
      res.writeHead(response.statusCode || 502, response.headers)
      // Đăng ký xử lý sự kiện: response.on('error', () => res.destroy()).
      response.on('error', () => res.destroy())
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `response.pipe(res)`: Thực hiện Gọi response.pipe(res).
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      response.pipe(res)
    })
    // CHỨC NĂNG: Dọn kết nối khi client bỏ request hoặc mock API dừng.
    // Thực hiện setTimeout lên lịch tác vụ một lần.
    upstream.setTimeout(timeoutMs, () => upstream.destroy(new Error('API timeout')))
    // Đăng ký xử lý sự kiện: upstream.on('error', () => { if (res.headersSent) { res.destroy().
    upstream.on('error', () => {
      // Rẽ nhánh nếu res.headersSent. | Thực hiện Gọi res.destroy(). | Thoát hàm hiện tại ngay.
      if (res.headersSent) { res.destroy(); return }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' }); res.end('{`: Thực hiện Gọi res.writeHead(503, { 'Content-Type': 'application/json. | Gán thuộc tính 'Content-Type': chuỗi 'application/json. | Thực hiện Gọi res.end('{"error":"loadError"}').
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' }); res.end('{"error":"loadError"}')
    })
    // Đăng ký xử lý sự kiện: req.on('aborted', () => upstream.destroy()).
    req.on('aborted', () => upstream.destroy())
    // Đăng ký xử lý sự kiện: res.on('close', () => { if (!res.writableEnded) upstream.destroy() }). | Rẽ nhánh nếu !res.writableEnded. | Thực hiện Gọi upstream.destroy().
    res.on('close', () => { if (!res.writableEnded) upstream.destroy() })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `req.pipe(upstream)`: Thực hiện Gọi req.pipe(upstream).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    req.pipe(upstream)
  }
}
// TẠI SAO (createDevApiProxy): Điện thoại cần gọi được mock API trên máy tính qua origin Metro;
// proxy không tạo thêm kho dữ liệu.
// Thực hiện tính biểu thức module.exports = { createDevApiProxy }. | Đặt trường createDevApiProxy bằng giá trị của biến cùng tên.
module.exports = { createDevApiProxy }
