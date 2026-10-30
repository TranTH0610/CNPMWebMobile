/**
 * FILE NÀY LÀM GÌ
 * Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh.
 *
 * VỊ TRÍ: apps/mobile/src/screens/JourneyScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/MainTabs.tsx; apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: ../components/VisitorMap; react-native; react-native-safe-area-context;
 * @react-navigation/native; @react-navigation/native-stack; @travelguide/visitor-core;
 * ../i18n/index; ../hooks/useVisitor; ../hooks/useJourney; @travelguide/visitor-core/journey/data;
 * @travelguide/visitor-core/journey; ../components/index; ../navigation/types
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../components/VisitorMap'.
import { VisitorMap } from '../components/VisitorMap'
// Nhập các thành phần từ 'react-native'.
import { FlatList, Linking, Text, View } from 'react-native'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập các thành phần từ '@react-navigation/native'.
import { useNavigation, useRoute } from '@react-navigation/native'
// Nhập kiểu dữ liệu từ '@react-navigation/native'.
import type { RouteProp } from '@react-navigation/native'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { publishedText } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ '@travelguide/visitor-core/journey/data'.
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
// Nhập các thành phần từ '@travelguide/visitor-core/journey'.
import { routeAvailable } from '@travelguide/visitor-core/journey'
// Nhập các thành phần từ '../components/index'.
import { Action, ui } from '../components/index'
// Nhập kiểu dữ liệu từ '../navigation/types'.
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung
// thuyết minh.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo JourneyScreen(). Component hàm nhận props và dựng phần giao diện JourneyScreen.
export function JourneyScreen() {
  // Khai báo { engine, state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  // Khai báo navigation: useNavigation() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
  const navigation = useNavigation<NativeStackNavigationProp<VisitorStack>>()
  // Khai báo route: Gọi useRoute<RouteProp<VisitorStack, 'Journey'>>().
  const route = useRoute<RouteProp<VisitorStack, 'Journey'>>()
  // Khai báo selected: đọc route.params?.placeId từ đối tượng/mảng để dùng tại bước hiện tại.
  const selected = route.params?.placeId
  // Khai báo open: khai báo callback (id: string) => navigation.navigate('Detail', { placeId: id }). | Gán thuộc tính placeId: sử dụng id làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const open = (id: string) => navigation.navigate('Detail', { placeId: id })
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <SafeAreaView style={ui.page} edges={['left', 'right']}>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính edges: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<FlatList data={state.places} keyExtractor={place => place.id} contentContainerStyle=`: Dựng FlatList. | Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách. | Thuộc tính keyExtractor: lấy khóa ổn định từ dữ liệu thay vì vị trí mảng. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `ListHeaderComponent={<>`: Thuộc tính ListHeaderComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={ui.title}>{t('jTitle')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.muted}>{t('jReference')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Action title={t(state.gps ? 'jGpsOff' : 'jGpsOn')} onPress={() => { void engine.gps(`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void engine.gps(!state.gps) làm giá trị của bước hiện tại.
   * DÒNG `{state.error && <Text style={ui.muted}>{t(state.error)}</Text>}`: Đưa biểu thức JavaScript state.error && <Text style={ui.muted}>{t(state.error)}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{state.gps && !state.suggestedId && <Text style={ui.muted}>{t('jNoNearby')}</Text>}`: Đưa biểu thức JavaScript state.gps && !state.suggestedId && <Text style={ui.muted}>{t('jNoNearby')}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<VisitorMap selected={selected} onOpen={open} />`: Dựng VisitorMap. | Thuộc tính selected: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onOpen: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={ui.heading}>{t('jRoutes')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{engine.ports.routes.map(r => <View key={r.id} style={ui.card}>`: Đưa biểu thức JavaScript engine.ports.routes.map(r => <View key={r.id} style={ui.card}> <Text style={ui.heading}>{r.title[language]}</T vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.heading}>{r.title[language]}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{!r.verified && <Text style={ui.muted}>{t('jPreview')}</Text>}`: Đưa biểu thức JavaScript !r.verified && <Text style={ui.muted}>{t('jPreview')}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Action title={t('jUseRoute')} disabled={!routeAvailable(r, state.places)} onPress={(`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `{!routeAvailable(r, state.places) && <Text style={ui.muted}>{t('jRouteInvalid')}</Tex`: Đưa biểu thức JavaScript !routeAvailable(r, state.places) && <Text style={ui.muted}>{t('jRouteInvalid')}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{state.routeId === r.id && r.stops.map((id, index) => <Action key={id}`: Đưa biểu thức JavaScript state.routeId === r.id && r.stops.map((id, index) => <Action key={id} title={(index + 1) + '. ' + (publishedTe vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `title={(index + 1) + '. ' + (publishedText(state.places.find(p => p.id === id)!, lang`: Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `</View>)}`: Đóng phần giao diện View.
   * DÒNG `<Action title={t('jSkipRoute')} onPress={() => engine.selectRoute()} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `<Text style={ui.muted}>{t('jWalkingPending')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.heading}>{t('allPlaces')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</>}`: Đưa biểu thức JavaScript <> <Text style={ui.title}>{t('jTitle')}</Text> <Text style={ui.muted}>{t('jReference')}</Text> <Action title={ vào JSX.
   * DÒNG `renderItem={({ item }) => <View style={ui.card}>`: Thuộc tính renderItem: quy định cách dựng một phần tử danh sách. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Action title={publishedText(item, language)?.title ?? item.canonicalTitle} onPress={`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `{mapPointFor(item)?.source && <Action title={t('jSource')} onPress={() => { void Link`: Đưa biểu thức JavaScript mapPointFor(item)?.source && <Action title={t('jSource')} onPress={() => { void Linking.openURL(mapPointFor(it vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void Linking.openURL(mapPointFor(item)!.source) làm giá trị của bước hiện tại.
   * DÒNG `</View>} />`: Đóng phần giao diện View.
   * DÒNG `</SafeAreaView>`: Đóng phần giao diện SafeAreaView.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <SafeAreaView style={ui.page} edges={['left', 'right']}>
    <FlatList data={state.places} keyExtractor={place => place.id} contentContainerStyle={ui.content}
      ListHeaderComponent={<>
        <Text style={ui.title}>{t('jTitle')}</Text>
        <Text style={ui.muted}>{t('jReference')}</Text>
        <Action title={t(state.gps ? 'jGpsOff' : 'jGpsOn')} onPress={() => { void engine.gps(!state.gps) }} />
        {state.error && <Text style={ui.muted}>{t(state.error)}</Text>}
        {state.gps && !state.suggestedId && <Text style={ui.muted}>{t('jNoNearby')}</Text>}
        {/* CHỨC NĂNG: Marker lấy từ OSM; bấm marker mở chi tiết native.
            XỬ LÝ: Không vẽ đường thẳng giả thành lối đi qua tường thành. */}
        <VisitorMap selected={selected} onOpen={open} />
        <Text style={ui.heading}>{t('jRoutes')}</Text>
        {engine.ports.routes.map(r => <View key={r.id} style={ui.card}>
          <Text style={ui.heading}>{r.title[language]}</Text>
          {!r.verified && <Text style={ui.muted}>{t('jPreview')}</Text>}
          <Action title={t('jUseRoute')} disabled={!routeAvailable(r, state.places)} onPress={() => engine.selectRoute(r.id)} />
          {!routeAvailable(r, state.places) && <Text style={ui.muted}>{t('jRouteInvalid')}</Text>}
          {state.routeId === r.id && r.stops.map((id, index) => <Action key={id}
            title={(index + 1) + '. ' + (publishedText(state.places.find(p => p.id === id)!, language)?.title ?? id)} onPress={() => open(id)} />)}
        </View>)}
        <Action title={t('jSkipRoute')} onPress={() => engine.selectRoute()} />
        <Text style={ui.muted}>{t('jWalkingPending')}</Text>
        <Text style={ui.heading}>{t('allPlaces')}</Text>
      </>}
      renderItem={({ item }) => <View style={ui.card}>
        <Action title={publishedText(item, language)?.title ?? item.canonicalTitle} onPress={() => open(item.id)} />
        {mapPointFor(item)?.source && <Action title={t('jSource')} onPress={() => { void Linking.openURL(mapPointFor(item)!.source) }} />}
      </View>} />
  </SafeAreaView>
}
// TẠI SAO (JourneyScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
