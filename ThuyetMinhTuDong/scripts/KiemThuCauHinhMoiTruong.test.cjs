/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra tách cấu hình BE/FE, ưu tiên môi trường và lỗi an toàn.
 *
 * VỊ TRÍ: scripts/KiemThuCauHinhMoiTruong.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - node:fs
 * - node:os
 * - node:path
 * - ../services/config/DocCauHinhMoiTruong.cjs
 * - ./KiemTraCauHinhMoiTruong.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. withFile
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { loadServerEnv } = require('../services/config/DocCauHinhMoiTruong.cjs')
const { validateEntries } = require('./KiemTraCauHinhMoiTruong.cjs')

// ==================== [KIEM-THU] withFile ====================
// CHỨC NĂNG: Thực hiện bước withFile trong nhiệm vụ: Kiểm tra tách cấu hình BE/FE, ưu tiên môi trường và lỗi an toàn.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
function withFile(text, run) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hue-env-test-'))
  const file = path.join(directory, '.env.local')
  try { fs.writeFileSync(file, text); run(file) }
  finally {
    fs.unlinkSync(file)
    fs.rmdirSync(directory)
  }
}

test('BE đọc SQL, giữ biến môi trường có sẵn và xử lý mật khẩu có dấu #', () => {
  withFile('SQL_SERVER=from-file\nSQL_PASSWORD="demo#quoted"\n', file => {
    const target = { SQL_SERVER: 'from-hosting' }
    loadServerEnv(file, target)
    assert.equal(target.SQL_SERVER, 'from-hosting')
    assert.equal(target.SQL_PASSWORD, 'demo#quoted')
  })
})

test('Không có file vẫn dùng được cấu hình từ môi trường', () => {
  const target = {}
  loadServerEnv(path.join(os.tmpdir(), 'missing-hue-env-' + Date.now()), target)
  assert.deepEqual(target, {})
})

test('BE từ chối biến sai trước khi nạp, lỗi không chứa giá trị', () => {
  withFile('SQL_PASSWORD=never-print-this\nVITE_SQL_PASSWORD=also-secret', file => {
    const target = {}
    assert.throws(() => loadServerEnv(file, target), error => {
      assert.equal(error.message.includes('never-print-this'), false)
      assert.equal(error.message.includes('also-secret'), false)
      return error.message.includes('VITE_SQL_PASSWORD')
    })
    assert.deepEqual(target, {})
  })
})

test('FE nhận URL/định danh/bản đồ công khai, chặn token và biến SQL', () => {
  assert.deepEqual(validateEntries('apps/mobile/.env.local', {
    EXPO_PUBLIC_CATALOG_API_URL: '', EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: '', IOS_BUNDLE_IDENTIFIER: '',
  }), [])
  assert.equal(validateEntries('apps/web/.env.local', { VITE_SQL_PASSWORD: 'x', SQL_USER: 'y', VITE_ADMIN_TOKEN: 'z' }).length, 3)
})
