/** FILE NÀY LÀM GÌ: Nhập bản sao dữ liệu demo RAM cũ vào SQL lần đầu.
 * Chạy thủ công với --document và --gate; không ghi đè nội dung SQL đã tồn tại. */
const fs = require('node:fs')
const { createSqlRepository } = require('./repository.cjs')
const { close } = require('./connection.cjs')
async function main() {
  const args = process.argv.slice(2)
  const read = key => { const index = args.indexOf(key); return index < 0 ? null : JSON.parse(fs.readFileSync(args[index + 1], 'utf8')) }
  const document = read('--document'), gate = read('--gate')
  if (!document && !gate) throw Error('Cần --document file.json hoặc --gate file.json')
  const repository = createSqlRepository()
  if (document) {
    if (document.schema !== 1 || !Array.isArray(document.places) || !Array.isArray(document.audit) || !Array.isArray(document.sessions)) throw Error('Sai cấu trúc AdminDocument')
    await repository.catalog(async storage => {
      if (await storage.read() !== null) { console.log('Đã có nội dung SQL; giữ nguyên.'); return }
      await storage.write(JSON.stringify(document))
      console.log('Đã nhập nội dung di tích vào SQL Server.')
    })
  }
  if (gate) { await repository.importGate(gate); console.log('Đã kiểm tra/nhập tổng QR cũ, không ghi đè lượt SQL.') }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 }).finally(close)
