/**
 * FILE NÀY LÀM GÌ
 * Cấu hình Vite: chọn bản du khách/admin, tài nguyên tĩnh, build và proxy đến mock API trong môi
 * trường demo.
 *
 * VỊ TRÍ: apps/web/vite.config.ts
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: node:module; vite; @vitejs/plugin-react
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ 'node:module'.
import { createRequire } from 'node:module'
// Nhập các thành phần từ 'vite'.
import { defineConfig, type Plugin } from 'vite'
// Nhập các thành phần từ '@vitejs/plugin-react'.
import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Tìm React theo package.json của web.
// XỬ LÝ: Không tìm theo vị trí file trong packages/visitor-core.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const webRequire = createRequire(`: Khai báo webRequire: Gọi createRequire( new URL('./package.json', import.meta.url), ).
 * DÒNG `new URL('./package.json', import.meta.url),`: Khai báo webRequire: Gọi createRequire( new URL('./package.json', import.meta.url), ).
 * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
const webRequire = createRequire(
  new URL('./package.json', import.meta.url),
)

// CHỨC NĂNG: Tách entry và thư mục build ngay từ cấu hình Vite, không dựa vào URL để cấp quyền.
// XỬ LÝ: Bản visitor không chứa cây route admin. HTTP /admin bị từ chối ở dev/preview visitor.
// Hosting production cũng phải chặn /admin và bảo vệ tên miền admin bằng xác thực riêng.
// Khai báo audiencePlugin(admin). Nhận đầu vào qua tham số.
function audiencePlugin(admin: boolean): Plugin {
  // Khai báo blockAdmin: khai báo callback (req, res, next) => { const path = (req.url ?? '/').split('?')[0] if (/^\/q.
  const blockAdmin: import('vite').Connect.NextHandleFunction = (req, res, next) => {
    // Khai báo path: đọc (req.url ?? '/').split('?')[0] từ đối tượng/mảng để dùng tại bước hiện tại.
    const path = (req.url ?? '/').split('?')[0]
    // Rẽ nhánh nếu /^\/qr(?:\/|$)/.test(path) || (!admin && /^\/admin(?:\/|$)/.test(path)).
    if (/^\/qr(?:\/|$)/.test(path) || (!admin && /^\/admin(?:\/|$)/.test(path))) {
      // Thực hiện tính biểu thức res.statusCode = 404.
      res.statusCode = 404
      // Thực hiện Gọi res.end('Not found').
      res.end('Not found')
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return`: Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `next()`: Thực hiện Gọi next().
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    next()
  }
  // TẠI SAO (blockAdmin): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
  // quán và dễ bảo trì.
  // Trả kết quả: tạo object gồm name, transformIndexHtml, configureServer, configurePreviewServer.
  return {
    // Gán thuộc tính name: chuỗi 'separate-admin-entry'.
    name: 'separate-admin-entry',
    // Gán thuộc tính transformIndexHtml: tạo object gồm order, handler.
    transformIndexHtml: {
      // Gán thuộc tính order: chuỗi 'pre'.
      order: 'pre',
      // Khai báo handler(html). Nhận đầu vào qua tham số.
      handler(html) {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return admin ? html.replace('/src/main.tsx', '/src/main-admin.tsx') : html`: Trả kết quả: chọn giữa hai giá trị theo điều kiện admin.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return admin ? html.replace('/src/main.tsx', '/src/main-admin.tsx') : html
      },
      // TẠI SAO (handler): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
      // và dễ bảo trì.
    },
    // Khai báo configureServer(server). Nhận đầu vào qua tham số. | Thực hiện Gọi server.middlewares.use(blockAdmin).
    configureServer(server) { server.middlewares.use(blockAdmin) },
    // TẠI SAO (configureServer): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối
    // nhất quán và dễ bảo trì.
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `configurePreviewServer(server) { server.middlewares.use(blockAdmin) },`: Khai báo configurePreviewServer(server). Nhận đầu vào qua tham số. | Thực hiện Gọi server.middlewares.use(blockAdmin).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    configurePreviewServer(server) { server.middlewares.use(blockAdmin) },
    // TẠI SAO (configurePreviewServer): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu
    // mối nhất quán và dễ bảo trì.
  }
}
// TẠI SAO (audiencePlugin): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối
// nhất quán và dễ bảo trì.

// Tiếp phần `export default defineConfig(({ mode }) => ({` của ExportAssignment.
export default defineConfig(({ mode }) => ({
  // Gán thuộc tính plugins: tạo mảng [react(), audiencePlugin(mode === 'admin')].
  plugins: [react(), audiencePlugin(mode === 'admin')],
  // CHỨC NĂNG: Hai bản build riêng; admin dev chỉ nghe localhost theo mặc định.
  // XỬ LÝ: Không đưa cổng quản lý vào link QR/tunnel dành cho du khách.
  // Gán thuộc tính server: tạo object gồm host, proxy.
  server: {
    // Gán thuộc tính host: chọn giữa hai giá trị theo điều kiện mode === 'admin'.
    host: mode === 'admin' ? '127.0.0.1' : '0.0.0.0',
    // CHỨC NĂNG: Hai site gọi chung server RAM, QR/tunnel visitor vẫn dùng cùng origin.
    // XỬ LÝ: Chỉ bản admin proxy API đọc thống kê; visitor chỉ gửi heartbeat/end.
    // Gán thuộc tính proxy: tạo object gồm [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry|audio/published/[a-f0-9]{64}\\.mp3|media/published/[a-f0-9]{64}|images/published/[a-z0-9-]+\\.jpg)$'], [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$'].
    proxy: {
      // Gán thuộc tính [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry|audio/published/[a-f0-9]{64}\\.mp3|media/published/[a-f0-9]{64}|images/published/[a-z0-9-]+\\.jpg)$']: tạo object gồm target, changeOrigin, rewrite, configure.
      [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry|audio/published/[a-f0-9]{64}\\.mp3|media/published/[a-f0-9]{64}|images/published/[a-z0-9-]+\\.jpg)$']: {
        // Gán thuộc tính target: tính biểu thức process.env.CATALOG_TARGET || 'http://127.0.0.1:8788'.
        target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
        // Gán thuộc tính changeOrigin: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        changeOrigin: true,
        // Gán thuộc tính rewrite: khai báo callback path => path.replace(/^\/api\/catalog/, '').
        rewrite: path => path.replace(/^\/api\/catalog/, ''),
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },`: Khai báo configure(proxy). Nhận đầu vào qua tham số. | Đăng ký xử lý sự kiện: proxy.on('proxyReq', request => request.removeHeader('origin')).
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
        // TẠI SAO (configure): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
        // quán và dễ bảo trì.
      },
      // Gán thuộc tính [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$']: tạo object gồm target, changeOrigin, rewrite, configure.
      [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$']: {
        // Gán thuộc tính target: tính biểu thức process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787'.
        target: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
        // Gán thuộc tính changeOrigin: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        changeOrigin: true,
        // Gán thuộc tính rewrite: khai báo callback path => path.replace(/^\/api\/presence/, '').
        rewrite: path => path.replace(/^\/api\/presence/, ''),
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },`: Khai báo configure(proxy). Nhận đầu vào qua tham số. | Đăng ký xử lý sự kiện: proxy.on('proxyReq', request => request.removeHeader('origin')).
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
        // TẠI SAO (configure): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
        // quán và dễ bảo trì.
      },
    },
  },
  // Gán thuộc tính build: tạo object gồm outDir. | Gán thuộc tính outDir: chọn giữa hai giá trị theo điều kiện mode === 'admin'.
  build: { outDir: mode === 'admin' ? 'dist-admin' : 'dist' },

  // CHỨC NĂNG: Sao chép file xác minh App Links vào bản web triển khai.
  // XỬ LÝ: Dùng static riêng; tránh public/index.html cũ đè entry của Vite.
  // Gán thuộc tính publicDir: chuỗi 'static'.
  publicDir: 'static',

  // Gán thuộc tính resolve: tạo object gồm alias.
  resolve: {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `alias: [`: Gán thuộc tính alias: tạo mảng [ { find: /^react$/, replacement: webRequire.resolve('react'), }, { find: /^reac.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    alias: [
      {
        // Gán thuộc tính find: sử dụng /^react$/ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        find: /^react$/,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `replacement: webRequire.resolve('react'),`: Gán thuộc tính replacement: Gọi webRequire.resolve('react').
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         */
        replacement: webRequire.resolve('react'),
      },
      {
        // Gán thuộc tính find: sử dụng /^react\/jsx-runtime$/ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        find: /^react\/jsx-runtime$/,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `replacement: webRequire.resolve('react/jsx-runtime'),`: Gán thuộc tính replacement: Gọi webRequire.resolve('react/jsx-runtime').
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         */
        replacement: webRequire.resolve('react/jsx-runtime'),
      },
      {
        // Gán thuộc tính find: sử dụng /^react\/jsx-dev-runtime$/ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        find: /^react\/jsx-dev-runtime$/,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `replacement: webRequire.resolve('react/jsx-dev-runtime'),`: Gán thuộc tính replacement: Gọi webRequire.resolve('react/jsx-dev-runtime').
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         */
        replacement: webRequire.resolve('react/jsx-dev-runtime'),
      },
      {
        // Gán thuộc tính find: sử dụng /^react-dom$/ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        find: /^react-dom$/,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `replacement: webRequire.resolve('react-dom'),`: Gán thuộc tính replacement: Gọi webRequire.resolve('react-dom').
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         */
        replacement: webRequire.resolve('react-dom'),
      },
      {
        // Gán thuộc tính find: sử dụng /^react-dom\/client$/ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        find: /^react-dom\/client$/,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `replacement: webRequire.resolve('react-dom/client'),`: Gán thuộc tính replacement: Gọi webRequire.resolve('react-dom/client').
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}))`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        replacement: webRequire.resolve('react-dom/client'),
      },
    ],
  },
}))
