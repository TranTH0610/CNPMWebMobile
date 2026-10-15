/**
 * FILE NÀY LÀM GÌ:
 * Quản lý tải dữ liệu, dịch nền, refresh, vị trí và tim cục bộ.
 * MainTabs bọc PlacesProvider; Home/Search gọi usePlaces.
 * Phụ thuộc service danh sách, i18n và expo-location.
 * Liên quan UC03, FR-37..39, FR-41.
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'

import * as Location from 'expo-location'
import { useTranslation } from 'react-i18next'

import type {
    Place,
    Point,
} from '@travelguide/shared-types'

import type { LangCode } from '../i18n';

import {
  createMobilePlaceCatalog,
  placeCatalog,
} from '../services/placeCatalog'

type Snapshot = {
    language: LangCode | null
    places: Place[]
    loading: boolean
    refreshing: boolean
    translating: boolean
    error: boolean
}

type PlacesValue = {
    language: LangCode
    places: Place[]
    loading: boolean
    refreshing: boolean
    translating: boolean
    error: boolean
    refresh: () => Promise<void>
    favorites: Set<string>
    toggleFavorite: (id: string) => void
    origin: Point | undefined
    locationLoading: boolean
    locationFailed: boolean
    requestLocation: () => Promise<void>
}

const PlacesContext =
    createContext<PlacesValue | null>(null)

export function PlacesProvider({
    children,
}: {
    children: ReactNode
}) {
    const { i18n } = useTranslation()
    const language = i18n.language as LangCode

    const [snapshot, setSnapshot] = useState<Snapshot>({
        language: null,
        places: [],
        loading: true,
        refreshing: false,
        translating: false,
        error: false,
    })

    const [favorites, setFavorites] =
        useState<Set<string>>(() => new Set())

    const [origin, setOrigin] =
        useState<Point | undefined>()

    const [locationLoading, setLocationLoading] =
        useState(false)

    const [locationFailed, setLocationFailed] =
        useState(false)

    // CHỨC NĂNG: ghi nhớ dữ liệu đã chuẩn bị theo ngôn ngữ/nội dung.
    // XỬ LÝ: nguồn không đổi thì dùng lại cùng mảng, tránh dịch và lọc lại.
    const localizedCache =
        useRef(new Map<string, Place[]>())

    // CHỨC NĂNG: loại kết quả của yêu cầu cũ.
    // XỬ LÝ: đổi ngôn ngữ/refresh/rời provider không bị dữ liệu cũ ghi đè.
    const requestId = useRef(0)
    const mounted = useRef(true)
    const locationBusy = useRef(false)

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
            requestId.current += 1
        }
    }, [])

    const load = useCallback(
        async (refreshing: boolean): Promise<void> => {
            const request = ++requestId.current

            const isCurrent = (): boolean =>
                mounted.current &&
                requestId.current === request

          // CHỨC NĂNG: bắt đầu tải dữ liệu cho ngôn ngữ được chọn.
// XỬ LÝ:
// - Refresh cùng ngôn ngữ: được giữ danh sách hiện có.
// - Đổi ngôn ngữ: bỏ danh sách cũ ngay, chờ dữ liệu lượt mới.
// - Không gắn nhãn "cn" lên danh sách đã chuẩn bị bằng "pt".
setSnapshot((previous) => {
  const sameLanguage =
    previous.language === language

  const places = sameLanguage
    ? previous.places
    : []

  return {
    language,
    places,
    loading:
      !sameLanguage || places.length === 0,
    refreshing,
    translating: false,
    error: false,
  }
})

            try {
                // CHỨC NĂNG: tải nguồn dữ liệu một lần.
                // XỬ LÝ: list() không có ngôn ngữ nên chưa gọi dịch.
                const raw = await placeCatalog.list()

                if (!isCurrent()) return

                // Dữ liệu demo nhỏ nên dùng chữ ký JSON để phát hiện thay đổi.
                // API thật nên thay bằng version/updatedAt của dữ liệu.
                const cacheKey =
                    `${language}|${JSON.stringify(raw)}`

                const cached =
                    localizedCache.current.get(cacheKey)

                // CHỨC NĂNG: hiện danh sách có sẵn trước khi dịch nền.
                // XỬ LÝ: giảm thời gian chờ màn chính.
                // Search sẽ chờ translating=false để không tìm trên dữ liệu thiếu.
                setSnapshot({
                    language,
                    places: cached ?? raw,
                    loading: false,
                    refreshing,
                    translating: !cached,
                    error: false,
                })

                if (cached) {
                    setSnapshot((previous) => ({
                        ...previous,
                        refreshing: false,
                    }))
                    return
                }

                const localized =
                    await createMobilePlaceCatalog(
                        async () => raw,
                    ).list(language)

                if (!isCurrent()) return

                localizedCache.current.set(
                    cacheKey,
                    localized,
                )

                setSnapshot({
                    language,
                    places: localized,
                    loading: false,
                    refreshing: false,
                    translating: false,
                    error: false,
                })
            } catch {
                if (!isCurrent()) return

                setSnapshot((previous) => ({
                    ...previous,
                    language,
                    loading: false,
                    refreshing: false,
                    translating: false,
                    error: true,
                }))
            }
        },
        [language],
    )

    useEffect(() => {
        void load(false)

        return () => {
            requestId.current += 1
        }
    }, [load])

    const refresh = useCallback(
        () => load(true),
        [load],
    )

    // CHỨC NĂNG: thay đổi tim trong bộ nhớ.
    // XỬ LÝ: tạo Set mới để React nhận ra thay đổi.
    // Không ghi AsyncStorage vì đồng bộ yêu thích thuộc M10.
    const toggleFavorite = useCallback((id: string) => {
        setFavorites((previous) => {
            const next = new Set(previous)

            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }

            return next
        })
    }, [])

    // CHỨC NĂNG: lấy vị trí khi người dùng yêu cầu.
    // XỬ LÝ:
    // - Từ chối quyền/GPS lỗi không ném lỗi ra giao diện.
    // - Không để chờ GPS vô hạn: giới hạn 12 giây.
    // - Không tạo watcher mới; geofencing vẫn dùng hook cũ.
    const requestLocation = useCallback(
        async (): Promise<void> => {
            if (locationBusy.current) return

            locationBusy.current = true
            setLocationLoading(true)
            setLocationFailed(false)

            let timer:
                ReturnType<typeof setTimeout> | undefined

            try {
                const permission =
                    await Location.requestForegroundPermissionsAsync()

                if (permission.status !== 'granted') {
                    throw new Error('Location denied')
                }

                const position = await Promise.race([
                    Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    }),
                    new Promise<never>((_resolve, reject) => {
                        timer = setTimeout(() => {
                            reject(new Error('Location timeout'))
                        }, 12000)
                    }),
                ])

                if (mounted.current) {
                    setOrigin({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                }
            } catch {
                if (mounted.current) {
                    setOrigin(undefined)
                    setLocationFailed(true)
                }
            } finally {
                if (timer) clearTimeout(timer)

                locationBusy.current = false

                if (mounted.current) {
                    setLocationLoading(false)
                }
            }
        },
        [],
    )

    // CHỨC NĂNG: dùng vị trí gần đây nếu app đã có quyền.
    // XỬ LÝ: không tự hỏi quyền lúc mở màn; người dùng chủ động cấp quyền.
    useEffect(() => {
        let cancelled = false

        const readKnownLocation = async (): Promise<void> => {
            try {
                const permission =
                    await Location.getForegroundPermissionsAsync()

                if (permission.status !== 'granted') return

                const position =
                    await Location.getLastKnownPositionAsync({
                        maxAge: 60000,
                    })

                if (!cancelled && position) {
                    setOrigin({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                }
            } catch {
                // Không có vị trí vẫn sử dụng được danh sách.
            }
        }

        void readKnownLocation()

        return () => {
            cancelled = true
        }
    }, [])

    const currentLanguage =
        snapshot.language === language

    const value = useMemo<PlacesValue>(() => ({
        language,
        places: currentLanguage ? snapshot.places : [],
        loading: !currentLanguage || snapshot.loading,
        refreshing: currentLanguage && snapshot.refreshing,
        translating: currentLanguage && snapshot.translating,
        error: currentLanguage && snapshot.error,
        refresh,
        favorites,
        toggleFavorite,
        origin,
        locationLoading,
        locationFailed,
        requestLocation,
    }), [
        language,
        currentLanguage,
        snapshot,
        refresh,
        favorites,
        toggleFavorite,
        origin,
        locationLoading,
        locationFailed,
        requestLocation,
    ])

    return (
        <PlacesContext.Provider value={value}>
            {children}
        </PlacesContext.Provider>
    )
}

// CHỨC NĂNG: cung cấp trạng thái chung cho các màn M3.
// XỬ LÝ: báo lỗi lập trình rõ ràng nếu quên bọc provider.
export function usePlaces(): PlacesValue {
    const context = useContext(PlacesContext)

    if (!context) {
        throw new Error(
            'usePlaces must be inside PlacesProvider',
        )
    }

    return context
}