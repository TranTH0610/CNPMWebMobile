/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp nút, trạng thái, chọn ngôn ngữ và ảnh dự phòng.
 * Các màn visitor sử dụng; liên quan UC01–UC05.
 * Phụ thuộc React Native, hooks ngôn ngữ và ui-tokens.
 */

import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  LANGUAGES,
  type MessageKey,
} from '@travelguide/visitor-core'

import {
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

import {
  colors,
  spacing,
  radii,
} from '../../../../packages/ui-tokens/colors'

export { colors, spacing }

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
    fontWeight: '700',
    color: colors.text,
  },
  heading: {
    fontSize: 18,
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

// CHỨC NĂNG: Nút dùng chung.
// XỬ LÝ: Caller truyền chữ đã dịch; hỗ trợ trạng thái chọn và khóa.
export function Action({
  title,
  onPress,
  selected = false,
  disabled = false,
}: {
  title: string
  onPress: () => void
  selected?: boolean
  disabled?: boolean
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        ui.button,
        selected && {
          backgroundColor: colors.primary,
        },
        disabled && {
          opacity: 0.5,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? colors.background : colors.primary,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
    </Pressable>
  )
}

// CHỨC NĂNG: Hiển thị lựa chọn ngôn ngữ và lỗi lưu.
// XỬ LÝ: Cùng context với màn hình và tiêu đề điều hướng.
export function LanguageBar() {
  const {
    language,
    changeLanguage,
    saving,
    persistenceError,
  } = useVisitor()

  const t = useText()

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={ui.muted}>{t('language')}</Text>

      <View style={ui.row}>
        {LANGUAGES.map((item) => (
          <Action
            key={item.code}
            title={item.label}
            selected={item.code === language}
            disabled={saving}
            onPress={() => {
              void changeLanguage(item.code)
            }}
          />
        ))}
      </View>

      {persistenceError && (
        <Text accessibilityRole="alert" style={ui.muted}>
          {t(persistenceError)}
        </Text>
      )}
    </View>
  )
}

// CHỨC NĂNG: Phân biệt dữ liệu demo với nội dung chính thức.
// XỬ LÝ: Thông báo được dịch theo lựa chọn giao diện.
export function DemoNotice() {
  const t = useText()

  return (
    <View style={ui.banner}>
      <Text style={ui.muted}>{t('demo')}</Text>
    </View>
  )
}

// CHỨC NĂNG: Hiển thị loading, thông báo và thao tác khôi phục.
// XỬ LÝ: Chỉ nhận key dịch; không hiện lỗi kỹ thuật từ API.
export function State({
  message,
  busy = false,
  retry,
  back,
}: {
  message: MessageKey
  busy?: boolean
  retry?: () => void
  back?: () => void
}) {
  const t = useText()

  return (
    <View style={ui.content}>
      {busy && (
        <ActivityIndicator
          color={colors.primary}
          accessibilityLabel={t('loading')}
        />
      )}

      <Text
        accessibilityRole={busy ? 'text' : 'alert'}
        style={ui.text}
      >
        {t(message)}
      </Text>

      {retry && (
        <Action title={t('retry')} onPress={retry} />
      )}

      {back && (
        <Action title={t('back')} onPress={back} />
      )}
    </View>
  )
}

// CHỨC NĂNG: Hiển thị ảnh hoặc placeholder khi ảnh thiếu/hỏng.
// XỬ LÝ: URL thay đổi thì reset lỗi để thử tải URL mới.
export function PlaceImage({
  uri,
  title,
}: {
  uri?: string
  title: string
}) {
  const [failed, setFailed] = useState(false)
  const t = useText()

  useEffect(() => {
    setFailed(false)
  }, [uri])

  if (!uri || failed) {
    return (
      <View
        style={[
          ui.banner,
          {
            minHeight: 110,
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={ui.muted}>{t('noImage')}</Text>
      </View>
    )
  }

  return (
    <Image
      source={{ uri }}
      onError={() => setFailed(true)}
      accessibilityLabel={title}
      style={{
        width: '100%',
        height: 160,
        borderRadius: radii.sm,
      }}
    />
  )
}