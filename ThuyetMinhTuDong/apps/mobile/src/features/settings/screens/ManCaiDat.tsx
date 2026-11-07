/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Màn chọn ngôn ngữ trong nhận diện Heritage. MainTabs dùng; vẫn gọi LanguageBar/provider hiện có để lưu lựa chọn.
 *
 * VỊ TRÍ: apps/mobile/src/features/settings/screens/ManCaiDat.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - react-native-safe-area-context
 * - @expo/vector-icons
 * - ../../language/components/ThanhChonNgonNgu
 * - ../../../shared/GiaoDienChung
 * - ../../language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. SettingsScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LanguageBar } from '../../language/components/ThanhChonNgonNgu'
import { ui } from '../../../shared/GiaoDienChung'
import { colors, spacing, radii } from '../../../shared/GiaoDienChung'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
// ==================== [DUNG-CHUNG] SettingsScreen ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider SettingsScreen.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function SettingsScreen() {
  const t = useText()
  return (
    <SafeAreaView style={ui.page} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={ui.content}>
        <View style={styles.hero}>
          <Ionicons
            name="language-outline"
            size={36}
            color={colors.playerAccent}
            accessible={false}
          />
          <Text style={styles.title}>{t('settings')}</Text>
          <Text style={styles.hint}>{t('languageHint')}</Text>
        </View>
        <View style={ui.card}>
          <LanguageBar />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  hero: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.secondary,
    gap: spacing.md,
  },
  title: { fontSize: 30, lineHeight: 39, fontWeight: '600', color: colors.white },
  hint: { fontSize: 16, lineHeight: 26, color: colors.playerMuted },
})
