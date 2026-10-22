/**
 * FILE NÀY LÀM GÌ:
 * Chứa SearchBar, CategoryChips, SortDropdown và PlaceCard.
 * PlacesScreen sử dụng; liên quan UC02–UC04.
 * Phụ thuộc React Native, Ionicons, core và ui-tokens.
 */

import { useEffect, useState } from 'react'

import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import {
  categoryOf,
  categoryIcons,
  distanceTo,
  publishedText,
  type Category,
  type PlaceRecord,
  type Point,
  type SortOrder,
} from '@travelguide/visitor-core'

import {
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

import {
  colors,
  radii,
  spacing,
} from '../../../../packages/ui-tokens/colors'

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
          source={{ uri }}
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