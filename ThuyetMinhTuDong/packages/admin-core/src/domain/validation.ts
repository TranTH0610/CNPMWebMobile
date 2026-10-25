/**
 * FILE NÀY LÀM GÌ: Kiểm tra biểu mẫu và tính thống kê phiên mô phỏng.
 * Service và Dashboard dùng; hàm thuần dễ kiểm thử. UC13–UC17.
 */
import { LANGUAGES } from '@travelguide/visitor-core'
import type { ManagedPlace, PlaceInput, AdminDocument, Dashboard } from './models'
import { AdminError } from './models'
// CHỨC NĂNG: Không nhận URL javascript/data hoặc tọa độ rỗng một nửa.
// XỬ LÝ: Cho asset photo:ID đã đóng gói; URL API chỉ HTTP(S), loại khoảng trắng.
export function mediaUrl(value: string, photo = false): boolean {
  // CHỨC NĂNG: Tệp demo base64 chỉ nhận MIME ảnh/audio an toàn, giới hạn 1 MB gốc.
  const local = photo ? /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/ : /^data:audio\/(?:mpeg|mp3|wav|ogg);base64,[A-Za-z0-9+/]+={0,2}$/
  if (value.startsWith('data:')) return value.length <= 1450000 && local.test(value)
  if (photo && /^photo:[a-z0-9-]+$/.test(value)) return true
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password } catch { return false }
}
export function validatePlace(input: PlaceInput) {
  if (!input.title.trim() || input.images.some(url => !mediaUrl(url, true))) throw new AdminError('invalid')
  if (Boolean(input.lat.trim()) !== Boolean(input.lng.trim())) throw new AdminError('invalid')
  if (!input.lat.trim()) { if (input.verified) throw new AdminError('invalid'); return }
  const lat = Number(input.lat), lng = Number(input.lng)
  // CHỨC NĂNG: Hàng rào demo rộng quanh Huế, không coi đây là ranh khảo sát chính thức.
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 16.3 || lat > 16.7 || lng < 107.4 || lng > 107.8) throw new AdminError('invalid')
}
export function readyForReview(place: ManagedPlace) {
  const vi = place.record.content.vi
  if (!vi?.title.trim() || !vi.body.trim() || !place.record.images.length) throw new AdminError('incomplete')
  for (const { code } of LANGUAGES) {
    const text = place.record.content[code]
    if (text && (!text.title.trim() || !text.body.trim() || !text.audio)) throw new AdminError('incomplete')
  }
}
// CHỨC NĂNG: Số liệu là phiên, không phải số người/vé; 90 giây là giả định demo.
// XỬ LÝ: Dùng ngày lịch địa phương, không dùng toISOString cắt ngày UTC gây lệch múi giờ.
export function dashboard(doc: AdminDocument, now = Date.now()): Dashboard {
  const live = doc.sessions.filter(item => now - item.lastSeen <= 90000 && now >= item.lastSeen)
  return { active: live.length, web: live.filter(s => s.platform === 'web').length,
    mobile: live.filter(s => s.platform === 'mobile-app').length, listening: live.filter(s => s.playing).length,
    gateToday: doc.sessions.filter(s => new Date(s.startedAt).toDateString() === new Date(now).toDateString()).length,
    places: doc.places.filter(p => p.workflow !== 'archived').length,
    pending: doc.places.filter(p => p.workflow === 'submitted').length,
    published: doc.places.filter(p => Boolean(p.published) && p.workflow !== 'archived').length }
}
/* CÁCH KIỂM TRA: Tọa độ sai/ảnh javascript bị từ chối; phiên quá 90 giây không tính active. */
