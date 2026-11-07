/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file.
 *
 * VỊ TRÍ: services/database/ChayNangCapDatabase.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - ./CauHinhSqlServer.cjs
 * - ./ChuyenSangMuoiMotBang.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. migrate
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { databaseName, driverConfig } = require('./CauHinhSqlServer.cjs')
const { migrate11 } = require('./ChuyenSangMuoiMotBang.cjs')
// ==================== [DATABASE] migrate ====================
// CHỨC NĂNG: Thực hiện bước migrate trong nhiệm vụ: Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
async function migrate() {
  const name = databaseName(),
    m = driverConfig('master'),
    master = await new m.sql.ConnectionPool(m.config).connect()
  try {
    await master.request().query(`IF DB_ID(N'${name}') IS NULL CREATE DATABASE [${name}]`)
  } finally {
    await master.close()
  }
  const d = driverConfig(name),
    pool = await new d.sql.ConnectionPool(d.config).connect()
  try {
    const old = (await pool.request().query("SELECT OBJECT_ID(N'dbo.Places',N'U') AS id"))
      .recordset[0].id
    if (old)
      throw Error(
        'Schema cũ còn dữ liệu: dùng quy trình backup + kiểm thử migration11 trước khi chuyển, không tự đổi khi chạy dev.',
      )
    console.log(await migrate11(pool, d.sql))
  } finally {
    await pool.close()
  }
}
if (require.main === module)
  migrate().catch((error) => {
    console.error('Khởi tạo chưa hoàn tất:', error.message)
    process.exitCode = 1
  })
module.exports = { migrate }
