/**
 * FILE: services/database/ChayNangCapDatabase.cjs
 * FILE NÀY LÀM GÌ: Điểm chạy nâng cấp database từ lệnh npm run db:init; không chạy tự động khi chỉ đọc file.
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
const { databaseName, driverConfig } = require('./CauHinhSqlServer.cjs')
const { migrate11 } = require('./ChuyenSangMuoiMotBang.cjs')
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
