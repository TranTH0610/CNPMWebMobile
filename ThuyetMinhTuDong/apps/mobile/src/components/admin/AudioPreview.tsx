/**
 * FILE NÀY LÀM GÌ
 * Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử
 * audio của trình duyệt.
 *
 * VỊ TRÍ: apps/mobile/src/components/admin/AudioPreview.tsx
 * DÙNG BỞI: apps/mobile/src/components/admin/AdminUI.tsx.
 * PHỤ THUỘC: react; react-native; @react-navigation/native; @react-native-community/slider;
 * @expo/vector-icons; @travelguide/visitor-core; @travelguide/admin-core/react;
 * ../../services/journeyAdapters; ../../theme
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
// Nhập các thành phần từ 'react-native'.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
// Nhập các thành phần từ '@react-navigation/native'.
import { useFocusEffect } from '@react-navigation/native'
// Nhập các thành phần từ '@react-native-community/slider'.
import Slider from '@react-native-community/slider'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { PreviewController } from '@travelguide/visitor-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../services/journeyAdapters'.
import { journeyAdapters } from '../../services/journeyAdapters'
// Nhập các thành phần từ '../../theme'.
import { colors } from '../../theme'

// Khai báo clock: khai báo callback (seconds:number)=>{ const safe=Number.isFinite(seconds)?Math.max(0,Math.flo.
const clock=(seconds:number)=>{
  // Khai báo safe: chọn giữa hai giá trị theo điều kiện Number.isFinite(seconds).
  const safe=Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return Math.floor(safe/60)+':'+(safe%60).toString().padStart(2,'0')`: Trả kết quả: tính biểu thức Math.floor(safe/60)+':'+(safe%60).toString().padStart(2,'0').
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return Math.floor(safe/60)+':'+(safe%60).toString().padStart(2,'0')
}
// TẠI SAO (clock): Thời gian audio là số giây, nhưng người dùng cần cách đọc phút và giây; dữ
// liệu lỗi không được tạo nhãn NaN.
// CHỨC NĂNG: Nghe thử bản thu trong biên tập/kiểm duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AudioPreview({url,title}). Component hàm nhận props và dựng phần giao diện AudioPreview. | Khai báo url, kiểu string. | Khai báo title, kiểu string.
export function AudioPreview({url,title}:{url:string;title:string}) {
  // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t=useAdminText()
  // CHỨC NĂNG: Giữ cùng player khi form render/poll, không mở lại khi pause.
  // Khai báo controller: useMemo lưu kết quả theo mảng phụ thuộc.
  const controller=useMemo(()=>new PreviewController(()=>journeyAdapters.open(url,title)),[url,title])
  // CHỨC NĂNG: Đăng ký kho trạng thái của controller để UI cập nhật theo audio thật, không tự chạy
  // đồng hồ giả.
  // Khai báo state: useSyncExternalStore đăng ký kho trạng thái bên ngoài React và đọc snapshot để giao diện theo đúng controller.
  const state=useSyncExternalStore(controller.subscribe,controller.snapshot,controller.snapshot)
  // CHỨC NĂNG: Giá trị đang kéo/đang sửa, chưa áp dụng vào dữ liệu chính.
  // Khai báo [draft,setDraft]: useState(undefined) giữ trạng thái qua các lần render.
  const [draft,setDraft]=useState<number|undefined>(undefined)
  // CHỨC NĂNG: Nhóm điều khiển phụ đang mở, ví dụ âm lượng hoặc tốc độ.
  // Khai báo [panel,setPanel]: useState(undefined) giữ trạng thái qua các lần render.
  const [panel,setPanel]=useState<'volume'|'rate'|undefined>(undefined)
  // XỬ LÝ: Nạp metadata để hiện tổng thời gian trước khi nghe; rời màn thì đóng.
  // CHỨC NĂNG: Chuẩn bị nghe thử khi màn được mở.
  // XỬ LÝ: Rời màn thì đóng controller; form render lại không tự tạo một phiên phát mới.
  // DÒNG NÀY LÀM GÌ: Khi màn nghe thử được focus, gọi controller.prepare() để nạp thông tin bản
  // thu.
  // CÁCH HOẠT ĐỘNG: Callback của useCallback phụ thuộc controller; hàm return gọi
  // controller.close() khi mất focus hoặc thay callback.
  // Đăng ký tác vụ theo lúc màn hình được focus. | Thực hiện sử dụng void controller.prepare() làm giá trị của bước hiện tại. | Trả kết quả: khai báo callback ()=>controller.close().
  useFocusEffect(useCallback(()=>{void controller.prepare();return()=>controller.close()},[controller]))
  // TẠI SAO: Mở form cần biết thời lượng nhưng không tự phát; rời màn phải đóng nguồn để không còn
  // âm thanh cũ.
  // Khai báo busy: tính biểu thức state.status==='loading'.
  const busy=state.status==='loading',playing=state.status==='playing'
  // Khai báo canSeek: tính biểu thức state.duration>0&&!busy&&state.status!=='error'.
  const canSeek=state.duration>0&&!busy&&state.status!=='error'
  // Khai báo label: chọn giữa hai giá trị theo điều kiện playing.
  const label=playing?t('previewPause'):state.status==='paused'?t('previewResume'):t('preview')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <View style={styles.box}>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={styles.label}>{t('preview')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={styles.bar}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy}`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onPress={()=>{if(playing)controller.pause();else void controller.play()}}`: Thuộc tính onPress: nối thao tác nhấn với callback. | Rẽ nhánh nếu playing. | Thực hiện controller.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện sử dụng void controller.play() làm giá trị của bước hiện tại.
   * DÒNG `style={({pressed})=>[styles.icon,pressed&&styles.pressed,busy&&styles.disabled]}>`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{busy?<ActivityIndicator size="small" color={colors.primary}/>:<Ionicons name={playin`: Đưa biểu thức JavaScript busy?<ActivityIndicator size="small" color={colors.primary}/>:<Ionicons name={playing?'pause':'play'} size={21 vào JSX. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `<Text style={styles.time}>{clock(draft??state.position)} / {clock(state.duration)}</T`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Slider accessibilityLabel={t('previewSeek')} style={styles.seek} minimumValue={0}`: Dựng Slider. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính minimumValue: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `maximumValue={Math.max(state.duration,1)} value={draft??state.position} disabled={!ca`: Thuộc tính maximumValue: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `minimumTrackTintColor={colors.primary} maximumTrackTintColor={colors.border} thumbTin`: Thuộc tính minimumTrackTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính maximumTrackTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính thumbTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSlidingStart={()=>setDraft(state.position)} onValueChange={setDraft}`: Thuộc tính onSlidingStart: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onValueChange: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSlidingComplete={value=>{void controller.seek(value).finally(()=>setDraft(undefined`: Thuộc tính onSlidingComplete: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thực hiện sử dụng void controller.seek(value).finally(()=>setDraft(undefined)) làm giá trị của bước hiện tại.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={t('previewVolume')} accessi`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính expanded: tính biểu thức panel==='volume'.
   * DÒNG `onPress={()=>setPanel(value=>value==='volume'?undefined:'volume')} style={styles.icon`: Thuộc tính onPress: nối thao tác nhấn với callback. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Ionicons name={state.volume===0?'volume-mute':'volume-high'} size={20} color={colors`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={t('previewMore')} accessibi`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính expanded: tính biểu thức panel==='rate'.
   * DÒNG `onPress={()=>setPanel(value=>value==='rate'?undefined:'rate')} style={styles.icon}>`: Thuộc tính onPress: nối thao tác nhấn với callback. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Ionicons name="ellipsis-vertical" size={20} color={colors.text}/>`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{panel==='volume'&&<View style={styles.options}>`: Đưa biểu thức JavaScript panel==='volume'&&<View style={styles.options}> <Text style={styles.label}>{t('previewVolume')}</Text> <Slider vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={styles.label}>{t('previewVolume')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Slider accessibilityLabel={t('previewVolume')} style={styles.volume} minimumValue={0`: Dựng Slider. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính minimumValue: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính maximumValue: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `value={state.volume} minimumTrackTintColor={colors.primary} maximumTrackTintColor={co`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính minimumTrackTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính maximumTrackTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `thumbTintColor={colors.primary} onValueChange={value=>controller.setVolume(value)}/>`: Thuộc tính thumbTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onValueChange: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={styles.time}>{Math.round(state.volume*100)}%</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>}`: Đóng phần giao diện View.
   * DÒNG `{panel==='rate'&&<View style={styles.rates}>`: Đưa biểu thức JavaScript panel==='rate'&&<View style={styles.rates}> <Text style={styles.label}>{t('previewRate')}</Text> {[0.75,1,1.25 vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={styles.label}>{t('previewRate')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{[0.75,1,1.25,1.5,2].map(rate=><Pressable key={rate} accessibilityRole="button" acces`: Đưa biểu thức JavaScript [0.75,1,1.25,1.5,2].map(rate=><Pressable key={rate} accessibilityRole="button" accessibilityLabel={t('previewR vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `accessibilityState={{selected:state.rate===rate}} onPress={()=>controller.setRate(rat`: Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính selected: tính biểu thức state.rate===rate. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={[styles.rate,state.rate===rate&&styles.selected]}>`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={[styles.label,state.rate===rate&&{color:colors.white}]}>{rate}×</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `</Pressable>)}`: Đóng phần giao diện Pressable.
   * DÒNG `</View>}`: Đóng phần giao diện View.
   * DÒNG `{state.status==='error'&&<Text accessibilityRole="alert" style={styles.error}>{t('pre`: Đưa biểu thức JavaScript state.status==='error'&&<Text accessibilityRole="alert" style={styles.error}>{t('previewError')}</Text> vào JSX. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <View style={styles.box}>
    <Text style={styles.label}>{t('preview')}</Text>
    <View style={styles.bar}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy}
        onPress={()=>{if(playing)controller.pause();else void controller.play()}}
        style={({pressed})=>[styles.icon,pressed&&styles.pressed,busy&&styles.disabled]}>
        {busy?<ActivityIndicator size="small" color={colors.primary}/>:<Ionicons name={playing?'pause':'play'} size={21} color={colors.text}/>}
      </Pressable>
      <Text style={styles.time}>{clock(draft??state.position)} / {clock(state.duration)}</Text>
      {/* CHỨC NĂNG: Tua MP3 thật khi thả; draft giữ tay kéo không nhảy theo timeupdate.
          XỬ LÝ: Controller giới hạn giá trị, xếp hàng tua và giữ pause khi đang pause. */}
      <Slider accessibilityLabel={t('previewSeek')} style={styles.seek} minimumValue={0}
        maximumValue={Math.max(state.duration,1)} value={draft??state.position} disabled={!canSeek}
        minimumTrackTintColor={colors.primary} maximumTrackTintColor={colors.border} thumbTintColor={colors.primary}
        onSlidingStart={()=>setDraft(state.position)} onValueChange={setDraft}
        onSlidingComplete={value=>{void controller.seek(value).finally(()=>setDraft(undefined))}}/>
      <Pressable accessibilityRole="button" accessibilityLabel={t('previewVolume')} accessibilityState={{expanded:panel==='volume'}}
        onPress={()=>setPanel(value=>value==='volume'?undefined:'volume')} style={styles.icon}>
        <Ionicons name={state.volume===0?'volume-mute':'volume-high'} size={20} color={colors.text}/>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('previewMore')} accessibilityState={{expanded:panel==='rate'}}
        onPress={()=>setPanel(value=>value==='rate'?undefined:'rate')} style={styles.icon}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text}/>
      </Pressable>
    </View>
    {/* CHỨC NĂNG: Loa mở chỉnh âm lượng; dấu ba chấm mở tốc độ như nhóm điều khiển web. */}
    {panel==='volume'&&<View style={styles.options}>
      <Text style={styles.label}>{t('previewVolume')}</Text>
      <Slider accessibilityLabel={t('previewVolume')} style={styles.volume} minimumValue={0} maximumValue={1}
        value={state.volume} minimumTrackTintColor={colors.primary} maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary} onValueChange={value=>controller.setVolume(value)}/>
      <Text style={styles.time}>{Math.round(state.volume*100)}%</Text>
    </View>}
    {panel==='rate'&&<View style={styles.rates}>
      <Text style={styles.label}>{t('previewRate')}</Text>
      {[0.75,1,1.25,1.5,2].map(rate=><Pressable key={rate} accessibilityRole="button" accessibilityLabel={t('previewRate')+' '+rate+'×'}
        accessibilityState={{selected:state.rate===rate}} onPress={()=>controller.setRate(rate)}
        style={[styles.rate,state.rate===rate&&styles.selected]}>
        <Text style={[styles.label,state.rate===rate&&{color:colors.white}]}>{rate}×</Text>
      </Pressable>)}
    </View>}
    {state.status==='error'&&<Text accessibilityRole="alert" style={styles.error}>{t('previewError')}</Text>}
  </View>
}
// TẠI SAO (AudioPreview): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// Khai báo styles: Gọi StyleSheet.create({ box:{gap:10,paddingVertical:12},label:{fontSize:12,fontWeight:'600',co.
const styles=StyleSheet.create({
  // Gán thuộc tính box: tạo object gồm gap, paddingVertical. | Gán thuộc tính gap: giá trị số 10. | Gán thuộc tính paddingVertical: giá trị số 12. | Gán thuộc tính label: tạo object gồm fontSize, fontWeight, color. | Gán thuộc tính fontSize: giá trị số 12. | Gán thuộc tính fontWeight: chuỗi '600'. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  box:{gap:10,paddingVertical:12},label:{fontSize:12,fontWeight:'600',color:colors.text},
  // Gán thuộc tính bar: tạo object gồm flexDirection, alignItems, backgroundColor, borderRadius, paddingHorizontal, minHeight. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 28. | Gán thuộc tính paddingHorizontal: giá trị số 4. | Gán thuộc tính minHeight: giá trị số 54.
  bar:{flexDirection:'row',alignItems:'center',backgroundColor:colors.page,borderRadius:28,paddingHorizontal:4,minHeight:54},
  // Gán thuộc tính icon: tạo object gồm width, minHeight, alignItems, justifyContent, flexShrink. | Gán thuộc tính width: giá trị số 34. | Gán thuộc tính minHeight: giá trị số 46. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính flexShrink: giá trị số 0.
  icon:{width:34,minHeight:46,alignItems:'center',justifyContent:'center',flexShrink:0},
  // Gán thuộc tính time: tạo object gồm fontSize, fontVariant, color. | Gán thuộc tính fontSize: giá trị số 11. | Gán thuộc tính fontVariant: tạo mảng ['tabular-nums']. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính seek: tạo object gồm flex, minWidth, height. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 40. | Gán thuộc tính height: giá trị số 44.
  time:{fontSize:11,fontVariant:['tabular-nums'],color:colors.text},seek:{flex:1,minWidth:40,height:44},
  // Gán thuộc tính options: tạo object gồm flexDirection, alignItems, gap, paddingHorizontal. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 8. | Gán thuộc tính paddingHorizontal: giá trị số 8. | Gán thuộc tính volume: tạo object gồm flex, height. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính height: giá trị số 44.
  options:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:8},volume:{flex:1,height:44},
  // Gán thuộc tính rates: tạo object gồm flexDirection, flexWrap, alignItems, gap. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính flexWrap: chuỗi 'wrap'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 8.
  rates:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8},
  // Gán thuộc tính rate: tạo object gồm minHeight, paddingHorizontal, justifyContent, borderRadius, backgroundColor. | Gán thuộc tính minHeight: giá trị số 42. | Gán thuộc tính paddingHorizontal: giá trị số 12. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính borderRadius: giá trị số 12. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  rate:{minHeight:42,paddingHorizontal:12,justifyContent:'center',borderRadius:12,backgroundColor:colors.page},
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `selected:{backgroundColor:colors.primary},pressed:{opacity:0.7},disabled:{opacity:0.5`: Gán thuộc tính selected: tạo object gồm backgroundColor. | Gán thuộc tính backgroundColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính pressed: tạo object gồm opacity. | Gán thuộc tính opacity: giá trị số 0.7. | Gán thuộc tính disabled: tạo object gồm opacity. | Gán thuộc tính opacity: giá trị số 0.5. | Gán thuộc tính error: tạo object gồm color, fontSize. | Gán thuộc tính color: đọc colors.danger từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 12.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  selected:{backgroundColor:colors.primary},pressed:{opacity:0.7},disabled:{opacity:0.5},error:{color:colors.danger,fontSize:12},
})
/* CÁCH KIỂM TRA: Hiện tổng thời gian khi mở; kéo tua khi pause vẫn pause;
 * loa chỉnh âm lượng thật; ba chấm đổi tốc độ; resume không về giây 0. */
