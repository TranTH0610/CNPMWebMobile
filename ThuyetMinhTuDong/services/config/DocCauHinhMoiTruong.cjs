/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * Đọc cấu hình SQL riêng từ services/.env.local.
 *
 * VỊ TRÍ: services/config/DocCauHinhMoiTruong.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/CauHinhSqlServer.cjs
 * - scripts/KiemThuCauHinhMoiTruong.test.cjs
 *
 * PHỤ THUỘC:
 * - node:fs
 * - node:path
 * - node:util
 *
 * CÁC KHỐI CHÍNH:
 * 1. loadServerEnv
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
const fs = require('node:fs')
const path = require('node:path')
const { parseEnv } = require('node:util')

const SQL_KEYS = new Set([
  'SQL_SERVER', 'SQL_DATABASE', 'SQL_AUTH', 'SQL_ODBC_DRIVER',
  'SQL_ENCRYPT', 'SQL_TRUST_CERT', 'SQL_USER', 'SQL_PASSWORD', 'SQL_PORT',
  'NARRATION_PYTHON',
])

// CHỨC NĂNG: Kiểm tra toàn bộ file trước khi nạp cấu hình.
// XỬ LÝ: Chỉ nhận biến SQL được khai báo; không in giá trị khi báo lỗi.
// ==================== [KHOI-DONG] [CAU-HINH] loadServerEnv ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
