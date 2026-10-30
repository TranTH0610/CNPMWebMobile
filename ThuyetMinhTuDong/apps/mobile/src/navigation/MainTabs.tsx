/**
 * FILE NÀY LÀM GÌ
 * Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/MainTabs.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: ../screens/HomeScreen; ../screens/SettingsScreen; ../screens/JourneyScreen;
 * @react-navigation/bottom-tabs; @expo/vector-icons; ../i18n/index; ../components/index
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ '../screens/HomeScreen'.
import HomeScreen from '../screens/HomeScreen'
// Nhập các thành phần từ '../screens/SettingsScreen'.
import SettingsScreen from '../screens/SettingsScreen'
// Nhập các thành phần từ '../screens/JourneyScreen'.
import { JourneyScreen } from '../screens/JourneyScreen'
// Nhập các thành phần từ '@react-navigation/bottom-tabs'.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../components/index'.
import { colors } from '../components/index'

// Khai báo Tabs: Gọi createBottomTabNavigator().
const Tabs = createBottomTabNavigator()
// CHỨC NĂNG: Đăng ký label được dịch cho các tab.
// XỬ LÝ: i18n đổi thì options được render lại.
// Khai báo MainTabs(). Component hàm nhận props và dựng phần giao diện MainTabs.
export default function MainTabs() {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Tabs.Navigator`: Dựng Tabs.Navigator.
   * DÒNG `screenOptions={{`: Thuộc tính screenOptions: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `headerShown: false,`: Gán thuộc tính headerShown: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `tabBarActiveTintColor: colors.primary,`: Gán thuộc tính tabBarActiveTintColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `tabBarInactiveTintColor: colors.muted,`: Gán thuộc tính tabBarInactiveTintColor: đọc colors.muted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `tabBarStyle: {`: Gán thuộc tính tabBarStyle: tạo object gồm borderTopColor.
   * DÒNG `borderTopColor: colors.border,`: Gán thuộc tính borderTopColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng Tabs.Navigator.
   * DÒNG `<Tabs.Screen`: Dựng Tabs.Screen.
   * DÒNG `name="Explore"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `component={HomeScreen}`: Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `options={{`: Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `tabBarLabel: t('explore'),`: Gán thuộc tính tabBarLabel: Gọi t('explore').
   * DÒNG `tabBarIcon: ({ color, size }) => (`: Gán thuộc tính tabBarIcon: khai báo callback ({ color, size }) => ( <Ionicons name="compass-outline" color={color} size=.
   * DÒNG `<Ionicons name="compass-outline" color={color} size={size} />`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Tabs.Screen.
   * DÒNG `<Tabs.Screen`: Dựng Tabs.Screen.
   * DÒNG `name="Map"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `component={JourneyScreen}`: Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `options={{`: Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `tabBarLabel: t('map'),`: Gán thuộc tính tabBarLabel: Gọi t('map').
   * DÒNG `tabBarIcon: ({ color, size }) => (`: Gán thuộc tính tabBarIcon: khai báo callback ({ color, size }) => ( <Ionicons name="map-outline" color={color} size={siz.
   * DÒNG `<Ionicons name="map-outline" color={color} size={size} />`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Tabs.Screen.
   * DÒNG `<Tabs.Screen`: Dựng Tabs.Screen.
   * DÒNG `name="Settings"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `component={SettingsScreen}`: Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `options={{`: Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `tabBarLabel: t('settings'),`: Gán thuộc tính tabBarLabel: Gọi t('settings').
   * DÒNG `tabBarIcon: ({ color, size }) => (`: Gán thuộc tính tabBarIcon: khai báo callback ({ color, size }) => ( <Ionicons name="settings-outline" color={color} size.
   * DÒNG `<Ionicons name="settings-outline" color={color} size={size} />`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Tabs.Screen.
   * DÒNG `</Tabs.Navigator>`: Đóng phần giao diện Tabs.Navigator.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
        component={HomeScreen}
        options={{
          tabBarLabel: t('explore'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        component={JourneyScreen}
        options={{
          tabBarLabel: t('map'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen}
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
// TẠI SAO (MainTabs): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất quán
// trong cùng ứng dụng.
