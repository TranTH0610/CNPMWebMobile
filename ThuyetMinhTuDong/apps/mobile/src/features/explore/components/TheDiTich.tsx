/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/components/TheDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - @expo/vector-icons
 * - @travelguide/visitor-core
 * - ../GiaoDienKhamPha
 * - ../../../shared/GiaoDienChung
 * - ../../../shared/components/AnhBia
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceCard
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { categoryOf, distanceTo, publishedText } from '@travelguide/visitor-core'
import type { PlaceRecord, Point } from '@travelguide/visitor-core'
import { explore } from '../GiaoDienKhamPha'
import { colors, spacing } from '../../../shared/GiaoDienChung'
import { Cover } from '../../../shared/components/AnhBia'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
// ==================== [KHAM-PHA] PlaceCard ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceCard.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceCard({
  place,
  onOpen,
  featured = false,
  width,
  origin,
}: {
  place: PlaceRecord
  onOpen: () => void
  featured?: boolean
  width?: number
  origin?: Point
}) {
  const { language } = useVisitor()
  const t = useText()
  const content = publishedText(place, language)
  const title = content?.title ?? place.canonicalTitle
  // CHỨC NĂNG: Chỉ hiện khoảng cách khi hàm dùng chung có vị trí hợp lệ.
  const meters = distanceTo(place, origin)
  if (featured)
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onOpen}
        style={({ pressed }) => [explore.featured, { width }, pressed && explore.pressed]}
      >
        <Cover uri={place.images[0]} style={{ width: '100%', aspectRatio: 16 / 10 }} />
        <View style={explore.featuredText}>
          <Text style={explore.badge}>{t(`category_${categoryOf(place)}`)}</Text>
          <Text numberOfLines={2} style={[explore.cardTitle, { fontSize: 20, lineHeight: 28 }]}>
            {title}
          </Text>
          <Text numberOfLines={1} style={explore.muted}>
            {content?.address || t('city')}
          </Text>
        </View>
      </Pressable>
    )
  // CHỨC NĂNG: Một nút duy nhất, tránh trình đọc màn hình phải đọc cùng thẻ hai lần.
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onOpen}
      style={({ pressed }) => [explore.card, pressed && explore.pressed]}
    >
      <Cover uri={place.images[0]} style={explore.image} />
      <View style={{ flex: 1, minWidth: 0, gap: spacing.sm }}>
        <Text numberOfLines={2} style={explore.cardTitle}>
          {title}
        </Text>
        <Text style={explore.badge}>{t(`category_${categoryOf(place)}`)}</Text>
        <Text numberOfLines={2} style={explore.muted}>
          {content ? content.address || t('city') : t('missing')}
        </Text>
        {meters !== undefined && <Text style={explore.muted}>{(meters / 1000).toFixed(2)} km</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.primary} accessible={false} />
    </Pressable>
  )
}
