/**
 * FILE NÀY LÀM GÌ: Trang giới thiệu, giữ nội dung hiện tại.
 * Vị trí: apps/web/src/pages/AboutPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useText } from '../i18n'

export function AboutPage() { const t = useText(); return <section className="panel detail"><h1>{t('site')}</h1><p>{t('intro')}</p><p>{t('noAccount')}</p><p>{t('demo')}</p></section> }
