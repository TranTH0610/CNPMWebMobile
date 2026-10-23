/**
 * FILE NÀY LÀM GÌ: Chọn một trong năm ngôn ngữ và hiển thị lỗi lưu lựa chọn trên web.
 * Vị trí: apps/web/src/components/LanguagePicker.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Dropdown chọn ngôn ngữ.
// XỬ LÝ: Chỉ đổi khi mã nằm trong danh sách hỗ trợ.
export function LanguagePicker() {
  const {
    language,
    saving,
    persistenceError,
    changeLanguage,
  } = useVisitor()

  const t = useText()

  return (
    <div className="language-picker">
      <select
        aria-label={t('language')}
        value={language}
        disabled={saving}
        onChange={(event) => {
          const code = LANGUAGES.find(
            (item) => item.code === event.target.value,
          )?.code

          if (code) void changeLanguage(code)
        }}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code === 'cn' ? '中文' : item.code.toUpperCase()}
            {' · '}{item.label}
          </option>
        ))}
      </select>

      {persistenceError && (
        <p role="alert">{t(persistenceError)}</p>
      )}
    </div>
  )
}
