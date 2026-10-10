import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import LanguageScreen from '../screens/LanguageScreen'
import HomeScreen from '../screens/HomeScreen'
import DetailScreen from '../screens/DetailScreen'
import AddPlaceScreen from '../screens/AddPlaceScreen'
import { getSavedLanguage } from '../i18n/storage'
import type { RootStackParamList } from './types'
import SettingsScreen from '../screens/SettingsScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const { t, i18n } = useTranslation()

  // ready = đã đọc xong bộ nhớ chưa; hasLanguage = đã từng chọn ngôn ngữ chưa.
  // Tách 2 cờ vì hasLanguage=false có thể nghĩa "chưa đọc xong" HOẶC "lần đầu".
  const [ready, setReady] = useState(false)
  const [hasLanguage, setHasLanguage] = useState(false)

  // CHỨC NĂNG: chạy 1 lần lúc khởi động, quyết định hiện màn nào đầu tiên.
  useEffect(() => {
    let cancelled = false // tránh setState khi component đã bị hủy
    ;(async () => {
      try {
        const saved = await getSavedLanguage()
        // Đã chọn trước đó → áp dụng NGAY, trước khi vẽ giao diện
        if (saved) await i18n.changeLanguage(saved)
        if (!cancelled) setHasLanguage(saved !== null)
      } finally {
        // XỬ LÝ: dù thành công hay lỗi, luôn tắt vòng xoay.
        // Nếu thiếu dòng này mà có lỗi, app sẽ xoay vô tận (lỗi "demo không vào được").
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [i18n])

  // CHỨC NĂNG: trong lúc đọc bộ nhớ chỉ hiện vòng xoay, CHƯA tạo navigator.
  // XỬ LÝ: chống hiện tượng màn chọn ngôn ngữ "nháy" ở những lần mở sau.
  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  // CHỨC NĂNG: logic cốt lõi của M1.
  // Chưa chọn → 'Language'; đã chọn → vào thẳng 'Home'.
  // Tiêu đề dùng t(...) nên đổi ngôn ngữ là header đổi theo (không hard-code).
  return (
    <Stack.Navigator initialRouteName={hasLanguage ? 'Home' : 'Language'}>
      <Stack.Screen name="Language" component={LanguageScreen} options={{ title: t('language.title') }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: t('home.title') }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: t('detail.title') }} />
      <Stack.Screen name="AddPlace" component={AddPlaceScreen} options={{ title: t('home.addPlace') }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
    </Stack.Navigator>
  )
}