/** FILE NÀY LÀM GÌ: Điều khiển nghe thử Admin, giữ player khi pause/resume.
 * AudioPreview native dùng; test Node dùng Track giả. UC07/UC14.
 * Phụ thuộc hợp đồng Track; không tự tạo âm thanh hoặc đồng hồ giả.
 */
import type { Track } from '../journey/journey'
export type PreviewState = {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  position: number; duration: number; rate: number; volume: number
}
export class PreviewController {
  private state: PreviewState = { status: 'idle', position: 0, duration: 0, rate: 1, volume: 1 }
  private track?: Track
  private unlisten?: () => void
  private generation = 0
  private wantsPlay = false
  private pending = false
  private listeners = new Set<() => void>()
  constructor(private open: () => Promise<Track>) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private set(next: Partial<PreviewState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(listener => listener()) }
  // CHỨC NĂNG: Nạp thời lượng trước khi nghe, không tự phát khi mở màn Admin.
  async prepare(): Promise<void> {
    if (this.track || this.pending) return
    const generation = this.generation
    this.pending = true; this.set({ status: 'loading' })
    try {
      const current = await this.open()
      if (generation !== this.generation) { current.dispose(); return }
      this.attach(current); this.set({ status: 'idle' })
    } catch { if (generation === this.generation) this.set({ status: 'error' }) }
    finally { if (generation === this.generation) this.pending = false }
  }
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
  async play(): Promise<void> {
    if (this.pending || this.state.status === 'playing') return
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
  // CHỨC NĂNG: Pause không dispose, không mở URL lại và không seek(0).
  pause(): void { this.wantsPlay = false; this.track?.pause(); this.set({ status: 'paused' }) }
  // CHỨC NĂNG: Tua nguồn thật, giới hạn trong thời lượng và giữ trạng thái pause.
  // XỬ LÝ: Các lần tua xếp hàng để kéo/thả liên tiếp không đảo thứ tự kết quả.
  private seeks: Promise<void> = Promise.resolve()
  seek(value: number): Promise<void> {
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
  setRate(value: number): void {
    if (![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    try { this.track?.rate(value); this.set({ rate: value }) } catch { this.set({ status: 'error' }) }
  }
  setVolume(value: number): void {
    if (!Number.isFinite(value)) return
    const volume = Math.max(0, Math.min(value, 1))
    try { this.track?.volume?.(volume); this.set({ volume }) } catch { this.set({ status: 'error' }) }
  }
  close = (): void => {
    this.generation++; this.wantsPlay = false; this.pending = false
    this.unlisten?.(); this.unlisten = undefined; this.track?.dispose(); this.track = undefined
    this.set({ status: 'idle', position: 0, duration: 0, rate: 1, volume: 1 })
  }
}
/* CÁCH KIỂM TRA: Pause tại giây 12 rồi play vẫn giây 12, open chỉ gọi một lần;
 * close hủy nguồn tải chậm; play thất bại giải phóng player để thử lại sạch. */
