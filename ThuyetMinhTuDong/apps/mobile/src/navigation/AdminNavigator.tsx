/** FILE NÀY LÀM GÌ: Stack Admin native không đăng nhập, tách khỏi các màn visitor.
 * AdminApp đăng ký; UC12–UC17. Dùng danh tính demo và service chung.
 * Không tạo NavigationContainer thứ hai; header dùng cùng token màu du khách. */
import { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAdminText } from '@travelguide/admin-core/react'
import { useJourney } from '../hooks/useJourney'
import { colors } from '../theme'
import type { AdminStack } from './adminTypes'
import { DashboardScreen } from '../screens/admin/DashboardScreen'
import { AdminPlacesScreen } from '../screens/admin/PlacesScreen'
import { PlaceFormScreen } from '../screens/admin/PlaceFormScreen'
import { ContentEditorScreen } from '../screens/admin/ContentEditorScreen'
import { ReviewsScreen } from '../screens/admin/ReviewsScreen'
const Stack=createNativeStackNavigator<AdminStack>()
export function AdminNavigator(){const t=useAdminText(),{engine}=useJourney();useEffect(()=>{engine.pause()},[engine]);return <Stack.Navigator screenOptions={{headerShadowVisible:false,headerTitleStyle:{fontSize:18,fontWeight:'700'},headerTintColor:colors.primary,headerStyle:{backgroundColor:colors.background},contentStyle:{backgroundColor:colors.page}}}>
 <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title:t('admin')}}/>
 <Stack.Screen name="AdminPlaces" component={AdminPlacesScreen} options={{title:t('places')}}/>
 <Stack.Screen name="PlaceForm" component={PlaceFormScreen} options={{title:t('edit')}}/>
 <Stack.Screen name="Content" component={ContentEditorScreen} options={{title:t('content')}}/>
 <Stack.Screen name="Reviews" component={ReviewsScreen} options={{title:t('reviews')}}/>
 </Stack.Navigator>}
/* CÁCH KIỂM TRA: start:admin mở quản lý; bản du khách không có route Admin. */
