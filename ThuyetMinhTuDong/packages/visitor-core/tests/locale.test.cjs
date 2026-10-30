/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra ánh xạ tài nguyên ngôn ngữ để bản dịch không bị ghép nhầm.
 *
 * VỊ TRÍ: packages/visitor-core/tests/locale.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; i18next; ../.test-build/i18n/messages.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo { createInstance }: require nạp module 'i18next' để dùng chức năng có sẵn thay vì chép lại.
const { createInstance } = require('i18next')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { messages, }: require nạp module '../.test-build/i18n/messages.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `messages,`: Khai báo { messages, }: require nạp module '../.test-build/i18n/messages.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/i18n/messages.js')`: Khai báo { messages, }: require nạp module '../.test-build/i18n/messages.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  messages,
} = require('../.test-build/i18n/messages.js')

// CHỨC NĂNG: Chuyển lần lượt năm ngôn ngữ.
// XỬ LÝ: Kiểm tra cả tiêu đề và chữ quay lại ở mỗi lần đổi.
// Khẳng định kết quả thử nghiệm bằng test('UC01: chuyển resource không lẫn ngôn ngữ', async () => { const instance = createInstance() await instance.init({ l.
test('UC01: chuyển resource không lẫn ngôn ngữ', async () => {
  // Khai báo instance: Gọi createInstance().
  const instance = createInstance()

  // Thực hiện await chờ Gọi instance.init({ lng: 'vi', fallbackLng: 'vi', resources: Object.fromEntries( Object.entrie.
  await instance.init({
    // Gán thuộc tính lng: chuỗi 'vi'.
    lng: 'vi',
    // Gán thuộc tính fallbackLng: chuỗi 'vi'.
    fallbackLng: 'vi',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `resources: Object.fromEntries(`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { trans.
     * DÒNG `Object.entries(messages).map(([language, text]) => [`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { trans.
     * DÒNG `language,`: Gán thuộc tính resources: Gọi Object.fromEntries( Object.entries(messages).map(([language, text]) => [ language, { trans.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    resources: Object.fromEntries(
      Object.entries(messages).map(([language, text]) => [
        language,
        {
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `translation: text,`: Gán thuộc tính translation: sử dụng text làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `]),`: Kết thúc danh sách phần tử trong mảng.
           * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          translation: text,
        },
      ]),
    ),
  })

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const cases = [`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `['vi', 'Khám phá'],`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `['cn', '探索'],`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `['pt', 'Explorar'],`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `['ja', '探索'],`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `['en', 'Explore'],`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `['vi', 'Khám phá'],`: Khai báo cases: tạo mảng [ ['vi', 'Khám phá'], ['cn', '探索'], ['pt', 'Explorar'], ['ja', '探索'], ['en', 'Ex.
   * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
   */
  const cases = [
    ['vi', 'Khám phá'],
    ['cn', '探索'],
    ['pt', 'Explorar'],
    ['ja', '探索'],
    ['en', 'Explore'],
    ['vi', 'Khám phá'],
  ]

  // Duyệt lần lượt cases bằng const [language, expected].
  for (const [language, expected] of cases) {
    // Thực hiện await chờ Gọi instance.changeLanguage(language).
    await instance.changeLanguage(language)

    // Khẳng định kết quả thử nghiệm bằng assert.equal(instance.t('explore'), expected).
    assert.equal(instance.t('explore'), expected)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( instance.t('back'), messages[language].back, ).
     * DÒNG `instance.t('back'),`: Khẳng định kết quả thử nghiệm bằng assert.equal( instance.t('back'), messages[language].back, ).
     * DÒNG `messages[language].back,`: Khẳng định kết quả thử nghiệm bằng assert.equal( instance.t('back'), messages[language].back, ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.equal(
      instance.t('back'),
      messages[language].back,
    )
  }
})