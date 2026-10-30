/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra/tự khởi chạy mock API còn thiếu rồi chạy Vite du khách hoặc admin; dùng lại RAM service
 * đang hoạt động.
 *
 * VỊ TRÍ: scripts/start-web.cjs
 * DÙNG BỞI: scripts/start-mobile-admin.cjs; scripts/start-mobile-visitor.cjs;
 * scripts/startup.test.cjs.
 * PHỤ THUỘC: node:fs; node:path; node:net; node:child_process; node:module; node:timers/promises
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo net: require nạp module 'node:net' để dùng chức năng có sẵn thay vì chép lại.
const net = require('node:net')
// Khai báo { spawn }: require nạp module 'node:child_process' để dùng chức năng có sẵn thay vì chép lại.
const { spawn } = require('node:child_process')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')
// Khai báo { setTimeout: delay }: require nạp module 'node:timers/promises' để dùng chức năng có sẵn thay vì chép lại.
const { setTimeout: delay } = require('node:timers/promises')
// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')

// CHỨC NĂNG: Đọc API có giới hạn thời gian; không nhầm trang HTML với JSON.
// Khai báo readJson(url). Nhận đầu vào qua tham số.
async function readJson(url) {
  // Bắt đầu vùng try.
  try {
    // Khai báo response: await chờ fetch gửi HTTP request. | Gán thuộc tính signal: Gọi AbortSignal.timeout(1000).
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) })
    // Rẽ nhánh nếu !response.ok. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
    if (!response.ok) return null
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return await response.json()`: Trả kết quả: await chờ Gọi response.json().
     * DÒNG `} catch { return null }`: Bắt đầu vùng try. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return await response.json()
  } catch { return null }
}
// TẠI SAO (readJson): Phản hồi hoặc body có thể không hợp lệ; kiểm tra/timeout giúp lỗi được báo
// rõ thay vì treo hoặc nhận nhầm dữ liệu.
// CHỨC NĂNG: Kiểm tra mock service có đúng loại và sẵn sàng không.
// XỬ LÝ: Có tiến trình giữ cổng chưa có nghĩa đó là API của dự án.
// Khai báo healthy(service). Nhận đầu vào qua tham số.
async function healthy(service) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return service.accept(await readJson(service.origin + service.healthPath))`: Trả kết quả: Gọi service.accept(await readJson(service.origin + service.healthPath)).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return service.accept(await readJson(service.origin + service.healthPath))
}
// TẠI SAO (healthy): Một cổng đang mở có thể thuộc chương trình khác, nên cần kiểm tra nội dung
// phản hồi.
// CHỨC NĂNG: Kiểm tra một cổng đã được sử dụng.
// XỬ LÝ: Tránh mở trùng tiến trình hoặc chiếm cổng của chương trình khác.
// Khai báo portOpen(origin). Nhận đầu vào qua tham số.
function portOpen(origin) {
  // Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
  const url = new URL(origin)
  // Trả kết quả: Tạo đối tượng bằng new Promise(resolve => { const socket = net.connect({ host: url.hostname, port: Number(url.
  return new Promise(resolve => {
    // Khai báo socket: Gọi net.connect({ host: url.hostname, port: Number(url.port || (url.protocol === 'https:' ? 44. | Gán thuộc tính host: đọc url.hostname từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính port: Gọi Number(url.port || (url.protocol === 'https:' ? 443 : 80)).
    const socket = net.connect({ host: url.hostname, port: Number(url.port || (url.protocol === 'https:' ? 443 : 80)) })
    // Khai báo done: sử dụng false làm giá trị của bước hiện tại.
    let done = false
    // Khai báo finish: khai báo callback value => { if (!done) { done = true. | Rẽ nhánh nếu !done. | Thực hiện tính biểu thức done = true. | Thực hiện Gọi socket.destroy(). | Thực hiện Gọi resolve(value).
    const finish = value => { if (!done) { done = true; socket.destroy(); resolve(value) } }
    // TẠI SAO (finish): Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
    // quy trình.
    // Thực hiện setTimeout lên lịch tác vụ một lần.
    socket.setTimeout(800)
    // Thực hiện Gọi socket.once('connect', () => finish(true)).
    socket.once('connect', () => finish(true))
    // Thực hiện Gọi socket.once('error', () => finish(false)).
    socket.once('error', () => finish(false))
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `socket.once('timeout', () => finish(false))`: Thực hiện Gọi socket.once('timeout', () => finish(false)).
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    socket.once('timeout', () => finish(false))
  })
}
// TẠI SAO (portOpen): Không nên khởi chạy thêm một tiến trình trên cổng đã được dùng mà chưa xác
// định chủ sở hữu.

