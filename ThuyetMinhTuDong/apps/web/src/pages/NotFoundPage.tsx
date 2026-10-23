/**
 * FILE NÀY LÀM GÌ: Trang URL không tồn tại và liên kết quay lại danh sách.
 * Vị trí: apps/web/src/pages/NotFoundPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Link } from 'react-router-dom'
import { useText } from '../i18n'
import { State } from '../components/State'

export function NotFoundPage() { const t = useText(); return <section className="panel"><State message="notFound" /><Link to="/places">{t('back')}</Link></section> }
