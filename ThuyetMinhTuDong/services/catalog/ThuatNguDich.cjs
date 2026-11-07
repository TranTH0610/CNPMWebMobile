/**
 * CHỨC NĂNG: [TU-DONG-DICH]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * Bảo vệ tên di tích, địa danh, vua và con số trước khi gửi dịch.
 *
 * VỊ TRÍ: services/catalog/ThuatNguDich.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/TuDongDich.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. escape
 * 2. protect
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
const terms = [
  [
    'chương trình nghệ thuật cung đình',
    {
      cn: '宫廷艺术演出',
      en: 'royal court performances',
      pt: 'apresentações artísticas da corte',
      ja: '宮廷芸能の公演',
    },
  ],
  ['quan lại', { cn: '官员', en: 'officials', pt: 'funcionários da corte', ja: '官吏' }],
  ['nhà vua', { cn: '皇帝', en: 'the emperor', pt: 'o imperador', ja: '皇帝' }],
  ['hoàng gia', { cn: '皇室成员', en: 'the royal family', pt: 'a família real', ja: '王室' }],
  [
    'ca múa nhạc',
    { cn: '歌舞音乐', en: 'music, song and dance', pt: 'música, canto e dança', ja: '歌舞音楽' },
  ],
  [
    'nhã nhạc',
    { cn: '雅乐', en: 'royal ceremonial music', pt: 'música cerimonial da corte', ja: '宮廷雅楽' },
  ],
  [
    'tuồng',
    {
      cn: '越南传统戏曲',
      en: 'Vietnamese classical theatre',
      pt: 'teatro clássico vietnamita',
      ja: 'ベトナムの伝統演劇',
    },
  ],
  [
    'nghệ thuật truyền thống',
    { cn: '传统艺术', en: 'traditional arts', pt: 'artes tradicionais', ja: '伝統芸能' },
  ],
  [
    'thời Gia Long',
    {
      cn: '嘉隆时期',
      en: 'the reign of Gia Long',
      pt: 'o reinado de Gia Long',
      ja: 'Gia Long帝の時代',
    },
  ],

  [
    'Nhà hát Duyệt Thị Đường',
    {
      cn: '阅是堂剧院',
      en: 'Duyệt Thị Đường Royal Theatre',
      pt: 'Teatro Real Duyệt Thị Đường',
      ja: 'Duyệt Thị Đường王立劇場',
    },
  ],
  ['Duyệt Thị Đường', { cn: '阅是堂' }],
  [
    'vua Minh Mạng',
    { cn: '明命帝', en: 'Emperor Minh Mạng', pt: 'imperador Minh Mạng', ja: 'Minh Mạng帝' },
  ],
  [
    'vua Minh Mệnh',
    { cn: '明命帝', en: 'Emperor Minh Mạng', pt: 'imperador Minh Mạng', ja: 'Minh Mạng帝' },
  ],
  ['Minh Mạng', { cn: '明命' }],
  ['Minh Mệnh', { cn: '明命' }],
  ['Gia Long', { cn: '嘉隆' }],
  [
    'triều Nguyễn',
    { cn: '阮朝', en: 'the Nguyễn dynasty', pt: 'a dinastia Nguyễn', ja: 'グエン朝' },
  ],
  [
    'Đại Nội Huế',
    { cn: '顺化皇城', en: 'Hue Imperial City', pt: 'Cidade Imperial de Huế', ja: 'フエ王宮' },
  ],
  [
    'Hoàng thành Huế',
    { cn: '顺化皇城', en: 'Hue Imperial City', pt: 'Cidade Imperial de Huế', ja: 'フエ王宮' },
  ],
  [
    'Tử Cấm Thành',
    { cn: '紫禁城', en: 'Forbidden Purple City', pt: 'Cidade Púrpura Proibida', ja: '紫禁城' },
  ],
  ['Thanh Phong Đường', {}],
  ['Huế', { cn: '顺化', en: 'Hue', ja: 'フエ' }],
]
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// ==================== [TU-DONG-DICH] protect ====================
// CHỨC NĂNG: Thực hiện bước protect trong nhiệm vụ: Bảo vệ tên di tích, địa danh, vua và con số trước khi gửi dịch.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function protect(text, language, context = {}) {
  if (/ZXQ\d+QXZ/u.test(text)) throw Error('Reserved translation marker')
  const entries = [...terms]
  // Công trình chưa có trong từ điển: giữ tên chính thức, dịch phần mô tả xung quanh.
  if (
    context.title &&
    !terms.some(([name]) =>
      context.title.toLocaleLowerCase('vi').includes(name.toLocaleLowerCase('vi')),
    )
  )
    entries.push([context.title, {}])
  entries.sort((a, b) => b[0].length - a[0].length)
  const targets = new Map(
    entries.map(([name, values]) => [name.toLocaleLowerCase('vi'), values[language] ?? name]),
  )
  const expression = new RegExp(
    entries.map(([name]) => escape(name)).join('|') + '|\\d+(?:[.,]\\d+)*',
    'giu',
  )
  const values = []
  const masked = text.normalize('NFC').replace(expression, (value) => {
    const token = 'ZXQ' + values.length + 'QXZ'
    values.push({ token, value: targets.get(value.toLocaleLowerCase('vi')) ?? value })
    return token
  })
  return {
    text: masked,
    restore(translated) {
      // CHỨC NĂNG: Khôi phục token dù máy dịch Nhật chèn khoảng trắng hoặc dùng ký tự toàn chiều rộng.
      // XỬ LÝ: Chỉ chuẩn hóa chuỗi có hình dạng token; không thay dấu/khoảng trắng của bài dịch.
      // TẠI SAO: ZXQ 0 QXZ và ＺＸＱ０ＱＸＺ vẫn là token số 0, không phải tên đã bị mất.
      let result = translated.replace(
        /[ZＺ][\s\u200b]*[XＸ][\s\u200b]*[QＱ][\s\u200b]*[0-9０-９]+(?:[\s\u200b]*[0-9０-９]+)*[\s\u200b]*[QＱ][\s\u200b]*[XＸ][\s\u200b]*[ZＺ]/giu,
        (token) =>
          token
            .normalize('NFKC')
            .replace(/[\s\u200b]/gu, '')
            .toUpperCase(),
      )
      for (const { token, value } of values) {
        const matches = result.match(new RegExp(token, 'gi')) ?? []
        if (matches.length !== 1)
          throw Error('Translation lost or duplicated a protected name/year')
        result = result.replace(new RegExp(token, 'gi'), () => value)
      }
      if (/ZXQ\d+QXZ/iu.test(result)) throw Error('Unknown translation marker')
      return result
    },
  }
}
module.exports = { protect }
