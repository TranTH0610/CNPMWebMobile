/**
 * FILE: services/database/NhapDuLieuKhoiTao.cjs
 * FILE NÀY LÀM GÌ: Nhập dữ liệu khởi tạo theo quy trình hiện có; không tự chạy khi đổi tên file.
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
const fs = require('node:fs')
const { createSqlRepository } = require('./KhoDuLieuSql.cjs')
const { close } = require('./KetNoiSqlServer.cjs')
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
