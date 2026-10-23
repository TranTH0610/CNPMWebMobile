/**
 * FILE NÀY LÀM GÌ: Khởi động web và đường hầm HTTPS, rồi tạo một QR vào chung.
 * npm run demo:public gọi trên Windows; không cần đăng nhập Expo Go.
 * Phụ thuộc Vite/qrcode đã cài và cloudflared tại .tools hoặc CLOUDFLARED_PATH.
 * Liên quan UC05: chỉ báo QR sẵn sàng sau khi kiểm tra URL công khai.
 */
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn, spawnSync } = require('node:child_process')
const { setTimeout: delay } = require('node:timers/promises')

const root = path.resolve(__dirname, '..')
const folder = path.join(root, '.qr-output')
const stateFile = path.join(folder, 'demo-session.json')
const local = 'http://127.0.0.1:5173'

async function read(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    return response.ok ? await response.text() : null
  } catch { return null }
}

// CHỨC NĂNG: Tạo tiến trình nền tiếp tục chạy sau khi lệnh này hoàn thành.
// XỬ LÝ: Ẩn cửa sổ phụ, ghi log ra file và không gắn vòng đời vào terminal tạm.
function launch(command, args, cwd, name) {
  const log = path.join(folder, name + '-' + Date.now() + '.log')
  const descriptor = fs.openSync(log, 'a')
  try {
    const child = spawn(command, args, {
      cwd, detached: true, windowsHide: true,
      stdio: ['ignore', descriptor, descriptor],
    })
    child.unref()
    return { child, log }
  } finally { fs.closeSync(descriptor) }
}

function configureQr(origin) {
  const result = spawnSync(process.execPath, [
    path.join(root, 'scripts/create-public-qr.cjs'), '--url', origin, '--configure',
  ], { cwd: root, encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) throw new Error(result.stderr || 'Không tạo được QR')
  process.stdout.write(result.stdout)
}

async function main() {
  fs.mkdirSync(folder, { recursive: true })
  const currentModule = await read(local + '/src/platform.ts')
  if (fs.existsSync(stateFile) && currentModule?.includes('publicSiteOrigin')) {
    const previous = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
    if (previous.origin && await read(previous.origin + '/')) {
      configureQr(previous.origin)
      console.log('Đang dùng lại phiên demo còn hoạt động:', previous.origin + '/qr')
      return
    }
  }

  const web = path.join(root, 'apps/web')
  const webRequire = createRequire(path.join(web, 'package.json'))
  let webProcess
  let tunnelProcess
  try {
    if (!currentModule?.includes('publicSiteOrigin')) {
      if (await read(local + '/')) throw new Error('Cổng 5173 đang chạy ứng dụng khác; không tự tắt tiến trình đó.')
      const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
      webProcess = launch(process.execPath, [vite, '--host', '0.0.0.0', '--port', '5173', '--strictPort'], web, 'vite')
      console.log('Đang khởi động website...')
      let ready = false
      for (let attempt = 0; attempt < 20; attempt++) {
        if ((await read(local + '/src/platform.ts'))?.includes('publicSiteOrigin')) { ready = true; break }
        await delay(500)
      }
      if (!ready) throw new Error('Không khởi động được Vite. Xem log: ' + webProcess.log)
    }

    const cloudflared = process.env.CLOUDFLARED_PATH || path.join(root, '.tools/cloudflared.exe')
    if (!fs.existsSync(cloudflared)) throw new Error('Thiếu cloudflared. Đặt đường dẫn executable trong CLOUDFLARED_PATH.')
    tunnelProcess = launch(cloudflared, [
      'tunnel', '--url', local, '--http-host-header', 'localhost', '--protocol', 'http2',
    ], root, 'cloudflared')
    console.log('Đang tạo địa chỉ HTTPS công khai...')
    let origin
    for (let attempt = 0; attempt < 60; attempt++) {
      const log = fs.readFileSync(tunnelProcess.log, 'utf8')
      origin = log.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0]
      if (origin) break
      await delay(1000)
    }
    if (!origin) throw new Error('Chưa nhận được URL HTTPS. Xem log: ' + tunnelProcess.log)

    // CHỨC NĂNG: Đồng bộ URL cho web/mobile và tạo lại ảnh QR.
    // XỬ LÝ: Vite có thể khởi động lại khi .env đổi; tiếp tục chờ rồi kiểm tra cả module.
    configureQr(origin)
    console.log('Đang xác nhận website công khai hoạt động...')
    let reachable = false
    for (let attempt = 0; attempt < 30; attempt++) {
      const page = await read(origin + '/')
      const module = page ? await read(origin + '/src/platform.ts') : null
      if (page && module?.includes(origin)) { reachable = true; break }
      await delay(1000)
    }
    if (!reachable) throw new Error('URL chưa truy cập được. Chưa thể dùng QR. Xem log: ' + tunnelProcess.log)
    fs.writeFileSync(stateFile, JSON.stringify({
      origin, webPid: webProcess?.child.pid, tunnelPid: tunnelProcess.child.pid,
      webLog: webProcess?.log, tunnelLog: tunnelProcess.log, startedAt: new Date().toISOString(),
    }, null, 2))
    console.log('SẴN SÀNG. Trang QR:', origin + '/qr')
    console.log('QR:', path.join(folder, 'shared-qr.png'))
    console.log('Website và tunnel tiếp tục chạy nền. Máy tính phải bật và có Internet.')
  } catch (error) {
    // CHỨC NĂNG: Dọn đúng tiến trình do lần chạy thất bại này tạo ra.
    // XỬ LÝ: Không tắt server đã có sẵn của người dùng.
    tunnelProcess?.child.kill()
    webProcess?.child.kill()
    throw error
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1 })
