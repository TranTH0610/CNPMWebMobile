/**
 * FILE NÀY LÀM GÌ: Kiểm tra web, API, ngăn API quản lý trên web khách sau triển khai.
 * DÙNG BỞI: docker:check và bước cuối docker:up; không tạo/xóa bản ghi SQL.
 */
const assert = require('node:assert/strict')
const { dockerSettings } = require('./DocCauHinhDocker.cjs')

async function check() {
  const { ports } = dockerSettings()
  const visitor = 'http://127.0.0.1:' + ports.VISITOR_PORT
  const admin = 'http://127.0.0.1:' + ports.ADMIN_PORT
  // CHỨC NĂNG: Kiểm tra mã HTTP thực tế, có thời hạn để lỗi không làm lệnh treo mãi.
  async function expect(url, status) {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
    assert.equal(response.status, status, url + ': HTTP không đúng')
    return response
  }
  for (const url of [visitor + '/', admin + '/admin/places', visitor + '/api/catalog/version',
    admin + '/api/catalog/document', admin + '/api/catalog/presence/statistics/active']) await expect(url, 200)
  for (const endpoint of ['/admin', '/api/catalog/document', '/api/catalog/identity', '/api/catalog/commands']) await expect(visitor + endpoint, 404)
  const published = await (await expect(visitor + '/api/catalog/published', 200)).json()
  assert.ok(published && typeof published === 'object', 'Danh mục công bố không phải JSON')
  console.log('Đạt: web khách/quản lý, SQL qua API, thống kê và whitelist API khách.')
  console.log('Du khách: ' + visitor + ' | Quản lý: ' + admin + '/admin')
}

if (require.main === module) check().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { check }
