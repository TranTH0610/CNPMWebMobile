/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra cấu hình xác minh website và app.
 *
 * Được dùng bởi:
 * - npm test tại gốc workspaces.
 *
 * Phụ thuộc:
 * - node:test.
 * - generate-app-links.cjs.
 * - app.config.js của mobile.
 *
 * Liên quan: UC05.
 */

const {
  test,
} = require('node:test')

const assert =
  require('node:assert/strict')

const {
  associationFiles,
} = require('./generate-app-links.cjs')

const configure =
  require('../apps/mobile/app.config.js')

// CHỨC NĂNG: Cung cấp dữ liệu riêng cho test.
// XỬ LÝ: Đây là fixture, không được dùng làm thông tin triển khai thật.
const env = {
  VITE_PUBLIC_SITE_URL:
    'https://guide.test',

  ANDROID_APPLICATION_ID:
    'vn.test.guide',

  ANDROID_SHA256_CERT_FINGERPRINTS:
    Array(32).fill('AA').join(':'),

  IOS_BUNDLE_IDENTIFIER:
    'vn.test.guide',

  APPLE_TEAM_ID:
    'ABCDEFGHIJ',
}

// CHỨC NĂNG: Kiểm tra nội dung file xác minh.
// XỬ LÝ: ID phải đúng và cấu hình thiếu chứng thư phải bị từ chối.
test(
  'Sinh đúng association Android/iOS và từ chối thiếu chứng thư',
  () => {
    const files =
      associationFiles(env)

    assert.equal(
      files['assetlinks.json'][0]
        .target.package_name,

      env.ANDROID_APPLICATION_ID,
    )

    assert.equal(
      files['apple-app-site-association']
        .applinks.details[0].appID,

      'ABCDEFGHIJ.vn.test.guide',
    )

    assert.throws(() => {
      associationFiles({
        ...env,
        ANDROID_SHA256_CERT_FINGERPRINTS: '',
      })
    })

    assert.throws(() => {
      associationFiles({
        ...env,
        VITE_PUBLIC_SITE_URL:
          'http://localhost:5173',
      })
    })
  },
)

// CHỨC NĂNG: Kiểm tra việc ghép cấu hình không làm mất plugin.
// XỬ LÝ: Hoàn nguyên biến môi trường sau test để không ảnh hưởng test khác.
test(
  'Expo giữ plugin hiện có khi bật App Links',
  () => {
    const keys = [
      'EXPO_PUBLIC_VISITOR_WEB_ORIGIN',
      'ANDROID_APPLICATION_ID',
      'IOS_BUNDLE_IDENTIFIER',
    ]

    const previous = keys.map(
      (key) => process.env[key],
    )

    try {
      process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN =
        env.VITE_PUBLIC_SITE_URL

      process.env.ANDROID_APPLICATION_ID =
        env.ANDROID_APPLICATION_ID

      process.env.IOS_BUNDLE_IDENTIFIER =
        env.IOS_BUNDLE_IDENTIFIER

      const result = configure({
        config: {
          plugins: [
            'expo-camera',
          ],
        },
      })

      assert.deepEqual(
        result.plugins,
        ['expo-camera'],
      )

      assert.equal(
        result.android.intentFilters[0]
          .data[0].host,

        'guide.test',
      )

      assert.deepEqual(
        result.ios.associatedDomains,
        ['applinks:guide.test'],
      )
    } finally {
      keys.forEach((key, index) => {
        if (
          previous[index] === undefined
        ) {
          delete process.env[key]
        } else {
          process.env[key] =
            previous[index]
        }
      })
    }
  },
)