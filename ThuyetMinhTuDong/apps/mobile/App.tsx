/**
 * FILE NÀY LÀM GÌ:
 * Ghép provider ngôn ngữ và điều hướng mobile UC01–UC05.
 * index.js gọi; phụ thuộc các màn visitor.
 * Chưa ghép GPS tự mở hoặc TTS của luồng cũ.
 */

import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'

import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack'

import { getLocales } from 'expo-localization'

import {
  createVisitorI18n,
  useText,
  VisitorProvider,
} from '@travelguide/visitor-core/react'

import { storage } from './src/visitor/platform'
import MainTabs from './src/visitor/MainTabs'
import PlacesScreen from './src/visitor/PlacesScreen'
import DetailScreen from './src/visitor/DetailScreen'
import ScanScreen from './src/visitor/ScanScreen'
import type { VisitorStack } from './src/visitor/types'

// CHỨC NĂNG: Khởi tạo một instance cho cả luồng.
// XỬ LÝ: Đặt ngoài component để không tạo lại mỗi lần render.
const boot = createVisitorI18n()
const deviceLanguage = getLocales()[0]?.languageTag ?? null
const Stack = createNativeStackNavigator<VisitorStack>()

// CHỨC NĂNG: Dùng lại màn danh sách ở chế độ tìm kiếm.
// XỬ LÝ: key đổi khi route params đổi để khởi tạo đúng điều kiện.
function SearchResult({
  route,
}: NativeStackScreenProps<VisitorStack, 'Search'>) {
  return (
    <PlacesScreen
      key={JSON.stringify(route.params)}
      search
      initial={route.params}
    />
  )
}

function Navigator() {
  const t = useText()

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: t('explore'),
        }}
      >
        <Stack.Screen
          name="Places"
          component={MainTabs}
          options={{
            title: t('explore'),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={SearchResult}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: t('details') }}
        />

        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: t('scan') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// CHỨC NĂNG: Đọc ngôn ngữ trước khi hiển thị màn hình.
// XỬ LÝ: Không thêm NavigationContainer thứ hai ngoài component này.
export default function App() {
  return (
    <SafeAreaProvider>
      <VisitorProvider
        boot={boot}
        storage={storage}
        deviceLanguage={deviceLanguage}
        loading={<ActivityIndicator />}
      >
        <Navigator />
      </VisitorProvider>
    </SafeAreaProvider>
  )
}