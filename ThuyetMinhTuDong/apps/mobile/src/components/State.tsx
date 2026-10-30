/**
 * FILE NÀY LÀM GÌ
 * Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
 *
 * VỊ TRÍ: apps/mobile/src/components/State.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../theme; ./Action; react-native; @travelguide/visitor-core; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../theme'.
import { ui, colors } from '../theme'
// Nhập các thành phần từ './Action'.
import { Action } from './Action'
// Nhập các thành phần từ 'react-native'.
import { ActivityIndicator, Text, View } from 'react-native'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { MessageKey } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị loading, thông báo và thao tác khôi phục.
// XỬ LÝ: Chỉ nhận key dịch; không hiện lỗi kỹ thuật từ API.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function State({`: Khai báo State({ message, busy = false, retry, back, }). Component hàm nhận props và dựng phần giao diện State.
 * DÒNG `message,`: Nhận đầu vào { message, busy = false, retry, back, }: { message: MessageKey busy?: boolean retry?: () => voi từ nơi gọi hàm.
 * DÒNG `busy = false,`: Nhận đầu vào { message, busy = false, retry, back, }: { message: MessageKey busy?: boolean retry?: () => voi từ nơi gọi hàm.
 * DÒNG `retry,`: Nhận đầu vào { message, busy = false, retry, back, }: { message: MessageKey busy?: boolean retry?: () => voi từ nơi gọi hàm.
 * DÒNG `back,`: Nhận đầu vào { message, busy = false, retry, back, }: { message: MessageKey busy?: boolean retry?: () => voi từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { message, busy = false, retry, back, }: { message: MessageKey busy?: boolean retry?: () => voi từ nơi gọi hàm.
 */
export function State({
  message,
  busy = false,
  retry,
  back,
}: {
  // Khai báo message, kiểu MessageKey.
  message: MessageKey
  // Khai báo busy không bắt buộc, kiểu boolean.
  busy?: boolean
  // Khai báo retry không bắt buộc, kiểu () => void.
  retry?: () => void
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `back?: () => void`: Khai báo back không bắt buộc, kiểu () => void.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  back?: () => void
}) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View style={ui.content}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{busy && (`: Đưa biểu thức JavaScript busy && ( <ActivityIndicator color={colors.primary} accessibilityLabel={t('loading')} /> ) vào JSX.
   * DÒNG `<ActivityIndicator`: Dựng ActivityIndicator.
   * DÒNG `color={colors.primary}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityLabel={t('loading')}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `/>`: Dựng ActivityIndicator.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<Text`: Dựng Text.
   * DÒNG `accessibilityRole={busy ? 'text' : 'alert'}`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `style={ui.text}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `>`: Dựng Text.
   * DÒNG `{t(message)}`: Đưa biểu thức JavaScript t(message) vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `{retry && (`: Đưa biểu thức JavaScript retry && ( <Action title={t('retry')} onPress={retry} /> ) vào JSX.
   * DÒNG `<Action title={t('retry')} onPress={retry} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `{back && (`: Đưa biểu thức JavaScript back && ( <Action title={t('back')} onPress={back} /> ) vào JSX.
   * DÒNG `<Action title={t('back')} onPress={back} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <View style={ui.content}>
      {busy && (
        <ActivityIndicator
          color={colors.primary}
          accessibilityLabel={t('loading')}
        />
      )}

      <Text
        accessibilityRole={busy ? 'text' : 'alert'}
        style={ui.text}
      >
        {t(message)}
      </Text>

      {retry && (
        <Action title={t('retry')} onPress={retry} />
      )}

      {back && (
        <Action title={t('back')} onPress={back} />
      )}
    </View>
  )
}
// TẠI SAO (State): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
