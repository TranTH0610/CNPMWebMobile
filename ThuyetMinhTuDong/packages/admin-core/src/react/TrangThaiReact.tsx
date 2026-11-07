/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Provider/hook React quản trị; đọc service, phản hồi thao tác, cập nhật dữ liệu và hook thống kê
 *
 * VỊ TRÍ: packages/admin-core/src/react/TrangThaiReact.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/admin-core/src/react/useBienTapDiTich.ts
 *
 * PHỤ THUỘC:
 * - react
 * - @travelguide/visitor-core/react
 * - ../domain/HopDongDichVu
 * - ../domain/KieuDuLieuQuanTri
 * - ../i18n/BanDichGiaoDien
 * - ./useBienTapDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminProvider
 * 2. useAdminText
 * 3. useAdmin
 * 4. useGateStatistics
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useVisitor } from '@travelguide/visitor-core/react'
import type { AdminService } from '../domain/HopDongDichVu'
import {
  AdminError,
  type AdminDocument,
  type AdminErrorCode,
  type AdminIdentity,
} from '../domain/KieuDuLieuQuanTri'
import { adminMessages, type AdminTextKey } from '../i18n/BanDichGiaoDien'

const Context = createContext<AdminService | null>(null)

// ==================== [DUNG-CHUNG] AdminProvider ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider AdminProvider.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function AdminProvider({
  service,
  children,
}: {
  service: AdminService
  children: ReactNode
}) {
  return <Context.Provider value={service}>{children}</Context.Provider>
}
// TẠI SAO (AdminProvider): Các component con cần cùng một nguồn trạng thái; tạo riêng ở từng màn
// sẽ mất đồng bộ.
// CHỨC NĂNG: Lấy hàm dịch giao diện quản trị.
// XỬ LÝ: Dùng chung tài nguyên ngôn ngữ để nhãn admin web/mobile có cùng nghĩa.

// ==================== [DUNG-CHUNG] useAdminText ====================
export function useAdminText() {
  const { language } = useVisitor()

  return useCallback((key: AdminTextKey): string => adminMessages[language][key], [language])
}
// TẠI SAO (useAdminText): Các trang quản trị cần dùng cùng bộ khóa dịch để web/mobile có nhãn và
// thông báo nhất quán.
// CHỨC NĂNG: Đọc trạng thái và thao tác quản trị từ context.
// XỬ LÝ: Không tạo một service hoặc kho dữ liệu mới cho mỗi màn hình.

// ==================== [DUNG-CHUNG] useAdmin ====================
export function useAdmin() {
  const service = useContext(Context)

  if (!service) throw new Error('AdminProvider missing')

  const [data, setData] = useState<AdminDocument | null>(null)

  const [identity, setIdentity] = useState<AdminIdentity | null>(null)
  // CHỨC NĂNG: Trạng thái lỗi để giao diện hiển thị thông báo và cho thử lại.

  const [error, setError] = useState<AdminErrorCode | null>(null)
  // CHỨC NĂNG: Trạng thái đang tải để UI không coi dữ liệu chưa về là danh sách rỗng.

  const [loading, setLoading] = useState(true)
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.

  const [busy, setBusy] = useState(false)

  const [success, setSuccess] = useState(false)

  const alive = useRef(true),
    sequence = useRef(0),
    locked = useRef(false)
  // CHỨC NĂNG: Hủy nhận dữ liệu cũ bằng sequence, gỡ subscription khi rời màn.

  const reload = useCallback(async () => {
    const request = ++sequence.current

    try {
      const [doc, manager] = await Promise.all([service.load(), service.identity()])

      if (alive.current && request === sequence.current) {
        setData(doc)
        setIdentity(manager)
        setError(null)
      }
    } catch (e) {
      if (alive.current && request === sequence.current)
        setError(e instanceof AdminError ? e.code : 'loadError')
    } finally {
      if (alive.current && request === sequence.current) setLoading(false)
    }
  }, [service])
  // TẠI SAO (reload): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
  // và dễ bảo trì.

  const invalidate = useCallback(() => {
    sequence.current++
  }, [])
  // TẠI SAO (invalidate): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
  // quán và dễ bảo trì.
  // CHỨC NĂNG: Theo dõi cập nhật từ nguồn dữ liệu hoặc controller.
  // XỬ LÝ: Đăng ký theo phụ thuộc của effect và dùng hàm hủy khi nguồn đổi hoặc rời màn.
  // CHỨC NĂNG: Đánh dấu component đang tồn tại; cleanup đổi alive.current thành false.
  // XỬ LÝ: Các callback chọn/đọc tệp kiểm tra cờ này trước khi trả kết quả về UI.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: service, reload,
  // invalidate.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    alive.current = true
    void reload()

    const stop = service.subscribe(() => {
      void reload()
    })

    return () => {
      alive.current = false
      invalidate()
      stop()
    }
  }, [service, reload, invalidate])
  // TẠI SAO: Hộp chọn tệp có thể trả kết quả sau khi người dùng đã rời màn; không nên cập nhật
  // component đã đóng.
  // CHỨC NĂNG: Một thao tác tại một thời điểm; lỗi giữ nguyên form/bản công khai.

  const run = async (operation: () => Promise<unknown>): Promise<boolean> => {
    if (locked.current) return false

    locked.current = true
    setBusy(true)
    setError(null)
    setSuccess(false)

    try {
      await operation()
      if (alive.current) {
        await reload()
        setSuccess(true)
      }
      return true
    } catch (e) {
      if (alive.current) setError(e instanceof AdminError ? e.code : 'saveError')
      return false
    } finally {
      locked.current = false
      if (alive.current) setBusy(false)
    }
  }
  // TẠI SAO (run): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.

  return { service, data, identity, error, loading, busy, success, reload, run }
}
// TẠI SAO (useAdmin): Các màn quản trị phải nhìn thấy cùng trạng thái tải/lưu và cùng service
// thay vì mỗi màn tạo một kho.
/* CÁCH KIỂM TRA: Rời màn trong lúc lưu không setState; lỗi lưu hiện thông báo, không báo thành công. */

