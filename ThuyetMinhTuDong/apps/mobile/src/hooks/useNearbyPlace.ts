/**
 * FILE NÀY LÀM GÌ:
 * Theo dõi vị trí khi bật tự mở và tìm địa điểm trong bán kính 100 m.
 * HomeScreen dùng; phụ thuộc expo-location, Place và geo.ts.
 * Giữ luồng geofencing hiện có, bổ sung xử lý lỗi an toàn.
 */

import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

import type { Place } from '../services/places'
import { distanceMeters } from '../services/geo'

const RADIUS = 100

type Coords = {
  lat: number
  lng: number
}

export function useNearbyPlace(
  places: Place[],
  enabled: boolean,
) {
  const [coords, setCoords] =
    useState<Coords | null>(null)

  const [simulated, setSimulated] =
    useState<Coords | null>(null)

  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setCoords(null)
      setSimulated(null)
      setDenied(false)
      return
    }

    let subscription:
      Location.LocationSubscription | undefined

    let cancelled = false

    const start = async (): Promise<void> => {
      try {
        const permission =
          await Location.requestForegroundPermissionsAsync()

        if (cancelled) return

        if (permission.status !== 'granted') {
          setDenied(true)
          return
        }

        setDenied(false)

        const watcher =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              distanceInterval: 10,
            },
            (position) => {
              if (!cancelled) {
                setCoords({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                })
              }
            },
          )

        // CHỨC NĂNG: không để watcher tồn tại sau khi tắt switch.
        // XỬ LÝ: watchPositionAsync trả về bất đồng bộ; nếu đã cleanup
        // trong lúc chờ, phải remove watcher ngay khi nó được trả về.
        if (cancelled) {
          watcher.remove()
        } else {
          subscription = watcher
        }
      } catch {
        if (!cancelled) {
          setDenied(true)
          setCoords(null)
        }
      }
    }

    void start()

    return () => {
      cancelled = true
      subscription?.remove()
    }
  }, [enabled])

  const current = simulated ?? coords

  let nearby: Place | null = null

  // CHỨC NĂNG: giữ cách chọn địa điểm gần nhất trong bán kính.
  // XỬ LÝ: bỏ địa điểm không có tọa độ; không đổi RADIUS=100.
  if (enabled && current) {
    let bestDistance = RADIUS

    for (const place of places) {
      if (!place.location) continue

      const distance = distanceMeters(
        current,
        place.location,
      )

      if (distance <= bestDistance) {
        bestDistance = distance
        nearby = place
      }
    }
  }

  return {
    nearby,
    denied,
    simulate: setSimulated,
  }
}