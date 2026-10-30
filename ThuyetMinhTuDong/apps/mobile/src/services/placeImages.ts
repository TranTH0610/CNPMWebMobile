/** FILE NÀY LÀM GÌ: Cung cấp nguồn ảnh API cho PlaceImage và Cover của mobile.
 * Ảnh được đọc từ SQL; data URI chỉ dùng xem trước tệp chưa lưu. */
import type { ImageSourcePropType } from 'react-native'
import { mediaSource } from './mediaSource'
export function resolvePlaceImage(uri?: string): ImageSourcePropType | undefined {
  if (!uri) return undefined
  // Giá trị nhập dở chưa hợp lệ không được làm màn hình admin bị crash.
  try { return { uri: mediaSource(uri) } } catch { return undefined }
}
