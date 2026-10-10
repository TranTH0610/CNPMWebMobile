const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const config = getDefaultConfig(projectRoot)

// CHỨC NĂNG: cho Metro nhìn thấy thư mục gốc monorepo
config.watchFolders = [workspaceRoot]
// CHỨC NĂNG: tìm thư viện ở cả node_modules của app lẫn của thư mục gốc
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
module.exports = config