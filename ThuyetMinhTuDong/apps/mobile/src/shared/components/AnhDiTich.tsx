/**
 * FILE: apps/mobile/src/shared/components/AnhDiTich.tsx
 * FILE NÀY LÀM GÌ: Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { ui, radii } from '../GiaoDienChung'
import { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { resolvePlaceImage } from '../services/XuLyAnhDiTich'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị ảnh hoặc placeholder khi ảnh thiếu/hỏng.
// XỬ LÝ: URL thay đổi thì reset lỗi để thử tải URL mới.

// [UC02 / UC04 / UC10 / UC11] PlaceImage — Hiển thị ảnh hoặc placeholder khi ảnh thiếu/hỏng.
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
