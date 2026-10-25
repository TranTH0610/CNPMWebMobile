/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình build web và giữ đúng runtime React18.
 * Vite đọc; phụ thuộc plugin React và module resolution của Node.
 * Tránh lấy nhầm React19 của mobile từ package dùng chung.
 */

import { createRequire } from 'node:module'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Tìm React theo package.json của web.
// XỬ LÝ: Không tìm theo vị trí file trong packages/visitor-core.
const webRequire = createRequire(
  new URL('./package.json', import.meta.url),
)

// CHỨC NĂNG: Tách entry và thư mục build ngay từ cấu hình Vite, không dựa vào URL để cấp quyền.
// XỬ LÝ: Bản visitor không chứa cây route admin. HTTP /admin bị từ chối ở dev/preview visitor.
// Hosting production cũng phải chặn /admin và bảo vệ tên miền admin bằng xác thực riêng.
function audiencePlugin(admin: boolean): Plugin {
  const blockAdmin: import('vite').Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? '/').split('?')[0]
    if (/^\/qr(?:\/|$)/.test(path) || (!admin && /^\/admin(?:\/|$)/.test(path))) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    next()
  }
  return {
    name: 'separate-admin-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return admin ? html.replace('/src/main.tsx', '/src/main-admin.tsx') : html
      },
    },
    configureServer(server) { server.middlewares.use(blockAdmin) },
    configurePreviewServer(server) { server.middlewares.use(blockAdmin) },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), audiencePlugin(mode === 'admin')],
  // CHỨC NĂNG: Hai bản build riêng; admin dev chỉ nghe localhost theo mặc định.
  // XỬ LÝ: Không đưa cổng quản lý vào link QR/tunnel dành cho du khách.
  server: {
    host: mode === 'admin' ? '127.0.0.1' : '0.0.0.0',
    // CHỨC NĂNG: Hai site gọi chung server RAM, QR/tunnel visitor vẫn dùng cùng origin.
    // XỬ LÝ: Chỉ bản admin proxy API đọc thống kê; visitor chỉ gửi heartbeat/end.
    proxy: {
      [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry|audio/published/[a-f0-9]{64}\\.mp3)$']: {
        target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/catalog/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
      [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$']: {
        target: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/presence/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
    },
  },
  build: { outDir: mode === 'admin' ? 'dist-admin' : 'dist' },

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
}))
