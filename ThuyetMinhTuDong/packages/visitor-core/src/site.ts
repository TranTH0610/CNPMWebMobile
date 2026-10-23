/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra địa chỉ website dùng cho QR chung và liên kết mở app.
 *
 * Được dùng bởi:
 * - apps/web/src/platform.ts.
 * - apps/mobile/src/visitor/platform.ts.
 *
 * Phụ thuộc:
 * - URL chuẩn của JavaScript.
 *
 * Liên quan: UC05.
 */

// CHỨC NĂNG: Chuẩn hóa và kiểm tra origin của website.
// XỬ LÝ:
// - Bản công khai yêu cầu HTTPS.
// - HTTP chỉ được nhận khi nơi gọi cho phép chạy thử.
// - Từ chối localhost vì trên điện thoại, localhost là chính điện thoại.
// - Từ chối domain ví dụ và URL chứa tài khoản, query hoặc đường dẫn con.
export function siteOrigin(
  value: string,
  allowHttp = false,
): string {
  const url = new URL(value)

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