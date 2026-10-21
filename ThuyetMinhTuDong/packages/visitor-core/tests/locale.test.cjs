/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra chuyển resource i18next thật cho UC01.
 * Script test gọi; phụ thuộc node:test, i18next và messages đã biên dịch.
 * Mục tiêu là phát hiện lỗi lấy lẫn ngôn ngữ Trung/Bồ.
 */

const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createInstance } = require('i18next')

const {
  messages,
} = require('../.test-build/messages.js')

// CHỨC NĂNG: Chuyển lần lượt năm ngôn ngữ.
// XỬ LÝ: Kiểm tra cả tiêu đề và chữ quay lại ở mỗi lần đổi.
test('UC01: chuyển resource không lẫn ngôn ngữ', async () => {
  const instance = createInstance()

  await instance.init({
    lng: 'vi',
    fallbackLng: 'vi',
    resources: Object.fromEntries(
      Object.entries(messages).map(([language, text]) => [
        language,
        {
          translation: text,
        },
      ]),
    ),
  })

  const cases = [
    ['vi', 'Khám phá'],
    ['cn', '探索'],
    ['pt', 'Explorar'],
    ['ja', '探索'],
    ['en', 'Explore'],
    ['vi', 'Khám phá'],
  ]

  for (const [language, expected] of cases) {
    await instance.changeLanguage(language)

    assert.equal(instance.t('explore'), expected)
    assert.equal(
      instance.t('back'),
      messages[language].back,
    )
  }
})