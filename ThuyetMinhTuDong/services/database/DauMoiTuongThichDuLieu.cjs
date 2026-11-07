/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Cung cấp các kiểu, dữ liệu hoặc hàm xử lý được các module khác sử dụng.
 *
 * VỊ TRÍ: services/database/DauMoiTuongThichDuLieu.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - ./AnhXaMuoiMotBang.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
/** Điểm xuất tương thích; phần đọc/ghi thật hiện ở AnhXaMuoiMotBang.cjs. */
const codec = require('./AnhXaMuoiMotBang.cjs')
module.exports = { ...codec, readDocument: (executor) => codec.readDocument(executor) }
