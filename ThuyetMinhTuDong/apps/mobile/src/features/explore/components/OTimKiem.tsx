/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ liệu riêng.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/components/OTimKiem.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/components/KhoiChaoMung.tsx
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 *
 * PHỤ THUỘC:
 * - ../GiaoDienKhamPha
 * - ../../../shared/GiaoDienChung
 * - react-native
 * - @expo/vector-icons
 * - ../../language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. SearchBar
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { explore } from '../GiaoDienKhamPha'
import { colors } from '../../../shared/GiaoDienChung'
import { Pressable, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Ô tìm có quay lại, xóa và bộ lọc.
// XỬ LÝ: Không debounce trong component; hook chung chịu trách nhiệm lọc.

// ==================== [KHAM-PHA] SearchBar ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
    <View style={[explore.row, { flexWrap: 'nowrap' }]}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          onPress={onBack}
          style={explore.icon}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      )}

      <View style={[explore.search, { flex: 1 }]}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />

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
            <Ionicons name="close-circle" size={18} color={colors.muted} />
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
          <Ionicons name="options-outline" size={22} color={colors.text} />
        </Pressable>
      )}
    </View>
  )
}
// TẠI SAO (SearchBar): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
