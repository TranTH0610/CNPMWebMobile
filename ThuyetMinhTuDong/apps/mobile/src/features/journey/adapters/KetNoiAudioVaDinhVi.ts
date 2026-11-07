/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML Audio/Geolocation/localStorage.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/app/TrangThaiUngDung.tsx
 * - apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 * - ../../../shared/services/NguonTepTaiNguyen
 * - @react-native-async-storage/async-storage
 * - react-native
 * - expo-location
 * - expo-audio
 * - @travelguide/visitor-core/journey/react
 * - @travelguide/visitor-core/journey
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
import { playbackCoordinator } from '@travelguide/visitor-core'
import { mediaSource } from '../../../shared/services/NguonTepTaiNguyen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import * as Location from 'expo-location'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import type { Track } from '@travelguide/visitor-core/journey'

export const journeyAdapters: JourneyAdapters = {
  read: () => AsyncStorage.getItem('visitor-journey-v1'),

  write: (value) =>
    value === null
      ? AsyncStorage.removeItem('visitor-journey-v1')
      : AsyncStorage.setItem('visitor-journey-v1', value),
  // CHỨC NĂNG: Theo dõi GPS của nền tảng cho hành trình.
  // XỬ LÝ: Kiểm tra quyền/khả năng hỗ trợ và trả hàm gỡ theo dõi để dọn khi rời luồng.

  async watch(next, fail) {
    const permission = await Location.requestForegroundPermissionsAsync()

    if (permission.status !== 'granted') throw new Error('GPS denied')
    // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.

    let stopped = false,
      generation = 0

    let subscription: Location.LocationSubscription | undefined

    const start = async () => {
      const request = ++generation

      try {
        const result = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
          (p) => {
            if (!stopped && request === generation)
              next({
                lat: p.coords.latitude,
                lng: p.coords.longitude,

                accuracy: p.coords.accuracy ?? Infinity,
                timestamp: p.timestamp,
              })
          },
        )

        if (stopped || request !== generation) result.remove()
        else subscription = result
      } catch {
        if (!stopped) fail()
      }
    }
    // TẠI SAO (start): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
    // lớp kết nối này.

    const listener = AppState.addEventListener('change', (state) => {
      generation++
      subscription?.remove()
      subscription = undefined

      if (state === 'active' && !stopped) void start()
    })

    if (AppState.currentState === 'active') await start()

    return () => {
      stopped = true
      generation++
      listener.remove()
      subscription?.remove()
    }
  },
  // TẠI SAO (watch): GPS là tài nguyên theo dõi liên tục; phải xin quyền và có hàm dọn để không
  // giữ listener khi không còn dùng.
  // CHỨC NĂNG: Mở một nguồn audio thật qua adapter nền tảng.
  // XỬ LÝ: Chờ metadata để có thời lượng, đồng thời trả các thao tác phát/dừng/tua/đóng cho
  // controller.

  async open(url, title): Promise<Track> {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    })
    // CHỨC NĂNG: Mở audio từ SQL qua URL API; không ưu tiên MP3 asset cũ.
    // TẠI SAO: Admin đổi bản thu thì web/mobile cùng lấy bản đang lưu trong database.
    const source = mediaSource(url)

    if (!source) throw new Error('Missing audio')

    const player = createAudioPlayer(source, { updateInterval: 250 })

    try {
      // Dọn đăng ký/timer: await new Promise<void>((resolve, reject) => { const timer = setTimeout(() => { listener.remove().
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          listener.remove()
          reject(new Error('Audio timeout'))
        }, 20000)

        const listener = player.addListener('playbackStatusUpdate', (status) => {
          if (status.error || status.isLoaded) {
            clearTimeout(timer)
            listener.remove()
            if (status.error) reject(new Error(status.error))
            else resolve()
          }
        })

        if (player.isLoaded) {
          clearTimeout(timer)
          listener.remove()
          resolve()
        }
      })
    } catch (error) {
      player.remove()
      throw error
    }
    // CHỨC NĂNG: Cờ nguồn/đối tượng đã đóng; ngăn callback đến muộn tiếp tục thao tác.

    let disposed = false

    const owner = {
      pause: () => {
        if (!disposed) player.pause()
      },
    }

    return {
      duration: player.duration,
      // CHỨC NĂNG: Cả preview và bài du khách tranh quyền qua cùng coordinator.

      play: async () => {
        if (disposed) throw new Error('Audio closed')

        playbackCoordinator.claim(owner)

        try {
          player.setActiveForLockScreen(true, { title })
          player.play()
        } catch (error) {
          playbackCoordinator.release(owner)
          throw error
        }
      },

      pause: () => player.pause(),
      seek: (seconds) => player.seekTo(seconds),
      rate: (value) => player.setPlaybackRate(value),

      volume: (value) => {
        player.volume = value
      },

      listen: (callback) => {
        const listener = player.addListener('playbackStatusUpdate', (s) =>
          callback({
            position: s.currentTime,

            duration: s.duration,
            playing: s.playing,
            ended: s.didJustFinish,
            error: Boolean(s.error),
          }),
        )

        return () => listener.remove()
      },

      dispose: () => {
        if (!disposed) {
          const owns = playbackCoordinator.owns(owner)

          disposed = true
          playbackCoordinator.release(owner)

          if (owns) player.setActiveForLockScreen(false)

          player.remove()
        }
      },
    }
  },
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
}
