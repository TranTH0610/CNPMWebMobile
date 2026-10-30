/**
 * FILE NÀY LÀM GÌ
 * Chuẩn bị bản web demo, mở tunnel HTTPS, kiểm tra khả năng truy cập rồi phối hợp tạo QR công
 * khai.
 *
 * VỊ TRÍ: scripts/start-public-demo.cjs
 * DÙNG BỞI: scripts/public-qr.test.cjs.
 * PHỤ THUỘC: node:fs; ./qr-http.cjs; node:path; node:module; node:child_process;
 * node:timers/promises
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo { readWithPublicDns }: require nạp module './qr-http.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { readWithPublicDns } = require('./qr-http.cjs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')
// Khai báo { spawn, spawnSync }: require nạp module 'node:child_process' để dùng chức năng có sẵn thay vì chép lại.
const { spawn, spawnSync } = require('node:child_process')
// Khai báo { setTimeout: delay }: require nạp module 'node:timers/promises' để dùng chức năng có sẵn thay vì chép lại.
const { setTimeout: delay } = require('node:timers/promises')

// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')
// Khai báo folder: Gọi path.join(root, '.qr-output').
const folder = path.join(root, '.qr-output')
// Khai báo stateFile: Gọi path.join(folder, 'demo-session.json').
const stateFile = path.join(folder, 'demo-session.json')
// Khai báo previewPort: tính biểu thức process.env.PUBLIC_PREVIEW_PORT || '4173'.
const previewPort = process.env.PUBLIC_PREVIEW_PORT || '4173'
// Khai báo local: tính biểu thức 'http://127.0.0.1:' + previewPort.
const local = 'http://127.0.0.1:' + previewPort
// CHỨC NĂNG: QR chỉ phục vụ bản đã build, không đưa hàng trăm module dev qua tunnel.
// Khai báo isBuiltGuidePage: khai báo callback text => typeof text === 'string' && /<title>HueGuide<\/title>/.test(text) &.
const isBuiltGuidePage = text => typeof text === 'string' && /<title>HueGuide<\/title>/.test(text) && /id=["']root["']/.test(text) && /src=["']\/assets\/[^"']+\.js["']/.test(text) && !text.includes('/@vite/client')
// TẠI SAO (isBuiltGuidePage): Các bước chạy demo được tập trung trong công cụ để các máy thực
// hiện cùng quy trình.
// Khai báo builtEntry: khai báo callback text => isBuiltGuidePage(text) ? text.match(/src=["'](\/assets\/[^"']+\.js).
const builtEntry = text => isBuiltGuidePage(text) ? text.match(/src=["'](\/assets\/[^"']+\.js)["']/)?.[1] : null
// TẠI SAO (builtEntry): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện
// cùng quy trình.
// CHỨC NĂNG: Kiểm tra đúng file sau khi sắp xếp services; test bắt đường dẫn cũ.
// Khai báo GUIDE_MODULE_PATH: chuỗi '/src/services/platform.ts'.
const GUIDE_MODULE_PATH = '/src/services/platform.ts'
// Khai báo isGuideModule: khai báo callback text => typeof text === 'string' && !/<html|<!doctype/i.test(text) && text.
const isGuideModule = text => typeof text === 'string' && !/<html|<!doctype/i.test(text) && text.includes('publicSiteOrigin') && text.includes('siteOrigin')
// TẠI SAO (isGuideModule): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện
// cùng quy trình.
// Khai báo isGuidePage: khai báo callback text => typeof text === 'string' && /id=["']root["']/.test(text) && text.in.
const isGuidePage = text => typeof text === 'string' && /id=["']root["']/.test(text) && text.includes('/src/main.tsx')
// TẠI SAO (isGuidePage): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện
// cùng quy trình.

// CHỨC NĂNG: Tên miền tunnel mới có thể bị cache DNS âm trên Windows.
// XỬ LÝ: Chỉ lần kiểm tra HTTPS thử DNS công khai khi ENOTFOUND;
// không đổi DNS của máy, không bỏ kiểm tra chứng chỉ TLS hoặc hostname.
// Khai báo read(url). Nhận đầu vào qua tham số.
async function read(url) {
  // Bắt đầu vùng try.
  try {
    // Khai báo response: await chờ fetch gửi HTTP request. | Gán thuộc tính signal: Gọi AbortSignal.timeout(5000).
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    // Rẽ nhánh nếu !response.ok && process.env.QR_DEBUG. | Thực hiện Gọi console.log('HTTP', response.status, url).
    if (!response.ok && process.env.QR_DEBUG) console.log('HTTP', response.status, url)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return response.ok ? await response.text() : null`: Trả kết quả: chọn giữa hai giá trị theo điều kiện response.ok.
     * DÒNG `} catch (error) { if (['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) && new U`: Bắt đầu vùng try. | Rẽ nhánh nếu ['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) && new URL(url).hostname.endsWith('.trycloudflare.com'). | Trả kết quả: Gọi readWithPublicDns(url). | Rẽ nhánh nếu process.env.QR_DEBUG. | Thực hiện Gọi console.log('NETWORK', url, error.cause?.code || error.message). | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return response.ok ? await response.text() : null
  } catch (error) { if (['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) && new URL(url).hostname.endsWith('.trycloudflare.com')) return readWithPublicDns(url); if (process.env.QR_DEBUG) console.log('NETWORK', url, error.cause?.code || error.message); return null }
}
// TẠI SAO (read): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử lý lỗi.
// CHỨC NĂNG: Kiểm tra HTML production và bundle JS thật, không nhận HTML fallback.
// XỬ LÝ: So tên asset với dist hiện tại để không tái dùng server đang giữ bản cũ.
// Khai báo probe(origin, configured). Nhận đầu vào qua tham số.
async function probe(origin, configured = false) {
  // Khai báo page: await chờ Gọi read(origin + '/').
  const page = await read(origin + '/')
  // Khai báo entry: Gọi builtEntry(page).
  const entry = builtEntry(page)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const expected = fs.existsSync(path.join(root, 'apps/web/dist/index.html'))`: Khai báo expected: chọn giữa hai giá trị theo điều kiện fs.existsSync(path.join(root, 'apps/web/dist/index.html')).
   * DÒNG `? builtEntry(fs.readFileSync(path.join(root, 'apps/web/dist/index.html'), 'utf8')) : `: Khai báo expected: chọn giữa hai giá trị theo điều kiện fs.existsSync(path.join(root, 'apps/web/dist/index.html')).
   */
  const expected = fs.existsSync(path.join(root, 'apps/web/dist/index.html'))
    ? builtEntry(fs.readFileSync(path.join(root, 'apps/web/dist/index.html'), 'utf8')) : null
  // Rẽ nhánh nếu !entry || entry !== expected. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
  if (!entry || entry !== expected) return false
  // Khai báo bundle: await chờ Gọi read(origin + entry).
  const bundle = await read(origin + entry)
  // Rẽ nhánh nếu !bundle || /<html|<!doctype/i.test(bundle.slice(0, 100)). | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
  if (!bundle || /<html|<!doctype/i.test(bundle.slice(0, 100))) return false
  // CHỨC NĂNG: QR chỉ được cấp khi catalog RAM thực sự truy cập qua proxy.
  // Bắt đầu vùng try. | Khai báo version: JSON.parse chuyển chuỗi sang dữ liệu. | Rẽ nhánh nếu typeof version?.version!=='string'. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
  try { const version=JSON.parse(await read(origin+'/api/catalog/version')); if(typeof version?.version!=='string')return false } catch {return false}
  // Rẽ nhánh nếu !configured. | Trả kết quả: sử dụng true làm giá trị của bước hiện tại.
  if (!configured) return true
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `try { const config = JSON.parse(await read(origin + '/visitor-config.json')); return `: Bắt đầu vùng try. | Khai báo config: JSON.parse chuyển chuỗi sang dữ liệu. | Trả kết quả: tính biểu thức config?.publicSiteOrigin === origin.
   * DÒNG `catch { return false }`: Bắt đầu vùng try. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  try { const config = JSON.parse(await read(origin + '/visitor-config.json')); return config?.publicSiteOrigin === origin }
  catch { return false }
}
// TẠI SAO (probe): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.
// CHỨC NĂNG: Giữ server/tunnel chạy nền khi lệnh tạo QR hoàn tất.
// XỬ LÝ: Ẩn cửa sổ phụ; chỉ dọn tiến trình do lần gọi này tạo khi thất bại.
// Khai báo launch(command, args, cwd, name). Nhận đầu vào qua tham số.
function launch(command, args, cwd, name) {
  // Khai báo log: Gọi path.join(folder, name + '-' + Date.now() + '.log').
  const log = path.join(folder, name + '-' + Date.now() + '.log')
  // Khai báo descriptor: Gọi fs.openSync(log, 'a').
  const descriptor = fs.openSync(log, 'a')
  // Bắt đầu vùng try.
  try {
    // Khai báo child: Gọi spawn(command, args, { cwd, detached: true, windowsHide: true, stdio: ['ignore', descripto. | Đặt trường cwd bằng giá trị của biến cùng tên. | Gán thuộc tính detached: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính stdio: tạo mảng ['ignore', descriptor, descriptor].
    const child = spawn(command, args, { cwd, detached: true, windowsHide: true, stdio: ['ignore', descriptor, descriptor] })
    // Thực hiện Gọi child.unref().
    child.unref()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return { child, log }`: Trả kết quả: tạo object gồm child, log. | Đặt trường child bằng giá trị của biến cùng tên. | Đặt trường log bằng giá trị của biến cùng tên.
     * DÒNG `} finally { fs.closeSync(descriptor) }`: Bắt đầu vùng try. | Thực hiện Gọi fs.closeSync(descriptor).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return { child, log }
  } finally { fs.closeSync(descriptor) }
}
// TẠI SAO (launch): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
// quy trình.
// Khai báo configureQr(origin). Nhận đầu vào qua tham số.
function configureQr(origin) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const result = spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr`: Khai báo result: Gọi spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr.cjs'), '--url', ori.
   * DÒNG `{ cwd: root, encoding: 'utf8', windowsHide: true })`: Khai báo result: Gọi spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr.cjs'), '--url', ori. | Gán thuộc tính cwd: sử dụng root làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính encoding: chuỗi 'utf8'. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   */
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr.cjs'), '--url', origin, '--configure'],
    { cwd: root, encoding: 'utf8', windowsHide: true })
  // Rẽ nhánh nếu result.status !== 0. | Ném new Error(result.stderr || 'Không tạo được QR').
  if (result.status !== 0) throw new Error(result.stderr || 'Không tạo được QR')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `process.stdout.write(result.stdout)`: Thực hiện Gọi process.stdout.write(result.stdout).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  process.stdout.write(result.stdout)
}
// TẠI SAO (configureQr): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
// không phải xử lý dữ liệu sai như thành công.
// Khai báo publish(state). Nhận đầu vào qua tham số.
function publish(state) {
  // Thực hiện Gọi fs.writeFileSync(stateFile, JSON.stringify({ ...state, verifiedAt: new Date().toISOString(. | Gán thuộc tính verifiedAt: Gọi new Date().toISOString().
  fs.writeFileSync(stateFile, JSON.stringify({ ...state, verifiedAt: new Date().toISOString() }, null, 2))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'),`: Thực hiện Gọi fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'), 'QR chung: shared-qr.png\nURL: ' + st.
   * DÒNG `'QR chung: shared-qr.png\nURL: ' + state.origin + '/?entry=gate\n\nĐây là URL demo tạ`: Thực hiện Gọi fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'), 'QR chung: shared-qr.png\nURL: ' + st.
   */
  fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'),
    'QR chung: shared-qr.png\nURL: ' + state.origin + '/?entry=gate\n\nĐây là URL demo tạm thời. Máy tính và tunnel phải đang chạy, có Internet.\nNếu QR cũ không mở được: chạy npm run demo:public tại gốc dự án, rồi dùng ảnh QR mới.\nMuốn dùng một URL lâu dài cần triển khai web/tên miền cố định.\n')
  // DÒNG `fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="vi"><me`: Thực hiện Gọi fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="vi"><meta ch.
  fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR vào Kinh thành Huế</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f1f5fb;color:#102950;margin:0;padding:32px 16px;text-align:center}main{max-width:520px;margin:auto;background:white;border-radius:24px;padding:28px;box-shadow:0 16px 60px #10295012}img{width:min(100%,360px)}a{color:#075ed4;overflow-wrap:anywhere}p{color:#576886}</style><main><h1>Khám phá Kinh thành Huế</h1><p>Quét bằng camera điện thoại. Không cần Expo Go.</p><img src="shared-qr.png" alt="QR chung vào website"><p><a href="${state.origin}/?entry=gate">${state.origin}/?entry=gate</a></p><p>Máy tính và tunnel cần đang chạy. QR hết phiên: chạy lại <code>npm run demo:public</code> và dùng ảnh mới.</p></main></html>`)
  // Thực hiện Gọi console.log('SẴN SÀNG — đã kiểm tra HTTPS:', state.origin + '/').
  console.log('SẴN SÀNG — đã kiểm tra HTTPS:', state.origin + '/')
  // Thực hiện Gọi console.log('Ảnh QR:', path.join(folder, 'shared-qr.png')).
  console.log('Ảnh QR:', path.join(folder, 'shared-qr.png'))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `console.log('Xem QR:', path.join(folder, 'index.html'))`: Thực hiện Gọi console.log('Xem QR:', path.join(folder, 'index.html')).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  console.log('Xem QR:', path.join(folder, 'index.html'))
}
// TẠI SAO (publish): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
// quy trình.
// CHỨC NĂNG: Tránh đường IPv6 đang timeout khi máy có VPN/WARP.
// XỬ LÝ: Giữ HTTP/2, vẫn xác minh HTTPS trước khi tạo QR; không sửa DNS/firewall.
// Khai báo cloudflaredArgs(origin). Nhận đầu vào qua tham số.
function cloudflaredArgs(origin) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return ['tunnel', '--url', origin, '--http-host-header', 'localhost', '--protocol', '`: Trả kết quả: tạo mảng ['tunnel', '--url', origin, '--http-host-header', 'localhost', '--protocol', 'ht.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return ['tunnel', '--url', origin, '--http-host-header', 'localhost', '--protocol', 'http2', '--edge-ip-version', '4']
}
// TẠI SAO (cloudflaredArgs): Cấu hình transport phù hợp giúp công cụ mở tunnel theo cách đã được
// dự án kiểm tra.
// CHỨC NĂNG: Phân biệt URL đã cấp với tunnel thực sự kết nối.
// XỬ LÝ: Timeout tới edge cần kiểm tra mạng ra TCP 7844, không phát QR hỏng.
// Khai báo tunnelFailure(log). Nhận đầu vào qua tham số.
function tunnelFailure(log) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return /Unable to establish connection|dial tcp.*7844.*timeout|TLS handshake.*timeout`: Trả kết quả: chọn giữa hai giá trị theo điều kiện /Unable to establish connection|dial tcp.*7844.*timeout|TLS.
   * DÒNG `? 'Cloudflare chưa kết nối được tới máy chủ tunnel (TCP 7844). Thử mạng khác hoặc kiể`: Trả kết quả: chọn giữa hai giá trị theo điều kiện /Unable to establish connection|dial tcp.*7844.*timeout|TLS.
   * DÒNG `: 'Website HTTPS chưa truy cập được; chưa tạo QR mới.'`: Trả kết quả: chọn giữa hai giá trị theo điều kiện /Unable to establish connection|dial tcp.*7844.*timeout|TLS.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return /Unable to establish connection|dial tcp.*7844.*timeout|TLS handshake.*timeout/i.test(log) && !/Registered tunnel connection/i.test(log)
    ? 'Cloudflare chưa kết nối được tới máy chủ tunnel (TCP 7844). Thử mạng khác hoặc kiểm tra VPN/WARP; không cần tắt firewall. Chưa tạo QR mới.'
    : 'Website HTTPS chưa truy cập được; chưa tạo QR mới.'
}
// TẠI SAO (tunnelFailure): Cần phân biệt lỗi kết nối edge với việc chỉ có một URL được in trong
// log để chẩn đoán đúng.
// Khai báo main(). Nhận đầu vào qua tham số.
async function main() {
  // Thực hiện Gọi fs.mkdirSync(folder, { recursive: true }). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  fs.mkdirSync(folder, { recursive: true })
  // Khai báo web: Gọi path.join(root, 'apps/web').
  const web = path.join(root, 'apps/web')
  // Khai báo webRequire: Gọi createRequire(path.join(web, 'package.json')).
  const webRequire = createRequire(path.join(web, 'package.json'))
  // Khai báo vite: Gọi path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js').
  const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
  // CHỨC NĂNG: Build trước khi mở QR để trình duyệt tải bundle đã nén/gộp.
  // XỬ LÝ: Không tắt hay thay server dev 5173 của người dùng; preview riêng ở 4173.
  // Thực hiện Gọi console.log('Đang đóng gói website cho điện thoại...').
  console.log('Đang đóng gói website cho điện thoại...')
  // Khai báo build: Gọi spawnSync(process.execPath, [vite, 'build'], { cwd: web, encoding: 'utf8', windowsHide: tr. | Gán thuộc tính cwd: sử dụng web làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính encoding: chuỗi 'utf8'. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const build = spawnSync(process.execPath, [vite, 'build'], { cwd: web, encoding: 'utf8', windowsHide: true })
  // Rẽ nhánh nếu build.status !== 0. | Ném new Error(build.stderr || build.stdout || 'Build web thất bại').
  if (build.status !== 0) throw new Error(build.stderr || build.stdout || 'Build web thất bại')
  // Khai báo webProcess: không có giá trị khởi tạo.
  let webProcess, tunnelProcess, presenceProcess
  // CHỨC NĂNG: Public catalog và lượt mở QR dùng cùng mock API RAM của Admin.
  // Khai báo catalogOrigin: tính biểu thức process.env.CATALOG_TARGET||'http://127.0.0.1:8788'.
  const catalogOrigin=process.env.CATALOG_TARGET||'http://127.0.0.1:8788'
  // Rẽ nhánh nếu !await read(catalogOrigin+'/version').
  if(!await read(catalogOrigin+'/version')){
    // Rẽ nhánh nếu process.env.CATALOG_TARGET. | Ném new Error('CATALOG_TARGET chưa chạy').
    if(process.env.CATALOG_TARGET)throw new Error('CATALOG_TARGET chưa chạy')
    // Thực hiện Gọi launch(process.execPath,[path.join(root,'services/catalog/server.cjs')],root,'catalog').
    launch(process.execPath,[path.join(root,'services/catalog/server.cjs')],root,'catalog')
    // Khai báo ready: sử dụng false làm giá trị của bước hiện tại.
    let ready=false
    // Lặp theo điều kiện của `for(let i=0. | Rẽ nhánh nếu await read(catalogOrigin+'/version'). | Thực hiện tính biểu thức ready=true. | Tiếp phần `break` của BreakStatement. | Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng. | Thực hiện await chờ Gọi delay(300).
    for(let i=0;i<20;i++){if(await read(catalogOrigin+'/version')){ready=true;break};await delay(300)}
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if(!ready)throw new Error('Không khởi động được Catalog RAM')`: Rẽ nhánh nếu !ready. | Ném new Error('Không khởi động được Catalog RAM').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if(!ready)throw new Error('Không khởi động được Catalog RAM')
  }
  // CHỨC NĂNG: QR demo vẫn báo phiên đang hoạt động tới cùng RAM server của admin.
  // XỬ LÝ: Chỉ khởi động nếu chưa có service; không tắt server người dùng đã mở.
  // Khai báo presenceOrigin: tính biểu thức process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787'.
  const presenceOrigin = process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787'
  // Khai báo readyPresence: khai báo callback async () => { try { const value = JSON.parse(await read(presenceOrigin + '/.
  const readyPresence = async () => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `try { const value = JSON.parse(await read(presenceOrigin + '/statistics/active')); re`: Bắt đầu vùng try. | Khai báo value: JSON.parse chuyển chuỗi sang dữ liệu. | Trả kết quả: tính biểu thức Number.isInteger(value?.active) && value?.ttlSeconds === 90.
     * DÒNG `catch { return false }`: Bắt đầu vùng try. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    try { const value = JSON.parse(await read(presenceOrigin + '/statistics/active')); return Number.isInteger(value?.active) && value?.ttlSeconds === 90 }
    catch { return false }
  }
  // TẠI SAO (readyPresence): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
  // không phải xử lý dữ liệu sai như thành công.
  // Rẽ nhánh nếu !await readyPresence().
  if (!await readyPresence()) {
    // Rẽ nhánh nếu process.env.PRESENCE_TARGET. | Ném new Error('PRESENCE_TARGET chưa sẵn sàng.
    if (process.env.PRESENCE_TARGET) throw new Error('PRESENCE_TARGET chưa sẵn sàng; khởi động server RAM đã cấu hình trước.')
    // Thực hiện tính biểu thức presenceProcess = launch(process.execPath, [path.join(root, 'services/presence/server.cjs'.
    presenceProcess = launch(process.execPath, [path.join(root, 'services/presence/server.cjs')], root, 'presence')
    // Khai báo ready: sử dụng false làm giá trị của bước hiện tại.
    let ready = false
    // Lặp theo điều kiện của `for (let i = 0. | Rẽ nhánh nếu await readyPresence(). | Thực hiện tính biểu thức ready = true. | Tiếp phần `break` của BreakStatement. | Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng. | Thực hiện await chờ Gọi delay(300).
    for (let i = 0; i < 20; i++) { if (await readyPresence()) { ready = true; break }; await delay(300) }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (!ready) { presenceProcess.child.kill(); throw new Error('Không khởi động được RAM`: Rẽ nhánh nếu !ready. | Thực hiện Gọi presenceProcess.child.kill(). | Ném new Error('Không khởi động được RAM server. Xem ' + presenceProcess.log).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (!ready) { presenceProcess.child.kill(); throw new Error('Không khởi động được RAM server. Xem ' + presenceProcess.log) }
  }
  // Bắt đầu vùng try.
  try {
    // Rẽ nhánh nếu !await probe(local).
    if (!await probe(local)) {
      // Rẽ nhánh nếu await read(local + '/'). | Ném new Error('Cổng ' + previewPort + ' đang chạy ứng dụng khác.
      if (await read(local + '/')) throw new Error('Cổng ' + previewPort + ' đang chạy ứng dụng khác; đặt PUBLIC_PREVIEW_PORT sang cổng khác.')
      // Thực hiện tính biểu thức webProcess = launch(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', p.
      webProcess = launch(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', previewPort, '--strictPort'], web, 'preview')
      // Khai báo ready: sử dụng false làm giá trị của bước hiện tại.
      let ready = false
      // Lặp theo điều kiện của `for (let i = 0. | Rẽ nhánh nếu await probe(local). | Thực hiện tính biểu thức ready = true. | Tiếp phần `break` của BreakStatement. | Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng. | Thực hiện await chờ Gọi delay(500).
      for (let i = 0; i < 20; i++) { if (await probe(local)) { ready = true; break }; await delay(500) }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (!ready) throw new Error('Không khởi động được preview. Xem ' + webProcess.log)`: Rẽ nhánh nếu !ready. | Ném new Error('Không khởi động được preview. Xem ' + webProcess.log).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (!ready) throw new Error('Không khởi động được preview. Xem ' + webProcess.log)
    }
    // CHỨC NĂNG: Tái dùng URL chỉ khi đúng phiên production vẫn hoạt động.
    // Rẽ nhánh nếu fs.existsSync(stateFile).
    if (fs.existsSync(stateFile)) {
      // Bắt đầu vùng try.
      try {
        // Khai báo previous: JSON.parse chuyển chuỗi sang dữ liệu.
        const previous = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
        // Rẽ nhánh nếu previous.mode === 'production' && previous.origin && await probe(previous.origin).
        if (previous.mode === 'production' && previous.origin && await probe(previous.origin)) {
          // Thực hiện Gọi configureQr(previous.origin).
          configureQr(previous.origin)
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `if (await probe(previous.origin, true)) { publish(previous); return }`: Rẽ nhánh nếu await probe(previous.origin, true). | Thực hiện Gọi publish(previous). | Thoát hàm hiện tại ngay.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `} catch { console.log('Phiên cũ không còn dùng được; đang tạo QR mới.') }`: Bắt đầu vùng try. | Thực hiện Gọi console.log('Phiên cũ không còn dùng được.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          if (await probe(previous.origin, true)) { publish(previous); return }
        }
      } catch { console.log('Phiên cũ không còn dùng được; đang tạo QR mới.') }
    }
    // Khai báo cloudflared: tính biểu thức process.env.CLOUDFLARED_PATH || path.join(root, '.tools/cloudflared.exe').
    const cloudflared = process.env.CLOUDFLARED_PATH || path.join(root, '.tools/cloudflared.exe')
    // Rẽ nhánh nếu !fs.existsSync(cloudflared). | Ném new Error('Thiếu cloudflared.
    if (!fs.existsSync(cloudflared)) throw new Error('Thiếu cloudflared; đặt CLOUDFLARED_PATH trước khi chạy.')
    // Thực hiện tính biểu thức tunnelProcess = launch(cloudflared, cloudflaredArgs(local), root, 'cloudflared').
    tunnelProcess = launch(cloudflared, cloudflaredArgs(local), root, 'cloudflared')
    // Thực hiện Gọi console.log('Đang tạo địa chỉ HTTPS công khai...').
    console.log('Đang tạo địa chỉ HTTPS công khai...')
    // Khai báo origin: không có giá trị khởi tạo.
    let origin
    // Lặp theo điều kiện của `for (let i = 0.
    for (let i = 0; i < 60; i++) {
      // Thực hiện tính biểu thức origin = fs.readFileSync(tunnelProcess.log, 'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudf.
      origin = fs.readFileSync(tunnelProcess.log, 'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0]
      // Rẽ nhánh nếu origin. | Tiếp phần `break` của BreakStatement.
      if (origin) break
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `await delay(1000)`: Thực hiện await chờ Gọi delay(1000).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      await delay(1000)
    }
    // Rẽ nhánh nếu !origin. | Ném new Error('Chưa nhận được URL HTTPS. Xem ' + tunnelProcess.log).
    if (!origin) throw new Error('Chưa nhận được URL HTTPS. Xem ' + tunnelProcess.log)
    // Khai báo reachable: sử dụng false làm giá trị của bước hiện tại.
    let reachable = false
    // Lặp theo điều kiện của `for (let i = 0. | Rẽ nhánh nếu await probe(origin). | Thực hiện tính biểu thức reachable = true. | Tiếp phần `break` của BreakStatement. | Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng. | Thực hiện await chờ Gọi delay(1000).
    for (let i = 0; i < 30; i++) { if (await probe(origin)) { reachable = true; break }; await delay(1000) }
    // Rẽ nhánh nếu !reachable. | Ném new Error(tunnelFailure(fs.readFileSync(tunnelProcess.log, 'utf8')) + ' Xem ' + tunnelProcess.log).
    if (!reachable) throw new Error(tunnelFailure(fs.readFileSync(tunnelProcess.log, 'utf8')) + ' Xem ' + tunnelProcess.log)
    // CHỨC NĂNG: Chỉ tạo ảnh QR sau khi chính website HTTPS đã vượt kiểm tra.
    // Thực hiện Gọi configureQr(origin).
    configureQr(origin)
    // Khai báo configured: sử dụng false làm giá trị của bước hiện tại.
    let configured = false
    // Lặp theo điều kiện của `for (let i = 0. | Rẽ nhánh nếu await probe(origin, true). | Thực hiện tính biểu thức configured = true. | Tiếp phần `break` của BreakStatement. | Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng. | Thực hiện await chờ Gọi delay(1000).
    for (let i = 0; i < 20; i++) { if (await probe(origin, true)) { configured = true; break }; await delay(1000) }
    // Rẽ nhánh nếu !configured. | Ném new Error('Website đã mở nhưng cấu hình URL chưa cập nhật. Chạy lại npm run demo:public.').
    if (!configured) throw new Error('Website đã mở nhưng cấu hình URL chưa cập nhật. Chạy lại npm run demo:public.')
    // Thực hiện Gọi publish({ origin, mode: 'production', localOrigin: local, webPid: webProcess?.child.pid, t. | Đặt trường origin bằng giá trị của biến cùng tên. | Gán thuộc tính mode: chuỗi 'production'. | Gán thuộc tính localOrigin: sử dụng local làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính webPid: đọc webProcess?.child.pid từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính tunnelPid: đọc tunnelProcess.child.pid từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    publish({ origin, mode: 'production', localOrigin: local, webPid: webProcess?.child.pid, tunnelPid: tunnelProcess.child.pid,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `presencePid: presenceProcess?.child.pid, webLog: webProcess?.log, tunnelLog: tunnelPr`: Gán thuộc tính presencePid: đọc presenceProcess?.child.pid từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính webLog: đọc webProcess?.log từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính tunnelLog: đọc tunnelProcess.log từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính startedAt: Gọi new Date().toISOString().
       * DÒNG `} catch (error) { tunnelProcess?.child.kill(); webProcess?.child.kill(); presenceProc`: Bắt đầu vùng try. | Thực hiện Gọi tunnelProcess?.child.kill(). | Thực hiện Gọi webProcess?.child.kill(). | Thực hiện Gọi presenceProcess?.child.kill(). | Ném error.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      presencePid: presenceProcess?.child.pid, webLog: webProcess?.log, tunnelLog: tunnelProcess.log, startedAt: new Date().toISOString() })
  } catch (error) { tunnelProcess?.child.kill(); webProcess?.child.kill(); presenceProcess?.child.kill(); throw error }
}
// TẠI SAO (main): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.
// Rẽ nhánh nếu require.main === module. | Thực hiện Gọi main().catch(error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
// Thực hiện tính biểu thức module.exports = { GUIDE_MODULE_PATH, isGuideModule, isGuidePage, isBuiltGuidePage, builtE. | Đặt trường GUIDE_MODULE_PATH bằng giá trị của biến cùng tên. | Đặt trường isGuideModule bằng giá trị của biến cùng tên. | Đặt trường isGuidePage bằng giá trị của biến cùng tên. | Đặt trường isBuiltGuidePage bằng giá trị của biến cùng tên. | Đặt trường builtEntry bằng giá trị của biến cùng tên. | Đặt trường cloudflaredArgs bằng giá trị của biến cùng tên. | Đặt trường tunnelFailure bằng giá trị của biến cùng tên.
module.exports = { GUIDE_MODULE_PATH, isGuideModule, isGuidePage, isBuiltGuidePage, builtEntry, cloudflaredArgs, tunnelFailure }
