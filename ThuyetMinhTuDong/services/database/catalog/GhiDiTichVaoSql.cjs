/**
 * CHỨC NĂNG: [DATABASE] [QUAN-LY-DI-TICH]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có.
 *
 * VỊ TRÍ: services/database/catalog/GhiDiTichVaoSql.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/AnhXaMuoiMotBang.cjs
 *
 * PHỤ THUỘC:
 * - ../ChuyenDoiMaDuLieu.cjs
 * - ./TruyVanVaCapMa.cjs
 * - ./ChuanBiThayDoiDuLieu.cjs
 * - ../LuuVaDocTepSql.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. stamp
 * 2. writeDocument
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { sqlPlaceId, categoryCode, zoneCode } = require('../ChuyenDoiMaDuLieu.cjs')
const { rows, nextCode } = require('./TruyVanVaCapMa.cjs')
const { applyChanges, putRow } = require('./ChuanBiThayDoiDuLieu.cjs')
const stamp = (value) => (value == null ? undefined : new Date(value).toISOString())
// ==================== [DATABASE] [QUAN-LY-DI-TICH] writeDocument ====================
// CHỨC NĂNG: Thực hiện bước writeDocument trong nhiệm vụ: Ghi dữ liệu di tích và các thay đổi liên quan trong transaction hiện có.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
async function writeDocument(executor, sql, scope, document) {
  if (
    document.schema !== 1 ||
    !Array.isArray(document.places) ||
    !Array.isArray(document.audit) ||
    document.sessions?.length
  )
    throw Error('invalid_catalog_document')
  // CHỨC NĂNG: Chỉ lấy metadata tệp; không kéo VARBINARY của mọi ảnh/audio vào mỗi lần lưu.
  const { normaliseDocumentMedia } = require('../LuuVaDocTepSql.cjs')
  const old = (
    await rows(
      executor,
      `SELECT * FROM dbo.DiTich;SELECT * FROM dbo.BanDiTich;SELECT * FROM dbo.NoiDungDiTich;
 SELECT * FROM dbo.HinhAnhDiTich;SELECT * FROM dbo.BanThuThuyetMinh;
 SELECT MaTep,MaBamTep,LoaiTep FROM dbo.TepTaiNguyen;
 SELECT * FROM dbo.LichSuKiemDuyet;SELECT * FROM dbo.NguonThamKhao;`,
    )
  ).recordsets
  const [
    oldPlaces,
    oldVersions,
    oldContents,
    oldImages,
    oldAudios,
    oldMedia,
    oldHistory,
    oldSources,
  ] = old
  const doc = await normaliseDocumentMedia(executor, sql, scope, document, oldMedia)
  const media = (await rows(executor, 'SELECT MaTep,MaBamTep,LoaiTep FROM dbo.TepTaiNguyen'))
    .recordset
  const desiredRows = {
    DiTich: [],
    BanDiTich: [],
    NoiDungDiTich: [],
    HinhAnhDiTich: [],
    BanThuThuyetMinh: [],
    NguonThamKhao: [],
    LichSuKiemDuyet: [],
  }
  const insert = async (table, value) => {
    desiredRows[table].push(value)
  }
  const ids = new Map()
  for (const p of doc.places) {
    let id = sqlPlaceId(p.id)
    if (!/^DT\d{3,}$/.test(id)) {
      do {
        id = await nextCode(executor, 'DT', 'SeqDiTich')
      } while (oldPlaces.some((x) => x.MaDiTich === id) || [...ids.values()].includes(id))
    }
    ids.set(p.id, id)
  }
  // CHỨC NĂNG: Tạo kế hoạch dữ liệu trước; chưa xóa/cập nhật hàng nào ở bước này.
  // TẠI SAO: So sánh từng hàng để bản công bố/ngôn ngữ/di tích không đổi được giữ nguyên.
  for (let order = 0; order < doc.places.length; order++) {
    const p = doc.places[order],
      id = ids.get(p.id),
      previous = oldPlaces.find((x) => x.MaDiTich === id)
    await insert('DiTich', {
      MaDiTich: id,
      ThuTuHienThi: order,
      PhienBanChinhSua: p.revision,
      TrangThaiXuLy: p.workflow,
      GhiChuKiemDuyet: p.reviewNote,
      PhienBanDaDuyet: p.approvedRevision,
      ThoiDiemTao: previous?.ThoiDiemTao ?? new Date(),
      ThoiDiemCapNhat: new Date(p.updatedAt),
    })
    for (const [kind, record] of [
      ['draft', p.record],
      ['published', p.published],
    ]) {
      if (!record) continue
      const oldB = oldVersions.find((b) => b.MaDiTich === id && b.LoaiBan === kind),
        bid = oldB?.MaBanDiTich ?? (await nextCode(executor, 'BDT', 'SeqBanDiTich'))
      await insert('BanDiTich', {
        MaBanDiTich: bid,
        MaDiTich: id,
        LoaiBan: kind,
        TenChuan: record.canonicalTitle,
        MaKhuVuc: zoneCode(record.zone),
        MaDanhMuc: categoryCode(
          record.category ?? (record.zone === 'fortifications' ? 'gate' : 'palace'),
        ),
        NienDai: record.period ?? p.period,
        LaDiemNoiBat: record.featured ?? false,
        ViDo: record.position?.lat,
        KinhDo: record.position?.lng,
        DaXacNhanViTri: record.position?.verified ?? false,
        NguonToaDo: record.position?.source,
        ThoiDiemDoiChieuViTri: record.position?.checkedAt
          ? new Date(record.position.checkedAt)
          : null,
      })
      for (let i = 0; i < record.images.length; i++) {
        const file = media.find((m) => m.MaBamTep === record.images[i].slice(6))
        if (!file) throw Error('missing_sql_media')
        const oldH = oldImages.find((h) => h.MaBanDiTich === bid && h.ThuTuHienThi === i)
        await insert('HinhAnhDiTich', {
          MaHinhAnh: oldH?.MaHinhAnh ?? (await nextCode(executor, 'HA', 'SeqHinhAnh')),
          MaBanDiTich: bid,
          MaTep: file.MaTep,
          ThuTuHienThi: i,
          MoTaAnh: oldH?.MoTaAnh ?? null,
        })
      }
      for (const [language, t] of Object.entries(record.content)) {
        if (!t) continue
        const oldN = oldContents.find((n) => n.MaBanDiTich === bid && n.MaNgonNgu === language),
          nid = oldN?.MaNoiDung ?? (await nextCode(executor, 'ND', 'SeqNoiDung'))
        await insert('NoiDungDiTich', {
          MaNoiDung: nid,
          MaBanDiTich: bid,
          MaNgonNgu: language,
          PhienBanNoiDung: t.version,
          TenDiTich: t.title,
          TomTat: t.summary,
          BaiThuyetMinh: t.body,
          DiaChi: t.address,
          TrangThaiNoiDung: t.status,
          ThoiDiemDuyet: t.approvedAt ? new Date(t.approvedAt) : null,
          ThoiDiemCongBo: t.publishedAt ? new Date(t.publishedAt) : null,
          HinhThucBienSoan: t.adaptation,
        })
        if (t.audio) {
          const a = t.audio,
            file = media.find((m) => m.MaBamTep === a.url.slice(6))
          if (!file) throw Error('missing_sql_media')
          const oldA = oldAudios.find((a) => a.MaNoiDung === nid)
          await insert('BanThuThuyetMinh', {
            MaBanThu: oldA?.MaBanThu ?? (await nextCode(executor, 'BT', 'SeqBanThu')),
            MaNoiDung: nid,
            PhienBanNoiDung: t.version,
            PhienBanBanThu: a.version,
            TrangThaiBanThu: a.status,
            MaTep: file.MaTep,
            ThoiDiemDuyet: a.approvedAt ? new Date(a.approvedAt) : null,
            ThoiDiemCongBo: a.publishedAt ? new Date(a.publishedAt) : null,
          })
        }
        for (let i = 0; i < (t.sources?.length ?? 0); i++) {
          const s = t.sources[i],
            oldS = oldSources.find((s) => s.MaNoiDung === nid && s.ThuTuHienThi === i)
          await insert('NguonThamKhao', {
            MaNguon: oldS?.MaNguon ?? (await nextCode(executor, 'NTK', 'SeqNguon')),
            MaNoiDung: nid,
            ThuTuHienThi: i,
            TenTaiLieu: s.title,
            DuongDan: s.url,
            NgayTruyCap: new Date(s.accessedAt),
            GiayPhep: s.license || null,
            DuongDanGiayPhep: s.licenseUrl || null,
          })
        }
      }
    }
  }
  // Nhật ký là lịch sử bền vững: không xóa mục cũ khi service chỉ trả tối đa 100 mục.
  const signatures = new Set(
    oldHistory.map((h) =>
      JSON.stringify([stamp(h.ThoiDiemThaoTac), h.HanhDong, h.MaDiTichGoc, h.PhienBanDiTich]),
    ),
  )
  for (const a of doc.audit) {
    const id = ids.get(a.placeId) ?? sqlPlaceId(a.placeId),
      sig = JSON.stringify([a.at, a.action, id, a.revision])
    if (signatures.has(sig)) continue
    await insert('LichSuKiemDuyet', {
      MaLichSu: await nextCode(executor, 'LS', 'SeqLichSu'),
      MaDiTichGoc: id,
      MaDiTichLienKet: null,
      HanhDong: a.action,
      PhienBanDiTich: a.revision,
      GhiChu: ['approve', 'requestChanges'].includes(a.action)
        ? (doc.places.find((p) => p.id === a.placeId)?.reviewNote ?? null)
        : null,
      ThoiDiemThaoTac: new Date(a.at),
    })
    signatures.add(sig)
  }
  // CHỨC NĂNG: Áp dụng kế hoạch đúng thứ tự FK/trigger; lỗi sẽ rollback transaction bên ngoài.
  await applyChanges(executor, sql, {
    desiredRows,
    oldPlaces,
    oldVersions,
    oldContents,
    oldImages,
    oldAudios,
    oldSources,
  })
  // Nhật ký mới nối đúng hồ sơ còn tồn tại; lịch sử của hồ sơ đã xóa giữ mã gốc và FK null.
  for (const row of desiredRows.LichSuKiemDuyet) {
    row.MaDiTichLienKet = desiredRows.DiTich.some((p) => p.MaDiTich === row.MaDiTichGoc)
      ? row.MaDiTichGoc
      : null
    await putRow(executor, sql, 'LichSuKiemDuyet', row)
  }
  // Chỉ khôi phục những liên kết đang null; không ghi lại mọi hàng lịch sử ở mỗi lần lưu.
  await rows(
    executor,
    `UPDATE h SET MaDiTichLienKet=h.MaDiTichGoc FROM dbo.LichSuKiemDuyet h
 JOIN dbo.DiTich p ON p.MaDiTich=h.MaDiTichGoc WHERE h.MaDiTichLienKet IS NULL`,
  )
  const maximum = Math.max(0, ...[...ids.values()].map((id) => Number(id.slice(2))))
  const used = (
    await rows(executor, "SELECT last_used_value AS n FROM sys.sequences WHERE name=N'SeqDiTich'")
  ).recordset[0]?.n
  if (maximum > Number(used ?? 0))
    await rows(
      executor,
      `ALTER SEQUENCE dbo.SeqDiTich RESTART WITH ${maximum};SELECT NEXT VALUE FOR dbo.SeqDiTich AS n`,
    )
}
// CHỨC NĂNG: Định nghĩa PK cố định; tên bảng/cột không lấy từ request của người dùng.

module.exports = { writeDocument }
