/**
 * CHỨC NĂNG: [CHI-TIET]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Chi tiết địa điểm mobile với ảnh lớn, thanh ngôn ngữ và bài thuyết minh dễ đọc. RootNavigator gọi; dùng service/hook du khách và bộ phát ListenButton đã có. TẠI SAO: Một ScrollView dọc, thanh ngôn ngữ ngang giúp tránh lỗi nội dung bị khuất dưới header.
 *
 * VỊ TRÍ: apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - react-native-safe-area-context
 * - @react-navigation/native-stack
 * - @travelguide/visitor-core
 * - ../../explore/hooks/useDanhSachDiTich
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../../../shared/components/NutThaoTac
 * - ../../language/components/ThanhChonNgonNgu
 * - ../../journey/components/NutNgheThuyetMinh
 * - ../../../shared/components/AnhDiTich
 * - ../../../shared/components/TrangThaiDuLieu
 * - ../../../shared/GiaoDienChung
 * - ../../../navigation/KieuDieuHuongDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. DetailScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { categoryOf, PLACE_PHOTOS, publishedText } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../../explore/hooks/useDanhSachDiTich'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { Action } from '../../../shared/components/NutThaoTac'
import { LanguageBar } from '../../language/components/ThanhChonNgonNgu'
import { ListenButton } from '../../journey/components/NutNgheThuyetMinh'
import { PlaceImage } from '../../../shared/components/AnhDiTich'
import { State } from '../../../shared/components/TrangThaiDuLieu'
import { ui } from '../../../shared/GiaoDienChung'
import { colors, radii, spacing } from '../../../shared/GiaoDienChung'
import type { VisitorStack } from '../../../navigation/KieuDieuHuongDuKhach'
// ==================== [CHI-TIET] DetailScreen ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider DetailScreen.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<VisitorStack, 'Detail'>) {
  const data = usePublishedPlace(route.params.placeId)
  const { language } = useVisitor()
  const t = useText()
  const back = () => navigation.navigate('Places')
  // CHỨC NĂNG: Không render trường thông tin khi đang tải hoặc chưa tìm thấy di tích.
  if (data.loading) return <State message="loading" busy />
  if (data.error || !data.place)
    return <State message={data.error ?? 'notFound'} retry={data.retry} back={back} />
  const place = data.place,
    content = publishedText(place, language)
  const photoNote = PLACE_PHOTOS[place.id]?.note?.[language]
  return (
    <SafeAreaView style={ui.page} edges={['bottom', 'left', 'right']}>
      <ScrollView
        key={place.id}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustsScrollIndicatorInsets
        stickyHeaderIndices={[0]}
      >
        {/* CHỨC NĂNG: Ngôn ngữ luôn trong tầm tay; không dùng vị trí tuyệt đối nên không che phần đầu nội dung. */}
        <View style={styles.languages}>
          <LanguageBar compact />
        </View>
        <View style={styles.body}>
          <View style={styles.overview}>
            <PlaceImage uri={place.images[0]} title={content?.title ?? place.canonicalTitle} />
            <View style={styles.intro}>
              <Text style={styles.badge}>{t(`category_${categoryOf(place)}`)}</Text>
              <Text accessibilityRole="header" style={styles.title}>
                {content?.title ?? place.canonicalTitle}
              </Text>
              {place.period && <Text style={ui.muted}>{place.period}</Text>}
              {content?.summary && <Text style={styles.summary}>{content.summary}</Text>}
              {content?.address && <Text style={ui.muted}>{content.address}</Text>}
              {/* CHỨC NĂNG: Nút chính là nghe; bản đồ là hành động phụ, cả hai đủ rộng để bấm bằng một tay. */}
              <ListenButton id={place.id} />
              <Action
                title={t('jMap')}
                icon="map-outline"
                onPress={() => navigation.navigate('Journey', { placeId: place.id })}
              />
            </View>
          </View>
          {photoNote && <Text style={ui.muted}>{photoNote}</Text>}
          {content ? (
            <View style={styles.reading}>
              <Text accessibilityRole="header" style={ui.heading}>
                {t('read')}
              </Text>
              <Text selectable style={styles.narration}>
                {content.body}
              </Text>
            </View>
          ) : (
            <State message="missing" />
          )}
          <Action title={t('back')} icon="arrow-back-outline" onPress={back} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
// CHỨC NĂNG: Style riêng của màn du khách; không thay theme hoặc màn quản trị.
const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: spacing.xl },
  languages: {
    backgroundColor: colors.page,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  body: { padding: spacing.lg, gap: spacing.lg },
  overview: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  intro: { padding: spacing.lg, gap: spacing.md },
  badge: {
    alignSelf: 'flex-start',
    color: colors.primary,
    backgroundColor: colors.soft,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 41,
    fontWeight: '500',
    // CHỨC NĂNG: Font hệ thống chọn đúng glyph Việt/Nhật/Trung, không ép Georgia/serif.
  },
  summary: { color: colors.text, fontSize: 16, lineHeight: 25 },
  reading: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  narration: { color: colors.text, fontSize: 16, lineHeight: 29 },
})
