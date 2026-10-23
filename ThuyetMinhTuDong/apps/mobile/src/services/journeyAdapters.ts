/**
 * FILE NÀY LÀM GÌ: Kết nối audio/GPS/bộ nhớ riêng nền tảng vào JourneyProvider.
 * Vị trí: apps/mobile/src/services/journeyAdapters.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import * as Location from 'expo-location'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import type { Track } from '@travelguide/visitor-core/journey'
import vi from '../../assets/demo-audio/vi.mp3'
import en from '../../assets/demo-audio/en.mp3'
import cn from '../../assets/demo-audio/cn.mp3'
import pt from '../../assets/demo-audio/pt.mp3'
import ja from '../../assets/demo-audio/ja.mp3'

const demo: Record<string, number> = { vi, en, cn, pt, ja }

export const journeyAdapters: JourneyAdapters = {
  read: () => AsyncStorage.getItem('visitor-journey-v1'),
  write: value => value === null ? AsyncStorage.removeItem('visitor-journey-v1') : AsyncStorage.setItem('visitor-journey-v1', value),
  async watch(next, fail) {
    const permission = await Location.requestForegroundPermissionsAsync()
    if (permission.status !== 'granted') throw new Error('GPS denied')
    let stopped = false, generation = 0
    let subscription: Location.LocationSubscription | undefined
    const start = async () => {
      const request = ++generation
      try {
        const result = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 }, p => {
          if (!stopped && request === generation) next({ lat: p.coords.latitude, lng: p.coords.longitude,
            accuracy: p.coords.accuracy ?? Infinity, timestamp: p.timestamp })
        })
        if (stopped || request !== generation) result.remove(); else subscription = result
      } catch { if (!stopped) fail() }
    }
    const listener = AppState.addEventListener('change', state => {
      generation++; subscription?.remove(); subscription = undefined
      if (state === 'active' && !stopped) void start()
    })
    if (AppState.currentState === 'active') await start()
    return () => { stopped = true; generation++; listener.remove(); subscription?.remove() }
  },
  async open(url, title): Promise<Track> {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' })
    const source = url.startsWith('demo:') ? demo[url.slice(5)] : url
    if (!source) throw new Error('Missing audio')
    const player = createAudioPlayer(source, { updateInterval: 250 })
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => { listener.remove(); reject(new Error('Audio timeout')) }, 20000)
        const listener = player.addListener('playbackStatusUpdate', status => {
          if (status.error || status.isLoaded) { clearTimeout(timer); listener.remove(); if (status.error) reject(new Error(status.error)); else resolve() }
        })
        if (player.isLoaded) { clearTimeout(timer); listener.remove(); resolve() }
      })
    } catch (error) { player.remove(); throw error }
    let disposed = false
    return {
      duration: player.duration,
      play: async () => { player.setActiveForLockScreen(true, { title }); player.play() },
      pause: () => player.pause(), seek: seconds => player.seekTo(seconds), rate: value => player.setPlaybackRate(value),
      listen: callback => {
        const listener = player.addListener('playbackStatusUpdate', s => callback({ position: s.currentTime,
          duration: s.duration, playing: s.playing, ended: s.didJustFinish, error: Boolean(s.error) }))
        return () => listener.remove()
      },
      dispose: () => { if (!disposed) { disposed = true; player.setActiveForLockScreen(false); player.remove() } },
    }
  },
}
