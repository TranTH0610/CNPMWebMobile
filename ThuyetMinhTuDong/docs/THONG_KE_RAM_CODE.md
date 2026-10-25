# Toàn bộ code thống kê RAM

Đọc THONG_KE_RAM.md để biết thứ tự chạy. Các file bên dưới đã được áp dụng vào dự án.

## 1. TẠO MỚI — services/presence/memory-store.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\services\presence\memory-store.cjs

```javascript
/**
 * FILE NÀY LÀM GÌ: Kho phiên RAM cho thống kê, không dùng database hay ghi tệp.
 * server.cjs gọi qua heartbeat/end/snapshot; sau này thay bằng kho database cùng hợp đồng.
 * Liên quan thống kê phiên đang hoạt động; không coi phiên là người/vé.
 */
function createMemoryStore({ now = Date.now, ttlMs = 90000, maxSessions = 10000 } = {}) {
  const sessions = new Map()
  // CHỨC NĂNG: Xóa phiên hết hạn để RAM không tăng mãi.
  // XỬ LÝ: Dùng thời gian server; client không được gửi thời gian để kéo dài phiên.
  function prune() {
    const cutoff = now() - ttlMs
    for (const [id, session] of sessions) if (session.lastSeen <= cutoff) sessions.delete(id)
  }
  return {
    prune,
    heartbeat({ sessionId, platform }) {
      prune()
      const previous = sessions.get(sessionId)
      if (previous && previous.platform !== platform) throw new Error('platform_conflict')
      if (!previous && sessions.size >= maxSessions) throw new Error('capacity')
      sessions.set(sessionId, { platform, lastSeen: now() })
    },
    end(sessionId) { sessions.delete(sessionId) },
    snapshot() {
      prune()
      const rows = [...sessions.values()]
      return { active: rows.length, web: rows.filter(s => s.platform === 'web').length,
        mobile: rows.filter(s => s.platform === 'mobile-app').length,
        updatedAt: now(), ttlSeconds: ttlMs / 1000 }
    },
  }
}
module.exports = { createMemoryStore }
/* CÁCH KIỂM TRA: Cùng mã heartbeat nhiều lần chỉ tính một; hết 90 giây về 0; tạo kho mới mất phiên cũ. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 2. TẠO MỚI — services/presence/server.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\services\presence\server.cjs

```javascript
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
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 3. TẠO MỚI — services/presence/repository.d.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\services\presence\repository.d.ts

```typescript
/** FILE NÀY LÀM GÌ: Hợp đồng kho lưu trữ cho adapter RAM/database.
 * server.cjs nhận store cùng giao diện; database triển khai async mà FE không đổi.
 * Không lưu thông tin cá nhân; dùng thời gian server cho lastSeen.
 */
export interface PresenceRepository {
  heartbeat(session: { sessionId: string; platform: 'web' | 'mobile-app' }): void | Promise<void>
  end(sessionId: string): void | Promise<void>
  prune(): void | Promise<void>
  snapshot(): { active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number } |
    Promise<{ active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number }>
}
/* CÁCH KIỂM TRA: Adapter database có đủ bốn phương thức; snapshot chỉ đếm lastSeen còn hạn. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 4. TẠO MỚI — services/presence/presence.test.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\services\presence\presence.test.cjs

```javascript
/** FILE NÀY LÀM GÌ: Test kho RAM, API và client HTTP; npm run presence:test gọi.
 * Phụ thuộc node:test, HTTP server local và esbuild đã có trong Vite.
 * Đồng hồ giả giúp kiểm tra hết hạn mà không đợi 90 giây thật. */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createMemoryStore } = require('./memory-store.cjs')
const { createPresenceServer } = require('./server.cjs')
const { createRequire } = require('node:module')
const path = require('node:path')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'apps/web/package.json'))
req('esbuild').buildSync({ entryPoints: [path.join(root, 'packages/visitor-core/src/presence.ts')],
  bundle: true, platform: 'node', format: 'cjs', outfile: path.join(__dirname, '.test-build/client.cjs') })
const { createPresenceClient } = require('./.test-build/client.cjs')
const web = { sessionId: 'web_12345678901234567890', platform: 'web' }
const mobile = { sessionId: 'app_12345678901234567890', platform: 'mobile-app' }
// CHỨC NĂNG: Kiểm tra heartbeat lặp không đếm trùng và phân loại đúng thiết bị.
test('cùng phiên chỉ tính một; web và app cộng thành active', () => {
  const store = createMemoryStore()
  store.heartbeat(web); store.heartbeat(web); store.heartbeat(mobile)
  assert.equal(store.snapshot().active, 2)
  assert.equal(store.snapshot().web, 1); assert.equal(store.snapshot().mobile, 1)
  assert.throws(() => store.heartbeat({ ...web, platform: 'mobile-app' }), /conflict/)
})
test('heartbeat gia hạn; đúng 90 giây hết hạn và RAM được dọn', () => {
  let clock = 0
  const store = createMemoryStore({ now: () => clock })
  store.heartbeat(web); clock = 60000; store.heartbeat(web)
  clock = 149999; assert.equal(store.snapshot().active, 1)
  clock = 150000; assert.equal(store.snapshot().active, 0)
})
test('end idempotent; khởi tạo kho mới không giữ dữ liệu cũ', () => {
  const store = createMemoryStore(); store.heartbeat(web)
  assert.equal(createMemoryStore().snapshot().active, 0)
  store.end(web.sessionId); store.end(web.sessionId)
  assert.equal(store.snapshot().active, 0)
})
test('giới hạn RAM và cho nhận phiên mới sau khi phiên cũ hết hạn', () => {
  let clock = 0
  const store = createMemoryStore({ now: () => clock, maxSessions: 1 })
  store.heartbeat(web)
  assert.throws(() => store.heartbeat(mobile), /capacity/)
  clock = 90000; store.heartbeat(mobile)
  assert.equal(store.snapshot().mobile, 1)
})
async function setup(t) {
  const server = createPresenceServer()
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const base = 'http://127.0.0.1:' + server.address().port
  return { base, client: createPresenceClient(base) }
}
// CHỨC NĂNG: Kiểm tra cùng hợp đồng client mà FE dùng, không bỏ qua HTTP.
test('HTTP/client: gửi, đọc chung và kết thúc phiên', async t => {
  const { client } = await setup(t)
  await client.heartbeat(web); await client.heartbeat(mobile); await client.heartbeat(web)
  assert.equal((await client.statistics()).active, 2)
  await client.end(web.sessionId)
  assert.equal((await client.statistics()).active, 1)
})
test('API từ chối mã/platform sai, body quá lớn và origin lạ', async t => {
  const { base, client } = await setup(t)
  const post = body => fetch(base + '/sessions/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  assert.equal((await post({ ...web, sessionId: 'short' })).status, 400)
  assert.equal((await post({ ...web, platform: 'bot' })).status, 400)
  assert.equal((await post({ ...web, extra: 'x'.repeat(5000) })).status, 400)
  assert.equal((await fetch(base + '/statistics/active', { headers: { Origin: 'https://untrusted.example' } })).status, 403)
  assert.equal((await client.statistics()).active, 0)
})
test('client từ chối số liệu sai và truyền lỗi mạng cho hook', async t => {
  const mocked = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ active: 20, web: 1, mobile: 1, updatedAt: 1, ttlSeconds: 90 })))
  const client = createPresenceClient('http://local.test')
  await assert.rejects(client.statistics(), /presence_invalid/)
  mocked.mock.mockImplementation(async () => { throw new Error('offline') })
  await assert.rejects(client.statistics(), /offline/)
})
/* CÁCH KIỂM TRA: npm run presence:test; tất cả test không dùng Internet hoặc database. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 5. TẠO MỚI — packages/visitor-core/src/presence.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\presence.ts

```typescript
/**
 * FILE NÀY LÀM GÌ: Hợp đồng API và client thống kê phiên dùng chung web/native.
 * Hook từng nền tảng và presence-react.ts gọi; không phụ thuộc DOM hoặc React Native.
 * Đổi kho RAM sang database không đổi hợp đồng này. Không có dữ liệu vị trí hoặc tên khách.
 */
