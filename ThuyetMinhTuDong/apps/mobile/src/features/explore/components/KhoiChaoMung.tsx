/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Phần chào mừng native có ảnh, nội dung và công cụ tìm tách riêng. HomeScreen gọi; Cover/SearchBar/Action và i18n cung cấp UI, callback cũ giữ toàn bộ nghiệp vụ. TẠI SAO: Không đặt nhiều khối lên ảnh, không khóa chiều cao khi chữ dài hoặc cỡ chữ hệ thống tăng.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/components/KhoiChaoMung.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../../shared/GiaoDienChung
 * - ../../../shared/components/AnhBia
 * - ./OTimKiem
 * - ../../../shared/components/NutThaoTac
 *
 * CÁC KHỐI CHÍNH:
 * 1. ExploreHero
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { StyleSheet, Text, View } from 'react-native'
import { HERO_IMAGE } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { colors, spacing } from '../../../shared/GiaoDienChung'
import { Cover } from '../../../shared/components/AnhBia'
import { SearchBar } from './OTimKiem'
import { Action } from '../../../shared/components/NutThaoTac'
// ==================== [KHAM-PHA] ExploreHero ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ExploreHero.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function ExploreHero({
  query,
  onChange,
  onSubmit,
  onExplore,
  onMap,
  searchRequired,
}: {
  query: string
  onChange: (value: string) => void
  onSubmit: () => void
  onExplore: () => void
  onMap: () => void
  searchRequired: boolean
}) {
  const t = useText()
  return (
    <View style={styles.hero}>
      <Cover uri={HERO_IMAGE} style={styles.photo} />
      <View style={styles.copy}>
        <Text style={styles.kicker}>{t('explore')}</Text>
        <Text accessibilityRole="header" style={styles.title}>
          {t('site')}
        </Text>
        <Text style={styles.description}>{t('heroSubtitle')}</Text>
        <View style={styles.actions}>
          <Action
            title={t('startExplore')}
            icon="compass-outline"
            variant="primary"
            style={styles.action}
            onPress={onExplore}
          />
          <Action title={t('jMap')} icon="map-outline" style={styles.action} onPress={onMap} />
        </View>
      </View>
      <View style={styles.tools}>
        <SearchBar value={query} onChange={onChange} onSubmit={onSubmit} />
        <Action title={t('searchButton')} icon="search-outline" onPress={onSubmit} />
        {searchRequired && (
          <Text accessibilityRole="alert" style={styles.error}>
            {t('searchRequired')}
          </Text>
        )}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  hero: {
    margin: spacing.lg,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  photo: { width: '100%', aspectRatio: 16 / 9 },
  copy: { padding: spacing.lg, gap: spacing.md },
  kicker: { color: colors.goldInk, fontSize: 13, lineHeight: 20, fontWeight: '700' },
  title: { color: colors.text, fontSize: 30, lineHeight: 39, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 15, lineHeight: 25 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  action: { flexGrow: 1, flexBasis: 130 },
  tools: {
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.page,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  error: { color: colors.danger, fontSize: 14, lineHeight: 22 },
})
