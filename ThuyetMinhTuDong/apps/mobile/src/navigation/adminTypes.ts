/**
 * FILE NÀY LÀM GÌ
 * Kiểu tên màn và tham số điều hướng admin mobile; giúp TypeScript phát hiện truyền sai ID hoặc
 * sai route.
 *
 * VỊ TRÍ: apps/mobile/src/navigation/adminTypes.ts
 * DÙNG BỞI: apps/mobile/src/navigation/AdminNavigator.tsx;
 * apps/mobile/src/screens/admin/ContentEditorScreen.tsx;
 * apps/mobile/src/screens/admin/DashboardScreen.tsx; và các nơi import khác.
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Đặt tên kiểu AdminStack. | Khai báo Dashboard, kiểu undefined. | Khai báo AdminPlaces, kiểu undefined. | Khai báo PlaceForm, kiểu { id?: string } | undefined. | Khai báo id không bắt buộc, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo Content, kiểu { id: string }. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo Reviews, kiểu undefined.
export type AdminStack = { Dashboard: undefined; AdminPlaces: undefined; PlaceForm: { id?: string } | undefined; Content: { id: string }; Reviews: undefined }
/* CÁCH KIỂM TRA: Content thiếu id phải báo TypeScript. */
