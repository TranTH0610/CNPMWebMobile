/**
 * FILE NÀY LÀM GÌ:
 * Chuyển ui-tokens thành các style tái sử dụng cho mobile.
 * Các component/màn M3 gọi file này; phụ thuộc React Native và ui-tokens.
 * Liên quan giao diện UC03, FR-41.
 */

import { StyleSheet } from 'react-native'

import {
  colors,
  spacing,
  radii,
  fonts,
  sizes,
} from '../../../packages/ui-tokens/colors'

export {
  colors,
  spacing,
  radii,
  fonts,
  sizes,
}

// CHỨC NĂNG: cung cấp style chung.
// XỬ LÝ: StyleSheet tạo style một lần, không tạo lại mỗi render.
export const ui = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fonts.title,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    fontSize: fonts.section,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: fonts.body,
    color: colors.text,
  },
  muted: {
    fontSize: fonts.small,
    color: colors.muted,
  },
  caption: {
    fontSize: fonts.caption,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  button: {
    minHeight: sizes.touch,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: fonts.body,
    fontWeight: '600',
  },
  iconButton: {
    width: sizes.touch,
    height: sizes.touch,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.round,
    backgroundColor: colors.background,
  },
  state: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
})