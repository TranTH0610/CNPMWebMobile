/**
 * FILE NÀY LÀM GÌ:
 * Ghép provider ngôn ngữ và navigator cho mobile UC01–UC05.
 * index.js của Expo gọi file này.
 * Phụ thuộc visitor-core, adapter mobile và ba màn visitor.
 *
 * Entry này chưa ghép tab/GPS tự mở/TTS của luồng cũ.
 */

import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import {
  NavigationContainer,
} from '@react-navigation/native'

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

import { getLocales } from 'expo-localization'

import {
  VisitorProvider,
  createVisitorI18n,
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

import { storage } from './src/visitor/platform'
import PlacesScreen from './src/visitor/PlacesScreen'
import DetailScreen from './src/visitor/DetailScreen'
import ScanScreen from './src/visitor/ScanScreen'
import type { VisitorStack } from './src/visitor/types'

// CHỨC NĂNG: Tạo instance ngoài component.
// XỬ LÝ: Không khởi tạo lại mỗi lần App render.
const boot = createVisitorI18n()

const deviceLanguage =
  getLocales()[0]?.languageTag ?? null

const Stack = createNativeStackNavigator<VisitorStack>()

// CHỨC NĂNG: Đăng ký màn hình và tiêu đề theo ngôn ngữ.
// XỬ LÝ: Hook nằm trong provider nên đổi ngôn ngữ sẽ cập nhật header.
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
          component={PlacesScreen}
          options={{
            title: t('brand'),
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: t('details'),
          }}
        />

        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            title: t('scan'),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// CHỨC NĂNG: Bọc vùng an toàn và trạng thái ngôn ngữ.
// XỬ LÝ: Chờ đọc lựa chọn đã lưu trước khi hiện navigator.
// Không thêm NavigationContainer thứ hai bao bên ngoài App này.
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