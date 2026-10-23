/**
 * FILE NÀY LÀM GÌ: Chân trang web với thông tin demo và nguồn ảnh.
 * Vị trí: apps/web/src/components/Footer.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { PHOTO_CREDITS } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

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
