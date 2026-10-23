/**
 * FILE NÀY LÀM GÌ: Một mã QR vào chung, có viền trắng chuẩn và nút mở/tải ảnh.
 * QrPage gọi; phụ thuộc qrcode, cấu hình runtime platform và i18n. UC05.
 */
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useText } from '../i18n'
import { loadPublicSiteOrigin } from '../services/platform'
import { State } from './State'
import './qr.css'

type QrResult = { href: string; src: string }
export function QrImage() {
  const t = useText()
  const [origin, setOrigin] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<QrResult | null>(null)
  const [failed, setFailed] = useState(false)
  const href = origin ? origin + '/' : null

  // CHỨC NĂNG: Lấy URL mới khi phiên tunnel đổi, không giữ link cũ suốt lần mở trang.
  // XỬ LÝ: Poll 15 giây và khi quay lại cửa sổ; clearInterval/removeEventListener
  // và cancelled ngăn cập nhật sau unmount. Không tạo tunnel từ trình duyệt.
  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      const value = await loadPublicSiteOrigin()
      if (!cancelled) { setOrigin(value); setLoaded(true) }
    }
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, 15000)
    const focus = () => { void refresh() }
    window.addEventListener('focus', focus)
    return () => { cancelled = true; window.clearInterval(timer); window.removeEventListener('focus', focus) }
  }, [attempt])

  // CHỨC NĂNG: Sinh PNG đen/trắng, không logo và đủ vùng trắng quanh bốn cạnh.
  // XỬ LÝ: margin=4 theo vùng yên lặng của QR; ảnh nguồn 640px để tải/in rõ.
  // Không nén bằng JPEG hoặc cắt ảnh. Href gắn với kết quả để không hiện mã cũ.
  useEffect(() => {
    let cancelled = false
    setFailed(false)
    if (!href) return
    void QRCode.toDataURL(href, { width: 640, margin: 4, errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' } })
      .then(src => { if (!cancelled) setResult({ href, src }) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [href, attempt])

  const current = result?.href === href ? result : null
  return <section className="qr-panel qr-scan-panel" aria-label={t('generalQr')}>
    <h2>{t('generalQr')}</h2>
    <p>{t('noAccount')}</p>
    {!loaded ? <State message="loading" busy /> : !href ? <State message="qrSetup" />
      : failed ? <State message="loadError" retry={() => setAttempt(value => value + 1)} />
        : current ? <div className="qr-frame"><img className="qr-code-image" src={current.src}
          width={640} height={640} alt={t('generalQr')} /></div>
          : <State message="loading" busy />}
    <p className="qr-scan-hint">{t('qrScanHint')}</p>
    <div className="qr-actions">
      {href && <a className="button" href={href} target="_blank" rel="noreferrer">{t('openWebsite')}</a>}
      {current && <a className="button secondary" href={current.src} download="hue-guide-qr.png">{t('qrDownload')}</a>}
      <button className="secondary" type="button" onClick={() => setAttempt(value => value + 1)}>{t('qrRefresh')}</button>
    </div>
    {href && <p className="qr-url"><a href={href} target="_blank" rel="noreferrer">{href}</a></p>}
    <p className="qr-session-note">{t('qrTemporary')}</p>
  </section>
}
/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đặt điện thoại trước màn hình: camera phải nhận URL HTTPS, không phải exp://.
 * - Trên chính điện thoại đang xem, bấm Mở website thay vì cố quét màn hình đó.
 * - Đổi phiên demo: bấm Cập nhật mã QR; ảnh và đường link phải cùng URL mới.
 * - Tải PNG: ảnh vuông có đủ viền trắng và không mất góc định vị.
 */
