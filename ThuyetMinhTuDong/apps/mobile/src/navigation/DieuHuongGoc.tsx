/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình header/liên kết.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/App.tsx
 *
 * PHỤ THUỘC:
 * - ../shared/GiaoDienChung
 * - ../features/presence/hooks/useBaoPhienHoatDong
 * - ../features/journey/hooks/useDieuHuongHanhTrinh
 * - ../features/explore/screens/ManKetQuaTimKiem
 * - ../features/journey/components/TrinhNgheThuyetMinh
 * - ../features/journey/screens/ManHanhTrinh
 * - ./ThanhDieuHuongDuKhach
 * - ../features/place-detail/screens/ManChiTietDiTich
 * - ./LienKetMoUngDung
 * - ./KieuDieuHuongDuKhach
 * - react-native
 * - @react-navigation/native
 * - @react-navigation/native-stack
 * - ../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. openSuggested
 * 2. RootNavigator
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { colors } from '../shared/GiaoDienChung'

import { usePresenceHeartbeat } from '../features/presence/hooks/useBaoPhienHoatDong'
import { useJourneyNavigation } from '../features/journey/hooks/useDieuHuongHanhTrinh'
import SearchResultScreen from '../features/explore/screens/ManKetQuaTimKiem'
import { JourneyPlayer } from '../features/journey/components/TrinhNgheThuyetMinh'
import { JourneyScreen } from '../features/journey/screens/ManHanhTrinh'
import MainTabs from './ThanhDieuHuongDuKhach'
import DetailScreen from '../features/place-detail/screens/ManChiTietDiTich'
import { linking } from './LienKetMoUngDung'
import type { VisitorStack } from './KieuDieuHuongDuKhach'
import { View } from 'react-native'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useText } from '../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.

const Stack = createNativeStackNavigator<VisitorStack>()
// CHỨC NĂNG: Giữ tham chiếu bộ điều hướng và mở chi tiết từ ID GPS gợi ý.
// XỬ LÝ: Chỉ navigate khi NavigationContainer đã sẵn sàng nhận điều hướng.

const navigationRef = createNavigationContainerRef<VisitorStack>()

const openSuggested = (id: string) => {
  if (navigationRef.isReady()) navigationRef.navigate('Detail', { placeId: id })
}
// TẠI SAO (openSuggested): Hook GPS không biết bộ điều hướng native; callback tách trách nhiệm
// và chỉ chuyển màn khi navigation đã sẵn sàng.
// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.

// ==================== [DIEU-HUONG] RootNavigator ====================
export default function RootNavigator() {
  const t = useText()

  usePresenceHeartbeat(true)

  useJourneyNavigation({ open: openSuggested })

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            headerBackTitle: t('explore'),
            headerTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerTitleStyle: { fontSize: 18, fontWeight: '600' },
            contentStyle: { backgroundColor: colors.page },
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
            component={SearchResultScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: t('details'),
              // Header không trong suốt để nội dung và nhóm ngôn ngữ không đi dưới thanh tiêu đề.
              headerTransparent: false,
            }}
          />

          <Stack.Screen name="Journey" component={JourneyScreen} options={{ title: t('jMap') }} />
        </Stack.Navigator>
        <JourneyPlayer />
      </View>
    </NavigationContainer>
  )
}
// TẠI SAO (RootNavigator): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất
// quán trong cùng ứng dụng.
