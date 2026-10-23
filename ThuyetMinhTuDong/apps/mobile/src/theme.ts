/**
 * FILE NÀY LÀM GÌ: Style dùng chung của mobile, lấy màu và khoảng cách từ ui-tokens.
 * Vị trí: apps/mobile/src/theme.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { StyleSheet } from 'react-native'
import { colors, spacing, radii } from '../../../packages/ui-tokens/colors'

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
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
  },
  heading: {
    fontSize: 18,
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
    fontSize: 14,
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
export { colors, spacing, radii } from '../../../packages/ui-tokens/colors'
