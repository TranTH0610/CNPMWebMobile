/**
 * FILE NÀY LÀM GÌ:
 * Lọc địa điểm và nội dung công bố cho UC02/UC04.
 * Hook trong react.tsx gọi service này; phụ thuộc model.ts.
 * Nguồn mock hoặc API được truyền vào khi tạo service.
 */

import type {
  CatalogSource,
  Language,
  PlaceRecord,
  PublishedText,
} from './model'

// CHỨC NĂNG: Phân biệt điểm không tồn tại với lỗi tải dữ liệu.
// XỬ LÝ: UI dùng mã notFound thay vì hiện thông báo lỗi kỹ thuật.
export class CatalogError extends Error {
  constructor(public readonly code: 'notFound') {
    super(code)
    this.name = 'CatalogError'
  }
}

// CHỨC NĂNG: Lấy bản nội dung đúng ngôn ngữ đã duyệt và công bố.
// XỬ LÝ: Thiếu bản thì trả undefined; không tự dịch hoặc âm thầm đổi ngôn ngữ.
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

// CHỨC NĂNG: Liệt kê các bản ngôn ngữ được phép đọc.
// XỬ LÝ: Bản nháp không xuất hiện trong danh sách lựa chọn.
export function availableLanguages(place: PlaceRecord): Language[] {
  return (['vi', 'en', 'cn', 'pt', 'ja'] as const).filter(
    (language) => Boolean(publishedText(place, language)),
  )
}

// CHỨC NĂNG: Tạo service danh sách và chi tiết.
// XỬ LÝ: Đổi nguồn dữ liệu chỉ cần đổi source, không phải sửa màn hình.
// Backend thật vẫn phải kiểm tra quyền/công bố; lọc FE không thay thế bảo mật server.
export function createCatalog(source: CatalogSource) {
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

  return {
    list,

    // CHỨC NĂNG: Lấy một địa điểm theo ID cho chi tiết hoặc QR.
    // XỬ LÝ: Dùng cùng điều kiện công bố như danh sách.
    async get(id: string): Promise<PlaceRecord> {
      const place = (await list()).find((item) => item.id === id)

      if (!place) throw new CatalogError('notFound')

      return place
    },
  }
}

export type Catalog = ReturnType<typeof createCatalog>