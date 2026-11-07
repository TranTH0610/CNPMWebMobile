/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Style riêng cho màn khám phá, tìm kiếm và thẻ địa điểm mobile. HomeScreen, SearchBar, CategoryChips, PlaceCard dùng; phụ thuộc ui-tokens. TẠI SAO: Một nơi quản lý khoảng cách/màu, không thay style quản trị hoặc logic tìm kiếm.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/GiaoDienKhamPha.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/components/ChonSapXep.tsx
 * - apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx
 * - apps/mobile/src/features/explore/components/OTimKiem.tsx
 * - apps/mobile/src/features/explore/components/TheDiTich.tsx
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/shared/components/AnhBia.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - ../../../../../packages/ui-tokens/MauVaKichThuoc
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { StyleSheet } from 'react-native'
import { colors, radii, spacing } from '../../../../../packages/ui-tokens/MauVaKichThuoc'
export const explore = StyleSheet.create({
  // CHỨC NĂNG: Nền nhẹ làm thẻ trắng nổi rõ; hàng tiêu đề được xuống dòng khi chữ lớn.
  page: { flex: 1, backgroundColor: colors.page },
  body: { padding: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  title: { color: colors.text, fontSize: 21, lineHeight: 29, fontWeight: '700', flex: 1 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  // CHỨC NĂNG: Ô nhập lớn dễ chạm, nền trắng và viền phân biệt với ảnh bìa.
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 54,
    gap: spacing.sm,
  },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: spacing.md, minWidth: 0 },
  icon: {
    padding: spacing.sm,
    minWidth: 44,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // CHỨC NĂNG: Chip rộng theo chữ thay vì ép tên danh mục vào ô 72px.
  chip: {
    minWidth: 88,
    maxWidth: 180,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipIcon: { fontSize: 24, color: colors.primary },
  chipText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  sort: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  // CHỨC NĂNG: Cả thẻ bấm được, khoảng cách và ảnh cố định giúp quét danh sách nhanh.
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  cardTitle: { color: colors.text, fontSize: 16, lineHeight: 23, fontWeight: '700' },
  badge: {
    color: colors.primary,
    backgroundColor: colors.soft,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 112,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.soft,
  },
  featured: {
    minHeight: 320,
    borderRadius: radii.lg,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredText: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background },
  pressed: { opacity: 0.8 },
})
