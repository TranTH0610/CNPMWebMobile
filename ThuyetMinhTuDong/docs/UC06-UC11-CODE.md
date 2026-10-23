# UC06–UC11: mã nguồn sau sắp xếp

Xem CAU_TRUC_DU_AN.md để biết vai trò thư mục và cách chạy.
Bản code cũ và cấu trúc trước khi di chuyển đã được sao lưu riêng.

## apps/mobile/src/hooks/usePlaces.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp hooks địa điểm đang được các màn hình gọi.
 * Vị trí: apps/mobile/src/hooks/usePlaces.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Điểm import hooks danh sách/chi tiết/tìm kiếm của ứng dụng.
// XỬ LÝ: Dùng chung triển khai với nền tảng còn lại, không sao chép nghiệp vụ.
export { usePublishedCatalog, usePublishedPlace, useExplore, usePlaceFilters, useVisitorPosition, useDebounce } from '@travelguide/visitor-core/react'
```

## apps/mobile/src/hooks/useVisitor.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp trạng thái du khách dùng trong UI.
 * Vị trí: apps/mobile/src/hooks/useVisitor.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Lấy ngôn ngữ và dấu tim trong phiên từ cùng provider.
export { useVisitor } from '@travelguide/visitor-core/react'
```

## apps/mobile/src/hooks/useJourney.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp hook phiên nghe/GPS cho các màn và component.
 * Vị trí: apps/mobile/src/hooks/useJourney.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Dùng cùng phiên audio/GPS và tiến độ trên toàn ứng dụng.
export { useJourney } from '@travelguide/visitor-core/journey/react'
```

## apps/mobile/src/i18n/index.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Khởi tạo i18n và cung cấp hàm dịch cho ứng dụng.
 * Vị trí: apps/mobile/src/i18n/index.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { createVisitorI18n } from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Khởi tạo ngôn ngữ đúng một lần ở tầng ứng dụng.
// XỬ LÝ: Resource VI/EN/CN/PT/JA dùng chung với nền tảng còn lại.
export const boot = createVisitorI18n()
export { useText } from '@travelguide/visitor-core/react'
```

## apps/web/src/hooks/usePlaces.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp hooks địa điểm đang được các màn hình gọi.
 * Vị trí: apps/web/src/hooks/usePlaces.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Điểm import hooks danh sách/chi tiết/tìm kiếm của ứng dụng.
// XỬ LÝ: Dùng chung triển khai với nền tảng còn lại, không sao chép nghiệp vụ.
export { usePublishedCatalog, usePublishedPlace, useExplore, usePlaceFilters, useVisitorPosition, useDebounce } from '@travelguide/visitor-core/react'
```

## apps/web/src/hooks/useVisitor.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp trạng thái du khách dùng trong UI.
 * Vị trí: apps/web/src/hooks/useVisitor.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Lấy ngôn ngữ và dấu tim trong phiên từ cùng provider.
export { useVisitor } from '@travelguide/visitor-core/react'
```

## apps/web/src/hooks/useJourney.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp hook phiên nghe/GPS cho các màn và component.
 * Vị trí: apps/web/src/hooks/useJourney.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Dùng cùng phiên audio/GPS và tiến độ trên toàn ứng dụng.
export { useJourney } from '@travelguide/visitor-core/journey/react'
```

## apps/web/src/i18n/index.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Khởi tạo i18n và cung cấp hàm dịch cho ứng dụng.
 * Vị trí: apps/web/src/i18n/index.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { createVisitorI18n } from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Khởi tạo ngôn ngữ đúng một lần ở tầng ứng dụng.
// XỬ LÝ: Resource VI/EN/CN/PT/JA dùng chung với nền tảng còn lại.
export const boot = createVisitorI18n()
export { useText } from '@travelguide/visitor-core/react'
```

## apps/mobile/src/theme.ts

```ts
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
```

## apps/mobile/src/styles/explore.ts

```ts
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
  favorite: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    borderRadius: 30,
    backgroundColor: colors.background,
  },
})
```

## apps/mobile/src/components/Action.tsx

```tsx
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
```

## apps/mobile/src/components/LanguageBar.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Danh sách chọn ngôn ngữ mobile đồng bộ với provider chung.
 * Vị trí: apps/mobile/src/components/LanguageBar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui, spacing } from '../theme'
import { Action } from './Action'
import { Text, View } from 'react-native'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

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
```

## apps/mobile/src/components/DemoNotice.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thông báo nội dung đang là dữ liệu demo theo ngôn ngữ hiện tại.
 * Vị trí: apps/mobile/src/components/DemoNotice.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui } from '../theme'
import { Text, View } from 'react-native'
import { useText } from '../i18n/index'

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
```

## apps/mobile/src/components/State.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trạng thái tải/lỗi/thông báo và các nút thử lại hoặc quay lại.
 * Vị trí: apps/mobile/src/components/State.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui, colors } from '../theme'
import { Action } from './Action'
import { ActivityIndicator, Text, View } from 'react-native'
import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

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
```

## apps/mobile/src/components/PlaceImage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ảnh địa điểm có placeholder và thử lại khi URL thay đổi.
 * Vị trí: apps/mobile/src/components/PlaceImage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { ui, radii } from '../theme'
import { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { resolvePlaceImage } from '../services/placeImages'
import { useText } from '../i18n/index'

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
      source={resolvePlaceImage(uri)}
      onError={() => setFailed(true)}
      accessibilityLabel={title}
      style={{
        width: '100%',
        height: 220,
        borderRadius: radii.sm,
      }}
    />
  )
}
```

## apps/mobile/src/components/Cover.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ảnh bìa mobile có placeholder khi ảnh thiếu hoặc tải lỗi.
 * Vị trí: apps/mobile/src/components/Cover.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { resolvePlaceImage } from '../services/placeImages'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị ảnh co theo khung hoặc placeholder.
// XỬ LÝ: URL đổi thì reset lỗi; dùng absoluteFill đúng phiên bản RN hiện tại.
export function Cover({
  uri,
  style,
}: {
  uri?: string
  style?: StyleProp<ViewStyle>
}) {
  const [failed, setFailed] = useState(false)
  const t = useText()

  useEffect(() => setFailed(false), [uri])

  return (
    <View
      style={[
        {
          backgroundColor: colors.soft,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {uri && !failed ? (
        <Image
          source={resolvePlaceImage(uri)}
          onError={() => setFailed(true)}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons
            name="image-outline"
            size={28}
            color={colors.muted}
          />
          <Text style={explore.muted}>
            {t('noImage')}
          </Text>
        </View>
      )}
    </View>
  )
}
```

## apps/mobile/src/components/SearchBar.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ô tìm kiếm mobile, thao tác quay lại/xóa và mở bộ lọc.
 * Vị trí: apps/mobile/src/components/SearchBar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { Pressable, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Ô tìm có quay lại, xóa và bộ lọc.
// XỬ LÝ: Không debounce trong component; hook chung chịu trách nhiệm lọc.
export function SearchBar({
  value,
  onChange,
  onBack,
  onFocus,
  onFilter,
  autoFocus = false,
}: {
  value: string
  onChange: (value: string) => void
  onBack?: () => void
  onFocus?: () => void
  onFilter?: () => void
  autoFocus?: boolean
}) {
  const t = useText()

  return (
    <View style={explore.row}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          onPress={onBack}
          style={explore.icon}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text}
          />
        </Pressable>
      )}

      <View style={[explore.search, { flex: 1 }]}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.muted}
        />

        <TextInput
          style={explore.input}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          autoFocus={autoFocus}
          placeholder={t('search')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('search')}
          autoCorrect={false}
        />

        {!!value && (
          <Pressable
            onPress={() => onChange('')}
            accessibilityLabel={t('clearSearch')}
            accessibilityRole="button"
            style={explore.icon}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>

      {onFilter && (
        <Pressable
          accessibilityLabel={t('filters')}
          accessibilityRole="button"
          onPress={onFilter}
          style={explore.sort}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={colors.text}
          />
        </Pressable>
      )}
    </View>
  )
}
```

## apps/mobile/src/components/CategoryChips.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị các chip danh mục có dữ liệu và cập nhật mục đang chọn.
 * Vị trí: apps/mobile/src/components/CategoryChips.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors, spacing } from '../theme'
import { FlatList, Pressable, Text } from 'react-native'
import { categoryIcons } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Dãy chip cuộn ngang.
// XỬ LÝ: Chỉ hiện khi có ít nhất hai danh mục, key dùng mã ổn định.
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: readonly Category[]
  selected: readonly Category[]
  onSelect: (value: Category[]) => void
}) {
  const t = useText()

  if (categories.length < 2) return null

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={[null, ...categories]}
      contentContainerStyle={{
        gap: spacing.sm,
        paddingVertical: spacing.md,
      }}
      keyExtractor={(item) => item ?? 'all'}
      renderItem={({ item }) => {
        const active = item
          ? selected.includes(item)
          : selected.length === 0

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(item ? [item] : [])}
            style={[
              explore.chip,
              active && {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                explore.chipIcon,
                active && { color: colors.white },
              ]}
            >
              {item ? categoryIcons[item] : '▥'}
            </Text>

            <Text
              style={[
                explore.chipText,
                active && { color: colors.white },
              ]}
            >
              {t(item ? `category_${item}` : 'all')}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}
```

## apps/mobile/src/components/SortDropdown.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Chọn sắp xếp theo tên hoặc gần nhất; báo cách sắp xếp thực tế.
 * Vị trí: apps/mobile/src/components/SortDropdown.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { Alert, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { SortOrder } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Chọn cách sắp xếp bằng hộp native.
// XỬ LÝ: Nhãn thể hiện thứ tự thực tế; GPS do màn gọi xử lý.
export function SortDropdown({
  effectiveOrder,
  onSelect,
}: {
  effectiveOrder: SortOrder
  onSelect: (value: SortOrder) => void
}) {
  const t = useText()

  return (
    <Pressable
      style={explore.sort}
      accessibilityRole="button"
      accessibilityLabel={t('sort')}
      onPress={() => Alert.alert(t('sort'), undefined, [
        {
          text: t('nearest'),
          onPress: () => onSelect('nearest'),
        },
        {
          text: t('name'),
          onPress: () => onSelect('name'),
        },
        {
          text: t('close'),
          style: 'cancel',
        },
      ])}
    >
      <Text style={{ color: colors.text, fontSize: 12 }}>
        {t(effectiveOrder)}
      </Text>
      <Ionicons
        name="chevron-down"
        size={14}
        color={colors.muted}
      />
    </Pressable>
  )
}
```

## apps/mobile/src/components/PlaceCard.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thẻ địa điểm, ảnh dự phòng, danh mục, khoảng cách nếu có và nút tim cục bộ.
 * Vị trí: apps/mobile/src/components/PlaceCard.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors, spacing } from '../theme'
import { Cover } from './Cover'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { categoryOf, distanceTo, publishedText } from '@travelguide/visitor-core'
import type { PlaceRecord, Point } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Card lớn hoặc card ngang.
// XỬ LÝ: Nút tim độc lập nút mở bài, không bấm tim rồi mở nhầm chi tiết.
export function PlaceCard({
  place,
  onOpen,
  featured = false,
  width,
  origin,
}: {
  place: PlaceRecord
  onOpen: () => void
  featured?: boolean
  width?: number
  origin?: Point
}) {
  const {
    language,
    favorites,
    toggleFavorite,
  } = useVisitor()

  const t = useText()
  const content = publishedText(place, language)
  const title = content?.title ?? place.canonicalTitle
  const meters = distanceTo(place, origin)

  const heart = (
    <Pressable
      style={
        featured
          ? [explore.icon, explore.favorite]
          : explore.icon
      }
      accessibilityRole="button"
      accessibilityLabel={t(
        favorites.has(place.id) ? 'unfavorite' : 'favorite',
      )}
      accessibilityState={{
        selected: favorites.has(place.id),
      }}
      onPress={() => toggleFavorite(place.id)}
    >
      <Ionicons
        name={favorites.has(place.id) ? 'heart' : 'heart-outline'}
        size={22}
        color={colors.primary}
      />
    </Pressable>
  )

  if (featured) {
    return (
      <View style={[explore.featured, { width }]}>
        <Cover
          uri={place.images[0]}
          style={StyleSheet.absoluteFill}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={title}
          onPress={onOpen}
          style={explore.featuredText}
        >
          <Text style={explore.badge}>
            {t(`category_${categoryOf(place)}`)}
          </Text>

          <Text
            style={[
              explore.cardTitle,
              { color: colors.white, fontSize: 22 },
            ]}
          >
            {title}
          </Text>

          <Text style={{ color: colors.white, fontSize: 12 }}>
            {content ? t('city') : t('missing')}
          </Text>
        </Pressable>

        {heart}
      </View>
    )
  }

  return (
    <View style={explore.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onOpen}
      >
        <Cover uri={place.images[0]} style={explore.image} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        style={{ flex: 1, gap: spacing.sm }}
      >
        <Text style={explore.cardTitle}>{title}</Text>

        <Text style={explore.badge}>
          {t(`category_${categoryOf(place)}`)}
        </Text>

        <Text style={explore.muted}>
          {content ? t('city') : t('missing')}
        </Text>

        {meters !== undefined && (
          <Text style={explore.muted}>
            {(meters / 1000).toFixed(2)} km
          </Text>
        )}
      </Pressable>

      {heart}
    </View>
  )
}
```

## apps/mobile/src/components/ListenButton.tsx

```tsx
/** FILE NÀY LÀM GÌ: Nút nghe chính có icon và trạng thái đồng bộ với player. */
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { Action } from './Action'

export function ListenButton({ id }: { id: string }) {
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  const same = state.session?.placeId === id && state.session.language === language
  const playing = same && state.status === 'playing'
  const paused = same && state.status === 'paused'
  const busy = state.status === 'loading'
  const label = t(busy ? 'jPreparing' : playing ? 'jPause' : paused ? 'jResume' : 'jPlay')
  // CHỨC NĂNG: Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu.
  const toggle = () => {
    if (playing) engine.pause()
    else if (paused) void engine.resume()
    else void engine.play(id, language)
  }
  return <Action title={label} icon={playing ? 'pause' : 'play'} variant="primary" disabled={busy} onPress={toggle} />
}
```

## apps/mobile/src/components/JourneyPlayer.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Player native có ảnh, nút tròn, thanh tua và chọn tốc độ.
 * RootNavigator đặt ngoài Stack; phụ thuộc Slider, Ionicons và useJourney.
 * UC07–UC11: giữ audio thật, dọn bản nháp thanh tua khi đổi bài/ngôn ngữ.
 */
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n'
import { useJourney } from '../hooks/useJourney'
import { Action } from './Action'
import { Cover } from './Cover'
import { colors, spacing } from '../theme'

const clock = (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')
export function JourneyPlayer() {
  const { engine, state, resumeSaved } = useJourney()
  const t = useText()
  const insets = useSafeAreaInsets()
  const [draft, setDraft] = useState<number>()
  const session = state.session
  useEffect(() => { setDraft(undefined) }, [session?.audioId, session?.placeId, session?.language])
  if (!session && !state.restore && !state.error && state.status !== 'loading') return null
  const place = state.places.find(item => item.id === session?.placeId)
  const playing = state.status === 'playing', ended = state.status === 'ended'
  const busy = state.status === 'loading', disabled = busy || state.status === 'error'
  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')
  const toggle = () => {
    if (!session) return
    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }
  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {state.restore && <View style={styles.notice}>
        <Text style={styles.noticeTitle}>{t('jContinue')}</Text>
        {state.changed && <Text style={styles.noticeText}>{t('jVersionChanged')}</Text>}
        <View style={styles.noticeActions}>
          <Action title={t('jContinue')} icon="play" variant="primary" onPress={() => { void resumeSaved() }} />
          <Action title={t('jDiscard')} onPress={() => engine.dismissRestore()} />
        </View>
      </View>}
      {state.error && <View style={styles.notice}>
        <Text accessibilityRole="alert" style={styles.noticeText}>{t(state.error)}</Text>
        {(state.status === 'error' || state.error === 'loadError') && <Action title={t('jRetry')} onPress={() => engine.retry()} />}
      </View>}
      {busy && <Text style={styles.noticeText}>{t('jPreparing')}</Text>}
      {session && <View style={styles.player}>
        <View style={styles.header}>
          <Cover uri={place?.images[0]} style={styles.artwork} />
          <View style={styles.metadata}>
            <View style={styles.topline}>
              <Ionicons name="headset-outline" size={14} color={colors.playerMuted} />
              <Text style={styles.eyebrow}>{t('read')}</Text>
            </View>
            <Text numberOfLines={1} style={styles.title}>{session.title}</Text>
            <Text numberOfLines={1} style={styles.status}>{LANGUAGES.find(item => item.code === session.language)?.label} · {t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}</Text>
          </View>
        </View>
        {/* CHỨC NĂNG: Giữ tay kéo ổn định; chỉ tua nguồn thật khi thả tay. */}
        <Slider accessibilityLabel={t('jSeek')} minimumValue={0} maximumValue={session.duration}
          minimumTrackTintColor={colors.playerAccent} maximumTrackTintColor={colors.playerControl} thumbTintColor={colors.white}
          value={draft ?? session.position} disabled={disabled}
          onSlidingStart={() => setDraft(session.position)} onValueChange={setDraft}
          onSlidingComplete={value => { void engine.seek(value).finally(() => setDraft(undefined)) }} />
        <View style={styles.times}><Text style={styles.time}>{clock(draft ?? session.position)}</Text><Text style={styles.time}>{clock(session.duration)}</Text></View>
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('jBack')} disabled={disabled}
            onPress={() => { void engine.seek(session.position - 10) }} style={({ pressed }) => [styles.skip, disabled && styles.disabled, pressed && styles.pressed]}>
            <Ionicons name="play-back" size={22} color={colors.white} /><Text style={styles.skipText}>10</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={primaryLabel} disabled={busy} onPress={toggle}
            style={({ pressed }) => [styles.play, busy && styles.disabled, pressed && styles.pressed]}>
            <Ionicons name={playing ? 'pause' : ended ? 'refresh' : 'play'} size={27} color={colors.playerBackground} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('jForward')} disabled={disabled}
            onPress={() => { void engine.seek(session.position + 10) }} style={({ pressed }) => [styles.skip, disabled && styles.disabled, pressed && styles.pressed]}>
            <Ionicons name="play-forward" size={22} color={colors.white} /><Text style={styles.skipText}>10</Text>
          </Pressable>
        </View>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>{t('jSpeed')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rates}>
            {[0.75, 1, 1.25, 1.5, 2].map(rate => <Pressable key={rate} accessibilityRole="button"
              accessibilityLabel={t('jSpeed') + ' ' + rate + '×'} accessibilityState={{ selected: rate === session.rate, disabled }}
              disabled={disabled} onPress={() => engine.rate(rate)} style={[styles.rate, rate === session.rate && styles.selectedRate]}>
              <Text style={[styles.rateText, rate === session.rate && styles.selectedRateText]}>{rate}×</Text>
            </Pressable>)}
          </ScrollView>
        </View>
      </View>}
    </View>
  )
}
const styles = StyleSheet.create({
  shell: { padding: spacing.sm, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  player: { padding: spacing.md, borderRadius: 20, backgroundColor: colors.playerBackground },
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  artwork: { width: 56, height: 56, borderRadius: 13, overflow: 'hidden' },
  metadata: { flex: 1, gap: 3 },
  topline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eyebrow: { color: colors.playerMuted, fontSize: 11, lineHeight: 16 },
  title: { fontSize: 17, lineHeight: 25, color: colors.white, fontWeight: '700' },
  status: { fontSize: 11, lineHeight: 17, color: colors.playerMuted },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6 },
  time: { fontSize: 11, color: colors.playerMuted, fontVariant: ['tabular-nums'] },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginVertical: spacing.sm },
  skip: { minHeight: 44, minWidth: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.playerControl },
  skipText: { fontSize: 10, lineHeight: 12, color: colors.white, fontWeight: '600' },
  play: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rateLabel: { color: colors.playerMuted, fontSize: 11, maxWidth: 70 },
  rates: { flexDirection: 'row', gap: 6 },
  rate: { minWidth: 40, minHeight: 32, paddingHorizontal: 9, borderRadius: 10, backgroundColor: colors.playerControl, alignItems: 'center', justifyContent: 'center' },
  rateText: { color: colors.playerMuted, fontSize: 11, fontWeight: '600' },
  selectedRate: { backgroundColor: colors.playerAccent },
  selectedRateText: { color: colors.playerBackground },
  disabled: { opacity: 0.4 }, pressed: { opacity: 0.75 },
  notice: { padding: spacing.sm, gap: spacing.sm },
  noticeTitle: { fontSize: 15, lineHeight: 22, color: colors.text, fontWeight: '700' },
  noticeText: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  noticeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
})
```

## apps/mobile/src/hooks/useJourneyNavigation.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Điều hướng theo gợi ý GPS và chốt tiến độ khi app đổi trạng thái.
 * Vị trí: apps/mobile/src/hooks/useJourneyNavigation.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useJourney } from './useJourney'

export function useJourneyNavigation({ open }: { open: (id: string) => void }) {
  const { engine, state } = useJourney()
  useEffect(() => { if (state.suggestedId) open(state.suggestedId) }, [state.suggestedId, open])
  useEffect(() => { const subscription = AppState.addEventListener('change', () => engine.checkpoint()); return () => subscription.remove() }, [engine])

}
```

## apps/mobile/src/components/VisitorMap.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bản đồ native và marker bấm mở chi tiết; không tạo tuyến đi giả.
 * Vị trí: apps/mobile/src/components/VisitorMap.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Action } from './Action'
import { spacing } from '../theme'
import { Linking, Platform, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'

export function VisitorMap({ selected, onOpen }: { selected?: string; onOpen: (id: string) => void }) {
 const { state } = useJourney(), { language } = useVisitor(), t = useText()
 const point = selected ? MAP_POINTS[selected] : undefined
 const open = onOpen
 return (__DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? <MapView style={styles.map}
          key={selected ?? 'all'} initialRegion={{ latitude: point?.lat ?? 16.468, longitude: point?.lng ?? 107.578,
            latitudeDelta: point ? 0.003 : 0.012, longitudeDelta: point ? 0.003 : 0.012 }}>
          {state.places.map(place => { const p = MAP_POINTS[place.id]; return p ? <Marker key={place.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }} title={publishedText(place, language)?.title ?? place.canonicalTitle}
            onPress={() => open(place.id)} /> : null })}
          {state.fix && <Marker pinColor="blue" coordinate={{ latitude: state.fix.lat, longitude: state.fix.lng }} title={t('jMyLocation')} />}
        </MapView> : <Action title={t('jExternalMap')} onPress={() => {
          void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468) + '/' + (point?.lng ?? 107.578))
        }} />)
}
const styles = StyleSheet.create({ map: { height: 300, marginVertical: spacing.md } })
```

## apps/mobile/src/screens/JourneyScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Màn bản đồ, GPS và thứ tự tham quan tham khảo trên mobile.
 * Vị trí: apps/mobile/src/screens/JourneyScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { VisitorMap } from '../components/VisitorMap'
import { FlatList, Linking, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'
import { routeAvailable } from '@travelguide/visitor-core/journey'
import { Action, ui } from '../components/index'
import type { VisitorStack } from '../navigation/types'

export function JourneyScreen() {
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  const navigation = useNavigation<NativeStackNavigationProp<VisitorStack>>()
  const route = useRoute<RouteProp<VisitorStack, 'Journey'>>()
  const selected = route.params?.placeId
  const open = (id: string) => navigation.navigate('Detail', { placeId: id })
  return <SafeAreaView style={ui.page} edges={['left', 'right']}>
    <FlatList data={state.places} keyExtractor={place => place.id} contentContainerStyle={ui.content}
      ListHeaderComponent={<>
        <Text style={ui.title}>{t('jTitle')}</Text>
        <Text style={ui.muted}>{t('jReference')}</Text>
        <Action title={t(state.gps ? 'jGpsOff' : 'jGpsOn')} onPress={() => { void engine.gps(!state.gps) }} />
        {state.error && <Text style={ui.muted}>{t(state.error)}</Text>}
        {state.gps && !state.suggestedId && <Text style={ui.muted}>{t('jNoNearby')}</Text>}
        {/* CHỨC NĂNG: Marker lấy từ OSM; bấm marker mở chi tiết native.
            XỬ LÝ: Không vẽ đường thẳng giả thành lối đi qua tường thành. */}
        <VisitorMap selected={selected} onOpen={open} />
        <Text style={ui.heading}>{t('jRoutes')}</Text>
        {engine.ports.routes.map(r => <View key={r.id} style={ui.card}>
          <Text style={ui.heading}>{r.title[language]}</Text>
          {!r.verified && <Text style={ui.muted}>{t('jPreview')}</Text>}
          <Action title={t('jUseRoute')} disabled={!routeAvailable(r, state.places)} onPress={() => engine.selectRoute(r.id)} />
          {!routeAvailable(r, state.places) && <Text style={ui.muted}>{t('jRouteInvalid')}</Text>}
          {state.routeId === r.id && r.stops.map((id, index) => <Action key={id}
            title={(index + 1) + '. ' + (publishedText(state.places.find(p => p.id === id)!, language)?.title ?? id)} onPress={() => open(id)} />)}
        </View>)}
        <Action title={t('jSkipRoute')} onPress={() => engine.selectRoute()} />
        <Text style={ui.muted}>{t('jWalkingPending')}</Text>
        <Text style={ui.heading}>{t('allPlaces')}</Text>
      </>}
      renderItem={({ item }) => <View style={ui.card}>
        <Action title={publishedText(item, language)?.title ?? item.canonicalTitle} onPress={() => open(item.id)} />
        {MAP_POINTS[item.id] && <Action title={t('jSource')} onPress={() => { void Linking.openURL(MAP_POINTS[item.id].source) }} />}
      </View>} />
  </SafeAreaView>
}
```

## apps/mobile/src/screens/DetailScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị bài đọc đúng ngôn ngữ, nút nghe và nút mở bản đồ của địa điểm.
 * Vị trí: apps/mobile/src/screens/DetailScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { availableLanguages, LANGUAGES, publishedText } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Action, DemoNotice, LanguageBar, PlaceImage, State, ui } from '../components/index'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Tải đúng địa điểm theo tham số điều hướng.
// XỬ LÝ: ID sai, lỗi tải và thiếu bản ngôn ngữ được xử lý riêng.
export default function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<
  VisitorStack,
  'Detail'
>) {
  const { placeId } = route.params

  const data = usePublishedPlace(placeId)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Quay về danh sách.
  // XỬ LÝ: Hoạt động cả khi mở chi tiết từ QR.
  const back = () => {
    navigation.navigate('Places')
  }

  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  if (data.error || !data.place) {
    return (
      <State
        message={data.error ?? 'notFound'}
        retry={data.retry}
        back={back}
      />
    )
  }

  const place = data.place

  // CHỨC NĂNG: Chọn bài đọc bằng ngôn ngữ đang dùng trên giao diện.
  // XỬ LÝ: Không giữ useState riêng cho ngôn ngữ bài đọc.
  // Khi provider đổi language, tiêu đề/tab/bài đọc cùng render lại.
  const content = publishedText(
    place,
    language,
  )

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={ui.content}
      >
        <LanguageBar />

        <DemoNotice />

        <PlaceImage
          uri={place.images[0]}
          title={place.canonicalTitle}
        />

        {PLACE_PHOTOS[place.id]?.note?.[language] && <Text style={ui.muted}>{PLACE_PHOTOS[place.id].note?.[language]}</Text>}

        <Text style={ui.title}>
          {content?.title ?? place.canonicalTitle}
        </Text>

        <Text style={ui.muted}>
          {t('available')}
        </Text>

        <ListenButton id={place.id} />
        <Action title={t('jMap')} icon="map-outline" onPress={() => navigation.navigate('Journey', { placeId: place.id })} />
        <View style={ui.row}>
          {availableLanguages(place).map(
            (code) => (
              <Action
                key={code}
                title={
                  LANGUAGES.find(
                    (item) =>
                      item.code === code,
                  )?.label ?? code
                }
                selected={language === code}
                disabled={saving}
                onPress={() => {
                  // CHỨC NĂNG: Đổi ngôn ngữ cho toàn ứng dụng.
                  // XỬ LÝ: Provider cập nhật i18n và lưu AsyncStorage.
                  void changeLanguage(code)
                }}
              />
            ),
          )}
        </View>

        {content ? (
          <View style={ui.card}>
            <Text style={ui.muted}>
              {content.address}
            </Text>

            <Text style={ui.heading}>
              {t('read')}
            </Text>

            <Text style={ui.text}>
              {content.body}
            </Text>

            <Text style={ui.muted}>
              {t('version')}: {content.version}
            </Text>
          </View>
        ) : (
          <State message="missing" />
        )}

        <Text style={ui.muted}>
          {place.position?.verified
            ? (
              t('coordinates')
              + ': '
              + place.position.lat
              + ', '
              + place.position.lng
            )
            : t('unverified')}
        </Text>

        <Action
          title={t('back')}
          onPress={back}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
```

## apps/mobile/src/screens/ScanScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Quét QR được phép và điều hướng tới hệ thống/địa điểm theo parser chung.
 * Vị trí: apps/mobile/src/screens/ScanScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect, useRef, useState } from 'react'
