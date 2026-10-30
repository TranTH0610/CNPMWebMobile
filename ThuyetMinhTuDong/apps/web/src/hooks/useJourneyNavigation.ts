/**
 * FILE NÀY LÀM GÌ
 * Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho
 * hành trình khác.
 *
 * VỊ TRÍ: apps/web/src/hooks/useJourneyNavigation.ts
 * DÙNG BỞI: apps/web/src/App.tsx.
 * PHỤ THUỘC: react; react-router-dom; ./useJourney
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { useNavigate } from 'react-router-dom'
// Nhập các thành phần từ './useJourney'.
import { useJourney } from './useJourney'

// CHỨC NĂNG: Mở điểm GPS mới khi controller cho phép, không khi đang nghe.
// XỬ LÝ: Chỉ chạy khi ID gợi ý đổi, không điều hướng lại theo mỗi tick audio.
// Khai báo useJourneyNavigation(). Nhận đầu vào qua tham số.
export function useJourneyNavigation() {
  // Khai báo { engine, state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo navigate: useNavigate() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
  const { engine, state } = useJourney(), navigate = useNavigate()
  // DÒNG NÀY LÀM GÌ: Nếu có ID gợi ý, chuyển đến /places/ cộng với ID đó.
  // CÁCH HOẠT ĐỘNG: navigate là hàm của React Router; nó đổi route đến trang chi tiết địa điểm.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi:
  // state.suggestedId, navigate.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Rẽ nhánh nếu state.suggestedId. | Thực hiện Gọi navigate('/places/' + state.suggestedId).
  useEffect(() => { if (state.suggestedId) navigate('/places/' + state.suggestedId) }, [state.suggestedId, navigate])
  // TẠI SAO: Controller chỉ cung cấp ID gợi ý; hook nối ID đó với điều hướng của từng nền tảng.
  // Effect này không tự phát audio.
  // CHỨC NĂNG: Lưu tiến độ khi trang bị ẩn hoặc rời đi.
  // XỬ LÝ: Đăng ký sự kiện trình duyệt và gỡ listener trong cleanup.
  // DÒNG NÀY LÀM GÌ: Đăng ký pagehide và visibilitychange; các sự kiện gọi engine.checkpoint().
  // CÁCH HOẠT ĐỘNG: Callback yêu cầu lưu tiến độ. Hàm return gỡ các listener đã đăng ký.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Khai báo save: khai báo callback () => engine.checkpoint().
    const save = () => engine.checkpoint()
    // TẠI SAO (save): Dùng cùng một hàm save khi đăng ký và gỡ sự kiện; tạo hàm khác trong
    // removeEventListener sẽ không gỡ đúng listener cũ.
    // Đăng ký xử lý sự kiện: window.addEventListener('pagehide', save).
    window.addEventListener('pagehide', save)
    // Đăng ký xử lý sự kiện: document.addEventListener('visibilitychange', save).
    document.addEventListener('visibilitychange', save)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => { window.removeEventListener('pagehide', save); document.removeEventList`: Trả kết quả: khai báo callback () => { window.removeEventListener('pagehide', save). | Dọn đăng ký/timer: window.removeEventListener('pagehide', save). | Dọn đăng ký/timer: document.removeEventListener('visibilitychange', save).
     * DÒNG `}, [engine])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return () => { window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', save) }
  }, [engine])
  // TẠI SAO: Trình duyệt/điện thoại có thể chuyển nền mà không đóng màn theo cách thông thường;
  // cần lưu tiến độ và tránh listener bị đăng ký lặp.

}
// TẠI SAO (useJourneyNavigation): Controller gợi ý điểm và lưu tiến độ không biết router của nền
// tảng; hook nối hai phần với nhau.
