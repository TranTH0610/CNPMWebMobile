/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.
 *
 * VỊ TRÍ: apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../components/DanhSachVaBoLoc
 * - react-router-dom
 * - @travelguide/visitor-core
 * - ../hooks/useDanhSachDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlacesPage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Catalogue } from '../components/DanhSachVaBoLoc'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/useDanhSachDiTich'

// CHỨC NĂNG: Đọc điều kiện ban đầu từ URL.
// XỬ LÝ: Chỉ nhận mã danh mục hợp lệ; URL đổi thì key đổi để reset state.

// ==================== [KHAM-PHA] PlacesPage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlacesPage() {
  const data = usePublishedCatalog()

  const [params] = useSearchParams()

  const category = CATEGORIES.find((item) => item === params.get('category'))

  return (
    <Catalogue
      key={params.toString()}
      data={data}
      initial={{
        query: params.get('q') ?? '',
        category,
      }}
    />
  )
}
// TẠI SAO (PlacesPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
// dùng chung.
