/**
 * FILE NÀY LÀM GÌ
 * Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm.
 *
 * VỊ TRÍ: apps/mobile/src/screens/SearchResultScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: @react-navigation/native-stack; ../navigation/types; ./HomeScreen
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// Nhập kiểu dữ liệu từ '../navigation/types'.
import type { VisitorStack } from '../navigation/types'
// Nhập các thành phần từ './HomeScreen'.
import HomeScreen from './HomeScreen'

// CHỨC NĂNG: Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện.
// Khai báo SearchResultScreen({ route }). Component hàm nhận props và dựng phần giao diện SearchResultScreen.
export default function SearchResultScreen({ route }: NativeStackScreenProps<VisitorStack, 'Search'>) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <HomeScreen key={JSON.stringify(route.params)} search initial={route.params} /`: Trả cây giao diện của component để React hiển thị. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính search: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính initial: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <HomeScreen key={JSON.stringify(route.params)} search initial={route.params} />
}
// TẠI SAO (SearchResultScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
