/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Ghép cấu hình Expo động với biến môi trường, App Links, định danh ứng dụng và cấu hình bản đồ
 *
 * VỊ TRÍ: apps/mobile/app.config.js
 *
 * ĐƯỢC DÙNG BỞI:
 * - scripts/KiemThuLienKetUngDung.test.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// CHỨC NĂNG: Ghép cấu hình liên kết với cấu hình Expo hiện có.
// XỬ LÝ: Giữ nguyên plugin, permission và các cấu hình khác của app.json.
// Thực hiện tính biểu thức module.exports = ({ config }) => { const value = process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGI.
module.exports = ({ config }) => {
  
  const value =
    process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN

  // Khai báo host: không có giá trị khởi tạo.
  let host

  // Rẽ nhánh nếu value.
  if (value) {
    // Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
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

    // Gán thuộc tính scheme: chuỗi 'hueguide'.
    scheme: 'hueguide',

    
    android: {
      ...config.android,
      ...(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? { config: { ...config.android?.config, googleMaps: { ...config.android?.config?.googleMaps, apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY } } } : {}),

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
              // Gán thuộc tính action: chuỗi 'VIEW'.
              action: 'VIEW',
              // Gán thuộc tính autoVerify: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
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