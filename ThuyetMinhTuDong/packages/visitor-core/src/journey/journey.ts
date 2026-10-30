/**
 * FILE NÀY LÀM GÌ
 * Controller giữ trạng thái nghe, GPS, tuyến và tiến độ. Nhận adapter để không phụ thuộc React
 * Native hoặc DOM.
 *
 * VỊ TRÍ: packages/visitor-core/src/journey/journey.ts
 * DÙNG BỞI: apps/mobile/src/screens/JourneyScreen.tsx;
 * apps/mobile/src/services/journeyAdapters.ts; apps/web/src/pages/JourneyPage.tsx; và các nơi
 * import khác.
 * PHỤ THUỘC: ../domain/model; ../catalog/catalog; ../catalog/search
 * TẠI SAO TÁCH FILE: Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng
 * một nghiệp vụ.
 */
// Nhập các thành phần từ '../domain/model'.
import { LANGUAGES, type Language, type PlaceRecord, type Point } from '../domain/model'
// Nhập các thành phần từ '../catalog/catalog'.
import { publishedText, type Catalog } from '../catalog/catalog'
// Nhập các thành phần từ '../catalog/search'.
import { distanceMeters, validPoint } from '../catalog/search'

// Đặt tên kiểu Fix. | Khai báo accuracy, kiểu number. | Khai báo timestamp, kiểu number.
export type Fix = Point & { accuracy: number; timestamp: number }
// Đặt tên kiểu MapPoint. | Khai báo source, kiểu string. | Khai báo fieldVerified, kiểu boolean. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
export type MapPoint = Point & { source: string; fieldVerified: boolean }
// Đặt tên kiểu VisitRoute. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo title, kiểu Record<Language, string>. | Khai báo stops, kiểu string[]. | Khai báo verified, kiểu boolean. Tách tọa độ tham khảo với tọa độ đã xác nhận; không biến dữ liệu mẫu thành kết quả khảo sát. | Khai báo available, kiểu boolean.
export type VisitRoute = { id: string; title: Record<Language, string>; stops: string[]; verified: boolean; available: boolean }
// Đặt tên kiểu MediaStatus. | Khai báo position, kiểu number. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio; kiểu khai báo xác định đơn vị. | Khai báo duration, kiểu number. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ. | Khai báo playing, kiểu boolean. | Khai báo ended, kiểu boolean. | Khai báo error không bắt buộc, kiểu boolean.
export type MediaStatus = { position: number; duration: number; playing: boolean; ended: boolean; error?: boolean }
// Đặt tên kiểu Track.
export type Track = {
  // Khai báo duration, kiểu number. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
  duration: number
  // Khai báo play(). Mô tả cách gọi trong hợp đồng kiểu.
  play(): Promise<void>
  // Khai báo pause(). Mô tả cách gọi trong hợp đồng kiểu.
  pause(): void
  // Khai báo seek(seconds). Mô tả cách gọi trong hợp đồng kiểu.
  seek(seconds: number): Promise<void>
  // Khai báo rate(value). Mô tả cách gọi trong hợp đồng kiểu.
  rate(value: number): void
  // Khai báo volume(value). Mô tả cách gọi trong hợp đồng kiểu.
  volume?(value: number): void
  // Khai báo listen(callback). Mô tả cách gọi trong hợp đồng kiểu.
  listen(callback: (status: MediaStatus) => void): () => void
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `dispose(): void`: Khai báo dispose(). Mô tả cách gọi trong hợp đồng kiểu.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  dispose(): void
}
// Đặt tên kiểu Saved.
export type Saved = {
  // Khai báo placeId, kiểu string. | Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác. | Khai báo textVersion, kiểu number. | Khai báo audioId, kiểu string.
  placeId: string; language: Language; textVersion: number; audioId: string
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `audioVersion: number; position: number; duration: number; rate: number`: Khai báo audioVersion, kiểu number. | Khai báo position, kiểu number. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio; kiểu khai báo xác định đơn vị. | Khai báo duration, kiểu number. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ. | Khai báo rate, kiểu number.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  audioVersion: number; position: number; duration: number; rate: number
}
// Đặt tên kiểu Session. | Khai báo title, kiểu string.
export type Session = Saved & { title: string }
// Đặt tên kiểu JourneyPorts.
export type JourneyPorts = {
  // Khai báo catalog, kiểu Catalog.
  catalog: Catalog
  // Khai báo open(url, title). Mô tả cách gọi trong hợp đồng kiểu.
  open(url: string, title: string): Promise<Track>
  // Khai báo watch(next, fail). Mô tả cách gọi trong hợp đồng kiểu.
  watch(next: (fix: Fix) => void, fail: () => void): Promise<() => void>
  // Khai báo read(). Mô tả cách gọi trong hợp đồng kiểu.
  read(): Promise<string | null>
  // Khai báo write(value). Mô tả cách gọi trong hợp đồng kiểu.
  write(value: string | null): Promise<void>
  // Khai báo positions, kiểu Readonly<Record<string, MapPoint>>.
  positions: Readonly<Record<string, MapPoint>>
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `routes: readonly VisitRoute[]`: Khai báo routes, kiểu readonly VisitRoute[].
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  routes: readonly VisitRoute[]
}
// Đặt tên kiểu JourneyError.
export type JourneyError = 'audioMissing' | 'audioFailed' | 'gpsFailed' | 'gpsWeak' | 'saveFailed' | 'savedInvalid' | 'loadError'
// Đặt tên kiểu JourneyState.
export type JourneyState = {
  // Khai báo places, kiểu readonly PlaceRecord[]. | Khai báo ready, kiểu boolean. | Khai báo status, kiểu 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'.
  places: readonly PlaceRecord[]; ready: boolean; status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  // Khai báo session không bắt buộc, kiểu Session. | Khai báo restore không bắt buộc, kiểu Saved. | Khai báo changed, kiểu boolean. | Khai báo error không bắt buộc, kiểu JourneyError.
  session?: Session; restore?: Saved; changed: boolean; error?: JourneyError
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `gps: boolean; fix?: Fix; suggestedId?: string; routeId?: string`: Khai báo gps, kiểu boolean. | Khai báo fix không bắt buộc, kiểu Fix. | Khai báo suggestedId không bắt buộc, kiểu string. | Khai báo routeId không bắt buộc, kiểu string.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  gps: boolean; fix?: Fix; suggestedId?: string; routeId?: string
}