import { AppState, Linking, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useIsFocused } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CatalogError, parseQrTarget } from '@travelguide/visitor-core'
import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Action, State, ui } from '../components/index'
import { qrPolicy } from '../services/platform'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Kết nối camera với kiểm tra QR và điều hướng.
// XỬ LÝ: Kiểm tra cả định dạng QR lẫn trạng thái công bố của địa điểm.
export default function ScanScreen({
  navigation,
}: NativeStackScreenProps<VisitorStack, 'Scan'>) {
  const [
    permission,
    requestPermission,
    getPermission,
  ] = useCameraPermissions()

  const [message, setMessage] = useState<MessageKey | null>(null)
  const [busy, setBusy] = useState(false)
  const [manual, setManual] = useState('')

  const [active, setActive] = useState(
    AppState.currentState === 'active',
  )

  const focused = useIsFocused()
  const locked = useRef(false)
  const generation = useRef(0)
  const mounted = useRef(true)

  const { catalog } = useVisitor()
  const t = useText()

  // CHỨC NĂNG: Theo dõi app đang hoạt động hay chạy nền.
  // XỬ LÝ: Gỡ listener khi unmount để không nhận sự kiện thừa.
  useEffect(() => {
    mounted.current = true

    const listener = AppState.addEventListener(
      'change',
      (state) => setActive(state === 'active'),
    )

    return () => {
      mounted.current = false
      listener.remove()
    }
  }, [])

  // CHỨC NĂNG: Đọc lại quyền sau khi quay về từ cài đặt thiết bị.
  // XỬ LÝ: Chỉ đọc quyền; không tự bật hộp xin quyền.
  // Rời màn/chạy nền thì vô hiệu hóa request QR đang chờ.
  useEffect(() => {
    if (active && focused) {
      void getPermission().catch(
        () => setMessage('cameraFailed'),
      )
    }

    if (!active || !focused) {
      generation.current++
      locked.current = false
      setBusy(false)
    }
  }, [active, focused, getPermission])

  // CHỨC NĂNG: Xử lý một kết quả camera hoặc link dán thủ công.
  // XỬ LÝ:
  // - Khóa bằng ref trước await để nhiều frame không mở nhiều màn.
  // - Request chỉ được điều hướng khi vẫn còn hiệu lực.
  // - replace bỏ màn quét khỏi đỉnh stack sau khi thành công.
  const open = async (raw: string) => {
    if (locked.current || !focused) return

    locked.current = true
    setBusy(true)

    const request = ++generation.current

    const current = () =>
      mounted.current
      && generation.current === request

    try {
      // CHỨC NĂNG: Phân biệt QR vào chung và QR một điểm.
      // XỬ LÝ: QR chung không bị coi là lỗi thiếu ID.
      const target = parseQrTarget(raw, qrPolicy)

      if (target.kind === 'home') {
        if (current()) {
          navigation.replace('Places')
        }

        return
      }

      // CHỨC NĂNG: Kiểm tra điểm tồn tại và còn được công bố.
      // XỬ LÝ: Đúng định dạng QR chưa đủ để cho mở địa điểm.
      const id = target.id
      await catalog.get(id)

      if (current()) {
        navigation.replace('Detail', {
          placeId: id,
        })
      }
    } catch (error: unknown) {
      if (current()) {
        setMessage(
          error instanceof CatalogError
            ? 'notFound'
            : error instanceof Error
              && error.message === 'invalidQr'
              ? 'invalidQr'
              : 'loadError',
        )
      }
    } finally {
      if (current()) setBusy(false)
    }
  }

  // CHỨC NĂNG: Cho phép quét lại sau lỗi.
  // XỬ LÝ: Mở khóa và xóa thông báo trước khi gắn camera trở lại.
  const reset = () => {
    locked.current = false
    setMessage(null)
  }

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <View style={[ui.content, { flex: 1 }]}>
        <Text style={ui.text}>{t('scanHint')}</Text>
        <Text style={ui.muted}>{t('browserOnly')}</Text>

        {!permission ? (
          <State message="loading" busy />
        ) : !permission.granted ? (
          <View style={ui.card}>
            <Text style={ui.text}>
              {t(
                permission.canAskAgain
                  ? 'cameraInfo'
                  : 'cameraDenied',
              )}
            </Text>

            <Action
              title={t(
                permission.canAskAgain
                  ? 'allowCamera'
                  : 'systemSettings',
              )}
              onPress={() => {
                if (permission.canAskAgain) {
                  void requestPermission().catch(
                    () => setMessage('cameraFailed'),
                  )
                } else {
                  void Linking.openSettings().catch(
                    () => setMessage('cameraFailed'),
                  )
                }
              }}
            />
          </View>
        ) : focused && active && !message ? (
          <CameraView
            style={{
              flex: 1,
              minHeight: 180,
            }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onMountError={() => setMessage('cameraFailed')}
            onBarcodeScanned={
              busy
                ? undefined
                : ({ data }) => {
                  void open(data)
                }
            }
          />
        ) : null}

        {busy && <State message="loading" busy />}

        {message && <State message={message} />}

        {message && (
          <Action
            title={t('again')}
            onPress={reset}
          />
        )}

        <TextInput
          style={ui.input}
          value={manual}
          onChangeText={setManual}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('enterQr')}
          accessibilityLabel={t('enterQr')}
        />

        <Action
          title={t('openQr')}
          disabled={busy || !manual.trim()}
          onPress={() => {
            void open(manual)
          }}
        />

        <Action
          title={t('back')}
          onPress={() => navigation.navigate('Places')}
        />
      </View>
    </SafeAreaView>
  )
}
```

## apps/mobile/src/services/platform.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Kết nối bộ nhớ ngôn ngữ, vị trí và chính sách URL/QR của nền tảng.
 * Vị trí: apps/mobile/src/services/platform.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { siteOrigin } from '@travelguide/visitor-core'
import type { Point, QrPolicy, StoragePort } from '@travelguide/visitor-core'

// CHỨC NĂNG: Đọc và lưu ngôn ngữ trên thiết bị.
// XỬ LÝ: Giữ khóa lang để tương thích dữ liệu người dùng đã lưu trước đây.
export const storage: StoragePort = {
  readLanguage: () => AsyncStorage.getItem('lang'),

  writeLanguage: async (language) => {
    await AsyncStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Xác định website mà scanner được phép nhận.
// XỬ LÝ:
// - Đọc biến môi trường Expo.
// - Thiếu hoặc sai cấu hình trả null.
// - HTTP được cho phép khi chạy môi trường phát triển.
export const webOrigin = (() => {
  const value =
    process.env.EXPO_PUBLIC_VISITOR_WEB_ORIGIN

  if (!value) {
    return null
  }

  try {
    return siteOrigin(value, __DEV__)
  } catch {
    return null
  }
})()

// CHỨC NĂNG: Giới hạn QR vào website của dự án.
// XỬ LÝ: Không tự nhận URL của một website bất kỳ.
export const qrPolicy: QrPolicy = {
  allowedOrigins: webOrigin ? [webOrigin] : [],
  allowHttp: __DEV__,
}

// CHỨC NĂNG: Xin vị trí để phục vụ sắp xếp gần nhất.
// XỬ LÝ:
// - Từ chối quyền sẽ ném lỗi để hook chuyển sang sắp xếp theo tên.
// - Chờ tối đa 12 giây để UI không chờ GPS vô hạn.
// - Dọn timer dù lấy vị trí thành công hay thất bại.
export async function getPosition(): Promise<Point> {
  const permission =
    await Location.requestForegroundPermissionsAsync()

  if (permission.status !== 'granted') {
    throw new Error('Location denied')
  }

  let timer:
    ReturnType<typeof setTimeout> | undefined

  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),

      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(
          () => reject(
            new Error('Location timeout'),
          ),
          12000,
        )
      }),
    ])

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
  } finally {
    if (timer) {
      clearTimeout(timer)
    }
  }
}
```

## apps/mobile/src/services/journeyAdapters.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Kết nối audio/GPS/bộ nhớ riêng nền tảng vào JourneyProvider.
 * Vị trí: apps/mobile/src/services/journeyAdapters.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import * as Location from 'expo-location'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import type { Track } from '@travelguide/visitor-core/journey'
import vi from '../../assets/demo-audio/vi.mp3'
import en from '../../assets/demo-audio/en.mp3'
import cn from '../../assets/demo-audio/cn.mp3'
import pt from '../../assets/demo-audio/pt.mp3'
import ja from '../../assets/demo-audio/ja.mp3'

const demo: Record<string, number> = { vi, en, cn, pt, ja }

export const journeyAdapters: JourneyAdapters = {
  read: () => AsyncStorage.getItem('visitor-journey-v1'),
  write: value => value === null ? AsyncStorage.removeItem('visitor-journey-v1') : AsyncStorage.setItem('visitor-journey-v1', value),
  async watch(next, fail) {
    const permission = await Location.requestForegroundPermissionsAsync()
    if (permission.status !== 'granted') throw new Error('GPS denied')
    let stopped = false, generation = 0
    let subscription: Location.LocationSubscription | undefined
    const start = async () => {
      const request = ++generation
      try {
        const result = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 }, p => {
          if (!stopped && request === generation) next({ lat: p.coords.latitude, lng: p.coords.longitude,
            accuracy: p.coords.accuracy ?? Infinity, timestamp: p.timestamp })
        })
        if (stopped || request !== generation) result.remove(); else subscription = result
      } catch { if (!stopped) fail() }
    }
    const listener = AppState.addEventListener('change', state => {
      generation++; subscription?.remove(); subscription = undefined
      if (state === 'active' && !stopped) void start()
    })
    if (AppState.currentState === 'active') await start()
    return () => { stopped = true; generation++; listener.remove(); subscription?.remove() }
  },
  async open(url, title): Promise<Track> {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' })
    const source = url.startsWith('demo:') ? demo[url.slice(5)] : url
    if (!source) throw new Error('Missing audio')
    const player = createAudioPlayer(source, { updateInterval: 250 })
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => { listener.remove(); reject(new Error('Audio timeout')) }, 20000)
        const listener = player.addListener('playbackStatusUpdate', status => {
          if (status.error || status.isLoaded) { clearTimeout(timer); listener.remove(); if (status.error) reject(new Error(status.error)); else resolve() }
        })
        if (player.isLoaded) { clearTimeout(timer); listener.remove(); resolve() }
      })
    } catch (error) { player.remove(); throw error }
    let disposed = false
    return {
      duration: player.duration,
      play: async () => { player.setActiveForLockScreen(true, { title }); player.play() },
      pause: () => player.pause(), seek: seconds => player.seekTo(seconds), rate: value => player.setPlaybackRate(value),
      listen: callback => {
        const listener = player.addListener('playbackStatusUpdate', s => callback({ position: s.currentTime,
          duration: s.duration, playing: s.playing, ended: s.didJustFinish, error: Boolean(s.error) }))
        return () => listener.remove()
      },
      dispose: () => { if (!disposed) { disposed = true; player.setActiveForLockScreen(false); player.remove() } },
    }
  },
}
```

## apps/mobile/src/navigation/linking.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Nhận deep link bên ngoài và tạo lịch sử điều hướng mobile phù hợp.
 * Vị trí: apps/mobile/src/navigation/linking.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { LinkingOptions } from '@react-navigation/native'
import { parseQrTarget } from '@travelguide/visitor-core'
import { qrPolicy, webOrigin } from '../services/platform'
import type { VisitorStack } from './types'

// CHỨC NĂNG: Khai báo các tiền tố liên kết mà app xử lý.
// XỬ LÝ:
// - HTTPS dùng origin đã cấu hình.
// - hueguide:// dùng cho kiểm tra deep link của bản app cài riêng.
export const linking:
  LinkingOptions<VisitorStack> = {
    prefixes: [
      ...(webOrigin ? [webOrigin] : []),
      'hueguide://',
    ],

    // CHỨC NĂNG: Chuyển đường dẫn thành màn hình và tham số.
    // XỬ LÝ:
// - Parser chung từ chối đường dẫn sai.
// - QR chung mở Places.
// - Link chi tiết mở Detail và giữ Places trong lịch sử quay lại.
    getStateFromPath(path) {
      try {
        const origin =
          webOrigin
          ?? 'https://hue-guide.example'

        const target = parseQrTarget(
          new URL(path, origin).toString(),
          {
            ...qrPolicy,
            allowedOrigins: [origin],
          },
        )

        if (target.kind === 'home') {
          return {
            routes: [
              {
                name: 'Places',
              },
            ],
          }
        }

        return {
          index: 1,
          routes: [
            {
              name: 'Places',
            },
            {
              name: 'Detail',
              params: {
                placeId: target.id,
              },
            },
          ],
        }
      } catch {
        return undefined
      }
    },
  }
```

## apps/mobile/src/navigation/types.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Tách riêng một phần giao diện để dễ tìm và bảo trì.
 * Vị trí: apps/mobile/src/navigation/types.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { Category } from '@travelguide/visitor-core'

// CHỨC NĂNG: Kiểm tra tham số điều hướng.
// XỬ LÝ: Detail bắt buộc placeId; Search nhận điều kiện ban đầu.
export type VisitorStack = {
  Places: undefined
  Search: {
    query?: string
    category?: Category
  }
  Detail: {
    placeId: string
  }
  Journey: { placeId?: string } | undefined
  Scan: undefined
}
```

## apps/mobile/src/components/WebAccessCard.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thẻ mở/chia sẻ website và trang QR chung từ mobile.
 * Vị trí: apps/mobile/src/components/WebAccessCard.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect, useRef, useState } from 'react'
import { Linking, Share, Text, View } from 'react-native'
import { useText } from '../i18n/index'
import { webOrigin } from '../services/platform'
import { Action, ui } from './index'

export default function WebAccessCard() {
  const t = useText()

  const [failed, setFailed] =
    useState(false)

  const alive = useRef(true)

  // CHỨC NĂNG: Theo dõi component còn trên màn hình hay không.
  // XỬ LÝ: Hộp chia sẻ hoặc trình duyệt có thể trả kết quả
  // sau khi người dùng đã rời màn Cài đặt.
  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
    }
  }, [])

  // CHỨC NĂNG: Mở website hoặc trang hiển thị QR chung.
  // XỬ LÝ: Dùng URL website đã cấu hình, không tạo liên kết exp://.
  const open = async (qr: boolean) => {
    if (!webOrigin) {
      return
    }

    setFailed(false)

    try {
      await Linking.openURL(
        webOrigin + (qr ? '/qr' : '/'),
      )
    } catch {
      if (alive.current) {
        setFailed(true)
      }
    }
  }

  // CHỨC NĂNG: Chia sẻ cùng một URL cho thiết bị khác.
  // XỬ LÝ: Người nhận mở bằng trình duyệt thông thường.
  const share = async () => {
    if (!webOrigin) {
      return
    }

    setFailed(false)

    try {
      await Share.share({
        message: webOrigin + '/',
        url: webOrigin + '/',
      })
    } catch {
      if (alive.current) {
        setFailed(true)
      }
    }
  }

  return (
    <View style={ui.card}>
      <Text style={ui.heading}>
        {t('generalQr')}
      </Text>

      <Text style={ui.muted}>
        {t('browserOnly')}
      </Text>

      {webOrigin ? (
        <>
          <Text
            selectable
            style={ui.text}
          >
            {webOrigin + '/'}
          </Text>

          <Action
            title={t('openWebsite')}
            onPress={() => {
              void open(false)
            }}
          />

          <Action
            title={t('qrAccess')}
            onPress={() => {
              void open(true)
            }}
          />

          <Action
            title={t('shareWebsite')}
            onPress={() => {
              void share()
            }}
          />
        </>
      ) : (
        <Text style={ui.muted}>
          {t('qrSetup')}
        </Text>
      )}

      {failed && (
        <Text
          accessibilityRole="alert"
          style={ui.muted}
        >
          {t('websiteError')}
        </Text>
      )}
    </View>
  )
}
```

## apps/mobile/src/types/assets.d.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Khai báo kiểu MP3 đóng gói bởi Metro.
 * Vị trí: apps/mobile/src/types/assets.d.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



/** FILE NÀY LÀM GÌ: Khai báo kiểu asset MP3 tĩnh cho Metro và TypeScript. */
declare module '*.mp3' {
  const asset: number
  export default asset
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm run typecheck --workspace=mobile.
 * - Expo export phải đóng gói đủ năm asset MP3.
 */

declare module '*.jpg' { const asset: number; export default asset }
```

## apps/mobile/src/screens/HomeScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị Khám phá, carousel và danh sách có tìm kiếm/lọc/kéo làm mới.
 * Vị trí: apps/mobile/src/screens/HomeScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useRef, useState } from 'react'
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { HERO_IMAGE, PHOTO_CREDITS } from '@travelguide/visitor-core'
import type { Category, SortOrder } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { Action, DemoNotice, State, colors, spacing, CategoryChips, Cover, PlaceCard, SearchBar, SortDropdown, explore } from '../components/index'
import { getPosition } from '../services/platform'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Ghép dữ liệu và điều kiện vào danh sách.
// XỬ LÝ: Dùng một FlatList dọc; carousel cuộn ngang bên trong header.
export default function HomeScreen({
  search = false,
  initial,
}: {
  search?: boolean
  initial?: {
    query?: string
    category?: Category
  }
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<VisitorStack>>()

  const data = usePublishedCatalog()
  const position = useVisitorPosition(getPosition)
  const filters = useExplore(data.places, position.origin, initial)
  const t = useText()

  const { width } = useWindowDimensions()

  const cardWidth = Math.max(
    240,
    width - spacing.lg * 2 - spacing.sm,
  )

  const [slide, setSlide] = useState(0)
  const list = useRef<FlatList>(null)

  const featured = data.places.filter(
    (place) => place.featured,
  )

  // CHỨC NĂNG: Đổi thứ tự và xin vị trí khi người dùng yêu cầu.
  // XỬ LÝ: Chọn theo tên không xin quyền GPS.
  const onSort = (order: SortOrder) => {
    filters.setOrder(order)

    if (order === 'nearest' && !position.origin) {
      void position.request()
    }
  }

  const openSearch = () => navigation.navigate('Search', {
    query: filters.query,
  })

  return (
    <SafeAreaView
      style={explore.page}
      edges={['top', 'left', 'right']}
    >
      <FlatList
        ref={list}
        data={data.error ? [] : filters.results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        refreshing={data.loading && data.places.length > 0}
        onRefresh={() => {
          void data.reload()
        }}

        // CHỨC NĂNG: Dựng từng card khi cần.
        // XỬ LÝ: key theo ID ổn định, không dùng index.
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <PlaceCard
              place={item}
              origin={position.origin}
              onOpen={() => navigation.navigate('Detail', {
                placeId: item.id,
              })}
            />
          </View>
        )}

        ListHeaderComponent={
          <View>
            {!search ? (
              <View
                style={{
                  minHeight: 285,
                  justifyContent: 'flex-end',
                }}
              >
                <Cover
                  uri={HERO_IMAGE}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  style={{
                    padding: spacing.lg,
                    gap: spacing.sm,
                    backgroundColor: colors.overlay,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: spacing.xl,
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t('scan')}
                      onPress={() => navigation.navigate('Scan')}
                    >
                      <Ionicons
                        name="qr-code-outline"
                        size={24}
                        color={colors.white}
                      />
                    </Pressable>

                    <View accessibilityLabel={t('notification')}>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.white}
                      />
                    </View>
                  </View>

                  <Text style={{ color: colors.white, fontSize: 17 }}>
                    {t('explore')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 30,
                      fontWeight: '700',
                    }}
                  >
                    {t('site')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      lineHeight: 20,
                      fontSize: 13,
                    }}
                  >
                    {t('heroSubtitle')}
                  </Text>

                  <SearchBar
                    value={filters.query}
                    onChange={filters.setQuery}
                    onFocus={openSearch}
                  />
                </View>
              </View>
            ) : (
              <View style={explore.body}>
                <SearchBar
                  value={filters.query}
                  onChange={filters.setQuery}
                  autoFocus
                  onBack={() => navigation.goBack()}
                  onFilter={() => Alert.alert(
                    t('sort'),
                    undefined,
                    [
                      {
                        text: t('nearest'),
                        onPress: () => onSort('nearest'),
                      },
                      {
                        text: t('name'),
                        onPress: () => onSort('name'),
                      },
                      {
                        text: t('close'),
                        style: 'cancel',
                      },
                    ],
                  )}
                />
              </View>
            )}

            <View style={explore.body}>
              <CategoryChips
                categories={filters.availableCategories}
                selected={filters.categories}
                onSelect={filters.setCategories}
              />

              {!search && (
                <>
                  <View
                    style={[
                      explore.row,
                      { marginBottom: spacing.md },
                    ]}
                  >
                    <Text style={explore.title}>
                      {t('featured')}
                    </Text>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigation.navigate('Search', {})}
                    >
                      <Text style={{ color: colors.primary }}>
                        {t('viewAll')} ›
                      </Text>
                    </Pressable>
                  </View>

                  {/* CHỨC NĂNG: Carousel ngang có snap.
                      XỬ LÝ: Chiều rộng card theo màn hình;
                      tính chấm hiện tại từ độ cuộn khi dừng. */}
                  <FlatList
                    horizontal
                    data={featured}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={cardWidth + spacing.sm}
                    decelerationRate="fast"
                    contentContainerStyle={{
                      gap: spacing.sm,
                    }}
                    onMomentumScrollEnd={(event) => setSlide(
                      Math.round(
                        event.nativeEvent.contentOffset.x
                        / (cardWidth + spacing.sm),
                      ),
                    )}
                    renderItem={({ item }) => (
                      <PlaceCard
                        place={item}
                        featured
                        width={cardWidth}
                        onOpen={() => navigation.navigate('Detail', {
                          placeId: item.id,
                        })}
                      />
                    )}
                  />

                  <View
                    style={[
                      explore.row,
                      {
                        justifyContent: 'center',
                        padding: spacing.md,
                      },
                    ]}
                  >
                    {featured.map((place, index) => (
                      <View
                        key={place.id}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor:
                            index === slide
                              ? colors.primary
                              : colors.border,
                        }}
                      />
                    ))}
                  </View>
                </>
              )}

              <View style={explore.row}>
                <Text style={explore.title}>
                  {t(search ? 'results' : 'allPlaces')}
                  {' '}({filters.results.length})
                </Text>

                <SortDropdown
                  effectiveOrder={filters.effectiveOrder}
                  onSelect={onSort}
                />
              </View>

              {filters.order === 'nearest'
                && filters.effectiveOrder === 'name' && (
                <Text style={explore.muted}>
                  {t('orderFallback')}
                </Text>
              )}

              {position.failed && (
                <Text style={explore.muted}>
                  {t('locationDenied')}
                </Text>
              )}
            </View>
          </View>
        }

        // CHỨC NĂNG: Phân biệt tải, lỗi và không có kết quả.
        // XỬ LÝ: Mỗi trường hợp có thông báo và đường khôi phục phù hợp.
        ListEmptyComponent={
          data.loading ? (
            <State message="loading" busy />
          ) : data.error ? (
            <State
              message="loadError"
              retry={() => {
                void data.reload()
              }}
            />
          ) : (
            <View style={explore.body}>
              <State message="empty" />
              <Text style={explore.muted}>
                {t('emptyHint')}
              </Text>
              <Action
                title={t('clearAll')}
                onPress={filters.reset}
              />
            </View>
          )
        }

        ListFooterComponent={
          <View style={explore.body}>
            <DemoNotice />
            <Text style={explore.muted}>
              {t('photoCredits')}
            </Text>

            {PHOTO_CREDITS.map((credit) => (
              <Pressable
                key={credit.url}
                accessibilityRole="link"
                onPress={() => {
                  void Linking.openURL(credit.url)
                }}
              >
                <Text style={explore.muted}>
                  {credit.title} · {credit.license}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      />
    </SafeAreaView>
  )
}
```

## apps/mobile/src/screens/SettingsScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị chọn ngôn ngữ chung và liên kết truy cập website/QR.
 * Vị trí: apps/mobile/src/screens/SettingsScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text } from 'react-native'
import { useText } from '../i18n/index'
import WebAccessCard from '../components/WebAccessCard'
import { LanguageBar, ui } from '../components/index'

// CHỨC NĂNG: Cho đổi ngôn ngữ.
// XỬ LÝ: Cùng provider với tiêu đề, danh sách và bài đọc.
export default function SettingsScreen() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.title}>{t('settings')}</Text>
        <LanguageBar />
        <Text style={ui.muted}>{t('noAccount')}</Text>
        <WebAccessCard />
      </ScrollView>
    </SafeAreaView>
  )
}
```

## apps/mobile/src/screens/PlaceholderScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thông báo chức năng yêu thích chưa triển khai đầy đủ.
 * Vị trí: apps/mobile/src/screens/PlaceholderScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View } from 'react-native'
import { useText } from '../i18n/index'
import { ui } from '../components/index'

// CHỨC NĂNG: Thông báo chức năng làm sau.
// XỬ LÝ: Không tạo nghiệp vụ bản đồ/yêu thích giả.
export default function PlaceholderScreen() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <View style={ui.content}>
        <Text style={ui.heading}>{t('comingSoon')}</Text>
        <Text style={ui.text}>{t('favoritesHint')}</Text>
      </View>
    </SafeAreaView>
  )
}
```

## apps/mobile/src/navigation/MainTabs.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Đăng ký các tab Khám phá, Bản đồ, Yêu thích và Cài đặt với nhãn được dịch.
 * Vị trí: apps/mobile/src/navigation/MainTabs.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import PlaceholderScreen from '../screens/PlaceholderScreen'
import { JourneyScreen } from '../screens/JourneyScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useText } from '../i18n/index'
import { colors } from '../components/index'

const Tabs = createBottomTabNavigator()
// CHỨC NĂNG: Đăng ký label được dịch cho các tab.
// XỬ LÝ: i18n đổi thì options được render lại.
export default function MainTabs() {
  const t = useText()

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarLabel: t('explore'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        component={JourneyScreen}
        options={{
          tabBarLabel: t('map'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: t('favorites'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  )
}
```

## apps/mobile/src/screens/SearchResultScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Màn kết quả tìm kiếm được Stack đăng ký riêng.
 * Vị trí: apps/mobile/src/screens/SearchResultScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { VisitorStack } from '../navigation/types'
import HomeScreen from './HomeScreen'

// CHỨC NĂNG: Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện.
export default function SearchResultScreen({ route }: NativeStackScreenProps<VisitorStack, 'Search'>) {
 return <HomeScreen key={JSON.stringify(route.params)} search initial={route.params} />
}
```

## apps/mobile/src/navigation/RootNavigator.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Stack điều hướng mobile, giữ một NavigationContainer và một trình phát toàn app.
 * Vị trí: apps/mobile/src/navigation/RootNavigator.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useJourneyNavigation } from '../hooks/useJourneyNavigation'
import SearchResultScreen from '../screens/SearchResultScreen'
import { JourneyPlayer } from '../components/JourneyPlayer'
import { JourneyScreen } from '../screens/JourneyScreen'
import MainTabs from './MainTabs'
import DetailScreen from '../screens/DetailScreen'
import ScanScreen from '../screens/ScanScreen'
import { linking } from './linking'
import type { VisitorStack } from './types'
import { View } from 'react-native'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.
const Stack =
  createNativeStackNavigator<VisitorStack>()
// CHỨC NĂNG: Hiển thị màn danh sách ở chế độ tìm kiếm.
// XỬ LÝ: Khi tham số route thay đổi, key thay đổi để khởi tạo
// màn tìm kiếm với đúng từ khóa và danh mục mới.
const navigationRef = createNavigationContainerRef<VisitorStack>()
const openSuggested = (id: string) => { if (navigationRef.isReady()) navigationRef.navigate('Detail', { placeId: id }) }
// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.
export default function RootNavigator() {
  const t = useText()
  useJourneyNavigation({ open: openSuggested })

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: t('explore'),
        }}
      >
        <Stack.Screen
          name="Places"
          component={MainTabs}
          options={{
            title: t('explore'),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={SearchResultScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: t('details'),
          }}
        />

        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            title: t('scan'),
          }}
        />
        <Stack.Screen name="Journey" component={JourneyScreen} options={{ title: t('jMap') }} />
      </Stack.Navigator>
      <JourneyPlayer />
      </View>
    </NavigationContainer>
  )
}
```

## apps/mobile/src/providers/AppProviders.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ghép các provider mobile một lần tại gốc, giữ nguyên khóa lưu ngôn ngữ/tiến độ.
 * Vị trí: apps/mobile/src/providers/AppProviders.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { ReactNode } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales } from 'expo-localization'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { boot } from '../i18n'
import { storage } from '../services/platform'
import { journeyAdapters } from '../services/journeyAdapters'

const deviceLanguage = getLocales()[0]?.languageTag ?? null
// CHỨC NĂNG: Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <VisitorProvider
        boot={boot}
        storage={storage}
        deviceLanguage={deviceLanguage}
        loading={<ActivityIndicator />}
      >
        <JourneyProvider adapters={journeyAdapters}>
          {children}
        </JourneyProvider>
      </VisitorProvider>
    </SafeAreaProvider>
  )
}
```

