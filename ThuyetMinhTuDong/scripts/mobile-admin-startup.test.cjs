/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra cấu hình Expo admin, chọn IP và giới hạn/hành vi proxy quản trị.
 *
 * VỊ TRÍ: scripts/mobile-admin-startup.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; node:http; ./start-catalog.cjs;
 * ./start-mobile-admin.cjs; ./metro-admin-proxy.cjs
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo http: require nạp module 'node:http' để dùng chức năng có sẵn thay vì chép lại.
const http = require('node:http')
// Khai báo { findLanAddress }: require nạp module './start-catalog.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { findLanAddress } = require('./start-catalog.cjs')
// Khai báo { adminOptions }: require nạp module './start-mobile-admin.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { adminOptions } = require('./start-mobile-admin.cjs')
// Khai báo { createAdminApiMiddleware }: require nạp module './metro-admin-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { createAdminApiMiddleware } = require('./metro-admin-proxy.cjs')

// Khẳng định kết quả thử nghiệm bằng test('Chọn Wi-Fi thay vì WARP/VPN kể cả adapter ảo đứng đầu', () => { const item = address => [{ family: 'IPv4', interna.
test('Chọn Wi-Fi thay vì WARP/VPN kể cả adapter ảo đứng đầu', () => {
  // Khai báo item: khai báo callback address => [{ family: 'IPv4', internal: false, address }]. | Gán thuộc tính family: chuỗi 'IPv4'. | Gán thuộc tính internal: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường address bằng giá trị của biến cùng tên.
  const item = address => [{ family: 'IPv4', internal: false, address }]
  // TẠI SAO (item): Bản ghi có thể đã bị sửa hoặc lưu trữ ở nơi khác; kiểm tra revision ngăn ghi
  // đè thay đổi mới hơn.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(findLanAddress({ CloudflareWARP: item('172.16.0.2'), 'Radmin VPN': item(`: Khẳng định kết quả thử nghiệm bằng assert.equal(findLanAddress({ CloudflareWARP: item('172.16.0.2'), 'Radmin VPN': item('26.1.2.3'), 'Wi-Fi': item('192.168. | Gán thuộc tính CloudflareWARP: Gọi item('172.16.0.2'). | Gán thuộc tính 'Radmin VPN': Gọi item('26.1.2.3'). | Gán thuộc tính 'Wi-Fi': Gọi item('192.168.2.28').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(findLanAddress({ CloudflareWARP: item('172.16.0.2'), 'Radmin VPN': item('26.1.2.3'), 'Wi-Fi': item('192.168.2.28') }, ''), '192.168.2.28')
})
// Khẳng định kết quả thử nghiệm bằng test('Admin dùng chung origin Metro, không phụ thuộc URL tunnel hoặc IP API cũ', () => { const env = adminOptions('192.1.
test('Admin dùng chung origin Metro, không phụ thuộc URL tunnel hoặc IP API cũ', () => {
  // Khai báo env: Gọi adminOptions('192.168.2.28').
  const env = adminOptions('192.168.2.28')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, 'http://192.168.2.28:8082/__admin-api').
  assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, 'http://192.168.2.28:8082/__admin-api')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_CATALOG_API_URL, env.EXPO_PUBLIC_ADMIN_API_URL).
  assert.equal(env.EXPO_PUBLIC_CATALOG_API_URL, env.EXPO_PUBLIC_ADMIN_API_URL)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL, env.EXPO_PUBLIC_ADMIN_API_URL + '/presence').
  assert.equal(env.EXPO_PUBLIC_ADMIN_PRESENCE_API_URL, env.EXPO_PUBLIC_ADMIN_API_URL + '/presence')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.throws(() => adminOptions(null), /mạng LAN/)`: Khẳng định kết quả thử nghiệm bằng assert.throws(() => adminOptions(null), /mạng LAN/).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.throws(() => adminOptions(null), /mạng LAN/)
})
// Khai báo listen(t, handler). Nhận đầu vào qua tham số.
async function listen(t, handler) {
  // Khai báo server: Gọi http.createServer(handler).
  const server = http.createServer(handler)
  // Thực hiện await chờ Tạo đối tượng bằng new Promise(resolve => server.listen(0, '127.0.0.1', resolve)).
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  // Thực hiện Gọi t.after(() => new Promise(resolve => { server.close(resolve). | Thực hiện Gọi server.close(resolve). | Thực hiện Gọi server.closeAllConnections().
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return 'http://127.0.0.1:' + server.address().port`: Trả kết quả: tính biểu thức 'http://127.0.0.1:' + server.address().port.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return 'http://127.0.0.1:' + server.address().port
}
// TẠI SAO (listen): Callback cần một điểm đăng ký và hủy rõ ràng để không nhận phản hồi của
// nguồn đã bỏ.
// Khai báo proxy(t, enabled, upstream). Nhận đầu vào qua tham số.
async function proxy(t, enabled, upstream) {
  // Khai báo middleware: Gọi createAdminApiMiddleware({ enabled, target: upstream }). | Đặt trường enabled bằng giá trị của biến cùng tên. | Gán thuộc tính target: sử dụng upstream làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const middleware = createAdminApiMiddleware({ enabled, target: upstream })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404); res.e`: Trả kết quả: Gọi listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404). | Thực hiện Gọi res.writeHead(404). | Thực hiện Gọi res.end('Metro next').
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404); res.end('Metro next') }))
}
// TẠI SAO (proxy): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
// bộ giao diện.
// Khẳng định kết quả thử nghiệm bằng test('Proxy bị tắt ở bản visitor, không lộ route quản lý qua Metro visitor', async t => { const api = await proxy(t, fal.
test('Proxy bị tắt ở bản visitor, không lộ route quản lý qua Metro visitor', async t => {
  // Khai báo api: await chờ Gọi proxy(t, false, 'http://127.0.0.1:1').
  const api = await proxy(t, false, 'http://127.0.0.1:1')
  // Khai báo response: await chờ fetch gửi HTTP request.
  const response = await fetch(api + '/__admin-api/document')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(response.status, 404).
  assert.equal(response.status, 404)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(await response.text(), 'Metro next')`: Khẳng định kết quả thử nghiệm bằng assert.equal(await response.text(), 'Metro next').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(await response.text(), 'Metro next')
})
// Khẳng định kết quả thử nghiệm bằng test('Admin GET/POST/Range đi đúng nguồn và không chặn bundle của Expo', async t => { const upstream = await listen(t, a.
test('Admin GET/POST/Range đi đúng nguồn và không chặn bundle của Expo', async t => {
  // Khai báo upstream: await chờ Gọi listen(t, async (req, res) => { if (req.url.startsWith('/audio/')) { res.writeHead(206, {.
  const upstream = await listen(t, async (req, res) => {
    // Rẽ nhánh nếu req.url.startsWith('/audio/'). | Thực hiện Gọi res.writeHead(206, { 'Content-Type': 'audio/mpeg', 'Content-Range': 'bytes 0-3/10' }). | Gán thuộc tính 'Content-Type': chuỗi 'audio/mpeg'. | Gán thuộc tính 'Content-Range': chuỗi 'bytes 0-3/10'. | Thực hiện Gọi res.end('MP3!'). | Thoát hàm hiện tại ngay.
    if (req.url.startsWith('/audio/')) { res.writeHead(206, { 'Content-Type': 'audio/mpeg', 'Content-Range': 'bytes 0-3/10' }); res.end('MP3!'); return }
    // Khai báo body: chuỗi ''. | Duyệt lần lượt req bằng const chunk. | Thực hiện tính biểu thức body += chunk.
    let body = ''; for await (const chunk of req) body += chunk
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ path: req`: Đặt header phản hồi: res.setHeader('Content-Type', 'application/json'). | Thực hiện Gọi res.end(JSON.stringify({ path: req.url, body })). | Gán thuộc tính path: đọc req.url từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường body bằng giá trị của biến cùng tên.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ path: req.url, body }))
  })
  // Khai báo api: await chờ Gọi proxy(t, true, upstream).
  const api = await proxy(t, true, upstream)
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await (await fetch(api + '/__admin-api/document')).json()).path, '/document').
  assert.equal((await (await fetch(api + '/__admin-api/document')).json()).path, '/document')
  // Khai báo payload: JSON.stringify tuần tự hóa dữ liệu để lưu hoặc truyền qua HTTP. | Gán thuộc tính action: chuỗi 'savePlace'. | Gán thuộc tính args: tạo mảng [].
  const payload = JSON.stringify({ action: 'savePlace', args: [] })
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await (await fetch(api + '/__admin-api/commands', { method: 'POST', body: payload, headers: { 'Content-Typ. | Gán thuộc tính method: chuỗi 'POST'. | Gán thuộc tính body: sử dụng payload làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính headers: tạo object gồm 'Content-Type'. | Gán thuộc tính 'Content-Type': chuỗi 'application/json'.
  assert.equal((await (await fetch(api + '/__admin-api/commands', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' } })).json()).body, payload)
  // Khai báo audio: await chờ fetch gửi HTTP request. | Gán thuộc tính headers: tạo object gồm Range. | Gán thuộc tính Range: chuỗi 'bytes=0-3'.
  const audio = await fetch(api + '/__admin-api/audio/preview/' + 'a'.repeat(64) + '.mp3', { headers: { Range: 'bytes=0-3' } })
  // Khẳng định kết quả thử nghiệm bằng assert.equal(audio.status, 206). | Khẳng định kết quả thử nghiệm bằng assert.equal(await audio.text(), 'MP3!').
  assert.equal(audio.status, 206); assert.equal(await audio.text(), 'MP3!')
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(api + '/index.bundle')).status, 404).
  assert.equal((await fetch(api + '/index.bundle')).status, 404)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal((await fetch(api + '/__admin-api/unknown')).status, 404)`: Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(api + '/__admin-api/unknown')).status, 404).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal((await fetch(api + '/__admin-api/unknown')).status, 404)
})
// Khẳng định kết quả thử nghiệm bằng test('Nguồn mock API tắt trả lỗi 503, không trả số liệu hoặc dữ liệu giả', async t => { const api = await proxy(t, true,.
test('Nguồn mock API tắt trả lỗi 503, không trả số liệu hoặc dữ liệu giả', async t => {
  // Khai báo api: await chờ Gọi proxy(t, true, 'http://127.0.0.1:1').
  const api = await proxy(t, true, 'http://127.0.0.1:1')
  // Khai báo response: await chờ fetch gửi HTTP request.
  const response = await fetch(api + '/__admin-api/document')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(response.status, 503).
  assert.equal(response.status, 503)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(await response.json(), { error: 'loadError' })`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual(await response.json(), { error: 'loadError' }). | Gán thuộc tính error: chuỗi 'loadError'.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.deepEqual(await response.json(), { error: 'loadError' })
})
