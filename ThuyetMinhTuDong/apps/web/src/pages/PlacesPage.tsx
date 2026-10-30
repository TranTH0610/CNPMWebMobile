/**
 * FILE NÀY LÀM GÌ
 * Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý
 * danh sách di tích.
 *
 * VỊ TRÍ: apps/web/src/pages/PlacesPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: ../components/Catalogue; react-router-dom; @travelguide/visitor-core;
 * ../hooks/usePlaces
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../components/Catalogue'.
import { Catalogue } from '../components/Catalogue'
// Nhập các thành phần từ 'react-router-dom'.
import { useSearchParams } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { CATEGORIES } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../hooks/usePlaces'.
import { usePublishedCatalog } from '../hooks/usePlaces'

// CHỨC NĂNG: Đọc điều kiện ban đầu từ URL.
// XỬ LÝ: Chỉ nhận mã danh mục hợp lệ; URL đổi thì key đổi để reset state.
// Khai báo PlacesPage(). Component hàm nhận props và dựng phần giao diện PlacesPage.
export function PlacesPage() {
  // Khai báo data: usePublishedCatalog nạp danh mục công bố và trạng thái tải/lỗi dùng bởi giao diện du khách.
  const data = usePublishedCatalog()
  // Khai báo [params]: Gọi useSearchParams().
  const [params] = useSearchParams()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const category = CATEGORIES.find(`: Khai báo category: CATEGORIES.find lấy phần tử đầu tiên phù hợp.
   * DÒNG `(item) => item === params.get('category'),`: Khai báo category: CATEGORIES.find lấy phần tử đầu tiên phù hợp.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const category = CATEGORIES.find(
    (item) => item === params.get('category'),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Catalogue`: Dựng Catalogue.
   * DÒNG `key={params.toString()}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `data={data}`: Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách.
   * DÒNG `initial={{`: Thuộc tính initial: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `query: params.get('q') ?? '',`: Gán thuộc tính query: tính biểu thức params.get('q') ?? ''.
   * DÒNG `category,`: Đặt trường category bằng giá trị của biến cùng tên.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Catalogue.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
