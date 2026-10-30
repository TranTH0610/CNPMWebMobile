/**
 * FILE NÀY LÀM GÌ
 * Biên tập nội dung từng ngôn ngữ trên mobile, chuẩn bị âm thanh, nghe thử và gửi nội dung vào quy
 * trình duyệt.
 *
 * VỊ TRÍ: apps/mobile/src/screens/admin/ContentEditorScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/AdminNavigator.tsx.
 * PHỤ THUỘC: ../../components/admin/LocalMediaPicker; react; react-native;
 * @react-navigation/native-stack; @travelguide/visitor-core; @travelguide/admin-core;
 * @travelguide/admin-core/react; ../../navigation/adminTypes; ../../components/Action;
 * ../../components/admin/AdminUI
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../../components/admin/LocalMediaPicker'.
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
// Nhập các thành phần từ 'react'.
import { useState, useRef } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Alert,Text,View } from 'react-native'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Language } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { ManagedPlace } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
// Nhập kiểu dữ liệu từ '../../navigation/adminTypes'.
import type { AdminStack } from '../../navigation/adminTypes'
// Nhập các thành phần từ '../../components/Action'.
import { Action } from '../../components/Action'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Frame,Field,Feedback,PageHeader,SectionHeading,StatusBadge,LanguageTabs,styles,useUnsaved,AudioPreview } from '../../components/admin/AdminUI'
// CHỨC NĂNG: Biên tập nội dung từng ngôn ngữ trên mobile, chuẩn bị âm thanh, nghe thử và gửi nội
// dung vào quy trình duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ContentEditorScreen({route}). Component hàm nhận props và dựng phần giao diện ContentEditorScreen.
export function ContentEditorScreen({route}:NativeStackScreenProps<AdminStack,'Content'>){
 // CHỨC NĂNG: Ngôn ngữ đang dùng cho nội dung hoặc form hiện tại. Form có thay đổi chưa lưu; dùng
 // để cảnh báo trước khi rời hoặc đổi ngôn ngữ.
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [language,setLanguage]: useState('vi') giữ trạng thái qua các lần render.
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[dirty,setDirty]=useState(false)
 // Khai báo fresh: state.data?.places.find lấy phần tử đầu tiên phù hợp.
 const fresh=state.data?.places.find(p=>p.id===route.params.id)
 // Khai báo snapshot: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
 const snapshot=useRef<ManagedPlace|undefined>(undefined)
 // CHỨC NĂNG: Giữ bản đang gõ; server sẽ báo conflict nếu revision bị thay đổi.
 // Rẽ nhánh nếu !dirty||snapshot.current?.id!==route.params.id. | Thực hiện tính biểu thức snapshot.current=fresh.
 if(!dirty||snapshot.current?.id!==route.params.id)snapshot.current=fresh
 // Khai báo place: chọn giữa hai giá trị theo điều kiện dirty.
 const place=dirty?snapshot.current:fresh
 // Rẽ nhánh nếu !place. | Trả cây giao diện của component để React hiển thị. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 if(!place)return <Frame><Feedback state={state}/>{!state.loading&&<Text>{t('error_notFound')}</Text>}</Frame>
 // Khai báo select: khai báo callback (code:Language)=>{const apply=()=>{setDirty(false). | Khai báo apply: khai báo callback ()=>{setDirty(false). | Cập nhật trạng thái qua setDirty(false). | Cập nhật trạng thái qua setLanguage(code). | Rẽ nhánh nếu !dirty. | Thực hiện Gọi apply(). | Thực hiện Gọi Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:LANGUAGES.fin. | Gán thuộc tính text: Gọi t('cancel'). | Gán thuộc tính style: chuỗi 'cancel'. | Gán thuộc tính text: đọc LANGUAGES.find(l=>l.code===code)?.label từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính onPress: sử dụng apply làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
 const select=(code:Language)=>{const apply=()=>{setDirty(false);setLanguage(code)};if(!dirty)apply();else Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:LANGUAGES.find(l=>l.code===code)?.label,onPress:apply}])}
 // TẠI SAO (select): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
 // liệu.
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <Frame><PageHeader title={place.record.canonicalTitle} description={t('editorH`: Trả cây giao diện của component để React hiển thị. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính description: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<View style={styles.row}><StatusBadge workflow={place.workflow}/><Text style={styles.`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính workflow: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<LanguageTabs value={language} onChange={select}/>`: Dựng LanguageTabs. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<View style={styles.notice}><Text style={[styles.muted,{flex:1}]}>{t('mockMedia')}</T`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1.
  * DÒNG `<ContentForm key={place.id+language+place.revision} place={place} language={language}`: Dựng ContentForm. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính language: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính dirty: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính setDirty: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</Frame>`: Đóng phần giao diện Frame.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <Frame><PageHeader title={place.record.canonicalTitle} description={t('editorHint')}/>
  <View style={styles.row}><StatusBadge workflow={place.workflow}/><Text style={styles.muted}>{t('revision')} {place.revision}</Text></View>
  <LanguageTabs value={language} onChange={select}/>
  <View style={styles.notice}><Text style={[styles.muted,{flex:1}]}>{t('mockMedia')}</Text></View>
  <ContentForm key={place.id+language+place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty}/>
 </Frame>
}
// TẠI SAO (ContentEditorScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được
// gọi qua lớp dùng chung.
// CHỨC NĂNG: Biên tập một bản ngôn ngữ của di tích hiện tại.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ContentForm({place,language,dirty,setDirty}). Component hàm nhận props và dựng phần giao diện ContentForm. | Khai báo place, kiểu ManagedPlace. | Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác. | Khai báo dirty, kiểu boolean. | Khai báo setDirty, kiểu (v:boolean)=>void.
function ContentForm({place,language,dirty,setDirty}:{place:ManagedPlace;language:Language;dirty:boolean;setDirty:(v:boolean)=>void}){
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo text: đọc place.record.content[language] từ đối tượng/mảng để dùng tại bước hiện tại.
 const state=useAdmin(),t=useAdminText(),text=place.record.content[language]
 // CHỨC NĂNG: Tên/tiêu đề đang được nhập trong form. Phần mô tả ngắn đang được nhập trong form. Bài
 // thuyết minh đang được biên tập. Địa chỉ đang được nhập trong form.
 // Khai báo [title,setTitle]: useState(text?.title??'') giữ trạng thái qua các lần render.
 const [title,setTitle]=useState(text?.title??''),[summary,setSummary]=useState(text?.summary??''),[body,setBody]=useState(text?.body??''),[address,setAddress]=useState(text?.address??'')
 // CHỨC NĂNG: Nguồn audio đang chọn; khi lưu mới trở thành dữ liệu của bản ghi.
 // Khai báo [audioUrl,setAudioUrl]: useState(text?.audio?.url.startsWith('media:')||text?.audio?.url.startsWith('demo:')||text?.a) giữ trạng thái qua các lần render.
 const [audioUrl,setAudioUrl]=useState(text?.audio?.url.startsWith('media:')||text?.audio?.url.startsWith('demo:')||text?.audio?.url.startsWith('narration:')?'':text?.audio?.url??'')
 // Thực hiện Gọi useUnsaved(dirty).
 useUnsaved(dirty)
 // Khai báo change: khai báo callback (setter:(s:string)=>void)=>(s:string)=>{setDirty(true). | Cập nhật trạng thái qua setDirty(true). | Thực hiện Gọi setter(s).
 const change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)},disabled=state.busy||place.workflow==='archived'
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={{gap:16}}><Feedback state={state}/>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 16. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<View style={styles.card}><SectionHeading title={t('basicInfo')} icon="document-text-`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('title')} value={title} onChange={change(setTitle)}/><Field label={t(`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính multiline: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('address')} value={address} onChange={change(setAddress)}/><Field lab`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính multiline: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={styles.card}><SectionHeading title={t('mediaSection')} icon="musical-not`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Field label={t('audio')} value={audioUrl.startsWith('data:')?t('localFile'):audioUrl`: Dựng Field. | Thuộc tính label: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính editable: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
  * DÒNG `<LocalMediaPicker kind="audio" onPick={value=>{setAudioUrl(value);setDirty(true)}}/>`: Dựng LocalMediaPicker. | Thuộc tính kind: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPick: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Cập nhật trạng thái qua setAudioUrl(value). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `{audioUrl.startsWith('data:')&&<Action title={t('clearFile')} onPress={()=>{setAudioU`: Đưa biểu thức JavaScript audioUrl.startsWith('data:')&&<Action title={t('clearFile')} onPress={()=>{setAudioUrl(''). | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback. | Cập nhật trạng thái qua setAudioUrl(''). | Cập nhật trạng thái qua setDirty(true).
  * DÒNG `{text?.audio&&<AudioPreview url={text.audio.url} title={text.title}/>}`: Đưa biểu thức JavaScript text?.audio&&<AudioPreview url={text.audio.url} title={text.title}/> vào JSX. | Thuộc tính url: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-o`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Action title={t('save')} icon="save-outline" variant="primary" disabled={disabled} o`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.run(()=>state.service.saveContent({id:place.id,language,expectedRevision:place. làm giá trị của bước hiện tại. | Gán thuộc tính id: đọc place.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Đặt trường language bằng giá trị của biến cùng tên. | Gán thuộc tính expectedRevision: đọc place.revision từ đối tượng/mảng để dùng tại bước hiện tại. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Đặt trường title bằng giá trị của biến cùng tên. | Đặt trường summary bằng giá trị của biến cùng tên. | Đặt trường address bằng giá trị của biến cùng tên. | Đặt trường body bằng giá trị của biến cùng tên. | Gán thuộc tính audioUrl: tính biểu thức audioUrl.trim()||undefined. | Rẽ nhánh nếu ok. | Cập nhật trạng thái qua setDirty(false).
  * DÒNG `<Action title={t('translate')} disabled={disabled||dirty||language==='vi'} onPress={(`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.run(()=>state.service.translate(place.id,language,place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `<Action title={t('prepare')} disabled={disabled||dirty||!text?.body} onPress={()=>{vo`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.run(()=>state.service.generateAudio(place.id,language,place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `<Action title={t('submit')} icon="paper-plane-outline" disabled={disabled||dirty||!['`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void state.run(()=>state.service.submit(place.id,place.revision)) làm giá trị của bước hiện tại.
  * DÒNG `{!!place.reviewNote&&<Text style={styles.text}>{place.reviewNote}</Text>}`: Đưa biểu thức JavaScript !!place.reviewNote&&<Text style={styles.text}>{place.reviewNote}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={{gap:16}}><Feedback state={state}/>
  <View style={styles.card}><SectionHeading title={t('basicInfo')} icon="document-text-outline"/>
  <Field label={t('title')} value={title} onChange={change(setTitle)}/><Field label={t('summary')} value={summary} onChange={change(setSummary)} multiline/>
  <Field label={t('address')} value={address} onChange={change(setAddress)}/><Field label={t('body')} value={body} onChange={change(setBody)} multiline/>
  </View>
  <View style={styles.card}><SectionHeading title={t('mediaSection')} icon="musical-notes-outline"/>
  <Field label={t('audio')} value={audioUrl.startsWith('data:')?t('localFile'):audioUrl} editable={!audioUrl.startsWith('data:')} onChange={change(setAudioUrl)}/>
  <LocalMediaPicker kind="audio" onPick={value=>{setAudioUrl(value);setDirty(true)}}/>
  {audioUrl.startsWith('data:')&&<Action title={t('clearFile')} onPress={()=>{setAudioUrl('');setDirty(true)}}/>}
  {text?.audio&&<AudioPreview url={text.audio.url} title={text.title}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={disabled} onPress={()=>{void state.run(()=>state.service.saveContent({id:place.id,language,expectedRevision:place.revision,title,summary,address,body,audioUrl:audioUrl.trim()||undefined})).then(ok=>{if(ok)setDirty(false)})}}/>
  <Action title={t('translate')} disabled={disabled||dirty||language==='vi'} onPress={()=>{void state.run(()=>state.service.translate(place.id,language,place.revision))}}/>
  <Action title={t('prepare')} disabled={disabled||dirty||!text?.body} onPress={()=>{void state.run(()=>state.service.generateAudio(place.id,language,place.revision))}}/>
  <Action title={t('submit')} icon="paper-plane-outline" disabled={disabled||dirty||!['draft','changes'].includes(place.workflow)} onPress={()=>{void state.run(()=>state.service.submit(place.id,place.revision))}}/>
  {!!place.reviewNote&&<Text style={styles.text}>{place.reviewNote}</Text>}
  </View>
 </View>
}
// TẠI SAO (ContentForm): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
/* CÁCH KIỂM TRA: Lưu body mới bỏ audio cũ; tác vụ sai revision báo conflict, không ghi đè. */
