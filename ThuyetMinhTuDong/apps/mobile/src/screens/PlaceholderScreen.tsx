/**
 * FILE NÀY LÀM GÌ:
 * Màn tạm cho Bản đồ, Yêu thích và Cài đặt.
 * MainTabs dùng; phụ thuộc route tab, i18n và theme.
 * Cài đặt cũ vẫn mở được để giữ luồng đổi ngôn ngữ.
 */

import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs'

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import type {
  MainTabParamList,
  RootStackParamList,
} from '../navigation/types'

import { spacing, ui } from '../theme'

type Props = BottomTabScreenProps<
  MainTabParamList,
  'Map' | 'Favorites' | 'Preferences'
>

export default function PlaceholderScreen({
  route,
  navigation,
}: Props) {
  const { t } = useTranslation()

  const key = {
    Map: 'map',
    Favorites: 'favorites',
    Preferences: 'settings',
  }[route.name]

  return (
    <SafeAreaView style={ui.page}>
      <View style={ui.state}>
        <Text style={ui.title}>
          {t(`tabs.${key}`)}
        </Text>

        <Text
          style={[
            ui.muted,
            {
              marginVertical: spacing.xl,
              textAlign: 'center',
            },
          ]}
        >
          {t('explore.placeholder')}
        </Text>

        {route.name === 'Preferences' && (
          <Pressable
            style={ui.button}
            onPress={() => {
              // CHỨC NĂNG: mở SettingsScreen hiện có ở stack cha.
              // XỬ LÝ: dùng type cụ thể, không ép navigation thành any.
              navigation
                .getParent<
                  NativeStackNavigationProp<RootStackParamList>
                >()
                ?.navigate('Settings')
            }}
          >
            <Text style={ui.buttonText}>
              {t('explore.openSettings')}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  )
}