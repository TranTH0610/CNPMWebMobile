/**
 * FILE NÀY LÀM GÌ: Ảnh bìa mobile có placeholder khi ảnh thiếu hoặc tải lỗi.
 * Vị trí: apps/mobile/src/components/Cover.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { resolvePlaceImage } from '../services/placeImages'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị ảnh co theo khung hoặc placeholder.
// XỬ LÝ: Lỗi gắn với URI để callback ảnh cũ không làm hỏng ảnh mới; thiếu asset cũng hiện placeholder.
export function Cover({
  uri,
  style,
}: {
  uri?: string
  style?: StyleProp<ViewStyle>
}) {
  const [failedUri, setFailedUri] = useState<string>()
  const source = resolvePlaceImage(uri)
  const failed = failedUri === uri
  const t = useText()


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
      {source && !failed ? (
        <Image
          key={uri}
          source={source}
          onError={() => setFailedUri(uri)}
          // CHỨC NĂNG: Ghi đè kích thước gốc mà RN tự thêm cho ảnh đóng gói.
          // XỬ LÝ: absoluteFill chỉ đặt vị trí; width/height 100% buộc ảnh co đúng khung
          // của thumbnail, ảnh hero và ảnh player. Nếu thiếu, chỉ thấy góc trời/tường của JPG.
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
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
