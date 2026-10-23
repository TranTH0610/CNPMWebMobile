/**
 * FILE NÀY LÀM GÌ: Hiển thị các chip danh mục có dữ liệu và cập nhật mục đang chọn.
 * Vị trí: apps/mobile/src/components/CategoryChips.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors, spacing } from '../theme'
import { FlatList, Pressable, Text } from 'react-native'
import { categoryIcons } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Dãy chip cuộn ngang.
// XỬ LÝ: Chỉ hiện khi có ít nhất hai danh mục, key dùng mã ổn định.
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
        const active = item
          ? selected.includes(item)
          : selected.length === 0

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
            <Text
              style={[
                explore.chipIcon,
                active && { color: colors.white },
              ]}
            >
              {item ? categoryIcons[item] : '▥'}
            </Text>

            <Text
              style={[
                explore.chipText,
                active && { color: colors.white },
              ]}
            >
              {t(item ? `category_${item}` : 'all')}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}
