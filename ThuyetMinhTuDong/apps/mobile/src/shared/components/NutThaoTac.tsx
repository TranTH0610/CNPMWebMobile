/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái khóa/được chọn.
 *
 * VỊ TRÍ: apps/mobile/src/shared/components/NutThaoTac.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx
 * - apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx
 * - apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * - apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx
 * - apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx
 * - apps/mobile/src/features/admin/shared/components/ChonTepTuThietBi.tsx
 * - apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx
 * - apps/mobile/src/features/explore/components/KhoiChaoMung.tsx
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/features/journey/components/BanDoThamQuan.tsx
 * - apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 * - apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 * - apps/mobile/src/shared/components/TrangThaiDuLieu.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - @expo/vector-icons
 * - ../GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. Action
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import type { ComponentProps } from 'react'
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../GiaoDienChung'

// CHỨC NĂNG: Nút bấm dùng lại trên mobile; thống nhất màu, biểu tượng, vùng nhấn và trạng thái
// khóa/được chọn.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DUNG-CHUNG] Action ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function Action({
  title,
  onPress,
  selected = false,
  disabled = false,
  variant = 'secondary',
  icon,
  style,
}: {
  // CHỨC NĂNG: Chữ hiển thị và tên đọc của nút; nơi gọi truyền chuỗi đã dịch.

  title: string
  // CHỨC NĂNG: Hàm được gọi khi nhấn; component nút không tự quyết định nghiệp vụ.

  onPress: () => void
  // CHỨC NĂNG: Đánh dấu nút đang được chọn, mặc định là false.

  selected?: boolean
  // CHỨC NĂNG: Khóa thao tác khi chưa sẵn sàng, mặc định là false.

  disabled?: boolean
  // CHỨC NĂNG: Chọn cách trình bày chính, phụ hoặc nền trong suốt.

  variant?: 'primary' | 'secondary' | 'ghost'
  style?: StyleProp<ViewStyle>
  // CHỨC NĂNG: Tên icon hợp lệ của Ionicons; có thể bỏ qua nếu chỉ cần chữ.

  icon?: ComponentProps<typeof Ionicons>['name']
}) {
  // CHỨC NĂNG: Nút được chọn hoặc thuộc loại primary dùng kiểu nhấn mạnh.

  const primary = selected || variant === 'primary'
  // CHỨC NĂNG: Đổi màu chữ/icon theo nền nút để nội dung vẫn dễ đọc.

  const tint = primary ? colors.white : colors.primary

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        primary && styles.primary,
        variant === 'ghost' && !primary && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {icon && <Ionicons name={icon} color={tint} size={19} accessible={false} />}
      <Text style={[styles.label, { color: tint }]}>{title}</Text>
    </Pressable>
  )
}
// TẠI SAO (Action): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Gom style nút tại một nơi để các màn dùng cùng kích thước và phản hồi nhấn.

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,

    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  primary: { backgroundColor: colors.primary, borderColor: colors.primary },

  ghost: { backgroundColor: colors.transparent, borderColor: colors.transparent },

  label: { flexShrink: 1, textAlign: 'center', fontSize: 15, lineHeight: 21, fontWeight: '600' },

  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },

  disabled: { opacity: 0.45 },
})
