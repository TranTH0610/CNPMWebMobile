/**
 * CHỨC NĂNG: [TRUY-CAP-QR]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Chuẩn hóa/cấu hình địa chỉ website dùng cho liên kết chung theo quy tắc của dự án.
 *
 * VỊ TRÍ: packages/visitor-core/src/links/DiaChiWebsite.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. siteOrigin
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// CHỨC NĂNG: Chuẩn hóa và kiểm tra origin của website.
// XỬ LÝ:
// - Bản công khai yêu cầu HTTPS.
// - HTTP chỉ được nhận khi nơi gọi cho phép chạy thử.
// - Từ chối localhost vì trên điện thoại, localhost là chính điện thoại.
// - Từ chối domain ví dụ và URL chứa tài khoản, query hoặc đường dẫn con.

// ==================== [TRUY-CAP-QR] siteOrigin ====================
export function siteOrigin(
  value: string,
  allowHttp = false,
): string {
  // Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
  const url = new URL(value)

  // Khai báo host: Gọi url.hostname.toLowerCase().
  const host = url.hostname.toLowerCase()

  
  const supportedProtocol =
    url.protocol === 'https:'
    || (
      allowHttp
      && url.protocol === 'http:'
    )

  
  const isLoopback =
    host === 'localhost'
    || host.endsWith('.localhost')
    || host === '[::1]'
    || host === '[::]'
    || host.startsWith('127.')
    || host === '0.0.0.0'

  
  const containsUnsupportedParts =
    Boolean(url.username)
    || Boolean(url.password)
    || Boolean(url.search)
    || Boolean(url.hash)
    || url.pathname !== '/'

  
  if (
    !supportedProtocol
    || isLoopback
    || containsUnsupportedParts
    || host.endsWith('.example')
  ) {
    
    throw new Error('invalidSiteOrigin')
  }

  // CHỨC NĂNG: Trả địa chỉ gốc ổn định.
  // XỬ LÝ: URL có hoặc không có dấu / cuối đều cho cùng kết quả.
  
  return url.origin
}
// TẠI SAO (siteOrigin): Liên kết chung cần đúng origin/giao thức để QR không trỏ nhầm môi trường
// hoặc ứng dụng.