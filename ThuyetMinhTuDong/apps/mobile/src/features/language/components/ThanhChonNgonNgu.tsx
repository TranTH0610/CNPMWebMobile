/**
 * FILE: apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx
 * FILE NÀY LÀM GÌ: Chọn ngôn ngữ du khách từ provider hiện có. SettingsScreen dùng kiểu mặc định; DetailScreen dùng compact để không che nội dung. TẠI SAO: Cùng một trạng thái ngôn ngữ cho tiêu đề, bài đọc và thuyết minh trên ứng dụng.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { FlatList, Text, View } from 'react-native'
import { LANGUAGES } from '@travelguide/visitor-core'
import { ui, spacing } from '../../../shared/GiaoDienChung'
import { Action } from '../../../shared/components/NutThaoTac'
import { useText } from '../i18n/CauHinhNgonNgu'
import { useVisitor } from '../hooks/useDuKhach'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider LanguageBar.
// [UC01] LanguageBar — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider LanguageBar.
export function LanguageBar({ compact = false }: { compact?: boolean }) {
  const { language, changeLanguage, saving, persistenceError } = useVisitor()
  const t = useText()
  // CHỨC NĂNG: Dịch tên ngôn ngữ cho cả thanh ngang và các nút trong Cài đặt.
  // [UC01] button — Dịch tên ngôn ngữ cho cả thanh ngang và các nút trong Cài đặt.
  const button = (item: (typeof LANGUAGES)[number]) => (
    <Action
      key={item.code}
      title={t(`language_${item.code}`)}
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
          extraData={language}
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
