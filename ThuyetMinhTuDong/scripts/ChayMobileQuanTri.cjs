/**
 * FILE: scripts/ChayMobileQuanTri.cjs
 * FILE NÀY LÀM GÌ: Khởi chạy Expo admin với cùng origin Metro cho dữ liệu/thống kê; kiểm tra mock service trước khi
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn } = require('node:child_process')
const { ensureDevServices } = require('./ChayWebsite.cjs')
const { findLanAddress } = require('./ChayApiDiTich.cjs')
const { PREFIX } = require('./ChuyenTiepApiQuanTriMetro.cjs')
const root = path.resolve(__dirname, '..')
const mobile = path.join(root, 'apps/mobile')

// CHỨC NĂNG: Tạo URL từ IP mạng vật lý và cổng Expo, không dùng IP API cũ trong .env.
// XỬ LÝ: Một origin chung cho nội dung, QR thống kê, presence và nghe thử admin.
// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] adminOptions — Tạo URL từ IP mạng vật lý và cổng Expo, không dùng IP API cũ trong .env.
function adminOptions(address, port = 8082) {
  if (!address) throw new Error('Chưa có mạng LAN. Kết nối máy tính và điện thoại cùng Wi-Fi rồi chạy lại.')
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cổng Expo không hợp lệ.')
  const base = 'http://' + address + ':' + port + PREFIX
  // Trả kết quả: tạo object gồm EXPO_PUBLIC_APP_TARGET, REACT_NATIVE_PACKAGER_HOSTNAME, EXPO_PUBLIC_ADMIN_API_URL, EXPO_PUBLIC_CATALOG_API_URL, EXPO_PUBLIC_ADMIN_PRESENCE_API_URL. | Gán thuộc tính EXPO_PUBLIC_APP_TARGET: chuỗi 'admin'. | Gán thuộc tính REACT_NATIVE_PACKAGER_HOSTNAME: sử dụng address làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  return { EXPO_PUBLIC_APP_TARGET: 'admin', REACT_NATIVE_PACKAGER_HOSTNAME: address,
    EXPO_PUBLIC_ADMIN_API_URL: base, EXPO_PUBLIC_CATALOG_API_URL: base,
    
    EXPO_PUBLIC_ADMIN_PRESENCE_API_URL: base + '/presence' }
}
// TẠI SAO (adminOptions): Dùng cùng host Metro giúp bản admin tránh giữ địa chỉ IP hoặc tunnel
// API đã cũ.

async function main(args = process.argv.slice(2)) {
  const address = findLanAddress()
  const index = args.indexOf('--port')
  const port = Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.slice(7) || '8082')
  const env = { ...process.env, ...adminOptions(address, port) }
  // CHỨC NĂNG: Kiểm tra/mở mock server trước khi Expo biên dịch các URL vào bundle.
  // XỬ LÝ: Tái sử dụng server RAM hiện có; không dừng server hoặc reset dữ liệu.
  await ensureDevServices()
  const req = createRequire(path.join(mobile, 'package.json'))
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  const forward = args.filter((value, i) => value !== '--port' && !value.startsWith('--port=') && args[i - 1] !== '--port')
  console.log('Mobile Admin: exp://' + address + ':' + port)
  console.log('API qua Metro: ' + env.EXPO_PUBLIC_ADMIN_API_URL)
  console.log('Điện thoại và máy tính cần cùng Wi-Fi; không cần sửa IP trong .env.')
  const child = spawn(process.execPath, [cli, 'start', '--port', String(port), ...(forward.includes('--clear') ? [] : ['--clear']), ...forward], {
    
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  
  child.on('exit', code => { process.exitCode = code ?? 1 })
}
// TẠI SAO (main): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.
if (require.main === module) main().catch(error => { console.error('Chưa mở được Admin mobile: ' + error.message); process.exitCode = 1 })
module.exports = { adminOptions }
/* CÁCH KIỂM TRA: Đổi Wi-Fi rồi chạy lại lấy IP mới; .env du khách giữ nguyên; mock server thiếu tự mở. */
