/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
 *
 * VỊ TRÍ: apps/web/src/shared/components/TrangThaiDuLieu.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 * - apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 * - apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
 * - apps/web/src/shared/components/BaoVeLoiTrang.tsx
 * - apps/web/src/shared/pages/TrangKhongTimThay.tsx
 *
 * PHỤ THUỘC:
 * - ./BieuTuong
 * - @travelguide/visitor-core
 * - ../../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. State
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Icon } from './BieuTuong'

import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị tải/lỗi/thử lại.
// XỬ LÝ: Không hiện chuỗi lỗi kỹ thuật từ API.

// ==================== [DUNG-CHUNG] State ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
