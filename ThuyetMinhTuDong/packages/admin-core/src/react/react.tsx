/**
 * FILE NÀY LÀM GÌ
 * Provider/hook React quản trị; đọc service, phản hồi thao tác, cập nhật dữ liệu và hook thống kê
 * lượt QR.
 *
 * VỊ TRÍ: packages/admin-core/src/react/react.tsx
 * DÙNG BỞI: apps/mobile/src/components/admin/AdminUI.tsx;
 * apps/mobile/src/components/admin/AudioPreview.tsx;
 * apps/mobile/src/components/admin/LocalMediaPicker.tsx; và các nơi import khác.
 * PHỤ THUỘC: react; @travelguide/visitor-core/react; ../domain/contracts; ../domain/models;
 * ../i18n/messages
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ 'react'.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { useVisitor } from '@travelguide/visitor-core/react'
// Nhập kiểu dữ liệu từ '../domain/contracts'.
import type { AdminService } from '../domain/contracts'
// Nhập các thành phần từ '../domain/models'.
import { AdminError, type AdminDocument, type AdminErrorCode, type AdminIdentity } from '../domain/models'
// Nhập các thành phần từ '../i18n/messages'.
import { adminMessages, type AdminTextKey } from '../i18n/messages'
// Khai báo Context: Gọi createContext<AdminService | null>(null).
const Context = createContext<AdminService | null>(null)
// Khai báo AdminProvider({ service, children }). Component hàm nhận props và dựng phần giao diện AdminProvider. | Khai báo service, kiểu AdminService. | Khai báo children, kiểu ReactNode.
export function AdminProvider({ service, children }: { service: AdminService; children: ReactNode }) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <Context.Provider value={service}>{children}</Context.Provider>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <Context.Provider value={service}>{children}</Context.Provider>
}
// TẠI SAO (AdminProvider): Các component con cần cùng một nguồn trạng thái; tạo riêng ở từng màn
// sẽ mất đồng bộ.
// CHỨC NĂNG: Lấy hàm dịch giao diện quản trị.
// XỬ LÝ: Dùng chung tài nguyên ngôn ngữ để nhãn admin web/mobile có cùng nghĩa.
// Khai báo useAdminText(). Nhận đầu vào qua tham số.
export function useAdminText() {
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return useCallback((key: AdminTextKey): string => adminMessages[language][key], [lang`: Trả kết quả: useCallback giữ tham chiếu hàm theo phụ thuộc.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return useCallback((key: AdminTextKey): string => adminMessages[language][key], [language])
}
// TẠI SAO (useAdminText): Các trang quản trị cần dùng cùng bộ khóa dịch để web/mobile có nhãn và
// thông báo nhất quán.
// CHỨC NĂNG: Đọc trạng thái và thao tác quản trị từ context.
// XỬ LÝ: Không tạo một service hoặc kho dữ liệu mới cho mỗi màn hình.
// Khai báo useAdmin(). Nhận đầu vào qua tham số.
export function useAdmin() {
  // Khai báo service: Gọi useContext(Context).
  const service = useContext(Context)
  // Rẽ nhánh nếu !service. | Ném new Error('AdminProvider missing').
  if (!service) throw new Error('AdminProvider missing')
  // Khai báo [data, setData]: useState(null) giữ trạng thái qua các lần render.
  const [data, setData] = useState<AdminDocument | null>(null)
  // Khai báo [identity, setIdentity]: useState(null) giữ trạng thái qua các lần render.
  const [identity, setIdentity] = useState<AdminIdentity | null>(null)
  // CHỨC NĂNG: Trạng thái lỗi để giao diện hiển thị thông báo và cho thử lại.
  // Khai báo [error, setError]: useState(null) giữ trạng thái qua các lần render.
  const [error, setError] = useState<AdminErrorCode | null>(null)
  // CHỨC NĂNG: Trạng thái đang tải để UI không coi dữ liệu chưa về là danh sách rỗng.
  // Khai báo [loading, setLoading]: useState(true) giữ trạng thái qua các lần render.
  const [loading, setLoading] = useState(true)
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp.
  // Khai báo [busy, setBusy]: useState(false) giữ trạng thái qua các lần render.
  const [busy, setBusy] = useState(false)
  // Khai báo [success, setSuccess]: useState(false) giữ trạng thái qua các lần render.
  const [success, setSuccess] = useState(false)
  // Khai báo alive: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại | Khai báo sequence: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại | Khai báo locked: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const alive = useRef(true), sequence = useRef(0), locked = useRef(false)
  // CHỨC NĂNG: Hủy nhận dữ liệu cũ bằng sequence, gỡ subscription khi rời màn.
  // Khai báo reload: useCallback giữ tham chiếu hàm theo phụ thuộc.
  const reload = useCallback(async () => {
    // Khai báo request: sử dụng ++sequence.current làm giá trị của bước hiện tại.
    const request = ++sequence.current
    // Bắt đầu vùng try.
    try {
      // Khai báo [doc, manager]: await chờ Gọi Promise.all([service.load(), service.identity()]).
      const [doc, manager] = await Promise.all([service.load(), service.identity()])
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (alive.current && request === sequence.current) { setData(doc); setIdentity(manage`: Rẽ nhánh nếu alive.current && request === sequence.current. | Cập nhật trạng thái qua setData(doc). | Cập nhật trạng thái qua setIdentity(manager). | Cập nhật trạng thái qua setError(null).
       * DÒNG `} catch (e) { if (alive.current && request === sequence.current) setError(e instanceo`: Bắt đầu vùng try. | Rẽ nhánh nếu alive.current && request === sequence.current. | Cập nhật trạng thái qua setError(e instanceof AdminError ? e.code : 'loadError').
       * DÒNG `finally { if (alive.current && request === sequence.current) setLoading(false) }`: Bắt đầu vùng try. | Rẽ nhánh nếu alive.current && request === sequence.current. | Cập nhật trạng thái qua setLoading(false).
       * DÒNG `}, [service])`: Khai báo reload: useCallback giữ tham chiếu hàm theo phụ thuộc.
       */
      if (alive.current && request === sequence.current) { setData(doc); setIdentity(manager); setError(null) }
    } catch (e) { if (alive.current && request === sequence.current) setError(e instanceof AdminError ? e.code : 'loadError') }
    finally { if (alive.current && request === sequence.current) setLoading(false) }
  }, [service])
  // TẠI SAO (reload): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
  // và dễ bảo trì.
  // Khai báo invalidate: useCallback giữ tham chiếu hàm theo phụ thuộc. | Thực hiện sử dụng sequence.current++ làm giá trị của bước hiện tại.
  const invalidate = useCallback(() => { sequence.current++ }, [])
  // TẠI SAO (invalidate): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
  // quán và dễ bảo trì.
  // CHỨC NĂNG: Theo dõi cập nhật từ nguồn dữ liệu hoặc controller.
  // XỬ LÝ: Đăng ký theo phụ thuộc của effect và dùng hàm hủy khi nguồn đổi hoặc rời màn.
  // DÒNG NÀY LÀM GÌ: Đánh dấu component đang tồn tại; cleanup đổi alive.current thành false.
  // CÁCH HOẠT ĐỘNG: Các callback chọn/đọc tệp kiểm tra cờ này trước khi trả kết quả về UI.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: service, reload,
  // invalidate.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện tính biểu thức alive.current = true. | Thực hiện sử dụng void reload() làm giá trị của bước hiện tại.
    alive.current = true; void reload()
    // Khai báo stop: Gọi service.subscribe(() => { void reload() }). | Thực hiện sử dụng void reload() làm giá trị của bước hiện tại.
    const stop = service.subscribe(() => { void reload() })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => { alive.current = false; invalidate(); stop() }`: Trả kết quả: khai báo callback () => { alive.current = false. | Thực hiện tính biểu thức alive.current = false. | Thực hiện Gọi invalidate(). | Thực hiện Gọi stop().
     * DÒNG `}, [service, reload, invalidate])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    return () => { alive.current = false; invalidate(); stop() }
  }, [service, reload, invalidate])
  // TẠI SAO: Hộp chọn tệp có thể trả kết quả sau khi người dùng đã rời màn; không nên cập nhật
  // component đã đóng.
  // CHỨC NĂNG: Một thao tác tại một thời điểm; lỗi giữ nguyên form/bản công khai.
  // Khai báo run: khai báo callback async (operation: () => Promise<void>): Promise<boolean> => { if (locked.cu.
  const run = async (operation: () => Promise<void>): Promise<boolean> => {
    // Rẽ nhánh nếu locked.current. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
    if (locked.current) return false
    // Thực hiện tính biểu thức locked.current = true. | Cập nhật trạng thái qua setBusy(true). | Cập nhật trạng thái qua setError(null). | Cập nhật trạng thái qua setSuccess(false).
    locked.current = true; setBusy(true); setError(null); setSuccess(false)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `try { await operation(); if (alive.current) { await reload(); setSuccess(true) } retu`: Bắt đầu vùng try. | Thực hiện await chờ Gọi operation(). | Rẽ nhánh nếu alive.current. | Thực hiện await chờ Gọi reload(). | Cập nhật trạng thái qua setSuccess(true). | Trả kết quả: sử dụng true làm giá trị của bước hiện tại.
     * DÒNG `catch (e) { if (alive.current) setError(e instanceof AdminError ? e.code : 'saveError`: Bắt đầu vùng try. | Rẽ nhánh nếu alive.current. | Cập nhật trạng thái qua setError(e instanceof AdminError ? e.code : 'saveError'). | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
     * DÒNG `finally { locked.current = false; if (alive.current) setBusy(false) }`: Bắt đầu vùng try. | Thực hiện tính biểu thức locked.current = false. | Rẽ nhánh nếu alive.current. | Cập nhật trạng thái qua setBusy(false).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    try { await operation(); if (alive.current) { await reload(); setSuccess(true) } return true }
    catch (e) { if (alive.current) setError(e instanceof AdminError ? e.code : 'saveError'); return false }
    finally { locked.current = false; if (alive.current) setBusy(false) }
  }
  // TẠI SAO (run): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán và
  // dễ bảo trì.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return { service, data, identity, error, loading, busy, success, reload, run }`: Trả kết quả: tạo object gồm service, data, identity, error, loading, busy, success, reload, run. | Đặt trường service bằng giá trị của biến cùng tên. | Đặt trường data bằng giá trị của biến cùng tên. | Đặt trường identity bằng giá trị của biến cùng tên. | Đặt trường error bằng giá trị của biến cùng tên. | Đặt trường loading bằng giá trị của biến cùng tên. | Đặt trường busy bằng giá trị của biến cùng tên. | Đặt trường success bằng giá trị của biến cùng tên. | Đặt trường reload bằng giá trị của biến cùng tên. | Đặt trường run bằng giá trị của biến cùng tên.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return { service, data, identity, error, loading, busy, success, reload, run }
}
// TẠI SAO (useAdmin): Các màn quản trị phải nhìn thấy cùng trạng thái tải/lưu và cùng service
// thay vì mỗi màn tạo một kho.
/* CÁCH KIỂM TRA: Rời màn trong lúc lưu không setState; lỗi lưu hiện thông báo, không báo thành công. */

