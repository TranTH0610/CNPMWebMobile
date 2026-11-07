/**
 * CHỨC NĂNG: [KIEU-DU-LIEU]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Khai báo kiểu import tài nguyên cho TypeScript để ảnh/audio đóng gói được dùng mà không báo thiếu module.
 *
 * VỊ TRÍ: apps/mobile/src/types/KieuTaiNguyen.d.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
/** FILE NÀY LÀM GÌ: Khai báo kiểu asset MP3 tĩnh cho Metro và TypeScript. */
// Tiếp phần `declare module '*.mp3' {` của ModuleDeclaration.
declare module '*.mp3' {
  const asset: number

  export default asset
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm run typecheck --workspace=mobile.
 * - Expo export phải đóng gói đủ năm asset MP3.
 */

// Tiếp phần `declare module '*.jpg' { const asset: number. | Khai báo asset: không có giá trị khởi tạo. | Tiếp phần `export default asset` của ExportAssignment.
declare module '*.jpg' {
  const asset: number
  export default asset
}
