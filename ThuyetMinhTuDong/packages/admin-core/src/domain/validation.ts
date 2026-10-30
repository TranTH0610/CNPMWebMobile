/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra dữ liệu địa điểm, URL tài nguyên và điều kiện sẵn sàng cho quy trình kiểm duyệt.
 *
 * VỊ TRÍ: packages/admin-core/src/domain/validation.ts
 * DÙNG BỞI: packages/admin-core/src/index.ts; packages/admin-core/src/services/mockService.ts.
 * PHỤ THUỘC: @travelguide/visitor-core; ./models
 * TẠI SAO TÁCH FILE: Các nơi dùng cần cùng hợp đồng dữ liệu để TypeScript phát hiện truyền thiếu
 * hoặc sai kiểu.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ './models'.
import type { ManagedPlace, PlaceInput, AdminDocument, Dashboard } from './models'
// Nhập các thành phần từ './models'.
import { AdminError } from './models'
// CHỨC NĂNG: Không nhận URL javascript/data hoặc tọa độ rỗng một nửa.
// XỬ LÝ: Cho asset photo:ID đã đóng gói; URL API chỉ HTTP(S), loại khoảng trắng.
// Khai báo mediaUrl(value, photo). Nhận đầu vào qua tham số.
export function mediaUrl(value: string, photo = false): boolean {
  // Mã file SQL hợp lệ về định dạng; API tiếp tục kiểm tra file tồn tại và đúng loại.
  if (/^media:[a-f0-9]{64}$/.test(value)) return true
  // CHỨC NĂNG: Tệp demo base64 chỉ nhận MIME ảnh/audio an toàn, giới hạn 1 MB gốc.
  // Khai báo local: chọn giữa hai giá trị theo điều kiện photo.
  const local = photo ? /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/ : /^data:audio\/(?:mpeg|mp3|wav|ogg);base64,[A-Za-z0-9+/]+={0,2}$/
  // Rẽ nhánh nếu value.startsWith('data:'). | Trả kết quả: tính biểu thức value.length <= 1450000 && local.test(value).
  if (value.startsWith('data:')) return value.length <= 1450000 && local.test(value)
  // Rẽ nhánh nếu photo && /^photo:[a-z0-9-]+$/.test(value). | Trả kết quả: sử dụng true làm giá trị của bước hiện tại.
  if (photo && /^photo:[a-z0-9-]+$/.test(value)) return true
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) &`: Bắt đầu vùng try. | Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi. | Trả kết quả: tính biểu thức ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password. | Trả kết quả: sử dụng false làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password } catch { return false }
}
// TẠI SAO (mediaUrl): Chuỗi nhập không mặc nhiên là tài nguyên an toàn/hợp lệ; chỉ nhận định
// dạng và giao thức đã cho phép.
// CHỨC NĂNG: Kiểm tra form địa điểm trước khi lưu.
// XỬ LÝ: Áp dụng chung điều kiện tên, tọa độ và tài nguyên cho cả web lẫn mobile.
// Khai báo validatePlace(input). Kiểm tra dữ liệu địa điểm trước khi lưu để các nơi gọi dùng cùng quy tắc.
export function validatePlace(input: PlaceInput) {
  // Rẽ nhánh nếu !input.title.trim() || input.images.some(url => !mediaUrl(url, true)). | Ném new AdminError('invalid').
  if (!input.title.trim() || input.images.some(url => !mediaUrl(url, true))) throw new AdminError('invalid')
  // Rẽ nhánh nếu Boolean(input.lat.trim()) !== Boolean(input.lng.trim()). | Ném new AdminError('invalid').
  if (Boolean(input.lat.trim()) !== Boolean(input.lng.trim())) throw new AdminError('invalid')
  // Rẽ nhánh nếu !input.lat.trim(). | Rẽ nhánh nếu input.verified. | Ném new AdminError('invalid'). | Thoát hàm hiện tại ngay.
  if (!input.lat.trim()) { if (input.verified) throw new AdminError('invalid'); return }
  // Khai báo lat: Gọi Number(input.lat).
  const lat = Number(input.lat), lng = Number(input.lng)
  // CHỨC NĂNG: Hàng rào demo rộng quanh Huế, không coi đây là ranh khảo sát chính thức.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 16.3 || lat > 16.7 || lng`: Rẽ nhánh nếu !Number.isFinite(lat) || !Number.isFinite(lng) || lat < 16.3 || lat > 16.7 || lng < 107.4 || lng > 107.8. | Ném new AdminError('invalid').
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 16.3 || lat > 16.7 || lng < 107.4 || lng > 107.8) throw new AdminError('invalid')
}
// TẠI SAO (validatePlace): Cả web và native phải chấp nhận cùng loại dữ liệu, tránh form này lưu
// được nhưng form kia không đọc được.
// CHỨC NĂNG: Kiểm tra điều kiện gửi nội dung đi duyệt.
// XỬ LÝ: Chỉ xét dữ liệu hiện có theo quy tắc; không tự tạo bản dịch hoặc âm thanh còn thiếu.
// Khai báo readyForReview(place). Kiểm tra các điều kiện gửi duyệt của bản nội dung hiện tại.
export function readyForReview(place: ManagedPlace) {
  // Khai báo vi: đọc place.record.content.vi từ đối tượng/mảng để dùng tại bước hiện tại.
  const vi = place.record.content.vi
  // Rẽ nhánh nếu !vi?.title.trim() || !vi.body.trim() || !place.record.images.length. | Ném new AdminError('incomplete').
  if (!vi?.title.trim() || !vi.body.trim() || !place.record.images.length) throw new AdminError('incomplete')
  // Duyệt lần lượt LANGUAGES bằng const { code }.
  for (const { code } of LANGUAGES) {
    // Khai báo text: đọc place.record.content[code] từ đối tượng/mảng để dùng tại bước hiện tại.
    const text = place.record.content[code]
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (text && (!text.title.trim() || !text.body.trim() || !text.audio)) throw new Admin`: Rẽ nhánh nếu text && (!text.title.trim() || !text.body.trim() || !text.audio). | Ném new AdminError('incomplete').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (text && (!text.title.trim() || !text.body.trim() || !text.audio)) throw new AdminError('incomplete')
  }
}
// TẠI SAO (readyForReview): Kiểm tra trước giúp người biên tập biết phần còn thiếu, thay vì đưa
// bản chưa đủ dữ liệu sang khâu duyệt.
// CHỨC NĂNG: Số liệu là phiên, không phải số người/vé; 90 giây là giả định demo.
// XỬ LÝ: Dùng ngày lịch địa phương, không dùng toISOString cắt ngày UTC gây lệch múi giờ.
// Khai báo dashboard(doc, now). Nhận đầu vào qua tham số.
export function dashboard(doc: AdminDocument, now = Date.now()): Dashboard {
  // Khai báo live: doc.sessions.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  const live = doc.sessions.filter(item => now - item.lastSeen <= 90000 && now >= item.lastSeen)
  // Trả kết quả: tạo object gồm active, web, mobile, listening, gateToday, places, pending, published. | Gán thuộc tính active: đọc live.length từ đối tượng/mảng để dùng tại bước hiện tại. Biểu diễn số phiên hoạt động. | Gán thuộc tính web: đọc live.filter(s => s.platform === 'web').length từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  return { active: live.length, web: live.filter(s => s.platform === 'web').length,
    // Gán thuộc tính mobile: đọc live.filter(s => s.platform === 'mobile-app').length từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính listening: đọc live.filter(s => s.playing).length từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    mobile: live.filter(s => s.platform === 'mobile-app').length, listening: live.filter(s => s.playing).length,
    // Gán thuộc tính gateToday: đọc doc.sessions.filter(s => new Date(s.startedAt).toDateString() === new Date(now).toDateStri từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    gateToday: doc.sessions.filter(s => new Date(s.startedAt).toDateString() === new Date(now).toDateString()).length,
    // Gán thuộc tính places: đọc doc.places.filter(p => p.workflow !== 'archived').length từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    places: doc.places.filter(p => p.workflow !== 'archived').length,
    // Gán thuộc tính pending: đọc doc.places.filter(p => p.workflow === 'submitted').length từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    pending: doc.places.filter(p => p.workflow === 'submitted').length,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `published: doc.places.filter(p => Boolean(p.published) && p.workflow !== 'archived').`: Gán thuộc tính published: đọc doc.places.filter(p => Boolean(p.published) && p.workflow !== 'archived').length từ đối tượng/mảng để dùng tại bước hiện tại. Giữ ảnh chụp nội dung công bố để sửa bản nháp không làm đổi ngay trang du khách.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    published: doc.places.filter(p => Boolean(p.published) && p.workflow !== 'archived').length }
}
// TẠI SAO (dashboard): Tính các chỉ số từ cùng document giúp các màn admin có cách đếm nhất
// quán; phiên trực tuyến vẫn lấy từ presence.
/* CÁCH KIỂM TRA: Tọa độ sai/ảnh javascript bị từ chối; phiên quá 90 giây không tính active. */
