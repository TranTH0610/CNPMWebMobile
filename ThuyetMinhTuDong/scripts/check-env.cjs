/**
 * FILE NÀY LÀM GÌ: Kiểm tra cách đặt file .env trước khi commit/build.
 * npm run env:check gọi; không in giá trị bí mật và không sửa file.
 * TẠI SAO: Phát hiện cấu hình riêng bị Git theo dõi hoặc biến BE đặt nhầm ở FE.
 */
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { parseEnv } = require('node:util')
const root = path.resolve(__dirname, '..')
const locations = ['', 'services', 'apps/web', 'apps/mobile']
const issues = []
const identity = new Set(['ANDROID_APPLICATION_ID', 'ANDROID_SHA256_CERT_FINGERPRINTS', 'IOS_BUNDLE_IDENTIFIER', 'APPLE_TEAM_ID'])
const secretName = /(?:^|_)(?:SQL|DATABASE|DB|PASSWORD|SECRET|PRIVATE|TOKEN|CREDENTIAL|CONNECTION_STRING)(?:_|$)/i

// CHỨC NĂNG: Kiểm tra namespace và tên biến mà không in giá trị.
function validateEntries(relative, values) {
  const prefix = relative.startsWith('apps/web/') ? 'VITE_' : relative.startsWith('apps/mobile/') ? 'EXPO_PUBLIC_' : null
  if (!prefix) return []
  const errors = []
  for (const key of Object.keys(values)) {
    if ((!key.startsWith(prefix) && !identity.has(key)) || secretName.test(key)) {
      errors.push(relative + ': biến không phù hợp cho FE: ' + key)
    }
  }
  return errors
}

function main() {
  for (const folder of locations) {
    for (const name of fs.readdirSync(path.join(root, folder))) {
      if (name !== '.env' && !name.startsWith('.env.')) continue
      const relative = path.posix.join(folder, name)
      if (!fs.statSync(path.join(root, relative)).isFile()) continue
      const sample = name.endsWith('.example')
      if (!sample && relative !== 'services/.env.local' && relative !== 'apps/web/.env.local' && relative !== 'apps/mobile/.env.local') {
        issues.push(relative + ': file cấu hình ngoài vị trí thống nhất')
      }
      // Chỉ parse nội dung trong bộ nhớ; không log values.
      const values = parseEnv(fs.readFileSync(path.join(root, relative), 'utf8'))
      issues.push(...validateEntries(relative, values))
    }
  }
  // CHỨC NĂNG: .gitignore không đủ nếu file đã được commit trước đây.
  // XỬ LÝ: Dùng danh sách Git index, không đọc lịch sử hoặc nội dung bí mật.
  try {
    const tracked = execFileSync('git', ['ls-files', '-z', '--full-name'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    for (const file of tracked.split('\0').filter(Boolean)) {
      const name = path.posix.basename(file)
      if ((name === '.env' || name.startsWith('.env.')) && !name.endsWith('.example')) {
        issues.push('Git đang theo dõi file cấu hình riêng: ' + file)
      }
    }
  } catch {
    issues.push('Không kiểm tra được Git index; cần chạy trong repository có Git.')
  }
  if (issues.length) {
    for (const issue of issues) console.error(issue)
    process.exitCode = 1
  } else console.log('Cấu hình đúng vị trí; không thấy file .env thật trong Git index hoặc tên biến bí mật ở FE.')
}

if (require.main === module) main()
module.exports = { validateEntries }
