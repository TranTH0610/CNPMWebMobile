/**
 * FILE NÀY LÀM GÌ
 * Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp trên máy chủ
 * thật.
 *
 * VỊ TRÍ: apps/mobile/src/components/admin/LocalMediaPicker.tsx
 * DÙNG BỞI: apps/mobile/src/screens/admin/ContentEditorScreen.tsx;
 * apps/mobile/src/screens/admin/PlaceFormScreen.tsx.
 * PHỤ THUỘC: react; react-native; expo-document-picker; expo-file-system/legacy;
 * @travelguide/admin-core/react; ../Action; ./AdminUI
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useEffect,useRef,useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Text,View } from 'react-native'
// Nhập các thành phần từ 'expo-document-picker'.
import * as DocumentPicker from 'expo-document-picker'
// Nhập các thành phần từ 'expo-file-system/legacy'.
import * as FileSystem from 'expo-file-system/legacy'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../Action'.
import { Action } from '../Action'
// Nhập các thành phần từ './AdminUI'.
import { styles } from './AdminUI'
// CHỨC NĂNG: Chọn tệp từ thiết bị theo giới hạn của bản FE; không phải dịch vụ upload và lưu tệp
// trên máy chủ thật.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo LocalMediaPicker({kind,onPick}). Component hàm nhận props và dựng phần giao diện LocalMediaPicker. | Khai báo kind, kiểu 'image'|'audio'. | Khai báo onPick, kiểu (value:string)=>void.
export function LocalMediaPicker({kind,onPick}:{kind:'image'|'audio';onPick:(value:string)=>void}){
 // CHỨC NĂNG: Đánh dấu thao tác đang chạy để hạn chế bấm gửi lặp. Trạng thái lỗi để giao diện hiển
 // thị thông báo và cho thử lại.
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [busy,setBusy]: useState(false) giữ trạng thái qua các lần render.
 const t=useAdminText(),[busy,setBusy]=useState(false),[error,setError]=useState(false),alive=useRef(true)
 // DÒNG NÀY LÀM GÌ: Đánh dấu component đang tồn tại; cleanup đổi alive.current thành false.
 // CÁCH HOẠT ĐỘNG: Các callback chọn/đọc tệp kiểm tra cờ này trước khi trả kết quả về UI.
 // KHI NÀO CHẠY: Theo vòng mount của component; mảng [] không theo dõi props/state. Cleanup chạy
 // khi rời component.
 // Đăng ký useEffect để thực hiện tác vụ sau render. | Thực hiện tính biểu thức alive.current=true. | Trả kết quả: khai báo callback ()=>{alive.current=false}. | Thực hiện tính biểu thức alive.current=false.
 useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[])
 // TẠI SAO: Hộp chọn tệp có thể trả kết quả sau khi người dùng đã rời màn; không nên cập nhật
 // component đã đóng.
 // Khai báo pick: khai báo callback async()=>{ setBusy(true).
 const pick=async()=>{
  // Cập nhật trạng thái qua setBusy(true). | Cập nhật trạng thái qua setError(false).
  setBusy(true);setError(false)
  // Bắt đầu vùng try.
  try{
   // Khai báo result: await chờ Gọi DocumentPicker.getDocumentAsync({type:kind==='image'?['image/jpeg','image/png','image/webp. | Gán thuộc tính type: chọn giữa hai giá trị theo điều kiện kind==='image'. | Gán thuộc tính multiple: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính copyToCacheDirectory: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   const result=await DocumentPicker.getDocumentAsync({type:kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/wav','audio/ogg'],multiple:false,copyToCacheDirectory:true})
   // Rẽ nhánh nếu result.canceled. | Thoát hàm hiện tại ngay.
   if(result.canceled)return
   // Khai báo asset: đọc result.assets[0] từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo mime: chọn giữa hai giá trị theo điều kiện asset.mimeType==='audio/x-wav'.
   const asset=result.assets[0],mime=asset.mimeType==='audio/x-wav'?'audio/wav':asset.mimeType
   // Khai báo allowed: chọn giữa hai giá trị theo điều kiện kind==='image'.
   const allowed=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp3','audio/wav','audio/ogg']
   // Khai báo info: await chờ Gọi FileSystem.getInfoAsync(asset.uri).
   const info=await FileSystem.getInfoAsync(asset.uri)
   // Gán size bằng asset.size; nếu null hoặc undefined thì dùng (info.exists?info.size:Infinity).
   const size=asset.size??(info.exists?info.size:Infinity)
   // Rẽ nhánh nếu !mime||!allowed.includes(mime)||size>1048576. | Ném Error('invalid').
   if(!mime||!allowed.includes(mime)||size>1048576)throw Error('invalid')
   // Khai báo base64: await chờ Gọi FileSystem.readAsStringAsync(asset.uri,{encoding:FileSystem.EncodingType.Base64}). | Gán thuộc tính encoding: đọc FileSystem.EncodingType.Base64 từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   const base64=await FileSystem.readAsStringAsync(asset.uri,{encoding:FileSystem.EncodingType.Base64})
   // Rẽ nhánh nếu base64.length>1400000. | Ném Error('invalid').
   if(base64.length>1400000)throw Error('invalid')
   /* GIẢI THÍCH TỪNG DÒNG:
    * DÒNG `if(alive.current)onPick('data:'+mime+';base64,'+base64)`: Rẽ nhánh nếu alive.current. | Thực hiện Gọi onPick('data:'+mime+'.
    * DÒNG `}catch{if(alive.current)setError(true)}finally{if(alive.current)setBusy(false)}`: Bắt đầu vùng try. | Rẽ nhánh nếu alive.current. | Cập nhật trạng thái qua setError(true). | Cập nhật trạng thái qua setBusy(false).
    * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    */
   if(alive.current)onPick('data:'+mime+';base64,'+base64)
  }catch{if(alive.current)setError(true)}finally{if(alive.current)setBusy(false)}
 }
 // TẠI SAO (pick): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
 // phải xử lý dữ liệu sai như thành công.
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <View style={{gap:8}}><Action title={t(kind==='image'?'pickImage':'pickAudio')`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: giá trị số 8. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void pick() làm giá trị của bước hiện tại.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <View style={{gap:8}}><Action title={t(kind==='image'?'pickImage':'pickAudio')} disabled={busy} onPress={()=>{void pick()}}/><Text style={styles.muted}>{t('fileHint')}</Text>{error&&<Text style={styles.error}>{t('mediaError')}</Text>}</View>
}
// TẠI SAO (LocalMediaPicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa
// giao diện tại một nơi.
/* CÁCH KIỂM TRA: Hủy không lỗi; tệp >1MB bị chặn; lưu bản nháp rồi mở lại vẫn có file. */
