/**
 * FILE: services/catalog/KiemTraLenhQuanTri.cjs
 * FILE NÀY LÀM GÌ: Kiểm tra tên lệnh và đối số trước khi API gọi nghiệp vụ quản trị.
 * VAI TRÒ: Máy chủ/API; nhận yêu cầu từ Web và Mobile.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const LANGUAGES = ['vi', 'en', 'cn', 'pt', 'ja']
const CATEGORIES = ['palace', 'gate', 'temple', 'tomb', 'museum', 'monument']
const TEXT_FIELDS = ['title', 'summary', 'address', 'body']
const isString = (value) => typeof value === 'string'
const isRevision = (value) => Number.isSafeInteger(value) && value >= 1
function hasStrings(value, fields) {
  return value && fields.every((key) => isString(value[key]))
}
function validTranslations(content) {
  if (content === undefined) return true
  if (!content || typeof content !== 'object' || Array.isArray(content)) return false
  return Object.entries(content).every(
    ([code, text]) =>
      LANGUAGES.includes(code) &&
      text &&
      TEXT_FIELDS.every((key) => isString(text[key]) && text[key].length <= 20000) &&
      (text.audioUrl === undefined || isString(text.audioUrl)),
  )
}
function validPlace(input) {
  return (
    hasStrings(input, ['title', 'period', 'lat', 'lng']) &&
    CATEGORIES.includes(input.category) &&
    typeof input.verified === 'boolean' &&
    Array.isArray(input.images) &&
    input.images.length <= 20 &&
    input.images.every(isString) &&
    (input.id === undefined || (isString(input.id) && isRevision(input.expectedRevision))) &&
    validTranslations(input.content)
  )
}
function validContent(input) {
  return (
    hasStrings(input, ['id', ...TEXT_FIELDS]) &&
    LANGUAGES.includes(input.language) &&
    isRevision(input.expectedRevision) &&
    (input.audioUrl === undefined || isString(input.audioUrl))
  )
}
// CHỨC NĂNG: Chỉ cho phép các lệnh trong hợp đồng, không gọi tùy ý phương thức từ JSON gửi lên.
// [UC10 / UC11 / UC12 / UC13] validateCommand — Chỉ cho phép các lệnh trong hợp đồng, không gọi tùy ý phương thức từ JSON gửi lên.
function validateCommand(action, args) {
  if (!Array.isArray(args)) return false
  if (action === 'savePlace') return args.length === 1 && validPlace(args[0])
  if (action === 'saveContent') return args.length === 1 && validContent(args[0])
  if (['translate', 'generateAudio'].includes(action))
    return (
      args.length === 3 && isString(args[0]) && LANGUAGES.includes(args[1]) && isRevision(args[2])
    )
  if (action === 'review')
    return (
      args.length === 4 &&
      isString(args[0]) &&
      isRevision(args[1]) &&
      typeof args[2] === 'boolean' &&
      isString(args[3])
    )
  return (
    ['submit', 'publish', 'archive', 'deletePlace'].includes(action) &&
    args.length === 2 &&
    isString(args[0]) &&
    isRevision(args[1])
  )
}
module.exports = { validateCommand, isString }
