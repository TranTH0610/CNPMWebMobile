/**
 * FILE NÀY LÀM GÌ
 * Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
 *
 * VỊ TRÍ: apps/web/src/components/State.tsx
 * DÙNG BỞI: apps/web/src/components/Catalogue.tsx; apps/web/src/components/index.ts;
 * apps/web/src/pages/NotFoundPage.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { MessageKey } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị tải/lỗi/thử lại.
// XỬ LÝ: Không hiện chuỗi lỗi kỹ thuật từ API.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function State({`: Khai báo State({ message, busy = false, retry, }). Component hàm nhận props và dựng phần giao diện State.
 * DÒNG `message,`: Nhận đầu vào { message, busy = false, retry, }: { message: MessageKey busy?: boolean retry?: () => void } từ nơi gọi hàm.
 * DÒNG `busy = false,`: Nhận đầu vào { message, busy = false, retry, }: { message: MessageKey busy?: boolean retry?: () => void } từ nơi gọi hàm.
 * DÒNG `retry,`: Nhận đầu vào { message, busy = false, retry, }: { message: MessageKey busy?: boolean retry?: () => void } từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { message, busy = false, retry, }: { message: MessageKey busy?: boolean retry?: () => void } từ nơi gọi hàm.
 */
export function State({
  message,
  busy = false,
  retry,
}: {
  // Khai báo message, kiểu MessageKey.
  message: MessageKey
  // Khai báo busy không bắt buộc, kiểu boolean.
  busy?: boolean
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `retry?: () => void`: Khai báo retry không bắt buộc, kiểu () => void.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  retry?: () => void
}) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<section className="state" role={busy ? 'status' : 'alert'}>`: Dựng section. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{busy && <progress aria-label={t('loading')} />}`: Đưa biểu thức JavaScript busy && <progress aria-label={t('loading')} /> vào JSX. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `<p>{t(message)}</p>`: Dựng p.
   * DÒNG `{retry && <button onClick={retry}>{t('retry')}</button>}`: Đưa biểu thức JavaScript retry && <button onClick={retry}>{t('retry')}</button> vào JSX. | Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `</section>`: Đóng phần giao diện section.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <section className="state" role={busy ? 'status' : 'alert'}>
      {busy && <progress aria-label={t('loading')} />}
      <p>{t(message)}</p>
      {retry && <button onClick={retry}>{t('retry')}</button>}
    </section>
  )
}
// TẠI SAO (State): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
