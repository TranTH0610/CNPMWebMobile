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
