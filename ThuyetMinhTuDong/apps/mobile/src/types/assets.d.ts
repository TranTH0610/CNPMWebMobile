/**
 * FILE NÀY LÀM GÌ
 * Khai báo kiểu import tài nguyên cho TypeScript để ảnh/audio đóng gói được dùng mà không báo
 * thiếu module.
 *
 * VỊ TRÍ: apps/mobile/src/types/assets.d.ts
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * TẠI SAO TÁCH FILE: Các nơi dùng cần cùng hợp đồng dữ liệu để TypeScript phát hiện truyền thiếu
 * hoặc sai kiểu.
 */
/** FILE NÀY LÀM GÌ: Khai báo kiểu asset MP3 tĩnh cho Metro và TypeScript. */
// Tiếp phần `declare module '*.mp3' {` của ModuleDeclaration.
declare module '*.mp3' {
  // Khai báo asset: không có giá trị khởi tạo.
  const asset: number
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `export default asset`: Tiếp phần `export default asset` của ExportAssignment.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  export default asset
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm run typecheck --workspace=mobile.
 * - Expo export phải đóng gói đủ năm asset MP3.
 */

// Tiếp phần `declare module '*.jpg' { const asset: number. | Khai báo asset: không có giá trị khởi tạo. | Tiếp phần `export default asset` của ExportAssignment.
declare module '*.jpg' { const asset: number; export default asset }
