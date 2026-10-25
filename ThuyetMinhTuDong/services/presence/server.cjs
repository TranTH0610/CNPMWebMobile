/**
 * FILE NÀY LÀM GÌ: API HTTP nhận heartbeat và trả thống kê, Node built-in không cài thư viện.
 * root npm run presence:start gọi. Phụ thuộc memory-store.cjs; FE dùng client trong visitor-core.
 * Đây là server demo; khi công khai cần xác thực API quản lý ở proxy/BE.
 */
const http = require('node:http')
const { createMemoryStore } = require('./memory-store.cjs')
const validId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{20,100}$/.test(value)
// CHỨC NĂNG: Đọc JSON giới hạn 4 KB để request sai không làm đầy RAM.
// XỬ LÝ: Không nhận mã phiên từ query URL; không lưu địa chỉ IP hoặc thông tin cá nhân.
async function readJson(req) {
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) throw new Error('json_required')
  let text = ''
  for await (const chunk of req) {
    text += chunk.toString()
    if (Buffer.byteLength(text) > 4096) throw new Error('body_too_large')
  }
  const result = JSON.parse(text)
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('invalid')
  return result
}
/** @param {{store?: import('./repository').PresenceRepository, origins?: string[]}} [options] */
function createPresenceServer({ store = createMemoryStore(), origins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'] } = {}) {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    const reply = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)) }
    // CHỨC NĂNG: Chỉ cho trình duyệt từ origin đã cấu hình gọi trực tiếp.
    // XỬ LÝ: Native không có Origin vẫn dùng được; CORS không thay thế xác thực.
    const origin = req.headers.origin
    if (origin && !origins.includes(origin)) return reply(403, { error: 'origin_denied' })
    if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin') }
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.statusCode = 204; res.end(); return
    }
    const path = (req.url ?? '').split('?')[0]
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
      return reply(message === 'capacity' ? 503 : 400, { error: message === 'capacity' ? 'capacity' : 'invalid_request' })
    }
  })
  // CHỨC NĂNG: Dọn định kỳ kể cả khi không có admin đang xem.
  // XỬ LÝ: unref không giữ Node chạy chỉ vì timer; close giải phóng timer cho test.
  const timer = setInterval(() => { Promise.resolve().then(() => store.prune()).catch(() => { /* Kho database lỗi: API sẽ trả trạng thái unavailable. */ }) }, 15000)
  timer.unref()
  server.on('close', () => clearInterval(timer))
  server.requestTimeout = 10000
  server.headersTimeout = 10000
  return server
}
if (require.main === module) {
  const server = createPresenceServer({ origins: (process.env.PRESENCE_ORIGINS ?? 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174').split(',').map(s => s.trim()) })
  const host = process.env.PRESENCE_HOST ?? '127.0.0.1'
  const port = Number(process.env.PRESENCE_PORT ?? 8787)
  server.listen(port, host, () => process.stdout.write(`Presence RAM: http://${host}:${port}\n`))
  server.on('error', error => { process.stderr.write(error.message + '\n'); process.exitCode = 1 })
}
module.exports = { createPresenceServer }
/* CÁCH KIỂM TRA: POST heartbeat -> GET active tăng; POST end giảm; restart server trở về 0. */
