/**
 * FILE: apps/mobile/src/features/explore/components/ChonSapXep.tsx
 * FILE NÀY LÀM GÌ: Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { explore } from '../GiaoDienKhamPha'
import { colors } from '../../../shared/GiaoDienChung'
import { Alert, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { SortOrder } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Chọn cách sắp xếp bằng hộp native.
// XỬ LÝ: Nhãn thể hiện thứ tự thực tế; GPS do màn gọi xử lý.

// [UC02 / UC03] SortDropdown — Chọn cách sắp xếp bằng hộp native.
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
