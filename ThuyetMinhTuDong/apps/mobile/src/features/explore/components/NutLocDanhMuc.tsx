/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 *
 * PHỤ THUỘC:
 * - ../GiaoDienKhamPha
 * - ../../../shared/GiaoDienChung
 * - react-native
 * - @expo/vector-icons
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. CategoryChips
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { explore } from '../GiaoDienKhamPha'
import { colors, spacing } from '../../../shared/GiaoDienChung'
import { FlatList, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Dãy chip cuộn ngang.
// XỬ LÝ: Chỉ hiện khi có ít nhất hai danh mục, key dùng mã ổn định.

// ==================== [KHAM-PHA] CategoryChips ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: readonly Category[]

  selected: readonly Category[]

  onSelect: (value: Category[]) => void
}) {
  const t = useText()

  if (categories.length < 2) return null

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={[null, ...categories]}
      contentContainerStyle={{
        gap: spacing.sm,
        paddingVertical: spacing.md,
      }}
      keyExtractor={(item) => item ?? 'all'}
      renderItem={({ item }) => {
        const active = item ? selected.includes(item) : selected.length === 0

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(item ? [item] : [])}
            style={[
              explore.chip,
              active && {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name={item ? 'business-outline' : 'grid-outline'}
              size={23}
              color={active ? colors.white : colors.primary}
              accessible={false}
            />
            <Text style={[explore.chipText, active && { color: colors.white }]}>
              {t(item ? `category_${item}` : 'all')}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}
// TẠI SAO (CategoryChips): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
