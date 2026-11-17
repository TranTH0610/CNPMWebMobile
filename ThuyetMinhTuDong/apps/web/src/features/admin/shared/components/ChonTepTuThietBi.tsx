/**
 * FILE: apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx
 * FILE NÀY LÀM GÌ: Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useState } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
// CHỨC NĂNG: Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp
// trên máy chủ thật.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] LocalMediaPicker — Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp
export function LocalMediaPicker({
  kind,
  onPick,
  disabled = false,
}: {
  disabled?: boolean
  kind: 'image' | 'audio'
  onPick: (value: string) => void
}) {
  // CHỨC NĂNG: Trạng thái lỗi để giao diện hiển thị thông báo và cho thử lại.

  const t = useAdminText(),
    [error, setError] = useState(false)

  return (
    <div className="admin-local-file">
      <label className="button secondary">
        {t(kind === 'image' ? 'pickImage' : 'pickAudio')}
        <input
          type="file"
          disabled={disabled}
          accept={
            kind === 'image' ? 'image/jpeg,image/png,image/webp' : 'audio/mpeg,audio/wav,audio/ogg'
          }
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            setError(false)
            if (!file) return
            const types =
              kind === 'image'
                ? ['image/jpeg', 'image/png', 'image/webp']
                : ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
            if (file.size > 1048576 || !types.includes(file.type)) {
              setError(true)
              return
            }
            const reader = new FileReader()
            reader.onerror = () => setError(true)
            reader.onload = () => {
              if (typeof reader.result === 'string') onPick(reader.result)
            }
            reader.readAsDataURL(file)
          }}
        />
      </label>
      <p>{t('fileHint')}</p>
      {error && (
        <p role="alert" className="admin-error">
          {t('mediaError')}
        </p>
      )}
    </div>
  )
}
// TẠI SAO (LocalMediaPicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa
// giao diện tại một nơi.
/* CÁCH KIỂM TRA: Tệp >1MB bị từ chối; ảnh/audio chọn được giữ sau tải lại khi đã lưu. */
