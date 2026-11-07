/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * PHỤ THUỘC:
 * - @react-navigation/native-stack
 * - ../../../navigation/KieuDieuHuongDuKhach
 * - ./ManKhamPha
 *
 * CÁC KHỐI CHÍNH:
 * 1. SearchResultScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { VisitorStack } from '../../../navigation/KieuDieuHuongDuKhach'
import HomeScreen from './ManKhamPha'

// CHỨC NĂNG: Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện.

// ==================== [KHAM-PHA] SearchResultScreen ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function SearchResultScreen({
  route,
}: NativeStackScreenProps<VisitorStack, 'Search'>) {
  return <HomeScreen key={JSON.stringify(route.params)} search initial={route.params} />
}
// TẠI SAO (SearchResultScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
