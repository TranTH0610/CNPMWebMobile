/**
 * FILE NÀY LÀM GÌ
 * Provider/hook React du khách: i18n, lựa chọn ngôn ngữ, tải danh mục, tìm kiếm và trạng thái dùng
 * chung giữa các màn.
 *
 * VỊ TRÍ: packages/visitor-core/src/react/react.tsx
 * DÙNG BỞI: apps/mobile/src/hooks/usePlaces.ts; apps/mobile/src/hooks/useVisitor.ts;
 * apps/mobile/src/i18n/index.ts; và các nơi import khác.
 * PHỤ THUỘC: react; i18next; react-i18next; ../domain/model; ../catalog/catalog; ../data/mock;
 * ../i18n/messages; ../catalog/search
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `import {`: Nhập các thành phần từ 'react'.
 * DÒNG `createContext,`: Lấy createContext từ module đang nhập.
 * DÒNG `useCallback,`: Lấy useCallback từ module đang nhập.
 * DÒNG `useContext,`: Lấy useContext từ module đang nhập.
 * DÒNG `useEffect,`: Lấy useEffect từ module đang nhập.
 * DÒNG `useMemo,`: Lấy useMemo từ module đang nhập.
 * DÒNG `useRef,`: Lấy useRef từ module đang nhập.
 * DÒNG `useState,`: Lấy useState từ module đang nhập.
 * DÒNG `type ReactNode,`: Lấy type ReactNode từ module đang nhập.
 * DÒNG `} from 'react'`: Nhập các thành phần từ 'react'.
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

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `import {`: Nhập các thành phần từ 'react-i18next'.
 * DÒNG `I18nextProvider,`: Lấy I18nextProvider từ module đang nhập.
 * DÒNG `initReactI18next,`: Lấy initReactI18next từ module đang nhập.
 * DÒNG `useTranslation,`: Lấy useTranslation từ module đang nhập.
 * DÒNG `} from 'react-i18next'`: Nhập các thành phần từ 'react-i18next'.
 */
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next'

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `import {`: Nhập các thành phần từ '../domain/model'.
 * DÒNG `languageOf,`: Lấy languageOf từ module đang nhập.
 * DÒNG `type Language,`: Lấy type Language từ module đang nhập.
 * DÒNG `type PlaceRecord,`: Lấy type PlaceRecord từ module đang nhập.
 * DÒNG `type Point,`: Lấy type Point từ module đang nhập.
 * DÒNG `type SortOrder,`: Lấy type SortOrder từ module đang nhập.
 * DÒNG `type StoragePort,`: Lấy type StoragePort từ module đang nhập.
 * DÒNG `type Zone,`: Lấy type Zone từ module đang nhập.
 * DÒNG `} from '../domain/model'`: Nhập các thành phần từ '../domain/model'.
 */
import {
  languageOf,
  type Language,
  type PlaceRecord,
  type Point,
  type SortOrder,
  type StoragePort,
  type Zone,
} from '../domain/model'

// Nhập các thành phần từ '../catalog/catalog'.
import { CatalogError, type Catalog } from '../catalog/catalog'
// Nhập các thành phần từ '../data/mock'.
import { demoCatalog } from '../data/mock'
// Nhập các thành phần từ '../i18n/messages'.
import { messages, type MessageKey } from '../i18n/messages'
// Nhập các thành phần từ '../catalog/search'.
import { distanceTo, selectPlaces, validPoint } from '../catalog/search'
// CHỨC NĂNG: Sử dụng danh mục cho bộ lọc mới.
// XỬ LÝ: categoryOf hỗ trợ cả dữ liệu chưa có category.
// Nhập các thành phần từ '../domain/model'.
import { categoryOf, type Category } from '../domain/model'

