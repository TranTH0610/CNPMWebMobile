/**
 * FILE: apps/mobile/src/features/settings/screens/ManCaiDat.tsx
 * FILE NÀY LÀM GÌ: Màn chọn ngôn ngữ trong nhận diện Heritage. MainTabs dùng; vẫn gọi LanguageBar/provider hiện có để lưu lựa chọn.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LanguageBar } from '../../language/components/ThanhChonNgonNgu'
import { ui } from '../../../shared/GiaoDienChung'
import { colors, spacing, radii } from '../../../shared/GiaoDienChung'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider SettingsScreen.
// [UC01] SettingsScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider SettingsScreen.
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
