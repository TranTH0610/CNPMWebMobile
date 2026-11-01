/**
 * FILE NÀY LÀM GÌ: Đọc cấu hình SQL riêng từ services/.env.local.
 * database/config.cjs gọi; chỉ chạy trong API, không import từ web/mobile.
 * TẠI SAO: Tách cấu hình bí mật khỏi các file được Vite/Expo tự nạp.
 */
const fs = require('node:fs')
const path = require('node:path')
const { parseEnv } = require('node:util')

const SQL_KEYS = new Set([
  'SQL_SERVER', 'SQL_DATABASE', 'SQL_AUTH', 'SQL_ODBC_DRIVER',
  'SQL_ENCRYPT', 'SQL_TRUST_CERT', 'SQL_USER', 'SQL_PASSWORD', 'SQL_PORT',
])

// CHỨC NĂNG: Kiểm tra toàn bộ file trước khi nạp cấu hình.
// XỬ LÝ: Chỉ nhận biến SQL được khai báo; không in giá trị khi báo lỗi.
function loadServerEnv(file = path.resolve(__dirname, '../.env.local'), target = process.env) {
  if (!fs.existsSync(file)) return
  const values = parseEnv(fs.readFileSync(file, 'utf8'))
  for (const key of Object.keys(values)) {
    if (!SQL_KEYS.has(key)) throw new Error('services/.env.local: biến không được hỗ trợ: ' + key)
  }
  // CHỨC NĂNG: Giữ ưu tiên cấu hình do terminal/CI/hosting cấp sẵn.
  // XỬ LÝ: Không ghi đè biến đã có, kể cả khi gọi loader nhiều lần.
  for (const [key, value] of Object.entries(values)) {
    if (target[key] === undefined) target[key] = value
  }
}

module.exports = { loadServerEnv }
