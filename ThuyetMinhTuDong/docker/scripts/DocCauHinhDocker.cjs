/**
 * FILE NÀY LÀM GÌ: Đọc cổng Docker và secret; không in mật khẩu vào log.
 * DÙNG BỞI: Các script Docker; phụ thuộc fs/path/util của Node, không phụ thuộc UI.
 * TẠI SAO: Một đầu mối kiểm tra cấu hình giúp lệnh chạy, test và mobile dùng cùng cổng.
 */
const fs = require('node:fs')
const path = require('node:path')
const { parseEnv } = require('node:util')

const ROOT = path.resolve(__dirname, '../..') // Thư mục có package.json của monorepo.
const LOCAL = path.join(ROOT, '.docker') // Chỉ chứa secret/backup cục bộ, được bỏ khỏi Git/image.

function dockerSettings(environment = process.env) {
  // CHỨC NĂNG: Đọc file tùy chọn, nhưng vẫn ưu tiên biến được truyền từ terminal.
  const file = path.join(ROOT, '.env.docker.local')
  const values = fs.existsSync(file) ? parseEnv(fs.readFileSync(file, 'utf8')) : {}
  const settings = { ...values, ...environment }
  const defaults = { SQL_PORT: 14330, VISITOR_PORT: 18080, ADMIN_PORT: 18081, CATALOG_PORT: 18888, PRESENCE_PORT: 18887 }
  const ports = {}
  for (const [key, fallback] of Object.entries(defaults)) {
    const value = Number(settings['DOCKER_' + key] || fallback)
    // XỬ LÝ: Không đưa chuỗi/cổng không hợp lệ vào Compose hoặc URL.
    if (!Number.isInteger(value) || value < 1 || value > 65535) throw Error('Cổng Docker không hợp lệ: ' + key)
    ports[key] = value
  }
  return { values, ports, database: settings.DOCKER_SQL_DATABASE || 'HueGuideDemo', user: settings.DOCKER_SQL_USER || 'hueguide_app' }
}

function readSecret(name, folder = '/run/secrets') {
  // CHỨC NĂNG: Chỉ đọc đúng secret được khai báo, không nhận đường dẫn tùy ý.
  if (!['sql_admin_password', 'sql_app_password'].includes(name)) throw Error('Secret không hợp lệ')
  const value = fs.readFileSync(path.join(folder, name), 'utf8').trim()
  if (value.length < 16) throw Error('Secret SQL thiếu hoặc quá ngắn')
  return value
}

module.exports = { ROOT, LOCAL, dockerSettings, readSecret }
