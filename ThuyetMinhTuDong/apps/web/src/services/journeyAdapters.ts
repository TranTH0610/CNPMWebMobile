/**
 * FILE NÀY LÀM GÌ
 * Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML
 * Audio/Geolocation/localStorage.
 *
 * VỊ TRÍ: apps/web/src/services/journeyAdapters.ts
 * DÙNG BỞI: apps/web/src/main-admin.tsx; apps/web/src/main.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; @travelguide/visitor-core/journey/react;
 * ./narrationSource; @travelguide/visitor-core/journey
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { playbackCoordinator } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core/journey/react'.
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
// Nhập các thành phần từ './narrationSource'.
import { narrationSource } from './narrationSource'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core/journey'.
import type { Track } from '@travelguide/visitor-core/journey'

// Khai báo mediaOwner: không có giá trị khởi tạo.
let mediaOwner: HTMLAudioElement | undefined

// Khai báo journeyAdapters: tạo object gồm read, write, watch, open.
export const journeyAdapters: JourneyAdapters = {
  // Gán thuộc tính read: khai báo callback async () => localStorage.getItem('visitor-journey-v1').
  read: async () => localStorage.getItem('visitor-journey-v1'),
  // Gán thuộc tính write: khai báo callback async value => { if (value === null) localStorage.removeItem('visitor-journ. | Rẽ nhánh nếu value === null. | Thực hiện Gọi localStorage.removeItem('visitor-journey-v1'). | Thực hiện Gọi localStorage.setItem('visitor-journey-v1', value).
  write: async value => { if (value === null) localStorage.removeItem('visitor-journey-v1'); else localStorage.setItem('visitor-journey-v1', value) },
  // CHỨC NĂNG: Theo dõi GPS của nền tảng cho hành trình.
  // XỬ LÝ: Kiểm tra quyền/khả năng hỗ trợ và trả hàm gỡ theo dõi để dọn khi rời luồng.
  // Khai báo watch(next, fail). Nhận đầu vào qua tham số.
  async watch(next, fail) {
    // Rẽ nhánh nếu !navigator.geolocation. | Ném new Error('GPS unavailable').
    if (!navigator.geolocation) throw new Error('GPS unavailable')
    // Khai báo id: Gọi navigator.geolocation.watchPosition(p => next({ lat: p.coords.latitude, lng: p.coords.long. | Gán thuộc tính lat: đọc p.coords.latitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính lng: đọc p.coords.longitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    const id = navigator.geolocation.watchPosition(p => next({ lat: p.coords.latitude, lng: p.coords.longitude,
      // Gán thuộc tính accuracy: đọc p.coords.accuracy từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính timestamp: đọc p.timestamp từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính enableHighAccuracy: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính maximumAge: giá trị số 5000. | Gán thuộc tính timeout: giá trị số 15000.
      accuracy: p.coords.accuracy, timestamp: p.timestamp }), fail, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => navigator.geolocation.clearWatch(id)`: Trả kết quả: khai báo callback () => navigator.geolocation.clearWatch(id).
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return () => navigator.geolocation.clearWatch(id)
  },
  // TẠI SAO (watch): GPS là tài nguyên theo dõi liên tục; phải xin quyền và có hàm dọn để không
  // giữ listener khi không còn dùng.
  // CHỨC NĂNG: Mở một nguồn audio thật qua adapter nền tảng.
  // XỬ LÝ: Chờ metadata để có thời lượng, đồng thời trả các thao tác phát/dừng/tua/đóng cho
  // controller.
  // Khai báo open(url, title). Nhận đầu vào qua tham số.
  async open(url, title): Promise<Track> {
    // Khai báo audio: Tạo đối tượng bằng new Audio(narrationSource(url)).
    const audio = new Audio(narrationSource(url))
    // Thực hiện tính biểu thức audio.preload = 'auto'.
    audio.preload = 'auto'
    // Bắt đầu vùng try.
    try {
      // CHỨC NĂNG: Chờ metadata để thời lượng và thanh tua lấy từ file thật.
      // XỬ LÝ: Lỗi nguồn và timeout được trả về controller để cho thử lại.
      // Đăng ký xử lý sự kiện: await new Promise<void>((resolve, reject) => { const done = () => { clearTimeout(timer).
      await new Promise<void>((resolve, reject) => {
        // Khai báo done: khai báo callback () => { clearTimeout(timer). | Dọn đăng ký/timer: clearTimeout(timer). | Dọn đăng ký/timer: audio.removeEventListener('loadedmetadata', ready). | Dọn đăng ký/timer: audio.removeEventListener('error', bad).
        const done = () => { clearTimeout(timer); audio.removeEventListener('loadedmetadata', ready); audio.removeEventListener('error', bad) }
        // TẠI SAO (done): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
        // lớp kết nối này.
        // Khai báo ready: khai báo callback () => { done(). | Thực hiện Gọi done(). | Thực hiện Gọi resolve().
        const ready = () => { done(); resolve() }
        // TẠI SAO (ready): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
        // lớp kết nối này.
        // Khai báo bad: khai báo callback () => { done(). | Thực hiện Gọi done(). | Thực hiện Gọi reject(new Error('Audio unavailable')).
        const bad = () => { done(); reject(new Error('Audio unavailable')) }
        // TẠI SAO (bad): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại lớp
        // kết nối này.
        // Khai báo timer: setTimeout lên lịch tác vụ một lần.
        const timer = setTimeout(bad, 20000)
        // Đăng ký xử lý sự kiện: audio.addEventListener('loadedmetadata', ready).
        audio.addEventListener('loadedmetadata', ready)
        // Đăng ký xử lý sự kiện: audio.addEventListener('error', bad).
        audio.addEventListener('error', bad)
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `audio.load()`: Thực hiện Gọi audio.load().
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `} catch (error) { audio.removeAttribute('src'); audio.load(); throw error }`: Bắt đầu vùng try. | Thực hiện Gọi audio.removeAttribute('src'). | Thực hiện Gọi audio.load(). | Ném error.
         */
        audio.load()
      })
    } catch (error) { audio.removeAttribute('src'); audio.load(); throw error }
    // CHỨC NĂNG: Cờ nguồn/đối tượng đã đóng; ngăn callback đến muộn tiếp tục thao tác.
    // Khai báo disposed: sử dụng false làm giá trị của bước hiện tại.
    let disposed = false
    // Khai báo owner: tạo object gồm pause. | Gán thuộc tính pause: khai báo callback () => audio.pause().
    const owner = { pause: () => audio.pause() }
    // Khai báo track: tạo object gồm duration, play, pause, seek, rate, volume, listen, dispose.
    const track: Track = {
      // Gán thuộc tính duration: đọc audio.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
      duration: audio.duration,
      // Gán thuộc tính play: khai báo callback async () => { if (disposed) throw new Error('Audio closed') playbackCoordin.
      play: async () => {
        // Rẽ nhánh nếu disposed. | Ném new Error('Audio closed').
        if (disposed) throw new Error('Audio closed')
        // Thực hiện playbackCoordinator.claim nhận quyền phát của bộ điều phối.
        playbackCoordinator.claim(owner)
        // Bắt đầu vùng try. | Thực hiện await chờ Gọi audio.play(). | Thực hiện playbackCoordinator.release trả quyền phát nếu nguồn này đang sở hữu, tránh xóa quyền của nguồn mới. | Ném error.
        try { await audio.play() } catch (error) { playbackCoordinator.release(owner); throw error }
        // XỬ LÝ: Một bài khác có thể được bật khi lời gọi play còn đang chờ.
        // Rẽ nhánh nếu disposed || !playbackCoordinator.owns(owner). | Thực hiện audio.pause tạm dừng nguồn âm thanh hiện tại. | Thoát hàm hiện tại ngay.
        if (disposed || !playbackCoordinator.owns(owner)) { audio.pause(); return }
        // Rẽ nhánh nếu 'mediaSession' in navigator.
        if ('mediaSession' in navigator) {
          // Thực hiện tính biểu thức mediaOwner = audio.
          mediaOwner = audio
          // Thực hiện tính biểu thức navigator.mediaSession.metadata = new MediaMetadata({ title }). | Đặt trường title bằng giá trị của biến cùng tên.
          navigator.mediaSession.metadata = new MediaMetadata({ title })
          // Thực hiện Gọi navigator.mediaSession.setActionHandler('play', () => { void track.play().catch(() => audi. | Thực hiện sử dụng void track.play().catch(() => audio.dispatchEvent(new Event('error'))) làm giá trị của bước hiện tại.
          navigator.mediaSession.setActionHandler('play', () => { void track.play().catch(() => audio.dispatchEvent(new Event('error'))) })
          // Thực hiện Gọi navigator.mediaSession.setActionHandler('pause', () => audio.pause()).
          navigator.mediaSession.setActionHandler('pause', () => audio.pause())
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `navigator.mediaSession.setActionHandler('seekto', d => { if (d.seekTime !== undefined`: Thực hiện Gọi navigator.mediaSession.setActionHandler('seekto', d => { if (d.seekTime !== undefined) aud. | Rẽ nhánh nếu d.seekTime !== undefined. | Thực hiện tính biểu thức audio.currentTime = d.seekTime.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          navigator.mediaSession.setActionHandler('seekto', d => { if (d.seekTime !== undefined) audio.currentTime = d.seekTime })
        }
      },
      // Gán thuộc tính pause: khai báo callback () => audio.pause().
      pause: () => audio.pause(),
      // Gán thuộc tính seek: khai báo callback async value => { audio.currentTime = value }. | Thực hiện tính biểu thức audio.currentTime = value.
      seek: async value => { audio.currentTime = value },
      // Gán thuộc tính rate: khai báo callback value => { audio.playbackRate = value }. | Thực hiện tính biểu thức audio.playbackRate = value.
      rate: value => { audio.playbackRate = value },
      // Gán thuộc tính volume: khai báo callback value => { audio.volume = value }. | Thực hiện tính biểu thức audio.volume = value.
      volume: value => { audio.volume = value },
      // Gán thuộc tính listen: khai báo callback callback => { const report = () => callback({ position: audio.currentTime,.
      listen: callback => {
        // Khai báo report: khai báo callback () => callback({ position: audio.currentTime, duration: audio.duration, pla. | Gán thuộc tính position: đọc audio.currentTime từ đối tượng/mảng để dùng tại bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio. | Gán thuộc tính duration: đọc audio.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ. | Gán thuộc tính playing: sử dụng !audio.paused làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính ended: đọc audio.ended từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: Gọi Boolean(audio.error).
        const report = () => callback({ position: audio.currentTime, duration: audio.duration, playing: !audio.paused, ended: audio.ended, error: Boolean(audio.error) })
        // TẠI SAO (report): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
        // lớp kết nối này.
        // Khai báo events: tạo mảng ['timeupdate', 'play', 'pause', 'ended', 'seeked', 'error'].
        const events = ['timeupdate', 'play', 'pause', 'ended', 'seeked', 'error']
        // Đăng ký xử lý sự kiện: events.forEach(event => audio.addEventListener(event, report)).
        events.forEach(event => audio.addEventListener(event, report))
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return () => events.forEach(event => audio.removeEventListener(event, report))`: Trả kết quả: khai báo callback () => events.forEach(event => audio.removeEventListener(event, report)).
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return () => events.forEach(event => audio.removeEventListener(event, report))
      },
      // Gán thuộc tính dispose: khai báo callback () => { if (disposed) return disposed = true.
      dispose: () => {
        // Rẽ nhánh nếu disposed. | Thoát hàm hiện tại ngay.
        if (disposed) return
        // Thực hiện tính biểu thức disposed = true. | Thực hiện playbackCoordinator.release trả quyền phát nếu nguồn này đang sở hữu, tránh xóa quyền của nguồn mới. | Thực hiện audio.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện Gọi audio.removeAttribute('src'). | Thực hiện Gọi audio.load().
        disposed = true; playbackCoordinator.release(owner); audio.pause(); audio.removeAttribute('src'); audio.load()
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if ('mediaSession' in navigator && mediaOwner === audio) for (const action of ['play'`: Rẽ nhánh nếu 'mediaSession' in navigator && mediaOwner === audio. | Duyệt lần lượt ['play', 'pause', 'seekto'] as const bằng const action. | Thực hiện Gọi navigator.mediaSession.setActionHandler(action, null).
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        if ('mediaSession' in navigator && mediaOwner === audio) for (const action of ['play', 'pause', 'seekto'] as const) navigator.mediaSession.setActionHandler(action, null)
      },
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return track`: Trả kết quả: sử dụng track làm giá trị của bước hiện tại.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return track
  },
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
}
