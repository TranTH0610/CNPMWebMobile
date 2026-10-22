/**
 * FILE NÀY LÀM GÌ:
 * Tạo thanh tab theo mockup.
 * App đăng ký; phụ thuộc bottom-tabs, PlacesScreen và UI.
 * Khám phá hoàn chỉnh; Cài đặt phục vụ UC01.
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View } from 'react-native'

import { useText } from '@travelguide/visitor-core/react'
import PlacesScreen from './PlacesScreen'
import { colors, LanguageBar, ui } from './ui'

const Tabs = createBottomTabNavigator()

// CHỨC NĂNG: Thông báo chức năng làm sau.
// XỬ LÝ: Không tạo nghiệp vụ bản đồ/yêu thích giả.
function Placeholder() {
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

// CHỨC NĂNG: Cho đổi ngôn ngữ.
// XỬ LÝ: Cùng provider với tiêu đề, danh sách và bài đọc.
function Settings() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <View style={ui.content}>
        <Text style={ui.title}>{t('settings')}</Text>
        <LanguageBar />
        <Text style={ui.muted}>{t('noAccount')}</Text>
      </View>
    </SafeAreaView>
  )
}

function Explore() {
  return <PlacesScreen />
}

// CHỨC NĂNG: Đăng ký label được dịch cho các tab.
// XỬ LÝ: i18n đổi thì options được render lại.
export default function MainTabs() {
  const t = useText()

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarLabel: t('explore'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        component={Placeholder}
        options={{
          tabBarLabel: t('map'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={Placeholder}
        options={{
          tabBarLabel: t('favorites'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: t('settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  )
}