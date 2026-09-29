import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import type { Place } from '../services/places'
import { distanceMeters } from '../services/geo'

const RADIUS = 100 // mét

type Coords = { lat: number; lng: number }

export function useNearbyPlace(places: Place[], enabled: boolean) {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [simulated, setSimulated] = useState<Coords | null>(null)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setCoords(null)
      setDenied(false)
      return
    }
    let sub: Location.LocationSubscription | undefined
    let cancelled = false

    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (cancelled) return
      if (status !== 'granted') {
        setDenied(true)
        return
      }
      setDenied(false)
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      )
      if (cancelled) sub.remove()
    })()

    return () => {
      cancelled = true
      sub?.remove()
    }
  }, [enabled])

  const current = simulated ?? coords
  let nearby: Place | null = null
  if (enabled && current) {
    let best = RADIUS
    for (const p of places) {
      if (!p.location) continue
      const d = distanceMeters(current, p.location)
      if (d <= best) {
        best = d
        nearby = p
      }
    }
  }

  return { nearby, denied, simulate: setSimulated }
}