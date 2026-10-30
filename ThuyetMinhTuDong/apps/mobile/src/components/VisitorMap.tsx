/**
 * FILE NÀY LÀM GÌ
 * Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền
 * tảng.
 *
 * VỊ TRÍ: apps/mobile/src/components/VisitorMap.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts; apps/mobile/src/screens/JourneyScreen.tsx.
 * PHỤ THUỘC: ./Action; ../theme; react-native; react-native-maps; @travelguide/visitor-core;
 * ../i18n/index; ../hooks/useVisitor; ../hooks/useJourney; @travelguide/visitor-core/journey/data
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ './Action'.
import { Action } from './Action'
// Nhập các thành phần từ '../theme'.
import { spacing } from '../theme'
// Nhập các thành phần từ 'react-native'.
import { Linking, Platform, StyleSheet } from 'react-native'
// Nhập các thành phần từ 'react-native-maps'.
import MapView from 'react-native-maps'
// Nhập các thành phần từ 'react-native-maps'.
import { Marker } from 'react-native-maps'
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

// CHỨC NĂNG: Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành
// trình của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo VisitorMap({ selected, onOpen }). Component hàm nhận props và dựng phần giao diện VisitorMap. | Khai báo selected không bắt buộc, kiểu string. | Khai báo onOpen, kiểu (id: string) => void.
export function VisitorMap({ selected, onOpen }: { selected?: string; onOpen: (id: string) => void }) {
 // Khai báo { state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
 const { state } = useJourney(), { language } = useVisitor(), t = useText()
 // Khai báo selectedPlace: state.places.find lấy phần tử đầu tiên phù hợp.
 const selectedPlace = state.places.find(place => place.id === selected)
 // Khai báo point: chọn giữa hai giá trị theo điều kiện selectedPlace.
 const point = selectedPlace ? mapPointFor(selectedPlace) : undefined
 // Khai báo open: sử dụng onOpen làm giá trị của bước hiện tại.
 const open = onOpen
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return (__DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_K`: Trả kết quả: sử dụng (__DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? <MapVie làm giá trị của bước hiện tại. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
  * DÒNG `key={selected ?? 'all'} initialRegion={{ latitude: point?.lat ?? 16.468, longitude: p`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính initialRegion: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính latitude: tính biểu thức point?.lat ?? 16.468. | Gán thuộc tính longitude: tính biểu thức point?.lng ?? 107.578.
  * DÒNG `latitudeDelta: point ? 0.003 : 0.012, longitudeDelta: point ? 0.003 : 0.012 }}>`: Gán thuộc tính latitudeDelta: chọn giữa hai giá trị theo điều kiện point. | Gán thuộc tính longitudeDelta: chọn giữa hai giá trị theo điều kiện point.
  * DÒNG `{state.places.map(place => { const p = mapPointFor(place); return p ? <Marker key={pl`: Đưa biểu thức JavaScript state.places.map(place => { const p = mapPointFor(place). | Khai báo p: Gọi mapPointFor(place). | Trả kết quả: chọn giữa hai giá trị theo điều kiện p. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
  * DÒNG `coordinate={{ latitude: p.lat, longitude: p.lng }} title={publishedText(place, langua`: Thuộc tính coordinate: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính latitude: đọc p.lat từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính longitude: đọc p.lng từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
  * DÒNG `onPress={() => open(place.id)} /> : null })}`: Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `{state.fix && <Marker pinColor="blue" coordinate={{ latitude: state.fix.lat, longitud`: Đưa biểu thức JavaScript state.fix && <Marker pinColor="blue" coordinate={{ latitude: state.fix.lat, longitude: state.fix.lng }} title= vào JSX. | Thuộc tính pinColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính coordinate: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính latitude: đọc state.fix.lat từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính longitude: đọc state.fix.lng từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
  * DÒNG `</MapView> : <Action title={t('jExternalMap')} onPress={() => {`: Đóng phần giao diện MapView. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
  * DÒNG `void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468`: Thực hiện sử dụng void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468) + ' làm giá trị của bước hiện tại.
  * DÒNG `}} />)`: Đưa biểu thức JavaScript () => { void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468) + '/' + (point? vào JSX.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return (__DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? <MapView style={styles.map}
          key={selected ?? 'all'} initialRegion={{ latitude: point?.lat ?? 16.468, longitude: point?.lng ?? 107.578,
            latitudeDelta: point ? 0.003 : 0.012, longitudeDelta: point ? 0.003 : 0.012 }}>
          {state.places.map(place => { const p = mapPointFor(place); return p ? <Marker key={place.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }} title={publishedText(place, language)?.title ?? place.canonicalTitle}
            onPress={() => open(place.id)} /> : null })}
          {state.fix && <Marker pinColor="blue" coordinate={{ latitude: state.fix.lat, longitude: state.fix.lng }} title={t('jMyLocation')} />}
        </MapView> : <Action title={t('jExternalMap')} onPress={() => {
          void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468) + '/' + (point?.lng ?? 107.578))
        }} />)
}
// TẠI SAO (VisitorMap): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
// Khai báo styles: Gọi StyleSheet.create({ map: { height: 300, marginVertical: spacing.md } }). | Gán thuộc tính map: tạo object gồm height, marginVertical. | Gán thuộc tính height: giá trị số 300. | Gán thuộc tính marginVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
const styles = StyleSheet.create({ map: { height: 300, marginVertical: spacing.md } })
