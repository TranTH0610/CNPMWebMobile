/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo.
 *
 * VỊ TRÍ: packages/visitor-core/src/data/DuLieuKhoiTao.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/react/TrangThaiReact.tsx
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - ../journey/DuLieuHanhTrinh
 * - ./DiSanHue
 * - ./DanhMucAnh
 * - ../catalog/DanhMucDiTich
 * - ../domain/KieuDuLieuDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. make
 * 2. loadMockCatalog
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập các thành phần từ '../journey/DuLieuHanhTrinh'.
import { MAP_POINTS } from '../journey/DuLieuHanhTrinh'
// Nhập các thành phần từ './DiSanHue'.
import { heritageText, HERITAGE_CONTENT } from './DiSanHue'
// Nhập các thành phần từ './DanhMucAnh'.
import { PLACE_PHOTOS } from './DanhMucAnh'
// Nhập các thành phần từ '../catalog/DanhMucDiTich'.
import { createCatalog } from '../catalog/DanhMucDiTich'
// Nhập kiểu dữ liệu từ '../domain/KieuDuLieuDuKhach'.
import type { Language, PlaceRecord } from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Tạo địa điểm từ những bản ngôn ngữ được khai báo.
// XỬ LÝ: Thiếu ngôn ngữ thì giữ thiếu, không tự dịch.

