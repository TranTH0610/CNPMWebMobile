/**
 * FILE NÀY LÀM GÌ
 * Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho
 * hành trình khác.
 *
 * VỊ TRÍ: apps/mobile/src/hooks/useJourneyNavigation.ts
 * DÙNG BỞI: apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: react; react-native; ./useJourney
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ 'react-native'.
import { AppState } from 'react-native'
// Nhập các thành phần từ './useJourney'.
import { useJourney } from './useJourney'

// Khai báo useJourneyNavigation({ open }). Nhận đầu vào qua tham số. | Khai báo open, kiểu (id: string) => void.
export function useJourneyNavigation({ open }: { open: (id: string) => void }) {
  // Khai báo { engine, state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { engine, state } = useJourney()
  // DÒNG NÀY LÀM GÌ: Nếu state.suggestedId có giá trị, gọi open(state.suggestedId).
  // CÁCH HOẠT ĐỘNG: open là callback được truyền từ RootNavigator; hiện tại nó mở màn Detail với
  // placeId tương ứng.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi:
  // state.suggestedId, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Rẽ nhánh nếu state.suggestedId. | Thực hiện Gọi open(state.suggestedId).
  useEffect(() => { if (state.suggestedId) open(state.suggestedId) }, [state.suggestedId, open])
  // TẠI SAO: Controller chỉ cung cấp ID gợi ý; hook nối ID đó với điều hướng của từng nền tảng.
  // Effect này không tự phát audio.
  // DÒNG NÀY LÀM GÌ: Đăng ký sự kiện đổi AppState; mỗi sự kiện gọi engine.checkpoint().
  // CÁCH HOẠT ĐỘNG: Callback yêu cầu lưu tiến độ. Hàm return gỡ các listener đã đăng ký.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `useEffect(() => { const subscription = AppState.addEventListener('change', () => engi`: Đăng ký useEffect để thực hiện tác vụ sau render. | Khai báo subscription: Gọi AppState.addEventListener('change', () => engine.checkpoint()). | Trả kết quả: khai báo callback () => subscription.remove().
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  useEffect(() => { const subscription = AppState.addEventListener('change', () => engine.checkpoint()); return () => subscription.remove() }, [engine])
  // TẠI SAO: Trình duyệt/điện thoại có thể chuyển nền mà không đóng màn theo cách thông thường;
  // cần lưu tiến độ và tránh listener bị đăng ký lặp.

}
// TẠI SAO (useJourneyNavigation): Controller gợi ý điểm và lưu tiến độ không biết router của nền
// tảng; hook nối hai phần với nhau.
