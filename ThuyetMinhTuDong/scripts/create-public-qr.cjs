/**
 * FILE NÀY LÀM GÌ: Tạo QR website HTTPS dùng chung cho mọi thiết bị.
 * npm run qr:create gọi; dùng qrcode đã có trong apps/web, không thêm thư viện.
 * --configure cập nhật đúng một biến URL trong .env mobile và .env.local web.
 * Liên quan UC05; file ảnh và bản sao cấu hình chỉ nằm trong .qr-output đã ignore.
 */
const { fetchQrPage } = require('./qr-http.cjs')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')

// CHỨC NĂNG: Chỉ tạo QR HTTPs website, tuyệt đối không tạo QR Expo.
// XỬ LÝ: Từ chối localhost, tài khoản, query và đường dẫn riêng của địa điểm.
function sharedEntryUrl(raw) {
  const url = new URL(raw)
  if (url.protocol !== 'https:' || url.username || url.password || url.search
    || url.hash || url.pathname !== '/' || url.hostname === 'localhost'
    || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.example')
    || url.hostname.startsWith('127.') || url.hostname === '[::1]') {
    throw new Error('QR công khai phải chứa origin HTTPS thật, không dùng exp:// hoặc localhost')
  }
  return url.origin + '/'
}

// CHỨC NĂNG: Thay đúng biến URL, giữ nguyên cấu hình khác của người dùng.
// XỬ LÝ: Bỏ dòng trùng khóa và tạo bản sao trước khi ghi file .env đã có.
function setVariable(file, key, value, backup) {
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  const lines = (previous || '').split(/\r?\n/).filter((line) => !new RegExp('^\\s*' + key + '\\s*=').test(line))
  if (previous !== null) fs.writeFileSync(backup, previous)
  fs.writeFileSync(file, lines.join('\n').trimEnd() + '\n' + key + '=' + value + '\n')
}

// CHỨC NĂNG: Không tạo ảnh QR trỏ vào website đã chết hoặc trang lỗi tunnel.
// XỬ LÝ: Timeout 10 giây, yêu cầu HTML đúng entry du khách; không bỏ kiểm tra TLS.
async function verifyWebsite(href, fetcher = fetchQrPage) {
  const response = await fetcher(href, { signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error('Website QR chưa sẵn sàng (HTTP ' + response.status + '). Chạy npm run demo:public để tạo lại link.')
  const html = await response.text()
  if (!/id=["']root["']/.test(html) || !/src=["']\/(?:assets\/[^"']+\.js|src\/main\.tsx)["']/.test(html)) {
    throw new Error('URL không trả về trang du khách hợp lệ; chưa ghi ảnh QR.')
  }
}

async function main(args) {
  const index = args.indexOf('--url')
  const href = sharedEntryUrl(index >= 0 ? args[index + 1] : '')
  await verifyWebsite(href)
  const root = path.resolve(__dirname, '..')
  const folder = path.join(root, '.qr-output')
  const webRequire = createRequire(path.join(root, 'apps/web/package.json'))
  const QRCode = webRequire('qrcode')
  fs.mkdirSync(folder, { recursive: true })

  if (args.includes('--configure')) {
    // CHỨC NĂNG: Web đọc URL QR ở runtime, không chờ Vite nạp lại .env.
    // XỬ LÝ: URL public không phải bí mật; điện thoại mở HTTPS dùng chính origin đang mở.
    fs.mkdirSync(path.join(root, 'apps/web/static'), { recursive: true })
    fs.writeFileSync(path.join(root, 'apps/web/static/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    // CHỨC NĂNG: Đồng bộ URL runtime cho preview đã build và localhost dev.
    // XỬ LÝ: Không rebuild thêm chỉ để thay origin; hai bản luôn tạo cùng QR.
    if (fs.existsSync(path.join(root, 'apps/web/dist'))) {
      fs.writeFileSync(path.join(root, 'apps/web/dist/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    }
    // CHỨC NĂNG: Danh mục du khách native đi qua cùng tunnel; API Admin vẫn giữ LAN riêng.
    const catalogEnv = path.join(root, 'apps/mobile/.env')
    const catalogUrl = fs.existsSync(catalogEnv) ? fs.readFileSync(catalogEnv, 'utf8').match(/^EXPO_PUBLIC_CATALOG_API_URL=(.*)$/m)?.[1]?.trim() : null
    if (!catalogUrl || /^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(catalogUrl) || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/catalog\/?$/.test(catalogUrl)) {
      setVariable(catalogEnv, 'EXPO_PUBLIC_CATALOG_API_URL', new URL(href).origin + '/api/catalog', path.join(folder, 'mobile-catalog-env-before-' + Date.now() + '.txt'))
    }
    const stamp = Date.now()
    setVariable(path.join(root, 'apps/web/.env.local'), 'VITE_PUBLIC_SITE_URL', new URL(href).origin,
      path.join(folder, 'web-env-before-' + stamp + '.txt'))
    setVariable(path.join(root, 'apps/mobile/.env'), 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', new URL(href).origin,
      path.join(folder, 'mobile-env-before-' + stamp + '.txt'))
    // CHỨC NĂNG: Native du khách báo phiên qua cùng tunnel, không cần mở cổng RAM công khai.
    // XỬ LÝ: Chỉ tự điền khi chưa có URL hoặc đang dùng tunnel cũ; giữ nguyên API riêng người dùng đã cấu hình.
    const mobileEnv = path.join(root, 'apps/mobile/.env')
    const presenceUrl = fs.readFileSync(mobileEnv, 'utf8').match(/^EXPO_PUBLIC_PRESENCE_API_URL=(.*)$/m)?.[1]?.trim()
    if (!presenceUrl || /^https:\/\/[^/]+\.trycloudflare\.com\/api\/presence\/?$/.test(presenceUrl)) {
      setVariable(mobileEnv, 'EXPO_PUBLIC_PRESENCE_API_URL', new URL(href).origin + '/api/presence',
        path.join(folder, 'mobile-presence-env-before-' + stamp + '.txt'))
    }
  }

  // CHỨC NĂNG: Xuất ảnh QR chứa cùng URL đang cấu hình trên mobile/web.
  // XỬ LÝ: Người nhận quét PNG bằng camera thường; không phải đăng nhập Expo.
  // CHỨC NĂNG: Gắn nguồn cổng để không đếm lượt mở website thông thường.
  const gateHref = href + '?entry=gate'
  const png = path.join(folder, 'shared-qr.png')
  await QRCode.toFile(png, gateHref, { width: 640, margin: 4, errorCorrectionLevel: 'M' })
  fs.writeFileSync(path.join(folder, 'shared-url.txt'), gateHref + '\n')
  console.log('Website:', gateHref)
  console.log('QR:', png)
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
module.exports = { sharedEntryUrl, setVariable, verifyWebsite }
