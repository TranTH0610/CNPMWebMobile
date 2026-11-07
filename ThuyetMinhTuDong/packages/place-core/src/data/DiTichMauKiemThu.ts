/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Bộ địa điểm mẫu của place-core, dùng kiểm thử tìm kiếm, danh mục và dịch qua service của package
 *
 * VỊ TRÍ: packages/place-core/src/data/DiTichMauKiemThu.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - @travelguide/shared-types
 *
 * CÁC KHỐI CHÍNH:
 * 1. loadMockPlaces
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập kiểu dữ liệu từ '@travelguide/shared-types'.
import type { Place } from '@travelguide/shared-types'

// CHỨC NĂNG: bảo toàn ba địa điểm ban đầu.
// XỬ LÝ: giữ ID để Detail, geofencing và cache theo ID vẫn hoạt động.

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
      
      cn: '文庙建于1070年，即李圣宗皇帝在位期间，是为了祭祀孔子而建。1076年，旁边建立了国子监，成为越南第一所大学。',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0286.
      lat: 21.0286,
      
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
      
      cn: '会安古城曾是16至17世纪繁荣的贸易港口，越南、日本和中国商人在此进行贸易。1999年，这里被联合国教科文组织列为世界文化遗产。',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 15.877.
      lat: 15.877,
      
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
      
      cn: '一柱寺',
    },

    // CHỨC NĂNG: giữ trường hợp thiếu bản dịch đang có.
    // XỬ LÝ: Detail hiện tại vẫn tự dịch mô tả này bằng luồng cũ.
    // Gán thuộc tính description: tạo object gồm vi.
    description: {
      
      vi: 'Chùa Một Cột được vua Lý Thái Tông cho xây dựng năm 1049 ở Hà Nội. Chùa có kiến trúc độc đáo, dựng trên một cột đá giữa hồ, giống hình bông sen nở.',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0359.
      lat: 21.0359,
      
      lng: 105.8335,
    },
  },
]

// CHỨC NĂNG: mô tả các trường bổ sung cho ba địa điểm cũ.
// XỬ LÝ: Pick chỉ lấy các trường metadata, tránh lặp lại tên/mô tả.
// Thứ tự metadata tương ứng thứ tự ORIGINAL_PLACES bên trên.

type PlaceMetadata = Pick<
  Place,
  | 'category'
  | 'address'
  | 'region'
  | 'images'
  | 'rating'
  | 'reviewCount'
>


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
      
      ja: 'ハノイ、ドンダー',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      
      ja: 'ハノイ',
    },
    
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.8.
    rating: 4.8,
    
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
      
      ja: 'ホイアン旧市街',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hội An'.
      vi: 'Hội An',
      // Gán thuộc tính en: chuỗi 'Hoi An'.
      en: 'Hoi An',
      
      ja: 'ホイアン',
    },
    
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.9.
    rating: 4.9,
    
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
      
      ja: 'ハノイ、バーディン',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      
      ja: 'ハノイ',
    },
    
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.6.
    rating: 4.6,
    
    reviewCount: 210,
  },
]

