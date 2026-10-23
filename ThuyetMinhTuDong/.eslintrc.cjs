/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình kiểm tra TypeScript và quy tắc React Hooks.
 *
 * Được dùng bởi:
 * - Lệnh lint của mobile, web và visitor-core.
 *
 * Phụ thuộc:
 * - eslint.
 * - @typescript-eslint/parser.
 * - @typescript-eslint/eslint-plugin.
 * - eslint-plugin-react-hooks.
 *
 * Liên quan: chất lượng code UC01–UC05.
 */

// CHỨC NĂNG: Khai báo cách ESLint đọc TypeScript và JSX.
// XỬ LÝ: Dùng chung cấu hình cho các workspace bên trong.
module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',

    ecmaFeatures: {
      jsx: true,
    },
  },

  // CHỨC NĂNG: Bật kiểm tra TypeScript và React Hooks.
  // XỬ LÝ: Dependency phải được cài tại gốc npm workspaces.
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  // CHỨC NĂNG: Bỏ qua file do công cụ tự sinh.
  // XỬ LÝ: Không kiểm tra thư viện và kết quả build như code nguồn.
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.test-build/',
  ],

  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
}