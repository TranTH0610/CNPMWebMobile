/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Test adapter dịch không tốn hạn mức thật; Node gọi trong catalog:test.
 *
 * VỊ TRÍ: services/catalog/KiemThuTuDongDich.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ./TuDongDich.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const { test } = require('node:test'),
  assert = require('node:assert/strict')
const { chunks, translateText } = require('./TuDongDich.cjs')

test('Chia bài tiếng Việt theo byte, không mất dấu/khoảng trắng/emoji', () => {
  const text = 'Di tích ở Huế. 京都 🏛️\n'.repeat(100),
    parts = chunks(text)
  assert.equal(parts.join(''), text)
  assert.ok(parts.every((part) => Buffer.byteLength(part) <= 450))
  assert.ok(parts.every((part) => !part.includes('\ufffd')))
})
test('Adapter gửi đúng mã tiếng Trung/Bồ, ghép nội dung và giải mã thực thể', async () => {
  for (const [language, code] of [
    ['cn', 'zh-CN'],
    ['pt', 'pt-PT'],
    ['ja', 'ja'],
    ['en', 'en'],
  ]) {
    const value = await translateText('Bài đọc', language, async (url) => {
      assert.equal(url.searchParams.get('langpair'), 'vi|' + code)
      return {
        ok: true,
        json: async () => ({ responseStatus: 200, responseData: { translatedText: 'A &amp; B' } }),
      }
    })
    assert.equal(value, 'A & B')
  }
})
test('Không coi lỗi hạn mức, HTTP, JSON và bản dịch rỗng là thành công', async () => {
  for (const response of [
    { ok: false },
    {
      ok: true,
      json: async () => ({ responseStatus: 403, responseData: { translatedText: 'quota' } }),
    },
    {
      ok: true,
      json: async () => ({
        responseStatus: 200,
        quotaFinished: true,
        responseData: { translatedText: 'quota' },
      }),
    },
    { ok: true, json: async () => ({ responseStatus: 200, responseData: { translatedText: '' } }) },
    {
      ok: true,
      json: async () => {
        throw Error('bad json')
      },
    },
  ])
    await assert.rejects(translateText('Bài đọc', 'en', async () => response))
})

// CHỨC NĂNG: Không để tên di tích/vua bị biến thành tên khác, không đổi năm lịch sử.
test('Bảo vệ đúng tên riêng và năm kể cả tên xuất hiện nhiều lần', async () => {
  const result = await translateText(
    'Nhà hát Duyệt Thị Đường xây năm 1826 dưới triều vua Minh Mạng tại Huế. Duyệt Thị Đường có từ năm 1826.',
    'cn',
    async (url) => ({
      ok: true,
      json: async () => ({
        responseStatus: 200,
        responseData: { translatedText: url.searchParams.get('q') },
      }),
    }),
  )
  assert.match(result, /阅是堂剧院/)
  assert.match(result, /明命帝/)
  assert.match(result, /顺化/)
  assert.equal((result.match(/1826/g) || []).length, 2)
  assert.ok(!/ZXQ\d+QXZ/.test(result))
})
test('Dịch vụ làm mất hoặc nhân đôi tên/năm phải báo lỗi thay vì lưu nội dung sai', async () => {
  for (const transform of [(q) => q.replace(/ZXQ\d+QXZ/, ''), (q) => q + q.match(/ZXQ\d+QXZ/)[0]])
    await assert.rejects(
      translateText('Duyệt Thị Đường xây năm 1826.', 'cn', async (url) => ({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: { translatedText: transform(url.searchParams.get('q')) },
        }),
      })),
    )
})
test('Không cắt token tên riêng khi chia đoạn giới hạn byte', () => {
  const text = 'a'.repeat(448) + 'ZXQ123QXZ' + ' b'.repeat(300),
    parts = chunks(text)
  assert.equal(parts.join(''), text)
  assert.ok(parts.every((p) => Buffer.byteLength(p) <= 450))
  assert.ok(parts.some((p) => p.includes('ZXQ123QXZ')))
})
test('Bỏ fuzzy match khác câu nguồn, chọn đúng kết quả máy dịch', async () => {
  const response = (matches, match = 0.7) => ({
    ok: true,
    json: async () => ({
      responseStatus: 200,
      responseData: { translatedText: 'Wrong', match },
      matches,
    }),
  })
  await assert.rejects(
    translateText('Bài đọc', 'en', async () =>
      response([{ segment: 'Khác câu', translation: 'Wrong', 'created-by': 'user' }]),
    ),
    /No reliable translation/,
  )
  const value = await translateText('Bài đọc', 'en', async () =>
    response([
      { segment: 'Khác câu', translation: 'Wrong' },
      { segment: 'Bài đọc', translation: 'Narration', 'created-by': 'MT!' },
    ]),
  )
  assert.equal(value, 'Narration')
})
test('Giải mã ký tự số của dịch vụ, không đưa thực thể HTML vào bài đọc', async () => {
  const value = await translateText('Bài đọc', 'cn', async () => ({
    ok: true,
    json: async () => ({
      responseStatus: 200,
      responseData: { translatedText: '&#38405;&#x662f;&#22530; &amp; B' },
    }),
  }))
  assert.equal(value, '阅是堂 & B')
})

