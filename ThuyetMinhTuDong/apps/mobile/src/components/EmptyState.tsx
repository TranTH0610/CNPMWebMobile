/**
 * FILE NÀY LÀM GÌ:
 * Hiện trạng thái không có kết quả và gợi ý thay đổi bộ lọc.
 * Home/Search dùng; phụ thuộc i18n và theme.
 * Liên quan UC03, FR-41.
 */

import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { spacing, ui } from '../theme'

export default function EmptyState({
  onReset,
}: {
  onReset: () => void
}) {
  const { t } = useTranslation()

  return (
    <View style={ui.state}>
      <Text style={ui.section}>
        {t('explore.emptyTitle')}
      </Text>

      <Text
        style={[
          ui.muted,
          {
            marginVertical: spacing.lg,
            textAlign: 'center',
          },
        ]}
      >
        {t('explore.emptyBody')}
      </Text>

      <Pressable
        style={ui.button}
        onPress={onReset}
        accessibilityRole="button"
      >
        <Text style={ui.buttonText}>
          {t('explore.reset')}
        </Text>
      </Pressable>
    </View>
  )
}