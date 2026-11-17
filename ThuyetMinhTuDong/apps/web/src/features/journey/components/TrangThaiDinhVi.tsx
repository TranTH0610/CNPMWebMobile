/**
 * FILE: apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 * FILE NÀY LÀM GÌ: Thẻ trạng thái định vị trong trang bản đồ, dựa trên dữ liệu thật. JourneyPage gọi; không xin quyền, không bật GPS hoặc phát âm thanh khi render.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC06.1: Xin quyền, lấy và theo dõi vị trí.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { publishedText } from '@travelguide/visitor-core'
import { gpsVisual } from '../../../../../../packages/ui-tokens/HienThiDinhVi'
import { useJourney } from '../hooks/useHanhTrinh'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { Icon } from '../../../shared/components/BieuTuong'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus.
// [UC06 / UC06.1] GpsStatus — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider GpsStatus.
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
        {nearby && state.gps && state.fix && (
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
