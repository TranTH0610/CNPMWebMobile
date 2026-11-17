/**
 * FILE: scripts/ChayMobileDuKhach.cjs
 * FILE NÀY LÀM GÌ: Khởi chạy Expo du khách và truyền địa chỉ proxy Metro theo mạng LAN hiện tại để app gọi mock
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn } = require('node:child_process')
const { ensureDevServices } = require('./ChayWebsite.cjs')
const { findLanAddress } = require('./ChayApiDiTich.cjs')
const { CATALOG_PREFIX, PRESENCE_PREFIX } = require('./ChuyenTiepApiDuKhachMetro.cjs')
const root = path.resolve(__dirname, '..')
// CHỨC NĂNG: Tạo cấu hình chạy Expo du khách.
// XỬ LÝ: Cấp URL proxy của cùng Metro cho danh mục và heartbeat; không đổi thành bản admin.
// [HỖ TRỢ CHUNG] visitorOptions — Tạo cấu hình chạy Expo du khách.
function visitorOptions(address, port = 8081) {
  if (!address) throw new Error('Kết nối máy tính và điện thoại cùng Wi-Fi trước khi chạy mobile du khách.')
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cổng Expo không hợp lệ.')
  const origin = 'http://' + address + ':' + port
  // Trả kết quả: tạo object gồm EXPO_PUBLIC_APP_TARGET, REACT_NATIVE_PACKAGER_HOSTNAME, EXPO_PUBLIC_CATALOG_API_URL, EXPO_PUBLIC_PRESENCE_API_URL. | Gán thuộc tính EXPO_PUBLIC_APP_TARGET: chuỗi 'visitor'. | Gán thuộc tính REACT_NATIVE_PACKAGER_HOSTNAME: sử dụng address làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  return { EXPO_PUBLIC_APP_TARGET: 'visitor', REACT_NATIVE_PACKAGER_HOSTNAME: address,
    EXPO_PUBLIC_CATALOG_API_URL: origin + CATALOG_PREFIX,
    
    EXPO_PUBLIC_PRESENCE_API_URL: origin + PRESENCE_PREFIX }
}
// TẠI SAO (visitorOptions): Du khách cần URL công bố và heartbeat của môi trường đang chạy,
// không nhầm endpoint admin.
async function main(args = process.argv.slice(2)) {
  const index = args.indexOf('--port')
  const port = Number(index >= 0 ? args[index + 1] : args.find(value => value.startsWith('--port='))?.slice(7) || '8081')
  const env = { ...process.env, ...visitorOptions(findLanAddress(), port) }
  // CHỨC NĂNG: Giữ cùng kho RAM với web/admin; thiếu service tự khởi động, không reset.
  await ensureDevServices()
  const mobile = path.join(root, 'apps/mobile')
  const req = createRequire(path.join(mobile, 'package.json'))
  const cli = path.join(path.dirname(req.resolve('expo/package.json')), 'bin/cli')
  const forward = args.filter((value, i) => value !== '--port' && !value.startsWith('--port=') && args[i - 1] !== '--port')
  console.log('Mobile du khách: exp://' + env.REACT_NATIVE_PACKAGER_HOSTNAME + ':' + port)
  console.log('API công khai qua Metro: ' + env.EXPO_PUBLIC_CATALOG_API_URL)
  const child = spawn(process.execPath, [cli, 'start', '--port', String(port), ...(forward.includes('--clear') ? [] : ['--clear']), ...forward], {
    
    cwd: mobile, env, stdio: 'inherit', windowsHide: true,
  })
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  
  child.on('exit', code => { process.exitCode = code ?? 1 })
}
// TẠI SAO (main): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.
if (require.main === module) main().catch(error => { console.error('Chưa mở được mobile du khách: ' + error.message); process.exitCode = 1 })
module.exports = { visitorOptions }
/* CÁCH KIỂM TRA: URL tunnel hết phiên không ảnh hưởng Expo LAN; không có proxy admin; đổi mạng chạy lại. */
