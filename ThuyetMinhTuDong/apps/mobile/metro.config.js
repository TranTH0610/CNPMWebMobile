/**
 * FILE NÀY LÀM GÌ:
 * Giúp Expo tìm package TypeScript trong monorepo.
 * Expo Metro đọc khi khởi động mobile.
 * Phụ thuộc expo/metro-config và path của Node.
 */

const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

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

module.exports = config