export type PresencePlatform = 'web' | 'mobile-app'
export interface PresenceSession { sessionId: string; platform: PresencePlatform }
export interface PresenceStats { active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number }
export interface PresenceClient {
  heartbeat(session: PresenceSession): Promise<void>
  end(sessionId: string): Promise<void>
  statistics(): Promise<PresenceStats>
}
// CHỨC NĂNG: Tạo client một lần tại service nền tảng, không gọi fetch trong UI.
// XỬ LÝ: Timeout 5 giây; mất mạng ném lỗi để hook hiện trạng thái chưa có số liệu.
export function createPresenceClient(base: string): PresenceClient {
  const origin = base.replace(/\/$/, '')
  async function request(path: string, body?: unknown): Promise<unknown> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch(origin + path, { method: body === undefined ? 'GET' : 'POST',
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal })
      if (!response.ok) throw new Error('presence_unavailable')
      return await response.json() as unknown
    } finally { clearTimeout(timeout) }
  }
  return {
    async heartbeat(session) { await request('/sessions/heartbeat', session) },
    async end(sessionId) { await request('/sessions/end', { sessionId }) },
    async statistics() {
      const value = await request('/statistics/active')
      if (!value || typeof value !== 'object') throw new Error('presence_invalid')
      const data = value as Record<string, unknown>
      for (const key of ['active', 'web', 'mobile', 'updatedAt', 'ttlSeconds']) {
        if (typeof data[key] !== 'number' || !Number.isFinite(data[key]) || data[key] < 0) throw new Error('presence_invalid')
      }
      if (data.active !== Number(data.web) + Number(data.mobile)) throw new Error('presence_invalid')
      return { active: Number(data.active), web: Number(data.web), mobile: Number(data.mobile),
        updatedAt: Number(data.updatedAt), ttlSeconds: Number(data.ttlSeconds) }
    },
  }
}
// CHỨC NĂNG: Gửi ngay một heartbeat rồi lặp lại sau 30 giây.
// XỬ LÝ: Chờ request kết thúc mới lên lịch nên không chồng request; lỗi không chặn du khách.
// Cleanup chỉ dừng gửi: server tự hết hạn sau 90 giây, tránh end đến muộn xóa nhầm phiên vừa mở lại.
export function startPresenceHeartbeat(client: PresenceClient, session: PresenceSession): () => void {
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const pulse = async () => {
    try { await client.heartbeat(session) } catch { /* Mất mạng không làm gián đoạn app. */ }
    if (!stopped) timer = setTimeout(() => { void pulse() }, 30000)
  }
  void pulse()
  return () => { stopped = true; if (timer) clearTimeout(timer) }
}
/* CÁCH KIỂM TRA: Server tắt không treo UI; API trả dữ liệu sai bị từ chối; không gửi đồng thời nhiều nhịp. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 6. TẠO MỚI — packages/visitor-core/src/presence-react.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\presence-react.ts

```typescript
/**
 * FILE NÀY LÀM GÌ: Hook admin đọc thống kê chung mỗi 5 giây, cho cả web/native.
 * Dashboard dùng; phụ thuộc PresenceClient. Không tự tạo phiên admin trong thống kê.
 */
import { useEffect, useState } from 'react'
import type { PresenceClient, PresenceStats } from './presence'
export function usePresenceStatistics(client: PresenceClient | null) {
  const [stats, setStats] = useState<PresenceStats | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let disposed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    setStats(null); setError(false)
    // CHỨC NĂNG: Tải số phiên hiện tại; lỗi hiển thị chưa có số liệu thay vì số 0 giả.
    // XỬ LÝ: Không chồng request; dọn timer và bỏ kết quả cũ khi rời màn hoặc thử lại.
    const poll = async () => {
      try {
        if (!client) throw new Error('presence_not_configured')
        const next = await client.statistics()
        if (!disposed) { setStats(next); setError(false) }
      } catch { if (!disposed) { setStats(null); setError(true) } }
      if (!disposed) timer = setTimeout(() => { void poll() }, 5000)
    }
    void poll()
    return () => { disposed = true; if (timer) clearTimeout(timer) }
  }, [client, attempt])
  return { stats, error, retry: () => setAttempt(value => value + 1) }
}
/* CÁCH KIỂM TRA: Hai admin dùng cùng URL có cùng số; server tắt hiện lỗi; bật lại tự phục hồi. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 7. TẠO MỚI — apps/web/src/services/presence.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\services\presence.ts

```typescript
/** FILE NÀY LÀM GÌ: Chọn địa chỉ API thống kê cho web du khách/quản lý.
 * Hook heartbeat và Dashboard gọi; phụ thuộc client dùng chung. Vite proxy chuyển tiếp khi chạy local.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'
// CHỨC NĂNG: Hai web dùng chung server dù chạy khác cổng.
// XỬ LÝ: Production đặt VITE_PRESENCE_API_URL hoặc cấu hình reverse proxy cùng đường dẫn.
export const presenceClient = createPresenceClient(import.meta.env.VITE_PRESENCE_API_URL || '/api/presence')
/* CÁCH KIỂM TRA: Heartbeat đi tới /api/presence/sessions/heartbeat; admin đọc statistics/active. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 8. TẠO MỚI — apps/web/src/hooks/usePresenceHeartbeat.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\hooks\usePresenceHeartbeat.ts

```typescript
import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Báo phiên du khách web đang mở và ở foreground.
 * App.tsx gọi duy nhất một lần; bản main-admin không gọi. Phụ thuộc sessionStorage, Visibility API và service.
 */
