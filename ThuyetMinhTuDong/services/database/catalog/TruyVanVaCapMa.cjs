/**
 * FILE: services/database/catalog/TruyVanVaCapMa.cjs
 * FILE NÀY LÀM GÌ: Thực hiện truy vấn có tham số và lấy mã mới từ sequence đã có.
 * VAI TRÒ: Hạ tầng lưu trữ SQL Server; hỗ trợ UC qua API.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const { code } = require('../ChuyenDoiMaDuLieu.cjs')
// CHỨC NĂNG: Gửi truy vấn SQL kèm các giá trị tham số.
// XỬ LÝ: Tạo request, gán từng giá trị bằng input rồi gọi query.
// TẠI SAO: Giá trị được truyền riêng khỏi chuỗi SQL để hạn chế lỗi ghép chuỗi và SQL injection.
// [UC02 / UC03 / UC04] rows — Gửi truy vấn SQL kèm các giá trị tham số.
async function rows(executor, text, values = {}) {
  const request = executor.request()
  for (const [key, value] of Object.entries(values)) request.input(key, value ?? null)
  return request.query(text)
}
// CHỨC NĂNG: Xin số tiếp theo từ sequence và ghép tiền tố mã.
// XỬ LÝ: Chỉ dùng sequence được code cho phép; định dạng số theo quy ước đang có.
// TẠI SAO: Không lấy MAX + 1 nên các lần thêm đồng thời không tự cấp cùng một số.
// [UC02 / UC03 / UC04] nextCode — Xin số tiếp theo từ sequence và ghép tiền tố mã.
async function nextCode(executor, prefix, sequence) {
  const result = await rows(executor, `SELECT NEXT VALUE FOR dbo.${sequence} AS n`)
  return code(prefix, result.recordset[0].n)
}

module.exports = { rows, nextCode }
