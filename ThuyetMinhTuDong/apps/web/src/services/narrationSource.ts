/** FILE NÀY LÀM GÌ: Đổi mã MP3 dùng chung thành URL web.
 * Journey adapter và trình nghe thử Admin dùng; phụ thuộc visitor-core.
 * UC06/UC14.2: bản nháp chỉ qua API preview của site quản lý.
 */
import { bundledNarrationKey, narrationKey } from '@travelguide/visitor-core'
export function narrationSource(url: string, preview = false): string {
  const key = narrationKey(url)
  // CHỨC NĂNG: Audio sẵn có chạy ngay từ static, không cần gọi TTS lúc nghe.
  if (key) {
    if (bundledNarrationKey(key)) return '/narrations/' + key + '.mp3'
    const base: string = (preview ? import.meta.env.VITE_ADMIN_API_URL : import.meta.env.VITE_CATALOG_API_URL) || '/api/catalog'
    return base.replace(/\/$/, '') + '/audio/' + (preview ? 'preview/' : 'published/') + key + '.mp3'
  }
  if (url.startsWith('narration:')) throw new Error('Invalid narration key')
  return url.startsWith('demo:') ? '/demo-audio/' + url.slice(5) + '.mp3' : url
}
/* CÁCH KIỂM TRA: Bài seed trỏ static; bài Admin mới trỏ API; khóa lạ bị từ chối. */
