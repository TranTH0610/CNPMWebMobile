/**
 * FILE: apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 * FILE NÀY LÀM GÌ: Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAdminText } from '@travelguide/admin-core/react'
import { useJourney } from '../features/journey/hooks/useHanhTrinh'
import { colors } from '../shared/GiaoDienChung'
import type { AdminStack } from './KieuDieuHuongQuanTri'
import { DashboardScreen } from '../features/admin/dashboard/ManTongQuan'
import { AdminPlacesScreen } from '../features/admin/places/ManDanhSachDiTich'
import { PlaceFormScreen } from '../features/admin/places/ManThemSuaDiTich'
import { ContentEditorScreen } from '../features/admin/content/ManBienTapNoiDung'
import { ReviewDetailScreen } from '../features/admin/reviews/ManChiTietKiemDuyet'
import { ReviewsScreen } from '../features/admin/reviews/ManDanhSachKiemDuyet'

const Stack = createNativeStackNavigator<AdminStack>()
// CHỨC NĂNG: Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan,
// form, bài và kiểm duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminNavigator — Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan,
export function AdminNavigator() {
  const t = useAdminText(),
    { engine } = useJourney()
  useEffect(() => {
    engine.pause()
  }, [engine])
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: false,
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 18, fontWeight: '700' },
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.page },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: t('admin') }} />
      <Stack.Screen
        name="AdminPlaces"
        component={AdminPlacesScreen}
        options={{ title: t('places') }}
      />
      <Stack.Screen name="PlaceForm" component={PlaceFormScreen} options={{ title: t('edit') }} />
      <Stack.Screen
        name="Content"
        component={ContentEditorScreen}
        options={{ title: t('content') }}
      />
      <Stack.Screen
        name="ReviewDetail"
        component={ReviewDetailScreen}
        options={{ title: t('viewReview') }}
      />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: t('reviews') }} />
    </Stack.Navigator>
  )
}
// TẠI SAO (AdminNavigator): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất
// quán trong cùng ứng dụng.
/* CÁCH KIỂM TRA: start:admin mở quản lý; bản du khách không có route Admin. */
