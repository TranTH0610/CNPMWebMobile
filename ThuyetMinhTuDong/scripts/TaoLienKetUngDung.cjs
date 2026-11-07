/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: CÔNG CỤ CHẠY DỰ ÁN
 *
 * FILE NÀY LÀM GÌ:
 * Sinh các tệp association Android/iOS từ cấu hình định danh và chứng thư cho liên kết mở ứng
 *
 * VỊ TRÍ: scripts/TaoLienKetUngDung.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - scripts/KiemThuLienKetUngDung.test.cjs
 *
 * PHỤ THUỘC:
 * - node:fs
 * - node:path
 *
 * CÁC KHỐI CHÍNH:
 * 1. associationFiles
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')

// CHỨC NĂNG: Tạo dữ liệu xác minh từ cấu hình.
// XỬ LÝ: Không phát hành file chứa ID hoặc chứng thư giả.
// Khai báo associationFiles(env). Nhận đầu vào qua tham số.
// ==================== [DIEU-HUONG] associationFiles ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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

  // Khai báo files: tạo object gồm.
  const files = {}

  // CHỨC NĂNG: Tạo assetlinks.json cho Android.
  // XỬ LÝ: Kiểm tra application ID và định dạng SHA-256.
  // Rẽ nhánh nếu env.ANDROID_APPLICATION_ID.
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

        // Gán thuộc tính target: tạo object gồm namespace, package_name, sha256_cert_fingerprints.
        target: {
          // Gán thuộc tính namespace: chuỗi 'android_app'.
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

    // Rẽ nhánh nếu !validTeam || !validBundle.
    if (!validTeam || !validBundle) {
      
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

  // Rẽ nhánh nếu !Object.keys(files).length.
  if (!Object.keys(files).length) {
    
    throw new Error(
      'Chưa cấu hình Android hoặc iOS',
    )
  }

  
  return files
}
// TẠI SAO (associationFiles): Hệ điều hành cần đúng định danh và chứng thư để liên kết HTTPS
// được xác minh cho ứng dụng.

// CHỨC NĂNG: Chỉ thực thi ghi file khi chạy script trực tiếp.
// XỬ LÝ: Khi test require file này, không tự ghi file vào dự án.
// Rẽ nhánh nếu require.main === module.
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
    // Khai báo file: Gọi path.join(web, name).
    const file = path.join(web, name)

    // Rẽ nhánh nếu fs.existsSync(file).
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

  // Thực hiện Gọi fs.mkdirSync(folder, { recursive: true, }).
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
    // Khai báo file: Gọi path.join(folder, name).
    const file = path.join(folder, name)

    // Rẽ nhánh nếu files[name].
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
      // Thực hiện Gọi fs.rmSync(file, { force: true, }).
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