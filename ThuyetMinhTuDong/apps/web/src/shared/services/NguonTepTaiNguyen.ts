/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Đổi mã tài nguyên SQL thành URL API cho web du khách/admin. XuLyAnhDiTich.ts/NguonAmThanh.ts dùng; không tải ảnh/MP3 từ thư mục static.
 *
 * VỊ TRÍ: apps/web/src/shared/services/NguonTepTaiNguyen.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/journey/adapters/NguonAmThanh.ts
 * - apps/web/src/shared/services/XuLyAnhDiTich.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. mediaSource
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Đóng gói chi tiết API/thiết bị để nơi gọi sử dụng một hợp đồng ổn định.
 */
// ==================== [TAI-NGUYEN] mediaSource ====================
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
