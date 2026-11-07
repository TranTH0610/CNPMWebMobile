/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Logic danh mục giai đoạn đầu: chuẩn hóa bỏ dấu, tìm theo ngôn ngữ, lọc/thống kê danh mục, sắp
 *
 * VỊ TRÍ: packages/place-core/src/XuatCongKhai.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - @travelguide/shared-types
 *
 * CÁC KHỐI CHÍNH:
 * 1. normalize
 * 2. searchPlaces
 * 3. filterCategories
 * 4. categoryCounts
 * 5. shouldShowCategories
 * 6. sortPlaces
 * 7. createPlaceService
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import type {
  CategoryId,
  LocalizedText,
  Place,
  PlaceLanguage,
  Point,
} from '@travelguide/shared-types'

// CHỨC NĂNG: cho phép bên dùng core import lại các kiểu cần thiết.
// XỬ LÝ: đây là export type nên không tạo mã thực thi khi chạy.

export type {
  CategoryId,
  LocalizedText,
  Place,
  PlaceLanguage,
  Point,
} from '@travelguide/shared-types'

// CHỨC NĂNG: tên danh mục dùng để tìm kiếm trong đúng ngôn ngữ.
// XỬ LÝ: đủ năm ngôn ngữ đang có; các hàm normalize/search giữ nguyên.
// Khai báo CATEGORY_LABELS: tạo object gồm heritage, landscape, museum, culture, spiritual, food, craft.
export const CATEGORY_LABELS: Record<CategoryId, LocalizedText> = {
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
    
    cn: '手工艺村',
  },
}

// CHỨC NĂNG: chuẩn hóa chữ để tìm không phân biệt hoa/thường và dấu.
// XỬ LÝ:
// 1. Chuyển sang chữ thường.
// 2. NFD tách chữ có dấu thành chữ gốc và các dấu kết hợp.
// 3. Xóa dấu kết hợp.
// 4. Đổi đ thành d vì NFD không tự xử lý chữ đ.
// 5. Gom nhiều khoảng trắng thành một và bỏ khoảng trắng hai đầu.
// Khai báo normalize(value). Chuẩn hóa chữ để so sánh/tìm kiếm.
// ==================== [DUNG-CHUNG] normalize ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function normalize(value: string): string {
  
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
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

// ==================== [DUNG-CHUNG] searchPlaces ====================
export function searchPlaces(
  places: readonly Place[],
  query: string,
  language: PlaceLanguage,
): Place[] {
  // CHỨC NĂNG: chuẩn hóa và tách câu tìm kiếm thành từng từ.
  // XỬ LÝ: query rỗng hoặc chỉ có khoảng trắng sẽ không tạo từ nào.
  
  const words = normalize(query)
    .split(' ')
    .filter(Boolean)

  // CHỨC NĂNG: xóa ô tìm kiếm thì trả lại đủ danh sách.
  // XỬ LÝ: tạo mảng mới để bên gọi không sửa trực tiếp mảng nguồn.
  // Rẽ nhánh nếu words.length === 0.
  if (words.length === 0) {
    
    return [...places]
  }

  // Trả kết quả: places.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  return places.filter((place) => {
    // CHỨC NĂNG: gom các trường được phép tìm kiếm.
    // XỬ LÝ:
    // - Dấu ?. bảo vệ trường address bị thiếu ở dữ liệu cũ.
    // - filter(Boolean) loại undefined và chuỗi rỗng.
    
    const searchableText = normalize(
      [
        place.name[language],
        place.address?.[language],
        place.description[language],
        place.category
          ? CATEGORY_LABELS[place.category][language]
          : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    )

    // CHỨC NĂNG: kiểm tra địa điểm có đủ mọi từ người dùng gõ.
    // XỬ LÝ: every chỉ trả true nếu tất cả từ đều khớp.
    
    return words.every((word) => searchableText.includes(word))
  })
}
// TẠI SAO (searchPlaces): Tìm trong đúng ngôn ngữ đang chọn để kết quả khớp với nội dung người
// dùng nhìn thấy.

// CHỨC NĂNG: lọc một hoặc nhiều danh mục.
// XỬ LÝ:
// - selected rỗng nghĩa là "Tất cả".
// - Mobile có thể truyền một ID.
// - Web có thể truyền nhiều ID do có checkbox.
// - Địa điểm cũ thiếu category vẫn hiện trong "Tất cả".

