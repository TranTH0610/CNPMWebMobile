/**
 * FILE NÀY LÀM GÌ: Hiển thị chi tiết di tích và một bộ chọn ngôn ngữ ghim trong vùng cuộn.
 * RootNavigator đăng ký; phụ thuộc usePublishedPlace/useVisitor, component và token mobile.
 * UC01, UC04, UC07, UC08: chọn ngôn ngữ cập nhật cả UI và bài nghe qua provider hiện có.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { PLACE_PHOTOS, publishedText, validPoint } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Action, DemoNotice, LanguageBar, ListenButton, PlaceImage, State, ui } from '../components/index'
import { colors, spacing } from '../theme'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Dùng cùng một màn cho tất cả ID di tích.
// XỬ LÝ: Phân biệt tải, lỗi/không tìm thấy và bản ngôn ngữ chưa công bố.
export default function DetailScreen({ route, navigation }: NativeStackScreenProps<VisitorStack, 'Detail'>) {
  const { placeId } = route.params
  const data = usePublishedPlace(placeId)
  const { language } = useVisitor()
  const t = useText()
  const back = () => navigation.navigate('Places')

  if (data.loading) return <State message="loading" busy />
  if (data.error || !data.place) {
    return <State message={data.error ?? 'notFound'} retry={data.retry} back={back} />
  }
  const place = data.place
  const content = publishedText(place, language)
  const photoNote = PLACE_PHOTOS[place.id]?.note?.[language]

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

// CHỨC NĂNG: Giới hạn viewport cuộn và dùng token chung cho khoảng cách/màu.
// XỬ LÝ: Không dùng position:absolute hoặc chiều cao cố định để bố cục thích ứng
// chữ nhiều dòng, màn hình nhỏ và player đang mở.
const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: spacing.xl },
  languages: {
    backgroundColor: colors.page,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  body: { padding: spacing.lg, gap: spacing.md },
})

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Mở từng di tích: đủ năm nút ngôn ngữ, không có nhóm lặp dưới nút nghe.
 * - Cuộn xuống cuối bài rồi lên đầu: bộ chọn vẫn ở đầu vùng nội dung, dưới header.
 * - Đổi Việt/Anh/Trung/Bồ/Nhật: UI/bài đọc cùng đổi, không mất khả năng cuộn.
 * - Mở/đóng player và dùng chữ lớn: vẫn cuộn tới bài đọc/nút quay lại ở cuối.
 */
