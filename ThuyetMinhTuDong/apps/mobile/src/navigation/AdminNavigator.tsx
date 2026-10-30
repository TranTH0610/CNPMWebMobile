/**
 * FILE NÀY LÀM GÌ
 * Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan, form, bài
 * và kiểm duyệt.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/AdminNavigator.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/AdminApp.tsx.
 * PHỤ THUỘC: react; @react-navigation/native-stack; @travelguide/admin-core/react;
 * ../hooks/useJourney; ../theme; ./adminTypes; ../screens/admin/DashboardScreen;
 * ../screens/admin/PlacesScreen; ../screens/admin/PlaceFormScreen;
 * ../screens/admin/ContentEditorScreen; ../screens/admin/ReviewsScreen
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ '@react-navigation/native-stack'.
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ '../theme'.
import { colors } from '../theme'
// Nhập kiểu dữ liệu từ './adminTypes'.
import type { AdminStack } from './adminTypes'
// Nhập các thành phần từ '../screens/admin/DashboardScreen'.
import { DashboardScreen } from '../screens/admin/DashboardScreen'
// Nhập các thành phần từ '../screens/admin/PlacesScreen'.
import { AdminPlacesScreen } from '../screens/admin/PlacesScreen'
// Nhập các thành phần từ '../screens/admin/PlaceFormScreen'.
import { PlaceFormScreen } from '../screens/admin/PlaceFormScreen'
// Nhập các thành phần từ '../screens/admin/ContentEditorScreen'.
import { ContentEditorScreen } from '../screens/admin/ContentEditorScreen'
// Nhập các thành phần từ '../screens/admin/ReviewsScreen'.
import { ReviewsScreen } from '../screens/admin/ReviewsScreen'
// Khai báo Stack: Gọi createNativeStackNavigator<AdminStack>().
const Stack=createNativeStackNavigator<AdminStack>()
// CHỨC NĂNG: Đăng ký các màn stack admin mobile và tiêu đề tương ứng để điều hướng giữa tổng quan,
// form, bài và kiểm duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function AdminNavigator(){const t=useAdminText(),{engine}=useJourney();useEffe`: Khai báo AdminNavigator(). Component hàm nhận props và dựng phần giao diện AdminNavigator. | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo {engine}: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình. | Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại. | Trả cây giao diện của component để React hiển thị. | Thuộc tính screenOptions: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính headerTransparent: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính headerShadowVisible: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính headerTitleStyle: tạo object gồm fontSize, fontWeight. | Gán thuộc tính fontSize: giá trị số 18. | Gán thuộc tính fontWeight: chuỗi '700'. | Gán thuộc tính headerTintColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính headerStyle: tạo object gồm backgroundColor. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính contentStyle: tạo object gồm backgroundColor. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 * DÒNG `<Stack.Screen name="Dashboard" component={DashboardScreen} options={{title:t('admin')`: Dựng Stack.Screen. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính title: Gọi t('admin').
 * DÒNG `<Stack.Screen name="AdminPlaces" component={AdminPlacesScreen} options={{title:t('pla`: Dựng Stack.Screen. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính title: Gọi t('places').
 * DÒNG `<Stack.Screen name="PlaceForm" component={PlaceFormScreen} options={{title:t('edit')}`: Dựng Stack.Screen. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính title: Gọi t('edit').
 * DÒNG `<Stack.Screen name="Content" component={ContentEditorScreen} options={{title:t('conte`: Dựng Stack.Screen. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính title: Gọi t('content').
 * DÒNG `<Stack.Screen name="Reviews" component={ReviewsScreen} options={{title:t('reviews')}}`: Dựng Stack.Screen. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính component: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính options: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính title: Gọi t('reviews').
 * DÒNG `</Stack.Navigator>}`: Đóng phần giao diện Stack.Navigator.
 */
export function AdminNavigator(){const t=useAdminText(),{engine}=useJourney();useEffect(()=>{engine.pause()},[engine]);return <Stack.Navigator screenOptions={{headerTransparent:false,headerShadowVisible:false,headerTitleStyle:{fontSize:18,fontWeight:'700'},headerTintColor:colors.primary,headerStyle:{backgroundColor:colors.background},contentStyle:{backgroundColor:colors.page}}}>
 <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title:t('admin')}}/>
 <Stack.Screen name="AdminPlaces" component={AdminPlacesScreen} options={{title:t('places')}}/>
 <Stack.Screen name="PlaceForm" component={PlaceFormScreen} options={{title:t('edit')}}/>
 <Stack.Screen name="Content" component={ContentEditorScreen} options={{title:t('content')}}/>
 <Stack.Screen name="Reviews" component={ReviewsScreen} options={{title:t('reviews')}}/>
 </Stack.Navigator>}
// TẠI SAO (AdminNavigator): Danh sách route/tab tập trung giúp tên màn, tham số và tiêu đề nhất
// quán trong cùng ứng dụng.
/* CÁCH KIỂM TRA: start:admin mở quản lý; bản du khách không có route Admin. */
