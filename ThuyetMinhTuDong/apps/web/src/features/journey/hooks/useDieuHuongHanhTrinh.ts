/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Nối trạng thái hành trình/GPS với điều hướng riêng nền tảng; các thay đổi màn không tự tạo kho hành trình khác.
 *
 * VỊ TRÍ: apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/App.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - ./useHanhTrinh
 *
 * CÁC KHỐI CHÍNH:
 * 1. useJourneyNavigation
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from './useHanhTrinh'

// CHỨC NĂNG: Mở điểm GPS mới khi controller cho phép, không khi đang nghe.
// XỬ LÝ: Chỉ chạy khi ID gợi ý đổi, không điều hướng lại theo mỗi tick audio.

// ==================== [DINH-VI] [THUYET-MINH] useJourneyNavigation ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function useJourneyNavigation() {
  const { engine, state } = useJourney(),
    navigate = useNavigate()
  // CHỨC NĂNG: Nếu có ID gợi ý, chuyển đến /places/ cộng với ID đó.
  // XỬ LÝ: navigate là hàm của React Router; nó đổi route đến trang chi tiết địa điểm.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi:
  // state.suggestedId, navigate.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Rẽ nhánh nếu state.suggestedId. | Thực hiện Gọi navigate('/places/' + state.suggestedId).
  useEffect(() => {
    if (state.suggestedId) navigate('/places/' + state.suggestedId)
  }, [state.suggestedId, navigate])
  // TẠI SAO: Controller chỉ cung cấp ID gợi ý; hook nối ID đó với điều hướng của từng nền tảng.
  // Effect này không tự phát audio.
  // CHỨC NĂNG: Lưu tiến độ khi trang bị ẩn hoặc rời đi.
  // XỬ LÝ: Đăng ký sự kiện trình duyệt và gỡ listener trong cleanup.
  // CHỨC NĂNG: Đăng ký pagehide và visibilitychange; các sự kiện gọi engine.checkpoint().
  // XỬ LÝ: Callback yêu cầu lưu tiến độ. Hàm return gỡ các listener đã đăng ký.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: engine.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
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
