/**
 * FILE NÀY LÀM GÌ: Khởi động Expo du khách và kiểm tra mock API bằng một lệnh.
 * npm start/android/ios của workspace mobile gọi; phụ thuộc Expo và helper start-web.
 * Chỉ truyền URL dev proxy vào tiến trình, không ghi đè .env/QR web HTTPS.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn } = require('node:child_process')
const { ensureDevServices } = require('./start-web.cjs')
const { findLanAddress } = require('./start-catalog.cjs')
const { CATALOG_PREFIX, PRESENCE_PREFIX } = require('./metro-visitor-proxy.cjs')
const root = path.resolve(__dirname, '..')
function visitorOptions(address, port = 8081) {
  if (!address) throw new Error('Kết nối máy tính và điện thoại cùng Wi-Fi trước khi chạy mobile du khách.')
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cổng Expo không hợp lệ.')
  const origin = 'http://' + address + ':' + port
  return { EXPO_PUBLIC_APP_TARGET: 'visitor', REACT_NATIVE_PACKAGER_HOSTNAME: address,
    EXPO_PUBLIC_CATALOG_API_URL: origin + CATALOG_PREFIX,
    EXPO_PUBLIC_PRESENCE_API_URL: origin + PRESENCE_PREFIX }
}
async function main(args = process.argv.slice(2)) {
  const index = args.indexOf('--port')
  const port = Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.slice(7) || '8081')
  const env = { ...process.env, ...visitorOptions(findLanAddress(), port) }
  // CHỨC NĂNG: Giữ cùng kho RAM với web/admin; thiếu service tự khởi động, không reset.
  await ensureDevServices()
  const mobile = path.join(root, 'apps/mobile')
  const req = createRequire(path.join(mobile, 'package.json'))
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  const forward = args.filter((value, i) => value !== '--port' && !value.startsWith('--port=') && args[i - 1] !== '--port')
  console.log('Mobile du khách: exp://' + env.REACT_NATIVE_PACKAGER_HOSTNAME + ':' + port)
  console.log('API công khai qua Metro: ' + env.EXPO_PUBLIC_CATALOG_API_URL)
  const child = spawn(process.execPath, [cli, 'start', '--port', String(port), ...(forward.includes('--clear') ? [] : ['--clear']), ...forward], {
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  child.on('exit', code => { process.exitCode = code ?? 1 })
}
if (require.main === module) main().catch(error => { console.error('Chưa mở được mobile du khách: ' + error.message); process.exitCode = 1 })
module.exports = { visitorOptions }
/* CÁCH KIỂM TRA: URL tunnel hết phiên không ảnh hưởng Expo LAN; không có proxy admin; đổi mạng chạy lại. */