import { useEffect } from 'react'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Giữ mã ẩn danh khi reload, không dùng tên/IP/tài khoản.
// XỬ LÝ: Nếu trình duyệt chặn storage, dùng mã trong RAM của trang; đây không phải token xác thực.
let sessionId: string | undefined
function getSessionId() {
  if (sessionId) return sessionId
  const fresh = 'web_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  try {
    const saved = sessionStorage.getItem('hue-presence-session')
    sessionId = saved && /^[a-zA-Z0-9_-]{20,100}$/.test(saved) ? saved : fresh
    sessionStorage.setItem('hue-presence-session', sessionId)
  } catch { sessionId = fresh }
  return sessionId
}
export function usePresenceHeartbeat() {
  useGateEntry()
  useEffect(() => {
    let stop: (() => void) | undefined
    const update = () => {
      stop?.(); stop = undefined
      if (document.visibilityState === 'visible') {
        stop = startPresenceHeartbeat(presenceClient, { sessionId: getSessionId(), platform: 'web' })
      }
    }
    // CHỨC NĂNG: Tab ẩn/ngủ không gửi heartbeat; quay lại gửi ngay.
    // XỬ LÝ: Rời trang mất tối đa 90 giây để hết hạn; không dựa vào unload vốn không đảm bảo trên điện thoại.
    update()
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pageshow', update)
    const hide = () => { stop?.(); stop = undefined }
    window.addEventListener('pagehide', hide)
    return () => {
      hide(); document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pageshow', update); window.removeEventListener('pagehide', hide)
    }
  }, [])
}
/* CÁCH KIỂM TRA: Reload không tăng phiên; ẩn tab quá 90 giây hết active; mở riêng admin không tăng. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 9. TẠO MỚI — apps/mobile/src/services/presence.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\services\presence.ts

```typescript
/** FILE NÀY LÀM GÌ: Ghép URL server RAM cho native; hooks và Dashboard dùng.
 * Phụ thuộc biến Expo và client dùng chung. Không dùng localhost máy tính trên điện thoại thật.
 */
import { createPresenceClient } from '@travelguide/visitor-core/presence'
const url = process.env.EXPO_PUBLIC_PRESENCE_API_URL
// CHỨC NĂNG: Không cấu hình thì tắt thống kê, không gây lỗi luồng du khách.
// XỬ LÝ: Điện thoại thật dùng http://IP_MAY_TINH:8787 hoặc HTTPS được triển khai.
export const presenceClient = url ? createPresenceClient(url) : null
// CHỨC NĂNG: Bản quản lý dùng địa chỉ thống kê nội bộ riêng nếu có.
// XỬ LÝ: Tunnel du khách chỉ nhận heartbeat, không công khai API đọc thống kê quản lý.
const adminUrl = process.env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL || url
export const adminPresenceClient = adminUrl ? createPresenceClient(adminUrl) : null
/* CÁCH KIỂM TRA: Thêm URL vào .env rồi restart Expo; thiếu URL admin báo chưa kết nối. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 10. TẠO MỚI — apps/mobile/src/hooks/usePresenceHeartbeat.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\hooks\usePresenceHeartbeat.ts

```typescript
import { useGateEntry } from './useGateEntry'
/** FILE NÀY LÀM GÌ: Gửi heartbeat cho phiên native đang ở foreground và không mở admin.
 * RootNavigator gọi; phụ thuộc AppState và service presence. Không gửi tọa độ hoặc dữ liệu cá nhân.
 */
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { startPresenceHeartbeat } from '@travelguide/visitor-core/presence'
import { presenceClient } from '../services/presence'
// CHỨC NĂNG: Một mã cho một lần chạy app, không phải danh tính hoặc token bảo mật.
const sessionId = 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
export function usePresenceHeartbeat(enabled: boolean) {
  useGateEntry(enabled)
  useEffect(() => {
    const client = presenceClient
    if (!enabled || !client) return
    let stop: (() => void) | undefined
    const update = () => {
      stop?.(); stop = undefined
      if (AppState.currentState === 'active') stop = startPresenceHeartbeat(client, { sessionId, platform: 'mobile-app' })
    }
    // CHỨC NĂNG: Về nền dừng gửi; trở lại gửi ngay, không tạo thêm phiên.
    // XỬ LÝ: Cleanup gỡ listener và timer, request đang chạy có timeout 5 giây.
    const subscription = AppState.addEventListener('change', update)
    update()
    return () => { stop?.(); subscription.remove() }
  }, [enabled])
}
/* CÁCH KIỂM TRA: Mở app tăng nhóm mobile; vào admin/ngủ quá 90 giây giảm; lỗi mạng không crash. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 11. TẠO MỚI — apps/mobile/.env.presence.example

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\.env.presence.example

```dotenv
# FILE NÀY LÀM GÌ: Mẫu cấu hình thống kê RAM trên điện thoại thật.
# Copy dòng bên dưới vào apps/mobile/.env; thay IP bằng IPv4 máy chạy server.
# Expo đọc biến EXPO_PUBLIC khi bundle, cần restart bằng npx expo start -c.
EXPO_PUBLIC_PRESENCE_API_URL=http://192.168.1.10:8787

# Bản mobile quản lý đọc số liệu từ RAM server nội bộ; không dùng endpoint công khai du khách để đọc thống kê.
EXPO_PUBLIC_ADMIN_PRESENCE_API_URL=http://192.168.1.10:8787
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 12. TẠO MỚI — apps/web/.env.presence.example

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\.env.presence.example

```dotenv
# FILE NÀY LÀM GÌ: Mẫu URL API thống kê khi triển khai thật.
# Dev không cần đặt: Vite đã proxy /api/presence tới localhost:8787.
# Production cấu hình reverse proxy cùng origin hoặc URL HTTPS bên dưới.
# VITE_PRESENCE_API_URL=https://api.example.com
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 13. SỬA — package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\package.json

```json
{
  "name": "project-root",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "test:visitor": "npm run test --workspace=@travelguide/visitor-core",
    "typecheck:visitor": "npm run typecheck --workspace=@travelguide/visitor-core && npm run typecheck --workspace=mobile",
    "lint:visitor": "npm run lint --workspace=@travelguide/visitor-core && npm run lint --workspace=mobile",
    "lint": "npm run lint --workspace=@travelguide/admin-core && npm run lint --workspace=@travelguide/visitor-core && npm run lint --workspace=mobile && npm run lint --workspace=web",
    "typecheck": "npm run typecheck --workspace=@travelguide/admin-core && npm run typecheck --workspace=@travelguide/visitor-core && npm run typecheck --workspace=mobile && npm run typecheck --workspace=web",
    "test": "npm run test --workspace=@travelguide/admin-core && npm run test --workspace=@travelguide/visitor-core && npm run test --workspace=@travelguide/place-core && node --test scripts/app-links.test.cjs scripts/public-qr.test.cjs && npm run presence:test && npm run catalog:test",
    "build:web": "npm run build --workspace=web",
    "links:generate": "node scripts/generate-app-links.cjs",
    "qr:create": "node scripts/create-public-qr.cjs",
    "demo:public": "node scripts/start-public-demo.cjs",
    "presence:start": "node services/presence/server.cjs",
    "presence:test": "node --test services/presence/presence.test.cjs",
    "catalog:start": "node scripts/start-catalog.cjs",
    "catalog:test": "node --test services/catalog/catalog.test.cjs"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "8.46.2",
    "@typescript-eslint/parser": "8.46.2",
    "eslint": "8.57.1",
    "eslint-plugin-react-hooks": "5.2.0"
  }
}
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 14. SỬA — packages/visitor-core/package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\package.json

```json
{
  "name": "@travelguide/visitor-core",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./react": "./src/react.tsx",
    "./journey": "./src/journey.ts",
    "./journey/react": "./src/journey-react.tsx",
    "./journey/data": "./src/journey-data.ts",
    "./presence": "./src/presence.ts",
    "./presence/react": "./src/presence-react.ts"
  },
  "scripts": {
    "test": "tsc -p tsconfig.test.json && node --test tests/core.test.cjs tests/locale.test.cjs tests/site.test.cjs tests/journey.test.cjs",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "i18next": "^26.4.2",
    "react-i18next": "^17.0.15"
  },
  "devDependencies": {
    "@types/react": "~19.2.4"
  }
}
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 15. SỬA — packages/admin-core/src/messages.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\messages.ts

```typescript
/** FILE NÀY LÀM GÌ: Chữ Admin đủ năm ngôn ngữ dùng chung mobile/web.
 * useAdminText gọi; UC12–UC17. Keys được suy ra từ bản Việt để chặn thiếu khóa. */
