/**
 * FILE: scripts/ChayApiDiTich.cjs
 * FILE NÀY LÀM GÌ: Khởi động hoặc dùng lại API di tích đang chạy và xác định địa chỉ kết nối phù hợp.
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const os = require('node:os')
const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')
const { isIPv4 } = require('node:net')
const root = path.resolve(__dirname, '..')

// CHỨC NĂNG: Tìm IP để điện thoại cùng mạng gọi API.
// XỬ LÝ: Không có LAN trả null; không dùng localhost làm URL cho điện thoại.
// [HỖ TRỢ CHUNG] findLanAddress — Tìm IP để điện thoại cùng mạng gọi API.
function findLanAddress(interfaces = os.networkInterfaces(), configured = process.env.CATALOG_LAN_IP) {
  if (configured) {
    if (!isIPv4(configured) || configured.startsWith('127.') || configured === '0.0.0.0') {
      
      throw new Error('CATALOG_LAN_IP phải là địa chỉ IPv4 LAN của máy tính.')
    }
    
    return configured
  }
  // CHỨC NĂNG: Ưu tiên Wi-Fi/Ethernet thật; không chọn IP riêng của WARP/VPN.
  // XỬ LÝ: Chỉ nhận IPv4 LAN và bỏ adapter ảo trước khi xếp hạng.
  const candidates = Object.entries(interfaces).flatMap(([name, rows]) => {
    if (/warp|vpn|radmin|virtual|vethernet|loopback|tunnel|tap|tun\d/i.test(name)) return []
    const score = /wi-?fi|wlan|wireless/i.test(name) ? 100 : /ethernet|eth\d/i.test(name) ? 80 : 10
    
    return (rows || []).filter(item => item && item.family === 'IPv4' && !item.internal
      && /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address))
      .map(item => ({ address: item.address, score }))
  })
  
  return candidates.sort((a, b) => b.score - a.score)[0]?.address ?? null
}
// TẠI SAO (findLanAddress): IP VPN hoặc adapter ảo có thể không truy cập được từ điện thoại cùng
// Wi-Fi.

// CHỨC NĂNG: Chỉ đổi URL LAN cũ; giữ cấu hình triển khai và các biến khác.
// XỬ LÝ: Không có LAN thì giữ nguyên file, tránh phá cấu hình mobile đang dùng.
// [HỖ TRỢ CHUNG] updateMobileEnv — Chỉ đổi URL LAN cũ; giữ cấu hình triển khai và các biến khác.
function updateMobileEnv(text, address, port = '8788') {
  if (!address) return text
  // Duyệt lần lượt ['EXPO_PUBLIC_ADMIN_API_URL', 'EXPO_PUBLIC_CATALOG_API_URL', 'EXPO_PUBLIC_ADMIN_ bằng const key.
  for (const key of ['EXPO_PUBLIC_ADMIN_API_URL', 'EXPO_PUBLIC_CATALOG_API_URL', 'EXPO_PUBLIC_ADMIN_PRESENCE_API_URL']) {
    const old = text.match(new RegExp('^' + key + '=(.*)$', 'm'))?.[1]?.trim()
    if (old && !/^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(old)) continue
    const suffix = key === 'EXPO_PUBLIC_ADMIN_PRESENCE_API_URL' ? '/presence' : ''
    
    text = text.split(/\r?\n/).filter(line => !line.startsWith(key + '='))
      .join('\n').trimEnd() + '\n' + key + '=http://' + address + ':' + port + suffix + '\n'
  }
  
  return text
}
// TẠI SAO (updateMobileEnv): Máy đổi Wi-Fi có thể đổi IP; cập nhật có chọn lọc giúp giữ các cấu
// hình khác.

function main() {
  const address = findLanAddress()
  if (address) {
    const file = path.join(root, 'apps/mobile/.env.local')
    const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    const after = updateMobileEnv(before, address, process.env.CATALOG_PORT || '8788')
    // CHỨC NĂNG: Hạn chế ghi file để không kích hoạt reload Expo vô ích.
    if (after !== before) fs.writeFileSync(file, after)
    console.log('URL mobile: http://' + address + ':' + (process.env.CATALOG_PORT || '8788'))
    
    console.log('Nếu URL thay đổi, khởi động lại Expo để đọc .env mới.')
  } else {
    
    console.log('Chưa có IP LAN: catalog vẫn chạy cho web cục bộ. Mobile khác thiết bị cần LAN hoặc API công khai.')
  }
  const child = spawn(process.execPath, [path.join(root, 'services/catalog/MayChuApi.cjs')], {
    cwd: root, env: { ...process.env, CATALOG_HOST: process.env.CATALOG_HOST || (address ? '0.0.0.0' : '127.0.0.1') },
    
    stdio: 'inherit', windowsHide: true,
  })
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
}
// TẠI SAO (main): Một điểm vào giữ thứ tự các bước chạy công cụ và xử lý lỗi nhất quán.
if (require.main === module) {
  
  try { main() } catch (error) { console.error(error.message); process.exitCode = 1 }
}
module.exports = { findLanAddress, updateMobileEnv }
/* CÁCH KIỂM TRA: Không LAN vẫn chạy catalog; có LAN cập nhật ba URL; URL HTTPS cũ được giữ. */
