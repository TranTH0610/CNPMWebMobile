/** FILE NÀY LÀM GÌ: Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp.
 * placeImages.ts/journeyAdapters.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL. */
export function mediaSource(value: string): string {
  const admin = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
  const base = admin ? process.env.EXPO_PUBLIC_ADMIN_API_URL : process.env.EXPO_PUBLIC_CATALOG_API_URL
  const audience = admin ? 'preview' : 'published'
  let suffix: string | undefined
  const media = /^media:([a-f0-9]{64})$/.exec(value)
  const photo = /^photo:([a-z0-9-]+)$/.exec(value)
  const narration = /^narration:([a-f0-9]{64})$/.exec(value)
  if (media) suffix = `/media/${audience}/${media[1]}`
  else if (photo) suffix = `/images/${audience}/${photo[1]}.jpg`
  else if (narration) suffix = `/audio/${audience}/${narration[1]}.mp3`
  if (suffix) {
    if (!base) throw new Error('Missing catalog API URL')
    return base.replace(/\/$/, '') + suffix
  }
  if (/^(?:media|photo|narration):/.test(value)) throw new Error('Invalid media reference')
  return value
}
