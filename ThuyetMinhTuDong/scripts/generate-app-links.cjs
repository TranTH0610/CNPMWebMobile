/**
 * FILE NÀY LÀM GÌ:
 * Sinh file xác minh liên kết giữa website và app Android/iOS.
 *
 * Được dùng bởi:
 * - npm run links:generate.
 * - prebuild của web.
 *
 * Phụ thuộc:
 * - fs, path của Node.
 * - Biến môi trường có thông tin ký app thật.
 *
 * Liên quan: UC05.
 */

const fs = require('node:fs')
const path = require('node:path')

// CHỨC NĂNG: Tạo dữ liệu xác minh từ cấu hình.
// XỬ LÝ: Không phát hành file chứa ID hoặc chứng thư giả.
function associationFiles(env) {
  const origin = new URL(
    env.VITE_PUBLIC_SITE_URL || '',
  )

  if (
    origin.protocol !== 'https:'
    || origin.pathname !== '/'
    || origin.search
    || origin.hash
    || origin.username
    || origin.password
    || origin.hostname === 'localhost'
    || origin.hostname.endsWith('.example')
  ) {
    throw new Error(
      'VITE_PUBLIC_SITE_URL phải là origin HTTPS thật',
    )
  }

  const files = {}

  // CHỨC NĂNG: Tạo assetlinks.json cho Android.
  // XỬ LÝ: Kiểm tra application ID và định dạng SHA-256.
  if (env.ANDROID_APPLICATION_ID) {
    const fingerprints = (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter(Boolean)

    const validApplicationId =
      /^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)+$/
        .test(env.ANDROID_APPLICATION_ID)

    const invalidFingerprint =
      fingerprints.some(
        (value) =>
          !/^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/
            .test(value),
      )

    if (
      !validApplicationId
      || !fingerprints.length
      || invalidFingerprint
    ) {
      throw new Error(
        'Cần Android application ID và SHA-256 chứng thư ký thật',
      )
    }

    files['assetlinks.json'] = [
      {
        relation: [
          'delegate_permission/common.handle_all_urls',
        ],

        target: {
          namespace: 'android_app',

          package_name:
            env.ANDROID_APPLICATION_ID,

          sha256_cert_fingerprints:
            fingerprints,
        },
      },
    ]
  }

  // CHỨC NĂNG: Tạo AASA cho iOS Universal Links.
  // XỬ LÝ: Apple Team ID và bundle ID phải khớp bản app được ký.
  if (
    env.IOS_BUNDLE_IDENTIFIER
    || env.APPLE_TEAM_ID
  ) {
    const validTeam =
      /^[A-Z0-9]{10}$/.test(
        env.APPLE_TEAM_ID || '',
      )

    const validBundle =
      /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
        .test(
          env.IOS_BUNDLE_IDENTIFIER || '',
        )

    if (!validTeam || !validBundle) {
      throw new Error(
        'Cần Apple Team ID và bundle identifier thật',
      )
    }

    files['apple-app-site-association'] = {
      applinks: {
        apps: [],

        details: [
          {
            appID:
              env.APPLE_TEAM_ID
              + '.'
              + env.IOS_BUNDLE_IDENTIFIER,

            paths: [
              '/',
              '/places',
              '/places/',
              '/places/*',
            ],
          },
        ],
      },
    }
  }

  if (!Object.keys(files).length) {
    throw new Error(
      'Chưa cấu hình Android hoặc iOS',
    )
  }

  return files
}

// CHỨC NĂNG: Chỉ thực thi ghi file khi chạy script trực tiếp.
// XỬ LÝ: Khi test require file này, không tự ghi file vào dự án.
if (require.main === module) {
  const web = path.resolve(
    __dirname,
    '../apps/web',
  )

  // CHỨC NĂNG: Đọc cấu hình môi trường của web.
  // XỬ LÝ: Biến từ hosting/shell ưu tiên hơn file .env.
  for (
    const name of [
      '.env.production.local',
      '.env.local',
      '.env.production',
      '.env',
    ]
  ) {
    const file = path.join(web, name)

    if (fs.existsSync(file)) {
      process.loadEnvFile(file)
    }
  }

  const optional =
    process.argv.includes(
      '--if-configured',
    )

  const hasNativeConfiguration =
    process.env.ANDROID_APPLICATION_ID
    || process.env.IOS_BUNDLE_IDENTIFIER
    || process.env.APPLE_TEAM_ID

  // CHỨC NĂNG: Cho phép build web khi chưa phát hành app riêng.
  // XỬ LÝ: Không tự tạo association bằng giá trị ví dụ.
  if (
    optional
    && !hasNativeConfiguration
  ) {
    console.log(
      'Chưa cấu hình app ký riêng; chỉ build website.',
    )

    process.exit(0)
  }

  const files =
    associationFiles(process.env)

  const folder = path.resolve(
    __dirname,
    '../apps/web/static/.well-known',
  )

  fs.mkdirSync(folder, {
    recursive: true,
  })

  // CHỨC NĂNG: Ghi kết quả sau khi mọi cấu hình đã được kiểm tra.
  // XỬ LÝ: Xóa file cũ của nền tảng đã bỏ cấu hình để tránh deploy nhầm.
  for (
    const name of [
      'assetlinks.json',
      'apple-app-site-association',
    ]
  ) {
    const file = path.join(folder, name)

    if (files[name]) {
      fs.writeFileSync(
        file,
        JSON.stringify(
          files[name],
          null,
          2,
        ) + '\n',
      )
    } else {
      fs.rmSync(file, {
        force: true,
      })
    }
  }

  console.log(
    'Đã tạo:',
    Object.keys(files).join(', '),
  )
}

module.exports = {
  associationFiles,
}