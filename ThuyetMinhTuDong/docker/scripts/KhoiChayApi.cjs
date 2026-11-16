/**
 * FILE NÀY LÀM GÌ: Cấp mật khẩu từ Docker secret rồi khởi động một API hiện có.
 * DÙNG BỞI: catalog/presence trong Compose; không sửa API contract hoặc nghiệp vụ.
 */
const { readSecret } = require('./DocCauHinhDocker.cjs')

// CHỨC NĂNG: Kiểm tra lựa chọn trước khi nạp API, tránh require đường dẫn tùy ý.
const target = process.argv[2]
if (!['catalog', 'presence'].includes(target)) throw Error('Chỉ chạy catalog hoặc presence')
// TẠI SAO: Các module SQL đọc process.env khi được nạp; phải cấp secret trước require.
process.env.SQL_PASSWORD = readSecret('sql_app_password')

const { close } = require('../../services/database/KetNoiSqlServer.cjs')
const server = target === 'catalog'
  ? require('../../services/catalog/MayChuApi.cjs').createCatalogServer()
  : require('../../services/presence/MayChuApi.cjs').createPresenceServer()
const port = target === 'catalog' ? 8788 : 8787
server.listen(port, '0.0.0.0', () => console.log(target + ' đã sẵn sàng trong Docker'))

// CHỨC NĂNG: Dừng HTTP và pool SQL khi Compose gửi tín hiệu kết thúc.
let stopping = false
function stop() {
  if (stopping) return
  stopping = true
  const timer = setTimeout(() => process.exit(1), 10000)
  timer.unref() // Timer dự phòng không giữ Node sống sau khi đã dọn xong.
  server.close(() => { close().then(() => process.exit(0)).catch(() => process.exit(1)) })
}
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
server.on('error', error => { console.error(error.code || 'api_start_failed'); process.exitCode = 1 })
