/**
 * FILE NÀY LÀM GÌ: Tạo QR website HTTPS dùng chung cho mọi thiết bị.
 * npm run qr:create gọi; dùng qrcode đã có trong apps/web, không thêm thư viện.
 * --configure cập nhật đúng một biến URL trong .env mobile và .env.local web.
 * Liên quan UC05; file ảnh và bản sao cấu hình chỉ nằm trong .qr-output đã ignore.
 */
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

async function main(args) {
  const index = args.indexOf('--url')
  const href = sharedEntryUrl(index >= 0 ? args[index + 1] : '')
  const root = path.resolve(__dirname, '..')
  const folder = path.join(root, '.qr-output')
  const webRequire = createRequire(path.join(root, 'apps/web/package.json'))
  const QRCode = webRequire('qrcode')
  fs.mkdirSync(folder, { recursive: true })

  if (args.includes('--configure')) {
    const stamp = Date.now()
    setVariable(path.join(root, 'apps/web/.env.local'), 'VITE_PUBLIC_SITE_URL', new URL(href).origin,
      path.join(folder, 'web-env-before-' + stamp + '.txt'))
    setVariable(path.join(root, 'apps/mobile/.env'), 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', new URL(href).origin,
      path.join(folder, 'mobile-env-before-' + stamp + '.txt'))
  }

  // CHỨC NĂNG: Xuất ảnh QR chứa cùng URL đang cấu hình trên mobile/web.
  // XỬ LÝ: Người nhận quét PNG bằng camera thường; không phải đăng nhập Expo.
  const png = path.join(folder, 'shared-qr.png')
  await QRCode.toFile(png, href, { width: 640, margin: 4, errorCorrectionLevel: 'M' })
  fs.writeFileSync(path.join(folder, 'shared-url.txt'), href + '\n')
  console.log('Website:', href)
  console.log('QR:', png)
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
module.exports = { sharedEntryUrl, setVariable }
