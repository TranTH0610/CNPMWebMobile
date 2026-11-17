/**
 * FILE: services/database/HoTroKiemThuDatabase.cjs
 * FILE NÀY LÀM GÌ: Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng.
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
const { randomUUID } = require('node:crypto')
const { close, scopeDatabase } = require('./KetNoiSqlServer.cjs')
const { driverConfig } = require('./CauHinhSqlServer.cjs')
const { createSqlRepository } = require('./KhoDuLieuSql.cjs')
async function cleanup(scope) {
  if (!/^test_[a-f0-9-]{36}$/.test(scope)) throw Error('Không được cleanup dữ liệu ứng dụng.')
  const name = scopeDatabase(scope)
  if (!/^HueGuideTest11_[a-f0-9]{20}$/.test(name)) throw Error('Tên database test không hợp lệ.')
  await close(scope)
  const { sql, config } = driverConfig('master'),
    pool = await new sql.ConnectionPool(config).connect()
  try {
    await pool
      .request()
      .query(
        `IF DB_ID(N'${name}') IS NOT NULL BEGIN ALTER DATABASE [${name}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;DROP DATABASE [${name}];END`,
      )
  } finally {
    await pool.close()
  }
}
function testRepository(t, options = {}) {
  const scope = 'test_' + randomUUID()
  t.after(() => cleanup(scope))
  return { scope, repository: createSqlRepository({ scope, ...options }) }
}
module.exports = { cleanup, testRepository }