## apps/mobile/App.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Điểm ghép ứng dụng mobile; index.js đăng ký file này với Expo.
 * Vị trí: apps/mobile/App.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { AppProviders } from './src/providers/AppProviders'
import RootNavigator from './src/navigation/RootNavigator'

// CHỨC NĂNG: Entry mobile chỉ ghép provider với điều hướng.
export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  )
}
```

## apps/mobile/src/components/index.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Điểm xuất component mobile; màn hình import tại đây, component con import trực tiếp để tránh vòng lặp.
 * Vị trí: apps/mobile/src/components/index.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



export { Action } from './Action'
export { LanguageBar } from './LanguageBar'
export { DemoNotice } from './DemoNotice'
export { State } from './State'
export { PlaceImage } from './PlaceImage'
export { Cover } from './Cover'
export { SearchBar } from './SearchBar'
export { CategoryChips } from './CategoryChips'
export { SortDropdown } from './SortDropdown'
export { PlaceCard } from './PlaceCard'
export { ListenButton } from './ListenButton'
export { JourneyPlayer } from './JourneyPlayer'
export { VisitorMap } from './VisitorMap'
export { ui, colors, spacing, radii } from '../theme'
export { explore } from '../styles/explore'
```

## apps/web/src/components/Icon.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Các icon SVG nhỏ có thể tái sử dụng trong giao diện web.
 * Vị trí: apps/web/src/components/Icon.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Icon SVG nhỏ để không thêm framework UI.
// XỬ LÝ: Icon trang trí ẩn với trình đọc màn hình;
// nút bên ngoài có aria-label đã dịch.
export function Icon({
  name,
}: {
  name: 'search' | 'pin' | 'heart' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 'replay' | 'backward' | 'forward' | 'headphones'
}) {
  const paths = {
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeLinejoin="round" />,
    pause: <><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></>,
    replay: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>,
    backward: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /><text x="12" y="16" textAnchor="middle" fontSize="8" stroke="none" fill="currentColor" fontFamily="system-ui">10</text></>,
    forward: <><path d="M20 10a8 8 0 1 0-1 8M20 4v6h-6" /><text x="12" y="16" textAnchor="middle" fontSize="8" stroke="none" fill="currentColor" fontFamily="system-ui">10</text></>,
    headphones: <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="11" width="4" height="9" rx="2" /><rect x="17" y="11" width="4" height="9" rx="2" /></>,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    heart: (
      <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 8 15 8 15S25 10 20 5Z" />
    ),
    arrow: <path d="m9 5 7 7-7 7M4 12h12" />,
    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </>
    ),
    list: <path d="M3 5h2m4 0h12M3 12h2m4 0h12M3 19h2m4 0h12" />,
    qr: (
      <>
        <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
```

## apps/web/src/components/LanguagePicker.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Chọn một trong năm ngôn ngữ và hiển thị lỗi lưu lựa chọn trên web.
 * Vị trí: apps/web/src/components/LanguagePicker.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Dropdown chọn ngôn ngữ.
// XỬ LÝ: Chỉ đổi khi mã nằm trong danh sách hỗ trợ.
export function LanguagePicker() {
  const {
    language,
    saving,
    persistenceError,
    changeLanguage,
  } = useVisitor()

  const t = useText()

  return (
    <div className="language-picker">
      <select
        aria-label={t('language')}
        value={language}
        disabled={saving}
        onChange={(event) => {
          const code = LANGUAGES.find(
            (item) => item.code === event.target.value,
          )?.code

          if (code) void changeLanguage(code)
        }}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code === 'cn' ? '中文' : item.code.toUpperCase()}
            {' · '}{item.label}
          </option>
        ))}
      </select>

      {persistenceError && (
        <p role="alert">{t(persistenceError)}</p>
      )}
    </div>
  )
}
```

## apps/web/src/components/State.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trạng thái tải/lỗi/thông báo và các nút thử lại hoặc quay lại.
 * Vị trí: apps/web/src/components/State.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị tải/lỗi/thử lại.
// XỬ LÝ: Không hiện chuỗi lỗi kỹ thuật từ API.
export function State({
  message,
  busy = false,
  retry,
}: {
  message: MessageKey
  busy?: boolean
  retry?: () => void
}) {
  const t = useText()

  return (
    <section className="state" role={busy ? 'status' : 'alert'}>
      {busy && <progress aria-label={t('loading')} />}
      <p>{t(message)}</p>
      {retry && <button onClick={retry}>{t('retry')}</button>}
    </section>
  )
}
```

## apps/web/src/components/PlaceImage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ảnh địa điểm có placeholder và thử lại khi URL thay đổi.
 * Vị trí: apps/web/src/components/PlaceImage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect, useState } from 'react'
import { resolvePlaceImage } from '../services/placeImages'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Ảnh có dự phòng.
// XỬ LÝ: Card lazy-load; đổi URL thì thử lại thay vì giữ lỗi cũ.
export function PlaceImage({
  uri,
  title,
}: {
  uri?: string
  title: string
}) {
  const [failed, setFailed] = useState(false)
  const t = useText()

  useEffect(() => setFailed(false), [uri])

  return uri && !failed ? (
    <img
      className="place-image"
      src={resolvePlaceImage(uri)}
      alt={title}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  ) : (
    <div
      className="place-image placeholder"
      role="img"
      aria-label={t('noImage')}
    >
      <span>▥</span>
      {t('noImage')}
    </div>
  )
}
```

## apps/web/src/components/CategoryChips.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị các chip danh mục có dữ liệu và cập nhật mục đang chọn.
 * Vị trí: apps/web/src/components/CategoryChips.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { categoryIcons } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Chip danh mục ở hero.
// XỬ LÝ: Chỉ hiện danh mục có dữ liệu và có ít nhất hai loại.
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: readonly Category[]
  selected: readonly Category[]
  onSelect: (value: Category[]) => void
}) {
  const t = useText()

  if (categories.length < 2) return null

  return (
    <div className="category-chips">
      <button
        aria-pressed={!selected.length}
        onClick={() => onSelect([])}
      >
        <span>▥</span>{t('all')}
      </button>

      {categories.map((category) => (
        <button
          key={category}
          aria-pressed={selected.includes(category)}
          onClick={() => onSelect([category])}
        >
          <span>{categoryIcons[category]}</span>
          {t(`category_${category}`)}
        </button>
      ))}
    </div>
  )
}
```

## apps/web/src/components/PlaceCard.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thẻ địa điểm, ảnh dự phòng, danh mục, khoảng cách nếu có và nút tim cục bộ.
 * Vị trí: apps/web/src/components/PlaceCard.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Icon } from './Icon'
import { PlaceImage } from './PlaceImage'
import { Link } from 'react-router-dom'
import { categoryOf, publishedText } from '@travelguide/visitor-core'
import type { PlaceRecord } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Card địa điểm trong carousel/lưới/danh sách.
// XỬ LÝ: Tim độc lập link chi tiết và lưu trong context của phiên.
export function PlaceCard({
  place,
  distance,
}: {
  place: PlaceRecord
  distance?: number
}) {
  const {
    language,
    favorites,
    toggleFavorite,
  } = useVisitor()

  const t = useText()
  const content = publishedText(place, language)
  const title = content?.title ?? place.canonicalTitle

  return (
    <article className="place-card">
      <Link
        className="card-photo"
        to={'/places/' + place.id}
        aria-label={title}
      >
        <PlaceImage uri={place.images[0]} title={title} />
      </Link>

      <button
        className="heart icon-button"
        aria-label={t(
          favorites.has(place.id) ? 'unfavorite' : 'favorite',
        )}
        aria-pressed={favorites.has(place.id)}
        onClick={() => toggleFavorite(place.id)}
      >
        <Icon name="heart" />
      </button>

      <div className="card-content">
        <h3>
          <Link to={'/places/' + place.id}>{title}</Link>
        </h3>

        <span className={'badge badge-' + categoryOf(place)}>
          {t(`category_${categoryOf(place)}`)}
        </span>

        <p className="card-location">
          <Icon name="pin" />
          {content ? t('city') : t('missing')}

          {distance !== undefined && (
            <span>{(distance / 1000).toFixed(2)} km</span>
          )}
        </p>
      </div>
    </article>
  )
}
```

## apps/web/src/components/index.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Điểm xuất component UI web.
 * Vị trí: apps/web/src/components/index.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



export { Icon } from './Icon'
export { LanguagePicker } from './LanguagePicker'
export { State } from './State'
export { PlaceImage } from './PlaceImage'
export { CategoryChips } from './CategoryChips'
export { PlaceCard } from './PlaceCard'
```

## apps/web/src/components/Catalogue.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bộ lọc danh mục/khu vực, tìm kiếm, sắp xếp, đổi lưới/danh sách và phân trang.
 * Vị trí: apps/web/src/components/Catalogue.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { categoryOf, distanceTo, paginate, publishedText } from '@travelguide/visitor-core'
import { State } from './State'
import { PlaceCard } from './PlaceCard'
import { useEffect, useState } from 'react'
import type { Category } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Icon } from './index'
import { getPosition } from '../services/platform'

type Data = ReturnType<typeof usePublishedCatalog>
// CHỨC NĂNG: Sidebar lọc, kết quả, đổi bố cục và phân trang.
// XỬ LÝ: Hook chịu nghiệp vụ; component chỉ quản lý trạng thái hiển thị.
export function Catalogue({
  data,
  initial,
}: {
  data: Data
  initial?: {
    query?: string
    category?: Category
  }
}) {
  const position = useVisitorPosition(getPosition)
  const filters = useExplore(data.places, position.origin, initial)
  const { language } = useVisitor()
  const t = useText()

  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const paged = paginate(filters.results, page, 6)

  // CHỨC NĂNG: Đổi điều kiện thì quay về trang 1.
  // XỬ LÝ: paginate vẫn giới hạn trang ngay trước khi effect chạy.
  useEffect(() => {
    setPage(1)
  }, [
    filters.query,
    filters.within,
    filters.categories,
    filters.zones,
    filters.order,
    language,
  ])

  const missing = data.places.some(
    (place) => !publishedText(place, language),
  )

  return (
    <section className="panel catalogue" id="catalogue">
      <div className="section-title catalogue-heading">
        <div>
          <h2>{t('allPlaces')}</h2>
          <p>{t('results')}: {filters.results.length}</p>
        </div>

        <div className="sort-controls">
          <label>
            {t('sort')}

            <select
              aria-label={t('sort')}
              value={filters.order}
              onChange={(event) => {
                const order =
                  event.target.value === 'nearest'
                    ? 'nearest'
                    : 'name'

                filters.setOrder(order)

                if (order === 'nearest' && !position.origin) {
                  void position.request()
                }
              }}
            >
              <option value="nearest">{t('nearest')}</option>
              <option value="name">{t('name')}</option>
            </select>
          </label>

          <div className="view-switch">
            <button
              className="icon-button"
              aria-label={t('grid')}
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <Icon name="grid" />
            </button>

            <button
              className="icon-button"
              aria-label={t('list')}
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <Icon name="list" />
            </button>
          </div>
        </div>
      </div>

      <button
        className="mobile-filters secondary"
        aria-expanded={filterOpen}
        aria-controls="place-filters"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        {t('filters')}
      </button>

      <div className="catalog-layout">
        <aside
          id="place-filters"
          className={'filters ' + (filterOpen ? 'filters-open' : '')}
          aria-label={t('filters')}
        >
          <div className="section-title">
            <strong>{t('filters')}</strong>

            <button
              className="text-button"
              onClick={filters.reset}
            >
              {t('clearAll')}
            </button>
          </div>

          <label className="search-field">
            <Icon name="search" />
            <input
              type="search"
              aria-label={t('search')}
              placeholder={t('search')}
              value={filters.query}
              onChange={(event) => filters.setQuery(event.target.value)}
            />
          </label>

          <label className="search-field">
            <Icon name="search" />
            <input
              type="search"
              aria-label={t('searchWithin')}
              placeholder={t('searchWithin')}
              value={filters.within}
              onChange={(event) => filters.setWithin(event.target.value)}
            />
          </label>

          {filters.availableCategories.length >= 2 && (
            <fieldset>
              <legend>{t('category')}</legend>

              <label>
                <input
                  type="checkbox"
                  checked={!filters.categories.length}
                  onChange={() => filters.setCategories([])}
                />
                {t('all')} ({data.places.length})
              </label>

              {filters.availableCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(event) => filters.setCategories(
                      event.target.checked
                        ? [...filters.categories, category]
                        : filters.categories.filter(
                          (item) => item !== category,
                        ),
                    )}
                  />

                  {t(`category_${category}`)}
                  {' '}({
                    data.places.filter(
                      (place) => categoryOf(place) === category,
                    ).length
                  })
                </label>
              ))}
            </fieldset>
          )}

          <fieldset>
            <legend>{t('region')}</legend>

            {filters.availableZones.map((zone) => (
              <label key={zone}>
                <input
                  type="checkbox"
                  checked={filters.zones.includes(zone)}
                  onChange={(event) => filters.setZones(
                    event.target.checked
                      ? [...filters.zones, zone]
                      : filters.zones.filter(
                        (item) => item !== zone,
                      ),
                  )}
                />

                {t(
                  zone === 'fortifications'
                    ? 'zone_fortifications'
                    : 'zone_ceremonial',
                )}

                {' '}({
                  data.places.filter(
                    (place) => place.zone === zone,
                  ).length
                })
              </label>
            ))}
          </fieldset>

          <p className="muted">{t('filterHint')}</p>

          <button
            className="secondary"
            disabled={position.loading}
            onClick={() => {
              void position.request()
            }}
          >
            {t(
              position.loading ? 'locationBusy' : 'location',
            )}
          </button>
        </aside>

        <div className="results">
          {filters.order === 'nearest'
            && filters.effectiveOrder === 'name' && (
            <p className="muted" role="status">
              {t('orderFallback')}
            </p>
          )}

          {position.failed && (
            <p role="status" className="muted">
              {t('locationDenied')}
            </p>
          )}

          {missing && (
            <p className="muted">{t('missingList')}</p>
          )}

          {data.loading ? (
            <State message="loading" busy />
          ) : data.error ? (
            <State
              message="loadError"
              retry={() => {
                void data.reload()
              }}
            />
          ) : paged.items.length ? (
            <div
              className={
                'place-grid '
                + (view === 'list' ? 'list-view' : '')
              }
            >
              {paged.items.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  distance={distanceTo(place, position.origin)}
                />
              ))}
            </div>
          ) : (
            <div className="state">
              <h3>{t('empty')}</h3>
              <p>{t('emptyHint')}</p>
              <button onClick={filters.reset}>
                {t('clearAll')}
              </button>
            </div>
          )}

          <nav className="pagination" aria-label={t('page')}>
            <button
              className="secondary"
              disabled={paged.page === 1}
              onClick={() => setPage(paged.page - 1)}
            >
              {t('previous')}
            </button>

            {Array.from(
              { length: paged.pages },
              (_, index) => index + 1,
            ).map((number) => (
              <button
                key={number}
                aria-label={t('page') + ' ' + number}
                aria-current={
                  paged.page === number ? 'page' : undefined
                }
                className={
                  paged.page === number ? '' : 'secondary'
                }
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="secondary"
              disabled={paged.page === paged.pages}
              onClick={() => setPage(paged.page + 1)}
            >
              {t('next')}
            </button>
          </nav>
        </div>
      </div>
    </section>
  )
}
```

## apps/web/src/pages/HomePage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang chủ web với hero, tìm kiếm, danh mục, carousel và Catalogue.
 * Vị trí: apps/web/src/pages/HomePage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { resolvePlaceImage } from '../services/placeImages'
import { Catalogue } from '../components/Catalogue'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categoryOf, HERO_IMAGE } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { CategoryChips, Icon, PlaceCard, State } from '../components/index'

// CHỨC NĂNG: Trang chủ gồm hero, carousel và danh sách.
// XỬ LÝ: Tải service một lần tại trang; chia cùng dữ liệu cho các khối.
export function HomePage() {
  const data = usePublishedCatalog()
  const t = useText()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Category[]>([])
  const [failedImage, setFailedImage] = useState(false)

  const carousel = useRef<HTMLDivElement>(null)

  const categories = [
    ...new Set(data.places.map(categoryOf)),
  ]

  const featured = data.places.filter(
    (place) => place.featured,
  )

  // CHỨC NĂNG: Chuyển điều kiện tìm từ hero sang trang kết quả.
  // XỬ LÝ: URLSearchParams mã hóa từ khóa đúng, không tự ghép ký tự đặc biệt.
  const submit = () => {
    const params = new URLSearchParams()

    if (query.trim()) params.set('q', query.trim())
    if (selected[0]) params.set('category', selected[0])

    navigate('/places?' + params.toString())
  }

  return (
    <>
      <section className="hero">
        {!failedImage && (
          <img
            className="hero-image"
            src={resolvePlaceImage(HERO_IMAGE)}
            alt=""
            fetchPriority="high"
            onError={() => setFailedImage(true)}
          />
        )}

        <div className="hero-shade" />

        <div className="hero-content">
          <p className="eyebrow">{t('explore')}</p>
          <h1>{t('site')}</h1>
          <p>{t('heroSubtitle')}</p>

          <form
            className="hero-search"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <Icon name="search" />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t('search')}
              placeholder={t('search')}
            />

            <button type="submit">
              <Icon name="search" />
              {t('searchButton')}
            </button>
          </form>

          <CategoryChips
            categories={categories}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </section>

      <section className="panel featured-panel">
        <div className="section-title">
          <div>
            <h2>{t('featured')}</h2>
            <p>{t('featuredHint')}</p>
          </div>

          <Link to="/places">
            {t('viewAll')} →
          </Link>
        </div>

        {data.loading ? (
          <State message="loading" busy />
        ) : data.error ? (
          <State
            message="loadError"
            retry={() => {
              void data.reload()
            }}
          />
        ) : (
          <div className="carousel-wrap">
            <div ref={carousel} className="featured-carousel">
              {featured.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            <div className="carousel-actions">
              <button
                className="icon-button"
                aria-label={t('previous')}
                onClick={() => carousel.current?.scrollBy({
                  left: -280,
                  behavior: 'smooth',
                })}
              >
                ‹
              </button>

              <button
                className="icon-button"
                aria-label={t('next')}
                onClick={() => carousel.current?.scrollBy({
                  left: 280,
                  behavior: 'smooth',
                })}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      <Catalogue data={data} />
    </>
  )
}
```

## apps/web/src/pages/PlacesPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Đọc từ khóa/danh mục từ URL và hiển thị danh sách Catalogue.
 * Vị trí: apps/web/src/pages/PlacesPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Catalogue } from '../components/Catalogue'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/usePlaces'

// CHỨC NĂNG: Đọc điều kiện ban đầu từ URL.
// XỬ LÝ: Chỉ nhận mã danh mục hợp lệ; URL đổi thì key đổi để reset state.
export function PlacesPage() {
  const data = usePublishedCatalog()
  const [params] = useSearchParams()

  const category = CATEGORIES.find(
    (item) => item === params.get('category'),
  )

  return (
    <Catalogue
      key={params.toString()}
      data={data}
      initial={{
        query: params.get('q') ?? '',
        category,
      }}
    />
  )
}
```

## apps/web/src/components/QrImage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Một mã QR vào chung, có viền trắng chuẩn và nút mở/tải ảnh.
 * QrPage gọi; phụ thuộc qrcode, cấu hình runtime platform và i18n. UC05.
 */
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useText } from '../i18n'
import { loadPublicSiteOrigin } from '../services/platform'
import { State } from './State'
import './qr.css'

type QrResult = { href: string; src: string }
export function QrImage() {
  const t = useText()
  const [origin, setOrigin] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<QrResult | null>(null)
  const [failed, setFailed] = useState(false)
  const href = origin ? origin + '/' : null

  // CHỨC NĂNG: Lấy URL mới khi phiên tunnel đổi, không giữ link cũ suốt lần mở trang.
  // XỬ LÝ: Poll 15 giây và khi quay lại cửa sổ; clearInterval/removeEventListener
  // và cancelled ngăn cập nhật sau unmount. Không tạo tunnel từ trình duyệt.
  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      const value = await loadPublicSiteOrigin()
      if (!cancelled) { setOrigin(value); setLoaded(true) }
    }
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, 15000)
    const focus = () => { void refresh() }
    window.addEventListener('focus', focus)
    return () => { cancelled = true; window.clearInterval(timer); window.removeEventListener('focus', focus) }
  }, [attempt])

  // CHỨC NĂNG: Sinh PNG đen/trắng, không logo và đủ vùng trắng quanh bốn cạnh.
  // XỬ LÝ: margin=4 theo vùng yên lặng của QR; ảnh nguồn 640px để tải/in rõ.
  // Không nén bằng JPEG hoặc cắt ảnh. Href gắn với kết quả để không hiện mã cũ.
  useEffect(() => {
    let cancelled = false
    setFailed(false)
    if (!href) return
    void QRCode.toDataURL(href, { width: 640, margin: 4, errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' } })
      .then(src => { if (!cancelled) setResult({ href, src }) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [href, attempt])

  const current = result?.href === href ? result : null
  return <section className="qr-panel qr-scan-panel" aria-label={t('generalQr')}>
    <h2>{t('generalQr')}</h2>
    <p>{t('noAccount')}</p>
    {!loaded ? <State message="loading" busy /> : !href ? <State message="qrSetup" />
      : failed ? <State message="loadError" retry={() => setAttempt(value => value + 1)} />
        : current ? <div className="qr-frame"><img className="qr-code-image" src={current.src}
          width={640} height={640} alt={t('generalQr')} /></div>
          : <State message="loading" busy />}
    <p className="qr-scan-hint">{t('qrScanHint')}</p>
    <div className="qr-actions">
      {href && <a className="button" href={href} target="_blank" rel="noreferrer">{t('openWebsite')}</a>}
      {current && <a className="button secondary" href={current.src} download="hue-guide-qr.png">{t('qrDownload')}</a>}
      <button className="secondary" type="button" onClick={() => setAttempt(value => value + 1)}>{t('qrRefresh')}</button>
    </div>
    {href && <p className="qr-url"><a href={href} target="_blank" rel="noreferrer">{href}</a></p>}
    <p className="qr-session-note">{t('qrTemporary')}</p>
  </section>
}
/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đặt điện thoại trước màn hình: camera phải nhận URL HTTPS, không phải exp://.
 * - Trên chính điện thoại đang xem, bấm Mở website thay vì cố quét màn hình đó.
 * - Đổi phiên demo: bấm Cập nhật mã QR; ảnh và đường link phải cùng URL mới.
 * - Tải PNG: ảnh vuông có đủ viền trắng và không mất góc định vị.
 */
```

## apps/web/src/pages/DetailPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang bài đọc, đổi ngôn ngữ, nghe thuyết minh và mở marker địa điểm.
 * Vị trí: apps/web/src/pages/DetailPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { Link, useParams } from 'react-router-dom'
import { availableLanguages, LANGUAGES, publishedText, validPoint } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { PlaceImage, State, Icon } from '../components/index'

// CHỨC NĂNG: Hiển thị chi tiết địa điểm theo route /places/:id.
// XỬ LÝ:
// - Tải dữ liệu thông qua hook và service.
// - Phân biệt đang tải, lỗi và không tìm thấy.
// - Không tạo QR tại trang chi tiết.
export function DetailPage() {
  const { id = '' } = useParams()

  const data = usePublishedPlace(id)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Hiển thị trạng thái chờ dữ liệu.
  // XỬ LÝ: Chưa đọc place khi request chưa hoàn thành.
  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  // CHỨC NĂNG: Hiển thị lỗi hoặc địa điểm không tồn tại.
  // XỬ LÝ: Có nút thử lại và đường quay về danh sách.
  if (data.error || !data.place) {
    return (
      <section className="detail">
        <State
          message={
            data.error ?? 'notFound'
          }
          retry={data.retry}
        />

        <Link to="/places">
          {t('back')}
        </Link>
      </section>
    )
  }

  const place = data.place

  // CHỨC NĂNG: Lấy bài đọc bằng ngôn ngữ chung của giao diện.
  // XỬ LÝ:
  // - Không giữ lựa chọn ngôn ngữ riêng trong trang chi tiết.
  // - Đổi ngôn ngữ sẽ đổi cả UI và bài đọc.
  // - Thiếu bản công bố thì trả undefined để hiện thông báo.
  const content = publishedText(
    place,
    language,
  )

  const title =
    content?.title
    ?? place.canonicalTitle

  // CHỨC NĂNG: Chỉ liệt kê các bản ngôn ngữ đã công bố.
  // XỬ LÝ: Không cho chọn nội dung nháp hoặc chưa duyệt.
  const languages =
    availableLanguages(place)

  const position = place.position

  // CHỨC NĂNG: Kiểm tra tọa độ trước khi hiển thị.
  // XỬ LÝ: Cần cả trạng thái xác nhận và giá trị tọa độ hợp lệ.
  // Đoạn này không theo dõi GPS và không tự xác định địa điểm.
  const hasVerifiedPosition =
    position?.verified === true
    && validPoint(position)

  return (
    <article className="detail">
      <Link to="/places">
        {t('back')}
      </Link>

      <h1>{title}</h1>

      <PlaceImage
        uri={place.images[0]}
        title={title}
      />

      {PLACE_PHOTOS[place.id]?.note?.[language] && <p className="photo-caption">{PLACE_PHOTOS[place.id].note?.[language]}</p>}
      <div className="detail-actions">
        <ListenButton id={place.id} />
        <Link className="button secondary" to={'/journey?placeId=' + place.id}><Icon name="pin" />{t('jMap')}</Link>
      </div>
      <p>{t('available')}</p>

      <div className="language-options">
        {languages.map((code) => {
          const label = LANGUAGES.find(
            (item) => item.code === code,
          )?.label ?? code

          return (
            <button
              key={code}
              type="button"
              aria-pressed={
                language === code
              }
              disabled={saving}
              onClick={() => {
                // CHỨC NĂNG: Đổi ngôn ngữ toàn website.
                // XỬ LÝ: Provider cập nhật i18n và lưu lựa chọn;
                // không chỉ đổi riêng bài đọc trên trang này.
                void changeLanguage(code)
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {content ? (
        <section>
          <p>{content.address}</p>

          <h2>{t('read')}</h2>

          <p className="narration">
            {content.body}
          </p>

          <p>
            {t('version')}: {content.version}
          </p>
        </section>
      ) : (
        <State message="missing" />
      )}

      <p>
        {hasVerifiedPosition && position
          ? (
            t('coordinates')
            + ': '
            + position.lat
            + ', '
            + position.lng
          )
          : t('unverified')}
      </p>

      {/* CHỨC NĂNG: Chi tiết chỉ hiển thị thông tin địa điểm.
          XỬ LÝ: Không đặt QrImage tại đây.
          GPS được điều phối qua useJourneyNavigation; chi tiết không tự phát audio. */}
    </article>
  )
}
```

## apps/web/src/pages/QrPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang duy nhất hiển thị QR vào chung hệ thống.
 * Vị trí: apps/web/src/pages/QrPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { QrImage } from '../components/QrImage'
import { Link } from 'react-router-dom'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Cung cấp trang hiển thị QR vào chung.
// XỬ LÝ:
// - Chỉ có một URL gốc dùng cho QR.
// - Không nhập hoặc tạo QR theo ID địa điểm.
// - Người dùng quét một lần để vào hệ thống.
// - Việc mở app hay web phụ thuộc cấu hình liên kết của thiết bị.
export function QrPage() {
  const t = useText()

  return (
    <section className="detail">
      <h1>{t('qrAccess')}</h1>

      <p>{t('qrWebHint')}</p>

      <QrImage />

      <Link to="/">
        {t('home')}
      </Link>
    </section>
  )
}
```

## apps/web/src/components/ListenButton.tsx

```tsx
/** FILE NÀY LÀM GÌ: Nút nghe chính có icon và trạng thái đồng bộ với player. */
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { Icon } from './Icon'

export function ListenButton({ id }: { id: string }) {
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  const same = state.session?.placeId === id && state.session.language === language
  const playing = same && state.status === 'playing'
  const paused = same && state.status === 'paused'
  const busy = state.status === 'loading'
  const label = t(busy ? 'jPreparing' : playing ? 'jPause' : paused ? 'jResume' : 'jPlay')
  // CHỨC NĂNG: Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu.
  const toggle = () => {
    if (playing) engine.pause()
    else if (paused) void engine.resume()
    else void engine.play(id, language)
  }
  return <button type="button" className="listen-button" disabled={busy} onClick={toggle}><Icon name={playing ? 'pause' : 'play'} />{label}</button>
}
```

## apps/web/src/components/JourneyPlayer.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trình phát web có ảnh, thanh tua thật và điều khiển dễ bấm.
 * AppLayout dùng; phụ thuộc useJourney, i18n, Icon và PlaceImage.
 * UC07–UC11: chỉ đổi giao diện, tiếp tục dùng một nguồn audio của controller.
 */
import { Link } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n'
import { useJourney } from '../hooks/useJourney'
import { Icon } from './Icon'
import { PlaceImage } from './PlaceImage'

const clock = (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')

export function JourneyPlayer() {
  const { engine, state, resumeSaved } = useJourney()
  const t = useText()
  const session = state.session
  if (!session && !state.restore && !state.error && state.status !== 'loading') return null
  const place = state.places.find(item => item.id === session?.placeId)
  const busy = state.status === 'loading'
  const disabled = busy || state.status === 'error'
  const playing = state.status === 'playing'
  const ended = state.status === 'ended'
  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')

  // CHỨC NĂNG: Thao tác đều gọi audio thật, không tăng thời gian bằng timer UI.
  const toggle = () => {
    if (!session) return
    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }

  return (
    <aside className="audio-shell" aria-label={t('jTitle')}>
      {state.restore && (
        <section className="resume-card">
          <span className="resume-symbol"><Icon name="headphones" /></span>
          <div><strong>{t('jContinue')}</strong>{state.changed && <p>{t('jVersionChanged')}</p>}</div>
          <div className="resume-actions">
            <button type="button" onClick={() => { void resumeSaved() }}><Icon name="play" />{t('jContinue')}</button>
            <button type="button" className="secondary" onClick={() => engine.dismissRestore()}>{t('jDiscard')}</button>
          </div>
        </section>
      )}
      {state.error && <div className="audio-error" role="alert">
        <span>{t(state.error)}</span>
        {(state.status === 'error' || state.error === 'loadError') && <button type="button" className="secondary" onClick={() => engine.retry()}>{t('jRetry')}</button>}
      </div>}
      {busy && <p className="audio-loading" role="status"><span className="loading-dot" />{t('jPreparing')}</p>}
      {session && (
        <section className="audio-player">
          <div className="audio-artwork"><PlaceImage uri={place?.images[0]} title={session.title} /></div>
          <div className="audio-content">
            <div className="audio-topline">
              <span className="audio-eyebrow"><Icon name="headphones" />{t('read')}</span>
              <span className="audio-language">{LANGUAGES.find(item => item.code === session.language)?.label}</span>
            </div>
            <Link className="audio-title" to={'/places/' + session.placeId}>{session.title}</Link>
            <span className={'audio-status ' + (playing ? 'is-playing' : '')}><span />{t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}</span>
            <div className="audio-timeline">
              <input type="range" min={0} max={session.duration} step={0.1} value={session.position}
                aria-label={t('jSeek')} disabled={disabled}
                style={{ background: `linear-gradient(to right, #79baff ${session.position / session.duration * 100}%, #ffffff29 0%)` }}
                onChange={event => { void engine.seek(Number(event.target.value)) }} />
              <div className="audio-times"><span>{clock(session.position)}</span><span>{clock(session.duration)}</span></div>
            </div>
          </div>
          <div className="audio-controls">
            <div className="audio-transport">
              <button type="button" className="audio-skip" aria-label={t('jBack')} title={t('jBack')} disabled={disabled}
                onClick={() => { void engine.seek(session.position - 10) }}><Icon name="backward" /></button>
              <button type="button" className="audio-play" aria-label={primaryLabel} title={primaryLabel} disabled={busy} onClick={toggle}>
                <Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} />
              </button>
              <button type="button" className="audio-skip" aria-label={t('jForward')} title={t('jForward')} disabled={disabled}
                onClick={() => { void engine.seek(session.position + 10) }}><Icon name="forward" /></button>
            </div>
            <label className="audio-rate"><span>{t('jSpeed')}</span>
              <select value={session.rate} aria-label={t('jSpeed')} disabled={disabled} onChange={event => engine.rate(Number(event.target.value))}>
                {[0.75, 1, 1.25, 1.5, 2].map(rate => <option key={rate} value={rate}>{rate}×</option>)}
              </select>
            </label>
          </div>
        </section>
      )}
    </aside>
  )
}
```

## apps/web/src/components/VisitorMap.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bản đồ Leaflet với marker là nút HTML, hỗ trợ bấm/Enter mở đúng chi tiết.
 * Vị trí: apps/web/src/components/VisitorMap.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'
import 'leaflet/dist/leaflet.css'

export function VisitorMap({ selected }: { selected: string | null }) {
  const element = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const t = useText()
  const mapRef = useRef<L.Map | null>(null)
  const userLayer = useRef<L.LayerGroup | null>(null)
  const { state } = useJourney(), { language } = useVisitor(), navigate = useNavigate()
  const open = useCallback((id: string) => navigate('/places/' + id), [navigate])
  useEffect(() => {
    if (!element.current) return
    const map = L.map(element.current, { zoomAnimation: false }).setView([16.468, 107.578], 17)
    mapRef.current = map
    userLayer.current = L.layerGroup().addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).on('tileerror', () => setFailed(true)).addTo(map)
    state.places.forEach(place => {
      const point = MAP_POINTS[place.id]
      if (!point) return
      const title = publishedText(place, language)?.title ?? place.canonicalTitle
      const label = document.createElement('span'); label.textContent = title
      // CHỨC NĂNG: Marker là nút HTML thật, bấm chuột hoặc Enter đều mở chi tiết.
      // XỬ LÝ: Không chèn tên từ API bằng innerHTML; tránh vùng bấm SVG quá nhỏ.
      const button = document.createElement('button')
      button.type = 'button'; button.textContent = '●'; button.setAttribute('aria-label', title)
      button.style.cssText = 'width:30px;height:30px;padding:0;border-radius:50%;background:white;color:#0759c7;border:2px solid #0759c7;font-size:20px;cursor:pointer'
      if (selected === place.id) button.style.backgroundColor = '#dbeafe'
      button.addEventListener('click', event => { event.stopPropagation(); open(place.id) })
      L.marker([point.lat, point.lng], { keyboard: false,
        icon: L.divIcon({ html: button, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }) })
        .addTo(map).bindTooltip(label)
      if (selected === place.id) map.setView([point.lat, point.lng], 18)
    })
    return () => { map.remove(); mapRef.current = null; userLayer.current = null }
  }, [state.places, selected, language, open])
  useEffect(() => {
    userLayer.current?.clearLayers()
    if (state.fix && userLayer.current) L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(userLayer.current)
  }, [state.fix, state.places, selected, language, open])
  return <>{failed && <p role="alert">{t('loadError')}</p>}<div ref={element} role="region" aria-label={t('jMap')} style={{ height: 360, width: '100%' }} /></>
}
```

