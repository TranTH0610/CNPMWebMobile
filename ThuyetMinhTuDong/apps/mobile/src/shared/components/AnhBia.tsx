/**
 * FILE: apps/mobile/src/shared/components/AnhBia.tsx
 * FILE NÀY LÀM GÌ: Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { explore } from '../../features/explore/GiaoDienKhamPha'
import { colors } from '../GiaoDienChung'
import { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { resolvePlaceImage } from '../services/XuLyAnhDiTich'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị ảnh co theo khung hoặc placeholder.
// XỬ LÝ: Lỗi gắn với URI để callback ảnh cũ không làm hỏng ảnh mới; thiếu asset cũng hiện placeholder.

// [UC02 / UC04 / UC10 / UC11] Cover — Hiển thị ảnh co theo khung hoặc placeholder.
export function Cover({
  uri,
  style,
}: {
  uri?: string

  style?: StyleProp<ViewStyle>
}) {
  const [failedUri, setFailedUri] = useState<string>()

  const source = resolvePlaceImage(uri)

  const failed = failedUri === uri

  const t = useText()

  return (
    <View
      style={[
        {
          backgroundColor: colors.soft,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {source && !failed ? (
        <Image
          key={uri}
          source={source}
          onError={() => setFailedUri(uri)}
          // CHỨC NĂNG: Ghi đè kích thước gốc mà RN tự thêm cho ảnh đóng gói.
          // XỬ LÝ: absoluteFill chỉ đặt vị trí; width/height 100% buộc ảnh co đúng khung
          // của thumbnail, ảnh hero và ảnh player. Nếu thiếu, chỉ thấy góc trời/tường của JPG.
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="image-outline" size={28} color={colors.muted} />
          <Text style={explore.muted}>{t('noImage')}</Text>
        </View>
      )}
    </View>
  )
}
// TẠI SAO (Cover): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
