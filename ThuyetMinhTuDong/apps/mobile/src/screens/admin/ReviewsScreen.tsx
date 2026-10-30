/**
 * FILE NÀY LÀM GÌ
 * Danh sách và xử lý kiểm duyệt nội dung trên mobile; chấp nhận hoặc yêu cầu sửa theo phiên bản
 * bản ghi.
 *
 * VỊ TRÍ: apps/mobile/src/screens/admin/ReviewsScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/AdminNavigator.tsx.
 * PHỤ THUỘC: @react-navigation/native; @react-navigation/native-stack;
 * ../../navigation/adminTypes; react; react-native; @expo/vector-icons; ../../components/Cover;
 * ../../theme; react-native-safe-area-context; @travelguide/visitor-core; @travelguide/admin-core;
 * @travelguide/admin-core/react; ../../components/Action; ../../components/admin/AdminUI
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '@react-navigation/native'.
import { useNavigation } from '@react-navigation/native'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
// Nhập kiểu dữ liệu từ '../../navigation/adminTypes'.
import type { AdminStack } from '../../navigation/adminTypes'
// Nhập các thành phần từ 'react'.
import { useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Alert,FlatList,Text,View } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '../../components/Cover'.
import { Cover } from '../../components/Cover'
// Nhập các thành phần từ '../../theme'.
import { colors } from '../../theme'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Language } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../components/Action'.
import { Action } from '../../components/Action'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { DemoNotice,Feedback,Field,PageHeader,StatusBadge,LanguageTabs,SectionHeading,styles,AudioPreview } from '../../components/admin/AdminUI'
// CHỨC NĂNG: Danh sách và xử lý kiểm duyệt nội dung trên mobile; chấp nhận hoặc yêu cầu sửa theo
// phiên bản bản ghi.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ReviewsScreen(). Component hàm nhận props và dựng phần giao diện ReviewsScreen. | Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo places: tính biểu thức state.data?.places.filter(p=>['submitted','approved','changes'].includes(p.workflow))??[].
export function ReviewsScreen(){const state=useAdmin(),t=useAdminText(),places=state.data?.places.filter(p=>['submitted','approved','changes'].includes(p.workflow))??[]
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><FlatList `: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính edges: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính flex: giá trị số 1. | Thuộc tính contentInsetAdjustmentBehavior: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính automaticallyAdjustsScrollIndicatorInsets: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính keyboardShouldPersistTaps: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách. | Thuộc tính keyExtractor: lấy khóa ổn định từ dữ liệu thay vì vị trí mảng. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
  * DÒNG `ListHeaderComponent={<View style={{gap:16}}><PageHeader title={t('reviews')} descript`: Thuộc tính ListHeaderComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 16. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính description: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `ListFooterComponent={<DemoNotice/>}`: Thuộc tính ListFooterComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItem`: Thuộc tính ListEmptyComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính paddingVertical: giá trị số 32. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính renderItem: quy định cách dựng một phần tử danh sách. | Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><FlatList style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAdjustsScrollIndicatorInsets keyboardShouldPersistTaps="handled" data={places} keyExtractor={p=>p.id+p.revision+p.workflow} contentContainerStyle={styles.content}
  ListHeaderComponent={<View style={{gap:16}}><PageHeader title={t('reviews')} description={t('reviewQueueHint')}/><Feedback state={state}/><Text style={styles.muted}>{places.length} {t('reviews')}</Text></View>}
  ListFooterComponent={<DemoNotice/>}
  ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:32}]}><Ionicons name="shield-checkmark-outline" size={36} color={colors.primary}/><Text style={styles.muted}>{t('empty')}</Text></View>:undefined} renderItem={({item})=><Review place={item}/>}/></SafeAreaView>
}
// TẠI SAO (ReviewsScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
// CHỨC NĂNG: Hiển thị một bản nội dung cần kiểm duyệt và các thao tác duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Review({place}). Component hàm nhận props và dựng phần giao diện Review. | Khai báo place, kiểu ManagedPlace.
function Review({place}:{place:ManagedPlace}){
 // Khai báo navigation: useNavigation() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
 const navigation=useNavigation<NativeStackNavigationProp<AdminStack>>()
 // CHỨC NĂNG: Ngôn ngữ đang dùng cho nội dung hoặc form hiện tại.
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [language,setLanguage]: useState('vi') giữ trạng thái qua các lần render.
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[note,setNote]=useState(''),text=place.record.content[language]
 // CHỨC NĂNG: Thẻ duyệt tách nhận diện di tích, ngôn ngữ, nội dung và hành động.
 // XỬ LÝ: Nội dung vẫn hiển thị đầy đủ; mọi nút giữ điều kiện workflow/revision cũ.
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={styles.card}>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={{flexDirection:'row',gap:12,alignItems:'center'}}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 12. | Gán thuộc tính alignItems: chuỗi 'center'.
  * DÒNG `<Cover uri={place.record.images[0]} style={{width:70,height:78,borderRadius:12}}/>`: Dựng Cover. | Truyền địa chỉ tài nguyên vào component. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính width: giá trị số 70. | Gán thuộc tính height: giá trị số 78. | Gán thuộc tính borderRadius: giá trị số 12.
  * DÒNG `<View style={{flex:1,minWidth:0,gap:7}}><StatusBadge workflow={place.workflow}/><Text`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 0. | Gán thuộc tính gap: giá trị số 7. | Thuộc tính workflow: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<Text style={styles.muted}>{t('revision')}: {place.revision} · {t('current')}: {place`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={styles.divider}/>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<LanguageTabs value={language} onChange={setLanguage}/>`: Dựng LanguageTabs. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<View style={{gap:8,padding:12,borderRadius:13,backgroundColor:colors.page}}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 8. | Gán thuộc tính padding: giá trị số 12. | Gán thuộc tính borderRadius: giá trị số 13. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `<Text style={styles.label}>{text?.title??t('none')}</Text><Text style={styles.text}>{`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `{text?.audio&&<AudioPreview key={language} url={text.audio.url} title={text.title}/>}`: Đưa biểu thức JavaScript text?.audio&&<AudioPreview key={language} url={text.audio.url} title={text.title}/> vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính url: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
  * DÒNG `<SectionHeading title={t('note')} icon="chatbubble-ellipses-outline"/>`: Dựng SectionHeading. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('note')} value={note} onChange={setNote} multiline/>{!!place.reviewNo`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính multiline: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Action title={t('content')} icon="document-text-outline" onPress={()=>navigation.nav`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback. | Gán thuộc tính id: đọc place.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
  * DÒNG `<Feedback state={state}/>`: Dựng Feedback. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{place.workflow==='submitted'&&<><Action title={t('approve')} icon="checkmark-circle-`: Đưa biểu thức JavaScript place.workflow==='submitted'&&<><Action title={t('approve')} icon="checkmark-circle-outline" variant="primary" vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.run(()=>state.service.review(place.id,place.revision,true,note)) làm giá trị của bước hiện tại. | Thực hiện sử dụng void state.run(()=>state.service.review(place.id,place.revision,false,note)) làm giá trị của bước hiện tại.
  * DÒNG `{place.workflow==='approved'&&<Action title={t('publish')} icon="globe-outline" varia`: Đưa biểu thức JavaScript place.workflow==='approved'&&<Action title={t('publish')} icon="globe-outline" variant="primary" disabled={sta vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Gán thuộc tính text: Gọi t('cancel'). | Gán thuộc tính style: chuỗi 'cancel'. | Gán thuộc tính text: Gọi t('publish'). | Gán thuộc tính onPress: khai báo callback ()=>{void state.run(()=>state.service.publish(place.id,place.revision))}. | Thực hiện sử dụng void state.run(()=>state.service.publish(place.id,place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={styles.card}>
  <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
   <Cover uri={place.record.images[0]} style={{width:70,height:78,borderRadius:12}}/>
   <View style={{flex:1,minWidth:0,gap:7}}><StatusBadge workflow={place.workflow}/><Text style={styles.heading}>{place.record.canonicalTitle}</Text></View>
  </View>
  <Text style={styles.muted}>{t('revision')}: {place.revision} · {t('current')}: {place.published?.content.vi?.version??t('none')}</Text>
  <View style={styles.divider}/>
  <LanguageTabs value={language} onChange={setLanguage}/>
  <View style={{gap:8,padding:12,borderRadius:13,backgroundColor:colors.page}}>
   <Text style={styles.label}>{text?.title??t('none')}</Text><Text style={styles.text}>{text?.body??t('none')}</Text>
  </View>
  {text?.audio&&<AudioPreview key={language} url={text.audio.url} title={text.title}/>}
  <SectionHeading title={t('note')} icon="chatbubble-ellipses-outline"/>
  <Field label={t('note')} value={note} onChange={setNote} multiline/>{!!place.reviewNote&&<Text>{place.reviewNote}</Text>}
  <Action title={t('content')} icon="document-text-outline" onPress={()=>navigation.navigate('Content',{id:place.id})}/>
  <Feedback state={state}/>
  {place.workflow==='submitted'&&<><Action title={t('approve')} icon="checkmark-circle-outline" variant="primary" disabled={state.busy} onPress={()=>{void state.run(()=>state.service.review(place.id,place.revision,true,note))}}/><Action title={t('reject')} icon="return-down-back-outline" disabled={state.busy||!note.trim()} onPress={()=>{void state.run(()=>state.service.review(place.id,place.revision,false,note))}}/></>}
  {place.workflow==='approved'&&<Action title={t('publish')} icon="globe-outline" variant="primary" disabled={state.busy} onPress={()=>Alert.alert(t('publish'),t('confirmPublish'),[{text:t('cancel'),style:'cancel'},{text:t('publish'),onPress:()=>{void state.run(()=>state.service.publish(place.id,place.revision))}}])}/>}
 </View>
}
// TẠI SAO (Review): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
// dùng chung.
/* CÁCH KIỂM TRA: Duyệt chưa public; sửa sau duyệt chặn publish; xác nhận mới công bố. */