## apps/web/src/pages/JourneyPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang bản đồ, thẻ địa điểm và thứ tự tham quan bấm được.
 * AppRoutes gọi tại /journey; phụ thuộc useJourney, VisitorMap, ảnh và i18n.
 * Liên quan UC06–UC11: chọn điểm thủ công không phụ thuộc quyền GPS.
 */
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categoryOf, publishedText } from '@travelguide/visitor-core'
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'
import { routeAvailable } from '@travelguide/visitor-core/journey'
import { VisitorMap } from '../components/VisitorMap'
import { PlaceImage } from '../components/PlaceImage'
import { Icon } from '../components/Icon'
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import '../styles/journey.css'

export function JourneyPage() {
  const { engine, state } = useJourney()
  const { language } = useVisitor()
  const t = useText()
  const [params, setParams] = useSearchParams()
  const mapArea = useRef<HTMLDivElement>(null)
  const selected = params.get('placeId')

  // CHỨC NĂNG: Định vị công trình ngay trên bản đồ trong trang.
  // XỬ LÝ: Chỉ đổi placeId, giữ query khác và không cần GPS điện thoại.
  // VisitorMap theo dõi selected để phóng đúng marker; cuộn giúp thấy kết quả.
  function locate(id: string) {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      next.set('placeId', id)
      return next
    }, { replace: true })
    mapArea.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    mapArea.current?.focus({ preventScroll: true })
  }

  return <section className="panel journey-page">
    <header className="journey-heading">
      <div><h1>{t('jTitle')}</h1><p>{t('jReference')}</p></div>
      <button type="button" className={state.gps ? 'button' : 'button secondary'}
        aria-pressed={state.gps} onClick={() => { void engine.gps(!state.gps) }}>
        <Icon name="pin" />{t(state.gps ? 'jGpsOff' : 'jGpsOn')}
      </button>
    </header>
    {state.error && <p className="journey-notice" role="alert">{t(state.error)}</p>}
    {(state.status === 'error' || state.error === 'loadError') && <button type="button" onClick={() => engine.retry()}>{t('jRetry')}</button>}
    {state.gps && !state.suggestedId && <p className="journey-notice">{t('jNoNearby')}</p>}
    <div className="journey-map" ref={mapArea} tabIndex={-1} aria-label={t('jMap')}>
      <VisitorMap selected={selected} />
    </div>

    <section className="journey-section" aria-labelledby="journey-places-title">
      <div className="journey-section-heading">
        <h2 id="journey-places-title">{t('allPlaces')}</h2>
        <span className="journey-count">{state.places.length}</span>
      </div>
      {/* CHỨC NĂNG: Ảnh, tên và lời mời mở chi tiết là một liên kết lớn.
          XỬ LÝ: Nút định vị và nguồn tọa độ ở ngoài Link; không lồng nút/link.
          Đường dẫn dùng ID dữ liệu, không dùng tên đã dịch nên đổi ngôn ngữ không hỏng. */}
      <ul className="journey-places">
        {state.places.map(place => {
          const title = publishedText(place, language)?.title ?? place.canonicalTitle
          const point = MAP_POINTS[place.id]
          return <li key={place.id} className={'journey-place' + (selected === place.id ? ' is-selected' : '')}>
            <Link className="journey-place-open" to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ': ' + title}>
              <PlaceImage uri={place.images[0]} title={title} />
              <div className="journey-place-copy">
                <span className="journey-category">{t(`category_${categoryOf(place)}`)}</span>
                <h3>{title}</h3>
                <span className="journey-open-label">{t('jOpenPlace')}<Icon name="arrow" /></span>
              </div>
            </Link>
            {point && <div className="journey-place-tools">
              <button type="button" className="secondary" aria-pressed={selected === place.id}
                aria-label={t('jMap') + ': ' + title} onClick={() => locate(place.id)}>
                <Icon name="pin" />{t('jMap')}
              </button>
              <details className="journey-source">
                <summary>{t('jSource')}</summary>
                <a href={point.source} target="_blank" rel="noreferrer" aria-label={t('jSource') + ': ' + title}>OpenStreetMap ↗</a>
              </details>
            </div>}
          </li>
        })}
      </ul>
    </section>

    <section className="journey-section" aria-labelledby="journey-routes-title">
      <div className="journey-section-heading"><h2 id="journey-routes-title">{t('jRoutes')}</h2></div>
      {engine.ports.routes.map(route => {
        const available = routeAvailable(route, state.places)
        const active = state.routeId === route.id
        // CHỨC NĂNG: Lấy các điểm còn tồn tại; không dùng dấu ! để ép dữ liệu sai.
        // XỬ LÝ: Tuyến thiếu điểm bị khóa bởi routeAvailable trước khi chọn.
        const stops = route.stops.flatMap(id => {
          const place = state.places.find(item => item.id === id)
          return place ? [place] : []
        })
        return <article className={'journey-route' + (active ? ' is-selected' : '')} key={route.id}>
          <div className="journey-route-intro"><span className="journey-route-icon"><Icon name="pin" /></span>
            <div><h3>{route.title[language]}</h3>{!route.verified && <p>{t('jPreview')}</p>}</div>
          </div>
          {!available ? <p role="alert">{t('jRouteInvalid')}</p> : <>
            <div className="journey-route-actions">
              <button type="button" aria-pressed={active} onClick={() => engine.selectRoute(route.id)}>
                <Icon name="list" />{t('jUseRoute')}
              </button>
              <button type="button" className="secondary" onClick={() => engine.selectRoute()}>{t('jSkipRoute')}</button>
            </div>
            {/* CHỨC NĂNG: Chọn tuyến hiện thứ tự cùng các liên kết chi tiết.
                XỬ LÝ: Không chỉ đổi state âm thầm; có phản hồi aria-pressed và thẻ điểm.
                Đây là thứ tự tham khảo, không tự phát audio hoặc vẽ đường đi giả. */}
            {active && <ol className="journey-stops">
              {stops.map((place, index) => {
                const title = publishedText(place, language)?.title ?? place.canonicalTitle
                return <li key={place.id}><span className="journey-step">{index + 1}</span>
                  <Link to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ': ' + title}>
                    <PlaceImage uri={place.images[0]} title={title} /><span>{title}</span><Icon name="arrow" />
                  </Link>
                </li>
              })}
            </ol>}
          </>}
        </article>
      })}
      <p className="journey-footnote">{t('jWalkingPending')}</p>
    </section>
  </section>
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Bấm ảnh/tên/Xem địa điểm: URL thành /places/ID và có tiêu đề tương ứng.
 * - Bấm Bản đồ trong thẻ: vẫn ở /journey?placeId=ID, bản đồ phóng đúng điểm.
 * - Xem thứ tự này hiện các điểm; bấm từng điểm mở đúng chi tiết; Tự khám phá bỏ chọn.
 * - Thử màn hình 390px, bàn phím Tab/Enter và đổi đủ năm ngôn ngữ.
 */
```

## apps/web/src/hooks/useJourneyNavigation.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Nhận gợi ý GPS và lưu tiến độ khi trang ra nền; App gọi hook này một lần.
 * Vị trí: apps/web/src/hooks/useJourneyNavigation.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from './useJourney'

// CHỨC NĂNG: Mở điểm GPS mới khi controller cho phép, không khi đang nghe.
// XỬ LÝ: Chỉ chạy khi ID gợi ý đổi, không điều hướng lại theo mỗi tick audio.
export function useJourneyNavigation() {
  const { engine, state } = useJourney(), navigate = useNavigate()
  useEffect(() => { if (state.suggestedId) navigate('/places/' + state.suggestedId) }, [state.suggestedId, navigate])
  useEffect(() => {
    const save = () => engine.checkpoint()
    window.addEventListener('pagehide', save)
    document.addEventListener('visibilitychange', save)
    return () => { window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', save) }
  }, [engine])

}
```

## apps/web/src/services/platform.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Kết nối bộ nhớ ngôn ngữ, vị trí và chính sách URL/QR của nền tảng.
 * Vị trí: apps/web/src/services/platform.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { siteOrigin } from '@travelguide/visitor-core'
import type { Point, StoragePort, QrPolicy } from '@travelguide/visitor-core'

// CHỨC NĂNG: Lưu ngôn ngữ trên trình duyệt hiện tại.
// XỬ LÝ: Provider bắt lỗi nếu trình duyệt không cho dùng localStorage.
export const storage: StoragePort = {
  readLanguage: async () => {
    return localStorage.getItem('lang')
  },

  writeLanguage: async (language) => {
    localStorage.setItem('lang', language)
  },
}

// CHỨC NĂNG: Lấy vị trí khi người dùng chủ động yêu cầu.
// XỬ LÝ: Thiếu API, từ chối quyền hoặc timeout sẽ được hook xử lý.
export function getPosition(): Promise<Point> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error('Geolocation unavailable'),
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },

      reject,

      {
        timeout: 12000,
        maximumAge: 60000,
        enableHighAccuracy: false,
      },
    )
  })
}

// CHỨC NĂNG: Chọn địa chỉ cho một QR chung.
// XỬ LÝ:
// - Ưu tiên VITE_PUBLIC_SITE_URL.
// - Chưa cấu hình thì dùng địa chỉ website đang mở.
// - localhost hoặc cấu hình sai trả null để UI hiện hướng dẫn.
export const publicSiteOrigin = (() => {
  try {
    return siteOrigin(
      import.meta.env.VITE_PUBLIC_SITE_URL
      || window.location.origin,

      import.meta.env.DEV,
    )
  } catch {
    return null
  }
})()

// CHỨC NĂNG: Giới hạn URL mà trang kiểm tra QR được phép mở.
// XỬ LÝ: Nhận origin hiện tại và origin công khai được cấu hình rõ.
export const qrPolicy: QrPolicy = {
  allowedOrigins: [
    ...new Set([
      window.location.origin,

      ...(publicSiteOrigin
        ? [publicSiteOrigin]
        : []),
    ]),
  ],

  allowHttp: import.meta.env.DEV,
}

// CHỨC NĂNG: Đọc URL QR mới nhất mà không phụ thuộc cache .env của Vite.
// XỬ LÝ: HTTPS đang mở được ưu tiên; localhost mới đọc runtime config của script QR.
export async function loadPublicSiteOrigin(): Promise<string | null> {
  try {
    if (window.location.protocol === 'https:') return siteOrigin(window.location.origin)
    const response = await fetch('/visitor-config.json', { cache: 'no-store', signal: AbortSignal.timeout(8000) })
    if (!response.ok) return publicSiteOrigin
    const value: unknown = await response.json()
    if (!value || typeof value !== 'object' || !('publicSiteOrigin' in value) || typeof value.publicSiteOrigin !== 'string') return null
    return siteOrigin(value.publicSiteOrigin)
  } catch { return publicSiteOrigin }
}
```

## apps/web/src/services/journeyAdapters.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Kết nối audio/GPS/bộ nhớ riêng nền tảng vào JourneyProvider.
 * Vị trí: apps/web/src/services/journeyAdapters.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import type { Track } from '@travelguide/visitor-core/journey'

let mediaOwner: HTMLAudioElement | undefined

export const journeyAdapters: JourneyAdapters = {
  read: async () => localStorage.getItem('visitor-journey-v1'),
  write: async value => { if (value === null) localStorage.removeItem('visitor-journey-v1'); else localStorage.setItem('visitor-journey-v1', value) },
  async watch(next, fail) {
    if (!navigator.geolocation) throw new Error('GPS unavailable')
    const id = navigator.geolocation.watchPosition(p => next({ lat: p.coords.latitude, lng: p.coords.longitude,
      accuracy: p.coords.accuracy, timestamp: p.timestamp }), fail, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 })
    return () => navigator.geolocation.clearWatch(id)
  },
  async open(url, title): Promise<Track> {
    const audio = new Audio(url.startsWith('demo:') ? '/demo-audio/' + url.slice(5) + '.mp3' : url)
    audio.preload = 'auto'
    try {
      // CHỨC NĂNG: Chờ metadata để thời lượng và thanh tua lấy từ file thật.
      // XỬ LÝ: Lỗi nguồn và timeout được trả về controller để cho thử lại.
      await new Promise<void>((resolve, reject) => {
        const done = () => { clearTimeout(timer); audio.removeEventListener('loadedmetadata', ready); audio.removeEventListener('error', bad) }
        const ready = () => { done(); resolve() }
        const bad = () => { done(); reject(new Error('Audio unavailable')) }
        const timer = setTimeout(bad, 20000)
        audio.addEventListener('loadedmetadata', ready)
        audio.addEventListener('error', bad)
        audio.load()
      })
    } catch (error) { audio.removeAttribute('src'); audio.load(); throw error }
    let disposed = false
    const track: Track = {
      duration: audio.duration,
      play: async () => {
        await audio.play()
        if ('mediaSession' in navigator) {
          mediaOwner = audio
          navigator.mediaSession.metadata = new MediaMetadata({ title })
          navigator.mediaSession.setActionHandler('play', () => { void audio.play().catch(() => audio.dispatchEvent(new Event('error'))) })
          navigator.mediaSession.setActionHandler('pause', () => audio.pause())
          navigator.mediaSession.setActionHandler('seekto', d => { if (d.seekTime !== undefined) audio.currentTime = d.seekTime })
        }
      },
      pause: () => audio.pause(),
      seek: async value => { audio.currentTime = value },
      rate: value => { audio.playbackRate = value },
      listen: callback => {
        const report = () => callback({ position: audio.currentTime, duration: audio.duration, playing: !audio.paused, ended: audio.ended, error: Boolean(audio.error) })
        const events = ['timeupdate', 'play', 'pause', 'ended', 'seeked', 'error']
        events.forEach(event => audio.addEventListener(event, report))
        return () => events.forEach(event => audio.removeEventListener(event, report))
      },
      dispose: () => {
        if (disposed) return
        disposed = true; audio.pause(); audio.removeAttribute('src'); audio.load()
        if ('mediaSession' in navigator && mediaOwner === audio) for (const action of ['play', 'pause', 'seekto'] as const) navigator.mediaSession.setActionHandler(action, null)
      },
    }
    return track
  },
}
```

## apps/web/src/components/Navbar.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thanh điều hướng web, logo, chọn ngôn ngữ và liên kết QR chung.
 * Vị trí: apps/web/src/components/Navbar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Link, NavLink } from 'react-router-dom'
import { useText } from '../i18n/index'
import { Icon, LanguagePicker } from './index'

export function Navbar() { const t = useText(); return (<header className="navbar">
        <div className="nav-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">🏯</span>
            <span>
              <strong>{t('site')}</strong>
              <small>{t('tagline')}</small>
            </span>
          </Link>

          <nav aria-label={t('explore')}>
            <NavLink end to="/">{t('home')}</NavLink>
            <NavLink to="/places">{t('explore')}</NavLink>

            <NavLink to="/journey">{t('jMap')}</NavLink>

            <NavLink to="/about">{t('about')}</NavLink>
          </nav>

          <div className="nav-actions">
            <LanguagePicker />

            <Link
              className="icon-button"
              to="/qr"
              aria-label={t('qrAccess')}
            >
              <Icon name="qr" />
            </Link>
          </div>
        </div>
      </header>) }
```

## apps/web/src/components/Footer.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Chân trang web với thông tin demo và nguồn ảnh.
 * Vị trí: apps/web/src/components/Footer.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { PHOTO_CREDITS } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

export function Footer() { const t = useText(); return (<footer className="container footer">
        <strong>{t('site')}</strong>
        <p>{t('noAccount')}</p>
        <p>{t('demo')}</p>

        <details>
          <summary>{t('photoCredits')}</summary>

          {PHOTO_CREDITS.map((credit) => (
            <p key={credit.url}>
              <a href={credit.url} target="_blank" rel="noreferrer">
                {credit.title}
              </a>
              {' · '}
              <a href={credit.licenseUrl}>
                {credit.license}
              </a>
            </p>
          ))}
        </details>
      </footer>) }
```

## apps/web/src/layouts/AppLayout.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Layout web dùng chung cho mọi trang; đổi trang không hủy trình phát.
 * Vị trí: apps/web/src/layouts/AppLayout.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { JourneyPlayer } from '../components/JourneyPlayer'

// CHỨC NĂNG: Giữ layout/player khi route con đổi; chỉ nội dung Outlet thay đổi.
export function AppLayout() {
  const t = useText()
  const { language } = useVisitor()

  useEffect(() => {
    document.documentElement.lang = language === 'cn' ? 'zh-CN' : language
    document.title = t('site') + ' · ' + t('explore')
  }, [language, t])

  return (
    <>
      <Navbar />
      <main className="container">
        <JourneyPlayer />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
```

## apps/web/src/pages/AboutPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang giới thiệu, giữ nội dung hiện tại.
 * Vị trí: apps/web/src/pages/AboutPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useText } from '../i18n'

export function AboutPage() { const t = useText(); return <section className="panel detail"><h1>{t('site')}</h1><p>{t('intro')}</p><p>{t('noAccount')}</p><p>{t('demo')}</p></section> }
```

## apps/web/src/pages/NotFoundPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang URL không tồn tại và liên kết quay lại danh sách.
 * Vị trí: apps/web/src/pages/NotFoundPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Link } from 'react-router-dom'
import { useText } from '../i18n'
import { State } from '../components/State'

export function NotFoundPage() { const t = useText(); return <section className="panel"><State message="notFound" /><Link to="/places">{t('back')}</Link></section> }
```

## apps/web/src/navigation/AppRoutes.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bảng route web; không chứa code UI của từng trang.
 * Vị trí: apps/web/src/navigation/AppRoutes.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { HomePage } from '../pages/HomePage'
import { PlacesPage } from '../pages/PlacesPage'
import { DetailPage } from '../pages/DetailPage'
import { JourneyPage } from '../pages/JourneyPage'
import { QrPage } from '../pages/QrPage'
import { AboutPage } from '../pages/AboutPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// CHỨC NĂNG: Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<DetailPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/qr" element={<QrPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

## apps/web/src/App.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ghép điều hướng web với hook GPS/lưu tiến độ.
 * Vị trí: apps/web/src/App.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { AppRoutes } from './navigation/AppRoutes'
import { useJourneyNavigation } from './hooks/useJourneyNavigation'

export default function App() { useJourneyNavigation(); return <AppRoutes /> }
```

## apps/web/src/main.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Mount React 18, BrowserRouter và các provider; giữ ngôn ngữ/tiến độ dùng chung.
 * Vị trí: apps/web/src/main.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { boot } from './i18n'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { journeyAdapters } from './services/journeyAdapters'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { colors, spacing } from '../../../packages/ui-tokens/colors'
import { storage } from './services/platform'
import App from './App'
import './styles/index.css'
import './styles/player.css'

// CHỨC NĂNG: Cho CSS dùng chung token với mobile.
// XỬ LÝ: Màu là chuỗi; spacing được đổi thành đơn vị px.
for (const [key, value] of Object.entries(colors)) {
  document.documentElement.style.setProperty('--' + key, value)
}

for (const [key, value] of Object.entries(spacing)) {
  document.documentElement.style.setProperty(
    '--space-' + key,
    value + 'px',
  )
}

const root = document.getElementById('root')

if (!root) throw new Error('Missing root element')

// CHỨC NĂNG: Khởi tạo ngôn ngữ trước khi mở các trang.
// XỬ LÝ: BrowserRouter giữ route chi tiết khi truy cập bằng QR.
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <VisitorProvider
      boot={boot}
      storage={storage}
      deviceLanguage={
        navigator.languages?.[0] ?? navigator.language
      }
      loading={<progress />}
    >
      <BrowserRouter>
        <JourneyProvider adapters={journeyAdapters}><App /></JourneyProvider>
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)
```

## apps/web/src/styles/index.css

```css
/*
 * FILE NÀY LÀM GÌ:
 * Định dạng web desktop/tablet/mobile theo mockup UC01–UC05.
 * main.tsx nạp; màu và spacing được truyền từ ui-tokens thành CSS variables.
 */

/* CHỨC NĂNG: Nền, chữ và điều khiển chung.
 * XỬ LÝ: Focus rõ cho bàn phím, vùng bấm tối thiểu 40px. */
* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background: var(--page);
  color: var(--text);
  font: 14px/1.55 "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans", "Noto Sans CJK SC", "Noto Sans JP", Arial, sans-serif;
}

a { color: var(--primary); text-decoration: none; }

button, input, select { font: inherit; }

button, .button, .secondary {
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid var(--primary);
  border-radius: 12px;
  font-weight: 600;
  line-height: 1.5;
  transition: background-color .15s, box-shadow .15s, border-color .15s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

button, .button {
  background: var(--primary);
  color: var(--white);
}

.secondary {
  background: var(--background);
  color: var(--text);
  border-color: var(--border);
}

button:disabled { opacity: .5; cursor: default; }

a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
summary:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 3px;
}

h1, h2, h3, p { margin: 0; }
h2 { font-size: 22px; line-height: 1.3; }
h3 { font-size: 15px; line-height: 1.4; }

input[type="search"],
input[type="text"],
select {
  min-height: 40px;
  padding: 8px 10px;
  background: var(--background);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 9px;
  max-width: 100%;
}

fieldset { border: 0; padding: 0; margin: 20px 0; }
legend { font-weight: 700; margin-bottom: 8px; }

