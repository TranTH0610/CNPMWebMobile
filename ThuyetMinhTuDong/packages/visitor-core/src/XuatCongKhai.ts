/**
 * FILE: packages/visitor-core/src/XuatCongKhai.ts
 * FILE NÀY LÀM GÌ: Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
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
// CHỨC NĂNG: Công khai phần logic không phụ thuộc giao diện.
// XỬ LÝ: Mobile và web import bằng tên package thay vì đường dẫn sâu.
// Xuất lại thành phần từ './domain/KieuDuLieuDuKhach'.
export * from './domain/KieuDuLieuDuKhach'
// Xuất lại thành phần từ './catalog/DanhMucDiTich'.
export * from './catalog/DanhMucDiTich'
// Xuất lại thành phần từ './catalog/TimKiemVaBoLoc'.
export * from './catalog/TimKiemVaBoLoc'
// Xuất lại thành phần từ './links/PhanTichLienKetQR'.
export * from './links/PhanTichLienKetQR'
// Xuất lại thành phần từ './links/DiaChiWebsite'.
export * from './links/DiaChiWebsite'
// Xuất lại thành phần từ './data/DuLieuKhoiTao'.
export * from './data/DuLieuKhoiTao'
// Xuất lại thành phần từ './i18n/BanDichGiaoDien'.
export * from './i18n/BanDichGiaoDien'
// Xuất lại thành phần từ './catalog/DuLieuHienThi'.
export * from './catalog/DuLieuHienThi'

// CHỨC NĂNG: Giữ phần React ở entry riêng.
// XỬ LÝ: Hooks tiếp tục được import từ @travelguide/visitor-core/react;
// không export chúng tại đây để test nghiệp vụ không phải nạp React.
// Xuất lại thành phần từ './data/DanhMucAnh'.
export { PLACE_PHOTOS } from './data/DanhMucAnh'

// CHỨC NĂNG: Công khai nguồn lịch sử và tra MP3 dùng chung web/mobile/Admin.
// Xuất lại thành phần từ './data/DiSanHue'.
export * from './data/DiSanHue'

// CHỨC NĂNG: Bộ điều khiển nghe thử và quyền phát chung, dùng được trong test thuần.
// Xuất lại thành phần từ './audio/DieuPhoiPhatAmThanh'.
export * from './audio/DieuPhoiPhatAmThanh'
// Xuất lại thành phần từ './audio/DieuKhienNgheThu'.
export * from './audio/DieuKhienNgheThu'
