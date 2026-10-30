/**
 * FILE NÀY LÀM GÌ
 * Style tái sử dụng cho khu vực khám phá mobile; tách bố cục/hiển thị khỏi xử lý tìm kiếm.
 *
 * VỊ TRÍ: apps/mobile/src/styles/explore.ts
 * DÙNG BỞI: apps/mobile/src/components/CategoryChips.tsx; apps/mobile/src/components/Cover.tsx;
 * apps/mobile/src/components/index.ts; và các nơi import khác.
 * PHỤ THUỘC: react-native; ../../../../packages/ui-tokens/colors
 * TẠI SAO TÁCH FILE: Tách phần trình bày giúp đổi màu/bố cục đồng bộ mà không chạm vào nghiệp
 * vụ.
 */
// Nhập các thành phần từ 'react-native'.
import { StyleSheet } from 'react-native'
// Nhập các thành phần từ '../../../../packages/ui-tokens/colors'.
import { colors, radii, spacing } from '../../../../packages/ui-tokens/colors'

// CHỨC NĂNG: Định nghĩa style dùng lại cho màn khám phá.
// XỬ LÝ: Màu và spacing lấy từ token.
// Khai báo explore: Gọi StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background, }, body: { paddin.
export const explore = StyleSheet.create({
  // Gán thuộc tính page: tạo object gồm flex, backgroundColor.
  page: {
    // Gán thuộc tính flex: giá trị số 1.
    flex: 1,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `backgroundColor: colors.background,`: Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    backgroundColor: colors.background,
  },
  // Gán thuộc tính body: tạo object gồm padding.
  body: {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `padding: spacing.lg,`: Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    padding: spacing.lg,
  },
  // Gán thuộc tính row: tạo object gồm flexDirection, alignItems, gap.
  row: {
    // Gán thuộc tính flexDirection: chuỗi 'row'.
    flexDirection: 'row',
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    gap: spacing.sm,
  },
  // Gán thuộc tính title: tạo object gồm color, fontSize, fontWeight, flex.
  title: {
    // Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.text,
    // Gán thuộc tính fontSize: giá trị số 19.
    fontSize: 19,
    // Gán thuộc tính fontWeight: chuỗi '700'.
    fontWeight: '700',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `flex: 1,`: Gán thuộc tính flex: giá trị số 1.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    flex: 1,
  },
  // Gán thuộc tính muted: tạo object gồm color, fontSize, lineHeight.
  muted: {
    // Gán thuộc tính color: đọc colors.muted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.muted,
    // Gán thuộc tính fontSize: giá trị số 12.
    fontSize: 12,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `lineHeight: 18,`: Gán thuộc tính lineHeight: giá trị số 18.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    lineHeight: 18,
  },
  // Gán thuộc tính search: tạo object gồm flexDirection, alignItems, backgroundColor, borderRadius, paddingHorizontal, minHeight, gap.
  search: {
    // Gán thuộc tính flexDirection: chuỗi 'row'.
    flexDirection: 'row',
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    // Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    backgroundColor: colors.page,
    // Gán thuộc tính borderRadius: đọc radii.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.md,
    // Gán thuộc tính paddingHorizontal: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingHorizontal: spacing.md,
    // Gán thuộc tính minHeight: giá trị số 48.
    minHeight: 48,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    gap: spacing.sm,
  },
  // Gán thuộc tính input: tạo object gồm flex, color, fontSize, paddingVertical, minWidth.
  input: {
    // Gán thuộc tính flex: giá trị số 1.
    flex: 1,
    // Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.text,
    // Gán thuộc tính fontSize: giá trị số 14.
    fontSize: 14,
    // Gán thuộc tính paddingVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingVertical: spacing.md,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `minWidth: 0,`: Gán thuộc tính minWidth: giá trị số 0.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    minWidth: 0,
  },
  // Gán thuộc tính icon: tạo object gồm padding, minWidth, minHeight, alignItems, justifyContent.
  icon: {
    // Gán thuộc tính padding: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.sm,
    // Gán thuộc tính minWidth: giá trị số 40.
    minWidth: 40,
    // Gán thuộc tính minHeight: giá trị số 40.
    minHeight: 40,
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `justifyContent: 'center',`: Gán thuộc tính justifyContent: chuỗi 'center'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    justifyContent: 'center',
  },
  // Gán thuộc tính chip: tạo object gồm width, alignItems, padding, borderRadius, gap, backgroundColor.
  chip: {
    // Gán thuộc tính width: giá trị số 72.
    width: 72,
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    // Gán thuộc tính padding: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.sm,
    // Gán thuộc tính borderRadius: đọc radii.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.md,
    // Gán thuộc tính gap: đọc spacing.xs từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    gap: spacing.xs,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `backgroundColor: colors.page,`: Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    backgroundColor: colors.page,
  },
  // Gán thuộc tính chipIcon: tạo object gồm fontSize, color.
  chipIcon: {
    // Gán thuộc tính fontSize: giá trị số 25.
    fontSize: 25,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `color: colors.primary,`: Gán thuộc tính color: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    color: colors.primary,
  },
  // Gán thuộc tính chipText: tạo object gồm fontSize, color, textAlign.
  chipText: {
    // Gán thuộc tính fontSize: giá trị số 11.
    fontSize: 11,
    // Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.text,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `textAlign: 'center',`: Gán thuộc tính textAlign: chuỗi 'center'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    textAlign: 'center',
  },
  // Gán thuộc tính sort: tạo object gồm borderWidth, borderColor, borderRadius, padding, flexDirection, alignItems, gap.
  sort: {
    // Gán thuộc tính borderWidth: giá trị số 1.
    borderWidth: 1,
    // Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderColor: colors.border,
    // Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.sm,
    // Gán thuộc tính padding: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.sm,
    // Gán thuộc tính flexDirection: chuỗi 'row'.
    flexDirection: 'row',
    // Gán thuộc tính alignItems: chuỗi 'center'.
    alignItems: 'center',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    gap: spacing.sm,
  },
  // Gán thuộc tính card: tạo object gồm flexDirection, gap, borderBottomWidth, borderBottomColor, paddingVertical, alignItems.
  card: {
    // Gán thuộc tính flexDirection: chuỗi 'row'.
    flexDirection: 'row',
    // Gán thuộc tính gap: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    gap: spacing.md,
    // Gán thuộc tính borderBottomWidth: giá trị số 1.
    borderBottomWidth: 1,
    // Gán thuộc tính borderBottomColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderBottomColor: colors.border,
    // Gán thuộc tính paddingVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingVertical: spacing.md,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `alignItems: 'center',`: Gán thuộc tính alignItems: chuỗi 'center'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    alignItems: 'center',
  },
  // Gán thuộc tính cardTitle: tạo object gồm color, fontSize, fontWeight.
  cardTitle: {
    // Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.text,
    // Gán thuộc tính fontSize: giá trị số 15.
    fontSize: 15,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `fontWeight: '700',`: Gán thuộc tính fontWeight: chuỗi '700'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    fontWeight: '700',
  },
  // Gán thuộc tính badge: tạo object gồm color, backgroundColor, borderRadius, paddingHorizontal, paddingVertical, fontSize, alignSelf, overflow.
  badge: {
    // Gán thuộc tính color: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    color: colors.primary,
    // Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    backgroundColor: colors.soft,
    // Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.sm,
    // Gán thuộc tính paddingHorizontal: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingHorizontal: spacing.sm,
    // Gán thuộc tính paddingVertical: đọc spacing.xs từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    paddingVertical: spacing.xs,
    // Gán thuộc tính fontSize: giá trị số 11.
    fontSize: 11,
    // Gán thuộc tính alignSelf: chuỗi 'flex-start'.
    alignSelf: 'flex-start',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `overflow: 'hidden',`: Gán thuộc tính overflow: chuỗi 'hidden'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    overflow: 'hidden',
  },
  // Gán thuộc tính image: tạo object gồm width, height, borderRadius, overflow, backgroundColor.
  image: {
    // Gán thuộc tính width: giá trị số 94.
    width: 94,
    // Gán thuộc tính height: giá trị số 92.
    height: 92,
    // Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.sm,
    // Gán thuộc tính overflow: chuỗi 'hidden'.
    overflow: 'hidden',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `backgroundColor: colors.page,`: Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    backgroundColor: colors.page,
  },
  // Gán thuộc tính featured: tạo object gồm height, borderRadius, overflow, justifyContent, backgroundColor.
  featured: {
    // Gán thuộc tính height: giá trị số 205.
    height: 205,
    // Gán thuộc tính borderRadius: đọc radii.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderRadius: radii.md,
    // Gán thuộc tính overflow: chuỗi 'hidden'.
    overflow: 'hidden',
    // Gán thuộc tính justifyContent: chuỗi 'flex-end'.
    justifyContent: 'flex-end',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `backgroundColor: colors.page,`: Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    backgroundColor: colors.page,
  },
  // Gán thuộc tính featuredText: tạo object gồm padding, gap, backgroundColor.
  featuredText: {
    // Gán thuộc tính padding: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    padding: spacing.md,
    // Gán thuộc tính gap: đọc spacing.xs từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    gap: spacing.xs,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `backgroundColor: colors.overlay,`: Gán thuộc tính backgroundColor: đọc colors.overlay từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    backgroundColor: colors.overlay,
  },
})
