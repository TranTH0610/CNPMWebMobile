/** FILE NÀY LÀM GÌ: Hiện nguồn của chính bản bài đang đọc/biên tập.
 * DetailPage và ContentEditorPage gọi; phụ thuộc i18n và PublishedText chung.
 * UC04/UC14: không lấy nguồn của di tích khác và không giả chứng nhận của đơn vị quản lý.
 */
import type { PublishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n'
export function ContentSources({ text }: { text?: PublishedText }) {
  const t = useText()
  if (!text?.sources?.length) return null
  // CHỨC NĂNG: Ghi công bản biên soạn/dịch; link mở nguồn riêng để giữ bài đang nghe.
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
/* CÁCH KIỂM TRA: Đổi năm ngôn ngữ; mở link nguồn; bài không có sources không vẽ khung rỗng. */
