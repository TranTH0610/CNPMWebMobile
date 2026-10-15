/**
 * FILE NÀY LÀM GÌ:
 * Tạo service tải danh sách địa điểm và bổ sung bản dịch còn thiếu.
 *
 * Được gọi bởi:
 * - hooks/usePlaces.tsx
 *
 * Phụ thuộc:
 * - @travelguide/place-core
 * - services/placeStore.ts
 * - services/translate.ts
 *
 * Liên quan: UC03, tải dữ liệu, tự dịch và cache.
 */

import {
  createPlaceService,
  type PlaceSource,
} from '@travelguide/place-core'

import {
  loadAllPlaces,
  getSavedTranslation,
  saveTranslation,
} from './placeStore'

import {
  TRANSLATION_CACHE_VERSION,
  translateLong,
} from './translate'

// CHỨC NĂNG: tạo service với nguồn dữ liệu có thể thay đổi.
// XỬ LÝ:
// - Không truyền source: dùng loadAllPlaces hiện có.
// - Có truyền source: sử dụng nguồn đó.
// - Nhờ vậy hook có thể tái sử dụng dữ liệu vừa tải,
//   hoặc sau này chuyển sang API mà không phải sửa giao diện.
export function createMobilePlaceCatalog(
  source: PlaceSource = loadAllPlaces,
) {
  return createPlaceService(
    source,

    // CHỨC NĂNG: cung cấp cách dịch một trường còn thiếu.
    // XỬ LÝ: đọc cache trước, chỉ gọi dịch khi chưa có bản lưu.
    async (text, language, key) => {
      const versionedKey =
        `${TRANSLATION_CACHE_VERSION}|${key}`

      const saved = await getSavedTranslation(
        versionedKey,
      )

      if (saved?.trim()) {
        return saved
      }

      const translated = await translateLong(
        text,
        'vi',
        language,
      )

      // CHỨC NĂNG: không lưu bản dịch rỗng.
      // XỬ LÝ: chuyển lỗi lên hook để giao diện hiện Thử lại.
      if (!translated.trim()) {
        throw new Error('Empty catalog translation')
      }

      await saveTranslation(
        versionedKey,
        translated,
      )

      return translated
    },
  )
}

// CHỨC NĂNG: tạo sẵn service mặc định.
// XỬ LÝ: các nơi chỉ cần nguồn hiện tại sử dụng trực tiếp biến này.
export const placeCatalog =
  createMobilePlaceCatalog()