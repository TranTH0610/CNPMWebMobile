/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file.
 *
 * VỊ TRÍ: services/database/NhapDuLieuKhoiTao.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:fs
 * - ./KhoDuLieuSql.cjs
 * - ./KetNoiSqlServer.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. main
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const fs = require('node:fs')
const { createSqlRepository } = require('./KhoDuLieuSql.cjs')
const { close } = require('./KetNoiSqlServer.cjs')
// ==================== [DATABASE] main ====================
// CHỨC NĂNG: Thực hiện bước main trong nhiệm vụ: Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
async function main() {
  const args = process.argv.slice(2)
  const read = (key) => {
    const index = args.indexOf(key)
    return index < 0 ? null : JSON.parse(fs.readFileSync(args[index + 1], 'utf8'))
  }
  const document = read('--document'),
    gate = read('--gate')
  if (!document && !gate) throw Error('Cần --document file.json hoặc --gate file.json')
  const repository = createSqlRepository()
  if (document) {
    if (
      document.schema !== 1 ||
      !Array.isArray(document.places) ||
      !Array.isArray(document.audit) ||
      !Array.isArray(document.sessions)
    )
      throw Error('Sai cấu trúc AdminDocument')
    await repository.catalog(async (storage) => {
      if ((await storage.read()) !== null) {
        console.log('Đã có nội dung SQL; giữ nguyên.')
        return
      }
      await storage.write(JSON.stringify(document))
      console.log('Đã nhập nội dung di tích vào SQL Server.')
    })
  }
  if (gate) {
    await repository.importGate(gate)
    console.log('Đã kiểm tra/nhập tổng QR cũ, không ghi đè lượt SQL.')
  }
}
if (require.main === module)
  main()
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
    .finally(close)