import type { Language } from '@travelguide/visitor-core'
const vi = {
  "gateHint": "Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần; không phải số vé hay số người.",
  "gateError": "Chưa tải được lượt QR.",
  "confirmDelete": "Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong kho RAM dùng chung? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.",
  "delete": "Xóa vĩnh viễn",
  "clearFile": "Bỏ tệp đã chọn",
  "localFile": "Đã chọn tệp cục bộ",
  "mediaError": "Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.",
  "fileHint": "Lưu tệp cục bộ tối đa 1 MB/tệp; API upload sẽ nối sau.",
  "pickAudio": "Chọn bản thu từ thiết bị",
  "pickImage": "Chọn ảnh từ thiết bị",
  "confirm": "Xác nhận",
  "previewError": "Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.",
  "simListening": "Mô phỏng khách đang nghe",
  "overviewHint": "Theo dõi hoạt động và quản lý nội dung di tích.",
  "quickActions": "Thao tác nhanh",
  "managePlacesHint": "Cập nhật thông tin, hình ảnh và bài thuyết minh.",
  "reviewQueueHint": "Kiểm tra và công bố nội dung đã duyệt.",
  "catalogHint": "Quản lý danh mục và nội dung thuyết minh.",
  "basicInfo": "Thông tin di tích",
  "locationSection": "Vị trí và tọa độ",
  "mediaSection": "Hình ảnh và tư liệu",
  "workflowSection": "Lưu và quản lý phiên bản",
  "resetHint": "Khôi phục dữ liệu mẫu khi cần bắt đầu lại.",
  "editorHint": "Biên tập nội dung theo từng ngôn ngữ.",
  "clearSearch": "Xóa từ khóa",
  "admin": "Quản lý",
  "dashboard": "Tổng quan",
  "places": "Di tích",
  "reviews": "Kiểm duyệt",
  "qr": "QR tại cổng",
  "visitor": "Về trang du khách",
  "demo": "Dữ liệu dùng chung trên server RAM; khởi động lại server sẽ mất thay đổi.",
  "mockMedia": "Dịch/TTS mô phỏng. MP3 mẫu không đọc văn bản vừa soạn; nội dung được tạo là dữ liệu mẫu.",
  "loading": "Đang tải…",
  "save": "Lưu bản nháp",
  "saved": "Thao tác thành công",
  "new": "Thêm di tích",
  "edit": "Thông tin",
  "content": "Biên tập",
  "search": "Tìm di tích…",
  "title": "Tên chính thức",
  "period": "Giai đoạn lịch sử",
  "category": "Danh mục",
  "lat": "Vĩ độ",
  "lng": "Kinh độ",
  "verified": "Tọa độ đã kiểm tra",
  "images": "Ảnh: mỗi dòng một URL hoặc mã photo:ID",
  "summary": "Mô tả ngắn",
  "address": "Địa chỉ",
  "body": "Bài thuyết minh",
  "audio": "URL bản thu MP3 đã lưu trên máy chủ",
  "preview": "Nghe thử",
  "prepare": "Tạo audio mẫu",
  "translate": "Dịch nháp mô phỏng từ tiếng Việt",
  "submit": "Gửi duyệt",
  "approve": "Duyệt phiên bản",
  "reject": "Yêu cầu sửa",
  "note": "Ghi chú kiểm duyệt",
  "publish": "Công bố phiên bản",
  "confirmPublish": "Công bố bản này cho giao diện du khách trên thiết bị hiện tại?",
  "archive": "Lưu trữ di tích",
  "confirmArchive": "Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?",
  "reset": "Đặt lại dữ liệu mẫu",
  "confirmReset": "Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?",
  "cancel": "Hủy",
  "unsaved": "Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?",
  "active": "Phiên đang hoạt động",
  "web": "Web",
  "mobile": "App Mobile",
  "listening": "Đang nghe",
  "gateToday": "Lượt QR hôm nay",
  "simWeb": "Mô phỏng khách Web",
  "simMobile": "Mô phỏng khách App",
  "endSessions": "Kết thúc phiên mô phỏng",
  "analyticsHint": "Phiên ẩn danh được cập nhật từ server RAM; hết hoạt động sau 90 giây không gửi tín hiệu. Khởi động lại server sẽ mất số liệu. Đây là số phiên, không phải số người/vé.",
  "presenceError": "Chưa lấy được thống kê. Kiểm tra server RAM và địa chỉ API.",
  "empty": "Chưa có dữ liệu phù hợp",
  "revision": "Bản sửa",
  "current": "Bản công khai hiện hành",
  "none": "Chưa có",
  "status_draft": "Bản nháp",
  "status_submitted": "Chờ duyệt",
  "status_changes": "Cần sửa",
  "status_approved": "Đã duyệt",
  "status_published": "Đã công bố",
  "status_archived": "Đã lưu trữ",
  "error_loadError": "Không đọc được dữ liệu. Thử lại hoặc đặt lại dữ liệu.",
  "error_saveError": "Không lưu được. Bản công khai cũ được giữ nguyên.",
  "error_invalid": "Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).",
  "error_conflict": "Bản đã thay đổi. Tải lại trước khi tiếp tục.",
  "error_notFound": "Không tìm thấy di tích",
  "error_notApproved": "Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.",
  "error_incomplete": "Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.",
  "error_staleJob": "Kết quả tác vụ thuộc bản cũ. Hãy thử lại.",
  "retry": "Thử lại",
  "stop": "Dừng nghe thử"
} as const
const en = {
  "gateHint": "Gate QR link opens, counted once per session/day; not tickets or people.",
  "gateError": "QR statistics are unavailable.",
  "confirmDelete": "Permanently delete this place from shared Admin and visitor data? Draft and published content will be removed. There is no undo button.",
  "delete": "Delete permanently",
  "clearFile": "Remove selected file",
  "localFile": "Local file selected",
  "mediaError": "Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.",
  "fileHint": "Stores local files up to 1 MB each; upload API comes later.",
  "pickAudio": "Choose local recording",
  "pickImage": "Choose local image",
  "confirm": "Confirm",
  "previewError": "Preview unavailable. Check the source and retry.",
  "simListening": "Simulate listening visitor",
  "overviewHint": "Monitor activity and manage heritage content.",
  "quickActions": "Quick actions",
  "managePlacesHint": "Update information, photos and narration.",
  "reviewQueueHint": "Review and publish approved content.",
  "catalogHint": "Manage places and narration content.",
  "basicInfo": "Place information",
  "locationSection": "Location and coordinates",
  "mediaSection": "Photos and media",
  "workflowSection": "Save and manage versions",
  "resetHint": "Restore sample data when you need a fresh start.",
  "editorHint": "Edit content in each language.",
  "clearSearch": "Clear search",
  "admin": "Management",
  "dashboard": "Dashboard",
  "places": "Places",
  "reviews": "Reviews",
  "qr": "Gate QR",
  "visitor": "Visitor view",
  "demo": "Shared server RAM data; restarting the server loses changes.",
  "mockMedia": "Simulated translation/TTS. Sample MP3 does not read your edited text; generated content is sample data.",
  "loading": "Loading…",
  "save": "Save draft",
  "saved": "Operation completed",
  "new": "Add place",
  "edit": "Information",
  "content": "Edit content",
  "search": "Search places…",
  "title": "Official title",
  "period": "Historical period",
  "category": "Category",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordinates verified",
  "images": "Images: one URL or photo:ID per line",
  "summary": "Summary",
  "address": "Address",
  "body": "Narration text",
  "audio": "Hosted recording MP3 URL",
  "preview": "Preview audio",
  "prepare": "Prepare sample audio",
  "translate": "Simulated translation from Vietnamese",
  "submit": "Submit for review",
  "approve": "Approve revision",
  "reject": "Request changes",
  "note": "Review note",
  "publish": "Publish revision",
  "confirmPublish": "Publish this revision to the visitor view on this device?",
  "archive": "Archive place",
  "confirmArchive": "Archive removes this place from the public catalogue. Continue?",
  "reset": "Reset sample data",
  "confirmReset": "Discard local changes and restore sample data?",
  "cancel": "Cancel",
  "unsaved": "Unsaved changes. Leave this form?",
  "active": "Active sessions",
  "web": "Web",
  "mobile": "Mobile app",
  "listening": "Listening",
  "gateToday": "Gate entries today",
  "simWeb": "Simulate web visitor",
  "simMobile": "Simulate app visitor",
  "endSessions": "End simulated sessions",
  "analyticsHint": "Anonymous sessions are read from the RAM server and expire after 90 seconds without a heartbeat. Restarting the server clears them. Sessions are not people or tickets.",
  "presenceError": "Statistics are unavailable. Check the RAM server and API address.",
  "empty": "No matching data",
  "revision": "Revision",
  "current": "Current published version",
  "none": "None",
  "status_draft": "Draft",
  "status_submitted": "In review",
  "status_changes": "Changes requested",
  "status_approved": "Approved",
  "status_published": "Published",
  "status_archived": "Archived",
  "error_loadError": "Could not load data. Retry or reset data.",
  "error_saveError": "Save failed. The published version is unchanged.",
  "error_invalid": "Check required fields, Hue coordinates and HTTP(S) URLs.",
  "error_conflict": "Revision changed. Reload before continuing.",
  "error_notFound": "Place not found",
  "error_notApproved": "Publish only the unchanged approved revision.",
  "error_incomplete": "Require an image, Vietnamese text and audio for entered languages.",
  "error_staleJob": "Task result is stale. Retry.",
  "retry": "Retry",
  "stop": "Stop preview"
} as const
const cn = {
  "gateHint": "入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。",
  "gateError": "无法加载二维码统计。",
  "confirmDelete": "从共享管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。",
  "delete": "永久删除",
  "clearFile": "移除文件",
  "localFile": "已选本地文件",
  "mediaError": "文件无效或超过1MB。选择图片或音频支持格式。",
  "fileHint": "示例本地保存，每个文件最大1MB，后续连接上传API。",
  "pickAudio": "选择本地录音",
  "pickImage": "选择本地图片",
  "confirm": "确认",
  "previewError": "无法试听，请检查来源后重试。",
  "simListening": "模拟收听游客",
  "overviewHint": "查看使用情况并管理景点内容。",
  "quickActions": "快捷操作",
  "managePlacesHint": "更新信息、图片和讲解。",
  "reviewQueueHint": "审核并发布已批准的内容。",
  "catalogHint": "管理景点目录和讲解内容。",
  "basicInfo": "景点信息",
  "locationSection": "位置与坐标",
  "mediaSection": "图片与资料",
  "workflowSection": "保存与版本管理",
  "resetHint": "需要重新开始时恢复示例数据。",
  "editorHint": "按语言编辑内容。",
  "clearSearch": "清除关键词",
  "admin": "管理",
  "dashboard": "概览",
  "places": "景点",
  "reviews": "审核",
  "qr": "入口二维码",
  "visitor": "游客页面",
  "demo": "数据共用服务器内存；重启服务器会丢失更改。",
  "mockMedia": "翻译和语音为模拟，示例MP3不朗读编辑内容，仅供示例发布。",
  "loading": "加载中…",
  "save": "保存草稿",
  "saved": "操作成功",
  "new": "添加景点",
  "edit": "信息",
  "content": "编辑内容",
  "search": "搜索景点…",
  "title": "正式名称",
  "period": "历史时期",
  "category": "类别",
  "lat": "纬度",
  "lng": "经度",
  "verified": "坐标已核实",
  "images": "图片：每行一个URL或photo:ID",
  "summary": "简介",
  "address": "地址",
  "body": "讲解文稿",
  "audio": "已托管MP3录音URL",
  "preview": "试听",
  "prepare": "生成示例音频",
  "translate": "从越南语模拟翻译",
  "submit": "提交审核",
  "approve": "批准版本",
  "reject": "要求修改",
  "note": "审核备注",
  "publish": "发布版本",
  "confirmPublish": "向当前设备游客视图发布此版本？",
  "archive": "归档景点",
  "confirmArchive": "归档会从示例公开目录移除景点。继续？",
  "reset": "重置示例数据",
  "confirmReset": "清除本地修改并恢复示例数据？",
  "cancel": "取消",
  "unsaved": "有未保存修改，离开？",
  "active": "活跃会话",
  "web": "网页",
  "mobile": "移动应用",
  "listening": "正在收听",
  "gateToday": "今日入口次数",
  "simWeb": "模拟网页游客",
  "simMobile": "模拟应用游客",
  "endSessions": "结束示例会话",
  "analyticsHint": "匿名会话来自内存服务器，90秒未发送心跳即过期。重启服务器会清空数据。会话数不等于人数或票数。",
  "presenceError": "无法读取统计，请检查内存服务器和API地址。",
  "empty": "暂无匹配数据",
  "revision": "修订",
  "current": "当前公开版本",
  "none": "暂无",
  "status_draft": "草稿",
  "status_submitted": "待审核",
  "status_changes": "需修改",
  "status_approved": "已批准",
  "status_published": "已发布",
  "status_archived": "已归档",
  "error_loadError": "读取失败，请重试或重置。",
  "error_saveError": "保存失败，公开版本未改变。",
  "error_invalid": "请检查必填项、顺化坐标和HTTP(S)链接。",
  "error_conflict": "版本已变，请刷新后继续。",
  "error_notFound": "未找到景点",
  "error_notApproved": "只能发布未再修改的已批准版本。",
  "error_incomplete": "需要图片、越南语内容及已输入语言的音频。",
  "error_staleJob": "任务结果已过期，请重试。",
  "retry": "重试",
  "stop": "停止试听"
} as const
const pt = {
  "gateHint": "Aberturas do link QR de entrada, uma por sessão/dia; não são bilhetes nem pessoas.",
  "gateError": "Estatísticas QR indisponíveis.",
  "confirmDelete": "Eliminar este local dos dados partilhados de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.",
  "delete": "Eliminar permanentemente",
  "clearFile": "Remover ficheiro",
  "localFile": "Ficheiro local escolhido",
  "mediaError": "Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.",
  "fileHint": "Guarda ficheiros locais até 1 MB; API de upload futura.",
  "pickAudio": "Escolher gravação local",
  "pickImage": "Escolher imagem local",
  "confirm": "Confirmar",
  "previewError": "Prévia indisponível. Verifique a origem e repita.",
  "simListening": "Simular visitante a ouvir",
  "overviewHint": "Acompanhe a atividade e gira conteúdos do património.",
  "quickActions": "Ações rápidas",
  "managePlacesHint": "Atualize informações, fotografias e narrações.",
  "reviewQueueHint": "Reveja e publique conteúdos aprovados.",
  "catalogHint": "Gira locais e conteúdos de narração.",
  "basicInfo": "Informação do local",
  "locationSection": "Localização e coordenadas",
  "mediaSection": "Fotografias e materiais",
  "workflowSection": "Guardar e gerir versões",
  "resetHint": "Reponha os dados de exemplo para recomeçar.",
  "editorHint": "Edite conteúdos em cada idioma.",
  "clearSearch": "Limpar pesquisa",
  "admin": "Gestão",
  "dashboard": "Visão geral",
  "places": "Locais",
  "reviews": "Revisão",
  "qr": "QR da entrada",
  "visitor": "Vista visitante",
  "demo": "Dados na RAM partilhada do servidor; reiniciar perde as alterações.",
  "mockMedia": "Tradução/TTS simulados. O MP3 não lê o texto editado; publicação com conteúdo de exemplo.",
  "loading": "A carregar…",
  "save": "Guardar rascunho",
  "saved": "Operação concluída",
  "new": "Adicionar local",
  "edit": "Informação",
  "content": "Editar conteúdo",
  "search": "Pesquisar locais…",
  "title": "Nome oficial",
  "period": "Período histórico",
  "category": "Categoria",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordenadas verificadas",
  "images": "Imagens: um URL ou photo:ID por linha",
  "summary": "Resumo",
  "address": "Morada",
  "body": "Texto da narração",
  "audio": "URL MP3 alojado",
  "preview": "Ouvir prévia",
  "prepare": "Preparar áudio de exemplo",
  "translate": "Tradução simulada do vietnamita",
  "submit": "Enviar para revisão",
  "approve": "Aprovar versão",
  "reject": "Pedir alterações",
  "note": "Nota de revisão",
  "publish": "Publicar versão",
  "confirmPublish": "Publicar esta versão para visitantes neste dispositivo?",
  "archive": "Arquivar local",
  "confirmArchive": "Arquivar remove o local do catálogo. Continuar?",
  "reset": "Repor exemplo",
  "confirmReset": "Eliminar alterações locais e repor dados de exemplo?",
  "cancel": "Cancelar",
  "unsaved": "Alterações por guardar. Sair?",
  "active": "Sessões ativas",
  "web": "Web",
  "mobile": "Aplicação móvel",
  "listening": "A ouvir",
  "gateToday": "Entradas QR hoje",
  "simWeb": "Simular visitante Web",
  "simMobile": "Simular visitante App",
  "endSessions": "Terminar sessões simuladas",
  "analyticsHint": "Sessões anónimas no servidor RAM expiram após 90 segundos sem sinal. Reiniciar o servidor apaga os dados. Sessões não são pessoas ou bilhetes.",
  "presenceError": "Estatísticas indisponíveis. Verifique o servidor RAM e o endereço da API.",
  "empty": "Sem dados correspondentes",
  "revision": "Revisão",
  "current": "Versão publicada atual",
  "none": "Nenhum",
  "status_draft": "Rascunho",
  "status_submitted": "Em revisão",
  "status_changes": "Alterações pedidas",
  "status_approved": "Aprovado",
  "status_published": "Publicado",
  "status_archived": "Arquivado",
  "error_loadError": "Falha ao carregar. Repetir ou repor dados.",
  "error_saveError": "Falha ao guardar. Versão pública mantida.",
  "error_invalid": "Verifique campos, coordenadas e URL HTTP(S).",
  "error_conflict": "Versão alterada. Recarregue antes de continuar.",
  "error_notFound": "Local não encontrado",
  "error_notApproved": "Publique apenas a revisão aprovada sem alterações.",
  "error_incomplete": "É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.",
  "error_staleJob": "Resultado desatualizado. Repita.",
  "retry": "Repetir",
  "stop": "Parar prévia"
} as const
const ja = {
  "gateHint": "入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。",
  "gateError": "QR統計を取得できません。",
  "confirmDelete": "この史跡を共有された管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。",
  "delete": "完全に削除",
  "clearFile": "選択ファイルを外す",
  "localFile": "ローカルファイル選択済み",
  "mediaError": "無効または1MB超過。対応する画像・音声を選んでください。",
  "fileHint": "サンプルは1ファイル1MBまでローカル保存。アップロードAPIは後日接続。",
  "pickAudio": "端末の録音を選択",
  "pickImage": "端末の画像を選択",
  "confirm": "確認",
  "previewError": "試聴できません。音源を確認して再試行してください。",
  "simListening": "再生中の利用者を追加",
  "overviewHint": "利用状況を確認し、史跡のコンテンツを管理します。",
  "quickActions": "クイック操作",
  "managePlacesHint": "情報、写真、音声ガイドを更新します。",
  "reviewQueueHint": "内容を確認して承認済みの版を公開します。",
  "catalogHint": "スポットと音声ガイドを管理します。",
  "basicInfo": "スポット情報",
  "locationSection": "場所と座標",
  "mediaSection": "写真と資料",
  "workflowSection": "保存とバージョン管理",
  "resetHint": "最初から始める場合にサンプルデータを復元します。",
  "editorHint": "言語ごとにコンテンツを編集します。",
  "clearSearch": "検索語を消去",
  "admin": "管理",
  "dashboard": "概要",
  "places": "史跡",
  "reviews": "審査",
  "qr": "入口QR",
  "visitor": "来訪者画面",
  "demo": "サーバーRAMの共有データです。再起動すると変更は失われます。",
  "mockMedia": "翻訳・TTSは模擬です。MP3は編集文を読みません。公開もサンプル用です。",
  "loading": "読込中…",
  "save": "下書き保存",
  "saved": "処理完了",
  "new": "史跡を追加",
  "edit": "情報",
  "content": "内容編集",
  "search": "史跡を検索…",
  "title": "正式名称",
  "period": "歴史的時代",
  "category": "分類",
  "lat": "緯度",
  "lng": "経度",
  "verified": "座標確認済み",
  "images": "画像：1行にURLまたはphoto:ID",
  "summary": "概要文",
  "address": "住所",
  "body": "解説文",
  "audio": "サーバー上のMP3 URL",
  "preview": "試聴",
  "prepare": "サンプル音声を用意",
  "translate": "ベトナム語から模擬翻訳",
  "submit": "審査に送信",
  "approve": "版を承認",
  "reject": "修正依頼",
  "note": "審査メモ",
  "publish": "版を公開",
  "confirmPublish": "この端末の来訪者画面に公開しますか？",
  "archive": "史跡をアーカイブ",
  "confirmArchive": "サンプル公開一覧から除きます。続けますか？",
  "reset": "サンプルデータをリセット",
  "confirmReset": "ローカル変更を破棄しサンプルに戻しますか？",
  "cancel": "取消",
  "unsaved": "未保存の変更があります。移動しますか？",
  "active": "アクティブセッション",
  "web": "Web",
  "mobile": "モバイルアプリ",
  "listening": "再生中",
  "gateToday": "本日のQR入場",
  "simWeb": "Web利用者を追加",
  "simMobile": "アプリ利用者を追加",
  "endSessions": "サンプルセッション終了",
  "analyticsHint": "匿名セッションをRAMサーバーから取得します。90秒間通知がないと期限切れになります。再起動で消去されます。人数・チケット数ではありません。",
  "presenceError": "統計を取得できません。RAMサーバーとAPIアドレスを確認してください。",
  "empty": "該当データなし",
  "revision": "改訂",
  "current": "現在の公開版",
  "none": "なし",
  "status_draft": "下書き",
  "status_submitted": "審査待ち",
  "status_changes": "要修正",
  "status_approved": "承認済み",
  "status_published": "公開済み",
  "status_archived": "アーカイブ済み",
  "error_loadError": "読込失敗。再試行またはリセットしてください。",
  "error_saveError": "保存失敗。公開版は変更されません。",
  "error_invalid": "必須項目・フエの座標・HTTP(S) URLを確認してください。",
  "error_conflict": "版が変更されました。再読込してください。",
  "error_notFound": "史跡が見つかりません",
  "error_notApproved": "承認後未変更の版だけ公開できます。",
  "error_incomplete": "画像・ベトナム語文・入力した言語の音声が必要です。",
  "error_staleJob": "古い処理結果です。再試行してください。",
  "retry": "再試行",
  "stop": "試聴停止"
} as const
export type AdminTextKey = keyof typeof vi
export const adminMessages: Record<Language, Record<AdminTextKey, string>> = { vi, en, cn, pt, ja }
/* CÁCH KIỂM TRA: Đổi đủ năm ngôn ngữ, mọi nhãn Admin đổi cùng lựa chọn du khách. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 16. SỬA — apps/web/vite.config.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\vite.config.ts

```typescript
﻿/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình build web và giữ đúng runtime React18.
 * Vite đọc; phụ thuộc plugin React và module resolution của Node.
 * Tránh lấy nhầm React19 của mobile từ package dùng chung.
 */