test('Thuật ngữ cung đình không bị nhầm quan lại thành ngôn ngữ hoặc sai loại hình tuồng', async () => {
  const value = await translateText(
    'nhà vua, hoàng gia và quan lại xem tuồng, nhã nhạc.',
    'cn',
    async (url) => ({
      ok: true,
      json: async () => ({
        responseStatus: 200,
        responseData: { translatedText: url.searchParams.get('q') },
      }),
    }),
  )
  for (const term of ['皇帝', '皇室成员', '官员', '越南传统戏曲', '雅乐'])
    assert.ok(value.includes(term))
})

// CHỨC NĂNG: Tái hiện chính xác lỗi máy dịch tiếng Nhật chèn khoảng trắng vào token.
// TẠI SAO: Vẫn kiểm tra đủ tên/năm một lần; không bỏ kiểm tra để chấp nhận bản dịch sai.
test('Khôi phục token Nhật có khoảng trắng, ký tự toàn chiều rộng và đổi thứ tự', async () => {
  for (const output of [
    'ZXQ 0 QXZはZXQ 3 QXZでZXQ 2 QXZの治世の下、ZXQ 1 QXZ年に建てられました。',
    'ＺＸＱ０ＱＸＺはＺＸＱ３ＱＸＺでＺＸＱ２ＱＸＺの治世の下、ＺＸＱ１ＱＸＺ年に建てられました。',
  ]) {
    const result = await translateText(
      'Nhà hát Duyệt Thị Đường được xây dựng năm 1826 dưới triều vua Minh Mạng tại Huế.',
      'ja',
      async () => ({
        ok: true,
        json: async () => ({ responseStatus: 200, responseData: { translatedText: output } }),
      }),
    )
    assert.equal(
      result,
      'Duyệt Thị Đường王立劇場はフエでMinh Mạng帝の治世の下、1826年に建てられました。',
    )
  }
})
test('Token Nhật trùng hoặc lạ vẫn bị từ chối', async () => {
  for (const output of ['ZXQ 0 QXZ ZXQ 0 QXZ', 'ZXQ 9 QXZ']) {
    await assert.rejects(
      translateText('Huế là một thành phố.', 'ja', async () => ({
        ok: true,
        json: async () => ({ responseStatus: 200, responseData: { translatedText: output } }),
      })),
    )
  }
})
test('Tên riêng đơn lẻ được giữ đúng mà không tốn request/hạn mức dịch', async () => {
  const result = await translateText('Nhà hát Duyệt Thị Đường', 'ja', async () => {
    throw Error('Không được gọi mạng')
  })
  assert.equal(result, 'Duyệt Thị Đường王立劇場')
})