// ==================== [DUNG-CHUNG] make ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function make(
  id: string,
  zone: PlaceRecord['zone'],
  // CHỨC NĂNG: Bắt buộc dữ liệu demo khai báo đủ năm tên ngôn ngữ.
  // XỬ LÝ: Quên cn, pt hoặc ja sẽ được TypeScript báo ngay khi viết dữ liệu.
  names: Record<Language, string>,
): PlaceRecord {
  // Khai báo content: tạo object gồm.
  const content: PlaceRecord['content'] = {}

  // Duyệt lần lượt ['vi', 'en', 'cn', 'pt', 'ja'] as const bằng const language.
  for (const language of ['vi', 'en', 'cn', 'pt', 'ja'] as const) {
    // Khai báo title: đọc names[language] từ đối tượng/mảng để dùng tại bước hiện tại.
    const title = names[language]
    
    if (title) content[language] = heritageText(id, language, title)
  }

  
  return {
    id,
    // Gán thuộc tính scope: chuỗi 'hue-citadel'.
    scope: 'hue-citadel',
    // Gán thuộc tính inLaunchCatalog: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    inLaunchCatalog: true,
    // Gán thuộc tính status: chuỗi 'published'.
    status: 'published',
    
    canonicalTitle: names.vi ?? id,
    zone,
    // Gán thuộc tính images: tạo mảng [].
    images: [],
    // CHỨC NĂNG: Admin và du khách cùng có tọa độ của đúng công trình.
    // XỬ LÝ: Tâm OSM là vị trí trên bản đồ, không phải xác nhận GPS thực địa.
    // Gán thuộc tính position: chọn giữa hai giá trị theo điều kiện MAP_POINTS[id]. | Gán thuộc tính lat: đọc MAP_POINTS[id].lat từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính lng: đọc MAP_POINTS[id].lng từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
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
    // Gán thuộc tính vi: chuỗi 'Kỳ Đài'.
    vi: 'Kỳ Đài',
    // Gán thuộc tính en: chuỗi 'Flag Tower'.
    en: 'Flag Tower',
    // Gán thuộc tính cn: chuỗi '旗台'.
    cn: '旗台',
    // Gán thuộc tính pt: chuỗi 'Torre da Bandeira'.
    pt: 'Torre da Bandeira',
    
    ja: '旗台',
  }),

  make('ngo-mon', 'fortifications', {
    // Gán thuộc tính vi: chuỗi 'Ngọ Môn'.
    vi: 'Ngọ Môn',
    // Gán thuộc tính en: chuỗi 'Ngo Mon Gate'.
    en: 'Ngo Mon Gate',
    // Gán thuộc tính cn: chuỗi '午门'.
    cn: '午门',
    // Gán thuộc tính pt: chuỗi 'Porta Ngo Mon'.
    pt: 'Porta Ngo Mon',
    
    ja: '午門',
  }),

  make('dien-thai-hoa', 'ceremonial', {
    // Gán thuộc tính vi: chuỗi 'Điện Thái Hòa'.
    vi: 'Điện Thái Hòa',
    // Gán thuộc tính en: chuỗi 'Thai Hoa Palace'.
    en: 'Thai Hoa Palace',
    // Gán thuộc tính cn: chuỗi '太和殿'.
    cn: '太和殿',
    // Gán thuộc tính pt: chuỗi 'Palácio Thai Hoa'.
    pt: 'Palácio Thai Hoa',
    
    ja: '太和殿',
  }),

  make('the-mieu', 'ceremonial', {
    // Gán thuộc tính vi: chuỗi 'Thế Miếu'.
    vi: 'Thế Miếu',
    // Gán thuộc tính en: chuỗi 'The Mieu Temple'.
    en: 'The Mieu Temple',
    // Gán thuộc tính cn: chuỗi '世庙'.
    cn: '世庙',
    // Gán thuộc tính pt: chuỗi 'Templo The Mieu'.
    pt: 'Templo The Mieu',
    
    ja: '世廟',
  }),

  make('cung-dien-tho', 'ceremonial', {
    // Gán thuộc tính vi: chuỗi 'Cung Diên Thọ'.
    vi: 'Cung Diên Thọ',
    // Gán thuộc tính en: chuỗi 'Dien Tho Palace'.
    en: 'Dien Tho Palace',
    // Gán thuộc tính cn: chuỗi '延寿宫'.
    cn: '延寿宫',
    // Gán thuộc tính pt: chuỗi 'Palácio Dien Tho'.
    pt: 'Palácio Dien Tho',
    
    ja: '延寿宮',
  }),

  make('truong-sanh-cung', 'ceremonial', {
    // Gán thuộc tính vi: chuỗi 'Trường Sanh Cung'.
    vi: 'Trường Sanh Cung',
    // Gán thuộc tính en: chuỗi 'Truong Sanh Palace'.
    en: 'Truong Sanh Palace',
    // Gán thuộc tính cn: chuỗi '长生宫'.
    cn: '长生宫',
    // Gán thuộc tính pt: chuỗi 'Palácio Truong Sanh'.
    pt: 'Palácio Truong Sanh',
    
    ja: '長生宮',
  }),

  make('dien-can-chanh', 'ceremonial', {
    // Gán thuộc tính vi: chuỗi 'Điện Cần Chánh'.
    vi: 'Điện Cần Chánh',
    // Gán thuộc tính en: chuỗi 'Can Chanh Palace'.
    en: 'Can Chanh Palace',
    // Gán thuộc tính cn: chuỗi '勤政殿'.
    cn: '勤政殿',
    // Gán thuộc tính pt: chuỗi 'Palácio Can Chanh'.
    pt: 'Palácio Can Chanh',
    
    ja: '勤政殿',
  }),

  make('hien-lam-cac', 'ceremonial', {
    // Gán thuộc tính vi: chuỗi 'Hiển Lâm Các'.
    vi: 'Hiển Lâm Các',
    // Gán thuộc tính en: chuỗi 'Hien Lam Pavilion'.
    en: 'Hien Lam Pavilion',
    // Gán thuộc tính cn: chuỗi '显临阁'.
    cn: '显临阁',
    // Gán thuộc tính pt: chuỗi 'Pavilhão Hien Lam'.
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
  // Khai báo photo: đọc PLACE_PHOTOS[place.id] từ đối tượng/mảng để dùng tại bước hiện tại.
  const photo = PLACE_PHOTOS[place.id]
  
  place.images = photo ? [photo.image] : []
}

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Trả bản sao dữ liệu JSON để UI không sửa nguồn.
// Khai báo loadMockCatalog(). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] loadMockCatalog ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}
// TẠI SAO (loadMockCatalog): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi
// gọi không phải xử lý dữ liệu sai như thành công.

// Khai báo demoCatalog: Gọi createCatalog(loadMockCatalog).
export const demoCatalog = createCatalog(loadMockCatalog)
