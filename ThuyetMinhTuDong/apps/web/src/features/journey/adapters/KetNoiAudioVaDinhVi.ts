/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage.
 *
 * VỊ TRÍ: apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/main-admin.tsx
 * - apps/web/src/main.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 * - @travelguide/visitor-core/journey/react
 * - ./NguonAmThanh
 * - @travelguide/visitor-core/journey
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { playbackCoordinator } from '@travelguide/visitor-core'
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import { narrationSource } from './NguonAmThanh'
import type { Track } from '@travelguide/visitor-core/journey'

let mediaOwner: HTMLAudioElement | undefined

export const journeyAdapters: JourneyAdapters = {
  read: async () => localStorage.getItem('visitor-journey-v1'),

  write: async (value) => {
    if (value === null) localStorage.removeItem('visitor-journey-v1')
    else localStorage.setItem('visitor-journey-v1', value)
  },
  // CHỨC NĂNG: Theo dõi GPS của nền tảng cho hành trình.
  // XỬ LÝ: Kiểm tra quyền/khả năng hỗ trợ và trả hàm gỡ theo dõi để dọn khi rời luồng.

  async watch(next, fail) {
    if (!navigator.geolocation) throw new Error('GPS unavailable')

    const id = navigator.geolocation.watchPosition(
      (p) =>
        next({
          lat: p.coords.latitude,
          lng: p.coords.longitude,

          accuracy: p.coords.accuracy,
          timestamp: p.timestamp,
        }),
      fail,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )

    return () => navigator.geolocation.clearWatch(id)
  },
  // TẠI SAO (watch): GPS là tài nguyên theo dõi liên tục; phải xin quyền và có hàm dọn để không
  // giữ listener khi không còn dùng.
  // CHỨC NĂNG: Mở một nguồn audio thật qua adapter nền tảng.
  // XỬ LÝ: Chờ metadata để có thời lượng, đồng thời trả các thao tác phát/dừng/tua/đóng cho
  // controller.

  async open(url, title): Promise<Track> {
    const audio = new Audio(narrationSource(url))

    audio.preload = 'auto'

    try {
      // CHỨC NĂNG: Chờ metadata để thời lượng và thanh tua lấy từ file thật.
      // XỬ LÝ: Lỗi nguồn và timeout được trả về controller để cho thử lại.

      await new Promise<void>((resolve, reject) => {
        const done = () => {
          clearTimeout(timer)
          audio.removeEventListener('loadedmetadata', ready)
          audio.removeEventListener('error', bad)
        }
        // TẠI SAO (done): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
        // lớp kết nối này.

        const ready = () => {
          done()
          resolve()
        }
        // TẠI SAO (ready): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
        // lớp kết nối này.

        const bad = () => {
          done()
          reject(new Error('Audio unavailable'))
        }
        // TẠI SAO (bad): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại lớp
        // kết nối này.

        const timer = setTimeout(bad, 20000)

        audio.addEventListener('loadedmetadata', ready)

        audio.addEventListener('error', bad)

        audio.load()
      })
    } catch (error) {
      audio.removeAttribute('src')
      audio.load()
      throw error
    }
    // CHỨC NĂNG: Cờ nguồn/đối tượng đã đóng; ngăn callback đến muộn tiếp tục thao tác.

    let disposed = false

    const owner = { pause: () => audio.pause() }

    const track: Track = {
      duration: audio.duration,

      play: async () => {
        if (disposed) throw new Error('Audio closed')

        playbackCoordinator.claim(owner)

        try {
          await audio.play()
        } catch (error) {
          playbackCoordinator.release(owner)
          throw error
        }
        // XỬ LÝ: Một bài khác có thể được bật khi lời gọi play còn đang chờ.

        if (disposed || !playbackCoordinator.owns(owner)) {
          audio.pause()
          return
        }

        if ('mediaSession' in navigator) {
          mediaOwner = audio

          navigator.mediaSession.metadata = new MediaMetadata({ title })

          navigator.mediaSession.setActionHandler('play', () => {
            void track.play().catch(() => audio.dispatchEvent(new Event('error')))
          })

          navigator.mediaSession.setActionHandler('pause', () => audio.pause())

          navigator.mediaSession.setActionHandler('seekto', (d) => {
            if (d.seekTime !== undefined) audio.currentTime = d.seekTime
          })
        }
      },

      pause: () => audio.pause(),

      seek: async (value) => {
        audio.currentTime = value
      },

      rate: (value) => {
        audio.playbackRate = value
      },

      volume: (value) => {
        audio.volume = value
      },

      listen: (callback) => {
        const report = () =>
          callback({
            position: audio.currentTime,
            duration: audio.duration,
            playing: !audio.paused,
            ended: audio.ended,
            error: Boolean(audio.error),
          })
        // TẠI SAO (report): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
        // lớp kết nối này.

        const events = ['timeupdate', 'play', 'pause', 'ended', 'seeked', 'error']

        events.forEach((event) => audio.addEventListener(event, report))

        return () => events.forEach((event) => audio.removeEventListener(event, report))
      },

      dispose: () => {
        if (disposed) return

        disposed = true
        playbackCoordinator.release(owner)
        audio.pause()
        audio.removeAttribute('src')
        audio.load()

        if ('mediaSession' in navigator && mediaOwner === audio)
          for (const action of ['play', 'pause', 'seekto'] as const)
            navigator.mediaSession.setActionHandler(action, null)
      },
    }

    return track
  },
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
}
