/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Quản lý pool kết nối SQL Server và database kiểm thử riêng.
 *
 * VỊ TRÍ: services/database/KetNoiSqlServer.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/KiemThuApiDiTich.test.cjs
 * - services/database/ChuyenSangMuoiMotBang.cjs
 * - services/database/HoTroKiemThuDatabase.cjs
 * - services/database/KhoDuLieuSql.cjs
 * - services/database/KiemThuRangBuocDatabase.test.cjs
 * - services/database/KiemThuTepTaiNguyen.test.cjs
 * - services/database/LuuVaDocTepSql.cjs
 * - services/database/NhapDuLieuKhoiTao.cjs
 * - services/presence/KiemThuPhienHoatDong.test.cjs
 *
 * PHỤ THUỘC:
 * - node:fs
 * - node:path
 * - node:crypto
 * - ./CauHinhSqlServer.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. scopeDatabase
 * 2. installSchema
 * 3. connect
 * 4. close
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const fs = require('node:fs'),
  path = require('node:path'),
  crypto = require('node:crypto')
const { driverConfig, databaseName } = require('./CauHinhSqlServer.cjs')
const pools = new Map()
// ==================== [DATABASE] scopeDatabase ====================
// CHỨC NĂNG: Thực hiện bước scopeDatabase trong nhiệm vụ: Quản lý pool kết nối SQL Server và database kiểm thử riêng.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] scopeDatabase ====================
// CHỨC NĂNG: Chọn tên database ứng dụng hoặc database kiểm thử.
// XỬ LÝ: Giữ main cho ứng dụng; scope test phải đúng định dạng rồi mới tạo tên kiểm thử.
// TẠI SAO: Kiểm thử không được ghi nhầm vào database sử dụng để báo cáo.
function scopeDatabase(scope = 'main') {
  if (scope === 'main') return databaseName()
  if (!/^test_[a-f0-9-]{36}$/.test(scope)) throw Error('invalid_test_scope')
  return 'HueGuideTest11_' + crypto.createHash('sha256').update(scope).digest('hex').slice(0, 20)
}
// ==================== [DATABASE] installSchema ====================
// CHỨC NĂNG: Thực hiện bước installSchema trong nhiệm vụ: Quản lý pool kết nối SQL Server và database kiểm thử riêng.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] installSchema ====================
// CHỨC NĂNG: Nạp định nghĩa SQL từ file cấu trúc 11 bảng.
// XỬ LÝ: Đọc file SQL và thực hiện từng batch được phân cách bằng GO.
// TẠI SAO: GO là dấu phân cách của công cụ SQL, không thể gửi cả file như một câu lệnh thông thường.
async function installSchema(pool) {
  for (const batch of fs
    .readFileSync(path.join(__dirname, 'CauTrucMuoiMotBang.sql'), 'utf8')
    .split(/^GO\s*$/im))
    if (batch.trim()) await pool.request().batch(batch)
}
// ==================== [DATABASE] connect ====================
// CHỨC NĂNG: Thực hiện bước connect trong nhiệm vụ: Quản lý pool kết nối SQL Server và database kiểm thử riêng.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] connect ====================
// CHỨC NĂNG: Lấy hoặc tạo pool kết nối theo database.
// XỬ LÝ: Ghi nhớ promise kết nối theo tên; các nơi gọi cùng database dùng chung pool.
// TẠI SAO: Tránh mở một kết nối mới cho mọi request, đồng thời tách pool test khỏi main.
function connect(scope = 'main') {
  const name = scopeDatabase(scope)
  if (!pools.has(name))
    pools.set(
      name,
      (async () => {
        if (scope !== 'main') {
          const masterConfig = driverConfig('master'),
            master = await new masterConfig.sql.ConnectionPool(masterConfig.config).connect()
          try {
            await master.request().query(`IF DB_ID(N'${name}') IS NULL CREATE DATABASE [${name}]`)
          } finally {
            await master.close()
          }
        }
        const { sql, config } = driverConfig(name),
          pool = new sql.ConnectionPool(config)
        pool.on('error', () => {})
        await pool.connect()
        try {
          if (scope !== 'main') await installSchema(pool)
          return { sql, pool }
        } catch (error) {
          await pool.close()
          throw error
        }
      })().catch((error) => {
        pools.delete(name)
        throw error
      }),
    )
  return pools.get(name)
}
// ==================== [DATABASE] close ====================
// CHỨC NĂNG: Thực hiện bước close trong nhiệm vụ: Quản lý pool kết nối SQL Server và database kiểm thử riêng.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] close ====================
// CHỨC NĂNG: Đóng và bỏ pool của phạm vi được yêu cầu.
// XỬ LÝ: Chỉ dọn pool tương ứng thay vì đóng toàn bộ kết nối khác.
// TẠI SAO: Kiểm thử có thể dọn tài nguyên riêng mà không ngắt database ứng dụng.
async function close(scope) {
  if (typeof scope !== 'string') scope = undefined // node:test truyền TestContext vào after(close).
  const names = scope === undefined ? [...pools.keys()] : [scopeDatabase(scope)]
  for (const name of names) {
    const pending = pools.get(name)
    pools.delete(name)
    if (pending) await (await pending).pool.close()
  }
}
module.exports = { connect, close, scopeDatabase, installSchema }
