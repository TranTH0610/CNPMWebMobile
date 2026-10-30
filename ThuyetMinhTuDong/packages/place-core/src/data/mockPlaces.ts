/**
 * FILE NÀY LÀM GÌ
 * Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package
 * này.
 *
 * VỊ TRÍ: packages/place-core/src/data/mockPlaces.ts
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: @travelguide/shared-types
 * TẠI SAO TÁCH FILE: Dữ liệu nguồn cần một nơi đối chiếu để ảnh, văn bản và bản thu không bị
 * ghép lệch nhau.
 */
// Nhập kiểu dữ liệu từ '@travelguide/shared-types'.
import type { Place } from '@travelguide/shared-types'

// CHỨC NĂNG: bảo toàn ba địa điểm ban đầu.
// XỬ LÝ: giữ ID để Detail, geofencing và cache theo ID vẫn hoạt động.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const ORIGINAL_PLACES: Place[] = [`: Khai báo ORIGINAL_PLACES: tạo mảng [ { id: '1', name: { vi: 'Văn Miếu – Quốc Tử Giám', en: 'Temple of Literature',.
 * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
 */
const ORIGINAL_PLACES: Place[] = [
  {
    // Gán thuộc tính id: chuỗi '1'.
    id: '1',
    // Gán thuộc tính name: tạo object gồm vi, en, ja, pt, cn.
    name: {
      // Gán thuộc tính vi: chuỗi 'Văn Miếu – Quốc Tử Giám'.
      vi: 'Văn Miếu – Quốc Tử Giám',
      // Gán thuộc tính en: chuỗi 'Temple of Literature'.
      en: 'Temple of Literature',
      // Gán thuộc tính ja: chuỗi '文廟（ヴァンミェウ）'.
      ja: '文廟（ヴァンミェウ）',
      // Gán thuộc tính pt: chuỗi 'Templo da Literatura'.
      pt: 'Templo da Literatura',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cn: '文庙',`: Gán thuộc tính cn: chuỗi '文庙'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      cn: '文庙',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja, pt, cn.
    description: {
      // Gán thuộc tính vi: chuỗi 'Văn Miếu – Quốc Tử Giám được xây dựng năm 1070 dưới thời vua Lý Thánh Tông để thờ Khổng T.
      vi: 'Văn Miếu – Quốc Tử Giám được xây dựng năm 1070 dưới thời vua Lý Thánh Tông để thờ Khổng Tử. Năm 1076, Quốc Tử Giám được lập ra bên cạnh, là trường đại học đầu tiên của Việt Nam.',
      // Gán thuộc tính en: chuỗi "The Temple of Literature was built in 1070 under Emperor Ly Thanh Tong to honor Confucius.
      en: "The Temple of Literature was built in 1070 under Emperor Ly Thanh Tong to honor Confucius. In 1076 the Imperial Academy was founded next to it, becoming Vietnam's first university.",
      // Gán thuộc tính ja: chuỗi '文廟は1070年、李聖宗の時代に孔子を祀るために建てられました。1076年には隣に国子監が設立され、ベトナム最初の大学となりました。'.
      ja: '文廟は1070年、李聖宗の時代に孔子を祀るために建てられました。1076年には隣に国子監が設立され、ベトナム最初の大学となりました。',
      // Gán thuộc tính pt: chuỗi 'O Templo da Literatura foi construído em 1070, durante o reinado do imperador Lý Thánh Tô.
      pt: 'O Templo da Literatura foi construído em 1070, durante o reinado do imperador Lý Thánh Tông, para homenagear Confúcio. Em 1076, a Academia Imperial foi fundada ao lado do templo, tornando-se a primeira universidade do Vietname.',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cn: '文庙建于1070年，即李圣宗皇帝在位期间，是为了祭祀孔子而建。1076年，旁边建立了国子监，成为越南第一所大学。',`: Gán thuộc tính cn: chuỗi '文庙建于1070年，即李圣宗皇帝在位期间，是为了祭祀孔子而建。1076年，旁边建立了国子监，成为越南第一所大学。'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      cn: '文庙建于1070年，即李圣宗皇帝在位期间，是为了祭祀孔子而建。1076年，旁边建立了国子监，成为越南第一所大学。',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0286.
      lat: 21.0286,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 105.8355,`: Gán thuộc tính lng: giá trị số 105.8355.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       */
      lng: 105.8355,
    },
  },
  {
    // Gán thuộc tính id: chuỗi '2'.
    id: '2',
    // Gán thuộc tính name: tạo object gồm vi, en, ja, pt, cn.
    name: {
      // Gán thuộc tính vi: chuỗi 'Phố cổ Hội An'.
      vi: 'Phố cổ Hội An',
      // Gán thuộc tính en: chuỗi 'Hoi An Ancient Town'.
      en: 'Hoi An Ancient Town',
      // Gán thuộc tính ja: chuỗi 'ホイアン旧市街'.
      ja: 'ホイアン旧市街',
      // Gán thuộc tính pt: chuỗi 'Centro Histórico de Hội An'.
      pt: 'Centro Histórico de Hội An',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cn: '会安古城',`: Gán thuộc tính cn: chuỗi '会安古城'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      cn: '会安古城',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja, pt, cn.
    description: {
      // Gán thuộc tính vi: chuỗi 'Phố cổ Hội An từng là thương cảng sầm uất từ thế kỷ 16 đến 17, nơi thương nhân Việt, Nhật.
      vi: 'Phố cổ Hội An từng là thương cảng sầm uất từ thế kỷ 16 đến 17, nơi thương nhân Việt, Nhật, Trung Hoa cùng buôn bán. Năm 1999, nơi đây được UNESCO công nhận là Di sản văn hóa thế giới.',
      // Gán thuộc tính en: chuỗi 'Hoi An Ancient Town was a busy trading port in the 16th and 17th centuries, where Vietnam.
      en: 'Hoi An Ancient Town was a busy trading port in the 16th and 17th centuries, where Vietnamese, Japanese and Chinese merchants traded together. UNESCO listed it as a World Heritage Site in 1999.',
      // Gán thuộc tính ja: chuỗi 'ホイアンの旧市街は16〜17世紀に栄えた国際貿易港で、ベトナム、日本、中国の商人が交易を行いました。1999年にユネスコの世界遺産に登録されました。'.
      ja: 'ホイアンの旧市街は16〜17世紀に栄えた国際貿易港で、ベトナム、日本、中国の商人が交易を行いました。1999年にユネスコの世界遺産に登録されました。',
      // Gán thuộc tính pt: chuỗi 'O centro histórico de Hội An foi um porto comercial movimentado nos séculos XVI e XVII, o.
      pt: 'O centro histórico de Hội An foi um porto comercial movimentado nos séculos XVI e XVII, onde comerciantes vietnamitas, japoneses e chineses realizavam trocas comerciais. Em 1999, foi reconhecido pela UNESCO como Património Mundial.',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cn: '会安古城曾是16至17世纪繁荣的贸易港口，越南、日本和中国商人在此进行贸易。1999年，这里被联合国教科文组织列为世界文化遗产。',`: Gán thuộc tính cn: chuỗi '会安古城曾是16至17世纪繁荣的贸易港口，越南、日本和中国商人在此进行贸易。1999年，这里被联合国教科文组织列为世界文化遗产。'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      cn: '会安古城曾是16至17世纪繁荣的贸易港口，越南、日本和中国商人在此进行贸易。1999年，这里被联合国教科文组织列为世界文化遗产。',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 15.877.
      lat: 15.877,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 108.326,`: Gán thuộc tính lng: giá trị số 108.326.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       */
      lng: 108.326,
    },
  },
  {
    // Gán thuộc tính id: chuỗi '3'.
    id: '3',
    // Gán thuộc tính name: tạo object gồm vi, en, ja, pt, cn.
    name: {
      // Gán thuộc tính vi: chuỗi 'Chùa Một Cột'.
      vi: 'Chùa Một Cột',
      // Gán thuộc tính en: chuỗi 'One Pillar Pagoda'.
      en: 'One Pillar Pagoda',
      // Gán thuộc tính ja: chuỗi '一柱寺'.
      ja: '一柱寺',
      // Gán thuộc tính pt: chuỗi 'One Pillar Pagoda'.
      pt: 'One Pillar Pagoda',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cn: '一柱寺',`: Gán thuộc tính cn: chuỗi '一柱寺'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      cn: '一柱寺',
    },

    // CHỨC NĂNG: giữ trường hợp thiếu bản dịch đang có.
    // XỬ LÝ: Detail hiện tại vẫn tự dịch mô tả này bằng luồng cũ.
    // Gán thuộc tính description: tạo object gồm vi.
    description: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Chùa Một Cột được vua Lý Thái Tông cho xây dựng năm 1049 ở Hà Nội. Chùa có kiến `: Gán thuộc tính vi: chuỗi 'Chùa Một Cột được vua Lý Thái Tông cho xây dựng năm 1049 ở Hà Nội. Chùa có kiến trúc độc.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Chùa Một Cột được vua Lý Thái Tông cho xây dựng năm 1049 ở Hà Nội. Chùa có kiến trúc độc đáo, dựng trên một cột đá giữa hồ, giống hình bông sen nở.',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0359.
      lat: 21.0359,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 105.8335,`: Gán thuộc tính lng: giá trị số 105.8335.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
       */
      lng: 105.8335,
    },
  },
]

// CHỨC NĂNG: mô tả các trường bổ sung cho ba địa điểm cũ.
// XỬ LÝ: Pick chỉ lấy các trường metadata, tránh lặp lại tên/mô tả.
// Thứ tự metadata tương ứng thứ tự ORIGINAL_PLACES bên trên.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `type PlaceMetadata = Pick<`: Đặt tên kiểu PlaceMetadata.
 * DÒNG `Place,`: Thành phần kiểu `Place,` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `| 'category'`: Thành phần kiểu `| 'category'` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `| 'address'`: Thành phần kiểu `| 'address'` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `| 'region'`: Thành phần kiểu `| 'region'` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `| 'images'`: Thành phần kiểu `| 'images'` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `| 'rating'`: Thành phần kiểu `| 'rating'` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `| 'reviewCount'`: Thành phần kiểu `| 'reviewCount'` giới hạn hình dạng dữ liệu cho TypeScript.
 * DÒNG `>`: Thành phần kiểu `>` giới hạn hình dạng dữ liệu cho TypeScript.
 */
type PlaceMetadata = Pick<
  Place,
  | 'category'
  | 'address'
  | 'region'
  | 'images'
  | 'rating'
  | 'reviewCount'
>

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const metadata: PlaceMetadata[] = [`: Khai báo metadata: tạo mảng [ { category: 'heritage', address: { vi: 'Đống Đa, Hà Nội', en: 'Dong Da, Hanoi'.
 * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
 */
const metadata: PlaceMetadata[] = [
  {
    // Gán thuộc tính category: chuỗi 'heritage'.
    category: 'heritage',
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Đống Đa, Hà Nội'.
      vi: 'Đống Đa, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Dong Da, Hanoi'.
      en: 'Dong Da, Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ、ドンダー',`: Gán thuộc tính ja: chuỗi 'ハノイ、ドンダー'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ、ドンダー',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ',`: Gán thuộc tính ja: chuỗi 'ハノイ'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ',
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.8.
    rating: 4.8,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 320,`: Gán thuộc tính reviewCount: giá trị số 320.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    reviewCount: 320,
  },
  {
    // Gán thuộc tính category: chuỗi 'culture'.
    category: 'culture',
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Phố cổ Hội An'.
      vi: 'Phố cổ Hội An',
      // Gán thuộc tính en: chuỗi 'Hoi An Ancient Town'.
      en: 'Hoi An Ancient Town',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ホイアン旧市街',`: Gán thuộc tính ja: chuỗi 'ホイアン旧市街'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ホイアン旧市街',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hội An'.
      vi: 'Hội An',
      // Gán thuộc tính en: chuỗi 'Hoi An'.
      en: 'Hoi An',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ホイアン',`: Gán thuộc tính ja: chuỗi 'ホイアン'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ホイアン',
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.9.
    rating: 4.9,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 510,`: Gán thuộc tính reviewCount: giá trị số 510.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    reviewCount: 510,
  },
  {
    // Gán thuộc tính category: chuỗi 'spiritual'.
    category: 'spiritual',
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Ba Đình, Hà Nội'.
      vi: 'Ba Đình, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Ba Dinh, Hanoi'.
      en: 'Ba Dinh, Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ、バーディン',`: Gán thuộc tính ja: chuỗi 'ハノイ、バーディン'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ、バーディン',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ',`: Gán thuộc tính ja: chuỗi 'ハノイ'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ',
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.6.
    rating: 4.6,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 210,`: Gán thuộc tính reviewCount: giá trị số 210.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
     */
    reviewCount: 210,
  },
]

// CHỨC NĂNG: tạo danh sách đủ tám địa điểm và bảy danh mục.
// XỬ LÝ:
// - Ba phần tử đầu giữ dữ liệu gốc rồi ghép metadata.
// - Năm phần tử sau phục vụ demo tìm kiếm, lọc, ảnh và vị trí.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const MOCK_PLACES: Place[] = [`: Khai báo MOCK_PLACES: tạo mảng [ ...ORIGINAL_PLACES.map((place, index) => ({ ...place, ...metadata[index], })),.
 * DÒNG `...ORIGINAL_PLACES.map((place, index) => ({`: Khai báo MOCK_PLACES: tạo mảng [ ...ORIGINAL_PLACES.map((place, index) => ({ ...place, ...metadata[index], })),.
 * DÒNG `...place,`: Khai báo MOCK_PLACES: tạo mảng [ ...ORIGINAL_PLACES.map((place, index) => ({ ...place, ...metadata[index], })),.
 * DÒNG `...metadata[index],`: Khai báo MOCK_PLACES: tạo mảng [ ...ORIGINAL_PLACES.map((place, index) => ({ ...place, ...metadata[index], })),.
 * DÒNG `})),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
 * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
 */
export const MOCK_PLACES: Place[] = [
  ...ORIGINAL_PLACES.map((place, index) => ({
    ...place,
    ...metadata[index],
  })),
  {
    // Gán thuộc tính id: chuỗi '4'.
    id: '4',
    // Gán thuộc tính category: chuỗi 'landscape'.
    category: 'landscape',
    // Gán thuộc tính name: tạo object gồm vi, en, ja.
    name: {
      // Gán thuộc tính vi: chuỗi 'Hồ Hoàn Kiếm'.
      vi: 'Hồ Hoàn Kiếm',
      // Gán thuộc tính en: chuỗi 'Hoan Kiem Lake'.
      en: 'Hoan Kiem Lake',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ホアンキエム湖',`: Gán thuộc tính ja: chuỗi 'ホアンキエム湖'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ホアンキエム湖',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Hồ nước giữa trung tâm Hà Nội, gắn với truyền thuyết trả gươm.'.
      vi: 'Hồ nước giữa trung tâm Hà Nội, gắn với truyền thuyết trả gươm.',
      // Gán thuộc tính en: chuỗi 'A lake in central Hanoi associated with the legend of the returned sword.'.
      en: 'A lake in central Hanoi associated with the legend of the returned sword.',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ中心部にある、剣を返す伝説で知られる湖。',`: Gán thuộc tính ja: chuỗi 'ハノイ中心部にある、剣を返す伝説で知られる湖。'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ中心部にある、剣を返す伝説で知られる湖。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Hoàn Kiếm, Hà Nội'.
      vi: 'Hoàn Kiếm, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hoan Kiem, Hanoi'.
      en: 'Hoan Kiem, Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ、ホアンキエム',`: Gán thuộc tính ja: chuỗi 'ハノイ、ホアンキエム'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ、ホアンキエム',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ',`: Gán thuộc tính ja: chuỗi 'ハノイ'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0288.
      lat: 21.0288,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 105.8525,`: Gán thuộc tính lng: giá trị số 105.8525.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      lng: 105.8525,
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.7.
    rating: 4.7,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 430,`: Gán thuộc tính reviewCount: giá trị số 430.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    reviewCount: 430,
  },
  {
    // Gán thuộc tính id: chuỗi '5'.
    id: '5',
    // Gán thuộc tính category: chuỗi 'museum'.
    category: 'museum',
    // Gán thuộc tính name: tạo object gồm vi, en, ja.
    name: {
      // Gán thuộc tính vi: chuỗi 'Bảo tàng Dân tộc học Việt Nam'.
      vi: 'Bảo tàng Dân tộc học Việt Nam',
      // Gán thuộc tính en: chuỗi 'Vietnam Museum of Ethnology'.
      en: 'Vietnam Museum of Ethnology',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ベトナム民族学博物館',`: Gán thuộc tính ja: chuỗi 'ベトナム民族学博物館'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ベトナム民族学博物館',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Không gian giới thiệu đời sống và văn hóa các dân tộc Việt Nam.'.
      vi: 'Không gian giới thiệu đời sống và văn hóa các dân tộc Việt Nam.',
      // Gán thuộc tính en: chuỗi 'Explore the daily life and culture of ethnic groups in Vietnam.'.
      en: 'Explore the daily life and culture of ethnic groups in Vietnam.',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ベトナムの民族の生活と文化を紹介する施設。',`: Gán thuộc tính ja: chuỗi 'ベトナムの民族の生活と文化を紹介する施設。'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ベトナムの民族の生活と文化を紹介する施設。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Đường Nguyễn Văn Huyên, Hà Nội'.
      vi: 'Đường Nguyễn Văn Huyên, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Nguyen Van Huyen Street, Hanoi'.
      en: 'Nguyen Van Huyen Street, Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ、グエンヴァンフエン通り',`: Gán thuộc tính ja: chuỗi 'ハノイ、グエンヴァンフエン通り'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ、グエンヴァンフエン通り',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ',`: Gán thuộc tính ja: chuỗi 'ハノイ'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0404.
      lat: 21.0404,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 105.798,`: Gán thuộc tính lng: giá trị số 105.798.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      lng: 105.798,
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.5.
    rating: 4.5,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 180,`: Gán thuộc tính reviewCount: giá trị số 180.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    reviewCount: 180,
  },
  {
    // Gán thuộc tính id: chuỗi '6'.
    id: '6',
    // Gán thuộc tính category: chuỗi 'food'.
    category: 'food',
    // Gán thuộc tính name: tạo object gồm vi, en, ja.
    name: {
      // Gán thuộc tính vi: chuỗi 'Chợ Đồng Xuân'.
      vi: 'Chợ Đồng Xuân',
      // Gán thuộc tính en: chuỗi 'Dong Xuan Market'.
      en: 'Dong Xuan Market',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ドンスアン市場',`: Gán thuộc tính ja: chuỗi 'ドンスアン市場'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ドンスアン市場',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Khám phá hàng quán và món ăn địa phương ở khu phố cổ.'.
      vi: 'Khám phá hàng quán và món ăn địa phương ở khu phố cổ.',
      // Gán thuộc tính en: chuỗi 'Discover local food and market stalls in the old quarter.'.
      en: 'Discover local food and market stalls in the old quarter.',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: '旧市街の屋台と郷土料理を楽しめる市場。',`: Gán thuộc tính ja: chuỗi '旧市街の屋台と郷土料理を楽しめる市場。'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: '旧市街の屋台と郷土料理を楽しめる市場。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Đồng Xuân, Hà Nội'.
      vi: 'Đồng Xuân, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Dong Xuan, Hanoi'.
      en: 'Dong Xuan, Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ、ドンスアン',`: Gán thuộc tính ja: chuỗi 'ハノイ、ドンスアン'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ、ドンスアン',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハノイ',`: Gán thuộc tính ja: chuỗi 'ハノイ'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハノイ',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0381.
      lat: 21.0381,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 105.8494,`: Gán thuộc tính lng: giá trị số 105.8494.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      lng: 105.8494,
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.3.
    rating: 4.3,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 120,`: Gán thuộc tính reviewCount: giá trị số 120.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    reviewCount: 120,
  },
  {
    // Gán thuộc tính id: chuỗi '7'.
    id: '7',
    // Gán thuộc tính category: chuỗi 'craft'.
    category: 'craft',

    // CHỨC NĂNG: thử trường hợp một địa điểm chỉ có tiếng Việt.
    // XỬ LÝ: service có resolver sẽ bổ sung en/ja khi tải danh sách.
    // Gán thuộc tính name: tạo object gồm vi.
    name: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Làng gốm Bát Tràng',`: Gán thuộc tính vi: chuỗi 'Làng gốm Bát Tràng'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Làng gốm Bát Tràng',
    },
    // Gán thuộc tính description: tạo object gồm vi.
    description: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Làng nghề bên sông Hồng với trải nghiệm làm gốm truyền thống.',`: Gán thuộc tính vi: chuỗi 'Làng nghề bên sông Hồng với trải nghiệm làm gốm truyền thống.'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Làng nghề bên sông Hồng với trải nghiệm làm gốm truyền thống.',
    },
    // Gán thuộc tính address: tạo object gồm vi.
    address: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Bát Tràng, Hà Nội',`: Gán thuộc tính vi: chuỗi 'Bát Tràng, Hà Nội'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Bát Tràng, Hà Nội',
    },
    // Gán thuộc tính region: tạo object gồm vi.
    region: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Hà Nội',`: Gán thuộc tính vi: chuỗi 'Hà Nội'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Hà Nội',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 20.9786.
      lat: 20.9786,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 105.9132,`: Gán thuộc tính lng: giá trị số 105.9132.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      lng: 105.9132,
    },

    // CHỨC NĂNG: thử trường hợp không có ảnh.
    // XỬ LÝ: PlaceCard ở giai đoạn 2/3 phải hiện placeholder.
    // Gán thuộc tính images: tạo mảng [].
    images: [],
    // Gán thuộc tính rating: giá trị số 4.4.
    rating: 4.4,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 90,`: Gán thuộc tính reviewCount: giá trị số 90.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     */
    reviewCount: 90,
  },
  {
    // Gán thuộc tính id: chuỗi '8'.
    id: '8',
    // Gán thuộc tính category: chuỗi 'landscape'.
    category: 'landscape',
    // Gán thuộc tính name: tạo object gồm vi, en, ja.
    name: {
      // Gán thuộc tính vi: chuỗi 'Vịnh Hạ Long'.
      vi: 'Vịnh Hạ Long',
      // Gán thuộc tính en: chuỗi 'Ha Long Bay'.
      en: 'Ha Long Bay',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'ハロン湾',`: Gán thuộc tính ja: chuỗi 'ハロン湾'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'ハロン湾',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Vịnh biển nổi bật với những đảo đá vôi và cảnh quan thiên nhiên.'.
      vi: 'Vịnh biển nổi bật với những đảo đá vôi và cảnh quan thiên nhiên.',
      // Gán thuộc tính en: chuỗi 'A coastal bay famous for limestone islands and natural scenery.'.
      en: 'A coastal bay famous for limestone islands and natural scenery.',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: '石灰岩の島々と自然の景観で知られる湾。',`: Gán thuộc tính ja: chuỗi '石灰岩の島々と自然の景観で知られる湾。'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: '石灰岩の島々と自然の景観で知られる湾。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Hạ Long, Quảng Ninh'.
      vi: 'Hạ Long, Quảng Ninh',
      // Gán thuộc tính en: chuỗi 'Ha Long, Quang Ninh'.
      en: 'Ha Long, Quang Ninh',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'クアンニン省、ハロン',`: Gán thuộc tính ja: chuỗi 'クアンニン省、ハロン'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'クアンニン省、ハロン',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Quảng Ninh'.
      vi: 'Quảng Ninh',
      // Gán thuộc tính en: chuỗi 'Quang Ninh'.
      en: 'Quang Ninh',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `ja: 'クアンニン省',`: Gán thuộc tính ja: chuỗi 'クアンニン省'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      ja: 'クアンニン省',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 20.9101.
      lat: 20.9101,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 107.1839,`: Gán thuộc tính lng: giá trị số 107.1839.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      lng: 107.1839,
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', ].
     * DÒNG `'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',`: Gán thuộc tính images: tạo mảng [ 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', ].
     * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
     */
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.9.
    rating: 4.9,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `reviewCount: 600,`: Gán thuộc tính reviewCount: giá trị số 600.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
     */
    reviewCount: 600,
  },
]

// CHỨC NĂNG: mô phỏng một nguồn dữ liệu bất đồng bộ.
// XỬ LÝ:
// - Trả Promise giống hợp đồng của API.
// - Không cần mạng để lấy dữ liệu mẫu.
// - Sao chép cả các object/mảng lồng bên trong để bên gọi không
//   sửa nhầm nội dung của MOCK_PLACES.
// Khai báo loadMockPlaces(). Nhận đầu vào qua tham số.
export async function loadMockPlaces(): Promise<Place[]> {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return MOCK_PLACES.map((place) => ({`: Trả kết quả: MOCK_PLACES.map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
   * DÒNG `...place,`: Trả kết quả: MOCK_PLACES.map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
   */
  return MOCK_PLACES.map((place) => ({
    ...place,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `name: {`: Gán thuộc tính name: tạo object gồm ...giá trị ghép.
     * DÒNG `...place.name,`: Gán thuộc tính name: tạo object gồm ...giá trị ghép.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    name: {
      ...place.name,
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `description: {`: Gán thuộc tính description: tạo object gồm ...giá trị ghép.
     * DÒNG `...place.description,`: Gán thuộc tính description: tạo object gồm ...giá trị ghép.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    description: {
      ...place.description,
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `address: place.address`: Gán thuộc tính address: chọn giữa hai giá trị theo điều kiện place.address.
     * DÒNG `? { ...place.address }`: Gán thuộc tính address: chọn giữa hai giá trị theo điều kiện place.address.
     * DÒNG `: undefined,`: Gán thuộc tính address: chọn giữa hai giá trị theo điều kiện place.address.
     */
    address: place.address
      ? { ...place.address }
      : undefined,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `region: place.region`: Gán thuộc tính region: chọn giữa hai giá trị theo điều kiện place.region.
     * DÒNG `? { ...place.region }`: Gán thuộc tính region: chọn giữa hai giá trị theo điều kiện place.region.
     * DÒNG `: undefined,`: Gán thuộc tính region: chọn giữa hai giá trị theo điều kiện place.region.
     */
    region: place.region
      ? { ...place.region }
      : undefined,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `location: place.location`: Gán thuộc tính location: chọn giữa hai giá trị theo điều kiện place.location.
     * DÒNG `? { ...place.location }`: Gán thuộc tính location: chọn giữa hai giá trị theo điều kiện place.location.
     * DÒNG `: undefined,`: Gán thuộc tính location: chọn giữa hai giá trị theo điều kiện place.location.
     */
    location: place.location
      ? { ...place.location }
      : undefined,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `images: [...(place.images ?? [])],`: Gán thuộc tính images: tạo mảng [...(place.images ?? [])].
     * DÒNG `}))`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    images: [...(place.images ?? [])],
  }))
}
// TẠI SAO (loadMockPlaces): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý
// tập dữ liệu.