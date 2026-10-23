/**
 * FILE NÀY LÀM GÌ: Trang duy nhất hiển thị QR vào chung hệ thống.
 * Vị trí: apps/web/src/pages/QrPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { QrImage } from '../components/QrImage'
import { Link } from 'react-router-dom'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Cung cấp trang hiển thị QR vào chung.
// XỬ LÝ:
// - Chỉ có một URL gốc dùng cho QR.
// - Không nhập hoặc tạo QR theo ID địa điểm.
// - Người dùng quét một lần để vào hệ thống.
// - Việc mở app hay web phụ thuộc cấu hình liên kết của thiết bị.
export function QrPage() {
  const t = useText()

  return (
    <section className="detail">
      <h1>{t('qrAccess')}</h1>

      <p>{t('qrWebHint')}</p>

      <QrImage />

      <Link to="/">
        {t('home')}
      </Link>
    </section>
  )
}