// CHỨC NĂNG: Tạo instance i18n cho toàn bộ luồng visitor.
// XỬ LÝ: UI và hook dùng cùng instance nên không bị lệch ngôn ngữ.
// Namespace visitor tách khỏi cấu hình translation cũ.
// Khai báo createVisitorI18n(). Nhận đầu vào qua tham số.
export function createVisitorI18n() {
  // Khai báo instance: Gọi createInstance().
  const instance = createInstance()

  // Khai báo ready: Gọi instance.use(initReactI18next).init({ resources: Object.fromEntries( Object.entries(messag.
  const ready = instance.use(initReactI18next).init({
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `resources: Object.fromEntries(`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { visit.
     * DÒNG `Object.entries(messages).map(([language, text]) => [`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { visit.
     * DÒNG `language,`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { visit.
     * DÒNG `{ visitor: text },`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { visit. | Gán thuộc tính visitor: sử dụng text làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `]),`: Kết thúc danh sách phần tử trong mảng.
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
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
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `escapeValue: false,`: Gán thuộc tính escapeValue: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      escapeValue: false,
    },
    // Gán thuộc tính react: tạo object gồm useSuspense.
    react: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `useSuspense: false,`: Gán thuộc tính useSuspense: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      useSuspense: false,
    },
  })

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return { instance, ready }`: Trả kết quả: tạo object gồm instance, ready. | Đặt trường instance bằng giá trị của biến cùng tên. | Đặt trường ready bằng giá trị của biến cùng tên.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `catalog: Catalog`: Khai báo catalog, kiểu Catalog.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `children: ReactNode`: Khai báo children, kiểu ReactNode.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  children: ReactNode
}

// CHỨC NĂNG: Kết nối React với instance i18n.
// XỬ LÝ: StateProvider nằm bên trong I18nextProvider để hook nhận đúng instance.
// Khai báo VisitorProvider(props). Component hàm nhận props và dựng phần giao diện VisitorProvider.
export function VisitorProvider(props: ProviderProps) {
  
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<I18nextProvider i18n={props.boot.instance}>`: Dựng I18nextProvider. | Thuộc tính i18n: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<StateProvider {...props} />`: Dựng StateProvider.
   * DÒNG `</I18nextProvider>`: Đóng phần giao diện I18nextProvider.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `function StateProvider({`: Khai báo StateProvider({ boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }). Component hàm nhận props và dựng phần giao diện StateProvider.
 * DÒNG `boot,`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 * DÒNG `storage,`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 * DÒNG `deviceLanguage,`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 * DÒNG `catalog = demoCatalog,`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 * DÒNG `loading,`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 * DÒNG `children,`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 * DÒNG `}: ProviderProps) {`: Nhận đầu vào { boot, storage, deviceLanguage, catalog = demoCatalog, loading, children, }: ProviderProps từ nơi gọi hàm.
 */
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

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const [persistenceError, setPersistenceError] =`: Khai báo [persistenceError, setPersistenceError]: useState(null) giữ trạng thái qua các lần render.
   * DÒNG `useState<VisitorState['persistenceError']>(null)`: Khai báo [persistenceError, setPersistenceError]: useState(null) giữ trạng thái qua các lần render.
   */
  const [persistenceError, setPersistenceError] =
    useState<VisitorState['persistenceError']>(null)
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.
  // Khai báo busy: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const busy = useRef(false)

  // DÒNG NÀY LÀM GÌ: Chờ i18n sẵn sàng, đọc ngôn ngữ đã lưu rồi chọn tiếng theo thứ tự lưu, thiết
  // bị, tiếng Việt.
  // CÁCH HOẠT ĐỘNG: Cờ cancelled chặn cập nhật của lần khởi tạo cũ khi provider đã rời cây giao
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
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `saved = await storage.readLanguage()`: Thực hiện tính biểu thức saved = await storage.readLanguage().
         * DÒNG `} catch {`: Bắt đầu vùng try.
         */
        saved = await storage.readLanguage()
      } catch {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `failed = true`: Thực hiện tính biểu thức failed = true.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        failed = true
      }

      // CHỨC NĂNG: Bỏ kết quả khi provider đã rời cây giao diện.
      // XỬ LÝ: Không tiếp tục cập nhật state của lần khởi tạo cũ.
      // Rẽ nhánh nếu cancelled. | Thoát hàm hiện tại ngay.
      if (cancelled) return

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `await instance.changeLanguage(`: Thực hiện await chờ Gọi instance.changeLanguage( languageOf(saved) ?? languageOf(deviceLanguage) ?? 'vi', ).
       * DÒNG `languageOf(saved)`: Thực hiện await chờ Gọi instance.changeLanguage( languageOf(saved) ?? languageOf(deviceLanguage) ?? 'vi', ).
       * DÒNG `?? languageOf(deviceLanguage)`: Thực hiện await chờ Gọi instance.changeLanguage( languageOf(saved) ?? languageOf(deviceLanguage) ?? 'vi', ).
       * DÒNG `?? 'vi',`: Thực hiện await chờ Gọi instance.changeLanguage( languageOf(saved) ?? languageOf(deviceLanguage) ?? 'vi', ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      await instance.changeLanguage(
        languageOf(saved)
        ?? languageOf(deviceLanguage)
        ?? 'vi',
      )

      // Rẽ nhánh nếu !cancelled.
      if (!cancelled) {
        // Cập nhật trạng thái qua setPersistenceError(failed ? 'readError' : null).
        setPersistenceError(failed ? 'readError' : null)
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `setReady(true)`: Cập nhật trạng thái qua setReady(true).
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        setReady(true)
      }
    }
    // TẠI SAO (initialize): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
    // quán và dễ bảo trì.

    // Thực hiện sử dụng void initialize() làm giá trị của bước hiện tại.
    void initialize()

    // Trả kết quả: khai báo callback () => { cancelled = true }.
    return () => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cancelled = true`: Thực hiện tính biểu thức cancelled = true.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [boot, storage, deviceLanguage, instance])`: Đăng ký useEffect để thực hiện tác vụ sau render.
       */
      cancelled = true
    }
  }, [boot, storage, deviceLanguage, instance])
  // TẠI SAO: Khách cần mở app ở đúng tiếng đã chọn; lỗi bộ nhớ không được làm luồng khởi tạo treo
  // mãi.

  // CHỨC NĂNG: Đổi ngôn ngữ giao diện và lưu lựa chọn.
  // XỬ LÝ: Khóa đồng bộ bằng ref để tránh bấm liên tục;
  // lỗi lưu vẫn giữ lựa chọn trong phiên và hiện thông báo.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const changeLanguage = useCallback(`: Khai báo changeLanguage: useCallback giữ tham chiếu hàm theo phụ thuộc.
   * DÒNG `async (language: Language) => {`: Khai báo changeLanguage: useCallback giữ tham chiếu hàm theo phụ thuộc.
   */
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
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `await storage.writeLanguage(language)`: Thực hiện await chờ Gọi storage.writeLanguage(language).
           * DÒNG `} catch {`: Bắt đầu vùng try.
           */
          await storage.writeLanguage(language)
        } catch {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `setPersistenceError('saveError')`: Cập nhật trạng thái qua setPersistenceError('saveError').
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `} finally {`: Bắt đầu vùng try.
           */
          setPersistenceError('saveError')
        }
      } finally {
        // Thực hiện tính biểu thức busy.current = false.
        busy.current = false
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `setSaving(false)`: Cập nhật trạng thái qua setSaving(false).
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `[instance, storage],`: Khai báo changeLanguage: useCallback giữ tham chiếu hàm theo phụ thuộc.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        setSaving(false)
      }
    },
    [instance, storage],
  )
  // TẠI SAO (changeLanguage): Đổi tiếng phải dùng văn bản và audio của cùng ngôn ngữ; không đọc
  // bài cũ bằng một lựa chọn tiếng mới.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const language =`: Gán language bằng languageOf(instance.resolvedLanguage ?? instance.language); nếu null hoặc undefined thì dùng 'vi'.
   * DÒNG `languageOf(instance.resolvedLanguage ?? instance.language)`: Gán language bằng languageOf(instance.resolvedLanguage ?? instance.language); nếu null hoặc undefined thì dùng 'vi'.
   * DÒNG `?? 'vi'`: Gán language bằng languageOf(instance.resolvedLanguage ?? instance.language); nếu null hoặc undefined thì dùng 'vi'.
   */
  const language =
    languageOf(instance.resolvedLanguage ?? instance.language)
    ?? 'vi'
   // CHỨC NĂNG: Tạo dữ liệu context dùng chung cho các màn hình.
  // XỬ LÝ: Chỉ tạo object mới khi một giá trị phụ thuộc thay đổi.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const value = useMemo(`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `() => ({`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `language,`: Đặt trường language bằng giá trị của biến cùng tên.
   * DÒNG `saving,`: Đặt trường saving bằng giá trị của biến cùng tên.
   * DÒNG `persistenceError,`: Đặt trường persistenceError bằng giá trị của biến cùng tên.
   * DÒNG `changeLanguage,`: Đặt trường changeLanguage bằng giá trị của biến cùng tên.
   * DÒNG `catalog,`: Đặt trường catalog bằng giá trị của biến cùng tên.
   * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `[`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `language,`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `saving,`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `persistenceError,`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `changeLanguage,`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `catalog,`: Khai báo value: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return <>{loading}</>`: Trả cây giao diện của component để React hiển thị.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return <>{loading}</>
  }

  // CHỨC NĂNG: Cung cấp trạng thái cho tất cả component con.
  // XỬ LÝ: children được đặt bên trong Context.Provider
  // để các hook useVisitor có thể đọc ngôn ngữ, service và dấu tim.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Context.Provider value={value}>`: Dựng Context.Provider. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `{children}`: Đưa biểu thức JavaScript children vào JSX.
   * DÒNG `</Context.Provider>`: Đóng phần giao diện Context.Provider.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
