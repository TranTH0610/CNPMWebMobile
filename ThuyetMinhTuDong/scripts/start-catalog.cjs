/**
 * FILE NÀY LÀM GÌ
 * Chạy mock API nội dung và chọn IP LAN phù hợp; hỗ trợ cấu hình kết nối cho môi trường phát
 * triển.
 *
 * VỊ TRÍ: scripts/start-catalog.cjs
 * DÙNG BỞI: scripts/mobile-admin-startup.test.cjs; scripts/start-mobile-admin.cjs;
 * scripts/start-mobile-visitor.cjs; và các nơi import khác.
 * PHỤ THUỘC: node:os; node:fs; node:path; node:child_process; node:net
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo os: require nạp module 'node:os' để dùng chức năng có sẵn thay vì chép lại.
const os = require('node:os')
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { spawn }: require nạp module 'node:child_process' để dùng chức năng có sẵn thay vì chép lại.
const { spawn } = require('node:child_process')
// Khai báo { isIPv4 }: require nạp module 'node:net' để dùng chức năng có sẵn thay vì chép lại.
const { isIPv4 } = require('node:net')
// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')

// CHỨC NĂNG: Tìm IP để điện thoại cùng mạng gọi API.
// XỬ LÝ: Không có LAN trả null; không dùng localhost làm URL cho điện thoại.
// Khai báo findLanAddress(interfaces, configured). Nhận đầu vào qua tham số.
function findLanAddress(interfaces = os.networkInterfaces(), configured = process.env.CATALOG_LAN_IP) {
  // Rẽ nhánh nếu configured.
  if (configured) {
    // Rẽ nhánh nếu !isIPv4(configured) || configured.startsWith('127.') || configured === '0.0.0.0'.
    if (!isIPv4(configured) || configured.startsWith('127.') || configured === '0.0.0.0') {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error('CATALOG_LAN_IP phải là địa chỉ IPv4 LAN của máy tính.')`: Ném new Error('CATALOG_LAN_IP phải là địa chỉ IPv4 LAN của máy tính.').
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      throw new Error('CATALOG_LAN_IP phải là địa chỉ IPv4 LAN của máy tính.')
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return configured`: Trả kết quả: sử dụng configured làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return configured
  }
  // CHỨC NĂNG: Ưu tiên Wi-Fi/Ethernet thật; không chọn IP riêng của WARP/VPN.
  // XỬ LÝ: Chỉ nhận IPv4 LAN và bỏ adapter ảo trước khi xếp hạng.
  // Khai báo candidates: Gọi Object.entries(interfaces).flatMap(([name, rows]) => { if (/warp|vpn|radmin|virtual|vether.
  const candidates = Object.entries(interfaces).flatMap(([name, rows]) => {
    // Rẽ nhánh nếu /warp|vpn|radmin|virtual|vethernet|loopback|tunnel|tap|tun\d/i.test(name). | Trả kết quả: tạo mảng [].
    if (/warp|vpn|radmin|virtual|vethernet|loopback|tunnel|tap|tun\d/i.test(name)) return []
    // Khai báo score: chọn giữa hai giá trị theo điều kiện /wi-?fi|wlan|wireless/i.test(name).
    const score = /wi-?fi|wlan|wireless/i.test(name) ? 100 : /ethernet|eth\d/i.test(name) ? 80 : 10
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return (rows || []).filter(item => item && item.family === 'IPv4' && !item.internal`: Trả kết quả: (rows || []).filter(item => item && item.family === 'IPv4' && !item.internal
      && /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address))
      .map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
     * DÒNG `&& /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address))`: Trả kết quả: (rows || []).filter(item => item && item.family === 'IPv4' && !item.internal
      && /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address))
      .map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
     * DÒNG `.map(item => ({ address: item.address, score }))`: Trả kết quả: (rows || []).filter(item => item && item.family === 'IPv4' && !item.internal
      && /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address))
      .map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần. | Gán thuộc tính address: đọc item.address từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường score bằng giá trị của biến cùng tên.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return (rows || []).filter(item => item && item.family === 'IPv4' && !item.internal
      && /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address))
      .map(item => ({ address: item.address, score }))
  })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return candidates.sort((a, b) => b.score - a.score)[0]?.address ?? null`: Trả kết quả: tính biểu thức candidates.sort((a, b) => b.score - a.score)[0]?.address ?? null.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return candidates.sort((a, b) => b.score - a.score)[0]?.address ?? null
}
// TẠI SAO (findLanAddress): IP VPN hoặc adapter ảo có thể không truy cập được từ điện thoại cùng
// Wi-Fi.

// CHỨC NĂNG: Chỉ đổi URL LAN cũ; giữ cấu hình triển khai và các biến khác.
// XỬ LÝ: Không có LAN thì giữ nguyên file, tránh phá cấu hình mobile đang dùng.
// Khai báo updateMobileEnv(text, address, port). Nhận đầu vào qua tham số.
function updateMobileEnv(text, address, port = '8788') {
  // Rẽ nhánh nếu !address. | Trả kết quả: sử dụng text làm giá trị của bước hiện tại.
  if (!address) return text
  // Duyệt lần lượt ['EXPO_PUBLIC_ADMIN_API_URL', 'EXPO_PUBLIC_CATALOG_API_URL', 'EXPO_PUBLIC_ADMIN_ bằng const key.
  for (const key of ['EXPO_PUBLIC_ADMIN_API_URL', 'EXPO_PUBLIC_CATALOG_API_URL', 'EXPO_PUBLIC_ADMIN_PRESENCE_API_URL']) {
    // Khai báo old: text.match(new RegExp('^' + key + '=(.*)$', 'm'))?.[1]?.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
    const old = text.match(new RegExp('^' + key + '=(.*)$', 'm'))?.[1]?.trim()
    // Rẽ nhánh nếu old && !/^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(old). | Tiếp phần `continue` của ContinueStatement.
    if (old && !/^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(old)) continue
    // Khai báo suffix: chọn giữa hai giá trị theo điều kiện key === 'EXPO_PUBLIC_ADMIN_PRESENCE_API_URL'.
    const suffix = key === 'EXPO_PUBLIC_ADMIN_PRESENCE_API_URL' ? '/presence' : ''
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `text = text.split(/\r?\n/).filter(line => !line.startsWith(key + '='))`: Thực hiện tính biểu thức text = text.split(/\r?\n/).filter(line => !line.startsWith(key + '=')) .join('\n').trimEnd.
     * DÒNG `.join('\n').trimEnd() + '\n' + key + '=http://' + address + ':' + port + suffix + '\n`: Thực hiện tính biểu thức text = text.split(/\r?\n/).filter(line => !line.startsWith(key + '=')) .join('\n').trimEnd.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    text = text.split(/\r?\n/).filter(line => !line.startsWith(key + '='))
      .join('\n').trimEnd() + '\n' + key + '=http://' + address + ':' + port + suffix + '\n'
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return text`: Trả kết quả: sử dụng text làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return text
}
// TẠI SAO (updateMobileEnv): Máy đổi Wi-Fi có thể đổi IP; cập nhật có chọn lọc giúp giữ các cấu
// hình khác.

// Khai báo main(). Nhận đầu vào qua tham số.
function main() {
  // Khai báo address: Gọi findLanAddress().
  const address = findLanAddress()
  // Rẽ nhánh nếu address.
  if (address) {
    // Khai báo file: Gọi path.join(root, 'apps/mobile/.env').
    const file = path.join(root, 'apps/mobile/.env')
    // Khai báo before: chọn giữa hai giá trị theo điều kiện fs.existsSync(file).
    const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    // Khai báo after: Gọi updateMobileEnv(before, address, process.env.CATALOG_PORT || '8788').
    const after = updateMobileEnv(before, address, process.env.CATALOG_PORT || '8788')
    // CHỨC NĂNG: Hạn chế ghi file để không kích hoạt reload Expo vô ích.
    // Rẽ nhánh nếu after !== before. | Thực hiện Gọi fs.writeFileSync(file, after).
    if (after !== before) fs.writeFileSync(file, after)
    // Thực hiện Gọi console.log('URL mobile: http://' + address + ':' + (process.env.CATALOG_PORT || '8788')).
    console.log('URL mobile: http://' + address + ':' + (process.env.CATALOG_PORT || '8788'))
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `console.log('Nếu URL thay đổi, khởi động lại Expo để đọc .env mới.')`: Thực hiện Gọi console.log('Nếu URL thay đổi, khởi động lại Expo để đọc .env mới.').
     * DÒNG `} else {`: Xác định thân khối lệnh.
     */
    console.log('Nếu URL thay đổi, khởi động lại Expo để đọc .env mới.')
  } else {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `console.log('Chưa có IP LAN: catalog vẫn chạy cho web cục bộ. Mobile khác thiết bị cầ`: Thực hiện Gọi console.log('Chưa có IP LAN: catalog vẫn chạy cho web cục bộ. Mobile khác thiết bị cần LAN.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    console.log('Chưa có IP LAN: catalog vẫn chạy cho web cục bộ. Mobile khác thiết bị cần LAN hoặc API công khai.')
  }
  // Khai báo child: Gọi spawn(process.execPath, [path.join(root, 'services/catalog/server.cjs')], { cwd: root, env.
  const child = spawn(process.execPath, [path.join(root, 'services/catalog/server.cjs')], {
    // Gán thuộc tính cwd: sử dụng root làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính env: tạo object gồm ...giá trị ghép, CATALOG_HOST. | Gán thuộc tính CATALOG_HOST: tính biểu thức process.env.CATALOG_HOST || (address ? '0.0.0.0' : '127.0.0.1').
    cwd: root, env: { ...process.env, CATALOG_HOST: process.env.CATALOG_HOST || (address ? '0.0.0.0' : '127.0.0.1') },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `stdio: 'inherit', windowsHide: true,`: Gán thuộc tính stdio: chuỗi 'inherit'. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    stdio: 'inherit', windowsHide: true,
  })
  // Đăng ký xử lý sự kiện: child.on('error', error => { console.error(error.message). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
  child.on('error', error => { console.error(error.message); process.exitCode = 1 })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })`: Đăng ký xử lý sự kiện: child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) }). | Thực hiện tính biểu thức process.exitCode = code ?? (signal ? 1 : 0).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
}
// TẠI SAO (main): Một điểm vào giữ thứ tự các bước chạy công cụ và xử lý lỗi nhất quán.
// Rẽ nhánh nếu require.main === module.
if (require.main === module) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `try { main() } catch (error) { console.error(error.message); process.exitCode = 1 }`: Bắt đầu vùng try. | Thực hiện Gọi main(). | Thực hiện Gọi console.error(error.message). | Thực hiện tính biểu thức process.exitCode = 1.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  try { main() } catch (error) { console.error(error.message); process.exitCode = 1 }
}
// Thực hiện tính biểu thức module.exports = { findLanAddress, updateMobileEnv }. | Đặt trường findLanAddress bằng giá trị của biến cùng tên. | Đặt trường updateMobileEnv bằng giá trị của biến cùng tên.
module.exports = { findLanAddress, updateMobileEnv }
/* CÁCH KIỂM TRA: Không LAN vẫn chạy catalog; có LAN cập nhật ba URL; URL HTTPS cũ được giữ. */
