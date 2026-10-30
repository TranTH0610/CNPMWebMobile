/**
 * FILE NÀY LÀM GÌ
 * Biểu mẫu tạo/sửa thông tin di tích mobile: tên, danh mục, thời kỳ, ảnh và tọa độ; lưu qua
 * AdminService.
 *
 * VỊ TRÍ: apps/mobile/src/screens/admin/PlaceFormScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/AdminNavigator.tsx.
 * PHỤ THUỘC: ../../components/admin/LocalMediaPicker; react; react-native;
 * @react-navigation/native-stack; @travelguide/visitor-core; @travelguide/admin-core;
 * @travelguide/admin-core/react; ../../i18n; ../../navigation/adminTypes; ../../components/Action;
 * ../../components/Cover; ../../theme; ../../components/admin/AdminUI
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../../components/admin/LocalMediaPicker'.
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
// Nhập các thành phần từ 'react'.
import { useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Alert,Pressable,Switch,Text,View } from 'react-native'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { CATEGORIES,categoryOf } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../i18n'.
import { useText } from '../../i18n'
// Nhập kiểu dữ liệu từ '../../navigation/adminTypes'.
import type { AdminStack } from '../../navigation/adminTypes'
// Nhập các thành phần từ '../../components/Action'.
import { Action } from '../../components/Action'
// Nhập các thành phần từ '../../components/Cover'.
import { Cover } from '../../components/Cover'
// Nhập các thành phần từ '../../theme'.
import { colors } from '../../theme'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Frame,Field,Feedback,PageHeader,SectionHeading,DangerAction,styles,useUnsaved } from '../../components/admin/AdminUI'
// Đặt tên kiểu Props.
type Props=NativeStackScreenProps<AdminStack,'PlaceForm'>
// CHỨC NĂNG: Biểu mẫu tạo/sửa thông tin di tích mobile: tên, danh mục, thời kỳ, ảnh và tọa độ; lưu
// qua AdminService.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo PlaceFormScreen(props). Component hàm nhận props và dựng phần giao diện PlaceFormScreen. | Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo id: đọc props.route.params?.id từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo place: state.data?.places.find lấy phần tử đầu tiên phù hợp.
export function PlaceFormScreen(props:Props){const state=useAdmin(),t=useAdminText(),id=props.route.params?.id,place=state.data?.places.find(p=>p.id===id)
 // Rẽ nhánh nếu state.loading. | Trả cây giao diện của component để React hiển thị. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 if(state.loading)return <Frame><Feedback state={state}/></Frame>
 // Rẽ nhánh nếu id&&!place. | Trả cây giao diện của component để React hiển thị.
 if(id&&!place)return <Frame><Text>{t('error_notFound')}</Text></Frame>
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <Form key={id??'new'} initial={place} navigation={props.navigation}/>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính initial: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính navigation: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <Form key={id??'new'} initial={place} navigation={props.navigation}/>
}
// TẠI SAO (PlaceFormScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
// CHỨC NĂNG: Giữ dữ liệu đang nhập và lưu thông tin di tích.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Form({initial,navigation}). Component hàm nhận props và dựng phần giao diện Form. | Khai báo initial không bắt buộc, kiểu ManagedPlace. | Khai báo navigation, kiểu Props['navigation'].
function Form({initial,navigation}:{initial?:ManagedPlace;navigation:Props['navigation']}){
 // Khai báo [opened]: useState(initial) giữ trạng thái qua các lần render.
 const [opened] = useState(initial)
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo vt: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
 const state=useAdmin(),t=useAdminText(),vt=useText()
 // CHỨC NĂNG: Tên/tiêu đề đang được nhập trong form.
 // Khai báo [title,setTitle]: useState(opened?.record.canonicalTitle??'') giữ trạng thái qua các lần render.
 const [title,setTitle]=useState(opened?.record.canonicalTitle??''),[category,setCategory]=useState<Category>(opened?categoryOf(opened.record):'palace')
 // Khai báo [period,setPeriod]: useState(opened?.period??'') giữ trạng thái qua các lần render.
 const [period,setPeriod]=useState(opened?.period??''),[lat,setLat]=useState(opened?.record.position?.lat.toString()??''),[lng,setLng]=useState(opened?.record.position?.lng.toString()??'')
 // CHỨC NĂNG: Form có thay đổi chưa lưu; dùng để cảnh báo trước khi rời hoặc đổi ngôn ngữ.
 // Khai báo [verified,setVerified]: useState(opened?.record.position?.verified??false) giữ trạng thái qua các lần render.
 const [verified,setVerified]=useState(opened?.record.position?.verified??false),[images,setImages]=useState(opened?.record.images.join('\n')??''),[dirty,setDirty]=useState(false)
 // Khai báo allowLeave: Gọi useUnsaved(dirty). | Cập nhật trạng thái qua setDirty(true). | Thực hiện Gọi setter(s).
 const allowLeave=useUnsaved(dirty),change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)}
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <Frame><PageHeader title={t(opened?'edit':'new')} description={t('catalogHint'`: Trả cây giao diện của component để React hiển thị. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính description: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<View style={styles.card}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<SectionHeading title={t('basicInfo')} icon="business-outline"/>`: Dựng SectionHeading. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('title')} value={title} onChange={change(setTitle)}/>`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<Text style={styles.label}>{t('category')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<View style={styles.row}>{CATEGORIES.map(c=><Pressable key={c} accessibilityRole="but`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính selected: tính biểu thức category===c.
  * DÒNG `onPress={()=>{setCategory(c);setDirty(true)}} style={[styles.languageChip,category===`: Thuộc tính onPress: nối thao tác nhấn với callback. | Cập nhật trạng thái qua setCategory(c). | Cập nhật trạng thái qua setDirty(true). | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `<Text style={{color:category===c?colors.primary:colors.muted,fontSize:12,fontWeight:'`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: chọn giữa hai giá trị theo điều kiện category===c. | Gán thuộc tính fontSize: giá trị số 12. | Gán thuộc tính fontWeight: chuỗi '600'.
  * DÒNG `</Pressable>)}</View>`: Đóng phần giao diện Pressable.
  * DÒNG `<Field label={t('period')} value={period} onChange={change(setPeriod)}/>`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={styles.card}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<SectionHeading title={t('locationSection')} icon="location-outline"/>`: Dựng SectionHeading. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<View style={{flexDirection:'row',gap:10}}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 10.
  * DÒNG `<View style={{flex:1,minWidth:0}}><Field label={t('lat')} value={lat} onChange={chang`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 0. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<View style={{flex:1,minWidth:0}}><Field label={t('lng')} value={lng} onChange={chang`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 0. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={[styles.row,{flexWrap:'nowrap',justifyContent:'space-between'}]}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flexWrap: chuỗi 'nowrap'. | Gán thuộc tính justifyContent: chuỗi 'space-between'.
  * DÒNG `<Text style={[styles.label,{flex:1}]}>{t('verified')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1.
  * DÒNG `<Switch accessibilityLabel={t('verified')} trackColor={{false:colors.border,true:colo`: Dựng Switch. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính trackColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính false: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính true: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính thumbColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onValueChange: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Cập nhật trạng thái qua setVerified(value). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={styles.card}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<SectionHeading title={t('mediaSection')} icon="images-outline"/>`: Dựng SectionHeading. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{!!images.trim()&&<Cover uri={images.split('\n').map(value=>value.trim()).find(Boolea`: Đưa biểu thức JavaScript !!images.trim()&&<Cover uri={images.split('\n').map(value=>value.trim()).find(Boolean)} style={{height:160,bor vào JSX. | Truyền địa chỉ tài nguyên vào component. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính height: giá trị số 160. | Gán thuộc tính borderRadius: giá trị số 14.
  * DÒNG `<Field label={t('images')} multiline value={images.split('\n').filter(s=>!s.startsWit`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính multiline: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Cập nhật trạng thái qua setImages([...images.split('\n').filter(s=>s.startsWith('data:')),value].filter(Boolean).join('\n')). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `<LocalMediaPicker kind="image" onPick={value=>{setImages(old=>[old,value].filter(Bool`: Dựng LocalMediaPicker. | Thuộc tính kind: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPick: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Cập nhật trạng thái qua setImages(old=>[old,value].filter(Boolean).join('\n')). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `{images.includes('data:')&&<Action title={t('clearFile')} onPress={()=>{setImages(ima`: Đưa biểu thức JavaScript images.includes('data:')&&<Action title={t('clearFile')} onPress={()=>{setImages(images.split('\n').filter(s=> vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback. | Cập nhật trạng thái qua setImages(images.split('\n').filter(s=>!s.startsWith('data:')).join('\n')). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-o`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Action title={t('save')} icon="save-outline" variant="primary" disabled={state.busy|`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.run(()=>state.service.savePlace({id:opened?.id,expectedRevision:opened?.revisio làm giá trị của bước hiện tại. | Gán thuộc tính id: đọc opened?.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính expectedRevision: đọc opened?.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Đặt trường title bằng giá trị của biến cùng tên. | Đặt trường category bằng giá trị của biến cùng tên. | Đặt trường period bằng giá trị của biến cùng tên. | Đặt trường lat bằng giá trị của biến cùng tên. | Đặt trường lng bằng giá trị của biến cùng tên. | Đặt trường verified bằng giá trị của biến cùng tên. | Gán thuộc tính images: images.split('\n').map(s=>s.trim()).filter tạo mảng chỉ giữ phần tử đạt điều kiện. | Rẽ nhánh nếu ok. | Thực hiện Gọi allowLeave(). | Thực hiện Gọi navigation.goBack().
  * DÒNG `{opened&&opened.workflow!=='archived'&&<Action title={t('archive')} disabled={state.b`: Đưa biểu thức JavaScript opened&&opened.workflow!=='archived'&&<Action title={t('archive')} disabled={state.busy} onPress={()=>Alert.al vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Gán thuộc tính text: Gọi t('cancel'). | Gán thuộc tính style: chuỗi 'cancel'. | Gán thuộc tính text: Gọi t('archive'). | Gán thuộc tính style: chuỗi 'destructive'. | Gán thuộc tính onPress: khai báo callback ()=>{void state.run(()=>state.service.archive(opened.id,opened.revision)).t. | Thực hiện sử dụng void state.run(()=>state.service.archive(opened.id,opened.revision)).then(ok=>{if(ok){allo làm giá trị của bước hiện tại. | Rẽ nhánh nếu ok. | Thực hiện Gọi allowLeave(). | Thực hiện Gọi navigation.goBack().
  * DÒNG `{opened && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Ale`: Đưa biểu thức JavaScript opened && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Alert.alert(t('delete'), t('c vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `{text:t('cancel'),style:'cancel'},`: Đưa biểu thức JavaScript () => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [ {text:t('cancel'),s vào JSX. | Gán thuộc tính text: Gọi t('cancel'). | Gán thuộc tính style: chuỗi 'cancel'.
  * DÒNG `{text:t('delete'),style:'destructive',onPress:()=>{`: Đưa biểu thức JavaScript () => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [ {text:t('cancel'),s vào JSX. | Gán thuộc tính text: Gọi t('delete'). | Gán thuộc tính style: chuỗi 'destructive'. | Gán thuộc tính onPress: khai báo callback ()=>{ void state.run(()=>state.service.deletePlace(opened.id,opened.revisio.
  * DÒNG `void state.run(()=>state.service.deletePlace(opened.id,opened.revision)).then(ok=>{`: Thực hiện sử dụng void state.run(()=>state.service.deletePlace(opened.id,opened.revision)).then(ok=>{ if(ok) làm giá trị của bước hiện tại.
  * DÒNG `if(ok){allowLeave();navigation.goBack()}`: Rẽ nhánh nếu ok. | Thực hiện Gọi allowLeave(). | Thực hiện Gọi navigation.goBack().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  * DÒNG `}},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  * DÒNG `])} />}`: Đưa biểu thức JavaScript () => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [ {text:t('cancel'),s vào JSX.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `</Frame>`: Đóng phần giao diện Frame.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <Frame><PageHeader title={t(opened?'edit':'new')} description={t('catalogHint')}/><Feedback state={state}/>
  {/* CHỨC NĂNG: Chia metadata thành nhóm rõ ràng, không đổi state và validate của service. */}
  <View style={styles.card}>
   <SectionHeading title={t('basicInfo')} icon="business-outline"/>
   <Field label={t('title')} value={title} onChange={change(setTitle)}/>
   <Text style={styles.label}>{t('category')}</Text>
   <View style={styles.row}>{CATEGORIES.map(c=><Pressable key={c} accessibilityRole="button" accessibilityLabel={vt(`category_${c}`)} accessibilityState={{selected:category===c}}
    onPress={()=>{setCategory(c);setDirty(true)}} style={[styles.languageChip,category===c&&{backgroundColor:colors.soft,borderColor:colors.primary}]}>
    <Text style={{color:category===c?colors.primary:colors.muted,fontSize:12,fontWeight:'600'}}>{vt(`category_${c}`)}</Text>
   </Pressable>)}</View>
   <Field label={t('period')} value={period} onChange={change(setPeriod)}/>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('locationSection')} icon="location-outline"/>
   <View style={{flexDirection:'row',gap:10}}>
    <View style={{flex:1,minWidth:0}}><Field label={t('lat')} value={lat} onChange={change(setLat)}/></View>
    <View style={{flex:1,minWidth:0}}><Field label={t('lng')} value={lng} onChange={change(setLng)}/></View>
   </View>
   <View style={[styles.row,{flexWrap:'nowrap',justifyContent:'space-between'}]}>
    <Text style={[styles.label,{flex:1}]}>{t('verified')}</Text>
    <Switch accessibilityLabel={t('verified')} trackColor={{false:colors.border,true:colors.primary}} thumbColor={colors.white} value={verified} onValueChange={value=>{setVerified(value);setDirty(true)}}/>
   </View>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('mediaSection')} icon="images-outline"/>
   {!!images.trim()&&<Cover uri={images.split('\n').map(value=>value.trim()).find(Boolean)} style={{height:160,borderRadius:14}}/>}
   <Field label={t('images')} multiline value={images.split('\n').filter(s=>!s.startsWith('data:')).join('\n')} onChange={value=>{setImages([...images.split('\n').filter(s=>s.startsWith('data:')),value].filter(Boolean).join('\n'));setDirty(true)}}/>
   <LocalMediaPicker kind="image" onPick={value=>{setImages(old=>[old,value].filter(Boolean).join('\n'));setDirty(true)}}/>
   {images.includes('data:')&&<Action title={t('clearFile')} onPress={()=>{setImages(images.split('\n').filter(s=>!s.startsWith('data:')).join('\n'));setDirty(true)}}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={state.busy||opened?.workflow==='archived'} onPress={()=>{void state.run(()=>state.service.savePlace({id:opened?.id,expectedRevision:opened?.revision,title,category,period,lat,lng,verified,images:images.split('\n').map(s=>s.trim()).filter(Boolean)})).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}/>
  {opened&&opened.workflow!=='archived'&&<Action title={t('archive')} disabled={state.busy} onPress={()=>Alert.alert(t('archive'),t('confirmArchive'),[{text:t('cancel'),style:'cancel'},{text:t('archive'),style:'destructive',onPress:()=>{void state.run(()=>state.service.archive(opened.id,opened.revision)).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}])}/>}
  {/* CHỨC NĂNG: Xóa hẳn cả điểm đã lưu trữ; không xóa khi chưa xác nhận. */}
  {opened && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [
    {text:t('cancel'),style:'cancel'},
    {text:t('delete'),style:'destructive',onPress:()=>{
      void state.run(()=>state.service.deletePlace(opened.id,opened.revision)).then(ok=>{
        if(ok){allowLeave();navigation.goBack()}
      })
    }},
  ])} />}
  </View>
 </Frame>
}
// TẠI SAO (Form): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp dùng
// chung.
/* CÁCH KIỂM TRA: Back form bẩn có hỏi; lưu lỗi giữ giá trị; thêm mới không xuất hiện public trước duyệt. */
