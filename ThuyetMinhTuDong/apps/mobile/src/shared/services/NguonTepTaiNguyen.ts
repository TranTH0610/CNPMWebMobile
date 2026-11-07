/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: KẾT NỐI API / THIẾT BỊ
 *
 * FILE NÀY LÀM GÌ:
 * Tạo URL ảnh/âm thanh SQL theo host API do lệnh khởi động Expo cấp. XuLyAnhDiTich.ts/KetNoiAudioVaDinhVi.ts dùng. Không dùng localhost của điện thoại hoặc asset thay SQL.
 *
 * VỊ TRÍ: apps/mobile/src/shared/services/NguonTepTaiNguyen.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts
 * - apps/mobile/src/shared/services/XuLyAnhDiTich.ts
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
