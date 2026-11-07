/**
 * CHỨC NĂNG: [THUYET-MINH]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Controller nghe thử giữ một track qua pause/resume, quản lý tua, tốc độ, âm lượng và đóng nguồn.
 *
 * VỊ TRÍ: packages/visitor-core/src/audio/DieuKhienNgheThu.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - ../journey/HanhTrinh
 *
 * CÁC KHỐI CHÍNH:
 * 1. PreviewController
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập kiểu dữ liệu từ '../journey/HanhTrinh'.
import type { Track } from '../journey/HanhTrinh'
// Đặt tên kiểu PreviewState.
export type PreviewState = {
  // Khai báo status, kiểu 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'.
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  
  position: number; duration: number; rate: number; volume: number
}
// Khai báo lớp PreviewController.
// ==================== [THUYET-MINH] PreviewController ====================
// CHỨC NĂNG: Thực hiện bước PreviewController trong nhiệm vụ: Controller nghe thử giữ một track qua pause/resume, quản lý tua, tốc độ, âm lượng và đóng nguồn.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export class PreviewController {
  // Khai báo state, kiểu PreviewState. | Gán thuộc tính status: chuỗi 'idle'. | Gán thuộc tính position: giá trị số 0. | Gán thuộc tính duration: giá trị số 0. | Gán thuộc tính rate: giá trị số 1. | Gán thuộc tính volume: giá trị số 1.
  private state: PreviewState = { status: 'idle', position: 0, duration: 0, rate: 1, volume: 1 }
  // CHỨC NĂNG: Nguồn audio thật hiện tại; giữ lại khi pause để resume đúng thời điểm.
  // Khai báo track không bắt buộc, kiểu Track.
  private track?: Track
  // CHỨC NĂNG: Hàm gỡ nghe sự kiện audio khi đổi hoặc đóng nguồn.
  // Khai báo unlisten không bắt buộc, kiểu () => void.
  private unlisten?: () => void
  // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
  // Khai báo generation.
  private generation = 0
  // CHỨC NĂNG: Ý định phát mới nhất của người dùng; pause trong lúc tải vẫn phải được giữ.
  // Khai báo wantsPlay.
  private wantsPlay = false
  // CHỨC NĂNG: Đang chờ tác vụ chuẩn bị/phát; hạn chế tạo nguồn hoặc gửi thao tác trùng.
  // Khai báo pending.
  private pending = false
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
  
  private listeners = new Set<() => void>()
  constructor(private open: () => Promise<Track>) {}
  // Khai báo snapshot.
  snapshot = () => this.state
  // Khai báo subscribe. | Thực hiện Gọi this.listeners.add(listener). | Trả kết quả: khai báo callback () => { this.listeners.delete(listener) }. | Thực hiện Gọi this.listeners.delete(listener).
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  // CHỨC NĂNG: Cập nhật trạng thái controller và báo cho UI.
  // XỬ LÝ: Ghép phần thay đổi với trạng thái cũ rồi thông báo các callback đã đăng ký.
  // Khai báo set(next). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.state = { ...this.state, ...next }. | Thực hiện Gọi this.listeners.forEach(listener => listener()).
  private set(next: Partial<PreviewState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(listener => listener()) }
  // TẠI SAO (set): UI cần được thông báo sau khi trạng thái controller đổi; chỉ sửa biến riêng sẽ
  // không tự render lại React.
  // CHỨC NĂNG: Nạp thời lượng trước khi nghe, không tự phát khi mở màn Admin.
  // Khai báo prepare(). Nhận đầu vào qua tham số.
  async prepare(): Promise<void> {
    // Rẽ nhánh nếu this.track || this.pending. | Thoát hàm hiện tại ngay.
    if (this.track || this.pending) return
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    // Khai báo generation: đọc this.generation từ đối tượng/mảng để dùng tại bước hiện tại.
    const generation = this.generation
    // Thực hiện tính biểu thức this.pending = true. | Thực hiện Gọi this.set({ status: 'loading' }). | Gán thuộc tính status: chuỗi 'loading'.
    this.pending = true; this.set({ status: 'loading' })
    // Bắt đầu vùng try.
    try {
      // Khai báo current: await chờ Gọi this.open().
      const current = await this.open()
      // Rẽ nhánh nếu generation !== this.generation. | Thực hiện current.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thoát hàm hiện tại ngay.
      if (generation !== this.generation) { current.dispose(); return }
      
      this.attach(current); this.set({ status: 'idle' })
    } catch { if (generation === this.generation) this.set({ status: 'error' }) }
    finally { if (generation === this.generation) this.pending = false }
  }
  // TẠI SAO (prepare): Admin cần biết thời lượng trước khi nghe nhưng mở form không đồng nghĩa
  // đồng ý tự phát audio.
  // CHỨC NĂNG: Gắn nguồn nghe thử với trạng thái controller.
  // XỬ LÝ: Đồng bộ thời lượng, tốc độ, âm lượng và sự kiện; chỉ nhận phản hồi của đúng nguồn.
  // Khai báo attach(current). Nhận đầu vào qua tham số.
  private attach(current: Track): void {
    // Thực hiện tính biểu thức this.track = current.
    this.track = current
    // Thực hiện Gọi current.rate(this.state.rate). | Thực hiện Gọi current.volume?.(this.state.volume).
    current.rate(this.state.rate); current.volume?.(this.state.volume)
    // Thực hiện Gọi this.set({ duration: current.duration }). | Gán thuộc tính duration: đọc current.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
    this.set({ duration: current.duration })
    // Khai báo opened: sử dụng current làm giá trị của bước hiện tại.
    const opened = current
    // Thực hiện tính biểu thức this.unlisten = current.listen(status => { if (this.track !== opened) return if (status.er.
    this.unlisten = current.listen(status => {
      // Rẽ nhánh nếu this.track !== opened. | Thoát hàm hiện tại ngay.
      if (this.track !== opened) return
      // Rẽ nhánh nếu status.error.
      if (status.error) {
        // Thực hiện tính biểu thức this.wantsPlay = false. | Thực hiện Gọi this.unlisten?.(). | Thực hiện tính biểu thức this.unlisten = undefined.
        this.wantsPlay = false; this.unlisten?.(); this.unlisten = undefined
        
        this.track = undefined; opened.dispose(); this.set({ status: 'error' }); return
      }
      // Rẽ nhánh nếu status.ended. | Thực hiện tính biểu thức this.wantsPlay = false.
      if (status.ended) this.wantsPlay = false
      // Thực hiện Gọi this.set({ position: status.position, duration: status.duration, status: status.ended ? 'e. | Gán thuộc tính position: đọc status.position từ đối tượng/mảng để dùng tại bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio. | Gán thuộc tính duration: đọc status.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
      this.set({ position: status.position, duration: status.duration,
        
        status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
    })
  }
  // TẠI SAO (attach): Chỉ nguồn đang được gắn mới được quyền cập nhật trạng thái, tránh phản hồi
  // nguồn cũ làm hỏng bài mới.
  // Khai báo play(). Nhận đầu vào qua tham số.
  async play(): Promise<void> {
    // Rẽ nhánh nếu this.pending || this.state.status === 'playing'. | Thoát hàm hiện tại ngay.
    if (this.pending || this.state.status === 'playing') return
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    // Khai báo generation: đọc this.generation từ đối tượng/mảng để dùng tại bước hiện tại.
    const generation = this.generation
    // Thực hiện tính biểu thức this.wantsPlay = true. | Thực hiện tính biểu thức this.pending = true.
    this.wantsPlay = true; this.pending = true
    // Khai báo ended: tính biểu thức this.state.status === 'ended'.
    const ended = this.state.status === 'ended'
    // Thực hiện Gọi this.set({ status: 'loading' }). | Gán thuộc tính status: chuỗi 'loading'.
    this.set({ status: 'loading' })
    // Khai báo current: đọc this.track từ đối tượng/mảng để dùng tại bước hiện tại.
    let current = this.track
    // Bắt đầu vùng try.
    try {
      // Rẽ nhánh nếu !current.
      if (!current) {
        // Thực hiện tính biểu thức current = await this.open().
        current = await this.open()
        // CHỨC NĂNG: Rời màn/đổi ngôn ngữ trong lúc tải không được phát nguồn đến muộn.
        // Rẽ nhánh nếu generation !== this.generation. | Thực hiện current.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thoát hàm hiện tại ngay.
        if (generation !== this.generation) { current.dispose(); return }
        
        this.attach(current)
      }
      // CHỨC NĂNG: Chỉ nghe lại từ đầu khi bài đã kết thúc, không khi vừa tạm dừng.
      // Rẽ nhánh nếu ended. | Thực hiện await chờ current.seek yêu cầu chuyển thời điểm phát.
      if (ended) await current.seek(0)
      // Rẽ nhánh nếu generation !== this.generation || !this.wantsPlay. | Thoát hàm hiện tại ngay.
      if (generation !== this.generation || !this.wantsPlay) return
      // Thực hiện await chờ Gọi current.play().
      await current.play()
      // Rẽ nhánh nếu generation !== this.generation. | Thoát hàm hiện tại ngay.
      if (generation !== this.generation) return
      
      if (!this.wantsPlay) current.pause()
    } catch {
      // Rẽ nhánh nếu generation === this.generation.
      if (generation === this.generation) {
        // Thực hiện tính biểu thức this.wantsPlay = false. | Thực hiện Gọi this.unlisten?.(). | Thực hiện tính biểu thức this.unlisten = undefined.
        this.wantsPlay = false; this.unlisten?.(); this.unlisten = undefined
        
        this.track?.dispose(); this.track = undefined; this.set({ status: 'error' })
      }
    } finally {
      // Rẽ nhánh nếu generation === this.generation.
      if (generation === this.generation) {
        // Thực hiện tính biểu thức this.pending = false.
        this.pending = false
        
        if (this.state.status === 'loading') this.set({ status: this.wantsPlay ? 'playing' : 'paused' })
      }
    }
  }
  // TẠI SAO (play): Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng một
  // nghiệp vụ.
  // CHỨC NĂNG: Pause không dispose, không mở URL lại và không seek(0).
  // Khai báo pause(). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.wantsPlay = false. | Thực hiện this.track?.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện Gọi this.set({ status: 'paused' }). | Gán thuộc tính status: chuỗi 'paused'.
  pause(): void { this.wantsPlay = false; this.track?.pause(); this.set({ status: 'paused' }) }
  // TẠI SAO (pause): Giữ track khi dừng giúp tiếp tục đúng thời điểm, đồng thời không phát sinh
  // thêm nguồn âm thanh.
  // CHỨC NĂNG: Tua nguồn thật, giới hạn trong thời lượng và giữ trạng thái pause.
  // XỬ LÝ: Các lần tua xếp hàng để kéo/thả liên tiếp không đảo thứ tự kết quả.
  // Khai báo seeks, kiểu Promise<void>.
  private seeks: Promise<void> = Promise.resolve()
  // CHỨC NĂNG: Tua đến thời điểm hợp lệ trong bản thu.
  // XỬ LÝ: Giới hạn theo thời lượng và giữ trạng thái tạm dừng nếu trước đó chưa phát.
  // Khai báo seek(value). Nhận đầu vào qua tham số.
  seek(value: number): Promise<void> {
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    // Khai báo generation: đọc this.generation từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo track: đọc this.track từ đối tượng/mảng để dùng tại bước hiện tại.
    const generation = this.generation, track = this.track
    // Rẽ nhánh nếu !track || !Number.isFinite(value). | Trả kết quả: Gọi Promise.resolve().
    if (!track || !Number.isFinite(value)) return Promise.resolve()
    // Khai báo target: Gọi Math.max(0, Math.min(value, this.state.duration)).
    const target = Math.max(0, Math.min(value, this.state.duration))
    // Khai báo job: Gọi this.seeks.then(async () => { if (generation !== this.generation || track !== this.track).
    const job = this.seeks.then(async () => {
      // Rẽ nhánh nếu generation !== this.generation || track !== this.track. | Thoát hàm hiện tại ngay.
      if (generation !== this.generation || track !== this.track) return
      // Thực hiện await chờ track.seek yêu cầu chuyển thời điểm phát.
      await track.seek(target)
      
      if (generation === this.generation && track === this.track) this.set({ position: target })
    }).catch(() => { if (generation === this.generation) this.set({ status: 'error' }) })
    // Thực hiện tính biểu thức this.seeks = job.
    this.seeks = job
    
    return job
  }
  // TẠI SAO (seek): Thời điểm phải nằm trong bản thu; thao tác tua khi đang pause không được vô
  // tình bật phát.
  // CHỨC NĂNG: Thay đổi tốc độ của nguồn đang nghe thử.
  // XỬ LÝ: Chỉ nhận các mức được hỗ trợ; thao tác tác động lên nguồn audio thật.
  // Khai báo setRate(value). Nhận đầu vào qua tham số.
  setRate(value: number): void {
    // Rẽ nhánh nếu ![0.75, 1, 1.25, 1.5, 2].includes(value). | Thoát hàm hiện tại ngay.
    if (![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    
    try { this.track?.rate(value); this.set({ rate: value }) } catch { this.set({ status: 'error' }) }
  }
  // TẠI SAO (setRate): UI chỉ nên hiển thị tốc độ mà nguồn audio thật đã chấp nhận.
  // CHỨC NĂNG: Thay đổi âm lượng nghe thử.
  // XỬ LÝ: Giới hạn về miền hợp lệ trước khi truyền xuống nguồn audio.
  // Khai báo setVolume(value). Nhận đầu vào qua tham số.
  setVolume(value: number): void {
    // Rẽ nhánh nếu !Number.isFinite(value). | Thoát hàm hiện tại ngay.
    if (!Number.isFinite(value)) return
    // Khai báo volume: Gọi Math.max(0, Math.min(value, 1)).
    const volume = Math.max(0, Math.min(value, 1))
    
    try { this.track?.volume?.(volume); this.set({ volume }) } catch { this.set({ status: 'error' }) }
  }
  // TẠI SAO (setVolume): Giới hạn âm lượng tránh truyền giá trị ngoài miền hợp lệ xuống thiết bị
  // hoặc trình duyệt.
  // Khai báo close.
  close = (): void => {
    // Thực hiện sử dụng this.generation++ làm giá trị của bước hiện tại. | Thực hiện tính biểu thức this.wantsPlay = false. | Thực hiện tính biểu thức this.pending = false.
    this.generation++; this.wantsPlay = false; this.pending = false
    // Thực hiện Gọi this.unlisten?.(). | Thực hiện tính biểu thức this.unlisten = undefined. | Thực hiện this.track?.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thực hiện tính biểu thức this.track = undefined.
    this.unlisten?.(); this.unlisten = undefined; this.track?.dispose(); this.track = undefined
    
    this.set({ status: 'idle', position: 0, duration: 0, rate: 1, volume: 1 })
  }
}
/* CÁCH KIỂM TRA: Pause tại giây 12 rồi play vẫn giây 12, open chỉ gọi một lần;
 * close hủy nguồn tải chậm; play thất bại giải phóng player để thử lại sạch. */
