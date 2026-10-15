/**
 * FILE NÀY LÀM GÌ:
 * Hiện lỗi tải/chuẩn bị ngôn ngữ và nút Thử lại.
 * Home/Search dùng; phụ thuộc i18n và theme.
 * Liên quan UC03, FR-41.
 */

import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, spacing, ui } from '../theme'

export default function ErrorState({
  onRetry,
}: {
  onRetry: () => void
}) {
  const { t } = useTranslation()

  return (
    <View style={ui.state}>
      <Text
        accessibilityRole="alert"
        style={[
          ui.body,
          {
            color: colors.danger,
            marginBottom: spacing.lg,
            textAlign: 'center',
          },
        ]}
      >
        {t('explore.loadError')}
      </Text>

      <Pressable
        style={ui.button}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={ui.buttonText}>
          {t('detail.retry')}
        </Text>
      </Pressable>
    </View>
  )
}