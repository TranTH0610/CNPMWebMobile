/**
 * FILE NÀY LÀM GÌ: Thông báo chức năng yêu thích chưa triển khai đầy đủ.
 * Vị trí: apps/mobile/src/screens/PlaceholderScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View } from 'react-native'
import { useText } from '../i18n/index'
import { ui } from '../components/index'

// CHỨC NĂNG: Thông báo chức năng làm sau.
// XỬ LÝ: Không tạo nghiệp vụ bản đồ/yêu thích giả.
export default function PlaceholderScreen() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <View style={ui.content}>
        <Text style={ui.heading}>{t('comingSoon')}</Text>
        <Text style={ui.text}>{t('favoritesHint')}</Text>
      </View>
    </SafeAreaView>
  )
}
