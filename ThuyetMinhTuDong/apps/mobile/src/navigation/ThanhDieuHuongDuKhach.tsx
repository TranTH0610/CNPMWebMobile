/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * PHỤ THUỘC:
 * - ../features/explore/screens/ManKhamPha
 * - ../features/settings/screens/ManCaiDat
 * - ../features/journey/screens/ManHanhTrinh
 * - @react-navigation/bottom-tabs
 * - @expo/vector-icons
 * - ../features/language/i18n/CauHinhNgonNgu
 * - ../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. MainTabs
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import HomeScreen from '../features/explore/screens/ManKhamPha'
import SettingsScreen from '../features/settings/screens/ManCaiDat'
import { JourneyScreen } from '../features/journey/screens/ManHanhTrinh'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useText } from '../features/language/i18n/CauHinhNgonNgu'
import { colors } from '../shared/GiaoDienChung'

const Tabs = createBottomTabNavigator()
// CHỨC NĂNG: Đăng ký label được dịch cho các tab.
// XỬ LÝ: i18n đổi thì options được render lại.

// ==================== [DIEU-HUONG] MainTabs ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function MainTabs() {
  const t = useText()

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', paddingBottom: 4 },
        tabBarActiveBackgroundColor: colors.soft,
        tabBarItemStyle: { borderRadius: 14, marginHorizontal: 4, marginVertical: 3 },
        tabBarStyle: {
          backgroundColor: colors.background,
          paddingTop: 4,
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
