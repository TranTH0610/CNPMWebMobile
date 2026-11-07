/**
 * CHỨC NĂNG: [DATABASE] [QUAN-LY-DI-TICH]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.
 *
 * VỊ TRÍ: services/database/catalog/ChuanBiThayDoiDuLieu.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/catalog/GhiDiTichVaoSql.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. sameValue
 * 2. sameRow
 * 3. putRow
 * 4. deleteRow
 * 5. applyChanges
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const PRIMARY_KEYS = {
  DiTich: 'MaDiTich',
  BanDiTich: 'MaBanDiTich',
  NoiDungDiTich: 'MaNoiDung',
  HinhAnhDiTich: 'MaHinhAnh',
  BanThuThuyetMinh: 'MaBanThu',
  NguonThamKhao: 'MaNguon',
  LichSuKiemDuyet: 'MaLichSu',
}
// ==================== [DATABASE] [QUAN-LY-DI-TICH] sameValue ====================
// CHỨC NĂNG: Thực hiện bước sameValue trong nhiệm vụ: Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function sameValue(a, b) {
  if (a == null || b == null) return a == null && b == null
  if (a instanceof Date || b instanceof Date) return new Date(a).getTime() === new Date(b).getTime()
  return a === b
}
// ==================== [DATABASE] [QUAN-LY-DI-TICH] sameRow ====================
// CHỨC NĂNG: Thực hiện bước sameRow trong nhiệm vụ: Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function sameRow(old, next) {
  return Object.entries(next).every(([key, value]) => sameValue(old[key], value))
}

// CHỨC NĂNG: INSERT/UPDATE có tham số; UPDATE chỉ đặt các cột thật sự thay đổi.
// TẠI SAO: Không cập nhật hàng không đổi và không kích hoạt trigger nếu không cần.
// ==================== [DATABASE] [QUAN-LY-DI-TICH] putRow ====================
async function putRow(executor, sql, table, value, old) {
  const pk = PRIMARY_KEYS[table]
  if (!pk) throw Error('unknown_catalog_table')
  const keys = Object.keys(value).filter((k) => !old || (k !== pk && !sameValue(old[k], value[k])))
  if (!keys.length) return
  const request = executor.request()
  for (const k of keys) {
    const v = value[k]
    if (v instanceof Date) request.input(k, sql.DateTime2(3), v)
    else if (typeof v === 'boolean') request.input(k, sql.Bit, v)
    else if (typeof v === 'number') request.input(k, Number.isInteger(v) ? sql.Int : sql.Float, v)
    else request.input(k, sql.NVarChar(sql.MAX), v ?? null)
  }
  if (old) {
    request.input('_key', sql.VarChar(30), value[pk])
    await request.query(
      `UPDATE dbo.${table} SET ${keys.map((k) => '[' + k + ']=@' + k).join(',')} WHERE [${pk}]=@_key`,
    )
  } else
    await request.query(
      `INSERT dbo.${table}(${keys.map((k) => '[' + k + ']').join(',')}) VALUES(${keys.map((k) => '@' + k).join(',')})`,
    )
}
// ==================== [DATABASE] [QUAN-LY-DI-TICH] deleteRow ====================
// CHỨC NĂNG: Thực hiện bước deleteRow trong nhiệm vụ: Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
async function deleteRow(executor, sql, table, row) {
  const pk = PRIMARY_KEYS[table]
  await executor
    .request()
    .input('key', sql.VarChar(30), row[pk])
    .query(`DELETE dbo.${table} WHERE [${pk}]=@key`)
}

// ==================== [DATABASE] [QUAN-LY-DI-TICH] applyChanges ====================
// CHỨC NĂNG: Thực hiện bước applyChanges trong nhiệm vụ: Tính các hàng cần thêm/sửa/xóa trước khi áp dụng thay đổi vào SQL.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
async function applyChanges(
  executor,
  sql,
  { desiredRows, oldPlaces, oldVersions, oldContents, oldImages, oldAudios, oldSources },
) {
  const existing = {
    DiTich: oldPlaces,
    BanDiTich: oldVersions,
    NoiDungDiTich: oldContents,
    HinhAnhDiTich: oldImages,
    BanThuThuyetMinh: oldAudios,
    NguonThamKhao: oldSources,
  }
  const changes = {}
  for (const [table, previous] of Object.entries(existing)) {
    const key = PRIMARY_KEYS[table],
      oldMap = new Map(previous.map((r) => [r[key], r])),
      nextMap = new Map(desiredRows[table].map((r) => [r[key], r]))
    if (nextMap.size !== desiredRows[table].length) throw Error('duplicate_catalog_key')
    changes[table] = { add: [], edit: [], remove: previous.filter((row) => !nextMap.has(row[key])) }
    for (const row of nextMap.values()) {
      const old = oldMap.get(row[key])
      if (!old) changes[table].add.push(row)
      else if (!sameRow(old, row)) changes[table].edit.push({ old, row })
    }
  }
  const versions = new Map(
    [...oldVersions, ...desiredRows.BanDiTich].map((r) => [r.MaBanDiTich, r]),
  )
  const contents = new Map(
    [...oldContents, ...desiredRows.NoiDungDiTich].map((r) => [r.MaNoiDung, r]),
  )
  function parent(table, row) {
    if (table === 'DiTich' || table === 'BanDiTich') return row.MaDiTich
    if (table === 'NoiDungDiTich' || table === 'HinhAnhDiTich')
      return versions.get(row.MaBanDiTich)?.MaDiTich
    return versions.get(contents.get(row.MaNoiDung)?.MaBanDiTich)?.MaDiTich
  }
  const affected = new Set()
  for (const [table, c] of Object.entries(changes))
    for (const row of [...c.add, ...c.remove, ...c.edit.map((p) => p.row)])
      affected.add(parent(table, row))

  // CHỨC NĂNG: Hạ trạng thái tạm chỉ các hồ sơ bị sửa trong transaction.
  // TẠI SAO: Trigger vẫn chặn xóa bài công bố cuối cùng; người đọc dùng khóa Shared nên không thấy trạng thái tạm.
  for (const old of oldPlaces)
    if (affected.has(old.MaDiTich) && old.TrangThaiXuLy !== 'draft') {
      await putRow(executor, sql, 'DiTich', { MaDiTich: old.MaDiTich, TrangThaiXuLy: 'draft' }, old)
    }

  // FK audio tham chiếu cả mã nội dung và phiên bản. Phải tháo audio của đúng bài
  // trước khi cập nhật version, rồi gắn lại cùng mã BT; không đụng audio của các bài khác.
  const changedContents = new Set(
    [...changes.NoiDungDiTich.remove, ...changes.NoiDungDiTich.edit.map((p) => p.row)].map(
      (r) => r.MaNoiDung,
    ),
  )
  const detached = oldAudios.filter((a) => changedContents.has(a.MaNoiDung))
  const detachedIds = new Set(detached.map((a) => a.MaBanThu))
  const audioDeletes = new Map(
    [...changes.BanThuThuyetMinh.remove, ...detached].map((a) => [a.MaBanThu, a]),
  )

  // CHỨC NĂNG: Xóa con trước cha; chỉ xóa hàng không còn trong dữ liệu mong muốn.
  for (const row of changes.NguonThamKhao.remove)
    await deleteRow(executor, sql, 'NguonThamKhao', row)
  for (const row of audioDeletes.values()) await deleteRow(executor, sql, 'BanThuThuyetMinh', row)
  for (const table of ['HinhAnhDiTich', 'NoiDungDiTich', 'BanDiTich'])
    for (const row of changes[table].remove) await deleteRow(executor, sql, table, row)
  for (const row of changes.DiTich.remove) {
    await executor
      .request()
      .input('id', sql.VarChar(30), row.MaDiTich)
      .query('UPDATE dbo.LichSuKiemDuyet SET MaDiTichLienKet=NULL WHERE MaDiTichLienKet=@id')
    await deleteRow(executor, sql, 'DiTich', row)
  }

  // Thứ tự có UNIQUE: chuyển riêng các hàng đổi thứ tự lên vùng trống trước khi đặt số mới.
  const reordered = changes.DiTich.edit.filter((p) => p.old.ThuTuHienThi !== p.row.ThuTuHienThi)
  const offset =
    Math.max(
      0,
      ...oldPlaces.map((r) => r.ThuTuHienThi),
      ...desiredRows.DiTich.map((r) => r.ThuTuHienThi),
    ) +
    desiredRows.DiTich.length +
    1
  for (let i = 0; i < reordered.length; i++)
    await executor
      .request()
      .input('id', sql.VarChar(30), reordered[i].row.MaDiTich)
      .input('order', sql.Int, offset + i)
      .query('UPDATE dbo.DiTich SET ThuTuHienThi=@order WHERE MaDiTich=@id')

  // Tạo/cập nhật cha trước con, nhưng trạng thái công bố chỉ khôi phục sau khi con đã hợp lệ.
  for (const row of changes.DiTich.add)
    await putRow(executor, sql, 'DiTich', { ...row, TrangThaiXuLy: 'draft' })
  for (const { old, row } of changes.DiTich.edit) {
    const current = {
      ...old,
      TrangThaiXuLy: 'draft',
      ...(reordered.some((p) => p.row.MaDiTich === row.MaDiTich) ? { ThuTuHienThi: -1 } : {}),
    }
    await putRow(executor, sql, 'DiTich', { ...row, TrangThaiXuLy: 'draft' }, current)
  }
  for (const table of ['BanDiTich', 'NoiDungDiTich', 'HinhAnhDiTich', 'NguonThamKhao']) {
    for (const row of changes[table].add) await putRow(executor, sql, table, row)
    for (const { old, row } of changes[table].edit) await putRow(executor, sql, table, row, old)
  }
  for (const row of desiredRows.BanThuThuyetMinh)
    if (detachedIds.has(row.MaBanThu)) await putRow(executor, sql, 'BanThuThuyetMinh', row)
  for (const row of changes.BanThuThuyetMinh.add)
    await putRow(executor, sql, 'BanThuThuyetMinh', row)
  for (const { old, row } of changes.BanThuThuyetMinh.edit)
    if (!detachedIds.has(row.MaBanThu)) await putRow(executor, sql, 'BanThuThuyetMinh', row, old)
  for (const row of desiredRows.DiTich)
    if (affected.has(row.MaDiTich) && row.TrangThaiXuLy !== 'draft') {
      await putRow(
        executor,
        sql,
        'DiTich',
        { MaDiTich: row.MaDiTich, TrangThaiXuLy: row.TrangThaiXuLy },
        { MaDiTich: row.MaDiTich, TrangThaiXuLy: 'draft' },
      )
    }
}

module.exports = { applyChanges, putRow }
