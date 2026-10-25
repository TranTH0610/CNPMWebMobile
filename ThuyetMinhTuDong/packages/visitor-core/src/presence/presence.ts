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
