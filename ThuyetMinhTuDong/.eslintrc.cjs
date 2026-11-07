/**
 * FILE NÀY LÀM GÌ: Kiểm tra TypeScript, React Hooks và mã Node của dự án.
 * npm run lint gọi; không tự sửa hoặc bỏ qua lỗi biến không dùng.
 * TẠI SAO: CommonJS dùng require hợp lệ, còn TS/React vẫn áp dụng quy tắc import hiện có.
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  env: { browser: true, node: true, es2022: true },
  ignorePatterns: ['node_modules/', 'dist/', '.test-build/'],
  rules: { '@typescript-eslint/no-explicit-any': 'error' },
  overrides: [
    {
      files: ['**/*.cjs'],
      // CHỨC NĂNG: Chấp nhận require của Node CommonJS, không tắt các kiểm tra lỗi khác.
      rules: { '@typescript-eslint/no-require-imports': 'off' },
    },
  ],
}
