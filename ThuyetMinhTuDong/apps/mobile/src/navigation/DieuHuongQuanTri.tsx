/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài và kiểm duyệt.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/UngDungQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - @react-navigation/native-stack
 * - @travelguide/admin-core/react
 * - ../features/journey/hooks/useHanhTrinh
 * - ../shared/GiaoDienChung
 * - ./KieuDieuHuongQuanTri
 * - ../features/admin/dashboard/ManTongQuan
 * - ../features/admin/places/ManDanhSachDiTich
 * - ../features/admin/places/ManThemSuaDiTich
 * - ../features/admin/content/ManBienTapNoiDung
 * - ../features/admin/reviews/ManChiTietKiemDuyet
 * - ../features/admin/reviews/ManDanhSachKiemDuyet
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminNavigator
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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

// ==================== [DIEU-HUONG] AdminNavigator ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
