/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.
 *
 * VỊ TRÍ: apps/web/src/features/language/i18n/CauHinhNgonNgu.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx
 * - apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx
 * - apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 * - apps/web/src/features/explore/components/NutLocDanhMuc.tsx
 * - apps/web/src/features/explore/components/TheDiTich.tsx
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 * - apps/web/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 * - apps/web/src/features/language/components/ChonNgonNgu.tsx
 * - apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
 * - apps/web/src/main-admin.tsx
 * - apps/web/src/main.tsx
 * - apps/web/src/shared/components/AnhDiTich.tsx
 * - apps/web/src/shared/components/TrangThaiDuLieu.tsx
 * - apps/web/src/shared/layouts/BoCucDuKhach.tsx
 * - apps/web/src/shared/layouts/ChanTrang.tsx
 * - apps/web/src/shared/layouts/ThanhDieuHuong.tsx
 * - apps/web/src/shared/pages/TrangKhongTimThay.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core/react
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { createVisitorI18n } from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Khởi tạo ngôn ngữ đúng một lần ở tầng ứng dụng.
// XỬ LÝ: Resource VI/EN/CN/PT/JA dùng chung với nền tảng còn lại.

export const boot = createVisitorI18n()

export { useText } from '@travelguide/visitor-core/react'
