/**
 * FILE NÀY LÀM GÌ
 * Chuẩn hóa/cấu hình địa chỉ website dùng cho liên kết chung theo quy tắc của dự án.
 *
 * VỊ TRÍ: packages/visitor-core/src/links/site.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// CHỨC NĂNG: Chuẩn hóa và kiểm tra origin của website.
// XỬ LÝ:
// - Bản công khai yêu cầu HTTPS.
// - HTTP chỉ được nhận khi nơi gọi cho phép chạy thử.
// - Từ chối localhost vì trên điện thoại, localhost là chính điện thoại.
// - Từ chối domain ví dụ và URL chứa tài khoản, query hoặc đường dẫn con.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function siteOrigin(`: Khai báo siteOrigin(value, allowHttp). Nhận đầu vào qua tham số.
 * DÒNG `value: string,`: Nhận đầu vào value: string từ nơi gọi hàm.
 * DÒNG `allowHttp = false,`: Nhận đầu vào allowHttp = false từ nơi gọi hàm.
 * DÒNG `): string {`: Khai báo siteOrigin(value, allowHttp). Nhận đầu vào qua tham số.
 */
export function siteOrigin(
  value: string,
  allowHttp = false,
): string {
  // Khai báo url: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi.
  const url = new URL(value)

  // Khai báo host: Gọi url.hostname.toLowerCase().
  const host = url.hostname.toLowerCase()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const supportedProtocol =`: Khai báo supportedProtocol: tính biểu thức url.protocol === 'https:' || ( allowHttp && url.protocol === 'http:' ).
   * DÒNG `url.protocol === 'https:'`: Khai báo supportedProtocol: tính biểu thức url.protocol === 'https:' || ( allowHttp && url.protocol === 'http:' ).
   * DÒNG `|| (`: Khai báo supportedProtocol: tính biểu thức url.protocol === 'https:' || ( allowHttp && url.protocol === 'http:' ).
   * DÒNG `allowHttp`: Khai báo supportedProtocol: tính biểu thức url.protocol === 'https:' || ( allowHttp && url.protocol === 'http:' ).
   * DÒNG `&& url.protocol === 'http:'`: Khai báo supportedProtocol: tính biểu thức url.protocol === 'https:' || ( allowHttp && url.protocol === 'http:' ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const supportedProtocol =
    url.protocol === 'https:'
    || (
      allowHttp
      && url.protocol === 'http:'
    )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const isLoopback =`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   * DÒNG `host === 'localhost'`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   * DÒNG `|| host.endsWith('.localhost')`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   * DÒNG `|| host === '[::1]'`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   * DÒNG `|| host === '[::]'`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   * DÒNG `|| host.startsWith('127.')`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   * DÒNG `|| host === '0.0.0.0'`: Khai báo isLoopback: tính biểu thức host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]'.
   */
  const isLoopback =
    host === 'localhost'
    || host.endsWith('.localhost')
    || host === '[::1]'
    || host === '[::]'
    || host.startsWith('127.')
    || host === '0.0.0.0'

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const containsUnsupportedParts =`: Khai báo containsUnsupportedParts: tính biểu thức Boolean(url.username) || Boolean(url.password) || Boolean(url.search) || Boolean(url.hash).
   * DÒNG `Boolean(url.username)`: Khai báo containsUnsupportedParts: tính biểu thức Boolean(url.username) || Boolean(url.password) || Boolean(url.search) || Boolean(url.hash).
   * DÒNG `|| Boolean(url.password)`: Khai báo containsUnsupportedParts: tính biểu thức Boolean(url.username) || Boolean(url.password) || Boolean(url.search) || Boolean(url.hash).
   * DÒNG `|| Boolean(url.search)`: Khai báo containsUnsupportedParts: tính biểu thức Boolean(url.username) || Boolean(url.password) || Boolean(url.search) || Boolean(url.hash).
   * DÒNG `|| Boolean(url.hash)`: Khai báo containsUnsupportedParts: tính biểu thức Boolean(url.username) || Boolean(url.password) || Boolean(url.search) || Boolean(url.hash).
   * DÒNG `|| url.pathname !== '/'`: Khai báo containsUnsupportedParts: tính biểu thức Boolean(url.username) || Boolean(url.password) || Boolean(url.search) || Boolean(url.hash).
   */
  const containsUnsupportedParts =
    Boolean(url.username)
    || Boolean(url.password)
    || Boolean(url.search)
    || Boolean(url.hash)
    || url.pathname !== '/'

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu !supportedProtocol || isLoopback || containsUnsupportedParts || host.endsWith('.example').
   * DÒNG `!supportedProtocol`: Rẽ nhánh nếu !supportedProtocol || isLoopback || containsUnsupportedParts || host.endsWith('.example').
   * DÒNG `|| isLoopback`: Rẽ nhánh nếu !supportedProtocol || isLoopback || containsUnsupportedParts || host.endsWith('.example').
   * DÒNG `|| containsUnsupportedParts`: Rẽ nhánh nếu !supportedProtocol || isLoopback || containsUnsupportedParts || host.endsWith('.example').
   * DÒNG `|| host.endsWith('.example')`: Rẽ nhánh nếu !supportedProtocol || isLoopback || containsUnsupportedParts || host.endsWith('.example').
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    !supportedProtocol
    || isLoopback
    || containsUnsupportedParts
    || host.endsWith('.example')
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('invalidSiteOrigin')`: Ném new Error('invalidSiteOrigin').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('invalidSiteOrigin')
  }

  // CHỨC NĂNG: Trả địa chỉ gốc ổn định.
  // XỬ LÝ: URL có hoặc không có dấu / cuối đều cho cùng kết quả.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return url.origin`: Trả kết quả: đọc url.origin từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return url.origin
}
// TẠI SAO (siteOrigin): Liên kết chung cần đúng origin/giao thức để QR không trỏ nhầm môi trường
// hoặc ứng dụng.