/**
 * FILE NÀY LÀM GÌ:
 * Bổ sung cấu hình mở app bằng liên kết HTTPS.
 *
 * Được dùng bởi:
 * - Expo khi đọc cấu hình và build ứng dụng.
 *
 * Phụ thuộc:
 * - app.json.
 * - Biến môi trường trong .env của mobile.
 *
 * Liên quan: UC05.
 */

// CHỨC NĂNG: Ghép cấu hình liên kết với cấu hình Expo hiện có.
// XỬ LÝ: Giữ nguyên plugin, permission và các cấu hình khác của app.json.
module.exports = ({ config }) => {
  const value =
    process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN

  let host

  if (value) {
    const url = new URL(value)

    // CHỨC NĂNG: Bật xác minh tên miền cho HTTPS thật.
    // XỬ LÝ: HTTP LAN chỉ dành cho chạy thử web, không phải App Links.
    if (
      url.protocol === 'https:'
      && !url.hostname.endsWith('.example')
    ) {
      host = url.hostname
    }
  }

  const androidPackage =
    process.env.ANDROID_APPLICATION_ID
    || config.android?.package

  const iosBundle =
    process.env.IOS_BUNDLE_IDENTIFIER
    || config.ios?.bundleIdentifier

  return {
    ...config,

    scheme: 'hueguide',

    android: {
      ...config.android,

      ...(androidPackage
        ? {
          package: androidPackage,
        }
        : {}),

      ...(host && androidPackage
        ? {
          intentFilters: [
            ...(config.android?.intentFilters || []),

            {
              action: 'VIEW',
              autoVerify: true,

              data: [
                {
                  scheme: 'https',
                  host,
                  path: '/',
                },
                {
                  scheme: 'https',
                  host,
                  path: '/places',
                },
                {
                  scheme: 'https',
                  host,
                  pathPrefix: '/places/',
                },
              ],

              category: [
                'BROWSABLE',
                'DEFAULT',
              ],
            },
          ],
        }
        : {}),
    },

    ios: {
      ...config.ios,

      ...(iosBundle
        ? {
          bundleIdentifier: iosBundle,
        }
        : {}),

      ...(host && iosBundle
        ? {
          associatedDomains: [
            ...new Set([
              ...(config.ios?.associatedDomains || []),
              'applinks:' + host,
            ]),
          ],
        }
        : {}),
    },
  }
}