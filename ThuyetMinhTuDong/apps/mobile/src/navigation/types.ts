/**
 * FILE NÀY LÀM GÌ: Tách riêng một phần giao diện để dễ tìm và bảo trì.
 * Vị trí: apps/mobile/src/navigation/types.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { Category } from '@travelguide/visitor-core'

// CHỨC NĂNG: Kiểm tra tham số điều hướng.
// XỬ LÝ: Detail bắt buộc placeId; Search nhận điều kiện ban đầu.
export type VisitorStack = {
  Places: undefined
  Search: {
    query?: string
    category?: Category
  }
  Detail: {
    placeId: string
  }
  Journey: { placeId?: string } | undefined
  Scan: undefined
}
