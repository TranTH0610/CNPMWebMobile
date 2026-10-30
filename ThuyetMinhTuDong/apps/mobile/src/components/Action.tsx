/**
 * FILE NÀY LÀM GÌ
 * Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái khóa/được
 * chọn.
 *
 * VỊ TRÍ: apps/mobile/src/components/Action.tsx
 * DÙNG BỞI: apps/mobile/src/components/admin/AdminUI.tsx;
 * apps/mobile/src/components/admin/LocalMediaPicker.tsx;
 * apps/mobile/src/components/ContentSources.tsx; và các nơi import khác.
 * PHỤ THUỘC: react; react-native; @expo/vector-icons; ../theme
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập kiểu dữ liệu từ 'react'.
import type { ComponentProps } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Pressable, StyleSheet, Text } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '../theme'.
import { colors, spacing } from '../theme'

// CHỨC NĂNG: Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái
// khóa/được chọn.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Action({ title, onPress, selected = false, disabled = false, variant = 'secondary', icon }). Component hàm nhận props và dựng phần giao diện Action.
export function Action({ title, onPress, selected = false, disabled = false, variant = 'secondary', icon }: {
  // CHỨC NĂNG: Chữ hiển thị và tên đọc của nút; nơi gọi truyền chuỗi đã dịch.
  // Khai báo title, kiểu string.
  title: string
  // CHỨC NĂNG: Hàm được gọi khi nhấn; component nút không tự quyết định nghiệp vụ.
  // Khai báo onPress, kiểu () => void.
  onPress: () => void
  // CHỨC NĂNG: Đánh dấu nút đang được chọn, mặc định là false.
  // Khai báo selected không bắt buộc, kiểu boolean.
  selected?: boolean
  // CHỨC NĂNG: Khóa thao tác khi chưa sẵn sàng, mặc định là false.
  // Khai báo disabled không bắt buộc, kiểu boolean. Khóa thao tác khi điều kiện chưa sẵn sàng để tránh gửi lặp hoặc thao tác sai trạng thái.
  disabled?: boolean
  // CHỨC NĂNG: Chọn cách trình bày chính, phụ hoặc nền trong suốt.
  // Khai báo variant không bắt buộc, kiểu 'primary' | 'secondary' | 'ghost'.
  variant?: 'primary' | 'secondary' | 'ghost'
  // CHỨC NĂNG: Tên icon hợp lệ của Ionicons; có thể bỏ qua nếu chỉ cần chữ.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `icon?: ComponentProps<typeof Ionicons>['name']`: Khai báo icon không bắt buộc, kiểu ComponentProps<typeof Ionicons>['name'].
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  icon?: ComponentProps<typeof Ionicons>['name']
}) {
  // CHỨC NĂNG: Nút được chọn hoặc thuộc loại primary dùng kiểu nhấn mạnh.
  // Khai báo primary: tính biểu thức selected || variant === 'primary'.
  const primary = selected || variant === 'primary'
  // CHỨC NĂNG: Đổi màu chữ/icon theo nền nút để nội dung vẫn dễ đọc.
  // Khai báo tint: chọn giữa hai giá trị theo điều kiện primary.
  const tint = primary ? colors.white : colors.primary
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Đặt trường selected bằng giá trị của biến cùng tên. | Đặt trường disabled bằng giá trị của biến cùng tên.
   * DÒNG `disabled={disabled} onPress={onPress}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={({ pressed }) => [styles.button, primary && styles.primary, variant === 'ghost`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `disabled && styles.disabled, pressed && !disabled && styles.pressed]}>`: Đưa biểu thức JavaScript ({ pressed }) => [styles.button, primary && styles.primary, variant === 'ghost' && !primary && styles.ghost, d vào JSX.
   * DÒNG `{icon && <Ionicons name={icon} color={tint} size={19} accessible={false} />}`: Đưa biểu thức JavaScript icon && <Ionicons name={icon} color={tint} size={19} accessible={false} /> vào JSX. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessible: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={[styles.label, { color: tint }]}>{title}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: sử dụng tint làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ selected, disabled }}
      disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, primary && styles.primary, variant === 'ghost' && !primary && styles.ghost,
        disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      {icon && <Ionicons name={icon} color={tint} size={19} accessible={false} />}
      <Text style={[styles.label, { color: tint }]}>{title}</Text>
    </Pressable>
  )
}
// TẠI SAO (Action): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Gom style nút tại một nơi để các màn dùng cùng kích thước và phản hồi nhấn.
// Khai báo styles: Gọi StyleSheet.create({ button: { minHeight: 46, paddingHorizontal: spacing.lg, paddingVertica.
const styles = StyleSheet.create({
  // Gán thuộc tính button: tạo object gồm minHeight, paddingHorizontal, paddingVertical, borderRadius, borderWidth, borderColor, backgroundColor, flexDirection, alignItems. | Gán thuộc tính minHeight: giá trị số 46. | Gán thuộc tính paddingHorizontal: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính paddingVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 14.
  button: { minHeight: 46, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 14,
    // Gán thuộc tính borderWidth: giá trị số 1. | Gán thuộc tính borderColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background,
    // Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  // Gán thuộc tính primary: tạo object gồm backgroundColor, borderColor. | Gán thuộc tính backgroundColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  // Gán thuộc tính ghost: tạo object gồm backgroundColor, borderColor. | Gán thuộc tính backgroundColor: đọc colors.transparent từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderColor: đọc colors.transparent từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  ghost: { backgroundColor: colors.transparent, borderColor: colors.transparent },
  // Gán thuộc tính label: tạo object gồm flexShrink, textAlign, fontSize, lineHeight, fontWeight. | Gán thuộc tính flexShrink: giá trị số 1. | Gán thuộc tính textAlign: chuỗi 'center'. | Gán thuộc tính fontSize: giá trị số 14. | Gán thuộc tính lineHeight: giá trị số 21. | Gán thuộc tính fontWeight: chuỗi '600'.
  label: { flexShrink: 1, textAlign: 'center', fontSize: 14, lineHeight: 21, fontWeight: '600' },
  // Gán thuộc tính pressed: tạo object gồm opacity, transform. | Gán thuộc tính opacity: giá trị số 0.82. | Gán thuộc tính transform: tạo mảng [{ scale: 0.98 }]. | Gán thuộc tính scale: giá trị số 0.98.
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `disabled: { opacity: 0.45 },`: Gán thuộc tính disabled: tạo object gồm opacity. | Gán thuộc tính opacity: giá trị số 0.45.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  disabled: { opacity: 0.45 },
})
