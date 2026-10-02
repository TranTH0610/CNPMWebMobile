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

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const { t, i18n } = useTranslation()
  const [ready, setReady] = useState(false)
  const [hasLanguage, setHasLanguage] = useState(false)

  // Chạy 1 lần khi app khởi động: kiểm tra đã chọn ngôn ngữ chưa
  useEffect(() => {
    getSavedLanguage().then(async (saved) => {
      if (saved) await i18n.changeLanguage(saved)
      setHasLanguage(saved !== null)
      setReady(true)
    })
  }, [i18n])

  // Đang đọc bộ nhớ → hiện vòng xoay, CHƯA vẽ navigator
  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack.Navigator initialRouteName={hasLanguage ? 'Home' : 'Language'}>
      <Stack.Screen name="Language" component={LanguageScreen} options={{ title: t('language.title') }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: t('home.title') }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: t('detail.title') }} />
      <Stack.Screen name="AddPlace" component={AddPlaceScreen} options={{ title: 'Thêm địa điểm' }} />
    </Stack.Navigator>
  )
}