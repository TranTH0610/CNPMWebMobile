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
