"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_LABELS = void 0;
exports.normalize = normalize;
exports.searchPlaces = searchPlaces;
exports.filterCategories = filterCategories;
exports.categoryCounts = categoryCounts;
exports.shouldShowCategories = shouldShowCategories;
exports.sortPlaces = sortPlaces;
exports.createPlaceService = createPlaceService;
// CHỨC NĂNG: tên danh mục dùng để tìm kiếm trong đúng ngôn ngữ.
// XỬ LÝ: đủ năm ngôn ngữ đang có; các hàm normalize/search giữ nguyên.
// Khai báo CATEGORY_LABELS: tạo object gồm heritage, landscape, museum, culture, spiritual, food, craft.
exports.CATEGORY_LABELS = {
    // Gán thuộc tính heritage: tạo object gồm vi, en, ja, pt, cn.
    heritage: {
        // Gán thuộc tính vi: chuỗi 'Di tích'.
        vi: 'Di tích',
        // Gán thuộc tính en: chuỗi 'Heritage'.
        en: 'Heritage',
        // Gán thuộc tính ja: chuỗi '史跡'.
        ja: '史跡',
        // Gán thuộc tính pt: chuỗi 'Património'.
        pt: 'Património',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '历史遗迹',`: Gán thuộc tính cn: chuỗi '历史遗迹'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '历史遗迹',
    },
    // Gán thuộc tính landscape: tạo object gồm vi, en, ja, pt, cn.
    landscape: {
        // Gán thuộc tính vi: chuỗi 'Danh lam thắng cảnh'.
        vi: 'Danh lam thắng cảnh',
        // Gán thuộc tính en: chuỗi 'Scenic attractions'.
        en: 'Scenic attractions',
        // Gán thuộc tính ja: chuỗi '名勝'.
        ja: '名勝',
        // Gán thuộc tính pt: chuỗi 'Paisagens'.
        pt: 'Paisagens',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '风景名胜',`: Gán thuộc tính cn: chuỗi '风景名胜'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '风景名胜',
    },
    // Gán thuộc tính museum: tạo object gồm vi, en, ja, pt, cn.
    museum: {
        // Gán thuộc tính vi: chuỗi 'Bảo tàng'.
        vi: 'Bảo tàng',
        // Gán thuộc tính en: chuỗi 'Museums'.
        en: 'Museums',
        // Gán thuộc tính ja: chuỗi '博物館'.
        ja: '博物館',
        // Gán thuộc tính pt: chuỗi 'Museus'.
        pt: 'Museus',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '博物馆',`: Gán thuộc tính cn: chuỗi '博物馆'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '博物馆',
    },
    // Gán thuộc tính culture: tạo object gồm vi, en, ja, pt, cn.
    culture: {
        // Gán thuộc tính vi: chuỗi 'Văn hóa'.
        vi: 'Văn hóa',
        // Gán thuộc tính en: chuỗi 'Culture'.
        en: 'Culture',
        // Gán thuộc tính ja: chuỗi '文化'.
        ja: '文化',
        // Gán thuộc tính pt: chuỗi 'Cultura'.
        pt: 'Cultura',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '文化',`: Gán thuộc tính cn: chuỗi '文化'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '文化',
    },
    // Gán thuộc tính spiritual: tạo object gồm vi, en, ja, pt, cn.
    spiritual: {
        // Gán thuộc tính vi: chuỗi 'Tâm linh'.
        vi: 'Tâm linh',
        // Gán thuộc tính en: chuỗi 'Spiritual sites'.
        en: 'Spiritual sites',
        // Gán thuộc tính ja: chuỗi '宗教施設'.
        ja: '宗教施設',
        // Gán thuộc tính pt: chuỗi 'Locais religiosos'.
        pt: 'Locais religiosos',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '宗教场所',`: Gán thuộc tính cn: chuỗi '宗教场所'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '宗教场所',
    },
    // Gán thuộc tính food: tạo object gồm vi, en, ja, pt, cn.
    food: {
        // Gán thuộc tính vi: chuỗi 'Ẩm thực'.
        vi: 'Ẩm thực',
        // Gán thuộc tính en: chuỗi 'Food'.
        en: 'Food',
        // Gán thuộc tính ja: chuỗi 'グルメ'.
        ja: 'グルメ',
        // Gán thuộc tính pt: chuỗi 'Gastronomia'.
        pt: 'Gastronomia',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '美食',`: Gán thuộc tính cn: chuỗi '美食'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '美食',
    },
    // Gán thuộc tính craft: tạo object gồm vi, en, ja, pt, cn.
    craft: {
        // Gán thuộc tính vi: chuỗi 'Làng nghề'.
        vi: 'Làng nghề',
        // Gán thuộc tính en: chuỗi 'Craft villages'.
        en: 'Craft villages',
        // Gán thuộc tính ja: chuỗi '工芸村'.
        ja: '工芸村',
        // Gán thuộc tính pt: chuỗi 'Aldeias artesanais'.
        pt: 'Aldeias artesanais',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cn: '手工艺村',`: Gán thuộc tính cn: chuỗi '手工艺村'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cn: '手工艺村',
    },
};
// CHỨC NĂNG: chuẩn hóa chữ để tìm không phân biệt hoa/thường và dấu.
// XỬ LÝ:
// 1. Chuyển sang chữ thường.
// 2. NFD tách chữ có dấu thành chữ gốc và các dấu kết hợp.
// 3. Xóa dấu kết hợp.
// 4. Đổi đ thành d vì NFD không tự xử lý chữ đ.
// 5. Gom nhiều khoảng trắng thành một và bỏ khoảng trắng hai đầu.
// Khai báo normalize(value). Chuẩn hóa chữ để so sánh/tìm kiếm.
function normalize(value) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return value`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `.toLowerCase()`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `.normalize('NFD')`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `.replace(/[\u0300-\u036f]/g, '')`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `.replace(/đ/g, 'd')`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `.replace(/\s+/g, ' ')`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `.trim()`: Trả kết quả: value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, ' ')
        .trim();
}
// TẠI SAO (normalize): Người dùng có thể gõ không dấu, chữ hoa hoặc nhiều dấu cách; chuẩn hóa
// giúp tìm cùng một nội dung nhất quán.
// CHỨC NĂNG: tìm địa điểm trong ngôn ngữ đang chọn.
// XỬ LÝ:
// - Tìm tên, địa chỉ, mô tả và tên danh mục.
// - Không tự lấy nội dung vi khi người dùng chọn en.
// - Service sẽ dịch nội dung thiếu trước khi đưa vào tìm kiếm.
// - Mọi từ trong truy vấn đều phải xuất hiện trong nội dung địa điểm.
// - Các từ không bắt buộc nằm liền nhau.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function searchPlaces(`: Khai báo searchPlaces(places, query, language). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly Place[],`: Nhận đầu vào places: readonly Place[] từ nơi gọi hàm.
 * DÒNG `query: string,`: Nhận đầu vào query: string từ nơi gọi hàm.
 * DÒNG `language: PlaceLanguage,`: Nhận đầu vào language: PlaceLanguage từ nơi gọi hàm.
 * DÒNG `): Place[] {`: Khai báo searchPlaces(places, query, language). Nhận đầu vào qua tham số.
 */
