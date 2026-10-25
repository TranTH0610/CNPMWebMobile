/**
 * FILE NÀY LÀM GÌ: Ô tìm kiếm mobile, thao tác quay lại/xóa và mở bộ lọc.
 * Vị trí: apps/mobile/src/components/SearchBar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { Pressable, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Ô tìm có quay lại, xóa và bộ lọc.
// XỬ LÝ: Không debounce trong component; hook chung chịu trách nhiệm lọc.
export function SearchBar({
  value,
  onChange,
  onBack,
  onFocus,
  onFilter,
  onSubmit,
  autoFocus = false,
}: {
  value: string
  onChange: (value: string) => void
  onBack?: () => void
  onFocus?: () => void
  onFilter?: () => void
  onSubmit?: () => void
  autoFocus?: boolean
}) {
  const t = useText()

  return (
    <View style={explore.row}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          onPress={onBack}
          style={explore.icon}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text}
          />
        </Pressable>
      )}

      <View style={[explore.search, { flex: 1 }]}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.muted}
        />

        <TextInput
          style={explore.input}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          placeholder={t('search')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('search')}
          autoCorrect={false}
        />

        {!!value && (
          <Pressable
            onPress={() => onChange('')}
            accessibilityLabel={t('clearSearch')}
            accessibilityRole="button"
            style={explore.icon}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>

      {onFilter && (
        <Pressable
          accessibilityLabel={t('filters')}
          accessibilityRole="button"
          onPress={onFilter}
          style={explore.sort}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={colors.text}
          />
        </Pressable>
      )}
    </View>
  )
}
