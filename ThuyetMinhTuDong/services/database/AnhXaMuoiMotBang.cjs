/**
 * CHỨC NĂNG: [DATABASE] [QUAN-LY-DI-TICH]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Điểm xuất chung cho lớp đọc/ghi 11 bảng đã chốt.
 *
 * VỊ TRÍ: services/database/AnhXaMuoiMotBang.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/ChuyenSangMuoiMotBang.cjs
 * - services/database/DauMoiTuongThichDuLieu.cjs
 * - services/database/KhoDuLieuSql.cjs
 *
 * PHỤ THUỘC:
 * - ./catalog/DocDiTichTuSql.cjs
 * - ./catalog/GhiDiTichVaoSql.cjs
 * - ./catalog/TruyVanVaCapMa.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { readDocument } = require('./catalog/DocDiTichTuSql.cjs')
const { writeDocument } = require('./catalog/GhiDiTichVaoSql.cjs')
const { rows, nextCode } = require('./catalog/TruyVanVaCapMa.cjs')
module.exports = { readDocument, writeDocument, rows, nextCode }
