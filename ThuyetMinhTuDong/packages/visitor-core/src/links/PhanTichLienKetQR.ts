/**
 * FILE: packages/visitor-core/src/links/PhanTichLienKetQR.ts
 * FILE NÀY LÀM GÌ: Kiểm tra và phân tích liên kết QR; nhận liên kết vào cổng chung và từ chối dữ liệu không hợp lệ.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
export type QrPolicy = {
  allowedOrigins: readonly string[]
  
  allowHttp: boolean
}


export type QrTarget =
  | { kind: 'home' }
  | { kind: 'place'; id: string }

// CHỨC NĂNG: Kiểm tra định dạng mã địa điểm trong liên kết.
// XỬ LÝ: Chặn ký tự hoặc độ dài ngoài quy tắc trước khi chuyển sang route/tìm dữ liệu.
// [UC05] validPlaceId — Kiểm tra định dạng mã địa điểm trong liên kết.
export function validPlaceId(id: string): boolean {
  
  return id.length <= 80
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
}
// TẠI SAO (validPlaceId): Kiểm tra ID từ bên ngoài giúp tránh dùng ký tự ngoài hợp đồng vào
// đường dẫn hoặc truy vấn.

// CHỨC NĂNG: Kiểm tra payload trước khi điều hướng.
// XỬ LÝ: Kiểm tra raw trước URL() để không bỏ qua đường dẫn /../.

// [UC05] parseQrTarget — Phân tích và kiểm tra liên kết QR để xác định đích truy cập hợp lệ.
export function parseQrTarget(
  raw: string,
  policy: QrPolicy,
): QrTarget {
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

  let url: URL

  try {
    
    url = new URL(value)
  } catch {
    
    throw new Error('invalidQr')
  }

  // CHỨC NĂNG: QR cổng được phép mang đúng dấu nguồn entry=gate ở trang chủ.
  // XỬ LÝ: Query khác và query trên địa điểm vẫn bị từ chối.
  if (url.username || url.password || (url.search && !(url.pathname === '/' && url.search === '?entry=gate')) || url.hash) {
    
    throw new Error('invalidQr')
  }

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

  if (!match || !validPlaceId(match[1])) {
    
    throw new Error('invalidQr')
  }

  // Trả kết quả: tạo object gồm kind, id.
  return {
    kind: 'place',
    
    id: match[1],
  }
}
// TẠI SAO (parseQrTarget): QR là đầu vào bên ngoài; phải xác định đích được phép trước khi điều
// hướng.

// CHỨC NĂNG: Giữ API cũ cho nơi chỉ nhận QR của một điểm.
// XỬ LÝ: Chỗ cần nhận QR chung phải dùng parseQrTarget.

// [UC05] parsePlaceQr — Đọc mã di tích từ liên kết QR hợp lệ theo chính sách liên kết.
export function parsePlaceQr(
  raw: string,
  policy: QrPolicy,
): string {
  const target = parseQrTarget(raw, policy)

  if (target.kind !== 'place') {
    
    throw new Error('invalidQr')
  }

  
  return target.id
}
// TẠI SAO (parsePlaceQr): Dùng parser chung tránh nơi quét QR và nơi mở deep link có quy tắc
// khác nhau.

// CHỨC NĂNG: Tạo URL để mã hóa thành QR.
// XỬ LÝ: ID phải đúng định dạng trước khi ghép URL.
// [UC05] placeUrl — Tạo URL để mã hóa thành QR.
export function placeUrl(origin: string, id: string): string {
  if (!validPlaceId(id)) throw new Error('invalidQr')

  
  return new URL('/places/' + id, origin).toString()
}
// TẠI SAO (placeUrl): Ghép URL có kiểm tra giúp ID hoặc origin không làm hỏng địa chỉ chi tiết.