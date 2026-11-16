/**
 * FILE NÀY LÀM GÌ: Tạo secret cục bộ và bảo đảm có backup trước khi chạy Docker.
 * DÙNG BỞI: docker:prepare/docker:up; không lưu mật khẩu thật vào Git hoặc image.
 */
const fs = require('node:fs')
const path = require('node:path')
const { randomBytes } = require('node:crypto')
const { spawnSync } = require('node:child_process')
const { ROOT, LOCAL } = require('./DocCauHinhDocker.cjs')

function protectSecrets(folder) {
  if (process.platform !== 'win32') return // Linux đã dùng thư mục 0700 khi tạo.
  // CHỨC NĂNG: Bỏ quyền kế thừa quá rộng trên Windows, chỉ chủ máy/SYSTEM/Administrators được mở.
  // TẠI SAO: mode 0700 của Node không thay thế NTFS ACL trên Windows.
  const script = `
    $ErrorActionPreference = 'Stop'
    $folder = $env:HUEGUIDE_SECRET_FOLDER
    $owner = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
    # icacls chỉ sửa quyền truy cập, không đòi quyền thay SACL/owner của máy.
    & icacls.exe $folder /inheritance:r /grant:r ("*" + $owner.Value + ":(OI)(CI)F") "*S-1-5-18:(OI)(CI)F" "*S-1-5-32-544:(OI)(CI)F"
    if ($LASTEXITCODE -ne 0) { throw 'Cannot protect secret directory' }
  `
  const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
    // Windows PowerShell 5 không được nạp nhầm module PowerShell 7 từ terminal cha.
    env: { ...process.env, HUEGUIDE_SECRET_FOLDER: folder,
      PSModulePath: path.join(process.env.SystemRoot || 'C:/Windows', 'System32/WindowsPowerShell/v1.0/Modules') },
    encoding: 'utf8', windowsHide: true,
  })
  if (result.error || result.status !== 0) throw Error('Chưa bảo vệ được quyền thư mục secret Windows; không tiếp tục tạo mật khẩu')
}

async function prepare() {
  // CHỨC NĂNG: Tạo cấu hình QR rỗng khi cài mới; giữ URL đã cấu hình nếu file tồn tại.
  // TẠI SAO: Nginx gắn file này từ host để đổi QR mà không build lại image hoặc nhúng URL tạm vào Git.
  const visitorConfig = path.join(ROOT, 'apps/web/static/visitor-config.json')
  if (!fs.existsSync(visitorConfig)) {
    fs.mkdirSync(path.dirname(visitorConfig), { recursive: true })
    fs.writeFileSync(visitorConfig, JSON.stringify({ publicSiteOrigin: '' }) + '\n', { flag: 'wx' })
  }
  const folder = path.join(LOCAL, 'secrets')
  fs.mkdirSync(folder, { recursive: true, mode: 0o700 }) // Chặn người dùng Linux khác mở thư mục secret.
  protectSecrets(folder)
  for (const name of ['sql-admin-password', 'sql-app-password']) {
    const file = path.join(folder, name)
    if (!fs.existsSync(file)) {
      // CHỨC NĂNG: Mỗi máy có mật khẩu mạnh riêng; không in mật khẩu ra log.
      // Compose gắn file trực tiếp: cho UID dịch vụ đọc file, còn thư mục cha chỉ chủ máy được mở.
      fs.writeFileSync(file, 'Hg9!' + randomBytes(24).toString('hex'), { flag: 'wx', mode: 0o444 })
    }
  }
  if (!fs.existsSync(path.join(LOCAL, 'backups/HueGuideDemo.bak'))) {
    // XỬ LÝ: Không tự thay bằng dữ liệu mẫu khi chưa chuyển được database thật.
    await require('./SaoLuuNguonSql.cjs').backupSource()
  }
  console.log('Secret và backup Docker đã sẵn sàng; không có mật khẩu trong output.')
}

if (require.main === module) prepare().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { prepare }
