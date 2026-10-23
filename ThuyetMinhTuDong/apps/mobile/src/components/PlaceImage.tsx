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
