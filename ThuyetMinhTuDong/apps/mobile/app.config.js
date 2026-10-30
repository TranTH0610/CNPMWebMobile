/**
 * FILE NÀY LÀM GÌ
 * Ghép cấu hình Expo động với biến môi trường, App Links, định danh ứng dụng và cấu hình bản đồ
 * nếu có.
 *
 * VỊ TRÍ: apps/mobile/app.config.js
 * DÙNG BỞI: scripts/app-links.test.cjs.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// CHỨC NĂNG: Ghép cấu hình liên kết với cấu hình Expo hiện có.
// XỬ LÝ: Giữ nguyên plugin, permission và các cấu hình khác của app.json.
// Thực hiện tính biểu thức module.exports = ({ config }) => { const value = process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGI.
module.exports = ({ config }) => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const value =`: Khai báo value: đọc process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN`: Khai báo value: đọc process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN từ đối tượng/mảng để dùng tại bước hiện tại.
   */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (`: Rẽ nhánh nếu url.protocol === 'https:' && !url.hostname.endsWith('.example').
     * DÒNG `url.protocol === 'https:'`: Rẽ nhánh nếu url.protocol === 'https:' && !url.hostname.endsWith('.example').
     * DÒNG `&& !url.hostname.endsWith('.example')`: Rẽ nhánh nếu url.protocol === 'https:' && !url.hostname.endsWith('.example').
     * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    if (
      url.protocol === 'https:'
      && !url.hostname.endsWith('.example')
    ) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `host = url.hostname`: Thực hiện tính biểu thức host = url.hostname.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      host = url.hostname
    }
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const androidPackage =`: Khai báo androidPackage: tính biểu thức process.env.ANDROID_APPLICATION_ID || config.android?.package.
   * DÒNG `process.env.ANDROID_APPLICATION_ID`: Khai báo androidPackage: tính biểu thức process.env.ANDROID_APPLICATION_ID || config.android?.package.
   * DÒNG `|| config.android?.package`: Khai báo androidPackage: tính biểu thức process.env.ANDROID_APPLICATION_ID || config.android?.package.
   */
  const androidPackage =
    process.env.ANDROID_APPLICATION_ID
    || config.android?.package

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const iosBundle =`: Khai báo iosBundle: tính biểu thức process.env.IOS_BUNDLE_IDENTIFIER || config.ios?.bundleIdentifier.
   * DÒNG `process.env.IOS_BUNDLE_IDENTIFIER`: Khai báo iosBundle: tính biểu thức process.env.IOS_BUNDLE_IDENTIFIER || config.ios?.bundleIdentifier.
   * DÒNG `|| config.ios?.bundleIdentifier`: Khai báo iosBundle: tính biểu thức process.env.IOS_BUNDLE_IDENTIFIER || config.ios?.bundleIdentifier.
   */
  const iosBundle =
    process.env.IOS_BUNDLE_IDENTIFIER
    || config.ios?.bundleIdentifier

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm ...giá trị ghép, scheme, android, ios.
   * DÒNG `...config,`: Trả kết quả: tạo object gồm ...giá trị ghép, scheme, android, ios.
   */
  return {
    ...config,

    // Gán thuộc tính scheme: chuỗi 'hueguide'.
    scheme: 'hueguide',

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `android: {`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     * DÒNG `...config.android,`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     * DÒNG `...(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? { config: { ...config.android?.conf`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép. | Gán thuộc tính config: tạo object gồm ...giá trị ghép, googleMaps. | Gán thuộc tính googleMaps: tạo object gồm ...giá trị ghép, apiKey. | Gán thuộc tính apiKey: đọc process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `...(androidPackage`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     * DÒNG `? {`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     */
    android: {
      ...config.android,
      ...(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? { config: { ...config.android?.config, googleMaps: { ...config.android?.config?.googleMaps, apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY } } } : {}),

      ...(androidPackage
        ? {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `package: androidPackage,`: Gán thuộc tính package: sử dụng androidPackage làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `: {}),`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           * DÒNG `...(host && androidPackage`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           * DÒNG `? {`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           */
          package: androidPackage,
        }
        : {}),

      ...(host && androidPackage
        ? {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `intentFilters: [`: Gán thuộc tính intentFilters: tạo mảng [ ...(config.android?.intentFilters || []), { action: 'VIEW', autoVerify: true,.
           * DÒNG `...(config.android?.intentFilters || []),`: Gán thuộc tính intentFilters: tạo mảng [ ...(config.android?.intentFilters || []), { action: 'VIEW', autoVerify: true,.
           * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
           */
          intentFilters: [
            ...(config.android?.intentFilters || []),

            {
              // Gán thuộc tính action: chuỗi 'VIEW'.
              action: 'VIEW',
              // Gán thuộc tính autoVerify: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
              autoVerify: true,

              /* GIẢI THÍCH TỪNG DÒNG:
               * DÒNG `data: [`: Gán thuộc tính data: tạo mảng [ { scheme: 'https', host, path: '/', }, { scheme: 'https', host, path: '/places.
               * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
               */
              data: [
                {
                  /* GIẢI THÍCH TỪNG DÒNG:
                   * DÒNG `scheme: 'https',`: Gán thuộc tính scheme: chuỗi 'https'.
                   * DÒNG `host,`: Đặt trường host bằng giá trị của biến cùng tên.
                   */
                  scheme: 'https',
                  host,
                  /* GIẢI THÍCH TỪNG DÒNG:
                   * DÒNG `path: '/',`: Gán thuộc tính path: chuỗi '/'.
                   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
                   */
                  path: '/',
                },
                {
                  /* GIẢI THÍCH TỪNG DÒNG:
                   * DÒNG `scheme: 'https',`: Gán thuộc tính scheme: chuỗi 'https'.
                   * DÒNG `host,`: Đặt trường host bằng giá trị của biến cùng tên.
                   */
                  scheme: 'https',
                  host,
                  /* GIẢI THÍCH TỪNG DÒNG:
                   * DÒNG `path: '/places',`: Gán thuộc tính path: chuỗi '/places'.
                   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
                   */
                  path: '/places',
                },
                {
                  /* GIẢI THÍCH TỪNG DÒNG:
                   * DÒNG `scheme: 'https',`: Gán thuộc tính scheme: chuỗi 'https'.
                   * DÒNG `host,`: Đặt trường host bằng giá trị của biến cùng tên.
                   */
                  scheme: 'https',
                  host,
                  /* GIẢI THÍCH TỪNG DÒNG:
                   * DÒNG `pathPrefix: '/places/',`: Gán thuộc tính pathPrefix: chuỗi '/places/'.
                   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
                   */
                  pathPrefix: '/places/',
                },
              ],

              /* GIẢI THÍCH TỪNG DÒNG:
               * DÒNG `category: [`: Gán thuộc tính category: tạo mảng [ 'BROWSABLE', 'DEFAULT', ].
               * DÒNG `'BROWSABLE',`: Gán thuộc tính category: tạo mảng [ 'BROWSABLE', 'DEFAULT', ].
               * DÒNG `'DEFAULT',`: Gán thuộc tính category: tạo mảng [ 'BROWSABLE', 'DEFAULT', ].
               * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
               * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
               * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
               * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
               * DÒNG `: {}),`: Gán thuộc tính android: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
               * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
               */
              category: [
                'BROWSABLE',
                'DEFAULT',
              ],
            },
          ],
        }
        : {}),
    },

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ios: {`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     * DÒNG `...config.ios,`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     * DÒNG `...(iosBundle`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     * DÒNG `? {`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
     */
    ios: {
      ...config.ios,

      ...(iosBundle
        ? {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `bundleIdentifier: iosBundle,`: Gán thuộc tính bundleIdentifier: sử dụng iosBundle làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `: {}),`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           * DÒNG `...(host && iosBundle`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           * DÒNG `? {`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           */
          bundleIdentifier: iosBundle,
        }
        : {}),

      ...(host && iosBundle
        ? {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `associatedDomains: [`: Gán thuộc tính associatedDomains: tạo mảng [ ...new Set([ ...(config.ios?.associatedDomains || []), 'applinks:' + host, ]),.
           * DÒNG `...new Set([`: Gán thuộc tính associatedDomains: tạo mảng [ ...new Set([ ...(config.ios?.associatedDomains || []), 'applinks:' + host, ]),.
           * DÒNG `...(config.ios?.associatedDomains || []),`: Gán thuộc tính associatedDomains: tạo mảng [ ...new Set([ ...(config.ios?.associatedDomains || []), 'applinks:' + host, ]),.
           * DÒNG `'applinks:' + host,`: Gán thuộc tính associatedDomains: tạo mảng [ ...new Set([ ...(config.ios?.associatedDomains || []), 'applinks:' + host, ]),.
           * DÒNG `]),`: Kết thúc danh sách phần tử trong mảng.
           * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `: {}),`: Gán thuộc tính ios: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
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