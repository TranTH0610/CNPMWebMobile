/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: CÔNG CỤ CHẠY DỰ ÁN
 *
 * FILE NÀY LÀM GÌ:
 * Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi
 *
 * VỊ TRÍ: scripts/ChayMobileQuanTri.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - scripts/KiemThuKhoiDongMobileQuanTri.test.cjs
 *
 * PHỤ THUỘC:
 * - node:path
 * - node:module
 * - node:child_process
 * - ./ChayWebsite.cjs
 * - ./ChayApiDiTich.cjs
 * - ./ChuyenTiepApiQuanTriMetro.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. adminOptions
 * 2. main
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')
// Khai báo { spawn }: require nạp module 'node:child_process' để dùng chức năng có sẵn thay vì chép lại.
const { spawn } = require('node:child_process')
// Khai báo { ensureDevServices }: require nạp module './ChayWebsite.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { ensureDevServices } = require('./ChayWebsite.cjs')
// Khai báo { findLanAddress }: require nạp module './ChayApiDiTich.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { findLanAddress } = require('./ChayApiDiTich.cjs')
// Khai báo { PREFIX }: require nạp module './ChuyenTiepApiQuanTriMetro.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { PREFIX } = require('./ChuyenTiepApiQuanTriMetro.cjs')
// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')
// Khai báo mobile: Gọi path.join(root, 'apps/mobile').
const mobile = path.join(root, 'apps/mobile')

// CHỨC NĂNG: Tạo URL từ IP mạng vật lý và cổng Expo, không dùng IP API cũ trong .env.
// XỬ LÝ: Một origin chung cho nội dung, QR thống kê, presence và nghe thử admin.
// Khai báo adminOptions(address, port). Nhận đầu vào qua tham số.
// ==================== [KHOI-DONG] [CAU-HINH] adminOptions ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
    
    EXPO_PUBLIC_ADMIN_PRESENCE_API_URL: base + '/presence' }
}
// TẠI SAO (adminOptions): Dùng cùng host Metro giúp bản admin tránh giữ địa chỉ IP hoặc tunnel
// API đã cũ.

// Khai báo main(args). Nhận đầu vào qua tham số.
// ==================== [KHOI-DONG] [CAU-HINH] main ====================
// CHỨC NĂNG: Thực hiện bước main trong nhiệm vụ: Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
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
    
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  
  child.on('exit', code => { process.exitCode = code ?? 1 })
}
// TẠI SAO (main): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.
// Rẽ nhánh nếu require.main === module. | Thực hiện Gọi main().catch(error => { console.error('Chưa mở được Admin mobile: ' + error.message). | Thực hiện Gọi console.error('Chưa mở được Admin mobile: ' + error.message). | Thực hiện tính biểu thức process.exitCode = 1.
if (require.main === module) main().catch(error => { console.error('Chưa mở được Admin mobile: ' + error.message); process.exitCode = 1 })
// Thực hiện tính biểu thức module.exports = { adminOptions }. | Đặt trường adminOptions bằng giá trị của biến cùng tên.
module.exports = { adminOptions }
/* CÁCH KIỂM TRA: Đổi Wi-Fi rồi chạy lại lấy IP mới; .env du khách giữ nguyên; mock server thiếu tự mở. */
