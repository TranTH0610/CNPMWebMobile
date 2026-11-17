/**
 * FILE: services/database/KetNoiSqlServer.cjs
 * FILE NÀY LÀM GÌ: Quản lý pool kết nối SQL Server và database kiểm thử riêng.
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
const fs = require('node:fs'),
  path = require('node:path'),
  crypto = require('node:crypto')
const { driverConfig, databaseName } = require('./CauHinhSqlServer.cjs')
const pools = new Map()
// CHỨC NĂNG: Chọn tên database ứng dụng hoặc database kiểm thử.
// XỬ LÝ: Giữ main cho ứng dụng; scope test phải đúng định dạng rồi mới tạo tên kiểm thử.
// TẠI SAO: Kiểm thử không được ghi nhầm vào database sử dụng để báo cáo.
// [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] scopeDatabase — Chọn tên database ứng dụng hoặc database kiểm thử.
function scopeDatabase(scope = 'main') {
  if (scope === 'main') return databaseName()
  if (!/^test_[a-f0-9-]{36}$/.test(scope)) throw Error('invalid_test_scope')
  return 'HueGuideTest11_' + crypto.createHash('sha256').update(scope).digest('hex').slice(0, 20)
}
// CHỨC NĂNG: Nạp định nghĩa SQL từ file cấu trúc 11 bảng.
// XỬ LÝ: Đọc file SQL và thực hiện từng batch được phân cách bằng GO.
// TẠI SAO: GO là dấu phân cách của công cụ SQL, không thể gửi cả file như một câu lệnh thông thường.
// [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] installSchema — Nạp định nghĩa SQL từ file cấu trúc 11 bảng.
async function installSchema(pool) {
  for (const batch of fs
    .readFileSync(path.join(__dirname, 'CauTrucMuoiMotBang.sql'), 'utf8')
    .split(/^GO\s*$/im))
    if (batch.trim()) await pool.request().batch(batch)
}
// CHỨC NĂNG: Lấy hoặc tạo pool kết nối theo database.
// XỬ LÝ: Ghi nhớ promise kết nối theo tên; các nơi gọi cùng database dùng chung pool.
// TẠI SAO: Tránh mở một kết nối mới cho mọi request, đồng thời tách pool test khỏi main.
// [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] connect — Lấy hoặc tạo pool kết nối theo database.
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
// CHỨC NĂNG: Đóng và bỏ pool của phạm vi được yêu cầu.
// XỬ LÝ: Chỉ dọn pool tương ứng thay vì đóng toàn bộ kết nối khác.
// TẠI SAO: Kiểm thử có thể dọn tài nguyên riêng mà không ngắt database ứng dụng.
// [UC02 / UC03 / UC04 / UC06 / UC07 / UC10 / UC11 / UC12 / UC13 / UC14] close — Đóng và bỏ pool của phạm vi được yêu cầu.
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
