/**
 * FILE: apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts
 * FILE NÀY LÀM GÌ: Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useJourney } from './useHanhTrinh'

// CHỨC NĂNG: Nối mã di tích gợi ý với điều hướng và lưu tiến độ khi ứng dụng đổi trạng thái.
// [UC06] useJourneyNavigation — Theo dõi gợi ý để điều hướng tới chi tiết di tích phù hợp.
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