input[type="checkbox"] {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.container {
  width: min(1240px, 100%);
  margin: auto;
  padding: 16px 22px;
}

.icon-button {
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.muted {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 12px;
}

.state { padding: 32px 16px; text-align: center; }
.state p { margin: 8px 0; }

.panel {
  background: var(--background);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 18px;
  box-shadow: 0 8px 28px rgba(25, 55, 110, .045);
}

/* CHỨC NĂNG: Navbar và chọn ngôn ngữ.
 * XỬ LÝ: Không có cổng đăng nhập du khách. */
.navbar {
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1240px;
  margin: auto;
  min-height: 76px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  flex-shrink: 0;
}

.brand-mark { font-size: 36px; }

.brand strong {
  display: block;
  font-family: inherit;
  font-size: 20px;
}

.brand small {
  display: block;
  font-size: 9px;
  letter-spacing: 1.2px;
}

.navbar nav {
  display: flex;
  align-items: stretch;
  gap: 25px;
  align-self: stretch;
}

.navbar nav a, .nav-disabled {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--text);
  border: 0;
  border-radius: 0;
  border-bottom: 3px solid transparent;
  background: none;
  padding: 0;
}

.navbar nav a.active {
  border-bottom-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}

.nav-disabled { opacity: .5; }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-picker select {
  font-size: 12px;
  max-width: 150px;
  border-radius: 24px;
}

.language-picker p {
  max-width: 190px;
  font-size: 11px;
}

/* CHỨC NĂNG: Hero ảnh và thanh tìm kiếm.
 * XỬ LÝ: Lớp phủ tối bảo đảm đọc được chữ; có nền khi ảnh mạng lỗi. */
.hero {
  min-height: 355px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  isolation: isolate;
  background: #163738;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-end;
}

.hero-image, .hero-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.hero-shade {
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(8, 22, 34, .75),
    rgba(8, 22, 34, .12)
  );
}

.hero-content {
  width: 100%;
  padding: 35px 46px;
  color: var(--white);
}

.hero .eyebrow {
  font-family: inherit;
  font-size: 26px;
  line-height: 1.1;
}

.hero h1 {
  font-family: inherit;
  font-size: 46px;
  line-height: 1.12;
  margin: 4px 0 10px;
}

.hero-content > p:not(.eyebrow) {
  max-width: 490px;
  font-size: 15px;
}

.hero-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 8px 7px 18px;
  background: var(--background);
  border-radius: 15px;
  margin: 24px 0 14px;
  color: var(--muted);
}

.hero-search input {
  border: 0;
  flex: 1;
  min-width: 0;
  outline-offset: 0;
}

.hero-search button { min-width: 140px; }

.category-chips {
  display: flex;
  gap: 10px;
  overflow: auto;
  padding: 4px 0;
}

.category-chips button {
  white-space: nowrap;
  border-color: var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 12px;
  padding: 8px 14px;
  flex-shrink: 0;
}

.category-chips button span {
  font-size: 19px;
  color: var(--primary);
}

.category-chips button[aria-pressed="true"] {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

.category-chips button[aria-pressed="true"] span {
  color: var(--white);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-title p {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.section-title > a {
  font-size: 12px;
  white-space: nowrap;
}

/* CHỨC NĂNG: Card và carousel.
 * XỬ LÝ: Ảnh có cùng tỉ lệ; thiếu ảnh vẫn giữ bố cục. */
.carousel-wrap { position: relative; }

.featured-carousel {
  display: flex;
  gap: 18px;
  overflow: auto;
  scroll-snap-type: x proximity;
  padding: 2px 2px 10px;
  scrollbar-width: thin;
}

.featured-carousel > .place-card {
  flex: 0 0 calc((100% - 54px) / 4);
  scroll-snap-align: start;
}

.carousel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
}

.carousel-actions button {
  border-radius: 50%;
  font-size: 22px;
}

.place-card {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--background);
  overflow: hidden;
  min-width: 0;
}

.card-photo { display: block; }

.place-image {
  width: 100%;
  height: 160px;
  display: block;
  object-fit: cover;
  background: var(--soft);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--muted);
  font-size: 12px;
  background: linear-gradient(135deg, var(--soft), var(--page));
}

.placeholder > span {
  font-size: 34px;
  color: var(--primary);
}

.card-content { padding: 12px; }
.card-content h3 { margin-bottom: 7px; }
.card-content h3 a { color: var(--text); }

.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  border-radius: 20px;
  padding: 3px 10px;
  color: var(--primary);
  background: var(--soft);
}

.badge-temple { color: #975100; background: #FFF1DA; }
.badge-gate { color: #087D7D; background: #E6F5F3; }

.card-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--muted);
  margin-top: 8px;
}

.card-location svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.card-location span {
  margin-left: auto;
  white-space: nowrap;
}

.heart {
  position: absolute;
  right: 8px;
  top: 8px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, .93);
  color: var(--text);
}

.heart[aria-pressed="true"] { color: var(--primary); }
.heart[aria-pressed="true"] svg { fill: var(--primary); }

/* CHỨC NĂNG: Bộ lọc, lưới/danh sách và phân trang.
 * XỬ LÝ: Sidebar thu gọn bằng media query, state React vẫn được giữ. */
.catalog-layout {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 24px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-controls label {
  font-size: 12px;
  white-space: nowrap;
}

.sort-controls select {
  margin-left: 8px;
  width: 125px;
}

.view-switch { display: flex; }

.view-switch button[aria-pressed="true"] {
  background: var(--primary);
  color: var(--white);
}

.filters { min-width: 0; }
.filters .section-title { font-size: 13px; }

.text-button {
  background: none;
  color: var(--primary);
  border: 0;
  padding: 0;
  min-height: 30px;
  font-size: 12px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 0 9px;
  margin-bottom: 9px;
  color: var(--muted);
}

.search-field input {
  border: 0;
  width: 100%;
  min-width: 0;
  padding: 8px 0;
  font-size: 12px;
}

.search-field svg {
  flex-shrink: 0;
  width: 16px;
}

.filters fieldset label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--muted);
  margin: 6px 0;
}

.filters fieldset legend { font-size: 14px; }

.filters > .secondary {
  width: 100%;
  font-size: 12px;
}

.place-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.list-view { grid-template-columns: 1fr; }
.list-view .place-card { display: flex; }
.list-view .card-photo { flex: 0 0 190px; }
.list-view .place-image { height: 145px; }
.list-view .heart { top: 10px; right: 10px; }

