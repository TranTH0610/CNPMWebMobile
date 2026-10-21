/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra TypeScript và quy tắc hooks cho UC01–UC05.
 * Các script lint sử dụng.
 * Phụ thuộc ESLint, TypeScript parser và các plugin.
 */

// CHỨC NĂNG: Phát hiện lỗi code phổ biến.
// XỬ LÝ: Không ép cách xuống dòng; loại các file build tự sinh.
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

  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.test-build/',
  ],

  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
}