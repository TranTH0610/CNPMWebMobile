/**
 * FILE NÀY LÀM GÌ
 * Tài nguyên chuỗi liên kết và QR theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
 * nhất.
 *
 * VỊ TRÍ: packages/visitor-core/src/i18n/qr-messages.ts
 * DÙNG BỞI: packages/visitor-core/src/i18n/messages.ts.
 * PHỤ THUỘC: ../domain/model
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Language } from '../domain/model'
// Đặt tên kiểu QrText. | Khai báo qrRefresh, kiểu string. | Khai báo qrDownload, kiểu string. | Khai báo qrScanHint, kiểu string. | Khai báo qrTemporary, kiểu string.
type QrText = { qrRefresh: string; qrDownload: string; qrScanHint: string; qrTemporary: string }
// Khai báo qrMessages: tạo object gồm vi, en, cn, pt, ja.
export const qrMessages: Record<Language, QrText> = {
  // Gán thuộc tính vi: tạo object gồm qrRefresh, qrDownload, qrScanHint, qrTemporary. | Gán thuộc tính qrRefresh: chuỗi 'Cập nhật mã QR'. | Gán thuộc tính qrDownload: chuỗi 'Tải ảnh QR'. | Gán thuộc tính qrScanHint: chuỗi 'Mở camera trên điện thoại khác, hướng vào toàn bộ mã và chạm thông báo đường dẫn. Nếu QR. | Gán thuộc tính qrTemporary: chuỗi 'Link demo cần máy tính và tunnel đang chạy. Khi đổi phiên, hãy cập nhật QR.
  vi: { qrRefresh: 'Cập nhật mã QR', qrDownload: 'Tải ảnh QR', qrScanHint: 'Mở camera trên điện thoại khác, hướng vào toàn bộ mã và chạm thông báo đường dẫn. Nếu QR đang nằm trên chính điện thoại này, bấm Mở website bên dưới.', qrTemporary: 'Link demo cần máy tính và tunnel đang chạy. Khi đổi phiên, hãy cập nhật QR; lần mở đầu phụ thuộc kết nối Internet.' },
  // Gán thuộc tính en: tạo object gồm qrRefresh, qrDownload, qrScanHint, qrTemporary. | Gán thuộc tính qrRefresh: chuỗi 'Refresh QR'. | Gán thuộc tính qrDownload: chuỗi 'Download QR'. | Gán thuộc tính qrScanHint: chuỗi 'Use the camera on another phone, frame the whole code and tap the link notification. If v. | Gán thuộc tính qrTemporary: chuỗi 'The demo requires the computer and tunnel to remain running. Refresh the QR after a sessi.
  en: { qrRefresh: 'Refresh QR', qrDownload: 'Download QR', qrScanHint: 'Use the camera on another phone, frame the whole code and tap the link notification. If viewing on this phone, use Open website below.', qrTemporary: 'The demo requires the computer and tunnel to remain running. Refresh the QR after a session change; first-load speed depends on your connection.' },
  // Gán thuộc tính cn: tạo object gồm qrRefresh, qrDownload, qrScanHint, qrTemporary. | Gán thuộc tính qrRefresh: chuỗi '更新二维码'. | Gán thuộc tính qrDownload: chuỗi '下载二维码'. | Gán thuộc tính qrScanHint: chuỗi '请用另一部手机的相机对准完整二维码并点击链接通知。如果正在本机查看，请点击下方打开网站。'. | Gán thuộc tính qrTemporary: chuỗi '演示需要电脑及隧道保持运行。会话变化后请更新二维码；首次加载速度取决于网络。'.
  cn: { qrRefresh: '更新二维码', qrDownload: '下载二维码', qrScanHint: '请用另一部手机的相机对准完整二维码并点击链接通知。如果正在本机查看，请点击下方打开网站。', qrTemporary: '演示需要电脑及隧道保持运行。会话变化后请更新二维码；首次加载速度取决于网络。' },
  // Gán thuộc tính pt: tạo object gồm qrRefresh, qrDownload, qrScanHint, qrTemporary. | Gán thuộc tính qrRefresh: chuỗi 'Atualizar QR'. | Gán thuộc tính qrDownload: chuỗi 'Descarregar QR'. | Gán thuộc tính qrScanHint: chuỗi 'Use a câmara de outro telemóvel, enquadre todo o código e toque na ligação. Se estiver ne. | Gán thuộc tính qrTemporary: chuỗi 'A demonstração requer o computador e o túnel ligados. Atualize o QR após mudar de sessão.
  pt: { qrRefresh: 'Atualizar QR', qrDownload: 'Descarregar QR', qrScanHint: 'Use a câmara de outro telemóvel, enquadre todo o código e toque na ligação. Se estiver neste telemóvel, use Abrir website abaixo.', qrTemporary: 'A demonstração requer o computador e o túnel ligados. Atualize o QR após mudar de sessão; o primeiro acesso depende da ligação.' },
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `ja: { qrRefresh: 'QRを更新', qrDownload: 'QR画像を保存', qrScanHint: '別のスマートフォンのカメラでコード全体を映し、`: Gán thuộc tính ja: tạo object gồm qrRefresh, qrDownload, qrScanHint, qrTemporary. | Gán thuộc tính qrRefresh: chuỗi 'QRを更新'. | Gán thuộc tính qrDownload: chuỗi 'QR画像を保存'. | Gán thuộc tính qrScanHint: chuỗi '別のスマートフォンのカメラでコード全体を映し、リンク通知をタップしてください。この端末で表示中は下のサイトを開くボタンをご利用ください。'. | Gán thuộc tính qrTemporary: chuỗi 'デモにはPCとトンネルの稼働が必要です。セッション変更後はQRを更新してください。初回表示の速さは通信環境に依存します。'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  ja: { qrRefresh: 'QRを更新', qrDownload: 'QR画像を保存', qrScanHint: '別のスマートフォンのカメラでコード全体を映し、リンク通知をタップしてください。この端末で表示中は下のサイトを開くボタンをご利用ください。', qrTemporary: 'デモにはPCとトンネルの稼働が必要です。セッション変更後はQRを更新してください。初回表示の速さは通信環境に依存します。' },
}