// CHỨC NĂNG: tạo danh sách đủ tám địa điểm và bảy danh mục.
// XỬ LÝ:
// - Ba phần tử đầu giữ dữ liệu gốc rồi ghép metadata.
// - Năm phần tử sau phục vụ demo tìm kiếm, lọc, ảnh và vị trí.

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
      
      ja: 'ホアンキエム湖',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Hồ nước giữa trung tâm Hà Nội, gắn với truyền thuyết trả gươm.'.
      vi: 'Hồ nước giữa trung tâm Hà Nội, gắn với truyền thuyết trả gươm.',
      // Gán thuộc tính en: chuỗi 'A lake in central Hanoi associated with the legend of the returned sword.'.
      en: 'A lake in central Hanoi associated with the legend of the returned sword.',
      
      ja: 'ハノイ中心部にある、剣を返す伝説で知られる湖。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Hoàn Kiếm, Hà Nội'.
      vi: 'Hoàn Kiếm, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hoan Kiem, Hanoi'.
      en: 'Hoan Kiem, Hanoi',
      
      ja: 'ハノイ、ホアンキエム',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      
      ja: 'ハノイ',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0288.
      lat: 21.0288,
      
      lng: 105.8525,
    },
    
    images: [
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.7.
    rating: 4.7,
    
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
      
      ja: 'ベトナム民族学博物館',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Không gian giới thiệu đời sống và văn hóa các dân tộc Việt Nam.'.
      vi: 'Không gian giới thiệu đời sống và văn hóa các dân tộc Việt Nam.',
      // Gán thuộc tính en: chuỗi 'Explore the daily life and culture of ethnic groups in Vietnam.'.
      en: 'Explore the daily life and culture of ethnic groups in Vietnam.',
      
      ja: 'ベトナムの民族の生活と文化を紹介する施設。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Đường Nguyễn Văn Huyên, Hà Nội'.
      vi: 'Đường Nguyễn Văn Huyên, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Nguyen Van Huyen Street, Hanoi'.
      en: 'Nguyen Van Huyen Street, Hanoi',
      
      ja: 'ハノイ、グエンヴァンフエン通り',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      
      ja: 'ハノイ',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0404.
      lat: 21.0404,
      
      lng: 105.798,
    },
    
    images: [
      'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.5.
    rating: 4.5,
    
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
      
      ja: 'ドンスアン市場',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Khám phá hàng quán và món ăn địa phương ở khu phố cổ.'.
      vi: 'Khám phá hàng quán và món ăn địa phương ở khu phố cổ.',
      // Gán thuộc tính en: chuỗi 'Discover local food and market stalls in the old quarter.'.
      en: 'Discover local food and market stalls in the old quarter.',
      
      ja: '旧市街の屋台と郷土料理を楽しめる市場。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Đồng Xuân, Hà Nội'.
      vi: 'Đồng Xuân, Hà Nội',
      // Gán thuộc tính en: chuỗi 'Dong Xuan, Hanoi'.
      en: 'Dong Xuan, Hanoi',
      
      ja: 'ハノイ、ドンスアン',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Hà Nội'.
      vi: 'Hà Nội',
      // Gán thuộc tính en: chuỗi 'Hanoi'.
      en: 'Hanoi',
      
      ja: 'ハノイ',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 21.0381.
      lat: 21.0381,
      
      lng: 105.8494,
    },
    
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.3.
    rating: 4.3,
    
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
      
      vi: 'Làng gốm Bát Tràng',
    },
    // Gán thuộc tính description: tạo object gồm vi.
    description: {
      
      vi: 'Làng nghề bên sông Hồng với trải nghiệm làm gốm truyền thống.',
    },
    // Gán thuộc tính address: tạo object gồm vi.
    address: {
      
      vi: 'Bát Tràng, Hà Nội',
    },
    // Gán thuộc tính region: tạo object gồm vi.
    region: {
      
      vi: 'Hà Nội',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 20.9786.
      lat: 20.9786,
      
      lng: 105.9132,
    },

    // CHỨC NĂNG: thử trường hợp không có ảnh.
    // XỬ LÝ: PlaceCard ở giai đoạn 2/3 phải hiện placeholder.
    // Gán thuộc tính images: tạo mảng [].
    images: [],
    // Gán thuộc tính rating: giá trị số 4.4.
    rating: 4.4,
    
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
      
      ja: 'ハロン湾',
    },
    // Gán thuộc tính description: tạo object gồm vi, en, ja.
    description: {
      // Gán thuộc tính vi: chuỗi 'Vịnh biển nổi bật với những đảo đá vôi và cảnh quan thiên nhiên.'.
      vi: 'Vịnh biển nổi bật với những đảo đá vôi và cảnh quan thiên nhiên.',
      // Gán thuộc tính en: chuỗi 'A coastal bay famous for limestone islands and natural scenery.'.
      en: 'A coastal bay famous for limestone islands and natural scenery.',
      
      ja: '石灰岩の島々と自然の景観で知られる湾。',
    },
    // Gán thuộc tính address: tạo object gồm vi, en, ja.
    address: {
      // Gán thuộc tính vi: chuỗi 'Hạ Long, Quảng Ninh'.
      vi: 'Hạ Long, Quảng Ninh',
      // Gán thuộc tính en: chuỗi 'Ha Long, Quang Ninh'.
      en: 'Ha Long, Quang Ninh',
      
      ja: 'クアンニン省、ハロン',
    },
    // Gán thuộc tính region: tạo object gồm vi, en, ja.
    region: {
      // Gán thuộc tính vi: chuỗi 'Quảng Ninh'.
      vi: 'Quảng Ninh',
      // Gán thuộc tính en: chuỗi 'Quang Ninh'.
      en: 'Quang Ninh',
      
      ja: 'クアンニン省',
    },
    // Gán thuộc tính location: tạo object gồm lat, lng.
    location: {
      // Gán thuộc tính lat: giá trị số 20.9101.
      lat: 20.9101,
      
      lng: 107.1839,
    },
    
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    // Gán thuộc tính rating: giá trị số 4.9.
    rating: 4.9,
    
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
// ==================== [KIEM-THU] loadMockPlaces ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export async function loadMockPlaces(): Promise<Place[]> {
  
  return MOCK_PLACES.map((place) => ({
    ...place,
    
    name: {
      ...place.name,
    },
    
    description: {
      ...place.description,
    },
    
    address: place.address
      ? { ...place.address }
      : undefined,
    
    region: place.region
      ? { ...place.region }
      : undefined,
    
    location: place.location
      ? { ...place.location }
      : undefined,
    
    images: [...(place.images ?? [])],
  }))
}
// TẠI SAO (loadMockPlaces): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý
// tập dữ liệu.