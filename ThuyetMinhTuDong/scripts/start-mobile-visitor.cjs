/**
 * FILE NÀY LÀM GÌ
 * Khởi chạy Expo du khách và truyền địa chỉ proxy Metro theo mạng LAN hiện tại để app gọi mock
 * API.
 *
 * VỊ TRÍ: scripts/start-mobile-visitor.cjs
 * DÙNG BỞI: scripts/mobile-visitor-startup.test.cjs.
 * PHỤ THUỘC: node:path; node:module; node:child_process; ./start-web.cjs; ./start-catalog.cjs;
 * ./metro-visitor-proxy.cjs
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
// Khai báo { CATALOG_PREFIX, PRESENCE_PREFIX }: require nạp module './metro-visitor-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { CATALOG_PREFIX, PRESENCE_PREFIX } = require('./metro-visitor-proxy.cjs')
// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')
// CHỨC NĂNG: Tạo cấu hình chạy Expo du khách.
// XỬ LÝ: Cấp URL proxy của cùng Metro cho danh mục và heartbeat; không đổi thành bản admin.
// Khai báo visitorOptions(address, port). Nhận đầu vào qua tham số.
function visitorOptions(address, port = 8081) {
  // Rẽ nhánh nếu !address. | Ném new Error('Kết nối máy tính và điện thoại cùng Wi-Fi trước khi chạy mobile du khách.').
  if (!address) throw new Error('Kết nối máy tính và điện thoại cùng Wi-Fi trước khi chạy mobile du khách.')
  // Rẽ nhánh nếu !Number.isInteger(port) || port < 1 || port > 65535. | Ném new Error('Cổng Expo không hợp lệ.').
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cổng Expo không hợp lệ.')
  // Khai báo origin: tính biểu thức 'http://' + address + ':' + port.
  const origin = 'http://' + address + ':' + port
  // Trả kết quả: tạo object gồm EXPO_PUBLIC_APP_TARGET, REACT_NATIVE_PACKAGER_HOSTNAME, EXPO_PUBLIC_CATALOG_API_URL, EXPO_PUBLIC_PRESENCE_API_URL. | Gán thuộc tính EXPO_PUBLIC_APP_TARGET: chuỗi 'visitor'. | Gán thuộc tính REACT_NATIVE_PACKAGER_HOSTNAME: sử dụng address làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  return { EXPO_PUBLIC_APP_TARGET: 'visitor', REACT_NATIVE_PACKAGER_HOSTNAME: address,
    // Gán thuộc tính EXPO_PUBLIC_CATALOG_API_URL: tính biểu thức origin + CATALOG_PREFIX.
    EXPO_PUBLIC_CATALOG_API_URL: origin + CATALOG_PREFIX,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `EXPO_PUBLIC_PRESENCE_API_URL: origin + PRESENCE_PREFIX }`: Gán thuộc tính EXPO_PUBLIC_PRESENCE_API_URL: tính biểu thức origin + PRESENCE_PREFIX.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    EXPO_PUBLIC_PRESENCE_API_URL: origin + PRESENCE_PREFIX }
}
// TẠI SAO (visitorOptions): Du khách cần URL công bố và heartbeat của môi trường đang chạy,
// không nhầm endpoint admin.
// Khai báo main(args). Nhận đầu vào qua tham số.
async function main(args = process.argv.slice(2)) {
  // Khai báo index: Gọi args.indexOf('--port').
  const index = args.indexOf('--port')
  // Khai báo port: Gọi Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.sli.
  const port = Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.slice(7) || '8081')
  // Khai báo env: tạo object gồm ...giá trị ghép, ...giá trị ghép.
  const env = { ...process.env, ...visitorOptions(findLanAddress(), port) }
  // CHỨC NĂNG: Giữ cùng kho RAM với web/admin; thiếu service tự khởi động, không reset.
  // Thực hiện await chờ Gọi ensureDevServices().
  await ensureDevServices()
  // Khai báo mobile: Gọi path.join(root, 'apps/mobile').
  const mobile = path.join(root, 'apps/mobile')
  // Khai báo req: Gọi createRequire(path.join(mobile, 'package.json')).
  const req = createRequire(path.join(mobile, 'package.json'))
  // Khai báo cli: Gọi path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli').
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  // Khai báo forward: args.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const forward = args.filter((value, i) => value !== '--port' && !value.startsWith('--port=') && args[i - 1] !== '--port')
  // Thực hiện Gọi console.log('Mobile du khách: exp://' + env.REACT_NATIVE_PACKAGER_HOSTNAME + ':' + port).
  console.log('Mobile du khách: exp://' + env.REACT_NATIVE_PACKAGER_HOSTNAME + ':' + port)
  // Thực hiện Gọi console.log('API công khai qua Metro: ' + env.EXPO_PUBLIC_CATALOG_API_URL).
  console.log('API công khai qua Metro: ' + env.EXPO_PUBLIC_CATALOG_API_URL)
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
// Rẽ nhánh nếu require.main === module. | Thực hiện Gọi main().catch(error => { console.error('Chưa mở được mobile du khách: ' + error.message). | Thực hiện Gọi console.error('Chưa mở được mobile du khách: ' + error.message). | Thực hiện tính biểu thức process.exitCode = 1.
if (require.main === module) main().catch(error => { console.error('Chưa mở được mobile du khách: ' + error.message); process.exitCode = 1 })
// Thực hiện tính biểu thức module.exports = { visitorOptions }. | Đặt trường visitorOptions bằng giá trị của biến cùng tên.
module.exports = { visitorOptions }
/* CÁCH KIỂM TRA: URL tunnel hết phiên không ảnh hưởng Expo LAN; không có proxy admin; đổi mạng chạy lại. */
