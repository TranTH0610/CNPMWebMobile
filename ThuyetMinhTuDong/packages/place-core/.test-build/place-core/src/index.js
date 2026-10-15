"use strict";
/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp tìm kiếm, lọc danh mục, thống kê danh mục, sắp xếp
 * và service có thể thay nguồn mock bằng API.
 *
 * Được dùng bởi:
 * - apps/mobile/src/services/placeCatalog.ts
 * - Các hook usePlaceSearch ở giai đoạn 2 và 3.
 * - packages/place-core/tests/core.test.cjs
 *
 * Phụ thuộc: @travelguide/shared-types.
 * Không phụ thuộc React, React Native hoặc DOM.
 *
 * Liên quan: UC03, FR-18, FR-37..39.
 */
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
exports.CATEGORY_LABELS = {
    heritage: {
        vi: 'Di tích',
        en: 'Heritage',
        ja: '史跡',
        pt: 'Património',
        cn: '历史遗迹',
    },
    landscape: {
        vi: 'Danh lam thắng cảnh',
        en: 'Scenic attractions',
        ja: '名勝',
        pt: 'Paisagens',
        cn: '风景名胜',
    },
    museum: {
        vi: 'Bảo tàng',
        en: 'Museums',
        ja: '博物館',
        pt: 'Museus',
        cn: '博物馆',
    },
    culture: {
        vi: 'Văn hóa',
        en: 'Culture',
        ja: '文化',
        pt: 'Cultura',
        cn: '文化',
    },
    spiritual: {
        vi: 'Tâm linh',
        en: 'Spiritual sites',
        ja: '宗教施設',
        pt: 'Locais religiosos',
        cn: '宗教场所',
    },
    food: {
        vi: 'Ẩm thực',
        en: 'Food',
        ja: 'グルメ',
        pt: 'Gastronomia',
        cn: '美食',
    },
    craft: {
        vi: 'Làng nghề',
        en: 'Craft villages',
        ja: '工芸村',
        pt: 'Aldeias artesanais',
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
function normalize(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, ' ')
        .trim();
}
// CHỨC NĂNG: tìm địa điểm trong ngôn ngữ đang chọn.
// XỬ LÝ:
// - Tìm tên, địa chỉ, mô tả và tên danh mục.
// - Không tự lấy nội dung vi khi người dùng chọn en.
// - Service sẽ dịch nội dung thiếu trước khi đưa vào tìm kiếm.
// - Mọi từ trong truy vấn đều phải xuất hiện trong nội dung địa điểm.
// - Các từ không bắt buộc nằm liền nhau.
function searchPlaces(places, query, language) {
    // CHỨC NĂNG: chuẩn hóa và tách câu tìm kiếm thành từng từ.
    // XỬ LÝ: query rỗng hoặc chỉ có khoảng trắng sẽ không tạo từ nào.
    const words = normalize(query)
        .split(' ')
        .filter(Boolean);
    // CHỨC NĂNG: xóa ô tìm kiếm thì trả lại đủ danh sách.
    // XỬ LÝ: tạo mảng mới để bên gọi không sửa trực tiếp mảng nguồn.
    if (words.length === 0) {
        return [...places];
    }
    return places.filter((place) => {
        // CHỨC NĂNG: gom các trường được phép tìm kiếm.
        // XỬ LÝ:
        // - Dấu ?. bảo vệ trường address bị thiếu ở dữ liệu cũ.
        // - filter(Boolean) loại undefined và chuỗi rỗng.
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
        return words.every((word) => searchableText.includes(word));
    });
}
// CHỨC NĂNG: lọc một hoặc nhiều danh mục.
// XỬ LÝ:
// - selected rỗng nghĩa là "Tất cả".
// - Mobile có thể truyền một ID.
// - Web có thể truyền nhiều ID do có checkbox.
// - Địa điểm cũ thiếu category vẫn hiện trong "Tất cả".
function filterCategories(places, selected) {
    return places.filter((place) => {
        if (selected.length === 0) {
            return true;
        }
        return (place.category !== undefined &&
            selected.includes(place.category));
    });
}
// CHỨC NĂNG: đếm số địa điểm thuộc từng danh mục.
// XỬ LÝ:
// - Dùng Partial vì không phải danh mục nào cũng xuất hiện.
// - Bỏ qua địa điểm chưa có category.
// - ?? 0 nghĩa là danh mục chưa được đếm thì bắt đầu từ 0.
function categoryCounts(places) {
    const counts = {};
    for (const place of places) {
        if (place.category) {
            counts[place.category] =
                (counts[place.category] ?? 0) + 1;
        }
    }
    return counts;
}
// CHỨC NĂNG: quyết định có cần hiển thị bộ lọc danh mục.
// XỬ LÝ: chỉ hiện khi nguồn dữ liệu có ít nhất hai danh mục khác nhau.
// UI nên truyền danh sách gốc đã tải, không truyền danh sách sau khi
// người dùng chọn một danh mục, nếu không bộ lọc có thể biến mất.
function shouldShowCategories(places) {
    return Object.keys(categoryCounts(places)).length >= 2;
}
// CHỨC NĂNG: sắp xếp theo khoảng cách, tên hoặc đánh giá.
// XỬ LÝ:
// - Sắp xếp bản sao, không đổi thứ tự mảng nguồn.
// - Không có vị trí/hàm đo thì "nearest" chuyển thành "name".
// - Địa điểm thiếu tọa độ hoặc khoảng cách không hợp lệ đi cuối.
// - Khi bằng nhau dùng tên và ID để giữ thứ tự ổn định.
function sortPlaces(places, options) {
    const canMeasure = options.origin !== undefined &&
        options.distanceMeters !== undefined;
    const effectiveOrder = options.order === 'nearest' && !canMeasure
        ? 'name'
        : options.order;
    // CHỨC NĂNG: lưu khoảng cách đã tính theo ID.
    // XỬ LÝ: tính một lần mỗi địa điểm thay vì tính lại trong mỗi
    // lần hàm sort so sánh hai phần tử.
    const distances = new Map();
    if (effectiveOrder === 'nearest' &&
        options.origin &&
        options.distanceMeters) {
        for (const place of places) {
            const distance = place.location
                ? options.distanceMeters(options.origin, place.location)
                : Infinity;
            // CHỨC NĂNG: loại khoảng cách NaN, âm hoặc vô hạn.
            // XỬ LÝ: Infinity giúp địa điểm đó nằm cuối danh sách.
            const safeDistance = Number.isFinite(distance) && distance >= 0
                ? distance
                : Infinity;
            distances.set(place.id, safeDistance);
        }
    }
    // CHỨC NĂNG: so sánh tên theo ngôn ngữ đang chọn.
    // XỬ LÝ:
    // - Thiếu tên thì dùng chuỗi rỗng, không phát sinh lỗi.
    // - cn là mã nội bộ hiện có; Intl dùng mã zh cho tiếng Trung.
    // - Tên bằng nhau thì so sánh ID để thứ tự không thay đổi ngẫu nhiên.
    const compareNames = (a, b) => {
        const leftName = normalize(a.name[options.language] ?? '');
        const rightName = normalize(b.name[options.language] ?? '');
        const locale = options.language === 'cn'
            ? 'zh'
            : options.language;
        return (leftName.localeCompare(rightName, locale) ||
            a.id.localeCompare(b.id));
    };
    return [...places].sort((a, b) => {
        // CHỨC NĂNG: rating cao đứng trước.
        // XỬ LÝ: dữ liệu cũ thiếu rating dùng 0 cho việc sắp xếp;
        // UI vẫn phải phân biệt "chưa có đánh giá" với rating thật bằng 0.
        if (effectiveOrder === 'rating') {
            return ((b.rating ?? 0) - (a.rating ?? 0) ||
                compareNames(a, b));
        }
        // CHỨC NĂNG: khoảng cách nhỏ đứng trước.
        // XỬ LÝ: hai Infinity không được trừ trực tiếp vì ra NaN;
        // kiểm tra bằng nhau trước để chuyển sang so sánh tên.
        if (effectiveOrder === 'nearest') {
            const leftDistance = distances.get(a.id) ?? Infinity;
            const rightDistance = distances.get(b.id) ?? Infinity;
            const distanceComparison = leftDistance === rightDistance
                ? 0
                : leftDistance - rightDistance;
            return (distanceComparison ||
                compareNames(a, b));
        }
        return compareNames(a, b);
    });
}
// CHỨC NĂNG: tạo service danh sách có thể thay nguồn dữ liệu.
// XỬ LÝ:
// - Nhận source thay vì gọi API cố định ngay trong UI.
// - Nhận resolveText để dùng cơ chế dịch/cache của từng app.
// - Không sửa dữ liệu gốc.
// - Lỗi được truyền lên hook để hiện ErrorState và nút Thử lại.
function createPlaceService(source, resolveText) {
    return {
        async list(language) {
            // CHỨC NĂNG: tải dữ liệu từ nguồn được truyền vào.
            // XỬ LÝ: không catch ở đây để caller nhận được lỗi nguồn.
            const places = await source();
            // CHỨC NĂNG: hỗ trợ đọc dữ liệu thô hoặc tiếng Việt.
            // XỬ LÝ:
            // - Không truyền language: đọc dữ liệu thô.
            // - vi: bản nguồn đã có, không cần dịch.
            // - Không có resolver: trả dữ liệu hiện có, không tự gọi mạng.
            //
            // Khi UI cần tự dịch cho en/ja, phải dùng service có resolver,
            // như placeCatalog.ts của mobile.
            if (!language ||
                language === 'vi' ||
                !resolveText) {
                return [...places];
            }
            const result = [];
            // CHỨC NĂNG: bổ sung bản dịch cho từng địa điểm.
            // XỬ LÝ: làm tuần tự để không gửi dồn nhiều yêu cầu dịch.
            // Đây là phần bất đồng bộ tải dữ liệu, không chạy mỗi phím gõ.
            for (const place of places) {
                const localize = async (field, value) => {
                    // CHỨC NĂNG: bỏ qua trường không có hoặc đã có bản dịch.
                    // XỬ LÝ: dữ liệu cũ có thể thiếu address/region.
                    if (!value || value[language]) {
                        return value;
                    }
                    // CHỨC NĂNG: tạo khóa cache riêng cho trường đang dịch.
                    // XỬ LÝ: chứa nội dung nguồn để khi sửa nội dung tiếng Việt
                    // thì không dùng nhầm bản dịch của nội dung cũ.
                    const cacheKey = `catalog|${place.id}|${field}|` +
                        `${language}|${value.vi}`;
                    const translated = await resolveText(value.vi, language, cacheKey);
                    // CHỨC NĂNG: không chấp nhận bản dịch rỗng.
                    // XỬ LÝ: ném lỗi kỹ thuật; UI hiển thị thông báo qua i18n,
                    // không hiển thị trực tiếp chuỗi lỗi này.
                    if (!translated.trim()) {
                        throw new Error('Empty place translation');
                    }
                    return {
                        ...value,
                        [language]: translated,
                    };
                };
                result.push({
                    ...place,
                    name: (await localize('name', place.name)) ??
                        place.name,
                    description: (await localize('description', place.description)) ?? place.description,
                    address: await localize('address', place.address),
                    region: await localize('region', place.region),
                });
            }
            return result;
        },
    };
}
