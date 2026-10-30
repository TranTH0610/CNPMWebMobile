/**
 * FILE NÀY LÀM GÌ
 * Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên kết đến thao
 * tác quản lý.
 *
 * VỊ TRÍ: apps/mobile/src/screens/admin/DashboardScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/AdminNavigator.tsx.
 * PHỤ THUỘC: react; react-native; @expo/vector-icons; @react-navigation/native-stack;
 * @travelguide/admin-core; @travelguide/admin-core/react;
 * @travelguide/visitor-core/presence/react; ../../navigation/adminTypes;
 * ../../services/admin/services; ../../services/presence; ../../components/Action;
 * ../../components/admin/AdminUI; ../../theme
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react'.
import { useMemo, type ComponentProps } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Text, View } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/admin-core'.
import { dashboard } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '@travelguide/visitor-core/presence/react'.
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
// Nhập kiểu dữ liệu từ '../../navigation/adminTypes'.
import type { AdminStack } from '../../navigation/adminTypes'
// Nhập các thành phần từ '../../services/admin/services'.
import { gateClient } from '../../services/admin/services'
// Nhập các thành phần từ '../../services/presence'.
import { adminPresenceClient } from '../../services/presence'
// Nhập các thành phần từ '../../components/Action'.
import { Action } from '../../components/Action'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Frame, Feedback, QuickAction, SectionHeading, styles } from '../../components/admin/AdminUI'
// Nhập các thành phần từ '../../theme'.
import { colors } from '../../theme'

// CHỨC NĂNG: Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên
// kết đến thao tác quản lý.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo DashboardScreen({navigation}). Component hàm nhận props và dựng phần giao diện DashboardScreen.
export function DashboardScreen({navigation}:NativeStackScreenProps<AdminStack,'Dashboard'>) {
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo presence: usePresenceStatistics đọc số liệu phiên qua client, đồng thời cung cấp trạng thái tải/lỗi và thử lại | Khai báo gate: useGateStatistics đọc lượt mở liên kết QR theo hợp đồng riêng, không coi lượt này là số người.
 const state=useAdmin(),t=useAdminText(),presence=usePresenceStatistics(adminPresenceClient),gate=useGateStatistics(gateClient)
 // CHỨC NĂNG: Tính số liệu quản trị khi document thay đổi, không tính lại chỉ vì UI render.
 // Khai báo metrics: useMemo lưu kết quả theo mảng phụ thuộc.
 const metrics=useMemo(()=>state.data?dashboard(state.data):null,[state.data])
 // Khai báo icons: tạo object gồm active, gateToday, places, pending. | Gán thuộc tính active: chuỗi 'people-outline'. | Gán thuộc tính gateToday: chuỗi 'qr-code-outline'. | Gán thuộc tính places: chuỗi 'business-outline'. | Gán thuộc tính pending: chuỗi 'time-outline'.
 const icons:Record<'active'|'gateToday'|'places'|'pending',ComponentProps<typeof Ionicons>['name']>={active:'people-outline',gateToday:'qr-code-outline',places:'business-outline',pending:'time-outline'}
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <Frame>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `<View style={styles.hero}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<Text style={styles.brand}>HUEGUIDE</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<Text style={styles.heroTitle}>{t('dashboard')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `<Text style={styles.heroText}>{t('overviewHint')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `<Feedback state={state}/>`: Dựng Feedback. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<View style={[styles.row,{alignItems:'stretch',gap:12}]}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính alignItems: chuỗi 'stretch'. | Gán thuộc tính gap: giá trị số 12.
  * DÒNG `{metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={ke`: Đưa biểu thức JavaScript metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={key} style={[styles.metric,k vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính backgroundColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `<View style={[styles.metricIcon,key==='active'&&{backgroundColor:colors.playerControl`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính backgroundColor: đọc colors.playerControl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Text style={[styles.metricLabel,key==='active'&&{color:colors.white}]}>{t(key==='pen`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `<Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?pr`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  * DÒNG `</View>)}`: Đóng phần giao diện View.
  * DÒNG `</View>`: Đóng phần giao diện View.
  * DÒNG `{presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRol`: Đưa biểu thức JavaScript presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceErro vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `<Text style={styles.muted}>{t('gateHint')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `{gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</T`: Đưa biểu thức JavaScript gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</Text><Action title={t('retr vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `<SectionHeading title={t('quickActions')} icon="grid-outline"/>`: Dựng SectionHeading. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-o`: Dựng QuickAction. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính description: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `<QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-che`: Dựng QuickAction. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính description: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `<Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `<View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.pr`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính flex: giá trị số 1.
  * DÒNG `</Frame>`: Đóng phần giao diện Frame.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <Frame>
  <View style={styles.hero}>
   <Text style={styles.brand}>HUEGUIDE</Text>
   <Text style={styles.heroTitle}>{t('dashboard')}</Text>
   <Text style={styles.heroText}>{t('overviewHint')}</Text>
  </View>
  <Feedback state={state}/>
  {/* CHỨC NĂNG: Active lấy API RAM, ba chỉ số khác lấy service cũ; không giả lập số. */}
  <View style={[styles.row,{alignItems:'stretch',gap:12}]}>
   {metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={key} style={[styles.metric,key==='active'&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
    <View style={[styles.metricIcon,key==='active'&&{backgroundColor:colors.playerControl}]}><Ionicons name={icons[key]} size={19} color={key==='active'?colors.white:colors.primary}/></View>
    <Text style={[styles.metricLabel,key==='active'&&{color:colors.white}]}>{t(key==='pending'?'status_submitted':key)}</Text>
    <Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?presence.stats?.active??'—':key==='gateToday'?gate.stats?.today??'—':metrics[key]}</Text>
   </View>)}
  </View>
  {presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceError')}</Text><Action title={t('retry')} icon="refresh-outline" onPress={presence.retry}/></View>:!presence.stats?<Text style={styles.muted}>{t('loading')}</Text>:null}
  <Text style={styles.muted}>{t('gateHint')}</Text>
  {gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</Text><Action title={t('retry')} onPress={gate.retry}/></View>}
  <SectionHeading title={t('quickActions')} icon="grid-outline"/>
  <QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-outline" onPress={()=>navigation.navigate('AdminPlaces')}/>
  <QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-checkmark-outline" onPress={()=>navigation.navigate('Reviews')}/>
  <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
  <View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('analyticsHint')}</Text></View>
 </Frame>
}
// TẠI SAO (DashboardScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
