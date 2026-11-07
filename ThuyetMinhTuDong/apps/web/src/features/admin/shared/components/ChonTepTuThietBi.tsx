/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.
 *
 * VỊ TRÍ: apps/web/src/features/admin/shared/components/ChonTepTuThietBi.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * - apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - @travelguide/admin-core/react
 *
 * CÁC KHỐI CHÍNH:
 * 1. LocalMediaPicker
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useState } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
// CHỨC NĂNG: Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp
// trên máy chủ thật.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [TAI-NGUYEN] LocalMediaPicker ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
