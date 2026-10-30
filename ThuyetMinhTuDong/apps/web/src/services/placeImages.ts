/** FILE NÀY LÀM GÌ: Cung cấp URL ảnh SQL cho các thẻ, hero và trang chi tiết web.
 * Component PlaceImage/HomePage gọi; phụ thuộc mediaSource.ts. */
import { mediaSource } from './mediaSource'
export function resolvePlaceImage(uri?: string): string | undefined {
  if (!uri) return undefined
  // Người dùng có thể đang sửa dở mã/URL trong form; hiện placeholder thay vì làm lỗi render.
  try { return mediaSource(uri) } catch { return undefined }
}
