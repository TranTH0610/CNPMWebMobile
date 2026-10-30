/**
 * FILE NÀY LÀM GÌ
 * Service danh mục công bố; loại bản nháp/ngoài phạm vi và lấy chi tiết đúng ID theo cùng điều
 * kiện.
 *
 * VỊ TRÍ: packages/visitor-core/src/catalog/catalog.ts
 * DÙNG BỞI: packages/visitor-core/src/catalog/search.ts; packages/visitor-core/src/data/mock.ts;
 * packages/visitor-core/src/index.ts; và các nơi import khác.
 * PHỤ THUỘC: ../domain/model
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `import type {`: Nhập kiểu dữ liệu từ '../domain/model'.
 * DÒNG `CatalogSource,`: Lấy CatalogSource từ module đang nhập.
 * DÒNG `Language,`: Lấy Language từ module đang nhập.
 * DÒNG `PlaceRecord,`: Lấy PlaceRecord từ module đang nhập.
 * DÒNG `PublishedText,`: Lấy PublishedText từ module đang nhập.
 * DÒNG `} from '../domain/model'`: Nhập kiểu dữ liệu từ '../domain/model'.
 */
import type {
  CatalogSource,
  Language,
  PlaceRecord,
  PublishedText,
} from '../domain/model'

// CHỨC NĂNG: Phân biệt điểm không tồn tại với lỗi tải dữ liệu.
// XỬ LÝ: UI dùng mã notFound thay vì hiện thông báo lỗi kỹ thuật.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export class CatalogError extends Error {`: Khai báo lớp CatalogError.
 * DÒNG `constructor(public readonly code: 'notFound') {`: Khai báo lớp CatalogError.
 */
export class CatalogError extends Error {
  constructor(public readonly code: 'notFound') {
    // Thực hiện Gọi super(code).
    super(code)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `this.name = 'CatalogError'`: Thực hiện tính biểu thức this.name = 'CatalogError'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    this.name = 'CatalogError'
  }
}

// CHỨC NĂNG: Lấy bản nội dung đúng ngôn ngữ đã duyệt và công bố.
// XỬ LÝ: Thiếu bản thì trả undefined; không tự dịch hoặc âm thầm đổi ngôn ngữ.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function publishedText(`: Khai báo publishedText(place, language). Chỉ lấy nội dung đúng ngôn ngữ đã duyệt và công bố.
 * DÒNG `place: PlaceRecord,`: Nhận đầu vào place: PlaceRecord từ nơi gọi hàm.
 * DÒNG `language: Language,`: Nhận đầu vào language: Language từ nơi gọi hàm.
 * DÒNG `): PublishedText | undefined {`: Khai báo publishedText(place, language). Chỉ lấy nội dung đúng ngôn ngữ đã duyệt và công bố.
 */
export function publishedText(
  place: PlaceRecord,
  language: Language,
): PublishedText | undefined {
  // Khai báo text: đọc place.content[language] từ đối tượng/mảng để dùng tại bước hiện tại.
  const text = place.content[language]

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return text?.status === 'published'`: Trả kết quả: chọn giữa hai giá trị theo điều kiện text?.status === 'published' && text.approvedAt && text.publ.
   * DÒNG `&& text.approvedAt`: Trả kết quả: chọn giữa hai giá trị theo điều kiện text?.status === 'published' && text.approvedAt && text.publ.
   * DÒNG `&& text.publishedAt`: Trả kết quả: chọn giữa hai giá trị theo điều kiện text?.status === 'published' && text.approvedAt && text.publ.
   * DÒNG `? text`: Trả kết quả: chọn giữa hai giá trị theo điều kiện text?.status === 'published' && text.approvedAt && text.publ.
   * DÒNG `: undefined`: Trả kết quả: chọn giữa hai giá trị theo điều kiện text?.status === 'published' && text.approvedAt && text.publ.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return text?.status === 'published'
    && text.approvedAt
    && text.publishedAt
    ? text
    : undefined
}
// TẠI SAO (publishedText): Du khách chỉ được xem đúng bản ngôn ngữ đã duyệt/công bố, không dùng
// nháp hoặc âm thầm đổi tiếng.

// CHỨC NĂNG: Liệt kê các bản ngôn ngữ được phép đọc.
// XỬ LÝ: Bản nháp không xuất hiện trong danh sách lựa chọn.
// Khai báo availableLanguages(place). Liệt kê các bản ngôn ngữ đạt điều kiện công bố để giao diện không cho chọn bản nháp.
export function availableLanguages(place: PlaceRecord): Language[] {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (['vi', 'en', 'cn', 'pt', 'ja'] as const).filter(`: Trả kết quả: (['vi', 'en', 'cn', 'pt', 'ja'] as const).filter tạo mảng chỉ giữ phần tử đạt điều kiện.
   * DÒNG `(language) => Boolean(publishedText(place, language)),`: Trả kết quả: (['vi', 'en', 'cn', 'pt', 'ja'] as const).filter tạo mảng chỉ giữ phần tử đạt điều kiện.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (['vi', 'en', 'cn', 'pt', 'ja'] as const).filter(
    (language) => Boolean(publishedText(place, language)),
  )
}
// TẠI SAO (availableLanguages): Nếu hiển thị ngôn ngữ chưa có bản công bố, khách sẽ chọn được
// một bài không thể đọc/nghe.

