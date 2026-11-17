/**
 * FILE: services/presence/MayChuApi.cjs
 * FILE NÀY LÀM GÌ: Nhận heartbeat/kết thúc phiên và trả số phiên còn hoạt động từ SQL Server.
 * VAI TRÒ: Máy chủ/API; nhận yêu cầu từ Web và Mobile.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const http = require('node:http')
// SQL là kho lưu phiên; không tự chuyển sang RAM nếu kết nối database lỗi.
const { createSqlRepository } = require('../database/KhoDuLieuSql.cjs')
const validId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{20,100}$/.test(value)
// TẠI SAO (validId): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
// lớp kết nối này.
// CHỨC NĂNG: Đọc JSON giới hạn 4 KB để request sai không làm đầy RAM.
// XỬ LÝ: Không nhận mã phiên từ query URL; không lưu địa chỉ IP hoặc thông tin cá nhân.
// [UC14] readJson — Đọc JSON giới hạn 4 KB để request sai không làm đầy RAM.
async function readJson(req) {
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) throw new Error('json_required')
  let text = ''
  // Duyệt lần lượt req bằng const chunk.
  for await (const chunk of req) {
    text += chunk.toString()
    
    if (Buffer.byteLength(text) > 4096) throw new Error('body_too_large')
  }
  const result = JSON.parse(text)
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('invalid')
  
  return result
}
// TẠI SAO (readJson): Phản hồi hoặc body có thể không hợp lệ; kiểm tra/timeout giúp lỗi được báo
// rõ thay vì treo hoặc nhận nhầm dữ liệu.
/** @param {{store?: import('./repository').PresenceRepository, origins?: string[]}} [options] */
// CHỨC NĂNG: Tạo HTTP API thống kê phiên.
// XỬ LÝ: Nhận heartbeat/end và đọc cùng kho phiên; không tạo bản đếm riêng cho mỗi client.
// [UC14] createPresenceServer — Tạo HTTP API thống kê phiên.
function createPresenceServer({ store = createSqlRepository(), origins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'] } = {}) {
  const server = http.createServer(async (req, res) => {
    // Đặt header phản hồi: res.setHeader('Cache-Control', 'no-store').
    res.setHeader('Cache-Control', 'no-store')
    // Đặt header phản hồi: res.setHeader('Content-Type', 'application/json.
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    // Đặt header phản hồi: res.setHeader('X-Content-Type-Options', 'nosniff').
    res.setHeader('X-Content-Type-Options', 'nosniff')
    const reply = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)) }
    // TẠI SAO (reply): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
    // lớp kết nối này.
    // CHỨC NĂNG: Chỉ cho trình duyệt từ origin đã cấu hình gọi trực tiếp.
    // XỬ LÝ: Native không có Origin vẫn dùng được; CORS không thay thế xác thực.
    const origin = req.headers.origin
    if (origin && !origins.includes(origin)) return reply(403, { error: 'origin_denied' })
    if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin') }
    if (req.method === 'OPTIONS') {
      // Đặt header phản hồi: res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS').
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      // Đặt header phản hồi: res.setHeader('Access-Control-Allow-Headers', 'Content-Type').
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      
      res.statusCode = 204; res.end(); return
    }
    const path = (req.url ?? '').split('?')[0]
    // [UC14] KHỐI API — Đọc số phiên còn hoạt động, chia theo Web/Mobile.
    if (req.method === 'GET' && path === '/statistics/active') {
      
      try { return reply(200, await store.snapshot()) }
      catch { return reply(503, { error: 'store_unavailable' }) }
    }
    if (req.method !== 'POST' || !['/sessions/heartbeat', '/sessions/end'].includes(path)) return reply(404, { error: 'not_found' })
    try {
      const body = await readJson(req)
      if (!validId(body.sessionId)) return reply(400, { error: 'invalid_session' })
      if (path === '/sessions/end') { await store.end(body.sessionId); return reply(200, { ok: true }) }
      if (!['web', 'mobile-app'].includes(body.platform)) return reply(400, { error: 'invalid_platform' })
      await store.heartbeat(body)
      
      return reply(200, { ok: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'invalid'
      
      const invalid=['json_required','body_too_large','invalid','platform_conflict'].includes(message)||error instanceof SyntaxError
      return reply(message==='capacity'?503:invalid?400:503,{error:message==='capacity'?'capacity':invalid?'invalid_request':'store_unavailable'})
    }
  })
  // CHỨC NĂNG: Dọn định kỳ kể cả khi không có admin đang xem.
  // XỬ LÝ: unref không giữ Node chạy chỉ vì timer; close giải phóng timer cho test.
  const timer = setInterval(() => { Promise.resolve().then(() => store.prune()).catch(() => { /* Kho database lỗi: API sẽ trả trạng thái unavailable. */ }) }, 15000)
  timer.unref()
  // Đăng ký xử lý sự kiện: server.on('close', () => clearInterval(timer)).
  server.on('close', () => clearInterval(timer))
  server.requestTimeout = 10000
  server.headersTimeout = 10000
  
  return server
}
// TẠI SAO (createPresenceServer): Các thiết bị cần hỏi cùng một kho phiên; lưu riêng trên từng
// trình duyệt sẽ cho số liệu khác nhau.
if (require.main === module) {
  const server = createPresenceServer({ origins: (process.env.PRESENCE_ORIGINS ?? 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',').map(s => s.trim()) })
  // Gán host bằng process.env.PRESENCE_HOST; nếu null hoặc undefined thì dùng '127.0.0.1'.
  const host = process.env.PRESENCE_HOST ?? '127.0.0.1'
  const port = Number(process.env.PRESENCE_PORT ?? 8787)
  // DÒNG `server.listen(port, host, () => process.stdout.write(`Presence SQL Server: http://${host}:${`: Thực hiện Gọi server.listen(port, host, () => process.stdout.write(`Presence SQL Server: http://${host}:${port}.
  server.listen(port, host, () => process.stdout.write(`Presence SQL Server: http://${host}:${port}\n`))
  
  server.on('error', error => { process.stderr.write(error.message + '\n'); process.exitCode = 1 })
}
module.exports = { createPresenceServer }
/* CÁCH KIỂM TRA: POST heartbeat -> GET active tăng; POST end giảm; restart giữ bản ghi; TTL vẫn loại phiên đã hết hạn. */
