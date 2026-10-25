/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra địa chỉ dùng cho QR chung.
 *
 * Được dùng bởi:
 * - Script test của visitor-core.
 *
 * Phụ thuộc:
 * - node:test, node:assert.
 * - site.ts sau khi biên dịch.
 *
 * Liên quan: UC05.
 */

const {
  test,
} = require('node:test')

const assert =
  require('node:assert/strict')

const {
  siteOrigin,
} = require('../.test-build/links/site.js')

// CHỨC NĂNG: Kiểm tra HTTPS công khai và HTTP LAN khi chạy thử.
// XỬ LÝ: localhost và URL không phù hợp phải bị từ chối.
test(
  'QR chấp nhận HTTPS và LAN HTTP khi được cho phép',
  () => {
    assert.equal(
      siteOrigin(
        'https://guide.test/',
      ),
      'https://guide.test',
    )

    assert.equal(
      siteOrigin(
        'http://192.168.1.20:5173',
        true,
      ),
      'http://192.168.1.20:5173',
    )

    assert.throws(() => {
      siteOrigin(
        'http://192.168.1.20:5173',
      )
    })

    const invalidUrls = [
      'http://localhost:5173',
      'https://localhost',
      'https://127.0.0.1',
      'https://[::1]',
      'https://0.0.0.0',
      'https://hue-guide.example',
      'https://user:password@guide.test',
      'https://guide.test/places',
      'https://guide.test/?a=b',
      'not a url',
    ]

    for (const raw of invalidUrls) {
      assert.throws(
        () => siteOrigin(raw, true),
        raw,
      )
    }
  },
)