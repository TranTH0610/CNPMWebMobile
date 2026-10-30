/**
 * FILE NÀY LÀM GÌ
 * Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi
 * mở app.
 *
 * VỊ TRÍ: scripts/start-mobile-admin.cjs
 * DÙNG BỞI: scripts/mobile-admin-startup.test.cjs.
 * PHỤ THUỘC: node:path; node:module; node:child_process; ./start-web.cjs; ./start-catalog.cjs;
 * ./metro-admin-proxy.cjs
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')
// Khai báo { spawn }: require nạp module 'node:child_process' để dùng chức năng có sẵn thay vì chép lại.
const { spawn } = require('node:child_process')
// Khai báo { ensureDevServices }: require nạp module './start-web.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { ensureDevServices } = require('./start-web.cjs')
// Khai báo { findLanAddress }: require nạp module './start-catalog.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { findLanAddress } = require('./start-catalog.cjs')
// Khai báo { PREFIX }: require nạp module './metro-admin-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { PREFIX } = require('./metro-admin-proxy.cjs')
// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')
// Khai báo mobile: Gọi path.join(root, 'apps/mobile').
const mobile = path.join(root, 'apps/mobile')

// CHỨC NĂNG: Tạo URL từ IP mạng vật lý và cổng Expo, không dùng IP API cũ trong .env.
// XỬ LÝ: Một origin chung cho nội dung, QR thống kê, presence và nghe thử admin.
// Khai báo adminOptions(address, port). Nhận đầu vào qua tham số.
function adminOptions(address, port = 8082) {
  // Rẽ nhánh nếu !address. | Ném new Error('Chưa có mạng LAN. Kết nối máy tính và điện thoại cùng Wi-Fi rồi chạy lại.').
  if (!address) throw new Error('Chưa có mạng LAN. Kết nối máy tính và điện thoại cùng Wi-Fi rồi chạy lại.')
  // Rẽ nhánh nếu !Number.isInteger(port) || port < 1 || port > 65535. | Ném new Error('Cổng Expo không hợp lệ.').
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cổng Expo không hợp lệ.')
  // Khai báo base: tính biểu thức 'http://' + address + ':' + port + PREFIX.
  const base = 'http://' + address + ':' + port + PREFIX
  // Trả kết quả: tạo object gồm EXPO_PUBLIC_APP_TARGET, REACT_NATIVE_PACKAGER_HOSTNAME, EXPO_PUBLIC_ADMIN_API_URL, EXPO_PUBLIC_CATALOG_API_URL, EXPO_PUBLIC_ADMIN_PRESENCE_API_URL. | Gán thuộc tính EXPO_PUBLIC_APP_TARGET: chuỗi 'admin'. | Gán thuộc tính REACT_NATIVE_PACKAGER_HOSTNAME: sử dụng address làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  return { EXPO_PUBLIC_APP_TARGET: 'admin', REACT_NATIVE_PACKAGER_HOSTNAME: address,
    // Gán thuộc tính EXPO_PUBLIC_ADMIN_API_URL: sử dụng base làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính EXPO_PUBLIC_CATALOG_API_URL: sử dụng base làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    EXPO_PUBLIC_ADMIN_API_URL: base, EXPO_PUBLIC_CATALOG_API_URL: base,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `EXPO_PUBLIC_ADMIN_PRESENCE_API_URL: base + '/presence' }`: Gán thuộc tính EXPO_PUBLIC_ADMIN_PRESENCE_API_URL: tính biểu thức base + '/presence'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    EXPO_PUBLIC_ADMIN_PRESENCE_API_URL: base + '/presence' }
}
// TẠI SAO (adminOptions): Dùng cùng host Metro giúp bản admin tránh giữ địa chỉ IP hoặc tunnel
// API đã cũ.

// Khai báo main(args). Nhận đầu vào qua tham số.
async function main(args = process.argv.slice(2)) {
  // Khai báo address: Gọi findLanAddress().
  const address = findLanAddress()
  // Khai báo index: Gọi args.indexOf('--port').
  const index = args.indexOf('--port')
  // Khai báo port: Gọi Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.sli.
  const port = Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.slice(7) || '8082')
  // Khai báo env: tạo object gồm ...giá trị ghép, ...giá trị ghép.
  const env = { ...process.env, ...adminOptions(address, port) }
  // CHỨC NĂNG: Kiểm tra/mở mock server trước khi Expo biên dịch các URL vào bundle.
  // XỬ LÝ: Tái sử dụng server RAM hiện có; không dừng server hoặc reset dữ liệu.
  // Thực hiện await chờ Gọi ensureDevServices().
  await ensureDevServices()
  // Khai báo req: Gọi createRequire(path.join(mobile, 'package.json')).
  const req = createRequire(path.join(mobile, 'package.json'))
  // Khai báo cli: Gọi path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli').
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  // Khai báo forward: args.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const forward = args.filter((value, i) => value !== '--port' && !value.startsWith('--port=') && args[i - 1] !== '--port')
  // Thực hiện Gọi console.log('Mobile Admin: exp://' + address + ':' + port).
  console.log('Mobile Admin: exp://' + address + ':' + port)
  // Thực hiện Gọi console.log('API qua Metro: ' + env.EXPO_PUBLIC_ADMIN_API_URL).
  console.log('API qua Metro: ' + env.EXPO_PUBLIC_ADMIN_API_URL)
  // Thực hiện Gọi console.log('Điện thoại và máy tính cần cùng Wi-Fi.
  console.log('Điện thoại và máy tính cần cùng Wi-Fi; không cần sửa IP trong .env.')
  // Khai báo child: Gọi spawn(process.execPath, [cli, 'start', '--port', String(port), ...(forward.includes('--cle.
  const child = spawn(process.execPath, [cli, 'start', '--port', String(port), ...(forward.includes('--clear') ? [] : ['--clear']), ...forward], {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `cwd: mobile, env, stdio: 'inherit', windowsHide: true,`: Gán thuộc tính cwd: sử dụng mobile làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường env bằng giá trị của biến cùng tên. | Gán thuộc tính stdio: chuỗi 'inherit'. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `child.on('exit', code => { process.exitCode = code ?? 1 })`: Đăng ký xử lý sự kiện: child.on('exit', code => { process.exitCode = code ?? 1 }). | Thực hiện tính biểu thức process.exitCode = code ?? 1.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  child.on('exit', code => { process.exitCode = code ?? 1 })
}
// TẠI SAO (main): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.
// Rẽ nhánh nếu require.main === module. | Thực hiện Gọi main().catch(error => { console.error('Chưa mở được Admin mobile: ' + error.message). | Thực hiện Gọi console.error('Chưa mở được Admin mobile: ' + error.message). | Thực hiện tính biểu thức process.exitCode = 1.
if (require.main === module) main().catch(error => { console.error('Chưa mở được Admin mobile: ' + error.message); process.exitCode = 1 })
// Thực hiện tính biểu thức module.exports = { adminOptions }. | Đặt trường adminOptions bằng giá trị của biến cùng tên.
module.exports = { adminOptions }
/* CÁCH KIỂM TRA: Đổi Wi-Fi rồi chạy lại lấy IP mới; .env du khách giữ nguyên; mock server thiếu tự mở. */
