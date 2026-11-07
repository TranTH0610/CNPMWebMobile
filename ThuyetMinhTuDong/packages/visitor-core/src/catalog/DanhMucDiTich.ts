/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Service danh mục công bố; loại bản nháp/ngoài phạm vi và lấy chi tiết đúng ID theo cùng điều
 *
 * VỊ TRÍ: packages/visitor-core/src/catalog/DanhMucDiTich.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/catalog/TimKiemVaBoLoc.ts
 * - packages/visitor-core/src/data/DuLieuKhoiTao.ts
 * - packages/visitor-core/src/journey/HanhTrinh.ts
 * - packages/visitor-core/src/react/TrangThaiReact.tsx
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - ../domain/KieuDuLieuDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. CatalogError
 * 2. publishedText
 * 3. availableLanguages
 * 4. createCatalog
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import type {
  CatalogSource,
  Language,
  PlaceRecord,
  PublishedText,
} from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Phân biệt điểm không tồn tại với lỗi tải dữ liệu.
// XỬ LÝ: UI dùng mã notFound thay vì hiện thông báo lỗi kỹ thuật.

// ==================== [KHAM-PHA] CatalogError ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export class CatalogError extends Error {
  constructor(public readonly code: 'notFound') {
    // Thực hiện Gọi super(code).
    super(code)
    
    this.name = 'CatalogError'
  }
}

// CHỨC NĂNG: Lấy bản nội dung đúng ngôn ngữ đã duyệt và công bố.
// XỬ LÝ: Thiếu bản thì trả undefined; không tự dịch hoặc âm thầm đổi ngôn ngữ.

// ==================== [KHAM-PHA] publishedText ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function publishedText(
  place: PlaceRecord,
  language: Language,
): PublishedText | undefined {
  // Khai báo text: đọc place.content[language] từ đối tượng/mảng để dùng tại bước hiện tại.
  const text = place.content[language]

  
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
// ==================== [KHAM-PHA] availableLanguages ====================
export function availableLanguages(place: PlaceRecord): Language[] {
  
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
// ==================== [KHAM-PHA] createCatalog ====================
export function createCatalog(source: CatalogSource, subscribe?: (listener: () => void) => () => void) {
  // Khai báo list: khai báo callback async (): Promise<PlaceRecord[]> => { const raw = await source() // CHỨC NĂ.
  const list = async (): Promise<PlaceRecord[]> => {
    // Khai báo raw: await chờ Gọi source().
    const raw = await source()

    // CHỨC NĂNG: Giới hạn đúng phạm vi và danh mục triển khai.
    // XỬ LÝ: Loại điểm nháp, đã rút hoặc chưa được chọn triển khai.
    
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
          
          if (text) content[language] = { ...text }
        }

        
        return {
          ...place,
          // Gán thuộc tính images: tạo mảng [...place.images].
          images: [...place.images],
          
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter((place) => availableLanguages(place).length > 0)
  }
  // TẠI SAO (list): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
  // liệu.

  
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