import { createRequire } from 'node:module'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Tìm React theo package.json của web.
// XỬ LÝ: Không tìm theo vị trí file trong packages/visitor-core.
const webRequire = createRequire(
  new URL('./package.json', import.meta.url),
)

// CHỨC NĂNG: Tách entry và thư mục build ngay từ cấu hình Vite, không dựa vào URL để cấp quyền.
// XỬ LÝ: Bản visitor không chứa cây route admin. HTTP /admin bị từ chối ở dev/preview visitor.
// Hosting production cũng phải chặn /admin và bảo vệ tên miền admin bằng xác thực riêng.
function audiencePlugin(admin: boolean): Plugin {
  const blockAdmin: import('vite').Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? '/').split('?')[0]
    if (/^\/qr(?:\/|$)/.test(path) || (!admin && /^\/admin(?:\/|$)/.test(path))) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    next()
  }
  return {
    name: 'separate-admin-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return admin ? html.replace('/src/main.tsx', '/src/main-admin.tsx') : html
      },
    },
    configureServer(server) { server.middlewares.use(blockAdmin) },
    configurePreviewServer(server) { server.middlewares.use(blockAdmin) },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), audiencePlugin(mode === 'admin')],
  // CHỨC NĂNG: Hai bản build riêng; admin dev chỉ nghe localhost theo mặc định.
  // XỬ LÝ: Không đưa cổng quản lý vào link QR/tunnel dành cho du khách.
  server: {
    host: mode === 'admin' ? '127.0.0.1' : '0.0.0.0',
    // CHỨC NĂNG: Hai site gọi chung server RAM, QR/tunnel visitor vẫn dùng cùng origin.
    // XỬ LÝ: Chỉ bản admin proxy API đọc thống kê; visitor chỉ gửi heartbeat/end.
    proxy: {
      [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry)$']: {
        target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/catalog/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
      [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$']: {
        target: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/presence/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
    },
  },
  build: { outDir: mode === 'admin' ? 'dist-admin' : 'dist' },

  // CHỨC NĂNG: Sao chép file xác minh App Links vào bản web triển khai.
  // XỬ LÝ: Dùng static riêng; tránh public/index.html cũ đè entry của Vite.
  publicDir: 'static',

  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: webRequire.resolve('react'),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: webRequire.resolve('react/jsx-runtime'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: webRequire.resolve('react/jsx-dev-runtime'),
      },
      {
        find: /^react-dom$/,
        replacement: webRequire.resolve('react-dom'),
      },
      {
        find: /^react-dom\/client$/,
        replacement: webRequire.resolve('react-dom/client'),
      },
    ],
  },
}))
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 17. SỬA — apps/web/src/App.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\App.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ghép điều hướng web với hook GPS/lưu tiến độ.
 * Vị trí: apps/web/src/App.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { usePresenceHeartbeat } from './hooks/usePresenceHeartbeat'
