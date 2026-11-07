/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại.
 *
 * VỊ TRÍ: services/database/ChuyenDoiMaDuLieu.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/catalog/DocDiTichTuSql.cjs
 * - services/database/catalog/GhiDiTichVaoSql.cjs
 * - services/database/catalog/TruyVanVaCapMa.cjs
 * - services/database/ChuyenSangMuoiMotBang.cjs
 * - services/database/LuuVaDocTepSql.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. code
 * 2. sqlPlaceId
 * 3. apiPlaceId
 * 4. categoryCode
 * 5. zoneCode
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const LEGACY = [
  'ky-dai',
  'ngo-mon',
  'dien-thai-hoa',
  'the-mieu',
  'cung-dien-tho',
  'truong-sanh-cung',
  'dien-can-chanh',
  'hien-lam-cac',
]
const code = (prefix, number) => prefix + String(number).padStart(3, '0')
// ==================== [DATABASE] sqlPlaceId ====================
// CHỨC NĂNG: Thực hiện bước sqlPlaceId trong nhiệm vụ: Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function sqlPlaceId(id) {
  const index = LEGACY.indexOf(id)
  return index < 0 ? id : code('DT', index + 1)
}
// ==================== [DATABASE] apiPlaceId ====================
// CHỨC NĂNG: Thực hiện bước apiPlaceId trong nhiệm vụ: Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
function apiPlaceId(id) {
  const match = /^DT(\d+)$/.exec(id)
  return (match && LEGACY[Number(match[1]) - 1]) || id
}
const CATEGORIES = ['palace', 'gate', 'temple', 'tomb', 'museum', 'monument']
const ZONES = ['fortifications', 'ceremonial']
const categoryCode = (value) => {
  const i = CATEGORIES.indexOf(value)
  if (i < 0) throw Error('invalid_category')
  return code('DM', i + 1)
}
const zoneCode = (value) => {
  const i = ZONES.indexOf(value)
  if (i < 0) throw Error('invalid_zone')
  return code('KV', i + 1)
}
module.exports = { LEGACY, code, sqlPlaceId, apiPlaceId, CATEGORIES, ZONES, categoryCode, zoneCode }
