/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra hình dạng lệnh quản trị trước khi API gọi service nghiệp vụ.
 *
 * VỊ TRÍ: services/catalog/KiemTraLenhQuanTri.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/KiemThuLenhQuanTri.test.cjs
 * - services/catalog/MayChuApi.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. isString
 * 2. isRevision
 * 3. hasStrings
 * 4. validTranslations
 * 5. validPlace
 * 6. validContent
 * 7. validateCommand
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
const LANGUAGES = ['vi', 'en', 'cn', 'pt', 'ja']
const CATEGORIES = ['palace', 'gate', 'temple', 'tomb', 'museum', 'monument']
const TEXT_FIELDS = ['title', 'summary', 'address', 'body']
const isString = (value) => typeof value === 'string'
const isRevision = (value) => Number.isSafeInteger(value) && value >= 1
// ==================== [DUNG-CHUNG] hasStrings ====================
// CHỨC NĂNG: Thực hiện bước hasStrings trong nhiệm vụ: Kiểm tra hình dạng lệnh quản trị trước khi API gọi service nghiệp vụ.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function hasStrings(value, fields) {
  return value && fields.every((key) => isString(value[key]))
}
// ==================== [DUNG-CHUNG] validTranslations ====================
// CHỨC NĂNG: Thực hiện bước validTranslations trong nhiệm vụ: Kiểm tra hình dạng lệnh quản trị trước khi API gọi service nghiệp vụ.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
// ==================== [DUNG-CHUNG] validPlace ====================
// CHỨC NĂNG: Thực hiện bước validPlace trong nhiệm vụ: Kiểm tra hình dạng lệnh quản trị trước khi API gọi service nghiệp vụ.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
// ==================== [DUNG-CHUNG] validContent ====================
// CHỨC NĂNG: Thực hiện bước validContent trong nhiệm vụ: Kiểm tra hình dạng lệnh quản trị trước khi API gọi service nghiệp vụ.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function validContent(input) {
  return (
    hasStrings(input, ['id', ...TEXT_FIELDS]) &&
    LANGUAGES.includes(input.language) &&
    isRevision(input.expectedRevision) &&
    (input.audioUrl === undefined || isString(input.audioUrl))
  )
}
// CHỨC NĂNG: Chỉ cho phép các lệnh trong hợp đồng, không gọi tùy ý phương thức từ JSON gửi lên.
// ==================== [DUNG-CHUNG] validateCommand ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
