/**
 * FILE NÀY LÀM GÌ: Nút mobile thống nhất màu, icon, vùng bấm và phản hồi nhấn.
 * Screens/components gọi; phụ thuộc ui-tokens và Ionicons đã có trong Expo.
 * Nhận tiêu đề đã dịch, tự xuống dòng khi tiếng Bồ/Nhật dài hơn tiếng Việt.
 */
import type { ComponentProps } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../theme'

export function Action({ title, onPress, selected = false, disabled = false, variant = 'secondary', icon }: {
  title: string
  onPress: () => void
  selected?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ComponentProps<typeof Ionicons>['name']
}) {
  const primary = selected || variant === 'primary'
  const tint = primary ? colors.white : colors.primary
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
const styles = StyleSheet.create({
  button: { minHeight: 46, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  ghost: { backgroundColor: colors.transparent, borderColor: colors.transparent },
  label: { flexShrink: 1, textAlign: 'center', fontSize: 14, lineHeight: 21, fontWeight: '600' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
})
