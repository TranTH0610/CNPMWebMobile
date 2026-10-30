/**
 * FILE NÀY LÀM GÌ
 * Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời
 * component.
 *
 * VỊ TRÍ: packages/place-core/src/hooks/useDebounce.ts
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: react
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'

// CHỨC NĂNG: trì hoãn cập nhật một giá trị.
// XỬ LÝ:
// - T là kiểu của value; tìm kiếm dùng string, nhưng hook có thể dùng kiểu khác.
// - Giá trị ban đầu được trả ngay.
// - Các lần thay đổi tiếp theo phải đợi delay.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function useDebounce<T>(`: Khai báo useDebounce(value, delay). Nhận đầu vào qua tham số.
 * DÒNG `value: T,`: Nhận đầu vào value: T từ nơi gọi hàm.
 * DÒNG `delay = 300,`: Nhận đầu vào delay = 300 từ nơi gọi hàm.
 * DÒNG `): T {`: Khai báo useDebounce(value, delay). Nhận đầu vào qua tham số.
 */
export function useDebounce<T>(
  value: T,
  delay = 300,
): T {
  // Khai báo [debounced, setDebounced]: useState(value) giữ trạng thái qua các lần render.
  const [debounced, setDebounced] = useState<T>(value)

  // CHỨC NĂNG: Chờ lần gõ cuối trước khi áp dụng giá trị tìm kiếm.
  // XỬ LÝ: Mỗi lần giá trị đổi sẽ hủy lịch cũ; cleanup cũng hủy lịch khi component rời màn.
  // DÒNG NÀY LÀM GÌ: Đặt timer để cập nhật giá trị đã debounce sau delay mili giây.
  // CÁCH HOẠT ĐỘNG: Hàm return clearTimeout của lịch vừa tạo trước khi effect chạy lại hoặc
  // component rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: value, delay.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // CHỨC NĂNG: đặt lịch cập nhật giá trị sau khoảng chờ.
    // XỬ LÝ: Math.max bảo đảm delay không âm.
    // Khai báo timer: setTimeout lên lịch tác vụ một lần.
    const timer = setTimeout(() => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `setDebounced(value)`: Cập nhật trạng thái qua setDebounced(value).
       * DÒNG `}, Math.max(0, delay))`: Khai báo timer: setTimeout lên lịch tác vụ một lần.
       */
      setDebounced(value)
    }, Math.max(0, delay))

    // CHỨC NĂNG: hủy lịch cập nhật cũ.
    // XỬ LÝ:
    // - Người dùng gõ thêm: effect cũ được dọn dẹp, timer cũ bị hủy.
    // - Rời màn hình: timer cũng bị hủy.
    // - Nhờ vậy chỉ lần gõ cuối cùng được cập nhật sau 300 ms.
    // Trả kết quả: khai báo callback () => { clearTimeout(timer) }.
    return () => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `clearTimeout(timer)`: Dọn đăng ký/timer: clearTimeout(timer).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}, [value, delay])`: Đăng ký useEffect để thực hiện tác vụ sau render.
       */
      clearTimeout(timer)
    }
  }, [value, delay])
  // TẠI SAO: Gõ tiếp trong khoảng chờ phải hủy giá trị trước; chỉ lần thay đổi cuối mới được đưa
  // vào tìm kiếm.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return debounced`: Trả kết quả: sử dụng debounced làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return debounced
}
// TẠI SAO (useDebounce): Gõ liên tục không cần lọc ở từng phím; hủy lịch cũ để chỉ giá trị cuối
// được áp dụng sau khoảng chờ.