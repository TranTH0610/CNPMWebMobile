/**
 * FILE NÀY LÀM GÌ:
 * Giữ luồng chọn ngôn ngữ lần đầu và các route Detail/AddPlace/Settings.
 * App.tsx dùng; Home giờ mở MainTabs.
 * Phụ thuộc storage ngôn ngữ và native-stack v6.
 */

import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'

import LanguageScreen from '../screens/LanguageScreen'
import DetailScreen from '../screens/DetailScreen'
import AddPlaceScreen from '../screens/AddPlaceScreen'
import SettingsScreen from '../screens/SettingsScreen'
import MainTabs from './MainTabs'

import { getSavedLanguage } from '../i18n/storage'
import type { RootStackParamList } from './types'
import { ui } from '../theme'

const Stack =
  createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const { t, i18n } = useTranslation()

  const [ready, setReady] = useState(false)
  const [hasLanguage, setHasLanguage] = useState(false)

  useEffect(() => {
    let cancelled = false

    const initialize = async (): Promise<void> => {
      try {
        const saved = await getSavedLanguage()

        if (saved) {
          await i18n.changeLanguage(saved)
        }

        if (!cancelled) {
          setHasLanguage(saved !== null)
        }
      } catch {
        if (!cancelled) {
          setHasLanguage(false)
        }
      } finally {
        if (!cancelled) {
          setReady(true)
        }
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [i18n])

  if (!ready) {
    return (
      <View
        style={[
          ui.page,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack.Navigator
      initialRouteName={
        hasLanguage ? 'Home' : 'Language'
      }
    >
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: t('language.title') }}
      />

      {/* CHỨC NĂNG: đặt tên dịch cho route cha dù header của nó bị ẩn.
    XỬ LÝ: màn con có thể dùng tiêu đề này làm nhãn quay lại,
    thay vì hiển thị tên kỹ thuật "Home". */}
      <Stack.Screen
        name="Home"
        component={MainTabs}
        options={{
          headerShown: false,
          title: t('tabs.explore'),
        }}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: t('detail.title') }}
      />

      <Stack.Screen
        name="AddPlace"
        component={AddPlaceScreen}
        options={{ title: t('home.addPlace') }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings.title') }}
      />
    </Stack.Navigator>
  )
}