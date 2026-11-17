/**
 * FILE: apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx
 * FILE NÀY LÀM GÌ: Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Catalogue } from '../components/DanhSachVaBoLoc'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/useDanhSachDiTich'

// CHỨC NĂNG: Đọc điều kiện ban đầu từ URL.
// XỬ LÝ: Chỉ nhận mã danh mục hợp lệ; URL đổi thì key đổi để reset state.

// [UC02 / UC03] PlacesPage — Đọc điều kiện ban đầu từ URL.
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
