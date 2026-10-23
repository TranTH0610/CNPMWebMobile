/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình build web và giữ đúng runtime React18.
 * Vite đọc; phụ thuộc plugin React và module resolution của Node.
 * Tránh lấy nhầm React19 của mobile từ package dùng chung.
 */

import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Tìm React theo package.json của web.
// XỬ LÝ: Không tìm theo vị trí file trong packages/visitor-core.
const webRequire = createRequire(
  new URL('./package.json', import.meta.url),
)

export default defineConfig({
  plugins: [react()],

  // CHỨC NĂNG: Sao chép file xác minh App Links vào bản web triển khai.
  // XỬ LÝ: Dùng static riêng; tránh public/index.html cũ đè entry của Vite.
  publicDir: 'static',

  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: webRequire.resolve('react'),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: webRequire.resolve('react/jsx-runtime'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: webRequire.resolve('react/jsx-dev-runtime'),
      },
      {
        find: /^react-dom$/,
        replacement: webRequire.resolve('react-dom'),
      },
      {
        find: /^react-dom\/client$/,
        replacement: webRequire.resolve('react-dom/client'),
      },
    ],
  },
})
