/**
 * FILE NÀY LÀM GÌ: Trạng thái tải/lỗi/thông báo và các nút thử lại hoặc quay lại.
 * Vị trí: apps/mobile/src/components/State.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui, colors } from '../theme'
import { Action } from './Action'
import { ActivityIndicator, Text, View } from 'react-native'
import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị loading, thông báo và thao tác khôi phục.
// XỬ LÝ: Chỉ nhận key dịch; không hiện lỗi kỹ thuật từ API.
export function State({
  message,
  busy = false,
  retry,
  back,
}: {
  message: MessageKey
  busy?: boolean
  retry?: () => void
  back?: () => void
}) {
  const t = useText()

  return (
    <View style={ui.content}>
      {busy && (
        <ActivityIndicator
          color={colors.primary}
          accessibilityLabel={t('loading')}
        />
      )}

      <Text
        accessibilityRole={busy ? 'text' : 'alert'}
        style={ui.text}
      >
        {t(message)}
      </Text>

      {retry && (
        <Action title={t('retry')} onPress={retry} />
      )}

      {back && (
        <Action title={t('back')} onPress={back} />
      )}
    </View>
  )
}
