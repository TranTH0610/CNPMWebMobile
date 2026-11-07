/**
 * CHỨC NĂNG: [PHIEN-HOAT-DONG] [THONG-KE]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Hợp đồng và HTTP client thống kê dùng chung; gửi heartbeat ngay rồi lặp sau 30 giây, xử lý
 *
 * VỊ TRÍ: packages/visitor-core/src/presence/PhienHoatDong.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/presence/TheoDoiPhienReact.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. createPresenceClient
 * 2. startPresenceHeartbeat
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Đặt tên kiểu PresencePlatform.
export type PresencePlatform = 'web' | 'mobile-app'
// Khai báo hợp đồng PresenceSession. | Khai báo sessionId, kiểu string. Phân biệt phiên ẩn danh để nhiều nhịp heartbeat không bị đếm thành nhiều phiên. | Khai báo platform, kiểu PresencePlatform. Phân nhóm web và mobile-app trong cùng kho thống kê.
export interface PresenceSession { sessionId: string; platform: PresencePlatform }
// Khai báo hợp đồng PresenceStats. | Khai báo active, kiểu number. Biểu diễn số phiên hoạt động; không suy ra số người hoặc số vé từ số này. | Khai báo web, kiểu number. | Khai báo mobile, kiểu number. | Khai báo updatedAt, kiểu number. | Khai báo ttlSeconds, kiểu number.
export interface PresenceStats { active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number }
// Khai báo hợp đồng PresenceClient.
export interface PresenceClient {
  // Khai báo heartbeat(session). Ghi nhận phiên còn hoạt động theo sessionId.
  heartbeat(session: PresenceSession): Promise<void>
  // Khai báo end(sessionId). Mô tả cách gọi trong hợp đồng kiểu.
  end(sessionId: string): Promise<void>
  
  statistics(): Promise<PresenceStats>
}
// CHỨC NĂNG: Tạo client một lần tại service nền tảng, không gọi fetch trong UI.
// XỬ LÝ: Timeout 5 giây; mất mạng ném lỗi để hook hiện trạng thái chưa có số liệu.
// Khai báo createPresenceClient(base). Nhận đầu vào qua tham số.
// ==================== [PHIEN-HOAT-DONG] [THONG-KE] createPresenceClient ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function createPresenceClient(base: string): PresenceClient {
  // Khai báo origin: base.replace tạo chuỗi mới theo mẫu thay thế, không sửa chuỗi ban đầu.
  const origin = base.replace(/\/$/, '')
  // Khai báo request(path, body). Nhận đầu vào qua tham số.
  async function request(path: string, body?: unknown): Promise<unknown> {
    // Khai báo controller: AbortController tạo tín hiệu hủy riêng cho tác vụ, tránh request treo vô hạn.
    const controller = new AbortController()
    // Khai báo timeout: setTimeout lên lịch tác vụ một lần.
    const timeout = setTimeout(() => controller.abort(), 5000)
    // Bắt đầu vùng try.
    try {
      // Khai báo response: await chờ fetch gửi HTTP request. | Gán thuộc tính method: chọn giữa hai giá trị theo điều kiện body === undefined.
      const response = await fetch(origin + path, { method: body === undefined ? 'GET' : 'POST',
        // Gán thuộc tính headers: chọn giữa hai giá trị theo điều kiện body === undefined. | Gán thuộc tính 'Content-Type': chuỗi 'application/json'.
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        // Gán thuộc tính body: chọn giữa hai giá trị theo điều kiện body === undefined. | Gán thuộc tính signal: đọc controller.signal từ đối tượng/mảng để dùng tại bước hiện tại. Cho phép hủy request khi hết thời gian chờ hoặc tác vụ không còn cần thiết.
        body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal })
      // Rẽ nhánh nếu !response.ok. | Ném new Error('presence_unavailable').
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
    // Khai báo heartbeat(session). Ghi nhận phiên còn hoạt động theo sessionId. | Thực hiện await chờ Gọi request('/sessions/heartbeat', session).
    async heartbeat(session) { await request('/sessions/heartbeat', session) },
    // TẠI SAO (heartbeat): Server cần biết phiên còn sống; chỉ mở trang một lần không đủ để xác định
    // khách còn đang sử dụng.
    // CHỨC NĂNG: Kết thúc một phiên theo mã.
    // XỬ LÝ: Xóa mã khỏi kho; gọi lại với mã đã xóa không tạo phiên mới.
    // Khai báo end(sessionId). Nhận đầu vào qua tham số. | Thực hiện await chờ Gọi request('/sessions/end', { sessionId }). | Đặt trường sessionId bằng giá trị của biến cùng tên.
    async end(sessionId) { await request('/sessions/end', { sessionId }) },
    // TẠI SAO (end): Khi nhận được thông báo kết thúc, kho có thể bỏ phiên ngay thay vì chờ hết TTL.
    // Khai báo statistics(). Nhận đầu vào qua tham số.
    async statistics() {
      // Khai báo value: await chờ Gọi request('/statistics/active').
      const value = await request('/statistics/active')
      // Rẽ nhánh nếu !value || typeof value !== 'object'. | Ném new Error('presence_invalid').
      if (!value || typeof value !== 'object') throw new Error('presence_invalid')
      // Khai báo data: sử dụng value làm giá trị của bước hiện tại.
      const data = value as Record<string, unknown>
      // Duyệt lần lượt ['active', 'web', 'mobile', 'updatedAt', 'ttlSeconds'] bằng const key.
      for (const key of ['active', 'web', 'mobile', 'updatedAt', 'ttlSeconds']) {
        
        if (typeof data[key] !== 'number' || !Number.isFinite(data[key]) || data[key] < 0) throw new Error('presence_invalid')
      }
      // Rẽ nhánh nếu data.active !== Number(data.web) + Number(data.mobile). | Ném new Error('presence_invalid').
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
// Khai báo startPresenceHeartbeat(client, session). Gửi nhịp ngay rồi lên lịch nhịp tiếp sau request.
// ==================== [PHIEN-HOAT-DONG] [THONG-KE] startPresenceHeartbeat ====================
export function startPresenceHeartbeat(client: PresenceClient, session: PresenceSession): () => void {
  // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.
  // Khai báo stopped: sử dụng false làm giá trị của bước hiện tại.
  let stopped = false
  // Khai báo timer: không có giá trị khởi tạo.
  let timer: ReturnType<typeof setTimeout> | undefined
  // Khai báo pulse: khai báo callback async () => { try { await client.heartbeat(session) } catch { /* Mất mạng k.
  const pulse = async () => {
    // Bắt đầu vùng try. | Thực hiện await chờ Gọi client.heartbeat(session).
    try { await client.heartbeat(session) } catch { /* Mất mạng không làm gián đoạn app. */ }
    
    if (!stopped) timer = setTimeout(() => { void pulse() }, 30000)
  }
  // TẠI SAO (pulse): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không chạy
  // lặp ngoài ý muốn.
  // Thực hiện sử dụng void pulse() làm giá trị của bước hiện tại.
  void pulse()
  
  return () => { stopped = true; if (timer) clearTimeout(timer) }
}
// TẠI SAO (startPresenceHeartbeat): Chờ request xong mới đặt lịch tránh chồng request; heartbeat
// định kỳ cho phép server phát hiện phiên đã mất kết nối.
/* CÁCH KIỂM TRA: Server tắt không treo UI; API trả dữ liệu sai bị từ chối; không gửi đồng thời nhiều nhịp. */
