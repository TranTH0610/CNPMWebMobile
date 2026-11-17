/**
 * FILE: services/database/catalog/DocDiTichTuSql.cjs
 * FILE NÀY LÀM GÌ: Ghép các hàng SQL thành dữ liệu di tích mà API đang sử dụng.
 * VAI TRÒ: Hạ tầng lưu trữ SQL Server; hỗ trợ UC qua API.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const { apiPlaceId, CATEGORIES, ZONES } = require('../ChuyenDoiMaDuLieu.cjs')
const { rows } = require('./TruyVanVaCapMa.cjs')
const stamp = (value) => (value == null ? undefined : new Date(value).toISOString())
const optional = (o, k, v) => {
  if (v !== null && v !== undefined) o[k] = v
}
async function readDocument(executor) {
  const r = await rows(
    executor,
    `SELECT * FROM dbo.DiTich ORDER BY ThuTuHienThi;
 SELECT * FROM dbo.BanDiTich;SELECT * FROM dbo.NoiDungDiTich;
 SELECT h.*,t.MaBamTep FROM dbo.HinhAnhDiTich h JOIN dbo.TepTaiNguyen t ON t.MaTep=h.MaTep ORDER BY h.ThuTuHienThi;
 SELECT a.*,t.MaBamTep FROM dbo.BanThuThuyetMinh a JOIN dbo.TepTaiNguyen t ON t.MaTep=a.MaTep;
 SELECT * FROM dbo.NguonThamKhao ORDER BY ThuTuHienThi;
 SELECT * FROM dbo.LichSuKiemDuyet ORDER BY ThoiDiemThaoTac DESC,TRY_CONVERT(bigint,SUBSTRING(MaLichSu,3,28)) DESC;`,
  )
  const [places, versions, contents, images, audios, sources, history] = r.recordsets
  const records = new Map(),
    texts = new Map()
  for (const b of versions) {
    const p = places.find((p) => p.MaDiTich === b.MaDiTich)
    const record = {
      id: apiPlaceId(b.MaDiTich),
      scope: 'hue-citadel',
      inLaunchCatalog: true,
      status: b.LoaiBan === 'published' || p.TrangThaiXuLy === 'published' ? 'published' : 'draft',
      canonicalTitle: b.TenChuan,
      zone: ZONES[Number(b.MaKhuVuc.slice(2)) - 1],
      category: CATEGORIES[Number(b.MaDanhMuc.slice(2)) - 1],
      images: [],
      content: {},
      featured: Boolean(b.LaDiemNoiBat),
    }
    optional(record, 'period', b.NienDai)
    if (b.ViDo !== null) {
      record.position = {
        lat: Number(b.ViDo),
        lng: Number(b.KinhDo),
        verified: Boolean(b.DaXacNhanViTri),
      }
      optional(record.position, 'source', b.NguonToaDo)
      if (b.ThoiDiemDoiChieuViTri)
        record.position.checkedAt = stamp(b.ThoiDiemDoiChieuViTri).slice(0, 10)
    }
    records.set(b.MaBanDiTich, record)
  }
  for (const n of contents) {
    const text = {
      title: n.TenDiTich,
      summary: n.TomTat,
      body: n.BaiThuyetMinh,
      address: n.DiaChi,
      version: n.PhienBanNoiDung,
      status: n.TrangThaiNoiDung,
    }
    optional(text, 'approvedAt', stamp(n.ThoiDiemDuyet))
    optional(text, 'publishedAt', stamp(n.ThoiDiemCongBo))
    optional(text, 'adaptation', n.HinhThucBienSoan)
    // Danh sách rỗng là giá trị mặc định chuẩn hóa, không cần cờ HasSources riêng.
    text.sources = []
    records.get(n.MaBanDiTich).content[n.MaNgonNgu] = text
    texts.set(n.MaNoiDung, text)
  }
  for (const h of images) records.get(h.MaBanDiTich).images.push('media:' + h.MaBamTep)
  for (const a of audios) {
    const audio = {
      id: a.MaBanThu,
      url: 'media:' + a.MaBamTep,
      version: a.PhienBanBanThu,
      status: a.TrangThaiBanThu,
    }
    optional(audio, 'approvedAt', stamp(a.ThoiDiemDuyet))
    optional(audio, 'publishedAt', stamp(a.ThoiDiemCongBo))
    texts.get(a.MaNoiDung).audio = audio
  }
  for (const s of sources)
    texts.get(s.MaNoiDung).sources.push({
      title: s.TenTaiLieu,
      url: s.DuongDan,
      accessedAt: new Date(s.NgayTruyCap).toISOString().slice(0, 10),
      license: s.GiayPhep ?? '',
      licenseUrl: s.DuongDanGiayPhep ?? '',
    })
  return {
    schema: 1,
    sessions: [],
    places: places.map((p) => {
      const draft = versions.find((b) => b.MaDiTich === p.MaDiTich && b.LoaiBan === 'draft'),
        pub = versions.find((b) => b.MaDiTich === p.MaDiTich && b.LoaiBan === 'published')
      if (!draft) throw Error('missing_draft_record')
      const place = {
        id: apiPlaceId(p.MaDiTich),
        record: records.get(draft.MaBanDiTich),
        period: draft.NienDai ?? '',
        revision: p.PhienBanChinhSua,
        workflow: p.TrangThaiXuLy,
        reviewNote: p.GhiChuKiemDuyet,
        updatedAt: stamp(p.ThoiDiemCapNhat),
      }
      optional(place, 'approvedRevision', p.PhienBanDaDuyet)
      if (pub) place.published = records.get(pub.MaBanDiTich)
      return place
    }),
    audit: history.map((h) => ({
      at: stamp(h.ThoiDiemThaoTac),
      action: h.HanhDong,
      placeId: apiPlaceId(h.MaDiTichGoc),
      revision: h.PhienBanDiTich,
    })),
  }
}

module.exports = { readDocument }
