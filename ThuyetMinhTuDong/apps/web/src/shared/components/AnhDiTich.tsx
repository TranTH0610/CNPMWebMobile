/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
 *
 * VỊ TRÍ: apps/web/src/shared/components/AnhDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * - apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx
 * - apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx
 * - apps/web/src/features/explore/components/TheDiTich.tsx
 * - apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 * - apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - ../services/XuLyAnhDiTich
 * - ../../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceImage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useState } from 'react'
import { resolvePlaceImage } from '../services/XuLyAnhDiTich'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Ảnh có dự phòng.
// XỬ LÝ: Card lazy-load; đổi URL thì thử lại thay vì giữ lỗi cũ.

// ==================== [TAI-NGUYEN] PlaceImage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceImage({
  uri,
  title,
}: {
  uri?: string

  title: string
}) {
  // CHỨC NĂNG: Gắn lỗi với URI đã lỗi, không dùng một cờ chung cho mọi ảnh.
  // TẠI SAO: Ảnh cũ có thể trả onError muộn sau khi người dùng vừa chọn ảnh mới.
  const [failedUri, setFailedUri] = useState<string>()
  const t = useText()

  return uri && failedUri !== uri ? (
    <img
      key={uri}
      className="place-image"
      src={resolvePlaceImage(uri)}
      alt={title}
      onError={() => setFailedUri(uri)}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <div className="place-image placeholder" role="img" aria-label={t('noImage')}>
      <span>▥</span>
      {t('noImage')}
    </div>
  )
}
// TẠI SAO (PlaceImage): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
