/**
 * FILE NÀY LÀM GÌ: Điều phối chuẩn bị, chạy, dừng và xem trạng thái Docker.
 * DÙNG BỞI: Các lệnh npm docker:*; không dừng dịch vụ Windows hoặc xóa volume.
 * TẠI SAO: Một lệnh chạy đủ các bước, không cần nhập mật khẩu vào terminal.
 */
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { ROOT, dockerSettings } = require('./DocCauHinhDocker.cjs')

async function main(action = process.argv[2] || 'status') {
  const actions = {
    up: ['up', '--build', '-d', '--wait', '--wait-timeout', '300'],
    stop: ['stop'], // Dừng container, giữ cấu hình và dữ liệu.
    down: ['down'], // Gỡ container/mạng; cố ý không có -v để giữ database.
    status: ['ps', '--all'],
    logs: ['logs', '--tail', '80'],
  }
  if (!Object.hasOwn(actions, action)) throw Error('Lệnh Docker không hợp lệ')
  if (action === 'up') await require('./ChuanBiDocker.cjs').prepare()
  const { values } = dockerSettings()
  const file = path.join(ROOT, '.env.docker.local')
  // XỬ LÝ: Truyền từng đối số, không ghép lệnh shell chứa cấu hình/mật khẩu.
  const prefix = ['compose', ...(fs.existsSync(file) ? ['--env-file', file] : []), '-f', path.join(ROOT, 'docker-compose.yml')]
  const options = { cwd: ROOT, env: { ...values, ...process.env }, stdio: 'inherit', windowsHide: true }
  if (action === 'up') {
    const validation = spawnSync('docker', [...prefix, 'config', '--quiet'], options)
    if (validation.error || validation.status !== 0) throw Error('Cấu hình Compose chưa hợp lệ hoặc chưa mở Docker Desktop')
  }
  const result = spawnSync('docker', [...prefix, ...actions[action]], options)
  if (result.error) throw Error('Chưa gọi được Docker CLI: ' + result.error.code)
  if (result.status !== 0) throw Error('Docker chưa hoàn thành; xem log dịch vụ bằng npm run docker:logs')
  if (action === 'up') await require('./KiemTraHeThongDocker.cjs').check()
}

if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { main }
