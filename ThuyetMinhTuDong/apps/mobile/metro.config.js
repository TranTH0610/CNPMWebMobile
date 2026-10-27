/**
 * FILE NÀY LÀM GÌ:
 * Giúp Expo tìm package TypeScript trong monorepo.
 * Expo Metro đọc khi khởi động mobile.
 * Phụ thuộc expo/metro-config và path của Node.
 */

const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const { createRequire } = require('node:module')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

// CHỨC NĂNG: Lấy cấu hình mặc định đúng SDK.
// XỬ LÝ: Không tự dựng lại toàn bộ cấu hình Metro.
const config = getDefaultConfig(projectRoot)

// CHỨC NĂNG: Theo dõi cả package dùng chung.
// XỬ LÝ: Sửa file trong packages cũng được Metro nhận.
config.watchFolders = [workspaceRoot]

// CHỨC NĂNG: Tìm dependency tại app trước, rồi thư mục gốc.
// XỬ LÝ: Phù hợp npm workspaces có dependency được hoist.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// CHỨC NĂNG: Chọn React của mobile cho cả source trong packages dùng chung.
// XỬ LÝ: Web giữ React 18; native cần React 19.3. Chỉ khóa React ở Metro,
// không ép web đổi phiên bản và không sửa cách phân giải các dependency khác.
const mobileRequire = createRequire(path.join(projectRoot, 'package.json'))
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return { type: 'sourceFile', filePath: mobileRequire.resolve(moduleName) }
  }
  return context.resolveRequest(context, moduleName, platform)
}

// CHỨC NĂNG: Mỗi bản mobile dùng whitelist proxy riêng ngay trên Metro.
// XỬ LÝ: Visitor chỉ đọc công bố/gửi heartbeat; không mở document/commands/preview admin.
const { createAdminApiMiddleware } = require('../../scripts/metro-admin-proxy.cjs')
const { createVisitorApiMiddleware } = require('../../scripts/metro-visitor-proxy.cjs')
const previousMiddleware = config.server.enhanceMiddleware
const isAdmin = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
const adminProxy = createAdminApiMiddleware({ enabled: isAdmin, target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788' })
const visitorProxy = createVisitorApiMiddleware({ enabled: !isAdmin,
  catalogTarget: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
  presenceTarget: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
})
config.server.enhanceMiddleware = (middleware, server) => {
  const next = previousMiddleware ? previousMiddleware(middleware, server) : middleware
  return (req, res, fallback) => adminProxy(req, res, () => visitorProxy(req, res, () => next(req, res, fallback)))
}
module.exports = config
