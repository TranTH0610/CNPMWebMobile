/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Khởi tạo/đưa ra instance dịch của nền tảng; dùng tài nguyên ngôn ngữ chung thay vì chép lại các bản dịch vào app.
 *
 * VỊ TRÍ: apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/app/TrangThaiUngDung.tsx
 * - apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx
 * - apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx
 * - apps/mobile/src/features/explore/components/ChonSapXep.tsx
 * - apps/mobile/src/features/explore/components/KhoiChaoMung.tsx
 * - apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx
 * - apps/mobile/src/features/explore/components/OTimKiem.tsx
 * - apps/mobile/src/features/explore/components/TheDiTich.tsx
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 * - apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 * - apps/mobile/src/features/settings/screens/ManCaiDat.tsx
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 * - apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 * - apps/mobile/src/shared/components/AnhBia.tsx
 * - apps/mobile/src/shared/components/AnhDiTich.tsx
 * - apps/mobile/src/shared/components/TrangThaiDuLieu.tsx
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
