/**
 * CHỨC NĂNG: [TRUY-CAP-QR]
 * VAI TRÒ: CÔNG CỤ CHẠY DỰ ÁN
 *
 * FILE NÀY LÀM GÌ:
 * Tạo QR HTTPS dùng chung sau khi xác nhận website đúng ứng dụng và truy cập được.
 *
 * VỊ TRÍ: scripts/TaoMaQRCongKhai.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - scripts/KiemThuQRCongKhai.test.cjs
 *
 * PHỤ THUỘC:
 * - ./KetNoiHttpsQR.cjs
 * - node:fs
 * - ./KiemTraWebsiteSanSang.cjs
 * - node:path
 * - node:module
 *
 * CÁC KHỐI CHÍNH:
 * 1. sharedEntryUrl
 * 2. setVariable
 * 3. verifyWebsite
 * 4. main
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Khai báo { fetchQrPage }: require nạp module './KetNoiHttpsQR.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { fetchQrPage } = require('./KetNoiHttpsQR.cjs')
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
const { visitorDataReady } = require('./KiemTraWebsiteSanSang.cjs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')

// CHỨC NĂNG: Chỉ tạo QR HTTPs website, tuyệt đối không tạo QR Expo.
// XỬ LÝ: Từ chối localhost, tài khoản, query và đường dẫn riêng của địa điểm.
// Khai báo sharedEntryUrl(raw). Nhận đầu vào qua tham số.
// ==================== [TRUY-CAP-QR] sharedEntryUrl ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function sharedEntryUrl(raw) {
  // Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
  const url = new URL(raw)
  
  if (url.protocol !== 'https:' || url.username || url.password || url.search
    || url.hash || url.pathname !== '/' || url.hostname === 'localhost'
    || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.example')
    || url.hostname.startsWith('127.') || url.hostname === '[::1]') {
    
    throw new Error('QR công khai phải chứa origin HTTPS thật, không dùng exp:// hoặc localhost')
  }
  
  return url.origin + '/'
}
// TẠI SAO (sharedEntryUrl): Một QR website chung mở được bằng trình duyệt và có dấu nhận diện
// lượt vào cổng.

// CHỨC NĂNG: Thay đúng biến URL, giữ nguyên cấu hình khác của người dùng.
// XỬ LÝ: Bỏ dòng trùng khóa và tạo bản sao trước khi ghi file .env đã có.
// Khai báo setVariable(file, key, value, backup). Nhận đầu vào qua tham số.
// ==================== [TRUY-CAP-QR] setVariable ====================
function setVariable(file, key, value, backup) {
  // Khai báo previous: chọn giữa hai giá trị theo điều kiện fs.existsSync(file).
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  // Khai báo lines: (previous || '').split(/\r?\n/).filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const lines = (previous || '').split(/\r?\n/).filter((line) => !new RegExp('^\\s*' + key + '\\s*=').test(line))
  // Rẽ nhánh nếu previous !== null. | Thực hiện Gọi fs.writeFileSync(backup, previous).
  if (previous !== null) fs.writeFileSync(backup, previous)
  
  fs.writeFileSync(file, lines.join('\n').trimEnd() + '\n' + key + '=' + value + '\n')
}
// TẠI SAO (setVariable): Đổi URL demo không được làm mất các biến cấu hình không liên quan.

// CHỨC NĂNG: Không tạo ảnh QR trỏ vào website đã chết hoặc trang lỗi tunnel.
// XỬ LÝ: Timeout 10 giây, yêu cầu HTML đúng entry du khách; không bỏ kiểm tra TLS.
// Khai báo verifyWebsite(href, fetcher). Nhận đầu vào qua tham số.
// ==================== [TRUY-CAP-QR] verifyWebsite ====================
async function verifyWebsite(href, fetcher = fetchQrPage) {
  // CHỨC NĂNG: Tunnel mới có thể chưa ổn định ở lần kết nối đầu.
  // XỬ LÝ: Chỉ thử lại lỗi kết nối tối đa ba lần; mỗi lần có timeout riêng.
  // HTTP lỗi hoặc HTML sai vẫn bị từ chối, không bỏ qua kiểm tra HTTPS.
  // Khai báo response: không có giá trị khởi tạo.
  let response
  // Lặp theo điều kiện của `for (let attempt = 0.
  for (let attempt = 0; attempt < 3; attempt++) {
    
    try { response = await fetcher(href, { signal: AbortSignal.timeout(10000) }); break }
    catch (error) {
      // Rẽ nhánh nếu attempt === 2. | Ném new Error('Không xác minh được HTTPS: ' + (error.cause?.code || error.message)).
      if (attempt === 2) throw new Error('Không xác minh được HTTPS: ' + (error.cause?.code || error.message))
      
      await new Promise(resolve => setTimeout(resolve, 750))
    }
  }
  // Rẽ nhánh nếu !response.ok. | Ném new Error('Website QR chưa sẵn sàng (HTTP ' + response.status + '). Chạy npm run demo:public để tạo lại link.'.
  if (!response.ok) throw new Error('Website QR chưa sẵn sàng (HTTP ' + response.status + '). Chạy npm run demo:public để tạo lại link.')
  // Khai báo html: await chờ Gọi response.text().
  const html = await response.text()
  // Rẽ nhánh nếu !/id=["']root["']/.test(html) || !/src=["']\/(?:assets\/[^"']+\.js|src\/main\.tsx)["']/.test(html).
  if (!/id=["']root["']/.test(html) || !/src=["']\/(?:assets\/[^"']+\.js|src\/main\.tsx)["']/.test(html)) {
    
    throw new Error('URL không trả về trang du khách hợp lệ; chưa ghi ảnh QR.')
  }
}
// TẠI SAO (verifyWebsite): Có URL tunnel chưa chắc website hoạt động; xác minh trước để không
// xuất QR dẫn đến trang lỗi.

// Khai báo main(args). Nhận đầu vào qua tham số.
// ==================== [TRUY-CAP-QR] main ====================
// CHỨC NĂNG: Thực hiện bước main trong nhiệm vụ: Tạo QR HTTPS dùng chung sau khi xác nhận website đúng ứng dụng và truy cập được.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
async function main(args) {
  // Khai báo index: Gọi args.indexOf('--url').
  const index = args.indexOf('--url')
  // Khai báo href: Gọi sharedEntryUrl(index >= 0 ? args[index + 1] : '').
  const href = sharedEntryUrl(index >= 0 ? args[index + 1] : '')
  // Thực hiện await chờ Gọi verifyWebsite(href).
  await verifyWebsite(href)
  if (!await visitorDataReady(new URL(href).origin)) throw new Error('Danh sách hoặc ảnh SQL chưa sẵn sàng qua HTTPS; chưa tạo QR mới.')
  // Khai báo root: Gọi path.resolve(__dirname, '..').
  const root = path.resolve(__dirname, '..')
  // Khai báo folder: Gọi path.join(root, '.qr-output').
  const folder = path.join(root, '.qr-output')
  // Khai báo webRequire: Gọi createRequire(path.join(root, 'apps/web/package.json')).
  const webRequire = createRequire(path.join(root, 'apps/web/package.json'))
  // Khai báo QRCode: Gọi webRequire('qrcode').
  const QRCode = webRequire('qrcode')
  // Thực hiện Gọi fs.mkdirSync(folder, { recursive: true }). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  fs.mkdirSync(folder, { recursive: true })

  // Rẽ nhánh nếu args.includes('--configure').
  if (args.includes('--configure')) {
    // CHỨC NĂNG: Web đọc URL QR ở runtime, không chờ Vite nạp lại .env.
    // XỬ LÝ: URL public không phải bí mật; điện thoại mở HTTPS dùng chính origin đang mở.
    // Thực hiện Gọi fs.mkdirSync(path.join(root, 'apps/web/static'), { recursive: true }). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    fs.mkdirSync(path.join(root, 'apps/web/static'), { recursive: true })
    // Thực hiện Gọi fs.writeFileSync(path.join(root, 'apps/web/static/visitor-config.json'), JSON.stringify({. | Gán thuộc tính publicSiteOrigin: đọc new URL(href).origin từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    fs.writeFileSync(path.join(root, 'apps/web/static/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    // CHỨC NĂNG: Đồng bộ URL runtime cho preview đã build và localhost dev.
    // XỬ LÝ: Không rebuild thêm chỉ để thay origin; hai bản luôn tạo cùng QR.
    // Rẽ nhánh nếu fs.existsSync(path.join(root, 'apps/web/dist')).
    if (fs.existsSync(path.join(root, 'apps/web/dist'))) {
      
      fs.writeFileSync(path.join(root, 'apps/web/dist/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    }
    // CHỨC NĂNG: Danh mục du khách native đi qua cùng tunnel; API Admin vẫn giữ LAN riêng.
    // Khai báo catalogEnv: Gọi path.join(root, 'apps/mobile/.env.local').
    const catalogEnv = path.join(root, 'apps/mobile/.env.local')
    // Khai báo catalogUrl: chọn giữa hai giá trị theo điều kiện fs.existsSync(catalogEnv).
    const catalogUrl = fs.existsSync(catalogEnv) ? fs.readFileSync(catalogEnv, 'utf8').match(/^EXPO_PUBLIC_CATALOG_API_URL=(.*)$/m)?.[1]?.trim() : null
    // Rẽ nhánh nếu !catalogUrl || /^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(catalogUrl) || /^https:\/\/[^/]+\.tryc.
    if (!catalogUrl || /^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(catalogUrl) || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/catalog\/?$/.test(catalogUrl)) {
      
      setVariable(catalogEnv, 'EXPO_PUBLIC_CATALOG_API_URL', new URL(href).origin + '/api/catalog', path.join(folder, 'mobile-catalog-env-before-' + Date.now() + '.txt'))
    }
    // Khai báo stamp: Date.now() lấy thời gian hiện tại theo mili giây để so sánh tuổi dữ liệu hoặc tạo dấu thời gian.
    const stamp = Date.now()
    
    setVariable(path.join(root, 'apps/web/.env.local'), 'VITE_PUBLIC_SITE_URL', new URL(href).origin,
      path.join(folder, 'web-env-before-' + stamp + '.txt'))
    
    setVariable(path.join(root, 'apps/mobile/.env.local'), 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', new URL(href).origin,
      path.join(folder, 'mobile-env-before-' + stamp + '.txt'))
    // CHỨC NĂNG: Native du khách báo phiên qua cùng tunnel, không cần mở cổng RAM công khai.
    // XỬ LÝ: Chỉ tự điền khi chưa có URL hoặc đang dùng tunnel cũ; giữ nguyên API riêng người dùng đã cấu hình.
    // Khai báo mobileEnv: Gọi path.join(root, 'apps/mobile/.env.local').
    const mobileEnv = path.join(root, 'apps/mobile/.env.local')
    // Khai báo presenceUrl: fs.readFileSync(mobileEnv, 'utf8').match(/^EXPO_PUBLIC_PRESENCE_API_URL=(.*)$/m)?.[1]?.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
    const presenceUrl = fs.readFileSync(mobileEnv, 'utf8').match(/^EXPO_PUBLIC_PRESENCE_API_URL=(.*)$/m)?.[1]?.trim()
    // Rẽ nhánh nếu !presenceUrl || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/presence\/?$/.test(presenceUrl).
    if (!presenceUrl || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/presence\/?$/.test(presenceUrl)) {
      
      setVariable(mobileEnv, 'EXPO_PUBLIC_PRESENCE_API_URL', new URL(href).origin + '/api/presence',
        path.join(folder, 'mobile-presence-env-before-' + stamp + '.txt'))
    }
  }

  // CHỨC NĂNG: Xuất ảnh QR chứa cùng URL đang cấu hình trên mobile/web.
  // XỬ LÝ: Người nhận quét PNG bằng camera thường; không phải đăng nhập Expo.
  // CHỨC NĂNG: Gắn nguồn cổng để không đếm lượt mở website thông thường.
  // Khai báo gateHref: tính biểu thức href + '?entry=gate'.
  const gateHref = href + '?entry=gate'
  // Khai báo png: Gọi path.join(folder, 'shared-qr.png').
  const png = path.join(folder, 'shared-qr.png')
  // Thực hiện await chờ Gọi QRCode.toFile(png, gateHref, { width: 640, margin: 4, errorCorrectionLevel: 'M' }). | Gán thuộc tính width: giá trị số 640. | Gán thuộc tính margin: giá trị số 4. | Gán thuộc tính errorCorrectionLevel: chuỗi 'M'.
  await QRCode.toFile(png, gateHref, { width: 640, margin: 4, errorCorrectionLevel: 'M' })
  // Thực hiện Gọi fs.writeFileSync(path.join(folder, 'shared-url.txt'), gateHref + '\n').
  fs.writeFileSync(path.join(folder, 'shared-url.txt'), gateHref + '\n')
  // Thực hiện Gọi console.log('Website:', gateHref).
  console.log('Website:', gateHref)
  
  console.log('QR:', png)
}
// TẠI SAO (main): Một điểm vào giữ thứ tự các bước chạy công cụ và xử lý lỗi nhất quán.

// Rẽ nhánh nếu require.main === module.
if (require.main === module) {
  // Thực hiện Gọi main(process.argv.slice(2)).catch((error) => { console.error(error.message) process.exitCo.
  main(process.argv.slice(2)).catch((error) => {
    // Thực hiện Gọi console.error(error.message).
    console.error(error.message)
    
    process.exitCode = 1
  })
}
// Thực hiện tính biểu thức module.exports = { sharedEntryUrl, setVariable, verifyWebsite }. | Đặt trường sharedEntryUrl bằng giá trị của biến cùng tên. | Đặt trường setVariable bằng giá trị của biến cùng tên. | Đặt trường verifyWebsite bằng giá trị của biến cùng tên.
module.exports = { sharedEntryUrl, setVariable, verifyWebsite }
