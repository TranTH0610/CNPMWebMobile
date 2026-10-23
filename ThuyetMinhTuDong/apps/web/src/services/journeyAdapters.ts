/**
 * FILE NÀY LÀM GÌ: Kết nối audio/GPS/bộ nhớ riêng nền tảng vào JourneyProvider.
 * Vị trí: apps/web/src/services/journeyAdapters.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import type { Track } from '@travelguide/visitor-core/journey'

let mediaOwner: HTMLAudioElement | undefined

export const journeyAdapters: JourneyAdapters = {
  read: async () => localStorage.getItem('visitor-journey-v1'),
  write: async value => { if (value === null) localStorage.removeItem('visitor-journey-v1'); else localStorage.setItem('visitor-journey-v1', value) },
  async watch(next, fail) {
    if (!navigator.geolocation) throw new Error('GPS unavailable')
    const id = navigator.geolocation.watchPosition(p => next({ lat: p.coords.latitude, lng: p.coords.longitude,
      accuracy: p.coords.accuracy, timestamp: p.timestamp }), fail, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 })
    return () => navigator.geolocation.clearWatch(id)
  },
  async open(url, title): Promise<Track> {
    const audio = new Audio(url.startsWith('demo:') ? '/demo-audio/' + url.slice(5) + '.mp3' : url)
    audio.preload = 'auto'
    try {
      // CHỨC NĂNG: Chờ metadata để thời lượng và thanh tua lấy từ file thật.
      // XỬ LÝ: Lỗi nguồn và timeout được trả về controller để cho thử lại.
      await new Promise<void>((resolve, reject) => {
        const done = () => { clearTimeout(timer); audio.removeEventListener('loadedmetadata', ready); audio.removeEventListener('error', bad) }
        const ready = () => { done(); resolve() }
        const bad = () => { done(); reject(new Error('Audio unavailable')) }
        const timer = setTimeout(bad, 20000)
        audio.addEventListener('loadedmetadata', ready)
        audio.addEventListener('error', bad)
        audio.load()
      })
    } catch (error) { audio.removeAttribute('src'); audio.load(); throw error }
    let disposed = false
    const track: Track = {
      duration: audio.duration,
      play: async () => {
        await audio.play()
        if ('mediaSession' in navigator) {
          mediaOwner = audio
          navigator.mediaSession.metadata = new MediaMetadata({ title })
          navigator.mediaSession.setActionHandler('play', () => { void audio.play().catch(() => audio.dispatchEvent(new Event('error'))) })
          navigator.mediaSession.setActionHandler('pause', () => audio.pause())
          navigator.mediaSession.setActionHandler('seekto', d => { if (d.seekTime !== undefined) audio.currentTime = d.seekTime })
        }
      },
      pause: () => audio.pause(),
      seek: async value => { audio.currentTime = value },
      rate: value => { audio.playbackRate = value },
      listen: callback => {
        const report = () => callback({ position: audio.currentTime, duration: audio.duration, playing: !audio.paused, ended: audio.ended, error: Boolean(audio.error) })
        const events = ['timeupdate', 'play', 'pause', 'ended', 'seeked', 'error']
        events.forEach(event => audio.addEventListener(event, report))
        return () => events.forEach(event => audio.removeEventListener(event, report))
      },
      dispose: () => {
        if (disposed) return
        disposed = true; audio.pause(); audio.removeAttribute('src'); audio.load()
        if ('mediaSession' in navigator && mediaOwner === audio) for (const action of ['play', 'pause', 'seekto'] as const) navigator.mediaSession.setActionHandler(action, null)
      },
    }
    return track
  },
}
