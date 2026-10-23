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
