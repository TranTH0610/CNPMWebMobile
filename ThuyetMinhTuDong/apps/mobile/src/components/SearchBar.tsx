/**
 * FILE NÀY LÀM GÌ:
 * Thanh tìm kiếm có quay lại, xóa chữ và mở sắp xếp.
 * Home/Search dùng; phụ thuộc i18n, icons và theme.
 * Liên quan UC03, FR-38.
 */

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import {
  colors,
  spacing,
  radii,
  sizes,
  ui,
} from '../theme'

type Props = {
  value: string
  onChangeText?: (value: string) => void
  onBack?: () => void
  onFilter: () => void
  onActivate?: () => void
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChangeText,
  onBack,
  onFilter,
  onActivate,
  autoFocus = false,
}: Props) {
  const { t } = useTranslation()

  return (
    <View style={styles.row}>
      <View style={styles.inputBox}>
        {onBack ? (
          <Pressable
            style={ui.iconButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t('explore.back')}
          >
            <Ionicons
              name="arrow-back"
              size={sizes.icon}
              color={colors.text}
            />
          </Pressable>
        ) : (
          <View style={ui.iconButton}>
            <Ionicons
              name="search-outline"
              size={sizes.icon}
              color={colors.muted}
            />
          </View>
        )}

        {/* CHỨC NĂNG: ở Home, chạm thanh tìm kiếm để mở màn Search.
            XỬ LÝ: không focus TextInput của Home nên quay lại không
            tự mở Search lần nữa do khôi phục focus. */}
        {onActivate ? (
          <Pressable
            style={styles.input}
            onPress={onActivate}
            accessibilityRole="button"
            accessibilityLabel={t('explore.searchPlaceholder')}
          >
            <Text style={ui.muted}>
              {t('explore.searchPlaceholder')}
            </Text>
          </Pressable>
        ) : (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={t('explore.searchPlaceholder')}
            placeholderTextColor={colors.muted}
            accessibilityLabel={t('explore.searchPlaceholder')}
            autoFocus={autoFocus}
            autoCorrect={false}
            returnKeyType="search"
          />
        )}

        {value.length > 0 && (
          <Pressable
            style={ui.iconButton}
            onPress={() => onChangeText?.('')}
            accessibilityRole="button"
            accessibilityLabel={t('explore.clearSearch')}
          >
            <Ionicons
              name="close-circle"
              size={sizes.icon}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>

      <Pressable
        style={ui.iconButton}
        onPress={onFilter}
        accessibilityRole="button"
        accessibilityLabel={t('explore.sort')}
      >
        <Ionicons
          name="options-outline"
          size={sizes.icon}
          color={colors.primary}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputBox: {
    flex: 1,
    minHeight: sizes.touch,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.md,
  },
  input: {
    flex: 1,
    minHeight: sizes.touch,
    justifyContent: 'center',
    color: colors.text,
    paddingHorizontal: spacing.xs,
  },
})