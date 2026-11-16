/**
 * FILE NÀY LÀM GÌ: Chạy Expo trên máy tính, dùng SQL/API đang chạy trong Docker.
 * DÙNG BỞI: docker:mobile và docker:mobile:admin. Điện thoại mở app qua Metro LAN.
 * TẠI SAO: App iOS/Android vẫn chạy trên thiết bị; chỉ dịch vụ dữ liệu được đóng container.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn } = require('node:child_process')
const { ROOT, dockerSettings } = require('./DocCauHinhDocker.cjs')

async function main(args = process.argv.slice(2)) {
  const admin = args.includes('--admin')
  const { ports } = dockerSettings()
  const catalog = 'http://127.0.0.1:' + ports.CATALOG_PORT
  const response = await fetch(catalog + '/version', { signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw Error('API Docker chưa sẵn sàng; chạy npm run docker:up trước')
  const { findLanAddress } = require('../../scripts/ChayApiDiTich.cjs')
  const address = findLanAddress()
  const index = args.indexOf('--port')
  const port = Number(index >= 0 ? args[index + 1] : args.find(arg => arg.startsWith('--port='))?.slice(7) || (admin ? '8082' : '8081'))
  const options = admin ? require('../../scripts/ChayMobileQuanTri.cjs').adminOptions : require('../../scripts/ChayMobileDuKhach.cjs').visitorOptions
  const mobile = path.join(ROOT, 'apps/mobile')
  const req = createRequire(path.join(mobile, 'package.json'))
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  // XỬ LÝ: Tái dùng cấu hình proxy Metro sẵn có; không khởi động API Windows lần nữa.
  const env = { ...process.env, ...options(address, port), CATALOG_TARGET: catalog,
    PRESENCE_TARGET: 'http://127.0.0.1:' + ports.PRESENCE_PORT }
  const forward = args.filter((arg, i) => arg !== '--admin' && arg !== '--port' && !arg.startsWith('--port=') && args[i - 1] !== '--port')
  console.log('Expo ' + (admin ? 'quản lý' : 'du khách') + ': exp://' + address + ':' + port)
  const child = spawn(process.execPath, [cli, 'start', '--port', String(port), '--clear', ...forward], {
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  child.on('exit', code => { process.exitCode = code ?? 1 })
}

if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { main }
