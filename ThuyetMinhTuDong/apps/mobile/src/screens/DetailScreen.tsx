/**
 * FILE NÀY LÀM GÌ
 * Màn chi tiết địa điểm: đổi ngôn ngữ, ảnh, nội dung, nút nghe và bản đồ; bố trí vùng cuộn dưới
 * header.
 *
 * VỊ TRÍ: apps/mobile/src/screens/DetailScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: react-native; react-native-safe-area-context; @react-navigation/native-stack;
 * @travelguide/visitor-core; ../hooks/usePlaces; ../i18n/index; ../hooks/useVisitor;
 * ../components/index; ../theme; ../navigation/types
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react-native'.
import { ScrollView, StyleSheet, Text, View } from 'react-native'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { PLACE_PHOTOS, publishedText, validPoint } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../hooks/usePlaces'.
import { usePublishedPlace } from '../hooks/usePlaces'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../components/index'.
import { Action, DemoNotice, LanguageBar, ListenButton, PlaceImage, State, ui } from '../components/index'
// Nhập các thành phần từ '../theme'.
import { colors, spacing } from '../theme'
// Nhập kiểu dữ liệu từ '../navigation/types'.
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Dùng cùng một màn cho tất cả ID di tích.
// XỬ LÝ: Phân biệt tải, lỗi/không tìm thấy và bản ngôn ngữ chưa công bố.
// Khai báo DetailScreen({ route, navigation }). Component hàm nhận props và dựng phần giao diện DetailScreen.
export default function DetailScreen({ route, navigation }: NativeStackScreenProps<VisitorStack, 'Detail'>) {
  // Khai báo { placeId }: đọc route.params từ đối tượng/mảng để dùng tại bước hiện tại.
  const { placeId } = route.params
  // Khai báo data: Gọi usePublishedPlace(placeId).
  const data = usePublishedPlace(placeId)
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo back: khai báo callback () => navigation.navigate('Places').
  const back = () => navigation.navigate('Places')
  // TẠI SAO (back): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp dùng
  // chung.

  // Rẽ nhánh nếu data.loading. | Trả cây giao diện của component để React hiển thị. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính busy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  if (data.loading) return <State message="loading" busy />
  // Rẽ nhánh nếu data.error || !data.place.
  if (data.error || !data.place) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return <State message={data.error ?? 'notFound'} retry={data.retry} back={back} />`: Trả cây giao diện của component để React hiển thị. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính retry: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính back: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return <State message={data.error ?? 'notFound'} retry={data.retry} back={back} />
  }
  // Khai báo place: đọc data.place từ đối tượng/mảng để dùng tại bước hiện tại.
  const place = data.place
  // Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
  const content = publishedText(place, language)
  // Khai báo photoNote: đọc PLACE_PHOTOS[place.id]?.note?.[language] từ đối tượng/mảng để dùng tại bước hiện tại.
  const photoNote = PLACE_PHOTOS[place.id]?.note?.[language]

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<SafeAreaView style={ui.page} edges={['bottom', 'left', 'right']}>`: Dựng SafeAreaView. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính edges: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<ScrollView`: Dựng ScrollView.
   * DÒNG `key={place.id}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `style={styles.scroll}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `contentContainerStyle={styles.content}`: Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `contentInsetAdjustmentBehavior="automatic"`: Thuộc tính contentInsetAdjustmentBehavior: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `automaticallyAdjustsScrollIndicatorInsets`: Thuộc tính automaticallyAdjustsScrollIndicatorInsets: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `stickyHeaderIndices={[0]}`: Thuộc tính stickyHeaderIndices: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `>`: Dựng ScrollView.
   * DÒNG `<View style={styles.languages}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<LanguageBar />`: Dựng LanguageBar.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `<View style={styles.body}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<DemoNotice />`: Dựng DemoNotice.
   * DÒNG `<PlaceImage uri={place.images[0]} title={content?.title ?? place.canonicalTitle} />`: Dựng PlaceImage. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `{photoNote && <Text style={ui.muted}>{photoNote}</Text>}`: Đưa biểu thức JavaScript photoNote && <Text style={ui.muted}>{photoNote}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.title}>{content?.title ?? place.canonicalTitle}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{place.period && <Text style={ui.muted}>{place.period}</Text>}`: Đưa biểu thức JavaScript place.period && <Text style={ui.muted}>{place.period}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.muted}>{t('available')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<ListenButton id={place.id} />`: Dựng ListenButton. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Action title={t('jMap')} icon="map-outline" onPress={() => navigation.navigate('Jour`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback. | Gán thuộc tính placeId: đọc place.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `{content ? (`: Đưa biểu thức JavaScript content ? ( <View style={ui.card}> <Text style={ui.muted}>{content.address}</Text> <Text style={ui.heading}>{t vào JSX.
   * DÒNG `<View style={ui.card}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.muted}>{content.address}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.heading}>{t('read')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.text}>{content.body}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.muted}>{t('version')}: {content.version}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `) : <State message="missing" />}`: Đưa biểu thức JavaScript content ? ( <View style={ui.card}> <Text style={ui.muted}>{content.address}</Text> <Text style={ui.heading}>{t vào JSX. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={ui.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{place.position && validPoint(place.position)`: Đưa biểu thức JavaScript place.position && validPoint(place.position) ? t(place.position.verified ? 'coordinates' : 'mapCoordinates') + vào JSX.
   * DÒNG `? t(place.position.verified ? 'coordinates' : 'mapCoordinates') + ': ' + place.positi`: Đưa biểu thức JavaScript place.position && validPoint(place.position) ? t(place.position.verified ? 'coordinates' : 'mapCoordinates') + vào JSX.
   * DÒNG `: t('unverified')}`: Đưa biểu thức JavaScript place.position && validPoint(place.position) ? t(place.position.verified ? 'coordinates' : 'mapCoordinates') + vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Action title={t('back')} onPress={back} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</ScrollView>`: Đóng phần giao diện ScrollView.
   * DÒNG `</SafeAreaView>`: Đóng phần giao diện SafeAreaView.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    // CHỨC NĂNG: Giữ màn ở chiều cao mà stack cung cấp, tránh tràn khi player xuất hiện.
    // XỬ LÝ: Header native xử lý phía trên; safe area chỉ bù hai cạnh và đáy.
    <SafeAreaView style={ui.page} edges={['bottom', 'left', 'right']}>
      <ScrollView
        key={place.id}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustsScrollIndicatorInsets
        stickyHeaderIndices={[0]}
      >
        {/* CHỨC NĂNG: Chỉ giữ một bộ chọn; luôn truy cập được khi đọc bài dài.
            XỬ LÝ: Đây là phần tử đầu trực tiếp của ScrollView nên stickyHeaderIndices=0
            ghim đúng nhóm. Nền đặc che phần bài đi bên dưới. iOS tự tính inset dưới
            header, không hard-code chiều cao thanh điều hướng hoặc tọa độ âm.
            Không gắn key theo language: đổi ngôn ngữ không tạo lại vùng cuộn. */}
        <View style={styles.languages}>
          <LanguageBar />
        </View>

        {/* CHỨC NĂNG: Ảnh, nút và bài đọc cuộn trong phần chiều cao còn lại.
            XỬ LÝ: flexGrow ở content cho trang ngắn; không đặt flex:1 ở content
            vì sẽ ép bài dài vào một màn hình. key=place.id đưa về đầu khi đổi di tích. */}
        <View style={styles.body}>
          <DemoNotice />
          <PlaceImage uri={place.images[0]} title={content?.title ?? place.canonicalTitle} />
          {photoNote && <Text style={ui.muted}>{photoNote}</Text>}
          <Text style={ui.title}>{content?.title ?? place.canonicalTitle}</Text>
          {place.period && <Text style={ui.muted}>{place.period}</Text>}
          <Text style={ui.muted}>{t('available')}</Text>
          <ListenButton id={place.id} />
          <Action title={t('jMap')} icon="map-outline" onPress={() => navigation.navigate('Journey', { placeId: place.id })} />

          {content ? (
            <View style={ui.card}>
              <Text style={ui.muted}>{content.address}</Text>
              <Text style={ui.heading}>{t('read')}</Text>
              <Text style={ui.text}>{content.body}</Text>
              <Text style={ui.muted}>{t('version')}: {content.version}</Text>
            </View>
          ) : <State message="missing" />}

          <Text style={ui.muted}>
            {place.position && validPoint(place.position)
              ? t(place.position.verified ? 'coordinates' : 'mapCoordinates') + ': ' + place.position.lat + ', ' + place.position.lng
              : t('unverified')}
          </Text>
          <Action title={t('back')} onPress={back} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
