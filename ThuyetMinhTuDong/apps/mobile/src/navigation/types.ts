/**
 * FILE NÀY LÀM GÌ
 * Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/types.ts
 * DÙNG BỞI: apps/mobile/src/navigation/linking.ts; apps/mobile/src/navigation/RootNavigator.tsx;
 * apps/mobile/src/screens/DetailScreen.tsx; và các nơi import khác.
 * PHỤ THUỘC: @travelguide/visitor-core
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'

// CHỨC NĂNG: Kiểm tra tham số điều hướng.
// XỬ LÝ: Detail bắt buộc placeId; Search nhận điều kiện ban đầu.
// Đặt tên kiểu VisitorStack.
export type VisitorStack = {
  // Khai báo Places, kiểu undefined.
  Places: undefined
  // Khai báo Search, kiểu { query?: string category?: Category }.
  Search: {
    // Khai báo query không bắt buộc, kiểu string.
    query?: string
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `category?: Category`: Khai báo category không bắt buộc, kiểu Category.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    category?: Category
  }
  // Khai báo Detail, kiểu { placeId: string }.
  Detail: {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `placeId: string`: Khai báo placeId, kiểu string.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    placeId: string
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `Journey: { placeId?: string } | undefined`: Khai báo Journey, kiểu { placeId?: string } | undefined. | Khai báo placeId không bắt buộc, kiểu string.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  Journey: { placeId?: string } | undefined
}
