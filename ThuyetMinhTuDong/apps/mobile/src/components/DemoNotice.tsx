/**
 * FILE NÀY LÀM GÌ
 * Thành phần thông báo về dữ liệu minh họa khi được nơi gọi đưa vào màn hình.
 *
 * VỊ TRÍ: apps/mobile/src/components/DemoNotice.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../theme; react-native; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../theme'.
import { ui } from '../theme'
// Nhập các thành phần từ 'react-native'.
import { Text, View } from 'react-native'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Phân biệt dữ liệu demo với nội dung chính thức.
// XỬ LÝ: Thông báo được dịch theo lựa chọn giao diện.
// Khai báo DemoNotice(). Component hàm nhận props và dựng phần giao diện DemoNotice.
export function DemoNotice() {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View style={ui.banner}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.muted}>{t('demo')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <View style={ui.banner}>
      <Text style={ui.muted}>{t('demo')}</Text>
    </View>
  )
}
// TẠI SAO (DemoNotice): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
