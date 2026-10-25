/** FILE NÀY LÀM GÌ: Bundle logic Admin để Node test đọc được workspace TypeScript.
 * admin-core npm test gọi; dùng esbuild có sẵn từ Vite, không tải thư viện mới.
 * Không bundle React; chỉ entry logic thuần. */
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '..')
const req = createRequire(path.join(root, 'apps/web/package.json'))
req('esbuild').buildSync({ entryPoints: [path.join(root,'packages/admin-core/src/index.ts')],
 bundle: true, platform: 'node', format: 'cjs', outfile: path.join(root,'packages/admin-core/.test-build/index.cjs') })
