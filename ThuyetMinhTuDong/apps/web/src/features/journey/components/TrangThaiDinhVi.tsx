/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Thẻ trạng thái định vị trong trang bản đồ, dựa trên dữ liệu thật. JourneyPage gọi; không xin quyền, không bật GPS hoặc phát âm thanh khi render.
 *
 * VỊ TRÍ: apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 * - ../../../../../../packages/ui-tokens/HienThiDinhVi
 * - ../hooks/useHanhTrinh
 * - ../../language/hooks/useDuKhach
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../../shared/components/BieuTuong
 *
 * CÁC KHỐI CHÍNH:
 * 1. GpsStatus
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { publishedText } from '@travelguide/visitor-core'
import { gpsVisual } from '../../../../../../packages/ui-tokens/HienThiDinhVi'
import { useJourney } from '../hooks/useHanhTrinh'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { Icon } from '../../../shared/components/BieuTuong'
// ==================== [DINH-VI] [THUYET-MINH] GpsStatus ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function GpsStatus() {
  const { state } = useJourney(),
    { language } = useVisitor(),
    t = useText()
  const visual = gpsVisual(state)
  const nearby = state.places.find((p) => p.id === state.suggestedId)
  return (
    <div
      className={'gps-status' + (visual.error ? ' is-error' : '')}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Icon name="pin" />
      <div>
        <strong>{t(visual.key)}</strong>
        {nearby && state.gps && (
          <p>{publishedText(nearby, language)?.title ?? nearby.canonicalTitle}</p>
        )}
        {state.status === 'playing' && (
          <p>
            {t('jPlaying')}: {state.session?.title}
          </p>
        )}
        <p>{t('gpsHelp')}</p>
      </div>
    </div>
  )
}
