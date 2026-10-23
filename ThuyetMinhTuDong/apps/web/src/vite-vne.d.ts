/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình Vite và giữ web dùng đúng React 18.
 *
 * Được dùng bởi:
 * - Vite khi chạy dev và build.
 *
 * Phụ thuộc:
 * - @vitejs/plugin-react.
 * - Cơ chế resolve module của Node.
 *
 * Liên quan: build web và file xác minh UC05.
 */

import {
  createRequire,
} from 'node:module'

import {
  defineConfig,
} from 'vite'

import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Resolve React theo dependency của web.
// XỬ LÝ: Tránh lấy nhầm React 19 của mobile trong monorepo.
const webRequire = createRequire(
  new URL(
    './package.json',
    import.meta.url,
  ),
)

export default defineConfig({
  plugins: [
    react(),
  ],

  // CHỨC NĂNG: Copy file xác minh tên miền vào bản build.
  // XỬ LÝ: Dùng static riêng để public/index.html cũ không đè entry mới.
  publicDir: 'static',

  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement:
          webRequire.resolve('react'),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement:
          webRequire.resolve(
            'react/jsx-runtime',
          ),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement:
          webRequire.resolve(
            'react/jsx-dev-runtime',
          ),
      },
      {
        find: /^react-dom$/,
        replacement:
          webRequire.resolve('react-dom'),
      },
      {
        find: /^react-dom\/client$/,
        replacement:
          webRequire.resolve(
            'react-dom/client',
          ),
      },
    ],
  },
})