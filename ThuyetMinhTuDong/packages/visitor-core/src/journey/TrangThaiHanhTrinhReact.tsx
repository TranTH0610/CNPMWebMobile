/**
 * FILE: packages/visitor-core/src/journey/TrangThaiHanhTrinhReact.tsx
 * FILE NÀY LÀM GÌ: Kết nối JourneyController với React để các màn cùng dùng một trạng thái GPS và phiên nghe.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { JourneyController, type JourneyPorts } from './HanhTrinh'
import { MAP_POINTS, VISIT_ROUTES } from './DuLieuHanhTrinh'
import { useVisitor } from '../react/TrangThaiReact'

export type JourneyAdapters = Omit<JourneyPorts, 'catalog' | 'positions' | 'routes'>
const Context = createContext<JourneyController | null>(null)

// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider JourneyProvider.
// [UC06 / UC07 / UC08] JourneyProvider — Giữ một JourneyController và nối trạng thái nghe/GPS với cây React.
export function JourneyProvider({ adapters, children }: { adapters: JourneyAdapters; children: ReactNode }) {
  const { catalog, language } = useVisitor()
  // CHỨC NĂNG: Giữ một controller hành trình theo các phụ thuộc đã khai báo.
  const engine = useMemo(() => new JourneyController({ ...adapters, catalog, positions: MAP_POINTS, routes: VISIT_ROUTES }), [adapters, catalog])
  // CHỨC NĂNG: Đọc tiến độ nhưng chỉ đề nghị tiếp tục, không tự phát.
  // XỬ LÝ: Cleanup dừng GPS, giải phóng player và vô hiệu hóa request tải cũ.
  // CHỨC NĂNG: Khởi động JourneyController khi provider được gắn hoặc nhận engine khác.
  // XỬ LÝ: Hàm return gọi engine.dispose() để dọn controller của lần effect này.
  useEffect(() => { void engine.start(); return () => engine.dispose() }, [engine])
  // TẠI SAO: Audio, GPS và tiến độ cần một vòng đời rõ ràng; render không được tự khởi tạo lại cả
  // phiên nghe.
  // CHỨC NĂNG: Đăng ký thay đổi của catalog; có thông báo thì cập nhật lại danh mục trong
  // engine.
  // XỬ LÝ: Nếu catalog có subscribe thì hàm hủy đăng ký được trả thẳng cho React cleanup.
  useEffect(() => catalog.subscribe?.(() => { void engine.refreshCatalog() }), [catalog, engine])
  // TẠI SAO: Nội dung mới công bố cần đến được phiên hành trình đang mở mà không buộc khách khởi
  // động lại app.
  // CHỨC NĂNG: Gọi engine.changeLanguage(language) để đồng bộ lựa chọn tiếng với phiên nghe.
  // XỬ LÝ: Engine quyết định có bản thu phù hợp và giữ trạng thái phát/tạm dừng theo
  // nghiệp vụ.
  useEffect(() => { engine.changeLanguage(language) }, [engine, language])
  // TẠI SAO: Giao diện đổi tiếng nhưng audio vẫn ở tiếng cũ sẽ làm trải nghiệm không nhất quán.
  
  return <Context.Provider value={engine}>{children}</Context.Provider>
}
// TẠI SAO (JourneyProvider): Các component con cần cùng một nguồn trạng thái; tạo riêng ở từng
// màn sẽ mất đồng bộ.

// CHỨC NĂNG: Đọc controller và trạng thái hành trình.
// XỬ LÝ: Các màn dùng cùng phiên nghe; đổi màn không tự mở thêm nguồn audio.
// [UC06 / UC07 / UC08] useJourney — Lấy controller và trạng thái hành trình dùng chung giữa các màn.
export function useJourney() {
  const engine = useContext(Context)
  if (!engine) throw new Error('JourneyProvider is missing')
  // CHỨC NĂNG: Đăng ký kho trạng thái của controller để UI cập nhật theo audio thật, không tự chạy
  // đồng hồ giả.
  const state = useSyncExternalStore(engine.subscribe, engine.snapshot, engine.snapshot)
  const { changeLanguage } = useVisitor()
  // Trả kết quả: tạo object gồm engine, state, resumeSaved. | Đặt trường engine bằng giá trị của biến cùng tên. | Đặt trường state bằng giá trị của biến cùng tên. | Gán thuộc tính resumeSaved: khai báo callback async () => { const language = state.restore?.language if (language) { awai.
  return { engine, state, resumeSaved: async () => {
    const language = state.restore?.language
    
    if (language) { await changeLanguage(language); await engine.restorePlay() }
  } }
}
// TẠI SAO (useJourney): Danh sách, chi tiết và trình nghe cần cùng phiên audio; nếu mỗi màn tự
// tạo controller sẽ dễ phát chồng.

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi trang khi đang nghe: player không bị tạo lại.
 * - Tải lại ứng dụng: chỉ hiện lời nhắc, chưa tự phát.
 */
