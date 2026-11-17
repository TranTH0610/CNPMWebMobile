/**
 * FILE: packages/visitor-core/src/journey/HanhTrinh.ts
 * FILE NÀY LÀM GÌ: Điều phối GPS, gợi ý di tích, một phiên nghe, lưu/khôi phục tiến độ và chọn tuyến tham quan.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { LANGUAGES, type Language, type PlaceRecord, type Point } from '../domain/KieuDuLieuDuKhach'
import { publishedText, type Catalog } from '../catalog/DanhMucDiTich'
import { distanceMeters, validPoint } from '../catalog/TimKiemVaBoLoc'

export type Fix = Point & { accuracy: number; timestamp: number }
export type MapPoint = Point & { source: string; fieldVerified: boolean }
export type VisitRoute = { id: string; title: Record<Language, string>; stops: string[]; verified: boolean; available: boolean }
export type MediaStatus = { position: number; duration: number; playing: boolean; ended: boolean; error?: boolean }
export type Track = {
  duration: number
  play(): Promise<void>
  pause(): void
  seek(seconds: number): Promise<void>
  rate(value: number): void
  volume?(value: number): void
  listen(callback: (status: MediaStatus) => void): () => void
  
  dispose(): void
}
export type Saved = {
  placeId: string; language: Language; textVersion: number; audioId: string
  
  audioVersion: number; position: number; duration: number; rate: number
}
export type Session = Saved & { title: string }
export type JourneyPorts = {
  catalog: Catalog
  open(url: string, title: string): Promise<Track>
  watch(next: (fix: Fix) => void, fail: () => void): Promise<() => void>
  read(): Promise<string | null>
  write(value: string | null): Promise<void>
  positions: Readonly<Record<string, MapPoint>>
  
  routes: readonly VisitRoute[]
}
export type JourneyError = 'audioMissing' | 'audioFailed' | 'gpsFailed' | 'gpsWeak' | 'saveFailed' | 'savedInvalid' | 'loadError'
export type JourneyState = {
  places: readonly PlaceRecord[]; ready: boolean; status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  session?: Session; restore?: Saved; changed: boolean; error?: JourneyError
  
  gps: boolean; fix?: Fix; suggestedId?: string; routeId?: string
}

// CHỨC NĂNG: Giới hạn thời điểm tua theo thời lượng thật.
// XỬ LÝ: Không dùng số giả để mô phỏng thanh thời gian.

// [UC07.2] clampTime — Giới hạn thời điểm tua trong khoảng từ 0 đến thời lượng thực của bài.
export const clampTime = (value: number, duration: number) =>
  Number.isFinite(value) && Number.isFinite(duration) ? Math.max(0, Math.min(value, duration)) : 0
// TẠI SAO (clampTime): Giá trị tua có thể âm, quá thời lượng hoặc không hữu hạn; chặn lại trước
// khi đưa xuống nguồn audio.

// CHỨC NĂNG: Kiểm tra dữ liệu localStorage/AsyncStorage không đáng tin cậy.
// XỬ LÝ: JSON lỗi, ngôn ngữ lạ, thời gian âm hoặc phiên bản sai đều bị loại.
// [UC07] parseSaved — Đọc và kiểm tra JSON phiên nghe đã lưu; loại bản ghi hỏng trước khi đề nghị khôi phục.
export function parseSaved(raw: string | null): Saved | undefined {
  if (!raw) return undefined
  try {
    const x: unknown = JSON.parse(raw)
    if (!x || typeof x !== 'object') return undefined
    const s = x as Record<string, unknown>
    
    if (typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string'
      || !LANGUAGES.some(l => l.code === s.language)
      || !['textVersion', 'audioVersion', 'position', 'duration', 'rate'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]))) return undefined
    
    if (Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1
      || Number(s.audioVersion) < 1 || ![0.75, 1, 1.25, 1.5, 2].includes(Number(s.rate))) return undefined
    // Trả kết quả: tạo object gồm placeId, language, audioId, textVersion, audioVersion, position, duration, rate. | Gán thuộc tính placeId: đọc s.placeId từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính language: đọc s.language từ đối tượng/mảng để dùng tại bước hiện tại. | Gán thuộc tính audioId: đọc s.audioId từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    return { placeId: s.placeId, language: s.language as Language, audioId: s.audioId,
      textVersion: Number(s.textVersion), audioVersion: Number(s.audioVersion),
      
      position: clampTime(Number(s.position), Number(s.duration)), duration: Number(s.duration), rate: Number(s.rate) }
  } catch { return undefined }
}
// TẠI SAO (parseSaved): Bộ nhớ cục bộ có thể chứa JSON cũ/sai; không dùng thẳng để tua vào một
// bài hoặc phiên bản không phù hợp.

// CHỨC NĂNG: Chỉ chọn điểm gần nhất trong 100 m, giữ ổn định khi bằng nhau.
// XỬ LÝ: Tọa độ lấy từ nguồn bản đồ được ghi rõ, không coi là đã khảo sát GPS.
// [UC06] nearest — Tính khoảng cách từ vị trí khách đến các di tích và chọn điểm phù hợp trong bán kính 100 m.
export function nearest(places: readonly PlaceRecord[], points: JourneyPorts['positions'], fix: Fix, previous?: string, now = Date.now()) {
  
  if (!validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60
    || !Number.isFinite(fix.timestamp) || Math.abs(now - fix.timestamp) > 30000) return undefined
  //     const point = p.position && validPoint(p.position) ? p.position : points[p.id]
  //     if (!point || !validPoint(point)) return []
  //     const meters = distanceMeters(fix, point)
  //     return meters <= 100 ? [{ id: p.id, meters }] : []
  //   }).sort sắp xếp mảng theo hàm so sánh.
  const matches = places.flatMap(p => {
    const point = p.position && validPoint(p.position) ? p.position : points[p.id]
    if (!point || !validPoint(point)) return []
    const meters = distanceMeters(fix, point)
    
    return meters <= 100 ? [{ id: p.id, meters }] : []
  }).sort((a, b) => a.meters - b.meters || a.id.localeCompare(b.id))
  const stable = matches.find(m => m.id === previous)
  
  return stable && matches[0] && Math.abs(stable.meters - matches[0].meters) < 0.01 ? stable.id : matches[0]?.id
}
// TẠI SAO (nearest): Tọa độ cũ hoặc độ chính xác kém có thể gợi ý nhầm di tích; kiểm tra tín
// hiệu trước khi chọn điểm gần.

// CHỨC NĂNG: Kiểm tra tuyến còn sử dụng được với danh mục hiện tại.
// XỬ LÝ: Tuyến cần khả dụng và tất cả điểm dừng còn tồn tại trong danh sách được nhận.
// [UC08] routeAvailable — Kiểm tra các điểm trong tuyến còn nằm trong danh mục di tích đang được phục vụ.
export function routeAvailable(route: VisitRoute, places: readonly PlaceRecord[]) {
  
  return route.available && route.stops.length > 0 && route.stops.every(id => places.some(p => p.id === id))
}
// TẠI SAO (routeAvailable): Tuyến chứa điểm đã bị rút khỏi danh mục không còn là một lộ trình
// đầy đủ để khách sử dụng.

export class JourneyController {
  private state: JourneyState = { places: [], ready: false, status: 'idle', changed: false, gps: false }
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
  private listeners = new Set<() => void>()
  // CHỨC NĂNG: Nguồn audio thật hiện tại; giữ lại khi pause để resume đúng thời điểm.
  private track?: Track
  // CHỨC NĂNG: Hàm gỡ nghe sự kiện audio khi đổi hoặc đóng nguồn.
  private unlisten?: () => void
  // CHỨC NĂNG: Hàm gỡ theo dõi GPS khi tắt vị trí hoặc đóng controller.
  private unwatch?: () => void
  // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
  private generation = 0
  // CHỨC NĂNG: Dấu phiên vòng đời; loại kết quả trả về sau khi controller đã khởi động lại/đóng.
  private lifecycle = 0
  // CHỨC NĂNG: Dấu phiên theo dõi GPS để bỏ kết quả của lần đăng ký cũ.
  private gpsGeneration = 0
  private intent?: { id: string; language: Language; autoplay: boolean }
  // CHỨC NĂNG: Hàng đợi lưu tiến độ; giữ đúng thứ tự các lần ghi bất đồng bộ.
  private writes: Promise<void> = Promise.resolve()
  
  private lastPersist = 0
  constructor(public readonly ports: JourneyPorts) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  // CHỨC NĂNG: Cập nhật trạng thái controller và báo cho UI.
  // XỬ LÝ: Ghép phần thay đổi với trạng thái cũ rồi thông báo các callback đã đăng ký.
  // [UC01 / UC06 / UC07 / UC08] set — Cập nhật trạng thái controller và báo cho UI.
  private set(next: Partial<JourneyState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(l => l()) }
  // TẠI SAO (set): UI cần được thông báo sau khi trạng thái controller đổi; chỉ sửa biến riêng sẽ
  // không tự render lại React.

  // CHỨC NĂNG: Nạp danh mục và bản lưu độc lập.
  // XỬ LÝ: Bộ nhớ bị chặn vẫn giữ danh sách; bản ghi đổi phiên bản chỉ hiện lời nhắc.
  // [UC07] start — Tải danh mục và tiến độ đã lưu; kiểm tra phiên bản rồi hiện đề nghị tiếp tục, chưa tự phát audio.
  async start() {
    const life = ++this.lifecycle
    try {
      let readFailed = false
      const [places, raw] = await Promise.all([this.ports.catalog.list(), this.ports.read().catch(() => { readFailed = true; return null })])
      if (life !== this.lifecycle) return
      const saved = parseSaved(raw)
      let valid: Saved | undefined
      let changed = false
      if (saved) {
        const text = publishedText(places.find(p => p.id === saved.placeId) ?? { content: {} } as PlaceRecord, saved.language)
        const audio = text?.audio
        if (audio?.status === 'published' && audio.approvedAt && audio.publishedAt) {
          valid = saved
          
          changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.version !== saved.audioVersion
        }
      }
      this.set({ places, ready: true, restore: valid, changed,
        
        error: readFailed ? 'saveFailed' : raw && !valid ? 'savedInvalid' : undefined })
    } catch { if (life === this.lifecycle) this.set({ ready: true, error: 'loadError' }) }
  }
  // TẠI SAO (start): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
  // liệu.

  // CHỨC NĂNG: Refresh danh mục sau công bố, không dừng nguồn audio đang nghe.
  // [UC06 / UC07 / UC08] refreshCatalog — Tải lại danh mục công bố mà vẫn giữ nguồn âm thanh đang nghe.
  async refreshCatalog() {
    const life = this.lifecycle
    try {
      const places = await this.ports.catalog.list()
      // CHỨC NĂNG: API phục hồi thì gỡ lỗi tải cũ, tránh player lỗi dù danh sách đã có.
      // XỬ LÝ: Chỉ gỡ loadError; giữ lỗi audio/GPS/bộ nhớ và phiên đang nghe.
      
      if (life === this.lifecycle) this.set({ places, error: this.state.error === 'loadError' ? undefined : this.state.error })
    }
    catch { if (life === this.lifecycle) this.set({ error: 'loadError' }) }
  }
  // TẠI SAO (refreshCatalog): API có thể phục hồi hoặc nội dung được công bố mới trong lúc khách
  // đang nghe; cần cập nhật mà không tự phát bài.
  // CHỨC NĂNG: Ghi tuần tự để phản hồi ghi cũ không đè tiến độ mới.
  // XỬ LÝ: Lỗi lưu không dừng âm thanh; UI thông báo vẫn dùng được trong phiên.
  // [UC07] persist — Xếp hàng ghi/xóa tiến độ trong bộ nhớ thiết bị; lỗi lưu không làm dừng âm thanh.
  private persist(clear = false, quiet = false) {
    const s = this.state.session
    if (!s && !clear) return
    const value = clear ? null : JSON.stringify(s)
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    const generation = this.generation
    this.writes = this.writes.then(() => this.ports.write(value)).catch(() => {
      // CHỨC NĂNG: Lỗi ghi của bài cũ không được mở lại player người dùng vừa đóng.
      // XỬ LÝ: Đối chiếu generation; close xóa checkpoint theo chế độ quiet.
      
      if (!quiet && generation === this.generation) this.set({ error: 'saveFailed' })
    })
  }
  // TẠI SAO (persist): Ghi tiến độ theo thứ tự tránh bản lưu cũ hoàn tất sau cùng và ghi đè vị trí
  // nghe mới hơn.
  // CHỨC NĂNG: Dừng và giải phóng nguồn audio hiện tại.
  // XỬ LÝ: Gỡ listener của nguồn cũ trước khi thay nguồn để phản hồi cũ không ghi đè phiên mới.
  // [UC07] stopTrack — Gỡ listener, tạm dừng và giải phóng nguồn audio cũ trước khi đổi hoặc đóng bài.
  private stopTrack() { this.unlisten?.(); this.unlisten = undefined; this.track?.pause(); this.track?.dispose(); this.track = undefined }
  // TẠI SAO (stopTrack): Nguồn cũ và listener cũ phải được đóng trước khi chuyển bài để tránh âm
  // thanh/sự kiện đè lên bài mới.

  // CHỨC NĂNG: Tải và phát một nguồn đã công bố.
  // XỬ LÝ: Mỗi lần gọi tăng generation; phản hồi cũ đến muộn chỉ được giải phóng.
  // [UC07] play — Chọn bản thu đã công bố theo di tích/ngôn ngữ, mở nguồn mới và cập nhật phiên nghe; bỏ kết quả tải cũ đến muộn.
  async play(id: string, language: Language, position = 0, autoplay = true, rate = 1) {
    const request = ++this.generation
    this.intent = { id, language, autoplay }
    this.persist()
    this.stopTrack()
    this.set({ status: 'loading', session: undefined, error: undefined, restore: undefined })
    let next: Track | undefined
    try {
      const place = await this.ports.catalog.get(id)
      if (request !== this.generation) return
      const text = publishedText(place, language)
      const audio = text?.audio
      if (!audio || audio.status !== 'published' || !audio.approvedAt || !audio.publishedAt) throw new Error('audioMissing')
      next = await this.ports.open(audio.url, text.title)
      if (request !== this.generation) { next.dispose(); return }
      if (!Number.isFinite(next.duration) || next.duration <= 0) throw new Error('audioFailed')
      this.track = next
      const session: Session = { placeId: id, language, title: text.title, textVersion: text.version,
        audioId: audio.id, audioVersion: audio.version, duration: next.duration,
        position: clampTime(position, next.duration), rate }
      await next.seek(session.position)
      if (request !== this.generation) return
      next.rate(rate)
      this.set({ session, status: 'paused' })
      this.unlisten = next.listen(status => {
        if (request !== this.generation || !this.state.session) return
        if (status.error) { this.persist(); this.stopTrack(); this.set({ status: 'error', error: 'audioFailed' }); return }
        this.set({ session: { ...this.state.session, position: clampTime(status.position, status.duration), duration: status.duration },
          status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
        
        if (status.ended) this.persist(true)
        else if (Date.now() - this.lastPersist > 5000) { this.lastPersist = Date.now(); this.persist() }
      })
      if (autoplay) { await next.play(); if (request === this.generation && this.intent?.autoplay) this.set({ status: 'playing' }) }
      
      this.persist()
    } catch (error) {
      if (request !== this.generation) { next?.dispose(); return }
      // CHỨC NĂNG: Pause ngay sau Play là thao tác bình thường, không phải lỗi nguồn.
      // XỬ LÝ: HTML Audio có thể hủy Promise play bằng AbortError khi pause đến trước.
      if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay && next === this.track) { this.persist(); return }
      if (next && next !== this.track) next.dispose()
      this.stopTrack()
      
      this.set({ status: 'error', error: error instanceof Error && error.message === 'audioMissing' ? 'audioMissing' : 'audioFailed' })
    }
  }
  // TẠI SAO (play): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.

  // CHỨC NĂNG: Dừng và đóng hoàn toàn trình nghe khi nhấn × trên web/native.
  // XỬ LÝ: generation vô hiệu hóa tải/Promise cũ; gỡ listener trước khi pause/dispose.
  // Xóa phiên và checkpoint để đổi ngôn ngữ/retry không tự mở lại bài đã đóng.
  // Danh mục, tuyến và GPS giữ nguyên vì đóng trình nghe không phải thoát ứng dụng.
  // [UC07] close — Đóng bài hiện tại và dọn trạng thái/bản lưu theo chế độ của thao tác đóng.
  close() {
    this.generation++
    this.intent = undefined
    this.stopTrack()
    this.set({ status: 'idle', session: undefined, restore: undefined, changed: false, error: undefined })
    
    this.persist(true, true)
  }
  // TẠI SAO (close): Bấm đóng phải dừng cả ý định phát đang chờ, không chỉ ẩn giao diện rồi để
  // audio tải xong tự phát.

  // CHỨC NĂNG: Tạm dừng, tiếp tục, tua và tốc độ tác động trực tiếp lên Track thật.
  // XỬ LÝ: Chỉ cập nhật trạng thái khi nguồn hiện tại vẫn là nguồn đã thao tác.
  // [UC07.1] pause — Tạm dừng và lưu tiến độ; giữ nguồn audio để có thể tiếp tục đúng thời điểm.
  pause() { if (!this.track) return; if (this.intent) this.intent.autoplay = false; this.track.pause(); this.set({ status: 'paused' }); this.persist() }
  // TẠI SAO (pause): Giữ track khi dừng giúp tiếp tục đúng thời điểm, đồng thời không phát sinh
  // thêm nguồn âm thanh.
  // CHỨC NĂNG: Tiếp tục nguồn đang tạm dừng.
  // XỬ LÝ: Giữ vị trí của track hiện tại, không mở bài như một yêu cầu nghe mới.
  // [UC07.1] resume — Tiếp tục nguồn hiện tại từ thời điểm đã dừng và cập nhật trạng thái phát.
  async resume() {
    const t = this.track
    if (!t) return
    if (this.intent) this.intent.autoplay = true
    
    try { await t.play(); if (t === this.track && this.intent?.autoplay) this.set({ status: 'playing', error: undefined }) }
    catch (error) { if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay) return; if (t === this.track) this.set({ status: 'error', error: 'audioFailed' }) }
  }
  // TẠI SAO (resume): Tạm dừng là giữ lại vị trí hiện tại; mở URL như bài mới sẽ làm khách phải
  // nghe lại từ đầu.
  // CHỨC NĂNG: Tua đến thời điểm hợp lệ trong bản thu.
  // XỬ LÝ: Giới hạn theo thời lượng và giữ trạng thái tạm dừng nếu trước đó chưa phát.
  // [UC07.2] seek — Tua đến thời điểm yêu cầu sau khi giới hạn theo thời lượng bài.
  async seek(value: number) {
    const t = this.track, s = this.state.session
    if (!t || !s || this.state.status === 'loading') return
    try { const position = clampTime(value, s.duration); await t.seek(position)
      
      if (t === this.track && this.state.session) { this.set({ session: { ...this.state.session, position } }); this.persist() }
    } catch { if (t === this.track) this.set({ error: 'audioFailed' }) }
  }
  // TẠI SAO (seek): Thời điểm phải nằm trong bản thu; thao tác tua khi đang pause không được vô
  // tình bật phát.
  // CHỨC NĂNG: Đổi tốc độ phát bài nghe.
  // XỬ LÝ: Kiểm tra mức tốc độ và chỉ cập nhật trạng thái sau khi adapter áp dụng được.
  // [UC07.3] rate — Kiểm tra tốc độ được hỗ trợ rồi áp dụng cho nguồn audio và phiên nghe.
  rate(value: number) {
    if (!this.track || !this.state.session || ![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    
    try { this.track.rate(value); this.set({ session: { ...this.state.session, rate: value } }); this.persist() }
    catch { this.set({ error: 'audioFailed' }) }
  }
  // TẠI SAO (rate): Tốc độ hiển thị cần khớp tốc độ thật, kể cả khi adapter báo không áp dụng
  // được.
  // XỬ LÝ: Đang nghe thì phát bản mới từ 0; đang tạm dừng vẫn tạm dừng từ 0.
  // [UC01 / UC07] changeLanguage — Đổi bản thu theo ngôn ngữ mới từ đầu bài; giữ ý định phát hoặc tạm dừng của khách.
  changeLanguage(language: Language) {
    const active = this.intent
    if (!active || active.language === language) return
    const autoplay = this.state.status === 'playing' || (this.state.status === 'loading' && active.autoplay)
    
    void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1)
  }
  // TẠI SAO (changeLanguage): Đổi tiếng phải dùng văn bản và audio của cùng ngôn ngữ; không đọc
  // bài cũ bằng một lựa chọn tiếng mới.
  // CHỨC NĂNG: Bỏ đề nghị khôi phục bài nghe trước.
  // XỬ LÝ: Không tự phát bài cũ khi người dùng đã chọn bỏ qua.
  // [UC07] dismissRestore — Bỏ đề nghị khôi phục và xóa bản lưu tương ứng khi khách chọn không tiếp tục.
  dismissRestore() { this.set({ restore: undefined, changed: false }); this.persist(true) }
  // TẠI SAO (dismissRestore): Khôi phục bài nghe phải theo lựa chọn của khách, không tự chạy lại
  // bài cũ ngoài ý muốn.
  // CHỨC NĂNG: Tiếp tục bài từ bản lưu hợp lệ.
  // XỬ LÝ: Kiểm tra nội dung/audio còn khớp phiên bản trước khi sử dụng thời điểm đã lưu.
  // [UC07] restorePlay — Phát lại phiên đã lưu; nếu phiên bản thay đổi thì bắt đầu từ đầu thay vì dùng mốc cũ.
  async restorePlay() { const s = this.state.restore; if (s) await this.play(s.placeId, s.language, this.state.changed ? 0 : s.position, true, s.rate) }
  // TẠI SAO (restorePlay): Mốc thời gian của audio cũ có thể không phù hợp với bản mới; cần đối
  // chiếu phiên bản trước khi tiếp tục.
  // CHỨC NĂNG: Chọn tuyến tham quan hiện tại.
  // XỬ LÝ: Kiểm tra tuyến còn sử dụng được với danh mục công bố trước khi áp dụng.
  // [UC08] selectRoute — Chọn tuyến còn hợp lệ trong danh mục và cập nhật tuyến đang xem.
  selectRoute(id?: string) {
    const route = this.ports.routes.find(r => r.id === id)
    
    this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefined })
  }
  // TẠI SAO (selectRoute): Chọn tuyến không hợp lệ sẽ đưa khách đến các điểm không còn trong danh
  // mục.

  // CHỨC NĂNG: GPS chỉ đổi gợi ý, không gọi play.
  // XỬ LÝ: Đang phát/đang tải/đã kết thúc hoặc đang chờ khôi phục thì giữ màn.
  // [UC06 / UC06.1] acceptFix — Loại GPS sai tọa độ, sai số trên 60 m hoặc cũ quá 30 giây; chỉ cập nhật gợi ý khi trạng thái nghe cho phép.
  acceptFix(fix: Fix) {
    const weak = !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || !Number.isFinite(fix.timestamp) || fix.accuracy > 60 || Math.abs(Date.now() - fix.timestamp) > 30000 || !validPoint(fix)
    const prior = this.state.error
    // CHỨC NĂNG: Vô hiệu hóa gợi ý cũ khi tín hiệu mới không còn tin cậy.
    // XỬ LÝ: Xóa cả tọa độ và suggestedId; giữ nguyên phiên nghe và nguồn audio.
    // TẠI SAO: Không để tên di tích cũ trông như được nhận diện từ GPS đang bị lỗi.
    this.set({ fix: weak ? undefined : fix,
      suggestedId: weak ? undefined : this.state.suggestedId,
      error: weak ? 'gpsWeak' : prior === 'gpsWeak' || prior === 'gpsFailed' ? undefined : prior })
    if (weak || !['idle', 'paused', 'error'].includes(this.state.status) || this.state.restore) return
    
    this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.state.suggestedId) })
  }
  // TẠI SAO (acceptFix): Mỗi tín hiệu GPS mới cần được xét chất lượng và cập nhật gợi ý; có gợi ý
  // không có nghĩa tự phát audio.
  // CHỨC NĂNG: Bật hoặc tắt theo dõi vị trí.
  // XỬ LÝ: Gỡ đăng ký cũ và bỏ phản hồi đến muộn khi người dùng đã tắt GPS.
  // [UC06.1] gps — Bật/tắt watcher vị trí, xóa gợi ý cũ và bỏ callback của lần theo dõi đã hủy.
  async gps(enabled: boolean) {
    const request = ++this.gpsGeneration
    this.unwatch?.(); this.unwatch = undefined
    // CHỨC NĂNG: Mỗi lần bật lại bắt đầu bằng trạng thái chờ vị trí mới.
    // TẠI SAO: Tắt GPS hoặc đang xin lại quyền không được giữ marker/gợi ý của lần cũ.
    this.set({ gps: enabled, fix: undefined, suggestedId: undefined, error: undefined })
    if (!enabled) return
    try {
      
      const stop = await this.ports.watch(fix => { if (request === this.gpsGeneration && this.state.gps) this.acceptFix(fix) },
        () => {
          if (request !== this.gpsGeneration) return
          this.unwatch?.(); this.unwatch = undefined
          this.set({ gps: false, fix: undefined, suggestedId: undefined, error: 'gpsFailed' })
        })
      
      // CHỨC NĂNG: Gỡ watcher nếu đã tắt GPS hoặc adapter báo lỗi trong lúc đăng ký.
      // TẠI SAO: Kết quả đến muộn không được làm theo dõi vị trí sống lại.
      if (request !== this.gpsGeneration || !this.state.gps) stop(); else this.unwatch = stop
    } catch { if (request === this.gpsGeneration) this.set({ gps: false, fix: undefined, suggestedId: undefined, error: 'gpsFailed' }) }
  }
  // TẠI SAO (gps): Khách có thể đổi quyết định khi yêu cầu vị trí còn đang chờ; cần bỏ kết quả của
  // lần đăng ký cũ.
  // CHỨC NĂNG: Chốt tiến độ khi web/app ra nền, không dừng bài đang nghe.
  // [UC07] checkpoint — Chốt tiến độ gần nhất khi ứng dụng đổi vòng đời để lần sau có thể tiếp tục.
  checkpoint() { this.persist(this.state.status === 'ended') }
  // TẠI SAO (checkpoint): Cần lưu gần lúc app đổi trạng thái để việc quay lại có tiến độ gần nhất
  // thay vì chỉ dựa vào lúc đóng trang.
  retry() { if (this.state.error === 'loadError') { void this.start(); return } const i = this.intent; if (i) void this.play(i.id, i.language) }
  // TẠI SAO (retry): Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng một
  // nghiệp vụ.
  // CHỨC NĂNG: Dọn controller khi nơi sở hữu kết thúc.
  // XỬ LÝ: Dừng nguồn/timer/listener liên quan để không còn xử lý chạy sau khi rời luồng.
  
  // [UC06.1 / UC07] dispose — Dọn watcher GPS, listener và tài nguyên phiên nghe khi controller kết thúc.
  dispose() { this.lifecycle++; this.generation++; this.gpsGeneration++; this.persist(this.state.status === 'ended'); this.unwatch?.(); this.unwatch = undefined; this.stopTrack() }
  // TẠI SAO (dispose): Timer, GPS và audio có vòng đời riêng; không dọn sẽ tiếp tục hoạt động khi
  // component sở hữu đã rời.
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm test; kiểm tra chỉ có một nguồn đang nghe.
 * - Đổi ngôn ngữ lúc tải chậm: nguồn cũ không được phát muộn.
 */