.list-view .card-content {
  padding: 22px;
  flex: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.pagination button {
  min-width: 40px;
  padding: 7px 12px;
}

.mobile-filters { display: none; }

.detail {
  max-width: 900px;
  margin: 20px auto;
  padding: 28px;
  background: var(--background);
  border-radius: 16px;
}

.detail h1 {
  font-family: inherit;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.4;
  margin: 18px 0;
}

.detail h2 { margin: 18px 0 10px; }

.detail > .place-image {
  height: 320px;
  border-radius: 12px;
}

.detail p { margin: 12px 0; }
.narration { white-space: pre-line; line-height: 1.9; }

.language-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.language-options button {
  background: var(--background);
  color: var(--primary);
}

.language-options button[aria-pressed="true"] {
  background: var(--primary);
  color: var(--white);
}

.qr-panel {
  border-top: 1px solid var(--border);
  margin-top: 24px;
  padding-top: 16px;
  overflow-wrap: anywhere;
}

.detail form { display: grid; gap: 12px; }

.footer {
  font-size: 12px;
  color: var(--muted);
  padding-top: 10px;
  padding-bottom: 30px;
}

.footer p { margin: 8px 0; }

/* CHỨC NĂNG: Bố cục tablet. */
@media (max-width: 1000px) {
  .nav-inner { gap: 15px; }
  .navbar nav { gap: 14px; }
  .brand strong { font-size: 17px; }

  .catalog-layout {
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 16px;
  }

  .place-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .featured-carousel > .place-card {
    flex-basis: calc((100% - 36px) / 3);
  }
}

/* CHỨC NĂNG: Bố cục điện thoại và nút mở bộ lọc. */
@media (max-width: 720px) {
  .container { padding: 12px; }

  .nav-inner {
    padding: 10px 14px;
    flex-wrap: wrap;
    min-height: 72px;
  }

  .brand-mark { font-size: 29px; }
  .brand strong { font-size: 16px; }
  .brand small { font-size: 8px; }

  .navbar nav {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 28px;
    height: 38px;
  }

  .navbar nav a { font-size: 12px; }
  .language-picker select { width: 102px; }
  .nav-actions { margin-left: auto; }
  .hero { min-height: 320px; }
  .hero-content { padding: 24px; }
  .hero h1 { font-size: 35px; }
  .hero .eyebrow { font-size: 22px; }

  .hero-search {
    padding-left: 12px;
    gap: 5px;
  }

  .hero-search button {
    min-width: 44px;
    font-size: 12px;
    padding: 8px;
  }

  .hero-search button svg { display: none; }
  .hero-search input { font-size: 12px; padding: 6px; }
  .panel { padding: 17px; }
  .section-title h2 { font-size: 19px; }

  .catalogue-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .catalog-layout { grid-template-columns: 1fr; }

  .filters {
    display: none;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
  }

  .filters-open { display: block; }

  .mobile-filters {
    display: inline-flex;
    margin-bottom: 14px;
  }

  .featured-carousel > .place-card {
    flex-basis: calc((100% - 18px) / 2);
  }

  .place-grid { gap: 12px; }
  .place-image { height: 135px; }
  .card-content { padding: 10px; }
  .card-content h3 { font-size: 14px; }
  .card-location { flex-wrap: wrap; }
  .card-location span { margin-left: 0; }
  .list-view .card-photo { flex-basis: 115px; }
  .list-view .card-content { padding: 14px; }
}

@media (max-width: 400px) {
  .place-grid { grid-template-columns: 1fr; }
  .featured-carousel > .place-card { flex-basis: 80%; }
  .list-view .card-photo { flex-basis: 100px; }
  .hero-content { padding: 18px; }
}
/* CHỨC NĂNG: Nút có phản hồi rõ, không đổi font giữa chữ Việt và các ngôn ngữ khác. */
button:not(:disabled):hover, .button:hover { filter: brightness(.97); }
button:not(:disabled):active, .button:active { filter: brightness(.92); }
.language-options { gap: 8px; }
.language-options button { border-radius: 11px; }
.language-options button[aria-pressed="true"] { box-shadow: 0 3px 10px #1667e822; }
```

## apps/web/src/vite-env.d.ts

```ts




/// <reference types="vite/client" />
```

## packages/visitor-core/src/journey.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Điều phối GPS, một nguồn audio và lưu tiến độ UC06–UC11.
 * JourneyProvider gọi; phụ thuộc model/catalog/search, không phụ thuộc React/thiết bị.
 * Adapter audio và bộ nhớ được truyền vào để test không cần GPS hoặc loa thật.
 */
import { LANGUAGES, type Language, type PlaceRecord, type Point } from './model'
import { publishedText, type Catalog } from './catalog'
import { distanceMeters, validPoint } from './search'

export type Fix = Point & { accuracy: number; timestamp: number }
export type MapPoint = Point & { source: string; fieldVerified: boolean }
export type VisitRoute = { id: string; title: Record<Language, string>; stops: string[]; verified: boolean; available: boolean }
export type MediaStatus = { position: number; duration: number; playing: boolean; ended: boolean; error?: boolean }
export type Track = {
  duration: number
  play(): Promise<void>
  pause(): void
  seek(seconds: number): Promise<void>
  rate(value: number): void
  listen(callback: (status: MediaStatus) => void): () => void
  dispose(): void
}
export type Saved = {
  placeId: string; language: Language; textVersion: number; audioId: string
  audioVersion: number; position: number; duration: number; rate: number
}
export type Session = Saved & { title: string }
export type JourneyPorts = {
  catalog: Catalog
  open(url: string, title: string): Promise<Track>
  watch(next: (fix: Fix) => void, fail: () => void): Promise<() => void>
  read(): Promise<string | null>
  write(value: string | null): Promise<void>
  positions: Readonly<Record<string, MapPoint>>
  routes: readonly VisitRoute[]
}
export type JourneyError = 'audioMissing' | 'audioFailed' | 'gpsFailed' | 'gpsWeak' | 'saveFailed' | 'savedInvalid' | 'loadError'
export type JourneyState = {
  places: readonly PlaceRecord[]; ready: boolean; status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  session?: Session; restore?: Saved; changed: boolean; error?: JourneyError
  gps: boolean; fix?: Fix; suggestedId?: string; routeId?: string
}

// CHỨC NĂNG: Giới hạn thời điểm tua theo thời lượng thật.
// XỬ LÝ: Không dùng số giả để mô phỏng thanh thời gian.
export const clampTime = (value: number, duration: number) =>
  Number.isFinite(value) && Number.isFinite(duration) ? Math.max(0, Math.min(value, duration)) : 0

// CHỨC NĂNG: Kiểm tra dữ liệu localStorage/AsyncStorage không đáng tin cậy.
// XỬ LÝ: JSON lỗi, ngôn ngữ lạ, thời gian âm hoặc phiên bản sai đều bị loại.
export function parseSaved(raw: string | null): Saved | undefined {
  if (!raw) return undefined
  try {
    const x: unknown = JSON.parse(raw)
    if (!x || typeof x !== 'object') return undefined
    const s = x as Record<string, unknown>
    if (typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string'
      || !LANGUAGES.some(l => l.code === s.language)
      || !['textVersion', 'audioVersion', 'position', 'duration', 'rate'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]))) return undefined
    if (Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1
      || Number(s.audioVersion) < 1 || ![0.75, 1, 1.25, 1.5, 2].includes(Number(s.rate))) return undefined
    return { placeId: s.placeId, language: s.language as Language, audioId: s.audioId,
      textVersion: Number(s.textVersion), audioVersion: Number(s.audioVersion),
      position: clampTime(Number(s.position), Number(s.duration)), duration: Number(s.duration), rate: Number(s.rate) }
  } catch { return undefined }
}

// CHỨC NĂNG: Chỉ chọn điểm gần nhất trong 100 m, giữ ổn định khi bằng nhau.
// XỬ LÝ: Tọa độ lấy từ nguồn bản đồ được ghi rõ, không coi là đã khảo sát GPS.
export function nearest(places: readonly PlaceRecord[], points: JourneyPorts['positions'], fix: Fix, previous?: string, now = Date.now()) {
  if (!validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60
    || !Number.isFinite(fix.timestamp) || Math.abs(now - fix.timestamp) > 30000) return undefined
  const matches = places.flatMap(p => {
    const point = points[p.id]
    if (!point || !validPoint(point)) return []
    const meters = distanceMeters(fix, point)
    return meters <= 100 ? [{ id: p.id, meters }] : []
  }).sort((a, b) => a.meters - b.meters || a.id.localeCompare(b.id))
  const stable = matches.find(m => m.id === previous)
  return stable && matches[0] && Math.abs(stable.meters - matches[0].meters) < 0.01 ? stable.id : matches[0]?.id
}

export function routeAvailable(route: VisitRoute, places: readonly PlaceRecord[]) {
  return route.available && route.stops.length > 0 && route.stops.every(id => places.some(p => p.id === id))
}

export class JourneyController {
  private state: JourneyState = { places: [], ready: false, status: 'idle', changed: false, gps: false }
  private listeners = new Set<() => void>()
  private track?: Track
  private unlisten?: () => void
  private unwatch?: () => void
  private generation = 0
  private lifecycle = 0
  private gpsGeneration = 0
  private intent?: { id: string; language: Language; autoplay: boolean }
  private writes: Promise<void> = Promise.resolve()
  private lastPersist = 0
  constructor(public readonly ports: JourneyPorts) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private set(next: Partial<JourneyState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(l => l()) }

  // CHỨC NĂNG: Nạp danh mục và bản lưu độc lập.
  // XỬ LÝ: Bộ nhớ bị chặn vẫn giữ danh sách; bản ghi đổi phiên bản chỉ hiện lời nhắc.
  async start() {
    const life = ++this.lifecycle
    try {
      let readFailed = false
      const [places, raw] = await Promise.all([this.ports.catalog.list(), this.ports.read().catch(() => { readFailed = true; return null })])
      if (life !== this.lifecycle) return
      const saved = parseSaved(raw)
      let valid: Saved | undefined
      let changed = false
      if (saved) {
        const text = publishedText(places.find(p => p.id === saved.placeId) ?? { content: {} } as PlaceRecord, saved.language)
        const audio = text?.audio
        if (audio?.status === 'published' && audio.approvedAt && audio.publishedAt) {
          valid = saved
          changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.version !== saved.audioVersion
        }
      }
      this.set({ places, ready: true, restore: valid, changed,
        error: readFailed ? 'saveFailed' : raw && !valid ? 'savedInvalid' : undefined })
    } catch { if (life === this.lifecycle) this.set({ ready: true, error: 'loadError' }) }
  }

  // CHỨC NĂNG: Ghi tuần tự để phản hồi ghi cũ không đè tiến độ mới.
  // XỬ LÝ: Lỗi lưu không dừng âm thanh; UI thông báo vẫn dùng được trong phiên.
  private persist(clear = false) {
    const s = this.state.session
    if (!s && !clear) return
    const value = clear ? null : JSON.stringify(s)
    this.writes = this.writes.then(() => this.ports.write(value)).catch(() => { this.set({ error: 'saveFailed' }) })
  }
  private stopTrack() { this.unlisten?.(); this.unlisten = undefined; this.track?.pause(); this.track?.dispose(); this.track = undefined }

  // CHỨC NĂNG: Tải và phát một nguồn đã công bố.
  // XỬ LÝ: Mỗi lần gọi tăng generation; phản hồi cũ đến muộn chỉ được giải phóng.
  async play(id: string, language: Language, position = 0, autoplay = true, rate = 1) {
    const request = ++this.generation
    this.intent = { id, language, autoplay }
    this.persist()
    this.stopTrack()
    this.set({ status: 'loading', session: undefined, error: undefined, restore: undefined })
    let next: Track | undefined
    try {
      const place = await this.ports.catalog.get(id)
      if (request !== this.generation) return
      const text = publishedText(place, language)
      const audio = text?.audio
      if (!audio || audio.status !== 'published' || !audio.approvedAt || !audio.publishedAt) throw new Error('audioMissing')
      next = await this.ports.open(audio.url, text.title)
      if (request !== this.generation) { next.dispose(); return }
      if (!Number.isFinite(next.duration) || next.duration <= 0) throw new Error('audioFailed')
      this.track = next
      const session: Session = { placeId: id, language, title: text.title, textVersion: text.version,
        audioId: audio.id, audioVersion: audio.version, duration: next.duration,
        position: clampTime(position, next.duration), rate }
      await next.seek(session.position)
      if (request !== this.generation) return
      next.rate(rate)
      this.set({ session, status: 'paused' })
      this.unlisten = next.listen(status => {
        if (request !== this.generation || !this.state.session) return
        if (status.error) { this.persist(); this.stopTrack(); this.set({ status: 'error', error: 'audioFailed' }); return }
        this.set({ session: { ...this.state.session, position: clampTime(status.position, status.duration), duration: status.duration },
          status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
        if (status.ended) this.persist(true)
        else if (Date.now() - this.lastPersist > 5000) { this.lastPersist = Date.now(); this.persist() }
      })
      if (autoplay) { await next.play(); if (request === this.generation && this.intent?.autoplay) this.set({ status: 'playing' }) }
      this.persist()
    } catch (error) {
      if (request !== this.generation) { next?.dispose(); return }
      // CHỨC NĂNG: Pause ngay sau Play là thao tác bình thường, không phải lỗi nguồn.
      // XỬ LÝ: HTML Audio có thể hủy Promise play bằng AbortError khi pause đến trước.
      if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay && next === this.track) { this.persist(); return }
      if (next && next !== this.track) next.dispose()
      this.stopTrack()
      this.set({ status: 'error', error: error instanceof Error && error.message === 'audioMissing' ? 'audioMissing' : 'audioFailed' })
    }
  }

  // CHỨC NĂNG: Tạm dừng, tiếp tục, tua và tốc độ tác động trực tiếp lên Track thật.
  // XỬ LÝ: Chỉ cập nhật trạng thái khi nguồn hiện tại vẫn là nguồn đã thao tác.
  pause() { if (!this.track) return; if (this.intent) this.intent.autoplay = false; this.track.pause(); this.set({ status: 'paused' }); this.persist() }
  async resume() {
    const t = this.track
    if (!t) return
    if (this.intent) this.intent.autoplay = true
    try { await t.play(); if (t === this.track && this.intent?.autoplay) this.set({ status: 'playing', error: undefined }) }
    catch (error) { if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay) return; if (t === this.track) this.set({ status: 'error', error: 'audioFailed' }) }
  }
  async seek(value: number) {
    const t = this.track, s = this.state.session
    if (!t || !s || this.state.status === 'loading') return
    try { const position = clampTime(value, s.duration); await t.seek(position)
      if (t === this.track && this.state.session) { this.set({ session: { ...this.state.session, position } }); this.persist() }
    } catch { if (t === this.track) this.set({ error: 'audioFailed' }) }
  }
  rate(value: number) {
    if (!this.track || !this.state.session || ![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    try { this.track.rate(value); this.set({ session: { ...this.state.session, rate: value } }); this.persist() }
    catch { this.set({ error: 'audioFailed' }) }
  }
  // CHỨC NĂNG: Đổi cả bài đọc và audio theo ngôn ngữ chung UC08.
  // XỬ LÝ: Đang nghe thì phát bản mới từ 0; đang tạm dừng vẫn tạm dừng từ 0.
  changeLanguage(language: Language) {
    const active = this.intent
    if (!active || active.language === language) return
    const autoplay = this.state.status === 'playing' || (this.state.status === 'loading' && active.autoplay)
    void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1)
  }
  dismissRestore() { this.set({ restore: undefined, changed: false }); this.persist(true) }
  async restorePlay() { const s = this.state.restore; if (s) await this.play(s.placeId, s.language, this.state.changed ? 0 : s.position, true, s.rate) }
  selectRoute(id?: string) {
    const route = this.ports.routes.find(r => r.id === id)
    this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefined })
  }

  // CHỨC NĂNG: GPS chỉ đổi gợi ý, không gọi play.
  // XỬ LÝ: Đang phát/đang tải/đã kết thúc hoặc đang chờ khôi phục thì giữ màn.
  acceptFix(fix: Fix) {
    const weak = !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || !Number.isFinite(fix.timestamp) || fix.accuracy > 60 || Math.abs(Date.now() - fix.timestamp) > 30000 || !validPoint(fix)
    const prior = this.state.error
    this.set({ fix: weak ? undefined : fix, error: weak ? 'gpsWeak' : prior === 'gpsWeak' || prior === 'gpsFailed' ? undefined : prior })
    if (weak || !['idle', 'paused', 'error'].includes(this.state.status) || this.state.restore) return
    this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.state.suggestedId) })
  }
  async gps(enabled: boolean) {
    const request = ++this.gpsGeneration
    this.unwatch?.(); this.unwatch = undefined
    this.set({ gps: enabled, error: undefined })
    if (!enabled) return
    try {
      const stop = await this.ports.watch(fix => { if (request === this.gpsGeneration) this.acceptFix(fix) },
        () => { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) })
      if (request !== this.gpsGeneration) stop(); else this.unwatch = stop
    } catch { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) }
  }
  // CHỨC NĂNG: Chốt tiến độ khi web/app ra nền, không dừng bài đang nghe.
  checkpoint() { this.persist(this.state.status === 'ended') }
  retry() { if (this.state.error === 'loadError') { void this.start(); return } const i = this.intent; if (i) void this.play(i.id, i.language) }
  dispose() { this.lifecycle++; this.generation++; this.gpsGeneration++; this.persist(this.state.status === 'ended'); this.unwatch?.(); this.unwatch = undefined; this.stopTrack() }
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm test; kiểm tra chỉ có một nguồn đang nghe.
 * - Đổi ngôn ngữ lúc tải chậm: nguồn cũ không được phát muộn.
 */
```

## packages/visitor-core/src/journey-react.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Giữ một phiên nghe/GPS xuyên suốt mọi màn UC06–UC11.
 * App mobile và main.tsx web bọc provider dưới VisitorProvider UC01–UC05.
 * Phụ thuộc JourneyController và các adapter nền tảng; không tự phát lúc khởi động.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { JourneyController, type JourneyPorts } from './journey'
import { MAP_POINTS, VISIT_ROUTES } from './journey-data'
import { useVisitor } from './react'

export type JourneyAdapters = Omit<JourneyPorts, 'catalog' | 'positions' | 'routes'>
const Context = createContext<JourneyController | null>(null)

export function JourneyProvider({ adapters, children }: { adapters: JourneyAdapters; children: ReactNode }) {
  const { catalog, language } = useVisitor()
  const engine = useMemo(() => new JourneyController({ ...adapters, catalog, positions: MAP_POINTS, routes: VISIT_ROUTES }), [adapters, catalog])
  // CHỨC NĂNG: Đọc tiến độ nhưng chỉ đề nghị tiếp tục, không tự phát.
  // XỬ LÝ: Cleanup dừng GPS, giải phóng player và vô hiệu hóa request tải cũ.
  useEffect(() => { void engine.start(); return () => engine.dispose() }, [engine])
  useEffect(() => { engine.changeLanguage(language) }, [engine, language])
  return <Context.Provider value={engine}>{children}</Context.Provider>
}

export function useJourney() {
  const engine = useContext(Context)
  if (!engine) throw new Error('JourneyProvider is missing')
  const state = useSyncExternalStore(engine.subscribe, engine.snapshot, engine.snapshot)
  const { changeLanguage } = useVisitor()
  return { engine, state, resumeSaved: async () => {
    const language = state.restore?.language
    if (language) { await changeLanguage(language); await engine.restorePlay() }
  } }
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi trang khi đang nghe: player không bị tạo lại.
 * - Tải lại ứng dụng: chỉ hiện lời nhắc, chưa tự phát.
 */
```

## packages/visitor-core/src/journey-data.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Cung cấp tọa độ tham khảo từ OpenStreetMap và tuyến minh họa.
 * JourneyProvider/map dùng; backend thật thay module này bằng service.
 * Nguồn: Overpass, lấy 23/10/2026; center của hình công trình, chưa khảo sát điểm đón GPS.
 * Tuyến chưa được quản lý xác nhận nên không dùng làm chỉ đường nội bộ UC09/UC10.
 */
import type { MapPoint, VisitRoute } from './journey'

// CHỨC NĂNG: Giữ nguồn của từng marker để người dùng kiểm tra tọa độ.
// XỬ LÝ: fieldVerified=false phân biệt dữ liệu bản đồ với khảo sát thực địa.
export const MAP_POINTS: Readonly<Record<string, MapPoint>> = {
  'ky-dai': { lat: 16.4663574, lng: 107.5802462, source: 'https://www.openstreetmap.org/way/218427614', fieldVerified: false },
  'ngo-mon': { lat: 16.4676824, lng: 107.5791834, source: 'https://www.openstreetmap.org/way/172657562', fieldVerified: false },
  'dien-thai-hoa': { lat: 16.4687434, lng: 107.5783867, source: 'https://www.openstreetmap.org/way/531031566', fieldVerified: false },
  'the-mieu': { lat: 16.4671614, lng: 107.5767398, source: 'https://www.openstreetmap.org/way/172657567', fieldVerified: false },
  'cung-dien-tho': { lat: 16.4688916, lng: 107.5754008, source: 'https://www.openstreetmap.org/way/172763420', fieldVerified: false },
  'truong-sanh-cung': { lat: 16.4697182, lng: 107.5746783, source: 'https://www.openstreetmap.org/way/172763427', fieldVerified: false },
  'dien-can-chanh': { lat: 16.4694768, lng: 107.5777963, source: 'https://www.openstreetmap.org/way/285990343', fieldVerified: false },
  'hien-lam-cac': { lat: 16.4667375, lng: 107.5770629, source: 'https://www.openstreetmap.org/way/172657564', fieldVerified: false },
}

export const VISIT_ROUTES: readonly VisitRoute[] = [{
  id: 'hue-preview',
  title: { vi: 'Thứ tự tham khảo Hoàng thành — chưa duyệt lối đi', en: 'Imperial City preview — walking paths pending approval',
    cn: '皇城参考顺序，步行路线待审核', pt: 'Ordem de visita da Cidade Imperial — percursos por aprovar', ja: '皇城の参考順序・歩行経路は未承認' },
  stops: ['ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho'],
  verified: false, available: true,
}]

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Mở từng source để đối chiếu marker OSM.
 * - Tuyến tham khảo phải hiển thị nhãn chưa duyệt, không vẽ lối đi giả.
 */
```

## packages/visitor-core/src/journey-messages.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Chữ giao diện UC06–UC11, đủ năm ngôn ngữ.
 * messages.ts ghép vào i18n; thứ tự cột được kiểm tra để tránh thiếu/nhầm key.
 */
import type { Language } from './model'
const keys = ['jTitle','jPlay','jPause','jResume','jReplay','jBack','jForward','jSpeed','jSeek','jGpsOn','jGpsOff',
  'jReference','jNoNearby','gpsWeak','gpsFailed','audioMissing','audioFailed','saveFailed','savedInvalid',
  'jContinue','jDiscard','jVersionChanged','jMap','jRoutes','jPreview','jRouteInvalid','jUseRoute','jSkipRoute',
  'jOpenPlace','jSource','jWalkingPending','jPreparing','jEnded','jPaused','jPlaying','jExternalMap','jMyLocation','jRetry'] as const
type Key = typeof keys[number]
const rows: Record<Language, readonly string[]> = {
  vi: ['Hành trình & thuyết minh','Nghe thuyết minh','Tạm dừng','Tiếp tục','Nghe lại','Lùi 10 giây','Tiến 10 giây','Tốc độ','Thời điểm nghe','Bật gợi ý GPS','Tắt gợi ý GPS',
    'Tọa độ tham khảo OpenStreetMap; chưa khảo sát điểm đón GPS. Gợi ý trong 100 m không xác nhận đã vào công trình.','Chưa có điểm trong 100 m hoặc chưa có vị trí phù hợp.','GPS quá cũ hoặc thiếu chính xác. Đang chờ cập nhật.','Không lấy được GPS; bạn vẫn chọn địa điểm trên danh sách/bản đồ được.','Chưa có audio đã công bố cho ngôn ngữ này.','Không phát được audio. Hãy thử lại; vẫn có thể đọc văn bản.','Không lưu được tiến độ trên thiết bị.','Bản lưu không hợp lệ hoặc bài không còn công bố.',
    'Tiếp tục bài đã lưu','Bỏ qua','Phiên bản đã thay đổi. Nếu tiếp tục, bài mới sẽ phát từ đầu.','Bản đồ','Tuyến tham quan','Thứ tự tham khảo — chưa phải tuyến đi bộ đã duyệt.','Tuyến có điểm không còn công bố hoặc không khả dụng.','Xem thứ tự này','Tự khám phá','Xem địa điểm','Nguồn tọa độ','Chưa có lối đi được xác nhận; không vẽ đường nối xuyên tường/cổng.','Đang chuẩn bị audio…','Đã kết thúc','Đã tạm dừng','Đang phát','Mở vị trí trên bản đồ ngoài','Vị trí của bạn','Thử lại'],
  en: ['Journey & narration','Listen','Pause','Resume','Replay','Back 10 seconds','Forward 10 seconds','Speed','Playback position','Enable GPS suggestions','Disable GPS suggestions',
    'OpenStreetMap reference coordinates; GPS arrival points have not been surveyed. A suggestion within 100 m does not confirm entry.','No suitable place within 100 m or location unavailable.','Location is stale or inaccurate. Waiting for an update.','GPS unavailable; the list and map remain usable.','No published audio in this language.','Audio unavailable. Retry or read the text.','Could not save progress on this device.','Saved progress is invalid or content is no longer published.',
    'Continue saved narration','Skip','The version changed. Continuing starts the new version from the beginning.','Map','Visitor routes','Reference order — not an approved walking route.','A stop is unavailable or no longer published.','View this order','Explore freely','Open place','Coordinate source','Walking paths are unverified; no straight routes through walls or gates are drawn.','Preparing audio…','Finished','Paused','Playing','Open location in external map','Your location','Retry'],
  cn: ['行程与讲解','收听讲解','暂停','继续','重新播放','后退10秒','前进10秒','速度','播放位置','开启GPS推荐','关闭GPS推荐',
    '坐标来自OpenStreetMap，仅供参考，GPS到达点尚未实地核实。100米内的推荐不代表已进入建筑。','100米内暂无合适景点或无法定位。','定位过旧或不准确，等待更新。','无法获取GPS，仍可使用列表和地图。','此语言暂无已发布音频。','无法播放音频，请重试或阅读文字。','无法在设备上保存进度。','保存记录无效或内容已撤回。',
    '继续上次讲解','跳过','版本已更新，继续将从头播放新版。','地图','参观路线','参考顺序，步行路线尚未审核。','路线中的景点不可用或已撤回。','查看此顺序','自由探索','查看景点','坐标来源','步行通道尚未核实，不绘制穿越城墙的直线。','正在准备音频…','已结束','已暂停','正在播放','在外部地图打开位置','您的位置','重试'],
  pt: ['Percurso e narração','Ouvir','Pausar','Continuar','Repetir','Recuar 10 segundos','Avançar 10 segundos','Velocidade','Posição de reprodução','Ativar sugestões GPS','Desativar sugestões GPS',
    'Coordenadas de referência OpenStreetMap; pontos GPS por verificar no local. Uma sugestão a 100 m não confirma a entrada.','Sem local adequado a 100 m ou localização indisponível.','Localização antiga ou imprecisa. A aguardar atualização.','GPS indisponível; a lista e o mapa continuam disponíveis.','Sem áudio publicado neste idioma.','Não foi possível reproduzir. Tente novamente ou leia o texto.','Não foi possível guardar o progresso.','Registo inválido ou conteúdo retirado.',
    'Continuar narração guardada','Ignorar','A versão mudou. Continuar reproduz a nova versão desde o início.','Mapa','Percursos','Ordem de referência; percurso pedonal não aprovado.','Um local do percurso está indisponível.','Ver esta ordem','Explorar livremente','Ver local','Fonte das coordenadas','Caminhos por confirmar; não são traçadas linhas através de muralhas.','A preparar áudio…','Terminado','Em pausa','A reproduzir','Abrir localização no mapa externo','A sua localização','Tentar novamente'],
  ja: ['見学と音声ガイド','解説を聞く','一時停止','再開','最初から聞く','10秒戻る','10秒進む','再生速度','再生位置','GPS候補を有効にする','GPS候補を無効にする',
    'OpenStreetMapの参考座標です。GPS到着地点は未調査で、100m以内の候補は入場を保証しません。','100m以内に適切なスポットがないか、現在地を取得できません。','位置情報が古いか不正確です。更新を待っています。','GPSを取得できません。リストと地図は利用できます。','この言語の公開音声はありません。','音声を再生できません。再試行するか文章をお読みください。','端末に進捗を保存できません。','保存記録が無効か、コンテンツの公開が終了しました。',
    '保存した解説を再開','スキップ','バージョンが更新されました。新しい音声を最初から再生します。','地図','見学順序','参考順序です。歩行経路は未承認です。','順序内のスポットを利用できません。','この順序を見る','自由に見学','スポットを見る','座標の出典','通路は未確認です。城壁を横切る直線経路は表示しません。','音声を準備中…','終了','一時停止中','再生中','外部地図で位置を開く','現在地','再試行'],
}
export const journeyMessages = Object.fromEntries(Object.entries(rows).map(([language, values]) => {
  if (values.length !== keys.length) throw new Error('Missing journey text: ' + language)
  return [language, Object.fromEntries(keys.map((key, index) => [key, values[index]]))]
})) as Record<Language, Record<Key, string>>

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi đủ VI/EN/CN/PT/JA: nhãn GPS/audio phải đổi.
 * - Xóa một ô dịch tạm trong test: kiểm tra độ dài báo lỗi.
 */
```

## packages/visitor-core/src/model.ts

```ts
/**
 * FILE NÀY LÀM GÌ:
 * Định nghĩa dữ liệu dùng chung cho UC01–UC11.
 * Service, hooks và các màn mobile/web sử dụng.
 * Không phụ thuộc React Native hoặc trình duyệt.
 */

// CHỨC NĂNG: Khai báo các ngôn ngữ được hỗ trợ.
// XỬ LÝ: Giữ cn làm mã nội bộ để tương thích lựa chọn đã lưu.
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
// XỬ LÝ: zh-CN thành cn, pt_BR thành pt; không hỗ trợ trả null.
export function languageOf(
  value: string | null | undefined,
): Language | null {
  const base = value
    ?.toLowerCase()
    .replace(/_/g, '-')
    .split('-')[0]

  return base === 'zh'
    ? 'cn'
    : LANGUAGES.find((item) => item.code === base)?.code ?? null
}

// CHỨC NĂNG: Khai báo mã danh mục ổn định.
// XỬ LÝ: UI lấy tên qua i18n; không dùng tên tiếng Việt làm mã.
export const CATEGORIES = [
  'palace',
  'gate',
  'temple',
  'tomb',
  'museum',
  'monument',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Zone = 'fortifications' | 'ceremonial'
export type SortOrder = 'name' | 'nearest'

export type Point = {
  lat: number
  lng: number
}

// CHỨC NĂNG: Mô tả một bản nội dung theo ngôn ngữ.
// XỬ LÝ: Service kiểm tra trạng thái duyệt/công bố trước khi trả cho khách.
// CHỨC NĂNG: Nguồn audio có phiên bản và trạng thái công bố riêng.
// XỬ LÝ: Optional trong PublishedText để dữ liệu UC01–UC11 cũ vẫn dùng được.
export type PublishedAudio = {
  id: string; url: string; version: number
  status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string
}
export type PublishedText = {
  audio?: PublishedAudio
  title: string
  summary: string
  body: string
  address: string
  version: number
  status: 'draft' | 'approved' | 'published'
  approvedAt?: string
  publishedAt?: string
}

// CHỨC NĂNG: Mô tả một địa điểm trong danh mục triển khai.
// XỬ LÝ: Các trường mới optional để dữ liệu cũ vẫn dùng được.
export type PlaceRecord = {
  id: string
  scope: string
  inLaunchCatalog: boolean
  status: 'draft' | 'published' | 'withdrawn'
  canonicalTitle: string
  zone: Zone
  images: string[]
  category?: Category
  featured?: boolean

  // CHỨC NĂNG: Phân biệt tọa độ đã xác nhận.
  // XỬ LÝ: Chỉ dùng verified=true để tính khoảng cách.
  position?: Point & {
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép thiếu một số bản ngôn ngữ.
  // XỬ LÝ: Không tự dịch chưa duyệt để lấp bản thiếu.
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
// XỬ LÝ: Thiếu category thì suy ra từ zone để tương thích ngược.
export function categoryOf(place: PlaceRecord): Category {
  return place.category
    ?? (place.zone === 'fortifications' ? 'gate' : 'palace')
}

export type CatalogSource =
  () => Promise<readonly PlaceRecord[]>

// CHỨC NĂNG: Tách logic ngôn ngữ khỏi công nghệ lưu trữ.
// XỬ LÝ: Mobile cung cấp AsyncStorage, web cung cấp localStorage.
export type StoragePort = {
  readLanguage: () => Promise<string | null>
  writeLanguage: (language: Language) => Promise<void>
}
```

## packages/visitor-core/src/mock.ts

```ts
/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp tám điểm minh họa để thử giao diện UC02–UC04.
 * demoCatalog được provider dùng mặc định.
 * Phụ thuộc model.ts và catalog.ts.
 *
 * Danh mục và bài đọc là dữ liệu demo, chưa phải dữ liệu triển khai đã chốt.
 * Không khai báo tọa độ suy đoán.
 */

import { PLACE_PHOTOS } from './photos'
import { createCatalog } from './catalog'
import type { Language, PlaceRecord, PublishedText } from './model'

const demoBody: Record<Language, string> = {
  vi: 'Đây là nội dung minh họa để kiểm tra màn đọc thuyết minh. Trước khi phục vụ du khách, quản lý phải cung cấp, kiểm duyệt và công bố bài chính thức.',
  en: 'This is sample text for testing the reading screen. Before serving visitors, management must provide, review and publish the official narration.',
  cn: '此文本仅用于测试讲解阅读页面。正式服务游客前，管理人员必须提供、审核并发布正式讲解。',
  pt: 'Este texto serve para testar a leitura. Antes de servir visitantes, a gestão deve fornecer, rever e publicar a narração oficial.',
  ja: 'これは解説の閲覧画面を確認するサンプルです。実際の公開前に管理者が正式な内容を提供、審査、公開する必要があります。',
}

const address: Record<Language, string> = {
  vi: 'Phạm vi Kinh thành Huế — vị trí chi tiết chờ xác nhận',
  en: 'Hue Citadel area — exact location pending confirmation',
  cn: '顺化京城范围，具体位置待确认',
  pt: 'Área da Cidadela de Huế — localização exata por confirmar',
  ja: 'フエ京城の対象範囲、詳細位置は確認待ち',
}

// CHỨC NĂNG: Mô phỏng một bản nội dung đã công bố.
// XỬ LÝ: Trạng thái/ngày chỉ dùng thử quy tắc FE, UI có thông báo dữ liệu demo.
function text(title: string, language: Language): PublishedText {
  return {
    title,
    // CHỨC NĂNG: File giọng đọc demo đã tạo trước, có thể pause/tua thật.
    // XỬ LÝ: Không gọi dịch/TTS lúc du khách mở bài; dữ liệu vẫn ghi nhãn demo.
    audio: { id: 'demo-' + language, url: 'demo:' + language, version: 1,
      status: 'published', approvedAt: '2026-10-23T00:00:00Z', publishedAt: '2026-10-23T00:00:00Z' },
    summary: demoBody[language],
    body: demoBody[language],
    address: address[language],
    version: 1,
    status: 'published',
    approvedAt: '2026-10-19T00:00:00Z',
    publishedAt: '2026-10-19T01:00:00Z',
  }
}

// CHỨC NĂNG: Tạo địa điểm từ những bản ngôn ngữ được khai báo.
// XỬ LÝ: Thiếu ngôn ngữ thì giữ thiếu, không tự dịch.
function make(
  id: string,
  zone: PlaceRecord['zone'],
  // CHỨC NĂNG: Bắt buộc dữ liệu demo khai báo đủ năm tên ngôn ngữ.
  // XỬ LÝ: Quên cn, pt hoặc ja sẽ được TypeScript báo ngay khi viết dữ liệu.
  names: Record<Language, string>,
): PlaceRecord {
  const content: PlaceRecord['content'] = {}

  for (const language of ['vi', 'en', 'cn', 'pt', 'ja'] as const) {
    const title = names[language]
    if (title) content[language] = text(title, language)
  }

  return {
    id,
    scope: 'hue-citadel',
    inLaunchCatalog: true,
    status: 'published',
    canonicalTitle: names.vi ?? id,
    zone,
    images: [],
    content,
  }
}

// CHỨC NĂNG: Cung cấp tám điểm minh họa đủ năm ngôn ngữ.
// XỬ LÝ: Hàm make ghép tên với nội dung demo tương ứng từng ngôn ngữ.
// Trường hợp API thiếu bản dịch được kiểm tra bằng dữ liệu riêng trong test.
export const MOCK_PLACES: PlaceRecord[] = [
  make('ky-dai', 'fortifications', {
    vi: 'Kỳ Đài',
    en: 'Flag Tower',
    cn: '旗台',
    pt: 'Torre da Bandeira',
    ja: '旗台',
  }),

  make('ngo-mon', 'fortifications', {
    vi: 'Ngọ Môn',
    en: 'Ngo Mon Gate',
    cn: '午门',
    pt: 'Porta Ngo Mon',
    ja: '午門',
  }),

  make('dien-thai-hoa', 'ceremonial', {
    vi: 'Điện Thái Hòa',
    en: 'Thai Hoa Palace',
    cn: '太和殿',
    pt: 'Palácio Thai Hoa',
    ja: '太和殿',
  }),

  make('the-mieu', 'ceremonial', {
    vi: 'Thế Miếu',
    en: 'The Mieu Temple',
    cn: '世庙',
    pt: 'Templo The Mieu',
    ja: '世廟',
  }),

  make('cung-dien-tho', 'ceremonial', {
    vi: 'Cung Diên Thọ',
    en: 'Dien Tho Palace',
    cn: '延寿宫',
    pt: 'Palácio Dien Tho',
    ja: '延寿宮',
  }),

  make('truong-sanh-cung', 'ceremonial', {
    vi: 'Trường Sanh Cung',
    en: 'Truong Sanh Palace',
    cn: '长生宫',
    pt: 'Palácio Truong Sanh',
    ja: '長生宮',
  }),

  make('dien-can-chanh', 'ceremonial', {
    vi: 'Điện Cần Chánh',
    en: 'Can Chanh Palace',
    cn: '勤政殿',
    pt: 'Palácio Can Chanh',
    ja: '勤政殿',
  }),

  make('hien-lam-cac', 'ceremonial', {
    vi: 'Hiển Lâm Các',
    en: 'Hien Lam Pavilion',
    cn: '显临阁',
    pt: 'Pavilhão Hien Lam',
    ja: '顕臨閣',
  }),
]

// CHỨC NĂNG: Gắn danh mục và trạng thái nổi bật.
// XỬ LÝ: Kỳ Đài không bị gọi là cổng thành;
// không thêm điểm ngoài phạm vi chỉ để đủ danh mục trong ảnh.
for (const place of MOCK_PLACES) {
  place.category =
    place.id === 'ky-dai' ? 'monument'
      : place.id === 'ngo-mon' ? 'gate'
        : place.id === 'the-mieu' || place.id === 'hien-lam-cac'
          ? 'temple'
          : 'palace'

  place.featured = [
    'ngo-mon',
    'dien-thai-hoa',
    'the-mieu',
    'cung-dien-tho',
  ].includes(place.id)
}

// CHỨC NĂNG: Mỗi địa điểm có ảnh riêng đã kiểm tra nguồn, không mượn ảnh điểm khác.
for (const place of MOCK_PLACES) {
  const photo = PLACE_PHOTOS[place.id]
  place.images = photo ? [photo.image] : []
}

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Trả bản sao dữ liệu JSON để UI không sửa nguồn.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}

export const demoCatalog = createCatalog(loadMockCatalog)
```

## packages/visitor-core/src/messages.ts

```ts
/**
 * FILE NÀY LÀM GÌ:
 * Chứa chữ giao diện UC01–UC11 của năm ngôn ngữ.
 * createVisitorI18n trong react.tsx dùng file này.
 * Phụ thuộc type Language trong model.ts.
 */
import { qrMessages } from './qr-messages'

import { journeyMessages } from './journey-messages'


// CHỨC NĂNG: Nhập kiểu ngôn ngữ hợp lệ.
// XỬ LÝ: Không dùng mã ngôn ngữ tùy ý.
import type { Language } from './model'
// CHỨC NĂNG: Bổ sung nhãn UI mới.
// XỬ LÝ: Ghép vào resource hiện tại, giữ các khóa UC01–UC11 đã có.
import { uiMessages } from './uiMessages'
// CHỨC NĂNG: Khai báo bộ khóa chuẩn bằng tiếng Việt.
// XỬ LÝ: Đây là chữ UI; nội dung từng địa điểm nằm trong dữ liệu.
const vi = {
  ...qrMessages.vi, ...journeyMessages.vi,  ...uiMessages.vi,
  brand: 'HueGuide',
  explore: 'Khám phá',
  intro: 'Các điểm trong danh mục tham quan Kinh thành Huế',
  demo: 'Dữ liệu minh họa cho đồ án; chưa phải nội dung đã duyệt của đơn vị quản lý di tích.',
  language: 'Ngôn ngữ',
  search: 'Tìm tên công trình, địa chỉ hoặc nội dung...',
  all: 'Tất cả',
  zone: 'Nhóm di tích',
  zone_fortifications: 'Thành và cổng',
  zone_ceremonial: 'Công trình nghi lễ',
  sort: 'Sắp xếp',
  name: 'Theo tên',
  nearest: 'Gần nhất',
  location: 'Lấy vị trí của tôi',
  locationDenied: 'Không lấy được vị trí. Bạn vẫn dùng được danh sách và QR.',
  distance: 'Khoảng cách',
  orderFallback: 'Chưa có đủ vị trí/tọa độ xác nhận; đang sắp xếp theo tên.',
  loading: 'Đang tải...',
  retry: 'Thử lại',
  loadError: 'Không tải được dữ liệu. Vui lòng thử lại.',
  empty: 'Không có kết quả',
  emptyHint: 'Thử từ khóa khác hoặc xóa bộ lọc.',
  reset: 'Xóa điều kiện',
  noImage: 'Chưa có ảnh',
  missing: 'Chưa có bản nội dung đã công bố bằng ngôn ngữ này.',
  missingList: 'Một số điểm chưa có bản công bố theo ngôn ngữ hiện tại; tìm kiếm chỉ xét bản có sẵn.',
  available: 'Bản ngôn ngữ đã công bố',
  details: 'Chi tiết địa điểm',
  back: 'Quay lại danh sách',
  notFound: 'Địa điểm không tồn tại hoặc không còn công bố.',
  version: 'Phiên bản nội dung',
  unverified: 'Vị trí điểm chưa được quản lý xác nhận.',
  coordinates: 'Tọa độ đã xác nhận',
  scan: 'Quét QR',
  scanHint: 'Đưa mã QR điểm di tích vào khung. Quét thành công chỉ mở bài, không tự phát.',
  cameraInfo: 'Cho phép camera để quét QR. Bạn vẫn có thể chọn địa điểm từ danh sách.',
  allowCamera: 'Cho phép camera',
  cameraDenied: 'Camera chưa được cấp quyền.',
  systemSettings: 'Mở cài đặt thiết bị',
  cameraFailed: 'Không khởi động được camera.',
  invalidQr: 'QR không đúng định dạng hoặc không thuộc hệ thống.',
  again: 'Quét lại',
  enterQr: 'Dán liên kết QR để kiểm tra',
  openQr: 'Mở địa điểm',
  qrLink: 'Liên kết QR của điểm',
  qrWebHint: 'Quét QR chung bằng camera điện thoại để mở danh sách điểm tham quan trên website.',
  saveError: 'Không lưu được ngôn ngữ. Lựa chọn vẫn có hiệu lực trong phiên này.',
  readError: 'Không đọc được lựa chọn đã lưu; đang dùng ngôn ngữ thiết bị hoặc tiếng Việt.',
  previous: 'Trước',
  next: 'Sau',
  page: 'Trang',
  results: 'Kết quả',
  published: 'Bản công bố mô phỏng',
  read: 'Bài thuyết minh',
  locationBusy: 'Đang lấy vị trí...',
  close: 'Đóng',
} as const

export type MessageKey = keyof typeof vi

// CHỨC NĂNG: Bắt buộc các ngôn ngữ còn lại có cùng bộ khóa.
// XỬ LÝ: Thêm khóa vào vi mà quên en/cn/pt/ja sẽ bị TypeScript báo.
type Messages = Record<MessageKey, string>

const en: Messages = {
  ...qrMessages.en, ...journeyMessages.en,  ...uiMessages.en,
  brand: 'HueGuide',
  explore: 'Explore',
  intro: 'Selected places in the Hue Citadel visitor catalogue',
  demo: 'Coursework sample data; not content approved by the actual heritage management authority.',
  language: 'Language',
  search: 'Search building names, addresses or content...',
  all: 'All',
  zone: 'Place group',
  zone_fortifications: 'Walls and gates',
  zone_ceremonial: 'Ceremonial buildings',
  sort: 'Sort',
  name: 'Name',
  nearest: 'Nearest',
  location: 'Get my location',
  locationDenied: 'Location is unavailable. The list and QR remain available.',
  distance: 'Distance',
  orderFallback: 'Location or verified coordinates are missing; sorting by name.',
  loading: 'Loading...',
  retry: 'Try again',
  loadError: 'Could not load the data. Please try again.',
  empty: 'No results',
  emptyHint: 'Try another keyword or clear the filters.',
  reset: 'Clear conditions',
  noImage: 'No image available',
  missing: 'No published content is available in this language.',
  missingList: 'Some places lack a published version in this language; search uses available versions only.',
  available: 'Published languages',
  details: 'Place details',
  back: 'Back to places',
  notFound: 'This place does not exist or is no longer published.',
  version: 'Content version',
  unverified: 'The place location has not been confirmed by management.',
  coordinates: 'Verified coordinates',
  scan: 'Scan QR',
  scanHint: 'Place a site QR code inside the frame. Scanning opens the page without autoplay.',
  cameraInfo: 'Allow camera access to scan QR codes. You can still select places from the list.',
  allowCamera: 'Allow camera',
  cameraDenied: 'Camera access has not been granted.',
  systemSettings: 'Open device settings',
  cameraFailed: 'Could not start the camera.',
  invalidQr: 'Invalid QR format or a link outside this system.',
  again: 'Scan again',
  enterQr: 'Paste a QR link to check',
  openQr: 'Open place',
  qrLink: 'Place QR link',
  qrWebHint: 'Scan the shared QR with your phone camera to open the visitor catalogue on the website.',
  saveError: 'Could not save the language. Your choice still applies to this session.',
  readError: 'Could not read your saved language; using the device language or Vietnamese.',
  previous: 'Previous',
  next: 'Next',
  page: 'Page',
  results: 'Results',
  published: 'Simulated published version',
  read: 'Narration text',
  locationBusy: 'Getting location...',
  close: 'Close',
}

const cn: Messages = {
  ...qrMessages.cn, ...journeyMessages.cn,  ...uiMessages.cn,
  brand: 'HueGuide',
  explore: '探索',
  intro: '顺化京城参观目录中的景点',
  demo: '课程演示数据，并非遗迹管理机构正式审核的内容。',
  language: '语言',
  search: '搜索建筑名称、地址或内容...',
  all: '全部',
  zone: '遗迹分组',
  zone_fortifications: '城墙与城门',
  zone_ceremonial: '礼仪建筑',
  sort: '排序',
  name: '按名称',
  nearest: '距离最近',
  location: '获取我的位置',
  locationDenied: '无法获取位置，仍可使用列表和二维码。',
  distance: '距离',
  orderFallback: '缺少位置或已确认的坐标，当前按名称排序。',
  loading: '正在加载...',
  retry: '重试',
  loadError: '无法加载数据，请重试。',
  empty: '没有结果',
  emptyHint: '请尝试其他关键词或清除筛选。',
  reset: '清除条件',
  noImage: '暂无图片',
  missing: '此语言暂无已发布内容。',
  missingList: '部分景点缺少此语言的发布版本，搜索仅使用已有版本。',
  available: '已发布语言',
  details: '景点详情',
  back: '返回列表',
  notFound: '景点不存在或已停止发布。',
  version: '内容版本',
  unverified: '景点位置尚未由管理人员确认。',
  coordinates: '已确认坐标',
  scan: '扫描二维码',
  scanHint: '将景点二维码放入框内，扫描后仅打开页面，不自动播放。',
  cameraInfo: '允许使用相机扫描二维码，也可从列表选择景点。',
  allowCamera: '允许相机',
  cameraDenied: '尚未获得相机权限。',
  systemSettings: '打开设备设置',
  cameraFailed: '无法启动相机。',
  invalidQr: '二维码格式错误或不属于本系统。',
  again: '重新扫描',
  enterQr: '粘贴二维码链接进行检查',
  openQr: '打开景点',
  qrLink: '景点二维码链接',
  qrWebHint: '使用手机相机扫描共用二维码，在网站打开景点列表。',
  saveError: '无法保存语言选择，本次会话仍使用此语言。',
  readError: '无法读取已保存语言，使用设备语言或越南语。',
  previous: '上一页',
  next: '下一页',
  page: '页',
  results: '结果',
  published: '模拟发布版本',
  read: '讲解文本',
  locationBusy: '正在获取位置...',
  close: '关闭',
}

const pt: Messages = {
  ...qrMessages.pt, ...journeyMessages.pt,  ...uiMessages.pt,
  brand: 'HueGuide',
  explore: 'Explorar',
  intro: 'Locais selecionados no catálogo da Cidadela de Huế',
  demo: 'Dados de demonstração académica; não são conteúdos aprovados pela entidade gestora do património.',
  language: 'Idioma',
  search: 'Pesquisar nomes, endereços ou conteúdo...',
  all: 'Todos',
  zone: 'Grupo de locais',
  zone_fortifications: 'Muralhas e portas',
  zone_ceremonial: 'Edifícios cerimoniais',
  sort: 'Ordenar',
  name: 'Nome',
  nearest: 'Mais próximos',
  location: 'Obter a minha localização',
  locationDenied: 'Localização indisponível. A lista e os códigos QR continuam disponíveis.',
  distance: 'Distância',
  orderFallback: 'Faltam localização ou coordenadas confirmadas; ordenação por nome.',
  loading: 'A carregar...',
  retry: 'Tentar novamente',
  loadError: 'Não foi possível carregar os dados. Tente novamente.',
  empty: 'Sem resultados',
  emptyHint: 'Experimente outra palavra ou limpe os filtros.',
  reset: 'Limpar condições',
  noImage: 'Sem imagem',
  missing: 'Não existe conteúdo publicado neste idioma.',
  missingList: 'Alguns locais não têm versão publicada neste idioma; a pesquisa usa apenas as versões disponíveis.',
  available: 'Idiomas publicados',
  details: 'Detalhes do local',
  back: 'Voltar à lista',
  notFound: 'O local não existe ou já não está publicado.',
  version: 'Versão do conteúdo',
  unverified: 'A localização ainda não foi confirmada pela gestão.',
  coordinates: 'Coordenadas confirmadas',
  scan: 'Ler QR',
  scanHint: 'Coloque o QR do local no enquadramento. A leitura abre a página sem reprodução automática.',
  cameraInfo: 'Permita a câmara para ler QR. Pode continuar a escolher locais na lista.',
  allowCamera: 'Permitir câmara',
  cameraDenied: 'O acesso à câmara não foi concedido.',
  systemSettings: 'Abrir definições do dispositivo',
  cameraFailed: 'Não foi possível iniciar a câmara.',
  invalidQr: 'Formato QR inválido ou ligação fora deste sistema.',
  again: 'Ler novamente',
  enterQr: 'Cole uma ligação QR para verificar',
  openQr: 'Abrir local',
  qrLink: 'Ligação QR do local',
  qrWebHint: 'Leia o QR comum com a câmara do telemóvel para abrir a lista de locais no website.',
  saveError: 'Não foi possível guardar o idioma. A escolha mantém-se nesta sessão.',
  readError: 'Não foi possível ler o idioma guardado; a usar o idioma do dispositivo ou vietnamita.',
  previous: 'Anterior',
  next: 'Seguinte',
  page: 'Página',
  results: 'Resultados',
  published: 'Versão publicada simulada',
  read: 'Texto da narração',
  locationBusy: 'A obter localização...',
  close: 'Fechar',
}

const ja: Messages = {
  ...qrMessages.ja, ...journeyMessages.ja,  ...uiMessages.ja,
  brand: 'HueGuide',
  explore: '探索',
  intro: 'フエ京城の参観対象スポット',
  demo: '授業用のサンプルデータです。実際の遺跡管理機関が承認した内容ではありません。',
  language: '言語',
  search: '建物名、住所、内容を検索...',
  all: 'すべて',
  zone: '遺跡グループ',
  zone_fortifications: '城壁と城門',
  zone_ceremonial: '儀式の建物',
  sort: '並び替え',
  name: '名前順',
  nearest: '近い順',
  location: '現在地を取得',
  locationDenied: '位置情報を取得できません。リストとQRは利用できます。',
  distance: '距離',
  orderFallback: '位置情報または確認済み座標がないため、名前順で表示します。',
  loading: '読み込み中...',
  retry: '再試行',
  loadError: 'データを取得できません。再試行してください。',
  empty: '結果がありません',
  emptyHint: '別のキーワードを試すか、絞り込みを解除してください。',
  reset: '条件を解除',
  noImage: '画像がありません',
  missing: 'この言語の公開済みコンテンツはありません。',
  missingList: '一部のスポットにはこの言語の公開版がなく、検索は既存の公開版のみを対象にします。',
  available: '公開済みの言語',
  details: 'スポット詳細',
  back: 'リストに戻る',
  notFound: 'スポットが存在しないか、公開が停止されています。',
  version: 'コンテンツ版',
  unverified: '管理者による位置の確認が完了していません。',
  coordinates: '確認済み座標',
  scan: 'QRを読み取る',
  scanHint: 'スポットのQRを枠内に入れてください。ページを開くだけで自動再生はしません。',
  cameraInfo: 'QRを読むにはカメラを許可してください。リストからも選択できます。',
  allowCamera: 'カメラを許可',
  cameraDenied: 'カメラが許可されていません。',
  systemSettings: '端末の設定を開く',
  cameraFailed: 'カメラを起動できません。',
  invalidQr: 'QRの形式が正しくないか、このシステム以外のリンクです。',
  again: '再読み取り',
  enterQr: 'QRリンクを貼り付けて確認',
  openQr: 'スポットを開く',
  qrLink: 'スポットのQRリンク',
  qrWebHint: 'スマートフォンのカメラで共通QRを読み取ると、ウェブのスポット一覧を開きます。',
  saveError: '言語を保存できません。このセッションでは選択を維持します。',
  readError: '保存済み言語を取得できないため、端末の言語またはベトナム語を使用します。',
  previous: '前へ',
  next: '次へ',
  page: 'ページ',
  results: '結果',
  published: '公開版の模擬データ',
  read: '解説文',
  locationBusy: '位置を取得中...',
  close: '閉じる',
}

// CHỨC NĂNG: Ghép đúng resource với đúng mã.
// XỬ LÝ: cn luôn lấy bản Trung, pt luôn lấy bản Bồ; tránh đổi nhầm biến.
export const messages: Record<Language, Messages> = {
  vi,
  en,
  cn,
  pt,
  ja,
}
```

## packages/visitor-core/package.json

```json
{
  "name": "@travelguide/visitor-core",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./react": "./src/react.tsx",
    "./journey": "./src/journey.ts",
    "./journey/react": "./src/journey-react.tsx",
    "./journey/data": "./src/journey-data.ts"
  },
  "scripts": {
    "test": "tsc -p tsconfig.test.json && node --test tests/core.test.cjs tests/locale.test.cjs tests/site.test.cjs tests/journey.test.cjs",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "i18next": "^26.4.2",
    "react-i18next": "^17.0.15"
  },
  "devDependencies": {
    "@types/react": "~19.2.4"
  }
}
```

## packages/visitor-core/tests/journey.test.cjs

```js
/**
 * FILE NÀY LÀM GÌ: Kiểm tra nghiệp vụ UC06–UC11 bằng adapter audio/GPS giả.
 * npm test gọi; không phát loa, không cần mạng. Kiểm tra race và quy tắc thật,
 * không dùng đồng hồ giả thay cho thời lượng audio ở giao diện sản phẩm.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { JourneyController, nearest, parseSaved, clampTime, routeAvailable } = require('../.test-build/journey.js')
const { createCatalog } = require('../.test-build/catalog.js')
const { MOCK_PLACES } = require('../.test-build/mock.js')
const tick = () => new Promise(resolve => setImmediate(resolve))

function track() {
  const listeners = new Set()
  const t = { duration: 30, position: 0, playing: false, plays: 0, disposed: false,
    async play() { this.playing = true; this.plays++; this.emit() },
    pause() { this.playing = false; this.emit() },
    async seek(value) { this.position = value; this.emit() }, rate() {},
    listen(callback) { listeners.add(callback); return () => listeners.delete(callback) },
    dispose() { this.disposed = true; this.playing = false },
    emit(ended = false, error = false) { listeners.forEach(l => l({ position: this.position, duration: 30, playing: this.playing, ended, error })) },
  }
  return t
}
function fixture(extra = {}) {
  const writes = [], tracks = []
  const ports = {
    catalog: createCatalog(async () => MOCK_PLACES),
    positions: { 'ngo-mon': { lat: 0, lng: 0, source: 'test', fieldVerified: true } }, routes: [],
    open: async () => { const t = track(); tracks.push(t); return t },
    watch: async () => () => {}, read: async () => null, write: async value => { writes.push(value) },
    ...extra,
  }
  return { engine: new JourneyController(ports), writes, tracks }
}
const fix = (lng = 0) => ({ lat: 0, lng, accuracy: 5, timestamp: Date.now() })

test('UC06: chỉ chọn điểm trong 100m, dữ liệu GPS cũ/sai bị loại', () => {
  const { engine } = fixture(), places = [MOCK_PLACES[1]], points = engine.ports.positions
  assert.equal(nearest(places, points, fix()), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00089)), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00091)), undefined)
  assert.equal(nearest(places, points, { ...fix(), accuracy: 100 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), timestamp: Date.now() - 31000 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined)
})
test('UC06: khoảng cách bằng nhau giữ điểm trước', () => {
  const points = { 'ngo-mon': { lat: 0, lng: 0 }, 'ky-dai': { lat: 0, lng: 0 } }
  assert.equal(nearest(MOCK_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon')
})
test('UC06/07: đang nghe giữ bài và màn; tạm dừng được gợi ý nhưng không tự phát', async () => {
  const { engine, tracks } = fixture(); await engine.start()
  await engine.play('ky-dai', 'vi'); engine.acceptFix(fix())
  assert.equal(engine.snapshot().suggestedId, undefined)
  assert.equal(tracks[0].plays, 1)
  engine.pause(); engine.acceptFix(fix())
  assert.equal(engine.snapshot().suggestedId, 'ngo-mon')
  assert.equal(engine.snapshot().session.placeId, 'ky-dai')
  assert.equal(tracks[0].plays, 1); engine.dispose()
})
test('UC07: pause/seek giữ paused, tua clamp theo thời lượng thật', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 8; tracks[0].emit(); engine.pause()
  await engine.seek(999); assert.equal(tracks[0].position, 30)
  assert.equal(engine.snapshot().status, 'paused')
  await engine.seek(-10); assert.equal(tracks[0].position, 0)
  await engine.resume(); assert.equal(engine.snapshot().status, 'playing')
  engine.dispose()
})
test('UC07: chỉ một bài phát và nguồn cũ được giải phóng', async () => {
  const { engine, tracks } = fixture(); await engine.start()
  await engine.play('ngo-mon', 'vi'); await engine.play('ky-dai', 'vi')
  assert.equal(tracks[0].disposed, true); assert.equal(tracks[0].playing, false)
  assert.equal(tracks[1].playing, true); engine.dispose()
})
test('UC07.3: lỗi tốc độ giữ tốc độ đang có hiệu lực', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].rate = () => { throw Error('unsupported') }; engine.rate(1.5)
  assert.equal(engine.snapshot().session.rate, 1)
  assert.equal(engine.snapshot().error, 'audioFailed'); engine.dispose()
})
test('UC08: đổi ngôn ngữ đang nghe phát bản mới từ 0; paused vẫn paused', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 12; tracks[0].emit(); engine.changeLanguage('cn'); await tick()
  assert.equal(engine.snapshot().session.language, 'cn')
  assert.equal(engine.snapshot().session.position, 0); assert.equal(engine.snapshot().status, 'playing')
  engine.pause(); engine.changeLanguage('pt'); await tick()
  assert.equal(engine.snapshot().session.language, 'pt')
  assert.equal(engine.snapshot().status, 'paused'); engine.dispose()
})
test('UC07/08: phản hồi nguồn cũ đến muộn không phát đè bản mới', async () => {
  let release
  const late = track(), recent = track()
  const { engine } = fixture({ open: url => url === 'demo:vi' ? new Promise(resolve => { release = resolve }) : Promise.resolve(recent) })
  await engine.start(); const first = engine.play('ngo-mon', 'vi'); await tick()
  await engine.play('ngo-mon', 'en'); release(late); await first
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  assert.equal(recent.plays, 1); assert.equal(engine.snapshot().session.language, 'en'); engine.dispose()
})
test('UC07: thiếu audio đã công bố không tự dùng bản nháp', async () => {
  const place = JSON.parse(JSON.stringify(MOCK_PLACES[1])); place.content.vi.audio.status = 'draft'
  const { engine, tracks } = fixture({ catalog: createCatalog(async () => [place]) })
  await engine.start(); await engine.play(place.id, 'vi')
  assert.equal(engine.snapshot().error, 'audioMissing'); assert.equal(tracks.length, 0); engine.dispose()
})
test('UC07: kết thúc không phát bài kế tiếp', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  assert.equal(engine.snapshot().status, 'ended'); assert.equal(tracks.length, 1); engine.dispose()
})
test('UC10: tuyến có điểm bị rút không được sử dụng', () => {
  const route = { available: true, stops: ['ngo-mon', 'gone'] }
  assert.equal(routeAvailable(route, MOCK_PLACES), false)
  assert.equal(routeAvailable({ ...route, stops: ['ngo-mon'] }, MOCK_PLACES), true)
})
test('UC11: bản lưu hỏng bị loại; tiến độ vượt thời lượng được clamp', () => {
  assert.equal(parseSaved('{bad'), undefined)
  assert.equal(parseSaved(JSON.stringify({ placeId: 'ngo-mon', language: 'xx' })), undefined)
  assert.equal(clampTime(-10, 30), 0); assert.equal(clampTime(NaN, 30), 0)
})
test('UC11: mở lại chỉ đề nghị, đúng phiên bản mới tiếp tục tại thời điểm cũ', async () => {
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: 1, audioId: 'demo-vi', audioVersion: 1, position: 9, duration: 30, rate: 1.25 }
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  await engine.start(); assert.equal(tracks.length, 0); assert.equal(engine.snapshot().changed, false)
  await engine.restorePlay(); assert.equal(tracks[0].position, 9); assert.equal(engine.snapshot().session.rate, 1.25)
  engine.dispose()
})
test('UC11: phiên bản thay đổi thì đề nghị nghe mới từ đầu', async () => {
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: 99, audioId: 'old', audioVersion: 1, position: 9, duration: 30, rate: 1 }
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  await engine.start(); assert.equal(engine.snapshot().changed, true); assert.equal(tracks.length, 0)
  await engine.restorePlay(); assert.equal(tracks[0].position, 0); engine.dispose()
})
test('UC11: lỗi ghi không dừng âm thanh', async () => {
  const { engine, tracks } = fixture({ write: async () => { throw Error('full') } })
  await engine.start(); await engine.play('ngo-mon', 'vi'); await tick()
  assert.equal(engine.snapshot().error, 'saveFailed'); assert.equal(tracks[0].playing, true); engine.dispose()
})

// CHỨC NĂNG: Lỗi bộ nhớ không được làm mất danh sách UC06/UC09.
test('UC11: lỗi đọc bộ nhớ vẫn hiển thị địa điểm', async () => {
  const { engine } = fixture({ read: async () => { throw Error('blocked') } })
  await engine.start(); assert.equal(engine.snapshot().places.length, 8)
  assert.equal(engine.snapshot().error, 'saveFailed'); engine.dispose()
})
// CHỨC NĂNG: Đã nghe hết thì không đề nghị tiếp tục khi khởi động lại.
test('UC11: dispose không ghi lại bài đã kết thúc', async () => {
  const { engine, tracks, writes } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  engine.dispose(); await tick(); assert.equal(writes.at(-1), null)
})
// CHỨC NĂNG: Lỗi audio sau metadata phải được UI nhận và giải phóng nguồn.
test('UC07: lỗi nguồn đang phát được truyền tới UI', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].emit(false, true)
  assert.equal(engine.snapshot().status, 'error')
  assert.equal(tracks[0].disposed, true)
  engine.dispose()
})

// CHỨC NĂNG: Pause trước khi Promise play hoàn tất không được bị báo audioFailed.
// XỬ LÝ: Mô phỏng AbortError thật của HTML Audio để giữ nguồn và thời điểm paused.
for (const initial of [true, false]) {
  test('UC07: pause trong lúc ' + (initial ? 'play' : 'resume') + ' còn chờ không làm hỏng phiên', async () => {
    const t = track()
    const { engine } = fixture({ open: async () => t })
    await engine.start()
    if (!initial) await engine.play('ngo-mon', 'vi', 0, false)
    let rejectPlay
    t.play = async () => {
      t.playing = true; t.emit()
      await new Promise((_resolve, reject) => { rejectPlay = reject })
    }
    const waiting = initial ? engine.play('ngo-mon', 'vi') : engine.resume()
    await tick(); engine.pause()
    const error = new Error('play interrupted by pause'); error.name = 'AbortError'
    rejectPlay(error); await waiting
    assert.equal(engine.snapshot().status, 'paused')
    assert.equal(engine.snapshot().error, undefined)
    assert.equal(t.disposed, false)
    engine.dispose()
  })
}
```

## scripts/create-demo-audio.py

```python
"""FILE NÀY LÀM GÌ: Tạo giọng đọc demo VI/EN/CN/PT/JA để thử audio thật.
Chỉ chạy khi chuẩn bị dữ liệu demo; không dịch hoặc tạo bài lịch sử cho du khách.
Phụ thuộc edge-tts; file MP3 được chép vào web/static và mobile/assets.
"""
import asyncio
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = {
    'vi': ('vi-VN-HoaiMyNeural', 'Đây là nội dung minh họa để kiểm tra màn đọc thuyết minh. Trước khi phục vụ du khách, quản lý phải cung cấp, kiểm duyệt và công bố bài chính thức.'),
    'en': ('en-US-JennyNeural', 'This is sample text for testing the reading screen. Before serving visitors, management must provide, review and publish the official narration.'),
    'cn': ('zh-CN-XiaoxiaoNeural', '此文本仅用于测试讲解阅读页面。正式服务游客前，管理人员必须提供、审核并发布正式讲解。'),
    'pt': ('pt-PT-RaquelNeural', 'Este texto serve para testar a leitura. Antes de servir visitantes, a gestão deve fornecer, rever e publicar a narração oficial.'),
    'ja': ('ja-JP-NanamiNeural', 'これは解説の閲覧画面を確認するサンプルです。実際の公開前に管理者が正式な内容を提供、審査、公開する必要があります。'),
}

async def create(code, voice, text):
    folder = ROOT / 'apps/web/static/demo-audio'
    folder.mkdir(parents=True, exist_ok=True)
    file = folder / (code + '.mp3')
    await edge_tts.Communicate(text, voice, rate='-10%').save(str(file))
    native = ROOT / 'apps/mobile/assets/demo-audio'
    native.mkdir(parents=True, exist_ok=True)
    (native / file.name).write_bytes(file.read_bytes())
    print(code, file.stat().st_size)

async def main():
    await asyncio.gather(*(create(code, *value) for code, value in SAMPLES.items()))

asyncio.run(main())
```

## apps/mobile/tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "paths": {
      "expo-modules-core": [
        "./node_modules/expo-modules-core"
      ]
    },
    "jsx": "react-jsx"
  },
  "include": [
    "App.tsx",
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

## apps/mobile/package.json

```json
{
  "name": "mobile",
  "version": "0.0.1",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "lint": "eslint App.tsx src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/slider": "5.2.0",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "@react-navigation/native": "^6.1.10",
    "@react-navigation/native-stack": "^6.9.18",
    "@travelguide/place-core": "*",
    "@travelguide/shared-types": "*",
    "@travelguide/visitor-core": "*",
    "expo": "~57.0.27",
    "expo-audio": "~57.0.5",
    "expo-camera": "~57.0.6",
    "expo-localization": "~57.0.2",
    "expo-location": "~57.0.20",
    "expo-modules-core": "~57.0.24",
    "expo-speech": "~57.0.3",
    "i18next": "^26.4.2",
    "react": "19.2.3",
    "react-i18next": "^17.0.15",
    "react-native": "0.86.3",
    "react-native-maps": "1.27.2",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0"
  },
  "devDependencies": {
    "@expo/ngrok": "^4.1.0",
    "@types/react": "~19.2.4",
    "eslint": "^8.57.0",
    "typescript": "^6.0.3"
  }
}
```

## apps/web/package.json

```json
{
  "name": "web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "prebuild": "node ../../scripts/generate-app-links.cjs --if-configured",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "@travelguide/place-core": "*",
    "@travelguide/shared-types": "*",
    "@travelguide/visitor-core": "^0.1.0",
    "i18next": "^26.4.2",
    "leaflet": "^1.9.4",
    "qrcode": "^1.5.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^17.0.15",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.22",
    "@types/qrcode": "^1.5.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "typescript": "^5.4.0",
    "vite": "^5.1.0"
  }
}
```



## packages/visitor-core/src/photos.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Nguồn ảnh đúng tám công trình, tác giả và giấy phép Commons.
 * mock/presentation và giao diện dùng; ảnh đã đóng gói riêng cho web/native.
 * photo:ID là mã asset, không phải URL mạng; resolver của mỗi nền tảng xử lý.
 */
import type { Language } from './model'
type PlacePhoto = { id: string; title: string; author: string; url: string; image: string; sourceUrl: string; license: string; licenseUrl: string; changes: string; note?: Partial<Record<Language, string>> }
export const PLACE_PHOTOS: Readonly<Record<string, PlacePhoto>> = {
  "truong-sanh-cung": {
    "id": "truong-sanh-cung",
    "title": "Trường Sanh Cung",
    "author": "Vinhtantran",
    "url": "https://commons.wikimedia.org/wiki/File:Cung_Truong_Sanh.jpg",
    "image": "photo:truong-sanh-cung",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Cung_Truong_Sanh.jpg/1280px-Cung_Truong_Sanh.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "ngo-mon": {
    "id": "ngo-mon",
    "title": "Ngọ Môn",
    "author": "Dennis G. Jarvis",
    "url": "https://commons.wikimedia.org/wiki/File:DGJ_1178_-_Ngo_Mon_Gate_(3442074085).jpg",
    "image": "photo:ngo-mon",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg/1280px-DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "cung-dien-tho": {
    "id": "cung-dien-tho",
    "title": "Cung Diên Thọ",
    "author": "Vano111ru",
    "url": "https://commons.wikimedia.org/wiki/File:Di%C3%AAn_Th%E1%BB%8D_palace.jpg",
    "image": "photo:cung-dien-tho",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Di%C3%AAn_Th%E1%BB%8D_palace.jpg/1280px-Di%C3%AAn_Th%E1%BB%8D_palace.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "hien-lam-cac": {
    "id": "hien-lam-cac",
    "title": "Hiển Lâm Các",
    "author": "Bernard Gagnon",
    "url": "https://commons.wikimedia.org/wiki/File:Hien_Lam_Cac_pavilion.jpg",
    "image": "photo:hien-lam-cac",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Hien_Lam_Cac_pavilion.jpg/1280px-Hien_Lam_Cac_pavilion.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "ky-dai": {
    "id": "ky-dai",
    "title": "Kỳ Đài",
    "author": "Chainwit.",
    "url": "https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg",
    "image": "photo:ky-dai",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Hu%E1%BA%BF_%282024%29_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg/1280px-Hu%E1%BA%BF_%282024%29_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "the-mieu": {
    "id": "the-mieu",
    "title": "Thế Miếu",
    "author": "Jorge Cancela",
    "url": "https://commons.wikimedia.org/wiki/File:Inside_The_Mieu_Temple,_Hue_20130810.jpg",
    "image": "photo:the-mieu",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Inside_The_Mieu_Temple%2C_Hue_20130810.jpg/1280px-Inside_The_Mieu_Temple%2C_Hue_20130810.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "dien-can-chanh": {
    "id": "dien-can-chanh",
    "title": "Nền điện Cần Chánh (2015)",
    "author": "Doãn Hiệu (thảo luận)",
    "url": "https://commons.wikimedia.org/wiki/File:N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg",
    "image": "photo:dien-can-chanh",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg/1280px-N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    "changes": "Resized and JPEG-optimized for the demo; no content edits.",
    "note": {
      "vi": "Nền điện Cần Chánh — ảnh tư liệu năm 2015.",
      "en": "Can Chanh Palace foundation — archival photo from 2015.",
      "cn": "勤政殿基址，2015年资料照片。",
      "pt": "Fundações do Palácio Can Chanh — fotografia de arquivo de 2015.",
      "ja": "勤政殿の基壇・2015年の記録写真。"
    }
  },
  "dien-thai-hoa": {
    "id": "dien-thai-hoa",
    "title": "Điện Thái Hòa",
    "author": "Bernard Gagnon",
    "url": "https://commons.wikimedia.org/wiki/File:Thai_Hoa_palace.jpg",
    "image": "photo:dien-thai-hoa",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Thai_Hoa_palace.jpg/1280px-Thai_Hoa_palace.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  }
}
```


## apps/web/src/services/placeImages.ts

```ts
/** FILE NÀY LÀM GÌ: Đổi mã ảnh dùng chung thành URL asset web; giữ URL API thật. */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'
export function resolvePlaceImage(uri?: string): string | undefined {
  if (!uri) return undefined
  if (!uri.startsWith('photo:')) return uri
  const id = uri.slice(6)
  return PLACE_PHOTOS[id] ? '/images/places/' + id + '.jpg' : undefined
}
```


## apps/mobile/src/services/placeImages.ts

```ts
/** FILE NÀY LÀM GÌ: Đổi mã photo:ID thành JPG Metro đóng gói để native có ảnh khi mất mạng. */
import type { ImageSourcePropType } from 'react-native'
import photo0 from '../../assets/places/truong-sanh-cung.jpg'
import photo1 from '../../assets/places/ngo-mon.jpg'
import photo2 from '../../assets/places/cung-dien-tho.jpg'
import photo3 from '../../assets/places/hien-lam-cac.jpg'
import photo4 from '../../assets/places/ky-dai.jpg'
import photo5 from '../../assets/places/the-mieu.jpg'
import photo6 from '../../assets/places/dien-can-chanh.jpg'
import photo7 from '../../assets/places/dien-thai-hoa.jpg'
const assets: Record<string, number> = { 'truong-sanh-cung': photo0, 'ngo-mon': photo1, 'cung-dien-tho': photo2, 'hien-lam-cac': photo3, 'ky-dai': photo4, 'the-mieu': photo5, 'dien-can-chanh': photo6, 'dien-thai-hoa': photo7 }
export function resolvePlaceImage(uri?: string): ImageSourcePropType | undefined {
  if (!uri) return undefined
  if (!uri.startsWith('photo:')) return { uri }
  return assets[uri.slice(6)]
}
```


## apps/web/src/styles/player.css

```css
/* FILE NÀY LÀM GÌ: Giao diện nghe web và các nút có cùng phong cách.
 * main.tsx nạp sau CSS chung; responsive và tôn trọng giảm chuyển động. */
.audio-shell { margin-bottom: 22px; }
.audio-player {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 190px;
  align-items: center;
  gap: 24px;
  padding: 24px;
  color: #fff;
  border-radius: 24px;
  background: linear-gradient(115deg, #102950 0%, #173e70 100%);
  box-shadow: 0 14px 34px #1029501a;
}
.audio-artwork { width: 96px; height: 96px; border-radius: 18px; overflow: hidden; background: #294264; }
.audio-artwork .place-image { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.audio-artwork .placeholder { font-size: 10px; padding: 8px; color: #bed0e9; }
.audio-content { min-width: 0; }
.audio-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.audio-eyebrow { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; color: #bed0e9; }
.audio-eyebrow svg { width: 15px; height: 15px; }
.audio-language { color: #dae8fb; background: #ffffff12; padding: 3px 9px; border-radius: 7px; font-size: 10px; white-space: nowrap; }
.audio-title { display: block; font-size: 20px; font-weight: 700; color: #fff; line-height: 1.45; overflow-wrap: anywhere; }
.audio-title:hover { color: #b4dcff; }
.audio-status { display: inline-flex; align-items: center; gap: 6px; color: #bed0e9; font-size: 11px; margin-top: 4px; }
.audio-status > span { width: 5px; height: 5px; border-radius: 50%; background: #aebfd6; }
.audio-status.is-playing > span { background: #6de7b3; }
.audio-timeline { margin-top: 12px; }
.audio-timeline input[type="range"] { display: block; appearance: none; width: 100%; height: 5px; border: 0; border-radius: 10px; cursor: pointer; padding: 0; margin: 8px 0; }
.audio-timeline input::-webkit-slider-thumb { appearance: none; width: 13px; height: 13px; border: 2px solid #fff; border-radius: 50%; background: #fff; box-shadow: 0 0 0 4px #ffffff12; }
.audio-timeline input::-moz-range-thumb { width: 11px; height: 11px; border: 2px solid #fff; border-radius: 50%; background: #fff; }
.audio-times { display: flex; justify-content: space-between; color: #bed0e9; font-size: 10px; font-variant-numeric: tabular-nums; }
.audio-controls { display: flex; flex-direction: column; gap: 12px; align-items: center; }
.audio-transport { display: flex; align-items: center; gap: 14px; }
.audio-transport button { padding: 0; border: 0; border-radius: 50%; flex-shrink: 0; }
.audio-transport .audio-skip { width: 40px; min-height: 40px; height: 40px; background: #ffffff12; color: #fff; box-shadow: none; }
.audio-skip svg { width: 24px; height: 24px; }
.audio-transport .audio-play { width: 58px; min-height: 58px; height: 58px; color: #102950; background: #fff; box-shadow: 0 6px 18px #0002; }
.audio-play svg { width: 27px; height: 27px; }
.audio-transport .audio-play:hover { background: #e6f2ff; color: #102950; }
.audio-rate { display: flex; align-items: center; gap: 10px; color: #bed0e9; font-size: 11px; }
.audio-rate select { padding: 4px 8px; min-height: 30px; background: #ffffff12; border: 1px solid #ffffff18; color: #fff; border-radius: 8px; font-size: 11px; }
.audio-rate select option { color: #102950; background: #fff; }
.resume-card { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 18px 20px; box-shadow: 0 5px 20px #10295006; }
.resume-card strong { font-size: 14px; }
.resume-card p { max-width: 550px; color: var(--muted); font-size: 12px; margin-top: 5px; }
.resume-symbol { width: 42px; height: 42px; border-radius: 14px; background: var(--soft); color: var(--primary); display: grid; place-items: center; }
.resume-symbol svg { width: 22px; height: 22px; }
.resume-actions { margin-left: auto; display: flex; flex-wrap: wrap; gap: 8px; }
.resume-actions svg { width: 16px; height: 16px; }
.audio-error { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; border: 1px solid #f5c6bd; color: #922d22; background: #fff6f3; border-radius: 14px; padding: 12px 16px; margin-bottom: 10px; font-size: 13px; }
.audio-loading { display: flex; align-items: center; gap: 9px; padding: 12px 4px; color: var(--muted); font-size: 13px; }
.loading-dot { width: 7px; height: 7px; background: var(--primary); border-radius: 50%; animation: audio-pulse 1s ease-in-out infinite alternate; }
.listen-button { border-radius: 13px; padding: 12px 20px; min-height: 46px; box-shadow: 0 5px 14px #1667e822; font-weight: 600; }
.listen-button svg { width: 18px; height: 18px; }
.detail-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 20px 0; }
.detail-actions .button svg { width: 18px; height: 18px; }
.photo-caption { font-size: 12px; color: var(--muted); font-style: italic; }
.leaflet-marker-icon button { min-height: 30px; box-shadow: none; }
@keyframes audio-pulse { to { opacity: .35; } }
@media (max-width: 760px) {
  .audio-player { grid-template-columns: 72px minmax(0, 1fr); gap: 16px; padding: 18px; border-radius: 20px; }
  .audio-artwork { width: 72px; height: 72px; border-radius: 14px; }
  .audio-controls { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; gap: 10px; }
  .audio-title { font-size: 18px; }
  .audio-topline { gap: 6px; }
  .audio-eyebrow { font-size: 10px; }
  .audio-transport { gap: 12px; }
  .resume-actions { margin-left: 0; }
}
@media (max-width: 400px) {
  .audio-player { padding: 14px; gap: 12px; grid-template-columns: 56px minmax(0, 1fr); }
  .audio-artwork { width: 56px; height: 56px; }
  .audio-title { font-size: 16px; }
  .audio-topline { flex-wrap: wrap; }
  .audio-transport { gap: 8px; }
  .audio-transport .audio-play { width: 50px; min-height: 50px; height: 50px; }
  .audio-rate { flex-direction: column; gap: 3px; }
}
@media (prefers-reduced-motion: reduce) { .loading-dot { animation: none; } }
```


## scripts/start-public-demo.cjs

```js
/**
 * FILE NÀY LÀM GÌ: Mở Vite/tunnel HTTPS và chỉ công bố QR đã kiểm tra được.
 * npm run demo:public gọi; phụ thuộc cloudflared và create-public-qr.cjs.
 * UC05: QR chung mở website, không yêu cầu Expo Go/tài khoản du khách.
 */
const fs = require('node:fs')
const https = require('node:https')
const { Resolver } = require('node:dns')
const path = require('node:path')
const { createRequire } = require('node:module')
const { spawn, spawnSync } = require('node:child_process')
const { setTimeout: delay } = require('node:timers/promises')

const root = path.resolve(__dirname, '..')
const folder = path.join(root, '.qr-output')
const stateFile = path.join(folder, 'demo-session.json')
const local = 'http://127.0.0.1:4173'
// CHỨC NĂNG: QR chỉ phục vụ bản đã build, không đưa hàng trăm module dev qua tunnel.
const isBuiltGuidePage = text => typeof text === 'string' && /<title>HueGuide<\/title>/.test(text) && /id=["']root["']/.test(text) && /src=["']\/assets\/[^"']+\.js["']/.test(text) && !text.includes('/@vite/client')
const builtEntry = text => isBuiltGuidePage(text) ? text.match(/src=["'](\/assets\/[^"']+\.js)["']/)?.[1] : null
// CHỨC NĂNG: Kiểm tra đúng file sau khi sắp xếp services; test bắt đường dẫn cũ.
const GUIDE_MODULE_PATH = '/src/services/platform.ts'
const isGuideModule = text => typeof text === 'string' && !/<html|<!doctype/i.test(text) && text.includes('publicSiteOrigin') && text.includes('siteOrigin')
const isGuidePage = text => typeof text === 'string' && /id=["']root["']/.test(text) && text.includes('/src/main.tsx')

// CHỨC NĂNG: Tên miền tunnel mới có thể bị cache DNS âm trên Windows.
// XỬ LÝ: Chỉ lần kiểm tra HTTPS thử DNS công khai khi ENOTFOUND;
// không đổi DNS của máy, không bỏ kiểm tra chứng chỉ TLS hoặc hostname.
function readWithPublicDns(url) {
  return new Promise(resolve => {
    const dns = new Resolver({ timeout: 1500, tries: 2 })
    dns.setServers(['1.1.1.1', '8.8.8.8'])
    const request = https.get(url, { lookup(hostname, options, callback) {
      dns.resolve4(hostname, (error, addresses) => {
        if (error || !addresses?.length) { callback(error || new Error('No public DNS record')); return }
        if (options.all) callback(null, addresses.map(address => ({ address, family: 4 })))
        else callback(null, addresses[0], 4)
      })
    } }, response => {
      if (response.statusCode !== 200) { response.resume(); resolve(null); return }
      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => resolve(body))
      response.on('error', () => resolve(null))
    })
    request.setTimeout(5000, () => { request.destroy(); resolve(null) })
    request.on('error', () => resolve(null))
  })
}
async function read(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok && process.env.QR_DEBUG) console.log('HTTP', response.status, url)
    return response.ok ? await response.text() : null
  } catch (error) { if (error.cause?.code === 'ENOTFOUND' && new URL(url).hostname.endsWith('.trycloudflare.com')) return readWithPublicDns(url); if (process.env.QR_DEBUG) console.log('NETWORK', url, error.cause?.code || error.message); return null }
}
// CHỨC NĂNG: Kiểm tra HTML production và bundle JS thật, không nhận HTML fallback.
// XỬ LÝ: So tên asset với dist hiện tại để không tái dùng server đang giữ bản cũ.
async function probe(origin, configured = false) {
  const page = await read(origin + '/')
  const entry = builtEntry(page)
  const expected = fs.existsSync(path.join(root, 'apps/web/dist/index.html'))
    ? builtEntry(fs.readFileSync(path.join(root, 'apps/web/dist/index.html'), 'utf8')) : null
  if (!entry || entry !== expected) return false
  const bundle = await read(origin + entry)
  if (!bundle || /<html|<!doctype/i.test(bundle.slice(0, 100))) return false
  if (!configured) return true
  try { const config = JSON.parse(await read(origin + '/visitor-config.json')); return config?.publicSiteOrigin === origin }
  catch { return false }
}
// CHỨC NĂNG: Giữ server/tunnel chạy nền khi lệnh tạo QR hoàn tất.
// XỬ LÝ: Ẩn cửa sổ phụ; chỉ dọn tiến trình do lần gọi này tạo khi thất bại.
function launch(command, args, cwd, name) {
  const log = path.join(folder, name + '-' + Date.now() + '.log')
  const descriptor = fs.openSync(log, 'a')
  try {
    const child = spawn(command, args, { cwd, detached: true, windowsHide: true, stdio: ['ignore', descriptor, descriptor] })
    child.unref()
    return { child, log }
  } finally { fs.closeSync(descriptor) }
}
function configureQr(origin) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/create-public-qr.cjs'), '--url', origin, '--configure'],
    { cwd: root, encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) throw new Error(result.stderr || 'Không tạo được QR')
  process.stdout.write(result.stdout)
}
function publish(state) {
  fs.writeFileSync(stateFile, JSON.stringify({ ...state, verifiedAt: new Date().toISOString() }, null, 2))
  fs.writeFileSync(path.join(folder, 'HUONG-DAN.txt'),
    'QR chung: shared-qr.png\nURL: ' + state.origin + '/\n\nĐây là URL demo tạm thời. Máy tính và tunnel phải đang chạy, có Internet.\nNếu QR cũ không mở được: chạy npm run demo:public tại gốc dự án, rồi dùng ảnh QR mới.\nMuốn dùng một URL lâu dài cần triển khai web/tên miền cố định.\n')
  fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR vào Kinh thành Huế</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f1f5fb;color:#102950;margin:0;padding:32px 16px;text-align:center}main{max-width:520px;margin:auto;background:white;border-radius:24px;padding:28px;box-shadow:0 16px 60px #10295012}img{width:min(100%,360px)}a{color:#075ed4;overflow-wrap:anywhere}p{color:#576886}</style><main><h1>Khám phá Kinh thành Huế</h1><p>Quét bằng camera điện thoại. Không cần Expo Go.</p><img src="shared-qr.png" alt="QR chung vào website"><p><a href="${state.origin}/">${state.origin}/</a></p><p>Máy tính và tunnel cần đang chạy. QR hết phiên: chạy lại <code>npm run demo:public</code> và dùng ảnh mới.</p></main></html>`)
  console.log('SẴN SÀNG — đã kiểm tra HTTPS:', state.origin + '/')
  console.log('Ảnh QR:', path.join(folder, 'shared-qr.png'))
  console.log('Xem QR:', path.join(folder, 'index.html'))
}
async function main() {
  fs.mkdirSync(folder, { recursive: true })
  const web = path.join(root, 'apps/web')
  const webRequire = createRequire(path.join(web, 'package.json'))
  const vite = path.join(path.dirname(webRequire.resolve('vite/package.json')), 'bin/vite.js')
  // CHỨC NĂNG: Build trước khi mở QR để trình duyệt tải bundle đã nén/gộp.
  // XỬ LÝ: Không tắt hay thay server dev 5173 của người dùng; preview riêng ở 4173.
  console.log('Đang đóng gói website cho điện thoại...')
  const build = spawnSync(process.execPath, [vite, 'build'], { cwd: web, encoding: 'utf8', windowsHide: true })
  if (build.status !== 0) throw new Error(build.stderr || build.stdout || 'Build web thất bại')
  let webProcess, tunnelProcess
  try {
    if (!await probe(local)) {
      if (await read(local + '/')) throw new Error('Cổng 4173 đang chạy ứng dụng khác; không tự tắt tiến trình đó.')
      webProcess = launch(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], web, 'preview')
      let ready = false
      for (let i = 0; i < 20; i++) { if (await probe(local)) { ready = true; break }; await delay(500) }
      if (!ready) throw new Error('Không khởi động được preview. Xem ' + webProcess.log)
    }
    // CHỨC NĂNG: Tái dùng URL chỉ khi đúng phiên production vẫn hoạt động.
    if (fs.existsSync(stateFile)) {
      try {
        const previous = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
        if (previous.mode === 'production' && previous.origin && await probe(previous.origin)) {
          configureQr(previous.origin)
          if (await probe(previous.origin, true)) { publish(previous); return }
        }
      } catch { console.log('Phiên cũ không còn dùng được; đang tạo QR mới.') }
    }
    const cloudflared = process.env.CLOUDFLARED_PATH || path.join(root, '.tools/cloudflared.exe')
    if (!fs.existsSync(cloudflared)) throw new Error('Thiếu cloudflared; đặt CLOUDFLARED_PATH trước khi chạy.')
    tunnelProcess = launch(cloudflared, ['tunnel', '--url', local, '--http-host-header', 'localhost', '--protocol', 'http2'], root, 'cloudflared')
    console.log('Đang tạo địa chỉ HTTPS công khai...')
    let origin
    for (let i = 0; i < 60; i++) {
      origin = fs.readFileSync(tunnelProcess.log, 'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0]
      if (origin) break
      await delay(1000)
    }
    if (!origin) throw new Error('Chưa nhận được URL HTTPS. Xem ' + tunnelProcess.log)
    let reachable = false
    for (let i = 0; i < 30; i++) { if (await probe(origin)) { reachable = true; break }; await delay(1000) }
    if (!reachable) throw new Error('Website HTTPS chưa truy cập được; chưa tạo QR mới. Xem ' + tunnelProcess.log)
    // CHỨC NĂNG: Chỉ tạo ảnh QR sau khi chính website HTTPS đã vượt kiểm tra.
    configureQr(origin)
    let configured = false
    for (let i = 0; i < 20; i++) { if (await probe(origin, true)) { configured = true; break }; await delay(1000) }
    if (!configured) throw new Error('Website đã mở nhưng cấu hình URL chưa cập nhật. Chạy lại npm run demo:public.')
    publish({ origin, mode: 'production', localOrigin: local, webPid: webProcess?.child.pid, tunnelPid: tunnelProcess.child.pid,
      webLog: webProcess?.log, tunnelLog: tunnelProcess.log, startedAt: new Date().toISOString() })
  } catch (error) { tunnelProcess?.child.kill(); webProcess?.child.kill(); throw error }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { GUIDE_MODULE_PATH, isGuideModule, isGuidePage, isBuiltGuidePage, builtEntry }
```


## scripts/create-public-qr.cjs

```js
/**
 * FILE NÀY LÀM GÌ: Tạo QR website HTTPS dùng chung cho mọi thiết bị.
 * npm run qr:create gọi; dùng qrcode đã có trong apps/web, không thêm thư viện.
 * --configure cập nhật đúng một biến URL trong .env mobile và .env.local web.
 * Liên quan UC05; file ảnh và bản sao cấu hình chỉ nằm trong .qr-output đã ignore.
 */
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')

// CHỨC NĂNG: Chỉ tạo QR HTTPs website, tuyệt đối không tạo QR Expo.
// XỬ LÝ: Từ chối localhost, tài khoản, query và đường dẫn riêng của địa điểm.
function sharedEntryUrl(raw) {
  const url = new URL(raw)
  if (url.protocol !== 'https:' || url.username || url.password || url.search
    || url.hash || url.pathname !== '/' || url.hostname === 'localhost'
    || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.example')
    || url.hostname.startsWith('127.') || url.hostname === '[::1]') {
    throw new Error('QR công khai phải chứa origin HTTPS thật, không dùng exp:// hoặc localhost')
  }
  return url.origin + '/'
}

// CHỨC NĂNG: Thay đúng biến URL, giữ nguyên cấu hình khác của người dùng.
// XỬ LÝ: Bỏ dòng trùng khóa và tạo bản sao trước khi ghi file .env đã có.
function setVariable(file, key, value, backup) {
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  const lines = (previous || '').split(/\r?\n/).filter((line) => !new RegExp('^\\s*' + key + '\\s*=').test(line))
  if (previous !== null) fs.writeFileSync(backup, previous)
  fs.writeFileSync(file, lines.join('\n').trimEnd() + '\n' + key + '=' + value + '\n')
}

async function main(args) {
  const index = args.indexOf('--url')
  const href = sharedEntryUrl(index >= 0 ? args[index + 1] : '')
  const root = path.resolve(__dirname, '..')
  const folder = path.join(root, '.qr-output')
  const webRequire = createRequire(path.join(root, 'apps/web/package.json'))
  const QRCode = webRequire('qrcode')
  fs.mkdirSync(folder, { recursive: true })

  if (args.includes('--configure')) {
    // CHỨC NĂNG: Web đọc URL QR ở runtime, không chờ Vite nạp lại .env.
    // XỬ LÝ: URL public không phải bí mật; điện thoại mở HTTPS dùng chính origin đang mở.
    fs.mkdirSync(path.join(root, 'apps/web/static'), { recursive: true })
    fs.writeFileSync(path.join(root, 'apps/web/static/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    // CHỨC NĂNG: Đồng bộ URL runtime cho preview đã build và localhost dev.
    // XỬ LÝ: Không rebuild thêm chỉ để thay origin; hai bản luôn tạo cùng QR.
    if (fs.existsSync(path.join(root, 'apps/web/dist'))) {
      fs.writeFileSync(path.join(root, 'apps/web/dist/visitor-config.json'), JSON.stringify({ publicSiteOrigin: new URL(href).origin }))
    }
    const stamp = Date.now()
    setVariable(path.join(root, 'apps/web/.env.local'), 'VITE_PUBLIC_SITE_URL', new URL(href).origin,
      path.join(folder, 'web-env-before-' + stamp + '.txt'))
    setVariable(path.join(root, 'apps/mobile/.env'), 'EXPO_PUBLIC_VISITOR_WEB_ORIGIN', new URL(href).origin,
      path.join(folder, 'mobile-env-before-' + stamp + '.txt'))
  }

  // CHỨC NĂNG: Xuất ảnh QR chứa cùng URL đang cấu hình trên mobile/web.
  // XỬ LÝ: Người nhận quét PNG bằng camera thường; không phải đăng nhập Expo.
  const png = path.join(folder, 'shared-qr.png')
  await QRCode.toFile(png, href, { width: 640, margin: 4, errorCorrectionLevel: 'M' })
  fs.writeFileSync(path.join(folder, 'shared-url.txt'), href + '\n')
  console.log('Website:', href)
  console.log('QR:', png)
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
module.exports = { sharedEntryUrl, setVariable }
```


## scripts/public-qr.test.cjs

```js
/**
 * FILE NÀY LÀM GÌ: Kiểm tra QR công khai không chứa link Expo và giữ biến .env khác.
 * npm test gọi; phụ thuộc Node test và create-public-qr.cjs. Liên quan UC05.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { sharedEntryUrl, setVariable } = require('./create-public-qr.cjs')

test('QR chung luôn là website HTTPS, không phải QR Expo', () => {
  assert.equal(sharedEntryUrl('https://guide.test'), 'https://guide.test/')
  for (const value of ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.20',
    'https://localhost', 'https://guide.test/places/ngo-mon', 'https://hue-guide.example']) {
    assert.throws(() => sharedEntryUrl(value))
  }
})

test('Cập nhật URL không xóa biến khác và có bản sao cấu hình', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'visitor-qr-'))
  const file = path.join(folder, '.env')
  const backup = path.join(folder, 'before.txt')
  try {
    const original = 'OTHER_SETTING=keep\nVITE_PUBLIC_SITE_URL=https://old.test\n'
    fs.writeFileSync(file, original)
    setVariable(file, 'VITE_PUBLIC_SITE_URL', 'https://new.test', backup)
    assert.equal(fs.readFileSync(backup, 'utf8'), original)
    const next = fs.readFileSync(file, 'utf8')
    assert.ok(next.includes('OTHER_SETTING=keep'))
    assert.equal(next.match(/VITE_PUBLIC_SITE_URL=/g).length, 1)
    assert.ok(next.includes('VITE_PUBLIC_SITE_URL=https://new.test'))
  } finally {
    for (const name of [file, backup]) fs.rmSync(name, { force: true })
    fs.rmdirSync(folder)
  }
})

// CHỨC NĂNG: Bắt lỗi đường dẫn probe cũ sau khi di chuyển file vào services.
test('QR probe trỏ tới service hiện có, không phải src/platform.ts đã bỏ', () => {
  const { GUIDE_MODULE_PATH } = require('./start-public-demo.cjs')
  assert.equal(GUIDE_MODULE_PATH, '/src/services/platform.ts')
  assert.ok(fs.existsSync(path.join(__dirname, '../apps/web', GUIDE_MODULE_PATH)))
})
// CHỨC NĂNG: Vite trả HTML fallback không được coi là JS module hợp lệ.
test('QR probe phân biệt đúng ứng dụng và HTML fallback', () => {
  const { isGuideModule, isGuidePage } = require('./start-public-demo.cjs')
  assert.equal(isGuideModule('export const publicSiteOrigin = siteOrigin(value)'), true)
  assert.equal(isGuideModule('<html>publicSiteOrigin siteOrigin</html>'), false)
  assert.equal(isGuidePage('<div id="root"></div><script src="/src/main.tsx"></script>'), true)
  assert.equal(isGuidePage('<html>Other application</html>'), false)
})

// CHỨC NĂNG: Không đưa bản dev hoặc HTML giả qua QR công khai.
test('QR công khai nhận production bundle và loại dev/HTML fallback', () => {
  const { isBuiltGuidePage, builtEntry } = require('./start-public-demo.cjs')
  const html = '<title>HueGuide</title><div id="root"></div><script type="module" src="/assets/index-abc123.js"></script>'
  assert.equal(isBuiltGuidePage(html), true)
  assert.equal(builtEntry(html), '/assets/index-abc123.js')
  assert.equal(isBuiltGuidePage('<title>HueGuide</title><div id="root"></div><script src="/src/main.tsx"></script>'), false)
  assert.equal(isBuiltGuidePage(html + '<script src="/@vite/client"></script>'), false)
  assert.equal(builtEntry('<html>fallback</html>'), null)
})
```


## apps/web/src/styles/journey.css

```css
/* FILE NÀY LÀM GÌ: Giao diện bản đồ, thẻ điểm và thứ tự tham quan.
 * JourneyPage nạp; dùng CSS variables từ ui-tokens. UC06–UC11.
 * CHỨC NĂNG: Tách liên kết chi tiết, nút định vị và nguồn; đủ vùng bấm cho cảm ứng.
 * XỬ LÝ: Grid co giãn, min-width:0 và wrap để tên dài không tràn màn hình. */
.journey-page { padding: 28px; }
.journey-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; margin-bottom:20px; }
.journey-heading h1 { margin:0 0 8px; font-size:28px; line-height:1.35; }
.journey-heading p { max-width:720px; margin:0; color:var(--muted); }
.journey-heading > button { flex-shrink:0; }
.journey-page svg { width:19px; height:19px; flex-shrink:0; }
.journey-map { border:1px solid var(--border); border-radius:20px; overflow:hidden; scroll-margin-top:20px; }
.journey-map:focus-visible { outline:3px solid var(--primary); outline-offset:3px; }
.journey-section { margin-top:32px; }
.journey-section-heading { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
.journey-section-heading h2 { font-size:23px; line-height:1.4; margin:0; }
.journey-count { background:#edf4ff; color:var(--primary); border-radius:20px; min-width:32px; padding:3px 10px; text-align:center; font-weight:700; }
.journey-places { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); list-style:none; padding:0; margin:0; gap:16px; }
.journey-place { min-width:0; border:1px solid var(--border); border-radius:18px; background:var(--white); transition:border-color .15s,box-shadow .15s; overflow:hidden; }
.journey-place:hover { border-color:var(--primary); box-shadow:0 6px 20px #12396a0c; }
.journey-place.is-selected { border-color:var(--primary); box-shadow:0 0 0 2px #1667e81c; }
.journey-place-open { display:flex; gap:16px; padding:16px; color:var(--text); align-items:center; }
.journey-place-open .place-image { width:106px; height:100px; border-radius:12px; flex-shrink:0; object-fit:cover; }
.journey-place-copy { min-width:0; }
.journey-category { font-size:12px; font-weight:600; color:var(--primary); }
.journey-place h3 { margin:6px 0 10px; font-size:18px; line-height:1.4; overflow-wrap:anywhere; }
.journey-open-label { display:inline-flex; gap:6px; align-items:center; color:var(--primary); font-size:13px; font-weight:600; }
.journey-open-label svg { width:16px; height:16px; }
.journey-place-tools { border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:10px 16px; background:#f8faff; }
.journey-place-tools button { min-height:40px; font-size:13px; padding:7px 12px; }
.journey-source { font-size:12px; color:var(--muted); }
.journey-source summary { cursor:pointer; padding:8px 0; }
.journey-source a { display:block; padding:6px 0; }
.journey-route { padding:22px; border:1px solid var(--border); border-radius:18px; background:linear-gradient(115deg,#f0f6ff,var(--white)); margin-bottom:14px; }
.journey-route.is-selected { border-color:var(--primary); }
.journey-route-intro { display:flex; gap:14px; align-items:flex-start; }
.journey-route-icon { display:grid; place-items:center; width:42px; height:42px; flex-shrink:0; background:#dfebff; color:var(--primary); border-radius:13px; }
.journey-route h3 { margin:0; font-size:18px; line-height:1.5; }
.journey-route p { margin:6px 0 0; color:var(--muted); }
.journey-route-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:18px; }
.journey-route-actions button { min-height:44px; border-radius:12px; }
.journey-stops { list-style:none; padding:0; margin:22px 0 0; display:grid; gap:10px; }
.journey-stops li { display:flex; align-items:center; gap:12px; min-width:0; }
.journey-step { width:28px; height:28px; border-radius:50%; display:grid; place-items:center; flex-shrink:0; background:var(--primary); color:white; font-weight:700; }
.journey-stops a { flex:1; display:flex; align-items:center; gap:12px; padding:10px; min-width:0; border:1px solid var(--border); border-radius:12px; background:var(--white); color:var(--text); font-weight:600; }
.journey-stops a:hover { border-color:var(--primary); }
.journey-stops .place-image { width:56px; height:48px; border-radius:8px; object-fit:cover; flex-shrink:0; }
.journey-stops a > span { flex:1; overflow-wrap:anywhere; }
.journey-footnote,.journey-notice { font-size:13px; color:var(--muted); background:#f5f8fd; padding:12px 16px; border-radius:12px; }
@media(max-width:760px) { .journey-page{padding:18px;} .journey-heading{flex-direction:column;gap:14px;} .journey-places{grid-template-columns:minmax(0,1fr);} .journey-heading h1{font-size:24px;} .journey-section-heading h2{font-size:21px;} .journey-route{padding:16px;} }
@media(max-width:400px) { .journey-place-open{gap:12px;padding:12px;} .journey-place-open .place-image{width:84px;height:90px;} .journey-place h3{font-size:17px;} .journey-route-actions{flex-direction:column;} }
/* CÁCH KIỂM TRA: 390/768/1280px không có cuộn ngang; focus bàn phím rõ;
 * Xem thứ tự này và Tự khám phá có khoảng cách, không dính chồng nhau. */
```


## apps/web/src/components/qr.css

```css
/* FILE NÀY LÀM GÌ: Bảo vệ hình vuông và viền trắng của QR.
 * QrImage nạp. UC05: không dùng object-fit:cover như ảnh địa điểm.
 * CHỨC NĂNG: Mã đen/trắng, vùng bấm tách rõ, không tràn màn hình hẹp. */
.qr-scan-panel { text-align:center; }
.qr-frame { width:min(100%,360px); margin:20px auto; background:#fff; border:1px solid #e1e8f2; border-radius:16px; padding:8px; }
.qr-code-image { display:block; width:100%; height:auto; aspect-ratio:1; object-fit:contain; background:#fff; image-rendering:pixelated; border-radius:0; }
.qr-actions { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin:18px 0; }
.qr-actions .button,.qr-actions button { min-height:44px; }
.qr-scan-hint { max-width:520px; margin:16px auto!important; color:var(--muted); }
.qr-url { overflow-wrap:anywhere; font-size:13px; }
.qr-session-note { font-size:12px; color:var(--muted); padding:12px; background:#f4f7fc; border-radius:12px; }
```


## packages/visitor-core/src/qr-messages.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Nhãn hướng dẫn quét và tải QR cho đủ năm ngôn ngữ.
 * messages.ts ghép vào i18n; QrImage dùng, liên quan UC05.
 */
import type { Language } from './model'
type QrText = { qrRefresh: string; qrDownload: string; qrScanHint: string; qrTemporary: string }
export const qrMessages: Record<Language, QrText> = {
  vi: { qrRefresh: 'Cập nhật mã QR', qrDownload: 'Tải ảnh QR', qrScanHint: 'Mở camera trên điện thoại khác, hướng vào toàn bộ mã và chạm thông báo đường dẫn. Nếu QR đang nằm trên chính điện thoại này, bấm Mở website bên dưới.', qrTemporary: 'Link demo cần máy tính và tunnel đang chạy. Khi đổi phiên, hãy cập nhật QR; lần mở đầu phụ thuộc kết nối Internet.' },
  en: { qrRefresh: 'Refresh QR', qrDownload: 'Download QR', qrScanHint: 'Use the camera on another phone, frame the whole code and tap the link notification. If viewing on this phone, use Open website below.', qrTemporary: 'The demo requires the computer and tunnel to remain running. Refresh the QR after a session change; first-load speed depends on your connection.' },
  cn: { qrRefresh: '更新二维码', qrDownload: '下载二维码', qrScanHint: '请用另一部手机的相机对准完整二维码并点击链接通知。如果正在本机查看，请点击下方打开网站。', qrTemporary: '演示需要电脑及隧道保持运行。会话变化后请更新二维码；首次加载速度取决于网络。' },
  pt: { qrRefresh: 'Atualizar QR', qrDownload: 'Descarregar QR', qrScanHint: 'Use a câmara de outro telemóvel, enquadre todo o código e toque na ligação. Se estiver neste telemóvel, use Abrir website abaixo.', qrTemporary: 'A demonstração requer o computador e o túnel ligados. Atualize o QR após mudar de sessão; o primeiro acesso depende da ligação.' },
  ja: { qrRefresh: 'QRを更新', qrDownload: 'QR画像を保存', qrScanHint: '別のスマートフォンのカメラでコード全体を映し、リンク通知をタップしてください。この端末で表示中は下のサイトを開くボタンをご利用ください。', qrTemporary: 'デモにはPCとトンネルの稼働が必要です。セッション変更後はQRを更新してください。初回表示の速さは通信環境に依存します。' },
}
```
