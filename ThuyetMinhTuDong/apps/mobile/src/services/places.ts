/**
 * FILE NÀY LÀM GÌ:
 * Giữ đường dẫn import cũ cho các file mobile đang hoạt động.
 * Kiểu Place và dữ liệu thực tế được chuyển sang packages dùng chung.
 *
 * Được dùng bởi:
 * - services/placeStore.ts
 * - HomeScreen, DetailScreen và các hook đang import Place.
 *
 * Phụ thuộc:
 * - @travelguide/shared-types
 * - @travelguide/place-core/mockPlaces
 *
 * Liên quan: UC03, FR-18.
 */

// CHỨC NĂNG: xuất lại kiểu Place từ nơi dùng chung.
// XỬ LÝ: code cũ vẫn import type Place từ './places' như trước.
export type { Place } from '@travelguide/shared-types'

// CHỨC NĂNG: xuất dữ liệu mẫu dưới tên PLACES cũ.
// XỬ LÝ: placeStore.ts không cần đổi import hoặc đổi cách tải dữ liệu.
export {
  MOCK_PLACES as PLACES,
} from '@travelguide/place-core/mockPlaces'