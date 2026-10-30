/**
 * FILE NÀY LÀM GÌ
 * Thành phần trình bày nguồn tư liệu. File vẫn tồn tại; việc có xuất hiện trên giao diện phụ thuộc
 * nơi gọi.
 *
 * VỊ TRÍ: apps/web/src/components/ContentSources.tsx
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: @travelguide/visitor-core; ../i18n
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { PublishedText } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// CHỨC NĂNG: Thành phần trình bày nguồn tư liệu.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ContentSources({ text }). Component hàm nhận props và dựng phần giao diện ContentSources. | Khai báo text không bắt buộc, kiểu PublishedText.
export function ContentSources({ text }: { text?: PublishedText }) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Rẽ nhánh nếu !text?.sources?.length. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
  if (!text?.sources?.length) return null
  // CHỨC NĂNG: Ghi công bản biên soạn/dịch; link mở nguồn riêng để giữ bài đang nghe.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <aside className="content-sources" aria-label={t('heritageSources')}>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập.
   * DÒNG `<h3>{t('heritageSources')}</h3><p>{t('heritageCredit')}</p>`: Dựng h3.
   * DÒNG `<ul>{text.sources.map(source => <li key={source.url}>`: Dựng ul. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `<a href={source.url} target="_blank" rel="noreferrer">Wikipedia · {source.title}</a>`: Dựng a. | Thuộc tính href: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính target: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rel: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<span> · {t('heritageChecked')}: {source.accessedAt} · </span>`: Dựng span.
   * DÒNG `<a href={source.licenseUrl} target="_blank" rel="noreferrer">{source.license}</a>`: Dựng a. | Thuộc tính href: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính target: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rel: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</li>)}</ul>`: Đóng phần giao diện li.
   * DÒNG `{text.audio?.url.startsWith('narration:') && <p>{t('heritageSynthetic')}</p>}`: Đưa biểu thức JavaScript text.audio?.url.startsWith('narration:') && <p>{t('heritageSynthetic')}</p> vào JSX.
   * DÒNG `</aside>`: Đóng phần giao diện aside.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <aside className="content-sources" aria-label={t('heritageSources')}>
    <h3>{t('heritageSources')}</h3><p>{t('heritageCredit')}</p>
    <ul>{text.sources.map(source => <li key={source.url}>
      <a href={source.url} target="_blank" rel="noreferrer">Wikipedia · {source.title}</a>
      <span> · {t('heritageChecked')}: {source.accessedAt} · </span>
      <a href={source.licenseUrl} target="_blank" rel="noreferrer">{source.license}</a>
    </li>)}</ul>
    {text.audio?.url.startsWith('narration:') && <p>{t('heritageSynthetic')}</p>}
  </aside>
}
// TẠI SAO (ContentSources): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
/* CÁCH KIỂM TRA: Đổi năm ngôn ngữ; mở link nguồn; bài không có sources không vẽ khung rỗng. */
