/**
 * FILE NÀY LÀM GÌ
 * Cấu hình Metro cho monorepo và proxy phát triển; chọn proxy phù hợp bản du khách hoặc admin.
 *
 * VỊ TRÍ: apps/mobile/metro.config.js
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: expo/metro-config; path; node:module; ../../scripts/metro-admin-proxy.cjs;
 * ../../scripts/metro-visitor-proxy.cjs
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Khai báo { getDefaultConfig }: require nạp module 'expo/metro-config' để dùng chức năng có sẵn thay vì chép lại.
const { getDefaultConfig } = require('expo/metro-config')
// Khai báo path: require nạp module 'path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('path')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')

// Khai báo projectRoot: sử dụng __dirname làm giá trị của bước hiện tại.
const projectRoot = __dirname
// Khai báo workspaceRoot: Gọi path.resolve(projectRoot, '../..').
const workspaceRoot = path.resolve(projectRoot, '../..')

// CHỨC NĂNG: Lấy cấu hình mặc định đúng SDK.
// XỬ LÝ: Không tự dựng lại toàn bộ cấu hình Metro.
// Khai báo config: Gọi getDefaultConfig(projectRoot).
const config = getDefaultConfig(projectRoot)

// CHỨC NĂNG: Theo dõi cả package dùng chung.
// XỬ LÝ: Sửa file trong packages cũng được Metro nhận.
// Thực hiện tính biểu thức config.watchFolders = [workspaceRoot].
config.watchFolders = [workspaceRoot]

// CHỨC NĂNG: Tìm dependency tại app trước, rồi thư mục gốc.
// XỬ LÝ: Phù hợp npm workspaces có dependency được hoist.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `config.resolver.nodeModulesPaths = [`: Thực hiện tính biểu thức config.resolver.nodeModulesPaths = [ path.resolve(projectRoot, 'node_modules'), path.resol.
 * DÒNG `path.resolve(projectRoot, 'node_modules'),`: Thực hiện tính biểu thức config.resolver.nodeModulesPaths = [ path.resolve(projectRoot, 'node_modules'), path.resol.
 * DÒNG `path.resolve(workspaceRoot, 'node_modules'),`: Thực hiện tính biểu thức config.resolver.nodeModulesPaths = [ path.resolve(projectRoot, 'node_modules'), path.resol.
 * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
 */
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// CHỨC NĂNG: Chọn React của mobile cho cả source trong packages dùng chung.
// XỬ LÝ: Web giữ React 18; native cần React 19.3. Chỉ khóa React ở Metro,
// không ép web đổi phiên bản và không sửa cách phân giải các dependency khác.
// Khai báo mobileRequire: Gọi createRequire(path.join(projectRoot, 'package.json')).
const mobileRequire = createRequire(path.join(projectRoot, 'package.json'))
// Thực hiện tính biểu thức config.resolver.resolveRequest = (context, moduleName, platform) => { if (moduleName === '.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Rẽ nhánh nếu moduleName === 'react' || moduleName.startsWith('react/').
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return { type: 'sourceFile', filePath: mobileRequire.resolve(moduleName) }`: Trả kết quả: tạo object gồm type, filePath. | Gán thuộc tính type: chuỗi 'sourceFile'. | Gán thuộc tính filePath: Gọi mobileRequire.resolve(moduleName).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return { type: 'sourceFile', filePath: mobileRequire.resolve(moduleName) }
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return context.resolveRequest(context, moduleName, platform)`: Trả kết quả: Gọi context.resolveRequest(context, moduleName, platform).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return context.resolveRequest(context, moduleName, platform)
}

// CHỨC NĂNG: Mỗi bản mobile dùng whitelist proxy riêng ngay trên Metro.
// XỬ LÝ: Visitor chỉ đọc công bố/gửi heartbeat; không mở document/commands/preview admin.
// Khai báo { createAdminApiMiddleware }: require nạp module '../../scripts/metro-admin-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { createAdminApiMiddleware } = require('../../scripts/metro-admin-proxy.cjs')
// Khai báo { createVisitorApiMiddleware }: require nạp module '../../scripts/metro-visitor-proxy.cjs' để dùng chức năng có sẵn thay vì chép lại.
const { createVisitorApiMiddleware } = require('../../scripts/metro-visitor-proxy.cjs')
// Khai báo previousMiddleware: đọc config.server.enhanceMiddleware từ đối tượng/mảng để dùng tại bước hiện tại.
const previousMiddleware = config.server.enhanceMiddleware
// Khai báo isAdmin: tính biểu thức process.env.EXPO_PUBLIC_APP_TARGET === 'admin'.
const isAdmin = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
// Khai báo adminProxy: Gọi createAdminApiMiddleware({ enabled: isAdmin, target: process.env.CATALOG_TARGET || 'http:/. | Gán thuộc tính enabled: sử dụng isAdmin làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính target: tính biểu thức process.env.CATALOG_TARGET || 'http://127.0.0.1:8788'.
const adminProxy = createAdminApiMiddleware({ enabled: isAdmin, target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788' })
// Khai báo visitorProxy: Gọi createVisitorApiMiddleware({ enabled: !isAdmin, catalogTarget: process.env.CATALOG_TARGET. | Gán thuộc tính enabled: sử dụng !isAdmin làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
const visitorProxy = createVisitorApiMiddleware({ enabled: !isAdmin,
  // Gán thuộc tính catalogTarget: tính biểu thức process.env.CATALOG_TARGET || 'http://127.0.0.1:8788'.
  catalogTarget: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `presenceTarget: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',`: Gán thuộc tính presenceTarget: tính biểu thức process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787'.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  presenceTarget: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
})
// Thực hiện tính biểu thức config.server.enhanceMiddleware = (middleware, server) => { const next = previousMiddlewar.
config.server.enhanceMiddleware = (middleware, server) => {
  // Khai báo next: chọn giữa hai giá trị theo điều kiện previousMiddleware.
  const next = previousMiddleware ? previousMiddleware(middleware, server) : middleware
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (req, res, fallback) => adminProxy(req, res, () => visitorProxy(req, res, () =`: Trả kết quả: khai báo callback (req, res, fallback) => adminProxy(req, res, () => visitorProxy(req, res, (.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (req, res, fallback) => adminProxy(req, res, () => visitorProxy(req, res, () => next(req, res, fallback)))
}
// Thực hiện tính biểu thức module.exports = config.
module.exports = config
