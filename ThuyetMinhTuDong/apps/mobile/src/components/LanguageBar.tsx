/**
 * FILE NÀY LÀM GÌ: Danh sách chọn ngôn ngữ mobile đồng bộ với provider chung.
 * Vị trí: apps/mobile/src/components/LanguageBar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui, spacing } from '../theme'
import { Action } from './Action'
import { Text, View } from 'react-native'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Hiển thị lựa chọn ngôn ngữ và lỗi lưu.
// XỬ LÝ: Cùng context với màn hình và tiêu đề điều hướng.
export function LanguageBar() {
  const {
    language,
    changeLanguage,
    saving,
    persistenceError,
  } = useVisitor()

  const t = useText()

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={ui.muted}>{t('language')}</Text>

      <View style={ui.row}>
        {LANGUAGES.map((item) => (
          <Action
            key={item.code}
            title={item.label}
            selected={item.code === language}
            disabled={saving}
            onPress={() => {
              void changeLanguage(item.code)
            }}
          />
        ))}
      </View>

      {persistenceError && (
        <Text accessibilityRole="alert" style={ui.muted}>
          {t(persistenceError)}
        </Text>
      )}
    </View>
  )
}
