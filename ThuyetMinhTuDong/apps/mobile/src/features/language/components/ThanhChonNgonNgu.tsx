/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Chọn ngôn ngữ du khách từ provider hiện có. SettingsScreen dùng kiểu mặc định; DetailScreen dùng compact để không che nội dung. TẠI SAO: Cùng một trạng thái ngôn ngữ cho tiêu đề, bài đọc và thuyết minh trên ứng dụng.
 *
 * VỊ TRÍ: apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 * - apps/mobile/src/features/settings/screens/ManCaiDat.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - @travelguide/visitor-core
 * - ../../../shared/GiaoDienChung
 * - ../../../shared/components/NutThaoTac
 * - ../i18n/CauHinhNgonNgu
 * - ../hooks/useDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. LanguageBar
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { FlatList, Text, View } from 'react-native'
import { LANGUAGES } from '@travelguide/visitor-core'
import { ui, spacing } from '../../../shared/GiaoDienChung'
import { Action } from '../../../shared/components/NutThaoTac'
import { useText } from '../i18n/CauHinhNgonNgu'
import { useVisitor } from '../hooks/useDuKhach'
// ==================== [NGON-NGU] LanguageBar ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider LanguageBar.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function LanguageBar({ compact = false }: { compact?: boolean }) {
  const { language, changeLanguage, saving, persistenceError } = useVisitor()
  const t = useText()
  const button = (item: (typeof LANGUAGES)[number]) => (
    <Action
      key={item.code}
      title={item.label}
      selected={item.code === language}
      disabled={saving}
      onPress={() => {
        void changeLanguage(item.code)
      }}
    />
  )
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={ui.muted}>{t('language')}</Text>
      {/* CHỨC NĂNG: Thanh ngang chứa đủ năm ngôn ngữ, không tràn và không tăng chiều cao thành nhiều hàng. */}
      {compact ? (
        <FlatList
          style={{ flexGrow: 0 }}
          horizontal
          data={LANGUAGES}
          keyExtractor={(item) => item.code}
          showsHorizontalScrollIndicator
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xs }}
          renderItem={({ item }) => button(item)}
        />
      ) : (
        <View style={ui.row}>{LANGUAGES.map(button)}</View>
      )}
      {persistenceError && (
        <Text accessibilityRole="alert" style={ui.muted}>
          {t(persistenceError)}
        </Text>
      )}
    </View>
  )
}
