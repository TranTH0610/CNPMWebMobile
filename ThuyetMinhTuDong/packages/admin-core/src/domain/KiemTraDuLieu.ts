/**
 * FILE: packages/admin-core/src/domain/KiemTraDuLieu.ts
 * FILE NÀY LÀM GÌ: Kiểm tra dữ liệu di tích, điều kiện gửi duyệt/công bố và tổng hợp các chỉ số nội dung.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { LANGUAGES } from '@travelguide/visitor-core'
import type { ManagedPlace, PlaceInput, AdminDocument, Dashboard } from './KieuDuLieuQuanTri'
import { AdminError } from './KieuDuLieuQuanTri'
// CHỨC NĂNG: Không nhận URL javascript/data hoặc tọa độ rỗng một nửa.
// XỬ LÝ: Cho asset photo:ID đã đóng gói; URL API chỉ HTTP(S), loại khoảng trắng.

// [UC10 / UC11] mediaUrl — Kiểm tra định dạng và giới hạn liên kết/tệp ảnh hoặc audio được nhập.
export function mediaUrl(value: string, photo = false): boolean {
  // Mã file SQL hợp lệ về định dạng; API tiếp tục kiểm tra file tồn tại và đúng loại.
  if (/^media:[a-f0-9]{64}$/.test(value)) return true
  // CHỨC NĂNG: Tệp demo base64 chỉ nhận MIME ảnh/audio an toàn, giới hạn 1 MB gốc.

  const local = photo
    ? /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/
    : /^data:audio\/(?:mpeg|mp3|wav|ogg);base64,[A-Za-z0-9+/]+={0,2}$/

  if (value.startsWith('data:')) return value.length <= 1450000 && local.test(value)

  if (photo && /^photo:[a-z0-9-]+$/.test(value)) return true

  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
  } catch {
    return false
  }
}
// TẠI SAO (mediaUrl): Chuỗi nhập không mặc nhiên là tài nguyên an toàn/hợp lệ; chỉ nhận định
// dạng và giao thức đã cho phép.
// CHỨC NĂNG: Kiểm tra form địa điểm trước khi lưu.
// XỬ LÝ: Áp dụng chung điều kiện tên, tọa độ và tài nguyên cho cả web lẫn mobile.

// [UC10] validatePlace — Kiểm tra dữ liệu hồ sơ trước khi cho lưu di tích.
export function validatePlace(input: PlaceInput) {
  if (!input.title.trim() || input.images.some((url) => !mediaUrl(url, true)))
    throw new AdminError('invalid')

  if (Boolean(input.lat.trim()) !== Boolean(input.lng.trim())) throw new AdminError('invalid')

  if (!input.lat.trim()) {
    if (input.verified) throw new AdminError('invalid')
    return
  }

  const lat = Number(input.lat),
    lng = Number(input.lng)
  // CHỨC NĂNG: Hàng rào demo rộng quanh Huế, không coi đây là ranh khảo sát chính thức.

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < 16.3 ||
    lat > 16.7 ||
    lng < 107.4 ||
    lng > 107.8
  )
    throw new AdminError('invalid')
}
// TẠI SAO (validatePlace): Cả web và native phải chấp nhận cùng loại dữ liệu, tránh form này lưu
// được nhưng form kia không đọc được.
// CHỨC NĂNG: Kiểm tra điều kiện gửi nội dung đi duyệt.
// XỬ LÝ: Chỉ xét dữ liệu hiện có theo quy tắc; không tự tạo bản dịch hoặc âm thanh còn thiếu.

// [UC12 / UC13] readyForReview — Kiểm tra các trường và bản ngôn ngữ/bản thu bắt buộc trước khi duyệt hoặc công bố.
export function readyForReview(place: ManagedPlace) {
  const vi = place.record.content.vi

  if (!vi?.title.trim() || !vi.body.trim() || !place.record.images.length)
    throw new AdminError('incomplete')

  for (const { code } of LANGUAGES) {
    const text = place.record.content[code]

    if (text && (!text.title.trim() || !text.address.trim() || !text.body.trim() || !text.audio))
      throw new AdminError('incomplete')
  }
}
// TẠI SAO (readyForReview): Kiểm tra trước giúp người biên tập biết phần còn thiếu, thay vì đưa
// bản chưa đủ dữ liệu sang khâu duyệt.
// CHỨC NĂNG: Số liệu là phiên, không phải số người/vé; 90 giây là giả định demo.
// XỬ LÝ: Dùng ngày lịch địa phương, không dùng toISOString cắt ngày UTC gây lệch múi giờ.

// [UC14] dashboard — Tính số di tích và hồ sơ chờ duyệt từ document quản trị để hiển thị tổng quan.
export function dashboard(doc: AdminDocument, now = Date.now()): Dashboard {
  const live = doc.sessions.filter((item) => now - item.lastSeen <= 90000 && now >= item.lastSeen)

  return {
    active: live.length,
    web: live.filter((s) => s.platform === 'web').length,

    mobile: live.filter((s) => s.platform === 'mobile-app').length,
    listening: live.filter((s) => s.playing).length,

    gateToday: doc.sessions.filter(
      (s) => new Date(s.startedAt).toDateString() === new Date(now).toDateString(),
    ).length,

    places: doc.places.filter((p) => p.workflow !== 'archived').length,

    pending: doc.places.filter((p) => p.workflow === 'submitted').length,

    published: doc.places.filter((p) => Boolean(p.published) && p.workflow !== 'archived').length,
  }
}
// TẠI SAO (dashboard): Tính các chỉ số từ cùng document giúp các màn admin có cách đếm nhất
// quán; phiên trực tuyến vẫn lấy từ presence.
/* CÁCH KIỂM TRA: Tọa độ sai/ảnh javascript bị từ chối; phiên quá 90 giây không tính active. */