import { AppRoutes } from './navigation/AppRoutes'
import { useJourneyNavigation } from './hooks/useJourneyNavigation'

export default function App() { usePresenceHeartbeat(); useJourneyNavigation(); return <AppRoutes /> }
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 18. SỬA — apps/web/src/pages/admin/DashboardPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\DashboardPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Tổng quan Admin web, bốn chỉ số và lối vào nghiệp vụ nhanh.
 * AdminRoutes gọi tại /admin; phụ thuộc admin-core, presence RAM và UI Admin.
 * UC12, UC17. Giữ số phiên thực từ API; không tạo số liệu minh họa khi mất kết nối.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import { presenceClient } from '../../services/presence'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { Feedback } from '../../components/admin/AdminUI'
import { gateClient } from '../../services/admin/services'
import { AdminIcon, type AdminIconName } from '../../components/admin/AdminIcon'
export function DashboardPage() {
 const state = useAdmin(), t = useAdminText(), gate = useGateStatistics(gateClient)
 const presence = usePresenceStatistics(presenceClient)
 // CHỨC NĂNG: Tính lại thống kê nội dung khi kho thay đổi, tách số phiên lấy từ RAM.
 // XỬ LÝ: Chưa có phản hồi presence thì hiển thị —; không đánh đồng lỗi với 0 phiên.
 const metrics = useMemo(() => state.data ? dashboard(state.data) : null, [state.data])
 const tiles: {key:'active'|'gateToday'|'places'|'pending'; icon:AdminIconName}[] = [
  {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'places'},{key:'pending',icon:'review'},
 ]
 return <>
  <section className="admin-hero"><div><span className="admin-eyebrow">HUEGUIDE</span><h1>{t('dashboard')}</h1><p>{t('overviewHint')}</p></div><Link className="button admin-hero-button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link><div className="admin-hero-decoration" aria-hidden="true"><AdminIcon name="places"/></div></section>
  <Feedback state={state}/>
  {metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article className={'admin-metric metric-'+index} key={key}><div className="admin-metric-top"><span>{t(key === 'pending' ? 'status_submitted' : key)}</span><span className="admin-metric-icon"><AdminIcon name={icon}/></span></div><strong>{key === 'active' ? presence.stats?.active ?? '—' : key === 'gateToday' ? gate.stats?.today ?? '—' : metrics[key]}</strong><div className="admin-metric-line"/></article>)}</div>}
  <p className="admin-demo">{t('gateHint')}</p>
  {gate.error&&<div className="admin-error" role="alert">{t('gateError')}<button className="secondary" onClick={gate.retry}>{t('retry')}</button></div>}
  <div className="admin-dashboard-grid">
   <section className="admin-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="dashboard"/></span><h2>{t('quickActions')}</h2></div><div className="admin-quick-actions">{([
    {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'},
    {to:'/admin/reviews',title:'reviews',hint:'reviewQueueHint',icon:'review'},
   ] as const).map(item=><Link key={item.to} className="admin-quick-action" to={item.to}><span className="admin-icon-box"><AdminIcon name={item.icon}/></span><div><strong>{t(item.title)}</strong><p>{t(item.hint)}</p></div><AdminIcon name="arrow"/></Link>)}</div></section>
   <section className="admin-card admin-presence-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="users"/></span><h2>{t('active')}</h2></div><p>{t('analyticsHint')}</p>
    {/* CHỨC NĂNG: Lỗi polling có nút thử lại; không che bằng dữ liệu giả. */}
    {presence.error ? <div className="admin-error" role="alert">{t('presenceError')}<button className="secondary" onClick={presence.retry}>{t('retry')}</button></div> : !presence.stats ? <p role="status">{t('loading')}</p> : null}
   </section>
  </div>

 </>
}
/* CÁCH KIỂM TRA: Bốn chỉ số đúng; liên kết mở đúng màn; không còn nút reset; tắt RAM hiện lỗi. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 19. SỬA — apps/mobile/src/navigation/RootNavigator.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\RootNavigator.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Stack điều hướng mobile, giữ một NavigationContainer và một trình phát toàn app.
 * Vị trí: apps/mobile/src/navigation/RootNavigator.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { usePresenceHeartbeat } from '../hooks/usePresenceHeartbeat'
import { useJourneyNavigation } from '../hooks/useJourneyNavigation'
import SearchResultScreen from '../screens/SearchResultScreen'
import { JourneyPlayer } from '../components/JourneyPlayer'
import { JourneyScreen } from '../screens/JourneyScreen'
import MainTabs from './MainTabs'
import DetailScreen from '../screens/DetailScreen'
import { linking } from './linking'
import type { VisitorStack } from './types'
import { View } from 'react-native'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.
const Stack =
  createNativeStackNavigator<VisitorStack>()
// CHỨC NĂNG: Hiển thị màn danh sách ở chế độ tìm kiếm.
// XỬ LÝ: Khi tham số route thay đổi, key thay đổi để khởi tạo
// màn tìm kiếm với đúng từ khóa và danh mục mới.
const navigationRef = createNavigationContainerRef<VisitorStack>()
const openSuggested = (id: string) => { if (navigationRef.isReady()) navigationRef.navigate('Detail', { placeId: id }) }
// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.
export default function RootNavigator() {
  const t = useText()
  usePresenceHeartbeat(true)
  useJourneyNavigation({ open: openSuggested })

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: t('explore'),
        }}
      >
        <Stack.Screen
          name="Places"
          component={MainTabs}
          options={{
            title: t('explore'),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={SearchResultScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: t('details'),
          }}
        />


        <Stack.Screen name="Journey" component={JourneyScreen} options={{ title: t('jMap') }} />
      </Stack.Navigator>
      <JourneyPlayer />
      </View>
    </NavigationContainer>
  )
}
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.

## 20. SỬA — apps/mobile/src/screens/admin/DashboardScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\DashboardScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang tổng quan Admin mobile với bốn chỉ số và thao tác nhanh.
 * AdminNavigator gọi; phụ thuộc admin-core, presence RAM và bộ AdminUI. UC12–UC17.
 * Dữ liệu nội dung và lượt QR lấy từ API RAM chung; không có nút reset.
 */
