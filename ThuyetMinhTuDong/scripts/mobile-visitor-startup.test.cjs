/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra cấu hình Expo du khách và proxy chỉ cho phép các route của du khách.
 *
 * VỊ TRÍ: scripts/mobile-visitor-startup.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; node:http; ./start-mobile-visitor.cjs;
 * ./metro-visitor-proxy.cjs
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo http: require nạp module 'node:http' để dùng chức năng có sẵn thay vì chép lại.
const http = require('node:http')
// Khai báo { visitorOptions }: require nạp module './start-mobile-visitor.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { visitorOptions } = require('./start-mobile-visitor.cjs')
// Khai báo { createVisitorApiMiddleware }: require nạp module './metro-visitor-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { createVisitorApiMiddleware } = require('./metro-visitor-proxy.cjs')
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
// Khẳng định kết quả thử nghiệm bằng test('Visitor dùng cùng host Expo, không nhận tunnel cũ hoặc target admin', () => { const env = visitorOptions('192.168.
test('Visitor dùng cùng host Expo, không nhận tunnel cũ hoặc target admin', () => {
  // Khai báo env: Gọi visitorOptions('192.168.2.28').
  const env = visitorOptions('192.168.2.28')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_APP_TARGET, 'visitor').
  assert.equal(env.EXPO_PUBLIC_APP_TARGET, 'visitor')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_CATALOG_API_URL, 'http://192.168.2.28:8081/__visitor-api/catalog').
  assert.equal(env.EXPO_PUBLIC_CATALOG_API_URL, 'http://192.168.2.28:8081/__visitor-api/catalog')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_PRESENCE_API_URL, 'http://192.168.2.28:8081/__visitor-api/presence').
  assert.equal(env.EXPO_PUBLIC_PRESENCE_API_URL, 'http://192.168.2.28:8081/__visitor-api/presence')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, undefined)`: Khẳng định kết quả thử nghiệm bằng assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, undefined).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(env.EXPO_PUBLIC_ADMIN_API_URL, undefined)
})
// Khẳng định kết quả thử nghiệm bằng test('Visitor chỉ được đọc công bố và gửi heartbeat.
test('Visitor chỉ được đọc công bố và gửi heartbeat; không đọc nháp/ghi quản lý/thống kê', async t => {
  // Khai báo calls: tạo mảng [].
  const calls = []
  // Khai báo target: await chờ Gọi listen(t, (req, res) => { calls.push(req.url). | Thực hiện Gọi calls.push(req.url). | Đặt header phản hồi: res.setHeader('Content-Type', 'application/json'). | Thực hiện Gọi res.end('{"ok":true}').
  const target = await listen(t, (req, res) => { calls.push(req.url); res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}') })
  // Khai báo middleware: Gọi createVisitorApiMiddleware({ enabled: true, catalogTarget: target, presenceTarget: target. | Gán thuộc tính enabled: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính catalogTarget: sử dụng target làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính presenceTarget: sử dụng target làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const middleware = createVisitorApiMiddleware({ enabled: true, catalogTarget: target, presenceTarget: target })
  // Khai báo origin: await chờ Gọi listen(t, (req, res) => middleware(req, res, () => { res.writeHead(200). | Thực hiện Gọi res.writeHead(200). | Thực hiện Gọi res.end('Expo manifest fallback').
  const origin = await listen(t, (req, res) => middleware(req, res, () => { res.writeHead(200); res.end('Expo manifest fallback') }))
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 200).
  assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 200)
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__visitor-api/presence/sessions/heartbeat', { method: 'POST', body: '{}' })).status. | Gán thuộc tính method: chuỗi 'POST'. | Gán thuộc tính body: chuỗi '{}'.
  assert.equal((await fetch(origin + '/__visitor-api/presence/sessions/heartbeat', { method: 'POST', body: '{}' })).status, 200)
  // Duyệt lần lượt ['document', 'identity', 'gate/statistics', 'audio/preview/' + 'a'.repeat(64) +  bằng const route.
  for (const route of ['document', 'identity', 'gate/statistics', 'audio/preview/' + 'a'.repeat(64) + '.mp3']) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal((await fetch(origin + '/__visitor-api/catalog/' + route)).status, 404)`: Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__visitor-api/catalog/' + route)).status, 404).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.equal((await fetch(origin + '/__visitor-api/catalog/' + route)).status, 404)
  }
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__visitor-api/catalog/commands', { method: 'POST', body: '{}' })).status, 404). | Gán thuộc tính method: chuỗi 'POST'. | Gán thuộc tính body: chuỗi '{}'.
  assert.equal((await fetch(origin + '/__visitor-api/catalog/commands', { method: 'POST', body: '{}' })).status, 404)
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__visitor-api/presence/statistics/active')).status, 404).
  assert.equal((await fetch(origin + '/__visitor-api/presence/statistics/active')).status, 404)
  // Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__admin-api/document')).status, 404).
  assert.equal((await fetch(origin + '/__admin-api/document')).status, 404)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(calls, ['/published', '/sessions/heartbeat'])`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual(calls, ['/published', '/sessions/heartbeat']).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.deepEqual(calls, ['/published', '/sessions/heartbeat'])
})
// Khẳng định kết quả thử nghiệm bằng test('Middleware visitor không hoạt động ở Metro admin khi disabled', async t => { const middleware = createVisitorApiMi.
test('Middleware visitor không hoạt động ở Metro admin khi disabled', async t => {
  // Khai báo middleware: Gọi createVisitorApiMiddleware().
  const middleware = createVisitorApiMiddleware()
  // Khai báo origin: await chờ Gọi listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404). | Thực hiện Gọi res.writeHead(404). | Thực hiện Gọi res.end().
  const origin = await listen(t, (req, res) => middleware(req, res, () => { res.writeHead(404); res.end() }))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 404)`: Khẳng định kết quả thử nghiệm bằng assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 404).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal((await fetch(origin + '/__visitor-api/catalog/published')).status, 404)
})