export function useVisitor() {
  // Khai báo value: Gọi useContext(Context).
  const value = useContext(Context)

  // Rẽ nhánh nếu !value.
  if (!value) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('VisitorProvider is missing')`: Ném new Error('VisitorProvider is missing').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('VisitorProvider is missing')
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return value`: Trả kết quả: sử dụng value làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return value
}
// TẠI SAO (useVisitor): Đọc cùng context tránh phát sinh nhiều bản trạng thái du khách tách rời
// nhau.

// CHỨC NĂNG: Trả hàm dịch có kiểm tra tên key.
// XỬ LÝ: Chỉ đọc namespace visitor; tự render lại khi đổi ngôn ngữ.
// Khai báo useText(). Nhận đầu vào qua tham số.
export function useText(): (key: MessageKey) => string {
  // Khai báo { t }: Gọi useTranslation('visitor').
  const { t } = useTranslation('visitor')

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return useCallback(`: Trả kết quả: useCallback giữ tham chiếu hàm theo phụ thuộc.
   * DÒNG `(key: MessageKey) => String(t(key)),`: Trả kết quả: useCallback giữ tham chiếu hàm theo phụ thuộc.
   * DÒNG `[t],`: Trả kết quả: useCallback giữ tham chiếu hàm theo phụ thuộc.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
export function useDebounce<T>(value: T, delay = 300): T {
  // Khai báo [result, setResult]: useState(value) giữ trạng thái qua các lần render.
  const [result, setResult] = useState(value)

  // DÒNG NÀY LÀM GÌ: Đặt timer để cập nhật giá trị đã debounce sau delay mili giây.
  // CÁCH HOẠT ĐỘNG: Hàm return clearTimeout của lịch vừa tạo trước khi effect chạy lại hoặc
  // component rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: value, delay.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const timer = setTimeout(`: Khai báo timer: setTimeout lên lịch tác vụ một lần.
     * DÒNG `() => setResult(value),`: Khai báo timer: setTimeout lên lịch tác vụ một lần.
     * DÒNG `delay,`: Khai báo timer: setTimeout lên lịch tác vụ một lần.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    const timer = setTimeout(
      () => setResult(value),
      delay,
    )

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => clearTimeout(timer)`: Trả kết quả: khai báo callback () => clearTimeout(timer).
     * DÒNG `}, [value, delay])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    return () => clearTimeout(timer)
  }, [value, delay])
  // TẠI SAO: Gõ tiếp trong khoảng chờ phải hủy giá trị trước; chỉ lần thay đổi cuối mới được đưa
  // vào tìm kiếm.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return result`: Trả kết quả: sử dụng result làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return result
}
// TẠI SAO (useDebounce): Gõ liên tục không cần lọc ở từng phím; hủy lịch cũ để chỉ giá trị cuối
// được áp dụng sau khoảng chờ.

