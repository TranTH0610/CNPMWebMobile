/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile.
 *
 * VỊ TRÍ: apps/mobile/src/shared/components/AnhBia.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * - apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx
 * - apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx
 * - apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx
 * - apps/mobile/src/features/explore/components/KhoiChaoMung.tsx
 * - apps/mobile/src/features/explore/components/TheDiTich.tsx
 * - apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 *
 * PHỤ THUỘC:
 * - ../../features/explore/GiaoDienKhamPha
 * - ../GiaoDienChung
 * - react
 * - react-native
 * - @expo/vector-icons
 * - ../services/XuLyAnhDiTich
 * - ../../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. Cover
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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

// ==================== [TAI-NGUYEN] Cover ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
