/**
 * FILE NÀY LÀM GÌ: Tạo backup COPY_ONLY của SQL Windows để chuyển sang Docker.
 * DÙNG BỞI: ChuanBiDocker; giữ database nguồn nguyên vẹn, không chạy migration.
 */
const fs = require('node:fs')
const path = require('node:path')
const { randomUUID } = require('node:crypto')
const { ROOT, LOCAL } = require('./DocCauHinhDocker.cjs')

async function backupSource() {
  const { driverConfig } = require(path.join(ROOT, 'services/database/CauHinhSqlServer.cjs'))
  const driver = driverConfig() // Dùng cấu hình nguồn hiện có, không in mật khẩu.
  const pool = await new driver.sql.ConnectionPool(driver.config).connect()
  try {
    const info = (await pool.request().query(`SELECT DB_NAME() AS name,
      is_encrypted AS encrypted FROM sys.databases WHERE name=DB_NAME()`)).recordset[0]
    if (!info || !/^[A-Za-z][A-Za-z0-9_]{0,100}$/.test(info.name)) throw Error('Tên database nguồn không hợp lệ')
    if (info.encrypted) throw Error('Database nguồn có mã hóa; cần chuyển chứng thư trước khi restore')
    const folder = path.join(LOCAL, 'backups')
    fs.mkdirSync(folder, { recursive: true })
    const target = path.join(folder, 'HueGuideDemo.bak')
    if (fs.existsSync(target)) throw Error('Backup Docker đã tồn tại; không ghi đè')
    const partial = path.join(folder, 'HueGuideDemo.partial-' + randomUUID() + '.bak')
    // CHỨC NĂNG: SQL ghi vào thư mục backup riêng của dự án; không nới ACL thư mục hệ thống SQL.
    // TẠI SAO: Backup trong thư mục hệ thống thường không cho tài khoản chạy Node đọc file.
    await pool.request().input('file', driver.sql.NVarChar(4000), partial)
      .query(`BACKUP DATABASE [${info.name}] TO DISK=@file WITH COPY_ONLY,CHECKSUM`)
    // COPY_ONLY giữ chuỗi backup nguồn; VERIFYONLY kiểm tra trước khi cho Docker sử dụng.
    await pool.request().input('file', driver.sql.NVarChar(4000), partial)
      .query('RESTORE VERIFYONLY FROM DISK=@file WITH CHECKSUM')
    if (fs.statSync(partial).size <= 0) throw Error('Backup không có dữ liệu')
    fs.linkSync(partial, target) // Đặt tên cuối độc quyền, không ghi đè backup có sẵn.
    fs.unlinkSync(partial) // Chỉ bỏ tên file tạm của chính lần backup đã hoàn tất.
    console.log('Đã backup và kiểm tra dữ liệu nguồn; database Windows giữ nguyên.')
  } finally { await pool.close() }
}

module.exports = { backupSource }