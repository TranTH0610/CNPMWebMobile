/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị danh mục bằng FlatList ngang.
 * Home/Search dùng; phụ thuộc type chung, i18n và theme.
 * Liên quan UC03, FR-39.
 */

import { useMemo } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'

import { useTranslation } from 'react-i18next'
import type { CategoryId } from '@travelguide/shared-types'

import {
  colors,
  spacing,
  radii,
  sizes,
  ui,
} from '../theme'

type Chip = {
  id: CategoryId | 'all'
}

type Props = {
  categories: CategoryId[]
  selected: CategoryId | null
  onChange: (category: CategoryId | null) => void
}

export default function CategoryChips({
  categories,
  selected,
  onChange,
}: Props) {
  const { t } = useTranslation()

  const chips = useMemo<Chip[]>(() => [
    { id: 'all' },
    ...categories.map((id) => ({ id })),
  ], [categories])

  // CHỨC NĂNG: tuân thủ điều kiện hiện bộ lọc.
  // XỬ LÝ: ít hơn hai danh mục thì không cần hàng chip.
  if (categories.length < 2) return null

  return (
    <FlatList
      horizontal
      data={chips}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      extraData={selected}
      renderItem={({ item }) => {
        const value =
          item.id === 'all' ? null : item.id

        const active = selected === value

        return (
          <Pressable
            style={[
              styles.chip,
              active && styles.active,
            ]}
            onPress={() => onChange(value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                ui.muted,
                active && styles.activeText,
              ]}
            >
              {item.id === 'all'
                ? t('explore.all')
                : t(`categories.${item.id}`)}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    minHeight: sizes.touch,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRadius: radii.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeText: {
    color: colors.background,
    fontWeight: '600',
  },
})