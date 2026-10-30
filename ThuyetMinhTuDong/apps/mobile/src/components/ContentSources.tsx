/**
 * FILE NÀY LÀM GÌ
 * Thành phần trình bày nguồn tư liệu. File vẫn tồn tại; việc có xuất hiện trên giao diện phụ thuộc
 * nơi gọi.
 *
 * VỊ TRÍ: apps/mobile/src/components/ContentSources.tsx
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: react-native; @travelguide/visitor-core; ../i18n; ./Action; ./index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react-native'.
import { Alert, Linking, Text, View } from 'react-native'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { PublishedText } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ './Action'.
import { Action } from './Action'
// Nhập các thành phần từ './index'.
import { ui } from './index'
// CHỨC NĂNG: Thành phần trình bày nguồn tư liệu.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ContentSources({ text }). Component hàm nhận props và dựng phần giao diện ContentSources. | Khai báo text không bắt buộc, kiểu PublishedText.
export function ContentSources({ text }: { text?: PublishedText }) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Rẽ nhánh nếu !text?.sources?.length. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
  if (!text?.sources?.length) return null
  // CHỨC NĂNG: Mở bài gốc bằng trình duyệt; lỗi mở link có thông báo rõ.
  // Khai báo open: khai báo callback (url: string) => { void Linking.openURL(url).catch(() => Alert.alert(t('her. | Thực hiện sử dụng void Linking.openURL(url).catch(() => Alert.alert(t('heritageSources'), t('websiteError')) làm giá trị của bước hiện tại.
  const open = (url: string) => { void Linking.openURL(url).catch(() => Alert.alert(t('heritageSources'), t('websiteError'))) }
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <View style={ui.card}>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.heading}>{t('heritageSources')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={ui.muted}>{t('heritageCredit')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{text.sources.map(source => <View key={source.url}>`: Đưa biểu thức JavaScript text.sources.map(source => <View key={source.url}> <Action title={'Wikipedia · ' + source.title} onPress={() = vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `<Action title={'Wikipedia · ' + source.title} onPress={() => open(source.url)} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `<Text style={ui.muted}>{t('heritageChecked')}: {source.accessedAt}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Action title={source.license} onPress={() => open(source.licenseUrl)} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `</View>)}`: Đóng phần giao diện View.
   * DÒNG `{text.audio?.url.startsWith('narration:') && <Text style={ui.muted}>{t('heritageSynth`: Đưa biểu thức JavaScript text.audio?.url.startsWith('narration:') && <Text style={ui.muted}>{t('heritageSynthetic')}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <View style={ui.card}>
    <Text style={ui.heading}>{t('heritageSources')}</Text>
    <Text style={ui.muted}>{t('heritageCredit')}</Text>
    {text.sources.map(source => <View key={source.url}>
      <Action title={'Wikipedia · ' + source.title} onPress={() => open(source.url)} />
      <Text style={ui.muted}>{t('heritageChecked')}: {source.accessedAt}</Text>
      <Action title={source.license} onPress={() => open(source.licenseUrl)} />
    </View>)}
    {text.audio?.url.startsWith('narration:') && <Text style={ui.muted}>{t('heritageSynthetic')}</Text>}
  </View>
}
// TẠI SAO (ContentSources): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
/* CÁCH KIỂM TRA: Nguồn khớp di tích; nhãn đổi theo ngôn ngữ; lỗi mở trình duyệt hiện thông báo. */
