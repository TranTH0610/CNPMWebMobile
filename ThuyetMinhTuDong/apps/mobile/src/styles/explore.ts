/**
 * FILE NÀY LÀM GÌ: Tách riêng một phần giao diện để dễ tìm và bảo trì.
 * Vị trí: apps/mobile/src/styles/explore.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { StyleSheet } from 'react-native'
import { colors, radii, spacing } from '../../../../packages/ui-tokens/colors'

// CHỨC NĂNG: Định nghĩa style dùng lại cho màn khám phá.
// XỬ LÝ: Màu và spacing lấy từ token.
export const explore = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    flex: 1,
  },
  muted: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.page,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: spacing.md,
    minWidth: 0,
  },
  icon: {
    padding: spacing.sm,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    width: 72,
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.xs,
    backgroundColor: colors.page,
  },
  chipIcon: {
    fontSize: 25,
    color: colors.primary,
  },
  chipText: {
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
  sort: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    color: colors.primary,
    backgroundColor: colors.soft,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 11,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  image: {
    width: 94,
    height: 92,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.page,
  },
  featured: {
    height: 205,
    borderRadius: radii.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.page,
  },
  featuredText: {
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.overlay,
  },
})