// CHỨC NĂNG: Giới hạn thời điểm tua theo thời lượng thật.
// XỬ LÝ: Không dùng số giả để mô phỏng thanh thời gian.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const clampTime = (value: number, duration: number) =>`: Khai báo clampTime: khai báo callback (value: number, duration: number) => Number.isFinite(value) && Number.isFin.
 * DÒNG `Number.isFinite(value) && Number.isFinite(duration) ? Math.max(0, Math.min(value, dur`: Khai báo clampTime: khai báo callback (value: number, duration: number) => Number.isFinite(value) && Number.isFin.
 */
export const clampTime = (value: number, duration: number) =>
  Number.isFinite(value) && Number.isFinite(duration) ? Math.max(0, Math.min(value, duration)) : 0
// TẠI SAO (clampTime): Giá trị tua có thể âm, quá thời lượng hoặc không hữu hạn; chặn lại trước
// khi đưa xuống nguồn audio.

// CHỨC NĂNG: Kiểm tra dữ liệu localStorage/AsyncStorage không đáng tin cậy.
// XỬ LÝ: JSON lỗi, ngôn ngữ lạ, thời gian âm hoặc phiên bản sai đều bị loại.
// Khai báo parseSaved(raw). Kiểm tra bản lưu trước khi khôi phục để JSON hoặc phiên bản sai không làm hỏng phiên nghe.
export function parseSaved(raw: string | null): Saved | undefined {
  // Rẽ nhánh nếu !raw. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
  if (!raw) return undefined
  // Bắt đầu vùng try.
  try {
    // Khai báo x: JSON.parse chuyển chuỗi sang dữ liệu.
    const x: unknown = JSON.parse(raw)
    // Rẽ nhánh nếu !x || typeof x !== 'object'. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
    if (!x || typeof x !== 'object') return undefined
    // Khai báo s: sử dụng x làm giá trị của bước hiện tại.
    const s = x as Record<string, unknown>
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string'`: Rẽ nhánh nếu typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string' || !LANGUAGES.some(l => l.code ==.
     * DÒNG `|| !LANGUAGES.some(l => l.code === s.language)`: Rẽ nhánh nếu typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string' || !LANGUAGES.some(l => l.code ==.
     * DÒNG `|| !['textVersion', 'audioVersion', 'position', 'duration', 'rate'].every(k => typeof`: Rẽ nhánh nếu typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string' || !LANGUAGES.some(l => l.code ==. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
     */
    if (typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string'
      || !LANGUAGES.some(l => l.code === s.language)
      || !['textVersion', 'audioVersion', 'position', 'duration', 'rate'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]))) return undefined
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1`: Rẽ nhánh nếu Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1 || Number(s.audioVersion) < 1 |.
     * DÒNG `|| Number(s.audioVersion) < 1 || ![0.75, 1, 1.25, 1.5, 2].includes(Number(s.rate))) r`: Rẽ nhánh nếu Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1 || Number(s.audioVersion) < 1 |. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
     */
    if (Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1
      || Number(s.audioVersion) < 1 || ![0.75, 1, 1.25, 1.5, 2].includes(Number(s.rate))) return undefined
    // Trả kết quả: tạo object gồm placeId, language, audioId, textVersion, audioVersion, position, duration, rate. | Gán thuộc tính placeId: đọc s.placeId từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính language: đọc s.language từ đối tượng/mảng để dùng tại bước hiện tại. | Gán thuộc tính audioId: đọc s.audioId từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    return { placeId: s.placeId, language: s.language as Language, audioId: s.audioId,
      // Gán thuộc tính textVersion: Gọi Number(s.textVersion). | Gán thuộc tính audioVersion: Gọi Number(s.audioVersion).
      textVersion: Number(s.textVersion), audioVersion: Number(s.audioVersion),
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `position: clampTime(Number(s.position), Number(s.duration)), duration: Number(s.durat`: Gán thuộc tính position: Gọi clampTime(Number(s.position), Number(s.duration)). | Gán thuộc tính duration: Gọi Number(s.duration). | Gán thuộc tính rate: Gọi Number(s.rate).
       * DÒNG `} catch { return undefined }`: Bắt đầu vùng try. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      position: clampTime(Number(s.position), Number(s.duration)), duration: Number(s.duration), rate: Number(s.rate) }
  } catch { return undefined }
}
// TẠI SAO (parseSaved): Bộ nhớ cục bộ có thể chứa JSON cũ/sai; không dùng thẳng để tua vào một
// bài hoặc phiên bản không phù hợp.

// CHỨC NĂNG: Chỉ chọn điểm gần nhất trong 100 m, giữ ổn định khi bằng nhau.
// XỬ LÝ: Tọa độ lấy từ nguồn bản đồ được ghi rõ, không coi là đã khảo sát GPS.
// Khai báo nearest(places, points, fix, previous, now). Chọn địa điểm đủ gần từ tọa độ hiện tại sau khi xét độ chính xác và tuổi tín hiệu.
export function nearest(places: readonly PlaceRecord[], points: JourneyPorts['positions'], fix: Fix, previous?: string, now = Date.now()) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (!validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.acc`: Rẽ nhánh nếu !validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60 || !Number.isFinit.
   * DÒNG `|| !Number.isFinite(fix.timestamp) || Math.abs(now - fix.timestamp) > 30000) return u`: Rẽ nhánh nếu !validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60 || !Number.isFinit. | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
   */
  if (!validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60
    || !Number.isFinite(fix.timestamp) || Math.abs(now - fix.timestamp) > 30000) return undefined
  // Khai báo matches: places.flatMap(p => {
  //     const point = p.position && validPoint(p.position) ? p.position : points[p.id]
  //     if (!point || !validPoint(point)) return []
  //     const meters = distanceMeters(fix, point)
  //     return meters <= 100 ? [{ id: p.id, meters }] : []
  //   }).sort sắp xếp mảng theo hàm so sánh.
  const matches = places.flatMap(p => {
    // Khai báo point: chọn giữa hai giá trị theo điều kiện p.position && validPoint(p.position).
    const point = p.position && validPoint(p.position) ? p.position : points[p.id]
    // Rẽ nhánh nếu !point || !validPoint(point). | Trả kết quả: tạo mảng [].
    if (!point || !validPoint(point)) return []
    // Khai báo meters: distanceMeters tính khoảng cách từ tọa độ theo mét để lọc/sắp xếp nhất quán.
    const meters = distanceMeters(fix, point)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return meters <= 100 ? [{ id: p.id, meters }] : []`: Trả kết quả: chọn giữa hai giá trị theo điều kiện meters <= 100. | Gán thuộc tính id: đọc p.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Đặt trường meters bằng giá trị của biến cùng tên.
     * DÒNG `}).sort((a, b) => a.meters - b.meters || a.id.localeCompare(b.id))`: Khai báo matches: places.flatMap(p => {
    const point = p.position && validPoint(p.position) ? p.position : points[p.id]
    if (!point || !validPoint(point)) return []
    const meters = distanceMeters(fix, point)
    return meters <= 100 ? [{ id: p.id, meters }] : []
  }).sort sắp xếp mảng theo hàm so sánh.
     */
    return meters <= 100 ? [{ id: p.id, meters }] : []
  }).sort((a, b) => a.meters - b.meters || a.id.localeCompare(b.id))
  // Khai báo stable: matches.find lấy phần tử đầu tiên phù hợp.
  const stable = matches.find(m => m.id === previous)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return stable && matches[0] && Math.abs(stable.meters - matches[0].meters) < 0.01 ? s`: Trả kết quả: chọn giữa hai giá trị theo điều kiện stable && matches[0] && Math.abs(stable.meters - matches[0].
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return stable && matches[0] && Math.abs(stable.meters - matches[0].meters) < 0.01 ? stable.id : matches[0]?.id
}
// TẠI SAO (nearest): Tọa độ cũ hoặc độ chính xác kém có thể gợi ý nhầm di tích; kiểm tra tín
// hiệu trước khi chọn điểm gần.

