/**
 * FILE NÀY LÀM GÌ
 * Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản
 * lý được cung cấp.
 *
 * VỊ TRÍ: apps/mobile/src/screens/admin/PlacesScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/AdminNavigator.tsx.
 * PHỤ THUỘC: react; react-native; @expo/vector-icons; react-native-safe-area-context;
 * @react-navigation/native-stack; @travelguide/visitor-core; @travelguide/visitor-core/react;
 * @travelguide/admin-core/react; ../../navigation/adminTypes; ../../components/Action;
 * ../../components/Cover; ../../components/admin/AdminUI; ../../theme
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react'.
import { useMemo, useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { normalize } from '@travelguide/visitor-core'
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { useDebounce } from '@travelguide/visitor-core/react'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập kiểu dữ liệu từ '../../navigation/adminTypes'.
import type { AdminStack } from '../../navigation/adminTypes'
// Nhập các thành phần từ '../../components/Action'.
import { Action } from '../../components/Action'
// Nhập các thành phần từ '../../components/Cover'.
import { Cover } from '../../components/Cover'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { DemoNotice, Feedback, PageHeader, StatusBadge, styles } from '../../components/admin/AdminUI'
// Nhập các thành phần từ '../../theme'.
import { colors } from '../../theme'
// CHỨC NĂNG: Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao
// tác quản lý được cung cấp.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AdminPlacesScreen({navigation}). Component hàm nhận props và dựng phần giao diện AdminPlacesScreen.
export function AdminPlacesScreen({navigation}:NativeStackScreenProps<AdminStack,'AdminPlaces'>) {
 // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [query,setQuery]: useState('') giữ trạng thái qua các lần render.
 const state=useAdmin(),t=useAdminText(),[query,setQuery]=useState(''),debounced=useDebounce(query)
 // Khai báo places: useMemo lưu kết quả theo mảng phụ thuộc.
 const places=useMemo(()=>state.data?.places.filter(p=>normalize(p.record.canonicalTitle).includes(normalize(debounced)))??[],[state.data,debounced])
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <SafeAreaView style={styles.page} edges={['left','right','bottom']}>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính edges: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<FlatList style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAd`: Dựng FlatList. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Thuộc tính contentInsetAdjustmentBehavior: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính automaticallyAdjustsScrollIndicatorInsets: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính keyboardShouldPersistTaps: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách. | Thuộc tính keyExtractor: lấy khóa ổn định từ dữ liệu thay vì vị trí mảng. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
  * DÒNG `ListHeaderComponent={<View style={{gap:16}}>`: Thuộc tính ListHeaderComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 16.
  * DÒNG `<PageHeader title={t('places')} description={t('catalogHint')}/><Feedback state={stat`: Dựng PageHeader. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính description: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `<View style={styles.searchBox}><Ionicons name="search-outline" size={20} color={color`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<TextInput style={styles.searchInput} accessibilityLabel={t('search')} placeholder={t`: Dựng TextInput. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính placeholder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính placeholderTextColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChangeText: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính autoCorrect: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{!!query&&<Pressable accessibilityRole="button" accessibilityLabel={t('clearSearch')}`: Đưa biểu thức JavaScript !!query&&<Pressable accessibilityRole="button" accessibilityLabel={t('clearSearch')} onPress={()=>setQuery('') vào JSX. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính padding: giá trị số 8. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<Text style={styles.muted}>{places.length} {t('places')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `</View>}`: Đóng phần giao diện View.
  * DÒNG `ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItem`: Thuộc tính ListEmptyComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính paddingVertical: giá trị số 28. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `ListFooterComponent={<DemoNotice/>}`: Thuộc tính ListFooterComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `renderItem={({item})=><View style={styles.card}>`: Thuộc tính renderItem: quy định cách dựng một phần tử danh sách. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={{flexDirection:'row',gap:12,alignItems:'center'}}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 12. | Gán thuộc tính alignItems: chuỗi 'center'.
  * DÒNG `<Cover uri={item.record.images[0]} style={styles.listImage}/>`: Dựng Cover. | Truyền địa chỉ tài nguyên vào component. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={{flex:1,minWidth:0,gap:8}}><StatusBadge workflow={item.workflow}/><Text `: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 0. | Gán thuộc tính gap: giá trị số 8. | Thuộc tính workflow: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính numberOfLines: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{!!item.period&&<Text numberOfLines={1} style={styles.muted}>{item.period}</Text>}`: Đưa biểu thức JavaScript !!item.period&&<Text numberOfLines={1} style={styles.muted}>{item.period}</Text> vào JSX. | Thuộc tính numberOfLines: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={styles.divider}/>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={{flexDirection:'row',gap:10}}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 10.
  * DÒNG `<View style={{flex:1}}><Action title={t('edit')} icon="create-outline" onPress={()=>n`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback. | Gán thuộc tính id: đọc item.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
  * DÒNG `<View style={{flex:1}}><Action title={t('content')} icon="document-text-outline" vari`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback. | Gán thuộc tính id: đọc item.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `</View>}`: Đóng phần giao diện View.
  * DÒNG `/>`: Dựng FlatList.
  * DÒNG `</SafeAreaView>`: Đóng phần giao diện SafeAreaView.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}>
  <FlatList style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAdjustsScrollIndicatorInsets keyboardShouldPersistTaps="handled" data={places} keyExtractor={place=>place.id} contentContainerStyle={styles.content}
   ListHeaderComponent={<View style={{gap:16}}>
    <PageHeader title={t('places')} description={t('catalogHint')}/><Feedback state={state}/>
    <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
    <View style={styles.searchBox}><Ionicons name="search-outline" size={20} color={colors.muted}/>
     <TextInput style={styles.searchInput} accessibilityLabel={t('search')} placeholder={t('search')} placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} autoCorrect={false}/>
     {!!query&&<Pressable accessibilityRole="button" accessibilityLabel={t('clearSearch')} onPress={()=>setQuery('')} style={{padding:8}}><Ionicons name="close-circle" size={20} color={colors.muted}/></Pressable>}
    </View>
    <Text style={styles.muted}>{places.length} {t('places')}</Text>
   </View>}
   ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:28}]}><Ionicons name="search-outline" size={32} color={colors.muted}/><Text style={styles.muted}>{t('empty')}</Text></View>:undefined}
   ListFooterComponent={<DemoNotice/>}
   // CHỨC NĂNG: FlatList chỉ dựng các thẻ cần thiết; ảnh cố định, nội dung tự xuống dòng.
   renderItem={({item})=><View style={styles.card}>
    <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
     <Cover uri={item.record.images[0]} style={styles.listImage}/>
     <View style={{flex:1,minWidth:0,gap:8}}><StatusBadge workflow={item.workflow}/><Text numberOfLines={2} style={styles.heading}>{item.record.canonicalTitle}</Text>
      {!!item.period&&<Text numberOfLines={1} style={styles.muted}>{item.period}</Text>}
     </View>
    </View>
    <View style={styles.divider}/>
    <View style={{flexDirection:'row',gap:10}}>
     <View style={{flex:1}}><Action title={t('edit')} icon="create-outline" onPress={()=>navigation.navigate('PlaceForm',{id:item.id})}/></View>
     <View style={{flex:1}}><Action title={t('content')} icon="document-text-outline" variant="primary" onPress={()=>navigation.navigate('Content',{id:item.id})}/></View>
    </View>
   </View>}
  />
 </SafeAreaView>
}
// TẠI SAO (AdminPlacesScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
/* CÁCH KIỂM TRA: 'ky dai' tìm đúng; xóa tìm khôi phục danh sách; hai nút truyền đúng place ID. */
