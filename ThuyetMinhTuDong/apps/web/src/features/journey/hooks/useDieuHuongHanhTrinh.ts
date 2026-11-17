/**
 * FILE: apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts
 * FILE NÀY LÀM GÌ: Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from './useHanhTrinh'

// CHỨC NĂNG: Mở điểm GPS mới khi controller cho phép, không khi đang nghe.
// XỬ LÝ: Chỉ chạy khi ID gợi ý đổi, không điều hướng lại theo mỗi tick audio.

// [UC06] useJourneyNavigation — Theo dõi gợi ý để điều hướng tới chi tiết di tích phù hợp.
export function useJourneyNavigation() {
  const { engine, state } = useJourney(),
    navigate = useNavigate()
  // CHỨC NĂNG: Nếu có ID gợi ý, chuyển đến /places/ cộng với ID đó.
  // XỬ LÝ: navigate là hàm của React Router; nó đổi route đến trang chi tiết địa điểm.
  // state.suggestedId, navigate.
  useEffect(() => {
    if (state.suggestedId) navigate('/places/' + state.suggestedId)
  }, [state.suggestedId, navigate])
  // TẠI SAO: Controller chỉ cung cấp ID gợi ý; hook nối ID đó với điều hướng của từng nền tảng.
  // Effect này không tự phát audio.
  // CHỨC NĂNG: Lưu tiến độ khi trang bị ẩn hoặc rời đi.
  // XỬ LÝ: Đăng ký sự kiện trình duyệt và gỡ listener trong cleanup.
  // CHỨC NĂNG: Đăng ký pagehide và visibilitychange; các sự kiện gọi engine.checkpoint().
  // XỬ LÝ: Callback yêu cầu lưu tiến độ. Hàm return gỡ các listener đã đăng ký.
  useEffect(() => {
    const save = () => engine.checkpoint()
    // TẠI SAO (save): Dùng cùng một hàm save khi đăng ký và gỡ sự kiện; tạo hàm khác trong
    // removeEventListener sẽ không gỡ đúng listener cũ.

    window.addEventListener('pagehide', save)

    document.addEventListener('visibilitychange', save)

    return () => {
      window.removeEventListener('pagehide', save)
      document.removeEventListener('visibilitychange', save)
    }
  }, [engine])
  // TẠI SAO: Trình duyệt/điện thoại có thể chuyển nền mà không đóng màn theo cách thông thường;
  // cần lưu tiến độ và tránh listener bị đăng ký lặp.
}
// TẠI SAO (useJourneyNavigation): Controller gợi ý điểm và lưu tiến độ không biết router của nền
// tảng; hook nối hai phần với nhau.
