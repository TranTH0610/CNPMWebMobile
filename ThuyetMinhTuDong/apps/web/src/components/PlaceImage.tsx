/**
 * FILE NÀY LÀM GÌ
 * Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
 *
 * VỊ TRÍ: apps/web/src/components/PlaceImage.tsx
 * DÙNG BỞI: apps/web/src/components/index.ts; apps/web/src/components/JourneyPlayer.tsx;
 * apps/web/src/components/PlaceCard.tsx; và các nơi import khác.
 * PHỤ THUỘC: react; ../services/placeImages; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'
// Nhập các thành phần từ '../services/placeImages'.
import { resolvePlaceImage } from '../services/placeImages'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Ảnh có dự phòng.
// XỬ LÝ: Card lazy-load; đổi URL thì thử lại thay vì giữ lỗi cũ.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function PlaceImage({`: Khai báo PlaceImage({ uri, title, }). Component hàm nhận props và dựng phần giao diện PlaceImage.
 * DÒNG `uri,`: Nhận đầu vào { uri, title, }: { uri?: string title: string } từ nơi gọi hàm.
 * DÒNG `title,`: Nhận đầu vào { uri, title, }: { uri?: string title: string } từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { uri, title, }: { uri?: string title: string } từ nơi gọi hàm.
 */
export function PlaceImage({
  uri,
  title,
}: {
  // Khai báo uri không bắt buộc, kiểu string.
  uri?: string
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `title: string`: Khai báo title, kiểu string.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  title: string
}) {
  // Khai báo [failed, setFailed]: useState(false) giữ trạng thái qua các lần render.
  const [failed, setFailed] = useState(false)
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // DÒNG NÀY LÀM GÌ: Đặt lại cờ ảnh lỗi về false khi uri thay đổi.
  // CÁCH HOẠT ĐỘNG: Nguồn ảnh mới được thử tải lại, dù ảnh trước đó đã thất bại.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: uri.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => setFailed(false), [uri])
  // TẠI SAO: Nếu giữ cờ lỗi cũ, component có thể tiếp tục hiện placeholder dù đã nhận một URL ảnh
  // mới hợp lệ.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return uri && !failed ? (`: Trả kết quả: chọn giữa hai giá trị theo điều kiện uri && !failed.
   * DÒNG `<img`: Dựng img.
   * DÒNG `className="place-image"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `src={resolvePlaceImage(uri)}`: Thuộc tính src: chỉ định nguồn tài nguyên cần tải.
   * DÒNG `alt={title}`: Thuộc tính alt: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onError={() => setFailed(true)}`: Thuộc tính onError: nhận lỗi tài nguyên để có thể hiển thị trạng thái thay thế.
   * DÒNG `loading="lazy"`: Thuộc tính loading: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng img.
   * DÒNG `) : (`: Trả kết quả: chọn giữa hai giá trị theo điều kiện uri && !failed.
   * DÒNG `<div`: Dựng div.
   * DÒNG `className="place-image placeholder"`: Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `role="img"`: Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `aria-label={t('noImage')}`: Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `>`: Dựng div.
   * DÒNG `<span>▥</span>`: Dựng span.
   * DÒNG `{t('noImage')}`: Đưa biểu thức JavaScript t('noImage') vào JSX.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return uri && !failed ? (
    <img
      className="place-image"
      src={resolvePlaceImage(uri)}
      alt={title}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  ) : (
    <div
      className="place-image placeholder"
      role="img"
      aria-label={t('noImage')}
    >
      <span>▥</span>
      {t('noImage')}
    </div>
  )
}
// TẠI SAO (PlaceImage): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
