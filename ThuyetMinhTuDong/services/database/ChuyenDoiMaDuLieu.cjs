/**
 * FILE: services/database/ChuyenDoiMaDuLieu.cjs
 * FILE NÀY LÀM GÌ: Chuyển đổi mã SQL và mã sử dụng trong API theo quy ước hiện tại.
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
function sqlPlaceId(id) {
  const index = LEGACY.indexOf(id)
  return index < 0 ? id : code('DT', index + 1)
}
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
