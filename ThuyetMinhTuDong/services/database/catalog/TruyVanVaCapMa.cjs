/**
 * CHỨC NĂNG: [DATABASE] [QUAN-LY-DI-TICH]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có.
 *
 * VỊ TRÍ: services/database/catalog/TruyVanVaCapMa.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/database/AnhXaMuoiMotBang.cjs
 * - services/database/catalog/DocDiTichTuSql.cjs
 * - services/database/catalog/GhiDiTichVaoSql.cjs
 *
 * PHỤ THUỘC:
 * - ../ChuyenDoiMaDuLieu.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. rows
 * 2. nextCode
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { code } = require('../ChuyenDoiMaDuLieu.cjs')
// ==================== [DATABASE] [QUAN-LY-DI-TICH] rows ====================
// CHỨC NĂNG: Thực hiện bước rows trong nhiệm vụ: Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] rows ====================
// CHỨC NĂNG: Gửi truy vấn SQL kèm các giá trị tham số.
// XỬ LÝ: Tạo request, gán từng giá trị bằng input rồi gọi query.
// TẠI SAO: Giá trị được truyền riêng khỏi chuỗi SQL để hạn chế lỗi ghép chuỗi và SQL injection.
async function rows(executor, text, values = {}) {
  const request = executor.request()
  for (const [key, value] of Object.entries(values)) request.input(key, value ?? null)
  return request.query(text)
}
// ==================== [DATABASE] [QUAN-LY-DI-TICH] nextCode ====================
// CHỨC NĂNG: Thực hiện bước nextCode trong nhiệm vụ: Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] nextCode ====================
// CHỨC NĂNG: Xin số tiếp theo từ sequence và ghép tiền tố mã.
// XỬ LÝ: Chỉ dùng sequence được code cho phép; định dạng số theo quy ước đang có.
// TẠI SAO: Không lấy MAX + 1 nên các lần thêm đồng thời không tự cấp cùng một số.
async function nextCode(executor, prefix, sequence) {
  const result = await rows(executor, `SELECT NEXT VALUE FOR dbo.${sequence} AS n`)
  return code(prefix, result.recordset[0].n)
}

module.exports = { rows, nextCode }
