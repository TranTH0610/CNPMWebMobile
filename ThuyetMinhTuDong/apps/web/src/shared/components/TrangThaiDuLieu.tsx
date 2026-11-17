/**
 * FILE: apps/web/src/shared/components/TrangThaiDuLieu.tsx
 * FILE NÀY LÀM GÌ: Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Icon } from './BieuTuong'

import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị tải/lỗi/thử lại.
// XỬ LÝ: Không hiện chuỗi lỗi kỹ thuật từ API.

// [HỖ TRỢ CHUNG] State — Hiển thị tải/lỗi/thử lại.
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
    <section className="state" role={busy ? 'status' : retry ? 'alert' : 'status'}>
      {busy ? (
        <div className="skeleton-grid" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div className="skeleton-card" key={item}>
              <div className="skeleton-block skeleton-image" />
              <div className="skeleton-block" />
              <div className="skeleton-block skeleton-short" />
            </div>
          ))}
        </div>
      ) : (
        <Icon name="compass" />
      )}
      <p>{t(message)}</p>
      {retry && <button onClick={retry}>{t('retry')}</button>}
    </section>
  )
}
// TẠI SAO (State): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
