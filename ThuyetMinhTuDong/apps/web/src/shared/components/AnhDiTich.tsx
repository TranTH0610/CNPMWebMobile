/**
 * FILE: apps/web/src/shared/components/AnhDiTich.tsx
 * FILE NÀY LÀM GÌ: Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useState } from 'react'
import { resolvePlaceImage } from '../services/XuLyAnhDiTich'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Ảnh có dự phòng.
// XỬ LÝ: Card lazy-load; đổi URL thì thử lại thay vì giữ lỗi cũ.

// [UC02 / UC04 / UC10 / UC11] PlaceImage — Ảnh có dự phòng.
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
