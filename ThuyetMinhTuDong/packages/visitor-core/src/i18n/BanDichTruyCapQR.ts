/**
 * FILE: packages/visitor-core/src/i18n/BanDichTruyCapQR.ts
 * FILE NÀY LÀM GÌ: Tài nguyên chuỗi liên kết và QR theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { Language } from '../domain/KieuDuLieuDuKhach'
type QrText = { qrRefresh: string; qrDownload: string; qrScanHint: string; qrTemporary: string }
export const qrMessages: Record<Language, QrText> = {
  vi: { qrRefresh: 'Cập nhật mã QR', qrDownload: 'Tải ảnh QR', qrScanHint: 'Mở camera trên điện thoại khác, hướng vào toàn bộ mã và chạm thông báo đường dẫn. Nếu QR đang nằm trên chính điện thoại này, bấm Mở website bên dưới.', qrTemporary: 'Link demo cần máy tính và tunnel đang chạy. Khi đổi phiên, hãy cập nhật QR; lần mở đầu phụ thuộc kết nối Internet.' },
  en: { qrRefresh: 'Refresh QR', qrDownload: 'Download QR', qrScanHint: 'Use the camera on another phone, frame the whole code and tap the link notification. If viewing on this phone, use Open website below.', qrTemporary: 'The demo requires the computer and tunnel to remain running. Refresh the QR after a session change; first-load speed depends on your connection.' },
  cn: { qrRefresh: '更新二维码', qrDownload: '下载二维码', qrScanHint: '请用另一部手机的相机对准完整二维码并点击链接通知。如果正在本机查看，请点击下方打开网站。', qrTemporary: '演示需要电脑及隧道保持运行。会话变化后请更新二维码；首次加载速度取决于网络。' },
  pt: { qrRefresh: 'Atualizar QR', qrDownload: 'Descarregar QR', qrScanHint: 'Use a câmara de outro telemóvel, enquadre todo o código e toque na ligação. Se estiver neste telemóvel, use Abrir website abaixo.', qrTemporary: 'A demonstração requer o computador e o túnel ligados. Atualize o QR após mudar de sessão; o primeiro acesso depende da ligação.' },
  
  ja: { qrRefresh: 'QRを更新', qrDownload: 'QR画像を保存', qrScanHint: '別のスマートフォンのカメラでコード全体を映し、リンク通知をタップしてください。この端末で表示中は下のサイトを開くボタンをご利用ください。', qrTemporary: 'デモにはPCとトンネルの稼働が必要です。セッション変更後はQRを更新してください。初回表示の速さは通信環境に依存します。' },
}
