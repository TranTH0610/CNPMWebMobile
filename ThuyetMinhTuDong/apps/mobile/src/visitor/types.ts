/**
 * FILE NÀY LÀM GÌ:
 * Định nghĩa route và tham số UC01–UC05.
 * App và các màn visitor sử dụng.
 * Phụ thuộc type Category.
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
  Scan: undefined
}