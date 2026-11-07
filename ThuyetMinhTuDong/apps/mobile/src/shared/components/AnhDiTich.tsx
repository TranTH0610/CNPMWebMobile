/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
 *
 * VỊ TRÍ: apps/mobile/src/shared/components/AnhDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 *
 * PHỤ THUỘC:
 * - ../GiaoDienChung
 * - react
 * - react-native
 * - ../services/XuLyAnhDiTich
 * - ../../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceImage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { ui, radii } from '../GiaoDienChung'
import { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { resolvePlaceImage } from '../services/XuLyAnhDiTich'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị ảnh hoặc placeholder khi ảnh thiếu/hỏng.
// XỬ LÝ: URL thay đổi thì reset lỗi để thử tải URL mới.

// ==================== [TAI-NGUYEN] PlaceImage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceImage({
  uri,
  title,
}: {
  uri?: string

  title: string
}) {
  const [failed, setFailed] = useState(false)

  const t = useText()

  // CHỨC NĂNG: Đặt lại cờ ảnh lỗi về false khi uri thay đổi.
  // XỬ LÝ: Nguồn ảnh mới được thử tải lại, dù ảnh trước đó đã thất bại.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: uri.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    setFailed(false)
  }, [uri])
  // TẠI SAO: Nếu giữ cờ lỗi cũ, component có thể tiếp tục hiện placeholder dù đã nhận một URL ảnh
  // mới hợp lệ.

  if (!uri || failed) {
    return (
      <View
        style={[
          ui.banner,
          {
            minHeight: 110,
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={ui.muted}>{t('noImage')}</Text>
      </View>
    )
  }

  return (
    <Image
      source={resolvePlaceImage(uri)}
      onError={() => setFailed(true)}
      accessibilityLabel={title}
      style={{
        width: '100%',
        height: 220,
        borderRadius: radii.sm,
      }}
    />
  )
}
// TẠI SAO (PlaceImage): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
