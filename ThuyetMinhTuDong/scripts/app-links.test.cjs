/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra association Android/iOS và giữ cấu hình Expo khi bật App Links.
 *
 * VỊ TRÍ: scripts/app-links.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ./generate-app-links.cjs; ../apps/mobile/app.config.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { test, }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `test,`: Khai báo { test, }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('node:test')`: Khai báo { test, }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  test,
} = require('node:test')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const assert =`: Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `require('node:assert/strict')`: Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
 */
const assert =
  require('node:assert/strict')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { associationFiles, }: require nạp module './generate-app-links.cjs' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `associationFiles,`: Khai báo { associationFiles, }: require nạp module './generate-app-links.cjs' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('./generate-app-links.cjs')`: Khai báo { associationFiles, }: require nạp module './generate-app-links.cjs' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  associationFiles,
} = require('./generate-app-links.cjs')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const configure =`: Khai báo configure: require nạp module '../apps/mobile/app.config.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `require('../apps/mobile/app.config.js')`: Khai báo configure: require nạp module '../apps/mobile/app.config.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const configure =
  require('../apps/mobile/app.config.js')

// CHỨC NĂNG: Cung cấp dữ liệu riêng cho test.
// XỬ LÝ: Đây là fixture, không được dùng làm thông tin triển khai thật.
// Khai báo env: tạo object gồm VITE_PUBLIC_SITE_URL, ANDROID_APPLICATION_ID, ANDROID_SHA256_CERT_FINGERPRINTS, IOS_BUNDLE_IDENTIFIER, APPLE_TEAM_ID.
const env = {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `VITE_PUBLIC_SITE_URL:`: Gán thuộc tính VITE_PUBLIC_SITE_URL: chuỗi 'https://guide.test'.
   * DÒNG `'https://guide.test',`: Gán thuộc tính VITE_PUBLIC_SITE_URL: chuỗi 'https://guide.test'.
   */
  VITE_PUBLIC_SITE_URL:
    'https://guide.test',

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `ANDROID_APPLICATION_ID:`: Gán thuộc tính ANDROID_APPLICATION_ID: chuỗi 'vn.test.guide'.
   * DÒNG `'vn.test.guide',`: Gán thuộc tính ANDROID_APPLICATION_ID: chuỗi 'vn.test.guide'.
   */
  ANDROID_APPLICATION_ID:
    'vn.test.guide',

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `ANDROID_SHA256_CERT_FINGERPRINTS:`: Gán thuộc tính ANDROID_SHA256_CERT_FINGERPRINTS: Gọi Array(32).fill('AA').join(':').
   * DÒNG `Array(32).fill('AA').join(':'),`: Gán thuộc tính ANDROID_SHA256_CERT_FINGERPRINTS: Gọi Array(32).fill('AA').join(':').
   */
  ANDROID_SHA256_CERT_FINGERPRINTS:
    Array(32).fill('AA').join(':'),

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `IOS_BUNDLE_IDENTIFIER:`: Gán thuộc tính IOS_BUNDLE_IDENTIFIER: chuỗi 'vn.test.guide'.
   * DÒNG `'vn.test.guide',`: Gán thuộc tính IOS_BUNDLE_IDENTIFIER: chuỗi 'vn.test.guide'.
   */
  IOS_BUNDLE_IDENTIFIER:
    'vn.test.guide',

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `APPLE_TEAM_ID:`: Gán thuộc tính APPLE_TEAM_ID: chuỗi 'ABCDEFGHIJ'.
   * DÒNG `'ABCDEFGHIJ',`: Gán thuộc tính APPLE_TEAM_ID: chuỗi 'ABCDEFGHIJ'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  APPLE_TEAM_ID:
    'ABCDEFGHIJ',
}

