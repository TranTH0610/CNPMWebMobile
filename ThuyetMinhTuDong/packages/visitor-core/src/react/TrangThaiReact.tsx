/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Provider/hook React du khách: i18n, lựa chọn ngôn ngữ, tải danh mục, tìm kiếm và trạng thái dùng
 *
 * VỊ TRÍ: packages/visitor-core/src/react/TrangThaiReact.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - i18next
 * - react-i18next
 * - ../domain/KieuDuLieuDuKhach
 * - ../catalog/DanhMucDiTich
 * - ../data/DuLieuKhoiTao
 * - ../i18n/BanDichGiaoDien
 * - ../catalog/TimKiemVaBoLoc
 *
 * CÁC KHỐI CHÍNH:
 * 1. createVisitorI18n
 * 2. VisitorProvider
 * 3. StateProvider
 * 4. useVisitor
 * 5. useText
 * 6. useDebounce
 * 7. usePublishedCatalog
 * 8. usePublishedPlace
 * 9. usePlaceFilters
 * 10. useVisitorPosition
 * 11. useExplore
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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

// Nhập các thành phần từ 'i18next'.
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

// Nhập các thành phần từ '../catalog/DanhMucDiTich'.
import { CatalogError, type Catalog } from '../catalog/DanhMucDiTich'
// Nhập các thành phần từ '../data/DuLieuKhoiTao'.
import { demoCatalog } from '../data/DuLieuKhoiTao'
// Nhập các thành phần từ '../i18n/BanDichGiaoDien'.
import { messages, type MessageKey } from '../i18n/BanDichGiaoDien'
// Nhập các thành phần từ '../catalog/TimKiemVaBoLoc'.
import { distanceTo, selectPlaces, validPoint } from '../catalog/TimKiemVaBoLoc'
// CHỨC NĂNG: Sử dụng danh mục cho bộ lọc mới.
// XỬ LÝ: categoryOf hỗ trợ cả dữ liệu chưa có category.
// Nhập các thành phần từ '../domain/KieuDuLieuDuKhach'.
import { categoryOf, type Category } from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Tạo instance i18n cho toàn bộ luồng visitor.
// XỬ LÝ: UI và hook dùng cùng instance nên không bị lệch ngôn ngữ.
// Namespace visitor tách khỏi cấu hình translation cũ.
// Khai báo createVisitorI18n(). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] createVisitorI18n ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function createVisitorI18n() {
  // Khai báo instance: Gọi createInstance().
  const instance = createInstance()

  // Khai báo ready: Gọi instance.use(initReactI18next).init({ resources: Object.fromEntries( Object.entries(messag.
  const ready = instance.use(initReactI18next).init({
    
    resources: Object.fromEntries(
      Object.entries(messages).map(([language, text]) => [
        language,
        { visitor: text },
      ]),
    ),
    // Gán thuộc tính ns: tạo mảng ['visitor'].
    ns: ['visitor'],
    // Gán thuộc tính defaultNS: chuỗi 'visitor'.
    defaultNS: 'visitor',
    // Gán thuộc tính lng: chuỗi 'vi'.
    lng: 'vi',
    // Gán thuộc tính fallbackLng: chuỗi 'vi'.
    fallbackLng: 'vi',
    // Gán thuộc tính supportedLngs: tạo mảng ['vi', 'en', 'cn', 'pt', 'ja'].
    supportedLngs: ['vi', 'en', 'cn', 'pt', 'ja'],
    // Gán thuộc tính load: chuỗi 'currentOnly'.
    load: 'currentOnly',
    // Gán thuộc tính interpolation: tạo object gồm escapeValue.
    interpolation: {
      
      escapeValue: false,
    },
    // Gán thuộc tính react: tạo object gồm useSuspense.
    react: {
      
      useSuspense: false,
    },
  })

  
  return { instance, ready }
}
// TẠI SAO (createVisitorI18n): Dùng một instance ổn định giúp mọi màn cùng ngôn ngữ và tránh
// khởi tạo lại bộ dịch theo mỗi render.

// Đặt tên kiểu Boot.
type Boot = ReturnType<typeof createVisitorI18n>

// Đặt tên kiểu VisitorState.
type VisitorState = {
  // Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác.
  language: Language
  // Khai báo saving, kiểu boolean.
  saving: boolean
  // Khai báo persistenceError, kiểu 'saveError' | 'readError' | null.
  persistenceError: 'saveError' | 'readError' | null
  // Khai báo changeLanguage, kiểu (language: Language) => Promise<void>.
  changeLanguage: (language: Language) => Promise<void>
  
  catalog: Catalog
}

