/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Bộ chọn ngôn ngữ trên web; cập nhật lựa chọn trong provider để giao diện dịch lại.
 *
 * VỊ TRÍ: apps/web/src/features/language/components/ChonNgonNgu.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx
 * - apps/web/src/shared/layouts/ThanhDieuHuong.tsx
 *
 * PHỤ THUỘC:
 * - ../../../shared/components/BieuTuong
 * - @travelguide/visitor-core
 * - ../i18n/CauHinhNgonNgu
 * - ../hooks/useDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. LanguagePicker
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Icon } from '../../../shared/components/BieuTuong'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n/CauHinhNgonNgu'
import { useVisitor } from '../hooks/useDuKhach'

// CHỨC NĂNG: Dropdown chọn ngôn ngữ.
// XỬ LÝ: Chỉ đổi khi mã nằm trong danh sách hỗ trợ.

// ==================== [NGON-NGU] LanguagePicker ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function LanguagePicker() {
  const { language, saving, persistenceError, changeLanguage } = useVisitor()

  const t = useText()

  return (
    <div className="language-picker">
      <Icon name="language" />
      <select
        aria-label={t('language')}
        value={language}
        disabled={saving}
        onChange={(event) => {
          const code = LANGUAGES.find((item) => item.code === event.target.value)?.code

          if (code) void changeLanguage(code)
        }}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>

      {persistenceError && <p role="alert">{t(persistenceError)}</p>}
    </div>
  )
}
// TẠI SAO (LanguagePicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
