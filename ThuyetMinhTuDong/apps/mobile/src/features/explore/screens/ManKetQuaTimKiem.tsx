/**
 * FILE: apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx
 * FILE NÀY LÀM GÌ: Màn kết quả mobile nhận điều kiện từ route và dùng lại màn danh mục ở chế độ tìm kiếm.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { VisitorStack } from '../../../navigation/KieuDieuHuongDuKhach'
import HomeScreen from './ManKhamPha'

// CHỨC NĂNG: Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện.

// [UC02 / UC03] SearchResultScreen — Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện.
export default function SearchResultScreen({
  route,
}: NativeStackScreenProps<VisitorStack, 'Search'>) {
  return <HomeScreen key={JSON.stringify(route.params)} search initial={route.params} />
}
// TẠI SAO (SearchResultScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
