/**
 * FILE: packages/visitor-core/src/audio/DieuKhienNgheThu.ts
 * FILE NÀY LÀM GÌ: Điều khiển nghe thử bản thu trong biên tập và kiểm duyệt, dùng chung bộ điều phối quyền phát.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { Track } from '../journey/HanhTrinh'
export type PreviewState = {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  
  position: number; duration: number; rate: number; volume: number
}
export class PreviewController {
  private state: PreviewState = { status: 'idle', position: 0, duration: 0, rate: 1, volume: 1 }
  // CHỨC NĂNG: Nguồn audio thật hiện tại; giữ lại khi pause để resume đúng thời điểm.
  private track?: Track
  // CHỨC NĂNG: Hàm gỡ nghe sự kiện audio khi đổi hoặc đóng nguồn.
  private unlisten?: () => void
  // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
  private generation = 0
  // CHỨC NĂNG: Ý định phát mới nhất của người dùng; pause trong lúc tải vẫn phải được giữ.
  private wantsPlay = false
  // CHỨC NĂNG: Đang chờ tác vụ chuẩn bị/phát; hạn chế tạo nguồn hoặc gửi thao tác trùng.
  private pending = false
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
  
  private listeners = new Set<() => void>()
  constructor(private open: () => Promise<Track>) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  // CHỨC NĂNG: Cập nhật trạng thái controller và báo cho UI.
  // XỬ LÝ: Ghép phần thay đổi với trạng thái cũ rồi thông báo các callback đã đăng ký.
  // [UC11 / UC12] set — Cập nhật trạng thái controller và báo cho UI.
  private set(next: Partial<PreviewState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(listener => listener()) }
  // TẠI SAO (set): UI cần được thông báo sau khi trạng thái controller đổi; chỉ sửa biến riêng sẽ
  // không tự render lại React.
  // CHỨC NĂNG: Nạp thời lượng trước khi nghe, không tự phát khi mở màn Admin.
  // [UC11 / UC12] prepare — Nạp thời lượng trước khi nghe, không tự phát khi mở màn Admin.
  async prepare(): Promise<void> {
    if (this.track || this.pending) return
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    const generation = this.generation
    this.pending = true; this.set({ status: 'loading' })
    try {
      const current = await this.open()
      if (generation !== this.generation) { current.dispose(); return }
      
      this.attach(current); this.set({ status: 'idle' })
    } catch { if (generation === this.generation) this.set({ status: 'error' }) }
    finally { if (generation === this.generation) this.pending = false }
  }
  // TẠI SAO (prepare): Admin cần biết thời lượng trước khi nghe nhưng mở form không đồng nghĩa
  // đồng ý tự phát audio.
  // CHỨC NĂNG: Gắn nguồn nghe thử với trạng thái controller.
  // XỬ LÝ: Đồng bộ thời lượng, tốc độ, âm lượng và sự kiện; chỉ nhận phản hồi của đúng nguồn.
  // [UC11 / UC12] attach — Gắn nguồn nghe thử với trạng thái controller.
  private attach(current: Track): void {
    this.track = current
    current.rate(this.state.rate); current.volume?.(this.state.volume)
    this.set({ duration: current.duration })
    const opened = current
    this.unlisten = current.listen(status => {
      if (this.track !== opened) return
      if (status.error) {
        this.wantsPlay = false; this.unlisten?.(); this.unlisten = undefined
        
        this.track = undefined; opened.dispose(); this.set({ status: 'error' }); return
      }
      if (status.ended) this.wantsPlay = false
      this.set({ position: status.position, duration: status.duration,
        
        status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
    })
  }
  // TẠI SAO (attach): Chỉ nguồn đang được gắn mới được quyền cập nhật trạng thái, tránh phản hồi
  // nguồn cũ làm hỏng bài mới.
  async play(): Promise<void> {
    if (this.pending || this.state.status === 'playing') return
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    const generation = this.generation
    this.wantsPlay = true; this.pending = true
    const ended = this.state.status === 'ended'
    this.set({ status: 'loading' })
    let current = this.track
    try {
      if (!current) {
        current = await this.open()
        // CHỨC NĂNG: Rời màn/đổi ngôn ngữ trong lúc tải không được phát nguồn đến muộn.
        if (generation !== this.generation) { current.dispose(); return }
        
        this.attach(current)
      }
      // CHỨC NĂNG: Chỉ nghe lại từ đầu khi bài đã kết thúc, không khi vừa tạm dừng.
      if (ended) await current.seek(0)
      if (generation !== this.generation || !this.wantsPlay) return
      await current.play()
      if (generation !== this.generation) return
      
      if (!this.wantsPlay) current.pause()
    } catch {
      if (generation === this.generation) {
        this.wantsPlay = false; this.unlisten?.(); this.unlisten = undefined
        
        this.track?.dispose(); this.track = undefined; this.set({ status: 'error' })
      }
    } finally {
      if (generation === this.generation) {
        this.pending = false
        
        if (this.state.status === 'loading') this.set({ status: this.wantsPlay ? 'playing' : 'paused' })
      }
    }
  }
  // TẠI SAO (play): Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng một
  // nghiệp vụ.
  // CHỨC NĂNG: Pause không dispose, không mở URL lại và không seek(0).
  // [UC11 / UC12] pause — Pause không dispose, không mở URL lại và không seek(0).
  pause(): void { this.wantsPlay = false; this.track?.pause(); this.set({ status: 'paused' }) }
  // TẠI SAO (pause): Giữ track khi dừng giúp tiếp tục đúng thời điểm, đồng thời không phát sinh
  // thêm nguồn âm thanh.
  // CHỨC NĂNG: Tua nguồn thật, giới hạn trong thời lượng và giữ trạng thái pause.
  // XỬ LÝ: Các lần tua xếp hàng để kéo/thả liên tiếp không đảo thứ tự kết quả.
  private seeks: Promise<void> = Promise.resolve()
  // CHỨC NĂNG: Tua đến thời điểm hợp lệ trong bản thu.
  // XỬ LÝ: Giới hạn theo thời lượng và giữ trạng thái tạm dừng nếu trước đó chưa phát.
  // [UC11 / UC12] seek — Tua đến thời điểm hợp lệ trong bản thu.
  seek(value: number): Promise<void> {
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    const generation = this.generation, track = this.track
    if (!track || !Number.isFinite(value)) return Promise.resolve()
    const target = Math.max(0, Math.min(value, this.state.duration))
    const job = this.seeks.then(async () => {
      if (generation !== this.generation || track !== this.track) return
      await track.seek(target)
      
      if (generation === this.generation && track === this.track) this.set({ position: target })
    }).catch(() => { if (generation === this.generation) this.set({ status: 'error' }) })
    this.seeks = job
    
    return job
  }
  // TẠI SAO (seek): Thời điểm phải nằm trong bản thu; thao tác tua khi đang pause không được vô
  // tình bật phát.
  // CHỨC NĂNG: Thay đổi tốc độ của nguồn đang nghe thử.
  // XỬ LÝ: Chỉ nhận các mức được hỗ trợ; thao tác tác động lên nguồn audio thật.
  // [UC11 / UC12] setRate — Thay đổi tốc độ của nguồn đang nghe thử.
  setRate(value: number): void {
    if (![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    
    try { this.track?.rate(value); this.set({ rate: value }) } catch { this.set({ status: 'error' }) }
  }
  // TẠI SAO (setRate): UI chỉ nên hiển thị tốc độ mà nguồn audio thật đã chấp nhận.
  // CHỨC NĂNG: Thay đổi âm lượng nghe thử.
  // XỬ LÝ: Giới hạn về miền hợp lệ trước khi truyền xuống nguồn audio.
  // [UC11 / UC12] setVolume — Thay đổi âm lượng nghe thử.
  setVolume(value: number): void {
    if (!Number.isFinite(value)) return
    const volume = Math.max(0, Math.min(value, 1))
    
    try { this.track?.volume?.(volume); this.set({ volume }) } catch { this.set({ status: 'error' }) }
  }
  // TẠI SAO (setVolume): Giới hạn âm lượng tránh truyền giá trị ngoài miền hợp lệ xuống thiết bị
  // hoặc trình duyệt.
  close = (): void => {
    this.generation++; this.wantsPlay = false; this.pending = false
    this.unlisten?.(); this.unlisten = undefined; this.track?.dispose(); this.track = undefined
    
    this.set({ status: 'idle', position: 0, duration: 0, rate: 1, volume: 1 })
  }
}
/* CÁCH KIỂM TRA: Pause tại giây 12 rồi play vẫn giây 12, open chỉ gọi một lần;
 * close hủy nguồn tải chậm; play thất bại giải phóng player để thử lại sạch. */
