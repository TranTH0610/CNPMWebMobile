"use strict";
/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp dữ liệu mẫu dùng chung cho mobile và web.
 * Giữ nguyên ba ID địa điểm và nội dung thuyết minh cũ.
 *
 * Được dùng bởi:
 * - apps/mobile/src/services/places.ts
 * - Service web ở giai đoạn 3.
 * - packages/place-core/tests/core.test.cjs
 *
 * Phụ thuộc: @travelguide/shared-types.
 * Liên quan: UC03, FR-18, FR-37..39, FR-41.
 *
 * Lưu ý: ảnh là minh họa; rating/reviewCount là dữ liệu demo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_PLACES = void 0;
exports.loadMockPlaces = loadMockPlaces;
// CHỨC NĂNG: bảo toàn ba địa điểm ban đầu.
// XỬ LÝ: giữ ID để Detail, geofencing và cache theo ID vẫn hoạt động.
const ORIGINAL_PLACES = [
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
        location: {
            lat: 21.0286,
            lng: 105.8355,
        },
    },
    {
        id: '2',
        name: {
            vi: 'Phố cổ Hội An',
            en: 'Hoi An Ancient Town',
            ja: 'ホイアン旧市街',
            pt: 'Centro Histórico de Hội An',
            cn: '会安古城',
        },
        description: {
            vi: 'Phố cổ Hội An từng là thương cảng sầm uất từ thế kỷ 16 đến 17, nơi thương nhân Việt, Nhật, Trung Hoa cùng buôn bán. Năm 1999, nơi đây được UNESCO công nhận là Di sản văn hóa thế giới.',
            en: 'Hoi An Ancient Town was a busy trading port in the 16th and 17th centuries, where Vietnamese, Japanese and Chinese merchants traded together. UNESCO listed it as a World Heritage Site in 1999.',
            ja: 'ホイアンの旧市街は16〜17世紀に栄えた国際貿易港で、ベトナム、日本、中国の商人が交易を行いました。1999年にユネスコの世界遺産に登録されました。',
            pt: 'O centro histórico de Hội An foi um porto comercial movimentado nos séculos XVI e XVII, onde comerciantes vietnamitas, japoneses e chineses realizavam trocas comerciais. Em 1999, foi reconhecido pela UNESCO como Património Mundial.',
            cn: '会安古城曾是16至17世纪繁荣的贸易港口，越南、日本和中国商人在此进行贸易。1999年，这里被联合国教科文组织列为世界文化遗产。',
        },
        location: {
            lat: 15.877,
            lng: 108.326,
        },
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
        // CHỨC NĂNG: giữ trường hợp thiếu bản dịch đang có.
        // XỬ LÝ: Detail hiện tại vẫn tự dịch mô tả này bằng luồng cũ.
        description: {
            vi: 'Chùa Một Cột được vua Lý Thái Tông cho xây dựng năm 1049 ở Hà Nội. Chùa có kiến trúc độc đáo, dựng trên một cột đá giữa hồ, giống hình bông sen nở.',
        },
        location: {
            lat: 21.0359,
            lng: 105.8335,
        },
    },
];
const metadata = [
    {
        category: 'heritage',
        address: {
            vi: 'Đống Đa, Hà Nội',
            en: 'Dong Da, Hanoi',
            ja: 'ハノイ、ドンダー',
        },
        region: {
            vi: 'Hà Nội',
            en: 'Hanoi',
            ja: 'ハノイ',
        },
        images: [
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        ],
        rating: 4.8,
        reviewCount: 320,
    },
    {
        category: 'culture',
        address: {
            vi: 'Phố cổ Hội An',
            en: 'Hoi An Ancient Town',
            ja: 'ホイアン旧市街',
        },
        region: {
            vi: 'Hội An',
            en: 'Hoi An',
            ja: 'ホイアン',
        },
        images: [
            'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
        ],
        rating: 4.9,
        reviewCount: 510,
    },
    {
        category: 'spiritual',
        address: {
            vi: 'Ba Đình, Hà Nội',
            en: 'Ba Dinh, Hanoi',
            ja: 'ハノイ、バーディン',
        },
        region: {
            vi: 'Hà Nội',
            en: 'Hanoi',
            ja: 'ハノイ',
        },
        images: [
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        ],
        rating: 4.6,
        reviewCount: 210,
    },
];
// CHỨC NĂNG: tạo danh sách đủ tám địa điểm và bảy danh mục.
// XỬ LÝ:
// - Ba phần tử đầu giữ dữ liệu gốc rồi ghép metadata.
// - Năm phần tử sau phục vụ demo tìm kiếm, lọc, ảnh và vị trí.
exports.MOCK_PLACES = [
    ...ORIGINAL_PLACES.map((place, index) => ({
        ...place,
        ...metadata[index],
    })),
    {
        id: '4',
        category: 'landscape',
        name: {
            vi: 'Hồ Hoàn Kiếm',
            en: 'Hoan Kiem Lake',
            ja: 'ホアンキエム湖',
        },
        description: {
            vi: 'Hồ nước giữa trung tâm Hà Nội, gắn với truyền thuyết trả gươm.',
            en: 'A lake in central Hanoi associated with the legend of the returned sword.',
            ja: 'ハノイ中心部にある、剣を返す伝説で知られる湖。',
        },
        address: {
            vi: 'Hoàn Kiếm, Hà Nội',
            en: 'Hoan Kiem, Hanoi',
            ja: 'ハノイ、ホアンキエム',
        },
        region: {
            vi: 'Hà Nội',
            en: 'Hanoi',
            ja: 'ハノイ',
        },
        location: {
            lat: 21.0288,
            lng: 105.8525,
        },
        images: [
            'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',
        ],
        rating: 4.7,
        reviewCount: 430,
    },
    {
        id: '5',
        category: 'museum',
        name: {
            vi: 'Bảo tàng Dân tộc học Việt Nam',
            en: 'Vietnam Museum of Ethnology',
            ja: 'ベトナム民族学博物館',
        },
        description: {
            vi: 'Không gian giới thiệu đời sống và văn hóa các dân tộc Việt Nam.',
            en: 'Explore the daily life and culture of ethnic groups in Vietnam.',
            ja: 'ベトナムの民族の生活と文化を紹介する施設。',
        },
        address: {
            vi: 'Đường Nguyễn Văn Huyên, Hà Nội',
            en: 'Nguyen Van Huyen Street, Hanoi',
            ja: 'ハノイ、グエンヴァンフエン通り',
        },
        region: {
            vi: 'Hà Nội',
            en: 'Hanoi',
            ja: 'ハノイ',
        },
        location: {
            lat: 21.0404,
            lng: 105.798,
        },
        images: [
            'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800',
        ],
        rating: 4.5,
        reviewCount: 180,
    },
    {
        id: '6',
        category: 'food',
        name: {
            vi: 'Chợ Đồng Xuân',
            en: 'Dong Xuan Market',
            ja: 'ドンスアン市場',
        },
        description: {
            vi: 'Khám phá hàng quán và món ăn địa phương ở khu phố cổ.',
            en: 'Discover local food and market stalls in the old quarter.',
            ja: '旧市街の屋台と郷土料理を楽しめる市場。',
        },
        address: {
            vi: 'Đồng Xuân, Hà Nội',
            en: 'Dong Xuan, Hanoi',
            ja: 'ハノイ、ドンスアン',
        },
        region: {
            vi: 'Hà Nội',
            en: 'Hanoi',
            ja: 'ハノイ',
        },
        location: {
            lat: 21.0381,
            lng: 105.8494,
        },
        images: [
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        ],
        rating: 4.3,
        reviewCount: 120,
    },
    {
        id: '7',
        category: 'craft',
        // CHỨC NĂNG: thử trường hợp một địa điểm chỉ có tiếng Việt.
        // XỬ LÝ: service có resolver sẽ bổ sung en/ja khi tải danh sách.
        name: {
            vi: 'Làng gốm Bát Tràng',
        },
        description: {
            vi: 'Làng nghề bên sông Hồng với trải nghiệm làm gốm truyền thống.',
        },
        address: {
            vi: 'Bát Tràng, Hà Nội',
        },
        region: {
            vi: 'Hà Nội',
        },
        location: {
            lat: 20.9786,
            lng: 105.9132,
        },
        // CHỨC NĂNG: thử trường hợp không có ảnh.
        // XỬ LÝ: PlaceCard ở giai đoạn 2/3 phải hiện placeholder.
        images: [],
        rating: 4.4,
        reviewCount: 90,
    },
    {
        id: '8',
        category: 'landscape',
        name: {
            vi: 'Vịnh Hạ Long',
            en: 'Ha Long Bay',
            ja: 'ハロン湾',
        },
        description: {
            vi: 'Vịnh biển nổi bật với những đảo đá vôi và cảnh quan thiên nhiên.',
            en: 'A coastal bay famous for limestone islands and natural scenery.',
            ja: '石灰岩の島々と自然の景観で知られる湾。',
        },
        address: {
            vi: 'Hạ Long, Quảng Ninh',
            en: 'Ha Long, Quang Ninh',
            ja: 'クアンニン省、ハロン',
        },
        region: {
            vi: 'Quảng Ninh',
            en: 'Quang Ninh',
            ja: 'クアンニン省',
        },
        location: {
            lat: 20.9101,
            lng: 107.1839,
        },
        images: [
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        ],
        rating: 4.9,
        reviewCount: 600,
    },
];
// CHỨC NĂNG: mô phỏng một nguồn dữ liệu bất đồng bộ.
// XỬ LÝ:
// - Trả Promise giống hợp đồng của API.
// - Không cần mạng để lấy dữ liệu mẫu.
// - Sao chép cả các object/mảng lồng bên trong để bên gọi không
//   sửa nhầm nội dung của MOCK_PLACES.
async function loadMockPlaces() {
    return exports.MOCK_PLACES.map((place) => ({
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
    }));
}
