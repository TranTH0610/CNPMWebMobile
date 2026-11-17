/**
 * FILE: apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx
 * FILE NÀY LÀM GÌ: Trạng thái GPS native có icon và chữ, không chỉ dựa vào màu. JourneyScreen dùng; không thay watch, bán kính, gợi ý hoặc auto-play của engine.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC06.1: Xin quyền, lấy và theo dõi vị trí.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { publishedText } from '@travelguide/visitor-core'
import { gpsVisual } from '../../../../../../packages/ui-tokens/HienThiDinhVi'
import { useJourney } from '../hooks/useHanhTrinh'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { colors, radii, spacing } from '../../../shared/GiaoDienChung'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus.
// [UC06 / UC06.1] GpsStatus — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus.
export function GpsStatus() {
  const { state } = useJourney(),
    { language } = useVisitor(),
    t = useText(),
    visual = gpsVisual(state)
  const nearby = state.places.find((p) => p.id === state.suggestedId)
  return (
    <View style={[styles.card, visual.error && styles.error]} accessibilityLiveRegion="polite">
      <Ionicons
        name={visual.error ? 'location-outline' : 'navigate-outline'}
        size={24}
        color={visual.error ? colors.danger : colors.secondary}
        accessible={false}
      />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={[styles.title, visual.error && { color: colors.danger }]}>
          {t(visual.key)}
        </Text>
        {nearby && state.gps && state.fix && (
          <Text style={styles.text}>
            {publishedText(nearby, language)?.title ?? nearby.canonicalTitle}
          </Text>
        )}
        {state.status === 'playing' && (
          <Text style={styles.text}>
            {t('jPlaying')}: {state.session?.title}
          </Text>
        )}
        <Text style={styles.text}>{t('gpsHelp')}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.tealSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  title: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.secondary },
  text: { fontSize: 14, lineHeight: 23, color: colors.muted },
})
