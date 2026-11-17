/**
 * FILE: apps/web/src/shared/services/NguonTepTaiNguyen.ts
 * FILE NÀY LÀM GÌ: Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static.
 * VAI TRÒ: Lớp kết nối nền tảng; chuyển thao tác chung sang API/thiết bị cụ thể.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
export function mediaSource(value: string, preview = false): string {
  const staff = preview || import.meta.env.MODE === 'admin'
  const base: string =
    (staff ? import.meta.env.VITE_ADMIN_API_URL : import.meta.env.VITE_CATALOG_API_URL) ||
    '/api/catalog'
  const prefix = base.replace(/\/$/, '')
  const audience = staff ? 'preview' : 'published'
  const media = /^media:([a-f0-9]{64})$/.exec(value)
  if (media) return `${prefix}/media/${audience}/${media[1]}`
  const photo = /^photo:([a-z0-9-]+)$/.exec(value)
  if (photo) return `${prefix}/images/${audience}/${photo[1]}.jpg`
  const narration = /^narration:([a-f0-9]{64})$/.exec(value)
  if (narration) return `${prefix}/audio/${audience}/${narration[1]}.mp3`
  // Ảnh/audio vừa chọn có thể còn là data URI trước khi người dùng bấm Lưu.
  if (/^(?:media|photo|narration):/.test(value)) throw new Error('Invalid media reference')
  return value
}
