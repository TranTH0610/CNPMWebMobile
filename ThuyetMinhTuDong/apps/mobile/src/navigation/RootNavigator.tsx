/**
 * FILE NÀY LÀM GÌ
 * Ghép stack điều hướng du khách mobile, các tab, màn tìm kiếm, chi tiết và hành trình; cấu hình
 * header/liên kết.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/RootNavigator.tsx
 * DÙNG BỞI: apps/mobile/App.tsx.
 * PHỤ THUỘC: ../hooks/usePresenceHeartbeat; ../hooks/useJourneyNavigation;
 * ../screens/SearchResultScreen; ../components/JourneyPlayer; ../screens/JourneyScreen;
 * ./MainTabs; ../screens/DetailScreen; ./linking; ./types; react-native; @react-navigation/native;
 * @react-navigation/native-stack; ../i18n/index
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ '../hooks/usePresenceHeartbeat'.
import { usePresenceHeartbeat } from '../hooks/usePresenceHeartbeat'
// Nhập các thành phần từ '../hooks/useJourneyNavigation'.
import { useJourneyNavigation } from '../hooks/useJourneyNavigation'
// Nhập các thành phần từ '../screens/SearchResultScreen'.
import SearchResultScreen from '../screens/SearchResultScreen'
// Nhập các thành phần từ '../components/JourneyPlayer'.
import { JourneyPlayer } from '../components/JourneyPlayer'
// Nhập các thành phần từ '../screens/JourneyScreen'.
import { JourneyScreen } from '../screens/JourneyScreen'
// Nhập các thành phần từ './MainTabs'.
import MainTabs from './MainTabs'
// Nhập các thành phần từ '../screens/DetailScreen'.
import DetailScreen from '../screens/DetailScreen'
// Nhập các thành phần từ './linking'.
import { linking } from './linking'
// Nhập kiểu dữ liệu từ './types'.
import type { VisitorStack } from './types'
// Nhập các thành phần từ 'react-native'.
import { View } from 'react-native'
// Nhập các thành phần từ '@react-navigation/native'.
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
// Nhập các thành phần từ '@react-navigation/native-stack'.
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const Stack =`: Khai báo Stack: Gọi createNativeStackNavigator<VisitorStack>().
 * DÒNG `createNativeStackNavigator<VisitorStack>()`: Khai báo Stack: Gọi createNativeStackNavigator<VisitorStack>().
 */
const Stack =
  createNativeStackNavigator<VisitorStack>()
// CHỨC NĂNG: Giữ tham chiếu bộ điều hướng và mở chi tiết từ ID GPS gợi ý.
// XỬ LÝ: Chỉ navigate khi NavigationContainer đã sẵn sàng nhận điều hướng.
// Khai báo navigationRef: Gọi createNavigationContainerRef<VisitorStack>().
const navigationRef = createNavigationContainerRef<VisitorStack>()
// Khai báo openSuggested: khai báo callback (id: string) => { if (navigationRef.isReady()) navigationRef.navigate('Deta. | Rẽ nhánh nếu navigationRef.isReady(). | Thực hiện Gọi navigationRef.navigate('Detail', { placeId: id }). | Gán thuộc tính placeId: sử dụng id làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
const openSuggested = (id: string) => { if (navigationRef.isReady()) navigationRef.navigate('Detail', { placeId: id }) }
// TẠI SAO (openSuggested): Hook GPS không biết bộ điều hướng native; callback tách trách nhiệm
// và chỉ chuyển màn khi navigation đã sẵn sàng.
// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.
// Khai báo RootNavigator(). Component hàm nhận props và dựng phần giao diện RootNavigator.
export default function RootNavigator() {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Thực hiện Gọi usePresenceHeartbeat(true).
  usePresenceHeartbeat(true)
  // Thực hiện Gọi useJourneyNavigation({ open: openSuggested }). | Gán thuộc tính open: sử dụng openSuggested làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  useJourneyNavigation({ open: openSuggested })

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<NavigationContainer linking={linking} ref={navigationRef}>`: Dựng NavigationContainer. | Thuộc tính linking: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước.
   * DÒNG `<View style={{ flex: 1 }}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1.
   * DÒNG `<Stack.Navigator`: Dựng Stack.Navigator.
   * DÒNG `screenOptions={{`: Thuộc tính screenOptions: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `headerBackTitle: t('explore'),`: Gán thuộc tính headerBackTitle: Gọi t('explore').
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng Stack.Navigator.
   * DÒNG `<Stack.Screen`: Dựng Stack.Screen.
   * DÒNG `name="Places"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `component={MainTabs}`: Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `options={{`: Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `title: t('explore'),`: Gán thuộc tính title: Gọi t('explore').
   * DÒNG `headerShown: false,`: Gán thuộc tính headerShown: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Stack.Screen.
   * DÒNG `<Stack.Screen`: Dựng Stack.Screen.
   * DÒNG `name="Search"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `component={SearchResultScreen}`: Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `options={{`: Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `headerShown: false,`: Gán thuộc tính headerShown: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Stack.Screen.
   * DÒNG `<Stack.Screen`: Dựng Stack.Screen.
   * DÒNG `name="Detail"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `component={DetailScreen}`: Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `options={{`: Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `title: t('details'),`: Gán thuộc tính title: Gọi t('details').
   * DÒNG `headerTransparent: false,`: Gán thuộc tính headerTransparent: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Stack.Screen.
   * DÒNG `<Stack.Screen name="Journey" component={JourneyScreen} options={{ title: t('jMap') }}`: Dựng Stack.Screen. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính title: Gọi t('jMap').
   * DÒNG `</Stack.Navigator>`: Đóng phần giao diện Stack.Navigator.
   * DÒNG `<JourneyPlayer />`: Dựng JourneyPlayer.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</NavigationContainer>`: Đóng phần giao diện NavigationContainer.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1 }}>
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
