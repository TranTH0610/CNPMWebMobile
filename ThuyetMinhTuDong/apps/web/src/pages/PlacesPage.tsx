/**
 * FILE NÀY LÀM GÌ: Đọc từ khóa/danh mục từ URL và hiển thị danh sách Catalogue.
 * Vị trí: apps/web/src/pages/PlacesPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Catalogue } from '../components/Catalogue'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/usePlaces'

// CHỨC NĂNG: Đọc điều kiện ban đầu từ URL.
// XỬ LÝ: Chỉ nhận mã danh mục hợp lệ; URL đổi thì key đổi để reset state.
export function PlacesPage() {
  const data = usePublishedCatalog()
  const [params] = useSearchParams()

  const category = CATEGORIES.find(
    (item) => item === params.get('category'),
  )

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
