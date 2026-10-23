/**
 * FILE NÀY LÀM GÌ:
 * Ghép provider ngôn ngữ và điều hướng mobile UC01–UC05.
 *
 * Được dùng bởi:
 * - index.js.
 *
 * Phụ thuộc:
 * - Các màn hình trong src/visitor.
 * - Provider ngôn ngữ trong visitor-core/react.
 * - linking.ts để xử lý liên kết từ bên ngoài.
 *
 * Liên quan:
 * - UC01: ngôn ngữ.
 * - UC02–UC04: danh sách, tìm kiếm và chi tiết.
 * - UC05: truy cập bằng QR.
 */

import {
  ActivityIndicator,
} from 'react-native'

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context'

import {
  NavigationContainer,
} from '@react-navigation/native'

import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack'

import {
  getLocales,
} from 'expo-localization'

import {
  createVisitorI18n,
  useText,
  VisitorProvider,
} from '@travelguide/visitor-core/react'

import {
  storage,
} from './src/visitor/platform'

// CHỨC NĂNG: Nạp cấu hình nhận liên kết từ bên ngoài.
// XỬ LÝ: Chỉ import một lần để tránh lỗi trùng tên linking.
import {
  linking,
} from './src/visitor/linking'

import MainTabs from './src/visitor/MainTabs'
import PlacesScreen from './src/visitor/PlacesScreen'
import DetailScreen from './src/visitor/DetailScreen'
import ScanScreen from './src/visitor/ScanScreen'

import type {
  VisitorStack,
} from './src/visitor/types'

// CHỨC NĂNG: Khởi tạo hệ thống ngôn ngữ một lần.
// XỬ LÝ: Đặt ngoài component để không tạo lại khi giao diện render.
const boot = createVisitorI18n()

// CHỨC NĂNG: Đọc ngôn ngữ thiết bị.
// XỬ LÝ: Không đọc được thì truyền null để provider xử lý fallback.
const deviceLanguage =
  getLocales()[0]?.languageTag ?? null

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.
const Stack =
  createNativeStackNavigator<VisitorStack>()

// CHỨC NĂNG: Hiển thị màn danh sách ở chế độ tìm kiếm.
// XỬ LÝ: Khi tham số route thay đổi, key thay đổi để khởi tạo
// màn tìm kiếm với đúng từ khóa và danh mục mới.
function SearchResult({
  route,
}: NativeStackScreenProps<
  VisitorStack,
  'Search'
>) {
  return (
    <PlacesScreen
      key={JSON.stringify(route.params)}
      search
      initial={route.params}
    />
  )
}

// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.
function Navigator() {
  const t = useText()

  return (
    <NavigationContainer linking={linking}>
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
          options={{
            headerShown: false,
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

// CHỨC NĂNG: Cung cấp vùng an toàn và trạng thái ngôn ngữ cho toàn app.
// XỬ LÝ:
// - SafeAreaProvider hỗ trợ vùng tai thỏ và thanh điều hướng.
// - VisitorProvider đọc lựa chọn ngôn ngữ đã lưu.
// - Trong lúc khởi tạo, hiển thị vòng tròn tải.
// - Navigator nằm trong provider để lấy được ngôn ngữ hiện tại.
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