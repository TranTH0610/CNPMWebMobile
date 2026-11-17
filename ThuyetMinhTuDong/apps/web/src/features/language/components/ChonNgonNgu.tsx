/**
 * FILE: apps/web/src/features/language/components/ChonNgonNgu.tsx
 * FILE NÀY LÀM GÌ: Bộ chọn ngôn ngữ trên web; cập nhật lựa chọn trong provider để giao diện dịch lại.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Icon } from '../../../shared/components/BieuTuong'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n/CauHinhNgonNgu'
import { useVisitor } from '../hooks/useDuKhach'

// CHỨC NĂNG: Dropdown chọn ngôn ngữ.
// XỬ LÝ: Chỉ đổi khi mã hợp lệ; tên các lựa chọn dùng bản dịch theo ngôn ngữ giao diện.

// [UC01] LanguagePicker — Dropdown chọn ngôn ngữ.
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
            {t(`language_${item.code}`)}
          </option>
        ))}
      </select>

      {persistenceError && <p role="alert">{t(persistenceError)}</p>}
    </div>
  )
}
// TẠI SAO (LanguagePicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
