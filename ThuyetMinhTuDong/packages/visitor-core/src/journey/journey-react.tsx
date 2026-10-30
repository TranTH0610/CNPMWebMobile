/**
 * FILE NÀY LÀM GÌ
 * Provider và hook đưa JourneyController vào React; các màn đọc cùng một phiên hành trình.
 *
 * VỊ TRÍ: packages/visitor-core/src/journey/journey-react.tsx
 * DÙNG BỞI: apps/mobile/src/hooks/useJourney.ts; apps/mobile/src/providers/AppProviders.tsx;
 * apps/mobile/src/services/journeyAdapters.ts; và các nơi import khác.
 * PHỤ THUỘC: react; ./journey; ./journey-data; ../react/react
 * TẠI SAO TÁCH FILE: Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng
 * một nghiệp vụ.
 */
// Nhập các thành phần từ 'react'.
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
// Nhập các thành phần từ './journey'.
import { JourneyController, type JourneyPorts } from './journey'
// Nhập các thành phần từ './journey-data'.
import { MAP_POINTS, VISIT_ROUTES } from './journey-data'
// Nhập các thành phần từ '../react/react'.
import { useVisitor } from '../react/react'

// Đặt tên kiểu JourneyAdapters.
export type JourneyAdapters = Omit<JourneyPorts, 'catalog' | 'positions' | 'routes'>
// Khai báo Context: Gọi createContext<JourneyController | null>(null).
const Context = createContext<JourneyController | null>(null)

// Khai báo JourneyProvider({ adapters, children }). Component hàm nhận props và dựng phần giao diện JourneyProvider. | Khai báo adapters, kiểu JourneyAdapters. | Khai báo children, kiểu ReactNode.
export function JourneyProvider({ adapters, children }: { adapters: JourneyAdapters; children: ReactNode }) {
  // Khai báo { catalog, language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { catalog, language } = useVisitor()
  // CHỨC NĂNG: Giữ một controller hành trình theo các phụ thuộc đã khai báo.
  // Khai báo engine: useMemo lưu kết quả theo mảng phụ thuộc. | Đặt trường catalog bằng giá trị của biến cùng tên. | Gán thuộc tính positions: sử dụng MAP_POINTS làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính routes: sử dụng VISIT_ROUTES làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const engine = useMemo(() => new JourneyController({ ...adapters, catalog, positions: MAP_POINTS, routes: VISIT_ROUTES }), [adapters, catalog])
  // CHỨC NĂNG: Đọc tiến độ nhưng chỉ đề nghị tiếp tục, không tự phát.
  // XỬ LÝ: Cleanup dừng GPS, giải phóng player và vô hiệu hóa request tải cũ.
  // DÒNG NÀY LÀM GÌ: Khởi động JourneyController khi provider được gắn hoặc nhận engine khác.
  // CÁCH HOẠT ĐỘNG: Hàm return gọi engine.dispose() để dọn controller của lần effect này.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện sử dụng void engine.start() làm giá trị của bước hiện tại. | Trả kết quả: khai báo callback () => engine.dispose().
  useEffect(() => { void engine.start(); return () => engine.dispose() }, [engine])
  // TẠI SAO: Audio, GPS và tiến độ cần một vòng đời rõ ràng; render không được tự khởi tạo lại cả
  // phiên nghe.
  // DÒNG NÀY LÀM GÌ: Đăng ký thay đổi của catalog; có thông báo thì cập nhật lại danh mục trong
  // engine.
  // CÁCH HOẠT ĐỘNG: Nếu catalog có subscribe thì hàm hủy đăng ký được trả thẳng cho React cleanup.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: catalog, engine.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện sử dụng void engine.refreshCatalog() làm giá trị của bước hiện tại.
  useEffect(() => catalog.subscribe?.(() => { void engine.refreshCatalog() }), [catalog, engine])
  // TẠI SAO: Nội dung mới công bố cần đến được phiên hành trình đang mở mà không buộc khách khởi
  // động lại app.
  // DÒNG NÀY LÀM GÌ: Gọi engine.changeLanguage(language) để đồng bộ lựa chọn tiếng với phiên nghe.
  // CÁCH HOẠT ĐỘNG: Engine quyết định có bản thu phù hợp và giữ trạng thái phát/tạm dừng theo
  // nghiệp vụ.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine, language.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện Gọi engine.changeLanguage(language).
  useEffect(() => { engine.changeLanguage(language) }, [engine, language])
  // TẠI SAO: Giao diện đổi tiếng nhưng audio vẫn ở tiếng cũ sẽ làm trải nghiệm không nhất quán.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <Context.Provider value={engine}>{children}</Context.Provider>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <Context.Provider value={engine}>{children}</Context.Provider>
}
// TẠI SAO (JourneyProvider): Các component con cần cùng một nguồn trạng thái; tạo riêng ở từng
// màn sẽ mất đồng bộ.

// CHỨC NĂNG: Đọc controller và trạng thái hành trình.
// XỬ LÝ: Các màn dùng cùng phiên nghe; đổi màn không tự mở thêm nguồn audio.
// Khai báo useJourney(). Nhận đầu vào qua tham số.
export function useJourney() {
  // Khai báo engine: Gọi useContext(Context).
  const engine = useContext(Context)
  // Rẽ nhánh nếu !engine. | Ném new Error('JourneyProvider is missing').
  if (!engine) throw new Error('JourneyProvider is missing')
  // CHỨC NĂNG: Đăng ký kho trạng thái của controller để UI cập nhật theo audio thật, không tự chạy
  // đồng hồ giả.
  // Khai báo state: useSyncExternalStore đăng ký kho trạng thái bên ngoài React và đọc snapshot để giao diện theo đúng controller.
  const state = useSyncExternalStore(engine.subscribe, engine.snapshot, engine.snapshot)
  // Khai báo { changeLanguage }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { changeLanguage } = useVisitor()
  // Trả kết quả: tạo object gồm engine, state, resumeSaved. | Đặt trường engine bằng giá trị của biến cùng tên. | Đặt trường state bằng giá trị của biến cùng tên. | Gán thuộc tính resumeSaved: khai báo callback async () => { const language = state.restore?.language if (language) { awai.
  return { engine, state, resumeSaved: async () => {
    // Khai báo language: đọc state.restore?.language từ đối tượng/mảng để dùng tại bước hiện tại.
    const language = state.restore?.language
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (language) { await changeLanguage(language); await engine.restorePlay() }`: Rẽ nhánh nếu language. | Thực hiện await chờ Gọi changeLanguage(language). | Thực hiện await chờ Gọi engine.restorePlay().
     * DÒNG `} }`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (language) { await changeLanguage(language); await engine.restorePlay() }
  } }
}
// TẠI SAO (useJourney): Danh sách, chi tiết và trình nghe cần cùng phiên audio; nếu mỗi màn tự
// tạo controller sẽ dễ phát chồng.

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi trang khi đang nghe: player không bị tạo lại.
 * - Tải lại ứng dụng: chỉ hiện lời nhắc, chưa tự phát.
 */
