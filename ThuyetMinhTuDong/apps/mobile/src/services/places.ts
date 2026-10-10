import type { LangCode } from '../i18n'

export type Place = {
  id: string
  // Chỉ bắt buộc có tiếng Việt, ngôn ngữ khác thiếu thì app tự dịch
  name: { vi: string } & Partial<Record<LangCode, string>>
  // Chỉ bắt buộc có tiếng Việt, ngôn ngữ khác thiếu thì app tự dịch
  description: { vi: string } & Partial<Record<LangCode, string>>
  location?: { lat: number; lng: number }
}

export const PLACES: Place[] = [
  {
    id: '1',
    name: {
      vi: 'Văn Miếu – Quốc Tử Giám',
      en: 'Temple of Literature',
      ja: '文廟（ヴァンミェウ）',
      pt: 'Templo da Literatura',
      cn: '文庙',
    },
    description: {
      vi: 'Văn Miếu – Quốc Tử Giám được xây dựng năm 1070 dưới thời vua Lý Thánh Tông để thờ Khổng Tử. Năm 1076, Quốc Tử Giám được lập ra bên cạnh, là trường đại học đầu tiên của Việt Nam.',
      en: "The Temple of Literature was built in 1070 under Emperor Ly Thanh Tong to honor Confucius. In 1076 the Imperial Academy was founded next to it, becoming Vietnam's first university.",
      ja: '文廟は1070年、李聖宗の時代に孔子を祀るために建てられました。1076年には隣に国子監が設立され、ベトナム最初の大学となりました。',
      pt: 'O Templo da Literatura foi construído em 1070, durante o reinado do imperador Lý Thánh Tông, para homenagear Confúcio. Em 1076, a Academia Imperial foi fundada ao lado do templo, tornando-se a primeira universidade do Vietname.',
      cn: '文庙建于1070年，即李圣宗皇帝在位期间，是为了祭祀孔子而建。1076年，旁边建立了国子监，成为越南第一所大学。',
    },
    location: { lat: 21.0286, lng: 105.8355 },
  },
  {
    id: '2',
    name: {
      vi: 'Phố cổ Hội An',
      en: 'Hoi An Ancient Town',
      ja: 'ホイアン旧市街',
      pt: 'Centro Histórico de Hội An',
      cn: '会安古城'
    },
    description: {
      vi: 'Phố cổ Hội An từng là thương cảng sầm uất từ thế kỷ 16 đến 17, nơi thương nhân Việt, Nhật, Trung Hoa cùng buôn bán. Năm 1999, nơi đây được UNESCO công nhận là Di sản văn hóa thế giới.',
      en: 'Hoi An Ancient Town was a busy trading port in the 16th and 17th centuries, where Vietnamese, Japanese and Chinese merchants traded together. UNESCO listed it as a World Heritage Site in 1999.',
      ja: 'ホイアンの旧市街は16〜17世紀に栄えた国際貿易港で、ベトナム、日本、中国の商人が交易を行いました。1999年にユネスコの世界遺産に登録されました。',
      pt: 'O centro histórico de Hội An foi um porto comercial movimentado nos séculos XVI e XVII, onde comerciantes vietnamitas, japoneses e chineses realizavam trocas comerciais. Em 1999, foi reconhecido pela UNESCO como Património Mundial.',
      cn: '会安古城曾是16至17世纪繁荣的贸易港口，越南、日本和中国商人在此进行贸易。1999年，这里被联合国教科文组织列为世界文化遗产。',
    },
    location: { lat: 15.877, lng: 108.326 },
  },
  {
    id: '3',
    name: {
      vi: 'Chùa Một Cột',
      en: 'One Pillar Pagoda',
      ja: '一柱寺',
      pt: 'One Pillar Pagoda',
      cn: '一柱寺',
    },
    // Chỉ có tiếng Việt: dùng để thử chức năng tự dịch sang en, ja
    description: {
      vi: 'Chùa Một Cột được vua Lý Thái Tông cho xây dựng năm 1049 ở Hà Nội. Chùa có kiến trúc độc đáo, dựng trên một cột đá giữa hồ, giống hình bông sen nở.',
    },
    location: { lat: 21.0359, lng: 105.8335 },
  },
]