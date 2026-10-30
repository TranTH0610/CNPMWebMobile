/**
 * FILE NÀY LÀM GÌ
 * Nối logic hành trình với API thiết bị: mobile dùng audio/GPS/bộ nhớ native, web dùng HTML
 * Audio/Geolocation/localStorage.
 *
 * VỊ TRÍ: apps/mobile/src/services/journeyAdapters.ts
 * DÙNG BỞI: apps/mobile/src/components/admin/AudioPreview.tsx;
 * apps/mobile/src/providers/AppProviders.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; ./narrationAssets;
 * @react-native-async-storage/async-storage; react-native; expo-location; expo-audio;
 * @travelguide/visitor-core/journey/react; @travelguide/visitor-core/journey;
 * ../../assets/demo-audio/vi.mp3; ../../assets/demo-audio/en.mp3; ../../assets/demo-audio/cn.mp3;
 * ../../assets/demo-audio/pt.mp3; ../../assets/demo-audio/ja.mp3
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { playbackCoordinator } from '@travelguide/visitor-core'
// Nhập các thành phần từ './narrationAssets'.
import { mediaSource } from './mediaSource'
// Nhập các thành phần từ '@react-native-async-storage/async-storage'.
import AsyncStorage from '@react-native-async-storage/async-storage'
// Nhập các thành phần từ 'react-native'.
import { AppState } from 'react-native'
// Nhập các thành phần từ 'expo-location'.
import * as Location from 'expo-location'
// Nhập các thành phần từ 'expo-audio'.
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core/journey/react'.
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core/journey'.
import type { Track } from '@travelguide/visitor-core/journey'
// Nhập các thành phần từ '../../assets/demo-audio/vi.mp3'.
// Nhập các thành phần từ '../../assets/demo-audio/en.mp3'.
// Nhập các thành phần từ '../../assets/demo-audio/cn.mp3'.
// Nhập các thành phần từ '../../assets/demo-audio/pt.mp3'.
// Nhập các thành phần từ '../../assets/demo-audio/ja.mp3'.

// Khai báo demo: tạo object gồm vi, en, cn, pt, ja. | Đặt trường vi bằng giá trị của biến cùng tên. | Đặt trường en bằng giá trị của biến cùng tên. | Đặt trường cn bằng giá trị của biến cùng tên. | Đặt trường pt bằng giá trị của biến cùng tên. | Đặt trường ja bằng giá trị của biến cùng tên.

// Khai báo journeyAdapters: tạo object gồm read, write, watch, open.
export const journeyAdapters: JourneyAdapters = {
  // Gán thuộc tính read: khai báo callback () => AsyncStorage.getItem('visitor-journey-v1').
  read: () => AsyncStorage.getItem('visitor-journey-v1'),
  // Gán thuộc tính write: khai báo callback value => value === null ? AsyncStorage.removeItem('visitor-journey-v1') : A.
  write: value => value === null ? AsyncStorage.removeItem('visitor-journey-v1') : AsyncStorage.setItem('visitor-journey-v1', value),
  // CHỨC NĂNG: Theo dõi GPS của nền tảng cho hành trình.
  // XỬ LÝ: Kiểm tra quyền/khả năng hỗ trợ và trả hàm gỡ theo dõi để dọn khi rời luồng.
  // Khai báo watch(next, fail). Nhận đầu vào qua tham số.
  async watch(next, fail) {
    // Khai báo permission: await chờ Gọi Location.requestForegroundPermissionsAsync().
    const permission = await Location.requestForegroundPermissionsAsync()
    // Rẽ nhánh nếu permission.status !== 'granted'. | Ném new Error('GPS denied').
    if (permission.status !== 'granted') throw new Error('GPS denied')
    // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.
    // Khai báo stopped: sử dụng false làm giá trị của bước hiện tại | Khai báo generation: giá trị số 0.
    let stopped = false, generation = 0
    // Khai báo subscription: không có giá trị khởi tạo.
    let subscription: Location.LocationSubscription | undefined
    // Khai báo start: khai báo callback async () => { const request = ++generation try { const result = await Locat.
    const start = async () => {
      // Khai báo request: sử dụng ++generation làm giá trị của bước hiện tại.
      const request = ++generation
      // Bắt đầu vùng try.
      try {
        // Khai báo result: await chờ Gọi Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distan. | Gán thuộc tính accuracy: đọc Location.Accuracy.High từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính timeInterval: giá trị số 3000. | Gán thuộc tính distanceInterval: giá trị số 5.
        const result = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 }, p => {
          // Rẽ nhánh nếu !stopped && request === generation. | Thực hiện Gọi next({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy ?? Inf. | Gán thuộc tính lat: đọc p.coords.latitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính lng: đọc p.coords.longitude từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
          if (!stopped && request === generation) next({ lat: p.coords.latitude, lng: p.coords.longitude,
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `accuracy: p.coords.accuracy ?? Infinity, timestamp: p.timestamp })`: Gán thuộc tính accuracy: tính biểu thức p.coords.accuracy ?? Infinity. | Gán thuộc tính timestamp: đọc p.timestamp từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
             * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            accuracy: p.coords.accuracy ?? Infinity, timestamp: p.timestamp })
        })
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (stopped || request !== generation) result.remove(); else subscription = result`: Rẽ nhánh nếu stopped || request !== generation. | Thực hiện Gọi result.remove(). | Thực hiện tính biểu thức subscription = result.
         * DÒNG `} catch { if (!stopped) fail() }`: Bắt đầu vùng try. | Rẽ nhánh nếu !stopped. | Thực hiện Gọi fail().
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        if (stopped || request !== generation) result.remove(); else subscription = result
      } catch { if (!stopped) fail() }
    }
    // TẠI SAO (start): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
    // lớp kết nối này.
    // Khai báo listener: Gọi AppState.addEventListener('change', state => { generation++.
    const listener = AppState.addEventListener('change', state => {
      // Thực hiện sử dụng generation++ làm giá trị của bước hiện tại. | Thực hiện Gọi subscription?.remove(). | Thực hiện tính biểu thức subscription = undefined.
      generation++; subscription?.remove(); subscription = undefined
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (state === 'active' && !stopped) void start()`: Rẽ nhánh nếu state === 'active' && !stopped. | Thực hiện sử dụng void start() làm giá trị của bước hiện tại.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (state === 'active' && !stopped) void start()
    })
    // Rẽ nhánh nếu AppState.currentState === 'active'. | Thực hiện await chờ Gọi start().
    if (AppState.currentState === 'active') await start()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => { stopped = true; generation++; listener.remove(); subscription?.remove(`: Trả kết quả: khai báo callback () => { stopped = true. | Thực hiện tính biểu thức stopped = true. | Thực hiện sử dụng generation++ làm giá trị của bước hiện tại. | Thực hiện Gọi listener.remove(). | Thực hiện Gọi subscription?.remove().
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return () => { stopped = true; generation++; listener.remove(); subscription?.remove() }
  },
  // TẠI SAO (watch): GPS là tài nguyên theo dõi liên tục; phải xin quyền và có hàm dọn để không
  // giữ listener khi không còn dùng.
  // CHỨC NĂNG: Mở một nguồn audio thật qua adapter nền tảng.
  // XỬ LÝ: Chờ metadata để có thời lượng, đồng thời trả các thao tác phát/dừng/tua/đóng cho
  // controller.
  // Khai báo open(url, title). Nhận đầu vào qua tham số.
  async open(url, title): Promise<Track> {
    // Thực hiện await chờ Gọi setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMod. | Gán thuộc tính playsInSilentMode: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính shouldPlayInBackground: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính interruptionMode: chuỗi 'doNotMix'.
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' })
    // CHỨC NĂNG: Mở audio từ SQL qua URL API; không ưu tiên MP3 asset cũ.
    // TẠI SAO: Admin đổi bản thu thì web/mobile cùng lấy bản đang lưu trong database.
    const source = mediaSource(url)
    // Rẽ nhánh nếu !source. | Ném new Error('Missing audio').
    if (!source) throw new Error('Missing audio')
    // Khai báo player: Gọi createAudioPlayer(source, { updateInterval: 250 }). | Gán thuộc tính updateInterval: giá trị số 250.
    const player = createAudioPlayer(source, { updateInterval: 250 })
    // Bắt đầu vùng try.
    try {
      // Dọn đăng ký/timer: await new Promise<void>((resolve, reject) => { const timer = setTimeout(() => { listener.remove().
      await new Promise<void>((resolve, reject) => {
        // Khai báo timer: setTimeout lên lịch tác vụ một lần. | Thực hiện Gọi listener.remove(). | Thực hiện Gọi reject(new Error('Audio timeout')).
        const timer = setTimeout(() => { listener.remove(); reject(new Error('Audio timeout')) }, 20000)
        // Khai báo listener: Gọi player.addListener('playbackStatusUpdate', status => { if (status.error || status.isLoaded.
        const listener = player.addListener('playbackStatusUpdate', status => {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `if (status.error || status.isLoaded) { clearTimeout(timer); listener.remove(); if (st`: Rẽ nhánh nếu status.error || status.isLoaded. | Dọn đăng ký/timer: clearTimeout(timer). | Thực hiện Gọi listener.remove(). | Rẽ nhánh nếu status.error. | Thực hiện Gọi reject(new Error(status.error)). | Thực hiện Gọi resolve().
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          if (status.error || status.isLoaded) { clearTimeout(timer); listener.remove(); if (status.error) reject(new Error(status.error)); else resolve() }
        })
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (player.isLoaded) { clearTimeout(timer); listener.remove(); resolve() }`: Rẽ nhánh nếu player.isLoaded. | Dọn đăng ký/timer: clearTimeout(timer). | Thực hiện Gọi listener.remove(). | Thực hiện Gọi resolve().
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `} catch (error) { player.remove(); throw error }`: Bắt đầu vùng try. | Thực hiện Gọi player.remove(). | Ném error.
         */
        if (player.isLoaded) { clearTimeout(timer); listener.remove(); resolve() }
      })
    } catch (error) { player.remove(); throw error }
    // CHỨC NĂNG: Cờ nguồn/đối tượng đã đóng; ngăn callback đến muộn tiếp tục thao tác.
    // Khai báo disposed: sử dụng false làm giá trị của bước hiện tại.
    let disposed = false
    // Khai báo owner: tạo object gồm pause. | Gán thuộc tính pause: khai báo callback () => { if (!disposed) player.pause() }. | Rẽ nhánh nếu !disposed. | Thực hiện player.pause tạm dừng nguồn âm thanh hiện tại.
    const owner = { pause: () => { if (!disposed) player.pause() } }
    // Trả kết quả: tạo object gồm duration, play, pause, seek, rate, volume, listen, dispose.
    return {
      // Gán thuộc tính duration: đọc player.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ.
      duration: player.duration,
      // CHỨC NĂNG: Cả preview và bài du khách tranh quyền qua cùng coordinator.
      // Gán thuộc tính play: khai báo callback async () => { if (disposed) throw new Error('Audio closed') playbackCoordin.
      play: async () => {
        // Rẽ nhánh nếu disposed. | Ném new Error('Audio closed').
        if (disposed) throw new Error('Audio closed')
        // Thực hiện playbackCoordinator.claim nhận quyền phát của bộ điều phối.
        playbackCoordinator.claim(owner)
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `try { player.setActiveForLockScreen(true, { title }); player.play() }`: Bắt đầu vùng try. | Thực hiện Gọi player.setActiveForLockScreen(true, { title }). | Đặt trường title bằng giá trị của biến cùng tên. | Thực hiện Gọi player.play().
         * DÒNG `catch (error) { playbackCoordinator.release(owner); throw error }`: Bắt đầu vùng try. | Thực hiện playbackCoordinator.release trả quyền phát nếu nguồn này đang sở hữu, tránh xóa quyền của nguồn mới. | Ném error.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        try { player.setActiveForLockScreen(true, { title }); player.play() }
        catch (error) { playbackCoordinator.release(owner); throw error }
      },
      // Gán thuộc tính pause: khai báo callback () => player.pause(). | Gán thuộc tính seek: khai báo callback seconds => player.seekTo(seconds). | Gán thuộc tính rate: khai báo callback value => player.setPlaybackRate(value).
      pause: () => player.pause(), seek: seconds => player.seekTo(seconds), rate: value => player.setPlaybackRate(value),
      // Gán thuộc tính volume: khai báo callback value => { player.volume = value }. | Thực hiện tính biểu thức player.volume = value.
      volume: value => { player.volume = value },
      // Gán thuộc tính listen: khai báo callback callback => { const listener = player.addListener('playbackStatusUpdate', s.
      listen: callback => {
        // Khai báo listener: Gọi player.addListener('playbackStatusUpdate', s => callback({ position: s.currentTime, durati. | Gán thuộc tính position: đọc s.currentTime từ đối tượng/mảng để dùng tại bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio.
        const listener = player.addListener('playbackStatusUpdate', s => callback({ position: s.currentTime,
          // Gán thuộc tính duration: đọc s.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ. | Gán thuộc tính playing: đọc s.playing từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính ended: đọc s.didJustFinish từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính error: Gọi Boolean(s.error).
          duration: s.duration, playing: s.playing, ended: s.didJustFinish, error: Boolean(s.error) }))
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return () => listener.remove()`: Trả kết quả: khai báo callback () => listener.remove().
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return () => listener.remove()
      },
      // Gán thuộc tính dispose: khai báo callback () => { if (!disposed) { const owns = playbackCoordinator.owns(owner) dispo.
      dispose: () => {
        // Rẽ nhánh nếu !disposed.
        if (!disposed) {
          // Khai báo owns: Gọi playbackCoordinator.owns(owner).
          const owns = playbackCoordinator.owns(owner)
          // Thực hiện tính biểu thức disposed = true. | Thực hiện playbackCoordinator.release trả quyền phát nếu nguồn này đang sở hữu, tránh xóa quyền của nguồn mới.
          disposed = true; playbackCoordinator.release(owner)
          // Rẽ nhánh nếu owns. | Thực hiện Gọi player.setActiveForLockScreen(false).
          if (owns) player.setActiveForLockScreen(false)
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `player.remove()`: Thực hiện Gọi player.remove().
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          player.remove()
        }
      },
    }
  },
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
}
