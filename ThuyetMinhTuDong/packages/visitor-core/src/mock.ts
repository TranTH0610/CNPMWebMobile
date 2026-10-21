/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp dữ liệu demo cho UC02–UC04.
 * demoCatalog được provider dùng mặc định.
 * Phụ thuộc model.ts và catalog.ts.
 *
 * Đây là nội dung minh họa đồ án, không phải bài lịch sử đã được
 * đơn vị quản lý di tích thật duyệt. Không khai báo tọa độ suy đoán.
 */

import { createCatalog } from './catalog'
import type {
  Language,
  PlaceRecord,
  PublishedText,
} from './model'

// CHỨC NĂNG: Chuẩn bị nội dung thử nghiệm theo ngôn ngữ.
// XỬ LÝ: Không đưa khẳng định lịch sử chưa được kiểm chứng.
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

// CHỨC NĂNG: Tạo trạng thái công bố giả để kiểm tra quy tắc FE.
// XỬ LÝ: Ngày duyệt/công bố chỉ thuộc mock; UI luôn có thông báo dữ liệu demo.
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

// CHỨC NĂNG: Tạo địa điểm cùng những bản ngôn ngữ được khai báo.
// XỬ LÝ: Không tự sinh bản ngôn ngữ còn thiếu.
function make(
  id: string,
  zone: PlaceRecord['zone'],
  names: Partial<Record<Language, string>>,
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

// CHỨC NĂNG: Cung cấp ba điểm ví dụ thuộc phạm vi tài liệu.
// XỬ LÝ: Điện Thái Hòa cố ý thiếu CN/PT/JA để thử trạng thái thiếu bản dịch.
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
  }),
]

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Dữ liệu chỉ gồm giá trị JSON; trả bản sao để không sửa nguồn mock.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}

export const demoCatalog = createCatalog(loadMockCatalog)