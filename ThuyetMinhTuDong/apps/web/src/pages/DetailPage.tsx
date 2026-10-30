/**
 * FILE NÀY LÀM GÌ
 * Trang chi tiết theo ID trên web: bản nội dung đã công bố, ảnh, chọn ngôn ngữ, nút nghe và bản
 * đồ.
 *
 * VỊ TRÍ: apps/web/src/pages/DetailPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; ../components/ListenButton; react-router-dom;
 * ../hooks/usePlaces; ../i18n/index; ../hooks/useVisitor; ../components/index
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


// Nhập các thành phần từ '../components/ListenButton'.
import { ListenButton } from '../components/ListenButton'
// Nhập các thành phần từ 'react-router-dom'.
import { Link, useParams } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { availableLanguages, LANGUAGES, publishedText, validPoint } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../hooks/usePlaces'.
import { usePublishedPlace } from '../hooks/usePlaces'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../components/index'.
import { PlaceImage, State, Icon } from '../components/index'

// CHỨC NĂNG: Hiển thị chi tiết địa điểm theo route /places/:id.
// XỬ LÝ:
// - Tải dữ liệu thông qua hook và service.
// - Phân biệt đang tải, lỗi và không tìm thấy.
// - Không tạo QR tại trang chi tiết.
// Khai báo DetailPage(). Component hàm nhận props và dựng phần giao diện DetailPage.
export function DetailPage() {
  // Khai báo { id = '' }: Gọi useParams().
  const { id = '' } = useParams()

  // Khai báo data: Gọi usePublishedPlace(id).
  const data = usePublishedPlace(id)

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const {`: Khai báo { language, changeLanguage, saving, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `language,`: Khai báo { language, changeLanguage, saving, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `changeLanguage,`: Khai báo { language, changeLanguage, saving, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `saving,`: Khai báo { language, changeLanguage, saving, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   * DÒNG `} = useVisitor()`: Khai báo { language, changeLanguage, saving, }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
   */
  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // CHỨC NĂNG: Hiển thị trạng thái chờ dữ liệu.
  // XỬ LÝ: Chưa đọc place khi request chưa hoàn thành.
  // Rẽ nhánh nếu data.loading.
  if (data.loading) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
     * DÒNG `<State`: Dựng State.
     * DÒNG `message="loading"`: Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `busy`: Thuộc tính busy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `/>`: Dựng State.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  // CHỨC NĂNG: Hiển thị lỗi hoặc địa điểm không tồn tại.
  // XỬ LÝ: Có nút thử lại và đường quay về danh sách.
  // Rẽ nhánh nếu data.error || !data.place.
  if (data.error || !data.place) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
     * DÒNG `<section className="detail">`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
     * DÒNG `<State`: Dựng State.
     * DÒNG `message={`: Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `data.error ?? 'notFound'`: Đưa biểu thức JavaScript data.error ?? 'notFound' vào JSX.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `retry={data.retry}`: Thuộc tính retry: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `/>`: Dựng State.
     * DÒNG `<Link to="/places">`: Dựng Link. | Đặt đường dẫn mở khi người dùng bấm liên kết.
     * DÒNG `{t('back')}`: Đưa biểu thức JavaScript t('back') vào JSX.
     * DÒNG `</Link>`: Đóng phần giao diện Link.
     * DÒNG `</section>`: Đóng phần giao diện section.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
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

  // Khai báo place: đọc data.place từ đối tượng/mảng để dùng tại bước hiện tại.
  const place = data.place

  // CHỨC NĂNG: Lấy bài đọc bằng ngôn ngữ chung của giao diện.
  // XỬ LÝ:
  // - Không giữ lựa chọn ngôn ngữ riêng trong trang chi tiết.
  // - Đổi ngôn ngữ sẽ đổi cả UI và bài đọc.
  // - Thiếu bản công bố thì trả undefined để hiện thông báo.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const content = publishedText(`: Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
   * DÒNG `place,`: Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
   * DÒNG `language,`: Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const content = publishedText(
    place,
    language,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const title =`: Gán title bằng content?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
   * DÒNG `content?.title`: Gán title bằng content?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
   * DÒNG `?? place.canonicalTitle`: Gán title bằng content?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
   */
  const title =
    content?.title
    ?? place.canonicalTitle

  // CHỨC NĂNG: Chỉ liệt kê các bản ngôn ngữ đã công bố.
  // XỬ LÝ: Không cho chọn nội dung nháp hoặc chưa duyệt.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const languages =`: Khai báo languages: Gọi availableLanguages(place).
   * DÒNG `availableLanguages(place)`: Khai báo languages: Gọi availableLanguages(place).
   */
  const languages =
    availableLanguages(place)

  // Khai báo position: đọc place.position từ đối tượng/mảng để dùng tại bước hiện tại.
  const position = place.position

  // CHỨC NĂNG: Kiểm tra tọa độ trước khi hiển thị.
  // XỬ LÝ: Cần cả trạng thái xác nhận và giá trị tọa độ hợp lệ.
  // Đoạn này không theo dõi GPS và không tự xác định địa điểm.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const hasVerifiedPosition =`: Khai báo hasVerifiedPosition: tính biểu thức position?.verified === true && validPoint(position).
   * DÒNG `position?.verified === true`: Khai báo hasVerifiedPosition: tính biểu thức position?.verified === true && validPoint(position).
   * DÒNG `&& validPoint(position)`: Khai báo hasVerifiedPosition: tính biểu thức position?.verified === true && validPoint(position).
   */
  const hasVerifiedPosition =
    position?.verified === true
    && validPoint(position)

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<article className="detail">`: Dựng article. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<Link to="/places">`: Dựng Link. | Đặt đường dẫn mở khi người dùng bấm liên kết.
   * DÒNG `{t('back')}`: Đưa biểu thức JavaScript t('back') vào JSX.
   * DÒNG `</Link>`: Đóng phần giao diện Link.
   * DÒNG `<h1>{title}</h1>`: Dựng h1.
   * DÒNG `{place.period && <p>{place.period}</p>}`: Đưa biểu thức JavaScript place.period && <p>{place.period}</p> vào JSX.
   * DÒNG `<PlaceImage`: Dựng PlaceImage.
   * DÒNG `uri={place.images[0]}`: Truyền địa chỉ tài nguyên vào component.
   * DÒNG `title={title}`: Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `/>`: Dựng PlaceImage.
   * DÒNG `{PLACE_PHOTOS[place.id]?.note?.[language] && <p className="photo-caption">{PLACE_PHOT`: Đưa biểu thức JavaScript PLACE_PHOTOS[place.id]?.note?.[language] && <p className="photo-caption">{PLACE_PHOTOS[place.id].note?.[langua vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<div className="detail-actions">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<ListenButton id={place.id} />`: Dựng ListenButton. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Link className="button secondary" to={'/journey?placeId=' + place.id}><Icon name="pi`: Dựng Link. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `<p>{t('available')}</p>`: Dựng p.
   * DÒNG `<div className="language-options">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{languages.map((code) => {`: Đưa biểu thức JavaScript languages.map((code) => { const label = LANGUAGES.find( (item) => item.code === code, )?.label ?? code return  vào JSX.
   */
  return (
    <article className="detail">
      <Link to="/places">
        {t('back')}
      </Link>

      <h1>{title}</h1>
      {place.period && <p>{place.period}</p>}

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
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `const label = LANGUAGES.find(`: Gán label bằng LANGUAGES.find( (item) => item.code === code, )?.label; nếu null hoặc undefined thì dùng code.
           * DÒNG `(item) => item.code === code,`: Gán label bằng LANGUAGES.find( (item) => item.code === code, )?.label; nếu null hoặc undefined thì dùng code.
           * DÒNG `)?.label ?? code`: Gán label bằng LANGUAGES.find( (item) => item.code === code, )?.label; nếu null hoặc undefined thì dùng code.
           */
          const label = LANGUAGES.find(
            (item) => item.code === code,
          )?.label ?? code

          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
           * DÒNG `<button`: Dựng button.
           * DÒNG `key={code}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
           * DÒNG `type="button"`: Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `aria-pressed={`: Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `language === code`: Đưa biểu thức JavaScript language === code vào JSX.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `disabled={saving}`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
           * DÒNG `onClick={() => {`: Thuộc tính onClick: nối thao tác bấm với callback.
           * DÒNG `void changeLanguage(code)`: Thực hiện sử dụng void changeLanguage(code) làm giá trị của bước hiện tại.
           * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `>`: Dựng button.
           * DÒNG `{label}`: Đưa biểu thức JavaScript label vào JSX.
           * DÒNG `</button>`: Đóng phần giao diện button.
           * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `</div>`: Đóng phần giao diện div.
           * DÒNG `{content ? (`: Đưa biểu thức JavaScript content ? ( <section> <p>{content.address}</p> <h2>{t('read')}</h2> <p className="narration"> {content.body} < vào JSX.
           * DÒNG `<section>`: Dựng section.
           * DÒNG `<p>{content.address}</p>`: Dựng p.
           * DÒNG `<h2>{t('read')}</h2>`: Dựng h2.
           * DÒNG `<p className="narration">`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
           * DÒNG `{content.body}`: Đưa biểu thức JavaScript content.body vào JSX.
           * DÒNG `</p>`: Đóng phần giao diện p.
           * DÒNG `<p>`: Dựng p.
           * DÒNG `{t('version')}: {content.version}`: Đưa biểu thức JavaScript t('version') vào JSX.
           * DÒNG `</p>`: Đóng phần giao diện p.
           * DÒNG `</section>`: Đóng phần giao diện section.
           * DÒNG `) : (`: Đưa biểu thức JavaScript content ? ( <section> <p>{content.address}</p> <h2>{t('read')}</h2> <p className="narration"> {content.body} < vào JSX.
           * DÒNG `<State message="missing" />`: Dựng State. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
           * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           * DÒNG `<p>`: Dựng p.
           * DÒNG `{position && validPoint(position)`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `? (`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates')`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `+ ': '`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `+ position.lat`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `+ ', '`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `+ position.lng`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           * DÒNG `: t('unverified')}`: Đưa biểu thức JavaScript position && validPoint(position) ? ( t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates') + ': ' + positi vào JSX.
           * DÒNG `</p>`: Đóng phần giao diện p.
           * DÒNG `</article>`: Đóng phần giao diện article.
           * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
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
        {position && validPoint(position)
          ? (
            t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates')
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
// TẠI SAO (DetailPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
// dùng chung.
