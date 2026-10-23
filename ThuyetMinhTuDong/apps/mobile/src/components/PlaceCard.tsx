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
