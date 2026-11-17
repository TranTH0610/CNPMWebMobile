/**
 * FILE: packages/visitor-core/src/links/DiaChiWebsite.ts
 * FILE NÀY LÀM GÌ: Chuẩn hóa/cấu hình địa chỉ website dùng cho liên kết chung theo quy tắc của dự án.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
// CHỨC NĂNG: Chuẩn hóa và kiểm tra origin của website.
// XỬ LÝ:
// - Bản công khai yêu cầu HTTPS.
// - HTTP chỉ được nhận khi nơi gọi cho phép chạy thử.
// - Từ chối localhost vì trên điện thoại, localhost là chính điện thoại.
// - Từ chối domain ví dụ và URL chứa tài khoản, query hoặc đường dẫn con.

// [UC05] siteOrigin — Chuẩn hóa và kiểm tra origin của website.
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
// TẠI SAO (siteOrigin): Liên kết chung cần đúng origin/giao thức để QR không trỏ nhầm môi trường
// hoặc ứng dụng.