// CHỨC NĂNG: Kiểm tra tuyến còn sử dụng được với danh mục hiện tại.
// XỬ LÝ: Tuyến cần khả dụng và tất cả điểm dừng còn tồn tại trong danh sách được nhận.
// Khai báo routeAvailable(route, places). Nhận đầu vào qua tham số.
export function routeAvailable(route: VisitRoute, places: readonly PlaceRecord[]) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return route.available && route.stops.length > 0 && route.stops.every(id => places.so`: Trả kết quả: tính biểu thức route.available && route.stops.length > 0 && route.stops.every(id => places.some(p => p.id.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return route.available && route.stops.length > 0 && route.stops.every(id => places.some(p => p.id === id))
}
// TẠI SAO (routeAvailable): Tuyến chứa điểm đã bị rút khỏi danh mục không còn là một lộ trình
// đầy đủ để khách sử dụng.

// Khai báo lớp JourneyController.
export class JourneyController {
  // Khai báo state, kiểu JourneyState. | Gán thuộc tính places: tạo mảng []. | Gán thuộc tính ready: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính status: chuỗi 'idle'. | Gán thuộc tính changed: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gps: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  private state: JourneyState = { places: [], ready: false, status: 'idle', changed: false, gps: false }
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
  // Khai báo listeners.
  private listeners = new Set<() => void>()
  // CHỨC NĂNG: Nguồn audio thật hiện tại; giữ lại khi pause để resume đúng thời điểm.
  // Khai báo track không bắt buộc, kiểu Track.
  private track?: Track
  // CHỨC NĂNG: Hàm gỡ nghe sự kiện audio khi đổi hoặc đóng nguồn.
  // Khai báo unlisten không bắt buộc, kiểu () => void.
  private unlisten?: () => void
  // CHỨC NĂNG: Hàm gỡ theo dõi GPS khi tắt vị trí hoặc đóng controller.
  // Khai báo unwatch không bắt buộc, kiểu () => void.
  private unwatch?: () => void
  // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
  // Khai báo generation.
  private generation = 0
  // CHỨC NĂNG: Dấu phiên vòng đời; loại kết quả trả về sau khi controller đã khởi động lại/đóng.
  // Khai báo lifecycle.
  private lifecycle = 0
  // CHỨC NĂNG: Dấu phiên theo dõi GPS để bỏ kết quả của lần đăng ký cũ.
  // Khai báo gpsGeneration.
  private gpsGeneration = 0
  // Khai báo intent không bắt buộc, kiểu { id: string; language: Language; autoplay: boolean }. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác. | Khai báo autoplay, kiểu boolean.
  private intent?: { id: string; language: Language; autoplay: boolean }
  // CHỨC NĂNG: Hàng đợi lưu tiến độ; giữ đúng thứ tự các lần ghi bất đồng bộ.
  // Khai báo writes, kiểu Promise<void>.
  private writes: Promise<void> = Promise.resolve()
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `private lastPersist = 0`: Khai báo lastPersist.
   * DÒNG `constructor(public readonly ports: JourneyPorts) {}`: Khai báo lớp JourneyController.
   */
  private lastPersist = 0
  constructor(public readonly ports: JourneyPorts) {}
  // Khai báo snapshot.
  snapshot = () => this.state
  // Khai báo subscribe. | Thực hiện Gọi this.listeners.add(listener). | Trả kết quả: khai báo callback () => { this.listeners.delete(listener) }. | Thực hiện Gọi this.listeners.delete(listener).
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  // CHỨC NĂNG: Cập nhật trạng thái controller và báo cho UI.
  // XỬ LÝ: Ghép phần thay đổi với trạng thái cũ rồi thông báo các callback đã đăng ký.
  // Khai báo set(next). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.state = { ...this.state, ...next }. | Thực hiện Gọi this.listeners.forEach(l => l()).
  private set(next: Partial<JourneyState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(l => l()) }
  // TẠI SAO (set): UI cần được thông báo sau khi trạng thái controller đổi; chỉ sửa biến riêng sẽ
  // không tự render lại React.

  // CHỨC NĂNG: Nạp danh mục và bản lưu độc lập.
  // XỬ LÝ: Bộ nhớ bị chặn vẫn giữ danh sách; bản ghi đổi phiên bản chỉ hiện lời nhắc.
  // Khai báo start(). Nhận đầu vào qua tham số.
  async start() {
    // Khai báo life: sử dụng ++this.lifecycle làm giá trị của bước hiện tại.
    const life = ++this.lifecycle
    // Bắt đầu vùng try.
    try {
      // Khai báo readFailed: sử dụng false làm giá trị của bước hiện tại.
      let readFailed = false
      // Khai báo [places, raw]: await chờ Gọi Promise.all([this.ports.catalog.list(), this.ports.read().catch(() => { readFailed = true. | Thực hiện tính biểu thức readFailed = true. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
      const [places, raw] = await Promise.all([this.ports.catalog.list(), this.ports.read().catch(() => { readFailed = true; return null })])
      // Rẽ nhánh nếu life !== this.lifecycle. | Thoát hàm hiện tại ngay.
      if (life !== this.lifecycle) return
      // Khai báo saved: Gọi parseSaved(raw).
      const saved = parseSaved(raw)
      // Khai báo valid: không có giá trị khởi tạo.
      let valid: Saved | undefined
      // Khai báo changed: sử dụng false làm giá trị của bước hiện tại.
      let changed = false
      // Rẽ nhánh nếu saved.
      if (saved) {
        // Khai báo text: publishedText lấy bản đã công bố đúng ngôn ngữ. | Gán thuộc tính content: tạo object gồm.
        const text = publishedText(places.find(p => p.id === saved.placeId) ?? { content: {} } as PlaceRecord, saved.language)
        // Khai báo audio: đọc text?.audio từ đối tượng/mảng để dùng tại bước hiện tại.
        const audio = text?.audio
        // Rẽ nhánh nếu audio?.status === 'published' && audio.approvedAt && audio.publishedAt.
        if (audio?.status === 'published' && audio.approvedAt && audio.publishedAt) {
          // Thực hiện tính biểu thức valid = saved.
          valid = saved
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.`: Thực hiện tính biểu thức changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.versi.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.version !== saved.audioVersion
        }
      }
      // Thực hiện Gọi this.set({ places, ready: true, restore: valid, changed, error: readFailed ? 'saveFailed'. | Đặt trường places bằng giá trị của biến cùng tên. | Gán thuộc tính ready: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính restore: sử dụng valid làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường changed bằng giá trị của biến cùng tên.
      this.set({ places, ready: true, restore: valid, changed,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `error: readFailed ? 'saveFailed' : raw && !valid ? 'savedInvalid' : undefined })`: Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện readFailed.
         * DÒNG `} catch { if (life === this.lifecycle) this.set({ ready: true, error: 'loadError' }) `: Bắt đầu vùng try. | Rẽ nhánh nếu life === this.lifecycle. | Thực hiện Gọi this.set({ ready: true, error: 'loadError' }). | Gán thuộc tính ready: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: chuỗi 'loadError'.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        error: readFailed ? 'saveFailed' : raw && !valid ? 'savedInvalid' : undefined })
    } catch { if (life === this.lifecycle) this.set({ ready: true, error: 'loadError' }) }
  }
  // TẠI SAO (start): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
  // liệu.

  // CHỨC NĂNG: Refresh danh mục sau công bố, không dừng nguồn audio đang nghe.
  // Khai báo refreshCatalog(). Nạp lại danh mục và cập nhật trạng thái.
  async refreshCatalog() {
    // Khai báo life: đọc this.lifecycle từ đối tượng/mảng để dùng tại bước hiện tại.
    const life = this.lifecycle
    // Bắt đầu vùng try.
    try {
      // Khai báo places: await chờ Gọi this.ports.catalog.list().
      const places = await this.ports.catalog.list()
      // CHỨC NĂNG: API phục hồi thì gỡ lỗi tải cũ, tránh player lỗi dù danh sách đã có.
      // XỬ LÝ: Chỉ gỡ loadError; giữ lỗi audio/GPS/bộ nhớ và phiên đang nghe.
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (life === this.lifecycle) this.set({ places, error: this.state.error === 'loadErro`: Rẽ nhánh nếu life === this.lifecycle. | Thực hiện Gọi this.set({ places, error: this.state.error === 'loadError' ? undefined : this.state.error. | Đặt trường places bằng giá trị của biến cùng tên. | Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện this.state.error === 'loadError'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `catch { if (life === this.lifecycle) this.set({ error: 'loadError' }) }`: Bắt đầu vùng try. | Rẽ nhánh nếu life === this.lifecycle. | Thực hiện Gọi this.set({ error: 'loadError' }). | Gán thuộc tính error: chuỗi 'loadError'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (life === this.lifecycle) this.set({ places, error: this.state.error === 'loadError' ? undefined : this.state.error })
    }
    catch { if (life === this.lifecycle) this.set({ error: 'loadError' }) }
  }
  // TẠI SAO (refreshCatalog): API có thể phục hồi hoặc nội dung được công bố mới trong lúc khách
  // đang nghe; cần cập nhật mà không tự phát bài.
  // CHỨC NĂNG: Ghi tuần tự để phản hồi ghi cũ không đè tiến độ mới.
  // XỬ LÝ: Lỗi lưu không dừng âm thanh; UI thông báo vẫn dùng được trong phiên.
  // Khai báo persist(clear, quiet). Nhận đầu vào qua tham số.
  private persist(clear = false, quiet = false) {
    // Khai báo s: đọc this.state.session từ đối tượng/mảng để dùng tại bước hiện tại.
    const s = this.state.session
    // Rẽ nhánh nếu !s && !clear. | Thoát hàm hiện tại ngay.
    if (!s && !clear) return
    // Khai báo value: chọn giữa hai giá trị theo điều kiện clear.
    const value = clear ? null : JSON.stringify(s)
    // CHỨC NĂNG: Số thứ tự tác vụ; kết quả của lần cũ không được cập nhật sau khi đổi/đóng nguồn.
    // Khai báo generation: đọc this.generation từ đối tượng/mảng để dùng tại bước hiện tại.
    const generation = this.generation
    // Thực hiện tính biểu thức this.writes = this.writes.then(() => this.ports.write(value)).catch(() => { // CHỨC NĂNG:.
    this.writes = this.writes.then(() => this.ports.write(value)).catch(() => {
      // CHỨC NĂNG: Lỗi ghi của bài cũ không được mở lại player người dùng vừa đóng.
      // XỬ LÝ: Đối chiếu generation; close xóa checkpoint theo chế độ quiet.
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (!quiet && generation === this.generation) this.set({ error: 'saveFailed' })`: Rẽ nhánh nếu !quiet && generation === this.generation. | Thực hiện Gọi this.set({ error: 'saveFailed' }). | Gán thuộc tính error: chuỗi 'saveFailed'.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (!quiet && generation === this.generation) this.set({ error: 'saveFailed' })
    })
  }
  // TẠI SAO (persist): Ghi tiến độ theo thứ tự tránh bản lưu cũ hoàn tất sau cùng và ghi đè vị trí
  // nghe mới hơn.
  // CHỨC NĂNG: Dừng và giải phóng nguồn audio hiện tại.
  // XỬ LÝ: Gỡ listener của nguồn cũ trước khi thay nguồn để phản hồi cũ không ghi đè phiên mới.
  // Khai báo stopTrack(). Nhận đầu vào qua tham số. | Thực hiện Gọi this.unlisten?.(). | Thực hiện tính biểu thức this.unlisten = undefined. | Thực hiện this.track?.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện this.track?.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thực hiện tính biểu thức this.track = undefined.
  private stopTrack() { this.unlisten?.(); this.unlisten = undefined; this.track?.pause(); this.track?.dispose(); this.track = undefined }
  // TẠI SAO (stopTrack): Nguồn cũ và listener cũ phải được đóng trước khi chuyển bài để tránh âm
  // thanh/sự kiện đè lên bài mới.

  // CHỨC NĂNG: Tải và phát một nguồn đã công bố.
  // XỬ LÝ: Mỗi lần gọi tăng generation; phản hồi cũ đến muộn chỉ được giải phóng.
  // Khai báo play(id, language, position, autoplay, rate). Nhận đầu vào qua tham số.
  async play(id: string, language: Language, position = 0, autoplay = true, rate = 1) {
    // Khai báo request: sử dụng ++this.generation làm giá trị của bước hiện tại.
    const request = ++this.generation
    // Thực hiện tính biểu thức this.intent = { id, language, autoplay }. | Đặt trường id bằng giá trị của biến cùng tên. | Đặt trường language bằng giá trị của biến cùng tên. | Đặt trường autoplay bằng giá trị của biến cùng tên.
    this.intent = { id, language, autoplay }
    // Thực hiện Gọi this.persist().
    this.persist()
    // Thực hiện Gọi this.stopTrack().
    this.stopTrack()
    // Thực hiện Gọi this.set({ status: 'loading', session: undefined, error: undefined, restore: undefined }). | Gán thuộc tính status: chuỗi 'loading'. | Gán thuộc tính session: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính restore: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    this.set({ status: 'loading', session: undefined, error: undefined, restore: undefined })
    // Khai báo next: không có giá trị khởi tạo.
    let next: Track | undefined
    // Bắt đầu vùng try.
    try {
      // Khai báo place: await chờ this.ports.catalog.get đọc theo khóa.
      const place = await this.ports.catalog.get(id)
      // Rẽ nhánh nếu request !== this.generation. | Thoát hàm hiện tại ngay.
      if (request !== this.generation) return
      // Khai báo text: publishedText lấy bản đã công bố đúng ngôn ngữ.
      const text = publishedText(place, language)
      // Khai báo audio: đọc text?.audio từ đối tượng/mảng để dùng tại bước hiện tại.
      const audio = text?.audio
      // Rẽ nhánh nếu !audio || audio.status !== 'published' || !audio.approvedAt || !audio.publishedAt. | Ném new Error('audioMissing').
      if (!audio || audio.status !== 'published' || !audio.approvedAt || !audio.publishedAt) throw new Error('audioMissing')
      // Thực hiện tính biểu thức next = await this.ports.open(audio.url, text.title).
      next = await this.ports.open(audio.url, text.title)
      // Rẽ nhánh nếu request !== this.generation. | Thực hiện next.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thoát hàm hiện tại ngay.
      if (request !== this.generation) { next.dispose(); return }
      // Rẽ nhánh nếu !Number.isFinite(next.duration) || next.duration <= 0. | Ném new Error('audioFailed').
      if (!Number.isFinite(next.duration) || next.duration <= 0) throw new Error('audioFailed')
      // Thực hiện tính biểu thức this.track = next.
      this.track = next
      // Khai báo session: tạo object gồm placeId, language, title, textVersion, audioId, audioVersion, duration, position, rate. | Gán thuộc tính placeId: sử dụng id làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường language bằng giá trị của biến cùng tên. | Gán thuộc tính title: đọc text.title từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính textVersion: đọc text.version từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      const session: Session = { placeId: id, language, title: text.title, textVersion: text.version,
        // Gán thuộc tính audioId: đọc audio.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính audioVersion: đọc audio.version từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính duration: đọc next.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
        audioId: audio.id, audioVersion: audio.version, duration: next.duration,
        // Gán thuộc tính position: Gọi clampTime(position, next.duration). | Đặt trường rate bằng giá trị của biến cùng tên.
        position: clampTime(position, next.duration), rate }
      // Thực hiện await chờ next.seek yêu cầu chuyển thời điểm phát.
      await next.seek(session.position)
      // Rẽ nhánh nếu request !== this.generation. | Thoát hàm hiện tại ngay.
      if (request !== this.generation) return
      // Thực hiện Gọi next.rate(rate).
      next.rate(rate)
      // Thực hiện Gọi this.set({ session, status: 'paused' }). | Đặt trường session bằng giá trị của biến cùng tên. | Gán thuộc tính status: chuỗi 'paused'.
      this.set({ session, status: 'paused' })
      // Thực hiện tính biểu thức this.unlisten = next.listen(status => { if (request !== this.generation || !this.state.ses.
      this.unlisten = next.listen(status => {
        // Rẽ nhánh nếu request !== this.generation || !this.state.session. | Thoát hàm hiện tại ngay.
        if (request !== this.generation || !this.state.session) return
        // Rẽ nhánh nếu status.error. | Thực hiện Gọi this.persist(). | Thực hiện Gọi this.stopTrack(). | Thực hiện Gọi this.set({ status: 'error', error: 'audioFailed' }). | Gán thuộc tính status: chuỗi 'error'. | Gán thuộc tính error: chuỗi 'audioFailed'. | Thoát hàm hiện tại ngay.
        if (status.error) { this.persist(); this.stopTrack(); this.set({ status: 'error', error: 'audioFailed' }); return }
        // Thực hiện Gọi this.set({ session: { ...this.state.session, position: clampTime(status.position, status.d. | Gán thuộc tính session: tạo object gồm ...giá trị ghép, position, duration. | Gán thuộc tính position: Gọi clampTime(status.position, status.duration). | Gán thuộc tính duration: đọc status.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
        this.set({ session: { ...this.state.session, position: clampTime(status.position, status.duration), duration: status.duration },
          // Gán thuộc tính status: chọn giữa hai giá trị theo điều kiện status.ended.
          status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (status.ended) this.persist(true)`: Rẽ nhánh nếu status.ended. | Thực hiện Gọi this.persist(true).
         * DÒNG `else if (Date.now() - this.lastPersist > 5000) { this.lastPersist = Date.now(); this.`: Rẽ nhánh nếu status.ended. | Rẽ nhánh nếu Date.now() - this.lastPersist > 5000. | Thực hiện tính biểu thức this.lastPersist = Date.now(). | Thực hiện Gọi this.persist().
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        if (status.ended) this.persist(true)
        else if (Date.now() - this.lastPersist > 5000) { this.lastPersist = Date.now(); this.persist() }
      })
      // Rẽ nhánh nếu autoplay. | Thực hiện await chờ Gọi next.play(). | Rẽ nhánh nếu request === this.generation && this.intent?.autoplay. | Thực hiện Gọi this.set({ status: 'playing' }). | Gán thuộc tính status: chuỗi 'playing'.
      if (autoplay) { await next.play(); if (request === this.generation && this.intent?.autoplay) this.set({ status: 'playing' }) }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `this.persist()`: Thực hiện Gọi this.persist().
       * DÒNG `} catch (error) {`: Bắt đầu vùng try.
       */
      this.persist()
    } catch (error) {
      // Rẽ nhánh nếu request !== this.generation. | Thực hiện next?.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thoát hàm hiện tại ngay.
      if (request !== this.generation) { next?.dispose(); return }
      // CHỨC NĂNG: Pause ngay sau Play là thao tác bình thường, không phải lỗi nguồn.
      // XỬ LÝ: HTML Audio có thể hủy Promise play bằng AbortError khi pause đến trước.
      // Rẽ nhánh nếu error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay && next === this.track. | Thực hiện Gọi this.persist(). | Thoát hàm hiện tại ngay.
      if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay && next === this.track) { this.persist(); return }
      // Rẽ nhánh nếu next && next !== this.track. | Thực hiện next.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
      if (next && next !== this.track) next.dispose()
      // Thực hiện Gọi this.stopTrack().
      this.stopTrack()
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `this.set({ status: 'error', error: error instanceof Error && error.message === 'audio`: Thực hiện Gọi this.set({ status: 'error', error: error instanceof Error && error.message === 'audioMissi. | Gán thuộc tính status: chuỗi 'error'. | Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện error instanceof Error && error.message === 'audioMissing'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      this.set({ status: 'error', error: error instanceof Error && error.message === 'audioMissing' ? 'audioMissing' : 'audioFailed' })
    }
  }
  // TẠI SAO (play): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.

  // CHỨC NĂNG: Dừng và đóng hoàn toàn trình nghe khi nhấn × trên web/native.
  // XỬ LÝ: generation vô hiệu hóa tải/Promise cũ; gỡ listener trước khi pause/dispose.
  // Xóa phiên và checkpoint để đổi ngôn ngữ/retry không tự mở lại bài đã đóng.
  // Danh mục, tuyến và GPS giữ nguyên vì đóng trình nghe không phải thoát ứng dụng.
  // Khai báo close(). Nhận đầu vào qua tham số.
  close() {
    // Thực hiện sử dụng this.generation++ làm giá trị của bước hiện tại.
    this.generation++
    // Thực hiện tính biểu thức this.intent = undefined.
    this.intent = undefined
    // Thực hiện Gọi this.stopTrack().
    this.stopTrack()
    // Thực hiện Gọi this.set({ status: 'idle', session: undefined, restore: undefined, changed: false, error:. | Gán thuộc tính status: chuỗi 'idle'. | Gán thuộc tính session: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính restore: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính changed: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    this.set({ status: 'idle', session: undefined, restore: undefined, changed: false, error: undefined })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `this.persist(true, true)`: Thực hiện Gọi this.persist(true, true).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    this.persist(true, true)
  }
  // TẠI SAO (close): Bấm đóng phải dừng cả ý định phát đang chờ, không chỉ ẩn giao diện rồi để
  // audio tải xong tự phát.

  // CHỨC NĂNG: Tạm dừng, tiếp tục, tua và tốc độ tác động trực tiếp lên Track thật.
  // XỬ LÝ: Chỉ cập nhật trạng thái khi nguồn hiện tại vẫn là nguồn đã thao tác.
  // Khai báo pause(). Nhận đầu vào qua tham số. | Rẽ nhánh nếu !this.track. | Thoát hàm hiện tại ngay. | Rẽ nhánh nếu this.intent. | Thực hiện tính biểu thức this.intent.autoplay = false. | Thực hiện this.track.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện Gọi this.set({ status: 'paused' }). | Gán thuộc tính status: chuỗi 'paused'. | Thực hiện Gọi this.persist().
  pause() { if (!this.track) return; if (this.intent) this.intent.autoplay = false; this.track.pause(); this.set({ status: 'paused' }); this.persist() }
  // TẠI SAO (pause): Giữ track khi dừng giúp tiếp tục đúng thời điểm, đồng thời không phát sinh
  // thêm nguồn âm thanh.
  // CHỨC NĂNG: Tiếp tục nguồn đang tạm dừng.
  // XỬ LÝ: Giữ vị trí của track hiện tại, không mở bài như một yêu cầu nghe mới.
  // Khai báo resume(). Nhận đầu vào qua tham số.
  async resume() {
    // Khai báo t: đọc this.track từ đối tượng/mảng để dùng tại bước hiện tại.
    const t = this.track
    // Rẽ nhánh nếu !t. | Thoát hàm hiện tại ngay.
    if (!t) return
    // Rẽ nhánh nếu this.intent. | Thực hiện tính biểu thức this.intent.autoplay = true.
    if (this.intent) this.intent.autoplay = true
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `try { await t.play(); if (t === this.track && this.intent?.autoplay) this.set({ statu`: Bắt đầu vùng try. | Thực hiện await chờ Gọi t.play(). | Rẽ nhánh nếu t === this.track && this.intent?.autoplay. | Thực hiện Gọi this.set({ status: 'playing', error: undefined }). | Gán thuộc tính status: chuỗi 'playing'. | Gán thuộc tính error: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `catch (error) { if (error instanceof Error && error.name === 'AbortError' && !this.in`: Bắt đầu vùng try. | Rẽ nhánh nếu error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay. | Thoát hàm hiện tại ngay. | Rẽ nhánh nếu t === this.track. | Thực hiện Gọi this.set({ status: 'error', error: 'audioFailed' }). | Gán thuộc tính status: chuỗi 'error'. | Gán thuộc tính error: chuỗi 'audioFailed'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    try { await t.play(); if (t === this.track && this.intent?.autoplay) this.set({ status: 'playing', error: undefined }) }
    catch (error) { if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay) return; if (t === this.track) this.set({ status: 'error', error: 'audioFailed' }) }
  }
  // TẠI SAO (resume): Tạm dừng là giữ lại vị trí hiện tại; mở URL như bài mới sẽ làm khách phải
  // nghe lại từ đầu.
  // CHỨC NĂNG: Tua đến thời điểm hợp lệ trong bản thu.
  // XỬ LÝ: Giới hạn theo thời lượng và giữ trạng thái tạm dừng nếu trước đó chưa phát.
  // Khai báo seek(value). Nhận đầu vào qua tham số.
  async seek(value: number) {
    // Khai báo t: đọc this.track từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo s: đọc this.state.session từ đối tượng/mảng để dùng tại bước hiện tại.
    const t = this.track, s = this.state.session
    // Rẽ nhánh nếu !t || !s || this.state.status === 'loading'. | Thoát hàm hiện tại ngay.
    if (!t || !s || this.state.status === 'loading') return
    // Bắt đầu vùng try. | Khai báo position: Gọi clampTime(value, s.duration). | Thực hiện await chờ t.seek yêu cầu chuyển thời điểm phát.
    try { const position = clampTime(value, s.duration); await t.seek(position)
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (t === this.track && this.state.session) { this.set({ session: { ...this.state.ses`: Rẽ nhánh nếu t === this.track && this.state.session. | Thực hiện Gọi this.set({ session: { ...this.state.session, position } }). | Gán thuộc tính session: tạo object gồm ...giá trị ghép, position. | Đặt trường position bằng giá trị của biến cùng tên. | Thực hiện Gọi this.persist().
       * DÒNG `} catch { if (t === this.track) this.set({ error: 'audioFailed' }) }`: Bắt đầu vùng try. | Rẽ nhánh nếu t === this.track. | Thực hiện Gọi this.set({ error: 'audioFailed' }). | Gán thuộc tính error: chuỗi 'audioFailed'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (t === this.track && this.state.session) { this.set({ session: { ...this.state.session, position } }); this.persist() }
    } catch { if (t === this.track) this.set({ error: 'audioFailed' }) }
  }
  // TẠI SAO (seek): Thời điểm phải nằm trong bản thu; thao tác tua khi đang pause không được vô
  // tình bật phát.
  // CHỨC NĂNG: Đổi tốc độ phát bài nghe.
  // XỬ LÝ: Kiểm tra mức tốc độ và chỉ cập nhật trạng thái sau khi adapter áp dụng được.
  // Khai báo rate(value). Nhận đầu vào qua tham số.
  rate(value: number) {
    // Rẽ nhánh nếu !this.track || !this.state.session || ![0.75, 1, 1.25, 1.5, 2].includes(value). | Thoát hàm hiện tại ngay.
    if (!this.track || !this.state.session || ![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `try { this.track.rate(value); this.set({ session: { ...this.state.session, rate: valu`: Bắt đầu vùng try. | Thực hiện Gọi this.track.rate(value). | Thực hiện Gọi this.set({ session: { ...this.state.session, rate: value } }). | Gán thuộc tính session: tạo object gồm ...giá trị ghép, rate. | Gán thuộc tính rate: sử dụng value làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thực hiện Gọi this.persist().
     * DÒNG `catch { this.set({ error: 'audioFailed' }) }`: Bắt đầu vùng try. | Thực hiện Gọi this.set({ error: 'audioFailed' }). | Gán thuộc tính error: chuỗi 'audioFailed'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    try { this.track.rate(value); this.set({ session: { ...this.state.session, rate: value } }); this.persist() }
    catch { this.set({ error: 'audioFailed' }) }
  }
  // TẠI SAO (rate): Tốc độ hiển thị cần khớp tốc độ thật, kể cả khi adapter báo không áp dụng
  // được.
  // CHỨC NĂNG: Đổi cả bài đọc và audio theo ngôn ngữ chung UC08.
  // XỬ LÝ: Đang nghe thì phát bản mới từ 0; đang tạm dừng vẫn tạm dừng từ 0.
  // Khai báo changeLanguage(language). Nhận đầu vào qua tham số.
  changeLanguage(language: Language) {
    // Khai báo active: đọc this.intent từ đối tượng/mảng để dùng tại bước hiện tại.
    const active = this.intent
    // Rẽ nhánh nếu !active || active.language === language. | Thoát hàm hiện tại ngay.
    if (!active || active.language === language) return
    // Khai báo autoplay: tính biểu thức this.state.status === 'playing' || (this.state.status === 'loading' && active.autoplay).
    const autoplay = this.state.status === 'playing' || (this.state.status === 'loading' && active.autoplay)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1)`: Thực hiện sử dụng void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1) làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1)
  }
  // TẠI SAO (changeLanguage): Đổi tiếng phải dùng văn bản và audio của cùng ngôn ngữ; không đọc
  // bài cũ bằng một lựa chọn tiếng mới.
  // CHỨC NĂNG: Bỏ đề nghị khôi phục bài nghe trước.
  // XỬ LÝ: Không tự phát bài cũ khi người dùng đã chọn bỏ qua.
  // Khai báo dismissRestore(). Nhận đầu vào qua tham số. | Thực hiện Gọi this.set({ restore: undefined, changed: false }). | Gán thuộc tính restore: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính changed: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thực hiện Gọi this.persist(true).
  dismissRestore() { this.set({ restore: undefined, changed: false }); this.persist(true) }
  // TẠI SAO (dismissRestore): Khôi phục bài nghe phải theo lựa chọn của khách, không tự chạy lại
  // bài cũ ngoài ý muốn.
  // CHỨC NĂNG: Tiếp tục bài từ bản lưu hợp lệ.
  // XỬ LÝ: Kiểm tra nội dung/audio còn khớp phiên bản trước khi sử dụng thời điểm đã lưu.
  // Khai báo restorePlay(). Nhận đầu vào qua tham số. | Khai báo s: đọc this.state.restore từ đối tượng/mảng để dùng tại bước hiện tại. | Rẽ nhánh nếu s. | Thực hiện await chờ Gọi this.play(s.placeId, s.language, this.state.changed ? 0 : s.position, true, s.rate).
  async restorePlay() { const s = this.state.restore; if (s) await this.play(s.placeId, s.language, this.state.changed ? 0 : s.position, true, s.rate) }
  // TẠI SAO (restorePlay): Mốc thời gian của audio cũ có thể không phù hợp với bản mới; cần đối
  // chiếu phiên bản trước khi tiếp tục.
  // CHỨC NĂNG: Chọn tuyến tham quan hiện tại.
  // XỬ LÝ: Kiểm tra tuyến còn sử dụng được với danh mục công bố trước khi áp dụng.
  // Khai báo selectRoute(id). Nhận đầu vào qua tham số.
  selectRoute(id?: string) {
    // Khai báo route: this.ports.routes.find lấy phần tử đầu tiên phù hợp.
    const route = this.ports.routes.find(r => r.id === id)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefine`: Thực hiện Gọi this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefined }). | Gán thuộc tính routeId: chọn giữa hai giá trị theo điều kiện route && routeAvailable(route, this.state.places).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefined })
  }
  // TẠI SAO (selectRoute): Chọn tuyến không hợp lệ sẽ đưa khách đến các điểm không còn trong danh
  // mục.

  // CHỨC NĂNG: GPS chỉ đổi gợi ý, không gọi play.
  // XỬ LÝ: Đang phát/đang tải/đã kết thúc hoặc đang chờ khôi phục thì giữ màn.
  // Khai báo acceptFix(fix). Nhận đầu vào qua tham số.
  acceptFix(fix: Fix) {
    // Khai báo weak: tính biểu thức !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || !Number.isFinite(fix.timestamp) || f.
    const weak = !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || !Number.isFinite(fix.timestamp) || fix.accuracy > 60 || Math.abs(Date.now() - fix.timestamp) > 30000 || !validPoint(fix)
    // Khai báo prior: đọc this.state.error từ đối tượng/mảng để dùng tại bước hiện tại.
    const prior = this.state.error
    // Thực hiện Gọi this.set({ fix: weak ? undefined : fix, error: weak ? 'gpsWeak' : prior === 'gpsWeak' || p. | Gán thuộc tính fix: chọn giữa hai giá trị theo điều kiện weak. | Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện weak.
    this.set({ fix: weak ? undefined : fix, error: weak ? 'gpsWeak' : prior === 'gpsWeak' || prior === 'gpsFailed' ? undefined : prior })
    // Rẽ nhánh nếu weak || !['idle', 'paused', 'error'].includes(this.state.status) || this.state.restore. | Thoát hàm hiện tại ngay.
    if (weak || !['idle', 'paused', 'error'].includes(this.state.status) || this.state.restore) return
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.st`: Thực hiện Gọi this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.state.s. | Gán thuộc tính suggestedId: Gọi nearest(this.state.places, this.ports.positions, fix, this.state.suggestedId).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.state.suggestedId) })
  }
  // TẠI SAO (acceptFix): Mỗi tín hiệu GPS mới cần được xét chất lượng và cập nhật gợi ý; có gợi ý
  // không có nghĩa tự phát audio.
  // CHỨC NĂNG: Bật hoặc tắt theo dõi vị trí.
  // XỬ LÝ: Gỡ đăng ký cũ và bỏ phản hồi đến muộn khi người dùng đã tắt GPS.
  // Khai báo gps(enabled). Nhận đầu vào qua tham số.
  async gps(enabled: boolean) {
    // Khai báo request: sử dụng ++this.gpsGeneration làm giá trị của bước hiện tại.
    const request = ++this.gpsGeneration
    // Thực hiện Gọi this.unwatch?.(). | Thực hiện tính biểu thức this.unwatch = undefined.
    this.unwatch?.(); this.unwatch = undefined
    // Thực hiện Gọi this.set({ gps: enabled, error: undefined }). | Gán thuộc tính gps: sử dụng enabled làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    this.set({ gps: enabled, error: undefined })
    // Rẽ nhánh nếu !enabled. | Thoát hàm hiện tại ngay.
    if (!enabled) return
    // Bắt đầu vùng try.
    try {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `const stop = await this.ports.watch(fix => { if (request === this.gpsGeneration) this`: Khai báo stop: await chờ Gọi this.ports.watch(fix => { if (request === this.gpsGeneration) this.acceptFix(fix) }, () =>. | Rẽ nhánh nếu request === this.gpsGeneration. | Thực hiện Gọi this.acceptFix(fix).
       * DÒNG `() => { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed'`: Khai báo stop: await chờ Gọi this.ports.watch(fix => { if (request === this.gpsGeneration) this.acceptFix(fix) }, () =>. | Rẽ nhánh nếu request === this.gpsGeneration. | Thực hiện Gọi this.set({ gps: false, error: 'gpsFailed' }). | Gán thuộc tính gps: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: chuỗi 'gpsFailed'.
       */
      const stop = await this.ports.watch(fix => { if (request === this.gpsGeneration) this.acceptFix(fix) },
        () => { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) })
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (request !== this.gpsGeneration) stop(); else this.unwatch = stop`: Rẽ nhánh nếu request !== this.gpsGeneration. | Thực hiện Gọi stop(). | Thực hiện tính biểu thức this.unwatch = stop.
       * DÒNG `} catch { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFaile`: Bắt đầu vùng try. | Rẽ nhánh nếu request === this.gpsGeneration. | Thực hiện Gọi this.set({ gps: false, error: 'gpsFailed' }). | Gán thuộc tính gps: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: chuỗi 'gpsFailed'.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (request !== this.gpsGeneration) stop(); else this.unwatch = stop
    } catch { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) }
  }
  // TẠI SAO (gps): Khách có thể đổi quyết định khi yêu cầu vị trí còn đang chờ; cần bỏ kết quả của
  // lần đăng ký cũ.
  // CHỨC NĂNG: Chốt tiến độ khi web/app ra nền, không dừng bài đang nghe.
  // Khai báo checkpoint(). Nhận đầu vào qua tham số. | Thực hiện Gọi this.persist(this.state.status === 'ended').
  checkpoint() { this.persist(this.state.status === 'ended') }
  // TẠI SAO (checkpoint): Cần lưu gần lúc app đổi trạng thái để việc quay lại có tiến độ gần nhất
  // thay vì chỉ dựa vào lúc đóng trang.
  // Khai báo retry(). Nhận đầu vào qua tham số. | Rẽ nhánh nếu this.state.error === 'loadError'. | Thực hiện sử dụng void this.start() làm giá trị của bước hiện tại. | Thoát hàm hiện tại ngay. | Khai báo i: đọc this.intent từ đối tượng/mảng để dùng tại bước hiện tại. | Rẽ nhánh nếu i. | Thực hiện sử dụng void this.play(i.id, i.language) làm giá trị của bước hiện tại.
  retry() { if (this.state.error === 'loadError') { void this.start(); return } const i = this.intent; if (i) void this.play(i.id, i.language) }
  // TẠI SAO (retry): Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng một
  // nghiệp vụ.
  // CHỨC NĂNG: Dọn controller khi nơi sở hữu kết thúc.
  // XỬ LÝ: Dừng nguồn/timer/listener liên quan để không còn xử lý chạy sau khi rời luồng.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `dispose() { this.lifecycle++; this.generation++; this.gpsGeneration++; this.persist(t`: Khai báo dispose(). Nhận đầu vào qua tham số. | Thực hiện sử dụng this.lifecycle++ làm giá trị của bước hiện tại. | Thực hiện sử dụng this.generation++ làm giá trị của bước hiện tại. | Thực hiện sử dụng this.gpsGeneration++ làm giá trị của bước hiện tại. | Thực hiện Gọi this.persist(this.state.status === 'ended'). | Thực hiện Gọi this.unwatch?.(). | Thực hiện tính biểu thức this.unwatch = undefined. | Thực hiện Gọi this.stopTrack().
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  dispose() { this.lifecycle++; this.generation++; this.gpsGeneration++; this.persist(this.state.status === 'ended'); this.unwatch?.(); this.unwatch = undefined; this.stopTrack() }
  // TẠI SAO (dispose): Timer, GPS và audio có vòng đời riêng; không dọn sẽ tiếp tục hoạt động khi
  // component sở hữu đã rời.
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm test; kiểm tra chỉ có một nguồn đang nghe.
 * - Đổi ngôn ngữ lúc tải chậm: nguồn cũ không được phát muộn.
 */
