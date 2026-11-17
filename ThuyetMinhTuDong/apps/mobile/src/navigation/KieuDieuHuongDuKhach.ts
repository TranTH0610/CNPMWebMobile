/**
 * FILE: apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts
 * FILE NÀY LÀM GÌ: Kiểu route và tham số của stack du khách mobile, dùng khi mở màn chi tiết/tìm kiếm/hành trình.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
}
