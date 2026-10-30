/**
 * FILE NÀY LÀM GÌ
 * Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút
 * hành động.
 *
 * VỊ TRÍ: apps/mobile/src/components/admin/AdminUI.tsx
 * DÙNG BỞI: apps/mobile/src/components/admin/LocalMediaPicker.tsx;
 * apps/mobile/src/screens/admin/ContentEditorScreen.tsx;
 * apps/mobile/src/screens/admin/DashboardScreen.tsx; và các nơi import khác.
 * PHỤ THUỘC: react; react-native; react-native-safe-area-context; @expo/vector-icons;
 * @react-navigation/native; @react-navigation/elements; @travelguide/admin-core/react;
 * @travelguide/admin-core; @travelguide/visitor-core; ../Action; ../../theme; ./AudioPreview
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
// Nhập các thành phần từ 'react-native'.
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '@react-navigation/native'.
import { useNavigation } from '@react-navigation/native'
// Nhập các thành phần từ '@react-navigation/elements'.
import { useHeaderHeight } from '@react-navigation/elements'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES, type Language } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../Action'.
import { Action } from '../Action'
// Nhập các thành phần từ '../../theme'.
import { colors, spacing } from '../../theme'

// Đặt tên kiểu IconName.
type IconName = ComponentProps<typeof Ionicons>['name']
// CHỨC NĂNG: Tập trung style Admin, không sửa style của app du khách.
// XỬ LÝ: Dùng token chung; bố cục mềm và chữ có thể xuống dòng khi dịch dài.
// Khai báo styles: Gọi StyleSheet.create({ page:{flex:1,backgroundColor:colors.page}, content:{flexGrow:1,padding.
export const styles = StyleSheet.create({
 // Gán thuộc tính page: tạo object gồm flex, backgroundColor. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính content: tạo object gồm flexGrow, padding, gap, paddingBottom. | Gán thuộc tính flexGrow: giá trị số 1. | Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: giá trị số 20. | Gán thuộc tính paddingBottom: giá trị số 32.
 page:{flex:1,backgroundColor:colors.page}, content:{flexGrow:1,padding:spacing.lg,gap:20,paddingBottom:32},
 // Gán thuộc tính card: tạo object gồm padding, backgroundColor, borderRadius, borderWidth, borderColor, gap. | Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 20. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: giá trị số 12.
 card:{padding:spacing.lg,backgroundColor:colors.background,borderRadius:20,borderWidth:1,borderColor:colors.border,gap:12},
 // Gán thuộc tính title: tạo object gồm fontSize, lineHeight, fontWeight, color, letterSpacing. | Gán thuộc tính fontSize: giá trị số 26. | Gán thuộc tính lineHeight: giá trị số 34. | Gán thuộc tính fontWeight: chuỗi '700'. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính letterSpacing: sử dụng -0.5 làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 title:{fontSize:26,lineHeight:34,fontWeight:'700',color:colors.text,letterSpacing:-0.5},
 // Gán thuộc tính heading: tạo object gồm fontSize, lineHeight, fontWeight, color. | Gán thuộc tính fontSize: giá trị số 18. | Gán thuộc tính lineHeight: giá trị số 26. | Gán thuộc tính fontWeight: chuỗi '700'. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 heading:{fontSize:18,lineHeight:26,fontWeight:'700',color:colors.text},
 // Gán thuộc tính label: tạo object gồm fontSize, lineHeight, fontWeight, color. | Gán thuộc tính fontSize: giá trị số 13. | Gán thuộc tính lineHeight: giá trị số 20. | Gán thuộc tính fontWeight: chuỗi '600'. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 label:{fontSize:13,lineHeight:20,fontWeight:'600',color:colors.text},
 // Gán thuộc tính text: tạo object gồm fontSize, lineHeight, color. | Gán thuộc tính fontSize: giá trị số 14. | Gán thuộc tính lineHeight: giá trị số 22. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính muted: tạo object gồm fontSize, lineHeight, color. | Gán thuộc tính fontSize: giá trị số 12. | Gán thuộc tính lineHeight: giá trị số 19. | Gán thuộc tính color: đọc colors.muted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 text:{fontSize:14,lineHeight:22,color:colors.text}, muted:{fontSize:12,lineHeight:19,color:colors.muted},
 // Gán thuộc tính notice: tạo object gồm padding, borderRadius, backgroundColor, flexDirection, gap, alignItems. | Gán thuộc tính padding: giá trị số 12. | Gán thuộc tính borderRadius: giá trị số 14. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 8. | Gán thuộc tính alignItems: chuỗi 'flex-start'.
 notice:{padding:12,borderRadius:14,backgroundColor:colors.soft,flexDirection:'row',gap:8,alignItems:'flex-start'},
 // Gán thuộc tính error: tạo object gồm color, fontSize, lineHeight. | Gán thuộc tính color: đọc colors.danger từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 13. | Gán thuộc tính lineHeight: giá trị số 21.
 error:{color:colors.danger,fontSize:13,lineHeight:21},
 // Gán thuộc tính feedback: tạo object gồm padding, borderRadius, backgroundColor, borderWidth, borderColor, gap. | Gán thuộc tính padding: giá trị số 12. | Gán thuộc tính borderRadius: giá trị số 14. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: giá trị số 10.
 feedback:{padding:12,borderRadius:14,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border,gap:10},
 // Gán thuộc tính row: tạo object gồm flexDirection, flexWrap, gap, alignItems. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính flexWrap: chuỗi 'wrap'. | Gán thuộc tính gap: giá trị số 10. | Gán thuộc tính alignItems: chuỗi 'center'.
 row:{flexDirection:'row',flexWrap:'wrap',gap:10,alignItems:'center'},
 // Gán thuộc tính input: tạo object gồm borderWidth, borderColor, borderRadius, paddingHorizontal, paddingVertical, color, backgroundColor, minHeight, fontSize. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 13. | Gán thuộc tính paddingHorizontal: giá trị số 14. | Gán thuộc tính paddingVertical: giá trị số 12. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính minHeight: giá trị số 48. | Gán thuộc tính fontSize: giá trị số 14. | Gán thuộc tính lineHeight: giá trị số 21.
 input:{borderWidth:1,borderColor:colors.border,borderRadius:13,paddingHorizontal:14,paddingVertical:12,color:colors.text,backgroundColor:colors.background,minHeight:48,fontSize:14,lineHeight:21},
 // Gán thuộc tính inputFocused: tạo object gồm borderColor, backgroundColor. | Gán thuộc tính borderColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 inputFocused:{borderColor:colors.primary,backgroundColor:colors.soft},
 // Gán thuộc tính number: tạo object gồm fontSize, fontWeight, lineHeight, color. | Gán thuộc tính fontSize: giá trị số 31. | Gán thuộc tính fontWeight: chuỗi '700'. | Gán thuộc tính lineHeight: giá trị số 42. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 number:{fontSize:31,fontWeight:'700',lineHeight:42,color:colors.text},
 // Gán thuộc tính metric: tạo object gồm width, flexGrow, padding, backgroundColor, borderRadius, borderWidth, borderColor, gap. | Gán thuộc tính width: chuỗi '47%'. | Gán thuộc tính flexGrow: giá trị số 1. | Gán thuộc tính padding: giá trị số 16. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 20. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: giá trị số 12.
 metric:{width:'47%',flexGrow:1,padding:16,backgroundColor:colors.background,borderRadius:20,borderWidth:1,borderColor:colors.border,gap:12},
 // Gán thuộc tính metricLabel: tạo object gồm fontSize, lineHeight, color, minHeight. | Gán thuộc tính fontSize: giá trị số 12. | Gán thuộc tính lineHeight: giá trị số 18. | Gán thuộc tính color: đọc colors.muted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính minHeight: giá trị số 36.
 metricLabel:{fontSize:12,lineHeight:18,color:colors.muted,minHeight:36},
 // Gán thuộc tính metricIcon: tạo object gồm width, height, borderRadius, backgroundColor, alignItems, justifyContent. | Gán thuộc tính width: giá trị số 34. | Gán thuộc tính height: giá trị số 34. | Gán thuộc tính borderRadius: giá trị số 11. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'.
 metricIcon:{width:34,height:34,borderRadius:11,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},
 // Gán thuộc tính badge: tạo object gồm alignSelf, paddingVertical, paddingHorizontal, backgroundColor, borderRadius, color, fontSize, fontWeight. | Gán thuộc tính alignSelf: chuỗi 'flex-start'. | Gán thuộc tính paddingVertical: giá trị số 5. | Gán thuộc tính paddingHorizontal: giá trị số 10. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 8. | Gán thuộc tính color: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 11. | Gán thuộc tính fontWeight: chuỗi '600'.
 badge:{alignSelf:'flex-start',paddingVertical:5,paddingHorizontal:10,backgroundColor:colors.soft,borderRadius:8,color:colors.primary,fontSize:11,fontWeight:'600'},
 // Gán thuộc tính hero: tạo object gồm backgroundColor, borderRadius, padding, gap. | Gán thuộc tính backgroundColor: đọc colors.playerBackground từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 24. | Gán thuộc tính padding: giá trị số 20. | Gán thuộc tính gap: giá trị số 12.
 hero:{backgroundColor:colors.playerBackground,borderRadius:24,padding:20,gap:12},
 // Gán thuộc tính brand: tạo object gồm fontSize, lineHeight, fontWeight, letterSpacing, color. | Gán thuộc tính fontSize: giá trị số 10. | Gán thuộc tính lineHeight: giá trị số 15. | Gán thuộc tính fontWeight: chuỗi '700'. | Gán thuộc tính letterSpacing: giá trị số 2. | Gán thuộc tính color: đọc colors.playerAccent từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 brand:{fontSize:10,lineHeight:15,fontWeight:'700',letterSpacing:2,color:colors.playerAccent},
 // Gán thuộc tính heroTitle: tạo object gồm fontSize, lineHeight, fontWeight, color. | Gán thuộc tính fontSize: giá trị số 27. | Gán thuộc tính lineHeight: giá trị số 35. | Gán thuộc tính fontWeight: chuỗi '700'. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 heroTitle:{fontSize:27,lineHeight:35,fontWeight:'700',color:colors.white},
 // Gán thuộc tính heroText: tạo object gồm fontSize, lineHeight, color. | Gán thuộc tính fontSize: giá trị số 12. | Gán thuộc tính lineHeight: giá trị số 20. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 heroText:{fontSize:12,lineHeight:20,color:colors.playerMuted},
 // Gán thuộc tính sectionHeading: tạo object gồm flexDirection, alignItems, gap. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 8.
 sectionHeading:{flexDirection:'row',alignItems:'center',gap:8},
 // Gán thuộc tính quickAction: tạo object gồm flexDirection, alignItems, gap, padding, backgroundColor, borderWidth, borderColor, borderRadius. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 12. | Gán thuộc tính padding: giá trị số 16. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 18.
 quickAction:{flexDirection:'row',alignItems:'center',gap:12,padding:16,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border,borderRadius:18},
 // Gán thuộc tính quickIcon: tạo object gồm width, height, borderRadius, backgroundColor, alignItems, justifyContent. | Gán thuộc tính width: giá trị số 46. | Gán thuộc tính height: giá trị số 46. | Gán thuộc tính borderRadius: giá trị số 14. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'.
 quickIcon:{width:46,height:46,borderRadius:14,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},
 // Gán thuộc tính languageChip: tạo object gồm minHeight, paddingHorizontal, justifyContent, borderWidth, borderColor, borderRadius, backgroundColor. | Gán thuộc tính minHeight: giá trị số 42. | Gán thuộc tính paddingHorizontal: giá trị số 14. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 12. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 languageChip:{minHeight:42,paddingHorizontal:14,justifyContent:'center',borderWidth:1,borderColor:colors.border,borderRadius:12,backgroundColor:colors.background},
 // Gán thuộc tính searchBox: tạo object gồm flexDirection, alignItems, gap, minHeight, borderWidth, borderColor, borderRadius, paddingHorizontal, backgroundColor. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 8. | Gán thuộc tính minHeight: giá trị số 50. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 15. | Gán thuộc tính paddingHorizontal: giá trị số 12. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 searchBox:{flexDirection:'row',alignItems:'center',gap:8,minHeight:50,borderWidth:1,borderColor:colors.border,borderRadius:15,paddingHorizontal:12,backgroundColor:colors.background},
 // Gán thuộc tính searchInput: tạo object gồm flex, minWidth, fontSize, color, paddingVertical. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 0. | Gán thuộc tính fontSize: giá trị số 14. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính paddingVertical: giá trị số 12.
 searchInput:{flex:1,minWidth:0,fontSize:14,color:colors.text,paddingVertical:12},
 // Gán thuộc tính listImage: tạo object gồm width, height, borderRadius, overflow, flexShrink. | Gán thuộc tính width: giá trị số 88. | Gán thuộc tính height: giá trị số 92. | Gán thuộc tính borderRadius: giá trị số 13. | Gán thuộc tính overflow: chuỗi 'hidden'. | Gán thuộc tính flexShrink: giá trị số 0.
 listImage:{width:88,height:92,borderRadius:13,overflow:'hidden',flexShrink:0},
 // Gán thuộc tính divider: tạo object gồm height, backgroundColor. | Gán thuộc tính height: giá trị số 1. | Gán thuộc tính backgroundColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 divider:{height:1,backgroundColor:colors.border},
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `pressed:{opacity:0.75},`: Gán thuộc tính pressed: tạo object gồm opacity. | Gán thuộc tính opacity: giá trị số 0.75.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 pressed:{opacity:0.75},
})
// CHỨC NĂNG: Tiêu đề từng màn và tiêu đề từng nhóm dùng cùng nhịp chữ/khoảng cách.
// Khai báo PageHeader({title,description}). Component hàm nhận props và dựng phần giao diện PageHeader. | Khai báo title, kiểu string. | Khai báo description không bắt buộc, kiểu string.
export function PageHeader({title,description}:{title:string;description?:string}) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={{gap:6}}><Text style={styles.title}>{title}</Text>{description&&<`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 6.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={{gap:6}}><Text style={styles.title}>{title}</Text>{description&&<Text style={styles.muted}>{description}</Text>}</View>
}
// TẠI SAO (PageHeader): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
// CHỨC NĂNG: Hiển thị tiêu đề của một nhóm nội dung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo SectionHeading({title,icon}). Component hàm nhận props và dựng phần giao diện SectionHeading. | Khai báo title, kiểu string. | Khai báo icon không bắt buộc, kiểu IconName.
export function SectionHeading({title,icon}:{title:string;icon?:IconName}) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={styles.sectionHeading}>{icon&&<Ionicons name={icon} size={18} col`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={styles.sectionHeading}>{icon&&<Ionicons name={icon} size={18} color={colors.primary}/>}<Text style={styles.heading}>{title}</Text></View>
}
// TẠI SAO (SectionHeading): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// CHỨC NĂNG: Hiển thị lối tắt đến một thao tác quản lý.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo QuickAction({title,description,icon,onPress}). Component hàm nhận props và dựng phần giao diện QuickAction. | Khai báo title, kiểu string. | Khai báo description, kiểu string. | Khai báo icon, kiểu IconName. | Khai báo onPress, kiểu ()=>void.
export function QuickAction({title,description,icon,onPress}:{title:string;description:string;icon:IconName;onPress:()=>void}) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPr`: Trả cây giao diện của component để React hiển thị. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={styles.quickIcon}><Ionicons name={icon} size={23} color={colors.primary}`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<View style={{flex:1,gap:3}}><Text style={styles.label}>{title}</Text><Text style={st`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính gap: giá trị số 3.
  * DÒNG `<Ionicons name="chevron-forward" size={18} color={colors.muted}/>`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({pressed})=>[styles.quickAction,pressed&&styles.pressed]}>
  <View style={styles.quickIcon}><Ionicons name={icon} size={23} color={colors.primary}/></View>
  <View style={{flex:1,gap:3}}><Text style={styles.label}>{title}</Text><Text style={styles.muted}>{description}</Text></View>
  <Ionicons name="chevron-forward" size={18} color={colors.muted}/>
 </Pressable>
}
// TẠI SAO (QuickAction): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// CHỨC NĂNG: Mỗi trạng thái có nhãn dịch và biểu tượng, không chỉ phân biệt bằng màu.
// Khai báo StatusBadge({workflow}). Component hàm nhận props và dựng phần giao diện StatusBadge. | Khai báo workflow, kiểu ManagedPlace['workflow']. Giữ bước nháp/gửi duyệt/công bố của bản quản trị tách khỏi nội dung đang công khai.
export function StatusBadge({workflow}:{workflow:ManagedPlace['workflow']}) {
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
 const t=useAdminText()
 // Khai báo icons: tạo object gồm draft, submitted, changes, approved, published, archived. | Gán thuộc tính draft: chuỗi 'create-outline'. | Gán thuộc tính submitted: chuỗi 'time-outline'. | Gán thuộc tính changes: chuỗi 'alert-circle-outline'. | Gán thuộc tính approved: chuỗi 'checkmark-circle-outline'. | Gán thuộc tính published: chuỗi 'globe-outline'. | Gán thuộc tính archived: chuỗi 'archive-outline'.
 const icons:Record<ManagedPlace['workflow'],IconName>={draft:'create-outline',submitted:'time-outline',changes:'alert-circle-outline',approved:'checkmark-circle-outline',published:'globe-outline',archived:'archive-outline'}
 // Khai báo color: chọn giữa hai giá trị theo điều kiện workflow==='changes'.
 const color=workflow==='changes'?colors.danger:workflow==='archived'?colors.muted:colors.primary
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={[styles.row,{alignSelf:'flex-start',gap:5,backgroundColor:colors.`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính alignSelf: chuỗi 'flex-start'. | Gán thuộc tính gap: giá trị số 5. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính paddingHorizontal: giá trị số 9. | Gán thuộc tính paddingVertical: giá trị số 5. | Gán thuộc tính borderRadius: giá trị số 9.
  * DÒNG `<Ionicons name={icons[workflow]} size={13} color={color}/><Text style={{fontSize:11,l`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính fontSize: giá trị số 11. | Gán thuộc tính lineHeight: giá trị số 16. | Gán thuộc tính fontWeight: chuỗi '600'. | Đặt trường color bằng giá trị của biến cùng tên.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={[styles.row,{alignSelf:'flex-start',gap:5,backgroundColor:colors.soft,paddingHorizontal:9,paddingVertical:5,borderRadius:9}]}>
  <Ionicons name={icons[workflow]} size={13} color={color}/><Text style={{fontSize:11,lineHeight:16,fontWeight:'600',color}}>{t(`status_${workflow}`)}</Text>
 </View>
}
// TẠI SAO (StatusBadge): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// CHỨC NĂNG: Hiển thị lựa chọn ngôn ngữ của form quản trị.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo LanguageTabs({value,onChange}). Component hàm nhận props và dựng phần giao diện LanguageTabs. | Khai báo value, kiểu Language. | Khai báo onChange, kiểu (language:Language)=>void.
export function LanguageTabs({value,onChange}:{value:Language;onChange:(language:Language)=>void}) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainer`: Trả cây giao diện của component để React hiển thị. | Thuộc tính horizontal: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính showsHorizontalScrollIndicator: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung. | Gán thuộc tính gap: giá trị số 8. | Gán thuộc tính paddingVertical: giá trị số 2.
  * DÒNG `{LANGUAGES.map(language=><Pressable key={language.code} accessibilityRole="button" ac`: Đưa biểu thức JavaScript LANGUAGES.map(language=><Pressable key={language.code} accessibilityRole="button" accessibilityLabel={language vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính selected: tính biểu thức value===language.code.
  * DÒNG `onPress={()=>onChange(language.code)} style={[styles.languageChip,value===language.co`: Thuộc tính onPress: nối thao tác nhấn với callback. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính backgroundColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `<Text style={{fontSize:13,fontWeight:'600',color:value===language.code?colors.white:c`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính fontSize: giá trị số 13. | Gán thuộc tính fontWeight: chuỗi '600'. | Gán thuộc tính color: chọn giữa hai giá trị theo điều kiện value===language.code.
  * DÒNG `</Pressable>)}`: Đóng phần giao diện Pressable.
  * DÒNG `</ScrollView>`: Đóng phần giao diện ScrollView.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingVertical:2}}>
  {LANGUAGES.map(language=><Pressable key={language.code} accessibilityRole="button" accessibilityLabel={language.label} accessibilityState={{selected:value===language.code}}
   onPress={()=>onChange(language.code)} style={[styles.languageChip,value===language.code&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
   <Text style={{fontSize:13,fontWeight:'600',color:value===language.code?colors.white:colors.muted}}>{language.label}</Text>
  </Pressable>)}
 </ScrollView>
}
// TẠI SAO (LanguageTabs): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// Khai báo DemoNotice(). Component hàm nhận props và dựng phần giao diện DemoNotice. | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính flex: giá trị số 1.
export function DemoNotice() { const t=useAdminText();return <View style={styles.notice}><Ionicons name="information-circle-outline" size={17} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('demo')}</Text></View> }
// TẠI SAO (DemoNotice): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
// CHỨC NĂNG: Biểu mẫu tránh bàn phím che nội dung; thông báo dữ liệu nằm cuối trang.
// Khai báo Frame({children}). Component hàm nhận props và dựng phần giao diện Frame. | Khai báo children, kiểu ReactNode.
export function Frame({children}:{children:ReactNode}) {
 // Dùng chiều cao header thực tế thay vì 88 cố định khi bàn phím mở.
 // Khai báo headerHeight: Gọi useHeaderHeight().
 const headerHeight=useHeaderHeight()
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><KeyboardA`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính edges: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính flex: giá trị số 1. | Thuộc tính behavior: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính keyboardVerticalOffset: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<ScrollView style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automatically`: Dựng ScrollView. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Thuộc tính contentInsetAdjustmentBehavior: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính automaticallyAdjustsScrollIndicatorInsets: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính keyboardShouldPersistTaps: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
  * DÒNG `</KeyboardAvoidingView></SafeAreaView>`: Đóng phần giao diện KeyboardAvoidingView.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={headerHeight}>
  <ScrollView style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAdjustsScrollIndicatorInsets keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}<DemoNotice/></ScrollView>
 </KeyboardAvoidingView></SafeAreaView>
}
// TẠI SAO (Frame): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Hiển thị kết quả tải/lưu hoặc lỗi của thao tác quản trị.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Feedback({state}). Component hàm nhận props và dựng phần giao diện Feedback. | Khai báo state, kiểu ReturnType<typeof useAdmin>.
export function Feedback({state}:{state:ReturnType<typeof useAdmin>}) {
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
 const t=useAdminText()
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <>{state.loading&&<View style={styles.row}><ActivityIndicator color={colors.pr`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLiveRegion: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{state.error&&<View style={[styles.feedback,{borderColor:colors.danger}]}><Text style`: Đưa biểu thức JavaScript state.error&&<View style={[styles.feedback,{borderColor:colors.danger}]}><Text style={styles.error} accessibil vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính borderColor: đọc colors.danger từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.reload() làm giá trị của bước hiện tại.
  * DÒNG `{state.success&&<View style={[styles.notice,{alignItems:'center'}]}><Ionicons name="c`: Đưa biểu thức JavaScript state.success&&<View style={[styles.notice,{alignItems:'center'}]}><Ionicons name="checkmark-circle" size={18} vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính alignItems: chuỗi 'center'. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <>{state.loading&&<View style={styles.row}><ActivityIndicator color={colors.primary}/><Text style={styles.muted} accessibilityLiveRegion="polite">{t('loading')}</Text></View>}
 {state.error&&<View style={[styles.feedback,{borderColor:colors.danger}]}><Text style={styles.error} accessibilityRole="alert">{t(`error_${state.error}`)}</Text><Action title={t('retry')} icon="refresh-outline" onPress={()=>{void state.reload()}}/></View>}
 {state.success&&<View style={[styles.notice,{alignItems:'center'}]}><Ionicons name="checkmark-circle" size={18} color={colors.primary}/><Text style={styles.label}>{t('saved')}</Text></View>}</>
}
// TẠI SAO (Feedback): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
// CHỨC NĂNG: Trường nhập có nhãn và phản hồi focus, giữ nguyên giá trị/handler do form truyền.
// Khai báo Field({label,value,onChange,multiline=false,editable=true}). Component hàm nhận props và dựng phần giao diện Field. | Khai báo label, kiểu string. | Khai báo value, kiểu string. | Khai báo onChange, kiểu (text:string)=>void. | Khai báo multiline không bắt buộc, kiểu boolean. | Khai báo editable không bắt buộc, kiểu boolean.
export function Field({label,value,onChange,multiline=false,editable=true}:{label:string;value:string;onChange:(text:string)=>void;multiline?:boolean;editable?:boolean}) {
 // Khai báo [focused,setFocused]: useState(false) giữ trạng thái qua các lần render.
 const [focused,setFocused]=useState(false)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={{gap:7}}><Text style={styles.label}>{label}</Text>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 7.
  * DÒNG `<TextInput accessibilityLabel={label} style={[styles.input,multiline&&{minHeight:120,`: Dựng TextInput. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính minHeight: giá trị số 120. | Gán thuộc tính textAlignVertical: chuỗi 'top'. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính color: đọc colors.muted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `value={value} editable={editable} onChangeText={onChange} multiline={multiline} autoC`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính editable: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChangeText: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính multiline: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính autoCapitalize: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onFocus: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onBlur: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={{gap:7}}><Text style={styles.label}>{label}</Text>
  <TextInput accessibilityLabel={label} style={[styles.input,multiline&&{minHeight:120,textAlignVertical:'top'},focused&&styles.inputFocused,!editable&&{backgroundColor:colors.page,color:colors.muted}]}
   value={value} editable={editable} onChangeText={onChange} multiline={multiline} autoCapitalize="none" onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
 </View>
}
// TẠI SAO (Field): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Thao tác xóa có màu cảnh báo riêng, vẫn do màn hình hỏi xác nhận.
// Khai báo DangerAction({title,onPress,disabled=false}). Component hàm nhận props và dựng phần giao diện DangerAction. | Khai báo title, kiểu string. | Khai báo onPress, kiểu ()=>void. | Khai báo disabled không bắt buộc, kiểu boolean. Khóa thao tác khi điều kiện chưa sẵn sàng để tránh gửi lặp hoặc thao tác sai trạng thái.
export function DangerAction({title,onPress,disabled=false}:{title:string;onPress:()=>void;disabled?:boolean}) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibility`: Trả cây giao diện của component để React hiển thị. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Đặt trường disabled bằng giá trị của biến cùng tên. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `style={({pressed})=>[{minHeight:46,padding:12,borderRadius:13,borderWidth:1,borderCol`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính minHeight: giá trị số 46. | Gán thuộc tính padding: giá trị số 12. | Gán thuộc tính borderRadius: giá trị số 13. | Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.danger từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 8.
  * DÒNG `<Ionicons name="trash-outline" size={18} color={colors.danger}/><Text style={[styles.`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.danger từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính flexShrink: giá trị số 1. | Gán thuộc tính textAlign: chuỗi 'center'.
  * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
  style={({pressed})=>[{minHeight:46,padding:12,borderRadius:13,borderWidth:1,borderColor:colors.danger,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8},(pressed||disabled)&&styles.pressed]}>
  <Ionicons name="trash-outline" size={18} color={colors.danger}/><Text style={[styles.label,{color:colors.danger,flexShrink:1,textAlign:'center'}]}>{title}</Text>
 </Pressable>
}
// TẠI SAO (DangerAction): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// CHỨC NĂNG: Hỏi trước khi back khỏi biểu mẫu chưa lưu, tránh mất nội dung.
// Khai báo useUnsaved(dirty). Nhận đầu vào qua tham số.
export function useUnsaved(dirty:boolean) {
 // Khai báo navigation: useNavigation() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo ref: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại. | Thực hiện tính biểu thức ref.current=dirty.
 const navigation=useNavigation(),t=useAdminText(),ref=useRef(dirty);ref.current=dirty
 // DÒNG NÀY LÀM GÌ: Đăng ký chặn thao tác rời màn nếu form vẫn còn thay đổi chưa lưu.
 // CÁCH HOẠT ĐỘNG: ref.current cho biết form còn dirty; xác nhận rời thì bỏ chặn và dispatch lại
 // chính thao tác điều hướng đã nhận.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: navigation, t.
 // Đăng ký useEffect để thực hiện tác vụ sau render.
 useEffect(()=>navigation.addListener('beforeRemove',event=>{
  // Rẽ nhánh nếu !ref.current. | Thoát hàm hiện tại ngay.
  if(!ref.current)return
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `event.preventDefault();Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'`: Chặn hành vi mặc định của sự kiện. | Thực hiện Gọi Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:t('visitor'),. | Gán thuộc tính text: Gọi t('cancel'). | Gán thuộc tính style: chuỗi 'cancel'. | Gán thuộc tính text: Gọi t('visitor'). | Gán thuộc tính onPress: khai báo callback ()=>{ref.current=false. | Thực hiện tính biểu thức ref.current=false. | Thực hiện Gọi navigation.dispatch(event.data.action).
   * DÒNG `}),[navigation,t])`: Đăng ký useEffect để thực hiện tác vụ sau render.
   */
  event.preventDefault();Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:t('visitor'),onPress:()=>{ref.current=false;navigation.dispatch(event.data.action)}}])
 }),[navigation,t])
 // TẠI SAO: Tránh mất dữ liệu đang nhập và tránh chặn vô hạn cả thao tác mà người dùng vừa xác
 // nhận.
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return ()=>{ref.current=false}`: Trả kết quả: khai báo callback ()=>{ref.current=false}. | Thực hiện tính biểu thức ref.current=false.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return ()=>{ref.current=false}
}
// TẠI SAO (useUnsaved): Rời form chưa lưu có thể mất nội dung đang nhập; cảnh báo cho phép người
// dùng chọn trước khi rời.
// CHỨC NĂNG: Giữ API import cũ; player đầy đủ được quản lý trong một file riêng.
// Xuất lại thành phần từ './AudioPreview'.
export { AudioPreview } from './AudioPreview'
