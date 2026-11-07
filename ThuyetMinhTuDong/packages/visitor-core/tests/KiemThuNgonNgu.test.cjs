/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra ánh xạ tài nguyên ngôn ngữ để bản dịch không bị ghép nhầm.
 *
 * VỊ TRÍ: packages/visitor-core/tests/KiemThuNgonNgu.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - i18next
 * - ../.test-build/i18n/BanDichGiaoDien.js
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo { createInstance }: require nạp module 'i18next' để dùng chức năng có sẵn thay vì chép lại.
const { createInstance } = require('i18next')


const {
  messages,
} = require('../.test-build/i18n/BanDichGiaoDien.js')

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

  // Duyệt lần lượt cases bằng const [language, expected].
  for (const [language, expected] of cases) {
    // Thực hiện await chờ Gọi instance.changeLanguage(language).
    await instance.changeLanguage(language)

    // Khẳng định kết quả thử nghiệm bằng assert.equal(instance.t('explore'), expected).
    assert.equal(instance.t('explore'), expected)
    
    assert.equal(
      instance.t('back'),
      messages[language].back,
    )
  }
})