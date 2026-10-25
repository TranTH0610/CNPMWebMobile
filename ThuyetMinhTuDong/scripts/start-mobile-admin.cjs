/** FILE NÀY LÀM GÌ: Chạy Expo bản quản lý riêng trên Windows/macOS, không đổi .env du khách.
 * npm run start:admin --workspace=mobile gọi; phụ thuộc Expo CLI đã cài.
 * EXPO_PUBLIC_APP_TARGET chỉ chọn bản FE, không phải token hoặc kiểm tra quyền.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn } = require('node:child_process')
const mobile = path.resolve(__dirname, '../apps/mobile')
const req = createRequire(path.join(mobile, 'package.json'))
const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
// CHỨC NĂNG: Tách dev server admin ở 8082; giữ nguyên start thường của du khách.
const child = spawn(process.execPath, [cli, 'start', '--port', '8082', ...process.argv.slice(2)], {
  cwd: mobile, env: { ...process.env, EXPO_PUBLIC_APP_TARGET: 'admin' }, stdio: 'inherit', windowsHide: true,
})
child.on('error', error => { console.error(error.message); process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
/* CÁCH KIỂM TRA: start:admin vào Dashboard, không có tab/QR du khách trong bản này. */
