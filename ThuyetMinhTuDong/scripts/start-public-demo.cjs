/**
 * FILE NÀY LÀM GÌ: Mở Vite/tunnel HTTPS và chỉ công bố QR đã kiểm tra được.
 * npm run demo:public gọi; phụ thuộc cloudflared và create-public-qr.cjs.
 * UC05: QR chung mở website, không yêu cầu Expo Go/tài khoản du khách.
 */
const fs = require('node:fs')
const https = require('node:https')
const { Resolver } = require('node:dns')
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn, spawnSync } = require('node:child_process')
const { setTimeout: delay } = require('node:timers/promises')

const root = path.resolve(__dirname, '..')
const folder = path.join(root, '.qr-output')
const stateFile = path.join(folder, 'demo-session.json')
const local = 'http://127.0.0.1:4173'
// CHỨC NĂNG: QR chỉ phục vụ bản đã build, không đưa hàng trăm module dev qua tunnel.
const isBuiltGuidePage = text => typeof text === 'string' && /<title>HueGuide<\/title>/.test(text) && /id=["']root["']/.test(text) && /src=["']\/assets\/[^"']+\.js["']/.test(text) && !text.includes('/@vite/client')
const builtEntry = text => isBuiltGuidePage(text) ? text.match(/src=["'](\/assets\/[^"']+\.js)["']/)?.[1] : null
// CHỨC NĂNG: Kiểm tra đúng file sau khi sắp xếp services; test bắt đường dẫn cũ.
const GUIDE_MODULE_PATH = '/src/services/platform.ts'
const isGuideModule = text => typeof text === 'string' && !/<html|<!doctype/i.test(text) && text.includes('publicSiteOrigin') && text.includes('siteOrigin')
const isGuidePage = text => typeof text === 'string' && /id=["']root["']/.test(text) && text.includes('/src/main.tsx')

// CHỨC NĂNG: Tên miền tunnel mới có thể bị cache DNS âm trên Windows.
// XỬ LÝ: Chỉ lần kiểm tra HTTPS thử DNS công khai khi ENOTFOUND;
// không đổi DNS của máy, không bỏ kiểm tra chứng chỉ TLS hoặc hostname.
function readWithPublicDns(url) {
  return new Promise(resolve => {
    const dns = new Resolver({ timeout: 1500, tries: 2 })
    dns.setServers(['1.1.1.1', '8.8.8.8'])
    const request = https.get(url, { lookup(hostname, options, callback) {
      dns.resolve4(hostname, (error, addresses) => {
        if (error || !addresses?.length) { callback(error || new Error('No public DNS record')); return }
        if (options.all) callback(null, addresses.map(address => ({ address, family: 4 })))
        else callback(null, addresses[0], 4)
      })
    } }, response => {
      if (response.statusCode !== 200) { response.resume(); resolve(null); return }
      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => resolve(body))
      response.on('error', () => resolve(null))
    })
    request.setTimeout(5000, () => { request.destroy(); resolve(null) })
    request.on('error', () => resolve(null))
  })
}
async function read(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok && process.env.QR_DEBUG) console.log('HTTP', response.status, url)
    return response.ok ? await response.text() : null
  } catch (error) { if (error.cause?.code === 'ENOTFOUND' && new URL(url).hostname.endsWith('.trycloudflare.com')) return readWithPublicDns(url); if (process.env.QR_DEBUG) console.log('NETWORK', url, error.cause?.code || error.message); return null }
}
// CHỨC NĂNG: Kiểm tra HTML production và bundle JS thật, không nhận HTML fallback.
// XỬ LÝ: So tên asset với dist hiện tại để không tái dùng server đang giữ bản cũ.
async function probe(origin, configured = false) {
  const page = await read(origin + '/')
  const entry = builtEntry(page)
  const expected = fs.existsSync(path.join(root, 'apps/web/dist/index.html'))
    ? builtEntry(fs.readFileSync(path.join(root, 'apps/web/dist/index.html'), 'utf8')) : null
  if (!entry || entry !== expected) return false
  const bundle = await read(origin + entry)
  if (!bundle || /<html|<!doctype/i.test(bundle.slice(0, 100))) return false
  if (!configured) return true
  try { const config = JSON.parse(await read(origin + '/visitor-config.json')); return config?.publicSiteOrigin === origin }
  catch { return false }
}
// CHỨC NĂNG: Giữ server/tunnel chạy nền khi lệnh tạo QR hoàn tất.
// XỬ LÝ: Ẩn cửa sổ phụ; chỉ dọn tiến trình do lần gọi này tạo khi thất bại.
function launch(command, args, cwd, name) {
  const log = path.join(folder, name + '-' + Date.now() + '.log')
  const descriptor = fs.openSync(log, 'a')
  try {
    const child = spawn(command, args, { cwd, detached: true, windowsHide: true, stdio: ['ignore', descriptor, descriptor] })
    child.unref()
    return { child, log }
  } finally { fs.closeSync(descriptor) }
}
function configureQr(origin) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr.cjs'), '--url', origin, '--configure'],
    { cwd: root, encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) throw new Error(result.stderr || 'Không tạo được QR')
  process.stdout.write(result.stdout)
}
function publish(state) {
  fs.writeFileSync(stateFile, JSON.stringify({ ...state, verifiedAt: new Date().toISOString() }, null, 2))
  fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'),
    'QR chung: shared-qr.png\nURL: ' + state.origin + '/\n\nĐây là URL demo tạm thời. Máy tính và tunnel phải đang chạy, có Internet.\nNếu QR cũ không mở được: chạy npm run demo:public tại gốc dự án, rồi dùng ảnh QR mới.\nMuốn dùng một URL lâu dài cần triển khai web/tên miền cố định.\n')
  fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR vào Kinh thành Huế</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f1f5fb;color:#102950;margin:0;padding:32px 16px;text-align:center}main{max-width:520px;margin:auto;background:white;border-radius:24px;padding:28px;box-shadow:0 16px 60px #10295012}img{width:min(100%,360px)}a{color:#075ed4;overflow-wrap:anywhere}p{color:#576886}</style><main><h1>Khám phá Kinh thành Huế</h1><p>Quét bằng camera điện thoại. Không cần Expo Go.</p><img src="shared-qr.png" alt="QR chung vào website"><p><a href="${state.origin}/">${state.origin}/</a></p><p>Máy tính và tunnel cần đang chạy. QR hết phiên: chạy lại <code>npm run demo:public</code> và dùng ảnh mới.</p></main></html>`)
  console.log('SẴN SÀNG — đã kiểm tra HTTPS:', state.origin + '/')
  console.log('Ảnh QR:', path.join(folder, 'shared-qr.png'))
  console.log('Xem QR:', path.join(folder, 'index.html'))
}
async function main() {
  fs.mkdirSync(folder, { recursive: true })
  const web = path.join(root, 'apps/web')
  const webRequire = createRequire(path.join(web, 'package.json'))
  const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
  // CHỨC NĂNG: Build trước khi mở QR để trình duyệt tải bundle đã nén/gộp.
  // XỬ LÝ: Không tắt hay thay server dev 5173 của người dùng; preview riêng ở 4173.
  console.log('Đang đóng gói website cho điện thoại...')
  const build = spawnSync(process.execPath, [vite, 'build'], { cwd: web, encoding: 'utf8', windowsHide: true })
  if (build.status !== 0) throw new Error(build.stderr || build.stdout || 'Build web thất bại')
  let webProcess, tunnelProcess
  try {
    if (!await probe(local)) {
      if (await read(local + '/')) throw new Error('Cổng 4173 đang chạy ứng dụng khác; không tự tắt tiến trình đó.')
      webProcess = launch(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], web, 'preview')
      let ready = false
      for (let i = 0; i < 20; i++) { if (await probe(local)) { ready = true; break }; await delay(500) }
      if (!ready) throw new Error('Không khởi động được preview. Xem ' + webProcess.log)
    }
    // CHỨC NĂNG: Tái dùng URL chỉ khi đúng phiên production vẫn hoạt động.
    if (fs.existsSync(stateFile)) {
      try {
        const previous = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
        if (previous.mode === 'production' && previous.origin && await probe(previous.origin)) {
          configureQr(previous.origin)
          if (await probe(previous.origin, true)) { publish(previous); return }
        }
      } catch { console.log('Phiên cũ không còn dùng được; đang tạo QR mới.') }
    }
    const cloudflared = process.env.CLOUDFLARED_PATH || path.join(root, '.tools/cloudflared.exe')
    if (!fs.existsSync(cloudflared)) throw new Error('Thiếu cloudflared; đặt CLOUDFLARED_PATH trước khi chạy.')
    tunnelProcess = launch(cloudflared, ['tunnel', '--url', local, '--http-host-header', 'localhost', '--protocol', 'http2'], root, 'cloudflared')
    console.log('Đang tạo địa chỉ HTTPS công khai...')
    let origin
    for (let i = 0; i < 60; i++) {
      origin = fs.readFileSync(tunnelProcess.log, 'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0]
      if (origin) break
      await delay(1000)
    }
    if (!origin) throw new Error('Chưa nhận được URL HTTPS. Xem ' + tunnelProcess.log)
    let reachable = false
    for (let i = 0; i < 30; i++) { if (await probe(origin)) { reachable = true; break }; await delay(1000) }
    if (!reachable) throw new Error('Website HTTPS chưa truy cập được; chưa tạo QR mới. Xem ' + tunnelProcess.log)
    // CHỨC NĂNG: Chỉ tạo ảnh QR sau khi chính website HTTPS đã vượt kiểm tra.
    configureQr(origin)
    let configured = false
    for (let i = 0; i < 20; i++) { if (await probe(origin, true)) { configured = true; break }; await delay(1000) }
    if (!configured) throw new Error('Website đã mở nhưng cấu hình URL chưa cập nhật. Chạy lại npm run demo:public.')
    publish({ origin, mode: 'production', localOrigin: local, webPid: webProcess?.child.pid, tunnelPid: tunnelProcess.child.pid,
      webLog: webProcess?.log, tunnelLog: tunnelProcess.log, startedAt: new Date().toISOString() })
  } catch (error) { tunnelProcess?.child.kill(); webProcess?.child.kill(); throw error }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { GUIDE_MODULE_PATH, isGuideModule, isGuidePage, isBuiltGuidePage, builtEntry }
