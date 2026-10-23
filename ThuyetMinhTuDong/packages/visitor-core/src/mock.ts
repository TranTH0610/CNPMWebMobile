/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp tám điểm minh họa để thử giao diện UC02–UC04.
 * demoCatalog được provider dùng mặc định.
 * Phụ thuộc model.ts và catalog.ts.
 *
 * Danh mục và bài đọc là dữ liệu demo, chưa phải dữ liệu triển khai đã chốt.
 * Không khai báo tọa độ suy đoán.
 */

import { createCatalog } from './catalog'
import type { Language, PlaceRecord, PublishedText } from './model'

const demoBody: Record<Language, string> = {
  vi: 'Đây là nội dung minh họa để kiểm tra màn đọc thuyết minh. Trước khi phục vụ du khách, quản lý phải cung cấp, kiểm duyệt và công bố bài chính thức.',
  en: 'This is sample text for testing the reading screen. Before serving visitors, management must provide, review and publish the official narration.',
  cn: '此文本仅用于测试讲解阅读页面。正式服务游客前，管理人员必须提供、审核并发布正式讲解。',
  pt: 'Este texto serve para testar a leitura. Antes de servir visitantes, a gestão deve fornecer, rever e publicar a narração oficial.',
  ja: 'これは解説の閲覧画面を確認するサンプルです。実際の公開前に管理者が正式な内容を提供、審査、公開する必要があります。',
}

const address: Record<Language, string> = {
  vi: 'Phạm vi Kinh thành Huế — vị trí chi tiết chờ xác nhận',
  en: 'Hue Citadel area — exact location pending confirmation',
  cn: '顺化京城范围，具体位置待确认',
  pt: 'Área da Cidadela de Huế — localização exata por confirmar',
  ja: 'フエ京城の対象範囲、詳細位置は確認待ち',
}

// CHỨC NĂNG: Mô phỏng một bản nội dung đã công bố.
// XỬ LÝ: Trạng thái/ngày chỉ dùng thử quy tắc FE, UI có thông báo dữ liệu demo.
function text(title: string, language: Language): PublishedText {
  return {
    title,
    summary: demoBody[language],
    body: demoBody[language],
    address: address[language],
    version: 1,
    status: 'published',
    approvedAt: '2026-10-19T00:00:00Z',
    publishedAt: '2026-10-19T01:00:00Z',
  }
}

// CHỨC NĂNG: Tạo địa điểm từ những bản ngôn ngữ được khai báo.
// XỬ LÝ: Thiếu ngôn ngữ thì giữ thiếu, không tự dịch.
function make(
  id: string,
  zone: PlaceRecord['zone'],
  // CHỨC NĂNG: Bắt buộc dữ liệu demo khai báo đủ năm tên ngôn ngữ.
  // XỬ LÝ: Quên cn, pt hoặc ja sẽ được TypeScript báo ngay khi viết dữ liệu.
  names: Record<Language, string>,
): PlaceRecord {
  const content: PlaceRecord['content'] = {}

  for (const language of ['vi', 'en', 'cn', 'pt', 'ja'] as const) {
    const title = names[language]
    if (title) content[language] = text(title, language)
  }

  return {
    id,
    scope: 'hue-citadel',
    inLaunchCatalog: true,
    status: 'published',
    canonicalTitle: names.vi ?? id,
    zone,
    images: [],
    content,
  }
}

// CHỨC NĂNG: Cung cấp tám điểm minh họa đủ năm ngôn ngữ.
// XỬ LÝ: Hàm make ghép tên với nội dung demo tương ứng từng ngôn ngữ.
// Trường hợp API thiếu bản dịch được kiểm tra bằng dữ liệu riêng trong test.
export const MOCK_PLACES: PlaceRecord[] = [
  make('ky-dai', 'fortifications', {
    vi: 'Kỳ Đài',
    en: 'Flag Tower',
    cn: '旗台',
    pt: 'Torre da Bandeira',
    ja: '旗台',
  }),

  make('ngo-mon', 'fortifications', {
    vi: 'Ngọ Môn',
    en: 'Ngo Mon Gate',
    cn: '午门',
    pt: 'Porta Ngo Mon',
    ja: '午門',
  }),

  make('dien-thai-hoa', 'ceremonial', {
    vi: 'Điện Thái Hòa',
    en: 'Thai Hoa Palace',
    cn: '太和殿',
    pt: 'Palácio Thai Hoa',
    ja: '太和殿',
  }),

  make('the-mieu', 'ceremonial', {
    vi: 'Thế Miếu',
    en: 'The Mieu Temple',
    cn: '世庙',
    pt: 'Templo The Mieu',
    ja: '世廟',
  }),

  make('cung-dien-tho', 'ceremonial', {
    vi: 'Cung Diên Thọ',
    en: 'Dien Tho Palace',
    cn: '延寿宫',
    pt: 'Palácio Dien Tho',
    ja: '延寿宮',
  }),

  make('truong-sanh-cung', 'ceremonial', {
    vi: 'Trường Sanh Cung',
    en: 'Truong Sanh Palace',
    cn: '长生宫',
    pt: 'Palácio Truong Sanh',
    ja: '長生宮',
  }),

  make('dien-can-chanh', 'ceremonial', {
    vi: 'Điện Cần Chánh',
    en: 'Can Chanh Palace',
    cn: '勤政殿',
    pt: 'Palácio Can Chanh',
    ja: '勤政殿',
  }),

  make('hien-lam-cac', 'ceremonial', {
    vi: 'Hiển Lâm Các',
    en: 'Hien Lam Pavilion',
    cn: '显临阁',
    pt: 'Pavilhão Hien Lam',
    ja: '顕臨閣',
  }),
]

// CHỨC NĂNG: Gắn danh mục và trạng thái nổi bật.
// XỬ LÝ: Kỳ Đài không bị gọi là cổng thành;
// không thêm điểm ngoài phạm vi chỉ để đủ danh mục trong ảnh.
for (const place of MOCK_PLACES) {
  place.category =
    place.id === 'ky-dai' ? 'monument'
      : place.id === 'ngo-mon' ? 'gate'
        : place.id === 'the-mieu' || place.id === 'hien-lam-cac'
          ? 'temple'
          : 'palace'

  place.featured = [
    'ngo-mon',
    'dien-thai-hoa',
    'the-mieu',
    'cung-dien-tho',
  ].includes(place.id)
}

// CHỨC NĂNG: Gắn ảnh đã có nguồn cho đúng công trình.
// XỬ LÝ: Các điểm chưa có ảnh dùng placeholder, không mượn ảnh của điểm khác.
MOCK_PLACES[1].images = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg/960px-DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg',
]

MOCK_PLACES[2].images = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Thai_Hoa_palace.jpg/960px-Thai_Hoa_palace.jpg',
]

MOCK_PLACES[3].images = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Inside_The_Mieu_Temple%2C_Hue_20130810.jpg/960px-Inside_The_Mieu_Temple%2C_Hue_20130810.jpg',
]

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Trả bản sao dữ liệu JSON để UI không sửa nguồn.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}

export const demoCatalog = createCatalog(loadMockCatalog)
