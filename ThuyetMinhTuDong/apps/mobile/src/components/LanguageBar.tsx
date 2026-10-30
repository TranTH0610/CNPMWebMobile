/**
 * FILE NÀY LÀM GÌ
 * Nhóm nút chọn ngôn ngữ mobile; dùng trạng thái và danh sách ngôn ngữ chung để cập nhật nội dung.
 *
 * VỊ TRÍ: apps/mobile/src/components/LanguageBar.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../theme; ./Action; react-native; @travelguide/visitor-core; ../i18n/index;
 * ../hooks/useVisitor
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../theme'.
import { ui, spacing } from '../theme'
// Nhập các thành phần từ './Action'.
import { Action } from './Action'
// Nhập các thành phần từ 'react-native'.
import { Text, View } from 'react-native'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Hiển thị lựa chọn ngôn ngữ và lỗi lưu.
// XỬ LÝ: Cùng context với màn hình và tiêu đề điều hướng.
// Khai báo LanguageBar(). Component hàm nhận props và dựng phần giao diện LanguageBar.
export function LanguageBar() {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const {`: Khai báo { language, changeLanguage, saving, persistenceError, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `language,`: Khai báo { language, changeLanguage, saving, persistenceError, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `changeLanguage,`: Khai báo { language, changeLanguage, saving, persistenceError, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `saving,`: Khai báo { language, changeLanguage, saving, persistenceError, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `persistenceError,`: Khai báo { language, changeLanguage, saving, persistenceError, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `} = useVisitor()`: Khai báo { language, changeLanguage, saving, persistenceError, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   */
  const {
    language,
    changeLanguage,
    saving,
    persistenceError,
  } = useVisitor()

  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View style={{ gap: spacing.sm }}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `<Text style={ui.muted}>{t('language')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={ui.row}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{LANGUAGES.map((item) => (`: Đưa biểu thức JavaScript LANGUAGES.map((item) => ( <Action key={item.code} title={item.label} selected={item.code === language} disable vào JSX.
   * DÒNG `<Action`: Dựng Action.
   * DÒNG `key={item.code}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `title={item.label}`: Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `selected={item.code === language}`: Thuộc tính selected: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `disabled={saving}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onPress={() => {`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `void changeLanguage(item.code)`: Thực hiện sử dụng void changeLanguage(item.code) làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Action.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{persistenceError && (`: Đưa biểu thức JavaScript persistenceError && ( <Text accessibilityRole="alert" style={ui.muted}> {t(persistenceError)} </Text> ) vào JSX.
   * DÒNG `<Text accessibilityRole="alert" style={ui.muted}>`: Dựng Text. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t(persistenceError)}`: Đưa biểu thức JavaScript t(persistenceError) vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
// TẠI SAO (LanguageBar): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