// CHỨC NĂNG: Kiểm tra nội dung file xác minh.
// XỬ LÝ: ID phải đúng và cấu hình thiếu chứng thư phải bị từ chối.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `test(`: Khẳng định kết quả thử nghiệm bằng test( 'Sinh đúng association Android/iOS và từ chối thiếu chứng thư', () => { const files = associationFiles(env) assert.
 * DÒNG `'Sinh đúng association Android/iOS và từ chối thiếu chứng thư',`: Khẳng định kết quả thử nghiệm bằng test( 'Sinh đúng association Android/iOS và từ chối thiếu chứng thư', () => { const files = associationFiles(env) assert.
 * DÒNG `() => {`: Khẳng định kết quả thử nghiệm bằng test( 'Sinh đúng association Android/iOS và từ chối thiếu chứng thư', () => { const files = associationFiles(env) assert.
 */
test(
  'Sinh đúng association Android/iOS và từ chối thiếu chứng thư',
  () => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const files =`: Khai báo files: Gọi associationFiles(env).
     * DÒNG `associationFiles(env)`: Khai báo files: Gọi associationFiles(env).
     */
    const files =
      associationFiles(env)

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['assetlinks.json'][0] .target.package_name, env.ANDROID_APPLICATION_ID, ).
     * DÒNG `files['assetlinks.json'][0]`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['assetlinks.json'][0] .target.package_name, env.ANDROID_APPLICATION_ID, ).
     * DÒNG `.target.package_name,`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['assetlinks.json'][0] .target.package_name, env.ANDROID_APPLICATION_ID, ).
     * DÒNG `env.ANDROID_APPLICATION_ID,`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['assetlinks.json'][0] .target.package_name, env.ANDROID_APPLICATION_ID, ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    assert.equal(
      files['assetlinks.json'][0]
        .target.package_name,

      env.ANDROID_APPLICATION_ID,
    )

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['apple-app-site-association'] .applinks.details[0].appID, 'ABCDEFGHIJ.vn.test.guide', ).
     * DÒNG `files['apple-app-site-association']`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['apple-app-site-association'] .applinks.details[0].appID, 'ABCDEFGHIJ.vn.test.guide', ).
     * DÒNG `.applinks.details[0].appID,`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['apple-app-site-association'] .applinks.details[0].appID, 'ABCDEFGHIJ.vn.test.guide', ).
     * DÒNG `'ABCDEFGHIJ.vn.test.guide',`: Khẳng định kết quả thử nghiệm bằng assert.equal( files['apple-app-site-association'] .applinks.details[0].appID, 'ABCDEFGHIJ.vn.test.guide', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    assert.equal(
      files['apple-app-site-association']
        .applinks.details[0].appID,

      'ABCDEFGHIJ.vn.test.guide',
    )

    // Khẳng định kết quả thử nghiệm bằng assert.throws(() => { associationFiles({ ...env, ANDROID_SHA256_CERT_FINGERPRINTS: '', }) }).
    assert.throws(() => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `associationFiles({`: Thực hiện Gọi associationFiles({ ...env, ANDROID_SHA256_CERT_FINGERPRINTS: '', }).
       * DÒNG `...env,`: Thực hiện Gọi associationFiles({ ...env, ANDROID_SHA256_CERT_FINGERPRINTS: '', }).
       */
      associationFiles({
        ...env,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `ANDROID_SHA256_CERT_FINGERPRINTS: '',`: Gán thuộc tính ANDROID_SHA256_CERT_FINGERPRINTS: chuỗi ''.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        ANDROID_SHA256_CERT_FINGERPRINTS: '',
      })
    })

    // Khẳng định kết quả thử nghiệm bằng assert.throws(() => { associationFiles({ ...env, VITE_PUBLIC_SITE_URL: 'http://localhost:5173', }) }).
    assert.throws(() => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `associationFiles({`: Thực hiện Gọi associationFiles({ ...env, VITE_PUBLIC_SITE_URL: 'http://localhost:5173', }).
       * DÒNG `...env,`: Thực hiện Gọi associationFiles({ ...env, VITE_PUBLIC_SITE_URL: 'http://localhost:5173', }).
       */
      associationFiles({
        ...env,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `VITE_PUBLIC_SITE_URL:`: Gán thuộc tính VITE_PUBLIC_SITE_URL: chuỗi 'http://localhost:5173'.
         * DÒNG `'http://localhost:5173',`: Gán thuộc tính VITE_PUBLIC_SITE_URL: chuỗi 'http://localhost:5173'.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        VITE_PUBLIC_SITE_URL:
          'http://localhost:5173',
      })
    })
  },
)

// CHỨC NĂNG: Kiểm tra việc ghép cấu hình không làm mất plugin.
// XỬ LÝ: Hoàn nguyên biến môi trường sau test để không ảnh hưởng test khác.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `test(`: Khẳng định kết quả thử nghiệm bằng test( 'Expo giữ plugin hiện có khi bật App Links', () => { const keys = [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APP.
 * DÒNG `'Expo giữ plugin hiện có khi bật App Links',`: Khẳng định kết quả thử nghiệm bằng test( 'Expo giữ plugin hiện có khi bật App Links', () => { const keys = [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APP.
 * DÒNG `() => {`: Khẳng định kết quả thử nghiệm bằng test( 'Expo giữ plugin hiện có khi bật App Links', () => { const keys = [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APP.
 */
test(
  'Expo giữ plugin hiện có khi bật App Links',
  () => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const keys = [`: Khai báo keys: tạo mảng [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APPLICATION_ID', 'IOS_BUNDLE_IDENTI.
     * DÒNG `'EXPO_PUBLIC_VISITOR_WEB_ORIGIN',`: Khai báo keys: tạo mảng [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APPLICATION_ID', 'IOS_BUNDLE_IDENTI.
     * DÒNG `'ANDROID_APPLICATION_ID',`: Khai báo keys: tạo mảng [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APPLICATION_ID', 'IOS_BUNDLE_IDENTI.
     * DÒNG `'IOS_BUNDLE_IDENTIFIER',`: Khai báo keys: tạo mảng [ 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', 'ANDROID_APPLICATION_ID', 'IOS_BUNDLE_IDENTI.
     * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
     */
    const keys = [
      'EXPO_PUBLIC_VISITOR_WEB_ORIGIN',
      'ANDROID_APPLICATION_ID',
      'IOS_BUNDLE_IDENTIFIER',
    ]

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const previous = keys.map(`: Khai báo previous: keys.map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
     * DÒNG `(key) => process.env[key],`: Khai báo previous: keys.map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    const previous = keys.map(
      (key) => process.env[key],
    )

    // Bắt đầu vùng try.
    try {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN =`: Thực hiện tính biểu thức process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN = env.VITE_PUBLIC_SITE_URL.
       * DÒNG `env.VITE_PUBLIC_SITE_URL`: Thực hiện tính biểu thức process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN = env.VITE_PUBLIC_SITE_URL.
       */
      process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN =
        env.VITE_PUBLIC_SITE_URL

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `process.env.ANDROID_APPLICATION_ID =`: Thực hiện tính biểu thức process.env.ANDROID_APPLICATION_ID = env.ANDROID_APPLICATION_ID.
       * DÒNG `env.ANDROID_APPLICATION_ID`: Thực hiện tính biểu thức process.env.ANDROID_APPLICATION_ID = env.ANDROID_APPLICATION_ID.
       */
      process.env.ANDROID_APPLICATION_ID =
        env.ANDROID_APPLICATION_ID

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `process.env.IOS_BUNDLE_IDENTIFIER =`: Thực hiện tính biểu thức process.env.IOS_BUNDLE_IDENTIFIER = env.IOS_BUNDLE_IDENTIFIER.
       * DÒNG `env.IOS_BUNDLE_IDENTIFIER`: Thực hiện tính biểu thức process.env.IOS_BUNDLE_IDENTIFIER = env.IOS_BUNDLE_IDENTIFIER.
       */
      process.env.IOS_BUNDLE_IDENTIFIER =
        env.IOS_BUNDLE_IDENTIFIER

      // Khai báo result: Gọi configure({ config: { plugins: [ 'expo-camera', ], }, }).
      const result = configure({
        // Gán thuộc tính config: tạo object gồm plugins.
        config: {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `plugins: [`: Gán thuộc tính plugins: tạo mảng [ 'expo-camera', ].
           * DÒNG `'expo-camera',`: Gán thuộc tính plugins: tạo mảng [ 'expo-camera', ].
           * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          plugins: [
            'expo-camera',
          ],
        },
      })

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( result.plugins, ['expo-camera'], ).
       * DÒNG `result.plugins,`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( result.plugins, ['expo-camera'], ).
       * DÒNG `['expo-camera'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( result.plugins, ['expo-camera'], ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      assert.deepEqual(
        result.plugins,
        ['expo-camera'],
      )

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( result.android.intentFilters[0] .data[0].host, 'guide.test', ).
       * DÒNG `result.android.intentFilters[0]`: Khẳng định kết quả thử nghiệm bằng assert.equal( result.android.intentFilters[0] .data[0].host, 'guide.test', ).
       * DÒNG `.data[0].host,`: Khẳng định kết quả thử nghiệm bằng assert.equal( result.android.intentFilters[0] .data[0].host, 'guide.test', ).
       * DÒNG `'guide.test',`: Khẳng định kết quả thử nghiệm bằng assert.equal( result.android.intentFilters[0] .data[0].host, 'guide.test', ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      assert.equal(
        result.android.intentFilters[0]
          .data[0].host,

        'guide.test',
      )

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( result.ios.associatedDomains, ['applinks:guide.test'], ).
       * DÒNG `result.ios.associatedDomains,`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( result.ios.associatedDomains, ['applinks:guide.test'], ).
       * DÒNG `['applinks:guide.test'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( result.ios.associatedDomains, ['applinks:guide.test'], ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `} finally {`: Bắt đầu vùng try.
       */
      assert.deepEqual(
        result.ios.associatedDomains,
        ['applinks:guide.test'],
      )
    } finally {
      // Thực hiện Gọi keys.forEach((key, index) => { if ( previous[index] === undefined ) { delete process.env[k.
      keys.forEach((key, index) => {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (`: Rẽ nhánh nếu previous[index] === undefined.
         * DÒNG `previous[index] === undefined`: Rẽ nhánh nếu previous[index] === undefined.
         * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        if (
          previous[index] === undefined
        ) {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `delete process.env[key]`: Thực hiện sử dụng delete process.env[key] làm giá trị của bước hiện tại.
           * DÒNG `} else {`: Xác định thân khối lệnh.
           */
          delete process.env[key]
        } else {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `process.env[key] =`: Thực hiện tính biểu thức process.env[key] = previous[index].
           * DÒNG `previous[index]`: Thực hiện tính biểu thức process.env[key] = previous[index].
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           */
          process.env[key] =
            previous[index]
        }
      })
    }
  },
)