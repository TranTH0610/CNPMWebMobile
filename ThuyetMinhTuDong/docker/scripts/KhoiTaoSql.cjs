/**
 * FILE NÀY LÀM GÌ: Phục hồi backup vào SQL Docker mới và cấp tài khoản API giới hạn trong database.
 * DÙNG BỞI: database-init. Không ghi đè database đã tồn tại, không thêm/bớt bảng nghiệp vụ.
 */
const fs = require('node:fs')
const sql = require('mssql')
const { readSecret } = require('./DocCauHinhDocker.cjs')

// CHỨC NĂNG: Các định danh SQL phải được kiểm tra trước khi dùng trong câu lệnh quản trị.
function identifier(value) {
  if (!/^[A-Za-z][A-Za-z0-9_]{0,100}$/.test(value)) throw Error('Định danh SQL không hợp lệ')
  return '[' + value + ']'
}
const literal = value => "N'" + String(value).replaceAll("'", "''") + "'" // Escape tên logic từ backup.

async function initialize() {
  const database = process.env.SQL_DATABASE || 'HueGuideDemo'
  const user = process.env.SQL_USER || 'hueguide_app'
  const dbName = identifier(database), loginName = identifier(user)
  const appPassword = readSecret('sql_app_password')
  const config = { server: process.env.SQL_SERVER || 'sqlserver', port: 1433, user: 'sa',
    password: readSecret('sql_admin_password'), database: 'master',
    options: { encrypt: true, trustServerCertificate: true }, requestTimeout: 180000 }
  const pool = await new sql.ConnectionPool(config).connect()
  try {
    const exists = (await pool.request().input('database', sql.NVarChar, database)
      .query('SELECT DB_ID(@database) AS id')).recordset[0].id
    if (!exists) {
      const backup = '/backups/HueGuideDemo.bak'
      if (!fs.existsSync(backup)) throw Error('Thiếu backup thật; không tự tạo database mẫu để thay thế')
      await pool.request().query('RESTORE VERIFYONLY FROM DISK=' + literal(backup) + ' WITH CHECKSUM')
      const files = (await pool.request().query('RESTORE FILELISTONLY FROM DISK=' + literal(backup))).recordset
      if (!files.length || files.some(file => !['D', 'L'].includes(file.Type))) throw Error('Backup có loại tệp chưa hỗ trợ; cần kiểm tra trước khi restore')
      // CHỨC NĂNG: Đổi đường dẫn MDF/LDF Windows thành đường dẫn Linux, giữ tên logic trong backup.
      const moves = files.map((file, index) => 'MOVE ' + literal(file.LogicalName) + ' TO ' +
        literal('/var/opt/mssql/data/' + database + '_' + index + (file.Type === 'L' ? '.ldf' : '.mdf')))
      await pool.request().query('RESTORE DATABASE ' + dbName + ' FROM DISK=' + literal(backup) + ' WITH ' + moves.join(',') + ',CHECKSUM')
      console.log('Đã phục hồi database vào volume Docker mới.')
    } else console.log('Database Docker đã tồn tại: giữ nguyên, không restore đè.')

    // CHỨC NĂNG: Chặn dùng nhầm backup trước khi API bắt đầu đọc/ghi.
    const tables = (await pool.request().query('SELECT name FROM ' + dbName + '.sys.tables WHERE is_ms_shipped=0')).recordset.map(row => row.name)
    const required = ['DiTich','BanDiTich','NoiDungDiTich','NgonNgu','HinhAnhDiTich','TepTaiNguyen','BanThuThuyetMinh','NguonThamKhao','LichSuKiemDuyet','LuotTruyCapQR','PhienHoatDong']
    if (required.some(table => !tables.includes(table))) throw Error('Backup chưa đủ 11 bảng đã chốt')
    // Giữ cả bảng sysdiagrams nếu backup có; không xóa sơ đồ SSMS của người dùng.
    await pool.request().query(`IF SUSER_ID(${literal(user)}) IS NULL CREATE LOGIN ${loginName}
      WITH PASSWORD=${literal(appPassword)}, CHECK_POLICY=ON`)
    // API chỉ có quyền đọc/ghi/sequence trong database này; không có quyền sa hoặc tạo database.
    await pool.request().query(`USE ${dbName};
      IF USER_ID(${literal(user)}) IS NULL CREATE USER ${loginName} FOR LOGIN ${loginName};
      ELSE ALTER USER ${loginName} WITH LOGIN=${loginName};
      GRANT SELECT,INSERT,UPDATE,DELETE,EXECUTE ON SCHEMA::dbo TO ${loginName};
      GRANT VIEW DEFINITION TO ${loginName};`)
    console.log('Đã kiểm tra 11 bảng nghiệp vụ và cấu hình tài khoản API riêng.')
  } finally { await pool.close() }
}

if (require.main === module) initialize().catch(error => {
  // TẠI SAO: Một số lỗi quản trị SQL có thể chứa câu lệnh có mật khẩu; không in raw message.
  console.error('Khởi tạo SQL Docker chưa hoàn tất. Mã lỗi:', error.number || error.code || 'initialization_failed')
  process.exitCode = 1
})
module.exports = { identifier, literal, initialize }
