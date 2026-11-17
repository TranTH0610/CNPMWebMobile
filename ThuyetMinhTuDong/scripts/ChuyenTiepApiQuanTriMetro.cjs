/**
 * FILE: scripts/ChuyenTiepApiQuanTriMetro.cjs
 * FILE NÀY LÀM GÌ: Danh sách route quản trị được phép đi qua Metro của bản admin; không tạo kho RAM thứ hai.
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const { createDevApiProxy } = require('./ChuyenTiepApiMetro.cjs')
const PREFIX = '/__admin-api'
const reads = /^\/(?:version|identity|document|published|gate\/statistics|presence\/statistics\/active|audio\/(?:preview|published)\/[a-f0-9]{64}\.mp3|media\/(?:preview|published)\/[a-f0-9]{64}|images\/(?:preview|published)\/[a-z0-9-]+\.jpg)$/
// CHỨC NĂNG: Tạo proxy dành riêng cho bản quản trị.
// XỬ LÝ: Dùng lớp chuyển tiếp chung và chỉ bật ở cấu hình admin.
// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createAdminApiMiddleware — Tạo proxy dành riêng cho bản quản trị.
function createAdminApiMiddleware({ enabled = false, target = 'http://127.0.0.1:8788', timeoutMs = 190000 } = {}) {
  // Trả kết quả: Gọi createDevApiProxy({ enabled, prefix: PREFIX, target, timeoutMs, allowed: (method, pathname. | Đặt trường enabled bằng giá trị của biến cùng tên. | Gán thuộc tính prefix: sử dụng PREFIX làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường target bằng giá trị của biến cùng tên. | Đặt trường timeoutMs bằng giá trị của biến cùng tên.
  return createDevApiProxy({ enabled, prefix: PREFIX, target, timeoutMs,
    
    allowed: (method, pathname) => (method === 'GET' || method === 'HEAD') && reads.test(pathname)
      || method === 'POST' && pathname === '/commands' })
}
// TẠI SAO (createAdminApiMiddleware): Bản quản trị cần các route riêng, còn bản du khách không
// nên được mở chúng qua Metro.
module.exports = { PREFIX, createAdminApiMiddleware }
