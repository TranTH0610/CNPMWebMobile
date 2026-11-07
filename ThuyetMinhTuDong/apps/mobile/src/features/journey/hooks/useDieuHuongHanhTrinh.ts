/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - ./useHanhTrinh
 *
 * CÁC KHỐI CHÍNH:
 * 1. useJourneyNavigation
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useJourney } from './useHanhTrinh'

// ==================== [DINH-VI] [THUYET-MINH] useJourneyNavigation ====================
// CHỨC NĂNG: Nối mã di tích gợi ý với điều hướng và lưu tiến độ khi ứng dụng đổi trạng thái.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function useJourneyNavigation({ open }: { open: (id: string) => void }) {
  const { engine, state } = useJourney()
  // CHỨC NĂNG: Mở trang chi tiết khi hành trình đề xuất một di tích.
  // XỬ LÝ: Có suggestedId mới gọi callback open do RootNavigator truyền vào.
  // TẠI SAO: Hook hành trình không trực tiếp phụ thuộc bộ điều hướng native.
  useEffect(() => {
    // suggestedId là mã di tích được engine đề xuất; chưa có mã thì bỏ qua.
    // open chuyển mã này cho điều hướng để mở đúng trang chi tiết.
    if (state.suggestedId) open(state.suggestedId)
    // Effect chạy lại khi mã đề xuất hoặc tham chiếu hàm open thay đổi.
  }, [state.suggestedId, open])
  // TẠI SAO: Controller chỉ cung cấp ID gợi ý; hook nối ID đó với điều hướng của từng nền tảng.
  // Effect này không tự phát audio.
  // CHỨC NĂNG: Đăng ký sự kiện đổi AppState; mỗi sự kiện gọi engine.checkpoint().
  // XỬ LÝ: Callback yêu cầu lưu tiến độ. Hàm return gỡ các listener đã đăng ký.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine.

  useEffect(() => {
    // Khi ứng dụng đổi trạng thái, yêu cầu engine lưu tiến độ đang nghe.
    const subscription = AppState.addEventListener('change', () => engine.checkpoint())
    // Gỡ đúng listener khi hook bị tháo hoặc engine thay đổi để tránh đăng ký trùng.
    return () => subscription.remove()
  }, [engine])
  // TẠI SAO: Trình duyệt/điện thoại có thể chuyển nền mà không đóng màn theo cách thông thường;
  // cần lưu tiến độ và tránh listener bị đăng ký lặp.
}
// TẠI SAO (useJourneyNavigation): Controller gợi ý điểm và lưu tiến độ không biết router của nền
// tảng; hook nối hai phần với nhau.
