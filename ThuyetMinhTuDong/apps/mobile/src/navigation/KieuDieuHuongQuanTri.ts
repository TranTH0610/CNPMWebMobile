/**
 * FILE: apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts
 * FILE NÀY LÀM GÌ: Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
export type AdminStack = {
  Dashboard: undefined
  AdminPlaces: undefined
  PlaceForm: { id?: string; submitted?: boolean } | undefined
  Content: { id: string }
  Reviews: undefined
  ReviewDetail: { id: string }
}
/* CÁCH KIỂM TRA: Content thiếu id phải báo TypeScript. */
