/**
 * CHỨC NĂNG: [TRUY-CAP-QR]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra và phân tích liên kết QR; nhận liên kết vào cổng chung và từ chối dữ liệu không hợp lệ.
 *
 * VỊ TRÍ: packages/visitor-core/src/links/PhanTichLienKetQR.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. validPlaceId
 * 2. parseQrTarget
 * 3. parsePlaceQr
 * 4. placeUrl
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Đặt tên kiểu QrPolicy.
export type QrPolicy = {
  // Khai báo allowedOrigins, kiểu readonly string[].
  allowedOrigins: readonly string[]
  
  allowHttp: boolean
}


export type QrTarget =
  | { kind: 'home' }
  | { kind: 'place'; id: string }

// CHỨC NĂNG: Kiểm tra định dạng mã địa điểm trong liên kết.
// XỬ LÝ: Chặn ký tự hoặc độ dài ngoài quy tắc trước khi chuyển sang route/tìm dữ liệu.
// Khai báo validPlaceId(id). Nhận đầu vào qua tham số.
// ==================== [TRUY-CAP-QR] validPlaceId ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function validPlaceId(id: string): boolean {
  
  return id.length <= 80
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
}
// TẠI SAO (validPlaceId): Kiểm tra ID từ bên ngoài giúp tránh dùng ký tự ngoài hợp đồng vào
// đường dẫn hoặc truy vấn.

// CHỨC NĂNG: Kiểm tra payload trước khi điều hướng.
// XỬ LÝ: Kiểm tra raw trước URL() để không bỏ qua đường dẫn /../.

// ==================== [TRUY-CAP-QR] parseQrTarget ====================
export function parseQrTarget(
  raw: string,
  policy: QrPolicy,
): QrTarget {
  // Khai báo value: raw.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
  const value = raw.trim()

  
  if (
    raw.length > 2048
    || value.includes('%')
    || value.includes('\\')
    || Array.from(value).some(
      (character) => character.charCodeAt(0) <= 32,
    )
    || /\/\.{1,2}(?:\/|$)/.test(value)
  ) {
    
    throw new Error('invalidQr')
  }

  // Khai báo url: không có giá trị khởi tạo.
  let url: URL

  // Bắt đầu vùng try.
  try {
    
    url = new URL(value)
  } catch {
    
    throw new Error('invalidQr')
  }

  // CHỨC NĂNG: QR cổng được phép mang đúng dấu nguồn entry=gate ở trang chủ.
  // XỬ LÝ: Query khác và query trên địa điểm vẫn bị từ chối.
  // Rẽ nhánh nếu url.username || url.password || (url.search && !(url.pathname === '/' && url.search === '?entry=gate')) || url.
  if (url.username || url.password || (url.search && !(url.pathname === '/' && url.search === '?entry=gate')) || url.hash) {
    
    throw new Error('invalidQr')
  }

  // Khai báo path: không có giá trị khởi tạo.
  let path: string

  
  if (
    url.protocol === 'hueguide:'
    && url.hostname === 'places'
    && !url.port
  ) {
    
    path = '/places' + url.pathname
  } else {
    
    const allowedProtocol =
      url.protocol === 'https:'
      || (policy.allowHttp && url.protocol === 'http:')

    
    if (
      !allowedProtocol
      || !policy.allowedOrigins.includes(url.origin)
    ) {
      
      throw new Error('invalidQr')
    }

    
    path = url.pathname
  }

  // CHỨC NĂNG: Chấp nhận QR vào chung không có ID.
  // XỬ LÝ: Chỉ root hoặc /places là trang vào chung hợp lệ.
  
  if (
    path === '/'
    || path === '/places'
    || path === '/places/'
  ) {
    
    return { kind: 'home' }
  }

  
  const match =
    /^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path)

  // Rẽ nhánh nếu !match || !validPlaceId(match[1]).
  if (!match || !validPlaceId(match[1])) {
    
    throw new Error('invalidQr')
  }

  // Trả kết quả: tạo object gồm kind, id.
  return {
    // Gán thuộc tính kind: chuỗi 'place'.
    kind: 'place',
    
    id: match[1],
  }
}
// TẠI SAO (parseQrTarget): QR là đầu vào bên ngoài; phải xác định đích được phép trước khi điều
// hướng.

// CHỨC NĂNG: Giữ API cũ cho nơi chỉ nhận QR của một điểm.
// XỬ LÝ: Chỗ cần nhận QR chung phải dùng parseQrTarget.

// ==================== [TRUY-CAP-QR] parsePlaceQr ====================
export function parsePlaceQr(
  raw: string,
  policy: QrPolicy,
): string {
  // Khai báo target: Gọi parseQrTarget(raw, policy).
  const target = parseQrTarget(raw, policy)

  // Rẽ nhánh nếu target.kind !== 'place'.
  if (target.kind !== 'place') {
    
    throw new Error('invalidQr')
  }

  
  return target.id
}
// TẠI SAO (parsePlaceQr): Dùng parser chung tránh nơi quét QR và nơi mở deep link có quy tắc
// khác nhau.

// CHỨC NĂNG: Tạo URL để mã hóa thành QR.
// XỬ LÝ: ID phải đúng định dạng trước khi ghép URL.
// Khai báo placeUrl(origin, id). Nhận đầu vào qua tham số.
// ==================== [TRUY-CAP-QR] placeUrl ====================
export function placeUrl(origin: string, id: string): string {
  // Rẽ nhánh nếu !validPlaceId(id). | Ném new Error('invalidQr').
  if (!validPlaceId(id)) throw new Error('invalidQr')

  
  return new URL('/places/' + id, origin).toString()
}
// TẠI SAO (placeUrl): Ghép URL có kiểm tra giúp ID hoặc origin không làm hỏng địa chỉ chi tiết.