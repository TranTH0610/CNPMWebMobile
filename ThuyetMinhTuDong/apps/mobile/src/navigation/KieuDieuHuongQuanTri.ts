/**
 * CHỨC NĂNG: [DIEU-HUONG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc sai route.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/KieuDieuHuongQuanTri.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx
 * - apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx
 * - apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx
 * - apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx
 * - apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx
 * - apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// Đặt tên kiểu AdminStack. | Khai báo Dashboard, kiểu undefined. | Khai báo AdminPlaces, kiểu undefined. | Khai báo PlaceForm, kiểu { id?: string } | undefined. | Khai báo id không bắt buộc, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo Content, kiểu { id: string }. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo Reviews, kiểu undefined.
export type AdminStack = {
  Dashboard: undefined
  AdminPlaces: undefined
  PlaceForm: { id?: string; submitted?: boolean } | undefined
  Content: { id: string }
  Reviews: undefined
  ReviewDetail: { id: string }
}
/* CÁCH KIỂM TRA: Content thiếu id phải báo TypeScript. */