// ==================== [DUNG-CHUNG] filterCategories ====================
export function filterCategories(
  places: readonly Place[],
  selected: readonly CategoryId[],
): Place[] {
  // Trả kết quả: places.filter tạo mảng chỉ giữ phần tử đạt điều kiện.
  return places.filter((place) => {
    // Rẽ nhánh nếu selected.length === 0.
    if (selected.length === 0) {
      
      return true
    }

    
    return (
      place.category !== undefined &&
      selected.includes(place.category)
    )
  })
}
// TẠI SAO (filterCategories): Chưa chọn danh mục cần hiểu là tất cả; trả mảng mới giúp tránh vô
// tình sửa nguồn dữ liệu.

// CHỨC NĂNG: đếm số địa điểm thuộc từng danh mục.
// XỬ LÝ:
// - Dùng Partial vì không phải danh mục nào cũng xuất hiện.
// - Bỏ qua địa điểm chưa có category.
// - ?? 0 nghĩa là danh mục chưa được đếm thì bắt đầu từ 0.

// ==================== [DUNG-CHUNG] categoryCounts ====================
export function categoryCounts(
  places: readonly Place[],
): Partial<Record<CategoryId, number>> {
  // Khai báo counts: tạo object gồm.
  const counts: Partial<Record<CategoryId, number>> = {}

  // Duyệt lần lượt places bằng const place.
  for (const place of places) {
    // Rẽ nhánh nếu place.category.
    if (place.category) {
      
      counts[place.category] =
        (counts[place.category] ?? 0) + 1
    }
  }

  
  return counts
}
// TẠI SAO (categoryCounts): Số lượng cạnh danh mục cần tính theo cùng định nghĩa danh mục với
// thao tác lọc.

// CHỨC NĂNG: quyết định có cần hiển thị bộ lọc danh mục.
// XỬ LÝ: chỉ hiện khi nguồn dữ liệu có ít nhất hai danh mục khác nhau.
// UI nên truyền danh sách gốc đã tải, không truyền danh sách sau khi
// người dùng chọn một danh mục, nếu không bộ lọc có thể biến mất.

// ==================== [DUNG-CHUNG] shouldShowCategories ====================
export function shouldShowCategories(
  places: readonly Place[],
): boolean {
  
  return Object.keys(categoryCounts(places)).length >= 2
}
// TẠI SAO (shouldShowCategories): Chỉ có một danh mục thì bộ lọc không giúp thu hẹp dữ liệu và
// làm giao diện rối hơn.

// CHỨC NĂNG: giới hạn các cách sắp xếp được hỗ trợ.
// XỬ LÝ: dùng ID nội bộ; nhãn hiển thị sẽ lấy từ i18n của app.
// Đặt tên kiểu SortOrder.
export type SortOrder = 'nearest' | 'name' | 'rating'

// Đặt tên kiểu SortOptions.
export type SortOptions = {
  // Khai báo language, kiểu PlaceLanguage. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác.
  language: PlaceLanguage
  // Khai báo order, kiểu SortOrder.
  order: SortOrder

  // Không có origin nghĩa là chưa có vị trí người dùng.
  // Khai báo origin không bắt buộc, kiểu Point.
  origin?: Point

  // Mobile truyền hàm distanceMeters từ services/geo.ts hiện có.
  // Core không cần biết app lấy tọa độ từ Expo hay trình duyệt.
  
  distanceMeters?: (a: Point, b: Point) => number
}

// CHỨC NĂNG: sắp xếp theo khoảng cách, tên hoặc đánh giá.
// XỬ LÝ:
// - Sắp xếp bản sao, không đổi thứ tự mảng nguồn.
// - Không có vị trí/hàm đo thì "nearest" chuyển thành "name".
// - Địa điểm thiếu tọa độ hoặc khoảng cách không hợp lệ đi cuối.
// - Khi bằng nhau dùng tên và ID để giữ thứ tự ổn định.

