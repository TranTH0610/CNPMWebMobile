/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị thẻ di tích có toàn bộ vùng bấm mở trang chi tiết và phần nghe thuyết minh.
 *
 * VỊ TRÍ: apps/web/src/features/explore/components/TheDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 *
 * PHỤ THUỘC:
 * - ../../../shared/components/BieuTuong
 * - ../../../shared/components/AnhDiTich
 * - react-router-dom
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceCard
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Icon } from '../../../shared/components/BieuTuong'
import { PlaceImage } from '../../../shared/components/AnhDiTich'
import { Link } from 'react-router-dom'
import { categoryOf, publishedText } from '@travelguide/visitor-core'
import type { PlaceRecord } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'

// CHỨC NĂNG: Card địa điểm trong carousel/lưới/danh sách.
// XỬ LÝ: Một Link bao toàn bộ thẻ, nên ảnh, chữ, nhãn và khoảng trống đều mở cùng di tích.
// TẠI SAO: Một liên kết hỗ trợ chạm, bàn phím và mở tab mới; không lồng Link vào nhau.

// ==================== [KHAM-PHA] PlaceCard ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceCard({
  place,
  distance,
}: {
  place: PlaceRecord

  distance?: number
}) {
  const { language } = useVisitor()

  const t = useText()

  const content = publishedText(place, language)
  // Gán title bằng content?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
  const title = content?.title ?? place.canonicalTitle

  return (
    <Link
      className="place-card"
      to={'/places/' + encodeURIComponent(place.id)}
      aria-label={t('jOpenPlace') + ': ' + title}
    >
      <span className="card-photo">
        <PlaceImage uri={place.images[0]} title={title} />
      </span>

      <div className="card-content">
        <h3>{title}</h3>

        <span className={'badge badge-' + categoryOf(place)}>
          {t(`category_${categoryOf(place)}`)}
        </span>

        {/* CHỨC NĂNG: Mô tả ngắn giúp chọn địa điểm trước khi mở chi tiết. */}
        {content?.summary && <p className="card-summary">{content.summary}</p>}
        <p className="card-location">
          <Icon name="pin" />
          {content ? content.address || t('city') : t('missing')}

          {distance !== undefined && <span>{(distance / 1000).toFixed(2)} km</span>}
        </p>
        <span className="card-open">
          {t('details')}
          <Icon name="pin" />
        </span>
      </div>
    </Link>
  )
}
// TẠI SAO (PlaceCard): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
