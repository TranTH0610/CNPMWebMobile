/**
 * FILE: packages/visitor-core/src/presence/PhienHoatDong.ts
 * FILE NÀY LÀM GÌ: Hợp đồng và HTTP client thống kê dùng chung; gửi heartbeat ngay rồi lặp sau 30 giây, xử lý
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
// [UC14] createPresenceClient — Tạo client gửi heartbeat/kết thúc phiên và đọc số phiên hoạt động.
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
  // TẠI SAO (request): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.
  // Trả kết quả: tạo object gồm heartbeat, end, statistics.
  return {
    // CHỨC NĂNG: Ghi nhận một phiên du khách vẫn đang sử dụng hệ thống.
    // XỬ LÝ: Dùng sessionId làm khóa; gửi nhiều nhịp chỉ cập nhật cùng phiên.
    // [UC14] heartbeat — Ghi nhận một phiên du khách vẫn đang sử dụng hệ thống.
    async heartbeat(session) { await request('/sessions/heartbeat', session) },
    // TẠI SAO (heartbeat): Server cần biết phiên còn sống; chỉ mở trang một lần không đủ để xác định
    // khách còn đang sử dụng.
    // CHỨC NĂNG: Kết thúc một phiên theo mã.
    // XỬ LÝ: Xóa mã khỏi kho; gọi lại với mã đã xóa không tạo phiên mới.
    // [UC14] end — Kết thúc một phiên theo mã.
    async end(sessionId) { await request('/sessions/end', { sessionId }) },
    // TẠI SAO (end): Khi nhận được thông báo kết thúc, kho có thể bỏ phiên ngay thay vì chờ hết TTL.
    async statistics() {
      const value = await request('/statistics/active')
      if (!value || typeof value !== 'object') throw new Error('presence_invalid')
      const data = value as Record<string, unknown>
      // Duyệt lần lượt ['active', 'web', 'mobile', 'updatedAt', 'ttlSeconds'] bằng const key.
      for (const key of ['active', 'web', 'mobile', 'updatedAt', 'ttlSeconds']) {
        
        if (typeof data[key] !== 'number' || !Number.isFinite(data[key]) || data[key] < 0) throw new Error('presence_invalid')
      }
      if (data.active !== Number(data.web) + Number(data.mobile)) throw new Error('presence_invalid')
      // Trả kết quả: tạo object gồm active, web, mobile, updatedAt, ttlSeconds. | Gán thuộc tính active: Gọi Number(data.active). | Gán thuộc tính web: Gọi Number(data.web). | Gán thuộc tính mobile: Gọi Number(data.mobile).
      return { active: Number(data.active), web: Number(data.web), mobile: Number(data.mobile),
        
        updatedAt: Number(data.updatedAt), ttlSeconds: Number(data.ttlSeconds) }
    },
    // TẠI SAO (statistics): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
    // không phải xử lý dữ liệu sai như thành công.
  }
}
// TẠI SAO (createPresenceClient): Tập trung URL, timeout và kiểm tra phản hồi giúp mọi nơi đọc
// thống kê dùng cùng hợp đồng.
// CHỨC NĂNG: Gửi ngay một heartbeat rồi lặp lại sau 30 giây.
// XỬ LÝ: Chờ request kết thúc mới lên lịch nên không chồng request; lỗi không chặn du khách.
// Cleanup chỉ dừng gửi: server tự hết hạn sau 90 giây, tránh end đến muộn xóa nhầm phiên vừa mở lại.
// [UC14] startPresenceHeartbeat — Gửi heartbeat ngay rồi định kỳ để máy chủ biết phiên vẫn còn hoạt động.
export function startPresenceHeartbeat(client: PresenceClient, session: PresenceSession): () => void {
  // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const pulse = async () => {
    try { await client.heartbeat(session) } catch { /* Mất mạng không làm gián đoạn app. */ }
    
    if (!stopped) timer = setTimeout(() => { void pulse() }, 30000)
  }
  // TẠI SAO (pulse): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không chạy
  // lặp ngoài ý muốn.
  void pulse()
  
  return () => { stopped = true; if (timer) clearTimeout(timer) }
}
// TẠI SAO (startPresenceHeartbeat): Chờ request xong mới đặt lịch tránh chồng request; heartbeat
// định kỳ cho phép server phát hiện phiên đã mất kết nối.
/* CÁCH KIỂM TRA: Server tắt không treo UI; API trả dữ liệu sai bị từ chối; không gửi đồng thời nhiều nhịp. */
