/**
 * FILE NÀY LÀM GÌ: Chạy web cùng các mock API RAM cần thiết, không cần mở ba terminal.
 * Root/web npm scripts gọi; phụ thuộc Node, Vite và hai service catalog/presence.
 * UC02/UC07/UC13–UC17: kiểm tra API trước khi mở UI; không reset RAM đang dùng.
 */
const fs = require('node:fs')
const path = require('node:path')
const net = require('node:net')
const { spawn } = require('node:child_process')
const { createRequire } = require('node:module')
const { setTimeout: delay } = require('node:timers/promises')
const root = path.resolve(__dirname, '..')

// CHỨC NĂNG: Đọc API có giới hạn thời gian; không nhầm trang HTML với JSON.
async function readJson(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) })
    if (!response.ok) return null
    return await response.json()
  } catch { return null }
}
async function healthy(service) {
  return service.accept(await readJson(service.origin + service.healthPath))
}
function portOpen(origin) {
  const url = new URL(origin)
  return new Promise(resolve => {
    const socket = net.connect({ host: url.hostname, port: Number(url.port || (url.protocol === 'https:' ? 443 : 80)) })
    let done = false
    const finish = value => { if (!done) { done = true; socket.destroy(); resolve(value) } }
    socket.setTimeout(800)
    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
    socket.once('timeout', () => finish(false))
  })
}

// CHỨC NĂNG: API chạy nền để đóng web không làm mất RAM mà admin/mobile đang dùng.
// XỬ LÝ: Chỉ mở tiến trình mới khi chưa có service; không tắt tiến trình có sẵn.
function launchDetached(service) {
  const folder = path.join(root, '.runtime/dev-services')
  fs.mkdirSync(folder, { recursive: true })
  const log = path.join(folder, service.name + '.log')
  const descriptor = fs.openSync(log, 'a')
  try {
    const child = spawn(process.execPath, [path.join(root, service.script)], {
      cwd: root, env: process.env, detached: true, windowsHide: true,
      stdio: ['ignore', descriptor, descriptor],
    })
    child.on('error', error => console.error(service.name + ': ' + error.message))
    child.unref()
    return log
  } finally { fs.closeSync(descriptor) }
}

// CHỨC NĂNG: Tái sử dụng service đúng, báo rõ khi sai cổng hoặc API tùy chỉnh chưa chạy.
// XỬ LÝ: Không khởi động lại kho RAM sẵn có; chờ sẵn sàng trước khi chạy Vite.
async function ensureService(service, { launch = launchDetached, timeoutMs = 20000 } = {}) {
  if (await healthy(service)) return 'reused'
  if (service.custom) throw new Error(service.name + ': API đã cấu hình chưa sẵn sàng tại ' + service.origin)
  if (await portOpen(service.origin)) throw new Error(service.name + ': cổng đang có ứng dụng khác hoặc API lỗi tại ' + service.origin)
  const log = launch(service)
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (await healthy(service)) return 'started'
    await delay(250)
  }
  throw new Error(service.name + ' chưa khởi động được. Xem log: ' + log)
}

// CHỨC NĂNG: Dùng chung bước kiểm tra API cho web và Expo admin; không khởi động trùng RAM.
async function ensureDevServices() {
  const services = [
    { name: 'catalog', origin: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788', custom: Boolean(process.env.CATALOG_TARGET),
      script: 'scripts/start-catalog.cjs', healthPath: '/version', accept: value => typeof value?.version === 'string' },
    { name: 'presence', origin: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787', custom: Boolean(process.env.PRESENCE_TARGET),
      script: 'services/presence/server.cjs', healthPath: '/statistics/active', accept: value => Number.isInteger(value?.active) && value.active >= 0 && value.ttlSeconds === 90 },
  ]
  for (const service of services) {
    // CHỨC NĂNG: Cổng tùy chỉnh phải trùng URL proxy; không mở nhầm service ở cổng mặc định.
    const configuredPort = process.env[service.name === 'catalog' ? 'CATALOG_PORT' : 'PRESENCE_PORT']
    if (!service.custom && configuredPort && configuredPort !== (service.name === 'catalog' ? '8788' : '8787')) {
      throw new Error('Đã đổi ' + service.name + ' PORT; cần đặt ' + service.name.toUpperCase() + '_TARGET trỏ đúng URL cho Vite.')
    }
    const result = await ensureService(service)
    console.log(service.name + ': ' + (result === 'reused' ? 'dùng lại API đang chạy' : 'đã khởi động') + ' — ' + service.origin)
  }
  // CHỨC NĂNG: Kiểm tra catalog thật, không chỉ cổng HTTP đã mở.
  const places = await readJson(services[0].origin + '/published')
  if (!Array.isArray(places)) throw new Error('Catalog chưa trả được danh sách công bố. Xem .runtime/dev-services/catalog.log')

  return services
}

async function main() {
  const incoming = process.argv.slice(2)
  const admin = incoming.includes('--admin')
  const args = incoming.filter(value => value !== '--admin')
  const option = (name, fallback) => {
    const index = args.indexOf(name)
    return index >= 0 ? args[index + 1] : args.find(value => value.startsWith(name + '='))?.slice(name.length + 1) ?? fallback
  }
  const port = Number(option('--port', admin ? '5174' : '5173'))
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('--port phải nằm trong 1–65535.')
  const forward = args.filter((value, index) => value !== '--port' && !value.startsWith('--port=') && args[index - 1] !== '--port')
  await ensureDevServices()

  const origin = 'http://127.0.0.1:' + port
  if (await portOpen(origin)) {
    let html = ''
    try { html = await (await fetch(origin, { signal: AbortSignal.timeout(1500) })).text() } catch { /* Báo cổng bận bên dưới. */ }
    const entry = admin ? '/src/main-admin.tsx' : '/src/main.tsx'
    if (html.includes('/@vite/client') && html.includes(entry)) {
      console.log('Web đã chạy: ' + origin + (admin ? '/admin' : '/') + ' — tải lại trang để kết nối API vừa phục hồi.')
      return
    }
    throw new Error('Cổng ' + port + ' đã được sử dụng. Chọn --port khác; không tự tắt ứng dụng đang chạy.')
  }
  const web = path.join(root, 'apps/web')
  const webRequire = createRequire(path.join(web, 'package.json'))
  const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
  const child = spawn(process.execPath, [vite, '--host', admin ? '127.0.0.1' : '0.0.0.0',
    '--port', String(port), '--strictPort', ...(admin ? ['--mode', 'admin'] : []), ...forward], {
    cwd: web, env: process.env, stdio: 'inherit', windowsHide: true,
  })
  console.log('Các API RAM tiếp tục chạy khi đóng web; restart API sẽ mất dữ liệu RAM.')
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
}
if (require.main === module) {
  main().catch(error => { console.error('Không thể mở web: ' + error.message); process.exitCode = 1 })
}
module.exports = { ensureService, readJson, ensureDevServices }
/* CÁCH KIỂM TRA: Một lệnh tự mở RAM; chạy lại giữ nguyên dữ liệu; API sai/cổng bận báo rõ. */
