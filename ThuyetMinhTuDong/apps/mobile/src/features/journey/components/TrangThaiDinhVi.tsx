/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Trạng thái GPS native có icon và chữ, không chỉ dựa vào màu. JourneyScreen dùng; không thay watch, bán kính, gợi ý hoặc auto-play của engine.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - @expo/vector-icons
 * - @travelguide/visitor-core
 * - ../../../../../../packages/ui-tokens/HienThiDinhVi
 * - ../hooks/useHanhTrinh
 * - ../../language/hooks/useDuKhach
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. GpsStatus
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { publishedText } from '@travelguide/visitor-core'
import { gpsVisual } from '../../../../../../packages/ui-tokens/HienThiDinhVi'
import { useJourney } from '../hooks/useHanhTrinh'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { colors, radii, spacing } from '../../../shared/GiaoDienChung'
// ==================== [DINH-VI] [THUYET-MINH] GpsStatus ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
        {nearby && state.gps && (
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