import { useMemo, type ComponentProps } from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { gateClient } from '../../services/admin/services'
import { adminPresenceClient } from '../../services/presence'
import { Action } from '../../components/Action'
import { Frame, Feedback, QuickAction, SectionHeading, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'

export function DashboardScreen({navigation}:NativeStackScreenProps<AdminStack,'Dashboard'>) {
 const state=useAdmin(),t=useAdminText(),presence=usePresenceStatistics(adminPresenceClient),gate=useGateStatistics(gateClient)
 const metrics=useMemo(()=>state.data?dashboard(state.data):null,[state.data])
 const icons:Record<'active'|'gateToday'|'places'|'pending',ComponentProps<typeof Ionicons>['name']>={active:'people-outline',gateToday:'qr-code-outline',places:'business-outline',pending:'time-outline'}
 return <Frame>
  <View style={styles.hero}>
   <Text style={styles.brand}>HUEGUIDE</Text>
   <Text style={styles.heroTitle}>{t('dashboard')}</Text>
   <Text style={styles.heroText}>{t('overviewHint')}</Text>
  </View>
  <Feedback state={state}/>
  {/* CHỨC NĂNG: Active lấy API RAM, ba chỉ số khác lấy service cũ; không giả lập số. */}
  <View style={[styles.row,{alignItems:'stretch',gap:12}]}>
   {metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={key} style={[styles.metric,key==='active'&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
    <View style={[styles.metricIcon,key==='active'&&{backgroundColor:colors.playerControl}]}><Ionicons name={icons[key]} size={19} color={key==='active'?colors.white:colors.primary}/></View>
    <Text style={[styles.metricLabel,key==='active'&&{color:colors.white}]}>{t(key==='pending'?'status_submitted':key)}</Text>
    <Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?presence.stats?.active??'—':key==='gateToday'?gate.stats?.today??'—':metrics[key]}</Text>
   </View>)}
  </View>
  {presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceError')}</Text><Action title={t('retry')} icon="refresh-outline" onPress={presence.retry}/></View>:!presence.stats?<Text style={styles.muted}>{t('loading')}</Text>:null}
  <Text style={styles.muted}>{t('gateHint')}</Text>
  {gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</Text><Action title={t('retry')} onPress={gate.retry}/></View>}
  <SectionHeading title={t('quickActions')} icon="grid-outline"/>
  <QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-outline" onPress={()=>navigation.navigate('AdminPlaces')}/>
  <QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-checkmark-outline" onPress={()=>navigation.navigate('Reviews')}/>
  <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
  <View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('analyticsHint')}</Text></View>
 </Frame>
}
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
```

Cách kiểm tra: chạy các lệnh và checklist trong THONG_KE_RAM.md.