// ==================== [DUNG-CHUNG] sortPlaces ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function sortPlaces(
  places: readonly Place[],
  options: SortOptions,
): Place[] {
  
  const canMeasure =
    options.origin !== undefined &&
    options.distanceMeters !== undefined

  
  const effectiveOrder =
    options.order === 'nearest' && !canMeasure
      ? 'name'
      : options.order

  // CHỨC NĂNG: lưu khoảng cách đã tính theo ID.
  // XỬ LÝ: tính một lần mỗi địa điểm thay vì tính lại trong mỗi
  // lần hàm sort so sánh hai phần tử.
  // Khai báo distances: Map giữ các cặp khóa–giá trị trong RAM.
  const distances = new Map<string, number>()

  
  if (
    effectiveOrder === 'nearest' &&
    options.origin &&
    options.distanceMeters
  ) {
    // Duyệt lần lượt places bằng const place.
    for (const place of places) {
      
      const distance = place.location
        ? options.distanceMeters(
            options.origin,
            place.location,
          )
        : Infinity

      // CHỨC NĂNG: loại khoảng cách NaN, âm hoặc vô hạn.
      // XỬ LÝ: Infinity giúp địa điểm đó nằm cuối danh sách.
      
      const safeDistance =
        Number.isFinite(distance) && distance >= 0
          ? distance
          : Infinity

      
      distances.set(place.id, safeDistance)
    }
  }

  // CHỨC NĂNG: so sánh tên theo ngôn ngữ đang chọn.
  // XỬ LÝ:
  // - Thiếu tên thì dùng chuỗi rỗng, không phát sinh lỗi.
  // - cn là mã nội bộ hiện có; Intl dùng mã zh cho tiếng Trung.
  // - Tên bằng nhau thì so sánh ID để thứ tự không thay đổi ngẫu nhiên.
  // Khai báo compareNames: khai báo callback (a: Place, b: Place): number => { const leftName = normalize( a.name[option.
  const compareNames = (a: Place, b: Place): number => {
    
    const leftName = normalize(
      a.name[options.language] ?? '',
    )

    
    const rightName = normalize(
      b.name[options.language] ?? '',
    )

    
    const locale =
      options.language === 'cn'
        ? 'zh'
        : options.language

    
    return (
      leftName.localeCompare(rightName, locale) ||
      a.id.localeCompare(b.id)
    )
  }
  // TẠI SAO (compareNames): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
  // quán và dễ bảo trì.

  // Trả kết quả: [...places].sort sắp xếp mảng theo hàm so sánh.
  return [...places].sort((a, b) => {
    // CHỨC NĂNG: rating cao đứng trước.
    // XỬ LÝ: dữ liệu cũ thiếu rating dùng 0 cho việc sắp xếp;
    // UI vẫn phải phân biệt "chưa có đánh giá" với rating thật bằng 0.
    // Rẽ nhánh nếu effectiveOrder === 'rating'.
    if (effectiveOrder === 'rating') {
      
      return (
        (b.rating ?? 0) - (a.rating ?? 0) ||
        compareNames(a, b)
      )
    }

    // CHỨC NĂNG: khoảng cách nhỏ đứng trước.
    // XỬ LÝ: hai Infinity không được trừ trực tiếp vì ra NaN;
    // kiểm tra bằng nhau trước để chuyển sang so sánh tên.
    // Rẽ nhánh nếu effectiveOrder === 'nearest'.
    if (effectiveOrder === 'nearest') {
      
      const leftDistance =
        distances.get(a.id) ?? Infinity

      
      const rightDistance =
        distances.get(b.id) ?? Infinity

      
      const distanceComparison =
        leftDistance === rightDistance
          ? 0
          : leftDistance - rightDistance

      
      return (
        distanceComparison ||
        compareNames(a, b)
      )
    }

    
    return compareNames(a, b)
  })
}
// TẠI SAO (sortPlaces): Từ chối GPS không được làm crash danh sách; thứ tự dự phòng vẫn giúp
// khách xem được địa điểm.

// CHỨC NĂNG: định nghĩa hợp đồng nguồn dữ liệu.
// XỬ LÝ: nguồn có thể là mock, AsyncStorage hoặc API;
// chỉ cần trả Promise chứa danh sách Place.

export type PlaceSource =
  () => Promise<readonly Place[]>

// CHỨC NĂNG: định nghĩa hợp đồng dịch văn bản còn thiếu.
// XỬ LÝ: app tự quyết định dùng API nào và lưu cache ở đâu.

