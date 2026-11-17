/**
 * FILE: packages/visitor-core/src/data/DuLieuKhoiTao.ts
 * FILE NÀY LÀM GÌ: Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { MAP_POINTS } from '../journey/DuLieuHanhTrinh'
import { heritageText, HERITAGE_CONTENT } from './DiSanHue'
import { PLACE_PHOTOS } from './DanhMucAnh'
import { createCatalog } from '../catalog/DanhMucDiTich'
import type { Language, PlaceRecord } from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Tạo địa điểm từ những bản ngôn ngữ được khai báo.
// XỬ LÝ: Thiếu ngôn ngữ thì giữ thiếu, không tự dịch.

// [UC02 / UC04 / UC07 / UC08] make — Tạo địa điểm từ những bản ngôn ngữ được khai báo.
function make(
  id: string,
  zone: PlaceRecord['zone'],
  // CHỨC NĂNG: Bắt buộc dữ liệu demo khai báo đủ năm tên ngôn ngữ.
  // XỬ LÝ: Quên cn, pt hoặc ja sẽ được TypeScript báo ngay khi viết dữ liệu.
  names: Record<Language, string>,
): PlaceRecord {
  const content: PlaceRecord['content'] = {}

  // Duyệt lần lượt ['vi', 'en', 'cn', 'pt', 'ja'] as const bằng const language.
  for (const language of ['vi', 'en', 'cn', 'pt', 'ja'] as const) {
    const title = names[language]
    
    if (title) content[language] = heritageText(id, language, title)
  }

  
  return {
    id,
    scope: 'hue-citadel',
    inLaunchCatalog: true,
    status: 'published',
    
    canonicalTitle: names.vi ?? id,
    zone,
    images: [],
    // CHỨC NĂNG: Admin và du khách cùng có tọa độ của đúng công trình.
    // XỬ LÝ: Tâm OSM là vị trí trên bản đồ, không phải xác nhận GPS thực địa.
    position: MAP_POINTS[id] ? { lat: MAP_POINTS[id].lat, lng: MAP_POINTS[id].lng,
      
      verified: false, source: MAP_POINTS[id].source, checkedAt: '2026-10-24' } : undefined,
    content,
    
    period: HERITAGE_CONTENT.find(place => place.id === id)?.period,
  }
}
// TẠI SAO (make): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.

// CHỨC NĂNG: Cung cấp tám điểm minh họa đủ năm ngôn ngữ.
// XỬ LÝ: Hàm make lấy bài và MP3 tương ứng từ DiSanHue.ts.
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
// Duyệt lần lượt MOCK_PLACES bằng const place.
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

// CHỨC NĂNG: Mỗi địa điểm có ảnh riêng đã kiểm tra nguồn, không mượn ảnh điểm khác.
// Duyệt lần lượt MOCK_PLACES bằng const place.
for (const place of MOCK_PLACES) {
  const photo = PLACE_PHOTOS[place.id]
  
  place.images = photo ? [photo.image] : []
}

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Trả bản sao dữ liệu JSON để UI không sửa nguồn.
// [UC02 / UC04 / UC07 / UC08] loadMockCatalog — Mô phỏng nguồn API bất đồng bộ.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}
// TẠI SAO (loadMockCatalog): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi
// gọi không phải xử lý dữ liệu sai như thành công.

export const demoCatalog = createCatalog(loadMockCatalog)