function searchPlaces(places, query, language) {
    // CHỨC NĂNG: chuẩn hóa và tách câu tìm kiếm thành từng từ.
    // XỬ LÝ: query rỗng hoặc chỉ có khoảng trắng sẽ không tạo từ nào.
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const words = normalize(query)`: Khai báo words: normalize(query)
      .split(' ')
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `.split(' ')`: Khai báo words: normalize(query)
      .split(' ')
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `.filter(Boolean)`: Khai báo words: normalize(query)
      .split(' ')
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     */
    const words = normalize(query)
        .split(' ')
        .filter(Boolean);
    // CHỨC NĂNG: xóa ô tìm kiếm thì trả lại đủ danh sách.
    // XỬ LÝ: tạo mảng mới để bên gọi không sửa trực tiếp mảng nguồn.
    // Rẽ nhánh nếu words.length === 0.
    if (words.length === 0) {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return [...places]`: Trả kết quả: tạo mảng [...places].
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return [...places];
    }
    // Trả kết quả: places.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
    return places.filter((place) => {
        // CHỨC NĂNG: gom các trường được phép tìm kiếm.
        // XỬ LÝ:
        // - Dấu ?. bảo vệ trường address bị thiếu ở dữ liệu cũ.
        // - filter(Boolean) loại undefined và chuỗi rỗng.
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `const searchableText = normalize(`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `[`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         * DÒNG `place.name[language],`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `place.address?.[language],`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `place.description[language],`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `place.category`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `? CATEGORY_LABELS[place.category][language]`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `: undefined,`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
         * DÒNG `.filter(Boolean)`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `.join(' '),`: Khai báo searchableText: Gọi normalize( [ place.name[language], place.address?.[language], place.description[language],.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        const searchableText = normalize([
            place.name[language],
            place.address?.[language],
            place.description[language],
            place.category
                ? exports.CATEGORY_LABELS[place.category][language]
                : undefined,
        ]
            .filter(Boolean)
            .join(' '));
        // CHỨC NĂNG: kiểm tra địa điểm có đủ mọi từ người dùng gõ.
        // XỬ LÝ: every chỉ trả true nếu tất cả từ đều khớp.
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return words.every((word) => searchableText.includes(word))`: Trả kết quả: words.every kiểm tra tất cả phần tử đạt điều kiện trước khi chấp nhận dữ liệu.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return words.every((word) => searchableText.includes(word));
    });
}
// TẠI SAO (searchPlaces): Tìm trong đúng ngôn ngữ đang chọn để kết quả khớp với nội dung người
// dùng nhìn thấy.
// CHỨC NĂNG: lọc một hoặc nhiều danh mục.
// XỬ LÝ:
// - selected rỗng nghĩa là "Tất cả".
// - Mobile có thể truyền một ID.
// - Web có thể truyền nhiều ID do có checkbox.
// - Địa điểm cũ thiếu category vẫn hiện trong "Tất cả".
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function filterCategories(`: Khai báo filterCategories(places, selected). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly Place[],`: Nhận đầu vào places: readonly Place[] từ nơi gọi hàm.
 * DÒNG `selected: readonly CategoryId[],`: Nhận đầu vào selected: readonly CategoryId[] từ nơi gọi hàm.
 * DÒNG `): Place[] {`: Khai báo filterCategories(places, selected). Nhận đầu vào qua tham số.
 */
function filterCategories(places, selected) {
    // Trả kết quả: places.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
    return places.filter((place) => {
        // Rẽ nhánh nếu selected.length === 0.
        if (selected.length === 0) {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `return true`: Trả kết quả: sử dụng true làm giá trị của bước hiện tại.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            return true;
        }
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return (`: Trả kết quả: sử dụng ( place.category !== undefined && selected.includes(place.category) ) làm giá trị của bước hiện tại.
         * DÒNG `place.category !== undefined &&`: Trả kết quả: sử dụng ( place.category !== undefined && selected.includes(place.category) ) làm giá trị của bước hiện tại.
         * DÒNG `selected.includes(place.category)`: Trả kết quả: sử dụng ( place.category !== undefined && selected.includes(place.category) ) làm giá trị của bước hiện tại.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return (place.category !== undefined &&
            selected.includes(place.category));
    });
}
// TẠI SAO (filterCategories): Chưa chọn danh mục cần hiểu là tất cả; trả mảng mới giúp tránh vô
// tình sửa nguồn dữ liệu.
// CHỨC NĂNG: đếm số địa điểm thuộc từng danh mục.
// XỬ LÝ:
// - Dùng Partial vì không phải danh mục nào cũng xuất hiện.
// - Bỏ qua địa điểm chưa có category.
// - ?? 0 nghĩa là danh mục chưa được đếm thì bắt đầu từ 0.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function categoryCounts(`: Khai báo categoryCounts(places). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly Place[],`: Nhận đầu vào places: readonly Place[] từ nơi gọi hàm.
 * DÒNG `): Partial<Record<CategoryId, number>> {`: Khai báo categoryCounts(places). Nhận đầu vào qua tham số.
 */
function categoryCounts(places) {
    // Khai báo counts: tạo object gồm.
    const counts = {};
    // Duyệt lần lượt places bằng const place.
    for (const place of places) {
        // Rẽ nhánh nếu place.category.
        if (place.category) {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `counts[place.category] =`: Thực hiện tính biểu thức counts[place.category] = (counts[place.category] ?? 0) + 1.
             * DÒNG `(counts[place.category] ?? 0) + 1`: Thực hiện tính biểu thức counts[place.category] = (counts[place.category] ?? 0) + 1.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            counts[place.category] =
                (counts[place.category] ?? 0) + 1;
        }
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return counts`: Trả kết quả: sử dụng counts làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return counts;
}
// TẠI SAO (categoryCounts): Số lượng cạnh danh mục cần tính theo cùng định nghĩa danh mục với
// thao tác lọc.
// CHỨC NĂNG: quyết định có cần hiển thị bộ lọc danh mục.
// XỬ LÝ: chỉ hiện khi nguồn dữ liệu có ít nhất hai danh mục khác nhau.
// UI nên truyền danh sách gốc đã tải, không truyền danh sách sau khi
// người dùng chọn một danh mục, nếu không bộ lọc có thể biến mất.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function shouldShowCategories(`: Khai báo shouldShowCategories(places). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly Place[],`: Nhận đầu vào places: readonly Place[] từ nơi gọi hàm.
 * DÒNG `): boolean {`: Khai báo shouldShowCategories(places). Nhận đầu vào qua tham số.
 */
function shouldShowCategories(places) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return Object.keys(categoryCounts(places)).length >= 2`: Trả kết quả: tính biểu thức Object.keys(categoryCounts(places)).length >= 2.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return Object.keys(categoryCounts(places)).length >= 2;
}
// CHỨC NĂNG: sắp xếp theo khoảng cách, tên hoặc đánh giá.
// XỬ LÝ:
// - Sắp xếp bản sao, không đổi thứ tự mảng nguồn.
// - Không có vị trí/hàm đo thì "nearest" chuyển thành "name".
// - Địa điểm thiếu tọa độ hoặc khoảng cách không hợp lệ đi cuối.
// - Khi bằng nhau dùng tên và ID để giữ thứ tự ổn định.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function sortPlaces(`: Khai báo sortPlaces(places, options). Nhận đầu vào qua tham số.
 * DÒNG `places: readonly Place[],`: Nhận đầu vào places: readonly Place[] từ nơi gọi hàm.
 * DÒNG `options: SortOptions,`: Nhận đầu vào options: SortOptions từ nơi gọi hàm.
 * DÒNG `): Place[] {`: Khai báo sortPlaces(places, options). Nhận đầu vào qua tham số.
 */
function sortPlaces(places, options) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const canMeasure =`: Khai báo canMeasure: tính biểu thức options.origin !== undefined && options.distanceMeters !== undefined.
     * DÒNG `options.origin !== undefined &&`: Khai báo canMeasure: tính biểu thức options.origin !== undefined && options.distanceMeters !== undefined.
     * DÒNG `options.distanceMeters !== undefined`: Khai báo canMeasure: tính biểu thức options.origin !== undefined && options.distanceMeters !== undefined.
     */
    const canMeasure = options.origin !== undefined &&
        options.distanceMeters !== undefined;
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const effectiveOrder =`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện options.order === 'nearest' && !canMeasure.
     * DÒNG `options.order === 'nearest' && !canMeasure`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện options.order === 'nearest' && !canMeasure.
     * DÒNG `? 'name'`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện options.order === 'nearest' && !canMeasure.
     * DÒNG `: options.order`: Khai báo effectiveOrder: chọn giữa hai giá trị theo điều kiện options.order === 'nearest' && !canMeasure.
     */
    const effectiveOrder = options.order === 'nearest' && !canMeasure
        ? 'name'
        : options.order;
    // CHỨC NĂNG: lưu khoảng cách đã tính theo ID.
    // XỬ LÝ: tính một lần mỗi địa điểm thay vì tính lại trong mỗi
    // lần hàm sort so sánh hai phần tử.
    // Khai báo distances: Map giữ các cặp khóa–giá trị trong RAM.
    const distances = new Map();
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (`: Rẽ nhánh nếu effectiveOrder === 'nearest' && options.origin && options.distanceMeters.
     * DÒNG `effectiveOrder === 'nearest' &&`: Rẽ nhánh nếu effectiveOrder === 'nearest' && options.origin && options.distanceMeters.
     * DÒNG `options.origin &&`: Rẽ nhánh nếu effectiveOrder === 'nearest' && options.origin && options.distanceMeters.
     * DÒNG `options.distanceMeters`: Rẽ nhánh nếu effectiveOrder === 'nearest' && options.origin && options.distanceMeters.
     * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    if (effectiveOrder === 'nearest' &&
        options.origin &&
        options.distanceMeters) {
        // Duyệt lần lượt places bằng const place.
        for (const place of places) {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `const distance = place.location`: Khai báo distance: chọn giữa hai giá trị theo điều kiện place.location.
             * DÒNG `? options.distanceMeters(`: Khai báo distance: chọn giữa hai giá trị theo điều kiện place.location.
             * DÒNG `options.origin,`: Khai báo distance: chọn giữa hai giá trị theo điều kiện place.location.
             * DÒNG `place.location,`: Khai báo distance: chọn giữa hai giá trị theo điều kiện place.location.
             * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
             * DÒNG `: Infinity`: Khai báo distance: chọn giữa hai giá trị theo điều kiện place.location.
             */
            const distance = place.location
                ? options.distanceMeters(options.origin, place.location)
                : Infinity;
            // CHỨC NĂNG: loại khoảng cách NaN, âm hoặc vô hạn.
            // XỬ LÝ: Infinity giúp địa điểm đó nằm cuối danh sách.
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `const safeDistance =`: Khai báo safeDistance: chọn giữa hai giá trị theo điều kiện Number.isFinite(distance) && distance >= 0.
             * DÒNG `Number.isFinite(distance) && distance >= 0`: Khai báo safeDistance: chọn giữa hai giá trị theo điều kiện Number.isFinite(distance) && distance >= 0.
             * DÒNG `? distance`: Khai báo safeDistance: chọn giữa hai giá trị theo điều kiện Number.isFinite(distance) && distance >= 0.
             * DÒNG `: Infinity`: Khai báo safeDistance: chọn giữa hai giá trị theo điều kiện Number.isFinite(distance) && distance >= 0.
             */
            const safeDistance = Number.isFinite(distance) && distance >= 0
                ? distance
                : Infinity;
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `distances.set(place.id, safeDistance)`: Thực hiện Gọi distances.set(place.id, safeDistance).
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            distances.set(place.id, safeDistance);
        }
    }
    // CHỨC NĂNG: so sánh tên theo ngôn ngữ đang chọn.
    // XỬ LÝ:
    // - Thiếu tên thì dùng chuỗi rỗng, không phát sinh lỗi.
    // - cn là mã nội bộ hiện có; Intl dùng mã zh cho tiếng Trung.
    // - Tên bằng nhau thì so sánh ID để thứ tự không thay đổi ngẫu nhiên.
    // Khai báo compareNames: khai báo callback (a: Place, b: Place): number => { const leftName = normalize( a.name[option.
    const compareNames = (a, b) => {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `const leftName = normalize(`: Khai báo leftName: Gọi normalize( a.name[options.language] ?? '', ).
         * DÒNG `a.name[options.language] ?? '',`: Khai báo leftName: Gọi normalize( a.name[options.language] ?? '', ).
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        const leftName = normalize(a.name[options.language] ?? '');
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `const rightName = normalize(`: Khai báo rightName: Gọi normalize( b.name[options.language] ?? '', ).
         * DÒNG `b.name[options.language] ?? '',`: Khai báo rightName: Gọi normalize( b.name[options.language] ?? '', ).
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        const rightName = normalize(b.name[options.language] ?? '');
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `const locale =`: Khai báo locale: chọn giữa hai giá trị theo điều kiện options.language === 'cn'.
         * DÒNG `options.language === 'cn'`: Khai báo locale: chọn giữa hai giá trị theo điều kiện options.language === 'cn'.
         * DÒNG `? 'zh'`: Khai báo locale: chọn giữa hai giá trị theo điều kiện options.language === 'cn'.
         * DÒNG `: options.language`: Khai báo locale: chọn giữa hai giá trị theo điều kiện options.language === 'cn'.
         */
        const locale = options.language === 'cn'
            ? 'zh'
            : options.language;
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return (`: Trả kết quả: sử dụng ( leftName.localeCompare(rightName, locale) || a.id.localeCompare(b.id) ) làm giá trị của bước hiện tại.
         * DÒNG `leftName.localeCompare(rightName, locale) ||`: Trả kết quả: sử dụng ( leftName.localeCompare(rightName, locale) || a.id.localeCompare(b.id) ) làm giá trị của bước hiện tại.
         * DÒNG `a.id.localeCompare(b.id)`: Trả kết quả: sử dụng ( leftName.localeCompare(rightName, locale) || a.id.localeCompare(b.id) ) làm giá trị của bước hiện tại.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return (leftName.localeCompare(rightName, locale) ||
            a.id.localeCompare(b.id));
    };
    // TẠI SAO (compareNames): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
    // quán và dễ bảo trì.
    // Trả kết quả: [...places].sort sắp xếp mảng theo hàm so sánh.
    return [...places].sort((a, b) => {
        // CHỨC NĂNG: rating cao đứng trước.
        // XỬ LÝ: dữ liệu cũ thiếu rating dùng 0 cho việc sắp xếp;
        // UI vẫn phải phân biệt "chưa có đánh giá" với rating thật bằng 0.
        // Rẽ nhánh nếu effectiveOrder === 'rating'.
        if (effectiveOrder === 'rating') {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `return (`: Trả kết quả: sử dụng ( (b.rating ?? 0) - (a.rating ?? 0) || compareNames(a, b) ) làm giá trị của bước hiện tại.
             * DÒNG `(b.rating ?? 0) - (a.rating ?? 0) ||`: Trả kết quả: sử dụng ( (b.rating ?? 0) - (a.rating ?? 0) || compareNames(a, b) ) làm giá trị của bước hiện tại.
             * DÒNG `compareNames(a, b)`: Trả kết quả: sử dụng ( (b.rating ?? 0) - (a.rating ?? 0) || compareNames(a, b) ) làm giá trị của bước hiện tại.
             * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            return ((b.rating ?? 0) - (a.rating ?? 0) ||
                compareNames(a, b));
        }
        // CHỨC NĂNG: khoảng cách nhỏ đứng trước.
        // XỬ LÝ: hai Infinity không được trừ trực tiếp vì ra NaN;
        // kiểm tra bằng nhau trước để chuyển sang so sánh tên.
        // Rẽ nhánh nếu effectiveOrder === 'nearest'.
        if (effectiveOrder === 'nearest') {
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `const leftDistance =`: Gán leftDistance bằng distances.get(a.id); nếu null hoặc undefined thì dùng Infinity.
             * DÒNG `distances.get(a.id) ?? Infinity`: Gán leftDistance bằng distances.get(a.id); nếu null hoặc undefined thì dùng Infinity.
             */
            const leftDistance = distances.get(a.id) ?? Infinity;
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `const rightDistance =`: Gán rightDistance bằng distances.get(b.id); nếu null hoặc undefined thì dùng Infinity.
             * DÒNG `distances.get(b.id) ?? Infinity`: Gán rightDistance bằng distances.get(b.id); nếu null hoặc undefined thì dùng Infinity.
             */
            const rightDistance = distances.get(b.id) ?? Infinity;
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `const distanceComparison =`: Khai báo distanceComparison: chọn giữa hai giá trị theo điều kiện leftDistance === rightDistance.
             * DÒNG `leftDistance === rightDistance`: Khai báo distanceComparison: chọn giữa hai giá trị theo điều kiện leftDistance === rightDistance.
             * DÒNG `? 0`: Khai báo distanceComparison: chọn giữa hai giá trị theo điều kiện leftDistance === rightDistance.
             * DÒNG `: leftDistance - rightDistance`: Khai báo distanceComparison: chọn giữa hai giá trị theo điều kiện leftDistance === rightDistance.
             */
            const distanceComparison = leftDistance === rightDistance
                ? 0
                : leftDistance - rightDistance;
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `return (`: Trả kết quả: sử dụng ( distanceComparison || compareNames(a, b) ) làm giá trị của bước hiện tại.
             * DÒNG `distanceComparison ||`: Trả kết quả: sử dụng ( distanceComparison || compareNames(a, b) ) làm giá trị của bước hiện tại.
             * DÒNG `compareNames(a, b)`: Trả kết quả: sử dụng ( distanceComparison || compareNames(a, b) ) làm giá trị của bước hiện tại.
             * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            return (distanceComparison ||
                compareNames(a, b));
        }
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return compareNames(a, b)`: Trả kết quả: Gọi compareNames(a, b).
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return compareNames(a, b);
    });
}
// CHỨC NĂNG: tạo service danh sách có thể thay nguồn dữ liệu.
// XỬ LÝ:
// - Nhận source thay vì gọi API cố định ngay trong UI.
// - Nhận resolveText để dùng cơ chế dịch/cache của từng app.
// - Không sửa dữ liệu gốc.
// - Lỗi được truyền lên hook để hiện ErrorState và nút Thử lại.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function createPlaceService(`: Khai báo createPlaceService(source, resolveText). Nhận đầu vào qua tham số.
 * DÒNG `source: PlaceSource,`: Nhận đầu vào source: PlaceSource từ nơi gọi hàm.
 * DÒNG `resolveText?: TextResolver,`: Nhận đầu vào resolveText?: TextResolver từ nơi gọi hàm.
 * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
function createPlaceService(source, resolveText) {
    // Trả kết quả: tạo object gồm list.
    return {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `async list(`: Khai báo list(language). Nhận đầu vào qua tham số.
         * DÒNG `language?: PlaceLanguage,`: Nhận đầu vào language?: PlaceLanguage từ nơi gọi hàm.
         * DÒNG `): Promise<Place[]> {`: Khai báo list(language). Nhận đầu vào qua tham số.
         */
        async list(language) {
            // CHỨC NĂNG: tải dữ liệu từ nguồn được truyền vào.
            // XỬ LÝ: không catch ở đây để caller nhận được lỗi nguồn.
            // Khai báo places: await chờ Gọi source().
            const places = await source();
            // CHỨC NĂNG: hỗ trợ đọc dữ liệu thô hoặc tiếng Việt.
            // XỬ LÝ:
            // - Không truyền language: đọc dữ liệu thô.
            // - vi: bản nguồn đã có, không cần dịch.
            // - Không có resolver: trả dữ liệu hiện có, không tự gọi mạng.
            //
            // Khi UI cần tự dịch cho en/ja, phải dùng service có resolver,
            // như placeCatalog.ts của mobile.
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `if (`: Rẽ nhánh nếu !language || language === 'vi' || !resolveText.
             * DÒNG `!language ||`: Rẽ nhánh nếu !language || language === 'vi' || !resolveText.
             * DÒNG `language === 'vi' ||`: Rẽ nhánh nếu !language || language === 'vi' || !resolveText.
             * DÒNG `!resolveText`: Rẽ nhánh nếu !language || language === 'vi' || !resolveText.
             * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
             */
            if (!language ||
                language === 'vi' ||
                !resolveText) {
                /* GIẢI THÍCH TỪNG DÒNG:
                 * DÒNG `return [...places]`: Trả kết quả: tạo mảng [...places].
                 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                 */
                return [...places];
            }
            // Khai báo result: tạo mảng [].
            const result = [];
            // CHỨC NĂNG: bổ sung bản dịch cho từng địa điểm.
            // XỬ LÝ: làm tuần tự để không gửi dồn nhiều yêu cầu dịch.
            // Đây là phần bất đồng bộ tải dữ liệu, không chạy mỗi phím gõ.
            // Duyệt lần lượt places bằng const place.
            for (const place of places) {
                /* GIẢI THÍCH TỪNG DÒNG:
                 * DÒNG `const localize = async (`: Khai báo localize: khai báo callback async ( field: string, value: LocalizedText | undefined, ): Promise<Localiz.
                 * DÒNG `field: string,`: Nhận đầu vào field: string từ nơi gọi hàm.
                 * DÒNG `value: LocalizedText | undefined,`: Nhận đầu vào value: LocalizedText | undefined từ nơi gọi hàm.
                 * DÒNG `): Promise<LocalizedText | undefined> => {`: Khai báo localize: khai báo callback async ( field: string, value: LocalizedText | undefined, ): Promise<Localiz.
                 */
                const localize = async (field, value) => {
                    // CHỨC NĂNG: bỏ qua trường không có hoặc đã có bản dịch.
                    // XỬ LÝ: dữ liệu cũ có thể thiếu address/region.
                    // Rẽ nhánh nếu !value || value[language].
                    if (!value || value[language]) {
                        /* GIẢI THÍCH TỪNG DÒNG:
                         * DÒNG `return value`: Trả kết quả: sử dụng value làm giá trị của bước hiện tại.
                         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                         */
                        return value;
                    }
                    // CHỨC NĂNG: tạo khóa cache riêng cho trường đang dịch.
                    // XỬ LÝ: chứa nội dung nguồn để khi sửa nội dung tiếng Việt
                    // thì không dùng nhầm bản dịch của nội dung cũ.
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `const cacheKey =`: Khai báo cacheKey: tính biểu thức `catalog|${place.id}|${field}|` + `${language}|${value.vi}`.
                     * DÒNG ``catalog|${place.id}|${field}|` +`: Khai báo cacheKey: tính biểu thức `catalog|${place.id}|${field}|` + `${language}|${value.vi}`.
                     * DÒNG ``${language}|${value.vi}``: Khai báo cacheKey: tính biểu thức `catalog|${place.id}|${field}|` + `${language}|${value.vi}`.
                     */
                    const cacheKey = `catalog|${place.id}|${field}|` +
                        `${language}|${value.vi}`;
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `const translated = await resolveText(`: Khai báo translated: await chờ Gọi resolveText( value.vi, language, cacheKey, ).
                     * DÒNG `value.vi,`: Khai báo translated: await chờ Gọi resolveText( value.vi, language, cacheKey, ).
                     * DÒNG `language,`: Khai báo translated: await chờ Gọi resolveText( value.vi, language, cacheKey, ).
                     * DÒNG `cacheKey,`: Khai báo translated: await chờ Gọi resolveText( value.vi, language, cacheKey, ).
                     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
                     */
                    const translated = await resolveText(value.vi, language, cacheKey);
                    // CHỨC NĂNG: không chấp nhận bản dịch rỗng.
                    // XỬ LÝ: ném lỗi kỹ thuật; UI hiển thị thông báo qua i18n,
                    // không hiển thị trực tiếp chuỗi lỗi này.
                    // Rẽ nhánh nếu !translated.trim().
                    if (!translated.trim()) {
                        /* GIẢI THÍCH TỪNG DÒNG:
                         * DÒNG `throw new Error('Empty place translation')`: Ném new Error('Empty place translation').
                         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                         */
                        throw new Error('Empty place translation');
                    }
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `return {`: Trả kết quả: tạo object gồm ...giá trị ghép, [language].
                     * DÒNG `...value,`: Trả kết quả: tạo object gồm ...giá trị ghép, [language].
                     */
                    return {
                        ...value,
                        /* GIẢI THÍCH TỪNG DÒNG:
                         * DÒNG `[language]: translated,`: Gán thuộc tính [language]: sử dụng translated làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
                         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                         */
                        [language]: translated,
                    };
                };
                // TẠI SAO (localize): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
                // không phải xử lý dữ liệu sai như thành công.
                /* GIẢI THÍCH TỪNG DÒNG:
                 * DÒNG `result.push({`: Thực hiện Gọi result.push({ ...place, name: (await localize('name', place.name)) ?? place.name, descript.
                 * DÒNG `...place,`: Thực hiện Gọi result.push({ ...place, name: (await localize('name', place.name)) ?? place.name, descript.
                 */
                result.push({
                    ...place,
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `name:`: Gán thuộc tính name: tính biểu thức (await localize('name', place.name)) ?? place.name.
                     * DÒNG `(await localize('name', place.name)) ??`: Gán thuộc tính name: tính biểu thức (await localize('name', place.name)) ?? place.name.
                     * DÒNG `place.name,`: Gán thuộc tính name: tính biểu thức (await localize('name', place.name)) ?? place.name.
                     */
                    name: (await localize('name', place.name)) ??
                        place.name,
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `description:`: Gán thuộc tính description: tính biểu thức (await localize( 'description', place.description, )) ?? place.description.
                     * DÒNG `(await localize(`: Gán thuộc tính description: tính biểu thức (await localize( 'description', place.description, )) ?? place.description.
                     * DÒNG `'description',`: Gán thuộc tính description: tính biểu thức (await localize( 'description', place.description, )) ?? place.description.
                     * DÒNG `place.description,`: Gán thuộc tính description: tính biểu thức (await localize( 'description', place.description, )) ?? place.description.
                     * DÒNG `)) ?? place.description,`: Gán thuộc tính description: tính biểu thức (await localize( 'description', place.description, )) ?? place.description.
                     */
                    description: (await localize('description', place.description)) ?? place.description,
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `address: await localize(`: Gán thuộc tính address: await chờ Gọi localize( 'address', place.address, ).
                     * DÒNG `'address',`: Gán thuộc tính address: await chờ Gọi localize( 'address', place.address, ).
                     * DÒNG `place.address,`: Gán thuộc tính address: await chờ Gọi localize( 'address', place.address, ).
                     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
                     */
                    address: await localize('address', place.address),
                    /* GIẢI THÍCH TỪNG DÒNG:
                     * DÒNG `region: await localize(`: Gán thuộc tính region: await chờ Gọi localize( 'region', place.region, ).
                     * DÒNG `'region',`: Gán thuộc tính region: await chờ Gọi localize( 'region', place.region, ).
                     * DÒNG `place.region,`: Gán thuộc tính region: await chờ Gọi localize( 'region', place.region, ).
                     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
                     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
                     */
                    region: await localize('region', place.region),
                });
            }
            /* GIẢI THÍCH TỪNG DÒNG:
             * DÒNG `return result`: Trả kết quả: sử dụng result làm giá trị của bước hiện tại.
             * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
             */
            return result;
        },
        // TẠI SAO (list): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
        // phải xử lý dữ liệu sai như thành công.
    };
}
// TẠI SAO (createPlaceService): Đổi loader hoặc dịch vụ dịch ở một chỗ giúp giữ nguyên UI khi
// chuyển từ mock sang nguồn khác.
