/** FILE NÀY LÀM GÌ: Đổi mã ảnh dùng chung thành URL asset web; giữ URL API thật. */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'
export function resolvePlaceImage(uri?: string): string | undefined {
  if (!uri) return undefined
  if (!uri.startsWith('photo:')) return uri
  const id = uri.slice(6)
  return PLACE_PHOTOS[id] ? '/images/places/' + id + '.jpg' : undefined
}