// CHỨC NĂNG: Hai dashboard đọc cùng bộ đếm QR từ server RAM mỗi 5 giây.
// XỬ LÝ: Lỗi để —, không báo 0; cleanup bỏ timer và kết quả đến muộn.
// Khai báo useGateStatistics(client). Nhận đầu vào qua tham số.
export function useGateStatistics(client: import('../services/httpService').GateClient) {
 // CHỨC NĂNG: Kết quả thống kê đã tải; null nghĩa là chưa có số liệu hợp lệ. Trạng thái lỗi để giao
 // diện hiển thị thông báo và cho thử lại.
 // Khai báo [stats,setStats]: useState(null) giữ trạng thái qua các lần render.
 const [stats,setStats]=useState<import('../services/httpService').GateStats|null>(null),[error,setError]=useState(false),[retryKey,setRetryKey]=useState(0)
 // CHỨC NĂNG: Tải số phiên hiện tại và lên lịch cập nhật tiếp.
 // XỬ LÝ: Chờ request xong rồi đặt timer; cleanup hủy lịch và bỏ kết quả đã lỗi thời.
 // DÒNG NÀY LÀM GÌ: Gọi API thống kê, cập nhật kết quả hoặc lỗi, rồi lên lịch lần kế tiếp sau 5
 // giây.
 // CÁCH HOẠT ĐỘNG: Chỉ cập nhật khi vòng effect còn hoạt động; cleanup tắt cờ và hủy timer đang
 // chờ.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: client, retryKey.
 // Đăng ký useEffect để thực hiện tác vụ sau render. | Khai báo alive: sử dụng true làm giá trị của bước hiện tại. | Khai báo timer: không có giá trị khởi tạo.
 useEffect(()=>{let alive=true;let timer:ReturnType<typeof setTimeout>|undefined
  // Khai báo tick: khai báo callback async()=>{try{const value=await client.statistics(). | Bắt đầu vùng try. | Khai báo value: await chờ Gọi client.statistics(). | Rẽ nhánh nếu alive. | Cập nhật trạng thái qua setStats(value). | Cập nhật trạng thái qua setError(false). | Cập nhật trạng thái qua setStats(null). | Cập nhật trạng thái qua setError(true). | Thực hiện tính biểu thức timer=setTimeout(()=>{void tick()},5000). | Thực hiện sử dụng void tick() làm giá trị của bước hiện tại.
  const tick=async()=>{try{const value=await client.statistics();if(alive){setStats(value);setError(false)}}catch{if(alive){setStats(null);setError(true)}}if(alive)timer=setTimeout(()=>{void tick()},5000)}
  // TẠI SAO (tick): Mỗi lần lấy thống kê phải kết thúc trước khi đặt lịch mới; cờ vòng đời chặn
  // kết quả của lần đã bị hủy.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `void tick();return()=>{alive=false;if(timer)clearTimeout(timer)}`: Thực hiện sử dụng void tick() làm giá trị của bước hiện tại. | Trả kết quả: khai báo callback ()=>{alive=false. | Thực hiện tính biểu thức alive=false. | Rẽ nhánh nếu timer. | Dọn đăng ký/timer: clearTimeout(timer).
   * DÒNG `},[client,retryKey])`: Đăng ký useEffect để thực hiện tác vụ sau render.
   */
  void tick();return()=>{alive=false;if(timer)clearTimeout(timer)}
 },[client,retryKey])
 // TẠI SAO: Không gửi chồng request hoặc để kết quả cũ ghi đè lần thử lại; lỗi API không được
 // hiển thị thành số 0 giả.
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return {stats,error,retry:()=>setRetryKey(value=>value+1)}`: Trả kết quả: tạo object gồm stats, error, retry. | Đặt trường stats bằng giá trị của biến cùng tên. | Đặt trường error bằng giá trị của biến cùng tên. | Gán thuộc tính retry: khai báo callback ()=>setRetryKey(value=>value+1).
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return {stats,error,retry:()=>setRetryKey(value=>value+1)}
}
// TẠI SAO (useGateStatistics): Lượt QR thay đổi trong lúc admin đang mở; cần tải lại và phân
// biệt lỗi với số lượt bằng 0.
