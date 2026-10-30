/**
 * FILE NÀY LÀM GÌ: Đọc cấu hình SQL Server ở phía API.
 * connection.cjs và migrate.cjs sử dụng; web/mobile không import file này.
 * TẠI SAO: Không đưa tài khoản database vào bundle Expo hoặc Vite.
 */
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../..')
const envFile = path.join(root, '.env.sqlserver')
// CHỨC NĂNG: Chỉ đọc cấu hình riêng của server nếu máy có file này.
if (fs.existsSync(envFile)) process.loadEnvFile(envFile)

function databaseName() {
  const name = process.env.SQL_DATABASE || 'HueGuideDemo'
  // Tên database là định danh SQL, không phải giá trị bind được; giới hạn ký tự trước khi dùng.
  if (!/^[A-Za-z][A-Za-z0-9_]{0,100}$/.test(name)) throw Error('SQL_DATABASE chỉ nhận chữ, số và dấu gạch dưới.')
  return name
}

function driverConfig(database = databaseName()) {
  const windows = (process.env.SQL_AUTH || 'windows') === 'windows'
  const sql = require(windows ? 'mssql/msnodesqlv8' : 'mssql')
  const server = process.env.SQL_SERVER || 'localhost'
  const config = {
    server, database, connectionTimeout: 10000, requestTimeout: 30000,
    // Driver ODBC dùng worker của Node. Giữ pool dưới 4 để các request đang
    // chờ khóa SQL không chiếm hết worker và chặn request chủ khóa commit.
    pool: { min: 0, max: windows ? 3 : 5, idleTimeoutMillis: 30000 },
    options: { encrypt: process.env.SQL_ENCRYPT === 'true', trustServerCertificate: process.env.SQL_TRUST_CERT !== 'false' },
  }
  if (windows) {
    // Dùng tài khoản Windows đang chạy Node; không cần lưu mật khẩu trong dự án.
    const driver = process.env.SQL_ODBC_DRIVER || 'ODBC Driver 17 for SQL Server'
    const escape = value => '{' + value.replaceAll('}', '}}') + '}'
    config.connectionString = `Driver=${escape(driver)};Server=${escape(server)};Database=${escape(database)};Trusted_Connection=Yes;Encrypt=${config.options.encrypt ? 'Yes' : 'No'};TrustServerCertificate=${config.options.trustServerCertificate ? 'Yes' : 'No'};`
  } else {
    config.user = process.env.SQL_USER
    config.password = process.env.SQL_PASSWORD
    if (!config.user || !config.password) throw Error('Thiếu SQL_USER hoặc SQL_PASSWORD cho SQL Authentication.')
    if (process.env.SQL_PORT) config.port = Number(process.env.SQL_PORT)
  }
  return { sql, config }
}
module.exports = { databaseName, driverConfig }
