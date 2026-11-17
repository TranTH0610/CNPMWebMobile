/**
 * FILE: packages/visitor-core/src/catalog/DanhMucDiTich.ts
 * FILE NÀY LÀM GÌ: Đọc danh mục và chọn văn bản/âm thanh đã công bố đúng ngôn ngữ.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type {
  CatalogSource,
  Language,
  PlaceRecord,
  PublishedText,
} from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Phân biệt điểm không tồn tại với lỗi tải dữ liệu.
// XỬ LÝ: UI dùng mã notFound thay vì hiện thông báo lỗi kỹ thuật.

// [UC02 / UC03 / UC04 / UC07] CatalogError — Phân biệt điểm không tồn tại với lỗi tải dữ liệu.
export class CatalogError extends Error {
  constructor(public readonly code: 'notFound') {
    super(code)
    
    this.name = 'CatalogError'
  }
}

// CHỨC NĂNG: Lấy bản nội dung đúng ngôn ngữ đã duyệt và công bố.
// XỬ LÝ: Thiếu bản thì trả undefined; không tự dịch hoặc âm thầm đổi ngôn ngữ.

// [UC02 / UC03 / UC04 / UC07] publishedText — Chọn văn bản đã công bố đúng ngôn ngữ; không lấy bản nháp thay thế.
export function publishedText(
  place: PlaceRecord,
  language: Language,
): PublishedText | undefined {
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
// [UC02 / UC03 / UC04 / UC07] availableLanguages — Liệt kê các ngôn ngữ có nội dung phục vụ cho di tích.
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
// [UC02 / UC03 / UC04 / UC07] createCatalog — Tạo đầu mối tải danh mục/chi tiết từ nguồn dữ liệu công bố.
export function createCatalog(source: CatalogSource, subscribe?: (listener: () => void) => () => void) {
  const list = async (): Promise<PlaceRecord[]> => {
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
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        // Duyệt lần lượt availableLanguages(place) bằng const language.
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
      .filter((place) => availableLanguages(place).length > 0)
  }
  // TẠI SAO (list): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
  // liệu.

  
  return {
    list,
    subscribe,

    // CHỨC NĂNG: Lấy một địa điểm theo ID cho chi tiết hoặc QR.
    // XỬ LÝ: Dùng cùng điều kiện công bố như danh sách.
    // [UC02 / UC03 / UC04 / UC07] get — Lấy một địa điểm theo ID cho chi tiết hoặc QR.
    async get(id: string): Promise<PlaceRecord> {
      const place = (await list()).find((item) => item.id === id)

      if (!place) throw new CatalogError('notFound')

      
      return place
    },
    // TẠI SAO (get): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
    // phải xử lý dữ liệu sai như thành công.
  }
}
// TẠI SAO (createCatalog): Các màn danh sách và chi tiết cần cùng quy tắc công bố; lọc riêng
// từng màn có thể làm lộ bản nháp.

export type Catalog = ReturnType<typeof createCatalog>