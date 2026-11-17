/**
 * FILE: apps/mobile/src/shared/services/NguonTepTaiNguyen.ts
 * FILE NÀY LÀM GÌ: Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL.
 * VAI TRÒ: Lớp kết nối nền tảng; chuyển thao tác chung sang API/thiết bị cụ thể.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
export function mediaSource(value: string): string {
  const admin = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
  const base = admin
    ? process.env.EXPO_PUBLIC_ADMIN_API_URL
    : process.env.EXPO_PUBLIC_CATALOG_API_URL
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
