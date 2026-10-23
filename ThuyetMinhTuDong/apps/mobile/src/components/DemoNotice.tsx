/**
 * FILE NÀY LÀM GÌ: Thông báo nội dung đang là dữ liệu demo theo ngôn ngữ hiện tại.
 * Vị trí: apps/mobile/src/components/DemoNotice.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui } from '../theme'
import { Text, View } from 'react-native'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Phân biệt dữ liệu demo với nội dung chính thức.
// XỬ LÝ: Thông báo được dịch theo lựa chọn giao diện.
export function DemoNotice() {
  const t = useText()

  return (
    <View style={ui.banner}>
      <Text style={ui.muted}>{t('demo')}</Text>
    </View>
  )
}
