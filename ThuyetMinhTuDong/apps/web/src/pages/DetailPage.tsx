/**
 * FILE NÀY LÀM GÌ: Trang bài đọc, đổi ngôn ngữ, nghe thuyết minh và mở marker địa điểm.
 * Vị trí: apps/web/src/pages/DetailPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { Link, useParams } from 'react-router-dom'
import { availableLanguages, LANGUAGES, publishedText, validPoint } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { PlaceImage, State, Icon } from '../components/index'

// CHỨC NĂNG: Hiển thị chi tiết địa điểm theo route /places/:id.
// XỬ LÝ:
// - Tải dữ liệu thông qua hook và service.
// - Phân biệt đang tải, lỗi và không tìm thấy.
// - Không tạo QR tại trang chi tiết.
export function DetailPage() {
  const { id = '' } = useParams()

  const data = usePublishedPlace(id)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Hiển thị trạng thái chờ dữ liệu.
  // XỬ LÝ: Chưa đọc place khi request chưa hoàn thành.
  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  // CHỨC NĂNG: Hiển thị lỗi hoặc địa điểm không tồn tại.
  // XỬ LÝ: Có nút thử lại và đường quay về danh sách.
  if (data.error || !data.place) {
    return (
      <section className="detail">
        <State
          message={
            data.error ?? 'notFound'
          }
          retry={data.retry}
        />

        <Link to="/places">
          {t('back')}
        </Link>
      </section>
    )
  }

  const place = data.place

  // CHỨC NĂNG: Lấy bài đọc bằng ngôn ngữ chung của giao diện.
  // XỬ LÝ:
  // - Không giữ lựa chọn ngôn ngữ riêng trong trang chi tiết.
  // - Đổi ngôn ngữ sẽ đổi cả UI và bài đọc.
  // - Thiếu bản công bố thì trả undefined để hiện thông báo.
  const content = publishedText(
    place,
    language,
  )

  const title =
    content?.title
    ?? place.canonicalTitle

  // CHỨC NĂNG: Chỉ liệt kê các bản ngôn ngữ đã công bố.
  // XỬ LÝ: Không cho chọn nội dung nháp hoặc chưa duyệt.
  const languages =
    availableLanguages(place)

  const position = place.position

  // CHỨC NĂNG: Kiểm tra tọa độ trước khi hiển thị.
  // XỬ LÝ: Cần cả trạng thái xác nhận và giá trị tọa độ hợp lệ.
  // Đoạn này không theo dõi GPS và không tự xác định địa điểm.
  const hasVerifiedPosition =
    position?.verified === true
    && validPoint(position)

  return (
    <article className="detail">
      <Link to="/places">
        {t('back')}
      </Link>

      <h1>{title}</h1>

      <PlaceImage
        uri={place.images[0]}
        title={title}
      />

      {PLACE_PHOTOS[place.id]?.note?.[language] && <p className="photo-caption">{PLACE_PHOTOS[place.id].note?.[language]}</p>}
      <div className="detail-actions">
        <ListenButton id={place.id} />
        <Link className="button secondary" to={'/journey?placeId=' + place.id}><Icon name="pin" />{t('jMap')}</Link>
      </div>
      <p>{t('available')}</p>

      <div className="language-options">
        {languages.map((code) => {
          const label = LANGUAGES.find(
            (item) => item.code === code,
          )?.label ?? code

          return (
            <button
              key={code}
              type="button"
              aria-pressed={
                language === code
              }
              disabled={saving}
              onClick={() => {
                // CHỨC NĂNG: Đổi ngôn ngữ toàn website.
                // XỬ LÝ: Provider cập nhật i18n và lưu lựa chọn;
                // không chỉ đổi riêng bài đọc trên trang này.
                void changeLanguage(code)
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {content ? (
        <section>
          <p>{content.address}</p>

          <h2>{t('read')}</h2>

          <p className="narration">
            {content.body}
          </p>

          <p>
            {t('version')}: {content.version}
          </p>
        </section>
      ) : (
        <State message="missing" />
      )}

      <p>
        {hasVerifiedPosition && position
          ? (
            t('coordinates')
            + ': '
            + position.lat
            + ', '
            + position.lng
          )
          : t('unverified')}
      </p>

      {/* CHỨC NĂNG: Chi tiết chỉ hiển thị thông tin địa điểm.
          XỬ LÝ: Không đặt QrImage tại đây.
          GPS được điều phối qua useJourneyNavigation; chi tiết không tự phát audio. */}
    </article>
  )
}
