/**
 * FILE NÀY LÀM GÌ
 * Thẻ tóm tắt địa điểm, ảnh và thông tin hiển thị; bấm thẻ để mở đúng trang hoặc màn chi tiết.
 *
 * VỊ TRÍ: apps/web/src/components/PlaceCard.tsx
 * DÙNG BỞI: apps/web/src/components/Catalogue.tsx; apps/web/src/components/index.ts.
 * PHỤ THUỘC: ./Icon; ./PlaceImage; react-router-dom; @travelguide/visitor-core; ../i18n/index;
 * ../hooks/useVisitor
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ './Icon'.
import { Icon } from './Icon'
// Nhập các thành phần từ './PlaceImage'.
import { PlaceImage } from './PlaceImage'
// Nhập các thành phần từ 'react-router-dom'.
import { Link } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryOf, publishedText } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { PlaceRecord } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Card địa điểm trong carousel/lưới/danh sách.
// XỬ LÝ: Thẻ chỉ mở chi tiết; không đăng ký chức năng yêu thích.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function PlaceCard({`: Khai báo PlaceCard({ place, distance, }). Component hàm nhận props và dựng phần giao diện PlaceCard.
 * DÒNG `place,`: Nhận đầu vào { place, distance, }: { place: PlaceRecord distance?: number } từ nơi gọi hàm.
 * DÒNG `distance,`: Nhận đầu vào { place, distance, }: { place: PlaceRecord distance?: number } từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { place, distance, }: { place: PlaceRecord distance?: number } từ nơi gọi hàm.
 */
export function PlaceCard({
  place,
  distance,
}: {
  // Khai báo place, kiểu PlaceRecord.
  place: PlaceRecord
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `distance?: number`: Khai báo distance không bắt buộc, kiểu number.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  distance?: number
}) {
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()

  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
  const content = publishedText(place, language)
  // Gán title bằng content?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
  const title = content?.title ?? place.canonicalTitle

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<article className="place-card">`: Dựng article. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<Link`: Dựng Link.
   * DÒNG `className="card-photo"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `to={'/places/' + place.id}`: Đặt đường dẫn mở khi người dùng bấm liên kết.
   * DÒNG `aria-label={title}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `>`: Dựng Link.
   * DÒNG `<PlaceImage uri={place.images[0]} title={title} />`: Dựng PlaceImage. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `</Link>`: Đóng phần giao diện Link.
   * DÒNG `<div className="card-content">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<h3>`: Dựng h3.
   * DÒNG `<Link to={'/places/' + place.id}>{title}</Link>`: Dựng Link. | Đặt đường dẫn mở khi người dùng bấm liên kết.
   * DÒNG `</h3>`: Đóng phần giao diện h3.
   * DÒNG `<span className={'badge badge-' + categoryOf(place)}>`: Dựng span. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `{t(`category_${categoryOf(place)}`)}`: Đưa biểu thức JavaScript t(`category_${categoryOf(place)}`) vào JSX.
   * DÒNG `</span>`: Đóng phần giao diện span.
   * DÒNG `<p className="card-location">`: Dựng p. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<Icon name="pin" />`: Dựng Icon. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{content ? content.address || t('city') : t('missing')}`: Đưa biểu thức JavaScript content ? content.address || t('city') : t('missing') vào JSX.
   * DÒNG `{distance !== undefined && (`: Đưa biểu thức JavaScript distance !== undefined && ( <span>{(distance / 1000).toFixed(2)} km</span> ) vào JSX.
   * DÒNG `<span>{(distance / 1000).toFixed(2)} km</span>`: Dựng span.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</p>`: Đóng phần giao diện p.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `</article>`: Đóng phần giao diện article.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <article className="place-card">
      <Link
        className="card-photo"
        to={'/places/' + place.id}
        aria-label={title}
      >
        <PlaceImage uri={place.images[0]} title={title} />
      </Link>

      <div className="card-content">
        <h3>
          <Link to={'/places/' + place.id}>{title}</Link>
        </h3>

        <span className={'badge badge-' + categoryOf(place)}>
          {t(`category_${categoryOf(place)}`)}
        </span>

        <p className="card-location">
          <Icon name="pin" />
          {content ? content.address || t('city') : t('missing')}

          {distance !== undefined && (
            <span>{(distance / 1000).toFixed(2)} km</span>
          )}
        </p>
      </div>
    </article>
  )
}
// TẠI SAO (PlaceCard): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
