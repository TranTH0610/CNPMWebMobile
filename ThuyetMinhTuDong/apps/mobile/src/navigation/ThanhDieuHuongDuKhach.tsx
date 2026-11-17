/**
 * FILE: apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 * FILE NÀY LÀM GÌ: Thanh tab mobile du khách cho Khám phá, Bản đồ và Cài đặt; nhãn tab dùng ngôn ngữ hiện tại.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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

// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] MainTabs — Đăng ký label được dịch cho các tab.
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
