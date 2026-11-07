/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng.
 *
 * VỊ TRÍ: services/database/HoTroKiemThuDatabase.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/KiemThuApiDiTich.test.cjs
 * - services/database/KiemThuRangBuocDatabase.test.cjs
 * - services/database/KiemThuTepTaiNguyen.test.cjs
 * - services/presence/KiemThuPhienHoatDong.test.cjs
 *
 * PHỤ THUỘC:
 * - node:crypto
 * - ./KetNoiSqlServer.cjs
 * - ./CauHinhSqlServer.cjs
 * - ./KhoDuLieuSql.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. cleanup
 * 2. testRepository
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { randomUUID } = require('node:crypto')
const { close, scopeDatabase } = require('./KetNoiSqlServer.cjs')
const { driverConfig } = require('./CauHinhSqlServer.cjs')
const { createSqlRepository } = require('./KhoDuLieuSql.cjs')
// ==================== [DATABASE] cleanup ====================
// CHỨC NĂNG: Thực hiện bước cleanup trong nhiệm vụ: Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
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
// ==================== [DATABASE] testRepository ====================
// CHỨC NĂNG: Thực hiện bước testRepository trong nhiệm vụ: Tạo và dọn môi trường database kiểm thử, tách khỏi dữ liệu ứng dụng.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function testRepository(t, options = {}) {
  const scope = 'test_' + randomUUID()
  t.after(() => cleanup(scope))
  return { scope, repository: createSqlRepository({ scope, ...options }) }
}
module.exports = { cleanup, testRepository }
