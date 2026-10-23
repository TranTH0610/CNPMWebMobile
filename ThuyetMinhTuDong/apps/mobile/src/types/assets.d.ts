/**
 * FILE NÀY LÀM GÌ: Khai báo kiểu MP3 đóng gói bởi Metro.
 * Vị trí: apps/mobile/src/types/assets.d.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



/** FILE NÀY LÀM GÌ: Khai báo kiểu asset MP3 tĩnh cho Metro và TypeScript. */
declare module '*.mp3' {
  const asset: number
  export default asset
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm run typecheck --workspace=mobile.
 * - Expo export phải đóng gói đủ năm asset MP3.
 */

declare module '*.jpg' { const asset: number; export default asset }
