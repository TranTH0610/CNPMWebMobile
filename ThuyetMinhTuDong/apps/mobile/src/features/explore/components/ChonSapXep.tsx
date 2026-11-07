/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/components/ChonSapXep.tsx
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
 * 1. SortDropdown
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { explore } from '../GiaoDienKhamPha'
import { colors } from '../../../shared/GiaoDienChung'
import { Alert, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { SortOrder } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Chọn cách sắp xếp bằng hộp native.
// XỬ LÝ: Nhãn thể hiện thứ tự thực tế; GPS do màn gọi xử lý.

// ==================== [KHAM-PHA] SortDropdown ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function SortDropdown({
  effectiveOrder,
  onSelect,
}: {
  effectiveOrder: SortOrder

  onSelect: (value: SortOrder) => void
}) {
  const t = useText()

  return (
    <Pressable
      style={explore.sort}
      accessibilityRole="button"
      accessibilityLabel={t('sort')}
      onPress={() =>
        Alert.alert(t('sort'), undefined, [
          {
            text: t('nearest'),
            onPress: () => onSelect('nearest'),
          },
          {
            text: t('name'),
            onPress: () => onSelect('name'),
          },
          {
            text: t('close'),
            style: 'cancel',
          },
        ])
      }
    >
      <Text style={{ color: colors.text, fontSize: 12 }}>{t(effectiveOrder)}</Text>
      <Ionicons name="chevron-down" size={14} color={colors.muted} />
    </Pressable>
  )
}
// TẠI SAO (SortDropdown): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
