/**
 * FILE NÀY LÀM GÌ
 * Sinh các tệp association Android/iOS từ cấu hình định danh và chứng thư cho liên kết mở ứng
 * dụng.
 *
 * VỊ TRÍ: scripts/generate-app-links.cjs
 * DÙNG BỞI: scripts/app-links.test.cjs.
 * PHỤ THUỘC: node:fs; node:path
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')

// CHỨC NĂNG: Tạo dữ liệu xác minh từ cấu hình.
// XỬ LÝ: Không phát hành file chứa ID hoặc chứng thư giả.
// Khai báo associationFiles(env). Nhận đầu vào qua tham số.
function associationFiles(env) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const origin = new URL(`: Khai báo origin: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
   * DÒNG `env.VITE_PUBLIC_SITE_URL || '',`: Khai báo origin: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const origin = new URL(
    env.VITE_PUBLIC_SITE_URL || '',
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `origin.protocol !== 'https:'`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.pathname !== '/'`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.search`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.hash`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.username`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.password`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.hostname === 'localhost'`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `|| origin.hostname.endsWith('.example')`: Rẽ nhánh nếu origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username ||.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error(`: Ném new Error( 'VITE_PUBLIC_SITE_URL phải là origin HTTPS thật', ).
     * DÒNG `'VITE_PUBLIC_SITE_URL phải là origin HTTPS thật',`: Ném new Error( 'VITE_PUBLIC_SITE_URL phải là origin HTTPS thật', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error(
      'VITE_PUBLIC_SITE_URL phải là origin HTTPS thật',
    )
  }

  // Khai báo files: tạo object gồm.
  const files = {}

  // CHỨC NĂNG: Tạo assetlinks.json cho Android.
  // XỬ LÝ: Kiểm tra application ID và định dạng SHA-256.
  // Rẽ nhánh nếu env.ANDROID_APPLICATION_ID.
  if (env.ANDROID_APPLICATION_ID) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const fingerprints = (`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `env.ANDROID_SHA256_CERT_FINGERPRINTS || ''`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `.split(',')`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `.map(`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `(value) =>`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `value.trim().toUpperCase(),`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `.filter(Boolean)`: Khai báo fingerprints: (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     */
    const fingerprints = (
      env.ANDROID_SHA256_CERT_FINGERPRINTS || ''
    )
      .split(',')
      .map(
        (value) =>
          value.trim().toUpperCase(),
      )
      .filter(Boolean)

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const validApplicationId =`: Khai báo validApplicationId: Gọi /^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)+$/ .test(env.ANDROID_APPLICATION_ID).
     * DÒNG `/^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)+$/`: Khai báo validApplicationId: Gọi /^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)+$/ .test(env.ANDROID_APPLICATION_ID).
     * DÒNG `.test(env.ANDROID_APPLICATION_ID)`: Khai báo validApplicationId: Gọi /^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)+$/ .test(env.ANDROID_APPLICATION_ID).
     */
    const validApplicationId =
      /^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)+$/
        .test(env.ANDROID_APPLICATION_ID)

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const invalidFingerprint =`: Khai báo invalidFingerprint: fingerprints.some kiểm tra có ít nhất một phần tử đạt điều kiện.
     * DÒNG `fingerprints.some(`: Khai báo invalidFingerprint: fingerprints.some kiểm tra có ít nhất một phần tử đạt điều kiện.
     * DÒNG `(value) =>`: Khai báo invalidFingerprint: fingerprints.some kiểm tra có ít nhất một phần tử đạt điều kiện.
     * DÒNG `!/^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/`: Khai báo invalidFingerprint: fingerprints.some kiểm tra có ít nhất một phần tử đạt điều kiện.
     * DÒNG `.test(value),`: Khai báo invalidFingerprint: fingerprints.some kiểm tra có ít nhất một phần tử đạt điều kiện.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    const invalidFingerprint =
      fingerprints.some(
        (value) =>
          !/^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/
            .test(value),
      )

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (`: Rẽ nhánh nếu !validApplicationId || !fingerprints.length || invalidFingerprint.
     * DÒNG `!validApplicationId`: Rẽ nhánh nếu !validApplicationId || !fingerprints.length || invalidFingerprint.
     * DÒNG `|| !fingerprints.length`: Rẽ nhánh nếu !validApplicationId || !fingerprints.length || invalidFingerprint.
     * DÒNG `|| invalidFingerprint`: Rẽ nhánh nếu !validApplicationId || !fingerprints.length || invalidFingerprint.
     * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    if (
      !validApplicationId
      || !fingerprints.length
      || invalidFingerprint
    ) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error(`: Ném new Error( 'Cần Android application ID và SHA-256 chứng thư ký thật', ).
       * DÒNG `'Cần Android application ID và SHA-256 chứng thư ký thật',`: Ném new Error( 'Cần Android application ID và SHA-256 chứng thư ký thật', ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      throw new Error(
        'Cần Android application ID và SHA-256 chứng thư ký thật',
      )
    }

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `files['assetlinks.json'] = [`: Thực hiện tính biểu thức files['assetlinks.json'] = [ { relation: [ 'delegate_permission/common.handle_all_urls', ].
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    files['assetlinks.json'] = [
      {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `relation: [`: Gán thuộc tính relation: tạo mảng [ 'delegate_permission/common.handle_all_urls', ].
         * DÒNG `'delegate_permission/common.handle_all_urls',`: Gán thuộc tính relation: tạo mảng [ 'delegate_permission/common.handle_all_urls', ].
         * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
         */
        relation: [
          'delegate_permission/common.handle_all_urls',
        ],

        // Gán thuộc tính target: tạo object gồm namespace, package_name, sha256_cert_fingerprints.
        target: {
          // Gán thuộc tính namespace: chuỗi 'android_app'.
          namespace: 'android_app',

          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `package_name:`: Gán thuộc tính package_name: đọc env.ANDROID_APPLICATION_ID từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `env.ANDROID_APPLICATION_ID,`: Gán thuộc tính package_name: đọc env.ANDROID_APPLICATION_ID từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           */
          package_name:
            env.ANDROID_APPLICATION_ID,

          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `sha256_cert_fingerprints:`: Gán thuộc tính sha256_cert_fingerprints: sử dụng fingerprints làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `fingerprints,`: Gán thuộc tính sha256_cert_fingerprints: sử dụng fingerprints làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          sha256_cert_fingerprints:
            fingerprints,
        },
      },
    ]
  }

  // CHỨC NĂNG: Tạo AASA cho iOS Universal Links.
  // XỬ LÝ: Apple Team ID và bundle ID phải khớp bản app được ký.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu env.IOS_BUNDLE_IDENTIFIER || env.APPLE_TEAM_ID.
   * DÒNG `env.IOS_BUNDLE_IDENTIFIER`: Rẽ nhánh nếu env.IOS_BUNDLE_IDENTIFIER || env.APPLE_TEAM_ID.
   * DÒNG `|| env.APPLE_TEAM_ID`: Rẽ nhánh nếu env.IOS_BUNDLE_IDENTIFIER || env.APPLE_TEAM_ID.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    env.IOS_BUNDLE_IDENTIFIER
    || env.APPLE_TEAM_ID
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const validTeam =`: Khai báo validTeam: Gọi /^[A-Z0-9]{10}$/.test( env.APPLE_TEAM_ID || '', ).
     * DÒNG `/^[A-Z0-9]{10}$/.test(`: Khai báo validTeam: Gọi /^[A-Z0-9]{10}$/.test( env.APPLE_TEAM_ID || '', ).
     * DÒNG `env.APPLE_TEAM_ID || '',`: Khai báo validTeam: Gọi /^[A-Z0-9]{10}$/.test( env.APPLE_TEAM_ID || '', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    const validTeam =
      /^[A-Z0-9]{10}$/.test(
        env.APPLE_TEAM_ID || '',
      )

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const validBundle =`: Khai báo validBundle: Gọi /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/ .test( env.IOS_BUNDLE_IDENTIFIER || '', ).
     * DÒNG `/^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/`: Khai báo validBundle: Gọi /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/ .test( env.IOS_BUNDLE_IDENTIFIER || '', ).
     * DÒNG `.test(`: Khai báo validBundle: Gọi /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/ .test( env.IOS_BUNDLE_IDENTIFIER || '', ).
     * DÒNG `env.IOS_BUNDLE_IDENTIFIER || '',`: Khai báo validBundle: Gọi /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/ .test( env.IOS_BUNDLE_IDENTIFIER || '', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    const validBundle =
      /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
        .test(
          env.IOS_BUNDLE_IDENTIFIER || '',
        )

    // Rẽ nhánh nếu !validTeam || !validBundle.
    if (!validTeam || !validBundle) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error(`: Ném new Error( 'Cần Apple Team ID và bundle identifier thật', ).
       * DÒNG `'Cần Apple Team ID và bundle identifier thật',`: Ném new Error( 'Cần Apple Team ID và bundle identifier thật', ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      throw new Error(
        'Cần Apple Team ID và bundle identifier thật',
      )
    }

    // Thực hiện tính biểu thức files['apple-app-site-association'] = { applinks: { apps: [], details: [ { appID: env.APPL.
    files['apple-app-site-association'] = {
      // Gán thuộc tính applinks: tạo object gồm apps, details.
      applinks: {
        // Gán thuộc tính apps: tạo mảng [].
        apps: [],

        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `details: [`: Gán thuộc tính details: tạo mảng [ { appID: env.APPLE_TEAM_ID + '.' + env.IOS_BUNDLE_IDENTIFIER, paths: [ '/', '/.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         */
        details: [
          {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `appID:`: Gán thuộc tính appID: tính biểu thức env.APPLE_TEAM_ID + '.' + env.IOS_BUNDLE_IDENTIFIER.
             * DÒNG `env.APPLE_TEAM_ID`: Gán thuộc tính appID: tính biểu thức env.APPLE_TEAM_ID + '.' + env.IOS_BUNDLE_IDENTIFIER.
             * DÒNG `+ '.'`: Gán thuộc tính appID: tính biểu thức env.APPLE_TEAM_ID + '.' + env.IOS_BUNDLE_IDENTIFIER.
             * DÒNG `+ env.IOS_BUNDLE_IDENTIFIER,`: Gán thuộc tính appID: tính biểu thức env.APPLE_TEAM_ID + '.' + env.IOS_BUNDLE_IDENTIFIER.
             */
            appID:
              env.APPLE_TEAM_ID
              + '.'
              + env.IOS_BUNDLE_IDENTIFIER,

            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `paths: [`: Gán thuộc tính paths: tạo mảng [ '/', '/places', '/places/', '/places/*', ].
             * DÒNG `'/',`: Gán thuộc tính paths: tạo mảng [ '/', '/places', '/places/', '/places/*', ].
             * DÒNG `'/places',`: Gán thuộc tính paths: tạo mảng [ '/', '/places', '/places/', '/places/*', ].
             * DÒNG `'/places/',`: Gán thuộc tính paths: tạo mảng [ '/', '/places', '/places/', '/places/*', ].
             * DÒNG `'/places/*',`: Gán thuộc tính paths: tạo mảng [ '/', '/places', '/places/', '/places/*', ].
             * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
             * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
             * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
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

  // Rẽ nhánh nếu !Object.keys(files).length.
  if (!Object.keys(files).length) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error(`: Ném new Error( 'Chưa cấu hình Android hoặc iOS', ).
     * DÒNG `'Chưa cấu hình Android hoặc iOS',`: Ném new Error( 'Chưa cấu hình Android hoặc iOS', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error(
      'Chưa cấu hình Android hoặc iOS',
    )
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return files`: Trả kết quả: sử dụng files làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return files
}
// TẠI SAO (associationFiles): Hệ điều hành cần đúng định danh và chứng thư để liên kết HTTPS
// được xác minh cho ứng dụng.

// CHỨC NĂNG: Chỉ thực thi ghi file khi chạy script trực tiếp.
// XỬ LÝ: Khi test require file này, không tự ghi file vào dự án.
// Rẽ nhánh nếu require.main === module.
if (require.main === module) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const web = path.resolve(`: Khai báo web: Gọi path.resolve( __dirname, '../apps/web', ).
   * DÒNG `__dirname,`: Khai báo web: Gọi path.resolve( __dirname, '../apps/web', ).
   * DÒNG `'../apps/web',`: Khai báo web: Gọi path.resolve( __dirname, '../apps/web', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const web = path.resolve(
    __dirname,
    '../apps/web',
  )

  // CHỨC NĂNG: Đọc cấu hình môi trường của web.
  // XỬ LÝ: Biến từ hosting/shell ưu tiên hơn file .env.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `for (`: Duyệt lần lượt [ '.env.production.local', '.env.local', '.env.production', '.env', ] bằng const name.
   * DÒNG `const name of [`: Duyệt lần lượt [ '.env.production.local', '.env.local', '.env.production', '.env', ] bằng const name.
   * DÒNG `'.env.production.local',`: Duyệt lần lượt [ '.env.production.local', '.env.local', '.env.production', '.env', ] bằng const name.
   * DÒNG `'.env.local',`: Duyệt lần lượt [ '.env.production.local', '.env.local', '.env.production', '.env', ] bằng const name.
   * DÒNG `'.env.production',`: Duyệt lần lượt [ '.env.production.local', '.env.local', '.env.production', '.env', ] bằng const name.
   * DÒNG `'.env',`: Duyệt lần lượt [ '.env.production.local', '.env.local', '.env.production', '.env', ] bằng const name.
   * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  for (
    const name of [
      '.env.production.local',
      '.env.local',
      '.env.production',
      '.env',
    ]
  ) {
    // Khai báo file: Gọi path.join(web, name).
    const file = path.join(web, name)

    // Rẽ nhánh nếu fs.existsSync(file).
    if (fs.existsSync(file)) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `process.loadEnvFile(file)`: Thực hiện Gọi process.loadEnvFile(file).
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      process.loadEnvFile(file)
    }
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const optional =`: Khai báo optional: Gọi process.argv.includes( '--if-configured', ).
   * DÒNG `process.argv.includes(`: Khai báo optional: Gọi process.argv.includes( '--if-configured', ).
   * DÒNG `'--if-configured',`: Khai báo optional: Gọi process.argv.includes( '--if-configured', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const optional =
    process.argv.includes(
      '--if-configured',
    )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const hasNativeConfiguration =`: Khai báo hasNativeConfiguration: tính biểu thức process.env.ANDROID_APPLICATION_ID || process.env.IOS_BUNDLE_IDENTIFIER || process.env.APP.
   * DÒNG `process.env.ANDROID_APPLICATION_ID`: Khai báo hasNativeConfiguration: tính biểu thức process.env.ANDROID_APPLICATION_ID || process.env.IOS_BUNDLE_IDENTIFIER || process.env.APP.
   * DÒNG `|| process.env.IOS_BUNDLE_IDENTIFIER`: Khai báo hasNativeConfiguration: tính biểu thức process.env.ANDROID_APPLICATION_ID || process.env.IOS_BUNDLE_IDENTIFIER || process.env.APP.
   * DÒNG `|| process.env.APPLE_TEAM_ID`: Khai báo hasNativeConfiguration: tính biểu thức process.env.ANDROID_APPLICATION_ID || process.env.IOS_BUNDLE_IDENTIFIER || process.env.APP.
   */
  const hasNativeConfiguration =
    process.env.ANDROID_APPLICATION_ID
    || process.env.IOS_BUNDLE_IDENTIFIER
    || process.env.APPLE_TEAM_ID

  // CHỨC NĂNG: Cho phép build web khi chưa phát hành app riêng.
  // XỬ LÝ: Không tự tạo association bằng giá trị ví dụ.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu optional && !hasNativeConfiguration.
   * DÒNG `optional`: Rẽ nhánh nếu optional && !hasNativeConfiguration.
   * DÒNG `&& !hasNativeConfiguration`: Rẽ nhánh nếu optional && !hasNativeConfiguration.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    optional
    && !hasNativeConfiguration
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `console.log(`: Thực hiện Gọi console.log( 'Chưa cấu hình app ký riêng.
     * DÒNG `'Chưa cấu hình app ký riêng; chỉ build website.',`: Thực hiện Gọi console.log( 'Chưa cấu hình app ký riêng.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    console.log(
      'Chưa cấu hình app ký riêng; chỉ build website.',
    )

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `process.exit(0)`: Thực hiện Gọi process.exit(0).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    process.exit(0)
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const files =`: Khai báo files: Gọi associationFiles(process.env).
   * DÒNG `associationFiles(process.env)`: Khai báo files: Gọi associationFiles(process.env).
   */
  const files =
    associationFiles(process.env)

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const folder = path.resolve(`: Khai báo folder: Gọi path.resolve( __dirname, '../apps/web/static/.well-known', ).
   * DÒNG `__dirname,`: Khai báo folder: Gọi path.resolve( __dirname, '../apps/web/static/.well-known', ).
   * DÒNG `'../apps/web/static/.well-known',`: Khai báo folder: Gọi path.resolve( __dirname, '../apps/web/static/.well-known', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const folder = path.resolve(
    __dirname,
    '../apps/web/static/.well-known',
  )

  // Thực hiện Gọi fs.mkdirSync(folder, { recursive: true, }).
  fs.mkdirSync(folder, {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `recursive: true,`: Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    recursive: true,
  })

  // CHỨC NĂNG: Ghi kết quả sau khi mọi cấu hình đã được kiểm tra.
  // XỬ LÝ: Xóa file cũ của nền tảng đã bỏ cấu hình để tránh deploy nhầm.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `for (`: Duyệt lần lượt [ 'assetlinks.json', 'apple-app-site-association', ] bằng const name.
   * DÒNG `const name of [`: Duyệt lần lượt [ 'assetlinks.json', 'apple-app-site-association', ] bằng const name.
   * DÒNG `'assetlinks.json',`: Duyệt lần lượt [ 'assetlinks.json', 'apple-app-site-association', ] bằng const name.
   * DÒNG `'apple-app-site-association',`: Duyệt lần lượt [ 'assetlinks.json', 'apple-app-site-association', ] bằng const name.
   * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  for (
    const name of [
      'assetlinks.json',
      'apple-app-site-association',
    ]
  ) {
    // Khai báo file: Gọi path.join(folder, name).
    const file = path.join(folder, name)

    // Rẽ nhánh nếu files[name].
    if (files[name]) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `fs.writeFileSync(`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `file,`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `JSON.stringify(`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `files[name],`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `null,`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `2,`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `) + '\n',`: Thực hiện Gọi fs.writeFileSync( file, JSON.stringify( files[name], null, 2, ) + '\n', ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `} else {`: Xác định thân khối lệnh.
       */
      fs.writeFileSync(
        file,
        JSON.stringify(
          files[name],
          null,
          2,
        ) + '\n',
      )
    } else {
      // Thực hiện Gọi fs.rmSync(file, { force: true, }).
      fs.rmSync(file, {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `force: true,`: Gán thuộc tính force: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        force: true,
      })
    }
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `console.log(`: Thực hiện Gọi console.log( 'Đã tạo:', Object.keys(files).join(', '), ).
   * DÒNG `'Đã tạo:',`: Thực hiện Gọi console.log( 'Đã tạo:', Object.keys(files).join(', '), ).
   * DÒNG `Object.keys(files).join(', '),`: Thực hiện Gọi console.log( 'Đã tạo:', Object.keys(files).join(', '), ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  console.log(
    'Đã tạo:',
    Object.keys(files).join(', '),
  )
}

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `module.exports = {`: Thực hiện tính biểu thức module.exports = { associationFiles, }.
 * DÒNG `associationFiles,`: Đặt trường associationFiles bằng giá trị của biến cùng tên.
 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
 */
module.exports = {
  associationFiles,
}