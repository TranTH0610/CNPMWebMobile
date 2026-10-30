/**
 * FILE NÀY LÀM GÌ
 * Màu và style nền tảng của mobile, dùng lại token chung để các màn có hình thức thống nhất.
 *
 * VỊ TRÍ: apps/mobile/src/theme.ts
 * DÙNG BỞI: apps/mobile/src/components/Action.tsx; apps/mobile/src/components/admin/AdminUI.tsx;
 * apps/mobile/src/components/admin/AudioPreview.tsx; và các nơi import khác.
 * PHỤ THUỘC: react-native; ../../../packages/ui-tokens/colors
 * TẠI SAO TÁCH FILE: Tách phần trình bày giúp đổi màu/bố cục đồng bộ mà không chạm vào nghiệp
 * vụ.
 */
// Nhập các thành phần từ 'react-native'.
import { StyleSheet } from 'react-native'
// Nhập các thành phần từ '../../../packages/ui-tokens/colors'.
import { colors, spacing, radii } from '../../../packages/ui-tokens/colors'

// CHỨC NĂNG: Tạo style tái sử dụng.
// XỬ LÝ: Màu và khoảng cách lấy từ package token.
// Khai báo ui: Gọi StyleSheet.create({ page: { flex: 1, backgroundColor: colors.page, }, content: { padding:.
export const ui = StyleSheet.create({
  // Gán thuộc tính page: tạo object gồm flex, backgroundColor.
  page: {
    // Gán thuộc tính flex: giá trị số 1.
    flex: 1,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `backgroundColor: colors.page,`: Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    backgroundColor: colors.page,
  },
  // Gán thuộc tính content: tạo object gồm padding, gap.
  content: {
    // Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.lg,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `gap: spacing.md,`: Gán thuộc tính gap: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    gap: spacing.md,
  },
  // Gán thuộc tính row: tạo object gồm flexDirection, flexWrap, alignItems, gap.
  row: {
    // Gán thuộc tính flexDirection: chuỗi 'row'.
    flexDirection: 'row',
    // Gán thuộc tính flexWrap: chuỗi 'wrap'.
    flexWrap: 'wrap',
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    gap: spacing.sm,
  },
  // Gán thuộc tính card: tạo object gồm backgroundColor, padding, borderRadius, borderColor, borderWidth, gap, marginBottom.
  card: {
    // Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    backgroundColor: colors.background,
    // Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.lg,
    // Gán thuộc tính borderRadius: đọc radii.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.md,
    // Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderColor: colors.border,
    // Gán thuộc tính borderWidth: giá trị số 1.
    borderWidth: 1,
    // Gán thuộc tính gap: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    gap: spacing.md,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `marginBottom: spacing.md,`: Gán thuộc tính marginBottom: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    marginBottom: spacing.md,
  },
  // Gán thuộc tính title: tạo object gồm fontSize, lineHeight, fontWeight, color.
  title: {
    // Gán thuộc tính fontSize: giá trị số 24.
    fontSize: 24,
    // Gán thuộc tính lineHeight: giá trị số 34.
    lineHeight: 34,
    // Gán thuộc tính fontWeight: chuỗi '700'.
    fontWeight: '700',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `color: colors.text,`: Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    color: colors.text,
  },
  // Gán thuộc tính heading: tạo object gồm fontSize, lineHeight, fontWeight, color.
  heading: {
    // Gán thuộc tính fontSize: giá trị số 18.
    fontSize: 18,
    // Gán thuộc tính lineHeight: giá trị số 27.
    lineHeight: 27,
    // Gán thuộc tính fontWeight: chuỗi '600'.
    fontWeight: '600',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `color: colors.text,`: Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    color: colors.text,
  },
  // Gán thuộc tính text: tạo object gồm fontSize, color, lineHeight.
  text: {
    // Gán thuộc tính fontSize: giá trị số 16.
    fontSize: 16,
    // Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.text,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `lineHeight: 24,`: Gán thuộc tính lineHeight: giá trị số 24.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    lineHeight: 24,
  },
  // Gán thuộc tính muted: tạo object gồm fontSize, color, lineHeight.
  muted: {
    // Gán thuộc tính fontSize: giá trị số 14.
    fontSize: 14,
    // Gán thuộc tính color: đọc colors.muted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.muted,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `lineHeight: 22,`: Gán thuộc tính lineHeight: giá trị số 22.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    lineHeight: 22,
  },
  // Gán thuộc tính input: tạo object gồm minHeight, padding, borderRadius, backgroundColor, borderWidth, borderColor, color.
  input: {
    // Gán thuộc tính minHeight: giá trị số 48.
    minHeight: 48,
    // Gán thuộc tính padding: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.md,
    // Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.sm,
    // Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    backgroundColor: colors.background,
    // Gán thuộc tính borderWidth: giá trị số 1.
    borderWidth: 1,
    // Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderColor: colors.border,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `color: colors.text,`: Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    color: colors.text,
  },
  // Gán thuộc tính button: tạo object gồm minHeight, paddingHorizontal, paddingVertical, borderWidth, borderColor, borderRadius, alignItems, justifyContent.
  button: {
    // Gán thuộc tính minHeight: giá trị số 44.
    minHeight: 44,
    // Gán thuộc tính paddingHorizontal: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingHorizontal: spacing.lg,
    // Gán thuộc tính paddingVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingVertical: spacing.md,
    // Gán thuộc tính borderWidth: giá trị số 1.
    borderWidth: 1,
    // Gán thuộc tính borderColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderColor: colors.primary,
    // Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.sm,
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `justifyContent: 'center',`: Gán thuộc tính justifyContent: chuỗi 'center'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    justifyContent: 'center',
  },
  // Gán thuộc tính banner: tạo object gồm backgroundColor, padding, borderRadius.
  banner: {
    // Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    backgroundColor: colors.soft,
    // Gán thuộc tính padding: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.md,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `borderRadius: radii.sm,`: Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    borderRadius: radii.sm,
  },
})
// Xuất lại thành phần từ '../../../packages/ui-tokens/colors'.
export { colors, spacing, radii } from '../../../packages/ui-tokens/colors'
