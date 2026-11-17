/**
 * FILE: packages/admin-core/src/XuatCongKhai.ts
 * FILE NÀY LÀM GÌ: Xuất các kiểu/hàm để module khác sử dụng qua một đầu mối; không phải màn hình thực hiện UC độc lập.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
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
export * from './domain/KieuDuLieuQuanTri'

export * from './domain/HopDongDichVu'

export * from './domain/KiemTraDuLieu'

export * from './services/XuLyNghiepVuQuanTri'
/* CÁCH KIỂM TRA: Import entry này trong test Node không được kéo React/DOM vào. */

export * from './services/GoiApiQuanTri'

// CHỨC NĂNG: Xuất thao tác ảnh form dùng chung, không kéo React vào logic thuần.
export * from './domain/XuLyAnhDiTich'
