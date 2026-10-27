/**
 * FILE NÀY LÀM GÌ: Chạy FE mobile quản lý và tự kiểm tra các mock API phụ thuộc.
 * npm run start:admin --workspace=mobile gọi; dùng helper start-web, Expo và proxy Metro.
 * Chỉ truyền URL cho tiến trình admin, không ghi đè .env hoặc cấu hình du khách.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn } = require('node:child_process')
const { ensureDevServices } = require('./start-web.cjs')
const { findLanAddress } = require('./start-catalog.cjs')
const { PREFIX } = require('./metro-admin-proxy.cjs')
const root = path.resolve(__dirname, '..')
const mobile = path.join(root, 'apps/mobile')

// CHỨC NĂNG: Tạo URL từ IP mạng vật lý và cổng Expo, không dùng IP API cũ trong .env.
// XỬ LÝ: Một origin chung cho nội dung, QR thống kê, presence và nghe thử admin.
function adminOptions(address, port = 8082) {
  if (!address) throw new Error('Chưa có mạng LAN. Kết nối máy tính và điện thoại cùng Wi-Fi rồi chạy lại.')
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cổng Expo không hợp lệ.')
  const base = 'http://' + address + ':' + port + PREFIX
  return { EXPO_PUBLIC_APP_TARGET: 'admin', REACT_NATIVE_PACKAGER_HOSTNAME: address,
    EXPO_PUBLIC_ADMIN_API_URL: base, EXPO_PUBLIC_CATALOG_API_URL: base,
    EXPO_PUBLIC_ADMIN_PRESENCE_API_URL: base + '/presence' }
}

async function main(args = process.argv.slice(2)) {
  const address = findLanAddress()
  const index = args.indexOf('--port')
  const port = Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.slice(7) || '8082')
  const env = { ...process.env, ...adminOptions(address, port) }
  // CHỨC NĂNG: Kiểm tra/mở mock server trước khi Expo biên dịch các URL vào bundle.
  // XỬ LÝ: Tái sử dụng server RAM hiện có; không dừng server hoặc reset dữ liệu.
  await ensureDevServices()
  const req = createRequire(path.join(mobile, 'package.json'))
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  const forward = args.filter((value, i) => value !== '--port' && !value.startsWith('--port=') && args[i - 1] !== '--port')
  console.log('Mobile Admin: exp://' + address + ':' + port)
  console.log('API qua Metro: ' + env.EXPO_PUBLIC_ADMIN_API_URL)
  console.log('Điện thoại và máy tính cần cùng Wi-Fi; không cần sửa IP trong .env.')
  const child = spawn(process.execPath, [cli, 'start', '--port', String(port), ...(forward.includes('--clear') ? [] : ['--clear']), ...forward], {
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  child.on('exit', code => { process.exitCode = code ?? 1 })
}
if (require.main === module) main().catch(error => { console.error('Chưa mở được Admin mobile: ' + error.message); process.exitCode = 1 })
module.exports = { adminOptions }
/* CÁCH KIỂM TRA: Đổi Wi-Fi rồi chạy lại lấy IP mới; .env du khách giữ nguyên; mock server thiếu tự mở. */
