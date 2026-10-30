/** FILE NÀY LÀM GÌ: Cung cấp nguồn âm thanh API cho trình nghe và nghe thử web.
 * Journey adapter/AudioPreview gọi; không ưu tiên MP3 đóng gói trước SQL. */
import { mediaSource } from './mediaSource'
export function narrationSource(url: string, preview = false): string {
  return mediaSource(url, preview)
}