// TẠI SAO (DetailScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.

// CHỨC NĂNG: Giới hạn viewport cuộn và dùng token chung cho khoảng cách/màu.
// XỬ LÝ: Không dùng position:absolute hoặc chiều cao cố định để bố cục thích ứng
// chữ nhiều dòng, màn hình nhỏ và player đang mở.
// Khai báo styles: Gọi StyleSheet.create({ scroll: { flex: 1 }, content: { flexGrow: 1, paddingBottom: spacing.xl.
const styles = StyleSheet.create({
  // Gán thuộc tính scroll: tạo object gồm flex. | Gán thuộc tính flex: giá trị số 1.
  scroll: { flex: 1 },
  // Gán thuộc tính content: tạo object gồm flexGrow, paddingBottom. | Gán thuộc tính flexGrow: giá trị số 1. | Gán thuộc tính paddingBottom: đọc spacing.xl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  content: { flexGrow: 1, paddingBottom: spacing.xl },
  // Gán thuộc tính languages: tạo object gồm backgroundColor, paddingHorizontal, paddingVertical, borderBottomWidth, borderBottomColor.
  languages: {
    // Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    backgroundColor: colors.page,
    // Gán thuộc tính paddingHorizontal: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingHorizontal: spacing.lg,
    // Gán thuộc tính paddingVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingVertical: spacing.md,
    // Gán thuộc tính borderBottomWidth: đọc StyleSheet.hairlineWidth từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderBottomWidth: StyleSheet.hairlineWidth,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `borderBottomColor: colors.border,`: Gán thuộc tính borderBottomColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    borderBottomColor: colors.border,
  },
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `body: { padding: spacing.lg, gap: spacing.md },`: Gán thuộc tính body: tạo object gồm padding, gap. | Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  body: { padding: spacing.lg, gap: spacing.md },
})

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Mở từng di tích: đủ năm nút ngôn ngữ, không có nhóm lặp dưới nút nghe.
 * - Cuộn xuống cuối bài rồi lên đầu: bộ chọn vẫn ở đầu vùng nội dung, dưới header.
 * - Đổi Việt/Anh/Trung/Bồ/Nhật: UI/bài đọc cùng đổi, không mất khả năng cuộn.
 * - Mở/đóng player và dùng chữ lớn: vẫn cuộn tới bài đọc/nút quay lại ở cuối.
 */
