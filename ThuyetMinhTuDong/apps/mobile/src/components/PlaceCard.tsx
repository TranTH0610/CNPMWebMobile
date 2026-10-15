/**
 * FILE NÀY LÀM GÌ:
 * Thẻ địa điểm có hai kiểu: lớn trong carousel và ngang trong danh sách.
 * Home/Search dùng; phụ thuộc Place, i18n, icons và theme.
 * Liên quan UC03, FR-18, FR-41.
 */

import { memo, useEffect, useState } from 'react'
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import type { Place } from '@travelguide/shared-types'
import type { LangCode } from '../i18n'

import {
  colors,
  fonts,
  spacing,
  radii,
  sizes,
  ui,
} from '../theme'

type Props = {
  place: Place
  large?: boolean
  width?: number
  favorite: boolean
  distance?: number
  onOpen: (id: string) => void
  onFavorite: (id: string) => void
}

function PlaceCard({
  place,
  large = false,
  width,
  favorite,
  distance,
  onOpen,
  onFavorite,
}: Props) {
  const { t, i18n } = useTranslation()
  const language = i18n.language as LangCode

  const uri = place.images?.[0]
  const [imageFailed, setImageFailed] = useState(false)

  // CHỨC NĂNG: thử ảnh mới khi URL thay đổi.
  // XỬ LÝ: lỗi URL cũ không làm ảnh mới bị giữ ở placeholder.
  useEffect(() => {
    setImageFailed(false)
  }, [uri])

  // Trong lúc dịch nền, tên còn thiếu dùng tên nguồn để thẻ không trống.
  // Tìm kiếm vẫn chỉ dùng ngôn ngữ đang chọn trong searchPlaces.
  const name = place.name[language] ?? place.name.vi

  const address =
    place.address?.[language] ??
    place.address?.vi ??
    t('explore.addressMissing')

  const imageStyle = large
    ? styles.largeImage
    : styles.smallImage

  const validDistance =
    distance !== undefined &&
    Number.isFinite(distance)

  return (
    <View
      style={[
        ui.card,
        { marginBottom: spacing.md },
        large && { width },
      ]}
    >
      <Pressable
        style={large ? undefined : ui.row}
        onPress={() => onOpen(place.id)}
        accessibilityRole="button"
        accessibilityLabel={t('explore.openPlace', { name })}
      >
        {uri && !imageFailed ? (
          <Image
            source={{ uri }}
            style={imageStyle}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
            accessibilityLabel={name}
          />
        ) : (
          <View style={[imageStyle, styles.placeholder]}>
            <Ionicons
              name="image-outline"
              size={sizes.icon}
              color={colors.muted}
            />
            <Text style={ui.caption}>
              {t('explore.imageMissing')}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.category}>
            {place.category
              ? t(`categories.${place.category}`)
              : t('categories.other')}
          </Text>

          <Text
            style={styles.name}
            numberOfLines={2}
          >
            {name}
          </Text>

          <Text
            style={ui.muted}
            numberOfLines={2}
          >
            {address}
          </Text>

          <View style={styles.metadata}>
            {validDistance && (
              <Text style={ui.caption}>
                {t('explore.distance', {
                  value: (distance / 1000).toFixed(1),
                })}
              </Text>
            )}

            <Text style={ui.caption}>
              {place.rating !== undefined
                ? t('explore.rating', {
                    rating: place.rating.toFixed(1),
                    count: place.reviewCount ?? 0,
                  })
                : t('explore.noRating')}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* CHỨC NĂNG: tim là nút độc lập với nút mở địa điểm.
          XỬ LÝ: không đặt bên trong Pressable mở Detail, tránh bấm
          tim lại đồng thời mở màn chi tiết. */}
      <Pressable
        style={styles.heart}
        onPress={() => onFavorite(place.id)}
        accessibilityRole="button"
        accessibilityState={{ selected: favorite }}
        accessibilityLabel={t(
          favorite
            ? 'explore.removeFavorite'
            : 'explore.addFavorite',
          { name },
        )}
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={sizes.icon}
          color={favorite ? colors.favorite : colors.muted}
        />
      </Pressable>
    </View>
  )
}

// CHỨC NĂNG: tránh render lại thẻ khi props không đổi.
// XỬ LÝ: callback từ màn hình cần ổn định bằng useCallback.
export default memo(PlaceCard)

const styles = StyleSheet.create({
  largeImage: {
    width: '100%',
    height: sizes.heroImage,
  },
  smallImage: {
    width: sizes.thumbnail,
    height: sizes.thumbnail,
    margin: spacing.sm,
    borderRadius: radii.sm,
  },
  placeholder: {
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  info: {
    flex: 1,
    padding: spacing.md,
    paddingRight: sizes.touch + spacing.md,
    gap: spacing.xs,
  },
  category: {
    color: colors.primary,
    fontSize: fonts.caption,
    fontWeight: '600',
  },
  name: {
    color: colors.text,
    fontSize: fonts.body,
    fontWeight: '700',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radii.round,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
})