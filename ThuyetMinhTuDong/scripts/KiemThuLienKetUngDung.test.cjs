/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra association Android/iOS và giữ cấu hình Expo khi bật App Links.
 *
 * VỊ TRÍ: scripts/KiemThuLienKetUngDung.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ./TaoLienKetUngDung.cjs
 * - ../apps/mobile/app.config.js
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const {
  test,
} = require('node:test')


const assert =
  require('node:assert/strict')


const {
  associationFiles,
} = require('./TaoLienKetUngDung.cjs')


const configure =
  require('../apps/mobile/app.config.js')

// CHỨC NĂNG: Cung cấp dữ liệu riêng cho test.
// XỬ LÝ: Đây là fixture, không được dùng làm thông tin triển khai thật.
// Khai báo env: tạo object gồm VITE_PUBLIC_SITE_URL, ANDROID_APPLICATION_ID, ANDROID_SHA256_CERT_FINGERPRINTS, IOS_BUNDLE_IDENTIFIER, APPLE_TEAM_ID.
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

    // Khẳng định kết quả thử nghiệm bằng assert.throws(() => { associationFiles({ ...env, ANDROID_SHA256_CERT_FINGERPRINTS: '', }) }).
    assert.throws(() => {
      
      associationFiles({
        ...env,
        
        ANDROID_SHA256_CERT_FINGERPRINTS: '',
      })
    })

    // Khẳng định kết quả thử nghiệm bằng assert.throws(() => { associationFiles({ ...env, VITE_PUBLIC_SITE_URL: 'http://localhost:5173', }) }).
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

    // Bắt đầu vùng try.
    try {
      
      process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN =
        env.VITE_PUBLIC_SITE_URL

      
      process.env.ANDROID_APPLICATION_ID =
        env.ANDROID_APPLICATION_ID

      
      process.env.IOS_BUNDLE_IDENTIFIER =
        env.IOS_BUNDLE_IDENTIFIER

      // Khai báo result: Gọi configure({ config: { plugins: [ 'expo-camera', ], }, }).
      const result = configure({
        // Gán thuộc tính config: tạo object gồm plugins.
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
      // Thực hiện Gọi keys.forEach((key, index) => { if ( previous[index] === undefined ) { delete process.env[k.
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