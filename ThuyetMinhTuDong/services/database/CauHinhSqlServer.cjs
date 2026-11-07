/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile.
 *
 * VỊ TRÍ: services/database/CauHinhSqlServer.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/ChayNangCapDatabase.cjs
 * - services/database/HoTroKiemThuDatabase.cjs
 * - services/database/KetNoiSqlServer.cjs
 *
 * PHỤ THUỘC:
 * - ../config/DocCauHinhMoiTruong.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. databaseName
 * 2. driverConfig
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { loadServerEnv } = require('../config/DocCauHinhMoiTruong.cjs')
// CHỨC NĂNG: Chỉ BE nạp cấu hình SQL; đường dẫn không phụ thuộc thư mục terminal.
loadServerEnv()

// ==================== [DATABASE] databaseName ====================
// CHỨC NĂNG: Thực hiện bước databaseName trong nhiệm vụ: Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function databaseName() {
  const name = process.env.SQL_DATABASE || 'HueGuideDemo'
  // Tên database là định danh SQL, không phải giá trị bind được; giới hạn ký tự trước khi dùng.
  if (!/^[A-Za-z][A-Za-z0-9_]{0,100}$/.test(name))
    throw Error('SQL_DATABASE chỉ nhận chữ, số và dấu gạch dưới.')
  return name
}

// ==================== [DATABASE] driverConfig ====================
// CHỨC NĂNG: Thực hiện bước driverConfig trong nhiệm vụ: Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function driverConfig(database = databaseName()) {
  const windows = (process.env.SQL_AUTH || 'windows') === 'windows'
  const sql = require(windows ? 'mssql/msnodesqlv8' : 'mssql')
  const server = process.env.SQL_SERVER || 'localhost'
  const config = {
    server,
    database,
    connectionTimeout: 10000,
    requestTimeout: 30000,
    // Driver ODBC dùng worker của Node. Giữ pool dưới 4 để các request đang
    // chờ khóa SQL không chiếm hết worker và chặn request chủ khóa commit.
    pool: { min: 0, max: windows ? 3 : 5, idleTimeoutMillis: 30000 },
    options: {
      encrypt: process.env.SQL_ENCRYPT === 'true',
      trustServerCertificate: process.env.SQL_TRUST_CERT !== 'false',
    },
  }
  if (windows) {
    // Dùng tài khoản Windows đang chạy Node; không cần lưu mật khẩu trong dự án.
    const driver = process.env.SQL_ODBC_DRIVER || 'ODBC Driver 17 for SQL Server'
    const escape = (value) => '{' + value.replaceAll('}', '}}') + '}'
    config.connectionString = `Driver=${escape(driver)};Server=${escape(server)};Database=${escape(database)};Trusted_Connection=Yes;Encrypt=${config.options.encrypt ? 'Yes' : 'No'};TrustServerCertificate=${config.options.trustServerCertificate ? 'Yes' : 'No'};`
  } else {
    config.user = process.env.SQL_USER
    config.password = process.env.SQL_PASSWORD
    if (!config.user || !config.password)
      throw Error('Thiếu SQL_USER hoặc SQL_PASSWORD cho SQL Authentication.')
    if (process.env.SQL_PORT) config.port = Number(process.env.SQL_PORT)
  }
  return { sql, config }
}
module.exports = { databaseName, driverConfig }
