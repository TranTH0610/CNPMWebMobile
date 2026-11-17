/**
 * FILE: apps/web/src/shared/components/BieuTrungDiSan.tsx
 * FILE NÀY LÀM GÌ: Dấu hiệu cổng cung đình bằng SVG, dùng tại Navbar và AdminLayout. TẠI SAO: Logo vector sắc nét ở mọi kích thước, không phụ thuộc emoji/font của thiết bị.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
// [HỖ TRỢ CHUNG] HeritageMark — Dấu hiệu cổng cung đình bằng SVG, dùng tại Navbar và AdminLayout. TẠI SAO: Logo vector sắc nét ở mọi kích thước, không phụ thuộc emoji/font của thiết bị.
export function HeritageMark() {
  return (
    <svg className="heritage-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M5 19 24 9l19 10M9 17h30M8 23h32M12 23v17m24-17v17M7 40h34M18 40V29h12v11M24 4v5M6 19l-2-4m38 4 2-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 17 24 11l11 6M17 23v-4m14 4v-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