// CHỨC NĂNG: Tải, làm mới và thử lại danh sách UC02.
// XỬ LÝ: Mỗi request có số thứ tự; phản hồi cũ không ghi đè phản hồi mới.
// Khai báo usePublishedCatalog(). Nhận đầu vào qua tham số.
export function usePublishedCatalog() {
  // Khai báo { catalog }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { catalog } = useVisitor()

  // Khai báo [state, setState]: useState({ places: [], loading: true, error: false, }) giữ trạng thái qua các lần render.
  const [state, setState] = useState<{
    // Khai báo places, kiểu PlaceRecord[].
    places: PlaceRecord[]
    // Khai báo loading, kiểu boolean.
    loading: boolean
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `error: boolean`: Khai báo error, kiểu boolean.
     * DÒNG `}>({`: Thành phần kiểu `}>({` giới hạn hình dạng dữ liệu cho TypeScript.
     */
    error: boolean
  }>({
    // Gán thuộc tính places: tạo mảng [].
    places: [],
    // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    loading: true,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `error: false,`: Gán thuộc tính error: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    error: false,
  })

  // Khai báo sequence: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const sequence = useRef(0)

  // Khai báo reload: useCallback giữ tham chiếu hàm theo phụ thuộc.
  const reload = useCallback(async () => {
    // Khai báo request: sử dụng ++sequence.current làm giá trị của bước hiện tại.
    const request = ++sequence.current

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `setState((previous) => ({`: Cập nhật trạng thái qua setState((previous) => ({ ...previous, loading: true, error: false, })).
     * DÒNG `...previous,`: Cập nhật trạng thái qua setState((previous) => ({ ...previous, loading: true, error: false, })).
     */
    setState((previous) => ({
      ...previous,
      // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      loading: true,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `error: false,`: Gán thuộc tính error: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `}))`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      error: false,
    }))

    // Bắt đầu vùng try.
    try {
      // Khai báo places: await chờ Gọi catalog.list().
      const places = await catalog.list()

      // Rẽ nhánh nếu sequence.current === request.
      if (sequence.current === request) {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `setState({`: Cập nhật trạng thái qua setState({ places, loading: false, error: false, }).
         * DÒNG `places,`: Đặt trường places bằng giá trị của biến cùng tên.
         */
        setState({
          places,
          // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
          loading: false,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `error: false,`: Gán thuộc tính error: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `} catch {`: Bắt đầu vùng try.
           */
          error: false,
        })
      }
    } catch {
      // Rẽ nhánh nếu sequence.current === request.
      if (sequence.current === request) {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `setState((previous) => ({`: Cập nhật trạng thái qua setState((previous) => ({ ...previous, loading: false, error: true, })).
         * DÒNG `...previous,`: Cập nhật trạng thái qua setState((previous) => ({ ...previous, loading: false, error: true, })).
         */
        setState((previous) => ({
          ...previous,
          // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
          loading: false,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `error: true,`: Gán thuộc tính error: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `}))`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}, [catalog])`: Khai báo reload: useCallback giữ tham chiếu hàm theo phụ thuộc.
           */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `sequence.current++`: Thực hiện sử dụng sequence.current++ làm giá trị của bước hiện tại.
     * DÒNG `}, [])`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    sequence.current++
  }, [])
  // TẠI SAO (cancel): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
  // và dễ bảo trì.

  // DÒNG NÀY LÀM GÌ: Tải danh mục khi hook bắt đầu hoặc hàm reload thay đổi.
  // CÁCH HOẠT ĐỘNG: Hàm return cancel vô hiệu lần tải đang chờ khi effect được thay hoặc component
  // rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: reload, cancel.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện sử dụng void reload() làm giá trị của bước hiện tại.
    void reload()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return cancel`: Trả kết quả: sử dụng cancel làm giá trị của bước hiện tại.
     * DÒNG `}, [reload, cancel])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    return cancel
  }, [reload, cancel])
  // TẠI SAO: Không dùng kết quả của một lần tải đã lỗi thời để cập nhật màn hình mới.

  // CHỨC NĂNG: Cập nhật bản công khai trong cùng app khi Admin công bố.
  // DÒNG NÀY LÀM GÌ: Đăng ký thay đổi catalog và gọi reload khi được thông báo.
  // CÁCH HOẠT ĐỘNG: Nếu nguồn hỗ trợ subscribe, hàm return của nó dùng làm cleanup.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog, reload.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện sử dụng void reload() làm giá trị của bước hiện tại.
  useEffect(() => catalog.subscribe?.(() => { void reload() }), [catalog, reload])
  // TẠI SAO: Danh sách đang mở cần cập nhật khi nguồn dữ liệu thay đổi thay vì giữ mãi bản đã tải
  // lần đầu.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return { ...state, reload }`: Trả kết quả: tạo object gồm ...giá trị ghép, reload. | Đặt trường reload bằng giá trị của biến cùng tên.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return { ...state, reload }
}
// TẠI SAO (usePublishedCatalog): Cần tách chưa tải, lỗi và rỗng để người dùng không hiểu nhầm
// lỗi API là không có di tích.

// CHỨC NĂNG: Tải chi tiết theo ID cho UC04.
// XỬ LÝ: Phân biệt không tồn tại với lỗi nguồn;
// gắn state với ID để không hiện dữ liệu điểm trước đó.
// Khai báo usePublishedPlace(id). Nhận đầu vào qua tham số.
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `error: 'notFound' | 'loadError' | null`: Khai báo error, kiểu 'notFound' | 'loadError' | null.
     * DÒNG `}>({`: Thành phần kiểu `}>({` giới hạn hình dạng dữ liệu cho TypeScript.
     */
    error: 'notFound' | 'loadError' | null
  }>({
    // Gán thuộc tính id: chuỗi ''.
    id: '',
    // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    loading: true,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `error: null,`: Gán thuộc tính error: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    error: null,
  })

  // DÒNG NÀY LÀM GÌ: Đặt trạng thái tải rồi lấy chi tiết địa điểm bằng catalog.get(id).
  // CÁCH HOẠT ĐỘNG: Thành công ghi place; lỗi phân biệt notFound/loadError; cleanup đánh dấu
  // cancelled.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog, id,
  // attempt.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo cancelled: sử dụng false làm giá trị của bước hiện tại.
    let cancelled = false

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `setState({`: Cập nhật trạng thái qua setState({ id, loading: true, error: null, }).
     * DÒNG `id,`: Đặt trường id bằng giá trị của biến cùng tên.
     */
    setState({
      id,
      // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      loading: true,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `error: null,`: Gán thuộc tính error: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      error: null,
    })

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `catalog.get(id)`: Thực hiện Gọi catalog.get(id) .then((place) => { if (!cancelled) { setState({ id, place, loading: false,.
     * DÒNG `.then((place) => {`: Thực hiện Gọi catalog.get(id) .then((place) => { if (!cancelled) { setState({ id, place, loading: false,.
     */
    catalog.get(id)
      .then((place) => {
        // Rẽ nhánh nếu !cancelled.
        if (!cancelled) {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `setState({`: Cập nhật trạng thái qua setState({ id, place, loading: false, error: null, }).
           * DÒNG `id,`: Đặt trường id bằng giá trị của biến cùng tên.
           * DÒNG `place,`: Đặt trường place bằng giá trị của biến cùng tên.
           */
          setState({
            id,
            place,
            // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
            loading: false,
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `error: null,`: Gán thuộc tính error: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
             * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `.catch((error: unknown) => {`: Thực hiện Gọi catalog.get(id) .then((place) => { if (!cancelled) { setState({ id, place, loading: false,.
             */
            error: null,
          })
        }
      })
      .catch((error: unknown) => {
        // Rẽ nhánh nếu !cancelled.
        if (!cancelled) {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `setState({`: Cập nhật trạng thái qua setState({ id, loading: false, error: error instanceof CatalogError ? 'notFound' : 'loadError', }).
           * DÒNG `id,`: Đặt trường id bằng giá trị của biến cùng tên.
           */
          setState({
            id,
            // Gán thuộc tính loading: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
            loading: false,
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `error: error instanceof CatalogError`: Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện error instanceof CatalogError.
             * DÒNG `? 'notFound'`: Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện error instanceof CatalogError.
             * DÒNG `: 'loadError',`: Gán thuộc tính error: chọn giữa hai giá trị theo điều kiện error instanceof CatalogError.
             * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            error: error instanceof CatalogError
              ? 'notFound'
              : 'loadError',
          })
        }
      })

    // Trả kết quả: khai báo callback () => { cancelled = true }.
    return () => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cancelled = true`: Thực hiện tính biểu thức cancelled = true.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [catalog, id, attempt])`: Đăng ký useEffect để thực hiện tác vụ sau render.
       */
      cancelled = true
    }
  }, [catalog, id, attempt])
  // TẠI SAO: ID hoặc lần thử lại có thể đổi khi request cũ chưa xong; không cho phản hồi cũ ghi đè
  // địa điểm đang xem.

  // DÒNG NÀY LÀM GÌ: Khi catalog thông báo thay đổi, tăng attempt để luồng tải chi tiết chạy lại.
  // CÁCH HOẠT ĐỘNG: React dùng hàm unsubscribe mà catalog trả về để dọn đăng ký.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => catalog.subscribe?.(() => setAttempt(value => value + 1)), [catalog])
  // TẠI SAO: Trang chi tiết đang mở cũng cần nhận nội dung vừa công bố hoặc bị rút, không chỉ danh
  // sách.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const current = state.id === id`: Khai báo current: chọn giữa hai giá trị theo điều kiện state.id === id.
   * DÒNG `? state`: Khai báo current: chọn giữa hai giá trị theo điều kiện state.id === id.
   * DÒNG `: {`: Khai báo current: chọn giữa hai giá trị theo điều kiện state.id === id.
   * DÒNG `id,`: Đặt trường id bằng giá trị của biến cùng tên.
   */
  const current = state.id === id
    ? state
    : {
      id,
      // Gán thuộc tính loading: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      loading: true,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `error: null,`: Gán thuộc tính error: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      error: null,
    }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm ...giá trị ghép, retry.
   * DÒNG `...current,`: Trả kết quả: tạo object gồm ...giá trị ghép, retry.
   */
  return {
    ...current,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `retry: () => setAttempt((value) => value + 1),`: Gán thuộc tính retry: khai báo callback () => setAttempt((value) => value + 1).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    retry: () => setAttempt((value) => value + 1),
  }
}
// TẠI SAO (usePublishedPlace): Đổi ID hoặc thử lại có thể còn request cũ; chỉ kết quả của lần
// đang cần được cập nhật vào UI.

// CHỨC NĂNG: Gom trạng thái tìm kiếm, lọc và sắp xếp UC03.
// XỬ LÝ: useMemo chỉ tính lại khi dữ liệu hoặc điều kiện thực sự đổi.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function usePlaceFilters(`: Khai báo usePlaceFilters(places, origin). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly PlaceRecord[],`: Nhận đầu vào places: readonly PlaceRecord[] từ nơi gọi hàm.
 * DÒNG `origin?: Point,`: Nhận đầu vào origin?: Point từ nơi gọi hàm.
 * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
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

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const results = useMemo(`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `() => selectPlaces(places, {`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `language,`: Đặt trường language bằng giá trị của biến cùng tên.
   */
  const results = useMemo(
    () => selectPlaces(places, {
      language,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: debounced,`: Gán thuộc tính query: sử dụng debounced làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `zone,`: Đặt trường zone bằng giá trị của biến cùng tên.
       * DÒNG `order,`: Đặt trường order bằng giá trị của biến cùng tên.
       * DÒNG `origin,`: Đặt trường origin bằng giá trị của biến cùng tên.
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `[places, language, debounced, zone, order, origin],`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      query: debounced,
      zone,
      order,
      origin,
    }),
    [places, language, debounced, zone, order, origin],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const zones = useMemo(`: Khai báo zones: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `() => [...new Set(places.map((place) => place.zone))],`: Khai báo zones: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `[places],`: Khai báo zones: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const zones = useMemo(
    () => [...new Set(places.map((place) => place.zone))],
    [places],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const effectiveOrder: SortOrder =`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `order === 'nearest'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `&& results.some(`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `(place) => distanceTo(place, origin) !== undefined,`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `? 'nearest'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `: 'name'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   */
  const effectiveOrder: SortOrder =
    order === 'nearest'
      && results.some(
        (place) => distanceTo(place, origin) !== undefined,
      )
      ? 'nearest'
      : 'name'

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm query, setQuery, zone, setZone, order, setOrder, effectiveOrder, results, zones.
   * DÒNG `query,`: Đặt trường query bằng giá trị của biến cùng tên.
   * DÒNG `setQuery,`: Đặt trường setQuery bằng giá trị của biến cùng tên.
   * DÒNG `zone,`: Đặt trường zone bằng giá trị của biến cùng tên.
   * DÒNG `setZone,`: Đặt trường setZone bằng giá trị của biến cùng tên.
   * DÒNG `order,`: Đặt trường order bằng giá trị của biến cùng tên.
   * DÒNG `setOrder,`: Đặt trường setOrder bằng giá trị của biến cùng tên.
   * DÒNG `effectiveOrder,`: Đặt trường effectiveOrder bằng giá trị của biến cùng tên.
   * DÒNG `results,`: Đặt trường results bằng giá trị của biến cùng tên.
   * DÒNG `zones,`: Đặt trường zones bằng giá trị của biến cùng tên.
   */
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
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `setZone(null)`: Cập nhật trạng thái qua setZone(null).
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      setZone(null)
    },
  }
}
// TẠI SAO (usePlaceFilters): Tập trung điều kiện lọc giúp số kết quả, phân trang và danh sách
// dùng cùng trạng thái.

// CHỨC NĂNG: Xin vị trí khi người dùng chủ động bấm.
// XỬ LÝ: Bắt lỗi quyền/GPS, chặn yêu cầu lặp,
// tránh cập nhật state sau khi component đã unmount.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function useVisitorPosition(`: Khai báo useVisitorPosition(getPosition). Nhận đầu vào qua tham số.
 * DÒNG `getPosition: () => Promise<Point>,`: Nhận đầu vào getPosition: () => Promise<Point> từ nơi gọi hàm.
 * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
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

  // DÒNG NÀY LÀM GÌ: Đặt mounted.current=true khi component tồn tại, và false trong cleanup.
  // CÁCH HOẠT ĐỘNG: Request vị trí kiểm tra cờ này trước khi cập nhật state sau await.
  // KHI NÀO CHẠY: Theo vòng mount của component; mảng [] không theo dõi props/state. Cleanup chạy
  // khi rời component.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện tính biểu thức mounted.current = true.
    mounted.current = true

    // Trả kết quả: khai báo callback () => { mounted.current = false }.
    return () => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `mounted.current = false`: Thực hiện tính biểu thức mounted.current = false.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [])`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
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
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `throw new Error('Invalid position')`: Ném new Error('Invalid position').
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        throw new Error('Invalid position')
      }

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (mounted.current) setOrigin(point)`: Rẽ nhánh nếu mounted.current. | Cập nhật trạng thái qua setOrigin(point).
       * DÒNG `} catch {`: Bắt đầu vùng try.
       */
      if (mounted.current) setOrigin(point)
    } catch {
      // Rẽ nhánh nếu mounted.current.
      if (mounted.current) {
        // Cập nhật trạng thái qua setOrigin(undefined).
        setOrigin(undefined)
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `setFailed(true)`: Cập nhật trạng thái qua setFailed(true).
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `} finally {`: Bắt đầu vùng try.
         */
        setFailed(true)
      }
    } finally {
      // Thực hiện tính biểu thức busy.current = false.
      busy.current = false

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (mounted.current) setLoading(false)`: Rẽ nhánh nếu mounted.current. | Cập nhật trạng thái qua setLoading(false).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [getPosition])`: Khai báo request: useCallback giữ tham chiếu hàm theo phụ thuộc.
       */
      if (mounted.current) setLoading(false)
    }
  }, [getPosition])
  // TẠI SAO (request): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return { origin, loading, failed, request }`: Trả kết quả: tạo object gồm origin, loading, failed, request. | Đặt trường origin bằng giá trị của biến cùng tên. | Đặt trường loading bằng giá trị của biến cùng tên. | Đặt trường failed bằng giá trị của biến cùng tên. | Đặt trường request bằng giá trị của biến cùng tên.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function useExplore(`: Khai báo useExplore(places, origin, initial). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly PlaceRecord[],`: Nhận đầu vào places: readonly PlaceRecord[] từ nơi gọi hàm.
 * DÒNG `origin?: Point,`: Nhận đầu vào origin?: Point từ nơi gọi hàm.
 * DÒNG `initial: {`: Nhận đầu vào initial: { query?: string category?: Category } = {} từ nơi gọi hàm.
 */
export function useExplore(
  places: readonly PlaceRecord[],
  origin?: Point,
  initial: {
    // Khai báo query không bắt buộc, kiểu string.
    query?: string
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `category?: Category`: Khai báo category không bắt buộc, kiểu Category.
     * DÒNG `} = {},`: Thành phần kiểu `} = {},` giới hạn hình dạng dữ liệu cho TypeScript.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
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

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const [categories, setCategories] = useState<Category[]>(`: Khai báo [categories, setCategories]: useState(initial.category ? [initial.category] : []) giữ trạng thái qua các lần render.
   * DÒNG `initial.category ? [initial.category] : [],`: Khai báo [categories, setCategories]: useState(initial.category ? [initial.category] : []) giữ trạng thái qua các lần render.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const results = useMemo(`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `() => selectPlaces(places, {`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `language,`: Đặt trường language bằng giá trị của biến cùng tên.
   */
  const results = useMemo(
    () => selectPlaces(places, {
      language,
      // Gán thuộc tính query: sử dụng debounced làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      query: debounced,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `zone: null,`: Gán thuộc tính zone: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `order,`: Đặt trường order bằng giá trị của biến cùng tên.
       * DÒNG `origin,`: Đặt trường origin bằng giá trị của biến cùng tên.
       * DÒNG `categories,`: Đặt trường categories bằng giá trị của biến cùng tên.
       * DÒNG `zones,`: Đặt trường zones bằng giá trị của biến cùng tên.
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `[`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       * DÒNG `places,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `language,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `debounced,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `order,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `origin,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `categories,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `zones,`: Khai báo results: useMemo lưu kết quả theo mảng phụ thuộc.
       * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
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

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const availableCategories = useMemo(`: Khai báo availableCategories: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `() => [...new Set(places.map(categoryOf))],`: Khai báo availableCategories: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `[places],`: Khai báo availableCategories: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const availableCategories = useMemo(
    () => [...new Set(places.map(categoryOf))],
    [places],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const availableZones = useMemo(`: Khai báo availableZones: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `() => [...new Set(places.map((place) => place.zone))],`: Khai báo availableZones: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `[places],`: Khai báo availableZones: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const availableZones = useMemo(
    () => [...new Set(places.map((place) => place.zone))],
    [places],
  )

  // CHỨC NĂNG: Cho UI biết cách sắp xếp thực tế.
  // XỬ LÝ: Không giả là gần nhất khi thiếu vị trí/tọa độ xác nhận.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const effectiveOrder: SortOrder =`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `order === 'nearest'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `&& results.some(`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `(place) => distanceTo(place, origin) !== undefined,`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `? 'nearest'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   * DÒNG `: 'name'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện order === 'nearest' && results.some( (place) => distanceTo(p.
   */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `setZones([])`: Cập nhật trạng thái qua setZones([]).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    setZones([])
  }
  // TẠI SAO (reset): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm query, setQuery, within, setWithin, categories, setCategories, zones, setZones, order.
   * DÒNG `query,`: Đặt trường query bằng giá trị của biến cùng tên.
   * DÒNG `setQuery,`: Đặt trường setQuery bằng giá trị của biến cùng tên.
   * DÒNG `within,`: Đặt trường within bằng giá trị của biến cùng tên.
   * DÒNG `setWithin,`: Đặt trường setWithin bằng giá trị của biến cùng tên.
   * DÒNG `categories,`: Đặt trường categories bằng giá trị của biến cùng tên.
   * DÒNG `setCategories,`: Đặt trường setCategories bằng giá trị của biến cùng tên.
   * DÒNG `zones,`: Đặt trường zones bằng giá trị của biến cùng tên.
   * DÒNG `setZones,`: Đặt trường setZones bằng giá trị của biến cùng tên.
   * DÒNG `order,`: Đặt trường order bằng giá trị của biến cùng tên.
   * DÒNG `setOrder,`: Đặt trường setOrder bằng giá trị của biến cùng tên.
   * DÒNG `results,`: Đặt trường results bằng giá trị của biến cùng tên.
   * DÒNG `availableCategories,`: Đặt trường availableCategories bằng giá trị của biến cùng tên.
   * DÒNG `availableZones,`: Đặt trường availableZones bằng giá trị của biến cùng tên.
   * DÒNG `effectiveOrder,`: Đặt trường effectiveOrder bằng giá trị của biến cùng tên.
   * DÒNG `reset,`: Đặt trường reset bằng giá trị của biến cùng tên.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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