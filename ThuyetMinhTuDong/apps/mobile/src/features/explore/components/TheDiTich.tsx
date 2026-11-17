/**
 * FILE: apps/mobile/src/features/explore/components/TheDiTich.tsx
 * FILE NÀY LÀM GÌ: Hiển thị ảnh, tên và thông tin tóm tắt; nhận thao tác mở chi tiết di tích.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceCard.
// [UC02 / UC03] PlaceCard — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceCard.
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
