/**
 * FILE: apps/mobile/src/features/explore/components/OTimKiem.tsx
 * FILE NÀY LÀM GÌ: Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ liệu riêng.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { explore } from '../GiaoDienKhamPha'
import { colors } from '../../../shared/GiaoDienChung'
import { Pressable, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Ô tìm có quay lại, xóa và bộ lọc.
// XỬ LÝ: Không debounce trong component; hook chung chịu trách nhiệm lọc.

// [UC02 / UC03] SearchBar — Ô tìm có quay lại, xóa và bộ lọc.
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
