/** FILE NÀY LÀM GÌ: Mã SQL dễ đọc và tương thích 8 URL di tích đã phát hành.
 * Codec/migration gọi. Không tạo bảng ánh xạ; đây là cấu hình của danh mục ban đầu.
 * TẠI SAO: SQL dùng DT001... nhưng các liên kết Ngọ Môn cũ không bị hỏng.
 */
const LEGACY = ['ky-dai','ngo-mon','dien-thai-hoa','the-mieu','cung-dien-tho','truong-sanh-cung','dien-can-chanh','hien-lam-cac']
const code = (prefix, number) => prefix + String(number).padStart(3,'0')
function sqlPlaceId(id) { const index=LEGACY.indexOf(id); return index<0?id:code('DT',index+1) }
function apiPlaceId(id) { const match=/^DT(\d+)$/.exec(id); return match&&LEGACY[Number(match[1])-1]||id }
const CATEGORIES=['palace','gate','temple','tomb','museum','monument']
const ZONES=['fortifications','ceremonial']
const categoryCode = value => {const i=CATEGORIES.indexOf(value);if(i<0)throw Error('invalid_category');return code('DM',i+1)}
const zoneCode = value => {const i=ZONES.indexOf(value);if(i<0)throw Error('invalid_zone');return code('KV',i+1)}
module.exports={LEGACY,code,sqlPlaceId,apiPlaceId,CATEGORIES,ZONES,categoryCode,zoneCode}
