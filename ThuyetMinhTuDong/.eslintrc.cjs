/**
 * FILE NÀY LÀM GÌ
 * Cấu hình ESLint dùng chung cho TypeScript và React Hooks; không tự thay đổi code khi chỉ chạy
 * lint.
 *
 * VỊ TRÍ: .eslintrc.cjs
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * TẠI SAO TÁCH FILE: Cấu hình kiểm tra dùng chung giúp các môi trường áp dụng cùng quy tắc cho
 * mã nguồn.
 */
// CHỨC NĂNG: Khai báo cách ESLint đọc TypeScript và JSX.
// XỬ LÝ: Dùng chung cấu hình cho các workspace bên trong.
// Thực hiện tính biểu thức module.exports = { root: true, parser: '@typescript-eslint/parser', parserOptions: { ecmaV.
module.exports = {
  // Gán thuộc tính root: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  root: true,

  // Gán thuộc tính parser: chuỗi '@typescript-eslint/parser'.
  parser: '@typescript-eslint/parser',

  // Gán thuộc tính parserOptions: tạo object gồm ecmaVersion, sourceType, ecmaFeatures.
  parserOptions: {
    // Gán thuộc tính ecmaVersion: giá trị số 2022.
    ecmaVersion: 2022,
    // Gán thuộc tính sourceType: chuỗi 'module'.
    sourceType: 'module',

    // Gán thuộc tính ecmaFeatures: tạo object gồm jsx.
    ecmaFeatures: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `jsx: true,`: Gán thuộc tính jsx: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      jsx: true,
    },
  },

  // CHỨC NĂNG: Bật kiểm tra TypeScript và React Hooks.
  // XỬ LÝ: Dependency phải được cài tại gốc npm workspaces.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `plugins: [`: Gán thuộc tính plugins: tạo mảng [ '@typescript-eslint', 'react-hooks', ].
   * DÒNG `'@typescript-eslint',`: Gán thuộc tính plugins: tạo mảng [ '@typescript-eslint', 'react-hooks', ].
   * DÒNG `'react-hooks',`: Gán thuộc tính plugins: tạo mảng [ '@typescript-eslint', 'react-hooks', ].
   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
   */
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `extends: [`: Gán thuộc tính extends: tạo mảng [ 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-h.
   * DÒNG `'eslint:recommended',`: Gán thuộc tính extends: tạo mảng [ 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-h.
   * DÒNG `'plugin:@typescript-eslint/recommended',`: Gán thuộc tính extends: tạo mảng [ 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-h.
   * DÒNG `'plugin:react-hooks/recommended',`: Gán thuộc tính extends: tạo mảng [ 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-h.
   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
   */
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],

  // Gán thuộc tính env: tạo object gồm browser, node, es2022.
  env: {
    // Gán thuộc tính browser: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    browser: true,
    // Gán thuộc tính node: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    node: true,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `es2022: true,`: Gán thuộc tính es2022: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    es2022: true,
  },

  // CHỨC NĂNG: Bỏ qua file do công cụ tự sinh.
  // XỬ LÝ: Không kiểm tra thư viện và kết quả build như code nguồn.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `ignorePatterns: [`: Gán thuộc tính ignorePatterns: tạo mảng [ 'node_modules/', 'dist/', '.test-build/', ].
   * DÒNG `'node_modules/',`: Gán thuộc tính ignorePatterns: tạo mảng [ 'node_modules/', 'dist/', '.test-build/', ].
   * DÒNG `'dist/',`: Gán thuộc tính ignorePatterns: tạo mảng [ 'node_modules/', 'dist/', '.test-build/', ].
   * DÒNG `'.test-build/',`: Gán thuộc tính ignorePatterns: tạo mảng [ 'node_modules/', 'dist/', '.test-build/', ].
   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
   */
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.test-build/',
  ],

  // Gán thuộc tính rules: tạo object gồm '@typescript-eslint/no-explicit-any'.
  rules: {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `'@typescript-eslint/no-explicit-any': 'error',`: Gán thuộc tính '@typescript-eslint/no-explicit-any': chuỗi 'error'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    '@typescript-eslint/no-explicit-any': 'error',
  },
}