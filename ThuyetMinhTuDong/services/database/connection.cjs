/** FILE NÀY LÀM GÌ: Quản lý pool SQL dùng chung trong mỗi tiến trình API.
 * Repository gọi; chỉ giữ kết nối, không giữ bản dữ liệu nghiệp vụ trong Map/Set. */
const { driverConfig } = require('./config.cjs')
let connecting
function connect() {
  if (!connecting) {
    const { sql, config } = driverConfig()
    const pool = new sql.ConnectionPool(config)
    pool.on('error', () => { /* Request tiếp theo trả lỗi SQL; không chuyển sang RAM. */ })
    connecting = pool.connect().then(() => ({ sql, pool })).catch(error => { connecting = undefined; throw error })
  }
  return connecting
}
async function close() {
  const pending = connecting
  connecting = undefined
  if (pending) { const { pool } = await pending; await pool.close() }
}
module.exports = { connect, close }
