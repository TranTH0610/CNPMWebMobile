/**
 * FILE NÀY LÀM GÌ
 * Phần cuối trang website với các nội dung và liên kết được giao diện sử dụng.
 *
 * VỊ TRÍ: apps/web/src/components/Footer.tsx
 * DÙNG BỞI: apps/web/src/layouts/AppLayout.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { PHOTO_CREDITS } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Phần cuối trang website với các nội dung và liên kết được giao diện sử dụng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function Footer() { const t = useText(); return (<footer className="container `: Khai báo Footer(). Component hàm nhận props và dựng phần giao diện Footer. | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
 * DÒNG `<strong>{t('site')}</strong>`: Dựng strong.
 * DÒNG `<p>{t('noAccount')}</p>`: Dựng p.
 * DÒNG `<p>{t('demo')}</p>`: Dựng p.
 * DÒNG `<details>`: Dựng details.
 * DÒNG `<summary>{t('photoCredits')}</summary>`: Dựng summary.
 * DÒNG `{PHOTO_CREDITS.map((credit) => (`: Đưa biểu thức JavaScript PHOTO_CREDITS.map((credit) => ( <p key={credit.url}> <a href={credit.url} target="_blank" rel="noreferrer"> {c vào JSX.
 * DÒNG `<p key={credit.url}>`: Dựng p. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
 * DÒNG `<a href={credit.url} target="_blank" rel="noreferrer">`: Dựng a. | Thuộc tính href: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính target: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rel: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `{credit.title}`: Đưa biểu thức JavaScript credit.title vào JSX.
 * DÒNG `</a>`: Đóng phần giao diện a.
 * DÒNG `{' · '}`: Đưa biểu thức JavaScript ' · ' vào JSX.
 * DÒNG `<a href={credit.licenseUrl}>`: Dựng a. | Thuộc tính href: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
 * DÒNG `{credit.license}`: Đưa biểu thức JavaScript credit.license vào JSX.
 * DÒNG `</a>`: Đóng phần giao diện a.
 * DÒNG `</p>`: Đóng phần giao diện p.
 * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 * DÒNG `</details>`: Đóng phần giao diện details.
 * DÒNG `</footer>) }`: Đóng phần giao diện footer.
 */
export function Footer() { const t = useText(); return (<footer className="container footer">
        <strong>{t('site')}</strong>
        <p>{t('noAccount')}</p>
        <p>{t('demo')}</p>

        <details>
          <summary>{t('photoCredits')}</summary>

          {PHOTO_CREDITS.map((credit) => (
            <p key={credit.url}>
              <a href={credit.url} target="_blank" rel="noreferrer">
                {credit.title}
              </a>
              {' · '}
              <a href={credit.licenseUrl}>
                {credit.license}
              </a>
            </p>
          ))}
        </details>
      </footer>) }
// TẠI SAO (Footer): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
