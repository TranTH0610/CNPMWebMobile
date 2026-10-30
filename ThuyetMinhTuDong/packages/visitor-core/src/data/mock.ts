/**
 * FILE NÀY LÀM GÌ
 * Xây danh mục điểm tham quan mẫu từ nội dung, ảnh và các thông tin dùng trong demo.
 *
 * VỊ TRÍ: packages/visitor-core/src/data/mock.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts; packages/visitor-core/src/react/react.tsx.
 * PHỤ THUỘC: ../journey/journey-data; ./heritage; ./photos; ../catalog/catalog; ../domain/model
 * TẠI SAO TÁCH FILE: Dữ liệu nguồn cần một nơi đối chiếu để ảnh, văn bản và bản thu không bị
 * ghép lệch nhau.
 */
// Nhập các thành phần từ '../journey/journey-data'.
import { MAP_POINTS } from '../journey/journey-data'
// Nhập các thành phần từ './heritage'.
import { heritageText, HERITAGE_CONTENT } from './heritage'
// Nhập các thành phần từ './photos'.
import { PLACE_PHOTOS } from './photos'
// Nhập các thành phần từ '../catalog/catalog'.
import { createCatalog } from '../catalog/catalog'
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Language, PlaceRecord } from '../domain/model'

// CHỨC NĂNG: Tạo địa điểm từ những bản ngôn ngữ được khai báo.
// XỬ LÝ: Thiếu ngôn ngữ thì giữ thiếu, không tự dịch.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `function make(`: Khai báo make(id, zone, names). Nhận đầu vào qua tham số.
 * DÒNG `id: string,`: Nhận đầu vào id: string từ nơi gọi hàm.
 * DÒNG `zone: PlaceRecord['zone'],`: Nhận đầu vào zone: PlaceRecord['zone'] từ nơi gọi hàm.
 * DÒNG `names: Record<Language, string>,`: Nhận đầu vào names: Record<Language, string> từ nơi gọi hàm.
 * DÒNG `): PlaceRecord {`: Khai báo make(id, zone, names). Nhận đầu vào qua tham số.
 */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (title) content[language] = heritageText(id, language, title)`: Rẽ nhánh nếu title. | Thực hiện tính biểu thức content[language] = heritageText(id, language, title).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (title) content[language] = heritageText(id, language, title)
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm id, scope, inLaunchCatalog, status, canonicalTitle, zone, images, position, content.
   * DÒNG `id,`: Đặt trường id bằng giá trị của biến cùng tên.
   */
  return {
    id,
    // Gán thuộc tính scope: chuỗi 'hue-citadel'.
    scope: 'hue-citadel',
    // Gán thuộc tính inLaunchCatalog: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    inLaunchCatalog: true,
    // Gán thuộc tính status: chuỗi 'published'.
    status: 'published',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `canonicalTitle: names.vi ?? id,`: Gán thuộc tính canonicalTitle: tính biểu thức names.vi ?? id.
     * DÒNG `zone,`: Đặt trường zone bằng giá trị của biến cùng tên.
     */
    canonicalTitle: names.vi ?? id,
    zone,
    // Gán thuộc tính images: tạo mảng [].
    images: [],
    // CHỨC NĂNG: Admin và du khách cùng có tọa độ của đúng công trình.
    // XỬ LÝ: Tâm OSM là vị trí trên bản đồ, không phải xác nhận GPS thực địa.
    // Gán thuộc tính position: chọn giữa hai giá trị theo điều kiện MAP_POINTS[id]. | Gán thuộc tính lat: đọc MAP_POINTS[id].lat từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính lng: đọc MAP_POINTS[id].lng từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    position: MAP_POINTS[id] ? { lat: MAP_POINTS[id].lat, lng: MAP_POINTS[id].lng,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `verified: false, source: MAP_POINTS[id].source, checkedAt: '2026-10-24' } : undefined`: Gán thuộc tính verified: sử dụng false làm giá trị của bước hiện tại. Tách tọa độ tham khảo với tọa độ đã xác nhận. | Gán thuộc tính source: đọc MAP_POINTS[id].source từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính checkedAt: chuỗi '2026-10-24'.
       * DÒNG `content,`: Đặt trường content bằng giá trị của biến cùng tên.
       */
      verified: false, source: MAP_POINTS[id].source, checkedAt: '2026-10-24' } : undefined,
    content,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `period: HERITAGE_CONTENT.find(place => place.id === id)?.period,`: Gán thuộc tính period: đọc HERITAGE_CONTENT.find(place => place.id === id)?.period từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    period: HERITAGE_CONTENT.find(place => place.id === id)?.period,
  }
}
// TẠI SAO (make): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.

// CHỨC NĂNG: Cung cấp tám điểm minh họa đủ năm ngôn ngữ.
// XỬ LÝ: Hàm make lấy bài và MP3 tương ứng từ heritage.ts.
// Trường hợp API thiếu bản dịch được kiểm tra bằng dữ liệu riêng trong test.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const MOCK_PLACES: PlaceRecord[] = [`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
 * DÒNG `make('ky-dai', 'fortifications', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
 */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '旗台',`: Gán thuộc tính ja: chuỗi '旗台'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('ngo-mon', 'fortifications', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '午門',`: Gán thuộc tính ja: chuỗi '午門'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('dien-thai-hoa', 'ceremonial', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '太和殿',`: Gán thuộc tính ja: chuỗi '太和殿'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('the-mieu', 'ceremonial', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '世廟',`: Gán thuộc tính ja: chuỗi '世廟'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('cung-dien-tho', 'ceremonial', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '延寿宮',`: Gán thuộc tính ja: chuỗi '延寿宮'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('truong-sanh-cung', 'ceremonial', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '長生宮',`: Gán thuộc tính ja: chuỗi '長生宮'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('dien-can-chanh', 'ceremonial', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '勤政殿',`: Gán thuộc tính ja: chuỗi '勤政殿'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `make('hien-lam-cac', 'ceremonial', {`: Khai báo MOCK_PLACES: tạo mảng [ make('ky-dai', 'fortifications', { vi: 'Kỳ Đài', en: 'Flag Tower', cn: '旗台', p.
     */
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `ja: '顕臨閣',`: Gán thuộc tính ja: chuỗi '顕臨閣'.
     * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
     */
    ja: '顕臨閣',
  }),
]

// CHỨC NĂNG: Gắn danh mục và trạng thái nổi bật.
// XỬ LÝ: Kỳ Đài không bị gọi là cổng thành;
// không thêm điểm ngoài phạm vi chỉ để đủ danh mục trong ảnh.
// Duyệt lần lượt MOCK_PLACES bằng const place.
for (const place of MOCK_PLACES) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `place.category =`: Thực hiện tính biểu thức place.category = place.id === 'ky-dai' ? 'monument' : place.id === 'ngo-mon' ? 'gate' : pl.
   * DÒNG `place.id === 'ky-dai' ? 'monument'`: Thực hiện tính biểu thức place.category = place.id === 'ky-dai' ? 'monument' : place.id === 'ngo-mon' ? 'gate' : pl.
   * DÒNG `: place.id === 'ngo-mon' ? 'gate'`: Thực hiện tính biểu thức place.category = place.id === 'ky-dai' ? 'monument' : place.id === 'ngo-mon' ? 'gate' : pl.
   * DÒNG `: place.id === 'the-mieu' || place.id === 'hien-lam-cac'`: Thực hiện tính biểu thức place.category = place.id === 'ky-dai' ? 'monument' : place.id === 'ngo-mon' ? 'gate' : pl.
   * DÒNG `? 'temple'`: Thực hiện tính biểu thức place.category = place.id === 'ky-dai' ? 'monument' : place.id === 'ngo-mon' ? 'gate' : pl.
   * DÒNG `: 'palace'`: Thực hiện tính biểu thức place.category = place.id === 'ky-dai' ? 'monument' : place.id === 'ngo-mon' ? 'gate' : pl.
   */
  place.category =
    place.id === 'ky-dai' ? 'monument'
      : place.id === 'ngo-mon' ? 'gate'
        : place.id === 'the-mieu' || place.id === 'hien-lam-cac'
          ? 'temple'
          : 'palace'

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `place.featured = [`: Thực hiện tính biểu thức place.featured = [ 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', ].includes(pla.
   * DÒNG `'ngo-mon',`: Thực hiện tính biểu thức place.featured = [ 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', ].includes(pla.
   * DÒNG `'dien-thai-hoa',`: Thực hiện tính biểu thức place.featured = [ 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', ].includes(pla.
   * DÒNG `'the-mieu',`: Thực hiện tính biểu thức place.featured = [ 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', ].includes(pla.
   * DÒNG `'cung-dien-tho',`: Thực hiện tính biểu thức place.featured = [ 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', ].includes(pla.
   * DÒNG `].includes(place.id)`: Thực hiện tính biểu thức place.featured = [ 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', ].includes(pla.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `place.images = photo ? [photo.image] : []`: Thực hiện tính biểu thức place.images = photo ? [photo.image] : [].
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  place.images = photo ? [photo.image] : []
}

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Trả bản sao dữ liệu JSON để UI không sửa nguồn.
// Khai báo loadMockCatalog(). Nhận đầu vào qua tham số.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]`: Trả kết quả: JSON.parse chuyển chuỗi sang dữ liệu.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}
// TẠI SAO (loadMockCatalog): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi
// gọi không phải xử lý dữ liệu sai như thành công.

// Khai báo demoCatalog: Gọi createCatalog(loadMockCatalog).
export const demoCatalog = createCatalog(loadMockCatalog)
