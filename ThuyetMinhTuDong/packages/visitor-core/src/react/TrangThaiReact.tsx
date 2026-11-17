/**
 * FILE: packages/visitor-core/src/react/TrangThaiReact.tsx
 * FILE NÀY LÀM GÌ: Khởi tạo ngôn ngữ, tải danh mục/chi tiết và cung cấp bộ lọc dùng chung cho Web và Mobile.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
} from '../domain/KieuDuLieuDuKhach'

import { CatalogError, type Catalog } from '../catalog/DanhMucDiTich'
import { demoCatalog } from '../data/DuLieuKhoiTao'
import { messages, type MessageKey } from '../i18n/BanDichGiaoDien'
import { distanceTo, selectPlaces, validPoint } from '../catalog/TimKiemVaBoLoc'
// CHỨC NĂNG: Sử dụng danh mục cho bộ lọc mới.
// XỬ LÝ: categoryOf hỗ trợ cả dữ liệu chưa có category.
import { categoryOf, type Category } from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Tạo instance i18n cho toàn bộ luồng visitor.
// XỬ LÝ: UI và hook dùng cùng instance nên không bị lệch ngôn ngữ.
// Namespace visitor tách khỏi cấu hình translation cũ.
// [UC01] createVisitorI18n — Khởi tạo bộ dịch giao diện cho năm ngôn ngữ và tiếng Việt dự phòng.
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
// TẠI SAO (createVisitorI18n): Dùng một instance ổn định giúp mọi màn cùng ngôn ngữ và tránh
// khởi tạo lại bộ dịch theo mỗi render.

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
// [UC01 / UC02 / UC03 / UC04] VisitorProvider — Cấp chung i18n, ngôn ngữ và danh mục cho các màn du khách.
export function VisitorProvider(props: ProviderProps) {
  
  
  return (
    <I18nextProvider i18n={props.boot.instance}>
      <StateProvider {...props} />
    </I18nextProvider>
  )
}
// TẠI SAO (VisitorProvider): Nếu mỗi màn giữ lựa chọn riêng, đổi tiếng ở cài đặt sẽ không cập
// nhật đồng bộ danh mục và bài nghe.

// CHỨC NĂNG: Khởi tạo và lưu lựa chọn ngôn ngữ.
// XỬ LÝ: Ưu tiên đã lưu -> thiết bị -> Việt;
// chỉ hiện màn hình sau khi đọc lựa chọn ban đầu.

// [UC01] StateProvider — Chọn ngôn ngữ theo thứ tự đã lưu → thiết bị → tiếng Việt và lưu khi khách đổi tiếng.
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
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.
  const busy = useRef(false)

  // CHỨC NĂNG: Chờ i18n sẵn sàng, đọc ngôn ngữ đã lưu rồi chọn tiếng theo thứ tự lưu, thiết
  // bị, tiếng Việt.
  // XỬ LÝ: Cờ cancelled chặn cập nhật của lần khởi tạo cũ khi provider đã rời cây giao
  // diện.
  // deviceLanguage, instance.
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
        // Cập nhật trạng thái qua setPersistenceError(failed ? 'readError' : null).
        setPersistenceError(failed ? 'readError' : null)
        
        setReady(true)
      }
    }
    // TẠI SAO (initialize): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
    // quán và dễ bảo trì.

    void initialize()

    // Trả kết quả: khai báo callback () => { cancelled = true }.
    return () => {
      
      cancelled = true
    }
  }, [boot, storage, deviceLanguage, instance])
  // TẠI SAO: Khách cần mở app ở đúng tiếng đã chọn; lỗi bộ nhớ không được làm luồng khởi tạo treo
  // mãi.

  // CHỨC NĂNG: Đổi ngôn ngữ giao diện và lưu lựa chọn.
  // XỬ LÝ: Khóa đồng bộ bằng ref để tránh bấm liên tục;
  // lỗi lưu vẫn giữ lựa chọn trong phiên và hiện thông báo.
  
  const changeLanguage = useCallback(
    async (language: Language) => {
      if (busy.current) return

      busy.current = true
      // Cập nhật trạng thái qua setSaving(true).
      setSaving(true)
      // Cập nhật trạng thái qua setPersistenceError(null).
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
  // TẠI SAO (changeLanguage): Đổi tiếng phải dùng văn bản và audio của cùng ngôn ngữ; không đọc
  // bài cũ bằng một lựa chọn tiếng mới.

  
  const language =
    languageOf(instance.resolvedLanguage ?? instance.language)
    ?? 'vi'
   // CHỨC NĂNG: Tạo dữ liệu context dùng chung cho các màn hình.
  // XỬ LÝ: Chỉ tạo object mới khi một giá trị phụ thuộc thay đổi.
  
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

  // CHỨC NĂNG: Hiển thị giao diện chờ khi chưa đọc xong ngôn ngữ.
  // XỬ LÝ: Trả JSX thay vì để component không trả về giá trị.
  if (!ready) {
    
    return <>{loading}</>
  }

  // CHỨC NĂNG: Cung cấp trạng thái cho tất cả component con.
  // XỬ LÝ: children được đặt bên trong Context.Provider
  // để các hook useVisitor có thể đọc ngôn ngữ, service và dấu tim.
  
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}
// TẠI SAO (StateProvider): Cần đọc lựa chọn đã lưu trước để không chớp nội dung ở tiếng mặc định
// rồi mới đổi sang tiếng đã chọn.

// CHỨC NĂNG: Đọc trạng thái dùng chung.
// XỬ LÝ: Báo lỗi lập trình nếu component quên nằm trong provider.
// [UC01] useVisitor — Lấy ngôn ngữ và danh mục từ provider chung thay vì tạo trạng thái riêng từng màn.
export function useVisitor() {
  const value = useContext(Context)

  if (!value) {
    
    throw new Error('VisitorProvider is missing')
  }

  
  return value
}
// TẠI SAO (useVisitor): Đọc cùng context tránh phát sinh nhiều bản trạng thái du khách tách rời
// nhau.

// CHỨC NĂNG: Trả hàm dịch có kiểm tra tên key.
// XỬ LÝ: Chỉ đọc namespace visitor; tự render lại khi đổi ngôn ngữ.
// [UC01] useText — Trả chữ giao diện theo ngôn ngữ đang chọn.
export function useText(): (key: MessageKey) => string {
  const { t } = useTranslation('visitor')

  
  return useCallback(
    (key: MessageKey) => String(t(key)),
    [t],
  )
}
// TẠI SAO (useText): UI dùng khóa dịch giúp thay ngôn ngữ mà không phải viết điều kiện chọn câu
// tại từng nút.

// CHỨC NĂNG: Chờ 300 ms sau lần gõ cuối.
// XỬ LÝ:
// - Ô nhập vẫn cập nhật ngay.
// - Khi gõ tiếp, cleanup hủy timer trước.
// - Rời màn cũng hủy timer, không cập nhật giá trị cũ.
// [UC03] useDebounce — Chờ người dùng ngừng nhập trước khi cập nhật từ khóa tìm kiếm.
export function useDebounce<T>(value: T, delay = 300): T {
  const [result, setResult] = useState(value)

  // CHỨC NĂNG: Đặt timer để cập nhật giá trị đã debounce sau delay mili giây.
  // XỬ LÝ: Hàm return clearTimeout của lịch vừa tạo trước khi effect chạy lại hoặc
  // component rời.
  useEffect(() => {
    
    const timer = setTimeout(
      () => setResult(value),
      delay,
    )

    
    return () => clearTimeout(timer)
  }, [value, delay])
  // TẠI SAO: Gõ tiếp trong khoảng chờ phải hủy giá trị trước; chỉ lần thay đổi cuối mới được đưa
  // vào tìm kiếm.

  
  return result
}
// TẠI SAO (useDebounce): Gõ liên tục không cần lọc ở từng phím; hủy lịch cũ để chỉ giá trị cuối
// được áp dụng sau khoảng chờ.

// XỬ LÝ: Mỗi request có số thứ tự; phản hồi cũ không ghi đè phản hồi mới.
// [UC02] usePublishedCatalog — Tải danh mục đã công bố, đồng thời cung cấp trạng thái đang tải/lỗi và chức năng tải lại.
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
  // TẠI SAO (reload): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
  // và dễ bảo trì.

  // CHỨC NĂNG: Vô hiệu hóa request đang chờ khi rời màn.
  // XỬ LÝ: Không cần hủy Promise mock; chỉ không nhận kết quả cũ.
  const cancel = useCallback(() => {
    
    sequence.current++
  }, [])
  // TẠI SAO (cancel): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
  // và dễ bảo trì.

  // CHỨC NĂNG: Tải danh mục khi hook bắt đầu hoặc hàm reload thay đổi.
  // XỬ LÝ: Hàm return cancel vô hiệu lần tải đang chờ khi effect được thay hoặc component
  // rời.
  useEffect(() => {
    void reload()
    
    return cancel
  }, [reload, cancel])
  // TẠI SAO: Không dùng kết quả của một lần tải đã lỗi thời để cập nhật màn hình mới.

  // CHỨC NĂNG: Cập nhật bản công khai trong cùng app khi Admin công bố.
  // CHỨC NĂNG: Đăng ký thay đổi catalog và gọi reload khi được thông báo.
  // XỬ LÝ: Nếu nguồn hỗ trợ subscribe, hàm return của nó dùng làm cleanup.
  useEffect(() => catalog.subscribe?.(() => { void reload() }), [catalog, reload])
  // TẠI SAO: Danh sách đang mở cần cập nhật khi nguồn dữ liệu thay đổi thay vì giữ mãi bản đã tải
  // lần đầu.

  
  return { ...state, reload }
}
// TẠI SAO (usePublishedCatalog): Cần tách chưa tải, lỗi và rỗng để người dùng không hiểu nhầm
// lỗi API là không có di tích.

// XỬ LÝ: Phân biệt không tồn tại với lỗi nguồn;
// gắn state với ID để không hiện dữ liệu điểm trước đó.
// [UC04] usePublishedPlace — Tải đúng di tích theo mã để màn chi tiết hiển thị nội dung đã công bố.
export function usePublishedPlace(id: string) {
  const { catalog } = useVisitor()
  // CHỨC NĂNG: Bộ đếm thử lại; thay đổi giá trị này để effect tải dữ liệu chạy lại.
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

  // CHỨC NĂNG: Đặt trạng thái tải rồi lấy chi tiết địa điểm bằng catalog.get(id).
  // XỬ LÝ: Thành công ghi place; lỗi phân biệt notFound/loadError; cleanup đánh dấu
  // cancelled.
  // attempt.
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

    // Trả kết quả: khai báo callback () => { cancelled = true }.
    return () => {
      
      cancelled = true
    }
  }, [catalog, id, attempt])
  // TẠI SAO: ID hoặc lần thử lại có thể đổi khi request cũ chưa xong; không cho phản hồi cũ ghi đè
  // địa điểm đang xem.

  // CHỨC NĂNG: Khi catalog thông báo thay đổi, tăng attempt để luồng tải chi tiết chạy lại.
  // XỬ LÝ: React dùng hàm unsubscribe mà catalog trả về để dọn đăng ký.
  useEffect(() => catalog.subscribe?.(() => setAttempt(value => value + 1)), [catalog])
  // TẠI SAO: Trang chi tiết đang mở cũng cần nhận nội dung vừa công bố hoặc bị rút, không chỉ danh
  // sách.

  
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
// TẠI SAO (usePublishedPlace): Đổi ID hoặc thử lại có thể còn request cũ; chỉ kết quả của lần
// đang cần được cập nhật vào UI.

// XỬ LÝ: useMemo chỉ tính lại khi dữ liệu hoặc điều kiện thực sự đổi.

// [UC03] usePlaceFilters — Áp dụng từ khóa, danh mục, khu vực và thứ tự sắp xếp lên danh sách.
export function usePlaceFilters(
  places: readonly PlaceRecord[],
  origin?: Point,
) {
  const { language } = useVisitor()

  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
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
    // [UC01 / UC02 / UC03 / UC04] reset — Xóa từ khóa và nhóm đã chọn.
    reset: () => {
      // Cập nhật trạng thái qua setQuery('').
      setQuery('')
      
      setZone(null)
    },
  }
}
// TẠI SAO (usePlaceFilters): Tập trung điều kiện lọc giúp số kết quả, phân trang và danh sách
// dùng cùng trạng thái.

// CHỨC NĂNG: Xin vị trí khi người dùng chủ động bấm.
// XỬ LÝ: Bắt lỗi quyền/GPS, chặn yêu cầu lặp,
// tránh cập nhật state sau khi component đã unmount.

// [UC03] useVisitorPosition — Lấy vị trí phục vụ sắp xếp khoảng cách trong tra cứu; xử lý trường hợp thiếu quyền hoặc tọa độ.
export function useVisitorPosition(
  getPosition: () => Promise<Point>,
) {
  const [origin, setOrigin] = useState<Point>()
  // CHỨC NĂNG: Trạng thái đang tải để UI không coi dữ liệu chưa về là danh sách rỗng.
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const mounted = useRef(true)
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.
  const busy = useRef(false)

  // CHỨC NĂNG: Đặt mounted.current=true khi component tồn tại, và false trong cleanup.
  // XỬ LÝ: Request vị trí kiểm tra cờ này trước khi cập nhật state sau await.
  // khi rời component.
  useEffect(() => {
    mounted.current = true

    // Trả kết quả: khai báo callback () => { mounted.current = false }.
    return () => {
      
      mounted.current = false
    }
  }, [])
  // TẠI SAO: GPS có thể trả kết quả sau khi khách đã rời màn; cờ giúp bỏ cập nhật không còn cần
  // thiết.

  const request = useCallback(async () => {
    if (busy.current) return

    busy.current = true
    // Cập nhật trạng thái qua setLoading(true).
    setLoading(true)
    // Cập nhật trạng thái qua setFailed(false).
    setFailed(false)

    try {
      const point = await getPosition()

      if (!validPoint(point)) {
        
        throw new Error('Invalid position')
      }

      
      if (mounted.current) setOrigin(point)
    } catch {
      if (mounted.current) {
        // Cập nhật trạng thái qua setOrigin(undefined).
        setOrigin(undefined)
        
        setFailed(true)
      }
    } finally {
      busy.current = false

      
      if (mounted.current) setLoading(false)
    }
  }, [getPosition])
  // TẠI SAO (request): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.

  
  return { origin, loading, failed, request }
}
// TẠI SAO (useVisitorPosition): Xin vị trí khi người dùng yêu cầu và bỏ phản hồi đến muộn tránh
// cập nhật state sau khi rời màn.

// [UC02 / UC03] useExplore — Ghép dữ liệu danh mục, vị trí và bộ lọc thành kết quả để màn khám phá hiển thị.
export function useExplore(
  places: readonly PlaceRecord[],
  origin?: Point,
  initial: {
    query?: string
    
    category?: Category
  } = {},
) 
{
  const { language } = useVisitor()

  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
  const [query, setQuery] = useState(initial.query ?? '')
  const [within, setWithin] = useState('')

  
  const [categories, setCategories] = useState<Category[]>(
    initial.category ? [initial.category] : [],
  )

  const [zones, setZones] = useState<Zone[]>([])
  const [order, setOrder] = useState<SortOrder>('nearest')

  // CHỨC NĂNG: Chờ lần gõ cuối trước khi tìm.
  // XỬ LÝ: useDebounce hiện có hủy timer cũ trong cleanup.
  const debounced = useDebounce(query + ' ' + within)

  // CHỨC NĂNG: Tính kết quả khi điều kiện thực sự thay đổi.
  // XỬ LÝ: Không lọc lại vì một render không liên quan.
  
  const results = useMemo(
    () => selectPlaces(places, {
      language,
      query: debounced,
      
      zone: null,
      order,
      origin,
      categories,
      zones,
    }),
    [
      places,
      language,
      debounced,
      order,
      origin,
      categories,
      zones,
    ],
  )

  
  const availableCategories = useMemo(
    () => [...new Set(places.map(categoryOf))],
    [places],
  )

  
  const availableZones = useMemo(
    () => [...new Set(places.map((place) => place.zone))],
    [places],
  )

  // CHỨC NĂNG: Cho UI biết cách sắp xếp thực tế.
  // XỬ LÝ: Không giả là gần nhất khi thiếu vị trí/tọa độ xác nhận.
  
  const effectiveOrder: SortOrder =
    order === 'nearest'
      && results.some(
        (place) => distanceTo(place, origin) !== undefined,
      )
      ? 'nearest'
      : 'name'

  const reset = () => {
    // Cập nhật trạng thái qua setQuery('').
    setQuery('')
    // Cập nhật trạng thái qua setWithin('').
    setWithin('')
    // Cập nhật trạng thái qua setCategories([]).
    setCategories([])
    
    setZones([])
  }
  // TẠI SAO (reset): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  
  return {
    query,
    setQuery,
    within,
    setWithin,
    categories,
    setCategories,
    zones,
    setZones,
    order,
    setOrder,
    results,
    availableCategories,
    availableZones,
    effectiveOrder,
    reset,
  }
}
// TẠI SAO (useExplore): Ghép các hook chung giúp hai nền tảng giữ cùng hành vi danh mục dù UI
// khác nhau.
export type VisitorI18n = i18n