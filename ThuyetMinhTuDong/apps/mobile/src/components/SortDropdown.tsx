/**
 * FILE NÀY LÀM GÌ: Chọn sắp xếp theo tên hoặc gần nhất; báo cách sắp xếp thực tế.
 * Vị trí: apps/mobile/src/components/SortDropdown.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { Alert, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { SortOrder } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Chọn cách sắp xếp bằng hộp native.
// XỬ LÝ: Nhãn thể hiện thứ tự thực tế; GPS do màn gọi xử lý.
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
      onPress={() => Alert.alert(t('sort'), undefined, [
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
      ])}
    >
      <Text style={{ color: colors.text, fontSize: 12 }}>
        {t(effectiveOrder)}
      </Text>
      <Ionicons
        name="chevron-down"
        size={14}
        color={colors.muted}
      />
    </Pressable>
  )
}
