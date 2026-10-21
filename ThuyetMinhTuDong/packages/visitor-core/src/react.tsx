/**
 * FILE NÀY LÀM GÌ:
 * Quản lý ngôn ngữ, tải dữ liệu, debounce và bộ lọc cho UC01–UC05.
 * App bọc VisitorProvider; các màn hình gọi hook từ file này.
 * Phụ thuộc React, i18next và logic thuần trong visitor-core.
 *
 * Không import AsyncStorage, camera hoặc API vị trí trực tiếp.
 * Những phần nền tảng được truyền qua adapter.
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

import { createInstance, type i18n } from 'i18next'

import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next'

import {
  languageOf,
  type Language,
  type PlaceRecord,
  type Point,
  type SortOrder,
  type StoragePort,
  type Zone,
} from './model'

import { CatalogError, type Catalog } from './catalog'
import { demoCatalog } from './mock'
import { messages, type MessageKey } from './messages'
import { distanceTo, selectPlaces, validPoint } from './search'

// CHỨC NĂNG: Tạo instance i18n cho toàn bộ luồng visitor.
// XỬ LÝ: UI và hook dùng cùng instance nên không bị lệch ngôn ngữ.
// Namespace visitor tách khỏi cấu hình translation cũ.
export function createVisitorI18n() {
  const instance = createInstance()

  const ready = instance.use(initReactI18next).init({
    resources: Object.fromEntries(
      Object.entries(messages).map(([language, text]) => [
        language,
        { visitor: text },
      ]),
    ),
    ns: ['visitor'],
    defaultNS: 'visitor',
    lng: 'vi',
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'cn', 'pt', 'ja'],
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

  return { instance, ready }
}

type Boot = ReturnType<typeof createVisitorI18n>

type VisitorState = {
  language: Language
  saving: boolean
  persistenceError: 'saveError' | 'readError' | null
  changeLanguage: (language: Language) => Promise<void>
  catalog: Catalog
}

const Context = createContext<VisitorState | null>(null)

type ProviderProps = {
  boot: Boot
  storage: StoragePort
  deviceLanguage: string | null
  catalog?: Catalog
  loading: ReactNode
  children: ReactNode
}

// CHỨC NĂNG: Kết nối React với instance i18n.
// XỬ LÝ: StateProvider nằm bên trong I18nextProvider để hook nhận đúng instance.
export function VisitorProvider(props: ProviderProps) {
  return (
    <I18nextProvider i18n={props.boot.instance}>
      <StateProvider {...props} />
    </I18nextProvider>
  )
}

// CHỨC NĂNG: Khởi tạo và lưu lựa chọn ngôn ngữ.
// XỬ LÝ: Ưu tiên đã lưu -> thiết bị -> Việt;
// chỉ hiện màn hình sau khi đọc lựa chọn ban đầu.
function StateProvider({
  boot,
  storage,
  deviceLanguage,
  catalog = demoCatalog,
  loading,
  children,
}: ProviderProps) {
  const { i18n: instance } = useTranslation('visitor')

  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)

  const [persistenceError, setPersistenceError] =
    useState<VisitorState['persistenceError']>(null)

  const busy = useRef(false)

  useEffect(() => {
    let cancelled = false

    const initialize = async () => {
      await boot.ready

      let saved: string | null = null
      let failed = false

      try {
        saved = await storage.readLanguage()
      } catch {
        failed = true
      }

      // CHỨC NĂNG: Bỏ kết quả khi provider đã rời cây giao diện.
      // XỬ LÝ: Không tiếp tục cập nhật state của lần khởi tạo cũ.
      if (cancelled) return

      await instance.changeLanguage(
        languageOf(saved)
        ?? languageOf(deviceLanguage)
        ?? 'vi',
      )

      if (!cancelled) {
        setPersistenceError(failed ? 'readError' : null)
        setReady(true)
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [boot, storage, deviceLanguage, instance])

  // CHỨC NĂNG: Đổi ngôn ngữ giao diện và lưu lựa chọn.
  // XỬ LÝ: Khóa đồng bộ bằng ref để tránh bấm liên tục;
  // lỗi lưu vẫn giữ lựa chọn trong phiên và hiện thông báo.
  const changeLanguage = useCallback(
    async (language: Language) => {
      if (busy.current) return

      busy.current = true
      setSaving(true)
      setPersistenceError(null)

      try {
        await instance.changeLanguage(language)

        try {
          await storage.writeLanguage(language)
        } catch {
          setPersistenceError('saveError')
        }
      } finally {
        busy.current = false
        setSaving(false)
      }
    },
    [instance, storage],
  )

  const language =
    languageOf(instance.resolvedLanguage ?? instance.language)
    ?? 'vi'

  // CHỨC NĂNG: Giữ ổn định giá trị context nếu dữ liệu không đổi.
  // XỬ LÝ: Tránh tạo object context mới do render không liên quan.
  const value = useMemo(
    () => ({
      language,
      saving,
      persistenceError,
      changeLanguage,
      catalog,
    }),
    [
      language,
      saving,
      persistenceError,
      changeLanguage,
      catalog,
    ],
  )

  if (!ready) return <>{loading}</>

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

// CHỨC NĂNG: Đọc trạng thái dùng chung.
// XỬ LÝ: Báo lỗi lập trình nếu component quên nằm trong provider.
export function useVisitor() {
  const value = useContext(Context)

  if (!value) {
    throw new Error('VisitorProvider is missing')
  }

  return value
}

// CHỨC NĂNG: Trả hàm dịch có kiểm tra tên key.
// XỬ LÝ: Chỉ đọc namespace visitor; tự render lại khi đổi ngôn ngữ.
export function useText(): (key: MessageKey) => string {
  const { t } = useTranslation('visitor')

  return useCallback(
    (key: MessageKey) => String(t(key)),
    [t],
  )
}

// CHỨC NĂNG: Chờ 300 ms sau lần gõ cuối.
// XỬ LÝ:
// - Ô nhập vẫn cập nhật ngay.
// - Khi gõ tiếp, cleanup hủy timer trước.
// - Rời màn cũng hủy timer, không cập nhật giá trị cũ.
export function useDebounce<T>(value: T, delay = 300): T {
  const [result, setResult] = useState(value)

  useEffect(() => {
    const timer = setTimeout(
      () => setResult(value),
      delay,
    )

    return () => clearTimeout(timer)
  }, [value, delay])

  return result
}

// CHỨC NĂNG: Tải, làm mới và thử lại danh sách UC02.
// XỬ LÝ: Mỗi request có số thứ tự; phản hồi cũ không ghi đè phản hồi mới.
export function usePublishedCatalog() {
  const { catalog } = useVisitor()

  const [state, setState] = useState<{
    places: PlaceRecord[]
    loading: boolean
    error: boolean
  }>({
    places: [],
    loading: true,
    error: false,
  })

  const sequence = useRef(0)

  const reload = useCallback(async () => {
    const request = ++sequence.current

    setState((previous) => ({
      ...previous,
      loading: true,
      error: false,
    }))

    try {
      const places = await catalog.list()

      if (sequence.current === request) {
        setState({
          places,
          loading: false,
          error: false,
        })
      }
    } catch {
      if (sequence.current === request) {
        setState((previous) => ({
          ...previous,
          loading: false,
          error: true,
        }))
      }
    }
  }, [catalog])

  // CHỨC NĂNG: Vô hiệu hóa request đang chờ khi rời màn.
  // XỬ LÝ: Không cần hủy Promise mock; chỉ không nhận kết quả cũ.
  const cancel = useCallback(() => {
    sequence.current++
  }, [])

  useEffect(() => {
    void reload()
    return cancel
  }, [reload, cancel])

  return { ...state, reload }
}

// CHỨC NĂNG: Tải chi tiết theo ID cho UC04.
// XỬ LÝ: Phân biệt không tồn tại với lỗi nguồn;
// gắn state với ID để không hiện dữ liệu điểm trước đó.
export function usePublishedPlace(id: string) {
  const { catalog } = useVisitor()
  const [attempt, setAttempt] = useState(0)

  const [state, setState] = useState<{
    id: string
    place?: PlaceRecord
    loading: boolean
    error: 'notFound' | 'loadError' | null
  }>({
    id: '',
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    setState({
      id,
      loading: true,
      error: null,
    })

    catalog.get(id)
      .then((place) => {
        if (!cancelled) {
          setState({
            id,
            place,
            loading: false,
            error: null,
          })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            id,
            loading: false,
            error: error instanceof CatalogError
              ? 'notFound'
              : 'loadError',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [catalog, id, attempt])

  const current = state.id === id
    ? state
    : {
      id,
      loading: true,
      error: null,
    }

  return {
    ...current,
    retry: () => setAttempt((value) => value + 1),
  }
}

// CHỨC NĂNG: Gom trạng thái tìm kiếm, lọc và sắp xếp UC03.
// XỬ LÝ: useMemo chỉ tính lại khi dữ liệu hoặc điều kiện thực sự đổi.
export function usePlaceFilters(
  places: readonly PlaceRecord[],
  origin?: Point,
) {
  const { language } = useVisitor()

  const [query, setQuery] = useState('')
  const [zone, setZone] = useState<Zone | null>(null)
  const [order, setOrder] = useState<SortOrder>('name')

  const debounced = useDebounce(query)

  const results = useMemo(
    () => selectPlaces(places, {
      language,
      query: debounced,
      zone,
      order,
      origin,
    }),
    [places, language, debounced, zone, order, origin],
  )

  const zones = useMemo(
    () => [...new Set(places.map((place) => place.zone))],
    [places],
  )

  const effectiveOrder: SortOrder =
    order === 'nearest'
    && results.some(
      (place) => distanceTo(place, origin) !== undefined,
    )
      ? 'nearest'
      : 'name'

  return {
    query,
    setQuery,
    zone,
    setZone,
    order,
    setOrder,
    effectiveOrder,
    results,
    zones,

    // CHỨC NĂNG: Xóa từ khóa và nhóm đã chọn.
    // XỬ LÝ: Giữ cách sắp xếp người dùng đang chọn.
    reset: () => {
      setQuery('')
      setZone(null)
    },
  }
}

// CHỨC NĂNG: Xin vị trí khi người dùng chủ động bấm.
// XỬ LÝ: Bắt lỗi quyền/GPS, chặn yêu cầu lặp,
// tránh cập nhật state sau khi component đã unmount.
export function useVisitorPosition(
  getPosition: () => Promise<Point>,
) {
  const [origin, setOrigin] = useState<Point>()
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const mounted = useRef(true)
  const busy = useRef(false)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  const request = useCallback(async () => {
    if (busy.current) return

    busy.current = true
    setLoading(true)
    setFailed(false)

    try {
      const point = await getPosition()

      if (!validPoint(point)) {
        throw new Error('Invalid position')
      }

      if (mounted.current) setOrigin(point)
    } catch {
      if (mounted.current) {
        setOrigin(undefined)
        setFailed(true)
      }
    } finally {
      busy.current = false

      if (mounted.current) setLoading(false)
    }
  }, [getPosition])

  return { origin, loading, failed, request }
}

export type VisitorI18n = i18n