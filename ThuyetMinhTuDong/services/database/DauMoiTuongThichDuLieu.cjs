/**
 * FILE: services/database/DauMoiTuongThichDuLieu.cjs
 * FILE NÀY LÀM GÌ: Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng.
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
/** Điểm xuất tương thích; phần đọc/ghi thật hiện ở AnhXaMuoiMotBang.cjs. */
const codec = require('./AnhXaMuoiMotBang.cjs')
module.exports = { ...codec, readDocument: (executor) => codec.readDocument(executor) }
