/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra khởi chạy mock API, chọn mạng, dùng lại service và xử lý cổng/API không sẵn sàng.
 *
 * VỊ TRÍ: scripts/startup.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; node:http; ./start-catalog.cjs; ./start-web.cjs
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo http: require nạp module 'node:http' để dùng chức năng có sẵn thay vì chép lại.
const http = require('node:http')
// Khai báo { findLanAddress, updateMobileEnv }: require nạp module './start-catalog.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { findLanAddress, updateMobileEnv } = require('./start-catalog.cjs')
// Khai báo { ensureService }: require nạp module './start-web.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { ensureService } = require('./start-web.cjs')

// Khẳng định kết quả thử nghiệm bằng test('Không có LAN không làm lỗi và không ghi đè cấu hình mobile', () => { assert.equal(findLanAddress({}, ''), null) co.
test('Không có LAN không làm lỗi và không ghi đè cấu hình mobile', () => {
  // Khẳng định kết quả thử nghiệm bằng assert.equal(findLanAddress({}, ''), null).
  assert.equal(findLanAddress({}, ''), null)
  // Khai báo text: chuỗi 'OTHER=keep\nEXPO_PUBLIC_CATALOG_API_URL=https://guide.test/api/catalog\n'.
  const text = 'OTHER=keep\nEXPO_PUBLIC_CATALOG_API_URL=https://guide.test/api/catalog\n'
  // Khẳng định kết quả thử nghiệm bằng assert.equal(updateMobileEnv(text, null), text).
  assert.equal(updateMobileEnv(text, null), text)
  // Khai báo next: Gọi updateMobileEnv(text, '192.168.1.10').
  const next = updateMobileEnv(text, '192.168.1.10')
  // Khẳng định kết quả thử nghiệm bằng assert.ok(next.includes('https://guide.test/api/catalog')).
  assert.ok(next.includes('https://guide.test/api/catalog'))
  // Khẳng định kết quả thử nghiệm bằng assert.ok(next.includes('OTHER=keep')).
  assert.ok(next.includes('OTHER=keep'))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(next.includes('EXPO_PUBLIC_ADMIN_PRESENCE_API_URL=http://192.168.1.10:8788/`: Khẳng định kết quả thử nghiệm bằng assert.ok(next.includes('EXPO_PUBLIC_ADMIN_PRESENCE_API_URL=http://192.168.1.10:8788/presence')).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.ok(next.includes('EXPO_PUBLIC_ADMIN_PRESENCE_API_URL=http://192.168.1.10:8788/presence'))
})
// Khẳng định kết quả thử nghiệm bằng test('IP LAN lấy mạng riêng, loại loopback và cấu hình sai', () => { assert.equal(findLanAddress({ wifi: [{ family: 'IPv.
test('IP LAN lấy mạng riêng, loại loopback và cấu hình sai', () => {
  // Khẳng định kết quả thử nghiệm bằng assert.equal(findLanAddress({ wifi: [{ family: 'IPv4', address: '192.168.1.20', internal: false }] }, ''), '192.168.1.20. | Gán thuộc tính wifi: tạo mảng [{ family: 'IPv4', address: '192.168.1.20', internal: false }]. | Gán thuộc tính family: chuỗi 'IPv4'. | Gán thuộc tính address: chuỗi '192.168.1.20'. | Gán thuộc tính internal: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  assert.equal(findLanAddress({ wifi: [{ family: 'IPv4', address: '192.168.1.20', internal: false }] }, ''), '192.168.1.20')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.throws(() => findLanAddress({}, '127.0.0.1'), /IPv4 LAN/)`: Khẳng định kết quả thử nghiệm bằng assert.throws(() => findLanAddress({}, '127.0.0.1'), /IPv4 LAN/).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.throws(() => findLanAddress({}, '127.0.0.1'), /IPv4 LAN/)
})

// Khai báo serve(t, response). Nhận đầu vào qua tham số.
async function serve(t, response) {
  // Khai báo server: Gọi http.createServer((_req, res) => { res.setHeader('Content-Type', 'application/json'). | Đặt header phản hồi: res.setHeader('Content-Type', 'application/json'). | Thực hiện Gọi res.end(JSON.stringify(response)).
  const server = http.createServer((_req, res) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(response)) })
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
// TẠI SAO (serve): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
// mạng, GPS hay loa thật.
// Khẳng định kết quả thử nghiệm bằng test('API đang chạy được dùng lại, không mở tiến trình và không reset RAM', async t => { const origin = await serve(t, {.
test('API đang chạy được dùng lại, không mở tiến trình và không reset RAM', async t => {
  // Khai báo origin: await chờ Gọi serve(t, { version: 'existing:4' }). | Gán thuộc tính version: chuỗi 'existing:4'.
  const origin = await serve(t, { version: 'existing:4' })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const result = await ensureService({ name: 'catalog', origin, healthPath: '/version',`: Khai báo result: await chờ Gọi ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof v. | Gán thuộc tính name: chuỗi 'catalog'. | Đặt trường origin bằng giá trị của biến cùng tên. | Gán thuộc tính healthPath: chuỗi '/version'. | Gán thuộc tính accept: khai báo callback value => typeof value?.version === 'string'.
   * DÒNG `{ launch: () => assert.fail('Không được mở lại service đang chạy') })`: Khai báo result: await chờ Gọi ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof v. | Gán thuộc tính launch: khai báo callback () => assert.fail('Không được mở lại service đang chạy').
   */
  const result = await ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof value?.version === 'string' },
    { launch: () => assert.fail('Không được mở lại service đang chạy') })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(result, 'reused')`: Khẳng định kết quả thử nghiệm bằng assert.equal(result, 'reused').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(result, 'reused')
})
// Khẳng định kết quả thử nghiệm bằng test('Cổng có ứng dụng khác bị từ chối, không mở thêm service', async t => { const origin = await serve(t, { unrelated:.
test('Cổng có ứng dụng khác bị từ chối, không mở thêm service', async t => {
  // Khai báo origin: await chờ Gọi serve(t, { unrelated: true }). | Gán thuộc tính unrelated: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const origin = await serve(t, { unrelated: true })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(ensureService({ name: 'catalog', origin, healthPath: '/version',`: Khẳng định kết quả thử nghiệm bằng await assert.rejects(ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof value?.ver. | Gán thuộc tính name: chuỗi 'catalog'. | Đặt trường origin bằng giá trị của biến cùng tên. | Gán thuộc tính healthPath: chuỗi '/version'. | Gán thuộc tính accept: khai báo callback value => typeof value?.version === 'string'.
   * DÒNG `{ launch: () => assert.fail('Không được chiếm cổng') }), /cổng đang có/)`: Khẳng định kết quả thử nghiệm bằng await assert.rejects(ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof value?.ver. | Gán thuộc tính launch: khai báo callback () => assert.fail('Không được chiếm cổng').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  await assert.rejects(ensureService({ name: 'catalog', origin, healthPath: '/version', accept: value => typeof value?.version === 'string' },
    { launch: () => assert.fail('Không được chiếm cổng') }), /cổng đang có/)
})
// Khẳng định kết quả thử nghiệm bằng test('API tùy chỉnh không sẵn sàng không bị thay bằng RAM khác', async t => { const origin = await serve(t, {}) await as.
test('API tùy chỉnh không sẵn sàng không bị thay bằng RAM khác', async t => {
  // Khai báo origin: await chờ Gọi serve(t, {}).
  const origin = await serve(t, {})
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(ensureService({ name: 'catalog', custom: true, origin, healthPat`: Khẳng định kết quả thử nghiệm bằng await assert.rejects(ensureService({ name: 'catalog', custom: true, origin, healthPath: '/version', accept: () => false. | Gán thuộc tính name: chuỗi 'catalog'. | Gán thuộc tính custom: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường origin bằng giá trị của biến cùng tên. | Gán thuộc tính healthPath: chuỗi '/version'. | Gán thuộc tính accept: khai báo callback () => false.
   * DÒNG `{ launch: () => assert.fail('Không được thay API cấu hình') }), /API đã cấu hình/)`: Khẳng định kết quả thử nghiệm bằng await assert.rejects(ensureService({ name: 'catalog', custom: true, origin, healthPath: '/version', accept: () => false. | Gán thuộc tính launch: khai báo callback () => assert.fail('Không được thay API cấu hình').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  await assert.rejects(ensureService({ name: 'catalog', custom: true, origin, healthPath: '/version', accept: () => false },
    { launch: () => assert.fail('Không được thay API cấu hình') }), /API đã cấu hình/)
})
