/**
 * CHỨC NĂNG: [GIAO-DIEN]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Màu và style nền tảng của mobile, dùng lại token chung để các màn có hình thức thống nhất.
 *
 * VỊ TRÍ: apps/mobile/src/shared/GiaoDienChung.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx
 * - apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx
 * - apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx
 * - apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * - apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx
 * - apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx
 * - apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx
 * - apps/mobile/src/features/explore/components/ChonSapXep.tsx
 * - apps/mobile/src/features/explore/components/KhoiChaoMung.tsx
 * - apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx
 * - apps/mobile/src/features/explore/components/OTimKiem.tsx
 * - apps/mobile/src/features/explore/components/TheDiTich.tsx
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 * - apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 * - apps/mobile/src/features/settings/screens/ManCaiDat.tsx
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 * - apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 * - apps/mobile/src/shared/components/AnhBia.tsx
 * - apps/mobile/src/shared/components/AnhDiTich.tsx
 * - apps/mobile/src/shared/components/NutThaoTac.tsx
 * - apps/mobile/src/shared/components/TrangThaiDuLieu.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - ../../../../packages/ui-tokens/MauVaKichThuoc
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { StyleSheet } from 'react-native'
import { colors, spacing, radii } from '../../../../packages/ui-tokens/MauVaKichThuoc'

// CHỨC NĂNG: Tạo style tái sử dụng.
// XỬ LÝ: Màu và khoảng cách lấy từ package token.

export const ui = StyleSheet.create({
  page: {
    flex: 1,

    backgroundColor: colors.page,
  },

  content: {
    padding: spacing.lg,

    gap: spacing.md,
  },

  row: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'center',

    gap: spacing.sm,
  },

  card: {
    backgroundColor: colors.background,

    padding: spacing.lg,

    borderRadius: radii.md,

    borderColor: colors.border,

    borderWidth: 1,

    gap: spacing.md,

    marginBottom: spacing.md,
  },

  title: {
    fontSize: 30,

    lineHeight: 39,

    fontWeight: '700',

    color: colors.text,
  },

  heading: {
    fontSize: 21,

    lineHeight: 27,

    fontWeight: '600',

    color: colors.text,
  },

  text: {
    fontSize: 16,

    color: colors.text,

    lineHeight: 24,
  },

  muted: {
    fontSize: 16,

    color: colors.muted,

    lineHeight: 22,
  },

  input: {
    minHeight: 48,

    padding: spacing.md,

    borderRadius: radii.sm,

    backgroundColor: colors.background,

    borderWidth: 1,

    borderColor: colors.border,

    color: colors.text,
  },

  button: {
    minHeight: 44,

    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.md,

    borderWidth: 1,

    borderColor: colors.primary,

    borderRadius: radii.sm,

    alignItems: 'center',

    justifyContent: 'center',
  },

  banner: {
    backgroundColor: colors.soft,

    padding: spacing.md,

    borderRadius: radii.sm,
  },
})

export { colors, spacing, radii } from '../../../../packages/ui-tokens/MauVaKichThuoc'
