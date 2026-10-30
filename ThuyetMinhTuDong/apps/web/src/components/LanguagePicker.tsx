/**
 * FILE NÀY LÀM GÌ
 * Bộ chọn ngôn ngữ trên web; cập nhật lựa chọn trong provider để giao diện dịch lại.
 *
 * VỊ TRÍ: apps/web/src/components/LanguagePicker.tsx
 * DÙNG BỞI: apps/web/src/components/index.ts; apps/web/src/layouts/AdminLayout.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; ../i18n/index; ../hooks/useVisitor
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Dropdown chọn ngôn ngữ.
// XỬ LÝ: Chỉ đổi khi mã nằm trong danh sách hỗ trợ.
// Khai báo LanguagePicker(). Component hàm nhận props và dựng phần giao diện LanguagePicker.
export function LanguagePicker() {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const {`: Khai báo { language, saving, persistenceError, changeLanguage, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `language,`: Khai báo { language, saving, persistenceError, changeLanguage, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `saving,`: Khai báo { language, saving, persistenceError, changeLanguage, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `persistenceError,`: Khai báo { language, saving, persistenceError, changeLanguage, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `changeLanguage,`: Khai báo { language, saving, persistenceError, changeLanguage, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `} = useVisitor()`: Khai báo { language, saving, persistenceError, changeLanguage, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   */
  const {
    language,
    saving,
    persistenceError,
    changeLanguage,
  } = useVisitor()

  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<div className="language-picker">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<select`: Dựng select.
   * DÒNG `aria-label={t('language')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `value={language}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `disabled={saving}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onChange={(event) => {`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `const code = LANGUAGES.find(`: Khai báo code: đọc LANGUAGES.find( (item) => item.code === event.target.value, )?.code từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `(item) => item.code === event.target.value,`: Khai báo code: đọc LANGUAGES.find( (item) => item.code === event.target.value, )?.code từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `)?.code`: Khai báo code: đọc LANGUAGES.find( (item) => item.code === event.target.value, )?.code từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `if (code) void changeLanguage(code)`: Rẽ nhánh nếu code. | Thực hiện sử dụng void changeLanguage(code) làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng select.
   * DÒNG `{LANGUAGES.map((item) => (`: Đưa biểu thức JavaScript LANGUAGES.map((item) => ( <option key={item.code} value={item.code}> {item.code === 'cn' ? '中文' : item.code.to vào JSX.
   * DÒNG `<option key={item.code} value={item.code}>`: Dựng option. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `{item.code === 'cn' ? '中文' : item.code.toUpperCase()}`: Đưa biểu thức JavaScript item.code === 'cn' ? '中文' : item.code.toUpperCase() vào JSX.
   * DÒNG `{' · '}{item.label}`: Đưa biểu thức JavaScript ' · ' vào JSX.
   * DÒNG `</option>`: Đóng phần giao diện option.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</select>`: Đóng phần giao diện select.
   * DÒNG `{persistenceError && (`: Đưa biểu thức JavaScript persistenceError && ( <p role="alert">{t(persistenceError)}</p> ) vào JSX.
   * DÒNG `<p role="alert">{t(persistenceError)}</p>`: Dựng p. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
// TẠI SAO (LanguagePicker): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