// CHỨC NĂNG: Hai dashboard đọc cùng bộ đếm QR từ server RAM mỗi 5 giây.
// XỬ LÝ: Lỗi để —, không báo 0; cleanup bỏ timer và kết quả đến muộn.

// ==================== [DUNG-CHUNG] useGateStatistics ====================
export function useGateStatistics(client: import('../services/GoiApiQuanTri').GateClient) {
  // CHỨC NĂNG: Kết quả thống kê đã tải; null nghĩa là chưa có số liệu hợp lệ. Trạng thái lỗi để giao
  // diện hiển thị thông báo và cho thử lại.

  const [stats, setStats] = useState<import('../services/GoiApiQuanTri').GateStats | null>(null),
    [error, setError] = useState(false),
    [retryKey, setRetryKey] = useState(0)
  // CHỨC NĂNG: Tải số phiên hiện tại và lên lịch cập nhật tiếp.
  // XỬ LÝ: Chờ request xong rồi đặt timer; cleanup hủy lịch và bỏ kết quả đã lỗi thời.
  // CHỨC NĂNG: Gọi API thống kê, cập nhật kết quả hoặc lỗi, rồi lên lịch lần kế tiếp sau 5
  // giây.
  // XỬ LÝ: Chỉ cập nhật khi vòng effect còn hoạt động; cleanup tắt cờ và hủy timer đang
  // chờ.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: client, retryKey.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Khai báo alive: sử dụng true làm giá trị của bước hiện tại. | Khai báo timer: không có giá trị khởi tạo.
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined

    const tick = async () => {
      try {
        const value = await client.statistics()
        if (alive) {
          setStats(value)
          setError(false)
        }
      } catch {
        if (alive) {
          setStats(null)
          setError(true)
        }
      }
      if (alive)
        timer = setTimeout(() => {
          void tick()
        }, 5000)
    }
    // TẠI SAO (tick): Mỗi lần lấy thống kê phải kết thúc trước khi đặt lịch mới; cờ vòng đời chặn
    // kết quả của lần đã bị hủy.

    void tick()
    return () => {
      alive = false
      if (timer) clearTimeout(timer)
    }
  }, [client, retryKey])
  // TẠI SAO: Không gửi chồng request hoặc để kết quả cũ ghi đè lần thử lại; lỗi API không được
  // hiển thị thành số 0 giả.

  return { stats, error, retry: () => setRetryKey((value) => value + 1) }
}
// TẠI SAO (useGateStatistics): Lượt QR thay đổi trong lúc admin đang mở; cần tải lại và phân
// biệt lỗi với số lượt bằng 0.

// CHỨC NĂNG: Xuất hook biên tập dùng chung; không kéo DOM hoặc React Native vào package.
export { usePlaceEditor, type PlaceEditorAction } from './useBienTapDiTich'
