/**
 * FILE NÀY LÀM GÌ:
 * Chỉ cập nhật giá trị tìm kiếm sau khi người dùng ngừng gõ
 * trong một khoảng thời gian, mặc định 300 ms.
 *
 * Được dùng bởi:
 * - Hook usePlaceSearch của mobile ở giai đoạn 2.
 * - Hook usePlaceSearch của web ở giai đoạn 3.
 *
 * Phụ thuộc: React.
 * Liên quan: UC03, FR-38.
 */

import { useEffect, useState } from 'react'

// CHỨC NĂNG: trì hoãn cập nhật một giá trị.
// XỬ LÝ:
// - T là kiểu của value; tìm kiếm dùng string, nhưng hook có thể dùng kiểu khác.
// - Giá trị ban đầu được trả ngay.
// - Các lần thay đổi tiếp theo phải đợi delay.
export function useDebounce<T>(
  value: T,
  delay = 300,
): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    // CHỨC NĂNG: đặt lịch cập nhật giá trị sau khoảng chờ.
    // XỬ LÝ: Math.max bảo đảm delay không âm.
    const timer = setTimeout(() => {
      setDebounced(value)
    }, Math.max(0, delay))

    // CHỨC NĂNG: hủy lịch cập nhật cũ.
    // XỬ LÝ:
    // - Người dùng gõ thêm: effect cũ được dọn dẹp, timer cũ bị hủy.
    // - Rời màn hình: timer cũng bị hủy.
    // - Nhờ vậy chỉ lần gõ cuối cùng được cập nhật sau 300 ms.
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debounced
}