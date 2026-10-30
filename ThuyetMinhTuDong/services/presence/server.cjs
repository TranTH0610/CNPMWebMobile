/**
 * FILE NÀY LÀM GÌ
 * Mock HTTP API cổng 8787: nhận heartbeat/end, trả thống kê active và dọn phiên; số liệu lấy từ
 * SQL Server.
 *
 * VỊ TRÍ: services/presence/server.cjs
 * DÙNG BỞI: services/presence/presence.test.cjs.
 * PHỤ THUỘC: node:http; ../database/repository.cjs
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
 * lớp kết nối này.
 */
// Khai báo http: require nạp module 'node:http' để dùng chức năng có sẵn thay vì chép lại.
const http = require('node:http')
// SQL là kho lưu phiên; không tự chuyển sang RAM nếu kết nối database lỗi.
const { createSqlRepository } = require('../database/repository.cjs')
// Khai báo validId: khai báo callback value => typeof value === 'string' && /^[a-zA-Z0-9_-]{20,100}$/.test(value).
const validId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{20,100}$/.test(value)
// TẠI SAO (validId): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
// lớp kết nối này.
// CHỨC NĂNG: Đọc JSON giới hạn 4 KB để request sai không làm đầy RAM.
// XỬ LÝ: Không nhận mã phiên từ query URL; không lưu địa chỉ IP hoặc thông tin cá nhân.
// Khai báo readJson(req). Nhận đầu vào qua tham số.
async function readJson(req) {
  // Rẽ nhánh nếu !String(req.headers['content-type'] ?? '').startsWith('application/json'). | Ném new Error('json_required').
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) throw new Error('json_required')
  // Khai báo text: chuỗi ''.
  let text = ''
  // Duyệt lần lượt req bằng const chunk.
  for await (const chunk of req) {
    // Thực hiện tính biểu thức text += chunk.toString().
    text += chunk.toString()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (Buffer.byteLength(text) > 4096) throw new Error('body_too_large')`: Rẽ nhánh nếu Buffer.byteLength(text) > 4096. | Ném new Error('body_too_large').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (Buffer.byteLength(text) > 4096) throw new Error('body_too_large')
  }
  // Khai báo result: JSON.parse chuyển chuỗi sang dữ liệu.
  const result = JSON.parse(text)
  // Rẽ nhánh nếu !result || typeof result !== 'object' || Array.isArray(result). | Ném new Error('invalid').
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('invalid')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return result`: Trả kết quả: sử dụng result làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return result
}
// TẠI SAO (readJson): Phản hồi hoặc body có thể không hợp lệ; kiểm tra/timeout giúp lỗi được báo
// rõ thay vì treo hoặc nhận nhầm dữ liệu.
/** @param {{store?: import('./repository').PresenceRepository, origins?: string[]}} [options] */
// CHỨC NĂNG: Tạo HTTP API thống kê phiên.
// XỬ LÝ: Nhận heartbeat/end và đọc cùng kho phiên; không tạo bản đếm riêng cho mỗi client.
// Khai báo createPresenceServer({ store = createSqlRepository(), origins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'] }). Nhận đầu vào qua tham số.
function createPresenceServer({ store = createSqlRepository(), origins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'] } = {}) {
  // Khai báo server: Gọi http.createServer(async (req, res) => { res.setHeader('Cache-Control', 'no-store') res.set.
  const server = http.createServer(async (req, res) => {
    // Đặt header phản hồi: res.setHeader('Cache-Control', 'no-store').
    res.setHeader('Cache-Control', 'no-store')
    // Đặt header phản hồi: res.setHeader('Content-Type', 'application/json.
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    // Đặt header phản hồi: res.setHeader('X-Content-Type-Options', 'nosniff').
    res.setHeader('X-Content-Type-Options', 'nosniff')
    // Khai báo reply: khai báo callback (status, data) => { res.statusCode = status. | Thực hiện tính biểu thức res.statusCode = status. | Thực hiện Gọi res.end(JSON.stringify(data)).
    const reply = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)) }
    // TẠI SAO (reply): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
    // lớp kết nối này.
    // CHỨC NĂNG: Chỉ cho trình duyệt từ origin đã cấu hình gọi trực tiếp.
    // XỬ LÝ: Native không có Origin vẫn dùng được; CORS không thay thế xác thực.
    // Khai báo origin: đọc req.headers.origin từ đối tượng/mảng để dùng tại bước hiện tại.
    const origin = req.headers.origin
    // Rẽ nhánh nếu origin && !origins.includes(origin). | Trả kết quả: Gọi reply(403, { error: 'origin_denied' }). | Gán thuộc tính error: chuỗi 'origin_denied'.
    if (origin && !origins.includes(origin)) return reply(403, { error: 'origin_denied' })
    // Rẽ nhánh nếu origin. | Đặt header phản hồi: res.setHeader('Access-Control-Allow-Origin', origin). | Đặt header phản hồi: res.setHeader('Vary', 'Origin').
    if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin') }
    // Rẽ nhánh nếu req.method === 'OPTIONS'.
    if (req.method === 'OPTIONS') {
      // Đặt header phản hồi: res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS').
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      // Đặt header phản hồi: res.setHeader('Access-Control-Allow-Headers', 'Content-Type').
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `res.statusCode = 204; res.end(); return`: Thực hiện tính biểu thức res.statusCode = 204. | Thực hiện Gọi res.end(). | Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      res.statusCode = 204; res.end(); return
    }
    // Khai báo path: đọc (req.url ?? '').split('?')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
    const path = (req.url ?? '').split('?')[0]
    // Rẽ nhánh nếu req.method === 'GET' && path === '/statistics/active'.
    if (req.method === 'GET' && path === '/statistics/active') {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `try { return reply(200, await store.snapshot()) }`: Bắt đầu vùng try. | Trả kết quả: Gọi reply(200, await store.snapshot()).
       * DÒNG `catch { return reply(503, { error: 'store_unavailable' }) }`: Bắt đầu vùng try. | Trả kết quả: Gọi reply(503, { error: 'store_unavailable' }). | Gán thuộc tính error: chuỗi 'store_unavailable'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      try { return reply(200, await store.snapshot()) }
      catch { return reply(503, { error: 'store_unavailable' }) }
    }
    // Rẽ nhánh nếu req.method !== 'POST' || !['/sessions/heartbeat', '/sessions/end'].includes(path). | Trả kết quả: Gọi reply(404, { error: 'not_found' }). | Gán thuộc tính error: chuỗi 'not_found'.
    if (req.method !== 'POST' || !['/sessions/heartbeat', '/sessions/end'].includes(path)) return reply(404, { error: 'not_found' })
    // Bắt đầu vùng try.
    try {
      // Khai báo body: await chờ Gọi readJson(req).
      const body = await readJson(req)
      // Rẽ nhánh nếu !validId(body.sessionId). | Trả kết quả: Gọi reply(400, { error: 'invalid_session' }). | Gán thuộc tính error: chuỗi 'invalid_session'.
      if (!validId(body.sessionId)) return reply(400, { error: 'invalid_session' })
      // Rẽ nhánh nếu path === '/sessions/end'. | Thực hiện await chờ Gọi store.end(body.sessionId). | Trả kết quả: Gọi reply(200, { ok: true }). | Gán thuộc tính ok: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      if (path === '/sessions/end') { await store.end(body.sessionId); return reply(200, { ok: true }) }
      // Rẽ nhánh nếu !['web', 'mobile-app'].includes(body.platform). | Trả kết quả: Gọi reply(400, { error: 'invalid_platform' }). | Gán thuộc tính error: chuỗi 'invalid_platform'.
      if (!['web', 'mobile-app'].includes(body.platform)) return reply(400, { error: 'invalid_platform' })
      // Thực hiện await chờ Gọi store.heartbeat(body).
      await store.heartbeat(body)
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return reply(200, { ok: true })`: Trả kết quả: Gọi reply(200, { ok: true }). | Gán thuộc tính ok: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `} catch (error) {`: Bắt đầu vùng try.
       */
      return reply(200, { ok: true })
    } catch (error) {
      // Khai báo message: chọn giữa hai giá trị theo điều kiện error instanceof Error.
      const message = error instanceof Error ? error.message : 'invalid'
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return reply(message === 'capacity' ? 503 : 400, { error: message === 'capacity' ? 'c`: Trả kết quả: Gọi reply(message === 'capacity' ? 503 : 400, { error: message === 'capacity' ? 'capacity' : '. | Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện message === 'capacity'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      const invalid=['json_required','body_too_large','invalid','platform_conflict'].includes(message)||error instanceof SyntaxError
      return reply(message==='capacity'?503:invalid?400:503,{error:message==='capacity'?'capacity':invalid?'invalid_request':'store_unavailable'})
    }
  })
  // CHỨC NĂNG: Dọn định kỳ kể cả khi không có admin đang xem.
  // XỬ LÝ: unref không giữ Node chạy chỉ vì timer; close giải phóng timer cho test.
  // Khai báo timer: setInterval lên lịch lặp. | Thực hiện Gọi Promise.resolve().then(() => store.prune()).catch(() => { /* Kho database lỗi: API sẽ trả.
  const timer = setInterval(() => { Promise.resolve().then(() => store.prune()).catch(() => { /* Kho database lỗi: API sẽ trả trạng thái unavailable. */ }) }, 15000)
  // Thực hiện Gọi timer.unref().
  timer.unref()
  // Đăng ký xử lý sự kiện: server.on('close', () => clearInterval(timer)).
  server.on('close', () => clearInterval(timer))
  // Thực hiện tính biểu thức server.requestTimeout = 10000.
  server.requestTimeout = 10000
  // Thực hiện tính biểu thức server.headersTimeout = 10000.
  server.headersTimeout = 10000
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return server`: Trả kết quả: sử dụng server làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return server
}
// TẠI SAO (createPresenceServer): Các thiết bị cần hỏi cùng một kho phiên; lưu riêng trên từng
// trình duyệt sẽ cho số liệu khác nhau.
// Rẽ nhánh nếu require.main === module.
if (require.main === module) {
  // Khai báo server: Gọi createPresenceServer({ origins: (process.env.PRESENCE_ORIGINS ?? 'http://127.0.0.1:5173,ht. | Gán thuộc tính origins: (process.env.PRESENCE_ORIGINS ?? 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',').map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const server = createPresenceServer({ origins: (process.env.PRESENCE_ORIGINS ?? 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',').map(s => s.trim()) })
  // Gán host bằng process.env.PRESENCE_HOST; nếu null hoặc undefined thì dùng '127.0.0.1'.
  const host = process.env.PRESENCE_HOST ?? '127.0.0.1'
  // Khai báo port: Gọi Number(process.env.PRESENCE_PORT ?? 8787).
  const port = Number(process.env.PRESENCE_PORT ?? 8787)
  // DÒNG `server.listen(port, host, () => process.stdout.write(`Presence SQL Server: http://${host}:${`: Thực hiện Gọi server.listen(port, host, () => process.stdout.write(`Presence SQL Server: http://${host}:${port}.
  server.listen(port, host, () => process.stdout.write(`Presence SQL Server: http://${host}:${port}\n`))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `server.on('error', error => { process.stderr.write(error.message + '\n'); process.exi`: Đăng ký xử lý sự kiện: server.on('error', error => { process.stderr.write(error.message + '\n'). | Thực hiện Gọi process.stderr.write(error.message + '\n'). | Thực hiện tính biểu thức process.exitCode = 1.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  server.on('error', error => { process.stderr.write(error.message + '\n'); process.exitCode = 1 })
}
// Thực hiện tính biểu thức module.exports = { createPresenceServer }. | Đặt trường createPresenceServer bằng giá trị của biến cùng tên.
module.exports = { createPresenceServer }
/* CÁCH KIỂM TRA: POST heartbeat -> GET active tăng; POST end giảm; restart giữ bản ghi; TTL vẫn loại phiên đã hết hạn. */
