/**
 * FILE: packages/admin-core/src/services/GoiApiQuanTri.ts
 * FILE NÀY LÀM GÌ: Gọi HTTP API quản trị, danh mục đã công bố và ghi/đọc lượt QR; không trực tiếp kết nối SQL.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { AdminService } from '../domain/HopDongDichVu'
import { AdminError, type AdminErrorCode, type AdminDocument } from '../domain/KieuDuLieuQuanTri'

export interface GateStats {
  today: number
  day: string
}

export interface GateClient {
  entry(visitId: string, platform: 'web' | 'mobile-app'): Promise<void>
  statistics(): Promise<GateStats>
}

const errors: readonly AdminErrorCode[] = [
  'loadError',
  'saveError',
  'invalid',
  'conflict',
  'notFound',
  'notApproved',
  'incomplete',
  'staleJob',
  'translationError',
]
// CHỨC NĂNG: Gửi HTTP và chuẩn hóa lỗi của quản trị.
// XỬ LÝ: Màn hình nhận mã lỗi nghiệp vụ thay vì phụ thuộc chi tiết response của fetch.

// [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] transport — Gửi HTTP và chuẩn hóa lỗi của quản trị.
function transport(base: string) {
  return async <T>(path: string, body?: unknown, timeoutMs = 8000): Promise<T> => {
    if (!base) throw new AdminError('loadError')

    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(base.replace(/\/$/, '') + path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })

      const value: unknown = await response.json()

      if (!response.ok) {
        const code = value && typeof value === 'object' && 'error' in value ? value.error : null

        throw new AdminError(
          errors.includes(code as AdminErrorCode)
            ? (code as AdminErrorCode)
            : body === undefined
              ? 'loadError'
              : 'saveError',
        )
      }

      return value as T
    } catch (error) {
      throw error instanceof AdminError
        ? error
        : new AdminError(body === undefined ? 'loadError' : 'saveError')
    } finally {
      clearTimeout(timer)
    }
  }
}
// TẠI SAO (transport): UI cần biết mã lỗi nghiệp vụ để hiển thị đúng; nếu mỗi màn tự fetch sẽ dễ
// xử lý lỗi không nhất quán.
// CHỨC NĂNG: Poll một số phiên bản nhỏ, không tải toàn bộ ảnh base64 mỗi 3 giây.
// XỬ LÝ: Chỉ một timer cho mọi subscriber; hết người nghe thì hủy, không chồng request.

// [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createHttpAdminService — Tạo service gọi các endpoint quản trị và thông báo khi dữ liệu thay đổi.
export function createHttpAdminService(base: string, pollMs = 3000): AdminService {
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.

  const request = transport(base),
    listeners = new Set<() => void>()
  // CHỨC NĂNG: Gộp các lượt load đang chạy của cùng client; xong request là bỏ tham chiếu.
  // TẠI SAO: Layout và màn hình thường tải cùng lúc, không cần gửi hai GET /document giống nhau.
  // CHỨC NĂNG: Home và Journey khởi tạo đồng thời dùng chung một GET, giảm tải SQL/tunnel.
  // XỬ LÝ: Bỏ promise sau khi xong/lỗi; lần tải sau vẫn đọc dữ liệu mới từ API.
  let pendingPublished: ReturnType<AdminService['published']> | undefined
  function loadPublished(): ReturnType<AdminService['published']> {
    if (!pendingPublished) {
      const task = request<Awaited<ReturnType<AdminService['published']>>>('/published').finally(
        () => {
          if (pendingPublished === task) pendingPublished = undefined
        },
      )
      pendingPublished = task
    }
    return pendingPublished
  }
  let pendingDocument: Promise<AdminDocument> | undefined
  function loadDocument(): Promise<AdminDocument> {
    if (!pendingDocument) {
      const task = request<AdminDocument>('/document').finally(() => {
        if (pendingDocument === task) pendingDocument = undefined
      })
      pendingDocument = task
    }
    return pendingDocument
  }

  // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.

  let stopped = true,
    timer: ReturnType<typeof setTimeout> | undefined,
    last = '',
    failed = false,
    generation = 0

  const notify = () => listeners.forEach((listener) => listener())
  // TẠI SAO (notify): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
  // lớp kết nối này.

  async function pulse(run: number) {
    try {
      const value = await request<{ version: string }>('/version')
      if (run !== generation) return
      if (value.version !== last || failed) {
        last = value.version
        failed = false
        if (!stopped) notify()
      }
    } catch {
      if (run !== generation) return
      failed = true
      if (!stopped) notify()
    }

    if (!stopped && run === generation)
      timer = setTimeout(() => {
        void pulse(run)
      }, pollMs)
  }
  // TẠI SAO (pulse): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không chạy
  // lặp ngoài ý muốn.
  // CHỨC NĂNG: Gửi một thao tác quản trị đến mock API.
  // XỬ LÝ: Tên lệnh và đối số theo hợp đồng; kiểm tra dữ liệu và revision vẫn do nơi nhận thực hiện.

  // [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] command — Gửi một thao tác quản trị đến mock API.
  async function command(action: string, args: unknown[]) {
    await request(
      '/commands',
      { action, args },
      ['generateAudio', 'translate'].includes(action) ? 180000 : 8000,
    )
    pendingDocument = undefined
    pendingPublished = undefined
    notify()
  }
  // TẠI SAO (command): Mọi thao tác quản trị phải đi qua cùng API kiểm tra lệnh và revision, không
  // ghi tùy ý cả document từ giao diện.

  return {
    // [UC09] identity — Gửi yêu cầu HTTP cho thao tác identity; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    identity: () => request('/identity'),
    load: loadDocument,
    published: loadPublished,

    // [UC10] savePlace — Gửi yêu cầu HTTP cho thao tác savePlace; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    savePlace: async (input) => {
      const result = await request<{ id: string }>('/commands', {
        action: 'savePlace',
        args: [input],
      })
      pendingDocument = undefined
      pendingPublished = undefined
      notify()
      if (typeof result.id !== 'string') throw new AdminError('saveError')
      return result.id
    },
    // [UC11] saveContent — Gửi yêu cầu HTTP cho thao tác saveContent; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    saveContent: (input) => command('saveContent', [input]),

    // [UC11] translate — Gửi yêu cầu HTTP cho thao tác translate; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    translate: (...args) => command('translate', args),
    // [UC11] generateAudio — Gửi yêu cầu HTTP cho thao tác generateAudio; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    generateAudio: (...args) => command('generateAudio', args),

    // [UC12] submit — Gửi yêu cầu HTTP cho thao tác submit; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    submit: (...args) => command('submit', args),
    // [UC12] review — Gửi yêu cầu HTTP cho thao tác review; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    review: (...args) => command('review', args),
    // [UC13] publish — Gửi yêu cầu HTTP cho thao tác publish; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    publish: (...args) => command('publish', args),

    // [UC10] archive — Gửi yêu cầu HTTP cho thao tác archive; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    archive: (...args) => command('archive', args),
    // [UC10] deletePlace — Gửi yêu cầu HTTP cho thao tác deletePlace; quy tắc nghiệp vụ được kiểm tra tại máy chủ.
    deletePlace: (...args) => command('deletePlace', args),
    // CHỨC NĂNG: Không cung cấp reset/số phiên giả qua API dùng chung.

    // [UC02 / UC04 / UC05 / UC09 / UC10 / UC11 / UC12 / UC13 / UC14] reset — Không cung cấp reset/số phiên giả qua API dùng chung.
    reset: async () => {
      throw new AdminError('invalid')
    },
    simulate: async () => {
      throw new AdminError('invalid')
    },
    endSessions: async () => {
      throw new AdminError('invalid')
    },

    subscribe(listener) {
      listeners.add(listener)
      if (stopped) {
        stopped = false
        const run = ++generation
        timer = setTimeout(() => {
          void pulse(run)
        }, pollMs)
      }
      return () => {
        listeners.delete(listener)
        if (!listeners.size) {
          stopped = true
          generation++
          if (timer) clearTimeout(timer)
        }
      }
    },
    // TẠI SAO (subscribe): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không
    // chạy lặp ngoài ý muốn.
  }
}
// TẠI SAO (createHttpAdminService): Giữ hợp đồng service ổn định giúp thay mock bằng BE thật mà
// ít ảnh hưởng các màn hình.
// CHỨC NĂNG: Tạo client ghi lượt vào và đọc thống kê QR.
// XỬ LÝ: Dùng hợp đồng riêng với thống kê phiên vì lượt QR và phiên hoạt động có ý nghĩa khác
// nhau.

// [UC05 / UC14] createGateClient — Tạo client HTTP ghi lượt QR và đọc thống kê QR.
export function createGateClient(base: string): GateClient {
  const request = transport(base)

  return {
    async entry(visitId, platform) {
      await request('/gate/entry', { visitId, platform })
    },
    // TẠI SAO (entry): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử lý lỗi.

    async statistics() {
      const value = await request<GateStats>('/gate/statistics')
      if (!Number.isSafeInteger(value.today) || value.today < 0 || typeof value.day !== 'string')
        throw new AdminError('loadError')
      return value
    },
    // TẠI SAO (statistics): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
    // không phải xử lý dữ liệu sai như thành công.
  }
}
// TẠI SAO (createGateClient): Lượt mở QR và phiên đang hoạt động là hai số liệu khác nhau nên
// cần hợp đồng gọi riêng.
// CHỨC NĂNG: Gửi lượt mở QR với cùng ID khi retry; server loại lượt lặp.
// XỬ LÝ: Không chặn giao diện du khách; dừng retry khi rời app hoặc sau ba lần lỗi.

// [UC05] sendGateEntry — Gửi lượt vào cổng, thử lại có giới hạn và dùng cùng visitId.
export function sendGateEntry(client: GateClient, visitId: string, platform: 'web' | 'mobile-app') {
  // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.

  let stopped = false,
    timer: ReturnType<typeof setTimeout> | undefined,
    attempt = 0

  const send = async () => {
    try {
      await client.entry(visitId, platform)
    } catch {
      if (!stopped && ++attempt < 3)
        timer = setTimeout(() => {
          void send()
        }, 2000)
    }
  }
  // TẠI SAO (send): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không chạy
  // lặp ngoài ý muốn.

  void send()
  return () => {
    stopped = true
    if (timer) clearTimeout(timer)
  }
}
// TẠI SAO (sendGateEntry): Cùng mã lượt có thể được thử lại khi mạng lỗi mà không biến thành
// nhiều lượt khác nhau.
/* CÁCH KIỂM TRA: Hai client đọc cùng bản; mất mạng không về dữ liệu cục bộ; HTTP409 hiện conflict; hủy subscriber dừng polling. */
