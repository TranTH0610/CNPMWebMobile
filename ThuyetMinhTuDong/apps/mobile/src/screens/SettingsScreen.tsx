/**
 * FILE NÀY LÀM GÌ
 * Màn cài đặt du khách mobile; cho thay đổi các lựa chọn được provider dùng chung quản lý.
 *
 * VỊ TRÍ: apps/mobile/src/screens/SettingsScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/MainTabs.tsx.
 * PHỤ THUỘC: react-native-safe-area-context; react-native; ../i18n/index; ../components/index
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập các thành phần từ 'react-native'.
import { ScrollView, Text } from 'react-native'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../components/index'.
import { LanguageBar, ui } from '../components/index'

// CHỨC NĂNG: Cho đổi ngôn ngữ.
// XỬ LÝ: Cùng provider với tiêu đề, danh sách và bài đọc.
// Khai báo SettingsScreen(). Component hàm nhận props và dựng phần giao diện SettingsScreen.
export default function SettingsScreen() {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<SafeAreaView style={ui.page}>`: Dựng SafeAreaView. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<ScrollView contentContainerStyle={ui.content}>`: Dựng ScrollView. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `<Text style={ui.title}>{t('settings')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<LanguageBar />`: Dựng LanguageBar.
   * DÒNG `<Text style={ui.muted}>{t('noAccount')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</ScrollView>`: Đóng phần giao diện ScrollView.
   * DÒNG `</SafeAreaView>`: Đóng phần giao diện SafeAreaView.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <SafeAreaView style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.title}>{t('settings')}</Text>
        <LanguageBar />
        <Text style={ui.muted}>{t('noAccount')}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
// TẠI SAO (SettingsScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
