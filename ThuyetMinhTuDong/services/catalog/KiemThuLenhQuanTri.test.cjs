/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra giới hạn đầu vào và danh sách lệnh API sau tách validator.
 *
 * VỊ TRÍ: services/catalog/KiemThuLenhQuanTri.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ./KiemTraLenhQuanTri.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. place
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { validateCommand } = require('./KiemTraLenhQuanTri.cjs')
const place = () => ({
  title: 'Di tích',
  period: '1826',
  lat: '',
  lng: '',
  verified: false,
  category: 'monument',
  images: [],
})
test('Chỉ nhận lệnh API đang hỗ trợ và revision hợp lệ', () => {
  for (const action of ['reset', 'simulate', 'endSessions', 'constructor', '__proto__', 'unknown'])
    assert.ok(!validateCommand(action, []))
  for (const revision of [0, -1, 1.5, '1', null, undefined])
    assert.ok(!validateCommand('submit', ['DT001', revision]))
  assert.ok(validateCommand('submit', ['DT001', 1]))
  assert.ok(!validateCommand('review', ['DT001', 1, 'yes', '']))
  assert.ok(validateCommand('review', ['DT001', 1, true, '']))
})
test('Lưu di tích: giữ giới hạn 20 ảnh và đủ cặp mã/revision khi sửa', () => {
  assert.ok(validateCommand('savePlace', [place()]))
  assert.ok(!validateCommand('savePlace', [{ ...place(), id: 'DT001' }]))
  assert.ok(validateCommand('savePlace', [{ ...place(), id: 'DT001', expectedRevision: 1 }]))
  assert.ok(
    validateCommand('savePlace', [
      { ...place(), images: Array(20).fill('https://example.com/a.jpg') },
    ]),
  )
  assert.ok(
    !validateCommand('savePlace', [
      { ...place(), images: Array(21).fill('https://example.com/a.jpg') },
    ]),
  )
})
test('Bản ngôn ngữ lạ, thiếu trường, quá dài hoặc sai kiểu không vượt qua API', () => {
  const text = { title: 'A', summary: '', address: '', body: 'B' }
  assert.ok(validateCommand('savePlace', [{ ...place(), content: { ja: text } }]))
  for (const content of [
    { xx: text },
    { ja: { title: 'A' } },
    { ja: { ...text, body: 'a'.repeat(20001) } },
    { ja: { ...text, audioUrl: 3 } },
    [],
  ]) {
    assert.ok(!validateCommand('savePlace', [{ ...place(), content }]))
  }
  assert.ok(validateCommand('translate', ['DT001', 'ja', 1]))
  assert.ok(!validateCommand('translate', ['DT001', 'xx', 1]))
})