// Khai báo Context: Gọi createContext<VisitorState | null>(null).
const Context = createContext<VisitorState | null>(null)

// Đặt tên kiểu ProviderProps.
type ProviderProps = {
  // Khai báo boot, kiểu Boot.
  boot: Boot
  // Khai báo storage, kiểu StoragePort.
  storage: StoragePort
  // Khai báo deviceLanguage, kiểu string | null.
  deviceLanguage: string | null
  // Khai báo catalog không bắt buộc, kiểu Catalog.
  catalog?: Catalog
  // Khai báo loading, kiểu ReactNode.
  loading: ReactNode
  
  children: ReactNode
}

// CHỨC NĂNG: Kết nối React với instance i18n.
// XỬ LÝ: StateProvider nằm bên trong I18nextProvider để hook nhận đúng instance.
// Khai báo VisitorProvider(props). Component hàm nhận props và dựng phần giao diện VisitorProvider.
// ==================== [DUNG-CHUNG] VisitorProvider ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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

// ==================== [DUNG-CHUNG] StateProvider ====================
function StateProvider({
  boot,
  storage,
  deviceLanguage,
  catalog = demoCatalog,
  loading,
  children,
}: ProviderProps) {
  // Khai báo { i18n: instance }: Gọi useTranslation('visitor').
  const { i18n: instance } = useTranslation('visitor')

  // Khai báo [ready, setReady]: useState(false) giữ trạng thái qua các lần render.
  const [ready, setReady] = useState(false)
  // Khai báo [saving, setSaving]: useState(false) giữ trạng thái qua các lần render.
  const [saving, setSaving] = useState(false)

  
  const [persistenceError, setPersistenceError] =
    useState<VisitorState['persistenceError']>(null)
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.
  // Khai báo busy: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const busy = useRef(false)

  // CHỨC NĂNG: Chờ i18n sẵn sàng, đọc ngôn ngữ đã lưu rồi chọn tiếng theo thứ tự lưu, thiết
  // bị, tiếng Việt.
  // XỬ LÝ: Cờ cancelled chặn cập nhật của lần khởi tạo cũ khi provider đã rời cây giao
  // diện.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: boot, storage,
  // deviceLanguage, instance.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo cancelled: sử dụng false làm giá trị của bước hiện tại.
    let cancelled = false

    // Khai báo initialize: khai báo callback async () => { await boot.ready let saved: string | null = null let failed =.
    const initialize = async () => {
      // Thực hiện await chờ đọc boot.ready từ đối tượng/mảng để dùng tại bước hiện tại.
      await boot.ready

      // Khai báo saved: sử dụng null làm giá trị của bước hiện tại.
      let saved: string | null = null
      // Khai báo failed: sử dụng false làm giá trị của bước hiện tại.
      let failed = false

      // Bắt đầu vùng try.
      try {
        
        saved = await storage.readLanguage()
      } catch {
        
        failed = true
      }

      // CHỨC NĂNG: Bỏ kết quả khi provider đã rời cây giao diện.
      // XỬ LÝ: Không tiếp tục cập nhật state của lần khởi tạo cũ.
      // Rẽ nhánh nếu cancelled. | Thoát hàm hiện tại ngay.
      if (cancelled) return

      
      await instance.changeLanguage(
        languageOf(saved)
        ?? languageOf(deviceLanguage)
        ?? 'vi',
      )

      // Rẽ nhánh nếu !cancelled.
      if (!cancelled) {
        // Cập nhật trạng thái qua setPersistenceError(failed ? 'readError' : null).
        setPersistenceError(failed ? 'readError' : null)
        
        setReady(true)
      }
    }
    // TẠI SAO (initialize): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
    // quán và dễ bảo trì.

    // Thực hiện sử dụng void initialize() làm giá trị của bước hiện tại.
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
      // Rẽ nhánh nếu busy.current. | Thoát hàm hiện tại ngay.
      if (busy.current) return

      // Thực hiện tính biểu thức busy.current = true.
      busy.current = true
      // Cập nhật trạng thái qua setSaving(true).
      setSaving(true)
      // Cập nhật trạng thái qua setPersistenceError(null).
      setPersistenceError(null)

      // Bắt đầu vùng try.
      try {
        // Thực hiện await chờ Gọi instance.changeLanguage(language).
        await instance.changeLanguage(language)

        // Bắt đầu vùng try.
        try {
          
          await storage.writeLanguage(language)
        } catch {
          
          setPersistenceError('saveError')
        }
      } finally {
        // Thực hiện tính biểu thức busy.current = false.
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
  // Rẽ nhánh nếu !ready.
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
// Khai báo useVisitor(). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] useVisitor ====================
export function useVisitor() {
  // Khai báo value: Gọi useContext(Context).
  const value = useContext(Context)

  // Rẽ nhánh nếu !value.
  if (!value) {
    
    throw new Error('VisitorProvider is missing')
  }

  
  return value
}
// TẠI SAO (useVisitor): Đọc cùng context tránh phát sinh nhiều bản trạng thái du khách tách rời
// nhau.

// CHỨC NĂNG: Trả hàm dịch có kiểm tra tên key.
// XỬ LÝ: Chỉ đọc namespace visitor; tự render lại khi đổi ngôn ngữ.
// Khai báo useText(). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] useText ====================
export function useText(): (key: MessageKey) => string {
  // Khai báo { t }: Gọi useTranslation('visitor').
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
// Khai báo useDebounce(value, delay). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] useDebounce ====================
export function useDebounce<T>(value: T, delay = 300): T {
  // Khai báo [result, setResult]: useState(value) giữ trạng thái qua các lần render.
  const [result, setResult] = useState(value)

  // CHỨC NĂNG: Đặt timer để cập nhật giá trị đã debounce sau delay mili giây.
  // XỬ LÝ: Hàm return clearTimeout của lịch vừa tạo trước khi effect chạy lại hoặc
  // component rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: value, delay.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
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

// CHỨC NĂNG: Tải, làm mới và thử lại danh sách UC02.
// XỬ LÝ: Mỗi request có số thứ tự; phản hồi cũ không ghi đè phản hồi mới.
// Khai báo usePublishedCatalog(). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] usePublishedCatalog ====================
export function usePublishedCatalog() {
  // Khai báo { catalog }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { catalog } = useVisitor()

  // Khai báo [state, setState]: useState({ places: [], loading: true, error: false, }) giữ trạng thái qua các lần render.
  const [state, setState] = useState<{
    // Khai báo places, kiểu PlaceRecord[].
    places: PlaceRecord[]
    // Khai báo loading, kiểu boolean.
    loading: boolean
    
    error: boolean
  }>({
    // Gán thuộc tính places: tạo mảng [].
    places: [],
    // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    loading: true,
    
    error: false,
  })

  // Khai báo sequence: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const sequence = useRef(0)

  // Khai báo reload: useCallback giữ tham chiếu hàm theo phụ thuộc.
  const reload = useCallback(async () => {
    // Khai báo request: sử dụng ++sequence.current làm giá trị của bước hiện tại.
    const request = ++sequence.current

    
    setState((previous) => ({
      ...previous,
      // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      loading: true,
      
      error: false,
    }))

    // Bắt đầu vùng try.
    try {
      // Khai báo places: await chờ Gọi catalog.list().
      const places = await catalog.list()

      // Rẽ nhánh nếu sequence.current === request.
      if (sequence.current === request) {
        
        setState({
          places,
          // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
          loading: false,
          
          error: false,
        })
      }
    } catch {
      // Rẽ nhánh nếu sequence.current === request.
      if (sequence.current === request) {
        
        setState((previous) => ({
          ...previous,
          // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
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
  // Khai báo cancel: useCallback giữ tham chiếu hàm theo phụ thuộc.
  const cancel = useCallback(() => {
    
    sequence.current++
  }, [])
  // TẠI SAO (cancel): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
  // và dễ bảo trì.

  // CHỨC NĂNG: Tải danh mục khi hook bắt đầu hoặc hàm reload thay đổi.
  // XỬ LÝ: Hàm return cancel vô hiệu lần tải đang chờ khi effect được thay hoặc component
  // rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: reload, cancel.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện sử dụng void reload() làm giá trị của bước hiện tại.
    void reload()
    
    return cancel
  }, [reload, cancel])
  // TẠI SAO: Không dùng kết quả của một lần tải đã lỗi thời để cập nhật màn hình mới.

  // CHỨC NĂNG: Cập nhật bản công khai trong cùng app khi Admin công bố.
  // CHỨC NĂNG: Đăng ký thay đổi catalog và gọi reload khi được thông báo.
  // XỬ LÝ: Nếu nguồn hỗ trợ subscribe, hàm return của nó dùng làm cleanup.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog, reload.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện sử dụng void reload() làm giá trị của bước hiện tại.
  useEffect(() => catalog.subscribe?.(() => { void reload() }), [catalog, reload])
  // TẠI SAO: Danh sách đang mở cần cập nhật khi nguồn dữ liệu thay đổi thay vì giữ mãi bản đã tải
  // lần đầu.

  
  return { ...state, reload }
}
// TẠI SAO (usePublishedCatalog): Cần tách chưa tải, lỗi và rỗng để người dùng không hiểu nhầm
// lỗi API là không có di tích.

// CHỨC NĂNG: Tải chi tiết theo ID cho UC04.
// XỬ LÝ: Phân biệt không tồn tại với lỗi nguồn;
// gắn state với ID để không hiện dữ liệu điểm trước đó.
// Khai báo usePublishedPlace(id). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] usePublishedPlace ====================
export function usePublishedPlace(id: string) {
  // Khai báo { catalog }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { catalog } = useVisitor()
  // CHỨC NĂNG: Bộ đếm thử lại; thay đổi giá trị này để effect tải dữ liệu chạy lại.
  // Khai báo [attempt, setAttempt]: useState(0) giữ trạng thái qua các lần render.
  const [attempt, setAttempt] = useState(0)

  // Khai báo [state, setState]: useState({ id: '', loading: true, error: null, }) giữ trạng thái qua các lần render.
  const [state, setState] = useState<{
    // Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
    id: string
    // Khai báo place không bắt buộc, kiểu PlaceRecord.
    place?: PlaceRecord
    // Khai báo loading, kiểu boolean.
    loading: boolean
    
    error: 'notFound' | 'loadError' | null
  }>({
    // Gán thuộc tính id: chuỗi ''.
    id: '',
    // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    loading: true,
    
    error: null,
  })

  // CHỨC NĂNG: Đặt trạng thái tải rồi lấy chi tiết địa điểm bằng catalog.get(id).
  // XỬ LÝ: Thành công ghi place; lỗi phân biệt notFound/loadError; cleanup đánh dấu
  // cancelled.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog, id,
  // attempt.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo cancelled: sử dụng false làm giá trị của bước hiện tại.
    let cancelled = false

    
    setState({
      id,
      // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      loading: true,
      
      error: null,
    })

    
    catalog.get(id)
      .then((place) => {
        // Rẽ nhánh nếu !cancelled.
        if (!cancelled) {
          
          setState({
            id,
            place,
            // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
            loading: false,
            
            error: null,
          })
        }
      })
      .catch((error: unknown) => {
        // Rẽ nhánh nếu !cancelled.
        if (!cancelled) {
          
          setState({
            id,
            // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
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
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => catalog.subscribe?.(() => setAttempt(value => value + 1)), [catalog])
  // TẠI SAO: Trang chi tiết đang mở cũng cần nhận nội dung vừa công bố hoặc bị rút, không chỉ danh
  // sách.

  
  const current = state.id === id
    ? state
    : {
      id,
      // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
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

// CHỨC NĂNG: Gom trạng thái tìm kiếm, lọc và sắp xếp UC03.
// XỬ LÝ: useMemo chỉ tính lại khi dữ liệu hoặc điều kiện thực sự đổi.

// ==================== [DUNG-CHUNG] usePlaceFilters ====================
export function usePlaceFilters(
  places: readonly PlaceRecord[],
  origin?: Point,
) {
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()

  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
  // Khai báo [query, setQuery]: useState('') giữ trạng thái qua các lần render.
  const [query, setQuery] = useState('')
  // Khai báo [zone, setZone]: useState(null) giữ trạng thái qua các lần render.
  const [zone, setZone] = useState<Zone | null>(null)
  // Khai báo [order, setOrder]: useState('name') giữ trạng thái qua các lần render.
  const [order, setOrder] = useState<SortOrder>('name')

  // Khai báo debounced: Gọi useDebounce(query).
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
    // Gán thuộc tính reset: khai báo callback () => { setQuery('') setZone(null) }.
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

// ==================== [DUNG-CHUNG] useVisitorPosition ====================
export function useVisitorPosition(
  getPosition: () => Promise<Point>,
) {
  // Khai báo [origin, setOrigin]: useState() giữ trạng thái qua các lần render.
  const [origin, setOrigin] = useState<Point>()
  // CHỨC NĂNG: Trạng thái đang tải để UI không coi dữ liệu chưa về là danh sách rỗng.
  // Khai báo [loading, setLoading]: useState(false) giữ trạng thái qua các lần render.
  const [loading, setLoading] = useState(false)
  // Khai báo [failed, setFailed]: useState(false) giữ trạng thái qua các lần render.
  const [failed, setFailed] = useState(false)

  // Khai báo mounted: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const mounted = useRef(true)
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.
  // Khai báo busy: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const busy = useRef(false)

  // CHỨC NĂNG: Đặt mounted.current=true khi component tồn tại, và false trong cleanup.
  // XỬ LÝ: Request vị trí kiểm tra cờ này trước khi cập nhật state sau await.
  // KHI NÀO CHẠY: Theo vòng mount của component; mảng [] không theo dõi props/state. Cleanup chạy
  // khi rời component.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện tính biểu thức mounted.current = true.
    mounted.current = true

    // Trả kết quả: khai báo callback () => { mounted.current = false }.
    return () => {
      
      mounted.current = false
    }
  }, [])
  // TẠI SAO: GPS có thể trả kết quả sau khi khách đã rời màn; cờ giúp bỏ cập nhật không còn cần
  // thiết.

  // Khai báo request: useCallback giữ tham chiếu hàm theo phụ thuộc.
  const request = useCallback(async () => {
    // Rẽ nhánh nếu busy.current. | Thoát hàm hiện tại ngay.
    if (busy.current) return

    // Thực hiện tính biểu thức busy.current = true.
    busy.current = true
    // Cập nhật trạng thái qua setLoading(true).
    setLoading(true)
    // Cập nhật trạng thái qua setFailed(false).
    setFailed(false)

    // Bắt đầu vùng try.
    try {
      // Khai báo point: await chờ Gọi getPosition().
      const point = await getPosition()

      // Rẽ nhánh nếu !validPoint(point).
      if (!validPoint(point)) {
        
        throw new Error('Invalid position')
      }

      
      if (mounted.current) setOrigin(point)
    } catch {
      // Rẽ nhánh nếu mounted.current.
      if (mounted.current) {
        // Cập nhật trạng thái qua setOrigin(undefined).
        setOrigin(undefined)
        
        setFailed(true)
      }
    } finally {
      // Thực hiện tính biểu thức busy.current = false.
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
/**
 * CHỨC NĂNG:
 * Gom điều kiện tìm kiếm/lọc theo mockup UC03.
 *
 * XỬ LÝ:
 * - Nhiều danh mục cùng nhóm kết hợp OR.
 * - Từ khóa, danh mục và khu vực kết hợp AND.
 * - initial chỉ dùng khi component được tạo.
 * - Web đổi URL sẽ đổi key component để khởi tạo lại điều kiện.
 */

// ==================== [DUNG-CHUNG] useExplore ====================
export function useExplore(
  places: readonly PlaceRecord[],
  origin?: Point,
  initial: {
    // Khai báo query không bắt buộc, kiểu string.
    query?: string
    
    category?: Category
  } = {},
) 
{
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()

  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
  // Khai báo [query, setQuery]: useState(initial.query ?? '') giữ trạng thái qua các lần render.
  const [query, setQuery] = useState(initial.query ?? '')
  // Khai báo [within, setWithin]: useState('') giữ trạng thái qua các lần render.
  const [within, setWithin] = useState('')

  
  const [categories, setCategories] = useState<Category[]>(
    initial.category ? [initial.category] : [],
  )

  // Khai báo [zones, setZones]: useState([]) giữ trạng thái qua các lần render.
  const [zones, setZones] = useState<Zone[]>([])
  // Khai báo [order, setOrder]: useState('nearest') giữ trạng thái qua các lần render.
  const [order, setOrder] = useState<SortOrder>('nearest')

  // CHỨC NĂNG: Chờ lần gõ cuối trước khi tìm.
  // XỬ LÝ: useDebounce hiện có hủy timer cũ trong cleanup.
  // Khai báo debounced: Gọi useDebounce(query + ' ' + within).
  const debounced = useDebounce(query + ' ' + within)

  // CHỨC NĂNG: Tính kết quả khi điều kiện thực sự thay đổi.
  // XỬ LÝ: Không lọc lại vì một render không liên quan.
  
  const results = useMemo(
    () => selectPlaces(places, {
      language,
      // Gán thuộc tính query: sử dụng debounced làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
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

  // Khai báo reset: khai báo callback () => { setQuery('') setWithin('') setCategories([]) setZones([]) }.
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
// Đặt tên kiểu VisitorI18n.
export type VisitorI18n = i18n