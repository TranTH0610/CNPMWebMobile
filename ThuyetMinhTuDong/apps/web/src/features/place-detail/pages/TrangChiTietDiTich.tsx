/**
 * CHỨC NĂNG: [CHI-TIET]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trang chi tiết du khách với ảnh, bài đọc và hai thao tác nghe/bản đồ. AppRoutes gọi; dùng usePublishedPlace, useVisitor và ListenButton hiện có. TẠI SAO: Phần trình bày tách khỏi service; đổi bố cục không đổi nội dung SQL hay bộ phát audio.
 *
 * VỊ TRÍ: apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - react-router-dom
 * - @travelguide/visitor-core
 * - ../../explore/hooks/useDanhSachDiTich
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../../journey/components/NutNgheThuyetMinh
 * - ../../../shared/components/AnhDiTich
 * - ../../../shared/components/TrangThaiDuLieu
 * - ../../../shared/components/BieuTuong
 *
 * CÁC KHỐI CHÍNH:
 * 1. DetailPage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Link, useParams } from 'react-router-dom'
import {
  availableLanguages,
  categoryOf,
  LANGUAGES,
  PLACE_PHOTOS,
  publishedText,
} from '@travelguide/visitor-core'
import { usePublishedPlace } from '../../explore/hooks/useDanhSachDiTich'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { ListenButton } from '../../journey/components/NutNgheThuyetMinh'
import { PlaceImage } from '../../../shared/components/AnhDiTich'
import { State } from '../../../shared/components/TrangThaiDuLieu'
import { Icon } from '../../../shared/components/BieuTuong'
// ==================== [CHI-TIET] DetailPage ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider DetailPage.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function DetailPage() {
  const { id = '' } = useParams()
  const data = usePublishedPlace(id)
  const { language, changeLanguage, saving } = useVisitor()
  const t = useText()
  // CHỨC NĂNG: Giữ trạng thái tải/lỗi và nút thử lại; không truy cập place khi chưa có dữ liệu.
  if (data.loading) return <State message="loading" busy />
  if (data.error || !data.place)
    return (
      <section className="detail">
        <State message={data.error ?? 'notFound'} retry={data.retry} />
        <Link to="/places">{t('back')}</Link>
      </section>
    )
  const place = data.place
  const content = publishedText(place, language)
  const title = content?.title ?? place.canonicalTitle
  const photoNote = PLACE_PHOTOS[place.id]?.note?.[language]
  return (
    <article className="detail detail-redesign">
      <Link className="detail-back" to="/places">
        <span aria-hidden="true">←</span>
        {t('back')}
      </Link>
      {/* CHỨC NĂNG: Ảnh và thông tin chính đứng cạnh nhau trên desktop, xếp dọc trên điện thoại. */}
      <div className="detail-overview">
        <div className="detail-visual">
          <PlaceImage uri={place.images[0]} title={title} />
        </div>
        <div className="detail-intro">
          <span className={'badge badge-' + categoryOf(place)}>
            {t(`category_${categoryOf(place)}`)}
          </span>
          <h1>{title}</h1>
          {place.period && <p className="detail-period">{place.period}</p>}
          {content?.summary && <p className="detail-summary">{content.summary}</p>}
          {content?.address && (
            <p className="detail-address">
              <Icon name="pin" />
              {content.address}
            </p>
          )}
          {/* CHỨC NĂNG: Dùng lại bộ phát và route bản đồ; không tạo audio thứ hai chồng lên bài đang nghe. */}
          <div className="detail-actions">
            <ListenButton id={place.id} />
            <Link
              className="button secondary"
              to={'/journey?placeId=' + encodeURIComponent(place.id)}
            >
              <Icon name="pin" />
              {t('jMap')}
            </Link>
          </div>
          <p className="detail-language-title">{t('available')}</p>
          <div className="language-options" role="group" aria-label={t('language')}>
            {availableLanguages(place).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={language === code}
                disabled={saving}
                onClick={() => {
                  void changeLanguage(code)
                }}
              >
                {LANGUAGES.find((item) => item.code === code)?.label ?? code}
              </button>
            ))}
          </div>
        </div>
      </div>
      {photoNote && <p className="photo-caption">{photoNote}</p>}
      {/* CHỨC NĂNG: Bài đọc có cỡ chữ/khoảng dòng riêng; giữ xuống dòng gốc và không cắt nội dung. */}
      <section className="detail-reading" aria-label={t('read')}>
        <h2>{t('read')}</h2>
        {content ? <p className="narration">{content.body}</p> : <State message="missing" />}
      </section>
    </article>
  )
}
