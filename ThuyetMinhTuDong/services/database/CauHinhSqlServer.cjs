/**
 * FILE: services/database/CauHinhSqlServer.cjs
 * FILE NÀY LÀM GÌ: Đọc cấu hình SQL Server ở phía API; không đưa mật khẩu database vào web/mobile.
 * VAI TRÒ: Hạ tầng lưu trữ SQL Server; hỗ trợ UC qua API.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const { loadServerEnv } = require('../config/DocCauHinhMoiTruong.cjs')
// CHỨC NĂNG: Chỉ BE nạp cấu hình SQL; đường dẫn không phụ thuộc thư mục terminal.
loadServerEnv()

function databaseName() {
  const name = process.env.SQL_DATABASE || 'HueGuideDemo'
  // Tên database là định danh SQL, không phải giá trị bind được; giới hạn ký tự trước khi dùng.
  if (!/^[A-Za-z][A-Za-z0-9_]{0,100}$/.test(name))
    throw Error('SQL_DATABASE chỉ nhận chữ, số và dấu gạch dưới.')
  return name
}

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