export type TextResolver = (
  text: string,
  language: PlaceLanguage,
  cacheKey: string,
) => Promise<string>

// CHỨC NĂNG: tạo service danh sách có thể thay nguồn dữ liệu.
// XỬ LÝ:
// - Nhận source thay vì gọi API cố định ngay trong UI.
// - Nhận resolveText để dùng cơ chế dịch/cache của từng app.
// - Không sửa dữ liệu gốc.
// - Lỗi được truyền lên hook để hiện ErrorState và nút Thử lại.

// ==================== [DUNG-CHUNG] createPlaceService ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function createPlaceService(
  source: PlaceSource,
  resolveText?: TextResolver,
) {
  // Trả kết quả: tạo object gồm list.
  return {
    
    async list(
      language?: PlaceLanguage,
    ): Promise<Place[]> {
      // CHỨC NĂNG: tải dữ liệu từ nguồn được truyền vào.
      // XỬ LÝ: không catch ở đây để caller nhận được lỗi nguồn.
      // Khai báo places: await chờ Gọi source().
      const places = await source()

      // CHỨC NĂNG: hỗ trợ đọc dữ liệu thô hoặc tiếng Việt.
      // XỬ LÝ:
      // - Không truyền language: đọc dữ liệu thô.
      // - vi: bản nguồn đã có, không cần dịch.
      // - Không có resolver: trả dữ liệu hiện có, không tự gọi mạng.
      //
      // Khi UI cần tự dịch cho en/ja, phải dùng service có resolver,
      // như placeCatalog.ts của mobile.
      
      if (
        !language ||
        language === 'vi' ||
        !resolveText
      ) {
        
        return [...places]
      }

      // Khai báo result: tạo mảng [].
      const result: Place[] = []

      // CHỨC NĂNG: bổ sung bản dịch cho từng địa điểm.
      // XỬ LÝ: làm tuần tự để không gửi dồn nhiều yêu cầu dịch.
      // Đây là phần bất đồng bộ tải dữ liệu, không chạy mỗi phím gõ.
      // Duyệt lần lượt places bằng const place.
      for (const place of places) {
        
        const localize = async (
          field: string,
          value: LocalizedText | undefined,
        ): Promise<LocalizedText | undefined> => {
          // CHỨC NĂNG: bỏ qua trường không có hoặc đã có bản dịch.
          // XỬ LÝ: dữ liệu cũ có thể thiếu address/region.
          // Rẽ nhánh nếu !value || value[language].
          if (!value || value[language]) {
            
            return value
          }

          // CHỨC NĂNG: tạo khóa cache riêng cho trường đang dịch.
          // XỬ LÝ: chứa nội dung nguồn để khi sửa nội dung tiếng Việt
          // thì không dùng nhầm bản dịch của nội dung cũ.
          
          const cacheKey =
            `catalog|${place.id}|${field}|` +
            `${language}|${value.vi}`

          
          const translated = await resolveText(
            value.vi,
            language,
            cacheKey,
          )

          // CHỨC NĂNG: không chấp nhận bản dịch rỗng.
          // XỬ LÝ: ném lỗi kỹ thuật; UI hiển thị thông báo qua i18n,
          // không hiển thị trực tiếp chuỗi lỗi này.
          // Rẽ nhánh nếu !translated.trim().
          if (!translated.trim()) {
            
            throw new Error('Empty place translation')
          }

          
          return {
            ...value,
            
            [language]: translated,
          }
        }
        // TẠI SAO (localize): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
        // không phải xử lý dữ liệu sai như thành công.

        
        result.push({
          ...place,
          
          name:
            (await localize('name', place.name)) ??
            place.name,
          
          description:
            (await localize(
              'description',
              place.description,
            )) ?? place.description,
          
          address: await localize(
            'address',
            place.address,
          ),
          
          region: await localize(
            'region',
            place.region,
          ),
        })
      }

      
      return result
    },
    // TẠI SAO (list): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
    // phải xử lý dữ liệu sai như thành công.
  }
}
// TẠI SAO (createPlaceService): Đổi loader hoặc dịch vụ dịch ở một chỗ giúp giữ nguyên UI khi
// chuyển từ mock sang nguồn khác.