// CHỨC NĂNG: API chạy nền để đóng web không làm mất RAM mà admin/mobile đang dùng.
// XỬ LÝ: Chỉ mở tiến trình mới khi chưa có service; không tắt tiến trình có sẵn.
// Khai báo launchDetached(service). Nhận đầu vào qua tham số.
function launchDetached(service) {
  // Khai báo folder: Gọi path.join(root, '.runtime/dev-services').
  const folder = path.join(root, '.runtime/dev-services')
  // Thực hiện Gọi fs.mkdirSync(folder, { recursive: true }). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  fs.mkdirSync(folder, { recursive: true })
  // Khai báo log: Gọi path.join(folder, service.name + '.log').
  const log = path.join(folder, service.name + '.log')
  // Khai báo descriptor: Gọi fs.openSync(log, 'a').
  const descriptor = fs.openSync(log, 'a')
  // Bắt đầu vùng try.
  try {
    // Khai báo child: Gọi spawn(process.execPath, [path.join(root, service.script)], { cwd: root, env: process.env,.
    const child = spawn(process.execPath, [path.join(root, service.script)], {
      // Gán thuộc tính cwd: sử dụng root làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính env: đọc process.env từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính detached: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      cwd: root, env: process.env, detached: true, windowsHide: true,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `stdio: ['ignore', descriptor, descriptor],`: Gán thuộc tính stdio: tạo mảng ['ignore', descriptor, descriptor].
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      stdio: ['ignore', descriptor, descriptor],
    })
    // Đăng ký xử lý sự kiện: child.on('error', error => console.error(service.name + ': ' + error.message)).
    child.on('error', error => console.error(service.name + ': ' + error.message))
    // Thực hiện Gọi child.unref().
    child.unref()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return log`: Trả kết quả: sử dụng log làm giá trị của bước hiện tại.
     * DÒNG `} finally { fs.closeSync(descriptor) }`: Bắt đầu vùng try. | Thực hiện Gọi fs.closeSync(descriptor).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return log
  } finally { fs.closeSync(descriptor) }
}
// TẠI SAO (launchDetached): Các bản web/mobile có thể dùng lại service đang chạy; đóng một cửa
// sổ UI không nên tự xóa kho RAM chung.

// CHỨC NĂNG: Tái sử dụng service đúng, báo rõ khi sai cổng hoặc API tùy chỉnh chưa chạy.
// XỬ LÝ: Không khởi động lại kho RAM sẵn có; chờ sẵn sàng trước khi chạy Vite.
// Khai báo ensureService(service, { launch = launchDetached, timeoutMs = 20000 }). Nhận đầu vào qua tham số.
async function ensureService(service, { launch = launchDetached, timeoutMs = 20000 } = {}) {
  // Rẽ nhánh nếu await healthy(service). | Trả kết quả: chuỗi 'reused'.
  if (await healthy(service)) return 'reused'
  // Rẽ nhánh nếu service.custom. | Ném new Error(service.name + ': API đã cấu hình chưa sẵn sàng tại ' + service.origin).
  if (service.custom) throw new Error(service.name + ': API đã cấu hình chưa sẵn sàng tại ' + service.origin)
  // Rẽ nhánh nếu await portOpen(service.origin). | Ném new Error(service.name + ': cổng đang có ứng dụng khác hoặc API lỗi tại ' + service.origin).
  if (await portOpen(service.origin)) throw new Error(service.name + ': cổng đang có ứng dụng khác hoặc API lỗi tại ' + service.origin)
  // Khai báo log: Gọi launch(service).
  const log = launch(service)
  // Khai báo deadline: tính biểu thức Date.now() + timeoutMs.
  const deadline = Date.now() + timeoutMs
  // Lặp theo điều kiện của `while (Date.now() < deadline) {`.
  while (Date.now() < deadline) {
    // Rẽ nhánh nếu await healthy(service). | Trả kết quả: chuỗi 'started'.
    if (await healthy(service)) return 'started'
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `await delay(250)`: Thực hiện await chờ Gọi delay(250).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    await delay(250)
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `throw new Error(service.name + ' chưa khởi động được. Xem log: ' + log)`: Ném new Error(service.name + ' chưa khởi động được. Xem log: ' + log).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  throw new Error(service.name + ' chưa khởi động được. Xem log: ' + log)
}
// TẠI SAO (ensureService): Khởi động lại không cần thiết sẽ làm mất dữ liệu demo đang giữ trong
// RAM.

// CHỨC NĂNG: Dùng chung bước kiểm tra API cho web và Expo admin; không khởi động trùng RAM.
// Khai báo ensureDevServices(). Nhận đầu vào qua tham số.
async function ensureDevServices() {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const services = [`: Khai báo services: tạo mảng [ { name: 'catalog', origin: process.env.CATALOG_TARGET || 'http://127.0.0.1:878.
   * DÒNG `{ name: 'catalog', origin: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788', cus`: Khai báo services: tạo mảng [ { name: 'catalog', origin: process.env.CATALOG_TARGET || 'http://127.0.0.1:878. | Gán thuộc tính name: chuỗi 'catalog'. | Gán thuộc tính origin: tính biểu thức process.env.CATALOG_TARGET || 'http://127.0.0.1:8788'. | Gán thuộc tính custom: Gọi Boolean(process.env.CATALOG_TARGET).
   */
  const services = [
    { name: 'catalog', origin: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788', custom: Boolean(process.env.CATALOG_TARGET),
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `script: 'scripts/start-catalog.cjs', healthPath: '/version', accept: value => typeof `: Gán thuộc tính script: chuỗi 'scripts/start-catalog.cjs'. | Gán thuộc tính healthPath: chuỗi '/version'. | Gán thuộc tính accept: khai báo callback value => typeof value?.version === 'string'.
       * DÒNG `{ name: 'presence', origin: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787', c`: Khai báo services: tạo mảng [ { name: 'catalog', origin: process.env.CATALOG_TARGET || 'http://127.0.0.1:878. | Gán thuộc tính name: chuỗi 'presence'. | Gán thuộc tính origin: tính biểu thức process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787'. | Gán thuộc tính custom: Gọi Boolean(process.env.PRESENCE_TARGET).
       */
      script: 'scripts/start-catalog.cjs', healthPath: '/version', accept: value => typeof value?.version === 'string' },
    { name: 'presence', origin: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787', custom: Boolean(process.env.PRESENCE_TARGET),
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `script: 'services/presence/server.cjs', healthPath: '/statistics/active', accept: val`: Gán thuộc tính script: chuỗi 'services/presence/server.cjs'. | Gán thuộc tính healthPath: chuỗi '/statistics/active'. | Gán thuộc tính accept: khai báo callback value => Number.isInteger(value?.active) && value.active >= 0 && value.ttlS.
       * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
       */
      script: 'services/presence/server.cjs', healthPath: '/statistics/active', accept: value => Number.isInteger(value?.active) && value.active >= 0 && value.ttlSeconds === 90 },
  ]
  // Duyệt lần lượt services bằng const service.
  for (const service of services) {
    // CHỨC NĂNG: Cổng tùy chỉnh phải trùng URL proxy; không mở nhầm service ở cổng mặc định.
    // Khai báo configuredPort: đọc process.env[service.name === 'catalog' ? 'CATALOG_PORT' : 'PRESENCE_PORT'] từ đối tượng/mảng để dùng tại bước hiện tại.
    const configuredPort = process.env[service.name === 'catalog' ? 'CATALOG_PORT' : 'PRESENCE_PORT']
    // Rẽ nhánh nếu !service.custom && configuredPort && configuredPort !== (service.name === 'catalog' ? '8788' : '8787').
    if (!service.custom && configuredPort && configuredPort !== (service.name === 'catalog' ? '8788' : '8787')) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error('Đã đổi ' + service.name + ' PORT; cần đặt ' + service.name.toUpperCa`: Ném new Error('Đã đổi ' + service.name + ' PORT.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      throw new Error('Đã đổi ' + service.name + ' PORT; cần đặt ' + service.name.toUpperCase() + '_TARGET trỏ đúng URL cho Vite.')
    }
    // Khai báo result: await chờ Gọi ensureService(service).
    const result = await ensureService(service)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `console.log(service.name + ': ' + (result === 'reused' ? 'dùng lại API đang chạy' : '`: Thực hiện Gọi console.log(service.name + ': ' + (result === 'reused' ? 'dùng lại API đang chạy' : 'đã kh.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    console.log(service.name + ': ' + (result === 'reused' ? 'dùng lại API đang chạy' : 'đã khởi động') + ' — ' + service.origin)
  }
  // CHỨC NĂNG: Kiểm tra catalog thật, không chỉ cổng HTTP đã mở.
  // Khai báo places: await chờ Gọi readJson(services[0].origin + '/published').
  const places = await readJson(services[0].origin + '/published')
  // Rẽ nhánh nếu !Array.isArray(places). | Ném new Error('Catalog chưa trả được danh sách công bố. Xem .runtime/dev-services/catalog.log').
  if (!Array.isArray(places)) throw new Error('Catalog chưa trả được danh sách công bố. Xem .runtime/dev-services/catalog.log')

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return services`: Trả kết quả: sử dụng services làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return services
}
// TẠI SAO (ensureDevServices): Giao diện cần API sẵn sàng ngay khi tải danh mục và gửi
// heartbeat, tránh lỗi ECONNREFUSED lúc mở.

// Khai báo main(). Nhận đầu vào qua tham số.
async function main() {
  // Khai báo incoming: Gọi process.argv.slice(2).
  const incoming = process.argv.slice(2)
  // Khai báo admin: Gọi incoming.includes('--admin').
  const admin = incoming.includes('--admin')
  // Khai báo args: incoming.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const args = incoming.filter(value => value !== '--admin')
  // Khai báo option: khai báo callback (name, fallback) => { const index = args.indexOf(name) return index >= 0 ?.
  const option = (name, fallback) => {
    // Khai báo index: Gọi args.indexOf(name).
    const index = args.indexOf(name)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return index >= 0 ? args[index + 1] : args.find(value => value.startsWith(name + '=')`: Trả kết quả: chọn giữa hai giá trị theo điều kiện index >= 0.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return index >= 0 ? args[index + 1] : args.find(value => value.startsWith(name + '='))?.slice(name.length + 1) ?? fallback
  }
  // TẠI SAO (option): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
  // liệu.
  // Khai báo port: Gọi Number(option('--port', admin ? '5174' : '5173')).
  const port = Number(option('--port', admin ? '5174' : '5173'))
  // Rẽ nhánh nếu !Number.isInteger(port) || port < 1 || port > 65535. | Ném new Error('--port phải nằm trong 1–65535.').
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('--port phải nằm trong 1–65535.')
  // Khai báo forward: args.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const forward = args.filter((value, index) => value !== '--port' && !value.startsWith('--port=') && args[index - 1] !== '--port')
  // Thực hiện await chờ Gọi ensureDevServices().
  await ensureDevServices()

  // Khai báo origin: tính biểu thức 'http://127.0.0.1:' + port.
  const origin = 'http://127.0.0.1:' + port
  // Rẽ nhánh nếu await portOpen(origin).
  if (await portOpen(origin)) {
    // Khai báo html: chuỗi ''.
    let html = ''
    // Bắt đầu vùng try. | Thực hiện tính biểu thức html = await (await fetch(origin, { signal: AbortSignal.timeout(1500) })).text(). | Gán thuộc tính signal: Gọi AbortSignal.timeout(1500).
    try { html = await (await fetch(origin, { signal: AbortSignal.timeout(1500) })).text() } catch { /* Báo cổng bận bên dưới. */ }
    // Khai báo entry: chọn giữa hai giá trị theo điều kiện admin.
    const entry = admin ? '/src/main-admin.tsx' : '/src/main.tsx'
    // Rẽ nhánh nếu html.includes('/@vite/client') && html.includes(entry).
    if (html.includes('/@vite/client') && html.includes(entry)) {
      // Thực hiện Gọi console.log('Web đã chạy: ' + origin + (admin ? '/admin' : '/') + ' — tải lại trang để kết.
      console.log('Web đã chạy: ' + origin + (admin ? '/admin' : '/') + ' — tải lại trang để kết nối API vừa phục hồi.')
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return`: Thoát hàm hiện tại ngay.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('Cổng ' + port + ' đã được sử dụng. Chọn --port khác; không tự tắt ứn`: Ném new Error('Cổng ' + port + ' đã được sử dụng. Chọn --port khác.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('Cổng ' + port + ' đã được sử dụng. Chọn --port khác; không tự tắt ứng dụng đang chạy.')
  }
  // Khai báo web: Gọi path.join(root, 'apps/web').
  const web = path.join(root, 'apps/web')
  // Khai báo webRequire: Gọi createRequire(path.join(web, 'package.json')).
  const webRequire = createRequire(path.join(web, 'package.json'))
  // Khai báo vite: Gọi path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js').
  const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const child = spawn(process.execPath, [vite, '--host', admin ? '127.0.0.1' : '0.0.0.0`: Khai báo child: Gọi spawn(process.execPath, [vite, '--host', admin ? '127.0.0.1' : '0.0.0.0', '--port', String.
   * DÒNG `'--port', String(port), '--strictPort', ...(admin ? ['--mode', 'admin'] : []), ...for`: Khai báo child: Gọi spawn(process.execPath, [vite, '--host', admin ? '127.0.0.1' : '0.0.0.0', '--port', String.
   */
  const child = spawn(process.execPath, [vite, '--host', admin ? '127.0.0.1' : '0.0.0.0',
    '--port', String(port), '--strictPort', ...(admin ? ['--mode', 'admin'] : []), ...forward], {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `cwd: web, env: process.env, stdio: 'inherit', windowsHide: true,`: Gán thuộc tính cwd: sử dụng web làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính env: đọc process.env từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính stdio: chuỗi 'inherit'. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    cwd: web, env: process.env, stdio: 'inherit', windowsHide: true,
  })
  // Thực hiện Gọi console.log('Các API RAM tiếp tục chạy khi đóng web.
  console.log('Các API dùng SQL Server; đóng web hoặc restart API không xóa nội dung và lượt QR.')
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })`: Đăng ký xử lý sự kiện: child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) }). | Thực hiện tính biểu thức process.exitCode = code ?? (signal ? 1 : 0).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
}
// TẠI SAO (main): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.
// Rẽ nhánh nếu require.main === module.
if (require.main === module) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `main().catch(error => { console.error('Không thể mở web: ' + error.message); process.`: Thực hiện Gọi main().catch(error => { console.error('Không thể mở web: ' + error.message). | Thực hiện Gọi console.error('Không thể mở web: ' + error.message). | Thực hiện tính biểu thức process.exitCode = 1.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  main().catch(error => { console.error('Không thể mở web: ' + error.message); process.exitCode = 1 })
}
// Thực hiện tính biểu thức module.exports = { ensureService, readJson, ensureDevServices }. | Đặt trường ensureService bằng giá trị của biến cùng tên. | Đặt trường readJson bằng giá trị của biến cùng tên. | Đặt trường ensureDevServices bằng giá trị của biến cùng tên.
module.exports = { ensureService, readJson, ensureDevServices }
/* CÁCH KIỂM TRA: Một lệnh tự mở RAM; chạy lại giữ nguyên dữ liệu; API sai/cổng bận báo rõ. */
