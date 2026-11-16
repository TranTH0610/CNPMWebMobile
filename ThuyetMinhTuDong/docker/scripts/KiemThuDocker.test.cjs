/** FILE NÀY LÀM GÌ: Kiểm thử cấu hình và cách thoát tên/giá trị SQL, không dùng database thật. */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { dockerSettings, readSecret } = require('./DocCauHinhDocker.cjs')
const { identifier, literal } = require('./KhoiTaoSql.cjs')

test('cổng mặc định và cổng tùy chọn phải hợp lệ', () => {
  assert.equal(dockerSettings({}).ports.SQL_PORT, 14330)
  assert.equal(dockerSettings({ DOCKER_SQL_PORT: '14400' }).ports.SQL_PORT, 14400)
  for (const value of ['0', '65536', 'abc', '1.5']) assert.throws(() => dockerSettings({ DOCKER_SQL_PORT: value }))
})
test('tên SQL không nhận nội dung chèn lệnh', () => {
  assert.equal(identifier('HueGuideDemo'), '[HueGuideDemo]')
  assert.throws(() => identifier('demo]; DROP DATABASE main;--'))
  assert.equal(literal("a'b"), "N'a''b'")
})
test('secret không được đọc qua đường dẫn tùy ý', () => {
  assert.throws(() => readSecret('../password'))
})
