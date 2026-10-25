/**
 * FILE NÀY LÀM GÌ:
 * Phân biệt QR vào chung và QR một địa điểm theo UC05 v1.3.
 * Scanner mobile và trang QR web sử dụng.
 * Không tự mở URL ngoài hệ thống.
 */

export type QrPolicy = {
  allowedOrigins: readonly string[]
  allowHttp: boolean
}

export type QrTarget =
  | { kind: 'home' }
  | { kind: 'place'; id: string }

export function validPlaceId(id: string): boolean {
  return id.length <= 80
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
}

// CHỨC NĂNG: Kiểm tra payload trước khi điều hướng.
// XỬ LÝ: Kiểm tra raw trước URL() để không bỏ qua đường dẫn /../.
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

  return {
    kind: 'place',
    id: match[1],
  }
}

// CHỨC NĂNG: Giữ API cũ cho nơi chỉ nhận QR của một điểm.
// XỬ LÝ: Chỗ cần nhận QR chung phải dùng parseQrTarget.
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

// CHỨC NĂNG: Tạo URL để mã hóa thành QR.
// XỬ LÝ: ID phải đúng định dạng trước khi ghép URL.
export function placeUrl(origin: string, id: string): string {
  if (!validPlaceId(id)) throw new Error('invalidQr')

  return new URL('/places/' + id, origin).toString()
}