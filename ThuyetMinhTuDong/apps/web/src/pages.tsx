/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị chi tiết địa điểm và trang QR vào chung của hệ thống.
 *
 * Được dùng bởi:
 * - Router trong apps/web/src/App.tsx.
 *
 * Phụ thuộc:
 * - React, React Router và qrcode.
 * - @travelguide/visitor-core.
 * - @travelguide/visitor-core/react.
 * - platform.ts, ui.tsx và Explore.tsx.
 *
 * Liên quan:
 * - UC01: ngôn ngữ.
 * - UC04: xem chi tiết và đọc bài thuyết minh.
 * - UC05: truy cập hệ thống bằng một QR chung.
 *
 * Quy tắc:
 * - QR chỉ xuất hiện tại trang /qr.
 * - Trang chi tiết không tạo hoặc hiển thị QR địa điểm.
 * - QR luôn chứa URL gốc của hệ thống, không chứa ID địa điểm.
 * - GPS tự xác định địa điểm sẽ triển khai sau.
 */

import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import QRCode from 'qrcode'

import {
  availableLanguages,
  LANGUAGES,
  publishedText,
  validPoint,
} from '@travelguide/visitor-core'

import {
  usePublishedPlace,
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

import {
  publicSiteOrigin,
} from './platform'

import {
  PlaceImage,
  State,
} from './ui'

// CHỨC NĂNG: Giữ các trang mà App.tsx đang import.
// XỬ LÝ: HomePage và PlacesPage tiếp tục nằm trong Explore.tsx;
// không viết lại giao diện danh sách trong file này.
export {
  HomePage,
  PlacesPage,
} from './Explore'

// CHỨC NĂNG: Mô tả trạng thái tạo ảnh QR.
// XỬ LÝ:
// - href xác định URL mà kết quả thuộc về.
// - status phân biệt đang tạo, thành công và lỗi.
// - src chứa ảnh QR dạng data URL khi tạo thành công.
type QrImageState = {
  href: string | null
  status: 'loading' | 'ready' | 'error'
  src: string | null
}

// CHỨC NĂNG: Tạo và hiển thị QR vào chung.
// XỬ LÝ:
// - Component chỉ được sử dụng trong QrPage.
// - Không nhận placeId nên không tạo QR theo từng địa điểm.
// - Tạo ảnh ngay trong trình duyệt, không gửi dữ liệu
//   đến một dịch vụ tạo QR bên ngoài.
function QrImage() {
  const t = useText()

  // CHỨC NĂNG: Tạo URL vào chung của hệ thống.
  // XỬ LÝ:
// - publicSiteOrigin đã được kiểm tra trong platform.ts.
// - Ghép "/" để luôn mở trang chủ.
// - Không ghép "/places/:id".
  const href = publicSiteOrigin
    ? publicSiteOrigin + '/'
    : null

  // CHỨC NĂNG: Cho phép người dùng thử lại khi tạo ảnh QR lỗi.
  // XỬ LÝ: Tăng attempt sẽ làm useEffect chạy lại,
  // dù URL không thay đổi.
  const [attempt, setAttempt] =
    useState(0)

  const [state, setState] =
    useState<QrImageState>({
      href: null,
      status: 'loading',
      src: null,
    })

  // CHỨC NĂNG: Tạo lại ảnh khi URL hoặc số lần thử thay đổi.
  // XỬ LÝ:
  // - Thiếu URL thì không tạo QR.
  // - Hiện trạng thái loading trước khi bắt đầu.
  // - Chỉ nhận kết quả khi effect còn hiệu lực.
  useEffect(() => {
    let cancelled = false

    if (!href) {
      return
    }

    setState({
      href,
      status: 'loading',
      src: null,
    })

    QRCode.toDataURL(href, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
      .then((src) => {
        // CHỨC NĂNG: Bỏ kết quả đã hết hiệu lực.
        // XỬ LÝ: Người dùng có thể đã rời trang
        // hoặc URL đã đổi trong lúc tạo ảnh.
        if (cancelled) {
          return
        }

        setState({
          href,
          status: 'ready',
          src,
        })
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setState({
          href,
          status: 'error',
          src: null,
        })
      })

    // CHỨC NĂNG: Dọn effect khi rời trang hoặc thay đổi phụ thuộc.
    // XỬ LÝ: Promise tạo QR không bị hủy trực tiếp,
    // nhưng kết quả cũ sẽ không được dùng để cập nhật giao diện.
    return () => {
      cancelled = true
    }
  }, [href, attempt])

  const title = t('generalQr')

  // CHỨC NĂNG: Chỉ sử dụng trạng thái thuộc đúng URL hiện tại.
  // XỬ LÝ: Khi URL đổi nhưng ảnh mới chưa tạo xong,
  // hiện loading thay vì cho quét ảnh của URL cũ.
  const currentStatus =
    state.href === href
      ? state.status
      : 'loading'

  return (
    <section
      className="qr-panel"
      aria-label={title}
    >
      <h2>{title}</h2>

      <p>{t('noAccount')}</p>

      {!href ? (
        // CHỨC NĂNG: Hướng dẫn cấu hình khi chưa có URL hợp lệ.
        // XỬ LÝ: Không tạo QR chứa localhost hoặc domain ví dụ.
        <State message="qrSetup" />
      ) : currentStatus === 'ready' && state.src ? (
        <img
          src={state.src}
          width={280}
          height={280}
          alt={title}
        />
      ) : currentStatus === 'error' ? (
        <State
          message="loadError"
          retry={() => {
            setAttempt(
              (value) => value + 1,
            )
          }}
        />
      ) : (
        <State
          message="loading"
          busy
        />
      )}

      {/* CHỨC NĂNG: Cho mở trực tiếp URL nếu không tiện quét.
          XỬ LÝ: Link và ảnh QR cùng sử dụng biến href. */}
      {href && (
        <p>
          <a href={href}>
            {href}
          </a>
        </p>
      )}
    </section>
  )
}

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
          Xác định địa điểm tự động bằng GPS sẽ làm sau. */}
    </article>
  )
}

// CHỨC NĂNG: Cung cấp trang hiển thị QR vào chung.
// XỬ LÝ:
// - Chỉ có một URL gốc dùng cho QR.
// - Không nhập hoặc tạo QR theo ID địa điểm.
// - Người dùng quét một lần để vào hệ thống.
// - Việc mở app hay web phụ thuộc cấu hình liên kết của thiết bị.
export function QrPage() {
  const t = useText()

  return (
    <section className="detail">
      <h1>{t('qrAccess')}</h1>

      <p>{t('qrWebHint')}</p>

      <QrImage />

      <Link to="/">
        {t('home')}
      </Link>
    </section>
  )
}