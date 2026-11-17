/**
 * FILE: apps/mobile/src/shared/GiaoDienChung.ts
 * FILE NÀY LÀM GÌ: Màu và style nền tảng của mobile, dùng lại token chung để các màn có hình thức thống nhất.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
