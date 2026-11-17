/**
 * FILE: packages/place-core/src/hooks/useChoNgungNhap.ts
 * FILE NÀY LÀM GÌ: Trì hoãn giá trị sau lần thay đổi cuối, mặc định 300 ms; hủy timer cũ khi gõ tiếp hoặc rời
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect, useState } from 'react'

// CHỨC NĂNG: trì hoãn cập nhật một giá trị.
// XỬ LÝ:
// - T là kiểu của value; tìm kiếm dùng string, nhưng hook có thể dùng kiểu khác.
// - Giá trị ban đầu được trả ngay.
// - Các lần thay đổi tiếp theo phải đợi delay.

// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] useDebounce — trì hoãn cập nhật một giá trị.
export function useDebounce<T>(
  value: T,
  delay = 300,
): T {
  const [debounced, setDebounced] = useState<T>(value)

  // CHỨC NĂNG: Chờ lần gõ cuối trước khi áp dụng giá trị tìm kiếm.
  // XỬ LÝ: Mỗi lần giá trị đổi sẽ hủy lịch cũ; cleanup cũng hủy lịch khi component rời màn.
  // CHỨC NĂNG: Đặt timer để cập nhật giá trị đã debounce sau delay mili giây.
  // XỬ LÝ: Hàm return clearTimeout của lịch vừa tạo trước khi effect chạy lại hoặc
  // component rời.
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