// CHỨC NĂNG: Tạo service danh sách và chi tiết.
// XỬ LÝ: Đổi nguồn dữ liệu chỉ cần đổi source, không phải sửa màn hình.
// Backend thật vẫn phải kiểm tra quyền/công bố; lọc FE không thay thế bảo mật server.
// Khai báo createCatalog(source, subscribe). Nhận đầu vào qua tham số.
export function createCatalog(source: CatalogSource, subscribe?: (listener: () => void) => () => void) {
  // Khai báo list: khai báo callback async (): Promise<PlaceRecord[]> => { const raw = await source() // CHỨC NĂ.
  const list = async (): Promise<PlaceRecord[]> => {
    // Khai báo raw: await chờ Gọi source().
    const raw = await source()

    // CHỨC NĂNG: Giới hạn đúng phạm vi và danh mục triển khai.
    // XỬ LÝ: Loại điểm nháp, đã rút hoặc chưa được chọn triển khai.
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return raw`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `.filter(`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `(place) =>`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `place.scope === 'hue-citadel'`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `&& place.inLaunchCatalog`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `&& place.status === 'published',`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `.map((place) => {`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
     */
    return raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        // Khai báo content: tạo object gồm.
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        // Duyệt lần lượt availableLanguages(place) bằng const language.
        for (const language of availableLanguages(place)) {
          // Khai báo text: publishedText lấy bản đã công bố đúng ngôn ngữ.
          const text = publishedText(place, language)
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `if (text) content[language] = { ...text }`: Rẽ nhánh nếu text. | Thực hiện tính biểu thức content[language] = { ...text }.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          if (text) content[language] = { ...text }
        }

        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return {`: Trả kết quả: tạo object gồm ...giá trị ghép, images, position, content.
         * DÒNG `...place,`: Trả kết quả: tạo object gồm ...giá trị ghép, images, position, content.
         */
        return {
          ...place,
          // Gán thuộc tính images: tạo mảng [...place.images].
          images: [...place.images],
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `position: place.position ? { ...place.position } : undefined,`: Gán thuộc tính position: chọn giữa hai giá trị theo điều kiện place.position.
           * DÒNG `content,`: Đặt trường content bằng giá trị của biến cùng tên.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `.filter((place) => availableLanguages(place).length > 0)`: Trả kết quả: raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter tạo mảng chỉ giữ phần tử đạt điều kiện.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter((place) => availableLanguages(place).length > 0)
  }
  // TẠI SAO (list): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
  // liệu.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return {`: Trả kết quả: tạo object gồm list, subscribe, get.
   * DÒNG `list,`: Đặt trường list bằng giá trị của biến cùng tên.
   * DÒNG `subscribe,`: Đặt trường subscribe bằng giá trị của biến cùng tên.
   */
  return {
    list,
    subscribe,

    // CHỨC NĂNG: Lấy một địa điểm theo ID cho chi tiết hoặc QR.
    // XỬ LÝ: Dùng cùng điều kiện công bố như danh sách.
    // Khai báo get(id). Nhận đầu vào qua tham số.
    async get(id: string): Promise<PlaceRecord> {
      // Khai báo place: (await list()).find lấy phần tử đầu tiên phù hợp.
      const place = (await list()).find((item) => item.id === id)

      // Rẽ nhánh nếu !place. | Ném new CatalogError('notFound').
      if (!place) throw new CatalogError('notFound')

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return place`: Trả kết quả: sử dụng place làm giá trị của bước hiện tại.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return place
    },
    // TẠI SAO (get): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
    // phải xử lý dữ liệu sai như thành công.
  }
}
// TẠI SAO (createCatalog): Các màn danh sách và chi tiết cần cùng quy tắc công bố; lọc riêng
// từng màn có thể làm lộ bản nháp.

// Đặt tên kiểu Catalog.
export type Catalog = ReturnType<typeof createCatalog>