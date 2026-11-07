/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx
 * - apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - expo-document-picker
 * - expo-file-system/legacy
 * - @travelguide/admin-core/react
 * - ../../../../shared/components/NutThaoTac
 * - ./ThanhPhanQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. LocalMediaPicker
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { useAdminText } from '@travelguide/admin-core/react'
import { Action } from '../../../../shared/components/NutThaoTac'
import { styles } from './ThanhPhanQuanTri'
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
  kind: 'image' | 'audio'
  onPick: (value: string) => void
  disabled?: boolean
}) {
  // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp. Trạng thái lỗi để giao diện hiển
  // thị thông báo và cho thử lại.

  const t = useAdminText(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false),
    alive = useRef(true)
  // CHỨC NĂNG: Đánh dấu component đang tồn tại; cleanup đổi alive.current thành false.
  // XỬ LÝ: Các callback chọn/đọc tệp kiểm tra cờ này trước khi trả kết quả về UI.
  // KHI NÀO CHẠY: Theo vòng mount của component; mảng [] không theo dõi props/state. Cleanup chạy
  // khi rời component.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện tính biểu thức alive.current=true. | Trả kết quả: khai báo callback ()=>{alive.current=false}. | Thực hiện tính biểu thức alive.current=false.
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])
  // TẠI SAO: Hộp chọn tệp có thể trả kết quả sau khi người dùng đã rời màn; không nên cập nhật
  // component đã đóng.

  const pick = async () => {
    // Cập nhật trạng thái qua setBusy(true). | Cập nhật trạng thái qua setError(false).
    setBusy(true)
    setError(false)

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type:
          kind === 'image'
            ? ['image/jpeg', 'image/png', 'image/webp']
            : ['audio/mpeg', 'audio/wav', 'audio/ogg'],
        multiple: false,
        copyToCacheDirectory: true,
      })

      if (result.canceled) return

      const asset = result.assets[0],
        mime = asset.mimeType === 'audio/x-wav' ? 'audio/wav' : asset.mimeType

      const allowed =
        kind === 'image'
          ? ['image/jpeg', 'image/png', 'image/webp']
          : ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']

      const info = await FileSystem.getInfoAsync(asset.uri)
      // Gán size bằng asset.size; nếu null hoặc undefined thì dùng (info.exists?info.size:Infinity).
      const size = asset.size ?? (info.exists ? info.size : Infinity)

      if (!mime || !allowed.includes(mime) || size > 1048576) throw Error('invalid')

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      if (base64.length > 1400000) throw Error('invalid')

      if (alive.current) onPick('data:' + mime + ';base64,' + base64)
    } catch {
      if (alive.current) setError(true)
    } finally {
      if (alive.current) setBusy(false)
    }
  }
  // TẠI SAO (pick): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.

  return (
    <View style={{ gap: 8 }}>
      <Action
        title={t(kind === 'image' ? 'pickImage' : 'pickAudio')}
        disabled={busy || disabled}
        onPress={() => {
          void pick()
        }}
      />
      <Text style={styles.muted}>{t('fileHint')}</Text>
      {error && <Text style={styles.error}>{t('mediaError')}</Text>}
    </View>
  )
}
// TẠI SAO (LocalMediaPicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa
// giao diện tại một nơi.
/* CÁCH KIỂM TRA: Hủy không lỗi; tệp >1MB bị chặn; lưu bản nháp rồi mở lại vẫn có file. */
