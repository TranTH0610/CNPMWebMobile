/**
 * FILE: apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx
 * FILE NÀY LÀM GÌ: Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ thật.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
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

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] LocalMediaPicker — Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp
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
  // khi rời component.
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
