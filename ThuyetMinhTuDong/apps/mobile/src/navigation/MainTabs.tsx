/**
 * FILE NÀY LÀM GÌ:
 * Tạo bottom tab và stack riêng cho Khám phá/Search.
 * RootNavigator dùng; phụ thuộc navigation v6, provider và các màn M3.
 * Liên quan UC03; ba tab ngoài phạm vi dùng placeholder.
 */

import type { ComponentProps } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import type {
  ExploreStackParamList,
  MainTabParamList,
} from './types'

import HomeScreen from '../screens/HomeScreen'
import SearchResultScreen from '../screens/SearchResultScreen'
import PlaceholderScreen from '../screens/PlaceholderScreen'

import { PlacesProvider } from '../hooks/usePlaces'
import { colors } from '../theme'

const Tabs =
  createBottomTabNavigator<MainTabParamList>()

const ExploreStack =
  createNativeStackNavigator<ExploreStackParamList>()

type IconName =
  ComponentProps<typeof Ionicons>['name']

const icons: Record<keyof MainTabParamList, IconName> = {
  Explore: 'compass-outline',
  Map: 'map-outline',
  Favorites: 'heart-outline',
  Preferences: 'settings-outline',
}

// CHỨC NĂNG: Search nằm trong tab Khám phá.
// XỬ LÝ: mở Search không làm bottom tab biến mất.
function ExploreNavigator() {
  return (
    <ExploreStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <ExploreStack.Screen
        name="ExploreHome"
        component={HomeScreen}
      />
      <ExploreStack.Screen
        name="SearchResults"
        component={SearchResultScreen}
      />
    </ExploreStack.Navigator>
  )
}

export default function MainTabs() {
  const { t } = useTranslation()

  return (
    <PlacesProvider>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={icons[route.name]}
              color={color}
              size={size}
            />
          ),
        })}
      >
        <Tabs.Screen
          name="Explore"
          component={ExploreNavigator}
          options={{ title: t('tabs.explore') }}
        />
        <Tabs.Screen
          name="Map"
          component={PlaceholderScreen}
          options={{ title: t('tabs.map') }}
        />
        <Tabs.Screen
          name="Favorites"
          component={PlaceholderScreen}
          options={{ title: t('tabs.favorites') }}
        />
        <Tabs.Screen
          name="Preferences"
          component={PlaceholderScreen}
          options={{ title: t('tabs.settings') }}
        />
      </Tabs.Navigator>
    </PlacesProvider>
  )
}