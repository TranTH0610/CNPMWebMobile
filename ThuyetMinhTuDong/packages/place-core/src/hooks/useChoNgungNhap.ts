/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời
 *
 * VỊ TRÍ: packages/place-core/src/hooks/useChoNgungNhap.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - react
 *
 * CÁC KHỐI CHÍNH:
 * 1. useDebounce
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'

// CHỨC NĂNG: trì hoãn cập nhật một giá trị.
// XỬ LÝ:
// - T là kiểu của value; tìm kiếm dùng string, nhưng hook có thể dùng kiểu khác.
// - Giá trị ban đầu được trả ngay.
// - Các lần thay đổi tiếp theo phải đợi delay.

// ==================== [DUNG-CHUNG] useDebounce ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function useDebounce<T>(
  value: T,
  delay = 300,
): T {
  // Khai báo [debounced, setDebounced]: useState(value) giữ trạng thái qua các lần render.
  const [debounced, setDebounced] = useState<T>(value)

  // CHỨC NĂNG: Chờ lần gõ cuối trước khi áp dụng giá trị tìm kiếm.
  // XỬ LÝ: Mỗi lần giá trị đổi sẽ hủy lịch cũ; cleanup cũng hủy lịch khi component rời màn.
  // CHỨC NĂNG: Đặt timer để cập nhật giá trị đã debounce sau delay mili giây.
  // XỬ LÝ: Hàm return clearTimeout của lịch vừa tạo trước khi effect chạy lại hoặc
  // component rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: value, delay.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // CHỨC NĂNG: đặt lịch cập nhật giá trị sau khoảng chờ.
    // XỬ LÝ: Math.max bảo đảm delay không âm.
    // Khai báo timer: setTimeout lên lịch tác vụ một lần.
    const timer = setTimeout(() => {
      
      setDebounced(value)
    }, Math.max(0, delay))

    // CHỨC NĂNG: hủy lịch cập nhật cũ.
    // XỬ LÝ:
    // - Người dùng gõ thêm: effect cũ được dọn dẹp, timer cũ bị hủy.
    // - Rời màn hình: timer cũng bị hủy.
    // - Nhờ vậy chỉ lần gõ cuối cùng được cập nhật sau 300 ms.
    // Trả kết quả: khai báo callback () => { clearTimeout(timer) }.
    return () => {
      
      clearTimeout(timer)
    }
  }, [value, delay])
  // TẠI SAO: Gõ tiếp trong khoảng chờ phải hủy giá trị trước; chỉ lần thay đổi cuối mới được đưa
  // vào tìm kiếm.

  
  return debounced
}
// TẠI SAO (useDebounce): Gõ liên tục không cần lọc ở từng phím; hủy lịch cũ để chỉ giá trị cuối
// được áp dụng sau khoảng chờ.