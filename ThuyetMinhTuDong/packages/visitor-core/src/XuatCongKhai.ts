/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Điểm export công khai của package; nơi dùng import tên package thay vì truy cập sâu vào file nội
 *
 * VỊ TRÍ: packages/visitor-core/src/XuatCongKhai.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - ./domain/KieuDuLieuDuKhach
 * - ./catalog/DanhMucDiTich
 * - ./catalog/TimKiemVaBoLoc
 * - ./links/PhanTichLienKetQR
 * - ./links/DiaChiWebsite
 * - ./data/DuLieuKhoiTao
 * - ./i18n/BanDichGiaoDien
 * - ./catalog/DuLieuHienThi
 * - ./data/DanhMucAnh
 * - ./data/DiSanHue
 * - ./audio/DieuPhoiPhatAmThanh
 * - ./audio/DieuKhienNgheThu
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
