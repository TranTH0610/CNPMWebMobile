/**
 * FILE NÀY LÀM GÌ: Hiển thị chọn ngôn ngữ chung và liên kết truy cập website/QR.
 * Vị trí: apps/mobile/src/screens/SettingsScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text } from 'react-native'
import { useText } from '../i18n/index'
import WebAccessCard from '../components/WebAccessCard'
import { LanguageBar, ui } from '../components/index'

// CHỨC NĂNG: Cho đổi ngôn ngữ.
// XỬ LÝ: Cùng provider với tiêu đề, danh sách và bài đọc.
export default function SettingsScreen() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.title}>{t('settings')}</Text>
        <LanguageBar />
        <Text style={ui.muted}>{t('noAccount')}</Text>
        <WebAccessCard />
      </ScrollView>
    </SafeAreaView>
  )
}
